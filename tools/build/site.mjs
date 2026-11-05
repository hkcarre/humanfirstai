import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, existsSync } from 'node:fs';
import { renderPng } from '../lib/type.mjs';
import { C, BRAND, WAYS } from '../lib/brand.mjs';
import { lockup } from '../lib/lockup.mjs';
import { para, mark, arch, THEMES, doc } from '../lib/layout.mjs';

const ROOT = '../site';
const OUT = `${ROOT}/dist`;
for (const d of ['', '/assets', '/assets/fonts', '/articles']) mkdirSync(`${OUT}${d}`, { recursive: true });

// ===========================================================================
//  A very small Markdown subset. We author the content, so we only support
//  what we use — and we get to control the exact semantic HTML that comes
//  out, which matters more here than feature coverage.
//
//    # h1        ## h2        ### h3
//    > pull quote (consecutive lines join)
//    - list item
//    ```dialogue   Speaker: line
//    **bold**  *italic*  `code`  [text](url)
// ===========================================================================
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = s => esc(s)
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
  .replace(/`([^`]+)`/g, '<code>$1</code>');

function frontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return [{}, src];
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if (v.startsWith('[') && v.endsWith(']')) v = v.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
    meta[k] = v;
  }
  return [meta, src.slice(m[0].length)];
}

function markdown(src) {
  const lines = src.split('\n');
  const out = [];
  let i = 0, section = 0;
  const flushList = buf => buf.length ? `<ul>${buf.map(t => `<li>${inline(t)}</li>`).join('')}</ul>` : '';

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    // fenced dialogue
    if (line.startsWith('```dialogue')) {
      const rows = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        const at = lines[i].indexOf(':');
        if (at > 0) rows.push([lines[i].slice(0, at).trim(), lines[i].slice(at + 1).trim()]);
        i++;
      }
      i++;
      out.push(`<div class="dialogue" role="group" aria-label="An exchange between a leader and an employee">`
        + rows.map(([who, what]) =>
            `<p class="turn"><span class="who">${esc(who)}</span><span class="said">&ldquo;${esc(what)}&rdquo;</span></p>`).join('')
        + `</div>`);
      continue;
    }

    // headings
    let m;
    if ((m = line.match(/^###\s+(.*)$/))) { out.push(`<h3>${inline(m[1])}</h3>`); i++; continue; }
    if ((m = line.match(/^##\s+(.*)$/))) {
      section++;
      const raw = m[1];
      const num = raw.match(/^(\d+)\s*·\s*(.*)$/);
      const id = (num ? num[2] : raw).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      out.push(`<h2 id="${id}">`
        + (num ? `<span class="sec-num" aria-hidden="true">${num[1]}</span>` : '')
        + `<span class="sec-text">${inline(num ? num[2] : raw)}</span></h2>`);
      i++; continue;
    }
    if ((m = line.match(/^#\s+(.*)$/))) { out.push(`<h1>${inline(m[1])}</h1>`); i++; continue; }

    // pull quote
    if (line.startsWith('> ')) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith('> ')) { buf.push(lines[i].slice(2)); i++; }
      out.push(`<blockquote><p>${inline(buf.join(' '))}</p></blockquote>`);
      continue;
    }

    // list
    if (line.startsWith('- ')) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith('- ')) { buf.push(lines[i].slice(2)); i++; }
      out.push(flushList(buf));
      continue;
    }

    // paragraph
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|>\s|-\s|```)/.test(lines[i])) { buf.push(lines[i].trim()); i++; }
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return { html: out.join('\n      '), sections: section };
}

// ---------------------------------------------------------------- the page
const CSS = `
/* Human First AI — article template.
   Colour and type come from the generated brand tokens. Nothing is redefined here. */
@import url("assets/tokens.css");
@import url("assets/type.css");
@import url("assets/fonts.css");

*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } *, *::before, *::after { animation: none !important; transition: none !important; } }

body {
  margin: 0;
  background: var(--hf-surface);
  color: var(--hf-text);
  font-family: var(--hf-font-readable);
  font-size: var(--hf-size-body);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

/* The brand ships a reversed theme. Honour the reader's system setting. */
@media (prefers-color-scheme: dark) {
  :root:not([data-force="light"]) {
    --hf-surface: #1F2A44; --hf-surface-raised: #2A3754;
    --hf-text: #FFF6EC; --hf-text-muted: #A8B3C9;
    --hf-text-accent: #FF8A3D; --hf-text-link: #7CC4F2;
    --hf-border: #3C4A6B; --hf-focus-ring: #FF8A3D;
  }
}

.skip {
  position: absolute; left: -9999px; top: 0; z-index: 100;
  background: var(--hf-ink); color: var(--hf-cream);
  padding: 12px 20px; border-radius: 0 0 var(--hf-radius) 0; font-family: var(--hf-font-brand); font-weight: 700;
}
.skip:focus { left: 0; }

.wrap { width: min(100% - 2.5rem, 38rem); margin-inline: auto; }
.hero .wrap, .closing .wrap { width: min(100% - 2.5rem, 44rem); }
.wide { width: min(100% - 2.5rem, 64rem); margin-inline: auto; }

/* ---- progress ---- */
.progress { position: fixed; inset: 0 0 auto 0; height: 4px; background: transparent; z-index: 50; }
.progress > i { display: block; height: 100%; width: 0; background: var(--hf-sunrise); }

/* ---- masthead ---- */
.masthead { border-bottom: 1px solid var(--hf-border); }
.masthead .wide { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; padding: 1.15rem 0; }
.masthead a { display: inline-flex; align-items: center; text-decoration: none; }
.masthead svg { height: 30px; width: auto; display: block; }
.masthead .only-dark { display: none; }
@media (prefers-color-scheme: dark) {
  :root:not([data-force="light"]) .masthead .only-light { display: none; }
  :root:not([data-force="light"]) .masthead .only-dark { display: block; }
  :root:not([data-force="light"]) .colonnade { opacity: 0.3; }
}
.masthead .back {
  font-family: var(--hf-font-brand); font-weight: 600; font-size: 0.875rem;
  color: var(--hf-text-muted); text-decoration: none;
}
.masthead .back:hover { color: var(--hf-text-accent); }

/* ---- hero ---- */
.hero { padding: clamp(3rem, 7vw, 5.5rem) 0 clamp(1.75rem, 3.5vw, 2.5rem); }
.colonnade { height: 58px; opacity: 0.16; color: var(--hf-sunrise); }
.colonnade svg { width: 100%; height: 100%; display: block; }
.kicker {
  font-family: var(--hf-font-brand); font-weight: 700; font-size: 0.8125rem;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--hf-text-accent); margin: 0 0 1.1rem;
}
h1 {
  font-family: var(--hf-font-brand); font-weight: 800;
  font-size: clamp(2.3rem, 6.2vw, 3.9rem); line-height: 1.04; letter-spacing: -0.03em;
  margin: 0 0 0.7rem; text-wrap: balance;
}
.subtitle {
  font-family: var(--hf-font-brand); font-weight: 500;
  font-size: clamp(1.25rem, 3vw, 1.75rem); line-height: 1.25; letter-spacing: -0.02em;
  color: var(--hf-text-muted); margin: 0 0 1.75rem; text-wrap: balance;
}
.standfirst { font-size: clamp(1.1rem, 2.3vw, 1.3rem); line-height: 1.6; margin: 0 0 2rem; max-width: 40ch; }
.meta {
  display: flex; flex-wrap: wrap; gap: 0.55rem 1rem; align-items: center;
  font-family: var(--hf-font-brand); font-weight: 600; font-size: 0.875rem; color: var(--hf-text-muted);
  padding-top: 1.5rem; border-top: 2px solid var(--hf-text);
}
.meta .dot { color: var(--hf-border); }

/* ---- listen ---- */
.listen {
  display: flex; flex-wrap: wrap; align-items: center; gap: .85rem 1.25rem;
  margin: 1.75rem 0 0; padding: 1rem 1.15rem;
  background: var(--hf-surface-raised); border: 1px solid var(--hf-border); border-radius: var(--hf-radius);
}
.listen audio { height: 40px; flex: 1 1 260px; min-width: 0; }
.listen .lab { font-family: var(--hf-font-brand); font-weight: 700; font-size: .8125rem; letter-spacing: .1em; text-transform: uppercase; color: var(--hf-text-accent); }
.listen .sub { flex: 1 1 100%; font-size: .8125rem; color: var(--hf-text-muted); margin: 0; }

/* ---- body ---- */
article { padding: clamp(2rem, 5vw, 3.5rem) 0 1rem; }
article p { margin: 0 0 1.45rem; }
article > .wrap > p:first-of-type { font-size: 1.1em; }
h2 {
  font-family: var(--hf-font-brand); font-weight: 800;
  font-size: clamp(1.6rem, 3.6vw, 2.15rem); line-height: 1.18; letter-spacing: -0.02em;
  margin: 3.5rem 0 1.4rem; display: flex; gap: 1rem; align-items: baseline; text-wrap: balance;
  scroll-margin-top: 2rem;
}
.sec-num {
  font-size: 0.78em; color: var(--hf-text-accent); font-variant-numeric: tabular-nums;
  flex: none; position: relative; top: -0.05em;
}
h3 {
  font-family: var(--hf-font-brand); font-weight: 700;
  font-size: clamp(1.15rem, 2.4vw, 1.4rem); line-height: 1.3; letter-spacing: -0.015em;
  margin: 2.4rem 0 1rem;
}
article ul { margin: 0 0 1.6rem; padding: 0; list-style: none; }
article li { position: relative; padding-left: 1.6rem; margin-bottom: 0.6rem; }
article li::before {
  content: ""; position: absolute; left: 0; top: 0.62em;
  width: 8px; height: 8px; border-radius: 50%; background: var(--hf-sunrise);
}
article a { color: var(--hf-text-link); text-underline-offset: 3px; }

/* Pull quote — the Open Threshold rule, in the brand's own 30-degree language */
blockquote {
  margin: 2.6rem 0; padding: 0.15rem 0 0.15rem 1.75rem;
  border-left: 5px solid var(--hf-sunrise);
}
blockquote p {
  font-family: var(--hf-font-brand); font-weight: 700;
  font-size: clamp(1.3rem, 3vw, 1.7rem); line-height: 1.3; letter-spacing: -0.02em;
  margin: 0; text-wrap: balance;
}

/* Dialogue */
.dialogue {
  margin: 2.4rem 0; padding: 1.6rem 1.75rem 0.9rem;
  background: var(--hf-surface-raised); border: 1px solid var(--hf-border);
  border-radius: var(--hf-radius);
}
.dialogue .turn { display: grid; grid-template-columns: 5.6rem 1fr; gap: 0 1rem; margin: 0 0 1.05rem; align-items: baseline; }
.dialogue .who {
  font-family: var(--hf-font-brand); font-weight: 700; font-size: 0.75rem;
  letter-spacing: 0.1em; text-transform: uppercase; color: var(--hf-text-accent);
  padding-top: 0.32em;
}
.dialogue .said { font-style: italic; }
@media (max-width: 34rem) { .dialogue .turn { grid-template-columns: 1fr; gap: 0.15rem; } .dialogue .who { padding-top: 0; } }

/* ---- closing ---- */
.closing { background: var(--hf-ink); color: var(--hf-cream); margin-top: 4rem; padding: clamp(3rem, 6vw, 4.5rem) 0; }
.closing .wrap { text-align: left; }
.closing p.line {
  font-family: var(--hf-font-brand); font-weight: 800;
  font-size: clamp(1.5rem, 3.6vw, 2.1rem); line-height: 1.2; letter-spacing: -0.02em;
  margin: 0 0 1rem; text-wrap: balance;
}
.closing p.sub { color: #A8B3C9; margin: 0 0 2rem; max-width: 46ch; }
.closing svg { height: 34px; width: auto; display: block; }
.cta {
  display: inline-block; background: var(--hf-sunrise); color: var(--hf-ink);
  font-family: var(--hf-font-brand); font-weight: 800; font-size: 1rem;
  padding: 0.85rem 1.5rem; border-radius: var(--hf-radius); text-decoration: none;
}
.cta:hover { filter: brightness(1.06); }

/* ---- tags + footer ---- */
.tags { display: flex; flex-wrap: wrap; gap: 0.5rem 1.1rem; padding: 2.5rem 0 0; border-top: 1px solid var(--hf-border); margin-top: 3rem; }
.tags span { font-family: var(--hf-font-brand); font-weight: 600; font-size: 0.875rem; color: var(--hf-text-muted); }
footer { padding: 2.5rem 0 4rem; font-size: 0.875rem; color: var(--hf-text-muted); }
footer .wide { display: flex; flex-wrap: wrap; gap: 1rem 2rem; align-items: center; justify-content: space-between; }
footer a { color: var(--hf-text-muted); }

@media print {
  .progress, .masthead, .closing .cta { display: none; }
  body { background: #fff; color: #000; font-size: 11pt; }
  .colonnade { display: none; }
}
`;

const colonnadeSvg = (() => {
  const n = 9, w = 1200, h = 96, aw = w / n;
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true" focusable="false">`
    + Array.from({ length: n }, (_, i) => `<path d="${arch(i * aw + aw * 0.18, 0, aw * 0.64, h)}" fill="currentColor"/>`).join('')
    + `</svg>`;
})();

const stripSvg = s => s.replace(/^[\s\S]*?<title>[\s\S]*?<\/title>/, '').replace(/<\/svg>\s*$/, '');
const inlineLockup = (kind, way, cls = '') => {
  const svg = lockup(kind, WAYS[way]);
  const [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
  return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" aria-hidden="true" focusable="false">${stripSvg(svg)}</svg>`;
};

function page(meta, bodyHtml, slug) {
  // Narration, if it has been generated. preload="none" so it costs a reader
  // on a slow connection nothing at all unless they ask for it.
  let audio = '';
  if (existsSync(`${OUT}/articles/${slug}.mp3`)) {
    const info = JSON.parse(readFileSync(`${OUT}/articles/${slug}.audio.json`, 'utf8'));
    const mins = Math.round(info.seconds / 60);
    audio = `<div class="listen">
      <span class="lab">Listen &middot; ${mins} min</span>
      <audio controls preload="none" src="${slug}.mp3" aria-label="Listen to this article, ${mins} minutes, read by a synthetic voice"></audio>
      <p class="sub">Read by a synthetic voice (<a href="https://huggingface.co/hexgrad/Kokoro-82M">Kokoro-82M</a>,
      generated locally, no tracking). It is reading the words below, nobody else's.</p>
    </div>`;
  }
  const url = `https://hkcarre.github.io/humanfirstai/articles/${slug}.html`;
  const tags = Array.isArray(meta.tags) ? meta.tags : [];
  const date = new Date(meta.date + 'T00:00:00Z');
  const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const desc = meta.standfirst;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)} — ${esc(BRAND.name)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="${C.ink}">
<link rel="canonical" href="${url}">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(meta.title)}: ${esc(meta.subtitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="https://hkcarre.github.io/humanfirstai/articles/${slug}-og.png">
<meta property="og:url" content="${url}">
<meta property="article:published_time" content="${meta.date}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'Article',
  headline: `${meta.title}: ${meta.subtitle}`, description: desc,
  datePublished: meta.date, publisher: { '@type': 'Organization', name: BRAND.name },
  image: `https://hkcarre.github.io/humanfirstai/articles/${slug}-og.png`,
  mainEntityOfPage: url,
}, null, 2)}
</script>
<link rel="stylesheet" href="../article.css">
</head>
<body>
<a class="skip" href="#article">Skip to the article</a>
<div class="progress" aria-hidden="true"><i id="bar"></i></div>

<header class="masthead">
  <div class="wide">
    <a href="../index.html" aria-label="Human First AI — home">${inlineLockup('horizontal', 'full', 'only-light')}${inlineLockup('horizontal', 'reversed', 'only-dark')}</a>
    <a class="back" href="https://github.com/hkcarre/humanfirstai">Brand system &rarr;</a>
  </div>
</header>

<div class="hero">
  <div class="wrap">
    <p class="kicker">${esc(meta.kicker)}</p>
    <h1>${esc(meta.title)}</h1>
    <p class="subtitle">${esc(meta.subtitle)}</p>
    <p class="standfirst">${esc(meta.standfirst)}</p>
    <p class="meta">
      <span>${esc(BRAND.name)}</span><span class="dot">&middot;</span>
      <time datetime="${meta.date}">${dateStr}</time><span class="dot">&middot;</span>
      <span>${meta.readingTime} min read</span>
    </p>
    ${audio}
  </div>
</div>
<div class="colonnade" aria-hidden="true">${colonnadeSvg}</div>

<article id="article">
  <div class="wrap">
      ${bodyHtml}
    <p class="tags">${tags.map(t => `<span>#${t.replace(/\s+/g, '')}</span>`).join('')}</p>
  </div>
</article>

<section class="closing">
  <div class="wrap">
    <p class="line">${esc(BRAND.promise)}</p>
    <p class="sub">Human First AI runs free workshops that help people use AI in real life &mdash;
      in libraries, market halls and community centres, in their own language.</p>
    <p><a class="cta" href="https://github.com/hkcarre/humanfirstai">See the brand system</a></p>
    <p style="margin-top:2.5rem">${inlineLockup('horizontal', 'reversed')}</p>
  </div>
</section>

<footer>
  <div class="wide">
    <span>&copy; ${date.getUTCFullYear()} ${esc(BRAND.name)} &middot; CC BY-NC 4.0</span>
    <span>Set in Plus Jakarta Sans and <a href="https://www.brailleinstitute.org/freefont/">Atkinson Hyperlegible</a></span>
  </div>
</footer>

<script>
(function () {
  var bar = document.getElementById('bar');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!bar || reduce) return;
  var tick = false;
  function update() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + '%';
    tick = false;
  }
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();
</script>
</body>
</html>
`;
}

// --------------------------------------------------------------- index page
function indexPage(articles) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Writing — ${esc(BRAND.name)}</title>
<meta name="description" content="${esc(BRAND.oneLiner)}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="${C.ink}">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="article.css">
<style>
  .list { padding: clamp(2rem,5vw,4rem) 0 4rem; }
  .entry { display: block; text-decoration: none; color: inherit; padding: 2rem 0; border-bottom: 1px solid var(--hf-border); }
  .entry:hover h2 { color: var(--hf-text-accent); }
  .entry h2 { display: block; margin: 0.5rem 0 0.4rem; font-size: clamp(1.5rem,3.4vw,2.1rem); }
  .entry p { margin: 0 0 0.6rem; color: var(--hf-text-muted); max-width: 52ch; }
  .entry .meta { border: 0; padding: 0; }
</style>
</head>
<body>
<a class="skip" href="#list">Skip to the writing</a>
<header class="masthead">
  <div class="wide">
    <a href="index.html" aria-label="Human First AI — home">${inlineLockup('horizontal', 'full', 'only-light')}${inlineLockup('horizontal', 'reversed', 'only-dark')}</a>
    <a class="back" href="https://github.com/hkcarre/humanfirstai">Brand system &rarr;</a>
  </div>
</header>
<div class="hero">
  <div class="wrap">
    <p class="kicker">Writing</p>
    <h1>${esc(BRAND.oneLiner)}</h1>
    <p class="standfirst">Longer pieces from the movement. Every page on this site is built from the
      brand system in the repository &mdash; same tokens, same type scale, same accessibility floor.</p>
  </div>
</div>
<div class="colonnade" aria-hidden="true">${colonnadeSvg}</div>
<main class="list" id="list">
  <div class="wrap">
    <a class="entry" href="voices.html">
      <p class="kicker">Narration</p>
      <h2>Choosing a narrator</h2>
      <p>Seven candidate voices reading the same three lines, so you can pick with your ears
         instead of from a table. Generated locally with Kokoro, Apache-2.0.</p>
      <p class="meta"><span>Audio</span><span class="dot">&middot;</span><span>7 samples</span></p>
    </a>
    <a class="entry" href="showcase.html">
      <p class="kicker">Showcase</p>
      <h2>An open door, in three dimensions</h2>
      <p>Walk through the mark itself, then find the thirty-eight chapters on a halftone globe.
         Spatial depth and physical craft, built from the same tokens as everything else.</p>
      <p class="meta"><span>Interactive</span><span class="dot">&middot;</span><span>Best with sound off and a scroll wheel</span></p>
    </a>
    ${articles.map(a => `<a class="entry" href="articles/${a.slug}.html">
      <p class="kicker">${esc(a.meta.kicker)}</p>
      <h2>${esc(a.meta.title)}: ${esc(a.meta.subtitle)}</h2>
      <p>${esc(a.meta.standfirst)}</p>
      <p class="meta"><time datetime="${a.meta.date}">${new Date(a.meta.date + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</time><span class="dot">&middot;</span><span>${a.meta.readingTime} min read</span></p>
    </a>`).join('\n    ')}
  </div>
</main>
<footer>
  <div class="wide">
    <span>&copy; 2026 ${esc(BRAND.name)} &middot; CC BY-NC 4.0</span>
    <span><a href="https://github.com/hkcarre/humanfirstai">github.com/hkcarre/humanfirstai</a></span>
  </div>
</footer>
</body>
</html>
`;
}

// ------------------------------------------------------------------- build
writeFileSync(`${OUT}/article.css`, CSS);
for (const f of ['../brand/color/tokens.css', '../brand/type/type.css', '../brand/type/fonts.css'])
  copyFileSync(f, `${OUT}/assets/${f.split('/').pop()}`);
copyFileSync('../brand/logo/favicon/favicon.svg', `${OUT}/assets/favicon.svg`);
for (const f of readdirSync('../brand/type/fonts')) copyFileSync(`../brand/type/fonts/${f}`, `${OUT}/assets/fonts/${f}`);
// fonts.css points at fonts/… relative to itself, which already matches assets/fonts/.

const articles = [];
for (const file of readdirSync(`${ROOT}/content`).filter(f => f.endsWith('.md')).sort()) {
  const slug = file.replace(/\.md$/, '');
  const [meta, body] = frontmatter(readFileSync(`${ROOT}/content/${file}`, 'utf8'));
  const { html, sections } = markdown(body);
  writeFileSync(`${OUT}/articles/${slug}.html`, page(meta, html, slug));

  // Social preview card, from the same template system as every other asset.
  const og = (() => {
    const w = 1200, h = 627, t = THEMES.ink, pad = Math.round(w * 0.072);
    const head = para(`${meta.title}: ${meta.subtitle}`, { x: pad, y: 0, maxW: w - pad * 2, size: 60, lh: 1.1, weight: 800, fill: t.text });
    const top = Math.round((h - head.height) / 2 - h * 0.03);
    const placed = para(head.lines, { x: pad, y: top, maxW: w - pad * 2, size: 60, lh: 1.1, weight: 800, fill: t.text });
    const kick = para([meta.kicker.toUpperCase()], { x: pad, y: top - 58, maxW: w - pad * 2, size: 22, weight: 700, fill: C.sunrise, track: 0.14 });
    const m = mark('horizontal', WAYS.reversed, { x: pad, y: h - pad - 38 * 1.6, h: 38 });
    const n = 7, aw = w / n, ah = 36;
    const band = Array.from({ length: n }, (_, i) => `<path d="${arch(i * aw + aw * 0.14, h - ah, aw * 0.72, ah)}" fill="${C.sunrise}" opacity="0.9"/>`).join('');
    return doc(w, h, `  <rect width="${w}" height="${h}" fill="${t.bg}"/>\n  ${band}\n  ${kick.svg}\n  ${placed.svg}\n  ${m.svg}`, meta.title);
  })();
  await renderPng(sharp, og, { width: 1200 }, `${OUT}/articles/${slug}-og.png`);

  articles.push({ slug, meta, sections });
  console.log(`  ${slug}.html  (${sections} sections) + og card`);
}

writeFileSync(`${OUT}/index.html`, indexPage(articles));
writeFileSync(`${OUT}/.nojekyll`, '');
writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\n`);
console.log(`site: ${articles.length} article(s) -> site/dist/`);
