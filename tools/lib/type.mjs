import opentype from 'opentype.js';
import { fileURLToPath } from 'node:url';

const PJS = fileURLToPath(new URL('../fonts/', import.meta.url));
const ATK = fileURLToPath(new URL('../../brand/type/fonts/', import.meta.url));
export const CAP_RATIO = 745 / 1000;

const FILES = {
  brand: { 400: PJS + 'PJS-400.ttf', 500: PJS + 'PJS-500.ttf', 600: PJS + 'PJS-600.ttf', 700: PJS + 'PJS-700.ttf', 800: PJS + 'PJS-800.ttf' },
  readable: { 400: ATK + 'AtkinsonHyperlegible-Regular.ttf', 700: ATK + 'AtkinsonHyperlegible-Bold.ttf' },
};
const cache = {};
const nearest = (fam, w) => {
  const ws = Object.keys(FILES[fam]).map(Number);
  return ws.reduce((a, b) => (Math.abs(b - w) < Math.abs(a - w) ? b : a));
};
export function face(weight = 400, family = 'brand') {
  const w = nearest(family, weight), k = `${family}:${w}`;
  return cache[k] ??= opentype.loadSync(FILES[family][w]);
}
export const font = w => face(w, 'brand');   // back-compat for the logo builder

const mergeBox = (a, b) => !a ? b : !b ? a :
  { x1: Math.min(a.x1, b.x1), y1: Math.min(a.y1, b.y1), x2: Math.max(a.x2, b.x2), y2: Math.max(a.y2, b.y2) };

/** One run of text as SVG path data. Returns {d, advance, box}. */
export function run(weight, text, size, trackingEm = 0, x = 0, baseline = 0, family = 'brand') {
  const f = face(weight, family), track = trackingEm * size, scale = size / f.unitsPerEm;
  let cx = x, d = '', box = null;
  const glyphs = f.stringToGlyphs(text);
  glyphs.forEach((g, i) => {
    const p = g.getPath(cx, baseline, size);
    d += p.toPathData(3) + ' ';
    const b = p.getBoundingBox();
    if (isFinite(b.x1)) box = mergeBox(box, b);
    cx += g.advanceWidth * scale + track;
    if (i < glyphs.length - 1) cx += (f.getKerningValue(g, glyphs[i + 1]) || 0) * scale;
  });
  return { d: d.trim(), advance: cx - x - track, box };
}

/** Several runs with em-relative gaps. Returns {d, advance, box}. */
export function line(parts, size, x = 0, baseline = 0) {
  let cx = x, d = '', box = null;
  for (const p of parts) {
    cx += (p.gapBefore || 0) * size;
    const r = run(p.w, p.t, size * (p.scale || 1), p.track || 0, cx, baseline, p.family || 'brand');
    d += r.d + ' '; box = mergeBox(box, r.box); cx += r.advance;
  }
  return { d: d.trim(), advance: cx - x, box };
}

/** Measured advance width of a string — for laying out before drawing. */
export const measure = (text, size, weight = 400, family = 'brand', trackEm = 0) =>
  run(weight, text, size, trackEm, 0, 0, family).advance;

// ---------------------------------------------------------------------------
//  outlineSvg — turn every <text> in a generated SVG into a <path>.
//
//  Our SVG templates keep real <text> so a designer can open and edit them.
//  Rasterisers (librsvg, and any machine without the fonts installed) would
//  silently substitute a fallback face, so every PNG we ship is rendered from
//  an outlined copy instead. Same artwork, no font dependency.
// ---------------------------------------------------------------------------
const FAMILY_MAP = { 'plus jakarta sans': 'brand', 'atkinson hyperlegible': 'readable' };
const unesc = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'")
  .replace(/&quot;/g, '"').replace(/&amp;/g, '&');

export function outlineSvg(svg) {
  return svg.replace(/<text\s([^>]*?)\s*\/?>([\s\S]*?)<\/text>/g, (full, attrStr, body) => {
    if (/<tspan/i.test(body)) return full;                     // leave complex runs alone
    const attr = {};
    for (const m of attrStr.matchAll(/([a-zA-Z-]+)\s*=\s*"([^"]*)"/g)) attr[m[1]] = m[2];
    const text = unesc(body).replace(/\s+/g, ' ').trim();
    if (!text) return '';
    const famKey = FAMILY_MAP[(attr['font-family'] || '').split(',')[0].replace(/['"]/g, '').trim().toLowerCase()] || 'brand';
    const size = parseFloat(attr['font-size'] || 16);
    const weight = parseInt(attr['font-weight'] || 400, 10) || 400;
    const ls = parseFloat(attr['letter-spacing'] || 0) || 0;
    const r = run(weight, text, size, ls / size, 0, 0, famKey);
    let x = parseFloat(attr.x || 0);
    const anchor = attr['text-anchor'];
    if (anchor === 'middle') x -= r.advance / 2;
    else if (anchor === 'end') x -= r.advance;
    const placed = run(weight, text, size, ls / size, x, parseFloat(attr.y || 0), famKey);
    const extra = ['opacity', 'fill-opacity', 'transform'].filter(k => attr[k]).map(k => ` ${k}="${attr[k]}"`).join('');
    return `<path d="${placed.d}" fill="${attr.fill || '#000'}"${extra}/>`;
  });
}

/** Render an SVG string to PNG with text outlined first. */
export async function renderPng(sharp, svg, resize, file) {
  const flat = outlineSvg(svg);
  let img = sharp(Buffer.from(flat), { density: 300 });
  if (resize) img = img.resize(resize);
  return img.png({ compressionLevel: 9 }).toFile(file);
}
