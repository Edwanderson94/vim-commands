# Aula 5 — Arquivos e janelas

**Duração estimada:** 20 minutos

**Nível:** iniciante
**Pré-requisito:** ter concluído a [Aula 4](04-busca-e-revisao.md).

## Objetivo

Ao final desta aula, você conseguirá alternar entre arquivos abertos e usar uma divisão de tela para consultar dois arquivos dentro do Vim.

## Conceitos

No **terminal**, crie dois arquivos de prática:

```bash
cd ~/vim-pratica
printf 'Lista de tarefas.\n' > tarefas.txt
printf 'Anotações sobre Vim.\n' > notas.txt
vim tarefas.txt
```

O sinal `>` grava o texto em cada arquivo; use esses nomes apenas dentro da pasta de prática. Depois de `vim tarefas.txt`, você está no **Vim**, no modo normal.

No Vim, digite `:e notas.txt` e pressione `Enter`. O arquivo anterior continua aberto em memória como um **buffer**: um arquivo que o Vim mantém disponível durante a sessão.

Digite `:ls` e pressione `Enter` para listar os buffers. Para voltar a um deles, use o número exibido, por exemplo `:b 1` e `Enter`.

Para ver os dois arquivos lado a lado, deixe `tarefas.txt` visível e digite:

```text
:vsplit notas.txt
```

Pressione `Enter`. Cada área é uma janela que mostra um buffer.

| Comando | Resultado |
| :--- | :--- |
| `Ctrl-w h` | Vai para a janela à esquerda. |
| `Ctrl-w l` | Vai para a janela à direita. |
| `Ctrl-w q` | Fecha a janela atual. |

Para usar `Ctrl-w h`, mantenha `Ctrl` pressionado, aperte `w`, solte as teclas e então pressione `h`.

## Prática guiada

1. Alterne entre `tarefas.txt` e `notas.txt` usando `:ls` e `:b número`.
2. Abra os dois lado a lado com `:vsplit notas.txt` e `Enter`.
3. Use `Ctrl-w h` e `Ctrl-w l` para mudar de janela.
4. Na janela de `notas.txt`, pressione `o`, escreva `Praticar janelas.` e pressione `Esc`.
5. Salve com `:w` e `Enter`. Feche somente a janela atual com `Ctrl-w q`.

Você concluiu se `notas.txt` tiver a nova linha salva e `tarefas.txt` continuar aberto no Vim.

## Desafio

Abra `revisao.txt` junto de `tarefas.txt` em uma divisão vertical. Sem sair do Vim, alterne entre as duas janelas, acrescente uma linha em cada arquivo, salve ambos e feche apenas uma janela. Use `:ls` para confirmar que os dois buffers continuam disponíveis.

## Revisão

| Modo | Comando | Resultado |
| :--- | :--- | :--- |
| Normal | `:e arquivo.txt` + `Enter` | Abre outro arquivo. |
| Normal | `:ls` + `Enter` | Lista buffers abertos. |
| Normal | `:b número` + `Enter` | Vai ao buffer indicado. |
| Normal | `:vsplit arquivo.txt` + `Enter` | Abre uma divisão vertical. |
| Normal | `Ctrl-w h` / `Ctrl-w l` | Move entre janelas. |
| Normal | `Ctrl-w q` | Fecha a janela atual. |

### Autoavaliação

Você consegue distinguir um buffer de uma janela? Um buffer é o arquivo aberto em memória; uma janela é a área da tela que mostra esse arquivo.
