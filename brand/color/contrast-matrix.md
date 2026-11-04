# Contrast matrix — measured, not estimated

Every figure below is recomputed from the hex values with the WCAG 2.2 relative-luminance
formula by `tools/build/color.mjs`. Regenerate with `npm run build` in `tools/`.

Read the table as **row text on column background**.

| on → | Warm Cream | Paper White | Deep Ink | Ink Muted | Sunrise | Sunrise Deep | Community Teal | Sky | Sky Deep | Clay |
|---|---|---|---|---|---|---|---|---|---|---|
| **Warm Cream** | — | 1.07 | 13.34 | 4.5 | 2.19 | 4.51 | 4.55 | 1.78 | 4.52 | 4.53 |
| **Paper White** | 1.07 | — | 14.26 | 4.81 | 2.35 | 4.82 | 4.86 | 1.9 | 4.83 | 4.84 |
| **Deep Ink** | 13.34 | 14.26 | — | 2.96 | 6.08 | 2.96 | 2.93 | 7.49 | 2.95 | 2.94 |
| **Ink Muted** | 4.5 | 4.81 | 2.96 | — | 2.05 | 1 | 1.01 | 2.53 | 1 | 1.01 |
| **Sunrise** | 2.19 | 2.35 | 6.08 | 2.05 | — | 2.06 | 2.07 | 1.23 | 2.06 | 2.06 |
| **Sunrise Deep** | 4.51 | 4.82 | 2.96 | 1 | 2.06 | — | 1.01 | 2.53 | 1 | 1 |
| **Community Teal** | 4.55 | 4.86 | 2.93 | 1.01 | 2.07 | 1.01 | — | 2.56 | 1.01 | 1 |
| **Sky** | 1.78 | 1.9 | 7.49 | 2.53 | 1.23 | 2.53 | 2.56 | — | 2.54 | 2.54 |
| **Sky Deep** | 4.52 | 4.83 | 2.95 | 1 | 2.06 | 1 | 1.01 | 2.54 | — | 1 |
| **Clay** | 4.53 | 4.84 | 2.94 | 1.01 | 2.06 | 1 | 1 | 2.54 | 1 | — |

Thresholds: **4.5:1** for body text, **3:1** for text at 24px / 18.66px bold and above,
**3:1** for icons, logo parts, chart marks and input borders (WCAG 1.4.11).

## Approved pairings

| Text | Background | Ratio | Grade | Where it may be used |
|---|---|---|---|---|
| Deep Ink | Warm Cream | 13.34:1 | AAA | Body copy, headlines, the logo — the default pairing |
| Deep Ink | Paper White | 14.26:1 | AAA | Print, certificates, anything that must survive a photocopier |
| Ink Muted | Warm Cream | 4.5:1 | AA | Captions, metadata, photo credits |
| Warm Cream | Deep Ink | 13.34:1 | AAA | Reversed cards, slides and footers |
| Sunrise Deep | Warm Cream | 4.51:1 | AA | Accent headings, icons, links, focus rings |
| Community Teal | Warm Cream | 4.55:1 | AA | Section kickers, subheads, success states |
| Sky Deep | Warm Cream | 4.52:1 | AA | Links and chart labels |
| Clay | Warm Cream | 4.53:1 | AA | Error text — always alongside a word, never colour alone |
| Deep Ink | Sunrise | 6.08:1 | AA | Primary buttons and high-visibility callouts |
| Paper White | Community Teal | 4.86:1 | AA | Secondary buttons and badges |
| Sunrise | Deep Ink | 6.08:1 | AA | Accent text and the lit doorway on reversed surfaces |

## Forbidden pairings

| Combination | Ratio | Why |
|---|---|---|
| Paper White on Sunrise | 2.35:1 | Illegible. All text on a Sunrise fill is Deep Ink. |
| Sunrise on Warm Cream | 2.19:1 | Sunrise is a fill, not an ink. On light surfaces use Sunrise Deep. |
| Sunrise on Paper White | 2.35:1 | Same rule on white. |
| Sky on Warm Cream | 1.78:1 | Sky is a surface tint. It never carries type. |
| Sky on Paper White | 1.9:1 | Same rule on white. |
| Community Teal on Deep Ink | 2.93:1 | Too close in value. On Deep Ink use Sunrise or Sky instead. |
| Clay on Deep Ink | 2.94:1 | Too close in value. On Deep Ink, warn with Sunrise plus a word. |

## What changed in v2.0, and why

The v1 matrix was published with hand-estimated figures. Three of them were wrong in the
direction that matters — they described failing pairs as passing.

| Pairing | v1 claimed | Measured | Consequence |
|---|---|---|---|
| White on Community Teal `#1A8C7E` | 4.88, AA | **4.12** | Failed AA. v1 approved it for 16px body text. |
| Community Teal `#1A8C7E` on Warm Cream | 4.62, AA | **3.85** | Failed AA. v1 approved it for subheads. |
| Deep Ink on Sunrise | 7.15, AAA | **6.08** | Passes AA, not AAA. |
| Sunrise on Warm Cream | not listed | **2.19** | Below the 3:1 floor for graphics — yet v1 set the logo's door leaf and the "AI" in the wordmark in it. |

Community Teal was darkened to `#187F72`, which clears 4.5:1 both as text on cream and as a
fill under white text. Sunrise Deep was added so the brand can set orange type at all. The
mark was rebuilt so the Sunrise doorway is enclosed by Deep Ink on all four sides and never
meets a light background directly.
