# Aula 3 — Movimento e edição sem as setas

**Duração estimada:** 20 minutos

**Nível:** iniciante
**Pré-requisito:** ter concluído a [Aula 2](02-primeiro-arquivo-no-vim.md).

## Objetivo

Ao final desta aula, você conseguirá percorrer e editar um texto no modo normal com movimentos, remoção, cópia, colagem e desfazer.

## Conceitos

No **terminal**, abra `treino-edicao.txt`:

```bash
cd ~/vim-pratica
vim treino-edicao.txt
```

Dentro do **Vim**, pressione `i`, digite o texto abaixo e pressione `Esc`:

```text
Vim recompensa a prática.
Movimentos pequenos economizam tempo.
Aprender aos poucos é suficiente.
```

Agora você está no modo normal. Use estes comandos para mover o cursor:

| Comando | Movimento |
| :--- | :--- |
| `h` `j` `k` `l` | Esquerda, baixo, cima e direita. |
| `w` / `b` | Próxima palavra / palavra anterior. |
| `0` / `$` | Início / fim da linha atual. |
| `gg` / `G` | Primeira / última linha do arquivo. |

No modo normal, `x` remove um caractere, `dd` remove uma linha e `dw` remove até o fim da palavra. Use `u` para desfazer e `Ctrl-r` para refazer.

Para copiar uma linha, pressione `yy`. Vá ao destino e use `p` para colar. O `p` também cola texto removido por `dd` ou `dw`.

## Prática guiada

1. Vá à primeira linha com `gg` e ao fim dela com `$`.
2. Apague o ponto final com `x` e use `u` para restaurá-lo.
3. Copie a primeira linha com `yy`, vá ao fim do arquivo com `G` e cole com `p`.
4. Remova a segunda linha com `dd` e use `u` para trazê-la de volta.
5. Salve com `:w` e pressione `Enter`.

Você concluiu se o arquivo tiver as três linhas originais e uma cópia da primeira no final.

## Desafio

Sem usar as setas, vá até a palavra `pequenos` com `w` ou `b` e remova-a com `dw`. Use `u` para restaurá-la. Depois, duplique a última linha com `yy` e `p`.

## Revisão

| Modo | Comando | Resultado |
| :--- | :--- | :--- |
| Normal | `h` `j` `k` `l` | Move o cursor. |
| Normal | `w` / `b`, `gg` / `G` | Move por palavras ou pelo arquivo. |
| Normal | `x`, `dd`, `dw` | Remove caractere, linha ou palavra. |
| Normal | `yy` / `p` | Copia / cola. |
| Normal | `u` / `Ctrl-r` | Desfaz / refaz. |

### Autoavaliação

Você consegue duplicar uma linha sem entrar no modo de inserção?
