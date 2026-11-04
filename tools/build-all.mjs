// Regenerates every asset in brand/. Run from tools/:  npm run build
import { execFileSync } from 'node:child_process';
const STEPS = [
  ['color', 'palette, tokens, swatches, contrast matrix'],
  ['type', 'type scale, font CSS, specimen'],
  ['logo', 'lockups, PNGs, favicons, app icons'],
  ['icons', 'icon set, sprite, proofs'],
  ['graphics', 'threshold device, construction and misuse diagrams'],
  ['social', 'LinkedIn, newsletter, Instagram, WhatsApp, X, slides, email'],
  ['photos', 'responsive photo sets, arch crops, photo cards, alt text'],
  ['skill-metrics', 'font metrics for the skill card generator'],
];
const t0 = Date.now();
for (const [name, what] of STEPS) {
  process.stdout.write(`\n[${name}] ${what}\n`);
  execFileSync(process.execPath, [`build/${name}.mjs`], { stdio: 'inherit' });
}
console.log(`\nDone in ${((Date.now() - t0) / 1000).toFixed(1)}s. Everything in brand/ is regenerated.`);
console.log('Do not hand-edit brand/ — change the generator and run this again.\n');
