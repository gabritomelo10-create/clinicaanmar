import { SYMBOL_D, SYMBOL_T, WORDMARK } from './brand-paths.js';

export const COLORS = { gold: '#B49A62', taupe: '#655B49', marfim: '#F7F1E5', areia: '#DCD0B8' };

// Posições x (em unidades do SVG) usadas para fechar a palavra AMAR quando o N sai.
export const AMAR_SHIFT = { a1: 75, rest: -74 };

const symbolPath = (fill, cls = 'sym', extra = '') =>
  `<path class="${cls}" fill="${fill}" transform="translate(${SYMBOL_T.join(',')})" d="${SYMBOL_D}" ${extra}/>`;

const wordmarkGroup = (fill) =>
  `<g class="wm" transform="translate(0,438)">${WORDMARK.map((p, i) =>
    `<g class="l" data-i="${i}"><path fill="${fill}" transform="translate(${p.t.join(',')})" d="${p.d}"/></g>`).join('')}</g>`;

export function logoSVG({ sym = COLORS.gold, wm = COLORS.taupe, title = 'ANMAR' } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 842 598" role="img" aria-label="${title}">${symbolPath(sym)}${wordmarkGroup(wm)}</svg>`;
}

export function symbolSVG(fill = COLORS.gold, cls = 'sym') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 842 438" aria-hidden="true">${symbolPath(fill, cls)}</svg>`;
}

export function symbolStrokeSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 862 458" aria-hidden="true">${symbolPath('transparent', 'sym-stroke')}</svg>`;
}

// Símbolo com contorno + preenchimento (gradiente dourado) para animações de desenho.
export function symbolDuoSVG(id = 'duo') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 862 458" aria-hidden="true">
    <defs><linearGradient id="${id}G" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E6D3A6"/><stop offset=".5" stop-color="#B49A62"/><stop offset="1" stop-color="#8C7646"/></linearGradient></defs>
    ${symbolPath(`url(#${id}G)`, 'duo-fill', 'opacity="0"')}
    ${symbolPath('none', 'duo-stroke', 'stroke="#D9C291" stroke-width="2.4"')}
  </svg>`;
}

export function wordmarkSVG(fill = COLORS.marfim) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="70 470 770 140" aria-hidden="true">${wordmarkGroup(fill)}</svg>`;
}

// Desenha a marca num canvas 2D (para texturas 3D e patterns).
export function drawSymbol(ctx, x, y, width, fill) {
  const s = width / 842;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.translate(SYMBOL_T[0], SYMBOL_T[1]);
  ctx.fillStyle = fill;
  ctx.fill(new Path2D(SYMBOL_D));
  ctx.restore();
}

export function drawLogo(ctx, x, y, width, { sym = COLORS.gold, wm = COLORS.taupe, symbolOnly = false } = {}) {
  drawSymbol(ctx, x, y, width, sym);
  if (symbolOnly) return;
  const s = width / 842;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = wm;
  for (const p of WORDMARK) {
    ctx.save();
    ctx.translate(p.t[0], 438 + p.t[1]);
    ctx.fill(new Path2D(p.d));
    ctx.restore();
  }
  ctx.restore();
}

export function downloadName(v) {
  return { principal: 'logo-principal.svg', negativa: 'logo-negativa.svg', monocromatica: 'logo-monocromatica.svg', simbolo: 'simbolo.svg' }[v];
}
