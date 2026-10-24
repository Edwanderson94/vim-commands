# Exercício: busca e substituição

Crie um arquivo com o texto abaixo:

```text
Vim é um editor.
Vim usa modos.
Vim recompensa a prática.
```

1. Busque `Vim` com `/Vim` e pressione `Enter`.
2. Visite a próxima ocorrência com `n`.
3. Retorne à ocorrência anterior com `N`.
4. Execute `:%s/Vim/Neovim/gc`.
5. Responda `y` para confirmar cada troca.

## Conclusão

O exercício foi concluído quando as três linhas contiverem `Neovim` no lugar de
`Vim`.
