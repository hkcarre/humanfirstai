// ---------------------------------------------------------------------------
//  Output schemas for every agent report.
//
//  Dependency-free, deliberately. A schema that needs a package to run is a
//  schema that gets skipped when the package is missing.
//
//  The point is not type safety. It is that the QA auditor must be able to
//  reject a report for being malformed WITHOUT asking a model whether it looks
//  alright, and that a fabricated field cannot pass silently.
// ---------------------------------------------------------------------------

const t = v => Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v;

/** Tiny structural validator. spec is {field: 'type' | ['enum', ...] | {...}}.
 *  A trailing '?' on a field name makes it optional. */
export function validate(obj, spec, path = '') {
  const errs = [];
  if (t(obj) !== 'object') return [`${path || 'root'}: expected object, got ${t(obj)}`];
  for (const [rawKey, rule] of Object.entries(spec)) {
    const optional = rawKey.endsWith('?');
    const key = optional ? rawKey.slice(0, -1) : rawKey;
    const here = path ? `${path}.${key}` : key;
    if (!(key in obj) || obj[key] === undefined) {
      if (!optional) errs.push(`${here}: missing`);
      continue;
    }
    const v = obj[key];
    if (Array.isArray(rule) && rule.every(x => typeof x === 'string') && rule.length && rule[0] !== 'array') {
      if (!rule.includes(v)) errs.push(`${here}: "${v}" not one of ${rule.join('|')}`);
    } else if (typeof rule === 'string') {
      if (rule === 'array[]') { if (t(v) !== 'array') errs.push(`${here}: expected array`); }
      else if (rule === 'score') {
        // A real run caught this: one agent scored 6 where every other scored
        // out of 100. "number" accepted it. A silent scale mismatch is worse
        // than a malformed report, because it looks like a terrible article.
        if (t(v) !== 'number') errs.push(`${here}: expected number, got ${t(v)}`);
        else if (v < 0 || v > 100) errs.push(`${here}: ${v} out of range — scores are 0-100`);
        else if (v > 0 && v <= 10 && Number.isInteger(v)) errs.push(`${here}: ${v} looks like a 0-10 score; scores are 0-100`);
      } else if (t(v) !== rule) errs.push(`${here}: expected ${rule}, got ${t(v)}`);
    } else if (t(rule) === 'object') {
      if (rule.__each) {
        if (t(v) !== 'array') errs.push(`${here}: expected array`);
        else v.forEach((item, i) => errs.push(...validate(item, rule.__each, `${here}[${i}]`)));
      } else errs.push(...validate(v, rule, here));
    }
  }
  return errs;
}

const FINDING = {
  passage: 'string', severity: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
  explanation: 'string', 'ruleId?': 'string', 'recommendation?': 'string', 'sourceRef?': 'string',
};

export const SCHEMAS = {
  brand_compliance: {
    agent: 'string', score: 'score', policyRevision: 'string',
    mandatoryViolations: 'number',
    findings: { __each: FINDING },
    'compliantNotes?': 'array[]',
  },
  fact_check: {
    agent: 'string', score: 'score',
    researchAvailable: 'boolean',           // false if browsing was not available — never claim otherwise
    claims: { __each: {
      claim: 'string',
      status: ['VERIFIED', 'CONTRADICTED', 'UNVERIFIED', 'OPINION'],
      'evidenceSource?': 'string', 'url?': 'string', 'publicationDate?': 'string',
      'retrievedOn?': 'string', 'supportingEvidence?': 'string',
      confidenceRationale: 'string', recommendedAction: 'string',
    } },
  },
  editorial: { agent: 'string', score: 'score', findings: { __each: FINDING }, 'preserved?': 'array[]' },
  seo_geo: {
    agent: 'string', score: 'score',
    seoTitle: 'string', metaDescription: 'string', slug: 'string',
    primaryTopic: 'string', relatedTopics: 'array[]',
    'suggestedHeadings?': 'array[]', 'internalLinks?': 'array[]', 'externalCitations?': 'array[]',
    'faq?': 'array[]', 'structuredData?': 'array[]', geoRationale: 'string',
    measured: 'boolean',                    // false = these are recommendations, not measurements
  },
  compliance: { agent: 'string', score: 'score', blockers: 'number', findings: { __each: FINDING } },
  audience: { agent: 'string', score: 'score', findings: { __each: FINDING } },
  integration: {
    agent: 'string', finalArticlePath: 'string',
    changes: { __each: { what: 'string', why: 'string', 'ruleId?': 'string', 'severity?': 'string' } },
    rejectedRecommendations: { __each: { recommendation: 'string', why: 'string' } },
    meaningPreserved: 'boolean',
  },
  qa: {
    agent: 'string',
    dimensions: {
      brandAdherence: 'score', factualIntegrity: 'score', editorialQuality: 'score',
      seoGeoReadiness: 'score', audienceUsefulness: 'score', publishingReadiness: 'score',
    },
    criticalIssues: { __each: { issue: 'string', repair: 'string' } },
    hallucinationsFound: 'array[]',
    meaningDriftFound: 'array[]',
    verdict: ['ACCEPT', 'REPAIR', 'REJECT'],
  },
};

export const WEIGHTS = {
  brandAdherence: 0.25, factualIntegrity: 0.25, editorialQuality: 0.20,
  seoGeoReadiness: 0.15, audienceUsefulness: 0.10, publishingReadiness: 0.05,
};

export function validateReport(kind, obj) {
  if (!SCHEMAS[kind]) return [`unknown report kind: ${kind}`];
  return validate(obj, SCHEMAS[kind]);
}
