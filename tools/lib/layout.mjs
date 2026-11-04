import { measure } from './type.mjs';
import { lockup } from './lockup.mjs';
import { C } from './brand.mjs';

export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Greedy wrap using real font metrics, so a line never overruns its column. */
export function wrap(text, maxW, size, weight = 400, family = 'brand', trackEm = 0) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = []; let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (measure(test, size, weight, family, trackEm) > maxW && cur) { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

/** A wrapped text block. Returns {svg, height, lines}. */
export function para(text, { x, y, maxW, size, lh = 1.3, weight = 400, family = 'brand', fill = C.ink, track = 0, anchor }) {
  const lines = Array.isArray(text) ? text : wrap(text, maxW, size, weight, family, track);
  const fam = family === 'brand' ? 'Plus Jakarta Sans' : 'Atkinson Hyperlegible';
  const svg = lines.map((l, i) =>
    `<text x="${x}" y="${+(y + size + i * size * lh).toFixed(1)}" font-family="${fam}" font-size="${size}" font-weight="${weight}" fill="${fill}"${track ? ` letter-spacing="${(track * size).toFixed(2)}"` : ''}${anchor ? ` text-anchor="${anchor}"` : ''}>${esc(l)}</text>`
  ).join('\n  ');
  return { svg, height: size + (lines.length - 1) * size * lh, lines };
}

/** Embed a lockup at (x, y) with a given height. Anchor: 'start' | 'middle' | 'end'. */
export function mark(kind, way, { x, y, h, anchor = 'start', ...opts } = {}) {
  const svg = lockup(kind, way, opts);
  const [, w0, h0] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
  const s = h / h0, w = w0 * s;
  const dx = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  const inner = svg.replace(/^[\s\S]*?<title>[\s\S]*?<\/title>/, '').replace(/<\/svg>\s*$/, '');
  return { svg: `<g transform="translate(${+dx.toFixed(2)},${+y.toFixed(2)}) scale(${+s.toFixed(5)})">${inner}</g>`, width: w, height: h };
}

/** Arch (Open Threshold) path, the mark's own semicircle. */
export const arch = (x, y, w, h) => {
  const r = w / 2;
  return `M${x},${y + h} L${x},${y + r} A${r},${r} 0 0 1 ${x + w},${y + r} L${x + w},${y + h} Z`;
};

/** Standard card chrome. themes: cream | ink | paper */
export const THEMES = {
  cream: { bg: C.cream, text: C.ink, muted: '#68728A', accent: '#C24D00', way: 'full', rule: C.ink },
  ink: { bg: C.ink, text: C.cream, muted: '#A8B3C9', accent: C.sunrise, way: 'reversed', rule: C.cream },
  paper: { bg: C.white, text: C.ink, muted: '#68728A', accent: '#C24D00', way: 'full-white', rule: C.ink },
};

export const doc = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(title)}">
  <title>${esc(title)}</title>
${body}
</svg>`;

/** Largest size at or below `start` that fits `text` in `maxW`. */
export function fitSize(text, maxW, start, weight = 800, family = 'brand', min = 12) {
  let s = start;
  while (s > min && measure(text, s, weight, family) > maxW) s -= Math.max(1, Math.round(s * 0.03));
  return s;
}
