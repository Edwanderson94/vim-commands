import assert from 'node:assert/strict';
import simulator from '../site/simulator.js';
import challengeData from '../site/challenges.js';
import commandData from '../site/commands.js';
import terminal from '../site/terminal.js';

const { applyKey, createState, keyForSimulator } = simulator;
const { challenges } = challengeData;
const { commands } = commandData;

assert.equal(terminal.execute('pwd').output, '/home/aluno');
assert.equal(terminal.prompt(), 'aluno@vim:/home/aluno$');
assert.equal(terminal.execute('ls').output, 'teste.txt', 'teste.txt já existe no diretório inicial');
assert.deepEqual(terminal.execute('vim teste.txt').action.lines, [''], 'vim abre o arquivo inicial existente');
assert.equal(terminal.execute('cat teste.txt').output, '', 'cat lê o arquivo virtual vazio');
assert.equal(terminal.execute('pwd').output, '/home/aluno');
const opened = terminal.execute('vim rascunho.txt');
assert.equal(opened.action.type, 'vim');
terminal.save(opened.action.path, ['Olá, Vim!']);
assert.equal(terminal.execute('cat rascunho.txt').output, 'Olá, Vim!', 'cat mostra o conteúdo virtual salvo pelo Vim');
assert.deepEqual(terminal.execute('vim rascunho.txt').action.lines, ['Olá, Vim!'], 'vim reabre o conteúdo salvo em memória');
assert.match(terminal.execute('cat inexistente.txt').output, /arquivo não encontrado/);
assert.match(terminal.execute('cat ../fora.txt').output, /Uso: cat/);
assert.match(terminal.execute('cat -n teste.txt').output, /Uso: cat/);
assert.match(terminal.execute('help').output, /Comandos disponíveis: pwd, ls, cat, vim, clear/);
const cleared = terminal.execute('clear');
assert.deepEqual(cleared, { output: '', action: { type: 'clear' } }, 'clear solicita limpar apenas a saída visível');
assert.equal(terminal.execute('cat rascunho.txt').output, 'Olá, Vim!', 'clear preserva os arquivos virtuais');
assert.equal(terminal.execute('clear extra').output, 'Uso: clear', 'clear não aceita argumentos');
for (const command of ['touch outro.txt', 'mkdir pasta', 'cd /tmp', 'help']) {
  assert.match(terminal.execute(command).output, /Comando não disponível/,
    `${command} não pertence à camada de terminal permitida`);
}
assert.equal(terminal.execute('ls -la').output, 'Uso: ls', 'ls aceita somente o comando simples previsto');
assert.equal(terminal.execute('vim ../fora.txt').action, null, 'vim não pode abrir caminhos fora de /home/aluno');
assert.equal(terminal.execute('vim -c').action, null, 'argumentos iniciados por hífen não são opções de execução');
assert.match(terminal.execute('pwd; ls').output, /operadores/);

const press = (state, keys) => { keys.forEach((key) => applyKey(state, key)); return state; };

const normalState = createState();
assert.equal(keyForSimulator({ key: 'Tab' }, normalState), null, 'Tab deve continuar navegando o foco');
assert.equal(keyForSimulator({ key: 'ArrowDown' }, normalState), 'ArrowDown', 'setas são encaminhadas ao Vim');
assert.equal(keyForSimulator({ key: 'Home' }, normalState), 'Home', 'Home é encaminhado ao Vim');
assert.equal(keyForSimulator({ key: 'End' }, normalState), 'End', 'End é encaminhado ao Vim');
assert.equal(keyForSimulator({ key: 'Backspace' }, normalState), null, 'Backspace em modo normal não é edição de texto');
assert.equal(keyForSimulator({ key: 'Backspace' }, { mode: 'insert' }), 'Backspace', 'Backspace funciona no modo de inserção');
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

state = createState(['abc', 'def']);
press(state, ['ArrowRight', 'ArrowDown', 'Home']);
assert.deepEqual(state.cursor, { line: 1, column: 0 }, 'setas e Home movem o cursor no modo normal');
press(state, ['End', 'i', '!', 'ArrowLeft', '?']);
assert.equal(state.lines[1], 'def?!', 'setas movem o cursor durante a inserção');

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
state = press(createState(['abc']), ['l', 'i', 'Backspace', 'Escape']);
assert.deepEqual(state.lines, ['bc'], 'Backspace em inserção apaga o caractere antes do cursor');
press(state, ['u']);
assert.deepEqual(state.lines, ['abc'], 'u desfaz uma sessão de inserção com Backspace');
state = press(createState(['abc']), ['i', 'X', 'Backspace', 'Y', 'Escape', '.']);
assert.equal(state.lines[0], 'YYabc', '. repete texto e Backspace na sessão de inserção');
state = press(createState(['abc', 'def']), ['j', 'i', 'Backspace', 'Escape']);
assert.deepEqual(state.lines, ['abcdef'], 'Backspace no início da linha une com a linha anterior');
state = press(createState(['abc']), ['i', 'Backspace']);
assert.deepEqual(state.lines, ['abc'], 'Backspace no início do arquivo não altera o texto');
state = press(createState(['copie']), ['y', 'y', 'p']);
assert.deepEqual(state.lines, ['copie', 'copie']);
state = press(createState(['Vim aqui', 'Vim ali']), ['/', 'V', 'i', 'm', 'Enter']);
assert.equal(state.cursor.line, 1, 'busca inicial avança a partir do cursor');
press(state, ['n']);
assert.equal(state.cursor.line, 0, 'n avança e percorre o arquivo circularmente');
state = press(createState(['xx Vim no início e Vim no fim']), ['/', 'V', 'i', 'm', 'Enter', 'n']);
assert.equal(state.cursor.column, state.lines[0].lastIndexOf('Vim'), 'n encontra a próxima ocorrência na mesma linha');
press(state, ['N']);
assert.equal(state.cursor.column, state.lines[0].indexOf('Vim'), 'N volta à ocorrência anterior na mesma linha');
state = press(createState(['Vim']), ['/', 'V', 'i', 'm', 'Escape']);
assert.equal(state.commandBuffer, '', 'Esc cancela a busca em formação');
state = press(createState(['Vim']), ['/', 'V', 'i', 'm', 'Enter']);
assert.deepEqual(state.cursor, { line: 0, column: 0 }, 'busca retorna ao começo da linha ao chegar ao fim');
state = press(createState(['apagar agora', 'segunda']), ['d', 'w']);
assert.equal(state.lines[0], 'agora');
state = press(createState(['ação acentuada']), ['d', 'w']);
assert.equal(state.lines[0], 'acentuada', 'dw trata letras acentuadas como parte da palavra');
state = press(createState(['cafe\u0301 acentuada']), ['d', 'w']);
assert.equal(state.lines[0], 'acentuada', 'dw mantém junto marcas Unicode combinantes');
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
state = press(createState(['texto']), [':', 'w', 'q', 'Enter']);
assert.match(state.feedback, /salvo e editor fechado/);

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
