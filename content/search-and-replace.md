# Busca e substituição

Use estes comandos no modo normal. Eles ajudam a encontrar e alterar texto sem
percorrer o arquivo manualmente.

## Buscar texto

| Comando | Ação |
| :-- | :-- |
| `/texto` | Busca `texto` a partir da posição atual. |
| `n` | Vai para a próxima ocorrência da última busca. |
| `N` | Volta para a ocorrência anterior da última busca. |

Depois de digitar `/texto`, pressione `Enter` para iniciar a busca. Para
cancelar uma busca ainda sendo digitada, pressione `Esc`.

## Substituir texto

| Comando | Ação |
| :-- | :-- |
| `:s/antigo/novo/` | Troca a primeira ocorrência na linha atual. |
| `:s/antigo/novo/g` | Troca todas as ocorrências na linha atual. |
| `:%s/antigo/novo/g` | Troca todas as ocorrências em todo o arquivo. |
| `:%s/antigo/novo/gc` | Troca todas, pedindo confirmação em cada uma. |

O `g` significa todas as ocorrências da linha; `%` significa todas as linhas do
arquivo; `c` pede confirmação. Para iniciantes, `:%s/antigo/novo/gc` é a opção
mais segura porque permite revisar cada alteração.

## Pratique

Escreva a palavra `Vim` três vezes em linhas diferentes. Busque com `/Vim`, use
`n` e `N` para percorrer os resultados e, por fim, troque tudo por `Neovim` com
`:%s/Vim/Neovim/gc`.
