import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { renderPng } from '../lib/type.mjs';
import { C, markBody, MARK_BOX, markPaths } from '../lib/brand.mjs';
import { lockup, symbolGroup, CAP } from '../lib/lockup.mjs';

const PAT = '../brand/patterns', CON = '../brand/logo/construction';
mkdirSync(PAT, { recursive: true });
mkdirSync(CON, { recursive: true });
const Wp = (f, s) => writeFileSync(`${PAT}/${f}`, s);
const Wc = (f, s) => writeFileSync(`${CON}/${f}`, s);
const MUTED = '#68728A';
const T = (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-family="Plus Jakarta Sans" font-size="${o.s || 14}" font-weight="${o.w || 500}" fill="${o.f || C.ink}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${t}</text>`;

// ===========================================================================
//  THE OPEN THRESHOLD — the one graphic device, taken straight from the mark
//  Arch proportion: width 30u : height-to-springline 21.5u : radius 15u,
//  i.e. the same semicircle that crowns the doorway.
// ===========================================================================
const archPath = (x, y, w, h, r = w / 2) =>
  `M${x},${y + h} L${x},${y + r} A${r},${r} 0 0 1 ${x + w},${y + r} L${x + w},${y + h} Z`;

// 1. Arch window — crops photography and holds pull quotes.
Wp('arch-window.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 760" width="600" height="760">
  <defs><clipPath id="hf-arch"><path d="${archPath(0, 0, 600, 760, 300)}"/></clipPath></defs>
  <!-- Put any <image> or <g> inside this group to crop it to the threshold. -->
  <g clip-path="url(#hf-arch)">
    <rect width="600" height="760" fill="${C.sky}"/>
    ${T(300, 400, 'your photograph here', { s: 22, f: C.ink, anchor: 'middle' })}
  </g>
</svg>`);

// 2. Threshold rule — a hairline with a 30 degree notch, the leaf's own angle.
Wp('threshold-rule.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 24" width="800" height="24">
  <path d="M0,16 H300 L330,5 H800" fill="none" stroke="${C.ink}" stroke-width="2"/>
</svg>`);

// 3. Arch colonnade — a seamless repeating band for footers and covers.
const colonnade = (fill, bg, w = 480, h = 180) => {
  const n = 4, aw = w / n, ah = h * 0.82, r = aw / 2;
  let arches = '';
  for (let i = 0; i < n; i++) arches += `<path d="${archPath(i * aw, h - ah, aw, ah, r)}" fill="${fill}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="${bg}"/>${arches}
  <rect x="0" y="${h - 6}" width="${w}" height="6" fill="${fill}"/>
</svg>`;
};
Wp('colonnade-ink-on-cream.svg', colonnade(C.ink, C.cream));
Wp('colonnade-cream-on-ink.svg', colonnade(C.cream, C.ink));
Wp('colonnade-sunrise-on-ink.svg', colonnade(C.sunrise, C.ink));
for (const [f, fill, bg] of [['colonnade-ink-on-cream', C.ink, C.cream], ['colonnade-cream-on-ink', C.cream, C.ink]])
  await renderPng(sharp, colonnade(fill, bg, 1920, 720), { width: 1920 }, `${PAT}/${f}.png`);

// 4. Seamless tile — quiet texture for large flat areas.
const tile = (() => {
  const s = 96, r = 16;
  const one = (x, y) => `<path d="${archPath(x, y, r * 2, r * 2.6, r)}" fill="none" stroke="${C.ink}" stroke-width="2" opacity="0.14"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" width="${s}" height="${s}">
  <rect width="${s}" height="${s}" fill="${C.cream}"/>
  ${one(16, 20)}${one(64, 20)}${one(16, 68)}${one(64, 68)}
  ${one(-32, 20)}${one(-32, 68)}
</svg>`;
})();
Wp('tile-arches.svg', tile);
await renderPng(sharp, tile, { width: 384 }, `${PAT}/tile-arches.png`);

writeFileSync(`${PAT}/README.md`, `# The Open Threshold

One graphic device, taken from the mark itself — the same semicircle that crowns the doorway.
Use it to frame a photograph, open a cover, or close a footer. Nothing else is needed.

| File | Use |
|---|---|
| \`arch-window.svg\` | Clip-path for photography and pull quotes. Replace the placeholder with your image. |
| \`threshold-rule.svg\` | Section divider. The notch is the door leaf's 30° angle. |
| \`colonnade-*.svg\` | Footer and cover bands. Four arches, seamless left to right. |
| \`tile-arches.svg\` | A quiet 96px texture for large flat areas. Keep it under 15% opacity. |

Rules: the arch never rotates, never gets a gradient, and never gets an outline *and* a fill
at once. On photography, use it as a crop — not as an overlay on top of a subject's face.
`);

// ===========================================================================
//  CONSTRUCTION DIAGRAMS
// ===========================================================================
const GRID_PX = 14;                            // 1 grid unit -> 14 px
const g = n => n * GRID_PX;
const gridLines = (() => {
  let s = '';
  for (let i = 0; i <= 64; i += 4)
    s += `<line x1="${g(i)}" y1="0" x2="${g(i)}" y2="${g(64)}" stroke="${MUTED}" stroke-width="${i % 16 === 0 ? 1 : 0.5}" opacity="${i % 16 === 0 ? 0.5 : 0.25}"/>`
       + `<line x1="0" y1="${g(i)}" x2="${g(64)}" y2="${g(i)}" stroke="${MUTED}" stroke-width="${i % 16 === 0 ? 1 : 0.5}" opacity="${i % 16 === 0 ? 0.5 : 0.25}"/>`;
  return s;
})();
const ANN = [
  [39.5, 30, 15, 'frame centreline r=15'],
  [39.5, 30, 12.5, 'opening r=12.5'],
];
Wc('construction-grid.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${g(64) + 640} ${g(64) + 60}" width="${g(64) + 640}" height="${g(64) + 60}">
  <rect width="100%" height="100%" fill="${C.cream}"/>
  <g transform="translate(30,30)">
    ${gridLines}
    <g transform="scale(${GRID_PX})">${markBody(C.ink, C.sunrise)}</g>
    ${ANN.map(([cx, cy, r]) => `<circle cx="${g(cx)}" cy="${g(cy)}" r="${g(r)}" fill="none" stroke="${C.sunriseDeep || '#C24D00'}" stroke-width="1.2" stroke-dasharray="5 4"/>`).join('')}
    <line x1="${g(39.5)}" y1="${g(0)}" x2="${g(39.5)}" y2="${g(64)}" stroke="#C24D00" stroke-width="1" stroke-dasharray="5 4"/>
    <line x1="0" y1="${g(30)}" x2="${g(64)}" y2="${g(30)}" stroke="#C24D00" stroke-width="1" stroke-dasharray="5 4"/>
  </g>
  <g transform="translate(${g(64) + 60},60)">
    ${T(0, 0, 'How the mark is built', { s: 22, w: 800 })}
    ${[
      '64 × 64 unit grid. Every value sits on a 0.5u step.',
      'Frame: semicircle, r = 15, springline y = 30, stroke 5.',
      'Opening: concentric, r = 12.5, so the frame is 5u thick everywhere.',
      'Leaf: hinge edge x = 20, free edge x = 7, top edge at exactly 30°.',
      'Hinge gap: 2u of background between leaf and frame.',
      'Knob: r 2.4 at (10.5, 34) — the only detail that may be dropped.',
      'Ground: y 51.5, 3.5u deep, 4u wider than the doorway on each side.',
      '',
      'The lit opening is enclosed by Deep Ink on all four sides.',
      'Sunrise is 2.19:1 on cream, so it must never touch a light',
      'background directly. The geometry enforces that, not a rule.',
    ].map((l, i) => T(0, 36 + i * 26, l, { s: 15, f: l.startsWith('The lit') || l.startsWith('Sunrise') || l.startsWith('background') ? C.ink : MUTED, w: 400 })).join('\n    ')}
  </g>
</svg>`);

// --- clear space -----------------------------------------------------------
{
  const inner = lockup('horizontal', { dark: C.ink, light: C.sunrise, on: C.cream });
  const vb = inner.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const lw = +vb[1], lh = +vb[2], scale = 0.62, X = CAP * scale;
  const w = lw * scale + X * 2, h = lh * scale + X * 2;
  Wc('clear-space.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w + 120} ${h + 150}" width="${w + 120}" height="${h + 150}">
  <rect width="100%" height="100%" fill="${C.cream}"/>
  <g transform="translate(60,60)">
    <rect width="${w}" height="${h}" fill="#C24D00" opacity="0.07"/>
    <rect width="${w}" height="${h}" fill="none" stroke="#C24D00" stroke-width="1.5" stroke-dasharray="7 5"/>
    <rect x="${X}" y="${X}" width="${lw * scale}" height="${lh * scale}" fill="none" stroke="${MUTED}" stroke-width="1" stroke-dasharray="3 3"/>
    <g transform="translate(${X},${X}) scale(${scale})">${inner.replace(/<\/?svg[^>]*>/g, '').replace(/<title>[\s\S]*?<\/title>/, '')}</g>
    ${['0', `${w}`].map(() => '').join('')}
    <line x1="0" y1="${h + 26}" x2="${X}" y2="${h + 26}" stroke="#C24D00" stroke-width="1.5"/>
    ${T(X / 2, h + 48, 'X', { s: 16, w: 800, f: '#C24D00', anchor: 'middle' })}
  </g>
  ${T(60, h + 128, 'X = the cap height of the H in “Human”. Nothing may enter this zone — no text, no rule, no photo edge, no page trim.', { s: 15, f: MUTED })}
</svg>`);
}

// --- minimum size ----------------------------------------------------------
{
  const specs = [
    ['Horizontal lockup', 'horizontal', 132, '132px wide / 32mm'],
    ['Stacked lockup', 'stacked', 96, '96px wide / 24mm'],
    ['Symbol', 'symbol', 32, '32px / 8mm'],
    ['Symbol, micro build', 'symbol', 16, '16px / 5mm — drop the knob, stroke goes to 6u'],
  ];
  let x = 70, cells = '';
  for (const [label, kind, px, note] of specs) {
    const svg = lockup(kind, { dark: C.ink, light: C.sunrise, on: C.cream }, { micro: px <= 24 });
    const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    const s = px / +vb[1];
    cells += `<g transform="translate(${x},${150 - +vb[2] * s}) scale(${s})">${svg.replace(/<\/?svg[^>]*>/g, '').replace(/<title>[\s\S]*?<\/title>/, '')}</g>
    ${T(x, 180, label, { s: 14, w: 700 })}
    ${T(x, 200, note, { s: 13, f: MUTED })}\n    `;
    x += Math.max(px, 230) + 60;
  }
  Wc('minimum-size.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${x} 250" width="${x}" height="250">
  <rect width="100%" height="100%" fill="${C.cream}"/>
  ${T(70, 48, 'Minimum sizes', { s: 24, w: 800 })}
  ${T(70, 74, 'Below these, reproduce the micro build or nothing at all.', { s: 15, f: MUTED })}
  ${cells}
</svg>`);
}

// --- misuse sheet ----------------------------------------------------------
{
  const base = (extra = '', dark = C.ink, light = C.sunrise) =>
    `<g transform="scale(2.4)">${markBody(dark, light)}</g>${extra}`;
  const CELL = 430, ROW = 272, COLS = 3;
  const WRONG = [
    ['Do not rotate or mirror it', 'A door is architecture. Tilt it and it stops being one.',
      `<g transform="translate(78,78) rotate(-18) translate(-78,-78) scale(2.4)">${markBody(C.ink, C.sunrise)}</g>`],
    ['Do not stretch it', 'Scale both axes by the same number, always.',
      `<g transform="scale(3.1,1.9)">${markBody(C.ink, C.sunrise)}</g>`],
    ['Do not add a gradient or a glow', 'No sci-fi sheen. We are warm, flat and printed.',
      `<defs><linearGradient id="bad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7B2FF7"/><stop offset="1" stop-color="#00E0FF"/></linearGradient></defs><g transform="scale(2.4)">${markBody('url(#bad)', '#00E0FF')}</g>`],
    ['Do not recolour it', 'Only the approved colourways. No neon, no corporate blue.',
      `<g transform="scale(2.4)">${markBody('#8B00FF', '#C6FF00')}</g>`],
    ['Do not put it in a pill or add a shadow', 'The mark breathes on an open surface.',
      `<rect x="-18" y="6" width="200" height="150" rx="75" fill="#E6DED1"/><g transform="translate(3,3) scale(2.4)" opacity="0.3">${markBody('#000', '#000')}</g><g transform="scale(2.4)">${markBody(C.ink, C.sunrise)}</g>`],
    ['Do not set type inside the doorway', 'The opening stays empty in every language.',
      `<g transform="scale(2.4)">${markBody(C.ink, C.sunrise)}</g>${T(95, 106, 'AI', { s: 30, w: 800, f: C.ink, anchor: 'middle' })}`],
    ['Do not reorder the lockup', 'Human leads. It is the whole argument.',
      `${T(10, 90, 'AI First Human', { s: 26, w: 800 })}<g transform="translate(200,20) scale(1.0)">${markBody(C.ink, C.sunrise)}</g>`],
    ['Do not use Sunrise as an outline on light', 'It is 2.19:1 on cream. It disappears.',
      `<g transform="scale(2.4)">${markPaths().map(p => p.stroke ? `<path d="${p.d}" fill="none" stroke="${C.sunrise}" stroke-width="${p.width}"/>` : p.circle ? `<circle cx="${p.circle[0]}" cy="${p.circle[1]}" r="${p.circle[2]}" fill="${C.sunrise}"/>` : p.rect ? `<rect x="${p.rect[0]}" y="${p.rect[1]}" width="${p.rect[2]}" height="${p.rect[3]}" fill="${C.sunrise}"/>` : `<path d="${p.d}" fill="${C.sunrise}"/>`).join('')}</g>`],
    ['Do not drop it on a busy photo', 'Use the reversed build over a scrim, or move it.',
      `<rect width="190" height="160" fill="#8A7A66"/><g opacity="0.55">${Array.from({ length: 26 }, (_, i) => `<circle cx="${(i * 37) % 190}" cy="${(i * 53) % 160}" r="22" fill="${['#C9B79A', '#6E5A43', '#A89070'][i % 3]}"/>`).join('')}</g><g transform="scale(2.4)">${markBody(C.ink, C.sunrise)}</g>`],
  ];
  const rows = Math.ceil(WRONG.length / COLS);
  const cells = WRONG.map(([title, why, art], i) => {
    const x = 60 + (i % COLS) * CELL, y = 150 + Math.floor(i / COLS) * ROW;
    return `<g transform="translate(${x},${y})">
    <rect x="-10" y="-10" width="210" height="180" fill="${C.white}" stroke="${MUTED}" stroke-width="1" opacity="0.6"/>
    <svg x="0" y="0" width="190" height="160" viewBox="0 0 190 160" overflow="hidden">${art}</svg>
    <g stroke="#CE3E22" stroke-width="5" stroke-linecap="round"><line x1="152" y1="128" x2="186" y2="162"/><line x1="186" y1="128" x2="152" y2="162"/></g>
    </g>
    ${T(x - 10, y + 196, title, { s: 15, w: 700, f: '#CE3E22' })}
    ${T(x - 10, y + 216, why, { s: 13, f: MUTED })}`;
  }).join('\n  ');
  const H = 150 + rows * ROW + 70;
  Wc('misuse.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${60 + COLS * CELL + 60} ${H}" width="${60 + COLS * CELL + 60}" height="${H}">
  <rect width="100%" height="100%" fill="${C.cream}"/>
  ${T(60, 70, 'Nine ways to get it wrong', { s: 32, w: 800 })}
  ${T(60, 100, 'If a layout does any of these, it is not our mark any more. Send it back.', { s: 16, f: MUTED })}
  ${cells}
</svg>`);
}

for (const f of ['construction-grid', 'clear-space', 'minimum-size', 'misuse']) {
  const src = `${CON}/${f}.svg`;
  await renderPng(sharp, (await import('node:fs')).readFileSync(src, 'utf8'), { width: 1600 }, `${CON}/${f}.png`);
}
console.log('graphics: open-threshold device (4), construction grid, clear space, minimum size, misuse sheet');
