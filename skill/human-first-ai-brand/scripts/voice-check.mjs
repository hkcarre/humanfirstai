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

const paras = text.split(/\n\s*\n/)
  .map(p => p.trim())
  .filter(p => p && !/^(#|>|-|\d+\.|\||```|!\[)/.test(p));   // ![img] is not prose
const body = paras.join(' ');
const words = body.split(/\s+/).filter(Boolean);
const sentences = body.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 1);
const wordsPerPara = words.length / (paras.length || 1);
const wordsPerSent = words.length / (sentences.length || 1);
const longSentences = sentences.filter(s => s.split(/\s+/).length > T.long);
// Images are written ![alt](src) — that exclamation mark is syntax, not tone.
const bangs = (text.replace(/!\[[^\]]*\]\([^)]*\)/g, '').match(/!/g) || []).length;

const PASS = '  ok  ', FAIL = '  !!  ';
const line = () => console.log('-'.repeat(72));
let problems = 0;

console.log(`\nVoice check — ${file}`);
line();
console.log(`  ${words.length} words · ${sentences.length} sentences · ${paras.length} paragraphs`);
console.log(X === 1 ? '' : `  language ${lang} — word targets scaled ×${X} for expansion\n`);

const judge = (ok, label, detail) => {
  if (!ok) problems++;
  console.log((ok ? PASS : FAIL) + label.padEnd(34) + detail);
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

console.log(problems === 0
  ? '\nReads like us. Now read it aloud — if you stumble, a reader will too.\n'
  : `\n${problems} thing${problems === 1 ? '' : 's'} to look at before this goes out.\n`);
process.exit(problems === 0 ? 0 : 1);
