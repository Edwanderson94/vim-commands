"""Browser smoke checks using the Chrome and ChromeDriver on the CI runner."""

import json
import os
from pathlib import Path
import shutil
import socket
import subprocess
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
CHROME_DRIVER = shutil.which('chromedriver')
if not CHROME_DRIVER and os.environ.get('CHROMEWEBDRIVER'):
    candidate = Path(os.environ['CHROMEWEBDRIVER']) / 'chromedriver'
    if candidate.is_file():
        CHROME_DRIVER = str(candidate)
if not CHROME_DRIVER:
    raise SystemExit('ChromeDriver não está disponível neste ambiente.')


def request(base, path, payload=None, method=None):
    body = json.dumps(payload).encode('utf-8') if payload is not None else None
    headers = {'Content-Type': 'application/json'} if body else {}
    req = Request(base + path, body, headers, method=method)
    try:
        with urlopen(req, timeout=30) as response:
            raw = response.read()
    except HTTPError as error:
        detail = error.read().decode('utf-8', errors='replace')
        raise RuntimeError(f'ChromeDriver {error.code}: {detail}') from error
    except URLError as error:
        raise RuntimeError(f'ChromeDriver indisponível: {error}') from error
    return json.loads(raw) if raw else {}


def main():
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        port = sock.getsockname()[1]
    base = f'http://127.0.0.1:{port}'
    driver = subprocess.Popen(
        [CHROME_DRIVER, f'--port={port}', '--allowed-ips=127.0.0.1'],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    session_id = None
    try:
        for _ in range(60):
            if driver.poll() is not None:
                raise RuntimeError('ChromeDriver encerrou antes de iniciar.')
            try:
                request(base, '/status')
                break
            except RuntimeError:
                time.sleep(.25)
        else:
            raise RuntimeError('Tempo esgotado aguardando ChromeDriver.')

        created = request(base, '/session', {
            'capabilities': {
                'alwaysMatch': {
                    'browserName': 'chrome',
                    'goog:chromeOptions': {
                        'args': ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage']
                    },
                }
            }
        })['value']
        session_id = created['sessionId']
        endpoint = f'/session/{session_id}'

        def command(path, payload=None, method=None):
            return request(base, endpoint + path, payload, method)

        def execute(script):
            return command('/execute/sync', {'script': script, 'args': []})['value']

        command('/url', {'url': (ROOT / 'site' / 'index.html').as_uri()})
        browser = created['capabilities']['browserVersion']
        assert execute("return document.readyState") == 'complete'
        assert execute("return document.querySelectorAll('.command-card').length") == 30
        assert execute("return Boolean(document.querySelector('link[href=\"styles.css\"]')?.sheet)")
        assert execute("return document.querySelector('#status-announcer').textContent") == ''

        terminal_flow = execute("""
          const run = (value) => {
            const input = document.querySelector('#terminal-input');
            input.value = value;
            document.querySelector('#terminal-form').dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));
          };
          run('mkdir -p ~/vim-pratica');
          run('cd ~/vim-pratica');
          run('vim ola.txt');
          return {visible: !document.querySelector('#vim-workspace').hidden,
                  focused: document.activeElement.id,
                  path: document.querySelector('#terminal-prompt').textContent};
        """)
        assert terminal_flow['visible'] and terminal_flow['focused'] == 'simulator-editor', terminal_flow
        assert terminal_flow['path'] == '/home/aluno/vim-pratica $', terminal_flow
        actions = []
        for key in ('i', 'O', 'K', '\ue00c', ':', 'w', 'q', '\ue007'):
            actions.extend([{'type': 'keyDown', 'value': key}, {'type': 'keyUp', 'value': key}])
        command('/actions', {'actions': [{'type': 'key', 'id': 'keyboard', 'actions': actions}]})
        saved_flow = execute("""
          const input = document.querySelector('#terminal-input');
          input.value = 'cat ola.txt';
          document.querySelector('#terminal-form').dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));
          return {hidden: document.querySelector('#vim-workspace').hidden,
                  output: document.querySelector('#terminal-output').textContent};
        """)
        assert saved_flow['hidden'] and 'OK' in saved_flow['output'], saved_flow
        rejected = execute("""
          const input = document.querySelector('#terminal-input');
          input.value = 'rm -rf /';
          document.querySelector('#terminal-form').dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));
          return document.querySelector('#terminal-output').textContent;
        """)
        assert 'Comando não disponível' in rejected, rejected
        execute("document.querySelector('#terminal-input').value = 'clear'; document.querySelector('#terminal-form').dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}))")
        execute("document.querySelector('#reset-simulator').click()")

        command('/window/rect', {'width': 320, 'height': 800})
        mobile = execute("return {width: innerWidth, page: document.documentElement.scrollWidth}")
        assert 300 <= mobile['width'] <= 360, f"viewport móvel inesperada: {mobile}"
        assert mobile['page'] <= mobile['width'], f"transbordamento móvel: {mobile}"
        command('/window/rect', {'width': 1366, 'height': 900})

        search_result = execute("""
          const search = document.querySelector('#search');
          search.value = 'apagar';
          search.dispatchEvent(new Event('input', {bubbles: true}));
          return document.querySelectorAll('.command-card').length;
        """)
        assert 0 < search_result < 30, f'busca inesperada: {search_result}'
        announced_count = execute("return document.querySelector('#status-announcer').textContent")
        assert announced_count == f'{search_result} de 30 comandos exibidos.', announced_count
        filtered = execute("""
          const search = document.querySelector('#search');
          search.value = '';
          search.dispatchEvent(new Event('input', {bubbles: true}));
          const category = document.querySelector('#category');
          category.selectedIndex = 1;
          category.dispatchEvent(new Event('input', {bubbles: true}));
          const byCategory = document.querySelectorAll('.command-card').length;
          const level = document.querySelector('#level');
          level.value = 'iniciante';
          level.dispatchEvent(new Event('input', {bubbles: true}));
          return [byCategory, document.querySelectorAll('.command-card').length];
        """)
        assert 0 < filtered[0] < 30 and filtered[1] <= filtered[0], f'filtros combinados inesperados: {filtered}'
        execute("""
          document.querySelector('#search').value = '';
          document.querySelector('#search').dispatchEvent(new Event('input', {bubbles: true}));
          document.querySelector('#category').value = '';
          document.querySelector('#category').dispatchEvent(new Event('input', {bubbles: true}));
          document.querySelector('#level').value = '';
          document.querySelector('#level').dispatchEvent(new Event('input', {bubbles: true}));
        """)
        empty_state = execute("""
          const search = document.querySelector('#search');
          search.value = 'sem-comando-correspondente';
          search.dispatchEvent(new Event('input', {bubbles: true}));
          return !document.querySelector('#empty-state').hidden;
        """)
        assert empty_state, 'o estado sem resultados não apareceu'
        execute("document.querySelector('#clear-filters').click()")
        cleared = execute("return {count: document.querySelectorAll('.command-card').length, focused: document.activeElement.id}")
        assert cleared == {'count': 30, 'focused': 'search'}, f'foco após limpar filtros: {cleared}'

        theme = execute("""
          document.querySelector('#theme-toggle').click();
          return [document.documentElement.dataset.theme,
                  document.querySelector('#theme-toggle').getAttribute('aria-pressed')];
        """)
        assert theme == ['dark', 'true'], f'estado do tema inesperado: {theme}'

        execute("document.querySelector('#activate-simulator').click()")
        actions = []
        for key in ('i', 'O', 'K', '\ue00c'):
            actions.extend([{'type': 'keyDown', 'value': key}, {'type': 'keyUp', 'value': key}])
        command('/actions', {'actions': [{'type': 'key', 'id': 'keyboard', 'actions': actions}]})
        inserted = execute("return {mode: document.querySelector('#simulator-mode').textContent, text: document.querySelector('#simulator-editor').textContent}")
        assert inserted['mode'] == 'NORMAL' and 'OKLinha para praticar.' in inserted['text'], inserted
        element_ref = command('/element', {'using': 'css selector', 'value': '#simulator-editor'})['value']
        element_key = 'element-6066-11e4-a52e-4f735466cecf'
        editor_id = element_ref.get(element_key, element_ref.get('ELEMENT'))
        assert editor_id, f'referência WebDriver do simulador ausente: {element_ref}'
        editor_role = command(f'/element/{editor_id}/computedrole')['value']
        editor_name = command(f'/element/{editor_id}/computedlabel')['value']
        assert editor_role == 'textbox', f'papel acessível do simulador: {editor_role}'
        assert editor_name == 'Área de prática do simulador', f'nome acessível do simulador: {editor_name}'
        live_ref = command('/element', {'using': 'css selector', 'value': '#status-announcer'})['value']
        live_id = live_ref.get(element_key, live_ref.get('ELEMENT'))
        role = command(f'/element/{live_id}/computedrole')['value']
        assert role == 'status', f'papel acessível do anunciador: {role}'
        command('/actions', {'actions': [{'type': 'key', 'id': 'keyboard', 'actions': [
            {'type': 'keyDown', 'value': '\ue004'}, {'type': 'keyUp', 'value': '\ue004'}
        ]}]})
        next_focus = execute("return document.activeElement.getAttribute('href')")
        assert next_focus == 'materiais/exercises/modos-e-insercao.html', f'foco após Tab no simulador: {next_focus!r}'

        scenarios = {
            'insert-text': ('i', 'O', 'K', '\ue00c'),
            'last-line': ('G',),
            'delete-line': ('j', 'd', 'd'),
            'copy-line': ('y', 'y', 'p'),
            'search-text': ('/', 'V', 'i', 'm', '\ue007'),
        }
        for challenge, keys in scenarios.items():
            execute(f"""
              const select = document.querySelector('#challenge-select');
              select.value = '{challenge}';
              select.dispatchEvent(new Event('change', {{bubbles: true}}));
              document.querySelector('#activate-simulator').click();
              document.querySelector('#simulator-editor').focus();
            """)
            actions = []
            for key in keys:
                actions.extend([{'type': 'keyDown', 'value': key}, {'type': 'keyUp', 'value': key}])
            command('/actions', {'actions': [{'type': 'key', 'id': 'keyboard', 'actions': actions}]})
            status = execute("return document.querySelector('#challenge-status').textContent")
            assert status == 'Desafio concluído.', f'{challenge} não foi concluído: {status!r}'
            feedback = execute("return document.querySelector('#status-announcer').textContent")
            assert feedback.startswith('Desafio concluído.'), f'{challenge} não foi anunciado: {feedback!r}'

        print(f'Chrome {browser}: site, terminal simulado, salvar/retornar ao Vim, viewport móvel, busca/filtros, foco, tema, simulador e cinco desafios passaram.')
    finally:
        if session_id:
            try:
                request(base, f'/session/{session_id}', method='DELETE')
            except RuntimeError:
                pass
        driver.terminate()
        driver.wait(timeout=5)


if __name__ == '__main__':
    main()
