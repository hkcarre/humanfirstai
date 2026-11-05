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

### How testimony is kept out of the voice

This rule is easy to agree with and easy to break: a quotation in an article is just a
blockquote, and a narrator reads blockquotes. *Give Yourself the Grace to Be Bad at It* shipped
its first narration with an attendee's words in Emma's voice, after a paragraph introducing
them as that attendee's. A listener had no way to know they were not hearing them.

So somebody else's words get their own block, and the narrator is built to skip it:

````markdown
```testimony
It was an amazing parallel to the adaptation moment we've been through.
— An attendee, Claude Community House
```
````

On the page it sets as a quotation with its attribution. In the audio the voice says *"Here the
written text carries a quotation from an attendee, Claude Community House. This voice does not
read other people's words,"* and moves on.

A plain `>` blockquote stays available for **our own** prose — a pull quote, a line from one of
our own slides. The distinction is not decorative. If the words belong to a person who is not
us, they go in a `testimony` block.

An invented illustration is not testimony. The dialogue in *The Great Corporate Unmasking* is
introduced as something to picture and is the author's own writing, so the voice may read it.

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

Current narrator: **bf_emma**, graded B−, British English. Chosen by ear over the
higher-graded American voices — a grade measures how cleanly a model renders a voice, not
whether it sounds like a patient teacher.

```bash
cd tools
npm run voices                              # rebuild the picker page
npm run narrate -- --voice af_heart --force # change the narrator
```

### Spanish

Spanish narration works. It took a detour: `kokoro-js` only ever converts text to English
sounds and then applies English-only corrections — it turns every `r` into the English one and
every `x` into a `k`, which is fatal for Spanish. We phonemise with the full espeak-ng build
instead and hand the model token ids directly, which unlocks all 54 voice packs rather than
the 28 English ones.

**Latin American, not Castilian.** The chapters are in Lima, Cusco, Oaxaca, Bogotá, São Paulo
and Buenos Aires. `es-419` says *gracias* with an s; `es` says it with a th. Both are on the
[picker](https://hkcarre.github.io/humanfirstai/voices.html) — we use `es-419`, with
**ef_dora**. The model's author publishes no grade for the Spanish voices.

Writing is translated first and narrated second. A machine-assisted translation is a draft
until a native speaker from that chapter has read it, and the page says so in a box nobody can
miss until they have. See [02 Voice](02-voice.md).

### Spanish from Spain

Yes, and two ways.

**Inside Kokoro**, set `phonemeLang: es` instead of `es-419`. The *zeta* comes back and
*gracias* is said with a th. That is a real change and it costs one line. But it is an accent
worn by a voice whose origin the model's author never states: Kokoro's Spanish is the only
language in its voice list with neither a grade nor a training-hours figure.

**Recorded in Spain**, use a [Piper](https://github.com/OHF-Voice/piper1-gpl) `es_ES` voice.
These are VITS models in ONNX, tens of megabytes, run locally at build time through
onnxruntime with the same espeak-ng we already use for phonemes — no Python, no network at
runtime. Lower fidelity than Kokoro, 22.05kHz against 24, and plainly a Spaniard reading.
Three are on the picker: `davefx` (CC0) and the two speakers of `sharvard` (CC BY 3.0).
Weights download on demand into `.models/` and are **not committed** — they are large and
they are not ours.

A caution worth stating plainly: our Spanish article is written in Latin American Spanish,
leaning Rioplatense — *acá*, *leé*, *agendar*. Putting a Castilian voice over that text is a
costume, not a Spain edition. A Spain edition needs the text passed again too.

### The phonemiser bug, and why it is written down

For a while every Spanish narration we produced was fluent, confident nonsense, and nobody
could tell from looking at it.

espeak-ng was being invoked with `-b=1`. It parses the value as the string `"=1"`, fails to
match, and **silently falls back to 8-bit input**. Every UTF-8 character then arrives as its
separate bytes read as Latin-1, and espeak pronounces the mojibake exactly as written:

| written | spoken |
| --- | --- |
| `niño` | "ni a-tilde (en) plus or minus o" |
| `título` | "te a-circumflex tulo" |
| `don’t` | "doughnut tea" |
| `what’s` | "water es" |

The flag is `-b 1` as two arguments, or `-b1`, or simply left out. It is now in exactly one
place, `tools/lib/phonemes.mjs`, with a check that fails the build:

```bash
cd tools && npm run phonemes:check
```

Two things this cost us are worth keeping in mind. The output *looked* fine — plausible IPA,
right duration, fluent audio — so every check that did not involve listening passed. And the
English only broke the day we switched the articles to curly apostrophes, because until then
the text happened to be pure ASCII. A pipeline that is correct by accident will stop being
correct without warning.

### Other languages

Kokoro v1.0 also has packs for French, Hindi, Italian, Brazilian Portuguese, Japanese and
Mandarin. The pipeline now handles any of them — set `voice` and `phonemeLang` in the
article's frontmatter — but none has been tested or reviewed.

For any language where a chapter has a willing volunteer, **a human reading beats a synthetic
one** and should be preferred. A neighbour's voice is the point.

## Illustration

Where we have no photograph and will not fake one.

Warm, hand-drawn, visible linework, slightly imperfect. Built from the same palette. Real
scenarios: a farmer in the Andes reading a frost forecast, a textile artisan calculating
yardage, a health volunteer going through immunisation records, an older woman drafting her
memoir.

Never: glowing brains, humanoid robots, floating holograms, circuit-board overlays, blue
wireframe globes.
