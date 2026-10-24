# Site do Vim Commands

Interface estática, offline e sem dependências externas. Abra `index.html` em
um navegador moderno ou sirva a raiz do projeto. O site oferece trilha,
catálogo pesquisável dos 30 comandos, filtros, tema, simulador, cinco desafios
e páginas HTML derivadas dos materiais Markdown. A área de prática inclui um
terminal virtual com comandos permitidos e arquivos temporários em memória,
conectado ao editor Vim simulado.

## Estado da release 1.0.0

As fases 1 a 4 e os critérios de aceite da primeira versão foram concluídos.
O site está publicado para validação em
[GitHub Pages](https://edwanderson94.github.io/vim-commands/site/). O Orca
confirmou os anúncios pela saída braille; a saída falada não foi testada.
Consulte o [plano e os registros de validação](../PLANS.md).

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

O workflow executa essas verificações e também `tests/chrome-smoke.py` com
Chrome e ChromeDriver disponíveis no runner do GitHub Actions.
