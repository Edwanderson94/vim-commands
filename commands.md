# 30 comandos essenciais do Vim

Antes de usar a maioria dos comandos abaixo, pressione `Esc` para entrar no
modo normal.

## Modos e saída

| # | Comando | Descrição |
| :-- | :-- | :-- |
| 1 | `i` | Entra no modo de inserção antes do cursor. |
| 2 | `a` | Entra no modo de inserção depois do cursor. |
| 3 | `o` | Cria uma linha abaixo da atual e entra no modo de inserção. |
| 4 | `Esc` | Volta ao modo normal ou cancela a operação atual. |
| 5 | `:w` | Salva o arquivo. |
| 6 | `:q` | Fecha o Vim, se não houver alterações não salvas. |
| 7 | `:wq` | Salva o arquivo e fecha o Vim. |
| 8 | `:q!` | Fecha o Vim descartando alterações não salvas. |

## Navegação

| # | Comando | Descrição |
| :-- | :-- | :-- |
| 9 | `h`, `j`, `k`, `l` | Move o cursor para esquerda, baixo, cima e direita. |
| 10 | `w` | Move para o início da próxima palavra. |
| 11 | `b` | Move para o início da palavra anterior. |
| 12 | `0` | Move para o início da linha. |
| 13 | `$` | Move para o fim da linha. |
| 14 | `gg` | Move para a primeira linha do arquivo. |
| 15 | `G` | Move para a última linha do arquivo. |
| 16 | `:n` | Move para a linha `n`; exemplo: `:25`. |

## Edição

| # | Comando | Descrição |
| :-- | :-- | :-- |
| 17 | `x` | Remove o caractere sob o cursor. |
| 18 | `dd` | Remove (recorta) a linha atual. |
| 19 | `dw` | Remove da posição atual até o fim da palavra. |
| 20 | `yy` | Copia a linha atual. |
| 21 | `p` | Cola o conteúdo copiado ou removido depois do cursor. |
| 22 | `u` | Desfaz a última alteração. |
| 23 | `Ctrl-r` | Refaz a alteração desfeita. |
| 24 | `.` | Repete a última alteração. |

## Busca e substituição

| # | Comando | Descrição |
| :-- | :-- | :-- |
| 25 | `/texto` | Busca `texto` a partir da posição atual. |
| 26 | `n` | Vai para a próxima ocorrência da última busca. |
| 27 | `N` | Vai para a ocorrência anterior da última busca. |
| 28 | `:%s/antigo/novo/g` | Substitui todas as ocorrências de `antigo` por `novo`. |
| 29 | `:%s/antigo/novo/gc` | Substitui todas as ocorrências, pedindo confirmação em cada uma. |

## Arquivos

| # | Comando | Descrição |
| :-- | :-- | :-- |
| 30 | `:e arquivo` | Abre um arquivo; exemplo: `:e notes.txt`. |

## Atalhos úteis

- Use um número antes de um comando para repeti-lo: `3dd` remove três linhas.
- Para copiar para a área de transferência do sistema (quando disponível), use
  `"+yy`; para colar, use `"+p`.
