# Exercício: copiar e colar

**Pré-requisito:** conclua [Módulo Linux — Terminal básico](../content/terminal-basics.md) e [Edição de texto](../content/editing.md).

No **terminal**, abra um arquivo de prática:

```bash
cd ~/vim-pratica
vim copia.txt
```

Dentro do **Vim**, pressione `i`, crie estas três linhas e depois pressione
`Esc`:

```text
Praticar Vim ajuda.
Esta linha ficará no meio.
Copiar economiza tempo.
```

No modo normal, execute as tarefas abaixo:

1. Vá para a primeira linha com `gg`.
2. Copie a linha com `yy`.
3. Vá para a última linha com `G`.
4. Cole a cópia abaixo da linha atual com `p`.
5. Salve com `:w` e pressione `Enter`.
6. Saia com `:q` e pressione `Enter`.
7. No terminal, confira o resultado com `cat copia.txt`.

## Conclusão

Você concluiu se o arquivo tiver quatro linhas e a primeira linha aparecer
novamente no final. A linha original deve continuar no começo: `yy` copia,
enquanto `dd` remove.
