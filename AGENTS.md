# Instruções para agentes

## Contexto obrigatório

Antes de editar, leia `README.md`, `specification.md` e
`.codex/steering/`. Para conteúdo, leia também
`.codex/steering/content.md`; para `site/`, leia
`.codex/steering/frontend.md`.

## Objetivo e público

Vim Commands ensina Vim no terminal, em português, a iniciantes e autodidatas.
Markdown é a fonte de conteúdo; o site é uma interface estática educacional.

## Conteúdo

- Diferencie terminal de Vim e informe o modo quando importar.
- Use português do Brasil, exemplos pequenos, prática segura e critérios
  observáveis.
- Aulas têm duração, nível, pré-requisito, objetivo, conceitos, demonstração,
  prática, desafio, revisão e autoavaliação.
- Não altere exercícios existentes sem preservar a intenção didática.

## Frontend

- Use HTML semântico, CSS responsivo e JavaScript modular sem bibliotecas.
- Use caminhos relativos, foco visível, contraste adequado, `aria-live` e
  teclado.
- O simulador só captura teclas quando ativado e focado; nunca acessa arquivos
  locais, terminal, área de transferência ou dados pessoais.
- Não amplie comandos do simulador sem atualizar `specification.md`.

## Segurança e autorização

Não publicar, fazer push, criar commits, habilitar GitHub Pages, alterar
configurações externas, instalar dependências ou modificar arquivos fora do
escopo solicitado sem autorização explícita.

## Verificação

Após editar, rode `git diff --check` e verifique links relativos afetados.
Teste a lógica e o comportamento manual de mudanças interativas em proporção ao
risco. Preserve mudanças locais que não pertencem à tarefa.
