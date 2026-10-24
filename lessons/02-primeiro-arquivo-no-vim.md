# Aula 2 — Seu primeiro arquivo no Vim

**Duração estimada:** 15 minutos

**Nível:** iniciante
**Pré-requisito:** ter concluído a [Aula 1](01-terminal-e-arquivos.md) e estar na pasta `~/vim-pratica`.

## Objetivo

Ao final desta aula, você conseguirá reconhecer os modos normal e inserção, escrever um pequeno texto e salvar o arquivo sem sair do Vim.

## Conceitos

No Vim, o teclado tem funções diferentes conforme o modo atual.

| Modo | Serve para | Como entrar |
| :--- | :--- | :--- |
| Normal | Mover o cursor e executar comandos | `Esc` |
| Inserção | Digitar texto comum | `i`, `a` ou `o` |

O modo normal é o ponto de partida. Se algo inesperado acontecer, pressione `Esc`: isso volta ao modo normal ou cancela uma operação em andamento.

## Demonstração

No **terminal**, abra um arquivo novo:

```bash
cd ~/vim-pratica
vim apresentacao.txt
```

Dentro do **Vim**, no modo normal, pressione `i`. Quando aparecer `-- INSERT --`, digite:

```text
Estou aprendendo Vim.
Praticar aos poucos funciona.
```

Pressione `Esc`. No modo normal, digite `:w` e pressione `Enter`. O arquivo será salvo, mas o Vim continuará aberto. Para sair, digite `:q` e pressione `Enter`.

`i` insere antes do cursor. `a` insere depois do cursor e `o` abre uma linha abaixo, entrando no modo de inserção.

## Prática guiada

1. No terminal, abra `recado.txt` com `vim recado.txt`.
2. No Vim, pressione `i` e escreva uma frase curta.
3. Pressione `Esc`; no modo normal, pressione `o`, escreva uma segunda frase e pressione `Esc`.
4. Digite `:w`, pressione `Enter` e depois use `:q` com `Enter`.
5. No terminal, execute `cat recado.txt`.

Você concluiu se o terminal mostrar as duas frases que escreveu.

## Desafio

Crie `lembrete.txt` com três linhas sobre o que você quer praticar no Vim. Use `i` para a primeira linha e `o` para as duas seguintes. Salve com `:wq` e confirme o conteúdo com `cat lembrete.txt` no terminal.

## Revisão

| Onde? | Comando | Resultado |
| :--- | :--- | :--- |
| Terminal | `vim arquivo.txt` | Abre ou cria um arquivo no Vim. |
| Vim, modo normal | `i`, `a`, `o` | Entra no modo de inserção. |
| Vim | `Esc` | Volta ao modo normal. |
| Vim, modo normal | `:w` + `Enter` | Salva sem sair. |
| Vim, modo normal | `:q` + `Enter` | Sai quando não há alterações pendentes. |

### Autoavaliação

Você consegue explicar por que uma frase deve ser digitada no modo de inserção, mas `:w` deve ser digitado no modo normal?
