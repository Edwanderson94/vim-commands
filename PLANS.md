# Plano de execução

Status revisado em 2026-10-23. As páginas Markdown também são renderizadas em
HTML estático local para leitura formatada no navegador.

## Fase 1 — Conteúdo Markdown — concluída

**Objetivo:** disponibilizar a trilha e a referência inicial.

**Evidência:** existem sete módulos em `content/`, cinco aulas em
`lessons/`, cinco exercícios em `exercises/`, `commands.md`, cheatsheet
e licença.

**Verificação:** cada um dos 30 itens agora registra contexto/modo, categoria,
nível, explicação, exemplo e prática. Os separadores das tabelas seguem o
formato Markdown válido.

**Aceite e verificação:** conferir que todos os links relativos afetados
existem e que cada material mantém o contexto terminal/Vim.

## Fase 2 — Site de referência — em andamento

**Objetivo:** entregar a interface estática com trilha, catálogo, busca,
filtros, tema e responsividade.

**Evidência:** `site/` contém a página, estilos, busca, tema, catálogo,
simulador, desafios e páginas HTML locais geradas a partir dos materiais.

**Verificado:** Firefox carregou a página diretamente via `file://`, incluindo
scripts, 30 cartões, tema inicial e estado do simulador. A captura desktop mostra
a página completa; a visualização mobile mostra a dobra inicial sem corte
horizontal.

**Correção desta rodada:** scripts isolados em escopos próprios para impedir
colisão de nomes globais; a colisão interrompia a montagem do catálogo e do
simulador no navegador. A estrutura das aulas agora explicita demonstração e
autoavaliação conforme a especificação.

**Falta verificar:** busca/filtros e alternância de tema por interação no
navegador; combinação com leitor de tela e mais tamanhos móveis.

**Parada:** não avançar sem uma verificação manual básica e links relativos
válidos.

## Fase 3 — Simulador e desafios — em andamento

**Objetivo:** executar exclusivamente os comandos declarados e validar cinco
desafios em memória.

**Evidência:** `simulator.js` e `challenges.js` existem.

**Verificação automatizada:** `tests/simulator.test.mjs` cobre os grupos de
comandos definidos na especificação, busca, inserção, repetição, undo/redo,
restauração e conclusão dos cinco desafios.

**Falta verificar manualmente:** foco e captura no navegador, restauração pelos
botões, leitores de tela e comportamento visual.

**Repetição com `.`:** a última alteração fica registrada como operação
estruturada. A cobertura inclui inserção e abertura de linha (`i`, `a`, `o`),
`x`, `dd`, `dw` e `p`; movimentos, buscas, cópia, `u`, `Ctrl-r` e comandos Ex
não substituem esse registro. A repetição cria um snapshot para `u`.

**Parada:** não declarar aceite sem testes da lógica e teste manual no browser.

## Fase 4 — Qualidade e publicação — em validação pública

**Objetivo:** validar HTML, links, teclado, leitores de tela, desktop, celular
e navegadores; adicionar testes unitários para estado e interpretador.

**Lacunas registradas em 2026-10-23:**

**Correções em validação:**

- O simulador agora registra uma sessão de inserção como uma alteração e `.`
  a repete; os testes em `tests/simulator.test.mjs` cobrem inserir, desfazer,
  refazer, repetir, remover, copiar, buscar e comandos Ex simulados.
- A interface gera 18 páginas HTML dos materiais Markdown. Isso mantém a fonte
  didática em Markdown e permite ler as aulas formatadas, offline e no Pages.
- O catálogo informa o modo real e a aula associada a cada comando. O site
  também explica quais comandos estão disponíveis no simulador.

**Renderização de materiais:** `scripts/render-markdown.mjs` converte módulos,
aulas, exercícios e referência de comandos para 18 páginas estáticas em
`site/materiais/`, sem alterar os arquivos Markdown de origem. Após alterar
Markdown, execute o gerador; o workflow também o executa antes do deploy.

**Verificação visual:** Firefox renderizou a página completa e uma aula em
`file://`, em desktop e mobile. A inspeção estática confirma 19 documentos
HTML (página principal mais 18 materiais), marcos semânticos e destinos locais
existentes. A suíte do simulador, checagem sintática dos scripts e `git diff
--check` passaram; links locais das 19 páginas foram resolvidos.

**Ainda falta:** interação manual de teclado/foco, Chrome, leitor de tela e
validação completa em celular. O ambiente não oferece uma janela de navegador
interativa, então esses pontos ainda precisam de validação no navegador do
usuário.

**Publicação de validação:** o workflow do GitHub Pages publica `site/` a
partir da branch `release/1.0.0`. Ela permite validar o catálogo, tema,
simulador e desafios, mas não substitui a correção das lacunas acima antes do
aceite de estabilidade.

**Restrição:** GitHub Pages, commits, push e alterações externas exigem
autorização explícita.

## Sequência imediata

1. Validar todas as páginas HTML geradas e seus links.
2. Testar o site manualmente em desktop e celular, com teclado, Chrome, Firefox
   e leitor de tela.
3. Corrigir regressões e registrar os resultados da validação.
