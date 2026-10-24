export const challenges = [
  {
    id: 'insert-text',
    title: 'Sobreviva ao Vim',
    initialLines: ['Linha inicial.'],
    instruction: 'Use i, digite texto e pressione Esc.',
    isComplete: (state) => state.mode === 'normal' && state.lines[0].length > 'Linha inicial.'.length
  },
  {
    id: 'last-line',
    title: 'Chegue ao fim',
    initialLines: ['Primeira linha.', 'Última linha.'],
    instruction: 'Use G para ir à última linha.',
    isComplete: (state) => state.cursor.line === state.lines.length - 1
  },
  {
    id: 'delete-line',
    title: 'Apague a segunda linha',
    initialLines: ['Primeira linha.', 'Remova esta linha.', 'Última linha.'],
    instruction: 'Use dd na segunda linha.',
    isComplete: (state) => state.lines.length === 2
  },
  {
    id: 'copy-line',
    title: 'Copie e cole',
    initialLines: ['Copie esta linha.', 'Última linha.'],
    instruction: 'Use yy e p para duplicar a primeira linha.',
    isComplete: (state) => state.lines.filter((line) => line === 'Copie esta linha.').length === 2
  },
  {
    id: 'search-text',
    title: 'Encontre uma palavra',
    initialLines: ['Vim é prático.', 'Praticar Vim ajuda.'],
    instruction: 'Busque Vim com /Vim.',
    isComplete: (state) => state.searchTerm === 'Vim'
  }
];
