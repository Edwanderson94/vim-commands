# Vim Commands

Um guia prático, em português, para aprender Vim passo a passo. O conteúdo é
mantido em Markdown para leitura no GitHub e apresentado em páginas estáticas
no site, que também oferece catálogo, simulador e desafios interativos.

## Acesse o site

Abra [Vim Commands — site estático](https://edwanderson94.github.io/vim-commands/site/)
no navegador para usar a trilha, consultar os comandos e praticar. Na área de
prática há um único terminal simulado em `/home/aluno`: digite `vim teste.txt`
diretamente após o prompt e pressione `Enter`. A camada Linux aceita somente
`pwd`, `ls` e `vim`; o arquivo é editado no Vim simulado.
O seletor opcional de desafio prepara `teste.txt` com o texto e a instrução da
atividade escolhida.

## Estado da release 1.0.1

Esta versão simplifica a área de prática para um terminal integrado e um seletor
opcional de desafio. O aluno escolhe o desafio e abre o arquivo com
`vim teste.txt`. O histórico de validações está em [`PLANS.md`](PLANS.md).

## Comece aqui

1. Leia [Primeiros passos](content/getting-started.md).
2. Siga a trilha de aulas na ordem:
   [Aula 1](lessons/01-terminal-e-arquivos.md),
   [Aula 2](lessons/02-primeiro-arquivo-no-vim.md),
   [Aula 3](lessons/03-movimento-e-edicao.md),
   [Aula 4](lessons/04-busca-e-revisao.md) e
   [Aula 5](lessons/05-arquivos-e-janelas.md).
3. Use os módulos de [Navegação](content/navigation.md),
   [Edição](content/editing.md) e [Busca e substituição](content/search-and-replace.md)
   como consulta durante a prática.
4. Faça os exercícios de [modos e inserção](exercises/modos-e-insercao.md),
   [navegação](exercises/navigation.md), [edição](exercises/editing.md),
   [copiar e colar](exercises/copiar-e-colar.md) e [busca](exercises/search.md).

> Socorro: pressione `Esc` para voltar ao modo normal. Use `u` para desfazer
> uma alteração e `:q!` para sair descartando alterações não salvas.

## Conteúdo

- [Primeiros passos](content/getting-started.md)
- [Terminal básico](content/terminal-basics.md)
- [Aula 1 — Terminal e seu primeiro arquivo](lessons/01-terminal-e-arquivos.md)
- [Aula 2 — Seu primeiro arquivo no Vim](lessons/02-primeiro-arquivo-no-vim.md)
- [Aula 3 — Movimento e edição sem as setas](lessons/03-movimento-e-edicao.md)
- [Aula 4 — Busca e revisão de texto](lessons/04-busca-e-revisao.md)
- [Aula 5 — Arquivos e janelas](lessons/05-arquivos-e-janelas.md)
- [Exercício — Modos e inserção](exercises/modos-e-insercao.md)
- [Exercício — Navegação](exercises/navigation.md)
- [Exercício — Edição](exercises/editing.md)
- [Exercício — Copiar e colar](exercises/copiar-e-colar.md)
- [Exercício — Busca e substituição](exercises/search.md)
- [Navegação](content/navigation.md)
- [Edição](content/editing.md)
- [Busca e substituição](content/search-and-replace.md)
- [Arquivos e janelas](content/files-and-windows.md)
- [Cheatsheet — cola rápida](content/cheatsheet.md)
- [Lista original de 30 comandos](commands.md)

## Projeto

- [Especificação do projeto](specification.md)
- [Licença MIT](LICENSE)
