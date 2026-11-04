import { line, CAP_RATIO } from './type.mjs';
import { markBody, MARK_BOX, WORDMARK } from './brand.mjs';

// Lockups are built in CAP UNITS: the cap height of "H" in Human = 100.
export const CAP = 100;
const SIZE = CAP / CAP_RATIO;
const r = (n, d = 2) => +(+n).toFixed(d);

export const RATIOS = {
  horizontal: { symbol: 1.72, gutter: 0.58 },   // x cap height
  stacked:    { symbol: 2.04, gutter: 0.50 },
};
const symW = h => MARK_BOX.w * (h / MARK_BOX.h);

/** Place the mark with its visual box top-left at (x,y) and height h. */
export function symbolGroup(dark, light, x, y, h, opts = {}) {
  const s = h / MARK_BOX.h;
  return `<g transform="translate(${r(x - MARK_BOX.x * s, 3)},${r(y - MARK_BOX.y * s, 3)}) scale(${r(s, 5)})">
    ${markBody(dark, light, opts)}
  </g>`;
}

const svgWrap = (w, h, body, bg, label) =>
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r(w)} ${r(h)}" width="${r(w)}" height="${r(h)}" role="img" aria-label="${label}">
  <title>${label}</title>${bg ? `\n  <rect width="${r(w)}" height="${r(h)}" fill="${bg}"/>` : ''}
  ${body}
</svg>`;

/**
 * kind: symbol | wordmark | horizontal | stacked | descriptor | chapter
 * way:  {dark, light, on}  — `light:'none'` renders the one-colour version.
 */
export function lockup(kind, way, o = {}) {
  const { chapter = 'Nairobi', descriptor = 'GLOBAL MOVEMENT', bg = null, micro = false } = o;
  const { dark, light, on } = way;
  const opts = micro ? { stroke: 6, knob: false } : {};
  const background = bg === 'auto' ? on : bg;
  const lit = light === 'none' ? on : light;   // one-colour: the opening is paper
  const mk = (x, y, h) => symbolGroup(dark, lit, x, y, h, opts);
  const label = kind === 'chapter' ? `Human First AI — ${chapter}` : 'Human First AI';

  if (kind === 'symbol') {
    const h = 200;
    return svgWrap(symW(h), h, mk(0, 0, h), background, 'Human First AI — the Open Door mark');
  }
  // --- everything below contains type: measure ink-tight -------------------
  const wmProbe = line(WORDMARK, SIZE, 0, 0);
  const wmInkX = wmProbe.box.x1, wmInkW = wmProbe.box.x2 - wmProbe.box.x1;

  if (kind === 'wordmark') {
    const wm = line(WORDMARK, SIZE, -wmInkX, CAP);
    return svgWrap(wmInkW, CAP, `<path d="${wm.d}" fill="${dark}"/>`, background, label);
  }

  if (kind === 'horizontal' || kind === 'chapter') {
    const SH = CAP * RATIOS.horizontal.symbol, SW = symW(SH), gut = CAP * RATIOS.horizontal.gutter;
    const tx = SW + gut - wmInkX;
    const wm = line(WORDMARK, SIZE, tx, SH);
    let body = `${mk(0, 0, SH)}\n  <path d="${wm.d}" fill="${dark}"/>`;
    let W = SW + gut + wmInkW;
    if (kind === 'chapter') {
      const pad = CAP * 0.36, rule = 2.5;
      const ruleX = W + pad;
      const chProbe = line([{ w: 500, t: chapter, track: -0.01 }], SIZE * 0.84, 0, 0);
      const ch = line([{ w: 500, t: chapter, track: -0.01 }], SIZE * 0.84, ruleX + rule + pad - chProbe.box.x1, SH);
      body += `\n  <rect x="${r(ruleX)}" y="${r(SH - CAP)}" width="${rule}" height="${CAP}" fill="${dark}"/>
  <path d="${ch.d}" fill="${dark}"/>`;
      W = ruleX + rule + pad + (chProbe.box.x2 - chProbe.box.x1);
    }
    return svgWrap(W, SH, body, background, label);
  }

  if (kind === 'stacked') {
    const SH = CAP * RATIOS.stacked.symbol, SW = symW(SH), vgap = CAP * RATIOS.stacked.gutter;
    const W = Math.max(SW, wmInkW), H = SH + vgap + CAP;
    const wm = line(WORDMARK, SIZE, (W - wmInkW) / 2 - wmInkX, H);
    return svgWrap(W, H, `${mk((W - SW) / 2, 0, SH)}\n  <path d="${wm.d}" fill="${dark}"/>`, background, label);
  }

  if (kind === 'descriptor') {
    const SH = CAP * RATIOS.horizontal.symbol, SW = symW(SH), gut = CAP * RATIOS.horizontal.gutter;
    const dSize = CAP * 0.26, dGap = CAP * 0.30, dCap = dSize * CAP_RATIO;
    const dProbe = line([{ w: 500, t: descriptor, track: 0.20 }], dSize, 0, 0);
    const dInkW = dProbe.box.x2 - dProbe.box.x1;
    const blockH = CAP + dGap + dCap;
    const symY = Math.max(0, (blockH - SH) / 2), txtY = Math.max(0, (SH - blockH) / 2);
    const H = Math.max(SH + symY, blockH + txtY);
    const tx = SW + gut - wmInkX;
    const wm = line(WORDMARK, SIZE, tx, txtY + CAP);
    const de = line([{ w: 500, t: descriptor, track: 0.20 }], dSize, SW + gut - dProbe.box.x1, txtY + CAP + dGap + dCap);
    return svgWrap(SW + gut + Math.max(wmInkW, dInkW), H,
      `${mk(0, symY, SH)}\n  <path d="${wm.d}" fill="${dark}"/>\n  <path d="${de.d}" fill="${dark}"/>`,
      background, label);
  }
  throw new Error('unknown lockup: ' + kind);
}
export const METRICS = { CAP, SIZE, RATIOS, symW };
