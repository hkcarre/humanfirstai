# Substantive changes

Run `20261105-183421-the-great-corporate-unmasking` · policy `hkcarre/humanfirstai@313bf72ebcdee16cd35db8ecce4e9f940800fa5b+dirty`

24 substantive change(s) recorded by the Editorial Integrator.

1. **"But AI is about to fundamentally disrupt the dynamics." became "But AI is about to change the dynamics."**
   - Why: 'disrupt' is a banned term in the house's own voice and was the single banned-term hit in gate G1. Removing the word and 'fundamentally' is the smallest edit that clears the rule; it also takes Editorial's 'drop one intensifier'. I did not use the Brand Guardian's proposed replacement, because that would have put a new sentence of mine under her byline (see rejected list).
   - Rule: `VC-001`

2. **The 43-word two-tribes sentence was split into three, keeping her words and her third person: "Most organisations house two distinct tribes. Truth Seekers ask uncomfortable questions, challenge assumptions, run experiments, build things and focus on outcomes, and they are unbothered to fail in public. Political Players manage up, master meeting dynamics, dodge failure and excel at buzzword-bingo." The two parentheticals became plain clauses.**
   - Why: This, not the closing sentence, is the sentence over 25 words that failed G1. Verified by running voice-check --verbose on the submission: it names this sentence and no other. The Brand Guardian attributed the failure to the closing sentence instead; that sentence is 25 words and passes, so its split was not required and has been reverted.
   - Rule: `VC-003`

3. **"An analyst with few AI tools can replace an external consulting team's discovery phase in an afternoon" became "An analyst with a few AI tools can run much of a consulting team's discovery phase themselves."**
   - Why: The Fact Checker rated the claim UNVERIFIED and mandated that it not ship as established fact; its best evidence (HBS/BCG field experiment, 758 consultants) showed about 25% faster, nowhere near 'in an afternoon'. My first repair left 'in a fraction of the time', which the QA auditor correctly read as a surviving unsourced comparative. The speed comparison is now gone rather than restated. Her point survives in 'themselves': the work no longer needs a team. I did not insert the 25% figure and its citation, because that is my research under her byline.

4. **"It can churn out a 40-page deck, business case, and risk framework in few minutes" became "It can churn out a deck of about 40 pages, a business case, and a risk framework in a few minutes."**
   - Why: CL-010 requires a stated number to carry a source, or the word 'about' if it is an estimate. Her digit is kept and hedged, which is also the Fact Checker's recommended action. 'in few minutes' to 'in a few minutes' is one of the three article errors Editorial flagged.
   - Rule: `CL-010`

5. **"AI is making substance-free leadership impossible to defend" became "much harder to defend".**
   - Why: Compliance (MEDIUM), the Brand Guardian (CL-008) and Editorial all flagged the absolute as opinion framed as fact. 'Much harder' is what the argument she makes actually supports. Kept as the standalone paragraph she wrote; my first repair had set it as a pull-quote, which was a presentation change nobody asked for.

6. **Appended one sentence: "What it does not make cheap is judgement."**
   - Why: CL-008 requires the limit in the same breath as the claim, and the submission stated a limit only once, in the closing section. This is the only sentence in the final article that is not the author's. It is eight words, it states a limit rather than advancing an argument, and it is the mandatory correction the Brand Guardian asked for. If a human would rather it were her sentence, it is the one line to send back.
   - Rule: `CL-008`

7. **"We're used to see the political players prosper quickly" became "We're used to seeing the political players prosper quickly."**
   - Why: Grammatical error in the pivot sentence of the opening, rated HIGH by Editorial and MEDIUM by Audience as an early credibility cost. Her contraction and her 'the political players' kept.

8. **"Office politics worked because proof much delayed" became "Office politics worked because proof was delayed."**
   - Why: Missing verb in the sentence the whole argument rests on. Editorial rated it HIGH and supplied this exact wording; Audience rated it HIGH under CL-002. The two sentences after it are hers, unchanged: my first repair rewrote them to 'proof was slow' and 'Testing a better idea needed a budget', which was not needed to fix the grammar.
   - Rule: `CL-002`

9. **"their ability for standing next to anything that went well" became "an ability to stand next to anything that went well."**
   - Why: Idiom error flagged MEDIUM by Editorial, and advisory by the Brand Guardian against the twelve-year-old reading standard.
   - Rule: `CL-002`

10. **"with few AI tools" became "with a few AI tools".**
   - Why: The second of the three article errors Editorial flagged as one MEDIUM finding.
   - Rule: `CL-002`

11. **The jargon list was repunctuated from "Transformation /Strategic alignment/Operational excellence/Unlocking synergies" to "Transformation", "Strategic alignment", "Operational excellence", "Unlocking synergies". Her capitals and her "(pick your favourite)" kept.**
   - Why: Editorial LOW on the slash run-on. Quoting each term separately also keeps the VC-001 exemption unambiguous, since the voice checker only exempts jargon inside quotation marks and three of these four words are on the banned list.
   - Rule: `VC-001`

12. **"The Performative usage of AI to..." became "Performative use of AI to..." and "The Pragmatic usage of AI to..." became "Pragmatic use of AI to...".**
   - Why: Editorial MEDIUM: awkward construction and inconsistent capitalisation. This is Editorial's recommended wording verbatim, which keeps her 'validate data, and ship functional tools'. My first repair had rewritten both bullets into bolded labels with different words.

13. **"it dramatically raises the cost of maintaining them" became "maintaining it".**
   - Why: Editorial LOW: 'them' had no clean antecedent, since 'politics' is singular here. Only the pronoun changed. 'won't instantly' and 'dramatically' are hers and are restored; Editorial asked for one intensifier dropped and that was taken on 'fundamentally'.

14. **"organizational intelligence" became "organisational intelligence".**
   - Why: House and author both use British spelling everywhere else in the piece, including 'organisations' in the second paragraph. Spelling consistency, not a rule.

15. **Headings put into sentence case: "1. The Death of cheap authority" to "1. The death of cheap authority", "3. What modern Leadership requires" to "3. What modern leadership requires", "The Bottom Line" to "The bottom line".**
   - Why: Editorial LOW and SEO/GEO both flagged inconsistent capitalisation across the title and headings. Her heading wording is untouched; my first repair had rewritten heading 3 into a question for GEO, which is now reverted.

16. **Frontmatter title "the Great Corporate Unmasking" became "The Great Corporate Unmasking".**
   - Why: Lowercase opening article, flagged by Editorial and SEO/GEO. Matches the two already-published versions of this piece.

17. **Frontmatter subtitle "AI is about to make office politics very expensive" became "AI is about to make office politics expensive".**
   - Why: 'very' is a listed intensifier under VC-002. The gate strips frontmatter before checking, so this was not a gate failure, but the rule governs the house's voice. This is not my wording: the already-published in-brief version of this article carries exactly this subtitle without 'very', so there is house precedent for this line specifically.
   - Rule: `VC-002`

18. **Added frontmatter key longVersion: the-great-corporate-unmasking.**
   - Why: A finding, not only an edit, and the most important one in this run: the submission is a third version of an article already on this site. site/content/the-great-corporate-unmasking.md (7-minute long form) and site/content/the-great-corporate-unmasking-in-brief.md (3-minute short form), plus Spanish translations of both, already exist and are already house-edited. longVersion is a key tools/build/site.mjs actually reads, so it is the supported way to make the canonical link SEO/GEO asked for. A human still needs to decide whether this draft replaces the published in-brief version or duplicates it.

19. **Added frontmatter key standfirst, carrying her opening paragraph verbatim: "For decades, navigating office politics was a bulletproof career path. AI is about to turn it into a costly liability." The same sentence pair was removed from the body, so it appears once.**
   - Why: Without standfirst, tools/build/site.mjs line 575 falls back to the eight-word subtitle for og:description and line 756 for the index card. This is a move, not an edit: not one word of hers changed, and it is exactly what her own published sibling site/content/the-great-corporate-unmasking-in-brief.md does with the same two sentences. It had to leave the body because site.mjs renders standfirst in the hero at line 625, above the article text, so keeping it in both places would print her opening twice on the page. Net effect on G6 is -1% length, because those 20 words moved out of counted prose.

20. **Added frontmatter key authorPhoto: people/helena-carre.jpg.**
   - Why: Copied from her published sibling, and checked rather than assumed. brand/photography/credits.json carries the entry: file site/content/people/helena-carre.jpg, origin "Supplied by Helena Carre for use with her own byline", consent "Subject supplied the image for this purpose", goodFor "Byline and bio for Helena Carre only", clearedForPublication true. That satisfies the provenance-and-consent condition Compliance attached to adding a photograph, and it clears the G4 note "Byline with no authorPhoto". Advisory for a human: that entry still has photographer "UNKNOWN — confirm" and licence "UNKNOWN — confirm". The image is already live on the sibling page, so this adds no new exposure, but the two unknown fields are worth closing.
   - Rule: `CL-009`

21. **Recorded the slug collision as resolved: do not publish at the SEO agent's slug. The safe filename is site/content/the-great-corporate-unmasking-in-brief.md, replacing the published short form, and publishing_metadata.json's recommendedSlug field must not be used as written.**
   - Why: tools/editorial/run.mjs line 206 copies seo_geo.slug into publishing_metadata.json as recommendedSlug, and tools/build/site.mjs derives the published slug from the filename. That makes the value a live destination, not a suggestion: 'the-great-corporate-unmasking' is site/content/the-great-corporate-unmasking.md, the 1716-word long form, and writing this 3-minute piece there would silently overwrite it. The new finalise gate at run.mjs line 158 now blocks on exactly that, which is correct. I cannot clear the gate from here, because it reads seo_geo.slug and the SEO agent's report is not mine to rewrite; the field needs correcting in reports/seo_geo.json to 'the-great-corporate-unmasking-in-brief', or a human needs to approve the replacement. Note that the gate will keep firing even then, and I verified this rather than assuming it: run the gate's own two conditions against both candidates and 'the-great-corporate-unmasking' gives exists true, differs true, and 'the-great-corporate-unmasking-in-brief' gives exists true, differs true. Both block. That is not a defect, it is the harness asking a human whether this draft replaces a live page, and it cannot be answered by picking a different slug. There are exactly two ways out and only one of them is good: a human approves overwriting site/content/the-great-corporate-unmasking-in-brief.md with this draft and commissions the Spanish retranslation in the same change, or this ships at an unoccupied slug, which would leave three near-identical English pages competing with each other and is the outcome the SEO agent itself warned against. I recommend the first. So NEEDS_REVIEW is the correct terminal state for this run, and I am not treating the remaining blocker as something to engineer away.
   - Rule: `CL-011`

22. **Recorded the translation consequence: replacing site/content/the-great-corporate-unmasking-in-brief.md requires re-translating site/content/the-great-corporate-unmasking-in-brief.es.md in the same change.**
   - Why: The Spanish short form is a translation of the published English short form, which this draft would replace. Ship the English alone and the Spanish becomes a translation of text that no longer exists, while still rendering as the Spanish version of this page. CL-011 requires the translation's shape to match the original, and the shape has changed here: her 43-word two-tribes sentence is now three sentences, the consulting bullet no longer makes a speed claim, the 40-page figure is hedged with 'about', and a limit sentence has been added. CL-032 compounds it, because the language switcher would keep offering a Spanish version that no longer corresponds to the English. CL-011 also requires a native speaker to review the retranslation, including a machine-assisted draft (docs/02-voice.md, Translation). The same applies to the long form if the long/short pair is re-cut: site/content/the-great-corporate-unmasking.es.md exists too. This run did not touch either Spanish file and had no mandate to.
   - Rule: `CL-011`

23. **Reverted my own first-round addition: "I find it useful to think of two groups inside most organisations." Her third-person "Most organisations house two distinct tribes" is restored.**
   - Why: Counting baseline, stated once here because the last two entries are the ones that make the number ambiguous: changes[] holds 24 entries, of which 22 are deltas against the submission and these final two are reverts of my own blocked first round with zero delta against her draft, kept because an auditor needs to see what was withdrawn. Where one entry contains another — the article fix 'with few AI tools' sits inside the consulting-bullet rewrite — I have counted the finer grain, since each was a separate specialist finding. Counting only coarse groups gives 18, which is equally defensible; the number I am reporting is 22 deltas, of which 20 are text and 2 are the frontmatter keys added in repair round 2. This entry itself: this was the G6 blocker and the coordinator is right. Her submission contains no first person at all; introducing a personal view puts an opinion she did not express under her byline, and it ships looking exactly like her work. docs/02-voice.md makes the byline the author's voice for any named author, not only guest: true. Three specialists had asked for the typology to be softened, and reframing it as a personal lens was the wrong instrument: the Fact Checker's actual instruction was to keep it as her framing and only avoid implying it is research-based, which her own wording does not do. The concern is recorded as advisory instead of edited away.

24. **Reverted four other first-round rewrites of her prose: "greener pastures" (I had written "another role"), "democratic access to information" (I had written "the information is open to everyone"), "Both might claim massive productivity gains" (I had written "will claim large"), and "giving them autonomy" (I had written "giving them room").**
   - Why: All four were advisory preferences, not corrections. 'greener pastures' and 'democratic access' were Audience LOW idiom and plain-language notes; Editorial's own instruction on 'massive' was 'leave the rest'; and 'giving them room' was nobody's recommendation at all, which the QA auditor caught. On a named byline an advisory note is not a licence to change the author's words.

## Recommendations not taken

- **Compliance, Brand Guardian (CL-001) and Audience: reframe the Truth Seekers / Political Players typology so it is not an empirical claim about most organisations.** — Rejected, after I wrongly accepted it in the first round and triggered the G6 blocker. Her wording cites no research and claims no study, so the Fact Checker's actual requirement ('keep as the author's framing; avoid implying it is research-based') is already met. Recorded as an advisory for a human reader: it is a generalisation in a signed opinion column, which is a normal thing for one to contain.
- **Brand Guardian: replace the banned 'disrupt' sentence with "But AI is about to change who gets rewarded."** — The banned word had to go and it is gone, but that replacement is a new sentence with a new idea in it. Deleting 'fundamentally disrupt' and keeping her object ('the dynamics') clears VC-001 with no invention. The plain-language gain the Brand Guardian wanted is real and is left as advisory.
- **Audience: add an observable test separating performative from pragmatic AI use, and state one thing the framing does not explain.** — Withdrawn from the first round. It was the best idea any specialist had, and it was 47 words of my argument under her byline, which is exactly the failure G6 now catches. It belongs in a note to the author, not in her article.
- **Audience: rename heading 1, which misleads a scanning reader about what the section argues.** — The heading is her coinage and the name of the idea. My first round added a gloss ('Cheap authority is authority you never had to earn with results'), which was my sentence; it is withdrawn. The finding is left as advisory for the author.
- **SEO/GEO: convert headings to question form, and publish at slug 'the-great-corporate-unmasking'.** — Both rejected. The question heading I took in the first round is reverted: rewriting an author's heading for answer engines is a change to her work, not a correction. The slug is worse than unhelpful, because it is already taken by the published 7-minute long form and using it would overwrite a live article. If this ships as a separate page it should take 'the-great-corporate-unmasking-in-brief', as the existing short form does.
- **SEO/GEO: add seoTitle and metaDescription frontmatter.** — tools/build/site.mjs reads no such keys, so they would be dead fields that look like they are doing something. Both strings are good and are recorded here for whoever changes the builder: seoTitle 'The Great Corporate Unmasking: How AI Makes Office Politics Costly'; metaDescription 'AI makes proof, information and testing cheap. See why that raises the cost of office politics and what leaders must do to let evidence outrank authority.'
- **SEO/GEO: add the two-question FAQ block and FAQPage structured data to the page.** — It would add a section the author did not write to a three-minute opinion column, and the answers only restate sections 1 and 2. Structured data is the site builder's job, not the article's.
- **Compliance: soften "The leaders who win this decade will be the ones secure enough to let evidence outrank authority" to "the leaders most likely to win".** — The Fact Checker classed this as OPINION with no action required, and it is plainly a prediction in a signed column. Hedging every forward-looking sentence in a piece about the cost of empty confidence would leave nothing standing. The two sentences that read as fact rather than prediction were corrected instead.
- **Fact Checker: hedge the consulting claim to "can compress weeks of discovery into days".** — Its own offered wording is still an unsourced comparative, and larger than the roughly 25% improvement its own best evidence found. The comparative is removed altogether rather than restated at a different size. The underlying research is left for the author to cite if she wants the claim back: https://d3.harvard.edu/future-proof-with-ai/?p=1136, retrieved 2026-11-05 by the Fact Checker from search summaries, not from the primary paper.
- **Audience: add a closing line pointing to a concrete next step for the reader.** — The Audience agent said itself not to add it if it would be promotional. The last two sentences are the strongest in the piece; a call to action after them would read as a sales close and would undercut the article's own point.
- **Audience: gloss the quoted buzzwords once for readers outside corporate culture.** — Explaining the joke removes it. VC-001 exempts quoted jargon precisely because naming a word to puncture it is the point, and '(pick your favourite)' tells a reader who does not know the words that they are not meant to take them seriously.
- **Brand Guardian: replace 'buzzword-bingo' and 'organisational intelligence' as above the plain-language bar; use 'a long deck' or 'forty pages' instead of the figure.** — All three kept. 'buzzword-bingo' is on Editorial's preserved list as her voice and is illustrated by the four quoted examples two paragraphs later. 'organisational intelligence' is the hinge of her closing argument and is explained by the clause that follows it. Her digit '40' is kept and hedged with 'about', which satisfies CL-010 without respelling her sentence.
- **Brand Guardian: the closing sentence is over 25 words and must be split (VC-003).** — Factually wrong, and I acted on it in the first round. Correcting my own misattribution: this was the Brand Guardian's finding, not Editorial's — editorial.json makes no VC-003 finding anywhere, and my changes[] entry on the split names the Brand Guardian correctly. The sentence is 25 words and the check fails only above 25. Running voice-check --verbose on the submission names the 43-word two-tribes sentence as the one offender. Her closing sentence is restored intact and G1 passes 6/6.

## Diff against the original submission

```
.../{original_article.md => final_article.md}      | 37 +++++++++++-----------
 1 file changed, 19 insertions(+), 18 deletions(-)
```
