(function () {
  const body = document.body;
  const app = document.getElementById('app');
  const hero = app?.querySelector('.welcome-screen');
  const canvas = document.getElementById('embers');

  function applyHomeState(enabled) {
    body.classList.toggle('home-active', enabled);
    if (enabled) {
      document.documentElement.style.scrollBehavior = 'auto';
    }
  }

  function setupHome() {
    if (!hero || !app) {
      return;
    }

    applyHomeState(true);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion && canvas) {
      const ctx = canvas.getContext('2d');
      let W = 0;
      let H = 0;
      let dpr = 1;
      let particles = [];
      let rafId = 0;

      function spawnParticle(fromTop = true) {
        return {
          x: Math.random() * W,
          y: fromTop ? Math.random() * H : H + 10,
          r: 0.8 + Math.random() * 2,
          vy: 0.18 + Math.random() * 0.7,
          vx: (Math.random() - 0.5) * 0.25,
          a: 0.3 + Math.random() * 0.6,
          phase: Math.random() * 6.28
        };
      }

      function resizeCanvas() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = canvas.clientWidth;
        H = canvas.clientHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      function initParticles() {
        resizeCanvas();
        particles = Array.from({ length: 60 }, () => spawnParticle(true));
      }

      function renderEmbers(ts) {
        ctx.clearRect(0, 0, W, H);

        for (const p of particles) {
          p.y -= p.vy;
          p.x += p.vx + Math.sin(ts / 900 + p.phase) * 0.12;

          if (p.y < -10) {
            Object.assign(p, spawnParticle(false));
          }

          const glow = Math.min(1, (H - p.y) / 120) * Math.min(1, p.y / 120);
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, ${170 + p.r * 16 | 0}, 80, ${p.a * glow})`;
          ctx.shadowColor = 'rgba(255,170,60,.8)';
          ctx.shadowBlur = 8;
          ctx.arc(p.x, p.y, p.r, 0, 6.28318);
          ctx.fill();
        }

        rafId = requestAnimationFrame(renderEmbers);
      }

      initParticles();
      rafId = requestAnimationFrame(renderEmbers);

      window.addEventListener('resize', initParticles);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          cancelAnimationFrame(rafId);
        } else {
          rafId = requestAnimationFrame(renderEmbers);
        }
      });
    }

    const handlePointerMove = (event) => {
      if (window.matchMedia('(pointer: coarse)').matches) {
        return;
      }
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      hero.style.backgroundPosition = `${40 + x * 6}% 20%`;
    };

    hero.addEventListener('pointermove', handlePointerMove);
    hero.addEventListener('pointerleave', () => {
      hero.style.backgroundPosition = '40% 20%';
    });
  }

  function tearDownHome() {
    applyHomeState(false);
    document.documentElement.style.scrollBehavior = '';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupHome);
  } else {
    setupHome();
  }

  window.__home = { setupHome, tearDownHome, applyHomeState };
})();
