/* ===================================================================
   INTERACTIONS — hero intro trigger, parallax, count-up
   =================================================================== */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Hero intro sequence: fires once preloader is gone ---- */
  const hero = document.getElementById('hero');
  const preloader = document.getElementById('preloader');
  if (hero) {
    const trigger = () => hero.classList.add('is-loaded');
    if (preloader) {
      // sync with preloader.is-hidden transition in animations.js
      window.addEventListener('load', () => setTimeout(trigger, reduced ? 0 : 520));
    } else {
      trigger();
    }
  }

  /* ---- Subtle parallax on the hero building frame ---- */
  const frame = document.getElementById('heroFrame');
  const building = document.getElementById('heroBuilding');
  if (frame && building && !reduced) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = frame.getBoundingClientRect();
        const progress = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0), 1);
        building.style.transform = `scale(1.02) translateY(${(progress - 0.5) * 24}px)`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---- Count-up for [data-count-to] once visible ---- */
  const counters = document.querySelectorAll('[data-count-to]');
  if (counters.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.countTo, 10);
        if (reduced) {
          el.textContent = target;
        } else {
          const duration = 900;
          const start = performance.now();
          const step = (now) => {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
        obs.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => io.observe(c));
  }
})();
