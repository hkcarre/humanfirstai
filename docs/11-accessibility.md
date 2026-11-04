# 11 · Accessibility

We teach people who have been locked out of technology. Shipping something they cannot read
would be the single most hypocritical thing this movement could do.

**Target: WCAG 2.2 Level AA, everywhere, with AAA on body copy wherever it is achievable.**

## The numbers

| What | Minimum |
|---|---|
| Body text | 4.5:1 |
| Text 24px+, or 18.66px+ bold | 3:1 |
| Icons, logo parts, chart marks, input borders | 3:1 |
| Focus indicator against its background | 3:1 |
| Smallest type anywhere | 14px / 11pt |
| Smallest body type | 17px / 11pt (14pt on flyers) |
| Touch target | 44 × 44px |

Measured values for every pair: [`brand/color/contrast-matrix.md`](../brand/color/contrast-matrix.md).
Regenerate with `cd tools && npm run build` — the numbers come from the hex values, so they
cannot drift away from reality.

## Things that are not negotiable

**Never colour alone.** Every state carries a word or an icon too. A red dot is not an error
message.

**Never remove focus.** `outline: none` without a replacement locks out every keyboard user.
`tokens.css` ships a `:focus-visible` rule — leave it on.

**Never below 14px.** Not for legal text, not for captions, not to make something fit.

**Never justify body copy.** Rivers in a narrow justified column are genuinely hard for
dyslexic readers.

**Never all-caps a heading.** Capitals remove word shape, which is what low-vision and
dyslexic readers rely on most.

**Alt text on everything meaningful**, `alt=""` on everything decorative. A missing alt
attribute is never correct.

**Captions on all video.** Transcripts on all audio.

**Respect `prefers-reduced-motion`.** If someone has asked the operating system to stop
animation, stop animating.

## Plain language is an accessibility feature

Reading age twelve is not dumbing down. It is the difference between a person understanding
their options and nodding along.

- Short sentences. One idea each.
- Common words. "Use", not "utilise". "Help", not "facilitate".
- Define a term the first time, in the same sentence.
- Say what to do, then why — not the reverse.
- Put the most important sentence first.

## Checking it

Before publishing:

- [ ] Tab through the whole thing. Everything reachable, focus always visible.
- [ ] Zoom to 200%. Nothing clipped, nothing overlapping, no horizontal scroll.
- [ ] Turn the screen greyscale. Does anything stop making sense?
- [ ] Run a screen reader over it. VoiceOver, NVDA or TalkBack — any of them, for five minutes.
- [ ] Print it in black and white on a bad printer.
- [ ] Read it aloud. If you stumble, a reader will too.

## Where we will not pretend

This system does not guarantee compliance. Automated checks catch perhaps a third of real
accessibility problems. The rest is caught by people with disabilities using the thing.

Every chapter is expected to test material with at least one disabled community member before
a campaign goes out, and to pay them for their time.
