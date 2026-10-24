# Edição de texto

Os comandos desta página devem ser usados no modo normal. Pressione `Esc` antes
de começar.

## Inserir texto

| Comando | Ação |
| :-- | :-- |
| `i` | Insere antes do cursor. |
| `a` | Insere depois do cursor. |
| `o` | Abre uma linha abaixo e entra no modo de inserção. |

## Remover, copiar e colar

| Comando | Ação |
| :-- | :-- |
| `x` | Remove o caractere sob o cursor. |
| `dd` | Remove a linha atual. |
| `dw` | Remove até o fim da palavra. |
| `yy` | Copia a linha atual. |
| `p` | Cola depois do cursor ou da linha atual. |
| `u` | Desfaz a última alteração. |
| `Ctrl-r` | Refaz uma alteração desfeita. |
| `.` | Repete a última alteração. |

Quando você remove algo com `dd` ou `dw`, o Vim o guarda temporariamente. Por
isso, `p` também pode colar texto que acabou de ser removido.

## Pratique

Escreva três linhas. Copie a primeira com `yy`, vá até a última e pressione
`p`. Remova uma linha com `dd`, restaure-a com `u` e depois refaça a remoção
com `Ctrl-r`.
