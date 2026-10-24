# Plano de execução

Status revisado em 2026-10-24. As páginas Markdown também são renderizadas em
HTML estático local para leitura formatada no navegador.

## Estado atual — release/1.0.1

O goal ativo está em [`GOALS.md`](GOALS.md). A solicitação atual acrescentou o
comando `clear` e deixou explícito que a trilha de Linux/terminal precede o
módulo Vim. As três mudanças estão implementadas e publicadas na branch `release/1.0.1`
(commit `d7b3bdc` e ajuste de smoke test `ec7e4ce`). Também foi resolvida a
discrepância entre exemplos de terminal Linux real (`cd`, `mkdir`, `touch`) e a
lista menor do simulador web.

**Comportamento de `clear`:** remove as linhas de saída do terminal, restaura o
prompt e o foco para a entrada e mantém intactos os arquivos virtuais. A
especificação, a instrução da página, README, checklist QA, testes unitários e
o smoke test Chrome foram atualizados.

**Ordem didática:** README, página inicial, módulos, primeira aula, exercícios e
referência agora indicam Linux/terminal antes de Vim; o material também explica
que Vim é um editor, não o sistema operacional. Os HTML derivados foram
regenerados.

**Verificações:** `node tests/simulator.test.mjs`,
`python3 tests/site-validation.py` (19 páginas e links locais) e
`git diff --check` passaram. O smoke test Chrome confirmou limpeza da tela, foco,
prompt, persistência do arquivo e navegação por teclado após o link do novo
módulo. O workflow `40136038532` passou; a página publicada respondeu HTTP 200.

**Situação de promoção:** as alterações estão no remoto e publicadas pelo GitHub
Pages. A revisão da pessoa responsável ainda é necessária antes de fechar a
release 1.0.1.

## Melhorias planejadas

A fila priorizada com dez melhorias, critérios resumidos e status está em
[`GOALS.md`](GOALS.md), na seção “Dez melhorias identificadas”. Os itens 1–4
foram implementados e validados; os itens 5–10 estão em andamento ou planejados.
O smoke test Chrome do item 4 cobre a lista de comandos, rejeições, argumentos
inválidos, caminhos externos, operadores, `clear` com argumento e persistência
do arquivo. O workflow `40136235605` passou. O item 5 cobre correção por cursor/Backspace e
agora também toque simulado em viewport móvel para focar a linha de comando; o
workflow `40136432867` passou. Foco em aparelho real ainda requer verificação
manual; o simulador não acessa a área de transferência.

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

## Fase 2 — Site de referência — verificada em Firefox

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

**Automação contínua:** o workflow agora executa os testes do simulador e
`tests/site-validation.py` antes de publicar. Essa checagem confere 19 páginas,
estrutura semântica, nomes de controles, links relativos, material Markdown,
ausência de recursos remotos e APIs de rede/arquivos. Ela também detectou e
ajudou a corrigir a tabela de revisão quebrada na Aula 1.

**Verificado em Firefox:** busca, filtros combinados, estado sem resultados,
limpeza dos filtros com retorno do foco à busca, alternância e persistência do
tema. Um frame de teste com larguras de 320, 360, 390, 430, 500, 768 e 1280 px
não apresentou rolagem horizontal; o catálogo alternou entre uma, duas e três
colunas conforme os breakpoints.

**Acessibilidade visual:** contraste medido dos textos e links dos dois temas
ficou entre 4,8:1 e 16,05:1. O contorno de foco claro foi escurecido para
4,8:1 sobre o fundo principal; no simulador escuro, o contorno chega a 7,57:1.

**Acessibilidade computada no Firefox:** os 23 controles visíveis e focáveis
expõem nome acessível; o botão “Limpar filtros” só entra na árvore quando o
estado vazio é mostrado. As mensagens dinâmicas usam uma região de status
polida e atômica. O simulador expõe a área como caixa de texto multilinha e
informa via `aria-disabled` se está ativada.

**Parada:** não avançar sem uma verificação manual básica e links relativos
válidos.

## Fase 3 — Simulador e desafios — verificada em Firefox

**Objetivo:** executar exclusivamente os comandos declarados e validar cinco
desafios em memória.

**Evidência:** `simulator.js` e `challenges.js` existem.

**Verificação automatizada:** `tests/simulator.test.mjs` cobre os grupos de
comandos definidos na especificação, busca, inserção, repetição, undo/redo,
restauração e conclusão dos cinco desafios.

**Correções desta rodada:** `n`/`N` agora percorrem ocorrências adicionais na
mesma linha, e `dw` reconhece letras acentuadas e marcas Unicode combinantes.
Há casos de regressão para essas situações na suíte do simulador; as duas
ações também foram verificadas no Firefox em `file://`.

**Verificado em Firefox:** tecla ignorada antes da ativação, foco transferido
para a área ao ativar, `Tab` não capturado, inserção e restauração pelo botão.
Os cinco desafios foram concluídos conforme suas instruções e reiniciados para
o estado inicial.

Uma sessão de teclado WebDriver também digitou no simulador e confirmou que
`Tab` move o foco do editor para o link do exercício seguinte.

O critério do desafio `dd` agora confirma que a segunda linha correta foi
removida; o teste também confirma que remover a primeira linha não conclui o
desafio.

**Repetição com `.`:** a última alteração fica registrada como operação
estruturada. A cobertura inclui inserção e abertura de linha (`i`, `a`, `o`),
`x`, `dd`, `dw` e `p`; movimentos, buscas, cópia, `u`, `Ctrl-r` e comandos Ex
não substituem esse registro. A repetição cria um snapshot para `u`.

**Parada:** não declarar aceite sem testes da lógica e teste manual no browser.

## Fase 4 — Qualidade e publicação — verificada

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
existentes. O teste `file://` confirmou o catálogo com 30 comandos e a busca.
As cinco aulas contêm todos os campos e seções especificados. A suíte do
simulador, checagem sintática dos scripts e `git diff --check` passaram; links
locais das 19 páginas foram resolvidos.

**Leitor de tela:** Orca foi validado no Firefox isolado. A saída braille do
leitor registrou a contagem filtrada e a conclusão do desafio. A voz não foi
testada neste ciclo; a especificação exige validação com leitor de tela, e a
saída braille do Orca confirma esse caminho sem emitir áudio no ambiente.
Chrome/Chromium não está instalado localmente; a validação Chrome é feita no
GitHub Actions.

**Chrome em CI:** a imagem `ubuntu-latest` do GitHub Actions inclui Google
Chrome e ChromeDriver. O workflow agora executa `tests/chrome-smoke.py` com os
binários já presentes no runner, sem instalar dependências. O teste valida o
layout móvel, busca, filtros, retorno do foco, tema, papel e nome acessíveis do
simulador e regiões de status, entrada de teclado e conclusão dos cinco
desafios. A evidência de execução veio do workflow `40100520037` (commit
`8a52de7`): as etapas de validação, preparação do artefato e publicação
concluíram com sucesso. Após consolidar as mensagens numa região única, o
workflow `40101671553` (commit `7d3dfcf`) validou o papel e a contagem após a
busca, a conclusão dos desafios e publicou o site. A execução anterior
`40101587794` apontou que a asserção da contagem estava posicionada após limpar
os filtros; ela foi movida para logo após a busca.

**Árvore de acessibilidade:** no Firefox gráfico, AT-SPI expôs os links e
controles com nomes e funções. A busca aparece como campo “Buscar comando”, os
filtros e o seletor de desafio como caixas de combinação, os controles como
botões e o simulador como caixa de texto de várias linhas com o nome “Área de
prática do simulador”. O simulador começa desativado e passa ao estado ativado
e focado após “Ativar simulador”; “Reiniciar desafio” fica indisponível até um
desafio ser selecionado. A navegação por Tab percorreu cabeçalho, trilha,
catálogo, simulador e rodapé. Esta inspeção confirma a árvore consumida por
leitores de tela. Orca também gerou as duas mensagens verificadas pela saída
braille; a fala não foi testada.

**Mensagens dinâmicas:** contagem do catálogo e retorno do simulador agora são
centralizados em uma região `role="status"`, `aria-live="polite"` e
`aria-atomic="true"`. Os textos visíveis correspondentes ficam fora da árvore
assistiva para evitar anúncios duplicados; a área do simulador aponta para
instruções estáticas. A validação estática e o teste Chrome verificam a função
e o texto da região. O primeiro render mantém a região vazia para não
substituir uma mensagem pelo feedback inicial antes de qualquer ação. O smoke
test verifica esse estado e o workflow `40101978849` (commit `b3987d7`) passou.
No Firefox isolado, AT-SPI focou a janela de teste. Com intervalos entre as
teclas, o log de depuração do Orca registrou na saída braille `3 de 30 comandos
exibidos.` e `Desafio concluído. Modo normal.`. A fala ficou desativada; a saída
de voz não foi verificada, mas não há critério obrigatório de aceite pendente
para a primeira versão.

**Validação desta rodada:** Firefox abriu a cópia local e a publicação atual
em GitHub Pages; ambas montaram 30 comandos e recursos sem erro. Busca por
texto, filtro combinado, troca de tema, ativação/entrada/restauração do
simulador e links locais foram conferidos. Uma moldura de navegador com largura
de 320 px não apresentou elementos fora da área visível. O README agora aponta
diretamente para `/site/`, que é o caminho publicado; a raiz do projeto contém
apenas um redirecionamento para essa página. A suíte do simulador, auditoria
estática das 19 páginas e `git diff --check` passaram nesta rodada. Orca
apresentou as mensagens na saída braille; a fala não foi testada e fica
registrada como observação, não como pendência de aceite da primeira versão.

**Publicação de validação:** o workflow do GitHub Pages publica `site/` a
partir da branch `release/1.0.0`. Ela permite validar o catálogo, tema,
simulador e desafios. O código da interface no commit `b3987d7` passou no
workflow `40101978849`; o Pages responde com HTTP 200 e serve o anunciador
único e o estado inicial corrigido. A branch atual é `release/1.0.0`.

**Restrição:** GitHub Pages, commits, push e alterações externas exigem
autorização explícita.

## Ajuste de prática após a 1.0.0 — terminal simulado

**Motivo:** a área de prática anterior começava diretamente no editor Vim e não
permitia experimentar os comandos de terminal das Aulas 1 e 2.

**Implementado:** o site agora inicia com um terminal didático em memória que
aceita `help`, `pwd`, `ls`, `mkdir`, `cd`, `touch`, `vim`, `cat` e `clear`.
`vim arquivo` abre o editor conectado ao mesmo sistema virtual; `:w` salva,
`:wq` salva e retorna, e `:q`/`:q!` respeitam as alterações. Comandos fora da
lista e operadores de shell são recusados. Nenhum comando real ou arquivo do
computador é acessado. A especificação documenta os limites e o novo `:wq`.

**Verificações locais:** testes do interpretador cobrem a sequência da Aula 1,
leitura do arquivo salvo e rejeição de comandos e caminhos fora do ambiente;
testes do Vim cobrem `:wq`. A auditoria dos 19 documentos, sintaxe JavaScript,
checagem sintática do smoke test e `git diff --check` passaram. O smoke test
Chrome agora também percorre terminal → Vim → terminal e verifica o arquivo.
Chrome não está instalado localmente; o resultado de navegador será confirmado
pelo workflow após a publicação desta alteração.

**Ajuste de experiência após validação com a pessoa responsável:** reduzir a
prática a uma janela visual de terminal com prompt e entrada de comando na
mesma linha. O diretório inicial é `/home/aluno` e contém `teste.txt`; o fluxo
principal é `vim teste.txt`. Ao abrir o arquivo, o editor ocupa a mesma área do
terminal; o nome do arquivo e o modo aparecem na barra de status. Clicar na
janela ativa a linha de comando. Desafios e detalhes técnicos ficam recolhidos.
A página não foca nem rola até a entrada do terminal ao carregar.

**Goal da release 1.0.1:** a solicitação registrada em `GOALS.md` deixa explícito
que a linha editável precisa fazer parte da janela de terminal, eliminando o
campo de comando separado visto na página publicada. O próximo fluxo a validar é
`ls` → `vim teste.txt` → edição no Vim → `:wq` → prompt do terminal.

**Verificação local dessa mudança:** Firefox/WebDriver percorreu o comando
`vim arquivo.txt` por `Enter`, inserção, `:wq` e leitura de volta com `cat`; o
terminal e o Vim alternaram na mesma área. Os testes locais de lógica e auditoria
estática passaram. Chrome/ChromeDriver não estão instalados localmente; a
regressão Chrome foi atualizada no smoke test e precisa passar no workflow antes
da próxima publicação.

**Correção de edição:** a tecla `Backspace` não chegava ao simulador. No modo de
inserção, ela agora apaga o caractere anterior; no início de uma linha, une as
linhas. `u` desfaz a sessão inteira e `.` repete também a sequência de
Backspace. A cobertura inclui início do arquivo, união de linhas, undo e
repetição; o smoke test Chrome verifica a interação de teclado.

**Refino solicitado para a 1.0.1:** a experiência principal deve parecer uma
sessão Linux simples: sem botão de execução, formulário ou caixa de comando
separada. Na camada Linux, somente `pwd`, `ls` e `vim arquivo` funcionam. O
diretório fica fixo em `/home/aluno` e `teste.txt` começa criado. A saída dos
comandos `:wq`, `:q` e `:q!` controla o retorno do Vim; não há botão externo para
fechar o editor. Comandos de administração e consulta como `mkdir`, `cd`,
`touch`, `cat`, `clear` e `help` ficam fora da camada Linux desta prática.
Depois de salvar, a pessoa pode reabrir o arquivo com `vim teste.txt` e conferir
o conteúdo dentro do editor.

**Verificação exigida:** testar digitação por teclado diretamente após o prompt,
rejeição de comandos fora da lista, edição com `Backspace`, recusa de `:q` com
alterações pendentes, salvamento com `:wq` e reabertura do arquivo salvo.

**Verificação local concluída:** Firefox/WebDriver digitou os comandos por
eventos de teclado na linha do prompt, confirmou a ausência do formulário e do
botão de execução, verificou `pwd` e `ls`, a recusa de `cat`, edição com
`Backspace`, bloqueio de `:q` com alterações pendentes, salvamento com `:wq` e
reabertura do conteúdo. Testes unitários e validação do site também passaram.

**Simplificação solicitada da prática:** manter somente a janela de terminal e
um seletor opcional de desafio. A escolha prepara o conteúdo inicial de
`teste.txt`; o aluno abre o arquivo com `vim teste.txt`. Foram removidos os
botões “Ativar simulador”, “Restaurar texto” e “Reiniciar desafio”, além dos
detalhes técnicos recolhidos do editor. Para reiniciar, escolha “Praticar sem
desafio” e selecione o desafio novamente.

**Verificação:** Firefox/WebDriver percorreu os cinco desafios: escolheu cada
um no seletor, abriu `teste.txt` digitando `vim teste.txt`, concluiu a tarefa e
voltou ao terminal com `:q!`. Também confirmou que selecionar novamente um
desafio prepara seu texto inicial e que não há botões de ativação, restauração
ou reinício. Os testes unitários, validação estática, links relativos e
`git diff --check` passaram.

**Publicação da 1.0.1:** o workflow do GitHub Pages agora é acionado por push em
`release/1.0.1`, já que `release/1.0.0` foi encerrada. O push desta versão deve
passar pela validação Chrome do workflow antes de atualizar o site público.

**Ajuste solicitado para a 1.0.1 — desafio persistente e navegação no Vim:** ao
abrir `vim teste.txt`, o painel do desafio deve continuar visível junto ao
editor, em vez de desaparecer. A seleção fica bloqueada enquanto o arquivo
estiver aberto para não trocar o texto-base durante a atividade. No editor, as
setas e `Home`/`End` complementam `h`, `j`, `k`, `l`; o cursor deve acompanhar a
navegação mesmo quando o arquivo ultrapassa a área visível. O painel do desafio
fica preso ao topo da seção de prática durante o uso.

**Implementado nesta rodada:** removido o rótulo “Desafio opcional”; a área de
desafio permanece na tela ao entrar e sair do Vim; o seletor fica desabilitado
durante a edição; setas, `Home` e `End` movem o cursor tanto no modo normal
quanto no modo de inserção; a rolagem interna mantém o cursor visível. QA manual
de teclado, seleção e rolagem deve ser registrado antes da próxima publicação.

**Melhoria de interação Vim:** teste manual reproduziu que `i` entrava em
`INSERT`, porém o comando Ex não aparecia visualmente enquanto era digitado; ao
editar o arquivo, `:q` bloqueava a saída por haver alterações sem salvar e a
mensagem só era anunciada por leitor de tela. A área de prática agora explica
`i`, `Esc`, `:q`, `:wq` e `:q!`, e uma linha visível exibe `:q` antes de
pressionar Enter. Mantém-se a regra do Vim: `:q` sai sem alterações pendentes;
para salvar usa-se `:wq`, e para descartar usa-se `:q!`.
O resultado dos comandos Ex e os avisos, inclusive a recusa de `:q` com
alterações, também ficam visíveis na janela e não dependem de leitor de tela.

**Fonte adicionada:** `FONTES.md` registra o Gist “Comandos VIM” indicado pela
pessoa responsável e delimita que a lista ampla ali reunida não amplia os
comandos aceitos pelo simulador.

**Comando de terminal adicionado:** a solicitação para usar `cat teste.txt`
agora é atendida por um `cat arquivo` restrito ao sistema de arquivos virtual
em `/home/aluno`. O conteúdo salvo com `:wq` pode ser lido pelo terminal; nomes
inexistentes, opções, caminhos externos e operadores são recusados. A
especificação, os guias, a checklist e os testes foram atualizados.

**Cache do navegador:** após a publicação, foi observada uma aba com o HTML novo
e a mensagem de comandos antigos. Uma sessão limpa já carregava `cat`, portanto
o JavaScript local estava em cache. A URL do `terminal.js` agora inclui uma
versão associada à implementação de `cat` para forçar o download após atualizar
a página.

**Tema nas subpáginas:** as páginas derivadas dos materiais agora leem a mesma
preferência `vim-theme` da página inicial, aplicam cores escuras antes de
carregar o CSS e oferecem um botão próprio para alternar o tema. O gerador
Markdown produz a mesma estrutura para aulas, exercícios, módulos e referência.
As URLs do tema e do CSS levam um identificador de versão para não reutilizar
uma folha de estilos antiga do cache do navegador.

**Introdução na página inicial:** foram consultados o site e o manual oficial
do Vim, a manpage do Ubuntu e materiais do Debian. `FONTES.md` registra também
as referências a Nano, Emacs e Micro. A trilha inicial agora explica que Vim é
um editor de texto modal, que se abre a partir do terminal e que há outros
editores no Linux; distingue o Vim do terminal e do próprio Linux.

## Auditoria de promoção da 1.0.0

**Estado do goal:** os quatro resultados descritos em `GOALS.md` estão
implementados: conteúdo, site estático, terminal e Vim simulados em memória e
cinco desafios. As decisões de idioma adicional, nome final e futuro técnico
permanecem decisões de produto, não bloqueios da primeira versão.

**Defeito corrigido antes da promoção:** o botão “Voltar ao terminal” descartava
alterações sem aviso. Agora mantém o editor aberto e explica como salvar com
`:wq` ou descartar com `:q!`. O smoke test Chrome cobre a tentativa de retorno
com alterações pendentes. A checklist manual também registra esse caso.

**Resultado:** a release `1.0.0` é adequada para promoção à `master` depois que
o workflow do commit candidato concluir com sucesso. O escopo é claramente
educacional; os comandos são limitados, não executam processos reais e não
acessam arquivos do aluno. Os materiais e os testes automatizados cobrem os
fluxos publicados. A fala do Orca e a repetição manual de toda a matriz QA não
foram verificadas nesta auditoria; não são bloqueios documentados para o
aceite, mas devem continuar explícitas nos registros.

**Itens mapeados para releases futuras:**

1. Definir uma etapa de prévia para candidatos futuros. O workflow publica
   diretamente no Pages em pushes para `release/1.0.1`, então QA nessa branch
   altera o site público de validação.
2. Completar a matriz manual com o terminal simulado no Firefox, testar a saída
   falada do Orca e, se disponíveis, Safari e dispositivos móveis reais.
3. Ampliar os testes de integração para erros de terminal, `:q` com e sem
   alterações, `:q!`, arquivos vazios e caminhos de arquivo aninhados. O smoke
   test atual cobre o percurso principal e recusa comandos não permitidos.

Esses itens são melhorias planejadas. Não foi encontrado defeito conhecido que
impeça a finalidade declarada da versão 1.0.0 após a correção acima.

## Estado de aceite

Os critérios das Fases 1 a 4 estão verificados por inspeção do conteúdo,
auditoria HTML e de links, testes do simulador e desafios, validações manuais
em Firefox, anúncio braille no Orca e Chrome no GitHub Actions. As evoluções da
Fase 5 permanecem fora do aceite da primeira versão. A saída falada do Orca
não foi testada; os anúncios em braille foram confirmados.
