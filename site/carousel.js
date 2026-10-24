(function () {
  const carousel = document.querySelector('#vim-carousel');
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll('.vim-slide')];
  const position = carousel.querySelector('#vim-carousel-position');
  const previous = carousel.querySelector('#vim-carousel-previous');
  const next = carousel.querySelector('#vim-carousel-next');
  const autoplay = carousel.querySelector('#vim-carousel-autoplay');
  const help = carousel.querySelector('#vim-carousel-help');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const interval = Number(carousel.dataset.interval) || 10000;
  let current = slides.findIndex((slide) => !slide.hidden);
  let automatic = !motionPreference.matches;
  let pointerInside = false;
  let focusInside = false;
  let inViewport = !('IntersectionObserver' in window);
  let timer = null;

  if (current < 0) current = 0;

  function isPaused() {
    return !automatic || pointerInside || focusInside || !inViewport || document.hidden;
  }

  function schedule() {
    window.clearTimeout(timer);
    if (isPaused()) return;
    timer = window.setTimeout(() => {
      current = (current + 1) % slides.length;
      render();
    }, interval);
  }

  function render() {
    slides.forEach((slide, index) => {
      const inactive = index !== current;
      slide.setAttribute('aria-hidden', String(inactive));
      slide.inert = inactive;
    });
    position.textContent = `${current + 1} de ${slides.length}`;
    position.setAttribute('aria-live', isPaused() ? 'polite' : 'off');
    carousel.setAttribute('aria-live', isPaused() ? 'polite' : 'off');
    autoplay.setAttribute('aria-pressed', String(automatic));
    autoplay.textContent = 'Rotação automática';
    help.textContent = !automatic && motionPreference.matches
      ? 'A rotação está pausada por preferência de movimento reduzido. Use o controle “Rotação automática” para ativá-la.'
      : automatic
        ? 'As informações avançam a cada 10 segundos enquanto o carrossel está visível. A rotação pausa durante a interação; use o controle “Rotação automática” para ler no seu ritmo.'
        : 'A rotação está pausada. Use o controle “Rotação automática” para voltar à troca a cada 10 segundos.';
    schedule();
  }

  function show(offset) {
    current = (current + offset + slides.length) % slides.length;
    render();
  }

  previous.addEventListener('click', () => show(-1));
  next.addEventListener('click', () => show(1));
  autoplay.addEventListener('click', () => {
    automatic = !automatic;
    render();
  });

  carousel.addEventListener('pointerenter', () => {
    pointerInside = true;
    render();
  });
  carousel.addEventListener('pointerleave', () => {
    pointerInside = false;
    render();
  });
  carousel.addEventListener('focusin', () => {
    focusInside = true;
    render();
  });
  carousel.addEventListener('focusout', (event) => {
    if (carousel.contains(event.relatedTarget)) return;
    focusInside = false;
    render();
  });
  document.addEventListener('visibilitychange', render);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting && entry.intersectionRatio > 0;
      render();
    });
    observer.observe(carousel);
  }

  const updateMotionPreference = () => {
    if (motionPreference.matches) automatic = false;
    render();
  };
  if (motionPreference.addEventListener) {
    motionPreference.addEventListener('change', updateMotionPreference);
  } else {
    motionPreference.addListener(updateMotionPreference);
  }

  render();
})();
