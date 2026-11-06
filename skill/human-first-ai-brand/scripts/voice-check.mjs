#!/usr/bin/env node
// Human First AI — voice checker. No dependencies.
//
//   node voice-check.mjs draft.md
//   node voice-check.mjs draft.md --verbose     also lists every flagged line
//
// Checks the three things that most often make a draft off-brand:
//   1. banned words used in our own voice (quoted jargon is allowed)
//   2. paragraph shape — one-line paragraphs are a performance, not our voice
//   3. sentence length
//
// It cannot tell you whether the writing is any good. Read it aloud for that.

import { readFileSync } from 'node:fs';

const BANNED = [
  'AI-powered', 'AI-first', 'unlock', 'unlocking', 'supercharge', 'revolutionise', 'revolutionize',
  'revolutionary', 'disrupt', 'disruptive', 'seamless', 'cutting-edge', 'best-in-class', 'robust',
  'leverage', 'leveraging', 'democratise', 'democratize', 'empower', 'empowering', 'game-changing',
  'next-generation', 'paradigm', 'ecosystem', 'synergy', 'synergies', 'holistic', 'transformation',
  'transformative', 'hallucinate', 'hallucination', 'prompt engineering', 'thought leader',
  'deep dive', 'move the needle', 'low-hanging fruit', 'double down', 'at scale', 'frictionless',
];
const HEDGE = ['very', 'really', 'incredibly', 'extremely', 'truly', 'literally', 'absolutely'];

const file = process.argv[2];
const verbose = process.argv.includes('--verbose');
if (!file || file === '--help' || file === '-h') {
  console.log(`Human First AI — voice checker

  voice-check.mjs <file.md> [--verbose]

Targets: 15-35 words a paragraph, under 25 words a sentence,
zero banned terms outside quotation marks, no exclamation marks.`);
  process.exit(file ? 0 : 1);
}

let raw;
try { raw = readFileSync(file, 'utf8'); }
catch (e) { console.error(`Cannot read ${file}: ${e.message}`); process.exit(1); }

const text = raw.replace(/^---\n[\s\S]*?\n---\n/, '');          // drop frontmatter
const lines = text.split('\n');

// Word counts are not comparable across languages. The same sentence takes
// more words in Spanish or French than in English, so an English threshold
// marks a faithful translation as "too dense" for doing its job. The targets
// below are English; these factors restate them in the target language.
// They scale the COUNT, never the shape: paragraph and sentence counts are
// still expected to match the original, and those are what we actually care
// about. Figures are the usual localisation expansion ranges, rounded down.
const EXPANSION = { en: 1, es: 1.2, pt: 1.2, fr: 1.2, it: 1.15, de: 1.1, nl: 1.1 };
const lang = (raw.match(/^---\n[\s\S]*?^lang:\s*([a-z]{2})/m) || [, 'en'])[1];
const X = EXPANSION[lang] || 1;
const T = { para: [15 * X, 35 * X], sent: 22 * X, long: 25 * X };

// Quoted jargon is allowed — naming a word in order to puncture it is the point.
const unquoted = s => s
  .replace(/"[^"]*"/g, ' ').replace(/“[^”]*”/g, ' ')
  .replace(/'[^']*'/g, ' ').replace(/`[^`]*`/g, ' ');

const bad = [];
lines.forEach((line, i) => {
  if (/^\s{0,3}(#|>|\||```)/.test(line)) return;                 // headings, quotes, tables, code
  const clean = unquoted(line);
  for (const w of BANNED) {
    const re = new RegExp(`\\b${w.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
    if (re.test(clean)) bad.push({ line: i + 1, word: w, text: line.trim() });
  }
});

const hedges = [];
lines.forEach((line, i) => {
  if (/^\s{0,3}(#|>|\||```)/.test(line)) return;
  for (const w of HEDGE) {
    if (new RegExp(`\\b${w}\\b`, 'gi').test(unquoted(line))) hedges.push({ line: i + 1, word: w });
  }
});

// Fence delimiters and HTML tags are syntax, not sentences. Left in, a fenced
// block containing a blank line leaks its ``` into the prose and a caption
// ending in </sub> never terminates, so the splitter welds it to the next
// paragraph and reports a sentence nobody wrote.
// A LABELLED fence — ```video, ```figure, ```testimony — holds structure, not
// prose: "file: assets/thing.mp4" is not a sentence and was being counted as a
// 26-word one. Its contents are dropped. A BARE ``` fence is kept, because in a
// reference document that is the copy which actually ships, and it should be
// held to the same rules as everything else.
// Fences nest: a ````markdown block can contain a ```video block, and only a
// marker at least as long as the opening one closes it. Matching any ``` meant
// the inner fence closed the outer one and its contents leaked into the prose.
const prose = (() => {
  const keep = [];
  let open = null;            // { ticks, labelled } or null
  for (const l of text.split('\n')) {
    const fence = l.match(/^\s*(`{3,})(\S*)/);
    if (fence) {
      const ticks = fence[1].length;
      if (open) { if (ticks >= open.ticks) open = null; else if (!open.labelled) keep.push(l); continue; }
      open = { ticks, labelled: Boolean(fence[2]) };
      continue;
    }
    if (!open || !open.labelled) keep.push(l);
  }
  return keep.join('\n');
})().replace(/<\/?[a-z][^>]*>/gi, '');

const paras = prose.split(/\n\s*\n/)
  .map(p => p.trim())
  .filter(p => p && !/^(#|>|-|\d+\.|\||!\[)/.test(p));        // ![img] is not prose
const body = paras.join(' ');
const words = body.split(/\s+/).filter(Boolean);
// Allow a closing quote after the terminal punctuation. Without it, every line
// of dialogue welds to the sentence after it: `said "I don't know." "With
// respect," he says` counted as one 33-word sentence. Two narrative articles
// were each flagged for four or five over-long sentences that did not exist.
// ...and a markdown emphasis marker after that: *"…a long time."* Then an AI…
const sentences = body.split(/(?<=[.!?]["'’”»]?[*_`]*)\s+/).filter(s => s.trim().length > 1);
const wordsPerPara = words.length / (paras.length || 1);
const wordsPerSent = words.length / (sentences.length || 1);
const longSentences = sentences.filter(s => s.split(/\s+/).length > T.long);
// Images are written ![alt](src) — that exclamation mark is syntax, not tone.
// And the rule is "no exclamation marks IN OUR OWN VOICE": a character saying
// "Love the fresh eyes!" is characterisation, not us shouting. Quoted speech is
// stripped here for the same reason unquoted() strips it for banned terms.
const bangs = (unquoted(text.replace(/!\[[^\]]*\]\([^)]*\)/g, '')).match(/!/g) || []).length;

const PASS = '  ok  ', FAIL = '  !!  ';
const line = () => console.log('-'.repeat(72));
let problems = 0;

console.log(`\nVoice check — ${file}`);
line();
console.log(`  ${words.length} words · ${sentences.length} sentences · ${paras.length} paragraphs`);
console.log(X === 1 ? '' : `  language ${lang} — word targets scaled ×${X} for expansion\n`);

// A piece carrying someone else's byline is in someone else's voice. These
// rules describe how HUMAN FIRST AI writes; they are not a licence to edit a
// guest's prose into our house style. For a guest piece the findings are still
// printed in full — the author may want them — but they are notes to pass on,
// not failures to fix on their behalf.
// Keyed on `guest`, NOT on `author`. A byline does not mean the piece is
// outside our voice — most of what we publish is written by someone in the
// movement and is held to every rule here. Conflating the two would have
// silently stopped checking any article the moment it got a name on it.
const GUEST = /^---\n[\s\S]*?^guest:\s*true\s*$/m.test(raw);
const NOTE = '  --  ';

const judge = (ok, label, detail) => {
  if (!ok && !GUEST) problems++;
  console.log((ok ? PASS : GUEST ? NOTE : FAIL) + label.padEnd(34) + detail);
};

judge(wordsPerPara >= T.para[0] && wordsPerPara <= T.para[1], 'paragraph shape',
  `${wordsPerPara.toFixed(1)} words a paragraph` +
  (wordsPerPara < T.para[0] ? '  — too staccato. Join sentences into paragraphs.'
   : wordsPerPara > T.para[1] ? '  — too dense. Break them up.'
   : `  (target ${T.para[0].toFixed(0)}-${T.para[1].toFixed(0)})`));

judge(wordsPerSent <= T.sent, 'sentence length',
  `${wordsPerSent.toFixed(1)} words a sentence`
  + (wordsPerSent > T.sent ? '  — shorten them.' : `  (target under ${T.sent.toFixed(0)})`));

judge(longSentences.length === 0, 'long sentences',
  longSentences.length === 0 ? `none over ${T.long.toFixed(0)} words`
    : `${longSentences.length} over ${T.long.toFixed(0)} words`);

judge(bangs === 0, 'exclamation marks', bangs === 0 ? 'none' : `${bangs} found — we do not use them`);

judge(bad.length === 0, 'banned terms',
  bad.length === 0 ? 'none in our own voice' : `${bad.length} found`);

judge(hedges.length <= 2, 'intensifiers',
  hedges.length ? `${hedges.length} (${[...new Set(hedges.map(h => h.word))].join(', ')})` : 'none');

line();

if (bad.length) {
  console.log('\nBanned terms, in our own voice:\n');
  for (const b of bad) {
    console.log(`  line ${String(b.line).padEnd(5)} "${b.word}"`);
    if (verbose) console.log(`             ${b.text.slice(0, 90)}`);
  }
  console.log('\n  Quoted jargon is fine — naming a word to puncture it is the point.');
  console.log('  These are unquoted. See docs/02-voice.md.');
}

if (verbose && longSentences.length) {
  console.log('\nSentences over 25 words:\n');
  for (const s of longSentences.slice(0, 10)) console.log(`  ${s.trim().slice(0, 110)}…`);
}

const notes = GUEST ? [wordsPerPara < T.para[0] || wordsPerPara > T.para[1], wordsPerSent > T.sent,
  longSentences.length > 0, bangs > 0, bad.length > 0, hedges.length > 2].filter(Boolean).length : 0;

if (GUEST) {
  console.log(`\nGuest byline. These rules describe how we write, not how our`);
  console.log('contributors have to. Nothing above is a failure.');
  console.log(notes
    ? `\n${notes} thing${notes === 1 ? '' : 's'} to raise with the author, if they want them. Their call, not ours.\n`
    : '\nNothing to raise.\n');
  process.exit(0);
}

console.log(problems === 0
  ? '\nReads like us. Now read it aloud — if you stumble, a reader will too.\n'
  : `\n${problems} thing${problems === 1 ? '' : 's'} to look at before this goes out.\n`);
process.exit(problems === 0 ? 0 : 1);
