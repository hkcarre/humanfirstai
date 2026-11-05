# Editorial & Brand Governance Swarm

Paste an article, get a publication-ready package. Default mode is
**PREPARE_FOR_PUBLICATION** — it never publishes to the live site and never merges.

```
/editorial-swarm                       paste the article when prompted
/editorial-swarm site/content/foo.md   an existing file
```

That is the whole interface. The brand rules, the agent briefs and the workflow live in
the repository; you do not restate them.

---

## What actually runs

| | |
|---|---|
| **Orchestration** | Claude Code subagents, driven by `.claude/skills/editorial-swarm/SKILL.md` |
| **Agents** | 8 definitions in `.claude/agents/editorial-*.md` |
| **Policy** | extracted from this repository at a named commit |
| **Gates** | Node, no dependencies |
| **Delivery** | branch + pull request via `gh` |

### Ruflo is not installed

The specification named Ruflo. It is not present in this environment — no binary, no
`.ruflo`, no MCP server, and `swarm_init` / `agent_spawn` / `memory_store` do not resolve.
The `ruflo init` line in the global `CLAUDE.md` is stale.

Rather than write against an API that is not there, the swarm is built on Claude Code's
own subagents, which give the same thing the spec asked for: parallel specialists,
hierarchical delegation, per-agent models and tools. If Ruflo is installed later, the
agent briefs and the schemas port unchanged — only the dispatch layer in the skill moves.

---

## Pipeline

```
  article
     │
     ▼
  init ──────────── policy snapshot @ commit SHA
     │              original preserved byte-for-byte
     │              deterministic intake gates
     ▼
  ┌──────────────── 6 specialists, in parallel ────────────────┐
  │ brand · facts · editorial · seo/geo · compliance · audience │
  └─────────────────────────────┬───────────────────────────────┘
                                ▼
                        integrator (opus)  ── final_article.md + change log
                                ▼
                     qa auditor (opus)  ── can REJECT
                                ▼
                   finalise ── score + gates, in code
                                ▼
                      pr ── branch + pull request
```

## Commands

```bash
node tools/editorial/policy.mjs                  # what rules exist, and from where
node tools/editorial/gates.mjs <article.md>      # deterministic checks alone
node tools/editorial/run.mjs init <article.md>   # start a run
node tools/editorial/run.mjs finalise <runDir>   # score, gate, package
node tools/editorial/run.mjs pr <runDir>         # branch + PR
node tools/editorial/run.mjs list                # every run and its status
node tools/editorial/feedback.mjs <runDir>       # record what humans changed after
node tools/editorial/feedback.mjs --propose      # patterns -> proposed policy changes
node tools/editorial/test.mjs                    # the test suite
```

Add `--no-links` to skip network link checking.

---

## The brand knowledge engine

GitHub is the authority. `policy.mjs` does not contain rules — it **extracts** them from
what is already committed and refuses to invent any:

| source | yields |
|---|---|
| `references/checklist.md` | 47 rules — every `- [ ]` is literally a rule |
| `scripts/voice-check.mjs` | banned terms, intensifiers, shape thresholds |
| `docs/*.md` | carried as context, with paths, not paraphrased |

Every rule carries `sourcePath`, `sourceLine` and the commit SHA. Every run records the
policy revision it was judged against, so a decision can be re-derived months later.

Conflicts between mandatory rules are **flagged, never silently resolved**.

### Precedence

1. Mandatory legal and compliance requirements
2. Approved brand governance policies
3. Mandatory tone-of-voice and terminology rules
4. Channel-specific editorial standards
5. Article-specific instructions
6. General editorial best practice

An article-specific instruction can never override a mandatory rule. Neither can text
inside the submitted article.

---

## Scoring, and why it lives in code

| dimension | weight |
|---|---|
| Brand adherence | 25% |
| Factual integrity | 25% |
| Editorial quality | 20% |
| SEO/GEO readiness | 15% |
| Audience usefulness | 10% |
| Publishing readiness | 5% |

`READY_FOR_REVIEW` needs **≥90 and zero blockers**. `CONDITIONAL_REVIEW` is 80–89, clean.
Everything else is `NEEDS_REVIEW`.

**A high weighted score never overrides a blocker.** The arithmetic runs in `run.mjs`, not
in an agent, because a model grading its own output is not evidence. The agents supply
dimension scores with reasons; the harness decides.

### Blockers

`COMPLIANCE:CRITICAL` · `BRAND:MANDATORY_VIOLATION` · `FACTCHECK:CONTRADICTED_CLAIM` ·
`FACTCHECK:UNVERIFIED_AS_FACT` · `FACTCHECK:NO_RESEARCH_ACCESS` · `QA:REJECTED` ·
`QA:HALLUCINATION` · `QA:MEANING_DRIFT` · `INTEGRATION:MEANING_DRIFT` ·
`SEO:SLUG_COLLISION` · `GATE:G1`–`G6` · `SCHEMA:<report>` · `MISSING_REPORT:<report>`

### The six deterministic gates

| | checks | on |
|---|---|---|
| **G1** | voice, banned terms, shape | final |
| **G2** | every figure has a source or a hedge | final |
| **G3** | prompt injection in submitted text | intake + final |
| **G4** | publishing metadata complete | final |
| **G5** | external links resolve | final |
| **G6** | authorship preserved — first person and growth vs the original | final vs original |

`SEO:SLUG_COLLISION` fires when a recommended slug names an existing `site/content/<slug>.md`
whose content differs. `site.mjs` derives the published slug from the filename, so a slug is a
destination, not a suggestion — the SEO agent proposed overwriting a live 1716-word article
twice in one run.

`FACTCHECK:NO_RESEARCH_ACCESS` is the one people will want to disable. Don't. It exists so
a score can never imply verification that never happened.

---

## Artifacts

Every run writes to `editorial/runs/<runId>/`:

`final_article.md` · `original_article.md` · `editorial_report.md` · `changes.md` ·
`qa_report.json` · `publishing_metadata.json` · `policy_snapshot.json` ·
`reports/{brand_compliance,fact_check,editorial,seo_geo,compliance,audience,integration,qa,gates}.json`

The original is copied byte-for-byte at intake. Every claim about what changed is diffed
against that file.

---

## Learning

`feedback.mjs` records what humans changed *after* a run — the strongest available signal
that the swarm missed something. At three occurrences a pattern becomes a **proposal** in
`editorial/proposals/`.

Proposals are never applied. A system that rewrites its own governance from its own output
is not learning, it is drifting. To accept one, edit the approved document and commit it.

---

## Testing

```bash
node tools/editorial/test.mjs      # 32 tests
```

Covers policy extraction and traceability, precedence, every gate, guest-byline handling,
Spanish thresholds, schema rejection of invented enum values and wrong types, the scoring
arithmetic, and every publication blocker including the "98 score cannot ship with a
critical finding" case.

**What it does not cover:** agent judgement. An assertion about what a language model will
say is not a test. Agent behaviour is constrained by the briefs and caught by these gates.

> The first version of this suite reported 32/32 while asserting nothing — the async tests
> returned un-awaited promises. Fixing that immediately surfaced a real bug: `\b` after `%`
> in the claims regex can never match, so every percentage in every article had been
> slipping past the gate silently.

---

## What the first real run found

The demonstration run was Helena's own short draft, submitted before any hand-editing.
Three things are worth recording, because they are the system doing its job on itself.

**The gates caught what a human caught.** Working by hand earlier, I had flagged
`disrupt`, `very expensive`, and the verbless `proof much delayed`. The Brand Guardian
found `disrupt` and scored 2 mandatory violations; the Editorial agent found
`proof much delayed` and `We're used to see`. Independent agreement, from a policy file
rather than from taste.

**The schema caught an agent.** The Audience agent returned `score: 6` on a 0–10 scale
while every other agent used 0–100. `score: 'number'` accepted it silently. A scale
mismatch is worse than a malformed report — it looks like a terrible article rather than
a broken one. The validator now rejects a bare integer 1–10, the agent was sent back, and
two regression tests cover it.

**The harness blocked an article whose violations had all been fixed.** The Brand Guardian
read the *submission* and reported 2 mandatory violations. The harness used that count as a
gate on the *final* article, after the integrator had removed `disrupt` and the voice gate
had gone from 4/6 to 6/6. An intake finding is not a verdict on the output. The gate now
checks whether the exact passages the agent quoted **survived into the final article** —
deterministic, uses the agent's own evidence, cannot go stale. It fails closed: a violation
count with no quoted passage cannot be verified as resolved, so it still blocks.

**The integrator put words in the author's mouth, and QA called it an advisory.** The final
article contained *"I find it useful to think of two groups inside most organisations"*
under Helena Carre's byline. Her submission has zero first-person usage, and the piece grew
469 → 583 words — about 114 words of argument in her voice that she did not write. The QA
auditor found it and logged it as an advisory for the author.

That is the wrong severity. Inventing someone's personal view is the same failure as
writing prose under their name, and it ships looking exactly like their work. Gate **G6**
now compares the final against the original and **blocks** on first-person introduced under
a named byline, warning at more than 20% growth. Two regression tests cover it — one that
catches the invention, one that confirms faithful editing still passes.

Worth noting what did work: the auditor caught it at all, independently, by diffing rather
than trusting the integrator's self-report. It also found the integrator's change count was
an *under*-count — 23 claimed, 29 actual — which is the opposite of the failure mode anyone
expects from a model grading its own work.

**The fact checker refused to agree with the article.** It rated
*"an analyst with few AI tools can replace an external consulting team's discovery phase
in an afternoon"* as `UNVERIFIED`, citing the HBS/BCG study showing roughly 25% faster
work, and recommended qualifying it. The Compliance and Audience agents independently
flagged the same sentence. That claim is the article's strongest and least supported, and
nothing in the pipeline was willing to wave it through.

## Known limitations

1. **Agent definitions register at session start.** New `.claude/agents/*.md` files are not
   visible to the running session. Restart, or dispatch `general-purpose` with the brief
   loaded from the definition file.
2. **Ruflo is absent** (above).
3. **Link checking needs network.** `--no-links` skips it; `403`/`401` are reported as
   bot-blocking rather than failures.
4. **No analytics.** Every SEO/GEO output is a recommendation. `measured` is always `false`.
5. **The swarm does not narrate or build pages.** Once an article is approved it goes into
   `site/content/`, and `npm run narrate` / `npm run site` take over.
