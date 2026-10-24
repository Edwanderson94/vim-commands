(function (global) {
  const root = '/home/aluno';
  const directories = new Set(['/', '/home', root]);
  const files = new Map();
  let cwd = root;

  function resolve(path = '.') {
    const expanded = path.replace(/^~(?=\/|$)/, root);
    const base = expanded.startsWith('/') ? '' : cwd;
    const parts = `${base}/${expanded}`.split('/');
    const normalized = [];
    for (const part of parts) {
      if (!part || part === '.') continue;
      if (part === '..') normalized.pop();
      else normalized.push(part);
    }
    const result = `/${normalized.join('/')}`;
    if (result !== root && !result.startsWith(`${root}/`)) {
      throw new Error('O ambiente virtual permite trabalhar somente dentro de /home/aluno.');
    }
    return result;
  }

  function parent(path) { return path.slice(0, path.lastIndexOf('/')) || '/'; }
  function basename(path) { return path.slice(path.lastIndexOf('/') + 1); }

  function execute(line) {
    const input = line.trim();
    if (!input) return { output: '', action: null };
    if (/[;&|<>`$()\\]/.test(input)) return { output: 'Use um comando permitido por vez, sem operadores de shell.', action: null };
    const parts = input.split(/\s+/);
    const [command, ...args] = parts;
    try {
      if (command === 'help' && args.length === 0) return { output: 'Comandos disponíveis: help, pwd, ls, mkdir, cd, touch, vim, cat, clear.', action: null };
      if (command === 'clear' && args.length === 0) return { output: '', action: 'clear' };
      if (command === 'pwd' && args.length === 0) return { output: cwd, action: null };
      if (command === 'ls' && args.length <= 1) {
        const target = resolve(args[0] || '.');
        if (!directories.has(target)) return { output: files.has(target) ? basename(target) : `ls: caminho não encontrado: ${args[0] || target}`, action: null };
        const entries = new Set();
        for (const directory of directories) if (parent(directory) === target) entries.add(`${basename(directory)}/`);
        for (const file of files.keys()) if (parent(file) === target) entries.add(basename(file));
        return { output: [...entries].sort().join('  ') || '(diretório vazio)', action: null };
      }
      if (command === 'mkdir') {
        const recursive = args[0] === '-p';
        const names = recursive ? args.slice(1) : args;
        if (names.length !== 1) return { output: 'Uso: mkdir [-p] pasta', action: null };
        const target = resolve(names[0]);
        if (directories.has(target)) return { output: recursive ? '' : `mkdir: já existe: ${names[0]}`, action: null };
        if (!recursive && !directories.has(parent(target))) return { output: `mkdir: pasta pai não existe: ${parent(target)}`, action: null };
        const lineage = [];
        let current = target;
        while (!directories.has(current)) { lineage.unshift(current); current = parent(current); }
        lineage.forEach((path) => directories.add(path));
        return { output: '', action: null };
      }
      if (command === 'cd') {
        if (args.length > 1) return { output: 'Uso: cd [pasta]', action: null };
        const target = resolve(args[0] || root);
        if (!directories.has(target)) return { output: `cd: pasta não encontrada: ${args[0] || target}`, action: null };
        cwd = target;
        return { output: '', action: null };
      }
      if (command === 'touch' || command === 'vim' || command === 'cat') {
        if (args.length !== 1 || !/^[\p{L}\p{N}_.-]+(?:\/[\p{L}\p{N}_.-]+)*$/u.test(args[0].replace(/^~\//, ''))) {
          return { output: `Uso: ${command} nome-do-arquivo`, action: null };
        }
        const target = resolve(args[0]);
        if (directories.has(target)) return { output: `${command}: o caminho é uma pasta: ${args[0]}`, action: null };
        if (!directories.has(parent(target))) return { output: `${command}: pasta não encontrada: ${parent(target)}`, action: null };
        if (command === 'touch') { if (!files.has(target)) files.set(target, ''); return { output: '', action: null }; }
        if (command === 'cat') return files.has(target) ? { output: files.get(target) || '(arquivo vazio)', action: null } : { output: `cat: arquivo não encontrado: ${args[0]}`, action: null };
        if (!files.has(target)) files.set(target, '');
        return { output: `Abrindo ${target} no Vim simulado.`, action: { type: 'vim', path: target, lines: files.get(target).split('\n') } };
      }
      return { output: `Comando não disponível: ${command}. Digite help para consultar a lista.`, action: null };
    } catch (error) { return { output: error.message, action: null }; }
  }

  function save(path, lines) { files.set(path, lines.join('\n')); }
  const VimTerminal = { execute, save, root };
  if (typeof module !== 'undefined' && module.exports) module.exports = VimTerminal;
  global.VimTerminal = VimTerminal;
})(globalThis);
