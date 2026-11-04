import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { renderPng, measure } from '../lib/type.mjs';
import { C, WAYS, BRAND } from '../lib/brand.mjs';
import { para, mark, arch, THEMES, doc, esc, wrap, fitSize } from '../lib/layout.mjs';

const ROOT = '../brand/templates';
for (const d of ['linkedin', 'instagram', 'whatsapp', 'x', 'newsletter', 'slides', 'print', 'email'])
  mkdirSync(`${ROOT}/${d}`, { recursive: true });

const out = [];
const save = async (dir, name, svg, { png = true, pngWidth } = {}) => {
  writeFileSync(`${ROOT}/${dir}/${name}.svg`, svg);
  if (png) {
    const w = pngWidth || +svg.match(/viewBox="0 0 ([\d.]+)/)[1];
    await renderPng(sharp, svg, { width: Math.round(w) }, `${ROOT}/${dir}/${name}.png`);
  }
  out.push(`${dir}/${name}`);
};

// ===========================================================================
//  STATEMENT CARD — one line, the whole point. The workhorse of the system.
// ===========================================================================
function statementCard(w, h, { theme = 'cream', headline, kicker, footer, arches = true }) {
  const t = THEMES[theme], pad = Math.round(w * 0.072);
  const colW = w - pad * 2;
  const hSize = Math.round(Math.min(w * 0.072, h * 0.13));
  let lines = wrap(headline, colW, hSize, 800);
  let size = hSize;
  while (lines.length > 4 && size > hSize * 0.6) { size -= 2; lines = wrap(headline, colW, size, 800); }

  const markH = Math.round(h * 0.062);
  const kickSize = Math.round(w * 0.0185);
  const blockH = (kicker ? kickSize * 2.6 : 0) + size + (lines.length - 1) * size * 1.1;
  const top = Math.round((h - blockH) / 2 - h * 0.035);

  const band = arches ? (() => {
    const n = 7, aw = w / n, ah = Math.round(h * 0.055);
    return Array.from({ length: n }, (_, i) =>
      `<path d="${arch(i * aw + aw * 0.14, h - ah, aw * 0.72, ah)}" fill="${t.accent}" opacity="${theme === 'ink' ? 0.9 : 0.14}"/>`).join('');
  })() : '';

  const k = kicker ? para(kicker.toUpperCase(), { x: pad, y: top, maxW: colW, size: kickSize, weight: 700, fill: t.accent, track: 0.14 }) : null;
  const head = para(lines, { x: pad, y: top + (kicker ? kickSize * 2.6 : 0), maxW: colW, size, lh: 1.1, weight: 800, fill: t.text });
  const m = mark('horizontal', WAYS[t.way], { x: pad, y: h - pad - markH * 1.6, h: markH });
  const f = footer ? para(footer, { x: w - pad, y: h - pad - markH * 1.6 + markH * 0.22, maxW: colW * 0.5, size: Math.round(w * 0.0165), weight: 500, fill: t.muted, anchor: 'end' }) : null;

  return doc(w, h, `  <rect width="${w}" height="${h}" fill="${t.bg}"/>
  ${band}
  ${k ? k.svg : ''}
  ${head.svg}
  ${m.svg}
  ${f ? f.svg : ''}`, `${BRAND.name} — ${headline}`);
}

// ===========================================================================
//  EVENT CARD — kicker, title, the four facts people need, one action.
// ===========================================================================
function eventCard(w, h, { theme = 'cream', kicker, title, facts, cta, free = true }) {
  const t = THEMES[theme], pad = Math.round(w * 0.072), colW = w - pad * 2;
  const tSize = Math.round(Math.min(w * 0.055, h * 0.105));
  let lines = wrap(title, colW, tSize, 800), size = tSize;
  while (lines.length > 3 && size > tSize * 0.62) { size -= 2; lines = wrap(title, colW, size, 800); }
  const kickSize = Math.round(w * 0.0175);
  let factSize = Math.round(w * 0.0225);

  let y = Math.round(h * 0.135);
  const k = para(kicker.toUpperCase(), { x: pad, y, maxW: colW, size: kickSize, weight: 700, fill: t.accent, track: 0.14 });
  y += kickSize * 2.5;
  const head = para(lines, { x: pad, y, maxW: colW, size, lh: 1.12, weight: 800, fill: t.text });
  y += head.height + h * 0.055;

  const markH0 = Math.round(h * 0.052), markTop = h - pad - markH0 * 1.5;
  const avail = markTop - h * 0.045 - y;
  let pitch = Math.min(factSize * 2.9, avail / facts.length);
  if (pitch < factSize * 1.55) factSize = Math.max(11, Math.floor(pitch / 1.55));
  const factRows = facts.map((f, i) => {
    const yy = y + i * pitch;
    return `<rect x="${pad}" y="${yy + factSize * 0.25}" width="4" height="${factSize * 1.1}" fill="${t.accent}"/>`
      + para(f, { x: pad + factSize * 0.9, y: yy, maxW: colW - factSize, size: factSize, weight: 500, family: 'readable', fill: t.text }).svg;
  }).join('\n  ');
  y += facts.length * pitch + h * 0.03;

  const badge = free ? (() => {
    const bw = Math.round(w * 0.2), bh = Math.round(factSize * 2.1), bx = w - pad - bw, by = Math.round(h * 0.17) - bh * 0.3;
    return `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${bh / 2}" fill="${C.sunrise}"/>`
      + para('FREE', { x: bx + bw / 2, y: by + bh * 0.22, maxW: bw, size: factSize, weight: 800, fill: C.ink, track: 0.1, anchor: 'middle' }).svg;
  })() : '';

  const markH = Math.round(h * 0.052);
  const m = mark('horizontal', WAYS[t.way], { x: pad, y: h - pad - markH * 1.5, h: markH });
  const c = para(cta, { x: w - pad, y: h - pad - markH * 1.5 + markH * 0.2, maxW: colW * 0.52, size: Math.round(w * 0.018), weight: 700, fill: t.accent, anchor: 'end' });

  return doc(w, h, `  <rect width="${w}" height="${h}" fill="${t.bg}"/>
  <rect x="0" y="0" width="${w}" height="${Math.round(h * 0.022)}" fill="${C.sunrise}"/>
  ${k.svg}
  ${badge}
  ${head.svg}
  ${factRows}
  ${m.svg}
  ${c.svg}`, `${BRAND.name} — ${title}`);
}

// ===========================================================================
//  STAT CARD — one number, one sentence.
// ===========================================================================
function statCard(w, h, { theme = 'ink', value, label, note }) {
  const t = THEMES[theme], pad = Math.round(w * 0.072);
  const vSize = fitSize(value, w - pad * 2, Math.round(h * 0.30), 800);
  const v = para(value, { x: pad, y: Math.round(h * 0.24), maxW: w - pad * 2, size: vSize, weight: 800, fill: t.accent });
  const l = para(label, { x: pad, y: Math.round(h * 0.24) + vSize * 1.18, maxW: w - pad * 2, size: Math.round(w * 0.038), lh: 1.2, weight: 700, fill: t.text });
  const n = note ? para(note, { x: pad, y: Math.round(h * 0.24) + vSize * 1.18 + l.height + h * 0.03, maxW: w - pad * 2, size: Math.round(w * 0.021), lh: 1.5, weight: 400, family: 'readable', fill: t.muted }) : null;
  const markH = Math.round(h * 0.055);
  const m = mark('horizontal', WAYS[t.way], { x: pad, y: h - pad - markH * 1.5, h: markH });
  return doc(w, h, `  <rect width="${w}" height="${h}" fill="${t.bg}"/>
  <path d="${arch(w * 0.60, h * 0.06, w * 0.46, h * 0.78)}" fill="${t.text}" opacity="0.05"/>
  ${v.svg}\n  ${l.svg}\n  ${n ? n.svg : ''}\n  ${m.svg}`, `${BRAND.name} — ${value} ${label}`);
}

// ===========================================================================
//  BANNERS
// ===========================================================================
function banner(w, h, { theme = 'ink', line }) {
  const t = THEMES[theme], pad = Math.round(h * 0.26);
  const markH = Math.round(h * 0.27);
  const m = mark('horizontal', WAYS[t.way], { x: pad, y: (h - markH) / 2, h: markH });
  const gap = pad * 1.25;
  const size = fitSize(line, w - m.width - pad * 2 - gap, Math.round(h * 0.17), 500);
  const lineW = measure(line, size, 500);
  const groupX = Math.max(pad, (w - (m.width + gap + lineW)) / 2);
  const m2 = mark('horizontal', WAYS[t.way], { x: groupX, y: (h - markH) / 2, h: markH });
  const l = para([line], { x: groupX + m.width + gap, y: (h - size * 1.1) / 2, maxW: lineW + 4, size, weight: 500, fill: t.muted });
  const n = 9, aw = w / n, ah = Math.round(h * 0.26);
  const band = Array.from({ length: n }, (_, i) =>
    `<path d="${arch(i * aw + aw * 0.22, h - ah, aw * 0.56, ah)}" fill="${t.text}" opacity="0.07"/>`).join('');
  const rule = Math.max(3, Math.round(h * 0.028));
  return doc(w, h, `  <rect width="${w}" height="${h}" fill="${t.bg}"/>\n  ${band}
  <rect x="0" y="${h - rule}" width="${w}" height="${rule}" fill="${C.sunrise}"/>\n  ${m.svg}\n  ${l.svg}`, `${BRAND.name} banner`);
}

// ===========================================================================
//  CAROUSEL — cover, body, closing. Same grid on every page.
// ===========================================================================
function carousel(w, h, page) {
  const t = THEMES[page.theme || 'cream'], pad = Math.round(w * 0.085), colW = w - pad * 2;
  const markH = Math.round(h * 0.040);
  const m = mark(page.kind === 'cover' ? 'stacked' : 'horizontal', WAYS[t.way],
    page.kind === 'cover' ? { x: pad, y: pad, h: Math.round(h * 0.11) } : { x: pad, y: h - pad - markH * 1.4, h: markH });

  let body = '';
  if (page.kind === 'cover') {
    const size = Math.round(w * 0.085);
    let lines = wrap(page.title, colW, size, 800), s = size;
    while (lines.length > 4 && s > size * 0.65) { s -= 3; lines = wrap(page.title, colW, s, 800); }
    const head = para(lines, { x: pad, y: Math.round(h * 0.40), maxW: colW, size: s, lh: 1.08, weight: 800, fill: t.text });
    const sub = para(page.sub, { x: pad, y: Math.round(h * 0.40) + head.height + h * 0.035, maxW: colW * 0.92, size: Math.round(w * 0.032), lh: 1.45, weight: 400, family: 'readable', fill: t.muted });
    const ax = pad + w * 0.145, ay = h - pad - w * 0.009, al = w * 0.05;
    body = head.svg + '\n  ' + sub.svg
      + `\n  <text x="${pad}" y="${h - pad}" font-family="Plus Jakarta Sans" font-size="${Math.round(w * 0.026)}" font-weight="700" fill="${t.accent}" letter-spacing="${w * 0.0036}">SWIPE</text>
  <g stroke="${t.accent}" stroke-width="${w * 0.0045}" stroke-linecap="round" stroke-linejoin="round" fill="none"><line x1="${ax}" y1="${ay}" x2="${ax + al}" y2="${ay}"/><polyline points="${ax + al - w * 0.016},${ay - w * 0.016} ${ax + al},${ay} ${ax + al - w * 0.016},${ay + w * 0.016}"/></g>`;
  } else if (page.kind === 'end') {
    const head = para(page.title, { x: pad, y: Math.round(h * 0.30), maxW: colW, size: Math.round(w * 0.07), lh: 1.12, weight: 800, fill: t.text });
    const sub = para(page.sub, { x: pad, y: Math.round(h * 0.30) + head.height + h * 0.04, maxW: colW * 0.9, size: Math.round(w * 0.032), lh: 1.5, weight: 400, family: 'readable', fill: t.muted });
    const bw = colW, bh = Math.round(h * 0.085), by = Math.round(h * 0.30) + head.height + h * 0.04 + sub.height + h * 0.05;
    body = head.svg + '\n  ' + sub.svg
      + `\n  <rect x="${pad}" y="${by}" width="${bw}" height="${bh}" rx="${Math.round(bh * 0.22)}" fill="${C.sunrise}"/>`
      + para(page.cta, { x: pad + bw / 2, y: by + bh * 0.28, maxW: bw, size: Math.round(w * 0.032), weight: 800, fill: C.ink, anchor: 'middle' }).svg;
  } else {
    const num = para(String(page.n).padStart(2, '0'), { x: pad, y: Math.round(h * 0.17), maxW: colW, size: Math.round(w * 0.055), weight: 800, fill: t.accent });
    const head = para(page.title, { x: pad, y: Math.round(h * 0.17) + h * 0.075, maxW: colW, size: Math.round(w * 0.062), lh: 1.14, weight: 800, fill: t.text });
    const bodyT = para(page.body, { x: pad, y: Math.round(h * 0.17) + h * 0.075 + head.height + h * 0.035, maxW: colW, size: Math.round(w * 0.031), lh: 1.6, weight: 400, family: 'readable', fill: t.text });
    body = num.svg + '\n  ' + head.svg + '\n  ' + bodyT.svg;
  }
  return doc(w, h, `  <rect width="${w}" height="${h}" fill="${t.bg}"/>
  <rect x="0" y="0" width="${w}" height="${Math.round(h * 0.014)}" fill="${C.sunrise}"/>
  ${body}\n  ${m.svg}`, `${BRAND.name} — ${page.title}`);
}

// ===========================================================================
//  SLIDES
// ===========================================================================
function slide(kind, { title, body, theme = 'cream', attribution }) {
  const w = 1920, h = 1080, t = THEMES[theme], pad = 130;
  const markH = 58;
  const m = mark('horizontal', WAYS[t.way], { x: pad, y: h - pad * 0.62 - markH, h: markH });
  if (kind === 'title') {
    const head = para(title, { x: pad, y: 330, maxW: w - pad * 2, size: 104, lh: 1.06, weight: 800, fill: t.text });
    const sub = para(body, { x: pad, y: 330 + head.height + 46, maxW: (w - pad * 2) * 0.76, size: 38, lh: 1.5, weight: 400, family: 'readable', fill: t.muted });
    return doc(w, h, `  <rect width="${w}" height="${h}" fill="${t.bg}"/>
  <path d="${arch(w * 0.68, -120, 620, 900)}" fill="${t.text}" opacity="0.045"/>
  ${head.svg}\n  ${sub.svg}\n  ${m.svg}`, title);
  }
  if (kind === 'quote') {
    const head = para(title, { x: pad, y: 300, maxW: w - pad * 2, size: 86, lh: 1.18, weight: 700, fill: t.text });
    const attr = para(attribution, { x: pad, y: 300 + head.height + 54, maxW: w - pad * 2, size: 32, weight: 600, fill: t.accent, track: 0.06 });
    return doc(w, h, `  <rect width="${w}" height="${h}" fill="${t.bg}"/>
  <rect x="${pad}" y="200" width="7" height="${head.height + 40}" fill="${C.sunrise}"/>
  <g transform="translate(26,0)">${head.svg}\n  ${attr.svg}</g>\n  ${m.svg}`, title);
  }
  const head = para(title, { x: pad, y: 190, maxW: w - pad * 2, size: 72, lh: 1.14, weight: 800, fill: t.text });
  const bullets = body.map((b, i) => {
    const yy = 190 + head.height + 80 + i * 110;
    return `<circle cx="${pad + 14}" cy="${yy + 26}" r="9" fill="${C.sunrise}"/>`
      + para(b, { x: pad + 54, y: yy, maxW: w - pad * 2 - 54, size: 40, lh: 1.4, weight: 400, family: 'readable', fill: t.text }).svg;
  }).join('\n  ');
  return doc(w, h, `  <rect width="${w}" height="${h}" fill="${t.bg}"/>
  <rect x="0" y="0" width="${w}" height="14" fill="${C.sunrise}"/>
  ${head.svg}\n  ${bullets}\n  ${m.svg}`, title);
}

// ===========================================================================
//  BUILD
// ===========================================================================
const PROMISE = BRAND.promise;
const HANDLE = 'humanfirst.ai  ·  @HumanFirstAI';

// --- LinkedIn -------------------------------------------------------------
await save('linkedin', 'post-1200x627-statement', statementCard(1200, 627, {
  theme: 'cream', kicker: 'Plain English AI', headline: 'You do not need a computer science degree to use this.', footer: HANDLE }));
await save('linkedin', 'post-1200x627-statement-ink', statementCard(1200, 627, {
  theme: 'ink', kicker: 'The movement', headline: PROMISE, footer: HANDLE }));
await save('linkedin', 'post-1200x1200-square', statementCard(1200, 1200, {
  theme: 'cream', kicker: 'Open door, not a locked lab', headline: 'AI is a tool, not a secret club.', footer: HANDLE }));
await save('linkedin', 'post-1200x627-event', eventCard(1200, 627, {
  theme: 'cream', kicker: 'Community learning series · all ages welcome',
  title: 'AI in real life: a free hands-on workshop',
  facts: ['Saturday 7 November, 10:00–12:30', 'St Jude Community Library, Room 4 — step-free access',
    'Tablets, notebooks and tea provided', 'No experience needed. Bring a friend.'],
  cta: 'Text your name to 0712 345 678' }));
await save('linkedin', 'post-1200x1200-stat', statCard(1200, 1200, {
  theme: 'ink', value: '140,000', label: 'neighbours have sat down with us so far',
  note: 'Across 38 chapters, in 21 languages, in libraries, market halls and community centres. Every session free, every time.' }));
await save('linkedin', 'banner-personal-1584x396', banner(1584, 396, { theme: 'ink', line: PROMISE }));
await save('linkedin', 'banner-page-1128x191', banner(1128, 191, { theme: 'ink', line: 'AI for everyone. Opportunity for all.' }));

const CAROUSEL = [
  { kind: 'cover', theme: 'ink', title: 'Five things AI can do for a small business this week', sub: 'No jargon. No subscription. Just the five we teach first in every workshop.' },
  { kind: 'body', n: 1, title: 'Write the letter you have been putting off', body: 'Describe what you need in your own words — "a polite letter asking the landlord to fix the roof" — and ask for it in plain language. Then read it and change anything that does not sound like you.' },
  { kind: 'body', n: 2, title: 'Turn a pile of receipts into a list', body: 'Photograph them, ask for a simple table of date, item and amount. Check the numbers yourself. It is a fast assistant, not an accountant.' },
  { kind: 'body', n: 3, title: 'Explain something in your customer’s language', body: 'Ask for the same message in Swahili, Spanish or Hindi. Have a speaker read it before you send it. Machines get tone wrong more often than words.' },
  { kind: 'body', n: 4, title: 'Practise a difficult conversation', body: 'Ask it to play the supplier who keeps raising prices, then rehearse. You keep the decision. It just gives you a wall to practise against.' },
  { kind: 'body', n: 5, title: 'Check what you do not know', body: 'Ask what questions you should be asking. Then go and ask a human being who actually knows. This is the step most people skip.' },
  { kind: 'end', theme: 'ink', title: 'Come and try it with us', sub: 'Free weekend workshops in 38 cities. We bring the tablets. You bring a question.', cta: 'humanfirst.ai/workshops' },
];
for (const [i, p] of CAROUSEL.entries())
  await save('linkedin', `carousel-1080x1350-${String(i + 1).padStart(2, '0')}-${p.kind}`, carousel(1080, 1350, p));

// --- Instagram / WhatsApp / X --------------------------------------------
await save('instagram', 'square-1080-statement', statementCard(1080, 1080, {
  theme: 'cream', kicker: 'Plain English AI', headline: 'No computer science degree required.', footer: HANDLE }));
await save('instagram', 'square-1080-statement-ink', statementCard(1080, 1080, {
  theme: 'ink', kicker: 'Our promise', headline: PROMISE, footer: HANDLE }));
await save('instagram', 'story-1080x1920', statementCard(1080, 1920, {
  theme: 'ink', kicker: 'This Saturday', headline: 'Free AI workshop at your local library.', footer: 'Link in bio' }));
await save('whatsapp', 'event-1080x1080', eventCard(1080, 1080, {
  theme: 'paper', kicker: 'Free workshop · everyone welcome',
  title: 'Learn what AI actually does',
  facts: ['Saturday 7 November, 10:00', 'St Jude Community Library', 'Tea and snacks provided', 'Bring a friend — no booking needed'],
  cta: 'Forward this to one neighbour' }));
await save('x', 'card-1600x900', statementCard(1600, 900, {
  theme: 'cream', kicker: 'Human First AI', headline: 'Make AI feel like an open door, not a locked lab.', footer: HANDLE }));

// --- Newsletter (Substack, Beehiiv, Ghost, Mailchimp) ---------------------
await save('newsletter', 'header-1456x600', statementCard(1456, 600, {
  theme: 'ink', kicker: 'The Open Door · monthly letter', headline: 'What we learned in the room this month.', footer: HANDLE, arches: false }));
await save('newsletter', 'social-preview-1200x600', statementCard(1200, 600, {
  theme: 'cream', kicker: 'The Open Door', headline: 'AI for everyone. Opportunity for all.', footer: HANDLE }));
await save('newsletter', 'section-divider-1456x180', banner(1456, 180, { theme: 'cream', line: 'The Open Door' }));

// --- Slides ---------------------------------------------------------------
await save('slides', '16x9-title', slide('title', {
  title: 'AI in real life', body: 'A two-hour workshop. No jargon, no slides full of code, no one left behind.' }));
await save('slides', '16x9-title-dark', slide('title', {
  theme: 'ink', title: 'AI in real life', body: 'Dark build for community halls where the projector is tired and the room is bright.' }));
await save('slides', '16x9-content', slide('content', {
  title: 'What we will do in the next two hours', body: [
    'Find out what AI actually is — and what it is not',
    'Write a letter, a flyer and a price list together',
    'Learn how to spot something that is made up',
    'Leave with three things you can use on Monday'] }));
await save('slides', '16x9-content-dark', slide('content', {
  theme: 'ink', title: 'Four things to remember', body: [
    'It is a tool. You are the one deciding.',
    'It is confidently wrong sometimes. Check it.',
    'Never type anything you would not post on a noticeboard.',
    'If it cannot be explained plainly, ask again.'] }));
await save('slides', '16x9-quote', slide('quote', {
  theme: 'ink', title: '“I thought this was for young people. I wrote my first letter today.”',
  attribution: 'AMINA, 62 · LAGOS CHAPTER' }));

// --- Email signature ------------------------------------------------------
writeFileSync(`${ROOT}/email/signature.html`, `<!-- Human First AI email signature.
     Paste into Gmail / Outlook signature settings. Replace the five {{...}} fields.
     Host the logo somewhere public and point the <img> src at it — most mail clients
     strip inline SVG, so a PNG URL is the only thing that reliably survives. -->
<table cellpadding="0" cellspacing="0" border="0" style="font-family:'Plus Jakarta Sans',Helvetica,Arial,sans-serif;font-size:14px;color:${C.ink};line-height:1.5">
  <tr>
    <td style="padding-right:18px;border-right:2px solid ${C.sunrise};vertical-align:top">
      <img src="{{LOGO_URL}}/hfai-stacked-full-600w.png" width="112" height="45" alt="Human First AI"
           style="display:block;border:0;outline:none">
    </td>
    <td style="padding-left:18px;vertical-align:top">
      <div style="font-weight:800;font-size:15px;color:${C.ink}">{{NAME}}</div>
      <div style="font-weight:500;color:#68728A">{{ROLE}} · Human First AI {{CHAPTER}}</div>
      <div style="padding-top:6px">
        <a href="mailto:{{EMAIL}}" style="color:#C24D00;text-decoration:none">{{EMAIL}}</a>
        <span style="color:#68728A"> · </span>
        <a href="https://humanfirst.ai" style="color:#C24D00;text-decoration:none">humanfirst.ai</a>
      </div>
      <div style="padding-top:8px;font-size:13px;color:#68728A">${BRAND.promise}</div>
    </td>
  </tr>
</table>
`);
out.push('email/signature.html');

console.log(`templates: ${out.length} files`);
console.log(out.map(o => '  ' + o).join('\n'));
