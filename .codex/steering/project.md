# Direção do projeto

## Propósito

Vim Commands é um projeto educacional gratuito, em português, para ensinar Vim no terminal a alunos e autodidatas. Ele combina explicações curtas, prática progressiva, consulta rápida e um simulador seguro no navegador.

## Fonte de verdade

- `specification.md` define o produto, a trilha de aprendizado, o frontend
  estático e sua publicação no GitHub Pages.
- `content/`, `lessons/` e `exercises/` são materiais didáticos em Markdown.
- `commands.md` é a lista compacta dos 30 comandos essenciais.

Quando houver conflito, as especificações na raiz prevalecem sobre materiais derivados.

## Decisões de produto

- Ensinar o que é digitado no terminal e o que é digitado dentro do Vim como contextos diferentes.
- Priorizar iniciantes sem perder utilidade como referência rápida.
- Manter o conteúdo em Markdown, legível no GitHub e independente da interface.
- Construir o site com HTML, CSS e JavaScript puro; não introduzir frameworks sem uma necessidade concreta.
- Tratar o simulador como ambiente educacional: ele não deve ler, criar ou alterar arquivos do computador.

## Resultado desejado para cada mudança

Uma contribuição deve tornar o aprendizado mais claro, a prática mais segura ou a consulta mais rápida. Evitar mudanças cosméticas que aumentem complexidade sem ajudar uma pessoa estudante.
