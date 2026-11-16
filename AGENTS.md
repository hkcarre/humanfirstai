# Human First AI: home repo

This repo is the home for Human First AI work. It holds the brand system and
the shared context. Start your AI assistant here, not inside a single
project. Read what you need here first, then open the project the task is
about.

## What is here

- `docs/`: the brand book. Start at `docs/00-start-here.md`.
- `brand/`: the logo, colours, fonts, icons, templates and photographs.
  Every file is generated from `tools/`. Never edit `brand/` by hand. Change
  the generator and run `npm run build` in `tools/`.
- `skill/human-first-ai-brand/`: the brand skill. Install it with
  `skill/README.md`. It has the voice, colour and logo rules, and scripts to
  check contrast and copy.
- `site/content/`: the articles.
- `editorial/` and `.claude/skills/editorial-swarm/`: the editorial review.
  It prepares an article for publication and never publishes or merges.

Before anything goes out, run the checks in `docs/13-governance.md`.
`CONTRIBUTING.md` says how to propose a change and who signs off.

## Other projects

Clone each one next to this repo. Read its own `AGENTS.md` before you change
anything there.

- Website (the public site, Astro): `../humanfirstai-web`. Clone from
  https://github.com/andersthemagi/humanfirstai-web if it is missing. The
  repo is private; ask Andres for access. It carries copies of the colours
  (`src/styles/tokens.css`), the brand rules (`PRODUCT.md`, `DESIGN.md`) and
  the articles (`src/content/posts/`). When one of those changes here,
  update the copy there too.

Add a line here for each new project.
