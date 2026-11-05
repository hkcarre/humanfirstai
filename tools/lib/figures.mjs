// ---------------------------------------------------------------------------
//  Figures for "Give Yourself the Grace to Be Bad at It".
//
//  Second design. The first one drew every figure as a ring, to echo the
//  magic ring. It looked consistent, but the shape didn't fit the numbers:
//  a gauge asks readers to judge an angle, and "2× more likely" overstated
//  Flynn & Lake. These follow how crochet tutorials draw the ring, and how
//  data teams show numbers like these:
//
//    - each figure's headline states its takeaway; readers remember a
//      chart's title better than the chart itself
//    - labels sit next to the data, not in a legend
//    - comparisons are lengths, not angles (Cleveland & McGill)
//    - a proportion shows the whole group, all 100, not just the 48
//    - every number is the paper's own: Slack Workforce Index 2024;
//      Flynn & Lake 2008, Study 1 (20.5 guessed vs 10.5 actual asks for
//      5 yeses); Breines & Chen 2012, Exp. 3 (306.5 s vs 203.2 s)
//
//  All of it is static SVG and HTML. Nothing animates, so nothing can render
//  blank if a script fails, and nothing needs prefers-reduced-motion handling.
// ---------------------------------------------------------------------------

const f = n => (Math.round(n * 10) / 10).toFixed(1);

// --- 1. the magic ring ------------------------------------------------------
//  Drawn the way PlanetJune and Sarah Maker show it: the tail crosses the
//  working yarn, stitches are worked over the loop AND the tail, and pulling
//  the tail closes them into a flat disc with no hole. A centre hole, petal
//  stitches or a missing crossing are what make crocheters say a drawing is
//  wrong.
const RING = `<g><path d="M50 236 C72 212 98 190 132 170" class="yarn"/><path d="M132 170 C174 148 180 90 150 64 C122 40 76 50 66 88 C56 126 80 162 106 174" class="yarn"/><path d="M102 170 C128 188 152 206 182 232" class="gap"/><path d="M102 170 C128 188 152 206 182 232" class="yarn"/><path d="M226 20 L134 104" class="hook"/><path d="M134 104 q-10 6 -13 -4 q-1 -7 7 -9" class="hook"/><text x="14" y="200" class="tl">yarn</text><text x="186" y="206" class="tl">tail</text></g><g transform="translate(240 0)"><circle cx="120" cy="112" r="52" class="yarn"/><path d="M120 164 C124 192 118 216 124 236" class="yarn"/><path d="M115.6 153.8 L112.1 187.6 A76 76 0 0 1 55.5 152.3 L84.4 134.3 A42 42 0 0 0 115.6 153.8Z" class="st"/><g transform="translate(84.0 169.7) rotate(212.0)"><path d="M-27.9 -4 Q0 6 27.9 -4" class="v"/><path d="M-27.9 3 Q0 -7 27.9 3" class="v"/></g><path d="M82.9 131.7 L52.9 147.7 A76 76 0 0 1 50.6 81.1 L81.6 94.9 A42 42 0 0 0 82.9 131.7Z" class="st"/><g transform="translate(52.0 114.4) rotate(268.0)"><path d="M-27.9 -4 Q0 6 27.9 -4" class="v"/><path d="M-27.9 3 Q0 -7 27.9 3" class="v"/></g><path d="M82.9 92.3 L52.9 76.3 A76 76 0 0 1 106.8 37.2 L112.7 70.6 A42 42 0 0 0 82.9 92.3Z" class="st"/><g transform="translate(80.0 57.0) rotate(324.0)"><path d="M-27.9 -4 Q0 6 27.9 -4" class="v"/><path d="M-27.9 3 Q0 -7 27.9 3" class="v"/></g><path d="M214 34 L160 84" class="hook"/><path d="M160 84 q-10 5 -12 -4 q0 -7 7 -8" class="hook"/><text x="134" y="238" class="tl">tail</text></g><g transform="translate(480 0)"><path d="M120 112 C150 142 168 188 178 230" class="yarn"/><path d="M165 216 L179 235 L190 213" class="arrow"/><path d="M120.0 111.9 L120.0 52.0 A60 60 0 0 1 172.0 82.0 L120.1 112.0 A0.1 0.1 0 0 0 120.0 111.9Z" class="st"/><g transform="translate(146.0 67.0) rotate(30.0)"><path d="M-24.2 -4 Q0 6 24.2 -4" class="v"/><path d="M-24.2 3 Q0 -7 24.2 3" class="v"/></g><path d="M120.1 112.0 L172.0 82.0 A60 60 0 0 1 172.0 142.0 L120.1 112.0 A0.1 0.1 0 0 0 120.1 112.0Z" class="st"/><g transform="translate(172.0 112.0) rotate(90.0)"><path d="M-24.2 -4 Q0 6 24.2 -4" class="v"/><path d="M-24.2 3 Q0 -7 24.2 3" class="v"/></g><path d="M120.1 112.0 L172.0 142.0 A60 60 0 0 1 120.0 172.0 L120.0 112.1 A0.1 0.1 0 0 0 120.1 112.0Z" class="st"/><g transform="translate(146.0 157.0) rotate(150.0)"><path d="M-24.2 -4 Q0 6 24.2 -4" class="v"/><path d="M-24.2 3 Q0 -7 24.2 3" class="v"/></g><path d="M120.0 112.1 L120.0 172.0 A60 60 0 0 1 68.0 142.0 L119.9 112.0 A0.1 0.1 0 0 0 120.0 112.1Z" class="st"/><g transform="translate(94.0 157.0) rotate(210.0)"><path d="M-24.2 -4 Q0 6 24.2 -4" class="v"/><path d="M-24.2 3 Q0 -7 24.2 3" class="v"/></g><path d="M119.9 112.0 L68.0 142.0 A60 60 0 0 1 68.0 82.0 L119.9 112.0 A0.1 0.1 0 0 0 119.9 112.0Z" class="st"/><g transform="translate(68.0 112.0) rotate(270.0)"><path d="M-24.2 -4 Q0 6 24.2 -4" class="v"/><path d="M-24.2 3 Q0 -7 24.2 3" class="v"/></g><path d="M119.9 112.0 L68.0 82.0 A60 60 0 0 1 120.0 52.0 L120.0 111.9 A0.1 0.1 0 0 0 119.9 112.0Z" class="st"/><g transform="translate(94.0 67.0) rotate(330.0)"><path d="M-24.2 -4 Q0 6 24.2 -4" class="v"/><path d="M-24.2 3 Q0 -7 24.2 3" class="v"/></g></g>`;

function magicRing() {
  return `
<figure class="gv gv-ring">
<p class="gv-head">The magic ring, in three steps</p>
<svg viewBox="0 0 720 250" role="img" aria-labelledby="gv-r"><title id="gv-r">Three-step drawing of a magic ring. One: the yarn tail crosses over the working yarn to make a loop, and the hook goes in. Two: stitches are worked around both the loop and the tail. Three: pulling the tail closes six stitches into a flat circle with no hole.</title>${RING}</svg>
<div class="gv-steps" aria-hidden="true"><span>1. Cross the tail over the yarn</span><span>2. Stitch around the loop and the tail</span><span>3. Pull the tail to close it</span></div>
<figcaption>It is a common way to start crochet in the round. Let go of the tail before you pull it and the stitches slide right off.</figcaption>
</figure>`;
}

// --- 2. Slack: 48 of every 100 ----------------------------------------------
//  A 10×10 grid filled row by row. Icon arrays help readers with any level
//  of comfort with numbers (Galesic et al. 2009), and drawing the other 52
//  stops the reader forgetting how big the whole group is.
function hiddenHalf() {
  const dots = [];
  for (let i = 0; i < 100; i++) {
    const x = 16 + (i % 10) * 32, y = 16 + Math.floor(i / 10) * 32;
    dots.push(i < 48
      ? `<circle cx="${x}" cy="${y}" r="12.5" class="on"/>`
      : `<circle cx="${x}" cy="${y}" r="11.5" class="off"/>`);
  }
  return `
<figure class="gv gv-slack">
<p class="gv-head">Almost half would feel awkward telling their boss</p>
<div class="gv-side">
<svg viewBox="0 0 320 320" role="img" aria-labelledby="gv-s"><title id="gv-s">Grid of 100 circles, 48 filled: 48 in every 100 desk workers would feel uncomfortable telling their manager they used AI.</title>${dots.join('')}</svg>
<p class="gv-call"><span class="gv-num">48</span><span class="gv-of">of every 100</span> desk workers would feel uncomfortable telling their manager they used AI.</p>
</div>
<figcaption>Survey of 17,372 desk workers in 15 countries. <a href="https://slack.com/blog/news/the-fall-2024-workforce-index-shows-executives-and-employees-investing-in-ai-but-uncertainty-holding-back-adoption">Slack Workforce Index, 2024</a></figcaption>
</figure>`;
}

// --- 3. Flynn & Lake: guessed vs actual asks --------------------------------
//  One circle per stranger asked, every yes filled. The guess is muted and
//  the real result is bold, so the second row coming out half as long is
//  the whole point. A trailing half circle shows the .5 in each average.
function askRow(asks, yeses, mute, id, title) {
  const n = Math.floor(asks), every = Math.round(asks / yeses), step = 33.5;
  const out = [];
  for (let i = 0; i < n; i++) {
    const x = 16 + i * step;
    out.push((i + 1) % every === 0 && out.filter(s => s.includes('yes')).length < yeses
      ? `<circle cx="${f(x)}" cy="17" r="13" class="yes${mute ? ' mute' : ''}"/>`
      : `<circle cx="${f(x)}" cy="17" r="12" class="no"/>`);
  }
  if (asks % 1) {
    const x = 16 + n * step;
    out.push(`<clipPath id="${id}h"><rect x="${f(x - 15)}" y="0" width="15" height="34"/></clipPath>`
      + `<circle cx="${f(x)}" cy="17" r="12" class="no" clip-path="url(#${id}h)"/>`);
  }
  return `<svg viewBox="0 0 720 34" role="img" aria-labelledby="${id}"><title id="${id}">${title}</title>${out.join('')}</svg>`;
}

function askGap() {
  return `
<figure class="gv gv-flynn">
<p class="gv-head">People say yes more often than we think</p>
<p class="gv-sub">How many strangers you have to ask to get 5 yeses <span class="gv-dot"></span> = a yes</p>
<div class="gv-row mute"><span>What people guessed</span><b>20.5 asks</b></div>
${askRow(20.5, 5, true, 'gv-f1', 'Row of 20 and a half circles, 5 filled: people guessed they would need to ask about 20 strangers to get 5 yeses.')}
<div class="gv-row"><span>What it actually took</span><b>10.5 asks</b></div>
${askRow(10.5, 5, false, 'gv-f2', 'Row of 10 and a half circles, 5 filled: it actually took asking about 10, half as many.')}
<p class="gv-note">About half as many asks as people expected.</p>
<figcaption>Students asking strangers to fill out a short questionnaire. These are averages, hence the half person. <a href="https://doi.org/10.1037/0022-3514.95.1.128">Flynn &amp; Lake, 2008</a>, Study 1</figcaption>
</figure>`;
}

// --- 4. Breines & Chen: minutes spent studying ------------------------------
//  Two bars from zero, in real minutes and seconds, with the gap written out.
//  The comparison is against students who got no message; against the
//  "you must be smart" group the gap was smaller and not clear-cut, which is
//  why neither the article nor this figure uses that group.
function graceArc() {
  const none = 203.2, kind = 306.5;
  const mmss = s => `${Math.floor(s / 60)} min ${Math.round(s % 60)} s`;
  return `
<figure class="gv gv-breines">
<p class="gv-head">Being kind to yourself kept them studying longer</p>
<p class="gv-sub">Time spent studying after failing a hard test, before a second try</p>
<div class="gv-row mute"><span>No message</span><b>${mmss(none)}</b></div>
<div class="gv-bar" style="width:${f((none / kind) * 100)}%" role="img" aria-label="No message: 3 minutes 23 seconds"></div>
<div class="gv-row"><span>Told “you’re not alone” and “try not to be too hard on yourself”</span><b>${mmss(kind)}</b></div>
<div class="gv-bar hi" style="width:100%" role="img" aria-label="Kind message: 5 minutes 7 seconds"></div>
<p class="gv-note">+1 min 44 s, about 50% longer.</p>
<figcaption>Students who failed a hard vocabulary test, with as long as they wanted to study for a retest. <a href="https://doi.org/10.1177/0146167212445599">Breines &amp; Chen, 2012</a>, Experiment 3</figcaption>
</figure>`;
}

export const FIGURES = {
  'magic-ring': magicRing,
  'hidden-half': hiddenHalf,
  'ask-gap': askGap,
  'grace-arc': graceArc,
};

// --- styles -----------------------------------------------------------------
//  Built on the page tokens (--hf-*), so dark mode comes for free.
export const FIGURE_CSS = `
/* ---- figures and photographs share the outer rhythm ---- */
.fig, .gv { margin: 3rem 0; }

.gv-head { font-family: var(--hf-font-brand); font-weight: 800; color: var(--hf-text); font-size: 1.375rem; line-height: 1.3; margin: 0 0 .35rem; letter-spacing: -.01em; }
.gv-sub { margin: 0 0 .6rem; font-size: .9375rem; line-height: 1.45; color: var(--hf-text-muted); }
.gv-dot { display: inline-block; width: .7rem; height: .7rem; border-radius: 50%; background: var(--hf-sunrise); margin: 0 .15rem 0 .4rem; vertical-align: -1px; }
.gv svg { display: block; width: 100%; height: auto; }
.gv .on, .gv .yes { fill: var(--hf-sunrise); }
.gv .yes.mute { opacity: .45; }
.gv .off, .gv .no { fill: none; stroke: var(--hf-text-muted); stroke-width: 2.5; opacity: .55; }
.gv-side { display: grid; grid-template-columns: minmax(0, 17rem) 1fr; gap: 1.5rem; align-items: center; margin-top: .8rem; }
.gv-call { margin: 0; font-size: 1.0625rem; line-height: 1.45; color: var(--hf-text); }
.gv-num { display: block; font-family: var(--hf-font-brand); font-weight: 800; font-size: 4rem; line-height: 1; letter-spacing: -.03em; color: var(--hf-text); }
.gv-of { display: block; font-family: var(--hf-font-brand); font-weight: 700; font-size: 1.125rem; line-height: 1.3; margin: .1rem 0 .5rem; }
@media (max-width: 34rem) { .gv-side { grid-template-columns: 1fr; } .gv-side svg { max-width: 18rem; } }
.gv-row { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; margin: 1.1rem 0 .45rem; font-family: var(--hf-font-brand); font-weight: 700; font-size: .95rem; line-height: 1.35; color: var(--hf-text); }
.gv-row b { color: var(--hf-text-accent); font-size: 1.25rem; white-space: nowrap; }
.gv-row.mute, .gv-row.mute b { color: var(--hf-text-muted); }
.gv-note { margin: .9rem 0 0; font-family: var(--hf-font-brand); font-weight: 700; font-size: 1rem; line-height: 1.4; color: var(--hf-text-accent); }
.gv-bar { height: 1.5rem; border-radius: 999px; background: var(--hf-text-muted); opacity: .5; }
.gv-bar.hi { background: var(--hf-sunrise); opacity: 1; }
.gv-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; margin: .6rem 0 0; text-align: center; font-family: var(--hf-font-brand); font-weight: 700; font-size: .875rem; line-height: 1.3; color: var(--hf-text); }
.gv figcaption { margin: 1rem 0 0; font-size: .9375rem; line-height: 1.55; color: var(--hf-text-muted); }
.gv figcaption a { color: var(--hf-text-accent); }
.gv-ring .yarn { fill: none; stroke: var(--hf-sunrise); stroke-width: 7; stroke-linecap: round; stroke-linejoin: round; }
.gv-ring .gap { fill: none; stroke: var(--hf-surface); stroke-width: 15; stroke-linecap: round; }
.gv-ring .st { fill: var(--hf-sunrise); stroke: var(--hf-surface); stroke-width: 3; stroke-linejoin: round; }
.gv-ring .v { fill: none; stroke: var(--hf-surface); stroke-width: 2.5; stroke-linecap: round; opacity: .85; }
.gv-ring .hook { fill: none; stroke: var(--hf-text); stroke-width: 7; stroke-linecap: round; opacity: .7; }
.gv-ring .arrow { fill: none; stroke: var(--hf-text); stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; opacity: .65; }
.gv-ring .tl { font: 700 20px var(--hf-font-brand), system-ui, sans-serif; fill: var(--hf-text-muted); }
`;

// --- behaviour --------------------------------------------------------------
//  None. The old scroll animation also matched the photographs (they share
//  .fig), threw on them, and left the gauges blank for every reader.
export const FIGURE_JS = '';
