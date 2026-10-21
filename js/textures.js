import { drawLogo, drawSymbol, COLORS } from './logo.js';

// Texturas em canvas desenhadas a partir dos vetores oficiais da marca.
function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

function paper(ctx, w, h, base, grain = 0.05) {
  ctx.fillStyle = base; ctx.fillRect(0, 0, w, h);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 255 * grain;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

// Pattern "Camadas Translúcidas": o símbolo repetido em transparência.
export function layersPattern(ctx, w, h, { color = COLORS.gold, alpha = 0.16, count = 5, scale = 1.6, seed = 0 } = {}) {
  ctx.save();
  for (let i = 0; i < count; i++) {
    const k = (i + seed) / count;
    const sw = w * scale * (0.7 + 0.5 * Math.sin(k * 7.1 + 1));
    ctx.globalAlpha = alpha * (0.6 + 0.4 * Math.cos(k * 5));
    drawSymbol(ctx, w * (Math.sin(k * 9.3) * 0.5) - sw * 0.25, h * (k * 1.1 - 0.35), sw, color);
  }
  ctx.restore();
}

// Pattern "Recorte Monumental": um único símbolo enorme recortado pelo formato.
export function monumental(ctx, w, h, color, { scale = 2.4, ox = -0.35, oy = -0.1, alpha = 1 } = {}) {
  ctx.save(); ctx.globalAlpha = alpha;
  drawSymbol(ctx, w * ox, h * oy, w * scale, color);
  ctx.restore();
}

export function cardFront() {
  const [c, x] = canvas(1800, 1000);
  paper(x, 1800, 1000, COLORS.marfim, 0.03);
  layersPattern(x, 1800, 1000, { color: COLORS.gold, alpha: 0.14, count: 4, scale: 1.1 });
  drawLogo(x, 900 - 230, 500 - 175, 460, { sym: COLORS.gold, wm: COLORS.taupe });
  return c;
}

export function cardBack() {
  const [c, x] = canvas(1800, 1000);
  paper(x, 1800, 1000, COLORS.taupe, 0.04);
  monumental(x, 1800, 1000, '#6E6350', { scale: 1.5, ox: 0.35, oy: -0.25 });
  drawSymbol(x, 900 - 150, 500 - 80, 300, COLORS.gold);
  x.fillStyle = COLORS.marfim; x.globalAlpha = .85;
  x.font = 'italic 44px "Libre Baskerville", Georgia, serif'; x.textAlign = 'center';
  x.fillText('AMAR a vida.', 900, 720);
  return c;
}

export function notebookCover() {
  const [c, x] = canvas(1480, 2100);
  paper(x, 1480, 2100, COLORS.taupe, 0.05);
  layersPattern(x, 1480, 2100, { color: '#7A6E59', alpha: 0.9, count: 6, scale: 1.5, seed: 2 });
  drawLogo(x, 740 - 300, 980 - 215, 600, { sym: COLORS.gold, wm: COLORS.marfim });
  return c;
}

export function notebookPage() {
  const [c, x] = canvas(1480, 2100);
  paper(x, 1480, 2100, '#FBF7EE', 0.02);
  x.strokeStyle = 'rgba(101,91,73,.18)'; x.lineWidth = 2;
  for (let y = 360; y < 1980; y += 70) { x.beginPath(); x.moveTo(120, y); x.lineTo(1360, y); x.stroke(); }
  drawSymbol(x, 120, 130, 170, COLORS.gold);
  x.fillStyle = COLORS.taupe; x.font = 'italic 46px "Libre Baskerville", Georgia, serif';
  x.fillText('Sua vida, em plenitude.', 120, 330);
  return c;
}

export function bottleLabel() {
  const W = 2048, H = 1300;
  const [c, x] = canvas(W, H);
  const g = x.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#6c6250'); g.addColorStop(1, '#5c5342');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  // logo frontal (u = 0.5)
  drawLogo(x, W * 0.5 - 170, H * 0.36, 340, { sym: COLORS.gold, wm: COLORS.marfim });
  // pattern tonal nas costas
  x.save(); x.globalAlpha = 0.5;
  drawSymbol(x, -260, H * 0.15, 900, '#736853');
  drawSymbol(x, W - 640, H * 0.15, 900, '#736853');
  x.restore();
  return c;
}

export function badgeFront() {
  const [c, x] = canvas(1080, 1720);
  paper(x, 1080, 1720, COLORS.marfim, 0.03);
  x.save(); x.beginPath(); x.rect(0, 1150, 1080, 570); x.clip();
  x.fillStyle = COLORS.areia; x.fillRect(0, 1150, 1080, 570);
  layersPattern(x, 1080, 1720, { color: COLORS.gold, alpha: 0.35, count: 4, scale: 1.4, seed: 1 });
  x.restore();
  // furo de fixação
  x.fillStyle = 'rgba(101,91,73,.25)';
  x.beginPath(); x.roundRect(440, 70, 200, 36, 18); x.fill();
  drawLogo(x, 540 - 260, 420, 520, { sym: COLORS.gold, wm: COLORS.taupe });
  return c;
}

export function badgeBack() {
  const [c, x] = canvas(1080, 1720);
  paper(x, 1080, 1720, COLORS.taupe, 0.04);
  monumental(x, 1080, 1720, '#6E6350', { scale: 2, ox: -0.5, oy: 0.2 });
  x.fillStyle = 'rgba(247,241,229,.25)'; x.beginPath(); x.roundRect(440, 70, 200, 36, 18); x.fill();
  drawSymbol(x, 540 - 170, 760, 340, COLORS.gold);
  return c;
}

export function lanyard() {
  const [c, x] = canvas(256, 2048);
  x.fillStyle = COLORS.taupe; x.fillRect(0, 0, 256, 2048);
  for (let y = 40; y < 2048; y += 260) {
    x.save(); x.translate(128, y); x.rotate(Math.PI / 2);
    drawLogo(x, 0, -90, 230, { sym: COLORS.marfim, wm: COLORS.marfim });
    x.restore();
  }
  return c;
}

export function facadeWall() {
  const [c, x] = canvas(2048, 1024);
  paper(x, 2048, 1024, '#5f5644', 0.07);
  // ripado/painel
  x.strokeStyle = 'rgba(0,0,0,.18)'; x.lineWidth = 3;
  for (let i = 0; i < 2048; i += 64) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 1024); x.stroke(); }
  return c;
}

export function glowTexture(rgb = '255,226,160') {
  const [c, x] = canvas(512, 512);
  const g = x.createRadialGradient(256, 256, 0, 256, 256, 256);
  g.addColorStop(0, `rgba(${rgb},.85)`); g.addColorStop(.45, `rgba(${rgb},.25)`); g.addColorStop(1, `rgba(${rgb},0)`);
  x.fillStyle = g; x.fillRect(0, 0, 512, 512);
  return c;
}

export function floorTexture() {
  const [c, x] = canvas(1024, 1024);
  const g = x.createRadialGradient(512, 512, 0, 512, 512, 512);
  g.addColorStop(0, 'rgba(120,105,80,.55)'); g.addColorStop(.55, 'rgba(70,62,48,.25)'); g.addColorStop(1, 'rgba(34,30,24,0)');
  x.fillStyle = g; x.fillRect(0, 0, 1024, 1024);
  return c;
}
