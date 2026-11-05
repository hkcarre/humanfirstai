import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
//  Brand knowledge engine.
//
//  GitHub is the authority. This file does not hold rules — it EXTRACTS them
//  from what is already approved and committed, and refuses to invent any.
//
//  Three sources, all already in the repository:
//    1. references/checklist.md   — every "- [ ]" line is literally a rule
//    2. scripts/voice-check.mjs   — the banned-term list and the thresholds
//    3. docs/*.md                 — prose policy, carried as context for the
//                                   agents rather than parsed into rules
//
//  Every rule carries the file it came from, the line, and the commit SHA of
//  the working tree, so any decision can be traced back to approved text.
//
//      node tools/editorial/policy.mjs            human-readable summary
//      node tools/editorial/policy.mjs --json     the machine-readable policy
// ---------------------------------------------------------------------------

// fileURLToPath, not url.pathname: this project lives in a folder with a
// space in its name, and pathname hands back "humanfirst%20ai".
export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const CHECKLIST = 'skill/human-first-ai-brand/references/checklist.md';
const VOICE = 'skill/human-first-ai-brand/scripts/voice-check.mjs';

const read = p => readFileSync(`${ROOT}${p}`, 'utf8');

/** The commit the policy was read at. An article records this, so a later
 *  dispute can diff the rules as they stood. */
export function policyRevision() {
  try {
    const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT }).toString().trim();
    const dirty = execFileSync('git', ['status', '--porcelain'], { cwd: ROOT }).toString().trim() !== '';
    return { sha, dirty, repo: 'hkcarre/humanfirstai' };
  } catch { return { sha: 'UNKNOWN', dirty: true, repo: 'hkcarre/humanfirstai' }; }
}

// --- 1. the checklist ------------------------------------------------------
// "Run this before anything goes out. All of it, not the convenient parts."
// So every item is mandatory, except where the document itself scopes it.
function checklistRules() {
  const lines = read(CHECKLIST).split('\n');
  const rules = [];
  let section = 'General', n = 0;
  lines.forEach((line, i) => {
    const h = line.match(/^##\s+(.*)$/);
    if (h) { section = h[1].trim(); return; }
    const m = line.match(/^- \[ \]\s+(.*)$/);
    if (!m || section === 'Then') return;
    const text = m[1].trim();
    rules.push({
      id: `CL-${String(++n).padStart(3, '0')}`,
      category: section,
      description: text.replace(/`/g, ''),
      mandatory: true,
      // The checklist states its own exemptions; we read them rather than guess.
      appliesTo: /guest/i.test(text) ? 'guest-pieces'
        : /translation/i.test(text) ? 'translations' : 'all',
      sourcePath: CHECKLIST,
      sourceLine: i + 1,
      sourceText: line.trim(),
      priority: section === 'Images' || section === 'Reach' ? 1 : 2,
      validation: /voice-check|contrast|phonemes:check|clears 4\.5|clears 3:1/i.test(text)
        ? 'deterministic' : 'agent',
    });
  });
  return rules;
}

// --- 2. the voice checker --------------------------------------------------
function voiceRules() {
  const src = read(VOICE);
  const grab = name => {
    const m = src.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\];`));
    return m ? [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]) : [];
  };
  const banned = grab('BANNED');
  const hedge = grab('HEDGE');
  const lineOf = needle => src.split('\n').findIndex(l => l.includes(needle)) + 1;
  const rules = [];
  if (banned.length) rules.push({
    id: 'VC-001', category: 'Voice',
    description: `Banned terms, when used in our own voice: ${banned.join(', ')}. Quoted jargon is allowed — naming a word to puncture it is the point.`,
    mandatory: true, appliesTo: 'all', sourcePath: VOICE, sourceLine: lineOf('const BANNED'),
    sourceText: `const BANNED = [${banned.length} terms]`, priority: 1, validation: 'deterministic',
    terms: banned,
    compliantExample: 'They will start AI committees and publish strategies explaining why the organisation is now "AI-first".',
    nonCompliantExample: 'Our AI-powered platform unlocks seamless, revolutionary synergies.',
  });
  if (hedge.length) rules.push({
    id: 'VC-002', category: 'Voice',
    description: `Intensifiers to avoid (more than two is a failure): ${hedge.join(', ')}.`,
    mandatory: true, appliesTo: 'all', sourcePath: VOICE, sourceLine: lineOf('const HEDGE'),
    sourceText: `const HEDGE = [${hedge.length} terms]`, priority: 2, validation: 'deterministic',
    terms: hedge,
  });
  rules.push({
    id: 'VC-003', category: 'Voice',
    description: 'Paragraph shape 15–35 words, sentences under 22, none over 25. Word targets scale by language; shape must still match the original.',
    mandatory: true, appliesTo: 'all', sourcePath: VOICE, sourceLine: lineOf('const EXPANSION'),
    sourceText: 'EXPANSION / T thresholds', priority: 2, validation: 'deterministic',
  });
  rules.push({
    id: 'VC-004', category: 'Voice',
    description: 'No exclamation marks in our own voice.',
    mandatory: true, appliesTo: 'all', sourcePath: VOICE, sourceLine: lineOf('const bangs'),
    sourceText: 'bangs === 0', priority: 2, validation: 'deterministic',
  });
  return rules;
}

// --- 3. the prose policy ---------------------------------------------------
// Not parsed into rules. Carried as context so an agent can read the actual
// approved text, with its path, rather than a paraphrase of it.
function policyDocuments() {
  const out = [];
  for (const dir of ['docs', 'skill/human-first-ai-brand/references']) {
    if (!existsSync(`${ROOT}${dir}`)) continue;
    for (const f of readdirSync(`${ROOT}${dir}`).filter(x => x.endsWith('.md')).sort()) {
      const p = `${dir}/${f}`;
      const body = read(p);
      out.push({
        path: p,
        title: (body.match(/^#\s+(.*)$/m) || [, f])[1],
        headings: [...body.matchAll(/^##\s+(.*)$/gm)].map(m => m[1]),
        words: body.split(/\s+/).filter(Boolean).length,
      });
    }
  }
  return out;
}

// --- precedence ------------------------------------------------------------
// Section 3.2 of the specification. An article-specific instruction may never
// override a mandatory compliance or brand rule.
export const PRECEDENCE = [
  'Mandatory legal and compliance requirements',
  'Approved brand governance policies',
  'Mandatory tone-of-voice and terminology rules',
  'Channel-specific editorial standards',
  'Article-specific instructions',
  'General editorial best practice',
];

export function loadPolicy() {
  const rules = [...checklistRules(), ...voiceRules()];
  const conflicts = [];
  const seen = new Map();
  for (const r of rules) {
    const k = r.description.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (seen.has(k)) conflicts.push({ type: 'duplicate', a: seen.get(k), b: r.id, text: r.description });
    else seen.set(k, r.id);
  }
  return {
    revision: policyRevision(),
    generated: new Date().toISOString(),
    precedence: PRECEDENCE,
    counts: { rules: rules.length, mandatory: rules.filter(r => r.mandatory).length,
      deterministic: rules.filter(r => r.validation === 'deterministic').length },
    conflicts,                      // flagged, never silently resolved
    rules,
    documents: policyDocuments(),
  };
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('policy.mjs')) {
  const p = loadPolicy();
  if (process.argv.includes('--json')) { console.log(JSON.stringify(p, null, 2)); process.exit(0); }
  console.log(`\nBrand policy — ${p.revision.repo} @ ${p.revision.sha.slice(0, 7)}${p.revision.dirty ? ' (working tree dirty)' : ''}`);
  console.log('-'.repeat(72));
  console.log(`  ${p.counts.rules} rules · ${p.counts.mandatory} mandatory · ${p.counts.deterministic} machine-checkable`);
  console.log(`  ${p.documents.length} policy documents carried as context\n`);
  const by = {};
  for (const r of p.rules) (by[r.category] ||= []).push(r);
  for (const [c, rs] of Object.entries(by)) console.log(`  ${c.padEnd(20)} ${rs.length}`);
  if (p.conflicts.length) {
    console.log(`\n  ${p.conflicts.length} conflict(s) flagged for human resolution:`);
    for (const c of p.conflicts) console.log(`    ${c.a} vs ${c.b}: ${c.text.slice(0, 60)}`);
  }
  console.log();
}
