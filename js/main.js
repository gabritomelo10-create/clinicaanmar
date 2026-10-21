import { logoSVG, symbolSVG, symbolStrokeSVG, symbolDuoSVG, wordmarkSVG, COLORS, AMAR_SHIFT, downloadName } from './logo.js';
import { PALETTE, PILLARS, MOCKUPS, CATEGORIES, PATTERNS, PHOTOS, STORIES, POSTS, HIGHLIGHTS, VIDEOS, driveImg, driveThumb, driveView, drivePreview } from './data.js';
import { initLayers } from './layers.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const gsap = window.gsap;
const ST = window.ScrollTrigger;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const hasGsap = !!(gsap && ST);
if (hasGsap) gsap.registerPlugin(ST);
document.documentElement.classList.toggle('js', hasGsap);

// ── Logos inline ────────────────────────────────────────
$$('[data-logo]').forEach((el) => {
  const kind = el.dataset.logo;
  el.innerHTML = {
    principal: logoSVG(),
    symbol: symbolSVG(),
    'symbol-stroke': symbolStrokeSVG(),
    'symbol-duo': symbolDuoSVG('enc'),
    'wordmark-letters': wordmarkSVG(COLORS.marfim),
  }[kind] || '';
});

// ── Imagens do Drive com fallback ───────────────────────
function makeImg(id, alt, w = 1400, { eager = false } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'img is-loading';
  const img = new Image();
  img.alt = alt;
  img.decoding = 'async';
  img.loading = eager ? 'eager' : 'lazy';
  img.referrerPolicy = 'no-referrer';
  let tries = 0;
  img.onload = () => { wrap.classList.remove('is-loading'); img.classList.add('is-loaded'); };
  img.onerror = () => {
    tries++;
    if (tries === 1) { img.src = driveThumb(id, w); return; }
    wrap.classList.remove('is-loading');
    img.remove();
    const fb = document.createElement('div');
    fb.className = 'img-fallback';
    fb.innerHTML = `${symbolSVG()}<span>${alt}</span>`;
    wrap.appendChild(fb);
  };
  img.src = driveImg(id, w);
  wrap.appendChild(img);
  return wrap;
}

// ── Split de texto ──────────────────────────────────────
function splitChars(el) {
  const parts = el.innerHTML.split(/<br\s*\/?>/i);
  el.innerHTML = '';
  el.setAttribute('aria-label', el.textContent || parts.map((p) => p.replace(/<[^>]+>/g, '')).join(' '));
  parts.forEach((html) => {
    const line = document.createElement('span');
    line.className = 'split-line';
    line.setAttribute('aria-hidden', 'true');
    const tmp = document.createElement('div');
    tmp.innerHTML = html.trim();
    const walk = (node, parent) => {
      node.childNodes.forEach((n) => {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach((word) => {
            if (!word) return;
            if (/^\s+$/.test(word)) { parent.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.style.display = 'inline-block'; w.style.whiteSpace = 'nowrap';
            [...word].forEach((ch) => { const c = document.createElement('span'); c.className = 'split-char'; c.textContent = ch; w.appendChild(c); });
            parent.appendChild(w);
          });
        } else if (n.nodeType === 1) {
          const clone = n.cloneNode(false);
          parent.appendChild(clone);
          walk(n, clone);
        }
      });
    };
    walk(tmp, line);
    el.appendChild(line);
  });
}
$$('[data-split]').forEach(splitChars);

function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.setAttribute('aria-label', el.textContent.trim());
  el.innerHTML = words.map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
}
$$('[data-words]').forEach(splitWords);

// ── Conteúdo dinâmico ───────────────────────────────────
// Pilares
$('.pilares__grid').innerHTML = PILLARS.map((p) => `
  <article class="pillar">
    <span class="pillar__n">${p.n}</span>
    <svg viewBox="0 0 64 64" aria-hidden="true"><path d="${p.icon}"/></svg>
    <div><h3>${p.t}</h3><p>${p.d}</p></div>
  </article>`).join('');

// Paleta
const swatches = $('.swatches');
swatches.innerHTML = PALETTE.map((c, i) => `
  <button class="swatch ${i < 2 ? 'swatch--light' : 'swatch--dark'}" style="background:${c.hex}" data-hex="${c.hex}" aria-label="${c.name} ${c.hex} — copiar">
    <p class="swatch__role">${c.role}</p>
    <h3 class="swatch__name">${c.name}</h3>
    <div class="swatch__meta"><b>HEX</b> ${c.hex}<br><b>RGB</b> ${c.rgb}<br><b>CMYK</b> ${c.cmyk}</div>
  </button>`).join('');
const toast = $('.toast');
let toastT;
swatches.addEventListener('click', (e) => {
  const b = e.target.closest('.swatch'); if (!b) return;
  navigator.clipboard?.writeText(b.dataset.hex).catch(() => {});
  toast.textContent = `${b.dataset.hex} copiado`;
  toast.classList.add('is-on');
  clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('is-on'), 1800);
});

// Glyphs
$('.glyphs').innerHTML = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((c) => `<span>${c}</span>`).join('');

// Tester tipográfico
const tester = $('.tester__text');
$$('.seg button').forEach((b) => b.addEventListener('click', () => {
  $$('.seg button').forEach((x) => x.classList.toggle('is-on', x === b));
  tester.classList.toggle('is-sans', b.dataset.f === 'sans');
}));
$('.range input').addEventListener('input', (e) => (tester.style.fontSize = `${e.target.value}px`));

// Patterns (arquivos oficiais)
const patternsEl = $('.patterns');
PATTERNS.forEach((p) => {
  const f = document.createElement('figure');
  f.className = 'pattern';
  f.appendChild(makeImg(p.id, p.name, 1200));
  f.insertAdjacentHTML('beforeend', `<figcaption><h3>${p.name}</h3><p>${p.d}</p></figcaption>`);
  f.dataset.cursor = 'Ver';
  f.addEventListener('click', () => openLightbox(PATTERNS.map((x) => ({ type: 'img', id: x.id, title: x.name, sub: x.d })), PATTERNS.indexOf(p)));
  patternsEl.appendChild(f);
});

// Reel (destaques)
const featured = MOCKUPS.filter((m) => m.featured);
const track = $('.reel__track');
featured.forEach((m) => {
  const f = document.createElement('figure');
  f.className = 'reel__card';
  f.appendChild(makeImg(m.id, m.name, 1400));
  f.insertAdjacentHTML('beforeend', `<figcaption><h3>${m.name}</h3><p>${m.spec}</p></figcaption>`);
  f.dataset.cursor = 'Ver';
  f.addEventListener('click', () => openLightbox(featured.map(toItem), featured.indexOf(m)));
  track.appendChild(f);
});

// Galeria + filtros
const toItem = (m) => ({ type: 'img', id: m.id, title: m.name, sub: m.spec });
const gallery = $('.gallery');
const tiles = MOCKUPS.map((m) => {
  const f = document.createElement('figure');
  f.className = 'tile';
  f.dataset.cat = m.cat;
  f.tabIndex = 0;
  f.dataset.cursor = 'Ver';
  f.appendChild(makeImg(m.id, m.name, 1000));
  const catLabel = CATEGORIES.find((c) => c.id === m.cat).label;
  f.insertAdjacentHTML('beforeend', `<span class="tile__cat">${catLabel}</span><figcaption><h3>${m.name}</h3><p>${m.spec}</p></figcaption>`);
  gallery.appendChild(f);
  return f;
});
let activeCat = 'all';
const visibleMockups = () => MOCKUPS.filter((m) => activeCat === 'all' || m.cat === activeCat);
gallery.addEventListener('click', (e) => {
  const t = e.target.closest('.tile'); if (!t) return;
  const list = visibleMockups();
  openLightbox(list.map(toItem), list.indexOf(MOCKUPS[tiles.indexOf(t)]));
});
gallery.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.classList.contains('tile')) e.target.click(); });
const filters = $('.filters');
filters.innerHTML = CATEGORIES.map((c) => `<button role="tab" data-cat="${c.id}" aria-selected="${c.id === 'all'}">${c.label}</button>`).join('');
filters.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  activeCat = b.dataset.cat;
  $$('button', filters).forEach((x) => x.setAttribute('aria-selected', String(x === b)));
  const show = tiles.filter((t) => activeCat === 'all' || t.dataset.cat === activeCat);
  if (hasGsap) {
    gsap.to(tiles, { opacity: 0, y: 20, duration: 0.25, onComplete: () => {
      tiles.forEach((t) => t.classList.toggle('is-hidden', !show.includes(t)));
      gsap.fromTo(show, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: 'expo.out' });
      ST.refresh();
    } });
  } else tiles.forEach((t) => t.classList.toggle('is-hidden', !show.includes(t)));
});

// Digital: stories
const screen = $('.phone__screen');
const bars = $('.phone__bars');
STORIES.forEach((id, i) => {
  const s = document.createElement('div');
  s.className = 'story' + (i === 0 ? ' is-on' : '');
  s.appendChild(makeImg(id, `Story ${i + 1}`, 900));
  screen.appendChild(s);
  bars.insertAdjacentHTML('beforeend', '<i><b></b></i>');
});
let storyI = 0;
function playStory() {
  const ss = $$('.story', screen), bs = $$('b', bars);
  ss.forEach((s, k) => s.classList.toggle('is-on', k === storyI));
  bs.forEach((b, k) => { b.style.transition = 'none'; b.style.width = k < storyI ? '100%' : '0'; });
  requestAnimationFrame(() => requestAnimationFrame(() => { bs[storyI].style.transition = 'width 4s linear'; bs[storyI].style.width = '100%'; }));
  setTimeout(() => { storyI = (storyI + 1) % ss.length; playStory(); }, 4000);
}
playStory();
const hl = $('.highlights');
HIGHLIGHTS.forEach((h) => {
  const d = document.createElement('div');
  d.className = 'hl';
  d.appendChild(makeImg(h.id, h.name, 300));
  d.insertAdjacentHTML('beforeend', `<span>${h.name}</span>`);
  hl.appendChild(d);
});
const feed = $('.feed');
POSTS.forEach((id, i) => {
  const d = document.createElement('div');
  d.className = 'post';
  d.appendChild(makeImg(id, `Post ${i + 1}`, 700));
  d.dataset.cursor = 'Ver';
  d.addEventListener('click', () => openLightbox(POSTS.map((p, k) => ({ type: 'img', id: p, title: `Post ${k + 1}`, sub: '1080 × 1350 px' })), i));
  feed.appendChild(d);
});
const page = $('.laptop__page');
page.appendChild(makeImg(PHOTOS.siteDesktop, 'Proposta visual do site ANMAR', 1600));
const setPageH = () => page.style.setProperty('--page-h', `${page.clientHeight}px`);
setPageH(); addEventListener('resize', setPageH);

// Vídeos
const videos = $('.videos');
VIDEOS.forEach((v, i) => {
  const b = document.createElement('button');
  b.className = 'video';
  b.dataset.cursor = 'Play';
  b.innerHTML = `<div class="video__sym">${symbolSVG()}</div><span class="video__play"></span><h3>${v.name}</h3><p>${v.d}</p>`;
  b.addEventListener('click', () => openLightbox(VIDEOS.map((x) => ({ type: 'video', id: x.id, title: x.name, sub: x.d })), i));
  videos.appendChild(b);
});

// ── Versões da logo ─────────────────────────────────────
const vStage = $('.versions__stage');
const vLogo = $('.versions__logo');
vLogo.innerHTML = logoSVG();
const VERS = {
  principal: { sym: COLORS.gold, wm: COLORS.taupe, wmOp: 1 },
  negativa: { sym: COLORS.gold, wm: COLORS.marfim, wmOp: 1 },
  monocromatica: { sym: COLORS.taupe, wm: COLORS.taupe, wmOp: 1 },
  simbolo: { sym: COLORS.gold, wm: COLORS.gold, wmOp: 0 },
};
function setVersion(v) {
  const c = VERS[v];
  vStage.dataset.v = v;
  $('.sym', vLogo).setAttribute('fill', c.sym);
  $$('.wm path', vLogo).forEach((p) => { p.setAttribute('fill', c.wm); p.style.opacity = c.wmOp; });
  $('svg', vLogo).style.transition = 'transform .9s cubic-bezier(.22,1,.36,1)';
  $('svg', vLogo).style.transform = v === 'simbolo' ? 'translateY(14%) scale(1.15)' : 'none';
  const dl = $('.dl-logo');
  dl.href = `assets/${downloadName(v)}`;
  dl.setAttribute('download', downloadName(v));
  $$('.versions__tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.v === v)));
}
$('.versions__tabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setVersion(b.dataset.v); });
$('.toggle-clear').addEventListener('change', (e) => $('.versions__clear').classList.toggle('is-on', e.target.checked));
vStage.addEventListener('pointermove', (e) => {
  const r = vStage.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
  vLogo.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 14}deg)`;
  $('.versions__light').style.transform = `translate(${x * 60}%, ${y * 60}%)`;
});
vStage.addEventListener('pointerleave', () => (vLogo.style.transform = ''));

// ── Tilt genérico ───────────────────────────────────────
function tilt(el, max = 10, light = true) {
  if (!finePointer) return;
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(1000px) rotateY(${(x - 0.5) * max}deg) rotateX(${(0.5 - y) * max}deg) translateZ(0)`;
    if (light) { el.style.setProperty('--mx', `${x * 100}%`); el.style.setProperty('--my', `${y * 100}%`); }
  });
  el.addEventListener('pointerleave', () => (el.style.transform = ''));
}
$$('.pillar').forEach((p) => tilt(p, 14));
tiles.forEach((t) => tilt(t, 8, false));
$$('.type-card').forEach((t) => tilt(t, 6, false));

// ── Lightbox ────────────────────────────────────────────
const lb = $('.lightbox');
let lbItems = [], lbI = 0;
function renderLightbox() {
  const it = lbItems[lbI];
  const media = $('.lightbox__media', lb);
  media.innerHTML = '';
  if (it.type === 'video') {
    media.innerHTML = `<iframe src="${drivePreview(it.id)}" allow="autoplay; fullscreen" allowfullscreen title="${it.title}"></iframe>`;
  } else {
    const img = new Image();
    img.alt = it.title; img.referrerPolicy = 'no-referrer';
    img.onerror = () => { if (!img.dataset.retry) { img.dataset.retry = 1; img.src = driveThumb(it.id, 2000); } };
    img.src = driveImg(it.id, 2200);
    media.appendChild(img);
    if (hasGsap) gsap.fromTo(img, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' });
  }
  $('figcaption', lb).innerHTML = `${it.title}<small>${it.sub || ''}</small><a href="${driveView(it.id)}" target="_blank" rel="noopener">Abrir no Drive ↗</a>`;
  $$('.lightbox__nav', lb).forEach((b) => (b.style.visibility = lbItems.length > 1 ? 'visible' : 'hidden'));
}
function openLightbox(items, i = 0) {
  lbItems = items; lbI = Math.max(0, i);
  lb.hidden = false;
  requestAnimationFrame(() => lb.classList.add('is-open'));
  renderLightbox();
  lenis?.stop();
  $('.lightbox__close', lb).focus();
}
function closeLightbox() {
  lb.classList.remove('is-open');
  setTimeout(() => { lb.hidden = true; $('.lightbox__media', lb).innerHTML = ''; }, 400);
  lenis?.start();
}
const step = (d) => { lbI = (lbI + d + lbItems.length) % lbItems.length; renderLightbox(); };
$('.lightbox__close', lb).addEventListener('click', closeLightbox);
$('.lightbox__prev', lb).addEventListener('click', () => step(-1));
$('.lightbox__next', lb).addEventListener('click', () => step(1));
lb.addEventListener('click', (e) => { if (e.target === lb || e.target.classList.contains('lightbox__fig')) closeLightbox(); });
addEventListener('keydown', (e) => {
  if (lb.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') step(1);
  if (e.key === 'ArrowLeft') step(-1);
});

// ── Navegação ───────────────────────────────────────────
const nav = $('.nav');
$('.nav__menu').addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  $('.nav__menu').setAttribute('aria-expanded', String(open));
});
let lenis = null;
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const target = $(a.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  nav.classList.remove('is-open');
  if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 });
  else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}));

// ── Cursor ──────────────────────────────────────────────
if (finePointer) {
  const cur = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = $('em', ring);
  const p = { x: innerWidth / 2, y: innerHeight / 2 }, r = { ...p };
  addEventListener('pointermove', (e) => {
    p.x = e.clientX; p.y = e.clientY;
    const t = e.target.closest?.('[data-cursor], a, button, [contenteditable], input, .swatch');
    const lab = t?.dataset?.cursor || e.target.closest?.('canvas')?.dataset.cursor;
    cur.classList.toggle('has-label', !!lab);
    cur.classList.toggle('is-hover', !!t && !lab);
    if (lab) label.textContent = lab;
  });
  $$('.hero__canvas').forEach((c) => (c.dataset.cursor = 'Arraste'));
  $('.showroom__canvas').dataset.cursor = 'Arraste';
  (function loop() {
    r.x += (p.x - r.x) * 0.18; r.y += (p.y - r.y) * 0.18;
    dot.style.transform = `translate(${p.x}px, ${p.y}px)`;
    ring.style.transform = `translate(${r.x}px, ${r.y}px)`;
    requestAnimationFrame(loop);
  })();
}

// ── Texturas vivas ──────────────────────────────────────
initLayers($('.layers__canvas'));

// ── 3D: herói e showroom (carregamento sob demanda) ─────
let hero = null;
const heroReady = import('./hero3d.js')
  .then((m) => { hero = m.initHero($('.hero__canvas')); })
  .catch((err) => { console.warn('3D indisponível', err); $('.hero__canvas').remove(); });

const sr = $('.showroom__canvas');
const srIO = new IntersectionObserver(([e]) => {
  if (!e.isIntersecting) return;
  srIO.disconnect();
  import('./showroom.js').then((m) => m.initShowroom({
    canvas: sr, tabs: $('.showroom__tabs'), nameEl: $('.showroom__name'), descEl: $('.showroom__desc'), loadingEl: $('.showroom__loading'),
  })).catch((err) => { console.warn('Showroom indisponível', err); $('.showroom__loading').textContent = 'Seu navegador não suporta WebGL.'; });
}, { rootMargin: '600px' });
srIO.observe(sr);

// ── Loader + animações ──────────────────────────────────
const loader = $('.loader');
function finishLoad() {
  document.body.classList.remove('is-loading');
  if (!hasGsap) { loader.remove(); return; }
  const tl = gsap.timeline();
  tl.to(loader, { yPercent: -100, duration: 1.1, ease: 'expo.inOut', onComplete: () => loader.remove() })
    .from('.hero__title .split-char', { yPercent: 110, rotate: 6, duration: 1.3, stagger: 0.035, ease: 'expo.out' }, '-=.45')
    .to('.hero .reveal-up', { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'expo.out' }, '-=1')
    .from('.nav', { yPercent: -100, opacity: 0, duration: 1, ease: 'expo.out' }, '-=1')
    .from('.hero__hint', { opacity: 0, duration: 1 }, '-=.6')
    .to({ v: 0 }, { v: 1, duration: 2, ease: 'expo.out', onUpdate() { hero?.setIntro(this.targets()[0].v); } }, '-=2.2');
}

function runLoader() {
  const path = $('.loader .sym-stroke');
  const count = $('.loader__count span');
  if (!hasGsap || reduced) { hero?.setIntro(1); finishLoad(); return; }
  const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  const c = { v: 0 };
  const tl = gsap.timeline();
  tl.to(path, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' })
    .to(c, { v: 100, duration: 1.8, ease: 'power2.inOut', onUpdate: () => (count.textContent = Math.round(c.v)) }, 0)
    .to(path, { fill: COLORS.gold, strokeOpacity: 0, duration: 0.6 }, '-=.2')
    .add(() => {
      // espera o 3D (no máximo 2,5 s)
      Promise.race([heroReady, new Promise((r) => setTimeout(r, 2500))]).then(finishLoad);
    });
}

function setupScroll() {
  if (!hasGsap) return;

  if (!reduced && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.085, wheelMultiplier: 1 });
    lenis.on('scroll', ST.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // progresso + nav
  gsap.to('.progress span', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
  let lastY = 0;
  ST.create({ start: 0, end: 'max', onUpdate: (s) => {
    const y = s.scroll();
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > lastY && y > 400 && !nav.classList.contains('is-open'));
    lastY = y;
  } });
  $$('[data-theme="dark"]').forEach((sec) => ST.create({
    trigger: sec, start: 'top 40px', end: 'bottom 40px',
    onToggle: (s) => nav.classList.toggle('is-dark', s.isActive),
  }));
  $$('.nav__links a').forEach((a) => {
    const sec = $(a.getAttribute('href'));
    if (sec) ST.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => a.classList.toggle('is-active', s.isActive) });
  });

  // herói: copy sobe, 3D gira
  ST.create({ trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true, onUpdate: (s) => hero?.setScroll(s.progress) });
  gsap.to('.hero__copy', { yPercent: -40, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  if (finePointer) {
    addEventListener('pointermove', (e) => {
      const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      gsap.to('.orb--1', { x: x * 80, y: y * 60, duration: 2, ease: 'power3.out' });
      gsap.to('.orb--2', { x: -x * 60, y: -y * 40, duration: 2, ease: 'power3.out' });
      gsap.to('.orb--3', { x: x * 120, y: y * 30, duration: 2, ease: 'power3.out' });
    });
  }

  // títulos com split
  $$('[data-split]').forEach((el) => {
    if (el.classList.contains('hero__title')) return;
    gsap.from($$('.split-char', el), {
      yPercent: 115, rotate: 5, duration: 1.2, stagger: 0.02, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });
  $$('.eyebrow, .lead').forEach((el) => {
    if (el.closest('.hero') || el.closest('.encontro')) return;
    gsap.from(el, { opacity: 0, y: 20, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
  });

  // manifesto palavra a palavra
  const words = $$('.manifesto .w');
  gsap.to(words, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.manifesto__text', start: 'top 80%', end: 'bottom 45%', scrub: true } });

  encontroTimeline();
  construcaoTimeline();

  // pilares
  gsap.from('.pillar', { y: 120, rotateX: 25, opacity: 0, duration: 1.4, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.pilares__grid', start: 'top 80%' } });

  // versões e cores
  gsap.from('.versions__stage', { clipPath: 'inset(12% 12% 12% 12% round 28px)', scale: 0.92, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.versions__stage', start: 'top 85%' } });
  gsap.from('.swatch', { yPercent: 100, duration: 1.4, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.swatches', start: 'top 80%' } });
  gsap.from('.type-card', { y: 80, opacity: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.type-cards', start: 'top 85%' } });
  gsap.from('.glyphs span', { opacity: 0, scale: 0.6, duration: 0.8, stagger: { each: 0.015, from: 'random' }, ease: 'expo.out', scrollTrigger: { trigger: '.glyphs', start: 'top 90%' } });

  // texturas: paralaxe nas imagens
  gsap.from('.layers', { scale: 0.88, borderRadius: 80, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.layers', start: 'top 85%' } });
  $$('.pattern .img').forEach((im, i) => gsap.fromTo(im, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
  gsap.from('.pattern', { y: 100, opacity: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.patterns', start: 'top 85%' } });

  // reel horizontal
  const trackEl = $('.reel__track');
  const dist = () => Math.max(0, trackEl.scrollWidth - innerWidth);
  const reelTween = gsap.to(trackEl, { x: () => -dist(), ease: 'none', scrollTrigger: {
    trigger: '.reel', pin: '.reel__pin', start: 'top top', end: () => `+=${dist()}`, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
  } });
  $$('.reel__card').forEach((card) => {
    gsap.fromTo($('.img', card), { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: reelTween, start: 'left right', end: 'right left', scrub: true } });
    gsap.from(card, { rotateY: -18, scale: 0.86, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: reelTween, start: 'left right', end: 'center 60%', scrub: true } });
  });

  // galeria
  ST.batch('.tile', { start: 'top 92%', onEnter: (els) => gsap.from(els, { y: 80, opacity: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out' }), once: true });

  // digital
  gsap.from('.phone__body', { y: 140, rotateY: -40, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.digital__grid', start: 'top 80%' } });
  gsap.from('.hl', { scale: 0, opacity: 0, duration: 0.9, stagger: 0.06, ease: 'back.out(2)', scrollTrigger: { trigger: '.highlights', start: 'top 90%' } });
  gsap.from('.feed .post', { y: 100, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.feed', start: 'top 90%' } });
  gsap.from('.laptop', { rotateX: 35, y: 120, opacity: 0, transformPerspective: 1600, transformOrigin: '50% 100%', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.laptop', start: 'top 90%' } });
  gsap.from('.video', { y: 100, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.videos', start: 'top 88%' } });

  // fim
  gsap.fromTo('.fim__symbol', { rotateY: -60, scale: 0.6, opacity: 0 }, { rotateY: 0, scale: 1, opacity: 1, ease: 'none', transformPerspective: 900, scrollTrigger: { trigger: '.fim', start: 'top 85%', end: 'center center', scrub: true } });

  addEventListener('load', () => ST.refresh());
}

// O encontro: Ângelo + Marina → ANMAR → AMAR → símbolo
function encontroTimeline() {
  const sec = $('.encontro');
  const nameA = $('.name--a'), nameM = $('.name--m');
  const word = $('.encontro__word');
  const letters = $$('.encontro__word .wm .l');
  const fills = (els) => els.map((g) => g.firstElementChild);
  const sym = $('.encontro__symbol');
  const symStroke = $('.duo-stroke', sym), symFill = $('.duo-fill', sym);
  const len = symStroke.getTotalLength();
  gsap.set(symStroke, { strokeDasharray: len, strokeDashoffset: len });
  const caps = $$('.cap');

  // deslocamento para juntar "ÂN" + "MAR" no centro
  const gapX = () => {
    const ra = $$('b', nameA).at(-1).getBoundingClientRect();
    const rm = $('b', nameM).getBoundingClientRect();
    const stage = $('.encontro__stage').getBoundingClientRect();
    const total = (ra.right - nameA.getBoundingClientRect().left) + (rm.width * 3);
    const left = stage.left + stage.width / 2 - total / 2;
    return { a: left - nameA.getBoundingClientRect().left, m: left + (ra.right - nameA.getBoundingClientRect().left) + 8 - rm.left };
  };

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true } });
  tl.fromTo(nameA, { xPercent: -60, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1 }, 0)
    .fromTo(nameM, { xPercent: 60, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1 }, 0)
    .to(caps[0], { opacity: 1, duration: 0.5 }, 0.3)
    .to($$('.name i'), { opacity: 0, y: 30, stagger: 0.04, duration: 0.6 }, 1.6)
    .to(caps[0], { opacity: 0, duration: 0.4 }, 1.7)
    .to(nameA, { x: () => gapX().a, duration: 1 }, 2.2)
    .to(nameM, { x: () => gapX().m, duration: 1 }, 2.2)
    .to(caps[1], { opacity: 1, duration: 0.5 }, 2.6)
    .to('.names', { opacity: 0, scale: 0.92, duration: 0.6 }, 3.4)
    .fromTo(word, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.6 }, 3.4)
    .to(caps[1], { opacity: 0, duration: 0.4 }, 4.2)
    // ANMAR → AMAR
    .to(letters[1], { y: -120, opacity: 0, duration: 0.8 }, 4.4)
    .to(letters[0], { x: AMAR_SHIFT.a1, duration: 0.8 }, 4.6)
    .to(letters.slice(2), { x: AMAR_SHIFT.rest, duration: 0.8 }, 4.6)
    .to(fills([letters[0], ...letters.slice(2)]), { fill: '#D9C291', duration: 0.6 }, 4.8)
    .to(caps[2], { opacity: 1, duration: 0.5 }, 4.9)
    .to('.encontro__glow', { scale: 1.6, opacity: 0.9, duration: 1 }, 4.6)
    .to(caps[2], { opacity: 0, duration: 0.4 }, 6)
    // volta ao nome e o símbolo se desenha
    .to(letters[1], { y: 0, opacity: 1, duration: 0.7 }, 6.2)
    .to(letters[0], { x: 0, duration: 0.7 }, 6.2)
    .to(letters.slice(2), { x: 0, duration: 0.7 }, 6.2)
    .to(fills(letters), { fill: '#F7F1E5', duration: 0.6 }, 6.2)
    .to(word, { y: () => innerHeight * 0.18, scale: 0.55, duration: 1 }, 6.4)
    .to(sym, { opacity: 1, duration: 0.3 }, 6.6)
    .to(symStroke, { strokeDashoffset: 0, duration: 1.4, ease: 'none' }, 6.6)
    .to(symFill, { opacity: 1, duration: 0.8 }, 7.7)
    .to(symStroke, { opacity: 0, duration: 0.6 }, 8)
    .to(caps[3], { opacity: 1, duration: 0.5 }, 7.6)
    .to({}, { duration: 0.8 });
}

// Construção do símbolo, passo a passo
function construcaoTimeline() {
  const svg = $('.construcao .grid');
  const gGrid = $('.g-grid', svg);
  let lines = '';
  for (let x = 0; x <= 842; x += 42.1) lines += `<line x1="${x}" y1="0" x2="${x}" y2="598"/>`;
  for (let y = 0; y <= 598; y += 42.1) lines += `<line x1="0" y1="${y}" x2="842" y2="${y}"/>`;
  gGrid.innerHTML = lines;
  const ref = $('.loader .sym-stroke');
  const d = ref.getAttribute('d');
  const tr = ref.getAttribute('transform');
  $('.g-symbol', svg).innerHTML = `<path class="fill" transform="${tr}" d="${d}"/><path class="shine" transform="${tr}" d="${d}"/><path class="outline" transform="${tr}" d="${d}"/>`;
  $('.g-word', svg).innerHTML = $('.encontro__word .wm').outerHTML;
  const outline = $('.outline', svg);
  const len = outline.getTotalLength();
  gsap.set(outline, { strokeDasharray: len, strokeDashoffset: len });
  gsap.set($$('.g-grid line', svg), { opacity: 0 });
  const steps = $$('.construcao .step');
  const shine = $('.shine', svg);

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, scrollTrigger: {
    trigger: '.construcao', start: 'top top', end: 'bottom bottom', scrub: 1,
    onUpdate: (s) => {
      const i = Math.min(3, Math.floor(s.progress * 4.2));
      steps.forEach((st, k) => st.classList.toggle('is-active', k === i));
      $('.construcao__bar span').style.transform = `scaleX(${s.progress})`;
    },
  } });
  tl.to($$('.g-grid line', svg), { opacity: 1, stagger: { each: 0.01, from: 'center' }, duration: 0.4 }, 0)
    .to($$('.g-guides *', svg), { opacity: 0.8, stagger: 0.08, duration: 0.5 }, 0.4)
    .to(outline, { strokeDashoffset: 0, duration: 2.2, ease: 'none' }, 1.2)
    .to(['.lbl--a', '.lbl--m'], { opacity: 1, stagger: 0.3, duration: 0.4 }, 1.6)
    .to($('.fill', svg), { opacity: 1, duration: 0.8 }, 3.4)
    .to('.lbl--c', { opacity: 1, duration: 0.4 }, 3.5)
    .fromTo(shine, { opacity: 0.9 }, { opacity: 0, duration: 1, immediateRender: false }, 3.8)
    .to(outline, { opacity: 0, duration: 0.5 }, 4)
    .to($$('.g-guides *', svg), { opacity: 0, duration: 0.6 }, 4.6)
    .to(['.lbl--a', '.lbl--m', '.lbl--c'], { opacity: 0, duration: 0.4 }, 4.6)
    .fromTo($$('.g-word .l', svg), { y: 40 }, { y: 0, stagger: 0.1, duration: 0.6 }, 4.8)
    .to($$('.g-word path', svg), { opacity: 1, stagger: 0.1, duration: 0.6 }, 4.8)
    .to($$('.g-grid line', svg), { opacity: 0.25, duration: 0.6 }, 5.4)
    .to({}, { duration: 0.6 });
}

// ── Início ──────────────────────────────────────────────
setupScroll();
runLoader();
// garantia: se algo travar, libera o site
setTimeout(() => { if (document.body.classList.contains('is-loading')) finishLoad(); }, 9000);
