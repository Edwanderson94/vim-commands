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

**Estado atual:** as duas melhorias imediatas foram implementadas localmente na
branch `release/1.0.1`. Testes unitários, auditoria dos 19 HTML, links locais e
`git diff --check` passaram. O smoke test de navegador foi ampliado, mas não pôde
ser executado localmente porque ChromeDriver não está disponível. As alterações
ainda aguardam validação no workflow e validação da pessoa responsável antes do
fechamento da release.

**Branch de trabalho:** `release/1.0.1`.

**Fora do escopo da 1.0.1:** transformar o simulador em shell completo, ampliar
comandos sem atualizar especificação, executar processos reais, persistir os
arquivos virtuais após recarregar ou promover alterações para `master` sem o
fluxo de release.

## Dez melhorias identificadas para trabalharmos

Os itens 1 e 2 já estão implementados localmente como parte desta rodada. Os
itens seguintes são oportunidades de trabalho priorizadas; devem ser detalhados
na especificação antes de mudar o escopo do simulador.

1. **Limpar a tela com `clear` — feito localmente.** Aceitar o comando sem
   argumentos, limpar o histórico visível, conservar o prompt/foco e preservar
   os arquivos da sessão. Falta validar o fluxo integrado no navegador/CI.
2. **Ordenar a trilha Linux → Vim — feito localmente.** Apresentar o módulo
   Linux/terminal antes do Vim na página inicial e explicitar pré-requisitos nos
   materiais. Falta validação final da experiência publicada.
3. **Distinguir Linux real do terminal restrito do simulador — feito localmente.**
   O módulo Linux ensina comandos comuns (`cd`, `mkdir`, `touch`) que a prática
   web não aceita. README, módulo inicial e Aula 1 agora indicam o ambiente
   correto para cada exemplo; falta validar a versão integrada/publicada.
4. **Cobrir erros e limites do terminal ponta a ponta.** Ampliar testes de
   integração para comandos permitidos/negados, argumentos inválidos, arquivos
   inexistentes, caminhos externos, `clear` e preservação dos arquivos.
5. **Polir a edição da linha de comando.** Verificar cursor, seleção, colagem,
   apagar/corrigir o comando antes de Enter, comportamento em telas táteis e
   retorno do foco, sem capturar teclas fora do terminal.
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
