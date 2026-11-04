import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { lockup, symbolGroup, CAP, RATIOS, METRICS } from '../lib/lockup.mjs';
import { WAYS, C, MARK_BOX, markBody, BRAND } from '../lib/brand.mjs';

const ROOT = '../brand/logo';
const dirs = ['svg', 'png', 'favicon', 'app-icon', 'construction'];
dirs.forEach(d => mkdirSync(`${ROOT}/${d}`, { recursive: true }));
const W = (p, s) => { writeFileSync(`${ROOT}/${p}`, s); return s; };
const png = (svg, o, file) => sharp(Buffer.from(svg), { density: 600 }).resize(o).png({ compressionLevel: 9 }).toFile(`${ROOT}/${file}`);

// ---------------------------------------------------------------- SVG suite
const MATRIX = {
  symbol:     ['full','reversed','mono-ink','mono-black','mono-white','mono-teal'],
  horizontal: ['full','reversed','mono-ink','mono-black','mono-white'],
  stacked:    ['full','reversed','mono-ink','mono-black','mono-white'],
  descriptor: ['full','reversed','mono-ink'],
  chapter:    ['full','reversed','mono-ink'],
  wordmark:   ['mono-ink','mono-white','mono-black'],
};
let n = 0;
for (const [kind, ways] of Object.entries(MATRIX))
  for (const wk of ways) { W(`svg/hfai-${kind}-${wk}.svg`, lockup(kind, WAYS[wk])); n++; }

// micro (≤24 px / ≤8 mm) + chapter template
W('svg/hfai-symbol-micro-full.svg',     lockup('symbol', WAYS.full,       { micro:true }));
W('svg/hfai-symbol-micro-mono-ink.svg', lockup('symbol', WAYS['mono-ink'],{ micro:true }));
W('svg/hfai-symbol-micro-reversed.svg', lockup('symbol', WAYS.reversed,   { micro:true }));
W('svg/hfai-chapter-TEMPLATE.svg',      lockup('chapter', WAYS.full, { chapter:'{{CHAPTER}}' })
  .replace('<svg ', '<!-- Replace {{CHAPTER}} with the city name, then re-export. -->\n<svg '));
n += 4;

// ------------------------------------------------------------------- PNG
const PNGJOBS = [
  ['symbol','full',[256,512,1024]], ['symbol','reversed',[256,512,1024]], ['symbol','mono-ink',[512]],
  ['horizontal','full',[800,1600,2400]], ['horizontal','reversed',[800,1600]], ['horizontal','mono-ink',[1600]],
  ['stacked','full',[600,1200]], ['stacked','reversed',[600,1200]],
  ['wordmark','mono-ink',[1200]],
];
for (const [kind, wk, widths] of PNGJOBS) {
  const svg = lockup(kind, WAYS[wk]);
  for (const w of widths) await png(svg, { width:w }, `png/hfai-${kind}-${wk}-${w}w.png`);
}

// --------------------------------------------------------------- FAVICON
const square = (body, size, bg, pad = 0.08) => {
  const inner = 1 - pad * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`
    + (bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : '')
    + `<g transform="translate(${size*pad},${size*(0.5-inner*MARK_BOX.h/MARK_BOX.w/2)}) scale(${size*inner/MARK_BOX.w})">`
    + `<g transform="translate(${-MARK_BOX.x},${-MARK_BOX.y})">${body}</g></g></svg>`;
};
const faviconSvg = (size, micro) => square(markBody(C.ink, C.sunrise, micro ? {stroke:6,knob:false} : {}), size, null, 0.03);
W('favicon/favicon.svg', faviconSvg(64, false));
const icoBufs = {};
for (const s of [16, 24, 32, 48, 64, 128, 256]) {
  const buf = await sharp(Buffer.from(faviconSvg(64, s <= 32)), { density:1200 }).resize(s, s).png().toBuffer();
  writeFileSync(`${ROOT}/favicon/favicon-${s}.png`, buf); icoBufs[s] = buf;
}
// --- .ico container (PNG-in-ICO, Vista+) ---
{
  const sizes = [16, 32, 48, 256], dir = Buffer.alloc(6 + 16 * sizes.length);
  dir.writeUInt16LE(0, 0); dir.writeUInt16LE(1, 2); dir.writeUInt16LE(sizes.length, 4);
  let off = dir.length; const blobs = [];
  sizes.forEach((s, i) => {
    const b = icoBufs[s], e = 6 + i * 16;
    dir.writeUInt8(s >= 256 ? 0 : s, e); dir.writeUInt8(s >= 256 ? 0 : s, e + 1);
    dir.writeUInt8(0, e + 2); dir.writeUInt8(0, e + 3);
    dir.writeUInt16LE(1, e + 4); dir.writeUInt16LE(32, e + 6);
    dir.writeUInt32LE(b.length, e + 8); dir.writeUInt32LE(off, e + 12);
    off += b.length; blobs.push(b);
  });
  writeFileSync(`${ROOT}/favicon/favicon.ico`, Buffer.concat([dir, ...blobs]));
}
// PWA / touch icons — solid ink plate, mark reversed
const plate = (size, pad) => square(markBody(C.cream, C.sunrise, {}), size, C.ink, pad);
for (const [name, size, pad] of [['apple-touch-icon', 180, 0.17], ['icon-192', 192, 0.17], ['icon-512', 512, 0.17], ['icon-maskable-512', 512, 0.26]])
  await png(plate(size, pad), { width:size, height:size }, `favicon/${name}.png`);
W('favicon/site.webmanifest', JSON.stringify({
  name: BRAND.name, short_name: 'HumanFirst', description: BRAND.oneLiner,
  start_url: '/', display: 'standalone', background_color: C.cream, theme_color: C.ink,
  icons: [
    { src:'/icon-192.png', sizes:'192x192', type:'image/png' },
    { src:'/icon-512.png', sizes:'512x512', type:'image/png' },
    { src:'/icon-maskable-512.png', sizes:'512x512', type:'image/png', purpose:'maskable' },
  ],
}, null, 2));

// ------------------------------------------------------------- APP ICONS
await png(plate(1024, 0.17), { width:1024, height:1024 }, 'app-icon/ios-appstore-1024.png');
await png(plate(432, 0.28),  { width:432,  height:432  }, 'app-icon/android-adaptive-foreground-432.png');
W('app-icon/android-adaptive-background.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432" width="432" height="432"><rect width="432" height="432" fill="${C.ink}"/></svg>`);
await png(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432" width="432" height="432"><rect width="432" height="432" fill="${C.ink}"/></svg>`,
  { width:432, height:432 }, 'app-icon/android-adaptive-background-432.png');
console.log(`logo: ${n} SVG lockups, PNG set, favicons, app icons ->`, ROOT);
