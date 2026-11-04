#!/usr/bin/env node
// Human First AI — contrast checker. No dependencies.
//
//   node check-contrast.mjs "#1F2A44" "#FFF6EC"      one pairing
//   node check-contrast.mjs "#FF8A3D"                 one colour against the whole palette
//   node check-contrast.mjs --palette                 the full brand matrix
//   node check-contrast.mjs --audit styles.css        every hex in a file, checked for brand membership
//
// Thresholds: 4.5 body text · 3.0 large text and graphics · 7.0 AAA.

const PALETTE = {
  'Warm Cream': '#FFF6EC', 'Deep Ink': '#1F2A44', 'Sunrise': '#FF8A3D',
  'Sunrise Deep': '#C24D00', 'Community Teal': '#187F72', 'Sky': '#7CC4F2',
  'Sky Deep': '#1277B7', 'Ink Muted': '#68728A', 'Clay': '#CE3E22',
  'Paper White': '#FFFFFF', 'Press Black': '#000000',
};
const FILL_ONLY = new Set(['Sunrise', 'Sky']);

const norm = h => {
  let s = String(h).trim().replace(/^#/, '');
  if (s.length === 3) s = s.split('').map(c => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(s)) return null;
  return '#' + s.toUpperCase();
};
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = hex => {
  const h = hex.slice(1);
  return 0.2126 * lin(parseInt(h.slice(0, 2), 16))
       + 0.7152 * lin(parseInt(h.slice(2, 4), 16))
       + 0.0722 * lin(parseInt(h.slice(4, 6), 16));
};
export const contrast = (a, b) => {
  const l1 = lum(norm(a)), l2 = lum(norm(b));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};
const nameOf = hex => Object.entries(PALETTE).find(([, v]) => v === hex)?.[0] || null;
const verdict = r => r >= 7 ? 'AAA  body + large'
  : r >= 4.5 ? 'AA   body + large'
  : r >= 3 ? 'AA   large text and graphics only'
  : 'FAIL any text, any size';

const pad = (s, n) => String(s).padEnd(n);
const line = () => console.log('-'.repeat(78));

function report(fg, bg) {
  const r = contrast(fg, bg);
  const fn = nameOf(fg) || fg, bn = nameOf(bg) || bg;
  console.log(`${pad(fn, 16)} on ${pad(bn, 16)} ${r.toFixed(2).padStart(6)}:1   ${verdict(r)}`);
  if (FILL_ONLY.has(nameOf(fg)) && r < 3) {
    console.log(`  ! ${nameOf(fg)} is a fill, not an ink. For text or lines here use `
      + `${nameOf(fg) === 'Sunrise' ? 'Sunrise Deep #C24D00' : 'Sky Deep #1277B7'}.`);
  }
  if (nameOf(bg) === 'Sunrise' && nameOf(fg) !== 'Deep Ink' && r < 4.5) {
    console.log('  ! All text on a Sunrise fill is Deep Ink #1F2A44 (6.08:1).');
  }
  return r;
}

const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log(`Human First AI — contrast checker

  check-contrast.mjs <fg> <bg>      check one pairing
  check-contrast.mjs <colour>       check one colour against the whole palette
  check-contrast.mjs --palette      the full brand matrix
  check-contrast.mjs --audit FILE   every hex in a file, flagged if off-palette

Thresholds: 4.5 body text, 3.0 large text and graphics, 7.0 AAA.`);
  process.exit(0);
}

if (args[0] === '--palette') {
  const keys = Object.keys(PALETTE);
  console.log('\nRow text on column background\n');
  console.log(pad('', 16) + keys.map(k => k.slice(0, 7).padStart(9)).join(''));
  for (const f of keys) {
    console.log(pad(f, 16) + keys.map(b => f === b ? '        -' : contrast(PALETTE[f], PALETTE[b]).toFixed(2).padStart(9)).join(''));
  }
  console.log('');
  process.exit(0);
}

if (args[0] === '--audit') {
  const file = args[1];
  if (!file) { console.error('--audit needs a file path'); process.exit(1); }
  const { readFileSync } = await import('node:fs');
  let text;
  try { text = readFileSync(file, 'utf8'); }
  catch (e) { console.error(`Cannot read ${file}: ${e.message}`); process.exit(1); }

  const found = new Map();
  for (const m of text.matchAll(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)) {
    const hex = norm(m[0]);
    if (hex) found.set(hex, (found.get(hex) || 0) + 1);
  }
  if (!found.size) { console.log(`No hex colours found in ${file}.`); process.exit(0); }

  console.log(`\n${found.size} distinct colour(s) in ${file}\n`);
  line();
  let offBrand = 0;
  for (const [hex, count] of [...found].sort((a, b) => b[1] - a[1])) {
    const n = nameOf(hex);
    if (n) {
      console.log(`${pad(hex, 10)} x${pad(count, 4)} ${pad(n, 16)} on brand`
        + (FILL_ONLY.has(n) ? '   (fill only — never type or hairlines on light)' : ''));
    } else {
      offBrand++;
      let best = null;
      for (const [bn, bh] of Object.entries(PALETTE)) {
        const d = Math.abs(lum(bh) - lum(hex));
        if (!best || d < best.d) best = { bn, bh, d };
      }
      console.log(`${pad(hex, 10)} x${pad(count, 4)} ${pad('OFF PALETTE', 16)} nearest in value: ${best.bn} ${best.bh}`);
    }
  }
  line();
  console.log(offBrand === 0
    ? 'Every colour is on palette.'
    : `${offBrand} colour(s) are not in the Human First AI palette. See docs/04-colour.md.`);
  process.exit(offBrand === 0 ? 0 : 1);
}

const fg = norm(args[0]);
if (!fg) { console.error(`Not a hex colour: ${args[0]}`); process.exit(1); }

if (args.length === 1) {
  console.log(`\n${nameOf(fg) || fg} against the palette\n`);
  line();
  for (const [n, hex] of Object.entries(PALETTE)) if (hex !== fg) report(fg, hex);
  line();
  process.exit(0);
}

const bg = norm(args[1]);
if (!bg) { console.error(`Not a hex colour: ${args[1]}`); process.exit(1); }
console.log('');
const r = report(fg, bg);
console.log('');
process.exit(r >= 4.5 ? 0 : 1);
