export const initialLines = ['Linha para praticar.', 'Apague esta linha.', 'Bom estudo!'];

export function createState(lines = initialLines) {
  return {
    mode: 'normal', lines: [...lines], cursor: { line: 0, column: 0 }, register: '',
    commandBuffer: '', searchTerm: '', undoStack: [], redoStack: [], keyHistory: [],
    lastChange: null, insertText: '', feedback: 'Ative o simulador para começar a praticar.'
  };
}

function clamp(state) {
  state.cursor.line = Math.max(0, Math.min(state.cursor.line, state.lines.length - 1));
  state.cursor.column = Math.max(0, Math.min(state.cursor.column, state.lines[state.cursor.line].length));
}

function save(state) {
  state.undoStack.push({ lines: [...state.lines], cursor: { ...state.cursor }, register: state.register });
  state.redoStack = [];
}

function finish(state, feedback) {
  state.commandBuffer = '';
  state.feedback = feedback;
  clamp(state);
  return state;
}

function deleteWord(line, column) {
  const rest = line.slice(column);
  const match = rest.match(/^\w+\s*/);
  const count = match ? match[0].length : 0;
  return { removed: rest.slice(0, count), line: line.slice(0, column) + rest.slice(count) };
}

function startInsert(state) {
  save(state);
  state.mode = 'insert';
  state.insertText = '';
}

function repeatChange(state) {
  const change = state.lastChange;
  if (!change) return finish(state, 'Ainda não há alteração para repetir.');
  const line = state.lines[state.cursor.line];
  save(state);
  if (change.type === 'insert') {
    const parts = change.text.split('\n');
    const before = line.slice(0, state.cursor.column);
    const after = line.slice(state.cursor.column);
    state.lines[state.cursor.line] = before + parts[0] + (parts.length === 1 ? after : '');
    if (parts.length > 1) {
      state.lines.splice(state.cursor.line + 1, 0, ...parts.slice(1));
      state.cursor.line += parts.length - 1;
      state.lines[state.cursor.line] += after;
      state.cursor.column = parts.at(-1).length;
    } else state.cursor.column += parts[0].length;
  } else if (change.type === 'x') {
    state.lines[state.cursor.line] = line.slice(0, state.cursor.column) + line.slice(state.cursor.column + 1);
  } else if (change.type === 'dd') {
    state.register = line;
    state.lines.splice(state.cursor.line, 1);
    if (!state.lines.length) state.lines.push('');
  } else if (change.type === 'dw') {
    const result = deleteWord(line, state.cursor.column);
    state.register = result.removed;
    state.lines[state.cursor.line] = result.line;
  } else if (change.type === 'p') {
    state.lines.splice(state.cursor.line + 1, 0, state.register);
    state.cursor.line += 1;
  }
  return finish(state, 'Última alteração repetida.');
}

export function applyKey(state, key) {
  state.keyHistory = [...state.keyHistory.slice(-11), key];

  if (state.mode === 'insert') {
    if (key === 'Escape') {
      state.mode = 'normal';
      if (state.insertText) state.lastChange = { type: 'insert', text: state.insertText };
      state.insertText = '';
      return finish(state, 'Modo normal.');
    }
    if (key === 'Enter') {
      const line = state.lines[state.cursor.line];
      state.lines.splice(state.cursor.line + 1, 0, line.slice(state.cursor.column));
      state.lines[state.cursor.line] = line.slice(0, state.cursor.column);
      state.cursor.line += 1;
      state.cursor.column = 0;
      state.insertText += '\n';
      state.feedback = 'Nova linha inserida.';
      return state;
    }
    if (key.length !== 1) return finish(state, 'Tecla não suportada no modo de inserção.');
    const line = state.lines[state.cursor.line];
    state.lines[state.cursor.line] = line.slice(0, state.cursor.column) + key + line.slice(state.cursor.column);
    state.cursor.column += 1;
    state.insertText += key;
    state.feedback = 'Texto inserido. Pressione Esc para voltar ao modo normal.';
    return state;
  }

  if (key === 'Escape') return finish(state, 'Operação cancelada.');
  if (key === 'Ctrl-r') {
    if (!state.redoStack.length) return finish(state, 'Nada para refazer.');
    const next = state.redoStack.pop();
    state.undoStack.push({ lines: [...state.lines], cursor: { ...state.cursor }, register: state.register });
    state.lines = [...next.lines]; state.cursor = { ...next.cursor }; state.register = next.register;
    return finish(state, 'Alteração refeita.');
  }
  if (state.commandBuffer.startsWith('/')) {
    if (key === 'Enter') {
      state.searchTerm = state.commandBuffer.slice(1);
      return finish(state, state.searchTerm ? `Busca por ${state.searchTerm}.` : 'Busca vazia cancelada.');
    }
    if (key.length === 1) state.commandBuffer += key;
    return state;
  }
  if (state.commandBuffer.startsWith(':')) {
    if (key !== 'Enter') { if (key.length === 1) state.commandBuffer += key; return state; }
    if (state.commandBuffer === ':w') return finish(state, 'Arquivo salvo (simulação).');
    if (state.commandBuffer === ':q' || state.commandBuffer === ':q!') return finish(state, 'No Vim real, este comando sairia do editor.');
    return finish(state, 'Comando Ex ainda não implementado no simulador.');
  }

  state.commandBuffer += key;
  const command = state.commandBuffer;
  if (['g', 'd', 'y', ':', '/'].includes(command)) return state;
  const line = () => state.lines[state.cursor.line];

  if (command === 'i') { startInsert(state); return finish(state, 'Modo de inserção.'); }
  if (command === 'a') { state.cursor.column = Math.min(state.cursor.column + 1, line().length); startInsert(state); return finish(state, 'Modo de inserção.'); }
  if (command === 'o') { save(state); state.lines.splice(state.cursor.line + 1, 0, ''); state.cursor.line += 1; state.cursor.column = 0; state.mode = 'insert'; state.insertText = ''; return finish(state, 'Nova linha para inserir.'); }
  if (command === 'h') { state.cursor.column -= 1; return finish(state, 'Cursor à esquerda.'); }
  if (command === 'l') { state.cursor.column += 1; return finish(state, 'Cursor à direita.'); }
  if (command === 'j') { state.cursor.line += 1; return finish(state, 'Cursor abaixo.'); }
  if (command === 'k') { state.cursor.line -= 1; return finish(state, 'Cursor acima.'); }
  if (command === '0') { state.cursor.column = 0; return finish(state, 'Início da linha.'); }
  if (command === '$') { state.cursor.column = line().length; return finish(state, 'Fim da linha.'); }
  if (command === 'w') { const match = line().slice(state.cursor.column + 1).search(/\w/); state.cursor.column = match < 0 ? line().length : state.cursor.column + match + 1; return finish(state, 'Próxima palavra.'); }
  if (command === 'b') { const match = line().slice(0, state.cursor.column).match(/\w+\W*$/); state.cursor.column = match ? state.cursor.column - match[0].length : 0; return finish(state, 'Palavra anterior.'); }
  if (command === 'gg') { state.cursor.line = 0; state.cursor.column = 0; return finish(state, 'Início do arquivo.'); }
  if (command === 'G') { state.cursor.line = state.lines.length - 1; state.cursor.column = 0; return finish(state, 'Fim do arquivo.'); }
  if (command === '.') return repeatChange(state);
  if ((command === 'n' || command === 'N') && state.searchTerm) {
    const step = command === 'n' ? 1 : -1;
    for (let offset = 1; offset <= state.lines.length; offset += 1) {
      const index = (state.cursor.line + step * offset + state.lines.length) % state.lines.length;
      const column = state.lines[index].indexOf(state.searchTerm);
      if (column >= 0) { state.cursor.line = index; state.cursor.column = column; return finish(state, 'Ocorrência encontrada.'); }
    }
    return finish(state, 'Texto não encontrado.');
  }
  if (command === 'x') { save(state); state.lines[state.cursor.line] = line().slice(0, state.cursor.column) + line().slice(state.cursor.column + 1); state.lastChange = { type: 'x' }; return finish(state, 'Caractere removido.'); }
  if (command === 'dd') { save(state); state.register = line(); state.lines.splice(state.cursor.line, 1); if (!state.lines.length) state.lines.push(''); state.lastChange = { type: 'dd' }; return finish(state, 'Linha removida.'); }
  if (command === 'dw') { save(state); const result = deleteWord(line(), state.cursor.column); state.register = result.removed; state.lines[state.cursor.line] = result.line; state.lastChange = { type: 'dw' }; return finish(state, 'Palavra removida.'); }
  if (command === 'yy') { state.register = line(); return finish(state, 'Linha copiada.'); }
  if (command === 'p') { save(state); state.lines.splice(state.cursor.line + 1, 0, state.register); state.cursor.line += 1; state.lastChange = { type: 'p' }; return finish(state, 'Conteúdo colado.'); }
  if (command === 'u') {
    if (!state.undoStack.length) return finish(state, 'Nada para desfazer.');
    const previous = state.undoStack.pop();
    state.redoStack.push({ lines: [...state.lines], cursor: { ...state.cursor }, register: state.register });
    state.lines = [...previous.lines]; state.cursor = { ...previous.cursor }; state.register = previous.register;
    return finish(state, 'Alteração desfeita.');
  }
  if (command.length > 2) return finish(state, 'Comando ainda não implementado.');
  return state;
}
