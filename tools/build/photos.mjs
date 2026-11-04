import sharp from 'sharp';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { outlineSvg } from '../lib/type.mjs';
import { C, WAYS, BRAND } from '../lib/brand.mjs';
import { para, mark, arch, doc } from '../lib/layout.mjs';

const SRC = '../src/assets/images';
const ROOT = '../brand/photography';
for (const d of ['full', 'web', 'threshold', 'cards']) mkdirSync(`${ROOT}/${d}`, { recursive: true });

// ---------------------------------------------------------------------------
//  Photography set. Alt text follows the house formula:
//  [who] + [what they are doing] + [where / what it feels like].
// ---------------------------------------------------------------------------
export const PHOTOS = [
  {
    slug: 'artisan-block-printing-tablet',
    file: 'artisan_workshop_learning_1793268559990.jpg',
    caption: 'Learning to photograph and catalogue block-print designs.',
    alt: 'An older woman in a deep red bandhani sari points at a tablet screen showing a block-print motif while a younger woman in blue leans in beside her, both laughing, in a sunlit textile workshop stacked with bolts of fabric.',
    where: 'Textile workshop · South Asia',
    use: 'Small business, craft, livelihoods, intergenerational teaching.',
  },
  {
    slug: 'community-hall-session',
    file: 'community_gathering_hall_1793268560474.jpg',
    caption: 'A full room, tablets shared two to a table.',
    alt: 'Around twenty people of mixed ages sit at long tables in a bright community centre, tablets and printed worksheets between them, a facilitator in a green lanyard talking with one group while a child raises a hand nearby.',
    where: 'Community cultural centre · South-East Asia',
    use: 'Scale, turnout, the shape of a real session. Good for event promotion.',
  },
  {
    slug: 'library-first-laptop',
    file: 'community_workshop_learning_1793268558159.jpg',
    caption: 'First time writing a letter with help from a tool.',
    alt: 'A woman with grey hair and glasses sits at a laptop in a brick-walled hall with arched windows while a young volunteer in a navy jumper leans in, pointing at the screen; both are smiling, with other learners at tables behind them.',
    where: 'Community library hall',
    use: 'One-to-one teaching, first-time learners, volunteer recruitment.',
  },
  {
    slug: 'highland-farmer-frost-forecast',
    file: 'farmer_market_tablet_ai_1793268559656.jpg',
    caption: 'Checking a frost forecast against what the field is doing.',
    alt: 'A farmer in a knitted chullo hat holds a tablet showing a weather reading while an agricultural advisor with a notebook listens, standing between rows of potato plants on a terraced highland slope with mountains behind.',
    where: 'Terraced highland farm · Andes',
    use: 'Agriculture, rural reach, practical daily value.',
  },
];

const WIDTHS = [2400, 1600, 1200, 800, 400];
const report = [];

for (const p of PHOTOS) {
  const src = `${SRC}/${p.file}`;
  const meta = await sharp(src).metadata();
  p.source = { width: meta.width, height: meta.height, bytes: readFileSync(src).length };

  // Archive copy, stripped of metadata, renamed to something a human can read.
  await sharp(src).jpeg({ quality: 92, mozjpeg: true }).toFile(`${ROOT}/full/${p.slug}.jpg`);

  // Responsive web set, jpg + webp.
  p.web = [];
  for (const w of WIDTHS) {
    if (w > meta.width) continue;
    await sharp(src).resize({ width: w }).jpeg({ quality: 78, mozjpeg: true }).toFile(`${ROOT}/web/${p.slug}-${w}.jpg`);
    await sharp(src).resize({ width: w }).webp({ quality: 76 }).toFile(`${ROOT}/web/${p.slug}-${w}.webp`);
    p.web.push(w);
  }

  // Threshold crop — the photograph seen through the doorway.
  {
    const W = 900, H = 1140, r = W / 2;
    const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path d="${arch(0, 0, W, H)}" fill="#fff"/></svg>`;
    const photo = await sharp(src).resize({ width: W, height: H, fit: 'cover', position: 'attention' }).toBuffer();
    await sharp(photo)
      .composite([{ input: Buffer.from(maskSvg), blend: 'dest-in' }])
      .webp({ quality: 82, alphaQuality: 90 }).toFile(`${ROOT}/threshold/${p.slug}-arch.webp`);
  }
  report.push(p.slug);
}

// ---------------------------------------------------------------------------
//  Photo cards — the one layout where type sits on an image.
//  A scrim is not decoration here: Deep Ink at 86% takes any photograph below
//  the luminance where cream type clears 4.5:1.
// ---------------------------------------------------------------------------
async function photoCard(photo, { w, h, kicker, headline, footer, out }) {
  const pad = Math.round(w * 0.068);
  const base = await sharp(`${SRC}/${photo.file}`)
    .resize({ width: w, height: h, fit: 'cover', position: 'attention' }).toBuffer();

  const markH = Math.round(h * 0.062);
  const hSize = Math.round(Math.min(w * 0.062, h * 0.115));
  // Lay the text out from the bottom up so it can never collide with the mark.
  const markTop = h - pad - markH * 1.3;
  const kickSize = Math.round(w * 0.018);
  const probe = para(headline, { x: pad, y: 0, maxW: w - pad * 2, size: hSize, lh: 1.12, weight: 800, fill: C.cream });
  const headY = markTop - h * 0.055 - probe.height;
  const head = para(probe.lines, { x: pad, y: headY, maxW: w - pad * 2, size: hSize, lh: 1.12, weight: 800, fill: C.cream });
  const kick = para([kicker.toUpperCase()], { x: pad, y: headY - kickSize * 2.1, maxW: w - pad * 2, size: kickSize, weight: 700, fill: C.sunrise, track: 0.14 });
  const m = mark('horizontal', WAYS.reversed, { x: pad, y: h - pad - markH * 1.3, h: markH });
  const scrimTop = Math.max(0, Math.round(headY - kickSize * 3.1 - h * 0.12));
  const foot = para(footer, { x: w - pad, y: h - pad - markH * 1.3 + markH * 0.22, maxW: w * 0.45, size: Math.round(w * 0.0155), weight: 500, fill: '#D5DCE8', anchor: 'end' });

  const overlay = doc(w, h, `  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.ink}" stop-opacity="0"/>
      <stop offset="0.45" stop-color="${C.ink}" stop-opacity="0.72"/>
      <stop offset="1" stop-color="${C.ink}" stop-opacity="0.94"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="${C.ink}" opacity="0.22"/>
  <rect x="0" y="${scrimTop}" width="${w}" height="${h - scrimTop}" fill="url(#scrim)"/>
  <rect x="0" y="0" width="${w}" height="${Math.round(h * 0.016)}" fill="${C.sunrise}"/>
  ${kick.svg}\n  ${head.svg}\n  ${m.svg}\n  ${foot.svg}`, headline);

  await sharp(base)
    .composite([{ input: Buffer.from(outlineSvg(overlay)) }])
    .jpeg({ quality: 88, mozjpeg: true }).toFile(`${ROOT}/cards/${out}.jpg`);
  writeFileSync(`${ROOT}/cards/${out}.alt.txt`,
    `${photo.alt}\n\nOverlaid text: "${headline}"\n`);
}

await photoCard(PHOTOS[2], {
  w: 1200, h: 627, out: 'linkedin-1200x627-library',
  kicker: 'Volunteer educators', headline: 'You already know enough to teach someone else.',
  footer: 'humanfirst.ai/volunteer',
});
await photoCard(PHOTOS[3], {
  w: 1080, h: 1080, out: 'instagram-1080-farmer',
  kicker: 'Andes chapter', headline: 'A frost warning is worth more than a chatbot.',
  footer: 'humanfirst.ai',
});
await photoCard(PHOTOS[1], {
  w: 1584, h: 396, out: 'linkedin-banner-1584x396-hall',
  kicker: 'Human First AI', headline: 'The future belongs to all of us.',
  footer: 'humanfirst.ai',
});

// ---------------------------------------------------------------------------
//  Credits and provenance. This file is the gate: nothing ships without a row.
// ---------------------------------------------------------------------------
writeFileSync(`${ROOT}/credits.json`, JSON.stringify({
  note: 'Every photograph published under this brand needs a complete row here. '
      + 'Incomplete rows are not cleared for use. See docs/07-photography.md.',
  requiredFields: ['slug', 'photographer', 'origin', 'consent', 'licence', 'dateTaken', 'location'],
  photos: PHOTOS.map(p => ({
    slug: p.slug,
    file: `full/${p.slug}.jpg`,
    alt: p.alt,
    caption: p.caption,
    where: p.where,
    goodFor: p.use,
    photographer: 'UNKNOWN — inherited with the v1 package',
    origin: 'UNVERIFIED — confirm whether this is a commissioned photograph, a licensed library image, or synthetic',
    consent: 'NOT ON FILE',
    licence: 'NOT ON FILE',
    dateTaken: null,
    location: null,
    clearedForPublication: false,
  })),
}, null, 2));

writeFileSync(`${ROOT}/alt-text.md`, `# Alt text for the photography set

Written to the house formula: **who** + **what they are doing** + **where, and how it feels**.
Never "image of people". Never "photo of a workshop". Someone listening to this instead of
seeing it should end up with the same picture in their head.

${PHOTOS.map(p => `## ${p.slug}

- **Caption:** ${p.caption}
- **Alt text:** ${p.alt}
- **Where:** ${p.where}
- **Good for:** ${p.use}
`).join('\n')}
## Decorative images

If a photograph adds nothing a sighted reader would miss, give it \`alt=""\` so a screen
reader skips it. An empty alt on a decorative image is correct; a missing alt attribute
never is.
`);

console.log(`photography: ${report.length} images → full, ${WIDTHS.length} web widths (jpg+webp), arch crops, 3 photo cards, credits + alt text`);
