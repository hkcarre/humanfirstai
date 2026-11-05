import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'node:fs';
import { C, BRAND, WAYS } from '../lib/brand.mjs';
import { para, mark, arch, THEMES, doc } from '../lib/layout.mjs';
import { renderPng } from '../lib/type.mjs';

// ---------------------------------------------------------------------------
//  LinkedIn, with the overlays accounted for.
//
//  LinkedIn covers part of every banner you upload:
//
//    Personal profile 1584x396 — the profile photo is a circle roughly 300px
//      across in banner coordinates, sitting at the lower left and straddling
//      the bottom edge. Anything behind it is gone.
//    Company page 1128x191 — the 300x300 page logo overlays the lower left in
//      the same way. On a 191px-tall cover that is most of the left third.
//
//  The generic banners in social.mjs put the lockup exactly there, so both
//  would have shipped with the mark half-hidden. These keep the lower left
//  deliberately empty and carry the content on the right.
//
//  Mobile crops the sides further, so nothing that must be read goes in the
//  outer eighth of the width either.
//
//      node build/linkedin.mjs           build the set
//      node build/linkedin.mjs --guides  also write safe-zone overlays
// ---------------------------------------------------------------------------

const OUT = '../brand/templates/linkedin';
mkdirSync(OUT, { recursive: true });
const GUIDES = process.argv.includes('--guides');

/** What LinkedIn covers, in the banner's own coordinates. */
const OVERLAY = {
  personal: { w: 1584, h: 396, cx: 196, cy: 396, r: 158 },   // profile photo circle
  page: { w: 1128, h: 191, x: 48, y: 96, w2: 168, h2: 168 }, // page logo square
};

const colonnade = (w, h, t, n = 9) => {
  const aw = w / n, ah = Math.round(h * 0.30);
  return Array.from({ length: n }, (_, i) =>
    `<path d="${arch(i * aw + aw * 0.22, h - ah, aw * 0.56, ah)}" fill="${t.text}" opacity="0.07"/>`).join('');
};

/** Personal profile banner. Content lives right of the avatar. */
function personal({ theme = 'ink', line = BRAND.promise } = {}) {
  const w = 1584, h = 396, t = THEMES[theme];
  const o = OVERLAY.personal;
  // Start clear of the avatar, with a margin, and keep off the mobile crop.
  const left = o.cx + o.r + 72;
  const right = w - 96;
  const colW = right - left;

  const markH = 104;
  const m = mark('horizontal', WAYS[t.way], { x: left, y: 112, h: markH });
  const l = para([line], { x: left, y: 112 + markH + 38, maxW: colW, size: 40, weight: 500, fill: t.muted });
  const rule = 11;
  return doc(w, h,
    `  <rect width="${w}" height="${h}" fill="${t.bg}"/>\n  ${colonnade(w, h, t)}
  <rect x="0" y="${h - rule}" width="${w}" height="${rule}" fill="${C.sunrise}"/>
  ${m.svg}\n  ${l.svg}`,
    `${BRAND.name} — LinkedIn profile banner`);
}

/** Company page cover. The page logo already carries the mark, so this does
 *  not repeat it — it carries the line, clear of the overlay. */
function page({ theme = 'ink', line = 'AI for everyone. Opportunity for all.' } = {}) {
  const w = 1128, h = 191, t = THEMES[theme];
  const o = OVERLAY.page;
  const left = o.x + o.w2 + 56;
  const size = 36;
  const l = para([line], { x: left, y: Math.round((h - size * 1.15) / 2) - 4, maxW: w - left - 64, size, weight: 500, fill: t.text });
  const rule = 7;
  return doc(w, h,
    `  <rect width="${w}" height="${h}" fill="${t.bg}"/>\n  ${colonnade(w, h, t, 12)}
  <rect x="0" y="${h - rule}" width="${w}" height="${rule}" fill="${C.sunrise}"/>\n  ${l.svg}`,
    `${BRAND.name} — LinkedIn page cover`);
}

/** The 300x300 page logo. Square, generous padding, symbol only — the name is
 *  right beside it in the LinkedIn interface, so repeating it wastes the space
 *  and shrinks the door. */
function pageLogo({ theme = 'ink' } = {}) {
  const s = 300, t = THEMES[theme];
  const markH = 150;
  const m = mark('symbol', WAYS[t.way], { x: 0, y: (s - markH) / 2, h: markH });
  const centred = m.svg.replace(/translate\(([-\d.]+)[ ,]/, (_, x) => `translate(${(s - m.width) / 2} `);
  return doc(s, s, `  <rect width="${s}" height="${s}" fill="${t.bg}"/>\n  ${centred}`,
    `${BRAND.name} — LinkedIn page logo`);
}

/** A copy with the overlay drawn on, so anyone can see what LinkedIn hides. */
function withGuides(svg, kind) {
  const o = OVERLAY[kind];
  const shape = kind === 'personal'
    ? `<circle cx="${o.cx}" cy="${o.cy}" r="${o.r}" fill="#FF3B30" opacity="0.38"/>`
    : `<rect x="${o.x}" y="${o.y}" width="${o.w2}" height="${o.h2}" rx="12" fill="#FF3B30" opacity="0.38"/>`;
  const label = `<text x="${kind === 'personal' ? o.cx : o.x + o.w2 / 2}" y="${kind === 'personal' ? o.cy - o.r - 18 : o.y - 14}"
      text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="700" fill="#FF3B30">LinkedIn covers this</text>`;
  return svg.replace('</svg>', `${shape}${label}</svg>`);
}

const save = async (name, svg, kind) => {
  writeFileSync(`${OUT}/${name}.svg`, svg);
  await renderPng(sharp, svg, null, `${OUT}/${name}.png`);
  if (GUIDES && kind) {
    const g = withGuides(svg, kind);
    writeFileSync(`${OUT}/_guide-${name}.svg`, g);
    await renderPng(sharp, g, null, `${OUT}/_guide-${name}.png`);
  }
  console.log(`  ${name}`);
};

console.log('linkedin: building with overlay safe zones');
await save('banner-personal-1584x396', personal(), 'personal');
await save('banner-personal-1584x396-cream', personal({ theme: 'cream' }), 'personal');
await save('banner-page-1128x191', page(), 'page');
await save('page-logo-300x300', pageLogo(), null);
await save('page-logo-300x300-cream', pageLogo({ theme: 'cream' }), null);
console.log(`linkedin: -> ${OUT}${GUIDES ? ' (with safe-zone guides)' : ''}`);
