# Objetivos do Vim Commands

## Goal ativo — Release 1.0.1

**Objetivo:** aproximar a prática do uso de um terminal Linux simples. A área
de prática terá uma única janela de terminal, com a linha de comando dentro da
própria janela; não haverá uma caixa de comando separada. O shell começa em
`/home/aluno` com `teste.txt` já criado. Ao digitar `vim teste.txt` e pressionar
`Enter`, o arquivo abre no Vim simulado na mesma área.

**Critérios de conclusão:**

- O comando é digitado diretamente após o prompt `aluno@vim:/home/aluno$`.
- A janela não mostra botão de execução, formulário nem campo separado para
  digitar comandos.
- Na camada Linux simulada, só `pwd`, `ls` e `vim arquivo` são aceitos; `ls`
  lista o arquivo inicial `teste.txt`, e `vim teste.txt` abre esse arquivo.
- A área de prática oferece somente o terminal e um seletor de desafio. Escolher
  um desafio prepara o texto inicial em `teste.txt`; o aluno inicia pelo comando
  normal `vim teste.txt`.
- Não há controles “Ativar simulador”, “Restaurar texto” ou “Reiniciar desafio”.
- O Vim aceita a prática declarada, inclusive `Backspace`, `:wq` e retorno ao
  prompt com o conteúdo salvo na memória virtual.
- A interação funciona por teclado e permanece segura, sem executar comandos
  reais nem acessar arquivos do computador.
- Especificação, checklist e plano refletem o fluxo; testes automatizados e
  validação manual cobrem o percurso terminal → Vim → terminal.

**Fora do escopo:** implementar um shell Linux completo ou executar comandos
do sistema operacional. O simulador continua usando uma lista restrita de
comandos e arquivos em memória.

**Branch de trabalho:** `release/1.0.1`.

## Propósito

Oferecer um ambiente gratuito, em português do Brasil, para aprender Vim no
terminal com explicações curtas, prática progressiva, referência rápida e um
simulador educacional seguro.

## Público

- Pessoas iniciantes no terminal Linux e no Vim.
- Autodidatas que querem uma trilha prática.
- Desenvolvedores que precisam consultar comandos rapidamente.

## Resultados e sucesso

- A trilha de cinco aulas, os módulos, os 30 comandos e cinco exercícios são
  legíveis em Markdown no GitHub.
- O site estático e os materiais funcionam offline, em celular e desktop, com
  catálogo pesquisável, filtros, tema e conteúdo renderizado.
- O terminal virtual e o editor Vim simulado suportam somente os comandos
  definidos em `specification.md`, mantêm arquivos em memória, permitem
  praticar o fluxo entre terminal e Vim e escolher cinco desafios pelo seletor
  simples da área de prática.
- A experiência é utilizável por teclado e não acessa dados ou arquivos locais.

## Escopo atual

Conteúdo Markdown, site estático em HTML/CSS/JavaScript puro, catálogo local,
simulador em memória e desafios educacionais.

## Não objetivos

Não substituir o Vim instalado, editar arquivos do computador, usar
autenticação, rastreamento, dependências externas ou publicar sem autorização.

## Restrições

Separar terminal de Vim; priorizar linguagem simples e prática segura; manter
Markdown como fonte de conteúdo; usar caminhos relativos; não ampliar o
simulador fora da especificação.

## Decisões pendentes

- Nome final do projeto.
- Português somente ou inglês adicional.
- Permanência de JavaScript puro versus gerador estático.
- Estratégia de idioma adicional, caso seja priorizado.
