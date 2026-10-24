# Navegação no Vim

**Pré-requisito:** conclua [Módulo Linux — Terminal básico](terminal-basics.md)
e [Módulo Vim — Primeiros passos](getting-started.md).

No modo normal, você move o cursor sem precisar das setas. Comece devagar: os
comandos abaixo parecem pequenos, mas são usados o tempo todo.

## Movimento básico

| Comando | Ação |
| :--- | :--- |
| `h` | Move um caractere para a esquerda. |
| `j` | Move uma linha para baixo. |
| `k` | Move uma linha para cima. |
| `l` | Move um caractere para a direita. |
| `w` | Vai ao início da próxima palavra. |
| `b` | Vai ao início da palavra anterior. |
| `0` | Vai ao início da linha. |
| `$` | Vai ao fim da linha. |
| `gg` | Vai à primeira linha do arquivo. |
| `G` | Vai à última linha do arquivo. |
| `:25` | Vai diretamente à linha 25. |

## Repetições

Coloque um número antes de muitos comandos para repeti-los. Por exemplo:

- `5j` desce cinco linhas.
- `3w` avança três palavras.
- `10G` vai para a linha 10.

## Pratique

Abra um texto com várias linhas. Use `gg` para ir ao começo, `G` para ir ao
fim e `:número` para visitar uma linha específica. Depois, tente chegar ao fim
de uma linha apenas com `$`.
