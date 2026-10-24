# Objetivos do Vim Commands

## Goal concluído — estabilizar a validação móvel na release 1.0.2

**Objetivo:** corrigir a falha de automação no toque móvel, validar novamente o
fluxo de publicação e manter o simulador restrito e seguro.

**Público:** iniciantes e autodidatas que estão aprendendo Linux/terminal e Vim
em português do Brasil.

**Escopo imediato da release 1.0.2:**

- Tornar determinístico o smoke test que redimensiona a janela e toca no terminal.
- Calcular o ponto de toque dentro da parte visível do terminal e da viewport.
- Registrar a causa, a correção e o resultado de validação em `PLANS.md`.

**Critérios para concluir a correção:**

- O teste evita a animação global de rolagem antes de medir a posição do terminal.
- O ponto testado está na área visível do terminal em viewport móvel e o evento
  de clique foca a linha de comando.
- Sintaxe, testes do simulador, auditoria do site e smoke test de navegador passam.
- O resultado do workflow e a situação de publicação ficam registrados em
  `PLANS.md`.

**Resultado:** a revisão final mantém a viewport móvel, encontra um ponto visível
na área do terminal e verifica que o evento `click` foca a linha de comando sem
depender da rolagem variável dos gestos CDP. Passou localmente e nos workflows
da release (`40140974661`) e da `master` (`40141037661`), incluindo publicação
no GitHub Pages. A tag `1.0.2` aponta para o merge final em `master` e a branch
`release/1.0.2` foi removida.

**Branch de trabalho:** `release/1.0.2`, criada a partir da `master` no commit
`bd32474`.

**Fora do escopo da 1.0.2:** transformar o simulador em shell completo, ampliar
comandos sem atualizar especificação, executar processos reais ou persistir os
arquivos virtuais após recarregar.

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
5. **Polir a edição da linha de comando — teclado e toque simulado cobertos.**
   Chrome verifica correção com cursor/Backspace e toque em viewport móvel para
   focar o prompt; o workflow `40136432867` passou. Foco e teclado virtual em
   aparelho real ainda requerem verificação manual. O simulador não acessa a
   área de transferência.
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
