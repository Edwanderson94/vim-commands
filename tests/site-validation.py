from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import sys


ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site'
errors = []


class PageAudit(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.main_count = 0
        self.h1_count = 0
        self.lang = None
        self.ids = set()
        self.tag_stack = []
        self.labels = []
        self.controls = []
        self.links = []
        self.resources = []
        self.script_sources = []
        self.live_regions = {}
        self.paragraphs = []
        self.anchors = []
        self.buttons = []
        self.editor_attrs = None
        self.live_roles = {}
        self.live_atomic = {}
        self.aria_hidden = {}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag not in {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}:
            self.tag_stack.append(tag)
        element_id = attrs.get('id')
        if tag == 'html':
            self.lang = attrs.get('lang')
        if tag == 'main':
            self.main_count += 1
        if tag == 'h1':
            self.h1_count += 1
        if element_id:
            if element_id in self.ids:
                errors.append(f'{self.path}: id duplicado #{element_id}')
            self.ids.add(element_id)
            if attrs.get('aria-hidden') is not None:
                self.aria_hidden[element_id] = attrs['aria-hidden']
        if tag == 'label' and attrs.get('for'):
            self.labels.append(attrs['for'])
        if tag in ('input', 'select', 'textarea'):
            self.controls.append((element_id, attrs.get('aria-label'), attrs.get('aria-labelledby')))
        if tag == 'a':
            self.anchors.append({'attrs': attrs, 'text': ''})
        if tag == 'button':
            self.buttons.append({'attrs': attrs, 'text': ''})
        if tag == 'img' and 'alt' not in attrs:
            errors.append(f'{self.path}: imagem sem atributo alt')
        if tag == 'p':
            self.paragraphs.append('')
        if attrs.get('aria-live'):
            self.live_regions[element_id] = attrs['aria-live']
            self.live_roles[element_id] = attrs.get('role')
            self.live_atomic[element_id] = attrs.get('aria-atomic')
        if element_id == 'simulator-editor':
            self.editor_attrs = attrs
        attr = 'src' if tag in ('script', 'img') else 'href'
        target = attrs.get(attr)
        if target:
            self.links.append(target)
            if tag in ('script', 'link', 'img'):
                self.resources.append(target)
            if tag == 'script' and attrs.get('src'):
                self.script_sources.append(attrs['src'])

    def handle_data(self, data):
        if self.paragraphs:
            self.paragraphs[-1] += data
        for item in self.anchors:
            item['text'] += data
        for item in self.buttons:
            item['text'] += data

    def handle_endtag(self, tag):
        if not self.tag_stack or self.tag_stack[-1] != tag:
            errors.append(f'{self.path}: fechamento HTML fora de ordem: </{tag}>')
            if tag in self.tag_stack:
                while self.tag_stack and self.tag_stack[-1] != tag:
                    self.tag_stack.pop()
                if self.tag_stack:
                    self.tag_stack.pop()
        else:
            self.tag_stack.pop()
        if tag == 'p' and self.paragraphs:
            value = self.paragraphs.pop().strip()
            if value.startswith('|'):
                errors.append(f'{self.path}: tabela Markdown renderizada como parágrafo')
        if tag == 'a' and self.anchors:
            item = self.anchors.pop()
            attrs = item['attrs']
            if not item['text'].strip() and not (attrs.get('aria-label') or attrs.get('title')):
                errors.append(f'{self.path}: link sem nome acessível: {attrs.get("href", "")}')
        if tag == 'button' and self.buttons:
            item = self.buttons.pop()
            attrs = item['attrs']
            if not item['text'].strip() and not attrs.get('aria-label'):
                errors.append(f'{self.path}: botão sem nome acessível')


def audit_page(path):
    page = PageAudit(path.relative_to(ROOT))
    try:
        page.feed(path.read_text(encoding='utf-8'))
        page.close()
        if page.tag_stack:
            errors.append(f'{page.path}: tags sem fechamento: {", ".join(page.tag_stack)}')
    except Exception as exc:
        errors.append(f'{path.relative_to(ROOT)}: HTML não pode ser analisado: {exc}')
        return page

    if page.lang != 'pt-BR':
        errors.append(f'{page.path}: lang deve ser pt-BR')
    if page.main_count != 1:
        errors.append(f'{page.path}: esperado 1 main, encontrado {page.main_count}')
    if page.h1_count != 1:
        errors.append(f'{page.path}: esperado 1 h1, encontrado {page.h1_count}')
    for label_target in page.labels:
        if label_target not in page.ids:
            errors.append(f'{page.path}: label aponta para id inexistente #{label_target}')
    for control_id, aria_label, labelledby in page.controls:
        if not aria_label and not labelledby and control_id not in page.labels:
            errors.append(f'{page.path}: controle sem label: {control_id or "sem id"}')

    for target in page.links:
        parsed = urlsplit(target)
        if parsed.scheme in ('http', 'https') or parsed.netloc:
            errors.append(f'{page.path}: referência externa impede uso offline: {target}')
            continue
        if not parsed.path:
            if parsed.fragment and unquote(parsed.fragment) not in page.ids:
                errors.append(f'{page.path}: fragmento inexistente #{parsed.fragment}')
            continue
        destination = (path.parent / unquote(parsed.path)).resolve()
        if not destination.exists():
            errors.append(f'{page.path}: caminho relativo inexistente: {target}')
    return page


html_pages = [SITE / 'index.html', *sorted((SITE / 'materiais').rglob('*.html'))]
if len(html_pages) != 19:
    errors.append(f'esperado site/index.html e 18 materiais; encontrados {len(html_pages)} HTML')
expected_materials = {
    SITE / 'materiais' / group / f'{source.stem}.html'
    for group in ('content', 'lessons', 'exercises')
    for source in (ROOT / group).glob('*.md')
}
expected_materials.add(SITE / 'materiais' / 'reference' / 'commands.html')
actual_materials = set((SITE / 'materiais').rglob('*.html'))
if actual_materials != expected_materials:
    errors.append('páginas HTML derivadas não correspondem às fontes Markdown')

audits = {page.relative_to(ROOT): audit_page(page) for page in html_pages if page.exists()}
for material_path in expected_materials:
    material = audits.get(material_path.relative_to(ROOT))
    if not material:
        continue
    if not any(Path(urlsplit(source).path).name == 'materiais-theme.js' for source in material.script_sources):
        errors.append(f'{material_path.relative_to(ROOT)}: subpágina deve carregar o tema compartilhado')
    if 'theme-toggle' not in material.ids:
        errors.append(f'{material_path.relative_to(ROOT)}: subpágina deve oferecer controle de tema')
    if not any(Path(urlsplit(link).path).name == 'materiais.css' for link in material.links):
        errors.append(f'{material_path.relative_to(ROOT)}: subpágina deve carregar o CSS de materiais')

home = audits.get(Path('site/index.html'))
if home:
    if home.lang != 'pt-BR':
        errors.append('site/index.html: documento principal deve declarar português do Brasil')
    homepage_source = (SITE / 'index.html').read_text(encoding='utf-8')
    for introduction in ('id="titulo-o-que-e-vim"', 'Vi IMproved', 'terminal do Linux', 'Nano', 'Emacs', 'Micro'):
        if introduction not in homepage_source:
            errors.append(f'site/index.html: falta a introdução básica sobre Vim ({introduction})')
    if 'Esc</kbd> volta ao modo normal ou cancela uma operação.' in homepage_source:
        errors.append('site/index.html: dica isolada de Esc removida da apresentação inicial')
    if 'href="#aulas">Começar a aprender</a>' not in homepage_source:
        errors.append('site/index.html: botão principal deve levar à trilha inicial')
    expected_scripts = ['commands.js', 'simulator.js', 'challenges.js', 'terminal.js', 'app.js']
    if [Path(urlsplit(src).path).name for src in home.script_sources] != expected_scripts:
        errors.append('site/index.html: scripts clássicos devem carregar na ordem especificada')
    for live_id in ('status-announcer',):
        if home.live_regions.get(live_id) != 'polite':
            errors.append(f'site/index.html: #{live_id} deve usar aria-live="polite"')
        if home.live_roles.get(live_id) != 'status' or home.live_atomic.get(live_id) != 'true':
            errors.append(f'site/index.html: #{live_id} deve ser uma região status atômica')
    if home.aria_hidden.get('challenge-status') != 'true':
        errors.append('site/index.html: #challenge-status duplicado deve ficar fora da árvore assistiva')
    for removed_control in ('activate-simulator', 'reset-simulator', 'restart-challenge', 'practice-extras'):
        if removed_control in home.ids:
            errors.append(f'site/index.html: controle obsoleto #{removed_control} ainda existe')
    if 'challenge-select' not in home.ids or 'challenge-picker' not in home.ids:
        errors.append('site/index.html: seletor opcional de desafio deve estar disponível junto à prática')
    if not home.editor_attrs or not (
        home.editor_attrs.get('role') == 'textbox'
        and home.editor_attrs.get('aria-multiline') == 'true'
        and home.editor_attrs.get('aria-label')
        and {'simulator-instructions', 'challenge-instruction'}.issubset(
            set(home.editor_attrs.get('aria-describedby', '').split())
        )
    ):
        errors.append('site/index.html: simulador deve expor caixa de texto multilinha nomeada e descrita')

lessons = sorted((ROOT / 'lessons').glob('*.md'))
lesson_sections = (
    'Duração estimada', 'Nível', 'Pré-requisito', '## Objetivo', '## Conceitos',
    '## Demonstração', '## Prática guiada', '## Desafio', '## Revisão', 'Autoavaliação'
)
if len(lessons) != 5:
    errors.append(f'esperadas 5 aulas Markdown; encontradas {len(lessons)}')
for lesson in lessons:
    source = lesson.read_text(encoding='utf-8')
    missing = [section for section in lesson_sections if section not in source]
    if missing:
        errors.append(f'{lesson.relative_to(ROOT)}: faltam {", ".join(missing)}')

command_rows = [line for line in (ROOT / 'commands.md').read_text(encoding='utf-8').splitlines()
                if re.match(r'^\|\s*\d+\s*\|', line)]
if len(command_rows) != 30:
    errors.append(f'commands.md deve ter 30 comandos; encontrados {len(command_rows)}')
if len(list((ROOT / 'exercises').glob('*.md'))) != 5:
    errors.append('exercises/ deve conter cinco exercícios Markdown')

for js_file in SITE.glob('*.js'):
    source = js_file.read_text(encoding='utf-8')
    forbidden = re.search(
        r'\b(fetch|XMLHttpRequest|FileReader|showOpenFilePicker|showSaveFilePicker)\b'
        r'|navigator\.clipboard|document\.cookie|window\.open\s*\(', source
    )
    if forbidden:
        errors.append(f'{js_file.relative_to(ROOT)}: API de rede, arquivos ou dados pessoais não permitida')

for css_file in SITE.glob('*.css'):
    source = css_file.read_text(encoding='utf-8')
    if re.search(r'@import\s|url\(\s*["\']?(?:https?:)?//', source, re.IGNORECASE):
        errors.append(f'{css_file.relative_to(ROOT)}: dependência CSS remota não permitida')

css = (SITE / 'styles.css').read_text(encoding='utf-8')
if ':focus-visible' not in css or 'prefers-reduced-motion' not in css:
    errors.append('site/styles.css deve oferecer foco visível e respeitar movimento reduzido')

materials_css = (SITE / 'materiais.css').read_text(encoding='utf-8')
if 'html[data-theme="dark"]' not in materials_css or 'var(--page)' not in materials_css:
    errors.append('site/materiais.css deve aplicar o tema escuro às páginas de materiais')

if errors:
    print('\n'.join(f'ERRO: {error}' for error in errors), file=sys.stderr)
    raise SystemExit(1)

print(f'Validação passou: {len(html_pages)} documentos HTML bem formados, links locais, '
      f'rótulos e conteúdo esperado (cinco aulas, 30 comandos).')
