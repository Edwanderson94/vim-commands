# Aula 4 — Busca e revisão de texto

**Duração estimada:** 15 minutos

**Nível:** iniciante

**Pré-requisito:** ter concluído a [Aula 3](03-movimento-e-edicao.md).

## Objetivo

Ao final desta aula, você conseguirá buscar palavras, percorrer os resultados e substituir texto com confirmação dentro do Vim.

## Demonstração

No **terminal**, abra um novo arquivo:

```bash
cd ~/vim-pratica
vim revisao.txt
```

Dentro do **Vim**, pressione `i`, digite o texto e depois pressione `Esc`:

```text
Vim usa modos.
Vim permite editar texto.
Praticar Vim todos os dias ajuda.
```

Salve com `:w` e `Enter`. A partir daqui, faça os comandos no modo normal.

## Conceitos

Para buscar, digite `/Vim` e pressione `Enter`. Use `n` para a próxima ocorrência e `N` para a anterior. Se a busca ainda estiver sendo digitada, `Esc` a cancela.

Para trocar cada `Vim` por `Neovim`, digite exatamente:

```text
:%s/Vim/Neovim/gc
```

Pressione `Enter`. O `%` escolhe todas as linhas, `g` encontra todas as ocorrências e `c` pede confirmação. Em cada ocorrência, pressione `y` para confirmar a troca ou `n` para ignorá-la.

## Prática guiada

1. No modo normal, busque `Vim` com `/Vim` e `Enter`.
2. Pressione `n` até chegar à última ocorrência e `N` para voltar uma ocorrência.
3. Execute `:%s/Vim/Neovim/gc` e pressione `Enter`.
4. Responda `y` às três confirmações e salve com `:w` e `Enter`.

Você concluiu se `revisao.txt` tiver três ocorrências de `Neovim` e nenhuma de `Vim`.

## Desafio

No terminal, crie `revisao-parcial.txt` com quatro linhas que usem a palavra
`Vim` e abra-o com `vim revisao-parcial.txt`. Busque a palavra, confirme que
`n` e `N` percorrem as quatro ocorrências e use `:%s/Vim/Neovim/gc` para
trocar apenas três delas por `Neovim`. Salve o arquivo.

## Revisão

| Modo | Comando | Resultado |
| :--- | :--- | :--- |
| Normal | `/texto` + `Enter` | Busca um texto. |
| Normal | `n` / `N` | Vai à próxima / anterior ocorrência. |
| Normal | `Esc` | Cancela uma busca em digitação. |
| Normal | `:%s/antigo/novo/gc` + `Enter` | Substitui pedindo confirmação. |
| Confirmação | `y` / `n` | Aceita / ignora a troca atual. |

### Autoavaliação

Você sabe explicar por que o `c` torna uma substituição mais segura?
