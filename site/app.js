import { commands } from './commands.js';
import { createState, applyKey } from './simulator.js';
import { challenges } from './challenges.js';

const find = (selector) => document.querySelector(selector);
const search = find('#search');
const category = find('#category');
const level = find('#level');
const list = find('#command-list');
const empty = find('#empty-state');
const summary = find('#summary');

for (const value of [...new Set(commands.map((command) => command.category))]) {
  category.insertAdjacentHTML('beforeend', '<option value="' + value + '">' + value + '</option>');
}

const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function render() {
  const term = normalize(search.value);
  const filtered = commands.filter((command) => {
    const text = normalize([command.keys, command.title, command.description, command.category, command.mode].join(' '));
    return (!term || text.includes(term)) && (!category.value || command.category === category.value) && (!level.value || command.level === level.value);
  });

  list.innerHTML = filtered.map((command) =>
    '<article class="command-card"><span class="key">' + command.keys + '</span><h3>' + command.title + '</h3><p>' + command.description + '</p><small>' + command.category + ' · ' + command.mode + ' · ' + command.level + '</small></article>'
  ).join('');
  summary.textContent = filtered.length + ' de ' + commands.length + ' comandos exibidos.';
  empty.hidden = filtered.length !== 0;
}

[search, category, level].forEach((element) => element.addEventListener('input', render));
find('#clear-filters').addEventListener('click', () => { search.value = ''; category.value = ''; level.value = ''; render(); search.focus(); });

const toggle = find('#theme-toggle');
function setTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  toggle.textContent = dark ? 'Tema claro' : 'Tema escuro';
  toggle.setAttribute('aria-pressed', String(dark));
  localStorage.setItem('vim-theme', dark ? 'dark' : 'light');
}
setTheme(localStorage.getItem('vim-theme') === 'dark');
toggle.addEventListener('click', () => setTheme(document.documentElement.dataset.theme !== 'dark'));
render();
let simulator = createState();
let active = false;
const editor = find('#simulator-editor');
const challengeSelect = find('#challenge-select');
for (const challenge of challenges) challengeSelect.insertAdjacentHTML('beforeend', '<option value="' + challenge.id + '">' + challenge.title + '</option>');
function drawSimulator() {
  editor.textContent = simulator.lines.map((line, index) => (index + 1) + '  ' + line).join('\n');
  find('#simulator-mode').textContent = simulator.mode.toUpperCase();
  find('#simulator-feedback').textContent = simulator.feedback;
  const challenge = challenges.find((item) => item.id === challengeSelect.value);
  find('#challenge-status').textContent = challenge && challenge.isComplete(simulator) ? 'Desafio concluído.' : '';
}
challengeSelect.addEventListener('input', () => { const challenge = challenges.find((item) => item.id === challengeSelect.value); if (challenge) { simulator = createState(challenge.initialLines); simulator.feedback = challenge.instruction; drawSimulator(); } });
find('#activate-simulator').addEventListener('click', () => { active = true; editor.focus(); simulator.feedback = 'Simulador ativado.'; drawSimulator(); });
find('#reset-simulator').addEventListener('click', () => { simulator = createState(); drawSimulator(); });
editor.addEventListener('keydown', (event) => { if (!active) return; if (event.ctrlKey && event.key !== 'r') return; event.preventDefault(); applyKey(simulator, event.ctrlKey ? 'Ctrl-r' : event.key); drawSimulator(); });
drawSimulator();
