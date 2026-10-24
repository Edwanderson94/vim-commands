# Site do Vim Commands

Interface estática, offline e sem dependências externas. Abra `index.html` em
um navegador moderno ou sirva a raiz do projeto. O site oferece trilha,
catálogo pesquisável dos 30 comandos, filtros, tema, simulador, cinco desafios
e páginas HTML derivadas dos materiais Markdown. Na área de prática, uma única
janela de terminal em `/home/aluno` já contém `teste.txt`; não há botão de
execução ou campo de comando separado. Digite `vim teste.txt` diretamente no
prompt para abrir o arquivo no Vim simulado. A camada Linux aceita somente
`pwd`, `ls` e `vim`. O seletor opcional prepara o texto de um desafio no mesmo
arquivo `teste.txt`; o aluno o abre pelo terminal com `vim teste.txt`. Terminal
e arquivos existem somente em memória.

## Estado da release 1.0.1

O site da release 1.0.1 é publicado a partir da branch `release/1.0.1` em
[GitHub Pages](https://edwanderson94.github.io/vim-commands/site/). O Orca
confirmou os anúncios pela saída braille na primeira versão. Consulte o
[plano e os registros de validação](../PLANS.md).

## Desenvolvimento

Depois de editar Markdown, gere novamente as páginas derivadas:

```bash
node scripts/render-markdown.mjs
```

Execute as verificações locais na raiz do repositório:

```bash
node tests/simulator.test.mjs
python3 tests/site-validation.py
```

Para uma rodada manual de QA, use a [checklist de testes](../tests/qa-checklist.md).

O workflow executa essas verificações e também `tests/chrome-smoke.py` com
Chrome e ChromeDriver disponíveis no runner do GitHub Actions.
