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

- [ ] No terminal virtual, executar `mkdir -p ~/vim-pratica`.
- [ ] Entrar com `cd ~/vim-pratica`.
- [ ] Abrir `vim ola.txt`.
- [ ] No Vim, inserir `Olá, Vim!`, sair do modo de inserção com `Esc` e salvar com
  `:wq`.
- [ ] No terminal, executar `ls` e depois `cat ola.txt`.
- [ ] Abrir `vim rascunho.txt`, inserir texto, sair com `Esc` e tentar “Voltar ao
  terminal” antes de salvar.
- **Esperado:** o arquivo aparece na listagem e `cat` mostra o texto salvo.
  Com alterações pendentes, o botão de retorno mantém o editor aberto e explica
  como salvar ou descartar.

### QA-11 — Comandos permitidos e limites do terminal

- [ ] Executar `help`, `pwd`, `ls`, `touch`, `cat` e `clear`.
- [ ] Tentar um comando não permitido, por exemplo `rm -rf /`.
- [ ] Tentar caminhos fora da pasta virtual, por exemplo `cd ../../..`.
- [ ] Tentar encadear comandos, por exemplo `pwd; ls`.
- **Esperado:** comandos documentados funcionam; comandos não permitidos,
  caminhos fora do ambiente e operadores de shell são recusados. Nenhum comando
  real do sistema é executado.

### QA-12 — Foco e captura de teclas

- [ ] Antes de ativar o simulador, pressionar letras e `Tab`.
- [ ] Ativar o simulador e pressionar `i`, digitar texto e pressionar `Esc`.
- [ ] Usar `Tab` para sair da área e seguir para o próximo controle.
- **Esperado:** o simulador só captura teclas quando ativado e focado; `Tab`
  continua navegando a página.

### QA-13 — Edição e recuperação

- [ ] Experimentar `dd`, `yy`, `p`, `u` e `Ctrl-r` em linhas de prática.
- [ ] Acionar “Restaurar texto”.
- **Esperado:** comandos alteram apenas o texto em memória; desfazer/refazer
  atualizam o conteúdo e restaurar retorna ao texto inicial.

### QA-14 — Desafios

- [ ] Completar cada um dos cinco desafios usando as instruções exibidas.
- [ ] No desafio de apagar uma linha, remover uma linha errada antes de tentar
  novamente.
- [ ] Reiniciar um desafio.
- **Esperado:** cada desafio correto mostra conclusão; uma ação incorreta não é
  aceita como sucesso; reiniciar restaura o estado inicial.

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
