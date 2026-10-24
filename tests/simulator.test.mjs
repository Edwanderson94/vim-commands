import assert from 'node:assert/strict';
import { applyKey, createState } from '../site/simulator.js';
import { challenges } from '../site/challenges.js';

const press = (state, keys) => { keys.forEach((key) => applyKey(state, key)); return state; };

let state = press(createState(['Linha.']), ['i', 'O', 'k', 'Escape']);
assert.equal(state.lines[0], 'OkLinha.');
press(state, ['u']);
assert.deepEqual(state.lines, ['Linha.'], 'u desfaz toda a inserção');
press(state, ['Ctrl-r']);
assert.deepEqual(state.lines, ['OkLinha.'], 'Ctrl-r refaz a inserção');

state = press(createState(['abc']), ['i', '!', 'Escape', '0', '.']);
assert.equal(state.lines[0], '!!abc', '. repete a inserção');
state = press(createState(['primeira', 'segunda']), ['G', 'd', 'd']);
assert.deepEqual(state.lines, ['primeira']);
state = press(createState(['copie']), ['y', 'y', 'p']);
assert.deepEqual(state.lines, ['copie', 'copie']);
state = press(createState(['Vim aqui', 'Vim ali']), ['/', 'V', 'i', 'm', 'Enter', 'n']);
assert.equal(state.cursor.line, 1);
state = press(createState(['texto']), [':', 'w', 'Enter']);
assert.match(state.feedback, /salvo/);
assert.equal(challenges.length, 5);

console.log('Simulator tests passed');
