/* Reclimate — interactions. No dependencies. */
(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ── year ─────────────────────────────────────────────── */
  const yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── sticky nav ───────────────────────────────────────── */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 24);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  /* ── mobile drawer ────────────────────────────────────── */
  const toggle = $('#navToggle');
  const drawer = $('#navDrawer');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    drawer.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  drawer?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ── typewriter ───────────────────────────────────────── */
  const typer = $('#typer .type__text');
  if (typer) {
    const words = ['rice husk', 'palm EFB', 'forestry residue', 'mill waste', 'what gets burned'];
    if (reduced) {
      typer.textContent = words[0];
    } else {
      let w = 0, i = 0, deleting = false;
      const tick = () => {
        const word = words[w];
        i += deleting ? -1 : 1;
        typer.textContent = word.slice(0, i);

        let wait = deleting ? 38 : 74;
        if (!deleting && i === word.length) { wait = 1900; deleting = true; }
        else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; wait = 320; }
        setTimeout(tick, wait);
      };
      setTimeout(tick, 700);
    }
  }

  /* ── reveal on scroll + step thermometer ──────────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

  $$('.reveal').forEach((el) => io.observe(el));

  /* ── count-up ─────────────────────────────────────────── */
  const fmt = new Intl.NumberFormat('en-US');
  const countUp = (el) => {
    const target = Number(el.dataset.to) || 0;
    if (reduced) { el.textContent = fmt.format(target); return; }
    const dur = 1500;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt.format(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countUp(entry.target);
      countIO.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  $$('.count').forEach((el) => countIO.observe(el));

  /* ── marquee: duplicate the row so the loop is seamless ─ */
  $$('[data-marquee]').forEach((m) => {
    const row = $('.marquee__row', m);
    if (!row) return;
    row.append(...[...row.children].map((li) => li.cloneNode(true)));
  });

  /* ── stakeholder tabs ─────────────────────────────────── */
  $$('[data-tabs]').forEach((group) => {
    const tabs = $$('[role="tab"]', group);
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (!panel) return;
        panel.hidden = !on;
        panel.classList.toggle('is-active', on);
      });
    };

    tabs.forEach((tab, idx) => {
      tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        const map = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        const delta = map[e.key];
        if (!delta) return;
        e.preventDefault();
        const next = tabs[(idx + delta + tabs.length) % tabs.length];
        next.focus();
        select(next);
      });
    });
  });

  /* ── ember field ──────────────────────────────────────── */
  const initEmbers = (canvas, density) => {
    if (!canvas || reduced) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, particles = [];

    const seed = () => {
      const count = Math.round((w * h) / density);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.4,
        vy: -(Math.random() * 0.26 + 0.06),
        vx: (Math.random() - 0.5) * 0.14,
        a: Math.random() * 0.5 + 0.12,
        drift: Math.random() * Math.PI * 2
      }));
    };

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    let raf = 0;
    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.drift += 0.01;
        p.x += p.vx + Math.sin(p.drift) * 0.16;
        p.y += p.vy;

        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        // fade out as embers rise
        const life = Math.max(0, Math.min(1, p.y / h));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        // brand amber (#F8AB4A) cooling toward terracotta as embers rise
        ctx.fillStyle = `rgba(248, ${150 + Math.round(p.a * 50)}, ${60 + Math.round(p.a * 30)}, ${p.a * life})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    const visIO = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { if (!raf) raf = requestAnimationFrame(frame); }
      else { cancelAnimationFrame(raf); raf = 0; }
    }, { threshold: 0 });

    resize();
    addEventListener('resize', resize);
    visIO.observe(canvas);
  };

  initEmbers($('#embers'), 26000);
  initEmbers($('#embers2'), 34000);
})();
