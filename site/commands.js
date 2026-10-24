const entries = [
  ['i', 'Inserir antes', 'Começa a inserir antes do cursor.', 'modos', 'normal', 'Aula 2'],
  ['a', 'Inserir depois', 'Começa a inserir depois do cursor.', 'modos', 'normal', 'Aula 2'],
  ['o', 'Nova linha abaixo', 'Abre uma linha abaixo e entra em inserção.', 'modos', 'normal', 'Aula 2'],
  ['Esc', 'Voltar ao normal', 'Volta ao modo normal ou cancela uma operação.', 'modos', 'qualquer modo', 'Aula 2'],
  [':w', 'Salvar arquivo', 'Salva o arquivo atual.', 'arquivos', 'linha de comando', 'Aula 2'],
  [':q', 'Sair do Vim', 'Fecha o Vim quando não há alterações pendentes.', 'arquivos', 'linha de comando', 'Aula 2'],
  [':wq', 'Salvar e sair', 'Salva e fecha o Vim.', 'arquivos', 'linha de comando', 'Aula 2'],
  [':q!', 'Sair sem salvar', 'Fecha descartando alterações não salvas.', 'arquivos', 'linha de comando', 'Aula 2'],
  ['h j k l', 'Mover cursor', 'Move o cursor para esquerda, baixo, cima e direita.', 'navegação', 'normal', 'Aula 3'],
  ['w', 'Próxima palavra', 'Move para o início da próxima palavra.', 'navegação', 'normal', 'Aula 3'],
  ['b', 'Palavra anterior', 'Move para o início da palavra anterior.', 'navegação', 'normal', 'Aula 3'],
  ['0', 'Início da linha', 'Move para o início da linha.', 'navegação', 'normal', 'Aula 3'],
  ['$', 'Fim da linha', 'Move para o fim da linha.', 'navegação', 'normal', 'Aula 3'],
  ['gg', 'Início do arquivo', 'Move para a primeira linha.', 'navegação', 'normal', 'Aula 3'],
  ['G', 'Fim do arquivo', 'Move para a última linha.', 'navegação', 'normal', 'Aula 3'],
  [':n', 'Ir para linha', 'Move para uma linha indicada, como :25.', 'navegação', 'linha de comando', 'Aula 3'],
  ['x', 'Apagar caractere', 'Remove o caractere sob o cursor.', 'edição', 'normal', 'Aula 3'],
  ['dd', 'Apagar linha', 'Remove a linha atual.', 'edição', 'normal', 'Aula 3'],
  ['dw', 'Apagar palavra', 'Remove até o fim da palavra.', 'edição', 'normal', 'Aula 3'],
  ['yy', 'Copiar linha', 'Copia a linha atual para o registro do Vim.', 'edição', 'normal', 'Aula 3'],
  ['p', 'Colar', 'Cola o conteúdo copiado ou removido.', 'edição', 'normal', 'Aula 3'],
  ['u', 'Desfazer', 'Desfaz a última alteração.', 'edição', 'normal', 'Aula 3'],
  ['Ctrl-r', 'Refazer', 'Refaz uma alteração desfeita.', 'edição', 'normal', 'Aula 3'],
  ['.', 'Repetir alteração', 'Repete a última alteração.', 'edição', 'normal', 'Aula 3'],
  ['/texto', 'Buscar texto', 'Busca texto a partir da posição atual.', 'busca', 'normal', 'Aula 4'],
  ['n', 'Próxima ocorrência', 'Vai à próxima ocorrência da última busca.', 'busca', 'normal', 'Aula 4'],
  ['N', 'Ocorrência anterior', 'Vai à ocorrência anterior da última busca.', 'busca', 'normal', 'Aula 4'],
  [':%s/antigo/novo/g', 'Substituir tudo', 'Substitui todas as ocorrências no arquivo.', 'busca e substituição', 'linha de comando', 'Aula 4'],
  [':%s/antigo/novo/gc', 'Substituir confirmando', 'Pede confirmação para cada substituição.', 'busca e substituição', 'linha de comando', 'Aula 4'],
  [':e arquivo', 'Abrir arquivo', 'Abre um arquivo no Vim.', 'arquivos', 'linha de comando', 'Aula 5']
];

const commands = entries.map(([keys, title, description, category, mode, lesson]) => ({
  keys,
  title,
  description,
  category,
  mode,
  lesson,
  level: 'iniciante'
}));

const VimCommands = { commands };
if (typeof module !== 'undefined' && module.exports) module.exports = VimCommands;
globalThis.VimCommands = VimCommands;
