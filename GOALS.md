# Objetivos do Vim Commands

## Goal ativo — Concluir a release 1.0.1 e preparar as próximas melhorias

**Objetivo:** concluir a release 1.0.1 do Vim Commands e preparar uma fila
priorizada de melhorias para o ambiente de aprendizagem do terminal e do Vim,
mantendo o simulador seguro e a trilha Linux/terminal antes do módulo Vim.

**Público:** iniciantes e autodidatas que estão aprendendo Linux/terminal e Vim
em português do Brasil.

**Escopo imediato da release 1.0.1:**

- Disponibilizar `clear` no terminal virtual. Ele limpa a saída visível, mantém o
  prompt pronto para uso e não remove arquivos da sessão.
- Apresentar o módulo Linux/terminal como pré-requisito do módulo Vim na página
  inicial, README, módulos, aulas e exercícios.
- Explicar que Vim é um editor de texto muito usado no Linux, aberto a partir do
  terminal, mas não é o sistema operacional e também existe em outros sistemas.
- Registrar as mudanças e regressões na especificação e na checklist de QA.

**Critérios para concluir a release:**

- `clear` limpa a tela, preserva o prompt e permite continuar digitando; arquivos
  criados/salvos antes dele continuam disponíveis no sistema virtual.
- O terminal permanece restrito à lista definida na especificação e não executa
  comandos reais nem acessa arquivos locais.
- A sequência Linux/terminal → Vim está clara nos caminhos de entrada e nos
  materiais; links locais continuam válidos.
- Testes do simulador, auditoria do site e fluxo de navegador passam; a validação
  da release e publicação são registradas em `PLANS.md`.
- A pessoa responsável valida o fluxo de prática antes de fechar a release.

**Estado atual:** `clear`, a ordem didática e a distinção entre Linux real e
simulador foram implementados e publicados na branch `release/1.0.1`. Testes
unitários, auditoria dos 19 HTML, links locais, `git diff --check` e smoke test
Chrome passaram. O workflow `40136038532` concluiu com sucesso e a página
publicada respondeu HTTP 200. Falta a pessoa responsável validar a experiência
no site antes do fechamento da release.

**Branch de trabalho:** `release/1.0.1`.

**Fora do escopo da 1.0.1:** transformar o simulador em shell completo, ampliar
comandos sem atualizar especificação, executar processos reais, persistir os
arquivos virtuais após recarregar ou promover alterações para `master` sem o
fluxo de release.

## Dez melhorias identificadas para trabalharmos

Os itens 1–4 foram implementados/validados nesta rodada. Os itens 5–10 são
oportunidades priorizadas; detalhar na especificação antes de mudar o escopo do
simulador.

1. **Limpar a tela com `clear` — publicado.** Aceita o comando sem argumentos,
   limpa o histórico visível, conserva o prompt/foco e preserva os arquivos da
   sessão; integração passou no smoke test Chrome.
2. **Ordenar a trilha Linux → Vim — publicado.** A página inicial apresenta o
   módulo Linux antes das aulas Vim e os materiais declaram os pré-requisitos.
3. **Distinguir Linux real do terminal restrito do simulador — publicado.**
   README, módulo inicial e Aula 1 identificam que `cd`, `mkdir` e `touch` são
   exemplos para um Linux real e apresentam a lista aceita pelo simulador.
4. **Cobrir erros e limites do terminal ponta a ponta — validado.** O smoke
   test Chrome verifica `pwd`, comandos permitidos e negados, argumentos
   inválidos, arquivos inexistentes, caminhos externos, operadores, `clear` com
   argumento e preservação do arquivo. O workflow `40136235605` passou.
5. **Polir a edição da linha de comando — correção por teclado validada.** O
   smoke test Chrome digita `pwXd`, move o cursor e apaga o caractere errado
   antes de executar `pwd`; o workflow `40136353939` passou. Colagem, seleção,
   telas táteis e o retorno do foco ainda precisam de validação.
6. **Tornar os desafios mais instrutivos.** Revisar a clareza dos critérios de
   conclusão, o feedback de sucesso/erro e como a pessoa retoma a instrução ao
   alternar entre terminal e Vim.
7. **Fortalecer regressões do editor Vim.** Cobrir por navegador modos, setas,
   Home/End, Backspace, rolagem do cursor, `:q` com alteração pendente, `:wq`,
   `:q!`, reabertura e leitura com `cat`.
8. **Completar acessibilidade do fluxo terminal/Vim.** Validar nomes e estados
   acessíveis, foco visível, anúncios de `clear`, erros e mudanças de modo, além
   de conferir o percurso com leitor de tela.
9. **Completar QA entre navegadores e dispositivos.** Registrar uma matriz
   manual em Firefox e Chrome; incluir Safari e celulares reais quando
   disponíveis, e testar o teclado virtual e a área rolável do terminal.
10. **Separar prévia e publicação pública.** Avaliar um workflow de prévia para
    candidatos, para que pushes de validação não substituam diretamente o site
    público. Definir critérios de promoção e retorno antes de habilitar o fluxo.

## Goal concluído — Primeira experiência

**Objetivo anterior:** melhorar a apresentação inicial, explicar o que é Vim e
refinar espaçamento, hierarquia visual, responsividade e acessibilidade.

**Resultado registrado:** a página inicial explica Vim, terminal, modos e
alternativas; a dica isolada de `Esc` foi removida; o carrossel de informações e
a hierarquia responsiva foram implementados. As verificações e limitações da
rodada anterior estão registradas em `PLANS.md`.

## Goal concluído — Release 1.0.1 (escopo original)

Entregar uma prática em navegador com uma única janela visual de terminal em
`/home/aluno`, onde a pessoa digita comandos permitidos diretamente no prompt.
`vim teste.txt` abre o arquivo virtual no editor simulado; a prática inclui
desafios, edição por teclado e retorno ao terminal.

**Resultado:** a prática em uma janela, os desafios integrados e o editor Vim
simulado foram implementados. Esta release recebeu agora as melhorias
incrementais de `clear` e da ordem didática Linux → Vim, ainda pendentes de
validação final/publicação.

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
