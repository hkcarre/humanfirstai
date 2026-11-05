# 07 · Photography

## What a Human First AI photograph looks like

Indistinguishable from documentary journalism.

1. **Warm natural light.** Sun through a window or an open doorway. Never a dark room lit blue
   by a monitor.
2. **Real collaboration.** People looking at each other, laughing, pointing at a notebook,
   sharing a screen. Two heads over one tablet beats one person at a desk.
3. **Genuine range of age, ability and place.** Grandmothers, market vendors, farmers,
   teenagers. Lagos, Lima, Detroit, Jakarta, Hanoi.
4. **The technology is small in the frame.** The person is the subject. The tablet is a prop.
5. **No staged corporate stock.** If it looks like a brochure, it is disqualified.

## The provenance rule

**No photograph of a person is published without a complete row in
[`brand/photography/credits.json`](../brand/photography/credits.json).**

Required: photographer, origin, consent, licence, date, location.

Two of those fields decide whether we are allowed to use an image at all:

- **Consent.** Written, informed, and specific about where the image may appear. A learner who
  agreed to a chapter newsletter has not agreed to a national campaign.
- **Origin.** Commissioned, licensed, or **synthetic**.

### On synthetic images

A movement whose entire argument is that people come first cannot illustrate itself with
people who do not exist. Synthetic imagery of apparent human beings is **not approved for any
public-facing Human First AI material** — not for posts, not for decks, not as a placeholder
that might escape. If we would not accept a fabricated quote, we do not accept a fabricated
face.

Generated imagery is fine for abstract illustration, diagrams and pattern work, and must be
labelled as such in `credits.json`.

> **Open item.** The four photographs inherited with the v1 package have no provenance on file.
> They are marked `clearedForPublication: false` and are in this repository as **composition
> and tone reference only**. Before any of them appears in a campaign, someone has to establish
> where they came from. If that cannot be established, they get replaced.

## The set

Four reference images, in [`brand/photography/`](../brand/photography/):

| | Good for |
|---|---|
| `artisan-block-printing-tablet` | Small business, craft, intergenerational teaching |
| `community-hall-session` | Scale and turnout — the shape of a real session |
| `library-first-laptop` | One-to-one teaching, volunteer recruitment |
| `highland-farmer-frost-forecast` | Agriculture, rural reach, practical daily value |

Each ships as a full-size archive copy, a responsive web set (2400 / 1600 / 1200 / 800 / 400,
JPG and WebP), and an arch-cropped version for the Open Threshold device.

## Type on a photograph

The only layout where type sits on an image. Use
[`brand/photography/cards/`](../brand/photography/cards/) as the pattern.

- **A scrim is mandatory**, and it is not decoration. Deep Ink at 22% flat plus a gradient to
  94% at the bottom takes any photograph below the luminance where Warm Cream type clears
  4.5:1. Measure it; do not eyeball it.
- Never place type over a face.
- Use the **reversed** or **mono-white** logo build. Never the full-colour one.
- If a photograph will not take a scrim without going muddy, it is the wrong photograph.

## Alt text

Formula: **who** + **what they are doing** + **where, and how it feels**.

> A woman with grey hair and glasses sits at a laptop in a brick-walled hall with arched
> windows while a young volunteer in a navy jumper leans in, pointing at the screen; both are
> smiling, with other learners at tables behind them.

Not "image of people". Not "workshop photo". Someone listening instead of seeing should end up
with the same picture in their head.

Purely decorative images get `alt=""` so a screen reader skips them. An empty alt on a
decorative image is correct. A missing alt attribute never is.

All alt text for the set: [`brand/photography/alt-text.md`](../brand/photography/alt-text.md).

## Synthetic voice

We narrate articles with [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M), an
open-weight model under Apache-2.0. It runs on a laptop at build time. The audio file is
generated once and committed, so no reader's text is ever sent to anybody, and nothing is
called at runtime.

Narration is an accessibility feature, not a flourish. A good share of the people this
movement exists for read slowly, read in a second language, have low vision, or are listening
while doing something else with their hands.

### What it may do

- Read our own published prose, with the written text on the same page.
- Carry a label saying it is synthetic, every time, where you cannot miss it.

### What it may never do

- **Speak as a named person.** Not a learner, not a volunteer, not a staff member.
- **Read a quote or a piece of testimony.** If someone said it, either they read it or nobody does.
- **Appear anywhere a listener could reasonably believe they are hearing a specific human being.**

The line is the same one we draw for photography, for the same reason. A synthetic face invents
a person who does not exist. A synthetic voice reading our own words is a reading aid, much
like a screen reader. The moment it speaks *as* somebody, it becomes the same lie — and a
movement whose whole argument is that people come first cannot afford to put words in a mouth
that was never there.

### Choosing a voice

Listen before you pick: [the voice picker](https://hkcarre.github.io/humanfirstai/voices.html)
has every candidate reading the same three lines. Anything the model's author grades D or
below is out — if we are asking people to trust what we say, it has to be comfortable to
listen to.

Current narrator: **af_heart**, graded A, American English.

```bash
cd tools
npm run voices                              # rebuild the picker page
npm run narrate -- --voice bf_emma --force  # change the narrator
```

### Other languages

The ONNX build we use ships **English voices only**. Kokoro v1.0 has packs for Spanish,
French, Hindi, Italian, Brazilian Portuguese, Japanese and Mandarin, but we have not tested
them and the same rule applies as to written translation: a native speaker from that chapter
reviews it before it goes out. For any language where a chapter has a willing volunteer, **a
human reading is better than a synthetic one** and should be preferred. A neighbour's voice is
the point.

## Illustration

Where we have no photograph and will not fake one.

Warm, hand-drawn, visible linework, slightly imperfect. Built from the same palette. Real
scenarios: a farmer in the Andes reading a frost forecast, a textile artisan calculating
yardage, a health volunteer going through immunisation records, an older woman drafting her
memoir.

Never: glowing brains, humanoid robots, floating holograms, circuit-board overlays, blue
wireframe globes.
