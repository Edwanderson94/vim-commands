# Primeiros passos no Vim

O Vim trabalha com modos. No começo, isso parece estranho, mas é o que torna a
edição rápida quando os comandos se tornam familiares.

## Os dois modos essenciais

| Modo | Para que serve | Como entrar |
| :--- | :--- | :--- |
| Normal | Mover, copiar, apagar e executar comandos | `Esc` |
| Inserção | Digitar ou alterar texto | `i`, `a` ou `o` |

Ao abrir o Vim, você normalmente começa no modo normal. Se algo não funcionar
como esperado, pressione `Esc` uma ou duas vezes e tente novamente.

## Primeiro contato

1. Abra um arquivo: `vim anotacoes.txt`.
2. Pressione `i` e digite uma frase.
3. Pressione `Esc` para voltar ao modo normal.
4. Digite `:w` e pressione `Enter` para salvar.
5. Digite `:q` e pressione `Enter` para sair.

## Comandos de sobrevivência

| Comando | O que faz |
| :--- | :--- |
| `Esc` | Volta ao modo normal ou cancela a operação atual. |
| `i` | Insere texto antes do cursor. |
| `a` | Insere texto depois do cursor. |
| `o` | Cria uma linha abaixo e entra no modo de inserção. |
| `:w` | Salva o arquivo. |
| `:q` | Fecha o Vim quando não há alterações pendentes. |
| `:wq` | Salva e fecha. |
| `:q!` | Fecha descartando alterações não salvas. |

## Pratique

Crie `teste-vim.txt`, escreva seu nome, salve e saia. Abra o arquivo outra vez,
adicione uma segunda linha e use `:q!` sem salvar. Ao abrir novamente, a segunda
linha não deve estar no arquivo.
