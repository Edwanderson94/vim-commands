# Especificação do projeto: Vim Commands

## 1. Visão, público e princípios

Vim Commands é um projeto educacional gratuito, em português do Brasil, para ensinar Vim no terminal a iniciantes, autodidatas e pessoas que precisam de consulta rápida. O conteúdo em Markdown é a fonte de verdade; o site estático o apresenta de forma pesquisável e oferece prática segura no navegador.

O projeto é iniciante primeiro, prático, acessível e sem dependências complexas. Deve separar o que é digitado no **terminal** do que é digitado no **Vim**, funcionar offline e não acessar arquivos, terminal, área de transferência ou dados pessoais.

Ao concluir a trilha, a pessoa estudante deve abrir o terminal e o Vim, usar os modos normal e inserção, navegar, editar, buscar, substituir, trabalhar com arquivos e janelas e praticar no simulador antes de alterar arquivos reais.

## 2. Conteúdo e estrutura

`content/`, `lessons/` e `exercises/` guardam o material didático em Markdown. `commands.md` é a lista compacta dos 30 comandos essenciais. Na primeira versão, `site/commands.js` pode duplicar esses dados; gerar dados a partir do Markdown é uma evolução futura.

```text
vim-commands/
├── README.md
├── specification.md
├── LICENSE
├── commands.md
├── content/
├── lessons/
├── exercises/
├── scripts/
│   └── render-markdown.mjs
├── tests/
│   └── simulator.test.mjs
└── site/
    ├── index.html
    ├── styles.css
    ├── app.js
    ├── carousel.js
    ├── commands.js
    ├── simulator.js
    ├── challenges.js
    ├── terminal.js
    ├── assets/favicon.svg (favicon SVG quadrado, com E em degradê ciano/azul-roxo sobre fundo preto)
    ├── materiais.css
    ├── materiais/ (HTML derivado, gerado pelo script)
    └── README.md
```

Os módulos abrangem Linux/terminal básico, primeiros passos no Vim, navegação,
edição, busca e substituição, arquivos e janelas e cheatsheet. A sequência
didática é obrigatória: primeiro o módulo Linux/terminal (localização, listagem
e abertura de arquivos); depois o módulo Vim. O Vim é um editor de texto modal,
muito usado no Linux e disponível em outros sistemas, não um sistema operacional.
A referência detalhada usa modo, categoria, nível, explicação, exemplo e prática
por comando.

Cada aula dura de 10 a 20 minutos e contém duração, nível, pré-requisito, objetivo, conceitos, demonstração, prática guiada, desafio, revisão e autoavaliação.

| Aula | Tema | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Terminal e arquivos | Criar uma pasta e um arquivo de prática. |
| 2 | Primeiro arquivo no Vim | Abrir, inserir texto, salvar e sair. |
| 3 | Movimento e edição | Editar um texto sem depender das setas. |
| 4 | Busca e revisão | Encontrar e substituir texto com confirmação. |
| 5 | Arquivos e janelas | Alternar entre arquivos e divisões de tela. |

Os cinco desafios são: entrar e sair da inserção, chegar ao fim com `G`, remover uma linha com `dd`, duplicar uma linha com `yy` e `p` e encontrar texto com `/texto`. Cada um tem um critério observável.

## 3. Site estático

O site usa HTML5 semântico, CSS3 e JavaScript puro em arquivos separados, sem frameworks ou bibliotecas externas. Os scripts clássicos carregam em ordem para funcionar tanto por `file://` quanto por servidor estático. Use caminhos relativos e mantenha compatibilidade com GitHub Pages.

| Arquivo | Responsabilidade |
| :--- | :--- |
| `index.html` | Estrutura semântica, pontos de montagem, favicon EDEVOPS e atribuição da publicadora. |
| `styles.css` | Tokens, tema, layout e responsividade. |
| `app.js` | Inicialização, tema, busca e filtros. |
| `carousel.js` | Carrossel de introdução com rotação, controles e pausa acessíveis. |
| `commands.js` | Dados dos 30 comandos. |
| `simulator.js` | Estado, teclas e renderização. |
| `challenges.js` | Dados e validação dos desafios. |
| `terminal.js` | Interpretador permitido e sistema de arquivos virtual em memória. |
| `materiais.css` | Estilo das páginas HTML derivadas do Markdown. |

As aulas, módulos e exercícios continuam mantidos em Markdown. O script
`scripts/render-markdown.mjs` gera páginas HTML locais, sem dependências
externas, para que os links da trilha sejam formatados no navegador e também
funcionem offline. O tema claro/escuro é compartilhado entre a página inicial e
todas as páginas de materiais; cada subpágina oferece um botão para alterná-lo.
O workflow de publicação executa o mesmo gerador.

A página contém cabeçalho com âncoras e botão de tema; apresentação com os botões “Começar a aprender” e “Ver cola rápida”; a seção “Informações sobre o Vim”, com um carrossel de quatro cartões: a explicação do Vim e três curiosidades apoiadas por fontes, além da ordem recomendada dos módulos Linux e Vim sempre visível; aulas renderizadas; catálogo; prática por terminal simulado com desafio sempre visível; e rodapé com identificação da publicadora EDEVOPS. O carrossel avança a cada 10 segundos quando está visível, oferece controles anterior/próximo e pausa, pausa ao receber foco ou ponteiro ou quando a aba fica oculta e inicia pausado quando a pessoa prefere movimento reduzido. Os cartões e controles precisam continuar utilizáveis por teclado e tecnologia assistiva.

O catálogo mostra tecla, título, descrição, categoria, nível, modo e aula. A busca verifica tecla, título, descrição, categoria e modo. Os filtros de categoria e nível atuam juntos. Sem resultado, há mensagem clara e botão para limpar filtros.

O visual sugere um terminal, mas prioriza leitura. Use fontes do sistema, blocos de código escuros e, no mínimo:

```css
:root {
  --bg: #f8fafc;
  --surface: #ffffff;
  --text: #172033;
  --muted: #526176;
  --primary: #0f766e;
  --border: #d9e1ea;
  --code-bg: #172033;
  --code-text: #e5eef8;
  --focus: #f59e0b;
}
```

O tema escuro usa `data-theme="dark"` em `html` e a preferência fica em `localStorage`. O layout é mobile-first e, a partir de 768px, a grade de comandos tem duas ou três colunas.

Use `header`, `main`, `nav`, `section`, `article` e `footer`; associe campos a `label`; mantenha contraste WCAG AA e foco visível; não dependa apenas de hover ou cor; respeite `prefers-reduced-motion`; e permita navegação por `Tab`.

## 4. Terminal e simulador educacionais

A área de prática contém uma única janela visual de terminal, com prompt em
linha (`aluno@vim:/home/aluno$`) e entrada editável dentro da própria janela,
sem formulário, campo ou botão separado para executar comandos. A pessoa digita
diretamente após o prompt e pressiona `Enter`. O diretório inicial é
`/home/aluno` e já contém o arquivo vazio `teste.txt`. A camada de terminal
aceita `pwd`, `ls`, `cat arquivo`, `clear` e `vim arquivo`; `cat` mostra somente o
conteúdo de arquivos existentes no sistema virtual. `clear` remove o histórico
visível da tela e mantém os arquivos virtuais intactos. Não oferece comandos
para criar pastas, navegar entre diretórios ou listar opções.
Comandos e argumentos fora desse escopo são recusados. Não interpreta
operadores, encadeamento, redirecionamento, substituição, scripts nem comandos
arbitrários. Os arquivos existem apenas em memória e são descartados ao
recarregar a página. `vim` abre ou cria um arquivo virtual diretamente em
`/home/aluno`; `:w` salva no sistema virtual, `:wq` salva e retorna ao terminal,
`:q` retorna se não houver alterações desde o último salvamento e `:q!` retorna
descartando alterações. Não há botão para sair do Vim: a pessoa usa os comandos
Ex como no fluxo normal do Vim. A página não move o foco nem rola até o terminal
ao carregar; clicar em qualquer ponto da janela ativa a linha de comando. Um
seletor simples permite escolher um desafio ou praticar livremente. Ao escolher
um desafio, o texto inicial é carregado em `teste.txt` e a instrução aparece
junto ao seletor; o aluno abre o arquivo pelo fluxo normal com `vim teste.txt`.
O painel do desafio permanece visível enquanto o Vim está aberto e o seletor
fica temporariamente desativado para preservar a atividade em andamento.
Selecionar outro desafio prepara seu texto inicial. Para repetir o mesmo desafio,
escolha “Praticar sem desafio” e selecione-o novamente. O editor só aparece
depois de abrir um arquivo com `vim`; não existem botões para ativar o editor,
reiniciar desafios ou restaurar texto. Teclas do terminal não são capturadas
pelo editor.

O simulador não é um editor completo. Começa no modo normal e mantém apenas estado em memória:

```js
{
  mode: 'normal',
  lines: ['Linha para praticar.', 'Apague esta linha.', 'Bom estudo!'],
  cursor: { line: 0, column: 0 },
  register: '',
  commandBuffer: '',
  searchTerm: '',
  undoStack: [],
  redoStack: [],
  keyHistory: []
}
```

| Grupo | Comandos |
| :--- | :--- |
| Modos | `Esc`, `i`, `a`, `o` |
| Inserção | Digitação de texto, `Enter`, `Backspace` |
| Movimento | `h`, `j`, `k`, `l`, `w`, `b`, `0`, `$`, `gg`, `G` |
| Edição | `x`, `dd`, `dw`, `yy`, `p`, `u`, `Ctrl-r`, `.` |
| Busca | `/texto`, `n`, `N` |
| Ex simulado | `:w`, `:q`, `:q!`, `:wq` |

O cursor pode ser movimentado com `h`, `j`, `k`, `l` ou com as setas. `Home` e
`End` levam ao início e ao fim da linha; o cursor permanece visível quando o
arquivo excede a área de edição. A navegação com setas também funciona durante
a inserção de texto.

`:w`, `:wq`, `:q` e `:q!` controlam o ciclo do arquivo no ambiente virtual. O
`.` repete a última alteração suportada.

No Vim, a tela mostra o nome do arquivo e o modo (`NORMAL` ou `INSERT`) numa barra de status. O editor só captura teclas depois que `vim arquivo` o abre e enquanto ele está focado; atalhos fora dele nunca são bloqueados. A interpretação de comandos fica separada da renderização.

O campo de comando Ex aparece abaixo da barra de status e mostra o buffer
enquanto a pessoa digita `:` e o comando, antes de pressionar `Enter`. `i` muda
o estado visível para `INSERT`; `Esc` retorna a `NORMAL`. `:q` volta ao terminal
se não houver alterações pendentes; com alterações, informa que é necessário
usar `:wq` para salvar e sair ou `:q!` para descartar e sair.
Mensagens importantes do simulador, inclusive o aviso de alterações pendentes,
também aparecem visualmente dentro da janela do Vim.

No modo de inserção, `Backspace` apaga o caractere anterior ao cursor. No início
de uma linha, une essa linha à anterior; no início do arquivo, não altera o
texto. A sessão continua sendo uma única alteração para `u`, e `.` repete a
sequência de inserção e Backspace.

## 5. Desafios interativos

Cada desafio define `id`, título, linhas iniciais, instrução e `isComplete(state)`. O seletor oferece os cinco desafios; escolher um prepara `teste.txt` no terminal virtual e mostra a instrução e o resultado. Não há botão de ativação ou reinício: para começar de novo, selecione “Praticar sem desafio” e escolha o desafio novamente. Progresso pode usar somente `localStorage` e deve haver opção para apagá-lo.

## 6. Fases

### Fase 1 — Fundamentos de conteúdo

Módulos Markdown, cinco aulas, 30 comandos com exemplos consistentes, cheatsheet, cinco desafios em Markdown e licença.

### Fase 2 — Site de referência

Criar `index.html`, `styles.css`, `app.js`, `commands.js`, favicon e README do site. Entregar trilha, catálogo, busca, filtros, tema e layout acessível e responsivo.

### Fase 3 — Simulador e desafios

Criar `simulator.js` e `challenges.js`. Implementar os comandos declarados, desfazer/refazer, histórico, feedback e desafios integrados ao fluxo `vim teste.txt`.

### Fase 4 — Qualidade e publicação

Validar HTML e links; testar tema, teclado, desktop, celular, Chrome, Firefox e leitor de tela; testar os comandos e garantir que atalhos externos não sejam bloqueados; adicionar testes unitários. O workflow executa a validação em pushes para `master` e `release/*`; publica no GitHub Pages apenas após a validação do push em `master`, com o frontend em `/site` e os materiais HTML derivados ao lado.

### Fase 5 — Evoluções

Gerar dados a partir do Markdown, disponibilizar inglês, adicionar modo visual, macros, buffers e janelas ao simulador e salvar progresso no navegador.

## 7. Critérios de aceite

- Markdown legível no GitHub e independente do site.
- Site e materiais offline, responsivos, acessíveis e sem acesso a dados pessoais ou arquivos locais.
- Tema, busca e filtros funcionam sem recarregar.
- Os 30 comandos são consultáveis por categoria.
- O terminal aceita somente `pwd`, `ls`, `cat arquivo`, `clear` e `vim arquivo`;
  `clear` limpa a saída visível sem apagar arquivos. Os arquivos ficam em memória
  e o fluxo terminal → Vim → terminal funciona.
- Os cinco desafios podem ser concluídos e iniciados novamente pelo seletor.
- Caminhos relativos permitem publicação no GitHub Pages.

## 8. Decisões em aberto

- Nome final do projeto.
- Conteúdo somente em português ou também em inglês.
- JavaScript puro permanentemente ou gerador estático no futuro.

## 9. Estado da primeira versão e próximo passo

A Fase 4 e os critérios de aceite da versão 1.0.0 estão verificados. O conteúdo,
as páginas estáticas, o simulador, os cinco desafios, a responsividade, o uso
por teclado e os caminhos relativos foram validados. Chrome passou no workflow
de publicação; Firefox e Orca foram verificados manualmente, incluindo os
anúncios do Orca pela saída braille. A saída falada não foi testada.

A versão 1.0.0 está publicada em
[GitHub Pages](https://edwanderson94.github.io/vim-commands/site/) para
validação. A próxima etapa do produto pertence à Fase 5 e deve ser priorizada
separadamente; suas evoluções não são requisitos de aceite da primeira versão.
Consulte [`PLANS.md`](PLANS.md) para o histórico de verificações e as decisões
de publicação.
