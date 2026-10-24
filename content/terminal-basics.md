# Módulo Linux — Terminal básico para começar no Vim

**Ordem da trilha:** este é o primeiro módulo. Conclua-o antes do
[Módulo Vim — Primeiros passos](getting-started.md). O Vim é um editor de texto
muito usado no Linux e aberto a partir do terminal; ele não é o sistema Linux.

Antes de abrir o Vim, você precisa saber localizar-se no terminal e criar um
arquivo seguro para praticar. Todos os comandos desta página são digitados no
**terminal**, não dentro do Vim.

> **Sobre a prática no site:** estes exemplos ensinam comandos de um terminal
> Linux real. O terminal simulado do site tem escopo menor e aceita somente
> `pwd`, `ls`, `cat arquivo`, `clear` e `vim arquivo`; por exemplo, `cd`,
> `mkdir` e `touch` não são implementados nele. Use um terminal Linux real para
> praticar esses comandos e use a janela do site para seguir os desafios de Vim.

## Comandos essenciais

| Comando | O que faz | Exemplo |
| :--- | :--- | :--- |
| `pwd` | Mostra a pasta atual. | `pwd` |
| `ls` | Lista arquivos e pastas. | `ls` |
| `mkdir nome` | Cria uma pasta. | `mkdir vim-pratica` |
| `cd nome` | Entra em uma pasta. | `cd vim-pratica` |
| `cd ..` | Volta uma pasta. | `cd ..` |
| `touch nome` | Cria um arquivo vazio. | `touch notas.txt` |
| `clear` | Limpa o histórico visível do terminal; não apaga arquivos. | `clear` |
| `vim nome` | Abre um arquivo no Vim. | `vim notas.txt` |

## Segurança para praticar

Crie uma pasta só para seus exercícios. Assim, você pratica sem risco de alterar
arquivos importantes:

```bash
mkdir -p ~/vim-pratica
cd ~/vim-pratica
```

O `~` representa sua pasta pessoal. O `-p` evita erro caso a pasta já exista.

## Fluxo mais comum

```text
# No terminal
$ cd ~/vim-pratica
$ vim anotacoes.txt

# Agora você está dentro do Vim
```

Para voltar ao terminal depois de abrir o Vim, saia com `:q` ou `:wq`, sempre
no modo normal.
