# Arquivos e janelas

Depois de dominar edição e navegação, estes comandos ajudam a trabalhar com
mais de um arquivo sem sair do Vim.

## Arquivos

| Comando | Ação |
| :--- | :--- |
| `:e arquivo.txt` | Abre `arquivo.txt`. |
| `:w` | Salva o arquivo atual. |
| `:w novo.txt` | Salva uma cópia como `novo.txt`. |
| `:ls` | Lista os buffers abertos. |
| `:b 2` | Vai para o buffer de número 2. |

Um buffer é um arquivo que o Vim mantém aberto em memória. Você pode alternar
entre buffers mesmo que apenas um esteja visível na tela.

## Janelas divididas

| Comando | Ação |
| :--- | :--- |
| `:split arquivo.txt` | Abre o arquivo em uma divisão horizontal. |
| `:vsplit arquivo.txt` | Abre o arquivo em uma divisão vertical. |
| `Ctrl-w h` | Move para a janela à esquerda. |
| `Ctrl-w j` | Move para a janela abaixo. |
| `Ctrl-w k` | Move para a janela acima. |
| `Ctrl-w l` | Move para a janela à direita. |
| `Ctrl-w q` | Fecha a janela atual. |

## Pratique

Abra dois arquivos pequenos, use `:vsplit` para colocá-los lado a lado e alterne
entre as janelas com `Ctrl-w h` e `Ctrl-w l`.
