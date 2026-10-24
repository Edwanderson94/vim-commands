# Plano de execução

Status baseado na estrutura observada em 2026-10-23. Links listados no README e
pré-requisitos entre aulas foram encontrados; esta verificação não substitui
teste manual do site.

## Fase 1 — Conteúdo Markdown — concluída com ressalva

**Objetivo:** disponibilizar a trilha e a referência inicial.

**Evidência:** existem sete módulos em `content/`, cinco aulas em
`lessons/`, cinco exercícios em `exercises/`, `commands.md`, cheatsheet
e licença.

**Ressalva:** a especificação pede formato detalhado por comando; a referência
atual é majoritariamente tabular. Confirmar se essa tabela atende à intenção
antes de reformatá-la.

**Aceite e verificação:** conferir que todos os links relativos afetados
existem e que cada material mantém o contexto terminal/Vim.

## Fase 2 — Site de referência — em andamento

**Objetivo:** entregar a interface estática com trilha, catálogo, busca,
filtros, tema e responsividade.

**Evidência:** `site/` contém `index.html`, `styles.css`, `app.js`,
`commands.js`, favicon e README.

**Falta verificar:** comportamento no navegador, acessibilidade por teclado,
responsividade, tema persistente e todos os 30 cartões.

**Parada:** não avançar sem uma verificação manual básica e links relativos
válidos.

## Fase 3 — Simulador e desafios — em andamento

**Objetivo:** executar exclusivamente os comandos declarados e validar cinco
desafios em memória.

**Evidência:** `simulator.js` e `challenges.js` existem.

**Falta:** confirmar, comando a comando, todos os grupos definidos na
especificação; feedback, histórico, restauração, desafios, teclado focado e
ausência de acesso local.

**Repetição com `.`:** registrar a última alteração concluída como uma
intenção estruturada, não como teclas brutas. Inicialmente cobrir `x`,
`dd`, `dw` e `p`; movimentos, buscas, cópia, `u`, `Ctrl-r` e
comandos Ex não devem substituir esse registro. A repetição deve criar um
snapshot para que `u` a desfaça.

**Parada:** não declarar aceite sem testes da lógica e teste manual no browser.

## Fase 4 — Qualidade e publicação — pendente

**Objetivo:** validar HTML, links, teclado, leitores de tela, desktop, celular
e navegadores; adicionar testes unitários para estado e interpretador.

**Restrição:** GitHub Pages, commits, push e alterações externas exigem
autorização explícita.

## Sequência imediata

1. Auditar o simulador contra a tabela de comandos da especificação.
2. Integrar e testar os desafios no site.
3. Executar verificações de qualidade da Fase 4.
4. Só então avaliar publicação, mediante autorização.
