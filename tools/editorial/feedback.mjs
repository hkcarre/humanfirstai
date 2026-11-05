import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { ROOT } from './policy.mjs';

// ---------------------------------------------------------------------------
//  Continuous editorial learning.
//
//  Captures what humans actually did to a finalised article and turns repeated
//  patterns into PROPOSED policy changes.
//
//  The hard constraint, from the specification and from common sense: this
//  never edits an approved brand rule. A system that rewrites its own
//  governance from its own output is not learning, it is drifting. Every
//  proposal lands in editorial/proposals/ for a human to accept or bin.
//
//      node tools/editorial/feedback.mjs <runDir>     record one run
//      node tools/editorial/feedback.mjs --propose    look for patterns
// ---------------------------------------------------------------------------

const LEDGER = `${ROOT}editorial/feedback.jsonl`;
const PROPOSALS = `${ROOT}editorial/proposals`;

/** What changed between what the swarm produced and what the human shipped. */
function record(dir) {
  const meta = JSON.parse(readFileSync(`${dir}/publishing_metadata.json`, 'utf8'));
  const finalPath = `${dir}/final_article.md`;
  const shipped = meta.sourcePath && existsSync(`${ROOT}${meta.sourcePath}`) ? `${ROOT}${meta.sourcePath}` : null;

  let humanDiff = '';
  if (shipped && existsSync(finalPath)) {
    try { execFileSync('git', ['diff', '--no-index', finalPath, shipped], { cwd: ROOT, encoding: 'utf8' }); }
    catch (e) { humanDiff = (e.stdout || '').toString(); }
  }

  const integration = existsSync(`${dir}/reports/integration.json`)
    ? JSON.parse(readFileSync(`${dir}/reports/integration.json`, 'utf8')) : { changes: [], rejectedRecommendations: [] };
  const qa = existsSync(`${dir}/qa_report.json`)
    ? JSON.parse(readFileSync(`${dir}/qa_report.json`, 'utf8')) : {};

  // A human edit AFTER the swarm finished is the strongest signal available:
  // the swarm either missed something or got something wrong.
  const humanEdits = humanDiff
    ? humanDiff.split('\n').filter(l => /^[+-][^+-]/.test(l)).length : 0;

  const entry = {
    runId: meta.runId, at: new Date().toISOString(),
    policyRevision: meta.policyRevision,
    status: qa.status ?? null, score: qa.weightedScore ?? null,
    acceptedChanges: (integration.changes || []).length,
    rejectedRecommendations: (integration.rejectedRecommendations || []).map(r => r.recommendation),
    rulesCited: [...new Set((integration.changes || []).map(c => c.ruleId).filter(Boolean))],
    blockers: qa.publicationGates?.blockers ?? [],
    humanEditLines: humanEdits,
    humanEditedAfterRun: humanEdits > 0,
  };
  mkdirSync(`${ROOT}editorial`, { recursive: true });
  writeFileSync(LEDGER, (existsSync(LEDGER) ? readFileSync(LEDGER, 'utf8') : '') + JSON.stringify(entry) + '\n');
  return entry;
}

/** Patterns across runs — never applied, only proposed. */
function propose() {
  if (!existsSync(LEDGER)) return { runs: 0, proposals: [] };
  const rows = readFileSync(LEDGER, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
  const count = (arr) => arr.reduce((m, x) => (m[x] = (m[x] || 0) + 1, m), {});

  const blockers = count(rows.flatMap(r => r.blockers));
  const rejected = count(rows.flatMap(r => r.rejectedRecommendations));
  const rules = count(rows.flatMap(r => r.rulesCited));
  const edited = rows.filter(r => r.humanEditedAfterRun).length;

  const proposals = [];
  const MIN = 3;    // one occurrence is noise; three is a pattern

  for (const [b, n] of Object.entries(blockers)) if (n >= MIN) proposals.push({
    kind: 'recurring-blocker', evidence: `${n} of ${rows.length} runs blocked on ${b}`,
    suggestion: `${b} blocks repeatedly. Either the rule needs clarifying in the approved docs, or the intake guidance does. Decide which — do not relax the gate.`,
  });
  for (const [r, n] of Object.entries(rejected)) if (n >= MIN) proposals.push({
    kind: 'recommendation-consistently-rejected', evidence: `"${r}" rejected by the integrator in ${n} runs`,
    suggestion: `A specialist keeps recommending something the Editor-in-Chief keeps refusing. Fix the agent brief, not the article.`,
  });
  for (const [r, n] of Object.entries(rules)) if (n >= MIN) proposals.push({
    kind: 'rule-cited-often', evidence: `rule ${r} corrected ${n} times`,
    suggestion: `Writers keep breaking ${r}. Consider a clearer example in the approved guidance.`,
  });
  if (rows.length >= MIN && edited / rows.length > 0.5) proposals.push({
    kind: 'humans-keep-editing-after-the-swarm',
    evidence: `${edited} of ${rows.length} finalised articles were edited by hand afterwards`,
    suggestion: `The swarm is not finishing the job. Read the human diffs before trusting another score.`,
  });

  if (proposals.length) {
    mkdirSync(PROPOSALS, { recursive: true });
    const f = `${PROPOSALS}/${new Date().toISOString().slice(0, 10)}-proposed-policy-changes.md`;
    writeFileSync(f,
      `# Proposed policy changes\n\nGenerated from ${rows.length} editorial run(s). `
      + `**Nothing here is in force.** These are proposals for a human to accept or reject; `
      + `the swarm does not edit approved brand rules.\n\n`
      + proposals.map((p, i) => `## ${i + 1}. ${p.kind}\n\n**Evidence:** ${p.evidence}\n\n**Suggestion:** ${p.suggestion}\n`).join('\n')
      + `\n---\n\nTo accept one, edit the approved document yourself and commit it. The next run picks it up.\n`);
    return { runs: rows.length, proposals, file: f.replace(ROOT, '') };
  }
  return { runs: rows.length, proposals: [] };
}

const [, , cmd] = process.argv;
if (cmd === '--propose') {
  const r = propose();
  console.log(r.proposals.length
    ? `${r.proposals.length} proposal(s) from ${r.runs} run(s) -> ${r.file}`
    : `${r.runs} run(s) recorded. No pattern reaches the three-run threshold yet.`);
} else if (cmd && existsSync(cmd)) {
  const e = record(cmd);
  console.log(JSON.stringify(e, null, 2));
} else {
  console.log('usage: feedback.mjs <runDir> | feedback.mjs --propose');
}
