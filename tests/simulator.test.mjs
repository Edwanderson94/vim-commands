import assert from 'node:assert/strict';
import simulator from '../site/simulator.js';
import challengeData from '../site/challenges.js';
import commandData from '../site/commands.js';

const { applyKey, createState, keyForSimulator } = simulator;
const { challenges } = challengeData;
const { commands } = commandData;

const press = (state, keys) => { keys.forEach((key) => applyKey(state, key)); return state; };

const normalState = createState();
assert.equal(keyForSimulator({ key: 'Tab' }, normalState), null, 'Tab deve continuar navegando o foco');
assert.equal(keyForSimulator({ key: 'ArrowDown' }, normalState), null, 'setas não suportadas não devem ser capturadas');
assert.equal(keyForSimulator({ key: 'r', ctrlKey: true }, normalState), 'Ctrl-r');
assert.equal(keyForSimulator({ key: 'Enter' }, normalState), null, 'Enter sem comando em formação deve continuar livre');
normalState.commandBuffer = '/Vim';
assert.equal(keyForSimulator({ key: 'Enter' }, normalState), 'Enter');

let state = press(createState(['Linha.']), ['i', 'O', 'k', 'Escape']);
assert.equal(state.lines[0], 'OkLinha.');
press(state, ['u']);
assert.deepEqual(state.lines, ['Linha.'], 'u desfaz toda a inserção');
press(state, ['Ctrl-r']);
assert.deepEqual(state.lines, ['OkLinha.'], 'Ctrl-r refaz a inserção');

state = press(createState(['abc']), ['i', '!', 'Escape', '0', '.']);
assert.equal(state.lines[0], '!!abc', '. repete a inserção');
state = press(createState(['base']), ['o', 'n', 'o', 'v', 'a', 'Escape', '.']);
assert.deepEqual(state.lines, ['base', 'nova', 'nova'], '. repete a abertura de linha com o texto inserido');
press(state, ['u']);
assert.deepEqual(state.lines, ['base', 'nova'], 'u desfaz a repetição de o como uma alteração');
state = press(createState(['abc']), ['a', '!', 'Escape']);
assert.equal(state.lines[0], 'a!bc', 'a começa a inserção após o cursor');
state = press(createState(['primeira', 'segunda']), ['G', 'd', 'd']);
assert.deepEqual(state.lines, ['primeira']);
state = press(createState(['linha']), ['d', 'z']);
assert.equal(state.commandBuffer, '', 'comando inválido deve limpar o buffer');
state = press(createState(['copie']), ['y', 'y', 'p']);
assert.deepEqual(state.lines, ['copie', 'copie']);
state = press(createState(['Vim aqui', 'Vim ali']), ['/', 'V', 'i', 'm', 'Enter']);
assert.equal(state.cursor.line, 1, 'busca inicial avança a partir do cursor');
press(state, ['n']);
assert.equal(state.cursor.line, 0, 'n avança e percorre o arquivo circularmente');
state = press(createState(['Vim']), ['/', 'V', 'i', 'm', 'Escape']);
assert.equal(state.commandBuffer, '', 'Esc cancela a busca em formação');
state = press(createState(['Vim']), ['/', 'V', 'i', 'm', 'Enter']);
assert.deepEqual(state.cursor, { line: 0, column: 0 }, 'busca retorna ao começo da linha ao chegar ao fim');
state = press(createState(['apagar agora', 'segunda']), ['d', 'w']);
assert.equal(state.lines[0], 'agora');
state = press(createState(['ab']), ['x']);
assert.equal(state.lines[0], 'b');
press(state, ['u']);
assert.equal(state.lines[0], 'ab');
state = press(createState(['abc']), ['x', '.']);
assert.equal(state.lines[0], 'c', '. repete x');
state = press(createState(['ab', 'cd']), ['j', 'k', 'l', 'h', '$']);
assert.deepEqual(state.cursor, { line: 0, column: 2 });
state = press(createState(['a', 'b', 'c']), ['G', 'k', 'gg', 'j']);
assert.deepEqual(state.cursor, { line: 1, column: 0 });
state = press(createState(['ação final', 'próxima palavra']), ['w', 'w']);
assert.deepEqual(state.cursor, { line: 1, column: 0 }, 'w atravessa linhas e reconhece letras acentuadas');
state = press(createState(['ação final', 'próxima palavra']), ['G', '$', 'b']);
assert.deepEqual(state.cursor, { line: 1, column: 8 }, 'b volta ao início da palavra anterior');
state = press(createState(['um', 'dois', 'três']), ['d', 'd', '.']);
assert.deepEqual(state.lines, ['três']);
state = press(createState(['apagar já', 'palavra alvo']), ['d', 'w', 'j', '.']);
assert.deepEqual(state.lines, ['já', 'alvo']);
state = press(createState(['um', 'dois']), ['y', 'y', 'p', '.']);
assert.deepEqual(state.lines, ['um', 'um', 'um', 'dois']);
state = press(createState(['Vim', 'Vim']), ['/', 'V', 'i', 'm', 'Enter', 'N']);
assert.equal(state.cursor.line, 0, 'N deve procurar no sentido inverso');
state = press(createState(['primeiro Vim', 'segundo Vim']), ['/', 'V', 'i', 'm', 'Enter']);
assert.deepEqual(state.cursor, { line: 0, column: 9 }, 'busca inicial deve posicionar no próximo resultado');
state = press(createState(['texto']), [':', 'w', 'Enter']);
assert.match(state.feedback, /salvo/);
state = press(createState(['texto']), [':', 'q', 'Enter']);
assert.match(state.feedback, /sairia/);
state = press(createState(['texto']), [':', 'q', '!', 'Enter']);
assert.match(state.feedback, /sairia/);

const challengeSteps = {
  'insert-text': ['i', 'x', 'Escape'],
  'last-line': ['G'],
  'delete-line': ['j', 'd', 'd'],
  'copy-line': ['y', 'y', 'p'],
  'search-text': ['/', 'V', 'i', 'm', 'Enter']
};
for (const challenge of challenges) {
  state = press(createState(challenge.initialLines), challengeSteps[challenge.id]);
  assert.equal(challenge.isComplete(state), true, `${challenge.id} deve ser concluível com as instruções`);
}
state = press(createState(challenges.find(({ id }) => id === 'delete-line').initialLines), ['d', 'd']);
assert.equal(challenges.find(({ id }) => id === 'delete-line').isComplete(state), false,
  'apagar a linha errada não deve concluir o desafio de remover a segunda linha');
assert.equal(challenges.length, 5);
assert.equal(commands.length, 30);
assert.deepEqual(createState().lines, ['Linha para praticar.', 'Apague esta linha.', 'Bom estudo!'], 'restaurar texto recria o estado inicial');

console.log('Simulator tests passed');
