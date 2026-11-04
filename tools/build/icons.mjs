import sharp from 'sharp';
import { renderPng } from '../lib/type.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { C } from '../lib/brand.mjs';

// ---------------------------------------------------------------------------
//  Human First AI icon system
//  24 x 24 grid · 2px stroke · round caps and joins · 1.5px safe margin.
//  Drawn from the same language as the mark: arches, thresholds, open shapes.
//  No circuitry, no robots, no neural nodes. Everyday objects only.
// ---------------------------------------------------------------------------
const ROOT = '../brand/icons';
mkdirSync(`${ROOT}/svg`, { recursive: true });

export const ICONS = [
  { id: 'open-access', name: 'Open Access', replaces: 'API / platform / gateway',
    meaning: 'A threshold anyone may cross. No paywall, no credential, no gatekeeper.',
    d: `<path d="M9 21h13"/>
        <path d="M11.4 21v-9.4a4.8 4.8 0 0 1 9.6 0V21"/>
        <path d="M2.3 14.6h6.6"/>
        <path d="m6.2 11.6 3 3-3 3"/>` },

  { id: 'plain-language', name: 'Plain Language', replaces: 'NLP / LLM / prompt',
    meaning: 'Words a twelve-year-old can read on the first pass.',
    d: `<path d="M20 4H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3v4l4.5-4H20a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Z"/>
        <path d="M7 8.5h10"/><path d="M7 12h6"/>` },

  { id: 'learning-circle', name: 'Learning Circle', replaces: 'neural network / training',
    meaning: 'People teaching each other around an open centre, not a lecture from above.',
    d: `<circle cx="12" cy="12" r="8.4"/>
        <circle cx="12" cy="6.8" r="1.65" fill="currentColor" stroke="none"/>
        <circle cx="16.95" cy="10.39" r="1.65" fill="currentColor" stroke="none"/>
        <circle cx="15.06" cy="16.21" r="1.65" fill="currentColor" stroke="none"/>
        <circle cx="8.94" cy="16.21" r="1.65" fill="currentColor" stroke="none"/>
        <circle cx="7.05" cy="10.39" r="1.65" fill="currentColor" stroke="none"/>` },

  { id: 'human-compass', name: 'Human Compass', replaces: 'optimisation / alignment',
    meaning: 'Human judgement sets the direction. The technology follows.',
    d: `<circle cx="12" cy="12" r="8.5"/>
        <path d="m15.2 8.8-2 4.4-4.4 2 2-4.4Z"/>
        <path d="M12 3.5v1.8"/><path d="M12 18.7v1.8"/>
        <path d="M3.5 12h1.8"/><path d="M18.7 12h1.8"/>` },

  { id: 'shared-tool', name: 'Shared Tool', replaces: 'machine-learning pipeline',
    meaning: 'AI is a tool you pick up, like a pen or a spade. It is not a mind.',
    d: `<path d="M14.5 3.6a4.6 4.6 0 0 0-1.1 7.5l-8 8a1.8 1.8 0 0 0 2.5 2.5l8-8a4.6 4.6 0 0 0 5.2-6.7l-2.9 2.9-2.4-2.4 2.9-2.9a4.6 4.6 0 0 0-4.2-.9Z"/>
        <path d="M6.6 17.4 8 18.8"/>` },

  { id: 'everyday-growth', name: 'Everyday Growth', replaces: 'scale / exponential curve',
    meaning: 'Real progress for one family, one stall, one classroom at a time.',
    d: `<path d="M3.5 20.5h17"/>
        <path d="M12 20.5v-9"/>
        <path d="M12 11.5C12 8.2 9.6 5.8 6.3 5.8c0 3.3 2.4 5.7 5.7 5.7Z"/>
        <path d="M12 13.4c0-2.7 2-4.7 4.7-4.7 0 2.7-2 4.7-4.7 4.7Z"/>` },

  { id: 'community-voice', name: 'Community Voice', replaces: 'user feedback / telemetry',
    meaning: 'The people in the room decide. Not a head office somewhere else.',
    d: `<path d="M15.5 13.2h-10a1 1 0 0 1-1-1V4.8a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7.4a1 1 0 0 1-1 1Z"/>
        <path d="M7.5 13.2v3.1l3.4-3.1"/>
        <path d="M16.5 8.6h2a1 1 0 0 1 1 1v6.3a1 1 0 0 1-1 1h-1.1v3l-3.3-3h-3.3"/>` },

  { id: 'safe-guardrails', name: 'Safe Guardrails', replaces: 'security / compliance',
    meaning: 'Privacy, honesty about limits, and a way to say no.',
    d: `<path d="M12 21s7.2-3.3 7.2-8.6V5.6L12 3 4.8 5.6v6.8C4.8 17.7 12 21 12 21Z"/>
        <path d="m8.8 12.2 2.3 2.3 4.1-4.6"/>` },

  { id: 'no-cost', name: 'No Cost', replaces: 'pricing / tier / upgrade',
    meaning: 'Nothing we teach has ever had a price on it.',
    d: `<path d="M20.4 12.6 12.6 20.4a1.7 1.7 0 0 1-2.4 0l-6.2-6.2a1.7 1.7 0 0 1-.5-1.2V5a1.7 1.7 0 0 1 1.7-1.7h8a1.7 1.7 0 0 1 1.2.5l6.2 6.2a1.7 1.7 0 0 1 0 2.6Z"/>
        <circle cx="7.9" cy="7.9" r="1.5"/>
        <path d="M4.6 19.4 19.4 4.6"/>` },

  { id: 'your-language', name: 'Your Language', replaces: 'localisation / i18n',
    meaning: 'Taught in the language people actually think in.',
    d: `<circle cx="12" cy="12" r="8.5"/>
        <path d="M3.5 12h17"/>
        <path d="M12 3.5a13 13 0 0 1 0 17a13 13 0 0 1 0-17Z"/>` },

  { id: 'hands-on', name: 'Hands On', replaces: 'onboarding / tutorial',
    meaning: 'People learn by doing it once with someone beside them.',
    d: `<path d="M8.5 11.5V5.3a1.6 1.6 0 0 1 3.2 0v5"/>
        <path d="M11.7 10.3V4.4a1.6 1.6 0 0 1 3.2 0v6"/>
        <path d="M14.9 10.8V6.6a1.6 1.6 0 0 1 3.2 0v7.6a6.3 6.3 0 0 1-6.3 6.3h-.9a5.6 5.6 0 0 1-4.2-1.9l-3-3.4a1.6 1.6 0 0 1 2.3-2.2l2.5 2.2"/>` },

  { id: 'open-door-small', name: 'Open Door', replaces: 'the mark, in running text',
    meaning: 'The movement itself. Use only where the full mark will not fit.',
    d: `<path d="M3 20.5h18"/>
        <path d="M9 20.5V9.8a4.2 4.2 0 0 1 8.4 0v10.7"/>
        <path d="M9 20.5V6.2L4.2 3.5v17"/>
        <circle cx="6.4" cy="12.4" r="0.95" fill="currentColor" stroke="none"/>` },
];

const wrap = (d, color = 'currentColor') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none"
     stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  ${d.trim()}
</svg>`;

for (const ic of ICONS) writeFileSync(`${ROOT}/svg/${ic.id}.svg`, wrap(ic.d));

// --- a single sprite so a team can drop one file into any project ---------
writeFileSync(`${ROOT}/hfai-icons.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
${ICONS.map(ic => `  <symbol id="hfai-${ic.id}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    ${ic.d.trim()}
  </symbol>`).join('\n')}
</svg>
<!-- Use:  <svg class="icon" aria-hidden="true"><use href="hfai-icons.svg#hfai-open-access"/></svg>  -->
`);

writeFileSync(`${ROOT}/icons.json`, JSON.stringify(
  ICONS.map(({ id, name, replaces, meaning }) => ({ id, name, replaces, meaning })), null, 2));

// --- specimen sheet --------------------------------------------------------
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const COLS = 3, CW = 470, CH = 132, PAD = 56;
const H = PAD * 2 + 90 + Math.ceil(ICONS.length / COLS) * CH;
const Wd = PAD * 2 + COLS * CW;
const sheet = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Wd} ${H}" width="${Wd}" height="${H}">
  <rect width="${Wd}" height="${H}" fill="${C.cream}"/>
  <text x="${PAD}" y="${PAD + 30}" font-family="Plus Jakarta Sans" font-size="32" font-weight="800" fill="${C.ink}">Human First AI — icons</text>
  <text x="${PAD}" y="${PAD + 60}" font-family="Plus Jakarta Sans" font-size="16" fill="#68728A">24px grid · 2px stroke · round caps · every icon replaces a piece of jargon with an everyday object.</text>
${ICONS.map((ic, i) => {
  const x = PAD + (i % COLS) * CW, y = PAD + 90 + Math.floor(i / COLS) * CH;
  return `  <g transform="translate(${x},${y}) scale(2.1)" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ic.d}</g>
  <text x="${x + 72}" y="${y + 24}" font-family="Plus Jakarta Sans" font-size="18" font-weight="700" fill="${C.ink}">${esc(ic.name)}</text>
  <text x="${x + 72}" y="${y + 46}" font-family="Plus Jakarta Sans" font-size="13" fill="#C24D00">replaces: ${esc(ic.replaces)}</text>
  <text x="${x + 72}" y="${y + 68}" font-family="Plus Jakarta Sans" font-size="13" fill="#68728A">${esc(ic.meaning.slice(0, 52))}</text>
  <text x="${x + 72}" y="${y + 85}" font-family="Plus Jakarta Sans" font-size="13" fill="#68728A">${esc(ic.meaning.slice(52))}</text>`;
}).join('\n')}
</svg>`;
writeFileSync(`${ROOT}/icons-sheet.svg`, sheet);
await renderPng(sharp, sheet, { width: 1800 }, `${ROOT}/icons-sheet.png`);

// --- small-size proof ------------------------------------------------------
const proof = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ICONS.length * 52 + 40} 150" width="${ICONS.length * 52 + 40}" height="150">
  <rect width="100%" height="100%" fill="${C.cream}"/>
${[48, 24, 16].map((s, row) => ICONS.map((ic, i) =>
  `  <g transform="translate(${20 + i * 52 + (48 - s) / 2},${16 + row * 46 + (48 - s) / 2}) scale(${s / 24})" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ic.d}</g>`
).join('\n')).join('\n')}
</svg>`;
writeFileSync(`${ROOT}/icons-small-proof.svg`, proof);
await renderPng(sharp, proof, { width: 1600 }, `${ROOT}/icons-small-proof.png`);

console.log(`icons: ${ICONS.length} drawn, sprite + json + specimen + small-size proof`);
