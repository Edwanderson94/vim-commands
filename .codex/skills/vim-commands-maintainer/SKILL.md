---
name: vim-commands-maintainer
description: Create or maintain lessons, exercises, command references, and the planned static frontend for this Vim teaching repository. Use when work must follow this repository's educational and technical conventions.
---

# Vim Commands maintainer

Use this skill for changes that add or revise the teaching materials, project specifications, or future `site/` frontend in this repository.

## Read first

1. Read `.codex/steering/project.md`.
2. For Markdown lessons, content, or exercises, read `.codex/steering/content.md` and the relevant section of `specification.md`.
3. For work in `site/`, read `.codex/steering/frontend.md` and the site
   and simulator sections of `specification.md`.

## Workflow

- Inspect nearby material before editing so terminology, lesson level, and links stay consistent.
- Keep educational source material in Markdown. Do not make the future web interface its only representation.
- Preserve the separation between commands run in a terminal and commands run inside Vim.
- Update the README or relevant index when a learner-facing lesson or module is added.
- Run `git diff --check` and verify affected relative links after documentation or frontend edits.

## Boundaries

- Do not publish, enable GitHub Pages, change repository settings, or push commits unless the user explicitly asks.
- Do not widen the simulator beyond the supported scope in `specification.md`
  without first updating that specification.
- Treat the project specifications as deliberate product decisions; propose a specification change when requested work conflicts with them.
