---
title: We Automated Graham
subtitle: The four video files, and which one goes where
kicker: Video
date: 2026-11-06
readingTime: 4
theme: cream
tags: [Video, Social, LinkedIn]
---

A 54-second film built from *The Most Dangerous Person in the Room*. A new hire asks who
reads a weekly report. A senior manager answers *"With respect, some of us have been doing
this a long time."* Then an AI trained on his phrasing produces the same
certainties on demand. Three times, at confidence 100%.

It proves the article's argument instead of restating it, which is the hardest thing to do
in a minute.

---

## Four files, two of them redundant

| file | use |
|---|---|
| `we-automated-graham-1x1.mp4` | LinkedIn feed, Substack, the article page |
| `we-automated-graham-9x16.mp4` | Reels, Stories, TikTok, Shorts |

The originals came in two variants each, plain and `_remotion`. They are **the same cut**.
Measured rather than assumed: PSNR 57dB between them, which is indistinguishable, and
byte-identical audio. `_remotion` is simply the higher-bitrate encode, so it is the one
kept here. The plain versions can go.

Both are 1080p, 30fps, 54.5 seconds, H.264 with AAC stereo, mastered at −16 dB mean.

---

## What the film gets right

**The disclosure.** The closing card reads *"Voices are AI-generated. Characters are
fictional."* That is the correct wording, and it is correct in a way that took the articles
three wrong attempts to reach. "Composites" implies drawn from real people. "Names have been
changed" implies something real underneath. Neither is true. **Fictional** is.

The article now carries the same claim, in the same words. A film and an essay about the same
invented people should not describe themselves differently.

**The AI-voice badge** is on screen throughout the dialogue sections. Our rule is that a
synthetic voice is labelled every time, where it cannot be missed. This does that without
being asked.

---

## What it does not do

**It is not in the brand's visual system.** Measured, not eyeballed:

| | the film | the brand |
|---|---|---|
| ground | `#111113` near-black | `#1F2A44` Deep Ink |
| accent | red | `#FF8A3D` Sunrise |
| display face | a serif, on several cards | Plus Jakarta Sans |
| mark | absent | required |

Red is not in the palette at all. Near-black is not Deep Ink. The register is
alarm — corporate thriller — where the brand's is warmth and an open door.

**This is a judgement, not a fault.** The register suits *this* story, which is about
dysfunction and being pushed out. A cream-and-Sunrise treatment might have undercut it.

What is harder to defend is that **the mark never appears**. Fifty-four seconds, a strong
idea, and nothing tells a viewer whose it is. That is the one change worth making whatever
is decided about the palette: the logo on the end card, beside "Full article: link in
comments."

If it should join the system rather than sit beside it, two swaps do it: red to Sunrise,
`#111113` to Deep Ink. Every frame and every timing survives.

---

## It has no captions

No subtitle stream, no sidecar file. The review checklist requires captions on video, and
the build now prints a warning at every build until there are some.

Two reasons this matters more than usual here:

- A viewer who is deaf gets the on-screen text but not the narration.
- **LinkedIn autoplays muted.** Captions are reach, not only access.

The film is heavily text-driven, so it survives a silent viewing better than most. That is
not the same as being captioned.

The fix is exact and needs no transcription. It was built in Remotion, so the script and the
frame timings are already in the source. A `.vtt` can be generated from
them rather than guessed at by ear. Drop the file in beside the video as
`assets/we-automated-graham.vtt` and the article picks it up:

````markdown
```video
file: assets/we-automated-graham-1x1.mp4
poster: assets/we-automated-graham-poster.jpg
captions: assets/we-automated-graham.vtt
alt: …
caption: …
```
````

---

## Posting it

**LinkedIn.** Upload the 1x1 natively. Never post a link to a video; the feed buries it.
Put the article link in the first comment, which is what the end card already tells people
to expect. The post text is in
[`brand/templates/linkedin/COPY.md`](../linkedin/COPY.md).

**Substack.** Embed the 1x1 above the fold, before the 7:52 a.m. scene.

**Reels, Stories, TikTok, Shorts.** The 9x16, natively, every time.

**The article page.** Already in place, after Graham's line at 9:00 a.m. — the moment the
film dramatises. See
[`site/content/most-dangerous-person-in-the-room.md`](../../../site/content/most-dangerous-person-in-the-room.md).
