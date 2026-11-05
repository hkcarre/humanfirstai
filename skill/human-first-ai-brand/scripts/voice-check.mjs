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
  .filter(p => p && !/^(#|>|-|\d+\.|\||```)/.test(p));
const body = paras.join(' ');
const words = body.split(/\s+/).filter(Boolean);
const sentences = body.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 1);
const wordsPerPara = words.length / (paras.length || 1);
const wordsPerSent = words.length / (sentences.length || 1);
const longSentences = sentences.filter(s => s.split(/\s+/).length > 25);
const bangs = (text.match(/!/g) || []).length;

const PASS = '  ok  ', FAIL = '  !!  ';
const line = () => console.log('-'.repeat(72));
let problems = 0;

console.log(`\nVoice check — ${file}`);
line();
console.log(`  ${words.length} words · ${sentences.length} sentences · ${paras.length} paragraphs\n`);

const judge = (ok, label, detail) => {
  if (!ok) problems++;
  console.log((ok ? PASS : FAIL) + label.padEnd(34) + detail);
};

judge(wordsPerPara >= 15 && wordsPerPara <= 35, 'paragraph shape',
  `${wordsPerPara.toFixed(1)} words a paragraph` +
  (wordsPerPara < 15 ? '  — too staccato. Join sentences into paragraphs.'
   : wordsPerPara > 35 ? '  — too dense. Break them up.' : '  (target 15-35)'));

judge(wordsPerSent <= 22, 'sentence length',
  `${wordsPerSent.toFixed(1)} words a sentence` + (wordsPerSent > 22 ? '  — shorten them.' : '  (target under 22)'));

judge(longSentences.length === 0, 'long sentences',
  longSentences.length === 0 ? 'none over 25 words' : `${longSentences.length} over 25 words`);

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
