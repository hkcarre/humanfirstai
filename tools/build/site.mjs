import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, existsSync } from 'node:fs';
import { renderPng } from '../lib/type.mjs';
import { C, BRAND, WAYS } from '../lib/brand.mjs';
import { lockup } from '../lib/lockup.mjs';
import { para, mark, arch, THEMES, doc } from '../lib/layout.mjs';
import { FIGURES, FIGURE_CSS, FIGURE_JS } from '../lib/figures.mjs';

const ROOT = '../site';
const OUT = `${ROOT}/dist`;

// Images an article asks for that are not in the repository. They render as a
// labelled empty slot rather than a broken <img>, and the build prints them.
// Our own rule: a photograph of a real person ships only with provenance and
// consent recorded, and we never fill the gap with a generated face.
const MISSING = new Set();

// src -> srcset string, for photographs wide enough to be worth two sizes.
const SRCSET = new Map();

// Video assets an article asks for, and the ones shipping without captions.
// Our own checklist says "captions on video, transcripts on audio", so a video
// with none is reported at every build rather than noticed a month later.
const VIDEOS = new Set();
const NO_CAPTIONS = new Set();

/** Copy an article image next to the page, optimised, with a 800w companion
 *  for anything wide. Returns false if the file is not in the repository. */
async function placeImage(src) {
  const from = `${ROOT}/content/${src}`;
  if (!existsSync(from)) { MISSING.add(src); return false; }
  const dir = src.split('/').slice(0, -1).join('/');
  mkdirSync(`${OUT}/articles/${dir}`, { recursive: true });
  const meta = await sharp(from).metadata();
  if (/\.(jpe?g|png)$/i.test(src) && meta.width > 1000) {
    const stem = src.replace(/\.[^.]+$/, '');
    await sharp(from).resize({ width: 800 }).jpeg({ quality: 82, mozjpeg: true })
      .toFile(`${OUT}/articles/${stem}-800.jpg`);
    await sharp(from).jpeg({ quality: 82, mozjpeg: true }).toFile(`${OUT}/articles/${stem}.jpg`);
    // Paths stay relative to the page, not to the image's own folder.
    SRCSET.set(src, `${stem}-800.jpg 800w, ${stem}.jpg ${meta.width}w`);
  } else {
    copyFileSync(from, `${OUT}/articles/${src}`);
  }
  return true;
}
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

// For attribute VALUES, which also have to survive quotes. esc() deliberately
// leaves them alone, because inline() turns straight quotes into curly ones
// after escaping and would not recognise &quot;. The first alt text containing
// a quotation mark — a video description quoting a line of dialogue — closed
// its own aria-label early and put the rest of the sentence into the markup.
const attr = s => esc(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
// Typesetting, not editing. Curly quotes are how the text is SET; the source
// files keep whatever the author typed. Applied before links are built, so no
// href or attribute is ever touched.
const smart = s => s
  .replace(/"([^"]*)"/g, '“$1”')
  .replace(/([A-Za-z0-9])'([A-Za-z])/g, '$1’$2')
  .replace(/'(\d\d)s\b/g, '’$1s');

const inline = s => smart(esc(s))
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

function markdown(src, meta = {}) {
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

    // Video. Fenced because a video is not an image: it needs a poster so the
    // page does not sit blank, preload="metadata" so it costs a reader nothing
    // until they press play, and — by our own checklist — captions.
    //
    //   ```video
    //   file: assets/thing.mp4
    //   poster: assets/thing-poster.jpg
    //   captions: assets/thing.vtt
    //   alt: what happens in it, for someone who cannot watch
    //   caption: the line printed underneath
    //   ```
    if (line.startsWith('```video')) {
      i++;
      const v = {};
      while (i < lines.length && !lines[i].startsWith('```')) {
        const at = lines[i].indexOf(':');
        if (at > 0) v[lines[i].slice(0, at).trim()] = lines[i].slice(at + 1).trim();
        i++;
      }
      i++;
      if (!v.file) throw new Error('video block has no file:');
      VIDEOS.add(v.file);
      if (v.poster) VIDEOS.add(v.poster);
      if (v.captions) VIDEOS.add(v.captions);
      else NO_CAPTIONS.add(v.file);
      out.push(`<figure class="fig video">`
        + `<video controls playsinline preload="metadata"${v.poster ? ` poster="${attr(v.poster)}"` : ''}`
        + `${v.alt ? ` aria-label="${attr(v.alt)}"` : ''}>`
        + `<source src="${attr(v.file)}" type="video/mp4">`
        + (v.captions ? `<track kind="captions" src="${attr(v.captions)}" srclang="en" label="English" default>` : '')
        + `<p>Your browser cannot play this video. `
        + `<a href="${esc(v.file)}">Download it instead</a>.</p></video>`
        + (v.caption ? `<figcaption>${inline(v.caption)}</figcaption>` : '')
        + `</figure>`);
      continue;
    }

    // Somebody else's words. Fenced rather than a plain blockquote so the
    // narrator can be made to skip it — our synthetic voice may read our own
    // prose and never a person's testimony. See docs/07-photography.md.
    if (line.startsWith('```testimony')) {
      i++;
      const buf = [];
      while (i < lines.length && !lines[i].startsWith('```')) { buf.push(lines[i]); i++; }
      i++;
      const who = buf.length && /^[—-]\s/.test(buf[buf.length - 1]) ? buf.pop().replace(/^[—-]\s*/, '') : '';
      const body = inline(buf.join(' ').trim());
      // With an attribution it sets as a quotation. Without one it is an
      // ordinary paragraph that happens to contain somebody's words — the
      // author wrote it that way and we are not restructuring their prose to
      // suit our tooling. Either way the narrator skips it.
      out.push(who
        ? `<figure class="testimony"><blockquote><p>${body}</p></blockquote>`
          + `<figcaption>&mdash; ${inline(who)}</figcaption></figure>`
        : `<p>${body}</p>`);
      continue;
    }

    // fenced figure — ```figure\nname\n```
    if (line.startsWith('```figure')) {
      i++;
      const name = (lines[i] || '').trim();
      while (i < lines.length && !lines[i].startsWith('```')) i++;
      i++;
      if (!FIGURES[name]) throw new Error(`Unknown figure "${name}". Known: ${Object.keys(FIGURES).join(', ')}`);
      out.push(FIGURES[name]());
      continue;
    }

    // image, optionally followed by an italic caption line
    let im;
    if ((im = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/))) {
      i++;
      let cap = '';
      if (i < lines.length && /^\*[^*].*\*$/.test(lines[i].trim())) { cap = lines[i].trim().slice(1, -1); i++; }
      // A missing photograph is a hole in the page, not a silent omission.
      // The slot states what belongs here so nobody ships the gap by accident.
      // An unresolved [credit] is the author's own placeholder. We keep their
      // words and mark the gap, rather than silently publishing a bracket.
      const capHtml = cap
        ? `<figcaption>${inline(cap).replace(/\[credit\]/gi,
            '<mark class="todo">photographer to be credited</mark>')}</figcaption>`
        : '';
      const set = SRCSET.get(im[2]);
      const file = set ? im[2].replace(/\.[^.]+$/, '.jpg') : im[2];
      // The author's own portrait sets small and round, not full bleed.
      const portrait = meta.author && im[1].trim() === meta.author.trim();
      out.push(MISSING.has(im[2])
        ? `<figure class="fig photo-missing"><div class="slot" role="img" aria-label="${attr(im[1])}">`
          + `<p class="slot-t">Photograph not supplied</p><p class="slot-d">${esc(im[1])}</p>`
          + `<p class="slot-f"><code>${esc(im[2])}</code></p></div>` + capHtml + `</figure>`
        : `<figure class="fig ${portrait ? 'portrait' : 'photo'}">`
          + `<img src="${esc(file)}"${set ? ` srcset="${esc(set)}" sizes="(max-width: 46rem) 100vw, 44rem"` : ''}`
          + ` alt="${attr(im[1])}" loading="lazy" decoding="async">` + capHtml + `</figure>`);
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
    /* Teal clears 3:1 on cream but only 2.93:1 on this surface. Sky is 7.49:1. */
    --hf-quote-rule: #7CC4F2;
  }
}

.skip {
  position: absolute; left: -9999px; top: 0; z-index: 100;
  background: var(--hf-ink); color: var(--hf-cream);
  padding: 12px 20px; border-radius: 0 0 var(--hf-radius) 0; font-family: var(--hf-font-brand); font-weight: 700;
}
.skip:focus { left: 0; }

/* Screen-reader only. Was used on table captions before it was ever defined. */
.sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}

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

/* ---- translation state ---- */
.unreviewed {
  margin: 1.25rem 0 0; padding: 1rem 1.15rem;
  border: 2px solid var(--hf-sunrise); border-radius: var(--hf-radius);
  background: color-mix(in srgb, var(--hf-sunrise) 10%, transparent);
  font-size: .9375rem; line-height: 1.55;
}
.unreviewed strong { font-family: var(--hf-font-brand); }
.unreviewed a { color: var(--hf-text-accent); }
/* One rung down: the text has been reviewed, the audio has not. Teal, because
   Sunrise is reserved for "nobody has checked any of this". */
.revised { border-color: var(--hf-teal); background: color-mix(in srgb, var(--hf-teal) 8%, transparent); }
/* Language switcher. Both versions are named, the one you are on is marked,
   and it looks the same on each so the pair is obvious. */
.langs {
  display: inline-flex; align-items: stretch; margin: 1.25rem 0 0;
  border: 1px solid var(--hf-border); border-radius: var(--hf-radius); overflow: hidden;
  font-family: var(--hf-font-brand); font-weight: 700; font-size: .875rem;
}
.langs-l {
  display: flex; align-items: center; padding: .4rem .7rem;
  font-size: .6875rem; letter-spacing: .1em; text-transform: uppercase;
  color: var(--hf-text-muted); background: var(--hf-surface-raised);
  border-right: 1px solid var(--hf-border);
}
.langs .on, .langs a { padding: .4rem .85rem; display: flex; align-items: center; }
.langs .on { background: var(--hf-ink); color: var(--hf-cream); }
.langs a { color: var(--hf-text-link); text-decoration: none; }
.langs a:hover, .langs a:focus-visible { background: var(--hf-surface-raised); text-decoration: underline; }
.langnote { margin: .6rem 0 0; font-size: .8125rem; line-height: 1.5; color: var(--hf-text-muted); max-width: 46ch; }
.switches { display: flex; flex-wrap: wrap; gap: .6rem; align-items: center; }
.switches .langs { margin: 1.25rem 0 0; }
.lens .on { background: var(--hf-teal); color: var(--hf-cream); }

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

/* ---- somebody else's words ---- */
/* Teal, not Sunrise: Sunrise marks a pull quote, which is our own voice. This
   rule marks words that are not ours. The two must not look the same. */
.testimony { margin: 2.5rem 0; padding-left: 1.25rem; border-left: 3px solid var(--hf-quote-rule, var(--hf-teal)); }
.testimony blockquote { margin: 0; padding: 0; border: 0; }
.testimony blockquote p { margin: 0; font-size: 1.125rem; line-height: 1.6; }
.testimony figcaption {
  margin: .6rem 0 0; font-family: var(--hf-font-brand); font-weight: 700;
  font-size: .875rem; color: var(--hf-text-muted);
}

/* ---- the face by the name ---- */
/* alt="" because the name is right beside it: a screen reader announcing
   "photo of Helena Carre, Helena Carre" is noise, not access. */
.meta .face {
  width: 36px; height: 36px; border-radius: 50%; object-fit: cover;
  margin-right: .1rem; vertical-align: middle;
  border: 1px solid var(--hf-border); background: var(--hf-surface-raised);
}

/* ---- video ---- */
.video { margin: 2.5rem 0; }
.video video {
  width: 100%; height: auto; display: block; border-radius: var(--hf-radius);
  background: #111113;    /* the video's own ground, so no flash before it paints */
}
.video figcaption {
  margin: .85rem 0 0; font-size: .9375rem; line-height: 1.55; color: var(--hf-text-muted);
}
/* A square video should not fill a desktop column edge to edge. */
.video { max-width: 34rem; margin-inline: auto; }

/* ---- photographs ---- */
.photo img { width: 100%; height: auto; display: block; border-radius: var(--hf-radius); }
/* The author's own portrait in a bio block. Small and round, not full bleed. */
.portrait { margin: 2rem 0 1.25rem; }
.portrait img {
  width: 96px; height: 96px; border-radius: 50%; object-fit: cover; display: block;
  border: 1px solid var(--hf-border);
}
/* An unresolved placeholder the author left. Visible, not pretending. */
mark.todo {
  background: color-mix(in srgb, var(--hf-sunrise) 22%, transparent);
  color: var(--hf-text); padding: .05em .35em; border-radius: 3px;
  font-family: var(--hf-font-brand); font-weight: 700; font-size: .9em;
}
.photo figcaption, .photo-missing figcaption {
  margin: .75rem 0 0; font-size: .875rem; line-height: 1.5; color: var(--hf-text-muted);
}
.photo-missing .slot {
  display: grid; place-content: center; gap: .4rem; text-align: center;
  aspect-ratio: 3 / 2; padding: 1.5rem;
  border: 2px dashed var(--hf-border); border-radius: var(--hf-radius);
  background: var(--hf-surface-raised);
}
.photo-missing .slot-t {
  margin: 0; font-family: var(--hf-font-brand); font-weight: 800; font-size: .75rem;
  letter-spacing: .12em; text-transform: uppercase; color: var(--hf-text-accent);
}
.photo-missing .slot-d { margin: 0; max-width: 28rem; font-size: .9375rem; line-height: 1.5; }
.photo-missing .slot-f { margin: 0; font-size: .8125rem; color: var(--hf-text-muted); }
${FIGURE_CSS}`;

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

function page(meta, bodyHtml, slug, TRANSLATED = new Map(), ARTICLES = new Set()) {
  const L = (meta.lang || 'en') === 'es'
    ? { listen: 'Escuchar', read: 'min de lectura', by: 'Leído por una voz sintética',
        tail: 'Está leyendo las palabras de abajo, las de nadie más.', other: 'Read in English', otherHref: `${slug.replace(/\.es$/, '')}.html` }
    : { listen: 'Listen', read: 'min read', by: 'Read by a synthetic voice',
        tail: "It is reading the words below, nobody else's.", other: 'Leer en español', otherHref: `${slug}.es.html` };

  // Only offer the other language when it actually exists. Assuming every
  // English article had a Spanish twin put a live "Leer en español" link on
  // Andrés's article pointing at a 404.
  const base = slug.replace(/\.es$/, '');
  const isEs = (meta.lang || 'en') === 'es';
  const hasOther = isEs || TRANSLATED.has(base);
  const langs = hasOther ? [
    { code: 'en', name: 'English', href: `${base}.html`, on: !isEs },
    { code: 'es', name: 'Español', href: `${base}.es.html`, on: isEs },
  ] : [];
  const langNav = langs.length ? `<nav class="langs" aria-label="${isEs ? 'Idioma' : 'Language'}">`
    + `<span class="langs-l">${isEs ? 'Idioma' : 'Language'}</span>`
    + langs.map(l => l.on
      ? `<span class="on" aria-current="true" lang="${l.code}">${l.name}</span>`
      : `<a href="${l.href}" hreflang="${l.code}" lang="${l.code}">${l.name}</a>`).join('')
    + `</nav>` : '';
  const alternates = langs.map(l =>
    `<link rel="alternate" hreflang="${l.code}" href="https://hkcarre.github.io/humanfirstai/articles/${l.href}">`).join('\n');

  // The Spanish page states its own review status on arrival. An English
  // reader deciding whether to send someone the link deserves to know before
  // they click, not after.
  // Short/long pairing. Declared on both sides and resolved against what the
  // build can actually see, for the same reason the language switcher is: a
  // control that promises a page which does not exist is worse than no control.
  const suffix = isEs ? '.es' : '';
  const pair = meta.longVersion ? { other: meta.longVersion, onShort: true }
    : meta.shortVersion ? { other: meta.shortVersion, onShort: false } : null;
  const pairExists = pair && ARTICLES.has(`${pair.other}${suffix}`);
  const lenNav = pairExists ? `<nav class="langs lens" aria-label="${isEs ? 'Extensión' : 'Length'}">`
    + `<span class="langs-l">${isEs ? 'Extensión' : 'Length'}</span>`
    + [
      { name: isEs ? 'En breve' : 'In brief', on: pair.onShort,
        href: `${pair.onShort ? base : pair.other}${suffix}.html` },
      { name: isEs ? 'Completo' : 'Full version', on: !pair.onShort,
        href: `${pair.onShort ? pair.other : base}${suffix}.html` },
    ].map(l => l.on
      ? `<span class="on" aria-current="true">${l.name}</span>`
      : `<a href="${l.href}">${l.name}</a>`).join('')
    + `</nav>` : '';

  const esState = !isEs ? TRANSLATED.get(base) : null;
  const langNote = esState && esState !== 'true' ? `<p class="langnote">${esState === 'text'
    ? 'The Spanish is a machine-assisted translation. Its text has been reviewed against this page; its narration has not.'
    : 'The Spanish is a machine-assisted translation and has not been reviewed by a native speaker yet.'}</p>` : '';

  // Narration, if it has been generated. preload="none" so it costs a reader
  // on a slow connection nothing at all unless they ask for it.
  let audio = '';
  if (existsSync(`${OUT}/articles/${slug}.mp3`)) {
    const info = JSON.parse(readFileSync(`${OUT}/articles/${slug}.audio.json`, 'utf8'));
    const mins = Math.round(info.seconds / 60);
    audio = `<div class="listen">
      <span class="lab">${L.listen} &middot; ${mins} min</span>
      <audio controls preload="none" src="${slug}.mp3" aria-label="${L.listen}, ${mins} min"></audio>
      <p class="sub">${L.by} (<a href="https://huggingface.co/hexgrad/Kokoro-82M">Kokoro-82M</a>,
      ${meta.lang === 'es' ? 'generada localmente, sin rastreo' : 'generated locally, no tracking'}). ${L.tail}</p>
    </div>`;
  }
  const url = `https://hkcarre.github.io/humanfirstai/articles/${slug}.html`;
  const tags = Array.isArray(meta.tags) ? meta.tags : [];
  const date = new Date(meta.date + 'T00:00:00Z');
  const dateStr = date.toLocaleDateString(meta.lang === 'es' ? 'es-419' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const revStr = meta.reviewDate
    ? new Date(meta.reviewDate).toLocaleDateString(meta.lang === 'es' ? 'es-419' : 'en-GB',
      { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    : '';
  // A guest piece may have no standfirst of its own. We do not write one for
  // them and put it under their byline.
  const desc = meta.standfirst || meta.subtitle;
  return `<!doctype html>
<html lang="${meta.lang || 'en'}">
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
  inLanguage: meta.lang || 'en',
  ...(meta.author ? { author: { '@type': 'Person', name: meta.author } } : {}),
  ...(meta.translationOf ? { translationOfWork: { '@type': 'Article', name: meta.title } } : {}),
  datePublished: meta.date, publisher: { '@type': 'Organization', name: BRAND.name },
  image: `https://hkcarre.github.io/humanfirstai/articles/${slug}-og.png`,
  mainEntityOfPage: url,
}, null, 2)}
</script>
${alternates}
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
    ${meta.standfirst ? `<p class="standfirst">${esc(meta.standfirst)}</p>` : ''}
    <p class="meta">
      ${meta.authorPhoto ? `<img class="face" src="${attr(meta.authorPhoto)}" alt="" loading="lazy" decoding="async" width="36" height="36">` : ''}
      <span>${esc(meta.author || BRAND.name)}</span><span class="dot">&middot;</span>
      ${meta.author ? `<span>${esc(BRAND.name)}</span><span class="dot">&middot;</span>` : ''}
      <time datetime="${meta.date}">${dateStr}</time><span class="dot">&middot;</span>
      <span>${meta.readingTime} ${L.read}</span>
    </p>
    ${audio}
    <div class="switches">${langNav}${lenNav}</div>${langNote}
    ${meta.reviewed === 'false' ? `<aside class="unreviewed" role="note">
      <strong>Borrador sin revisar.</strong> Esta traducción y su narración se generaron con
      ayuda de una máquina y <strong>todavía no las revisó un hablante nativo</strong>. Nuestras
      propias reglas exigen esa revisión antes de publicar, así que esto es una muestra de
      trabajo, no material aprobado.
      <a href="https://github.com/hkcarre/humanfirstai/blob/main/docs/02-voice.md">La regla</a>
    </aside>` : meta.reviewed === 'text' ? `<aside class="unreviewed revised" role="note">
      <strong>Texto revisado. Audio todavía no.</strong> Un revisor hispanohablante comparó esta
      traducción con el original en inglés el ${revStr} y aplicamos sus correcciones.
      La narración se volvió a generar con el texto corregido, pero
      <strong>nadie la escuchó todavía de principio a fin</strong>, así que la marca se queda
      hasta que alguien lo haga.
      <a href="https://github.com/hkcarre/humanfirstai/blob/main/docs/02-voice.md">La regla</a>
    </aside>` : ''}
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
    <p class="sub">${meta.ctaSub || `Human First AI runs free workshops that help people use AI in real life &mdash;
      in libraries, market halls and community centres, in their own language.`}</p>
    <p><a class="cta" href="${meta.ctaHref || 'https://github.com/hkcarre/humanfirstai'}">${esc(meta.ctaLabel || 'See the brand system')}</a></p>
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
${bodyHtml.includes('class="fig') ? FIGURE_JS : ''}
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
      <p class="meta"><span>Audio</span><span class="dot">&middot;</span><span>13 samples, 4 accents</span></p>
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
      <p>${esc(a.meta.standfirst || a.meta.subtitle)}</p>
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
// Which pieces exist in more than one language. Computed before any page is
// rendered, so a language switcher is only ever offered when its target exists.
// Every article slug the build can see, so a switcher never offers a page
// that does not exist.
const ARTICLES = new Set(readdirSync(`${ROOT}/content`)
  .filter(f => f.endsWith('.md'))
  .map(f => f.replace(/\.md$/, '')));
const TRANSLATED = new Map(readdirSync(`${ROOT}/content`)
  .filter(f => f.endsWith('.es.md'))
  .map(f => [f.replace(/\.es\.md$/, ''),
    (readFileSync(`${ROOT}/content/${f}`, 'utf8').match(/^reviewed:\s*(\S+)/m) || [, 'false'])[1]]));
for (const file of readdirSync(`${ROOT}/content`).filter(f => f.endsWith('.md')).sort()) {
  const slug = file.replace(/\.md$/, '');
  const [meta, body] = frontmatter(readFileSync(`${ROOT}/content/${file}`, 'utf8'));

  // Resolve the article's own images. Anything present is copied next to the
  // page; anything absent is recorded so it renders as a labelled slot.
  for (const m of body.matchAll(/^!\[[^\]]*\]\(([^)]+)\)\s*$/gm)) {
    if (!/^https?:/i.test(m[1])) await placeImage(m[1]);
  }
  if (meta.authorPhoto) await placeImage(meta.authorPhoto);

  // Video and its poster are copied verbatim — no re-encode. Re-compressing
  // someone's finished render to save a megabyte is a good way to ship a worse
  // video than the one they made.
  for (const m of body.matchAll(/^\s*(?:file|poster|captions):\s*(\S+)$/gm)) {
    const src = m[1];
    if (/^https?:/i.test(src) || !existsSync(`${ROOT}/content/${src}`)) {
      if (!/^https?:/i.test(src)) MISSING.add(src);
      continue;
    }
    mkdirSync(`${OUT}/articles/${src.split('/').slice(0, -1).join('/')}`, { recursive: true });
    copyFileSync(`${ROOT}/content/${src}`, `${OUT}/articles/${src}`);
  }

  const { html, sections } = markdown(body, meta);
  writeFileSync(`${OUT}/articles/${slug}.html`, page(meta, html, slug, TRANSLATED, ARTICLES));

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
if (NO_CAPTIONS.size) {
  console.log(`\n  ${NO_CAPTIONS.size} video(s) shipping WITHOUT captions.`);
  console.log('  The review checklist requires captions on video. A viewer who is deaf,');
  console.log('  or anyone on a muted autoplaying feed, gets nothing from the audio.');
  for (const v of NO_CAPTIONS) console.log(`    ${v}`);
}
if (MISSING.size) {
  console.log(`\n  ${MISSING.size} photograph(s) an article asks for and the repository does not have.`);
  console.log('  They render as a labelled slot, not a broken image. Drop the files in');
  console.log('  site/content/ at these paths, with provenance and consent in credits.json:');
  for (const m of MISSING) console.log(`    site/content/${m}`);
}
writeFileSync(`${OUT}/.nojekyll`, '');
writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\n`);
console.log(`site: ${articles.length} article(s) -> site/dist/`);
