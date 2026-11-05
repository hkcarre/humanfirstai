import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { ROOT } from './policy.mjs';

// ---------------------------------------------------------------------------
//  Deterministic gates.
//
//  Everything here is decided by code, not by a model. That matters: a score
//  a language model assigns to its own output is not evidence, and the QA
//  auditor needs at least some findings it cannot talk itself out of.
//
//  Reuses the checkers this repository already had rather than restating their
//  rules: voice-check.mjs for voice, check-contrast.mjs for colour.
//
//      node tools/editorial/gates.mjs <article.md>
//      node tools/editorial/gates.mjs <article.md> --json
// ---------------------------------------------------------------------------

const VOICE_CHECK = `${ROOT}skill/human-first-ai-brand/scripts/voice-check.mjs`;

const strip = md => md.replace(/^---\n[\s\S]*?\n---\n/, '');
const frontmatter = md => Object.fromEntries(
  ((md.match(/^---\n([\s\S]*?)\n---/) || [, ''])[1]).split('\n')
    .map(l => { const i = l.indexOf(':'); return i < 0 ? null : [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
    .filter(Boolean));

/** Paragraphs of actual prose, with their line numbers. */
function paragraphs(md) {
  const body = strip(md);
  const offset = md.slice(0, md.length - body.length).split('\n').length - 1;
  const out = [];
  let buf = [], start = 0;
  body.split('\n').forEach((line, i) => {
    if (!line.trim()) {
      if (buf.length) out.push({ line: offset + start + 1, text: buf.join(' ') });
      buf = []; return;
    }
    if (!buf.length) start = i;
    buf.push(line);
  });
  if (buf.length) out.push({ line: offset + start + 1, text: buf.join(' ') });
  return out.filter(p => !/^(#|```|\|)/.test(p.text));
}

// --- 1. voice --------------------------------------------------------------
function voiceGate(file) {
  let out = '', code = 0;
  try { out = execFileSync('node', [VOICE_CHECK, file], { encoding: 'utf8' }); }
  catch (e) { out = (e.stdout || '') + (e.stderr || ''); code = e.status ?? 1; }
  const rows = [...out.matchAll(/^ {2}(ok|!!|--) {2}(\S[^\n]*?) {2,}(.+)$/gm)]
    .map(m => ({ check: m[2].trim(), status: m[1] === 'ok' ? 'pass' : m[1] === '--' ? 'advisory' : 'fail', detail: m[3].trim() }));
  const guest = /Guest byline/.test(out);
  return {
    id: 'G1', name: 'Voice and terminology', rule: 'VC-001..004, CL Voice',
    status: rows.some(r => r.status === 'fail') ? 'fail' : rows.some(r => r.status === 'advisory') ? 'warn' : 'pass',
    detail: guest ? 'Guest byline — voice findings are advisory, by policy.' : `${rows.filter(r => r.status === 'pass').length}/${rows.length} checks pass.`,
    guest, rows, exitCode: code,
  };
}

// --- 2. claims -------------------------------------------------------------
// Extracts what the Fact Checker has to verify, and flags figures that are
// stated without a source beside them. It does not decide truth.
// No \b after the unit group: "%" and "×" are already non-word characters, so
// "73% of" never matched and every percentage in every article slipped past
// this gate silently. The test that caught it was itself passing vacuously.
const NUM = /\b\d[\d,.]*\s?(?:%|per\s?cent|percent|million|billion|thousand|×|x\b)|\b\d{4}\b|\b\d[\d,.]{2,}\b/gi;
const HEDGED = /\b(about|roughly|around|approximately|some|nearly|almost|up to|as much as)\b/i;

function claimsGate(md) {
  const found = [];
  for (const p of paragraphs(md)) {
    // Match against the prose only. A DOI inside a link target is not a claim,
    // and "10.1037" arriving as a figure wastes the Fact Checker's attention.
    const prose = p.text.replace(/\]\([^)]*\)/g, ']').replace(/https?:\/\/\S+/g, '');
    const nums = [...prose.matchAll(NUM)].map(m => m[0]);
    if (!nums.length) continue;
    const hasLink = /\]\(https?:\/\/[^)]+\)/.test(p.text);
    const hedged = HEDGED.test(prose);
    found.push({
      line: p.line, figures: [...new Set(nums)], hasSourceLink: hasLink, hedged,
      needsVerification: !hasLink,
      text: p.text.replace(/\s+/g, ' ').slice(0, 220),
    });
  }
  const unsourced = found.filter(c => c.needsVerification && !c.hedged);
  return {
    id: 'G2', name: 'Numeric claims carry a source', rule: 'CL Voice — "Any number stated has a source. If estimated, it says about."',
    status: unsourced.length ? 'warn' : 'pass',
    detail: unsourced.length
      ? `${unsourced.length} paragraph(s) state a figure with no source link and no hedge. The Fact Checker must resolve each.`
      : `${found.length} paragraph(s) with figures, all sourced or hedged.`,
    claims: found,
  };
}

// --- 3. prompt injection ---------------------------------------------------
// A submitted article is untrusted input. If it contains instructions aimed at
// the swarm, that is a finding about the article, not a command to obey.
// These must be narrow. A gate that fires on honest prose gets ignored, and an
// ignored gate is worse than no gate. Two of these were far too broad on the
// first pass: "do not tell" flagged "We do not tell people AI is easy", and a
// bare "you are now" would flag "you are now able to check your own figures".
// An injection is an IMPERATIVE aimed at the system, so require that shape.
const IMP = '(?:^|[.!?]\\s+|\\n\\s*)';          // start of a sentence or a line
const INJECTION = [
  [new RegExp(`${IMP}ignore (all |any )?(previous|prior|above|earlier) instructions`, 'i'), 'instruction override'],
  [new RegExp(`${IMP}disregard (the |all )?(system|previous|above|earlier)`, 'i'), 'instruction override'],
  [/\byou are now (a|an|the|acting as|playing|no longer)\b/i, 'role reassignment'],
  [/\b(ignore|override|bypass) (the |your )?system prompt\b/i, 'system prompt reference'],
  [/<\/?(system|assistant|user)>/i, 'role tag injection'],
  [/^\s*(SYSTEM|ASSISTANT)\s*:/m, 'role tag injection'],
  [new RegExp(`${IMP}do not (report|flag|mention|disclose|reveal)\\b[^.]{0,60}\\b(finding|issue|violation|error|problem|concern|instruction|prompt)`, 'i'), 'suppression request'],
  [new RegExp(`${IMP}output (only|exactly) `, 'i'), 'output coercion'],
  [/\b(approve|pass|accept) this (article|content|submission)\b/i, 'gate coercion'],
  [/\bmark (this|it) as (ready|approved|verified)\b/i, 'gate coercion'],
];
function injectionGate(md) {
  const hits = [];
  strip(md).split('\n').forEach((line, i) => {
    for (const [re, kind] of INJECTION) if (re.test(line)) hits.push({ line: i + 1, kind, text: line.trim().slice(0, 160) });
  });
  return {
    id: 'G3', name: 'Prompt injection in submitted text', rule: 'Spec §10 — defend against prompt injection',
    status: hits.length ? 'fail' : 'pass',
    detail: hits.length ? `${hits.length} passage(s) read as instructions to the system. Treated as article content, never obeyed.` : 'None found.',
    hits,
  };
}

// --- 4. frontmatter --------------------------------------------------------
const REQUIRED = ['title', 'subtitle', 'kicker', 'date', 'readingTime', 'theme', 'tags'];
function frontmatterGate(md) {
  const fm = frontmatter(md);
  const missing = REQUIRED.filter(k => !fm[k]);
  const notes = [];
  if (fm.lang === 'es' && fm.reviewed !== 'true') notes.push('Spanish and not cleared — ships behind the unreviewed notice.');
  if (fm.guest === 'true') notes.push('Guest byline — voice rules are advisory.');
  if (fm.author && !fm.authorPhoto) notes.push('Byline with no authorPhoto.');
  return {
    id: 'G4', name: 'Publishing metadata complete', rule: 'site builder contract',
    status: missing.length ? 'fail' : 'pass',
    detail: missing.length ? `Missing: ${missing.join(', ')}` : 'All required fields present.',
    missing, notes, frontmatter: fm,
  };
}

// --- 5. links --------------------------------------------------------------
async function linksGate(md) {
  const urls = [...new Set([...strip(md).matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(m => m[1]))];
  const results = [];
  for (const u of urls) {
    let code = 0;
    try {
      code = +execFileSync('curl', ['-sL', '-o', process.platform === 'win32' ? 'NUL' : '/dev/null',
        '-w', '%{http_code}', '--max-time', '25', '-A', 'Mozilla/5.0', u], { encoding: 'utf8' }).trim();
    } catch { code = 0; }
    // 403/401 from curl is usually bot-blocking, not a dead link. Reported, not failed.
    results.push({ url: u, code, ok: code >= 200 && code < 400, blocked: code === 401 || code === 403 });
  }
  const dead = results.filter(r => !r.ok && !r.blocked);
  return {
    id: 'G5', name: 'External links resolve', rule: 'CL Reach',
    status: dead.length ? 'fail' : 'pass',
    detail: dead.length ? `${dead.length} dead link(s).`
      : `${results.length} checked; ${results.filter(r => r.blocked).length} bot-blocked but live.`,
    links: results,
  };
}

// --- 6. authorship drift ---------------------------------------------------
// A byline means the opinions are that person's. The first run of this swarm
// produced a final article containing "I find it useful to think of two
// groups" under an author who had written no first person at all, and grew the
// piece by 114 words. The QA auditor logged it as an advisory. It is not an
// advisory: inventing someone's personal view is the same failure as writing
// prose under their name, and it ships looking exactly like their work.
const FIRST_PERSON = /\b(I|I'm|I've|I'd|I'll|my|mine|me)\b/g;
function authorshipGate(md, originalMd, fm) {
  if (!originalMd) return null;
  const prose = t => t.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/\]\([^)]*\)/g, ']');
  const a = prose(originalMd), b = prose(md);
  const had = (a.match(FIRST_PERSON) || []).length;
  const has = (b.match(FIRST_PERSON) || []).length;
  const introduced = [];
  if (fm.author && has > had) {
    for (const line of b.split('\n')) {
      if (!FIRST_PERSON.test(line)) continue;
      FIRST_PERSON.lastIndex = 0;
      if (!a.includes(line.trim()) && line.trim().length > 20) introduced.push(line.trim().slice(0, 160));
    }
  }
  const wa = a.split(/\s+/).filter(Boolean).length, wb = b.split(/\s+/).filter(Boolean).length;
  const growth = wa ? Math.round(((wb - wa) / wa) * 100) : 0;
  const fail = introduced.length > 0;
  return {
    id: 'G6', name: 'Authorship preserved', rule: 'docs/02-voice.md — Guest bylines; a byline means the voice is theirs',
    status: fail ? 'fail' : growth > 20 ? 'warn' : 'pass',
    detail: fail
      ? `${introduced.length} new first-person passage(s) under ${fm.author}'s byline, who wrote none. Article grew ${growth > 0 ? '+' : ''}${growth}%.`
      : growth > 20 ? `No invented first person, but the article grew ${growth}% — ${wb - wa} words the author did not write.`
        : `First person ${had}→${has}, length ${growth > 0 ? '+' : ''}${growth}%.`,
    introduced, wordsBefore: wa, wordsAfter: wb, growthPercent: growth,
  };
}

export async function runGates(file, { skipLinks = false, original = null } = {}) {
  const md = readFileSync(file, 'utf8');
  const checks = [voiceGate(file), claimsGate(md), injectionGate(md), frontmatterGate(md)];
  const authorship = original && existsSync(original)
    ? authorshipGate(md, readFileSync(original, 'utf8'), frontmatter(md)) : null;
  if (authorship) checks.push(authorship);
  if (!skipLinks) checks.push(await linksGate(md));
  const fail = checks.filter(c => c.status === 'fail');
  return {
    file, ran: new Date().toISOString(),
    status: fail.length ? 'fail' : checks.some(c => c.status === 'warn') ? 'warn' : 'pass',
    blockers: fail.map(c => c.id), checks,
  };
}

if (process.argv[1]?.endsWith('gates.mjs')) {
  const file = process.argv[2];
  if (!file || !existsSync(file)) { console.error('usage: gates.mjs <article.md> [--json] [--no-links]'); process.exit(2); }
  // G6 needs the original to compare against. The first version of this CLI
  // never passed it, so checking an article by hand printed four green gates
  // and exit 0 on a file that failed G6. A gate that is absent looks exactly
  // like a gate that passed, so this both auto-finds the original and says
  // out loud when it could not.
  const flagOriginal = (() => { const i = process.argv.indexOf('--original'); return i > -1 ? process.argv[i + 1] : null; })();
  const sibling = `${file.replace(/[^/\\]+$/, '')}original_article.md`;
  const original = flagOriginal || (existsSync(sibling) && sibling !== file ? sibling : null);

  const r = await runGates(file, { skipLinks: process.argv.includes('--no-links'), original });
  if (process.argv.includes('--json')) { console.log(JSON.stringify(r, null, 2)); process.exit(r.status === 'fail' ? 1 : 0); }
  console.log(`\nDeterministic gates — ${file}`);
  console.log('-'.repeat(72));
  for (const c of r.checks) {
    const mark = c.status === 'pass' ? '  ok  ' : c.status === 'warn' ? '  --  ' : '  !!  ';
    console.log(mark + `${c.id} ${c.name}`.padEnd(42) + c.detail);
  }
  if (!original) console.log('  --  G6 Authorship preserved'.padEnd(48)
    + 'NOT CHECKED — pass --original <submission.md>');
  console.log('-'.repeat(72));
  console.log(`\n${r.status === 'pass' ? 'All gates pass.' : r.status === 'warn' ? 'Passes, with findings for the agents.' : `BLOCKED by ${r.blockers.join(', ')}.`}`);
  if (!original) console.log('Authorship was not checked. Green here does not mean the author\'s voice survived.');
  console.log();
  process.exit(r.status === 'fail' ? 1 : 0);
}
