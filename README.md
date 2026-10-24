# Vim Commands

Um guia prático, em português, para aprender Vim passo a passo. O conteúdo é
mantido em Markdown para leitura no GitHub e apresentado em páginas estáticas
no site, que também oferece catálogo, simulador e desafios interativos.

**Publicadora do conteúdo:** EDEVOPS.

## Acesse o site

Abra [Vim Commands — site estático](https://edwanderson94.github.io/vim-commands/site/)
no navegador para usar a trilha, consultar os comandos e praticar. Na área de
prática há um único terminal simulado em `/home/aluno`: digite `vim teste.txt`
diretamente após o prompt e pressione `Enter`. A camada Linux aceita `pwd`,
`ls`, `cat arquivo`, `clear` e `vim arquivo`; `clear` limpa apenas o histórico
visível, sem apagar arquivos. `cat teste.txt` exibe o conteúdo salvo e o arquivo
pode ser editado no Vim simulado.
O painel do desafio permanece visível quando o Vim abre. Escolha uma atividade
antes de editar; a seleção fica bloqueada enquanto o arquivo estiver aberto.

## Estado da release 1.0.1

Esta versão simplifica a área de prática para um terminal integrado. O painel
do desafio permanece visível com o Vim aberto, e o aluno abre o arquivo com
`vim teste.txt`. O histórico de validações está em [`PLANS.md`](PLANS.md).

## Comece aqui

1. Comece pelo [Módulo Linux — Terminal básico](content/terminal-basics.md).
2. Depois, estude o [Módulo Vim — Primeiros passos](content/getting-started.md).
   Os exemplos de `cd`, `mkdir` e `touch` nos materiais são para um terminal
   Linux real; a prática no site aceita somente os comandos descritos acima.
   O Vim é um editor de texto muito usado no Linux e aberto a partir do terminal;
   não é o próprio Linux e também está disponível em outros sistemas.
3. Siga a trilha de aulas na ordem:
   [Aula 1](lessons/01-terminal-e-arquivos.md),
   [Aula 2](lessons/02-primeiro-arquivo-no-vim.md),
   [Aula 3](lessons/03-movimento-e-edicao.md),
   [Aula 4](lessons/04-busca-e-revisao.md) e
   [Aula 5](lessons/05-arquivos-e-janelas.md).
4. Use os módulos de [Navegação](content/navigation.md),
   [Edição](content/editing.md) e [Busca e substituição](content/search-and-replace.md)
   como consulta durante a prática.
5. Faça os exercícios de [modos e inserção](exercises/modos-e-insercao.md),
   [navegação](exercises/navigation.md), [edição](exercises/editing.md),
   [copiar e colar](exercises/copiar-e-colar.md) e [busca](exercises/search.md).

> Socorro: pressione `Esc` para voltar ao modo normal. Use `u` para desfazer
> uma alteração e `:q!` para sair descartando alterações não salvas.

## Conteúdo

- [Módulo Linux — Terminal básico](content/terminal-basics.md)
- [Módulo Vim — Primeiros passos](content/getting-started.md)
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
- [Fontes e referências](FONTES.md)

## Projeto

- [Goal ativo e objetivos do projeto](GOALS.md)
- [Especificação do projeto](specification.md)
- [Licença MIT](LICENSE)
