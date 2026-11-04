# 10 · Applications

## The photocopy test

Most of our printed material is run off on a tired black-and-white photocopier in a community
centre, by a volunteer, at eight in the morning. If it does not survive that, it does not ship.

**Before any flyer is approved, print it on the worst printer you can find.**

- Body text is 100% black on white. No grey body copy, ever.
- No photographs behind text. A halftoned face behind 14pt type is unreadable.
- Date, time and location sit in a bold boxed block.
- Minimum body size on a flyer: **14pt**.
- Use `hfai-*-mono-black.svg`. The full-colour mark halftones into mud.
- Add a tear-off strip or an SMS shortcode. Not everyone in the room has a smartphone, and
  nobody should have to ask.

## Flyers and posters

A4 or US Letter. Margins at least 15mm. One message. The arch window may hold a photograph at
the top, but a flyer with no image and generous white space beats a flyer with a bad one.

Accessibility items that are not optional on a public flyer: step-free access stated
explicitly, a phone number as well as a URL, and the word **FREE** where the eye lands first.

## Slide decks

`brand/templates/slides/`. Four builds: title, content, quote, and dark variants.

Community-hall projectors are dim and the rooms are rarely dark. **Use the dark build** —
Deep Ink background, Warm Cream text — unless you know the room.

- Maximum 25 words a slide. A slide is a conversation starter, not a reading test.
- Minimum 28pt body, 44pt headings. On the 1920 × 1080 templates that is 40px and 72px.
- Every diagram gets high-contrast outlines and written labels.
- Never read your slides aloud. If the slide says it, you do not need to.

## Volunteer kit

**T-shirt.** Deep Ink organic cotton. Left-chest pocket mark, one colour, 70mm wide. On the
back: *"Ask me anything about AI. We will figure it out together."* The shirt should read as
a friendly guide, not security staff.

**Lanyard and badge.** Community Teal strap. The badge carries, in this order of size:
first name at 28pt, languages spoken, chapter. A learner needs to find someone who speaks
their language from across a room.

## Certificate of completion

For many learners this is their first formal technology credential, and it will go on a wall.
It has to feel like it deserves to.

- 250gsm warm cream card.
- Deep Ink border, Sunrise seal — embossed or stamped, never printed as a gradient.
- Signed by the local volunteer educator **and** by the learner. The second signature matters.
- A verification code, and a plain-English list of what they can now do — not a list of
  modules completed.

## Web

- **Under 2 seconds on rural 3G.** That is the constraint everything else bends to.
- Self-host fonts. Subset them. One variable file for Jakarta.
- Full keyboard navigation and a visible focus ring — 3px Sunrise Deep, 2px offset. Never
  `outline: none`.
- Semantic HTML before ARIA. A `<button>` beats a `<div role="button">` every time.
- No carousel on the homepage. No cookie wall. No newsletter pop-up over the workshop finder.
- **Zero-pill discipline.** No decorative capsule badges. Pills are for actions, not labels.
- Three-zone header: mark, a short set of links, one action — "Find a workshop".

## Email

[`brand/templates/email/signature.html`](../brand/templates/email/signature.html).

Mail clients strip SVG, so the signature uses a hosted PNG. Host it once, centrally, and point
every chapter at the same URL — that way a logo update actually reaches everyone.
