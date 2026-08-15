/* ===================================================================
   DEPARTMENTS — card generation + full-screen department experience
   =================================================================== */
(function () {
  const cardsHost = document.getElementById('deptCards');
  const overlay = document.getElementById('deptOverlay');
  if (!cardsHost || !overlay || typeof FCI_CONTENT === 'undefined') return;

  const DEPTS = FCI_CONTENT.departments;
  let rafId = null;

  /* ---------------- Cards ---------------- */
  function renderCards() {
    cardsHost.innerHTML = DEPTS.map((d) => `
      <article class="dept-card dept-card--${d.id}" style="--dept-color:${d.color};--dept-color-deep:${d.colorDeep}" data-open-dept="${d.id}" tabindex="0" role="button" aria-label="اكتشف مسار ${d.name_ar}">
        <div class="dept-card__top">
          <span class="dept-card__number">${d.order}</span>
          <span class="dept-card__icon"><i data-lucide="${d.icon}"></i></span>
        </div>
        <h3 class="dept-card__name-ar">${d.name_ar}</h3>
        <span class="dept-card__name-en">${d.name_en}</span>
        <p class="dept-card__desc">${d.summary_ar}</p>
        <span class="dept-card__cta">
          <span>استكشف المسار</span>
          <i data-lucide="arrow-left" style="width:16px;height:16px"></i>
        </span>
      </article>
    `).join('');

    if (window.lucide) window.lucide.createIcons();

    cardsHost.querySelectorAll('[data-open-dept]').forEach((card) => {
      card.addEventListener('click', () => openDepartment(card.dataset.openDept, true));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDepartment(card.dataset.openDept, true);
        }
      });
    });
  }

  /* ---------------- Overlay content ---------------- */
  function listOrPlaceholder(items) {
    if (items && items.length) {
      return `<ul class="dept-exp__list">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
    }
    return `<p class="dept-exp__placeholder">المحتوى الرسمي لهذا القسم قيد الإضافة.</p>`;
  }

  function renderOverlay(d) {
    overlay.style.setProperty('--dept-color', d.color);
    overlay.innerHTML = `
      <div class="dept-exp__bg"></div>
      <canvas class="dept-exp__canvas" id="deptCanvas" aria-hidden="true"></canvas>

      <button type="button" class="dept-exp__back" id="deptBack">
        <i data-lucide="arrow-right" style="width:16px;height:16px"></i>
        <span>العودة إلى المسارات</span>
      </button>

      <div class="dept-exp__hero">
        <span class="dept-exp__eyebrow">${d.order} — مسار أكاديمي</span>
        <h2 class="dept-exp__title">${d.name_ar}</h2>
        <p class="dept-exp__title-en">${d.name_en}</p>
        <p class="dept-exp__summary">${d.summary_ar}</p>
      </div>

      <div class="dept-exp__body">
        <div class="dept-exp__block" data-reveal>
          <h3>ماذا ستتعلم</h3>
          ${listOrPlaceholder(d.learn_ar)}
        </div>
        <div class="dept-exp__block" data-reveal>
          <h3>المجالات الأساسية</h3>
          ${listOrPlaceholder(d.core_areas_ar)}
        </div>
        <div class="dept-exp__block" data-reveal>
          <h3>مجالات مستقبلية</h3>
          ${listOrPlaceholder(d.career_paths_ar)}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    overlay.querySelector('#deptBack').addEventListener('click', () => closeDepartment(true));

    overlay.querySelectorAll('[data-reveal]').forEach((el, i) => {
      el.style.setProperty('--i', i);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-visible')));
    });

    initCanvas(d);
  }

  /* ---------------- Department-specific visual world (Canvas 2D) ---------------- */
  let animationFrameId, canvasCtx, particles = [], resizeHandler = null;

  function initCanvas(d) {
    stopCanvas();
    const canvas = document.getElementById('deptCanvas');
    if (!canvas) return;
    canvasCtx = canvas.getContext('2d', { alpha: true });
    
    let w, h;
    resizeHandler = function() {
      if (!canvasCtx || !canvas) return;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      canvasCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeHandler();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const color = d.color;
    particles = [];
    
    if (d.id === 'cs') {
      for (let i = 0; i < 45; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 1
        });
      }
    } else if (d.id === 'is') {
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 60 + 20,
          speed: Math.random() * 0.8 + 0.2,
          lane: Math.floor(Math.random() * 8)
        });
      }
    } else {
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          pulse: Math.random() * Math.PI * 2
        });
      }
    }

    function draw() {
      if (!canvasCtx) return;
      canvasCtx.clearRect(0, 0, w, h);
      
      if (d.id === 'cs') {
        particles.forEach(p => {
          if (!reduced) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
          }
          canvasCtx.beginPath();
          canvasCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          canvasCtx.fillStyle = color;
          canvasCtx.globalAlpha = 0.6;
          canvasCtx.fill();
        });
        canvasCtx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 150) {
              canvasCtx.beginPath();
              canvasCtx.moveTo(particles[i].x, particles[i].y);
              canvasCtx.lineTo(particles[i].x, particles[j].y);
              canvasCtx.lineTo(particles[j].x, particles[j].y);
              canvasCtx.strokeStyle = color;
              canvasCtx.globalAlpha = (1 - dist / 150) * 0.15;
              canvasCtx.stroke();
            }
          }
        }
      } else if (d.id === 'is') {
        particles.forEach(p => {
          if (!reduced) {
            p.x += p.speed;
            if (p.x > w + p.size) p.x = -p.size;
          }
          const yPos = (h / 8) * p.lane + 60;
          canvasCtx.beginPath();
          canvasCtx.rect(p.x, yPos, p.size, 6);
          canvasCtx.fillStyle = color;
          canvasCtx.globalAlpha = 0.3;
          canvasCtx.fill();
          
          canvasCtx.beginPath();
          canvasCtx.moveTo(0, yPos + 3);
          canvasCtx.lineTo(w, yPos + 3);
          canvasCtx.strokeStyle = color;
          canvasCtx.globalAlpha = 0.05;
          canvasCtx.stroke();
        });
      } else {
        particles.forEach((p, i) => {
          if (!reduced) p.pulse += 0.03;
          canvasCtx.beginPath();
          canvasCtx.rect(p.x - 3, p.y - 3, 6, 6);
          canvasCtx.fillStyle = color;
          canvasCtx.globalAlpha = 0.4 + Math.sin(p.pulse) * 0.3;
          canvasCtx.fill();
        });
        canvasCtx.lineWidth = 1.2;
        for (let i = 0; i < particles.length; i++) {
          let nearest = particles.map((p2, j) => ({ j, dist: Math.hypot(p2.x - particles[i].x, p2.y - particles[i].y) }))
                                .filter(x => x.j !== i)
                                .sort((a,b) => a.dist - b.dist)
                                .slice(0, 2);
          nearest.forEach(n => {
            if (n.dist < 220) {
              canvasCtx.beginPath();
              canvasCtx.moveTo(particles[i].x, particles[i].y);
              canvasCtx.lineTo(particles[n.j].x, particles[n.j].y);
              canvasCtx.strokeStyle = color;
              canvasCtx.globalAlpha = (1 - n.dist / 220) * 0.2;
              canvasCtx.stroke();
            }
          });
        }
      }
      
      if (!reduced) {
        animationFrameId = requestAnimationFrame(draw);
      }
    }
    draw();
    
    window.addEventListener('resize', resizeHandler);
  }

  function stopCanvas() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    animationFrameId = null;
    canvasCtx = null;
    resizeHandler = null;
  }

  function openDepartment(id, pushState) {
    const d = DEPTS.find((x) => x.id === id);
    if (!d) return;
    
    document.body.classList.add('dept-is-open');
    renderOverlay(d);
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    overlay.scrollTop = 0;
    
    if (pushState) history.pushState({ dept: id }, '', `#path-${id}`);
  }

  function closeDepartment(pushState) {
    document.body.classList.remove('dept-is-open');
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    stopCanvas();
    
    if (pushState) history.pushState({}, '', '#paths');
  }

  window.addEventListener('popstate', (e) => {
    const id = e.state && e.state.dept;
    if (id) openDepartment(id, false);
    else closeDepartment(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeDepartment(true);
  });

  renderCards();

  const hashMatch = location.hash.match(/^#path-(cs|is|it)$/);
  if (hashMatch) openDepartment(hashMatch[1], false);
})();
