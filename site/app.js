(function () {
const { commands } = globalThis.VimCommands;
const { createState, applyKey, keyForSimulator } = globalThis.VimSimulator;
const { challenges } = globalThis.VimChallenges;

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

let simulator = createState();
let active = false;
const editor = find('#simulator-editor');
const challengeSelect = find('#challenge-select');
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
  const challenge = challenges.find((item) => item.id === challengeSelect.value);
  const challengeComplete = Boolean(challenge && challenge.isComplete(simulator));
  const feedback = challengeComplete
    ? `Desafio concluído. ${simulator.feedback}`
    : simulator.feedback;
  renderEditor();
  editor.setAttribute('aria-disabled', String(!active));
  find('#simulator-mode').textContent = simulator.mode.toUpperCase();
  find('#simulator-command').textContent = simulator.commandBuffer || '—';
  find('#simulator-history').textContent = simulator.keyHistory.length ? simulator.keyHistory.join(' ') : '—';
  find('#simulator-feedback').textContent = feedback;
  if (announce) statusAnnouncer.textContent = feedback;
  find('#restart-challenge').disabled = !challenge;
  find('#challenge-instruction').textContent = challenge ? challenge.instruction : 'Escolha um desafio para carregar um texto de prática.';
  find('#challenge-status').textContent = challengeComplete ? 'Desafio concluído.' : '';
}

function loadChallenge() {
  const challenge = challenges.find((item) => item.id === challengeSelect.value);
  if (!challenge) return;
  simulator = createState(challenge.initialLines);
  simulator.feedback = challenge.instruction;
  active = false;
  drawSimulator();
}

challengeSelect.addEventListener('change', loadChallenge);
find('#restart-challenge').addEventListener('click', loadChallenge);
find('#activate-simulator').addEventListener('click', () => {
  active = true;
  simulator.feedback = 'Simulador ativado. Use o teclado nesta área.';
  editor.focus();
  drawSimulator();
});
find('#reset-simulator').addEventListener('click', () => {
  simulator = createState(); challengeSelect.value = ''; active = false; drawSimulator();
});
editor.addEventListener('keydown', (event) => {
  if (!active) return;
  const key = keyForSimulator(event, simulator);
  if (!key) return;
  event.preventDefault();
  applyKey(simulator, key);
  drawSimulator();
});

renderCatalog(false);
drawSimulator(false);
})();
