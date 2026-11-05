# Review checklist

Run this before anything goes out. All of it, not the convenient parts.

## Voice

- [ ] Sounds like a patient teacher, not a tech company
- [ ] A twelve-year-old could read the main message and act on it
- [ ] Paragraphs are 15-35 words — not a column of one-line paragraphs
- [ ] No banned words (`AI-powered`, `unlock`, `seamless`, `revolutionise`, `leverage`, `empower`…)
- [ ] `node scripts/voice-check.mjs <file>` passes all six checks
- [ ] Guest byline? The voice rules are notes for the author, not edits we make for them
- [ ] AI described by what it helps someone *do*, never as a mind or as magic
- [ ] The limit is stated — what it does not do, in the same breath
- [ ] Any person named has consent on file
- [ ] Any number stated has a source. If estimated, it says "about".
- [ ] Translations: `voice-check` scales word targets by language. Shape must still match the original.

## Identity

- [ ] "Human First AI" — unhyphenated, correct order, not translated
- [ ] "AI" is smaller and quieter than "Human", and not in Sunrise
- [ ] Correct logo build for the background (full / reversed / mono / micro)
- [ ] Clear space of one cap-height "H" on all four sides
- [ ] At or above minimum size; micro build used at 24px and below
- [ ] No rotation, stretch, gradient, shadow, pill or recolour

## Colour and type

- [ ] Every text/background pair clears 4.5:1 — checked, not assumed
- [ ] Icons, logo parts and input borders clear 3:1
- [ ] No white text on Sunrise anywhere
- [ ] No Sunrise or Sky used as type or a hairline on a light surface
- [ ] Muted text is `#68728A`, not an opacity
- [ ] Nothing below 14px; body copy 17px or above
- [ ] Body copy is Atkinson Hyperlegible, ragged right, 60–70 characters a line
- [ ] No all-caps headings

## Images

- [ ] Real people in real light — no robots, circuits, brains, glow
- [ ] Provenance and consent recorded in `credits.json`
- [ ] **Not an AI-generated image of a person** — never approved for public material
- [ ] Scrim behind any type on a photograph, measured not eyeballed
- [ ] Alt text written to the formula: who + what they are doing + where and how it feels
- [ ] Decorative images carry `alt=""`
- [ ] A photograph we do not have renders as a labelled slot, never a broken image or a generated face

## Reach

- [ ] Passes the photocopy test if it will ever be printed
- [ ] Readable at 200% zoom with no clipping or horizontal scroll
- [ ] Still makes sense in greyscale
- [ ] Keyboard reachable with a visible focus ring, if interactive
- [ ] Captions on video, transcripts on audio

## Figures and audio

- [ ] The figure shows something the sentence beside it cannot. If decorative, cut it.
- [ ] Figures in one piece are variations on one idea, not unrelated chart types
- [ ] Two quantities sit on two radii, never stacked on the same one
- [ ] Every number carries its source in the caption. Estimates say "about".
- [ ] Renders complete with JavaScript off and under `prefers-reduced-motion`
- [ ] `role="img"` with a label describing the finding, not the drawing
- [ ] Narration: `cd tools && npm run phonemes:check` passes before generating audio
- [ ] **Somebody has listened to the audio end to end.** Nothing else catches a mis-encoded voice.
- [ ] Anyone else's words are in a ` ```testimony ` block, not a `>` blockquote — the synthetic
      voice must never read a real person's testimony

## Then

Anything you could not do inside these rules is a gap in the system, not a licence to
improvise. Open an issue at github.com/hkcarre/humanfirstai.
