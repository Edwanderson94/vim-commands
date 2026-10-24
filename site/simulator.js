(function (global) {
const initialLines = ['Linha para praticar.', 'Apague esta linha.', 'Bom estudo!'];

function createState(lines = initialLines) {
  return {
    mode: 'normal', lines: [...lines], cursor: { line: 0, column: 0 }, register: '',
    commandBuffer: '', searchTerm: '', undoStack: [], redoStack: [], keyHistory: [],
    lastChange: null, insertText: '', insertKind: null,
    feedback: 'Ative o simulador para começar a praticar.'
  };
}

function keyForSimulator(event, state) {
  if (event.ctrlKey) {
    if (state.mode === 'normal' && event.key.toLowerCase() === 'r') return 'Ctrl-r';
    return null;
  }
  if (event.altKey || event.metaKey) return null;
  if (event.key === 'Escape') return 'Escape';
  if (event.key === 'Enter') {
    return state.mode === 'insert' || state.commandBuffer.startsWith('/') || state.commandBuffer.startsWith(':')
      ? 'Enter'
      : null;
  }
  return event.key.length === 1 ? event.key : null;
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
  const match = rest.match(/^[\p{L}\p{M}\p{N}_]+\s*/u);
  const count = match ? match[0].length : 0;
  return { removed: rest.slice(0, count), line: line.slice(0, column) + rest.slice(count) };
}

function startInsert(state, kind = 'insert') {
  save(state);
  state.mode = 'insert';
  state.insertText = '';
  state.insertKind = kind;
}

function repeatChange(state) {
  const change = state.lastChange;
  if (!change) return finish(state, 'Ainda não há alteração para repetir.');
  const line = state.lines[state.cursor.line];
  save(state);
  if (change.type === 'insert' || change.type === 'open-line-insert') {
    if (change.type === 'open-line-insert') {
      state.lines.splice(state.cursor.line + 1, 0, '');
      state.cursor.line += 1;
      state.cursor.column = 0;
    }
    const targetLine = state.lines[state.cursor.line];
    const parts = change.text.split('\n');
    const before = targetLine.slice(0, state.cursor.column);
    const after = targetLine.slice(state.cursor.column);
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

function absoluteCursor(state) {
  let position = state.cursor.column;
  for (let line = 0; line < state.cursor.line; line += 1) position += state.lines[line].length + 1;
  return position;
}

function setCursorFromAbsolute(state, position) {
  let remaining = Math.max(0, position);
  for (let line = 0; line < state.lines.length; line += 1) {
    if (remaining <= state.lines[line].length) {
      state.cursor = { line, column: remaining };
      return;
    }
    remaining -= state.lines[line].length + 1;
  }
  state.cursor = { line: state.lines.length - 1, column: state.lines.at(-1).length };
}

function isWordCharacter(character) {
  return Boolean(character && /[\p{L}\p{M}\p{N}_]/u.test(character));
}

function moveWord(state, direction) {
  const text = state.lines.join('\n');
  let position = absoluteCursor(state);
  if (direction === 'forward') {
    position += 1;
    while (position < text.length && isWordCharacter(text[position])) position += 1;
    while (position < text.length && !isWordCharacter(text[position])) position += 1;
  } else {
    position -= 1;
    while (position > 0 && !isWordCharacter(text[position])) position -= 1;
    while (position > 0 && isWordCharacter(text[position - 1])) position -= 1;
    if (position < 0) position = 0;
  }
  setCursorFromAbsolute(state, position);
}

function moveSearch(state, direction) {
  const lineCount = state.lines.length;
  const currentLine = state.lines[state.cursor.line];
  const sameLineMatch = direction === 'forward'
    ? currentLine.indexOf(state.searchTerm, state.cursor.column + 1)
    : state.cursor.column > 0
      ? currentLine.lastIndexOf(state.searchTerm, state.cursor.column - 1)
      : -1;
  if (sameLineMatch >= 0) {
    state.cursor.column = sameLineMatch;
    return true;
  }

  const step = direction === 'forward' ? 1 : -1;
  for (let offset = 1; offset <= lineCount; offset += 1) {
    const lineIndex = (state.cursor.line + step * offset + lineCount) % lineCount;
    const match = direction === 'forward'
      ? state.lines[lineIndex].indexOf(state.searchTerm)
      : state.lines[lineIndex].lastIndexOf(state.searchTerm);
    if (match >= 0) {
      state.cursor = { line: lineIndex, column: match };
      return true;
    }
  }
  return false;
}

function applyKey(state, key) {
  state.keyHistory = [...state.keyHistory.slice(-11), key];

  if (state.mode === 'insert') {
    if (key === 'Escape') {
      state.mode = 'normal';
      if (state.insertText) state.lastChange = {
        type: state.insertKind === 'open-line' ? 'open-line-insert' : 'insert',
        text: state.insertText
      };
      state.insertText = '';
      state.insertKind = null;
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
      if (!state.searchTerm) return finish(state, 'Busca vazia cancelada.');
      const currentLine = state.lines[state.cursor.line];
      const currentMatch = currentLine.indexOf(state.searchTerm, state.cursor.column + 1);
      if (currentMatch >= 0) state.cursor.column = currentMatch;
      else {
        for (let offset = 1; offset <= state.lines.length; offset += 1) {
          const lineIndex = (state.cursor.line + offset) % state.lines.length;
          const match = state.lines[lineIndex].indexOf(state.searchTerm);
          if (match >= 0) { state.cursor.line = lineIndex; state.cursor.column = match; break; }
        }
      }
      return finish(state, `Busca por ${state.searchTerm}.`);
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
  if (command === 'o') { save(state); state.lines.splice(state.cursor.line + 1, 0, ''); state.cursor.line += 1; state.cursor.column = 0; state.mode = 'insert'; state.insertText = ''; state.insertKind = 'open-line'; return finish(state, 'Nova linha para inserir.'); }
  if (command === 'h') { state.cursor.column -= 1; return finish(state, 'Cursor à esquerda.'); }
  if (command === 'l') { state.cursor.column += 1; return finish(state, 'Cursor à direita.'); }
  if (command === 'j') { state.cursor.line += 1; return finish(state, 'Cursor abaixo.'); }
  if (command === 'k') { state.cursor.line -= 1; return finish(state, 'Cursor acima.'); }
  if (command === '0') { state.cursor.column = 0; return finish(state, 'Início da linha.'); }
  if (command === '$') { state.cursor.column = line().length; return finish(state, 'Fim da linha.'); }
  if (command === 'w') { moveWord(state, 'forward'); return finish(state, 'Próxima palavra.'); }
  if (command === 'b') { moveWord(state, 'backward'); return finish(state, 'Palavra anterior.'); }
  if (command === 'gg') { state.cursor.line = 0; state.cursor.column = 0; return finish(state, 'Início do arquivo.'); }
  if (command === 'G') { state.cursor.line = state.lines.length - 1; state.cursor.column = 0; return finish(state, 'Fim do arquivo.'); }
  if (command === '.') return repeatChange(state);
  if ((command === 'n' || command === 'N') && state.searchTerm) {
    const found = moveSearch(state, command === 'n' ? 'forward' : 'backward');
    return finish(state, found ? 'Ocorrência encontrada.' : 'Texto não encontrado.');
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
  if (command.length > 1) return finish(state, 'Comando ainda não implementado.');
  return state;
}

const VimSimulator = { initialLines, createState, keyForSimulator, applyKey };
if (typeof module !== 'undefined' && module.exports) module.exports = VimSimulator;
global.VimSimulator = VimSimulator;
})(globalThis);
