export const initialLines = ['Linha para praticar.', 'Apague esta linha.', 'Bom estudo!'];

export function createState(lines = initialLines) {
  return { mode: 'normal', lines: [...lines], cursor: { line: 0, column: 0 }, register: '', commandBuffer: '', searchTerm: '', undoStack: [], redoStack: [], keyHistory: [], lastChange: null, feedback: 'Simulador pronto.' };
}

function clamp(state) {
  state.cursor.line = Math.max(0, Math.min(state.cursor.line, state.lines.length - 1));
  state.cursor.column = Math.max(0, Math.min(state.cursor.column, state.lines[state.cursor.line].length));
}

function snapshot(state) {
  state.undoStack.push({ lines: [...state.lines], cursor: { ...state.cursor }, register: state.register });
  state.redoStack = [];
}

export function applyKey(state, key) {
  state.keyHistory = [...state.keyHistory.slice(-11), key];
  if (state.mode === 'insert') {
    if (key === 'Escape') { state.mode = 'normal'; state.feedback = 'Modo normal.'; return state; }
    snapshot(state);
    const line = state.lines[state.cursor.line];
    state.lines[state.cursor.line] = line.slice(0, state.cursor.column) + key + line.slice(state.cursor.column);
    state.cursor.column += key.length; state.feedback = 'Texto inserido.'; return state;
  }
  if (key === 'Escape') { state.commandBuffer = ''; state.feedback = 'Operação cancelada.'; return state; }
  if (key === 'Ctrl-r' && state.redoStack.length) {
    const next = state.redoStack.pop();
    state.undoStack.push({ lines: [...state.lines], cursor: { ...state.cursor }, register: state.register });
    state.lines = [...next.lines];
    state.cursor = { ...next.cursor };
    state.register = next.register;
    state.feedback = 'Alteração refeita.';
    return state;
  }
  if (state.commandBuffer.startsWith('/')) {
    if (key === 'Enter') { state.searchTerm = state.commandBuffer.slice(1); state.commandBuffer = ''; state.feedback = 'Busca por ' + state.searchTerm + '.'; return state; }
    state.commandBuffer += key;
    return state;
  }
  if (state.commandBuffer.startsWith(':')) {
    if (key !== 'Enter') { state.commandBuffer += key; return state; }
    const ex = state.commandBuffer;
    state.commandBuffer = '';
    if (ex === ':w') { state.feedback = 'Arquivo salvo (simulação).'; return state; }
    if (ex === ':q' || ex === ':q!') { state.feedback = 'No Vim real, este comando sairia do editor.'; return state; }
    state.feedback = 'Comando Ex ainda não implementado.';
    return state;
  }
  state.commandBuffer += key;
  const command = state.commandBuffer;
  if (['g', 'd', 'y', ':', '/'].includes(command)) return state;
  const line = () => state.lines[state.cursor.line];
  const done = (message) => { state.commandBuffer = ''; state.feedback = message; clamp(state); return state; };
  if (command === 'i') { state.mode = 'insert'; return done('Modo de inserção.'); }
  if (command === 'a') { state.cursor.column = Math.min(state.cursor.column + 1, line().length); state.mode = 'insert'; return done('Modo de inserção.'); }
  if (command === 'o') { snapshot(state); state.lines.splice(state.cursor.line + 1, 0, ''); state.cursor.line++; state.cursor.column = 0; state.mode = 'insert'; return done('Nova linha para inserir.'); }
  if (command === 'h') { state.cursor.column--; return done('Cursor à esquerda.'); }
  if (command === 'l') { state.cursor.column++; return done('Cursor à direita.'); }
  if (command === 'j') { state.cursor.line++; return done('Cursor abaixo.'); }
  if (command === 'k') { state.cursor.line--; return done('Cursor acima.'); }
  if (command === '0') { state.cursor.column = 0; return done('Início da linha.'); }
  if (command === '$') { state.cursor.column = line().length; return done('Fim da linha.'); }
  if (command === 'w') { const next = line().slice(state.cursor.column + 1).search(/\w/); state.cursor.column = next < 0 ? line().length : state.cursor.column + 1 + next; return done('Próxima palavra.'); }
  if (command === 'b') { state.cursor.column = line().slice(0, state.cursor.column).search(/\w+\W*$/); if (state.cursor.column < 0) state.cursor.column = 0; return done('Palavra anterior.'); }
  if (command === 'gg') { state.cursor.line = 0; state.cursor.column = 0; return done('Início do arquivo.'); }
  if (command === 'G') { state.cursor.line = state.lines.length - 1; state.cursor.column = 0; return done('Fim do arquivo.'); }
  if (command === '.' && state.lastChange) {
    const change = state.lastChange;
    if (change === 'x') { snapshot(state); state.lines[state.cursor.line] = line().slice(0, state.cursor.column) + line().slice(state.cursor.column + 1); return done('Última alteração repetida.'); }
    if (change === 'dd') { snapshot(state); state.register = line(); state.lines.splice(state.cursor.line, 1); if (!state.lines.length) state.lines.push(''); return done('Última alteração repetida.'); }
    if (change === 'dw') { snapshot(state); const end = line().slice(state.cursor.column).search(/\s|$/); const count = end < 0 ? line().length : end + 1; state.register = line().slice(state.cursor.column, state.cursor.column + count); state.lines[state.cursor.line] = line().slice(0, state.cursor.column) + line().slice(state.cursor.column + count); return done('Última alteração repetida.'); }
    if (change === 'p') { snapshot(state); state.lines.splice(state.cursor.line + 1, 0, state.register); state.cursor.line++; return done('Última alteração repetida.'); }
  }
  if ((command === 'n' || command === 'N') && state.searchTerm) { const start = state.cursor.line; const step = command === 'n' ? 1 : -1; for (let i = 1; i <= state.lines.length; i++) { const index = (start + step * i + state.lines.length) % state.lines.length; const column = state.lines[index].indexOf(state.searchTerm); if (column >= 0) { state.cursor.line = index; state.cursor.column = column; break; } } return done('Ocorrência encontrada.'); }
  if (command === 'x') { snapshot(state); state.lines[state.cursor.line] = line().slice(0, state.cursor.column) + line().slice(state.cursor.column + 1); state.lastChange = 'x'; return done('Caractere removido.'); }
  if (command === 'dd') { snapshot(state); state.register = line(); state.lines.splice(state.cursor.line, 1); if (!state.lines.length) state.lines.push(''); state.lastChange = 'dd'; return done('Linha removida.'); }
  if (command === 'dw') { snapshot(state); const end = line().slice(state.cursor.column).search(/\s|$/); const count = end < 0 ? line().length : end + 1; state.register = line().slice(state.cursor.column, state.cursor.column + count); state.lines[state.cursor.line] = line().slice(0, state.cursor.column) + line().slice(state.cursor.column + count); state.lastChange = 'dw'; return done('Palavra removida.'); }
  if (command === 'yy') { state.register = line(); return done('Linha copiada.'); }
  if (command === 'p') { snapshot(state); state.lines.splice(state.cursor.line + 1, 0, state.register); state.cursor.line++; state.lastChange = 'p'; return done('Conteúdo colado.'); }
  if (command === 'u' && state.undoStack.length) { const previous = state.undoStack.pop(); state.redoStack.push({ lines: [...state.lines], cursor: { ...state.cursor }, register: state.register }); Object.assign(state, previous); return done('Alteração desfeita.'); }
  if (command === ':w') return done('Arquivo salvo (simulação).');
  if (command === ':q' || command === ':q!') return done('No Vim real, este comando sairia do editor.');
  if (command.length > 2) return done('Comando ainda não implementado.');
  return state;
}
