# 13 · Governance

## The sign-off checklist

Five questions. All five have to be yes.

1. Does it sound like a patient, trusted teacher — no hype, no jargon?
2. Could a twelve-year-old read the main message and act on it?
3. Does every text and background pairing pass WCAG AA?
4. Is "Human" leading, visually and in the sentence?
5. Are there real people in natural light, rather than sci-fi clichés?

## What success looks like

- A nervous first-time learner thinks: *this is for me.*
- A funder thinks: *this is credible.*
- A volunteer thinks: *I am proud to wear this.*
- Someone who saw it once can draw the mark from memory a week later.

## Proposing a change

The system is meant to be improved, not worked around. If you have hit a real limit:

1. **Open an issue** on [github.com/hkcarre/humanfirstai](https://github.com/hkcarre/humanfirstai)
   describing the problem — not the solution you have in mind.
2. **Show the case that broke.** A screenshot of the layout that could not be made.
3. **Propose it as a pull request** against `tools/`, not as a one-off file. If the generator
   does not produce it, it is not in the system.
4. **Contrast numbers are computed, not asserted.** Any colour change has to come with
   `tools/build/color.mjs` output.

Changes to the mark, the palette or the typefaces need agreement from brand stewardship.
Everything else — new templates, new sizes, new icons, copy corrections — can be proposed by
anyone and merged on review.

## Versioning

| Version | |
|---|---|
| **2.0** (current) | Open Door mark rebuilt, palette corrected for WCAG, generated asset pipeline, this book |
| 1.0 | Original concept routes and 30-page manual. Superseded. See [the audit](audit-v1-to-v2.md). |

Assets are generated from `tools/`. Never hand-edit anything in `brand/` — it will be
overwritten on the next build, and the change will not reach the other 37 chapters. Change the
generator.

```bash
cd tools
npm install
npm run build       # regenerates everything in brand/
npm run contrast    # prints the measured contrast matrix
```

## Licence

Brand assets and documentation: **CC BY-NC 4.0**. Free for any community, chapter, partner,
library or school to use and adapt non-commercially, with attribution.

Build tooling in `tools/` and `src/`: **MIT**.

Fonts: SIL Open Font Licence 1.1. Licences travel with the files in `brand/type/fonts/`.

The name and the mark are the movement's. Use them to do the work. Do not use them to sell
something.
