(function () {
const { commands } = globalThis.VimCommands;
const { createState, applyKey, keyForSimulator } = globalThis.VimSimulator;
const { challenges } = globalThis.VimChallenges;
const terminal = globalThis.VimTerminal;

const find = (selector) => document.querySelector(selector);
const search = find('#search');
const category = find('#category');
const level = find('#level');
const list = find('#command-list');
const empty = find('#empty-state');
const summary = find('#summary');
const statusAnnouncer = find('#status-announcer');
const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

for (const value of [...new Set(commands.map((command) => command.category))]) {
  category.append(element('option', value));
  category.lastElementChild.value = value;
}

function renderCatalog(announce = true) {
  const term = normalize(search.value);
  const filtered = commands.filter((command) => {
    const text = normalize([command.keys, command.title, command.description, command.category, command.mode].join(' '));
    return (!term || text.includes(term)) && (!category.value || command.category === category.value) && (!level.value || command.level === level.value);
  });
  list.replaceChildren(...filtered.map((command) => {
    const card = element('article', undefined, 'command-card');
    card.append(element('span', command.keys, 'key'), element('h3', command.title), element('p', command.description));
    card.append(element('small', `${command.category} · modo ${command.mode} · ${command.level} · ${command.lesson}`));
    return card;
  }));
  summary.textContent = `${filtered.length} de ${commands.length} comandos exibidos.`;
  if (announce) statusAnnouncer.textContent = summary.textContent;
  empty.hidden = filtered.length !== 0;
}

[search, category, level].forEach((control) => control.addEventListener('input', renderCatalog));
find('#clear-filters').addEventListener('click', () => {
  search.value = ''; category.value = ''; level.value = ''; renderCatalog(); search.focus();
});

const toggle = find('#theme-toggle');
function setTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  toggle.textContent = dark ? 'Tema claro' : 'Tema escuro';
  toggle.setAttribute('aria-pressed', String(dark));
  try { localStorage.setItem('vim-theme', dark ? 'dark' : 'light'); } catch { /* O tema continua funcional sem armazenamento local. */ }
}
let savedTheme = 'light';
try { savedTheme = localStorage.getItem('vim-theme') ?? 'light'; } catch { /* Abrir por file:// pode limitar o armazenamento. */ }
setTheme(savedTheme === 'dark');
toggle.addEventListener('click', () => setTheme(document.documentElement.dataset.theme !== 'dark'));

let simulator = createState(['']);
let active = false;
let currentFile = null;
let savedLines = null;
let activeChallenge = false;
const editor = find('#simulator-editor');
const workspace = find('#vim-workspace');
const terminalView = find('#terminal-view');
const challengePicker = find('#challenge-picker');
const challengeSelect = find('#challenge-select');
const challengeInstruction = find('#challenge-instruction');
const challengeStatus = find('#challenge-status');
const terminalInput = find('#terminal-input');
const terminalOutput = find('#terminal-output');
const terminalPrompt = find('#terminal-prompt');
find('.terminal-screen').addEventListener('click', () => terminalInput.focus());

function writeTerminal(command, output) {
  const entry = element('p', undefined, 'terminal-entry');
  entry.append(element('span', `${terminalPrompt.textContent} ${command}`, 'terminal-command'));
  if (output) entry.append(element('span', output, 'terminal-result'));
  terminalOutput.append(entry);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
  if (output) statusAnnouncer.textContent = output;
}

function runTerminalCommand(command) {
  const result = terminal.execute(command);
  writeTerminal(command, result.output);
  terminalInput.replaceChildren();
  terminalPrompt.textContent = terminal.prompt();
  if (result.action?.type === 'vim') {
    currentFile = result.action.path;
    savedLines = [...result.action.lines];
    simulator = createState(result.action.lines);
    activeChallenge = challengeSelect.value !== '' && currentFile === `${terminal.root}/teste.txt`;
    active = true;
    terminalView.hidden = true;
    challengePicker.hidden = true;
    workspace.hidden = false;
    drawSimulator(false);
    simulator.feedback = `Arquivo virtual ${currentFile}. Use i para inserir e :wq para salvar e voltar.`;
    editor.focus({ preventScroll: true });
    drawSimulator();
  } else terminalInput.focus();
}

terminalInput.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  runTerminalCommand(terminalInput.textContent.trim());
});

function closeVim(saveChanges) {
  if (saveChanges && currentFile) {
    terminal.save(currentFile, simulator.lines);
    savedLines = [...simulator.lines];
  } else if (currentFile && savedLines) {
    simulator = createState(savedLines);
  }
  currentFile = null;
  savedLines = null;
  workspace.hidden = true;
  terminalView.hidden = false;
  challengePicker.hidden = false;
  active = false;
  terminalInput.focus();
  drawSimulator(false);
  statusAnnouncer.textContent = saveChanges ? 'Arquivo salvo. Voltou ao terminal simulado.' : 'Saiu do Vim sem salvar. Voltou ao terminal simulado.';
}
for (const challenge of challenges) {
  const option = element('option', challenge.title);
  option.value = challenge.id;
  challengeSelect.append(option);
}

function renderEditor() {
  const fragment = document.createDocumentFragment();
  simulator.lines.forEach((line, lineIndex) => {
    const row = element('div', undefined, `editor-line${lineIndex === simulator.cursor.line ? ' is-current' : ''}`);
    row.append(element('span', String(lineIndex + 1), 'line-number'));
    const content = element('span', undefined, 'line-content');
    for (let index = 0; index <= line.length; index += 1) {
      if (lineIndex === simulator.cursor.line && index === simulator.cursor.column) content.append(element('span', index < line.length ? line[index] : ' ', 'cursor'));
      else if (index < line.length) content.append(document.createTextNode(line[index]));
    }
    row.append(content); fragment.append(row);
  });
  editor.replaceChildren(fragment);
}

function drawSimulator(announce = true) {
  const challenge = activeChallenge ? challenges.find((item) => item.id === challengeSelect.value) : null;
  const challengeComplete = Boolean(challenge && challenge.isComplete(simulator));
  const feedback = challengeComplete
    ? `Desafio concluído. ${simulator.feedback}`
    : simulator.feedback;
  renderEditor();
  editor.setAttribute('aria-disabled', String(!active));
  find('#simulator-mode').textContent = simulator.mode.toUpperCase();
  find('#vim-filename').textContent = currentFile ? currentFile.split('/').at(-1) : 'teste.txt';
  if (announce) statusAnnouncer.textContent = feedback;
  challengeInstruction.textContent = challengeSelect.value
    ? challenges.find((item) => item.id === challengeSelect.value)?.instruction || ''
    : 'Escolha um desafio ou digite vim teste.txt para praticar livremente.';
  challengeStatus.textContent = challengeComplete ? 'Desafio concluído.' : '';
  challengeStatus.hidden = !challengeComplete;
}

function chooseChallenge() {
  const challenge = challenges.find((item) => item.id === challengeSelect.value);
  activeChallenge = false;
  active = false;
  challengeStatus.textContent = '';
  if (challenge) {
    terminal.save(`${terminal.root}/teste.txt`, challenge.initialLines);
    simulator = createState(challenge.initialLines);
    simulator.feedback = challenge.instruction;
    statusAnnouncer.textContent = `Desafio carregado. Digite vim teste.txt para começar. ${challenge.instruction}`;
  } else {
    simulator = createState(['']);
    statusAnnouncer.textContent = 'Prática livre. O arquivo atual foi mantido.';
  }
  drawSimulator(false);
  terminalInput.focus();
}

challengeSelect.addEventListener('change', chooseChallenge);
editor.addEventListener('keydown', (event) => {
  if (!active) return;
  const key = keyForSimulator(event, simulator);
  if (!key) {
    if (event.key === 'Backspace') event.preventDefault();
    return;
  }
  event.preventDefault();
  const exCommand = key === 'Enter' && simulator.commandBuffer.startsWith(':') ? simulator.commandBuffer : '';
  applyKey(simulator, key);
  if (currentFile && exCommand === ':w') {
    terminal.save(currentFile, simulator.lines);
    savedLines = [...simulator.lines];
    simulator.feedback = 'Arquivo virtual salvo (:w).';
  }
  if (currentFile && exCommand === ':wq') { terminal.save(currentFile, simulator.lines); closeVim(true); return; }
  if (currentFile && exCommand === ':q!') { closeVim(false); return; }
  if (currentFile && exCommand === ':q') {
    if (JSON.stringify(simulator.lines) === JSON.stringify(savedLines)) { closeVim(false); return; }
    simulator.feedback = 'Há alterações não salvas. Use :wq para salvar ou :q! para descartar.';
  }
  drawSimulator();
});

renderCatalog(false);
drawSimulator(false);
})();
