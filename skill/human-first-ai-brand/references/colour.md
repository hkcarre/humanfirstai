# Colour

Every figure below is computed from the hex values, not estimated.

## Palette

| Name | Hex | Role | On cream | On ink |
|---|---|---|---|---|
| Warm Cream | `#FFF6EC` | Canvas — 60% | — | 13.34 |
| Deep Ink | `#1F2A44` | Text & structure — 25% | 13.34 | — |
| Sunrise | `#FF8A3D` | **Fill only** — 8% | 2.19 | 6.08 |
| Sunrise Deep | `#C24D00` | Accent text, icons, lines on light | 4.51 | 2.96 |
| Community Teal | `#187F72` | Growth, secondary actions — 5% | 4.55 | 2.93 |
| Sky | `#7CC4F2` | **Fill only** — 2% | 1.78 | 7.49 |
| Sky Deep | `#1277B7` | Links, data labels | 4.52 | 2.95 |
| Ink Muted | `#68728A` | Captions, metadata | 4.50 | 2.95 |
| Clay | `#CE3E22` | The one alert colour | 4.53 | 2.94 |
| Paper White | `#FFFFFF` | Print, certificates | 1.07 | 14.26 |
| Press Black | `#000000` | One-colour print only | 19.65 | 1.47 |

## Thresholds

| What | Minimum |
|---|---|
| Body text | 4.5:1 |
| Text 24px+, or 18.66px+ bold | 3:1 |
| Icons, logo parts, chart marks, input borders | 3:1 |
| Focus indicator | 3:1 |

## Approved pairings

| Text | On | Ratio |
|---|---|---|
| Deep Ink | Warm Cream | 13.34 |
| Deep Ink | Paper White | 14.26 |
| Ink Muted | Warm Cream | 4.50 |
| Warm Cream | Deep Ink | 13.34 |
| Sunrise Deep | Warm Cream | 4.51 |
| Community Teal | Warm Cream | 4.55 |
| Sky Deep | Warm Cream | 4.52 |
| Clay | Warm Cream | 4.53 |
| **Deep Ink** | **Sunrise** | **6.08** — the only text allowed on an orange fill |
| Paper White | Community Teal | 4.86 |
| Sunrise | Deep Ink | 6.08 |

## Forbidden pairings

| Combination | Ratio | |
|---|---|---|
| White on Sunrise | 2.35 | Never, at any size |
| Sunrise on cream or white | 2.19 / 2.35 | Use Sunrise Deep |
| Sky on cream or white | 1.78 / 1.90 | Sky is a surface tint, never type |
| Community Teal on Deep Ink | 2.93 | Too close in value — use Sunrise or Sky |
| Clay on Deep Ink | 2.94 | On ink, warn with Sunrise plus a word |

## Rules

**Sunrise and Sky are fills, not inks.** Neither carries type, a hairline, an icon stroke or
a chart line on a light surface.

**All text on a Sunrise fill is Deep Ink.**

**Never carry meaning with colour alone.** Every state gets a word or an icon too. A red dot
is not an error message; "Error: this date has passed" is.

**Muted text is a colour, not an opacity.** `#68728A`, never `rgba(31,42,68,0.6)` — opacity
breaks when flattened, printed, or composited on anything but the expected background.

## In code

Use semantic tokens so a palette correction propagates:

```css
@import url("brand/color/tokens.css");
.card  { background: var(--hf-surface); color: var(--hf-text); }
.muted { color: var(--hf-text-muted); }
.btn   { background: var(--hf-action-accent-bg); color: var(--hf-action-accent-fg); }
a      { color: var(--hf-text-link); }
```

`data-theme="ink"` on a container flips every token to its reversed value.
Also available: `tokens.json`, `tokens.scss`, `tokens.js`, `tailwind.preset.js`, `palette.ase`.

## Print

CMYK values in `tokens.json` are starting points for coated stock. Pantone references are
**nearest matches to proof against, not specifications** — always pull a physical proof.
