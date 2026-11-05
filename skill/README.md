# The Human First AI brand skill

Packages the brand system for Claude Code, so anyone on the team produces on-brand,
accessible work without reading the whole book first.

## Install

**For yourself:**

```bash
cp -r human-first-ai-brand ~/.claude/skills/
```

**For a project, so the whole team gets it on clone:**

```bash
mkdir -p .claude/skills
cp -r /path/to/humanfirstai/skill/human-first-ai-brand .claude/skills/
git add .claude/skills && git commit -m "Add Human First AI brand skill"
```

Claude picks it up automatically. Nothing to configure.

## Using it

Just describe the work. The skill loads when the task touches Human First AI.

- *"Draft a LinkedIn post about yesterday's Lagos workshop — 28 grandmother traders."*
- *"Check this flyer against the brand before it goes to print."*
- *"What orange do I use for a heading on cream?"*
- *"Make a WhatsApp event card for Saturday's session at the library."*
- *"Rewrite this paragraph in our voice."*

## What is inside

```
human-first-ai-brand/
  SKILL.md                  the five rules and a quick-reference table
  references/
    voice.md                how we write, the banned-word list, the honesty rules
    colour.md               the palette with measured contrast figures
    logo.md                 which file to use when, clear space, the nine misuses
    social.md               platform sizes, the four card types, post structure
    checklist.md            the pre-publish review
  assets/
    tokens.json             design tokens
    metrics.json            font advance widths, so the card script can wrap text
    logo/                   the nine logo builds you actually reach for
  scripts/
    check-contrast.mjs      WCAG checker and palette auditor
    voice-check.mjs         paragraph shape, sentence length, banned terms
    new-card.mjs            generates an on-brand card as editable SVG
```

## The scripts

Plain Node, no dependencies, no install.

```bash
# one pairing — exits non-zero if it fails AA
node scripts/check-contrast.mjs "#FFFFFF" "#FF8A3D"

# one colour against the whole palette
node scripts/check-contrast.mjs "#187F72"

# every hex in a file, flagged if it is off-palette
node scripts/check-contrast.mjs --audit src/styles.css
```

```bash
# paragraph shape, sentence length, banned terms, intensifiers
node scripts/voice-check.mjs draft.md
node scripts/voice-check.mjs draft.md --verbose
```

```bash
node scripts/new-card.mjs --type statement --w 1200 --h 627 \
  --kicker "Plain English AI" \
  --headline "You do not need a computer science degree to use this." \
  --footer "humanfirst.ai" --out post.svg

node scripts/new-card.mjs --type event --w 1080 --h 1080 --theme paper \
  --kicker "Free workshop" --headline "Learn what AI actually does" \
  --fact "Saturday 7 November, 10:00" --fact "St Jude Community Library" \
  --fact "Tea and snacks provided" --fact "Bring a friend" \
  --cta "Forward this to one neighbour" --out event.svg

node scripts/new-card.mjs --type stat --theme ink \
  --value "140,000" --headline "neighbours have sat down with us so far" --out stat.svg
```

Cards come out as SVG with live text, so you can open them in Figma, Illustrator, Inkscape or
Canva and change the words. Install the two fonts from `brand/type/fonts/` (both free) for
them to render correctly. For ready-made PNGs, use `brand/templates/` or run the full pipeline
in `tools/`.

## Keeping it current

The skill is a copy. When the brand system changes, re-copy it — or add this repository as a
submodule and symlink the folder, so it updates with a pull.
