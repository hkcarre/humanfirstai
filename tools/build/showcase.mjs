import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { renderPng } from '../lib/type.mjs';
import { para, mark, doc, arch } from '../lib/layout.mjs';
import { C, BRAND, WAYS, markBody, MARK_BOX } from '../lib/brand.mjs';
import { lockup } from '../lib/lockup.mjs';


// ---------------------------------------------------------------------------
//  The showcase. Spatial depth and craft, in this brand's own language.
//
//  Act I   you walk through the mark itself — layered cut paper, real depth
//  Act II  thirty-eight chapters on a halftone globe
//  Act III the brand as physical objects
//
//  No libraries. ~30KB of JS and data all in, because the brand's own rule is
//  two seconds on rural 3G and a showcase that breaks that rule argues
//  against itself.
// ---------------------------------------------------------------------------
const OUT = '../site/dist';
const land = JSON.parse(readFileSync('../site/data/land.json', 'utf8'));
const chapters = JSON.parse(readFileSync('../site/data/chapters.json', 'utf8')).chapters;

const stripSvg = s => s.replace(/^[\s\S]*?<title>[\s\S]*?<\/title>/, '').replace(/<\/svg>\s*$/, '');
const inlineLockup = (kind, way, cls = '') => {
  const svg = lockup(kind, WAYS[way]);
  const [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
  return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" aria-hidden="true" focusable="false">${stripSvg(svg)}</svg>`;
};
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// --- Act I: a backlit cut-paper diorama -----------------------------------
// Eight nested arches sharing one ground line, each a blend of Deep Ink and
// Warm Cream, lightest at the centre where the light is. No new colours, no
// SVG, no masks — an arch is just a box with the right border-radius, which
// means it scales on the GPU and cannot go wrong at an odd viewport size.
const LAYERS = 8;
const mix = (a, b, t) => {
  const h = x => [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16));
  const [r1, g1, b1] = h(a), [r2, g2, b2] = h(b);
  const c = (u, v) => Math.round(u + (v - u) * t).toString(16).padStart(2, '0');
  return '#' + c(r1, r2) + c(g1, g2) + c(b1, b2);
};
const archLayers = Array.from({ length: LAYERS }, (_, i) => {
  const w = 95 * Math.pow(0.79, i);
  const tone = i === LAYERS - 1 ? C.sunrise : mix(C.ink, C.cream, (i / (LAYERS - 2)) * 0.82);
  return `<div class="plate" style="--i:${i};--w:${w.toFixed(1)}vmin;--tone:${tone}"></div>`;
}).join('\n      ');

const CSS = `
@import url("assets/tokens.css");
@import url("assets/fonts.css");

*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{
  margin:0;background:var(--hf-cream);color:var(--hf-ink);
  font-family:var(--hf-font-readable);font-size:17px;line-height:1.7;
  -webkit-font-smoothing:antialiased;overflow-x:clip;
}
h1,h2,h3,.brandtype{font-family:var(--hf-font-brand)}
.skip{position:absolute;left:-9999px;top:0;z-index:200;background:var(--hf-ink);color:var(--hf-cream);padding:12px 20px;font-family:var(--hf-font-brand);font-weight:700}
.skip:focus{left:0}
.wrap{width:min(100% - 2.5rem,64rem);margin-inline:auto}
.narrow{width:min(100% - 2.5rem,38rem);margin-inline:auto}
.kicker{font-family:var(--hf-font-brand);font-weight:700;font-size:.8125rem;letter-spacing:.14em;text-transform:uppercase;color:var(--hf-sunrise-deep);margin:0 0 1rem}

/* Paper grain. The canvas is meant to feel like uncoated stock, not glass. */
.grain{position:fixed;inset:0;pointer-events:none;z-index:90;opacity:.055;mix-blend-mode:multiply}

/* ---------------- masthead ---------------- */
.masthead{position:relative;z-index:60}
.masthead .wrap{display:flex;align-items:center;justify-content:space-between;gap:1.5rem;padding:1.15rem 0}
.masthead svg{height:30px;width:auto;display:block}
.masthead a{text-decoration:none;display:inline-flex}
.masthead .lnk{font-family:var(--hf-font-brand);font-weight:600;font-size:.875rem;color:var(--hf-ink-muted)}
.masthead .lnk:hover{color:var(--hf-sunrise-deep)}

/* ================= ACT I — the threshold ================= */
.act1{height:300vh;position:relative}
.stage{position:sticky;top:0;height:100vh;overflow:hidden;background:var(--hf-ink)}
.plate{
  position:absolute;left:50%;bottom:9vmin;
  width:var(--w);height:calc(var(--w) * 1.3);
  margin-left:calc(var(--w) / -2);
  background:var(--tone);
  border-radius:50% 50% 2% 2% / 62% 62% 2% 2%;
  transform-origin:50% 100%;
  z-index:calc(var(--i) + 1);
  will-change:transform,opacity;
}
.plate:last-child{box-shadow:0 0 14vmin 2vmin rgba(255,138,61,.28)}
.act1 .copy{position:absolute;inset:0;z-index:40;display:grid;place-items:center;text-align:center;pointer-events:none;padding:0 1.25rem}
.act1 h1{
  font-weight:800;font-size:clamp(1.9rem,5.2vw,3.9rem);line-height:1.05;letter-spacing:-.03em;
  margin:0;color:var(--hf-cream);text-wrap:balance;text-shadow:0 2px 28px rgba(31,42,68,.8);
}
.act1 .l2{color:var(--hf-sunrise)}
.act1 .hint{font-family:var(--hf-font-brand);font-weight:600;font-size:.8125rem;letter-spacing:.14em;text-transform:uppercase;color:#C3CCDD;margin:1.75rem 0 0;text-shadow:0 1px 10px rgba(31,42,68,.9)}
.act1 .hint span{display:inline-block;animation:nudge 2.4s ease-in-out infinite}
@keyframes nudge{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}
.act1 .outro{
  position:absolute;inset:0;z-index:41;display:grid;place-items:center;opacity:0;pointer-events:none;padding:0 1.25rem;
  font-family:var(--hf-font-brand);font-weight:800;font-size:clamp(1.5rem,4vw,2.8rem);
  letter-spacing:-.025em;color:var(--hf-ink);text-align:center;text-wrap:balance;margin:0;
}

/* ================= ACT II — the globe ================= */
.act2{background:var(--hf-ink);color:var(--hf-cream);padding:clamp(4rem,9vw,7rem) 0}
.act2 h2{font-weight:800;font-size:clamp(1.9rem,4.6vw,3.1rem);line-height:1.08;letter-spacing:-.03em;margin:0 0 1.1rem;text-wrap:balance}
.act2 .lede{color:#C3CCDD;max-width:42ch;margin:0 0 1rem}
.act2 .kicker{color:var(--hf-sunrise)}
.globe-grid{display:grid;grid-template-columns:minmax(0,1fr) min(42%,400px);gap:clamp(2rem,4vw,3.5rem);align-items:center;margin-top:2.5rem}
@media (max-width:62rem){.globe-grid{grid-template-columns:1fr}.globe-wrap{max-width:520px}}
.globe-wrap{position:relative;aspect-ratio:1;width:100%;max-width:640px;margin-inline:auto;touch-action:pan-y}
#globe{width:100%;height:100%;display:block;cursor:grab}
#globe:active{cursor:grabbing}
.readout{
  position:absolute;left:0;right:0;bottom:-.25rem;text-align:center;
  font-family:var(--hf-font-brand);font-weight:700;font-size:1.05rem;color:var(--hf-sunrise);
  min-height:1.6em;pointer-events:none;
}
.readout small{display:block;font-weight:500;font-size:.8125rem;color:#A8B3C9;letter-spacing:.02em}
.chapter-list{min-width:0;max-height:min(66vh,600px);overflow:auto;padding-right:.5rem}
.chapter-list ul{list-style:none;margin:0;padding:0;columns:2;column-gap:1.25rem}
@media (max-width:30rem){.chapter-list ul{columns:1}}
.chapter-list button{
  display:block;width:100%;text-align:left;background:none;border:0;padding:.42rem .55rem;
  font:inherit;font-family:var(--hf-font-brand);font-weight:600;font-size:.9375rem;
  color:#C3CCDD;cursor:pointer;border-radius:8px;break-inside:avoid;
}
.chapter-list button:hover,.chapter-list button[aria-current="true"]{background:#2A3754;color:var(--hf-cream)}
.chapter-list button .r{display:block;font-weight:500;font-size:.75rem;color:#8E9BB5}
.act2 .foot{margin-top:2.5rem;color:#8E9BB5;font-size:.875rem;max-width:52ch}

/* ================= ACT III — craft ================= */
.act3{padding:clamp(4rem,9vw,7rem) 0}
.act3 h2{font-weight:800;font-size:clamp(1.9rem,4.6vw,3.1rem);line-height:1.08;letter-spacing:-.03em;margin:0 0 1rem;text-wrap:balance}
.act3 .lede{color:var(--hf-ink-muted);max-width:44ch;margin:0 0 3rem}
.specimens{display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:1.75rem}
.spec{margin:0}
.tile{border-radius:14px;overflow:hidden;position:relative;aspect-ratio:4/3;display:grid;place-items:center}
.tile svg{width:52%;height:auto}
.spec figcaption{margin-top:.8rem;font-family:var(--hf-font-brand);font-weight:600;font-size:.8125rem;line-height:1.45;color:var(--hf-ink-muted)}

/* letterpress: deboss into warm stock */
.tile.letterpress{background:#F6EADA;box-shadow:inset 0 1px 0 #FFF,0 1px 2px rgba(31,42,68,.14)}
.tile.letterpress svg{filter:drop-shadow(0 1px 0 rgba(255,255,255,.95)) drop-shadow(0 -1px 1px rgba(31,42,68,.28))}
/* enamel pin: ink plate, polished metal edge */
.tile.enamel{background:var(--hf-ink);box-shadow:inset 0 0 0 2px #46536F,inset 0 2px 6px rgba(255,255,255,.14),0 6px 16px rgba(31,42,68,.3)}
.tile.enamel svg{filter:drop-shadow(0 1px 0 rgba(255,255,255,.22))}
/* embroidery: thread on cotton */
.tile.patch{background:#2A3754;box-shadow:inset 0 0 0 5px var(--hf-sunrise),0 4px 12px rgba(31,42,68,.26)}
.tile.patch svg{filter:drop-shadow(.5px .5px 0 rgba(0,0,0,.35))}
/* risograph: one-colour flyer, slight misregistration */
.tile.riso{background:#FFFBF4;box-shadow:inset 0 0 0 1px rgba(31,42,68,.14)}
.tile.riso .a,.tile.riso .b{position:absolute;width:52%;left:24%;top:18%}
.tile.riso .b{mix-blend-mode:multiply;transform:translate(3px,2px)}

/* ================= closing ================= */
.closing{background:var(--hf-ink);color:var(--hf-cream);padding:clamp(3.5rem,7vw,5.5rem) 0}
.closing p.line{font-family:var(--hf-font-brand);font-weight:800;font-size:clamp(1.6rem,3.8vw,2.4rem);line-height:1.18;letter-spacing:-.025em;margin:0 0 1rem;text-wrap:balance}
.closing p.sub{color:#A8B3C9;max-width:48ch;margin:0 0 2rem}
.cta{display:inline-block;background:var(--hf-sunrise);color:var(--hf-ink);font-family:var(--hf-font-brand);font-weight:800;padding:.85rem 1.5rem;border-radius:12px;text-decoration:none}
.cta:hover{filter:brightness(1.06)}
.closing svg{height:34px;width:auto;display:block;margin-top:2.5rem}
footer{padding:2.25rem 0 3.5rem;font-size:.875rem;color:var(--hf-ink-muted)}
footer .wrap{display:flex;flex-wrap:wrap;gap:.75rem 2rem;justify-content:space-between}
footer a{color:var(--hf-ink-muted)}
.sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}

/* ---- motion, honoured ---- */
@media (prefers-reduced-motion:reduce){
  .act1{height:auto}
  .stage{position:relative;height:min(84vh,720px)}
  .tunnel{transform:translateZ(1500px)!important}
  .act1 .hint span{animation:none}
  .plate{transition:none}
}
@media print{.act1,.grain{display:none}}
`;

const JS = `
(function () {
  var LAND = __LAND__, CH = __CH__;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Act I: the diorama opens as you walk in ---------- */
  var act1 = document.querySelector('.act1');
  if (act1) {
    var plates = [].slice.call(act1.querySelectorAll('.plate'));
    var head = document.getElementById('a1h'), hint = document.getElementById('a1hint'), out = document.getElementById('a1out');
    var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
    var tick1 = false;
    function paint(p) {
      var last = plates.length - 1;
      for (var i = 0; i < plates.length; i++) {
        var lit = i === last;
        var k = lit ? 7.2 : 4.4 - i * 0.46;           /* nearer arches open faster */
        var sc = 1 + p * k;
        plates[i].style.transform = 'scale(' + sc.toFixed(3) + ')';
        plates[i].style.opacity = lit ? '1' : clamp(1 - (sc - 2.5) / 0.9).toFixed(3);
      }
      head.style.opacity = clamp(1 - p / 0.3).toFixed(3);
      hint.style.opacity = clamp(1 - p / 0.14).toFixed(3);
      out.style.opacity = clamp((p - 0.68) / 0.18).toFixed(3);
    }
    function frame1() {
      var total = act1.offsetHeight - innerHeight;
      var p = total > 0 ? clamp(-act1.getBoundingClientRect().top / total) : 0;
      paint(p); tick1 = false;
    }
    if (reduce) paint(0.3);
    else {
      addEventListener('scroll', function () { if (!tick1) { tick1 = true; requestAnimationFrame(frame1); } }, { passive: true });
      addEventListener('resize', frame1, { passive: true });
      frame1();
    }
  }


  /* ---------- Act II: the globe ---------- */
  var cv = document.getElementById('globe');
  if (!cv) return;
  var ctx = cv.getContext('2d'), Q = LAND.q, dots = LAND.dots;
  var rot = -20, tilt = 14, dragging = false, lastX = 0, lastY = 0, vel = 0.05, active = -1;
  var readout = document.getElementById('readout');
  var size = 0, R = 0, cx = 0, cy = 0, dpr = Math.min(2, devicePixelRatio || 1);

  function resize() {
    var box = cv.getBoundingClientRect();
    size = Math.max(200, box.width);
    cv.width = size * dpr; cv.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    R = size * 0.44; cx = size / 2; cy = size / 2;
  }

  function project(lon, lat) {
    var l = (lon + rot) * Math.PI / 180, p = lat * Math.PI / 180, t = tilt * Math.PI / 180;
    var x = Math.cos(p) * Math.sin(l), y = Math.sin(p), z = Math.cos(p) * Math.cos(l);
    var y2 = y * Math.cos(t) - z * Math.sin(t), z2 = y * Math.sin(t) + z * Math.cos(t);
    return [cx + R * x, cy - R * y2, z2];
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);

    /* the sphere, with dawn coming up one edge */
    var g = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
    g.addColorStop(0, '#16203A'); g.addColorStop(1, '#243152');
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.fillStyle = g; ctx.fill();

    /* land, as halftone */
    for (var i = 0; i < dots.length; i += 2) {
      var pt = project(dots[i] / Q, dots[i + 1] / Q);
      if (pt[2] < 0.02) continue;
      ctx.globalAlpha = 0.22 + pt[2] * 0.62;
      ctx.fillStyle = '#FFF6EC';
      ctx.beginPath(); ctx.arc(pt[0], pt[1], 0.8 + pt[2] * 1.25, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;

    /* the chapters: a lit doorway each */
    for (var c = 0; c < CH.length; c++) {
      var q = project(CH[c].lon, CH[c].lat);
      if (q[2] < 0.015) continue;
      var on = c === active, s = (0.55 + q[2] * 0.75) * (on ? 2.1 : 1.35);
      ctx.globalAlpha = on ? 1 : 0.35 + q[2] * 0.55;
      ctx.fillStyle = '#FF8A3D';
      ctx.beginPath(); ctx.arc(q[0], q[1], s * 2.6, 0, 6.2832); ctx.fill();
      ctx.globalAlpha = (on ? 0.4 : 0.14) * (0.4 + q[2]);
      ctx.beginPath(); ctx.arc(q[0], q[1], s * 7.5, 0, 6.2832); ctx.fill();
      if (on) {
        ctx.globalAlpha = 1; ctx.strokeStyle = '#FFF6EC'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(q[0], q[1], s * 5.2, 0, 6.2832); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    /* rim */
    ctx.strokeStyle = 'rgba(255,246,236,.16)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.stroke();
  }

  function tick() {
    if (!dragging) rot += vel;
    draw();
    requestAnimationFrame(tick);
  }

  function setActive(i, spin) {
    active = i;
    if (i < 0) { readout.innerHTML = '&nbsp;'; return; }
    readout.innerHTML = CH[i].city + '<small>' + CH[i].region + '</small>';
    document.querySelectorAll('.chapter-list button').forEach(function (b, n) {
      b.setAttribute('aria-current', n === i ? 'true' : 'false');
    });
    if (spin) { rot = -CH[i].lon; tilt = Math.max(-35, Math.min(35, CH[i].lat * 0.55)); draw(); }
  }

  /* drag */
  cv.addEventListener('pointerdown', function (e) { dragging = true; lastX = e.clientX; lastY = e.clientY; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointerup', function () { dragging = false; });
  cv.addEventListener('pointercancel', function () { dragging = false; });
  cv.addEventListener('pointermove', function (e) {
    if (dragging) {
      rot += (e.clientX - lastX) * 0.32;
      tilt = Math.max(-62, Math.min(62, tilt + (e.clientY - lastY) * -0.22));
      lastX = e.clientX; lastY = e.clientY;
      draw();
      return;
    }
    /* hover a chapter */
    var b = cv.getBoundingClientRect(), mx = e.clientX - b.left, my = e.clientY - b.top, best = -1, bd = 18;
    for (var c = 0; c < CH.length; c++) {
      var q = project(CH[c].lon, CH[c].lat);
      if (q[2] < 0.015) continue;
      var d = Math.hypot(q[0] - mx, q[1] - my);
      if (d < bd) { bd = d; best = c; }
    }
    if (best !== active) setActive(best, false);
  });
  cv.addEventListener('pointerleave', function () { if (!dragging) setActive(-1, false); });

  /* the list is the accessible control surface */
  document.querySelectorAll('.chapter-list button').forEach(function (b, i) {
    b.addEventListener('focus', function () { setActive(i, true); });
    b.addEventListener('mouseenter', function () { setActive(i, true); });
    b.addEventListener('click', function () { setActive(i, true); });
  });

  addEventListener('resize', function () { resize(); draw(); }, { passive: true });
  addEventListener('load', function () { resize(); draw(); });
  if (window.ResizeObserver) new ResizeObserver(function () { resize(); draw(); }).observe(cv.parentNode);
  resize();
  if (reduce) { vel = 0; draw(); } else tick();
})();
`;

const grain = `<svg class="grain" aria-hidden="true" focusable="false"><filter id="g">
  <feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves="3" stitchTiles="stitch"/>
  <feColorMatrix type="saturate" values="0"/>
</filter><rect width="100%" height="100%" filter="url(#g)"/></svg>`;

const specimenMark = (dark, light, stroke = {}) =>
  `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">${markBody(dark, light, stroke)}</svg>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>An open door, in three dimensions — ${esc(BRAND.name)}</title>
<meta name="description" content="${esc(BRAND.oneLiner)} The Human First AI identity as depth, place and material.">
<meta name="color-scheme" content="light">
<meta name="theme-color" content="${C.ink}">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:title" content="An open door, in three dimensions">
<meta property="og:description" content="${esc(BRAND.oneLiner)}">
<meta property="og:image" content="https://hkcarre.github.io/humanfirstai/showcase-og.png">
<style>${CSS}</style>
</head>
<body>
<a class="skip" href="#chapters">Skip to the chapter list</a>
${grain}

<header class="masthead">
  <div class="wrap">
    <a href="index.html" aria-label="Human First AI — home">${inlineLockup('horizontal', 'full')}</a>
    <a class="lnk" href="https://github.com/hkcarre/humanfirstai">Brand system &rarr;</a>
  </div>
</header>

<!-- ============ ACT I ============ -->
<section class="act1" aria-label="Walking through the open door">
  <div class="stage">
    <div class="light" aria-hidden="true"></div>
      ${archLayers}
    <div class="copy">
      <div>
        <h1 id="a1h">Make AI feel like an open door,<br><span class="l2">not a locked lab.</span></h1>
        <p class="hint" id="a1hint"><span>Keep scrolling &mdash; walk through it</span></p>
      </div>
    </div>
    <p class="outro" id="a1out">You are through. So is everyone else.</p>
  </div>
</section>

<!-- ============ ACT II ============ -->
<section class="act2" id="chapters">
  <div class="wrap">
    <p class="kicker">Thirty-eight chapters</p>
    <h2>Thirty-eight doors. None of them locked.</h2>
    <p class="lede">Plenty of people are building a god's-eye view of the world &mdash; everything
      watched, from orbit, by somebody else.</p>
    <p class="lede">This is the opposite picture. Not looking down at people. Standing at street
      level with the door held open, in their language, for free.</p>

    <div class="globe-grid">
      <div class="globe-wrap">
        <canvas id="globe" role="img"
          aria-label="A rotating globe. Thirty-eight lit points mark the cities where Human First AI runs workshops. Every chapter is listed beside it."></canvas>
        <p class="readout" id="readout" aria-hidden="true">&nbsp;</p>
      </div>
      <div class="chapter-list">
        <p class="sr" id="clabel">Chapters. Choosing one turns the globe to it.</p>
        <ul aria-labelledby="clabel">
          ${chapters.map(c => `<li><button type="button">${esc(c.city)}<span class="r">${esc(c.region)}</span></button></li>`).join('\n          ')}
        </ul>
      </div>
    </div>
    <p class="foot">Drag the globe, or tab through the list. The land is Natural Earth 110m,
      drawn as halftone rather than as a map &mdash; it is a motif, not an instrument.
      Chapter locations here are illustrative placeholders.</p>
  </div>
</section>

<!-- ============ ACT III ============ -->
<section class="act3">
  <div class="wrap">
    <p class="kicker">Paper, thread, ink</p>
    <h2>A brand you can hold.</h2>
    <p class="lede">Most of this identity ends its life as a physical object in somebody's hands:
      a flyer off a tired photocopier, a patch on a volunteer's sleeve. It is built to survive
      that, which is why the mark is flat, heavy and made of one shape.</p>

    <div class="specimens">
      <figure class="spec">
        <div class="tile letterpress">${specimenMark(C.ink, '#F6EADA')}</div>
        <figcaption>Letterpress &middot; 600gsm cotton</figcaption>
      </figure>
      <figure class="spec">
        <div class="tile enamel">${specimenMark(C.cream, C.sunrise)}</div>
        <figcaption>Hard enamel pin &middot; 22mm</figcaption>
      </figure>
      <figure class="spec">
        <div class="tile patch">${specimenMark(C.cream, C.sunrise)}</div>
        <figcaption>Embroidered patch &middot; sleeve</figcaption>
      </figure>
      <figure class="spec">
        <div class="tile riso">
          <div class="a">${specimenMark(C.ink, '#FFF9F0')}</div>
          <div class="b">${specimenMark(C.sunrise, '#FFF9F0')}</div>
        </div>
        <figcaption>Risograph &middot; two passes, one off-register</figcaption>
      </figure>
    </div>
  </div>
</section>

<section class="closing">
  <div class="wrap">
    <p class="line">${esc(BRAND.promise)}</p>
    <p class="sub">Every asset on this page is generated from one definition of the mark and one
      palette. Nothing here was drawn by hand twice.</p>
    <p><a class="cta" href="https://github.com/hkcarre/humanfirstai">Take the brand system</a></p>
    ${inlineLockup('horizontal', 'reversed')}
  </div>
</section>

<footer>
  <div class="wrap">
    <span>&copy; 2026 ${esc(BRAND.name)} &middot; CC BY-NC 4.0 &middot; A brand demonstration, not the live service</span>
    <span><a href="https://github.com/hkcarre/humanfirstai">github.com/hkcarre/humanfirstai</a></span>
  </div>
</footer>

<script>${JS.replace('__LAND__', JSON.stringify(land)).replace('__CH__', JSON.stringify(chapters))}</script>
</body>
</html>
`;

writeFileSync(`${OUT}/showcase.html`, html);

// social card, from the same primitives as every other asset
const og = (() => {
  const w = 1200, h = 627, pad = 86;
  const head = para('Thirty-eight doors. None of them locked.', { x: pad, y: 0, maxW: w - pad * 2, size: 72, lh: 1.1, weight: 800, fill: C.cream });
  const top = Math.round((h - head.height) / 2 - 24);
  const placed = para(head.lines, { x: pad, y: top, maxW: w - pad * 2, size: 72, lh: 1.1, weight: 800, fill: C.cream });
  const kick = para(['AN OPEN DOOR, IN THREE DIMENSIONS'], { x: pad, y: top - 62, maxW: w - pad * 2, size: 22, weight: 700, fill: C.sunrise, track: 0.14 });
  const m = mark('horizontal', WAYS.reversed, { x: pad, y: h - pad - 60, h: 38 });
  const n = 7, aw = w / n, ah = 36;
  const band = Array.from({ length: n }, (_, i) =>
    `<path d="${arch(i * aw + aw * 0.14, h - ah, aw * 0.72, ah)}" fill="${C.sunrise}" opacity="0.9"/>`).join('');
  return doc(w, h, `  <rect width="${w}" height="${h}" fill="${C.ink}"/>
  ${band}
  ${kick.svg}
  ${placed.svg}
  ${m.svg}`, 'Thirty-eight doors');
})();
await renderPng(sharp, og, { width: 1200 }, `${OUT}/showcase-og.png`);
console.log(`showcase: ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB (land ${(JSON.stringify(land).length / 1024).toFixed(1)} KB inlined), ${chapters.length} chapters`);
