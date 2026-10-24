# Referência dos 30 comandos essenciais do Vim

**Ordem recomendada:** conclua primeiro o módulo Linux de terminal básico e depois o módulo Vim de primeiros passos. Vim é um editor de texto usado no Linux e em outros sistemas, iniciado a partir do terminal.

Os exemplos abaixo acontecem dentro do **Vim**, salvo quando a coluna indica o
terminal. Para os comandos do modo normal, pressione `Esc` antes de começar.
Pratique primeiro em arquivos dentro de `~/vim-pratica`.

| # | Comando | Onde e modo | Categoria | Nível | O que faz | Exemplo | Prática |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `i` | Vim · normal | modos | iniciante | Começa a inserir antes do cursor. | `i`, digite `Olá`, `Esc`. | Acrescente uma palavra no início de uma linha. |
| 2 | `a` | Vim · normal | modos | iniciante | Começa a inserir depois do cursor. | `a`, digite `!`, `Esc`. | Acrescente pontuação depois de uma palavra. |
| 3 | `o` | Vim · normal | modos | iniciante | Abre uma linha abaixo e entra em inserção. | `o`, digite `Praticar ajuda.`, `Esc`. | Acrescente uma linha ao fim de uma nota. |
| 4 | `Esc` | Vim · qualquer modo | modos | iniciante | Volta ao modo normal ou cancela uma operação em digitação. | Pressione `Esc` uma ou duas vezes. | Volte ao modo normal antes de navegar. |
| 5 | `:w` | Vim · linha de comando | arquivos | iniciante | Salva o arquivo atual. | `:w`, `Enter`. | Salve uma alteração em `~/vim-pratica`. |
| 6 | `:q` | Vim · linha de comando | arquivos | iniciante | Sai quando não há alterações sem salvar. | `:q`, `Enter`. | Saia de um arquivo de prática já salvo. |
| 7 | `:wq` | Vim · linha de comando | arquivos | iniciante | Salva e sai. | `:wq`, `Enter`. | Salve e feche sua nota de prática. |
| 8 | `:q!` | Vim · linha de comando | arquivos | iniciante | Sai descartando alterações não salvas. | `:q!`, `Enter`. | Em um arquivo descartável, altere algo e saia sem salvar. |
| 9 | `h`, `j`, `k`, `l` | Vim · normal | navegação | iniciante | Move o cursor para esquerda, baixo, cima e direita. | Pressione `h`, `j`, `k` ou `l`. | Percorra uma linha e depois suba e desça entre duas linhas. |
| 10 | `w` | Vim · normal | navegação | iniciante | Vai ao início da próxima palavra. | Em `vim no terminal`, `w` avança para `no`. | Avance palavra por palavra numa frase curta. |
| 11 | `b` | Vim · normal | navegação | iniciante | Vai ao início da palavra anterior. | Em `vim no terminal`, `b` volta para `vim`. | Volte duas palavras e confira a posição do cursor. |
| 12 | `0` | Vim · normal | navegação | iniciante | Vai ao primeiro caractere da linha. | Pressione `0` em qualquer ponto da linha. | Vá ao início de uma frase longa. |
| 13 | `$` | Vim · normal | navegação | iniciante | Vai ao último caractere da linha. | Pressione `$` em qualquer ponto da linha. | Vá ao fim e depois retorne com `0`. |
| 14 | `gg` | Vim · normal | navegação | iniciante | Vai à primeira linha do arquivo. | Pressione `g` duas vezes. | Vá ao início de um texto com várias linhas. |
| 15 | `G` | Vim · normal | navegação | iniciante | Vai à última linha do arquivo. | Pressione `G` maiúsculo. | Alterne entre a primeira e a última linha. |
| 16 | `:n` | Vim · linha de comando | navegação | iniciante | Vai à linha indicada pelo número. | `:3`, `Enter`. | Vá diretamente para a terceira linha de um arquivo de prática. |
| 17 | `x` | Vim · normal | edição | iniciante | Remove o caractere sob o cursor. | Posicione o cursor e pressione `x`. | Remova um ponto e restaure com `u`. |
| 18 | `dd` | Vim · normal | edição | iniciante | Remove a linha atual e a guarda no registro do Vim. | Pressione `d` duas vezes. | Remova uma linha de prática e desfaça com `u`. |
| 19 | `dw` | Vim · normal | edição | iniciante | Remove da posição atual até o fim da palavra. | Posicione no início de uma palavra e pressione `dw`. | Remova uma palavra curta; use `u` para restaurá-la. |
| 20 | `yy` | Vim · normal | edição | iniciante | Copia a linha atual para o registro do Vim. | Pressione `y` duas vezes. | Copie uma linha sem alterar o texto. |
| 21 | `p` | Vim · normal | edição | iniciante | Cola o registro depois do cursor ou da linha atual. | Use `yy` e depois `p`. | Duplique uma linha dentro de um arquivo de prática. |
| 22 | `u` | Vim · normal | edição | iniciante | Desfaz a última alteração. | Após editar, pressione `u`. | Remova um caractere com `x` e desfaça. |
| 23 | `Ctrl-r` | Vim · normal | edição | iniciante | Refaz uma alteração desfeita. | Pressione `u` e depois `Ctrl-r`. | Desfaça uma edição e refaça-a. |
| 24 | `.` | Vim · normal | edição | iniciante | Repete a última alteração suportada pelo Vim. | Apague um caractere com `x` e pressione `.` em outro. | Insira um sinal de pontuação e repita a alteração. |
| 25 | `/texto` | Vim · normal | busca | iniciante | Busca `texto` a partir do cursor. | Digite `/Vim` e pressione `Enter`. | Busque uma palavra conhecida no arquivo de prática. |
| 26 | `n` | Vim · normal | busca | iniciante | Vai à próxima ocorrência da última busca. | Depois de buscar, pressione `n`. | Visite as ocorrências seguintes da palavra. |
| 27 | `N` | Vim · normal | busca | iniciante | Vai à ocorrência anterior da última busca. | Depois de buscar, pressione `N`. | Volte uma ocorrência e compare com `n`. |
| 28 | `:%s/antigo/novo/g` | Vim · linha de comando | busca e substituição | iniciante | Troca todas as ocorrências em todas as linhas. | `:%s/Vim/Neovim/g`, `Enter`. | Em uma cópia, substitua uma palavra repetida. |
| 29 | `:%s/antigo/novo/gc` | Vim · linha de comando | busca e substituição | iniciante | Pede confirmação para cada substituição. | `:%s/Vim/Neovim/gc`, `Enter`; responda `y` ou `n`. | Confirme algumas trocas e recuse outra. |
| 30 | `:e arquivo` | Vim · linha de comando | arquivos | iniciante | Abre outro arquivo no Vim. | `:e notas.txt`, `Enter`. | Abra outro arquivo dentro de `~/vim-pratica`. |

## Atalhos úteis

- Use um número antes de um comando para repeti-lo: `3dd` remove três linhas.
- `yy` e `p` usam o registro interno do Vim. Eles não acessam a área de
  transferência do sistema.
- `:q!` descarta alterações. Use-o apenas em um arquivo de prática quando essa
  for a intenção.
