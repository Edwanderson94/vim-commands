# Objetivos do Vim Commands

## Goal ativo — Melhorar a primeira experiência

**Objetivo:** melhorar a primeira experiência do Vim Commands com base na
validação do cliente: simplificar a área inicial, explicar claramente o que é o
Vim e refinar espaçamento, hierarquia visual, responsividade e acessibilidade da
página inicial, mantendo o conteúdo alinhado às fontes e à especificação.

**Público:** iniciantes que ainda não sabem o que é Vim, como ele se relaciona
com o terminal e por que podem querer aprendê-lo.

**Escopo:**

- Explicar na página inicial que Vim é um editor de texto modal, aberto pelo
  terminal, que pode ser usado em Linux e em outros sistemas.
- Distinguir o Vim do terminal e do sistema operacional; citar outros editores
  disponíveis no Linux sem sugerir que o Vim é a única opção.
- Manter as afirmações introdutórias apoiadas pelas referências em
  [`FONTES.md`](FONTES.md).
- Refinar o espaço entre o conteúdo principal e os botões de entrada, mantendo
  “Começar a aprender” e “Ver cola rápida” fáceis de encontrar.
- Revisar a hierarquia visual e o comportamento da página inicial em telas
  pequenas, temas claro e escuro e navegação por teclado.

**Critérios de conclusão:**

- A apresentação inicial não mostra uma dica isolada de `Esc` abaixo dos
  botões.
- A seção `#aulas` apresenta a introdução “O que é o Vim?” com diferença entre
  terminal, editor e Linux, modo de inserção e exemplos de alternativas.
- O texto é coerente com as fontes registradas em `FONTES.md` e usa português
  claro para iniciantes.
- O espaçamento entre apresentação, botões e trilha é intencional em desktop e
  celular, sem sobras grandes nem rolagem horizontal.
- A introdução permanece legível nos temas claro e escuro e o conteúdo pode ser
  alcançado e lido por teclado e tecnologia assistiva.
- Testes automatizados, links relativos e validação manual da página inicial
  passam antes da promoção da melhoria.

**Estado:** concluído nesta rodada. A pesquisa e as fontes foram registradas,
a introdução explica Vim, terminal, modos e alternativas, a dica solta de `Esc`
foi removida e o espaço entre apresentação e trilha foi reduzido. Em Firefox,
validei a hierarquia desktop e um viewport de 320 px: os dois botões quebram
para linhas separadas sem sair da tela, não há rolagem horizontal e a trilha
começa após a apresentação. A introdução também foi conferida nos temas claro
e escuro. Navegação por teclado mostrou foco visível; a árvore de acessibilidade
expôs nomes e papéis esperados para título, introdução e CTAs. Os contrastes dos
textos principais medidos superam WCAG AA. A checklist e o smoke test agora
incluem verificações da página inicial. Testes do simulador, validação de
documentos/links e `git diff --check` passaram. O ChromeDriver não está
disponível neste ambiente; os testes específicos de Chrome permanecem cobertos
pelo workflow de CI.

**Branch de trabalho:** `release/1.0.1`.

**Fora de escopo:** alterar o conjunto de comandos do simulador, executar
comandos reais do sistema, reescrever a trilha didática ou promover mudanças à
`master`.

## Goal concluído — Release 1.0.1

Entregar uma prática em navegador com uma única janela visual de terminal em
`/home/aluno`, onde a pessoa digita comandos permitidos diretamente no prompt.
`vim teste.txt` abre o arquivo virtual no editor simulado; a prática inclui
desafios, edição por teclado e retorno ao terminal.

**Resultado:** o terminal virtual aceita `pwd`, `ls`, `cat arquivo` e
`vim arquivo`. O Vim simulado oferece os modos normal e inserção, navegação,
edição, busca, salvamento e saída. O ambiente é restrito a arquivos em memória;
não executa comandos reais nem acessa arquivos locais. O painel de desafio
permanece disponível ao editar.

**Validação:** testes automatizados, Chrome no workflow de publicação e
verificações manuais em Firefox foram executados nas mudanças da release. A
versão de validação é servida pelo GitHub Pages a partir de `release/1.0.1`.

## Propósito do projeto

Oferecer um ambiente gratuito, em português do Brasil, para aprender Vim no
terminal com explicações curtas, prática progressiva, referência rápida e um
simulador educacional seguro.

## Público do projeto

- Pessoas iniciantes no terminal Linux e no Vim.
- Autodidatas que querem uma trilha prática.
- Desenvolvedores que precisam consultar comandos rapidamente.

## Resultados permanentes

- A trilha de cinco aulas, os módulos, os 30 comandos e cinco exercícios são
  legíveis em Markdown no GitHub.
- O site estático e os materiais funcionam offline, em celular e desktop, com
  catálogo pesquisável, filtros, temas e conteúdo renderizado.
- Terminal e editor permanecem limitados aos comandos definidos em
  `specification.md`, usam arquivos em memória e permitem praticar o fluxo
  terminal → Vim → terminal.
- A experiência é utilizável por teclado e não acessa dados ou arquivos locais.

## Restrições permanentes

Separar terminal de Vim; priorizar linguagem simples e prática segura; manter
Markdown como fonte de conteúdo; usar caminhos relativos; não ampliar o
simulador fora da especificação.

## Decisões de produto pendentes

- Nome final do projeto.
- Português somente ou inglês adicional.
- Permanência de JavaScript puro versus gerador estático.
- Estratégia de idioma adicional, caso seja priorizado.
