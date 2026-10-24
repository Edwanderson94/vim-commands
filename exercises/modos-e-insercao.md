# Exercício: modos e inserção

No **terminal**, prepare um arquivo seguro para praticar:

```bash
cd ~/vim-pratica
vim modos.txt
```

Agora você está dentro do **Vim**, no modo normal. Execute as tarefas abaixo:

1. Pressione `i` para entrar no modo de inserção.
2. Digite `Estou no modo de inserção.`.
3. Pressione `Esc` para voltar ao modo normal.
4. Pressione `o` para abrir uma linha abaixo.
5. Digite `Voltei a digitar texto.`.
6. Pressione `Esc`.
7. No modo normal, digite `:wq` e pressione `Enter`.
8. De volta ao terminal, execute `cat modos.txt`.

## Conclusão

Você concluiu se o terminal mostrar as duas linhas digitadas. Isso prova que
você entrou em inserção com `i` e `o`, voltou ao modo normal com `Esc` e
salvou o arquivo.
