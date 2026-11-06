import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { ROOT, loadPolicy } from './policy.mjs';
import { runGates } from './gates.mjs';
import { validateReport, WEIGHTS } from './schemas.mjs';

// ---------------------------------------------------------------------------
//  The run harness.
//
//  Scoring and gating live HERE, in code, not in an agent. A model grading its
//  own work is not evidence; the weighted score and the publication gates have
//  to be computable by something that has no stake in the answer.
//
//      node run.mjs init <article.md> [--brand X --audience Y --channel Z]
//      node run.mjs finalise <runDir>
//      node run.mjs pr <runDir>
//      node run.mjs list
// ---------------------------------------------------------------------------

const RUNS = `${ROOT}editorial/runs`;
const sh = (c, a, o = {}) => execFileSync(c, a, { encoding: 'utf8', cwd: ROOT, ...o }).trim();

const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

// --- init ------------------------------------------------------------------
function init(articlePath, opts) {
  if (!existsSync(articlePath)) { console.error(`No such article: ${articlePath}`); process.exit(2); }
  const md = readFileSync(articlePath, 'utf8');
  const fm = Object.fromEntries(((md.match(/^---\n([\s\S]*?)\n---/) || [, ''])[1]).split('\n')
    .map(l => { const i = l.indexOf(':'); return i < 0 ? null : [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }).filter(Boolean));

  const title = fm.title || (md.match(/^#\s+(.*)$/m) || [, 'untitled'])[1];
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '-');
  const runId = `${stamp}-${slugify(title)}`;
  const dir = `${RUNS}/${runId}`;
  mkdirSync(`${dir}/reports`, { recursive: true });

  // The original is preserved byte-for-byte. Every later claim about what
  // changed is diffed against this file, not against anyone's memory of it.
  copyFileSync(articlePath, `${dir}/original_article.md`);

  const policy = loadPolicy();
  writeFileSync(`${dir}/policy_snapshot.json`, JSON.stringify(policy, null, 2));

  const meta = {
    runId, created: new Date().toISOString(),
    sourcePath: articlePath,
    articleTitle: title,
    brand: opts.brand || 'Human First AI',
    audience: opts.audience || fm.kicker || 'general',
    channel: opts.channel || 'website',
    language: fm.lang || opts.language || 'en',
    contentType: opts.contentType || 'article',
    specialInstructions: opts.instructions || null,
    author: fm.author || null,
    guest: fm.guest === 'true',
    policyRevision: `${policy.revision.repo}@${policy.revision.sha}${policy.revision.dirty ? '+dirty' : ''}`,
    publicationStatus: 'IN_PROGRESS',
    mode: 'PREPARE_FOR_PUBLICATION',
  };
  writeFileSync(`${dir}/publishing_metadata.json`, JSON.stringify(meta, null, 2));
  return { dir, runId, meta, policy };
}

// --- scoring ---------------------------------------------------------------
// A high weighted score cannot override a critical failure. That is the whole
// reason the gates are listed separately and evaluated after the arithmetic.
function decide(dimensions, blockers) {
  const weighted = Object.entries(WEIGHTS)
    .reduce((s, [k, w]) => s + (dimensions[k] ?? 0) * w, 0);
  const score = Math.round(weighted * 10) / 10;
  let status = score >= 90 ? 'READY_FOR_REVIEW' : score >= 80 ? 'CONDITIONAL_REVIEW' : 'NEEDS_REVIEW';
  if (blockers.length) status = 'NEEDS_REVIEW';
  return { score, status };
}

function readReport(dir, name) {
  const p = `${dir}/reports/${name}.json`;
  if (!existsSync(p)) return null;
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return 'INVALID_JSON'; }
}

async function finalise(dir) {
  if (!existsSync(dir)) { console.error(`No such run: ${dir}`); process.exit(2); }
  const meta = JSON.parse(readFileSync(`${dir}/publishing_metadata.json`, 'utf8'));
  const blockers = [], schemaErrors = [];

  const kinds = ['brand_compliance', 'fact_check', 'editorial', 'seo_geo', 'compliance', 'audience', 'integration', 'qa'];
  const reports = {};
  for (const k of kinds) {
    const r = readReport(dir, k);
    if (r === null) { blockers.push(`MISSING_REPORT:${k}`); continue; }
    if (r === 'INVALID_JSON') { blockers.push(`INVALID_JSON:${k}`); continue; }
    const errs = validateReport(k, r);
    if (errs.length) { schemaErrors.push({ report: k, errors: errs }); blockers.push(`SCHEMA:${k}`); }
    reports[k] = r;
  }

  // Deterministic gates run against the FINAL article, not the submission.
  const finalPath = `${dir}/final_article.md`;
  let gates = null;
  if (existsSync(finalPath)) {
    gates = await runGates(finalPath, { skipLinks: process.argv.includes('--no-links'), original: `${dir}/original_article.md` });
    writeFileSync(`${dir}/reports/gates.json`, JSON.stringify(gates, null, 2));
    for (const c of gates.checks) {
      if (c.status !== 'fail') continue;
      if (c.id === 'G1' && c.guest) continue;          // guest voice findings are advisory, by policy
      blockers.push(`GATE:${c.id}`);
    }
  } else blockers.push('MISSING:final_article.md');

  // Hard publication gates, from the specification.
  const fc = reports.fact_check;
  if (fc) {
    if (!fc.researchAvailable) blockers.push('FACTCHECK:NO_RESEARCH_ACCESS');
    for (const c of fc.claims || []) {
      if (c.status === 'CONTRADICTED') blockers.push('FACTCHECK:CONTRADICTED_CLAIM');
      if (c.status === 'UNVERIFIED' && !/qualif|remove|hedge|attribut/i.test(c.recommendedAction || ''))
        blockers.push('FACTCHECK:UNVERIFIED_AS_FACT');
    }
  }
  // The Brand Guardian read the SUBMISSION. Its violation count is an intake
  // finding, not a verdict on what the integrator produced — using it as a gate
  // blocked an article whose violations had all been fixed. So check whether the
  // exact passages it flagged actually survived into the final article. That is
  // deterministic, uses the agent's own evidence, and cannot go stale.
  let unresolvedBrand = [];
  if (reports.brand_compliance && existsSync(finalPath)) {
    const finalText = readFileSync(finalPath, 'utf8').replace(/\s+/g, ' ');
    unresolvedBrand = (reports.brand_compliance.findings || [])
      .filter(f => f.passage && f.passage.trim().length > 12)
      .filter(f => finalText.includes(f.passage.replace(/\s+/g, ' ').trim()));
    const checkable = (reports.brand_compliance.findings || [])
      .filter(f => f.passage && f.passage.trim().length > 12);
    const mandatoryLeft = unresolvedBrand.filter(f => f.severity === 'CRITICAL' || f.severity === 'HIGH');
    if (mandatoryLeft.length) blockers.push('BRAND:MANDATORY_VIOLATION');
    // Fail closed. A violation COUNT with no quoted passage cannot be checked
    // against the final article, so it cannot be treated as resolved either.
    else if (reports.brand_compliance.mandatoryViolations > 0 && !checkable.length) {
      blockers.push('BRAND:MANDATORY_VIOLATION');
    }
  } else if (reports.brand_compliance?.mandatoryViolations > 0) {
    blockers.push('BRAND:MANDATORY_VIOLATION');   // nothing has addressed them yet
  }
  if (reports.compliance?.blockers > 0) blockers.push('COMPLIANCE:CRITICAL');
  for (const f of reports.compliance?.findings || []) if (f.severity === 'CRITICAL') blockers.push('COMPLIANCE:CRITICAL');
  if (reports.integration && reports.integration.meaningPreserved === false) blockers.push('INTEGRATION:MEANING_DRIFT');
  if (reports.qa) {
    if (reports.qa.verdict === 'REJECT') blockers.push('QA:REJECTED');
    if ((reports.qa.hallucinationsFound || []).length) blockers.push('QA:HALLUCINATION');
    if ((reports.qa.meaningDriftFound || []).length) blockers.push('QA:MEANING_DRIFT');
  }

  // A recommended slug is a destination. site.mjs derives the published slug
  // from the filename, so accepting one that already belongs to a different
  // article overwrites a live page. The SEO agent proposed exactly that twice.
  const slug = reports.seo_geo?.slug;
  if (slug && existsSync(finalPath)) {
    const target = `${ROOT}site/content/${slug}.md`;
    if (existsSync(target)
      && readFileSync(target, 'utf8').trim() !== readFileSync(finalPath, 'utf8').trim()) {
      blockers.push('SEO:SLUG_COLLISION');
    }
  }

  // Stale-artifact guard. The QA auditor found reports/gates.json describing a
  // draft that had since been rewritten. Anything that records a verdict about
  // the final article now records WHICH final article it saw.
  const fingerprint = existsSync(finalPath)
    ? createHash('sha256').update(readFileSync(finalPath)).digest('hex').slice(0, 12) : null;
  if (gates) {
    gates.finalArticleSha = fingerprint;
    writeFileSync(`${dir}/reports/gates.json`, JSON.stringify(gates, null, 2));
  }

  const dims = reports.qa?.dimensions || {};
  const { score, status } = decide(dims, [...new Set(blockers)]);

  const qaReport = {
    runId: meta.runId, evaluated: new Date().toISOString(),
    policyRevision: meta.policyRevision,
    dimensions: dims, weights: WEIGHTS, weightedScore: score,
    publicationGates: {
      passed: blockers.length === 0,
      blockers: [...new Set(blockers)],
      note: 'A high weighted score cannot override a critical failure.',
    },
    finalArticleSha: fingerprint,
    schemaErrors,
    brandViolationsSurvivingIntoFinal: unresolvedBrand.map(f => ({ severity: f.severity, ruleId: f.ruleId, passage: f.passage.slice(0, 90) })),
    deterministicGates: gates ? gates.checks.map(c => ({ id: c.id, name: c.name, status: c.status, detail: c.detail })) : null,
    qaVerdict: reports.qa?.verdict ?? null,
    unresolvedFindings: [
      ...(reports.qa?.criticalIssues || []),
      ...(reports.compliance?.findings || []).filter(f => f.severity === 'CRITICAL' || f.severity === 'HIGH'),
    ],
    status,
  };
  writeFileSync(`${dir}/qa_report.json`, JSON.stringify(qaReport, null, 2));

  meta.publicationStatus = status;
  meta.weightedScore = score;
  meta.finalisedAt = new Date().toISOString();
  if (reports.seo_geo) {
    meta.recommendedSlug = reports.seo_geo.slug;
    meta.seo = { title: reports.seo_geo.seoTitle, metaDescription: reports.seo_geo.metaDescription };
  }
  writeFileSync(`${dir}/publishing_metadata.json`, JSON.stringify(meta, null, 2));

  // editorial_report.md — the human-readable summary, assembled from the
  // reports rather than written by anyone. Required artifact #2.
  const sev = (fs, s) => (fs || []).filter(f => f.severity === s);
  const bullets = (fs, n = 6) => (fs || []).slice(0, n)
    .map(f => `- **${f.severity}**${f.ruleId ? ` \`${f.ruleId}\`` : ''} — ${f.explanation}${f.recommendation ? ` _${f.recommendation}_` : ''}`).join('\n') || '- None.';
  const ic = reports.integration?.changes || [];
  writeFileSync(`${dir}/editorial_report.md`,
    `# Editorial report\n\n**${meta.articleTitle}** · run \`${meta.runId}\` · policy \`${meta.policyRevision}\`\n\n`
    + `**Status:** \`${status}\` — weighted score **${score}/100**\n\n`
    + (blockers.length ? `> **Blocked by:** ${[...new Set(blockers)].join(', ')}\n\n` : '')
    + `## Dimension scores\n\n| Dimension | Weight | Score |\n|---|---|---|\n`
    + Object.entries(WEIGHTS).map(([k, w]) => `| ${k} | ${(w * 100).toFixed(0)}% | ${dims[k] ?? '—'} |`).join('\n')
    + `\n\n## Major editorial improvements\n\n`
    + (ic.length ? ic.slice(0, 10).map(c => `- **${c.what}** — ${c.why}`).join('\n') : '- None recorded.')
    + `\n\n## Brand adjustments\n\n${bullets(reports.brand_compliance?.findings)}\n`
    + `\n## Removed or qualified claims\n\n`
    + ((reports.fact_check?.claims || []).filter(c => c.status !== 'VERIFIED' && c.status !== 'OPINION')
      .map(c => `- **${c.status}** — "${c.claim.slice(0, 110)}" → ${c.recommendedAction}`).join('\n') || '- None.')
    + `\n\n## Compliance and risk\n\n`
    + `${sev(reports.compliance?.findings, 'CRITICAL').length} critical · `
    + `${sev(reports.compliance?.findings, 'HIGH').length} high · `
    + `${sev(reports.compliance?.findings, 'MEDIUM').length} medium\n\n${bullets(reports.compliance?.findings, 4)}\n`
    + `\n## SEO and GEO\n\n`
    + (reports.seo_geo ? `- **Title:** ${reports.seo_geo.seoTitle}\n- **Meta:** ${reports.seo_geo.metaDescription}\n`
      + `- **Slug:** \`${reports.seo_geo.slug}\`\n- **Primary topic:** ${reports.seo_geo.primaryTopic}\n`
      + `- Recommendations only — \`measured: ${reports.seo_geo.measured}\`. No analytics were consulted.\n` : '- No report.\n')
    + `\n## Outstanding for a human\n\n`
    + ((qaReport.unresolvedFindings || []).map(f => `- ${f.issue || f.explanation}`).join('\n') || '- Nothing unresolved.')
    + `\n\n## Recommendations the Editor-in-Chief rejected\n\n`
    + ((reports.integration?.rejectedRecommendations || []).map(r => `- **${r.recommendation}** — ${r.why}`).join('\n') || '- None.')
    + `\n`);

  // changes.md, generated from the integrator's own change log plus a real diff.
  if (reports.integration) {
    const ch = reports.integration.changes || [];
    let diffstat = '';
    try {
      diffstat = sh('git', ['diff', '--no-index', '--stat', `${dir}/original_article.md`, finalPath]);
    } catch (e) { diffstat = (e.stdout || '').toString().trim(); }
    writeFileSync(`${dir}/changes.md`,
      `# Substantive changes\n\nRun \`${meta.runId}\` · policy \`${meta.policyRevision}\`\n\n`
      + `${ch.length} substantive change(s) recorded by the Editorial Integrator.\n\n`
      + ch.map((c, i) => `${i + 1}. **${c.what}**\n   - Why: ${c.why}${c.ruleId ? `\n   - Rule: \`${c.ruleId}\`` : ''}`).join('\n\n')
      + (reports.integration.rejectedRecommendations?.length
        ? `\n\n## Recommendations not taken\n\n`
          + reports.integration.rejectedRecommendations.map(r => `- **${r.recommendation}** — ${r.why}`).join('\n')
        : '')
      + `\n\n## Diff against the original submission\n\n\`\`\`\n${diffstat || '(no textual diff available)'}\n\`\`\`\n`);
  }

  return { meta, qaReport, score, status, blockers: [...new Set(blockers)] };
}

// --- pull request ----------------------------------------------------------
function openPr(dir) {
  const meta = JSON.parse(readFileSync(`${dir}/publishing_metadata.json`, 'utf8'));
  const qa = JSON.parse(readFileSync(`${dir}/qa_report.json`, 'utf8'));
  const branch = `editorial/${meta.runId}`;
  try { sh('gh', ['auth', 'status']); }
  catch { return { ok: false, reason: 'gh not authenticated — artifacts written locally only' }; }

  const existing = (() => { try { return JSON.parse(sh('gh', ['pr', 'list', '--head', branch, '--json', 'url'])); } catch { return []; } })();
  if (existing.length) return { ok: true, url: existing[0].url, reused: true };

  const base = sh('git', ['rev-parse', '--abbrev-ref', 'HEAD']);

  // If the run is already committed on the base branch there is nothing for a
  // branch to carry, and `git commit` exits non-zero. That is not a failure
  // worth a stack trace — it means somebody committed the artifacts directly.
  const tracked = (() => {
    try { return sh('git', ['ls-files', '--', `editorial/runs/${meta.runId}`]).length > 0; }
    catch { return false; }
  })();
  const dirty = (() => {
    try { return sh('git', ['status', '--porcelain', '--', `editorial/runs/${meta.runId}`]).length > 0; }
    catch { return true; }
  })();
  if (tracked && !dirty) {
    return { ok: false, reason: `run already committed on ${base}; nothing for a pull request to carry. `
      + `Let 'pr' commit the run instead of adding editorial/runs/ yourself.`, status: qa.status, score: qa.weightedScore };
  }

  sh('git', ['checkout', '-q', '-b', branch]);
  sh('git', ['add', '-f', '--', `editorial/runs/${meta.runId}`]);   // -f: runs are gitignored on main
  sh('git', ['commit', '-q', '-m',
    `Editorial run ${meta.runId}: ${meta.articleTitle}\n\nStatus: ${qa.status} (${qa.weightedScore}/100)\nPolicy: ${meta.policyRevision}`]);
  sh('git', ['push', '-q', '-u', 'origin', branch]);
  const body = `**Status:** \`${qa.status}\` — weighted score **${qa.weightedScore}/100**\n\n`
    + `**Policy revision:** \`${meta.policyRevision}\`\n\n`
    + `| Dimension | Weight | Score |\n|---|---|---|\n`
    + Object.entries(WEIGHTS).map(([k, w]) => `| ${k} | ${(w * 100).toFixed(0)}% | ${qa.dimensions[k] ?? '—'} |`).join('\n')
    + `\n\n**Publication gates:** ${qa.publicationGates.passed ? 'all passed' : `BLOCKED — ${qa.publicationGates.blockers.join(', ')}`}\n\n`
    + `Artifacts in \`editorial/runs/${meta.runId}/\`. Prepared for review; not for merge without a human read.\n`;
  const url = sh('gh', ['pr', 'create', '--base', base, '--head', branch,
    '--title', `Editorial: ${meta.articleTitle} [${qa.status}]`, '--body', body]);
  sh('git', ['checkout', '-q', base]);
  // Switching back deletes the run from disk: it is tracked on the branch and
  // gitignored on base, so git treats it as a file that should not be here.
  // Restore it unstaged. Losing the working copy of a finished run the moment
  // you open its pull request is not an acceptable way to end a run.
  try {
    sh('git', ['checkout', branch, '--', `editorial/runs/${meta.runId}`]);
    sh('git', ['reset', '-q', '--', `editorial/runs/${meta.runId}`]);
  } catch { /* the branch has it; the PR is still valid */ }
  return { ok: true, url, branch, localCopyRestored: existsSync(`${dir}/final_article.md`) };
}

// --- cli -------------------------------------------------------------------
const [, , cmd, arg] = process.argv;
const flag = n => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : null; };

if (cmd === 'init') {
  const r = init(arg, { brand: flag('brand'), audience: flag('audience'), channel: flag('channel'),
    language: flag('language'), contentType: flag('content-type'), instructions: flag('instructions') });
  const g = await runGates(arg, { skipLinks: process.argv.includes('--no-links') });
  writeFileSync(`${r.dir}/reports/intake_gates.json`, JSON.stringify(g, null, 2));
  console.log(JSON.stringify({ runId: r.runId, dir: r.dir.replace(ROOT, ''),
    policyRevision: r.meta.policyRevision, rules: r.policy.counts.rules,
    intakeGates: g.status, intakeBlockers: g.blockers,
    claims: g.checks.find(c => c.id === 'G2')?.claims?.length ?? 0 }, null, 2));
} else if (cmd === 'finalise') {
  const r = await finalise(arg);
  console.log(JSON.stringify({ status: r.status, score: r.score, blockers: r.blockers }, null, 2));
  process.exit(r.status === 'NEEDS_REVIEW' ? 1 : 0);
} else if (cmd === 'pr') {
  console.log(JSON.stringify(openPr(arg), null, 2));
} else if (cmd === 'list') {
  if (!existsSync(RUNS)) { console.log('no runs yet'); process.exit(0); }
  for (const d of readdirSync(RUNS).sort().reverse()) {
    let s = '?';
    try { s = JSON.parse(readFileSync(`${RUNS}/${d}/qa_report.json`, 'utf8')).status; } catch {}
    console.log(`  ${d.padEnd(56)} ${s}`);
  }
} else {
  console.log(`editorial run harness

  node run.mjs init <article.md> [--brand B --audience A --channel C --language L --instructions "..."]
  node run.mjs finalise <runDir>
  node run.mjs pr <runDir>
  node run.mjs list

Add --no-links to skip network link checking.`);
}
