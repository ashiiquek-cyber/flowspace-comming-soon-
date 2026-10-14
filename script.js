(() => {
  // The band of light drifts slowly across the room, and leans gently toward the pointer.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const root = document.documentElement;
  let target = 0;
  let lean = 0;
  const start = performance.now();

  window.addEventListener('pointermove', (e) => {
    target = (e.clientX / window.innerWidth - 0.5) * 6;
  });

  function frame(now) {
    const t = (now - start) / 1000;
    lean += (target - lean) * 0.03;
    const drift = Math.sin(t / 14) * 10; // a 90-second sweep, ±10% of the width
    root.style.setProperty('--x', `${62 + drift + lean}%`);
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
