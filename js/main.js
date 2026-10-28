/* Be Happy Tabacaria — São João del-Rei */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isDesktop = () => innerWidth >= 900;

  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- menu mobile ---------- */
  let lenis = null;
  const burger = $('.nav__burger');
  const menu = $('#menu');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('is-open', open);
    if (lenis) open ? lenis.stop() : lenis.start();
    else document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

  /* ---------- âncoras ---------- */
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id.length > 1 && $(id);
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      if (lenis) lenis.scrollTo(target, { duration: 1.4 });
      else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    })
  );

  const loader = $('.loader');
  const hideLoader = () => loader && loader.remove();

  if (!window.gsap || !window.ScrollTrigger) {
    hideLoader();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ---------- scroll suave ---------- */
  if (!reduce && window.Lenis) {
    lenis = window.lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- helpers de split ---------- */
  const splitChars = (el) => {
    const nodes = [...el.childNodes];
    el.textContent = '';
    const chars = [];
    nodes.forEach((n) => {
      const host = n.nodeType === 1 ? el.appendChild(n.cloneNode(false)) : el;
      [...n.textContent].forEach((c) => {
        const s = document.createElement('span');
        s.className = 'ch';
        s.textContent = c === ' ' ? ' ' : c;
        host.appendChild(s);
        chars.push(s);
      });
    });
    return chars;
  };

  const splitWords = (el) => {
    const words = [];
    [...el.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.append(part);
          const s = document.createElement('span');
          s.className = 'w';
          s.textContent = part;
          frag.append(s);
          words.push(s);
        });
        n.replaceWith(frag);
      } else {
        n.classList.add('w');
        words.push(n);
      }
    });
    return words;
  };

  /* ---------- reduced motion: tudo estático ---------- */
  if (reduce) {
    hideLoader();
    return;
  }

  /* ---------- intro (loader -> hero) ---------- */
  const heroChars = $$('.hero__title .line').flatMap(splitChars);
  gsap.set(heroChars, { yPercent: 115, rotate: 6 });
  gsap.set(['.hero .kicker', '.hero__sub', '.hero__ctas > *', '.hero__scroll', '.hero__meta', '.nav'], { autoAlpha: 0, y: 24 });

  const intro = gsap.timeline({ paused: true });
  intro
    .from('.hero__bg img', { scale: 1.4, duration: 2.4, ease: 'expo.out' }, 0)
    .to(heroChars, { yPercent: 0, rotate: 0, duration: 1.15, ease: 'expo.out', stagger: 0.022 }, 0.1)
    .to(['.nav', '.hero .kicker', '.hero__sub', '.hero__ctas > *', '.hero__meta', '.hero__scroll'],
      { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07 }, 0.55);

  const heroImg = $('.hero__bg img');
  const imgReady = heroImg.complete ? Promise.resolve() : new Promise((r) => { heroImg.onload = heroImg.onerror = r; });
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  const minTime = new Promise((r) => setTimeout(r, 1100));
  const maxTime = new Promise((r) => setTimeout(r, 3200));

  Promise.race([Promise.all([imgReady, fontsReady, minTime]), maxTime]).then(() => {
    gsap.timeline()
      .to('.loader__inner', { autoAlpha: 0, y: -16, duration: 0.35, ease: 'power2.in' })
      .to(loader, { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, '-=0.05')
      .add(() => intro.play(), '-=0.55')
      .add(() => { hideLoader(); ScrollTrigger.refresh(); });
  });

  /* ---------- hero: cidade -> dentro da loja ---------- */
  const mm = gsap.matchMedia();

  gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: () => '+=' + innerHeight * 1.3, scrub: 0.6, pin: true, anticipatePin: 1 },
  })
    .to('.hero__content', { yPercent: -18, autoAlpha: 0, ease: 'power1.in', duration: 0.4 }, 0)
    .to(['.hero__scroll', '.hero__meta'], { autoAlpha: 0, duration: 0.2 }, 0)
    .to('.hero__bg', { scale: 1.3, ease: 'none', duration: 1 }, 0)
    .fromTo('.hero__portal',
      { clipPath: 'inset(50% 50% 50% 50% round 300px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 0.75 }, 0.12)
    .fromTo('.hero__portal img', { scale: 1.5 }, { scale: 1, ease: 'none', duration: 0.88 }, 0.12)
    .from('.portal__text span', { yPercent: 60, autoAlpha: 0, stagger: 0.08, ease: 'power3.out', duration: 0.22 }, 0.66);

  /* letras do título reagem ao mouse */
  if (finePointer) {
    const title = $('.hero__title');
    const setters = heroChars.map((c) => gsap.quickTo(c, 'y', { duration: 0.5, ease: 'power3.out' }));
    title.addEventListener('pointermove', (e) => {
      heroChars.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        setters[i](d < 160 ? -(1 - d / 160) * 26 : 0);
      });
    });
    title.addEventListener('pointerleave', () => setters.forEach((s) => s(0)));
  }

  /* ---------- fumaça ---------- */
  const canvas = $('.hero__smoke');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const count = innerWidth < 768 ? 12 : 24;
    const mouse = { x: -999, y: -999 };
    let w = 0, h = 0, running = true;
    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const make = (init) => ({
      x: Math.random() * w,
      y: init ? h * (0.3 + Math.random() * 0.8) : h + 80,
      r: 90 + Math.random() * 170,
      vx: (Math.random() - 0.5) * 0.25,
      vy: 0.25 + Math.random() * 0.45,
      t: init ? Math.random() * 500 : 0,
      life: 700 + Math.random() * 700,
      seed: Math.random() * 100,
    });
    resize();
    const ps = Array.from({ length: count }, () => make(true));
    addEventListener('resize', resize);
    canvas.parentElement.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.t++;
        p.x += p.vx + Math.sin((p.t + p.seed * 50) * 0.008) * 0.35;
        p.y -= p.vy;
        p.r += 0.12;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 220) { p.x += (dx / d) * 1.6; p.y += (dy / d) * 0.8; }
        const k = p.t / p.life;
        const a = Math.sin(Math.PI * Math.min(k, 1)) * 0.085;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(240,236,226,${a})`);
        g.addColorStop(1, 'rgba(240,236,226,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        if (k >= 1 || p.y + p.r < 0) Object.assign(p, make(false));
      }
      requestAnimationFrame(draw);
    };
    new IntersectionObserver(([en]) => {
      const was = running;
      running = en.isIntersecting;
      if (running && !was) requestAnimationFrame(draw);
    }).observe(canvas);
    requestAnimationFrame(draw);
  }

  /* ---------- nav + barra mobile + progresso ---------- */
  const nav = $('.nav');
  const mbar = $('.mbar');
  const progress = $('.progress');
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      gsap.set(progress, { scaleX: self.progress });
      const y = self.scroll();
      const pastHero = y > innerHeight * 0.6;
      nav.classList.toggle('is-hidden', self.direction === 1 && y > innerHeight * 0.4 && !menu.classList.contains('is-open'));
      mbar.classList.toggle('is-visible', pastHero);
    },
  });

  /* ---------- tickers (velocidade reage ao scroll) ---------- */
  const loops = [];
  $$('.ticker__track, .hoods__track').forEach((track) => {
    const group = track.firstElementChild;
    const clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
    const dir = Number(track.closest('[data-dir]')?.dataset.dir || 1);
    const tween = dir === 1
      ? gsap.to(track, { xPercent: -50, duration: 26, ease: 'none', repeat: -1 })
      : gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration: 30, ease: 'none', repeat: -1 });
    loops.push(tween);
  });
  const skewers = $$('.ticker__row').map((row) => gsap.quickTo(row, 'skewX', { duration: 0.5, ease: 'power3.out' }));
  ScrollTrigger.create({
    onUpdate: (self) => {
      const v = self.getVelocity();
      const boost = 1 + Math.min(Math.abs(v) / 250, 6);
      loops.forEach((t) => gsap.to(t, { timeScale: boost * (v < 0 ? -1 : 1), duration: 0.2, overwrite: true }));
      skewers.forEach((s) => s(gsap.utils.clamp(-8, 8, v / -300)));
      clearTimeout(self._t);
      self._t = setTimeout(() => {
        loops.forEach((t) => gsap.to(t, { timeScale: 1, duration: 0.8, overwrite: true }));
        skewers.forEach((s) => s(0));
      }, 120);
    },
  });

  /* ---------- texto que acende palavra por palavra ---------- */
  $$('.reveal-words').forEach((el) => {
    const words = splitWords(el);
    gsap.fromTo(words, { opacity: 0.13 }, {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: true },
    });
  });

  /* ---------- contadores ---------- */
  $$('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const o = { v: 0 };
    el.textContent = '0';
    gsap.to(o, {
      v: end, duration: 1.6, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => (el.textContent = Math.round(o.v)),
    });
  });
  gsap.from('.stat', { y: 40, autoAlpha: 0, stagger: 0.12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.stats', start: 'top 85%' } });

  /* ---------- títulos de seção ---------- */
  $$('.catalog__intro h2, .space__title, .delivery__title, .gallery__head h2, .shop h2, .visit__info h2, .faq__title').forEach((h) => {
    gsap.from(h, {
      yPercent: 30, autoAlpha: 0, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: h, start: 'top 88%' },
    });
  });

  /* ---------- catálogo ---------- */
  const rail = $('.catalog__rail');
  const cards = $$('.catalog__cards .card');
  const countEl = $('.catalog__count b');
  const barEl = $('.catalog__bar i');
  const setCount = (n) => { countEl.textContent = String(Math.min(n, 8)).padStart(2, '0'); };

  mm.add('(min-width: 900px)', () => {
    const dist = () => rail.scrollWidth - innerWidth;
    const tween = gsap.to(rail, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.catalog', start: 'top top', end: () => '+=' + dist(),
        pin: true, scrub: 0.7, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (self) => {
          gsap.set(barEl, { scaleX: self.progress });
          setCount(Math.max(1, Math.ceil(self.progress * 8.4)));
        },
      },
    });
    cards.forEach((card) => {
      const img = $('.card__media img', card);
      if (img) gsap.fromTo(img, { xPercent: 6 }, {
        xPercent: -6, ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
      });
      gsap.from(card, {
        rotate: 4, yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'left 60%', scrub: true },
      });
    });
  });

  mm.add('(max-width: 899px)', () => {
    gsap.from(cards.slice(0, 3), {
      x: 80, autoAlpha: 0, stagger: 0.1, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: '.catalog__cards', start: 'top 85%' },
    });
  });

  /* inclinação 3D nos cards */
  if (finePointer) {
    cards.forEach((card) => {
      const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });
      gsap.set(card, { transformPerspective: 900 });
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
      });
      card.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  /* ---------- espaço & café ---------- */
  gsap.fromTo('.space__img img', { yPercent: -8 }, {
    yPercent: 8, ease: 'none',
    scrollTrigger: { trigger: '.space__img', start: 'top bottom', end: 'bottom top', scrub: true },
  });
  gsap.from('.space__img', {
    clipPath: 'inset(20% 12% 20% 12% round 28px)', ease: 'none',
    scrollTrigger: { trigger: '.space__img', start: 'top 95%', end: 'top 35%', scrub: true },
  });
  gsap.to('.sticker__ring', {
    rotate: 360, ease: 'none',
    scrollTrigger: { trigger: '.space', start: 'top bottom', end: 'bottom top', scrub: 0.5 },
  });
  gsap.from('.sticker', {
    scale: 0, rotate: -90, duration: 1.2, ease: 'back.out(1.8)',
    scrollTrigger: { trigger: '.space__media', start: 'top 70%' },
  });
  gsap.from('.perks li', {
    x: -30, autoAlpha: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.perks', start: 'top 85%' },
  });

  /* ---------- delivery: rota desenhada pelo scroll ---------- */
  const path = $('.route__path');
  const dot = $('.route__dot');
  if (path && dot) {
    const len = path.getTotalLength();
    const place = (p) => {
      const pt = path.getPointAtLength(len * p);
      dot.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
      path.style.strokeDashoffset = len * (1 - p);
    };
    path.style.strokeDasharray = len;
    place(0);
    const o = { p: 0 };
    gsap.to(o, {
      p: 1, ease: 'none', onUpdate: () => place(o.p),
      scrollTrigger: { trigger: '.route', start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
    });
    gsap.from('.route__home', {
      scale: 0, transformOrigin: 'center', duration: 0.6, ease: 'back.out(2)',
      scrollTrigger: { trigger: '.route', start: 'bottom 50%', toggleActions: 'play none none reverse' },
    });
  }
  gsap.from('.step', {
    y: 40, autoAlpha: 0, stagger: 0.12, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.steps', start: 'top 82%' },
  });

  /* ---------- galeria ---------- */
  $$('.g-item').forEach((f) => {
    gsap.fromTo(f, { clipPath: 'inset(16% 8% 16% 8% round 28px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none',
      scrollTrigger: { trigger: f, start: 'top 95%', end: 'top 40%', scrub: true },
    });
    gsap.fromTo($('img', f), { yPercent: -8, scale: 1.15 }, {
      yPercent: 8, scale: 1, ease: 'none',
      scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  /* ---------- loja online: sol amarelo cresce ---------- */
  gsap.fromTo('.shop__sun', { scale: 0.15 }, {
    scale: 2.6, ease: 'none',
    scrollTrigger: { trigger: '.shop', start: 'top 85%', end: 'bottom 30%', scrub: true },
  });

  /* ---------- rodapé ---------- */
  gsap.from('.footer__big span', {
    yPercent: 100, ease: 'none', stagger: 0.06,
    scrollTrigger: { trigger: '.footer', start: 'top 95%', end: 'top 35%', scrub: true },
  });

  /* ---------- botões magnéticos ---------- */
  if (finePointer) {
    $$('.magnetic').forEach((b) => {
      const mx = gsap.quickTo(b, 'x', { duration: 0.6, ease: 'elastic.out(1, .4)' });
      const my = gsap.quickTo(b, 'y', { duration: 0.6, ease: 'elastic.out(1, .4)' });
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.3);
        my((e.clientY - r.top - r.height / 2) * 0.4);
      });
      b.addEventListener('pointerleave', () => { mx(0); my(0); });
    });
  }

  /* ---------- cursor ---------- */
  if (finePointer) {
    root.classList.add('has-cursor');
    const cur = $('.cursor');
    const cx = gsap.quickTo(cur, 'x', { duration: 0.25, ease: 'power3.out' });
    const cy = gsap.quickTo(cur, 'y', { duration: 0.25, ease: 'power3.out' });
    addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); });
    addEventListener('pointerdown', () => cur.classList.add('is-down'));
    addEventListener('pointerup', () => cur.classList.remove('is-down'));
    document.addEventListener('pointerover', (e) => {
      cur.classList.toggle('is-hover', !!e.target.closest('a, button, summary, .card'));
    });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
})();
