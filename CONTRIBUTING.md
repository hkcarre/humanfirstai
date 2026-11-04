# Contributing

The brand system is meant to be improved, not worked around. If you hit a real limit, that
is a gap in the system, not a licence to improvise.

## The one rule

**Never hand-edit anything in `brand/`.** Every file there is generated from `tools/`. A
hand-edit is overwritten by the next build, and the other 37 chapters never see it.

Change the generator, run the build, commit both.

## Setup

```bash
cd tools
npm install
npm run build       # regenerates everything in brand/
npm run contrast    # prints the measured WCAG matrix
```

## Proposing a change

1. **Open an issue** describing the problem — not the solution you have in mind. Show the
   layout that could not be made.
2. **Put the change in `tools/`**, not in `brand/`. If the generator does not produce it,
   it is not in the system.
3. **Run `npm run build`** and commit the regenerated assets alongside the generator change,
   so reviewers can see the result.
4. **Colour changes come with numbers.** Any new or altered colour needs
   `tools/build/color.mjs` output showing it clears its threshold. Contrast figures in this
   repository are computed, never asserted.

## What needs sign-off

| Change | Who |
|---|---|
| The mark, the palette, the typefaces | Brand stewardship |
| New templates, sizes, icons, copy corrections, docs | Anyone, merged on review |
| Translations | A native speaker from that chapter, named in the PR |

## Checks before you open a PR

- [ ] `npm run build` runs clean and the diff in `brand/` is only what you intended
- [ ] New colours clear 4.5:1 for text, 3:1 for graphics — with the output pasted in
- [ ] New templates render correctly as both SVG and PNG
- [ ] New icons proven at 48, 24 and 16px
- [ ] Any copy follows [docs/02-voice.md](docs/02-voice.md) — no banned words
- [ ] Anything with a person in it has provenance and consent in `credits.json`

## Reporting a problem with the brand itself

Accessibility failures, mistranslations and anything that would embarrass a learner get
priority over everything else. Open an issue and say so in the title.
