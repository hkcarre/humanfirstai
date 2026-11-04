#!/usr/bin/env node
// Human First AI — on-brand card generator. No dependencies.
//
//   node new-card.mjs --type statement --w 1200 --h 627 \
//     --kicker "Plain English AI" \
//     --headline "You do not need a computer science degree to use this." \
//     --footer "humanfirst.ai" --theme cream --out post.svg
//
//   node new-card.mjs --type event --w 1080 --h 1080 \
//     --kicker "Free workshop - everyone welcome" \
//     --headline "Learn what AI actually does" \
//     --fact "Saturday 7 November, 10:00" --fact "St Jude Community Library" \
//     --fact "Tea and snacks provided" --fact "Bring a friend - no booking needed" \
//     --cta "Forward this to one neighbour" --out event.svg
//
//   node new-card.mjs --type stat --value "140,000" \
//     --headline "neighbours have sat down with us so far" --theme ink --out stat.svg
//
// Output is SVG with live <text>, so you can open it in Figma, Illustrator,
// Inkscape or Canva and edit the words. Install Plus Jakarta Sans and Atkinson
// Hyperlegible (both free, in brand/type/fonts/) for it to render correctly.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const C = {
  cream: '#FFF6EC', ink: '#1F2A44', sunrise: '#FF8A3D', sunriseDeep: '#C24D00',
  teal: '#187F72', muted: '#68728A', white: '#FFFFFF',
};
const THEMES = {
  cream: { bg: C.cream, text: C.ink, muted: C.muted, accent: C.sunriseDeep, markDark: C.ink, markLight: C.sunrise },
  ink: { bg: C.ink, text: C.cream, muted: '#A8B3C9', accent: C.sunrise, markDark: C.cream, markLight: C.sunrise },
  paper: { bg: C.white, text: C.ink, muted: C.muted, accent: C.sunriseDeep, markDark: C.ink, markLight: C.sunrise },
};

// --- metrics ---------------------------------------------------------------
let METRICS = null;
try { METRICS = JSON.parse(readFileSync(join(HERE, '..', 'assets', 'metrics.json'), 'utf8')); } catch { /* fall back below */ }
const nearestWeight = w => METRICS
  ? Object.keys(METRICS.weights).map(Number).reduce((a, b) => Math.abs(b - w) < Math.abs(a - w) ? b : a)
  : w;
function textWidth(str, size, weight = 400) {
  if (!METRICS) return str.length * size * 0.52;           // crude but never zero
  const t = METRICS.weights[nearestWeight(weight)];
  let em = 0;
  for (const ch of str) em += t.chars[ch] ?? t.fallback;
  return em * size;
}
function wrap(text, maxW, size, weight) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = []; let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (textWidth(test, size, weight) > maxW && cur) { lines.push(cur); cur = w; } else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}
function fitSize(text, maxW, start, weight) {
  let s = start;
  while (s > 12 && textWidth(text, s, weight) > maxW) s -= Math.max(1, Math.round(s * 0.03));
  return s;
}

// --- the mark, 64u grid ----------------------------------------------------
function markSvg(dark, light, x, y, h) {
  const BOX = { x: 3, y: 9, w: 58, h: 46 }, s = h / BOX.h;
  const body = `<path d="M27,51.5 L27,30 A12.5,12.5 0 0 1 52,30 L52,51.5 Z" fill="${light}"/>
    <path d="M24.5,51.5 L24.5,30 A15,15 0 0 1 54.5,30 L54.5,51.5" fill="none" stroke="${dark}" stroke-width="5"/>
    <path d="M20,51.5 L20,16.5 L7,9 L7,51.5 Z" fill="${dark}"/>
    <circle cx="10.5" cy="34" r="2.4" fill="${light}"/>
    <rect x="3" y="51.5" width="58" height="3.5" fill="${dark}"/>`;
  return {
    svg: `<g transform="translate(${(x - BOX.x * s).toFixed(2)},${(y - BOX.y * s).toFixed(2)}) scale(${s.toFixed(5)})">${body}</g>`,
    width: BOX.w * s,
  };
}
// Horizontal lockup: symbol + outline-free wordmark (live text, editable).
function lockup(t, x, y, capH) {
  const symH = capH * 1.72, m = markSvg(t.markDark, t.markLight, x, y, symH);
  const tx = x + m.width + capH * 0.58, baseline = y + symH;
  const size = capH / 0.745;
  const words = `<text x="${tx.toFixed(1)}" y="${baseline.toFixed(1)}" font-family="Plus Jakarta Sans, sans-serif" font-size="${size.toFixed(1)}" fill="${t.text}" letter-spacing="${(-0.02 * size).toFixed(2)}"><tspan font-weight="800">Human</tspan><tspan font-weight="500" dx="${(0.2 * size).toFixed(1)}">First</tspan><tspan font-weight="700" font-size="${(size * 0.84).toFixed(1)}" dx="${(0.26 * size).toFixed(1)}" letter-spacing="${(0.03 * size).toFixed(2)}">AI</tspan></text>`;
  return { svg: m.svg + '\n  ' + words, height: symH };
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const T = (x, y, str, { size, weight = 400, fill, family = 'Plus Jakarta Sans, sans-serif', track = 0, anchor }) =>
  `<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" font-family="${family}" font-size="${size.toFixed(1)}" font-weight="${weight}" fill="${fill}"${track ? ` letter-spacing="${(track * size).toFixed(2)}"` : ''}${anchor ? ` text-anchor="${anchor}"` : ''}>${esc(str)}</text>`;
const block = (lines, x, y, { size, lh = 1.12, weight, fill, family, track, anchor }) =>
  lines.map((l, i) => T(x, y + size + i * size * lh, l, { size, weight, fill, family, track, anchor })).join('\n  ');
const ARCH = (x, y, w, h) => { const r = w / 2; return `M${x},${y + h} L${x},${y + r} A${r},${r} 0 0 1 ${x + w},${y + r} L${x + w},${y + h} Z`; };

// --- args ------------------------------------------------------------------
const argv = process.argv.slice(2);
if (!argv.length || argv.includes('--help') || argv.includes('-h')) {
  console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 22).map(l => l.replace(/^\/\/ ?/, '')).join('\n'));
  process.exit(0);
}
const opt = { type: 'statement', w: 1200, h: 627, theme: 'cream', out: 'card.svg', fact: [] };
for (let i = 0; i < argv.length; i++) {
  if (!argv[i].startsWith('--')) continue;
  const k = argv[i].slice(2), v = argv[i + 1];
  if (k === 'fact') opt.fact.push(v);
  else opt[k] = v;
  i++;
}
const W = +opt.w, H = +opt.h, t = THEMES[opt.theme] || THEMES.cream;
if (!Number.isFinite(W) || !Number.isFinite(H) || W < 100 || H < 100) {
  console.error('--w and --h must be numbers of at least 100'); process.exit(1);
}
if (!opt.headline) { console.error('--headline is required'); process.exit(1); }

const PAD = Math.round(W * 0.072), COL = W - PAD * 2;
const markCap = Math.round(H * 0.036);
const lock = lockup(t, PAD, H - PAD - markCap * 1.72, markCap);
const footSvg = opt.footer
  ? T(W - PAD, H - PAD - markCap * 1.72 + markCap * 1.0, opt.footer, { size: Math.round(W * 0.0165), weight: 500, fill: t.muted, anchor: 'end' })
  : '';

let body = '';

if (opt.type === 'statement') {
  const start = Math.round(Math.min(W * 0.072, H * 0.13));
  let size = start, lines = wrap(opt.headline, COL, size, 800);
  while (lines.length > 4 && size > start * 0.6) { size -= 2; lines = wrap(opt.headline, COL, size, 800); }
  const kickSize = Math.round(W * 0.0185);
  const blockH = (opt.kicker ? kickSize * 2.6 : 0) + size + (lines.length - 1) * size * 1.1;
  const top = Math.round((H - blockH) / 2 - H * 0.04);
  const n = 7, aw = W / n, ah = Math.round(H * 0.055);
  const band = Array.from({ length: n }, (_, i) =>
    `<path d="${ARCH(i * aw + aw * 0.14, H - ah, aw * 0.72, ah)}" fill="${t.accent}" opacity="${opt.theme === 'ink' ? 0.9 : 0.14}"/>`).join('');
  body = band
    + (opt.kicker ? '\n  ' + T(PAD, top + kickSize, opt.kicker.toUpperCase(), { size: kickSize, weight: 700, fill: t.accent, track: 0.14 }) : '')
    + '\n  ' + block(lines, PAD, top + (opt.kicker ? kickSize * 2.6 : 0), { size, lh: 1.1, weight: 800, fill: t.text });

} else if (opt.type === 'event') {
  if (!opt.fact.length) { console.error('--type event needs at least one --fact'); process.exit(1); }
  const tStart = Math.round(Math.min(W * 0.055, H * 0.105));
  let size = tStart, lines = wrap(opt.headline, COL, size, 800);
  while (lines.length > 3 && size > tStart * 0.62) { size -= 2; lines = wrap(opt.headline, COL, size, 800); }
  const kickSize = Math.round(W * 0.0175);
  let factSize = Math.round(W * 0.0225);
  let y = Math.round(H * 0.135);
  const kick = T(PAD, y + kickSize, opt.kicker ? opt.kicker.toUpperCase() : 'FREE WORKSHOP', { size: kickSize, weight: 700, fill: t.accent, track: 0.14 });
  y += kickSize * 2.5;
  const head = block(lines, PAD, y, { size, lh: 1.12, weight: 800, fill: t.text });
  y += size + (lines.length - 1) * size * 1.12 + H * 0.055;

  const markTop = H - PAD - markCap * 1.72;
  let pitch = Math.min(factSize * 2.9, (markTop - H * 0.045 - y) / opt.fact.length);
  if (pitch < factSize * 1.55) factSize = Math.max(11, Math.floor(pitch / 1.55));
  const facts = opt.fact.map((f, i) => {
    const yy = y + i * pitch;
    return `<rect x="${PAD}" y="${(yy + factSize * 0.25).toFixed(1)}" width="4" height="${(factSize * 1.1).toFixed(1)}" fill="${t.accent}"/>`
      + T(PAD + factSize * 0.9, yy + factSize, f, { size: factSize, weight: 500, fill: t.text, family: 'Atkinson Hyperlegible, sans-serif' });
  }).join('\n  ');

  const bw = Math.round(W * 0.2), bh = Math.round(factSize * 2.1), bx = W - PAD - bw, by = Math.round(H * 0.135) - bh * 0.25;
  const badge = `<rect x="${bx}" y="${by.toFixed(1)}" width="${bw}" height="${bh}" rx="${bh / 2}" fill="${C.sunrise}"/>`
    + T(bx + bw / 2, by + bh * 0.7, 'FREE', { size: factSize, weight: 800, fill: C.ink, track: 0.1, anchor: 'middle' });

  body = `<rect x="0" y="0" width="${W}" height="${Math.round(H * 0.022)}" fill="${C.sunrise}"/>\n  `
    + kick + '\n  ' + badge + '\n  ' + head + '\n  ' + facts
    + (opt.cta ? '\n  ' + T(W - PAD, markTop + markCap * 1.0, opt.cta, { size: Math.round(W * 0.018), weight: 700, fill: t.accent, anchor: 'end' }) : '');

} else if (opt.type === 'stat') {
  if (!opt.value) { console.error('--type stat needs --value'); process.exit(1); }
  const vSize = fitSize(opt.value, COL, Math.round(H * 0.30), 800);
  const lSize = Math.round(W * 0.038);
  const lLines = wrap(opt.headline, COL, lSize, 700);
  const top = Math.round(H * 0.24);
  body = `<path d="${ARCH(W * 0.60, H * 0.06, W * 0.46, H * 0.78)}" fill="${t.text}" opacity="0.05"/>\n  `
    + T(PAD, top + vSize, opt.value, { size: vSize, weight: 800, fill: t.accent })
    + '\n  ' + block(lLines, PAD, top + vSize * 1.18, { size: lSize, lh: 1.2, weight: 700, fill: t.text })
    + (opt.note ? '\n  ' + block(wrap(opt.note, COL, Math.round(W * 0.021), 400), PAD, top + vSize * 1.18 + lSize * 1.2 * lLines.length + H * 0.03,
        { size: Math.round(W * 0.021), lh: 1.5, weight: 400, fill: t.muted, family: 'Atkinson Hyperlegible, sans-serif' }) : '');

} else {
  console.error(`Unknown --type "${opt.type}". Use statement, event or stat.`);
  process.exit(1);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(opt.headline)}">
  <title>Human First AI — ${esc(opt.headline)}</title>
  <rect width="${W}" height="${H}" fill="${t.bg}"/>
  ${body}
  ${lock.svg}
  ${footSvg}
</svg>
`;
writeFileSync(opt.out, svg);
console.log(`Wrote ${opt.out}  (${W}x${H}, ${opt.type}, ${opt.theme})`);
console.log('Open it in Figma, Illustrator, Inkscape or Canva to edit the words.');
console.log('Fonts: Plus Jakarta Sans + Atkinson Hyperlegible (free, in brand/type/fonts/).');
