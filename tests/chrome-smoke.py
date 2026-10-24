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

        def run_terminal(value):
            execute("document.querySelector('.terminal-screen').click()")
            actions = []
            for key in (*value, '\ue007'):
                actions.extend([{'type': 'keyDown', 'value': key}, {'type': 'keyUp', 'value': key}])
            command('/actions', {'actions': [{'type': 'key', 'id': 'keyboard', 'actions': actions}]})

        command('/url', {'url': (ROOT / 'site' / 'index.html').as_uri()})
        browser = created['capabilities']['browserVersion']
        assert execute("return document.readyState") == 'complete'
        assert execute("return document.querySelectorAll('.command-card').length") == 30
        assert execute("return Boolean(document.querySelector('link[href=\"styles.css\"]')?.sheet)")
        assert execute("return document.querySelector('#status-announcer').textContent") == ''
        assert execute("return document.querySelector('h1').textContent") == 'Aprenda comandos que ficam na memória.'
        carousel = execute("return {count: document.querySelectorAll('#vim-carousel .vim-slide').length, interval: document.querySelector('#vim-carousel').dataset.interval, visible: [...document.querySelectorAll('#vim-carousel .vim-slide')].findIndex((slide) => slide.getAttribute('aria-hidden') !== 'true'), label: document.querySelector('#vim-carousel-position').textContent, enabled: document.querySelector('#vim-carousel-autoplay').getAttribute('aria-pressed')}")
        assert carousel == {'count': 4, 'interval': '10000', 'visible': 0, 'label': '1 de 4', 'enabled': 'true'}, carousel
        assert execute("return Boolean(document.querySelector('a[href=\"#aulas\"]') && document.querySelector('a[href=\"materiais/content/cheatsheet.html\"]'))"), 'os dois caminhos de entrada devem estar disponíveis'
        assert execute("return !document.querySelector('.hero').textContent.includes('Esc volta ao modo normal ou cancela uma operação')"), 'a dica isolada de Esc não deve aparecer no hero'
        assert execute("return document.querySelector('#aulas article').textContent.includes('editor de texto modal') && document.querySelector('#aulas article').textContent.includes('modo de inserção')"), 'a introdução deve explicar Vim e seus modos'
        for selector, expected_role, expected_name in (
            ('h1', 'heading', 'Aprenda comandos que ficam na memória.'),
            ('#vim-slide-1', 'group', 'O que é o Vim?'),
            ('.hero > a[href="#aulas"]', 'link', 'Começar a aprender'),
            ('.hero > a[href="materiais/content/cheatsheet.html"]', 'link', 'Ver cola rápida'),
        ):
            element = command('/element', {'using': 'css selector', 'value': selector})['value']
            element_key = 'element-6066-11e4-a52e-4f735466cecf'
            element_id = element.get(element_key, element.get('ELEMENT'))
            assert element_id, f'elemento acessível ausente para {selector}: {element}'
            role = command(f'/element/{element_id}/computedrole')['value']
            name = command(f'/element/{element_id}/computedlabel')['value']
            assert (role, name) == (expected_role, expected_name), f'nome/papel acessível inesperado em {selector}: {(role, name)}'
        execute("document.querySelector('#vim-carousel').scrollIntoView({block: 'center'})")
        time.sleep(.1)
        carousel_deadline = time.monotonic() + 12
        while time.monotonic() < carousel_deadline and execute("return document.querySelector('#vim-carousel-position').textContent") != '2 de 4':
            time.sleep(.1)
        assert execute("return document.querySelector('#vim-carousel-position').textContent") == '2 de 4', 'o carrossel deve avançar automaticamente a cada 10 segundos'
        execute("document.querySelector('#vim-carousel-next').click()")
        assert execute("return document.querySelector('#vim-carousel-position').textContent") == '3 de 4', 'controle próxima deve mudar o cartão'
        execute("document.querySelector('#vim-carousel-previous').click()")
        assert execute("return document.querySelector('#vim-carousel-position').textContent") == '2 de 4', 'controle anterior deve mudar o cartão'
        actions = []
        for _ in range(10):
            actions.extend([{'type': 'keyDown', 'value': '\ue004'}, {'type': 'keyUp', 'value': '\ue004'}])
        command('/actions', {'actions': [{'type': 'key', 'id': 'keyboard', 'actions': actions}]})
        focused_carousel = execute("return {id:document.activeElement.id,live:document.querySelector('#vim-carousel').getAttribute('aria-live'),outline:getComputedStyle(document.activeElement).outlineStyle}")
        assert focused_carousel['id'] == 'vim-carousel-autoplay', focused_carousel
        assert focused_carousel['live'] == 'polite' and focused_carousel['outline'] == 'solid', focused_carousel
        command('/actions', {'actions': [{'type': 'key', 'id': 'keyboard', 'actions': [
            {'type': 'keyDown', 'value': '\ue007'}, {'type': 'keyUp', 'value': '\ue007'}
        ]}]})
        paused = execute("return {pressed:document.querySelector('#vim-carousel-autoplay').getAttribute('aria-pressed'),text:document.querySelector('#vim-carousel-autoplay').textContent}")
        assert paused == {'pressed': 'false', 'text': 'Rotação automática'}, paused
        assert execute("return document.activeElement.id") != 'terminal-input', 'o terminal não deve roubar o foco ao carregar a página'
        assert execute("return !document.querySelector('#terminal-form') && ![...document.querySelectorAll('button')].some((button) => button.textContent.includes('Executar comando simulado'))"), 'não deve existir formulário separado nem botão para executar comandos'
        assert execute("return ['#activate-simulator', '#reset-simulator', '#restart-challenge'].every((selector) => !document.querySelector(selector))"), 'a prática não deve depender de botões de ativação, restauração ou reinício'
        assert execute("return Boolean(document.querySelector('#terminal-input').closest('.terminal-screen'))"), 'a linha de comando deve estar dentro do único terminal visual'
        assert execute("return document.querySelector('#terminal-input').getAttribute('contenteditable')") == 'plaintext-only'
        execute("document.querySelector('.terminal-screen').click()")
        assert execute("return document.activeElement.id") == 'terminal-input', 'clicar no terminal deve ativar a linha de comando'
        run_terminal('ls')
        assert 'teste.txt' in execute("return document.querySelector('#terminal-output').textContent"), 'teste.txt deve existir no diretório inicial'

        run_terminal('vim teste.txt')
        terminal_flow = execute("""
          return {terminalHidden: document.querySelector('#terminal-view').hidden,
                  vimVisible: !document.querySelector('#vim-workspace').hidden,
                  focused: document.activeElement.id,
                  filename: document.querySelector('#vim-filename').textContent};
        """)
        assert terminal_flow['terminalHidden'] and terminal_flow['vimVisible'] and terminal_flow['focused'] == 'simulator-editor', terminal_flow
        assert terminal_flow['filename'] == 'teste.txt', terminal_flow
        assert execute("return document.querySelector('#vim-command-line') && document.querySelector('#vim-feedback')"), 'o editor deve mostrar a linha Ex e o feedback visual'
        actions = []
        for key in ('i', 'O', 'K', '\ue003', '!', '\ue00c'):
            actions.extend([{'type': 'keyDown', 'value': key}, {'type': 'keyUp', 'value': key}])
        command('/actions', {'actions': [{'type': 'key', 'id': 'keyboard', 'actions': actions}]})
        actions = []
        for key in (':', 'q'):
            actions.extend([{'type': 'keyDown', 'value': key}, {'type': 'keyUp', 'value': key}])
        command('/actions', {'actions': [{'type': 'key', 'id': 'keyboard', 'actions': actions}]})
        assert execute("return document.querySelector('#vim-command-line').textContent.trim()") == ':q', 'comando Ex deve aparecer enquanto é digitado'
        command('/actions', {'actions': [{'type': 'key', 'id': 'keyboard', 'actions': [{'type': 'keyDown', 'value': '\ue007'}, {'type': 'keyUp', 'value': '\ue007'}]}]})
        unsaved_quit = execute("return {visible: !document.querySelector('#vim-workspace').hidden, feedback: document.querySelector('#status-announcer').textContent, visibleFeedback: document.querySelector('#vim-feedback').textContent}")
        assert unsaved_quit['visible'] and 'alterações não salvas' in unsaved_quit['feedback'], unsaved_quit
        assert 'alterações não salvas' in unsaved_quit['visibleFeedback'], unsaved_quit
        actions = []
        for key in (':', 'w', 'q', '\ue007'):
            actions.extend([{'type': 'keyDown', 'value': key}, {'type': 'keyUp', 'value': key}])
        command('/actions', {'actions': [{'type': 'key', 'id': 'keyboard', 'actions': actions}]})
        saved_flow = execute("""
          return {terminalVisible: !document.querySelector('#terminal-view').hidden,
                  vimHidden: document.querySelector('#vim-workspace').hidden,
                  prompt: document.querySelector('#terminal-prompt').textContent,
                  output: document.querySelector('#terminal-output').textContent};
        """)
        assert saved_flow['terminalVisible'] and saved_flow['vimHidden'] and saved_flow['prompt'] == 'aluno@vim:/home/aluno$', saved_flow
        run_terminal('vim teste.txt')
        reopened = execute("return {visible: !document.querySelector('#vim-workspace').hidden, text: document.querySelector('#simulator-editor').textContent}")
        assert reopened['visible'] and 'O!' in reopened['text'], reopened
        actions = []
        for key in (':', 'q', '\ue007'):
            actions.extend([{'type': 'keyDown', 'value': key}, {'type': 'keyUp', 'value': key}])
        command('/actions', {'actions': [{'type': 'key', 'id': 'keyboard', 'actions': actions}]})
        run_terminal('cat teste.txt')
        displayed = execute("return document.querySelector('#terminal-output').textContent")
        assert 'O!' in displayed, displayed
        run_terminal('cat ../fora.txt')
        rejected = execute("return document.querySelector('#terminal-output').textContent")
        assert 'Uso: cat' in rejected, rejected
        run_terminal('rm -rf /')
        rejected = execute("return document.querySelector('#terminal-output').textContent")
        assert 'Comando não disponível' in rejected, rejected
        run_terminal('ls -la')
        rejected = execute("return document.querySelector('#terminal-output').textContent")
        assert 'Uso: ls' in rejected, rejected

        command('/window/rect', {'width': 320, 'height': 800})
        mobile = execute("return {width: innerWidth, page: document.documentElement.scrollWidth}")
        assert 300 <= mobile['width'] <= 360, f"viewport móvel inesperada: {mobile}"
        assert mobile['page'] <= mobile['width'], f"transbordamento móvel: {mobile}"
        mobile_home = execute("""
          const hero = document.querySelector('.hero').getBoundingClientRect();
          const lessons = document.querySelector('#aulas').getBoundingClientRect();
          const actions = [...document.querySelectorAll('.hero > a')].map((link) => link.getBoundingClientRect());
          const carouselControls = [...document.querySelectorAll('.vim-carousel-controls button')].map((button) => button.getBoundingClientRect());
          return {heroBottom: hero.bottom, lessonsTop: lessons.top,
                  actionCount: actions.length,
                  actionsInViewport: actions.every((rect) => rect.left >= 0 && rect.right <= innerWidth),
                  controlsInViewport: carouselControls.every((rect) => rect.left >= 0 && rect.right <= innerWidth)};
        """)
        assert mobile_home['actionCount'] == 2 and mobile_home['actionsInViewport'], f'CTAs da página inicial fora da tela móvel: {mobile_home}'
        assert mobile_home['controlsInViewport'], f'controles do carrossel fora da tela móvel: {mobile_home}'
        assert mobile_home['lessonsTop'] >= mobile_home['heroBottom'] - 1, f'hero e trilha se sobrepõem em tela móvel: {mobile_home}'
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
        dark_intro = execute("""
          const intro = document.querySelector('.vim-intro');
          return {background: getComputedStyle(intro).backgroundColor,
                  color: getComputedStyle(intro).color,
                  text: intro.textContent};
        """)
        assert dark_intro['background'] != 'rgba(0, 0, 0, 0)' and 'O que é o Vim?' in dark_intro['text'], dark_intro

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
              if (document.querySelector('#terminal-view').hidden || !document.querySelector('#vim-workspace').hidden) throw new Error('escolher desafio deve manter o terminal pronto');
            """)
            assert execute("return document.querySelector('#challenge-instruction').textContent"), 'a escolha deve mostrar a instrução do desafio'
            run_terminal('vim teste.txt')
            actions = []
            for key in keys:
                actions.extend([{'type': 'keyDown', 'value': key}, {'type': 'keyUp', 'value': key}])
            command('/actions', {'actions': [{'type': 'key', 'id': 'keyboard', 'actions': actions}]})
            if challenge == 'insert-text':
                inserted = execute("return {mode: document.querySelector('#simulator-mode').textContent, text: document.querySelector('#simulator-editor').textContent}")
                assert inserted['mode'] == 'NORMAL' and 'OKLinha inicial.' in inserted['text'], inserted
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
            status = execute("return document.querySelector('#challenge-status').textContent")
            assert status == 'Desafio concluído.', f'{challenge} não foi concluído: {status!r}'
            feedback = execute("return document.querySelector('#status-announcer').textContent")
            assert feedback.startswith('Desafio concluído.'), f'{challenge} não foi anunciado: {feedback!r}'
            if challenge == 'insert-text':
                command('/actions', {'actions': [{'type': 'key', 'id': 'keyboard', 'actions': [
                    {'type': 'keyDown', 'value': '\ue004'}, {'type': 'keyUp', 'value': '\ue004'}
                ]}]})
                next_focus = execute("return document.activeElement.textContent")
                assert next_focus == 'Licença MIT', f'foco após Vim: {next_focus!r}'
                execute("document.querySelector('#simulator-editor').focus()")
            command('/actions', {'actions': [{'type': 'key', 'id': 'keyboard', 'actions': [
                {'type': 'keyDown', 'value': ':'}, {'type': 'keyUp', 'value': ':'},
                {'type': 'keyDown', 'value': 'q'}, {'type': 'keyUp', 'value': 'q'},
                {'type': 'keyDown', 'value': '!'}, {'type': 'keyUp', 'value': '!'},
                {'type': 'keyDown', 'value': '\ue007'}, {'type': 'keyUp', 'value': '\ue007'}
            ]}]})
            assert execute("return !document.querySelector('#terminal-view').hidden && document.querySelector('#vim-workspace').hidden"), 'sair do Vim deve retornar à mesma janela do terminal'

        print(f'Chrome {browser}: site, digitação direta no terminal, Vim/salvar/reabrir, viewport móvel, busca/filtros, foco, tema, simulador e cinco desafios passaram.')
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
