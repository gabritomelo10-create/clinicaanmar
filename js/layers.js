import { drawSymbol } from './logo.js';

// Pattern "Camadas Translúcidas" vivo: o símbolo em várias camadas que se
// deslocam em profundidades diferentes conforme o mouse (paralaxe).
export function initLayers(canvas) {
  const ctx = canvas.getContext('2d');
  const layers = [
    { scale: 2.6, x: -0.55, y: -0.35, depth: 0.15, color: '#B49A62', alpha: 0.18, speed: 0.05 },
    { scale: 1.9, x: 0.15, y: -0.05, depth: 0.35, color: '#D9C291', alpha: 0.16, speed: -0.07 },
    { scale: 1.4, x: -0.25, y: 0.25, depth: 0.6, color: '#F7F1E5', alpha: 0.12, speed: 0.09 },
    { scale: 1.05, x: 0.42, y: 0.18, depth: 0.9, color: '#B49A62', alpha: 0.3, speed: -0.04 },
    { scale: 0.62, x: 0.08, y: 0.42, depth: 1.25, color: '#E6D3A6', alpha: 0.42, speed: 0.06 },
  ];
  let w = 0, h = 0, dpr = 1;
  const m = { x: 0, y: 0, tx: 0, ty: 0 };
  let visible = false;

  function resize() {
    dpr = Math.min(devicePixelRatio, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
  }
  resize();
  addEventListener('resize', resize);
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    m.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    m.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });
  canvas.addEventListener('pointerleave', () => { m.tx = 0; m.ty = 0; });
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);

  function frame(t) {
    requestAnimationFrame(frame);
    if (!visible) return;
    t *= 0.001;
    m.x += (m.tx - m.x) * 0.06;
    m.y += (m.ty - m.y) * 0.06;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#5a5141'); g.addColorStop(1, '#2c271f');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const lg = ctx.createRadialGradient(w * (0.5 + m.x * 0.2), h * (0.4 + m.y * 0.2), 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
    lg.addColorStop(0, 'rgba(230,205,150,.28)'); lg.addColorStop(1, 'rgba(230,205,150,0)');
    ctx.fillStyle = lg; ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'screen';
    for (const l of layers) {
      const sw = Math.max(w, h) * l.scale * 0.6;
      const ox = w * (0.5 + l.x) - sw / 2 - m.x * 60 * l.depth + Math.sin(t * l.speed * 4) * 20;
      const oy = h * (0.5 + l.y) - sw * 0.26 - m.y * 40 * l.depth + Math.cos(t * l.speed * 3) * 14;
      ctx.globalAlpha = l.alpha;
      drawSymbol(ctx, ox, oy, sw, l.color);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  requestAnimationFrame(frame);
}
