# Site do Vim Commands

Interface estática, offline e sem dependências externas. Abra `index.html` em
um navegador moderno ou sirva a raiz do projeto. O site oferece uma introdução
em carrossel com quatro cartões sobre Vim, troca automática a cada 10 segundos
e controle de pausa, trilha, catálogo pesquisável dos 30 comandos, filtros,
tema, simulador, cinco desafios
e páginas HTML derivadas dos materiais Markdown. Na área de prática, uma única
janela de terminal em `/home/aluno` já contém `teste.txt`; não há botão de
execução ou campo de comando separado. Digite `vim teste.txt` diretamente no
prompt para abrir o arquivo no Vim simulado. A camada Linux aceita somente
`pwd`, `ls`, `cat arquivo`, `clear` e `vim arquivo`; `clear` remove o histórico
visível sem apagar arquivos, e `cat` lê arquivos salvos na pasta virtual, por
exemplo `cat teste.txt` após `:wq`. A trilha começa pelo módulo Linux/terminal e
segue para o módulo Vim: Vim é um editor usado no Linux, não o sistema operacional. O seletor prepara o texto de um desafio no mesmo arquivo
`teste.txt`; o aluno o abre pelo terminal com `vim teste.txt`. O painel e a
instrução do desafio permanecem visíveis durante a edição, e a seleção fica
bloqueada até o Vim ser fechado. O cursor pode ser navegado com `h`, `j`, `k`,
`l`, setas, `Home` e `End`. Terminal e arquivos existem somente em memória.
O tema escolhido é compartilhado entre a página inicial e todas as subpáginas
de materiais, que também têm um controle para alterná-lo.

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
