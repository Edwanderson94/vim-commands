# Checklist de QA — Vim Commands

Use esta checklist para uma rodada manual de garantia de qualidade (QA). Ela
complementa os testes automatizados e ajuda a verificar a experiência de uma
pessoa iniciante no navegador.

Use uma cópia de trabalho candidata à publicação. Registre o commit exato e
execute os bloqueios de pré-publicação ao final. Um item obrigatório marcado
como `Falhou` ou `Não executado` impede a liberação até ser corrigido ou
verificado.

## Registro da rodada

- Data:
- Pessoa que testou:
- Sistema e versão:
- Navegador e versão:
- Tamanho de tela:
- Commit ou versão testada:
- URL ou origem testada (`file://`, servidor local ou Pages):
- Resultado geral: `Aprovado` / `Reprovado` / `Incompleto`

Marque cada caso como `Passou`, `Falhou` ou `Não executado`. Ao encontrar uma
falha, registre os passos para reproduzi-la, o resultado esperado e o resultado
observado.

## Preparação

- [ ] Confirmar que a versão candidata e o commit anotados correspondem ao
  código que será publicado.
- [ ] Se Markdown mudou, gerar novamente as páginas HTML derivadas com
  `node scripts/render-markdown.mjs`.
- [ ] Abrir `site/index.html` no navegador ou iniciar um servidor estático.
- [ ] Começar com uma sessão limpa do navegador quando testar persistência do
  tema ou progresso.
- [ ] Conferir que a página terminou de carregar e que não há erro visível.

## Jornada de aprendizagem

### QA-01 — Página inicial e trilha

- [ ] Abrir a página inicial.
- [ ] Confirmar que título, introdução e trilha aparecem em português.
- [ ] Verificar que os botões “Começar a aprender” e “Ver cola rápida” ficam
  próximos, sem a dica isolada de `Esc` abaixo deles.
- [ ] Conferir em largura de 320–360 px que os dois botões continuam visíveis,
  podem quebrar linha sem sobreposição e que a introdução não cria rolagem
  horizontal.
- [ ] Ler os quatro cartões do carrossel; conferir a distinção entre terminal,
  editor e sistema Linux e as três curiosidades com fontes registradas em
  `FONTES.md`.
- [ ] Confirmar que o carrossel avança a cada 10 segundos, os botões anterior e
  próxima navegam pelos quatro cartões e a pausa impede a rotação automática.
- [ ] Focar o carrossel com teclado e passar o ponteiro sobre ele; confirmar que
  a rotação pausa durante a interação e quando o carrossel sai da tela. Ativar
  movimento reduzido e confirmar que a rotação inicia pausada.
- [ ] Conferir legibilidade e controles nos temas claro e escuro.
- [ ] Abrir os links das aulas e dos exercícios.
- **Esperado:** cada link abre o material correspondente, sem página ausente ou
  erro de navegação.

### QA-02 — Conteúdo Markdown renderizado

- [ ] Abrir uma aula, um exercício e a cheatsheet pela trilha ou pelos links.
- [ ] Conferir títulos, listas, tabelas e blocos de código.
- **Esperado:** o conteúdo é legível e comandos de terminal e comandos do Vim
  permanecem identificados em seus contextos.

## Catálogo de comandos

### QA-03 — Busca

- [ ] Buscar um comando pela tecla, por exemplo `dd`.
- [ ] Buscar por uma palavra da descrição, por exemplo `apagar`.
- **Esperado:** os cartões correspondentes aparecem sem recarregar a página e a
  contagem de resultados é anunciada.

### QA-04 — Filtros combinados

- [ ] Selecionar uma categoria.
- [ ] Adicionar um nível.
- [ ] Limpar os filtros.
- **Esperado:** o segundo filtro reduz ou mantém os resultados da categoria; ao
  limpar, todos os 30 comandos retornam e o foco volta à busca.

### QA-05 — Nenhum resultado

- [ ] Buscar uma sequência que não corresponda a nenhum comando.
- [ ] Acionar “Limpar filtros”.
- **Esperado:** aparece uma mensagem de estado vazio; limpar restaura os
  resultados e o foco permanece em local previsível.

## Tema, layout e navegação

### QA-06 — Tema claro e escuro

- [ ] Alternar o tema.
- [ ] Recarregar a página.
- **Esperado:** cores e rótulo do botão refletem o tema escolhido, que permanece
  após recarregar.
- [ ] Abrir uma aula, um exercício, um módulo e a referência de comandos com o
  tema escuro selecionado; alternar o tema em uma subpágina e voltar à página
  inicial.
- **Esperado:** todas as páginas usam o tema persistido, incluindo superfícies,
  texto, links, código e tabelas.

### QA-07 — Tela pequena

- [ ] Testar em largura próxima de 320–360 px.
- [ ] Percorrer cabeçalho, catálogo, terminal e simulador.
- **Esperado:** controles permanecem acessíveis e a página não apresenta rolagem
  horizontal geral nem conteúdo cortado.

### QA-08 — Tela ampla

- [ ] Testar em desktop, por exemplo 1280 px ou mais.
- **Esperado:** catálogo e conteúdo usam o espaço disponível sem linhas ou
  controles sobrepostos.

### QA-09 — Teclado

- [ ] Recarregar e navegar pela página usando somente `Tab`, `Shift+Tab`,
  `Enter`, `Espaço` e setas quando aplicável.
- [ ] Observar o foco visível.
- **Esperado:** é possível chegar a links e controles em ordem compreensível; o
  foco não fica preso no simulador.

## Terminal virtual e simulador

### QA-10 — Jornada terminal → Vim → terminal

- [ ] Confirmar o prompt `aluno@vim:/home/aluno$` e o arquivo `teste.txt` com
  `ls`.
- [ ] Confirmar que não há botão “Executar comando simulado”, formulário ou
  campo de comando separado da janela.
- [ ] No mesmo terminal, digitar `vim teste.txt` e pressionar `Enter`.
- [ ] Clicar em outro ponto da tela do terminal e começar a digitar.
- [ ] Confirmar que o editor substitui a tela do terminal e mostra `teste.txt`.
- [ ] No Vim, inserir `Olá, Vim!`, sair do modo de inserção com `Esc` e salvar com
  `:wq`.
- [ ] No terminal retornado, reabrir `vim teste.txt` e conferir o texto salvo.
- [ ] Com alteração pendente, tentar `:q`, confirmar que o Vim permanece aberto
  e sair com `:q!`; testar `:wq` para salvar e voltar.
- **Esperado:** existe uma janela de terminal com a entrada de comando dentro
  dela e sem botão de execução ou campo separado; `teste.txt` já existe em
  `/home/aluno`. `:wq` salva e retorna; o arquivo reabre com o conteúdo salvo.
  `:q` mantém alterações pendentes no editor e `:q!` descarta as alterações.

### QA-10a — Escolher um desafio

- [ ] Escolher um desafio no seletor e confirmar que o terminal permanece visível
  com a instrução do desafio.
- [ ] Digitar `vim teste.txt` e resolver o desafio no arquivo preparado.
- [ ] Selecionar “Praticar sem desafio” e escolher o mesmo desafio para reiniciá-lo.
- **Esperado:** o seletor prepara o conteúdo inicial de `teste.txt`; o aluno abre
  o editor pelo comando Vim normal. Não há botão para ativar o simulador,
  restaurar texto ou reiniciar o desafio.

### QA-11 — Comandos permitidos e limites do terminal

- [ ] Conferir que os materiais distinguem comandos de um terminal Linux real
  da lista reduzida aceita pelo simulador web.
- [ ] Executar `pwd`, `ls`, `cat teste.txt` e `vim teste.txt`.
- [ ] Salvar algum texto no Vim com `:wq` e confirmar que `cat teste.txt`
  mostra o conteúdo salvo.
- [ ] Executar `clear` após mostrar saídas e conferir que o histórico some; depois
  usar `cat teste.txt` para confirmar que os arquivos continuam salvos.
- [ ] Tentar comandos que não pertencem ao terminal mínimo: `help`,
  `touch outro.txt` e `cd /tmp`.
- [ ] Tentar abrir caminho fora da pasta virtual com `vim ../fora.txt`.
- [ ] Tentar arquivos inexistentes e opções não suportadas: `cat inexistente.txt`,
  `cat ../fora.txt`, `cat -n teste.txt`, `vim ../fora.txt` e `vim -c`.
- [ ] Tentar `clear extra` e confirmar que o terminal informa o uso correto e
  mantém o histórico existente.
- [ ] Tentar encadear comandos, por exemplo `pwd; ls`.
- **Esperado:** `pwd`, `ls`, `cat arquivo`, `clear` e `vim arquivo` são aceitos;
  `clear` limpa a tela sem apagar arquivos e não aceita argumentos; `cat`
  só lê arquivos virtuais existentes em `/home/aluno`. Outros comandos,
  caminhos fora da pasta e operadores de shell são recusados. Nenhum comando
  real do sistema é executado.

### QA-12 — Foco e captura de teclas

- [ ] Antes de abrir o Vim, pressionar letras e `Tab` fora da linha de comando.
- [ ] Digitar um comando com um caractere errado, mover o cursor com `←`,
  corrigi-lo com `Backspace` e executar a forma corrigida com `Enter`.
- [ ] Em um celular ou tablet, tocar na janela do terminal e confirmar que a
  linha de comando recebe foco e o teclado virtual pode ser usado.
- [ ] Abrir `vim teste.txt` pelo terminal, pressionar `i`, digitar texto e
  pressionar `Esc`.
- [ ] Usar `Tab` para sair da área e seguir para o próximo controle.
- **Esperado:** o Vim só captura teclas depois de ser aberto pelo terminal e
  enquanto está focado; `Tab` continua navegando a página.

### QA-13 — Edição e recuperação

- [ ] No modo de inserção, digitar texto e usar `Backspace` para remover o
  caractere anterior.
- [ ] Posicionar o cursor no início de uma linha e usar `Backspace` para uni-la
  à linha anterior; em seguida, desfazer com `u`.
- [ ] Experimentar `dd`, `yy`, `p`, `u` e `Ctrl-r` em linhas de prática.
- **Esperado:** comandos alteram apenas o texto em memória e desfazer/refazer
  atualizam o conteúdo. Para restaurar um desafio, selecione “Praticar sem
  desafio” e escolha o desafio novamente.

### QA-14 — Desafios

- [ ] Completar cada um dos cinco desafios usando as instruções exibidas.
- [ ] Abrir `vim teste.txt` com um desafio selecionado.
- [ ] Digitar `i` e confirmar que o modo exibido muda para `INSERT`; digitar
  texto, pressionar `Esc` e confirmar o retorno a `NORMAL`.
- [ ] Digitar `:q` e confirmar que o comando aparece na linha Ex antes de
  pressionar `Enter`.
- [ ] Com arquivo sem alterações, usar `:q` e confirmar retorno ao terminal;
  com alterações, confirmar o aviso e testar `:wq` e `:q!`.
- [ ] Confirmar que o título e a instrução do desafio continuam visíveis e que
  a seleção fica bloqueada enquanto o Vim está aberto.
- [ ] Percorrer um arquivo com mais linhas que a janela do Vim e mover o cursor
  com `h`, `j`, `k`, `l`, setas, `Home` e `End`.
- [ ] No desafio de apagar uma linha, remover uma linha errada antes de tentar
  novamente.
- [ ] Reiniciar um desafio pelo seletor, escolhendo “Praticar sem desafio” e
  depois o desafio novamente.
- **Esperado:** cada desafio correto mostra conclusão; uma ação incorreta não é
  aceita como sucesso; selecionar novamente restaura o texto inicial; o painel
  do desafio permanece visível durante a edição e o cursor continua visível ao
  navegar pelo arquivo.

## Acessibilidade exploratória

### QA-15 — Nomes e estados dos controles

- [ ] Conferir se busca, filtros, entrada do terminal, botões e simulador têm
  nomes compreensíveis.
- [ ] Confirmar que modo `NORMAL`/`INSERT`, resultados e conclusão são indicados
  por texto, não apenas por cor.
- **Esperado:** estados e ações importantes são identificáveis sem depender
  somente de pistas visuais.

### QA-16 — Leitor de tela

- [ ] Com leitor de tela disponível, percorrer título, navegação, busca,
  simulador e mensagens dinâmicas.
- [ ] Registrar leitor, navegador e se a saída falada ou outra forma de saída
  foi observada.
- **Esperado:** nomes, funções e mensagens principais podem ser percebidos e
  fazem sentido no fluxo.

## Compatibilidade e regressão

### QA-17 — Navegadores

- [ ] Repetir os fluxos essenciais em Firefox e Chromium/Chrome, se disponíveis.
- [ ] Conferir a página por `file://` e por servidor estático quando ambos forem
  suportados no ambiente de teste.
- **Esperado:** catálogo, estilos, links, terminal virtual e simulador carregam
  nos ambientes testados.

### QA-18 — Funcionamento offline

- [ ] Abrir o site sem conexão com a internet.
- [ ] Usar busca, filtros, páginas de materiais e simulador.
- **Esperado:** as funções locais continuam disponíveis e não dependem de
  serviços externos.

## Testes automatizados existentes

Execute na raiz do repositório:

```bash
node tests/simulator.test.mjs
python3 tests/site-validation.py
```

`tests/chrome-smoke.py` cobre fluxos de navegador no ambiente de CI com Chrome e
ChromeDriver disponíveis. Consulte [site/README.md](../site/README.md) para
detalhes de execução.

## Bloqueio de pré-publicação

Execute na raiz do repositório, na versão candidata:

```bash
node scripts/render-markdown.mjs
node tests/simulator.test.mjs
python3 tests/site-validation.py
python3 tests/chrome-smoke.py
git diff --check
```

- [ ] Todos os comandos acima terminaram com sucesso. O smoke test Chrome deve
  rodar num ambiente que tenha Chrome e ChromeDriver; no fluxo atual, o GitHub
  Actions fornece esse ambiente.
- [ ] Links relativos, páginas derivadas, comandos documentados e especificação
  correspondem à implementação candidata.
- [ ] Os casos manuais essenciais QA-01, QA-03, QA-04, QA-07, QA-09, QA-10,
  QA-11, QA-12, QA-14 e QA-15 foram executados e passaram.
- [ ] Nenhum defeito bloqueador ou alto permanece aberto. Defeitos menores têm
  responsável, impacto e decisão registrados.
- [ ] A origem de publicação e o workflow foram conferidos para a versão-alvo.
  O workflow atual publica a branch `release/1.0.0`; para outra branch de
  release, confirme o gatilho antes de publicar.
- [ ] O commit aprovado está identificado e o registro desta rodada foi
  preenchido. Marque o resultado geral `Aprovado` somente quando todos os
  bloqueios forem atendidos.

## Verificação após publicação

Depois que o workflow de publicação concluir:

- [ ] Confirmar que o workflow do commit aprovado terminou com sucesso,
  incluindo validação, preparação do artefato e publicação.
- [ ] Abrir a URL pública e confirmar que carrega sem erro e corresponde à
  versão aprovada; validar uma função essencial, como busca ou o percurso
  terminal → Vim → terminal.
- [ ] Registrar URL, commit publicado e link da execução do workflow no registro
  da rodada.

## Registro de defeitos

Para cada falha, anote:

```text
ID do caso:
Resultado: Falhou
Passos para reproduzir:
Resultado esperado:
Resultado observado:
Navegador/tela:
Captura ou log, se disponível:
```
