import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(root, 'site', 'materiais');
const sources = ['content', 'lessons', 'exercises'];

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function inlineMarkdown(value) {
  let html = escapeHtml(value);
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, rawTarget) => {
    const target = rawTarget.endsWith('.md') ? `${rawTarget.slice(0, -3)}.html` : rawTarget;
    const scheme = target.match(/^([a-z][a-z0-9+.-]*):/i)?.[1]?.toLowerCase();
    if (scheme && !['http', 'https', 'mailto'].includes(scheme)) return label;
    if (target.startsWith('//')) return label;
    return `<a href="${target}">${label}</a>`;
  });
  return html;
}

function tableCells(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}

function isBlockStart(lines, index) {
  const line = lines[index] ?? '';
  return /^#{1,6}\s/.test(line) || /^```/.test(line) || /^\s*[-*+]\s+/.test(line) || /^\s*\d+\.\s+/.test(line) || /^>\s?/.test(line) || /^\s*\|.*\|\s*$/.test(line) || /^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line);
}

function renderMarkdown(markdown) {
  const lines = markdown.replaceAll('\r\n', '\n').split('\n');
  const blocks = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index += 1; continue; }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim().replace(/[^a-z0-9_-]/gi, '');
      const code = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith('```')) code.push(lines[index++]);
      if (index < lines.length) index += 1;
      blocks.push(`<pre><code${language ? ` class="language-${language}"` : ''}>${escapeHtml(code.join('\n'))}</code></pre>`);
      continue;
    }

    if (/^\s*\|.*\|\s*$/.test(line) && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1] ?? '')) {
      const headers = tableCells(line);
      index += 2;
      const rows = [];
      while (index < lines.length && /^\s*\|.*\|\s*$/.test(lines[index])) rows.push(tableCells(lines[index++]));
      blocks.push(`<div class="table-scroll"><table><thead><tr>${headers.map((cell) => `<th scope="col">${inlineMarkdown(cell)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${headers.map((_, cellIndex) => `<td>${inlineMarkdown(row[cellIndex] ?? '')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) { const level = heading[1].length; blocks.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`); index += 1; continue; }
    if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line)) { blocks.push('<hr>'); index += 1; continue; }

    if (/^>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) quote.push(lines[index++].replace(/^>\s?/, ''));
      blocks.push(`<blockquote><p>${quote.map(inlineMarkdown).join('<br>')}</p></blockquote>`);
      continue;
    }

    const listMatch = line.match(/^\s*([-*+]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      const ordered = /^\d/.test(listMatch[1]);
      const listTag = ordered ? 'ol' : 'ul';
      const items = [];
      while (index < lines.length) {
        const item = lines[index].match(/^\s*([-*+]|\d+\.)\s+(.+)$/);
        if (!item || /^\d/.test(item[1]) !== ordered) break;
        items.push(`<li>${inlineMarkdown(item[2])}</li>`);
        index += 1;
      }
      blocks.push(`<${listTag}>${items.join('')}</${listTag}>`);
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines, index)) paragraph.push(lines[index++].trim());
    blocks.push(`<p>${paragraph.map(inlineMarkdown).join(' ')}</p>`);
  }
  return blocks.join('\n');
}

async function renderFile(sourcePath, group, filename) {
  const markdown = await readFile(sourcePath, 'utf8');
  const title = markdown.match(/^#\s+(.+)$/m)?.[1] ?? path.basename(filename, '.md');
  const outputDir = path.join(outputRoot, group);
  await mkdir(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${path.basename(filename, '.md')}.html`);
  const page = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Material de aprendizagem de Vim em português.">
  <title>${escapeHtml(title)} — Vim Commands</title>
  <script src="../../materiais-theme.js?v=theme-1"></script>
  <link rel="stylesheet" href="../../materiais.css?v=theme-1">
</head>
<body>
  <header class="material-header">
    <a href="../../index.html">Vim Commands</a>
    <a href="../../index.html#aulas">Voltar à trilha</a>
    <button id="theme-toggle" type="button" aria-pressed="false">Tema escuro</button>
  </header>
  <main class="material-content">
${renderMarkdown(markdown)}
  </main>
  <footer class="material-footer"><a href="../../index.html">Vim Commands</a></footer>
</body>
</html>
`;
  await writeFile(outputPath, page);
}

for (const group of sources) {
  const directory = path.join(root, group);
  for (const filename of await readdir(directory)) {
    if (filename.endsWith('.md')) await renderFile(path.join(directory, filename), group, filename);
  }
}
await renderFile(path.join(root, 'commands.md'), 'reference', 'commands.md');
console.log(`Páginas HTML geradas em ${path.relative(root, outputRoot)}.`);
