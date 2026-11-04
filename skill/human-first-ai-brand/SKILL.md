---
name: human-first-ai-brand
description: Use when writing, designing, or reviewing anything carrying the Human First AI name — LinkedIn posts, newsletters, workshop flyers, slide decks, web UI, email, logo placement, colour or font choices, alt text — or when checking whether existing Human First AI material is on brand, readable, and accessible.
---

# Human First AI — brand system

A global movement making AI usable by ordinary people. Free workshops, plain language,
tools for real life.

**The line that decides everything:** *Make AI feel like an open door, not a locked lab.*

## The five rules

1. **Human leads.** In the name, the layout, the sentence. "AI" is always smaller and quieter.
2. **Plain words.** Reading age twelve. If a twelve-year-old can't act on it, rewrite it.
3. **Warm, not cold.** Cream paper and ink. Never black glass, cyan, purple, or glow.
4. **Measured contrast.** Body text clears 4.5:1. Icons and logo parts clear 3:1. No guessing.
5. **Real people, real light.** No robots, circuits, brains, or synthetic faces.

## Quick reference

| | |
|---|---|
| Name | `Human First AI` — never hyphenated, never reordered, never translated |
| Canvas | Warm Cream `#FFF6EC` (60%) |
| Text & structure | Deep Ink `#1F2A44` (25%) — 13.34:1 on cream |
| Accent **fill only** | Sunrise `#FF8A3D` (8%) — 2.19:1 on cream, so never type or lines on light |
| Accent **text** | Sunrise Deep `#C24D00` — 4.51:1 on cream |
| Secondary | Community Teal `#187F72` (5%) · Sky `#7CC4F2` fill only (2%) |
| Muted text | Ink Muted `#68728A` — a real colour, never ink at reduced opacity |
| Display & UI font | Plus Jakarta Sans |
| Body font | Atkinson Hyperlegible, 17px minimum, 1.65 line height |
| Smallest type anywhere | 14px / 11pt |
| Logo | `brand/logo/svg/hfai-{horizontal,stacked,symbol}-{full,reversed,mono-ink}.svg` |
| Logo at 24px or below | `hfai-symbol-micro-*.svg` — a different drawing, not a scaled one |

**Two mistakes that account for most off-brand work:**
white text on Sunrise (2.35:1 — forbidden, use Deep Ink), and Sunrise used as type or a
hairline on cream (2.19:1 — use Sunrise Deep).

## Before producing anything, load what applies

| Task | Read |
|---|---|
| Writing copy, headlines, posts, captions | `references/voice.md` |
| Choosing or checking colours | `references/colour.md` |
| Placing or exporting the logo | `references/logo.md` |
| LinkedIn, newsletter, Instagram, WhatsApp, slides | `references/social.md` |
| Reviewing finished work | `references/checklist.md` |

The full brand book lives in `docs/` in the repository
([github.com/hkcarre/humanfirstai](https://github.com/hkcarre/humanfirstai)).
Design tokens for code: `assets/tokens.json`.

## Tools

```bash
# Check any colour pairing, or audit every hex in a file
node scripts/check-contrast.mjs "#1F2A44" "#FFF6EC"
node scripts/check-contrast.mjs --audit path/to/styles.css

# Generate an on-brand card as SVG (no dependencies)
node scripts/new-card.mjs --type statement --w 1200 --h 627 \
  --kicker "Plain English AI" \
  --headline "You do not need a computer science degree to use this." \
  --out post.svg
```

Run `--help` on either script for all options.

## Common mistakes

| Mistake | Fix |
|---|---|
| White text on a Sunrise button | Deep Ink on Sunrise (6.08:1) |
| Orange headline or icon on cream | Sunrise Deep `#C24D00` |
| Muted text as `opacity: 0.6` | Use `#68728A` — opacity breaks on flatten and print |
| "AI" set large, bold, or in orange | Smaller, Bold, Deep Ink. Human leads. |
| Logo dropped straight onto a photo | Reversed build over a scrim — see `references/logo.md` |
| Logo scaled below 24px | Use the micro build |
| 13px captions "to fit" | 14px is the floor. Cut words instead. |
| "AI-powered", "unlock", "seamless", "revolutionise" | Delete and say what it actually does |
| An AI-generated image of a person | Not approved for any public material, ever |
| Hand-editing a file in `brand/` | Edit `tools/` and rebuild — otherwise 37 chapters never see it |

## When the system has no answer

Don't improvise a new colour, weight, device or lockup. Say what broke, and open an issue at
[github.com/hkcarre/humanfirstai](https://github.com/hkcarre/humanfirstai). A gap in the
system is a bug in the system.
