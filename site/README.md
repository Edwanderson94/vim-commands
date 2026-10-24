# Site do Vim Commands

Interface estática, offline e sem dependências externas. Abra `index.html` em
um navegador moderno ou sirva a raiz do projeto. Ela oferece trilha, catálogo
pesquisável dos 30 comandos, filtros, tema, simulador educacional, cinco
desafios e páginas HTML geradas dos materiais Markdown.

Depois de editar um arquivo Markdown, gere novamente as páginas derivadas com
`node scripts/render-markdown.mjs`. O workflow do GitHub Pages executa essa
etapa antes de publicar.

## Verificação de desenvolvimento

Na raiz do repositório, execute:

```bash
node tests/simulator.test.mjs
python3 tests/site-validation.py
```

O workflow executa as mesmas verificações antes de preparar o site para
publicação. No runner do GitHub Actions, também executa
`tests/chrome-smoke.py` com Chrome e ChromeDriver pré-instalados para conferir
layout móvel, controles, simulador e desafios. Esse teste de navegador não
exige dependências adicionais na máquina local.
