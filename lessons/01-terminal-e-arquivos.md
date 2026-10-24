# Aula 1 — Terminal e seu primeiro arquivo no Vim

**Duração estimada:** 15 minutos

**Nível:** iniciante

**Pré-requisito:** um terminal Linux aberto e o Vim instalado (`vim --version`).

## Objetivo

Ao final desta aula, você conseguirá criar uma pasta de prática no terminal,
abrir um arquivo no Vim, escrever uma frase, salvar e sair.

## Demonstração

## Parte 1 — Onde estou?

Você está no **terminal**. O terminal é o lugar onde digitamos comandos para o
sistema operacional. Comece descobrindo em qual pasta você está:

```bash
pwd
```

O resultado será um caminho parecido com `/home/seu-usuario`. Agora veja os
arquivos e pastas desse lugar:

```bash
ls
```

## Parte 2 — Criar um espaço seguro para praticar

Ainda no **terminal**, execute um comando por vez:

```bash
mkdir -p ~/vim-pratica
cd ~/vim-pratica
pwd
```

O último comando deve terminar em `/vim-pratica`. Esta é sua área de treino:
você pode criar, editar e apagar arquivos nela sem mexer nos seus projetos.

## Parte 3 — Abrir seu primeiro arquivo

No **terminal**, digite:

```bash
vim ola.txt
```

Agora você entrou no **Vim**. O cursor aparece na primeira linha, mas você ainda
não está digitando texto. O Vim começou no modo normal.

## Parte 4 — Escrever uma frase

Dentro do **Vim**, pressione `i`. Na parte inferior da tela, deve aparecer
`-- INSERT --`. Digite a frase abaixo:

```text
Olá, Vim!
```

Em seguida, pressione `Esc`. Você voltou ao modo normal e o indicador `-- INSERT
--` desaparece.

## Parte 5 — Salvar e sair

Ainda dentro do **Vim**, digite exatamente:

```text
:wq
```

Depois, pressione `Enter`. O `:` abre a área de comandos; `w` vem de *write*
(salvar) e `q` vem de *quit* (sair). Você retornará ao terminal.

## Parte 6 — Conferir seu arquivo

No **terminal**, confirme que o arquivo foi criado:

```bash
ls
```

Você deve ver `ola.txt`. Para conferir seu conteúdo sem abri-lo no Vim, use:

```bash
cat ola.txt
```

O terminal deve mostrar:

```text
Olá, Vim!
```

## Prática guiada

Repita o processo com outro arquivo:

1. No terminal, execute `vim meu-nome.txt`.
2. Dentro do Vim, pressione `i`.
3. Digite seu nome.
4. Pressione `Esc`.
5. Digite `:wq` e pressione `Enter`.
6. De volta ao terminal, confirme com `cat meu-nome.txt`.

## Desafio

Sem consultar os passos acima, crie um arquivo chamado `objetivo.txt` e escreva
uma frase sobre o que você quer aprender no Vim. Salve o arquivo e confira seu
conteúdo pelo terminal.

## Revisão

| Onde? | Comando | Resultado |
| :--- | :--- | :--- |
| Terminal | `pwd` | Mostra a pasta atual. |
| Terminal | `mkdir -p ~/vim-pratica` | Cria sua pasta de treino. |
| Terminal | `cd ~/vim-pratica` | Entra na pasta de treino. |

| Terminal | `vim ola.txt` | Abre ou cria o arquivo no Vim. |
| Vim | `i` | Entra no modo de inserção. |
| Vim | `Esc` | Volta ao modo normal. |
| Vim | `:wq` | Salva e fecha o arquivo. |
| Terminal | `cat ola.txt` | Mostra o conteúdo do arquivo. |

### Autoavaliação

Você consegue explicar por que `i` não deve ser digitado no terminal e `pwd` não
deve ser digitado dentro do Vim? Se a resposta for sim, você está pronto para a
próxima aula, sobre criação e edição de texto no Vim.
