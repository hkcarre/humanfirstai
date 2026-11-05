import { C } from './brand.mjs';

// ---------------------------------------------------------------------------
//  Figures for "Give Yourself the Grace to Be Bad at It".
//
//  One idea, four times. The article's spine is the magic ring — the thing
//  every crochet beginner drops. So every figure in the piece is a ring, drawn
//  from above, in the same concentric-arc geometry as the logo's doorway.
//  Three research findings become three rings in one family rather than three
//  unrelated charts.
//
//  Rules this obeys, from the brand system:
//    - looked at from directly above, orthographic, no perspective tricks
//    - halftone dots rather than filled shapes, so nothing clips at an edge
//    - every number carries its source, and no number is invented to fill an arc
//    - the whole thing renders complete and correct with JavaScript switched
//      off and with prefers-reduced-motion set. Motion is decoration, never
//      the content.
// ---------------------------------------------------------------------------

const TAU = Math.PI * 2;
const pt = (cx, cy, r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
const f = n => Math.round(n * 100) / 100;

/** Halftone dome. Dots thin out toward the rim, which reads as depth without
 *  drawing a single shadow. Same trick as the globe on the showcase page. */
function dome(cx, cy, R, step = 15, max = 2.0) {
  const d = [];
  for (let y = cy - R; y <= cy + R; y += step) {
    for (let x = cx - R; x <= cx + R; x += step) {
      const dist = Math.hypot(x - cx, y - cy) / R;
      if (dist > 1) continue;
      const r = max * Math.pow(1 - dist, 0.55);
      if (r < 0.18) continue;
      d.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}"/>`);
    }
  }
  return `<g class="dome" fill="${C.ink}" opacity=".16">${d.join('')}</g>`;
}

/** An arc, as a path, from angle a0 to a1 going clockwise. */
function arc(cx, cy, r, a0, a1) {
  const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1);
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  return `M${f(x0)} ${f(y0)}A${f(r)} ${f(r)} 0 ${large} 1 ${f(x1)} ${f(y1)}`;
}

// --- 1. the hero ------------------------------------------------------------
//  A magic ring seen from directly above, drawn as it is made: a loose spiral
//  of yarn that pulls closed, then the first round of stitches worked into it.
//
//  RING is the single definition of that curve. It is used here to render the
//  finished state into the file, and the identical function is handed to the
//  browser to animate between. Two copies of this maths would drift apart.
export const RING_GEOM = { S: 720, loose: 268, tight: 74, stitchR: 150, stitches: 12 };
export const RING_FN = `function ringPath(p) {
    var S = ${RING_GEOM.S}, c = S / 2, N = 320, out = '';
    var loose = ${RING_GEOM.loose}, tight = ${RING_GEOM.tight}, turns = 2.4 - 1.4 * p;
    for (var i = 0; i <= N; i++) {
      var t = i / N, a = t * turns * Math.PI * 2 - Math.PI / 2;
      var rl = loose * (0.22 + 0.78 * t);
      var rt = tight + (loose - tight) * Math.pow(t, 6);
      var r = rl + (rt - rl) * p;
      out += (i ? 'L' : 'M') + (c + r * Math.cos(a)).toFixed(1) + ' ' + (c + r * Math.sin(a)).toFixed(1);
    }
    return out;
  }`;
const ringPath = new Function(`${RING_FN}; return ringPath;`)();

function magicRing() {
  const { S, stitchR, stitches: N } = RING_GEOM, c = S / 2;
  const sts = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * TAU - Math.PI / 2;
    const [x, y] = pt(c, c, stitchR, a);
    const deg = f((a * 180) / Math.PI + 90);
    // a crochet stitch is a V. Drawn as one, not as a dot.
    sts.push(`<path class="st" transform="translate(${f(x)} ${f(y)}) rotate(${deg})" d="M-17 21 L0 -18 L17 21"/>`);
  }
  return `
<figure class="fig fig-hero" data-fig="magic-ring">
  <div class="fig-stage">
    <svg viewBox="0 0 ${S} ${S}" role="img"
      aria-label="A magic ring seen from directly above: a loose spiral of yarn pulls closed into a small ring, and the first round of twelve stitches is worked around it.">
      ${dome(c, c, 300, 17, 2.3)}
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path class="yarn" stroke="${C.sunrise}" stroke-width="9" d="${ringPath(1)}"/>
        <g class="sts" stroke="${C.sunriseDeep}" stroke-width="7">${sts.join('')}</g>
      </g>
    </svg>
    <p class="fig-step" aria-hidden="true"><span>Loop</span><span>Pull</span><span>Work the round</span></p>
  </div>
  <figcaption>The magic ring. Every round thing you have ever crocheted starts
    here, and almost every beginner drops it the first few times.</figcaption>
</figure>`;
}

// --- 2. the stat rings ------------------------------------------------------
//  A gauge is a ring with a sweep you can read at a glance. Two of these show
//  a gap between what people expect and what happens, so both arcs are drawn
//  on the same geometry and the gap is the thing you see.
function gauge({ id, value, of, label, sub, ghost, ghostLabel, note, source, href }) {
  const S = 320, c = S / 2, R = 118, W = 26;
  const A0 = -Math.PI / 2;
  const sweep = p => arc(c, c, R, A0, A0 + Math.min(p, 0.9999) * TAU);
  const dots = [];
  // The track is dotted, not solid: it counts, and a reader can check it.
  for (let i = 0; i < of; i++) {
    const [x, y] = pt(c, c, R, A0 + ((i + 0.5) / of) * TAU);
    dots.push(`<circle class="tick${i < value ? ' on' : ''}" style="--i:${i}" cx="${f(x)}" cy="${f(y)}" r="3.4"/>`);
  }
  return `
<figure class="fig fig-stat" data-fig="gauge" data-value="${value / of}"${ghost ? ` data-ghost="${ghost}"` : ''}>
  <div class="fig-stage">
    <svg viewBox="0 0 ${S} ${S}" role="img" aria-label="${label}. ${sub}">
      ${dome(c, c, 150, 13, 1.5)}
      <circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="${C.ink}" stroke-opacity=".14" stroke-width="${W}"/>
      ${ghost ? `<path class="ghost" d="${sweep(ghost)}" fill="none" stroke="${C.ink}" stroke-opacity=".3"
          stroke-width="${W}" stroke-linecap="round"/>` : ''}
      <path class="val" d="${sweep(value / of)}" fill="none" stroke="${C.sunrise}"
        stroke-width="${W}" stroke-linecap="round"/>
      <g class="ticks" fill="${C.cream}">${dots.join('')}</g>
      <text class="big" x="${c}" y="${c - 4}" text-anchor="middle">${label}</text>
      <text class="small" x="${c}" y="${c + 26}" text-anchor="middle">${sub}</text>
    </svg>
    ${ghost ? `<p class="fig-key"><span class="k ghost"></span>${ghostLabel}<span class="k on"></span>${note}</p>` : ''}
  </div>
  <figcaption>${note ? (ghost ? '' : note + ' ') : ''}<a href="${href}" rel="noreferrer">${source}</a></figcaption>
</figure>`;
}

/** Two quantities compared. They go on DIFFERENT radii, as two concentric
 *  rings, because an arc drawn over another arc on the same radius simply
 *  hides it and the gap — which is the entire point — disappears. */
function compare({ expect, actual, label, sub, expectLabel, actualLabel, note, source, href }) {
  const S = 320, c = S / 2, RO = 122, RI = 82, W = 21, A0 = -Math.PI / 2;
  const top = Math.max(expect, actual);
  const sweep = (r, v) => arc(c, c, r, A0, A0 + (v / top) * 0.86 * TAU);
  return `
<figure class="fig fig-stat fig-cmp" data-fig="gauge">
  <div class="fig-stage">
    <svg viewBox="0 0 ${S} ${S}" role="img" aria-label="${label} ${sub}. ${expectLabel} compared with ${actualLabel}.">
      ${dome(c, c, 150, 13, 1.4)}
      <circle cx="${c}" cy="${c}" r="${RO}" fill="none" stroke="${C.ink}" stroke-opacity=".1" stroke-width="${W}"/>
      <circle cx="${c}" cy="${c}" r="${RI}" fill="none" stroke="${C.ink}" stroke-opacity=".1" stroke-width="${W}"/>
      <path class="ghost" d="${sweep(RI, expect)}" fill="none" stroke="${C.ink}" stroke-opacity=".34"
        stroke-width="${W}" stroke-linecap="round"/>
      <path class="val" d="${sweep(RO, actual)}" fill="none" stroke="${C.sunrise}"
        stroke-width="${W}" stroke-linecap="round"/>
      <text class="big" x="${c}" y="${c + 2}" text-anchor="middle">${label}</text>
      <text class="small" x="${c}" y="${c + 30}" text-anchor="middle">${sub}</text>
    </svg>
    <p class="fig-key"><span><span class="k ghost"></span>${expectLabel}</span><span><span class="k on"></span>${actualLabel}</span></p>
  </div>
  <figcaption>${note} <a href="${href}" rel="noreferrer">${source}</a></figcaption>
</figure>`;
}

export const FIGURES = {
  'magic-ring': magicRing,

  'hidden-half': () => gauge({
    id: 'hidden', value: 48, of: 100,
    label: '48%', sub: 'would not say',
    note: 'Of more than 17,000 desk workers, almost half said they would be uncomfortable telling their manager they had used AI.',
    source: 'Slack Workforce Index, 2024',
    href: 'https://slack.com/blog/news/the-fall-2024-workforce-index-shows-executives-and-employees-investing-in-ai-but-uncertainty-holding-back-adoption',
  }),

  'ask-gap': () => compare({
    expect: 1, actual: 2,
    label: '2×', sub: 'more likely',
    expectLabel: 'What people predict', actualLabel: 'What actually happens',
    note: 'Asked to picture it, people underestimated by as much as half how many strangers would say yes.',
    source: 'Flynn &amp; Lake, 2008',
    href: 'https://doi.org/10.1037/0022-3514.95.1.128',
  }),

  'grace-arc': () => compare({
    expect: 2, actual: 3,
    label: '+50%', sub: 'longer at it',
    expectLabel: 'Told nothing', actualLabel: 'Told they were not alone',
    note: 'After failing a hard test, students given a kind word studied about half as long again before trying again.',
    source: 'Breines &amp; Chen, 2012',
    href: 'https://doi.org/10.1177/0146167212445599',
  }),
};

// --- styles -----------------------------------------------------------------
export const FIGURE_CSS = `
/* ---- figures: everything in this article is a ring ---- */
.fig { margin: 3rem 0; }
.fig figcaption {
  margin: 1rem auto 0; max-width: 34rem; text-align: center;
  font-size: .9375rem; line-height: 1.55; color: var(--hf-text-muted);
}
.fig figcaption a { color: var(--hf-text-accent); }
.fig-stage { position: relative; }
.fig svg { display: block; width: 100%; height: auto; }
.fig .dome { color: var(--hf-text); }

/* hero */
.fig-hero { margin: 3.5rem 0 3rem; }
.fig-hero .fig-stage { max-width: 34rem; margin: 0 auto; }
.fig-hero .st { transform-box: fill-box; transform-origin: center; }
.fig-step {
  display: flex; justify-content: space-between; gap: 1rem;
  margin: .25rem auto 0; max-width: 30rem;
  font-family: var(--hf-font-brand); font-weight: 700; font-size: .75rem;
  letter-spacing: .12em; text-transform: uppercase; color: var(--hf-text-muted);
}
.fig-step span { transition: color .35s ease; }
.fig-step span.on { color: var(--hf-text-accent); }

/* stat rings */
.fig-stat .fig-stage { max-width: 20rem; margin: 0 auto; }
.fig-stat .big {
  font-family: var(--hf-font-brand); font-weight: 800; font-size: 54px;
  fill: var(--hf-text); letter-spacing: -.02em;
}
.fig-stat .small {
  font-family: var(--hf-font-brand); font-weight: 700; font-size: 15px;
  fill: var(--hf-text-muted); letter-spacing: .04em;
}
.fig-stat .tick { opacity: .55; }
.fig-stat .tick.on { opacity: 0; }
.fig-cmp .big { font-size: 44px; }
.fig-key {
  display: flex; flex-wrap: wrap; justify-content: center; gap: .3rem 1.1rem;
  margin: .7rem 0 0; font-size: .8125rem; line-height: 1.3; color: var(--hf-text-muted);
}
.fig-key > span { white-space: nowrap; }
.fig-key .k { display: inline-block; width: .7rem; height: .7rem; border-radius: 50%; margin-right: .35rem; vertical-align: -1px; }
.fig-key .k.ghost { background: var(--hf-text-muted); }
.fig-key .k.on { background: var(--hf-sunrise); }

/* The reveal. Without JS, or with reduced motion, these are simply absent and
   every figure is already in its finished state. */
.js .fig .val, .js .fig .ghost { stroke-dasharray: var(--len); stroke-dashoffset: var(--len); }
.js .fig .st { opacity: 0; transform: scale(.4); }
@media (prefers-reduced-motion: reduce) {
  .js .fig .val, .js .fig .ghost { stroke-dashoffset: 0; }
  .js .fig .st { opacity: 1; transform: none; }
}
`;

// --- behaviour --------------------------------------------------------------
export const FIGURE_JS = `
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  var figs = [].slice.call(document.querySelectorAll('.fig'));
  if (!figs.length) return;

  // Dash lengths have to be measured, not guessed — an arc's length depends on
  // its radius and sweep, and getting it wrong leaves a visible stub.
  figs.forEach(function (fig) {
    [].slice.call(fig.querySelectorAll('.val, .ghost')).forEach(function (p) {
      p.style.setProperty('--len', p.getTotalLength());
    });
  });
  if (reduce) { figs.forEach(function (f) { draw(f, 1); }); return; }

  ${RING_FN}

  function draw(fig, p) {
    var kind = fig.getAttribute('data-fig');
    if (kind === 'magic-ring') {
      var yarn = fig.querySelector('.yarn');
      // phase 1 draw the spiral, phase 2 pull it closed, phase 3 work the round
      var a = Math.min(p / 0.42, 1), b = Math.max(0, Math.min((p - 0.38) / 0.34, 1)), d = Math.max(0, (p - 0.66) / 0.34);
      yarn.setAttribute('d', ringPath(ease(b)));
      var L = yarn.getTotalLength();
      yarn.style.strokeDasharray = L;
      yarn.style.strokeDashoffset = L * (1 - ease(a));
      var sts = fig.querySelectorAll('.st');
      for (var i = 0; i < sts.length; i++) {
        var s = Math.max(0, Math.min((d * 1.45) * sts.length - i, 1));
        sts[i].style.opacity = s;
        sts[i].style.transform = 'scale(' + (0.4 + 0.6 * ease(s)) + ')';
      }
      var steps = fig.querySelectorAll('.fig-step span');
      var at = p > 0.66 ? 2 : p > 0.38 ? 1 : 0;
      for (var j = 0; j < steps.length; j++) steps[j].classList.toggle('on', j === at);
      return;
    }
    // gauges: the ghost arc draws first, then the real one over it
    var g = fig.querySelector('.ghost'), v = fig.querySelector('.val');
    var gp = g ? Math.min(p / 0.45, 1) : 0, vp = g ? Math.max(0, (p - 0.3) / 0.7) : p;
    if (g) g.style.strokeDashoffset = g.getTotalLength() * (1 - ease(gp));
    v.style.strokeDashoffset = v.getTotalLength() * (1 - ease(Math.min(vp, 1)));
    var ticks = fig.querySelectorAll('.tick.on');
    for (var k = 0; k < ticks.length; k++) {
      ticks[k].style.opacity = ease(Math.min(vp, 1)) * ticks.length > k ? 0.75 : 0;
    }
  }
  function ease(t) { t = Math.max(0, Math.min(1, t)); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  var ticking = false;
  function frame() {
    ticking = false;
    var vh = innerHeight;
    figs.forEach(function (fig) {
      var r = fig.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var p = (vh * 0.88 - r.top) / (vh * 0.5 + r.height * 0.45);
      draw(fig, Math.max(0, Math.min(1, p)));
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  addEventListener('load', frame);
  frame();
})();
`;
