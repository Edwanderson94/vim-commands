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
└── site/
    ├── index.html
    ├── styles.css
    ├── app.js
    ├── commands.js
    ├── simulator.js
    ├── challenges.js
    ├── assets/favicon.svg
    └── README.md
```

Os módulos abrangem terminal básico, primeiros passos, navegação, edição, busca e substituição, arquivos e janelas e cheatsheet. A referência detalhada usa modo, categoria, nível, explicação, exemplo e prática por comando.

Cada aula dura de 10 a 20 minutos e contém duração, nível, pré-requisito, objetivo, conceitos, demonstração, prática guiada, desafio, revisão e autoavaliação.

| Aula | Tema | Resultado esperado |
| :-- | :-- | :-- |
| 1 | Terminal e arquivos | Criar uma pasta e um arquivo de prática. |
| 2 | Primeiro arquivo no Vim | Abrir, inserir texto, salvar e sair. |
| 3 | Movimento e edição | Editar um texto sem depender das setas. |
| 4 | Busca e revisão | Encontrar e substituir texto com confirmação. |
| 5 | Arquivos e janelas | Alternar entre arquivos e divisões de tela. |

Os cinco desafios são: entrar e sair da inserção, chegar ao fim com `G`, remover uma linha com `dd`, duplicar uma linha com `yy` e `p` e encontrar texto com `/texto`. Cada um tem um critério observável.

## 3. Site estático

O site usa HTML5 semântico, CSS3 e JavaScript ES Modules, sem frameworks ou bibliotecas externas. Deve abrir sem servidor, usar caminhos relativos e ser compatível com GitHub Pages.

| Arquivo | Responsabilidade |
| :-- | :-- |
| `index.html` | Estrutura semântica e pontos de montagem. |
| `styles.css` | Tokens, tema, layout e responsividade. |
| `app.js` | Inicialização, tema, busca e filtros. |
| `commands.js` | Dados dos 30 comandos. |
| `simulator.js` | Estado, teclas e renderização. |
| `challenges.js` | Dados e validação dos desafios. |

A página contém cabeçalho com âncoras e botão de tema; apresentação com botão “Começar a aprender” e aviso sobre `Esc`; trilha; catálogo; simulador; desafios; e rodapé.

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

## 4. Simulador educacional

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
| :-- | :-- |
| Modos | `Esc`, `i`, `a`, `o` |
| Movimento | `h`, `j`, `k`, `l`, `w`, `b`, `0`, `$`, `gg`, `G` |
| Edição | `x`, `dd`, `dw`, `yy`, `p`, `u`, `Ctrl-r`, `.` |
| Busca | `/texto`, `n`, `N` |
| Ex simulado | `:w`, `:q`, `:q!` |

`:w` informa “Arquivo salvo (simulação)”; `:q` e `:q!` apenas explicam o que ocorreria no Vim. O `.` repete a última alteração suportada.

Há botões “Ativar simulador” e “Restaurar texto”, cursor e linha atual visíveis, modo (`NORMAL` ou `INSERT`), comando em formação, histórico de teclas e feedback em `aria-live`. Teclas só são capturadas quando o simulador está ativado e focado; atalhos fora dele nunca são bloqueados. A interpretação de comandos fica separada da renderização.

## 5. Desafios interativos

Cada desafio define `id`, título, linhas iniciais, instrução e `isComplete(state)`. O site oferece os cinco desafios definidos acima, resultado textual e reinício. Progresso pode usar somente `localStorage` e deve haver opção para apagá-lo.

## 6. Fases

### Fase 1 — Fundamentos de conteúdo

Módulos Markdown, cinco aulas, 30 comandos com exemplos consistentes, cheatsheet, cinco desafios em Markdown e licença.

### Fase 2 — Site de referência

Criar `index.html`, `styles.css`, `app.js`, `commands.js`, favicon e README do site. Entregar trilha, catálogo, busca, filtros, tema e layout acessível e responsivo.

### Fase 3 — Simulador e desafios

Criar `simulator.js` e `challenges.js`. Implementar todos os comandos declarados, restauração, histórico, feedback, desafios e validação.

### Fase 4 — Qualidade e publicação

Validar HTML e links; testar tema, teclado, desktop, celular, Chrome, Firefox e leitor de tela; testar os comandos e garantir que atalhos externos não sejam bloqueados; adicionar testes unitários. Só com autorização explícita, configurar GitHub Pages na branch escolhida e pasta `/site`.

### Fase 5 — Evoluções

Gerar dados a partir do Markdown, disponibilizar inglês, adicionar modo visual, macros, buffers e janelas ao simulador e salvar progresso no navegador.

## 7. Critérios de aceite

- Markdown legível no GitHub e independente do site.
- Site offline, responsivo, acessível e sem acesso a dados pessoais ou arquivos locais.
- Tema, busca e filtros funcionam sem recarregar.
- Os 30 comandos são consultáveis por categoria.
- Simulador executa os comandos declarados e restaura o texto.
- Os cinco desafios podem ser concluídos e reiniciados.
- Caminhos relativos permitem publicação no GitHub Pages.

## 8. Decisões em aberto

- Nome final e URL do GitHub Pages.
- Conteúdo somente em português ou também em inglês.
- JavaScript puro permanentemente ou gerador estático no futuro.
- Branch de publicação, caso o repositório não use `main`.

## 9. Próximo passo

Implementar a Fase 2, começando por `site/index.html`, `site/styles.css`, `site/app.js` e `site/commands.js`.
