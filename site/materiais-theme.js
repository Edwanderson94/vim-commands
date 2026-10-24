(function () {
  const root = document.documentElement;
  let dark = false;

  try { dark = localStorage.getItem('vim-theme') === 'dark'; }
  catch { /* Tema claro padrão se o navegador bloquear armazenamento local. */ }

  root.dataset.theme = dark ? 'dark' : 'light';

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('#theme-toggle');
    if (!toggle) return;

    function setTheme(isDark) {
      dark = isDark;
      root.dataset.theme = dark ? 'dark' : 'light';
      toggle.textContent = dark ? 'Tema claro' : 'Tema escuro';
      toggle.setAttribute('aria-pressed', String(dark));
      try { localStorage.setItem('vim-theme', dark ? 'dark' : 'light'); }
      catch { /* A troca de tema continua funcional sem persistência. */ }
    }

    setTheme(dark);
    toggle.addEventListener('click', () => setTheme(!dark));
  });
})();
