<div align="center">
  <img src="brand/logo/png/hfai-stacked-full-600w.png" width="300" alt="Human First AI">

  **Make AI feel like an open door, not a locked lab.**

  The brand system for Human First AI — logo, colour, type, icons, templates and voice,
  with the tooling that generates all of it.
</div>

---

## Grab what you need

| | |
|---|---|
| **The logo** | [`brand/logo/svg/`](brand/logo/svg/) — start with `hfai-horizontal-full.svg` |
| **Colours** | [`brand/color/`](brand/color/) — `tokens.css`, `tokens.json`, Tailwind preset, `.ase` |
| **Fonts** | [`brand/type/fonts/`](brand/type/fonts/) — both free, licences included |
| **A LinkedIn post** | [`brand/templates/linkedin/`](brand/templates/linkedin/) — editable SVG + ready PNG |
| **Icons** | [`brand/icons/`](brand/icons/) — 12 icons, individual SVGs and a sprite |
| **Photographs** | [`brand/photography/`](brand/photography/) — read `credits.json` first |
| **The guidelines** | [`docs/`](docs/) — start at [00-start-here.md](docs/00-start-here.md) |

No build step needed to use any of it. Clone, or download the single file you want.

## The five rules

1. **Human leads.** In the name, the layout, the sentence. "AI" is always smaller and quieter.
2. **Plain words.** Reading age twelve. If a twelve-year-old can't act on it, rewrite it.
3. **Warm, not cold.** Cream paper and ink. Never black glass, cyan or glow.
4. **Measured contrast.** Body text clears 4.5:1, graphics 3:1. Every figure here is computed.
5. **Real people, real light.** No robots, no circuits, no synthetic faces.

## The guidelines

| | |
|---|---|
| [00 Start here](docs/00-start-here.md) | The two-minute version |
| [01 Foundation](docs/01-foundation.md) | Who we are, who we speak to, why there is no hyphen |
| [02 Voice](docs/02-voice.md) | How we write, with the jargon list |
| [03 Logo](docs/03-logo.md) | The Open Door mark, lockups, clear space, misuse |
| [04 Colour](docs/04-colour.md) | The palette and the measured contrast table |
| [05 Typography](docs/05-typography.md) | The scale, and how it behaves across scripts |
| [06 Icons](docs/06-iconography.md) | Twelve icons, and the jargon each replaces |
| [07 Photography](docs/07-photography.md) | What we shoot, and what we are not allowed to fake |
| [08 Graphic devices](docs/08-graphic-devices.md) | The Open Threshold, and nothing else |
| [09 Social playbook](docs/09-social-playbook.md) | LinkedIn, newsletters, WhatsApp, Instagram |
| [10 Applications](docs/10-applications.md) | Flyers, shirts, slides, certificates, the photocopy test |
| [11 Accessibility](docs/11-accessibility.md) | The floor, not the ceiling |
| [12 Chapters and partners](docs/12-chapters-and-partners.md) | Co-branding without losing the plot |
| [13 Governance](docs/13-governance.md) | Who decides, and how to propose a change |
| [Audit: v1 to v2](docs/audit-v1-to-v2.md) | What was wrong with the old system, and what changed |

## The Claude skill

[`skill/human-first-ai-brand/`](skill/human-first-ai-brand/) packages the whole system for
Claude Code, so anyone on the team gets on-brand output without reading all of the above first.

```bash
cp -r skill/human-first-ai-brand ~/.claude/skills/
```

Then just ask — "draft a LinkedIn post about the Lagos workshop", "check this flyer against
the brand" — and it will apply the voice, the palette and the accessibility floor.
Installation detail and two zero-dependency helper scripts: [`skill/README.md`](skill/README.md).

## Regenerating the assets

Everything in `brand/` is generated. **Never hand-edit it** — the next build overwrites your
change, and the other 37 chapters never see it. Edit the generator instead.

```bash
cd tools
npm install
npm run build        # regenerates every asset in brand/
npm run contrast     # prints the measured WCAG matrix
```

| Generator | Produces |
|---|---|
| `tools/lib/brand.mjs` | The mark's geometry and the palette — the single source of truth |
| `tools/build/logo.mjs` | 29 lockups, PNG set, favicons, `.ico`, app icons, manifest |
| `tools/build/color.mjs` | Tokens in five formats, `.ase`, swatch sheet, contrast matrix |
| `tools/build/type.mjs` | Type scale, `type.css`, font CSS, specimen |
| `tools/build/icons.mjs` | 12 icons, sprite, JSON index, small-size proof |
| `tools/build/graphics.mjs` | Open Threshold device, construction and misuse diagrams |
| `tools/build/social.mjs` | 28 templates across LinkedIn, newsletter, IG, WhatsApp, X, slides |
| `tools/build/photos.mjs` | Responsive photo sets, arch crops, photo cards, alt text |
| `tools/build/site.mjs` | The published site and the long-form article template |
| `tools/build/narrate.mjs` | Article narration with Kokoro-82M, run locally (`npm run narrate`) |
| `tools/build/voices.mjs` | The voice picker page (`npm run voices`) |

## The published site

[**hkcarre.github.io/humanfirstai**](https://hkcarre.github.io/humanfirstai/) — long-form
articles built from the same tokens, type scale and accessibility floor as everything else.
It is the system's own proof: if an article cannot be set well with these rules, the rules are
wrong.

It also carries **[An open door, in three dimensions](https://hkcarre.github.io/humanfirstai/showcase.html)** — walk through the mark itself as a backlit cut-paper diorama, then find the chapters on a halftone globe. Spatial depth and physical craft, built from the same tokens, with no libraries and 63 KB of page.

Write a new piece as markdown in `site/content/`, run `npm run build` in `tools/`, and push.
The generator produces the page, the social preview card and the index entry. GitHub Actions
deploys it.

## The brand studio app

The React app in `src/` is a browsable version of the system — logo studio, colour matrix,
type specimen, mockups.

```bash
npm install
npm run dev
```

It is a viewer, not the source. The files in `brand/` are what you ship.

## Licence

Brand assets and documentation: **CC BY-NC 4.0** — free for any community, chapter, partner,
library or school to use and adapt non-commercially, with attribution.

Tooling in `tools/` and `src/`: **MIT**.

Fonts: SIL Open Font Licence 1.1, travelling with the files in `brand/type/fonts/`.

The name and the mark belong to the movement. Use them to do the work. Do not use them to
sell something.
