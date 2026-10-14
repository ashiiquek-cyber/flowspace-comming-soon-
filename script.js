(() => {
  const root = document.documentElement;
  const keyboard = document.querySelector('.keyboard');
  const frame = document.getElementById('frame');
  const tag = document.getElementById('frame-tag');
  const wordmark = document.getElementById('wordmark');
  const MODULES = 14;
  const WIDTH = 4;
  const MAX = MODULES - WIDTH;

  // Map each module to the field that occupies it.
  const fields = [...document.querySelectorAll('.field')];
  const modules = [];
  fields.forEach((field) => {
    const span = parseInt(field.style.getPropertyValue('--span'), 10);
    for (let i = 0; i < span; i++) modules.push(field);
  });

  let pos = 0;

  function compose(next) {
    pos = Math.max(0, Math.min(MAX, next));
    frame.style.setProperty('--pos', pos);

    const framed = modules.slice(pos, pos + WIDTH);
    const counts = new Map();
    framed.forEach((f) => counts.set(f, (counts.get(f) || 0) + 1));
    const named = [...counts.keys()].filter((f) => f.dataset.name);

    const dominant = named.reduce((a, b) => (counts.get(b) > counts.get(a) ? b : a), named[0]);
    if (dominant) root.style.setProperty('--accent', dominant.style.getPropertyValue('--c').trim());

    const text = named.map((f) => f.dataset.name).join(' / ');
    tag.textContent = text;
    frame.setAttribute('aria-valuenow', pos);
    frame.setAttribute('aria-valuetext', text);
  }

  function moduleAt(clientX) {
    const rect = keyboard.getBoundingClientRect();
    const unit = rect.width / MODULES;
    return Math.round((clientX - rect.left) / unit - WIDTH / 2);
  }

  // Drag the frame, or tap anywhere on the keyboard to move it there.
  let dragging = false;

  keyboard.addEventListener('pointerdown', (e) => {
    dragging = true;
    frame.classList.add('is-dragging');
    keyboard.setPointerCapture(e.pointerId);
    compose(moduleAt(e.clientX));
  });

  keyboard.addEventListener('pointermove', (e) => {
    if (dragging) compose(moduleAt(e.clientX));
  });

  const release = () => {
    dragging = false;
    frame.classList.remove('is-dragging');
  };
  keyboard.addEventListener('pointerup', release);
  keyboard.addEventListener('pointercancel', release);

  frame.addEventListener('keydown', (e) => {
    const step = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[e.key];
    if (step) { e.preventDefault(); compose(pos + step); }
    if (e.key === 'Home') { e.preventDefault(); compose(0); }
    if (e.key === 'End') { e.preventDefault(); compose(MAX); }
  });

  // Fit the wordmark to the full measure of the keyboard.
  function fit() {
    wordmark.style.fontSize = '';
    const unit = keyboard.getBoundingClientRect().width / MODULES;
    const target = window.innerWidth <= 760 ? unit * MODULES : unit * 9;
    const range = document.createRange();
    range.selectNodeContents(wordmark);
    const actual = range.getBoundingClientRect().width;
    const current = parseFloat(getComputedStyle(wordmark).fontSize);
    if (actual > 0) wordmark.style.fontSize = `${(current * target) / actual}px`;
  }

  // The frame glides once from the first module to its resting pair, hinting it can move.
  compose(0);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(() => { if (!dragging) compose(2); }, reduced ? 0 : 900);
  fit();
  if (document.fonts) document.fonts.ready.then(fit);
  window.addEventListener('resize', fit);
})();
