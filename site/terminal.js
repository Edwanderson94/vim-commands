(function (global) {
  const root = '/home/aluno';
  const files = new Map([[`${root}/teste.txt`, '']]);

  function prompt() {
    return `aluno@vim:${root}$`;
  }

  function execute(line) {
    const input = line.trim();
    if (!input) return { output: '', action: null };
    if (/[;&|<>`$()\\]/.test(input)) {
      return { output: 'Use um comando permitido por vez, sem operadores de shell.', action: null };
    }

    const [command, ...args] = input.split(/\s+/);
    if (command === 'pwd') {
      return args.length === 0
        ? { output: root, action: null }
        : { output: 'Uso: pwd', action: null };
    }
    if (command === 'ls') {
      if (args.length) return { output: 'Uso: ls', action: null };
      const names = [...files.keys()].map((path) => path.slice(root.length + 1)).sort();
      return { output: names.join('  ') || '(diretório vazio)', action: null };
    }
    if (command === 'cat') {
      if (args.length !== 1 || !/^[\p{L}\p{N}_.-]+$/u.test(args[0]) || args[0] === '.' || args[0] === '..' || args[0].startsWith('-')) {
        return { output: 'Uso: cat nome-do-arquivo', action: null };
      }
      const path = `${root}/${args[0]}`;
      if (!files.has(path)) return { output: `cat: ${args[0]}: arquivo não encontrado.`, action: null };
      return { output: files.get(path), action: null };
    }
    if (command === 'vim') {
      if (args.length !== 1 || !/^[\p{L}\p{N}_.-]+$/u.test(args[0]) || args[0] === '.' || args[0] === '..' || args[0].startsWith('-')) {
        return { output: 'Uso: vim nome-do-arquivo', action: null };
      }
      const path = `${root}/${args[0]}`;
      if (!files.has(path)) files.set(path, '');
      return {
        output: `Abrindo ${path} no Vim simulado.`,
        action: { type: 'vim', path, lines: files.get(path).split('\n') }
      };
    }
    return {
      output: `Comando não disponível: ${command}. Comandos disponíveis: pwd, ls, cat, vim.`,
      action: null
    };
  }

  function save(path, lines) {
    if (!path.startsWith(`${root}/`) || path.includes('/', root.length + 1)) {
      throw new Error('O Vim simulado só salva arquivos em /home/aluno.');
    }
    files.set(path, lines.join('\n'));
  }

  const VimTerminal = { execute, save, prompt, root };
  if (typeof module !== 'undefined' && module.exports) module.exports = VimTerminal;
  global.VimTerminal = VimTerminal;
})(globalThis);
