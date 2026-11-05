import ESpeakNg from 'espeak-ng';

// ---------------------------------------------------------------------------
//  One phonemiser, used by every voice path we have.
//
//  It lives here because it was duplicated in narrate.mjs and voices.mjs, and
//  both copies carried the same bug for weeks.
//
//  THE BUG, so nobody reintroduces it: the flag is `-b 1` (two arguments) or
//  `-b1`. Written as `-b=1` espeak-ng parses the value as the string "=1",
//  fails to match 1, and silently falls back to 8-bit input. Every UTF-8
//  character then arrives as its individual bytes read as Latin-1, and espeak
//  dutifully pronounces the mojibake:
//
//      "niño"   -> "ni a-tilde (en) plus or minus o"
//      "don’t"  -> "doughnut tea"
//      "what’s" -> "water es"
//
//  It is silent. The phonemes look plausible, the audio is fluent, the
//  duration is right, and it is wrong — which is exactly why it survived.
//  Leaving the flag out altogether is also correct; it is passed explicitly
//  so the intent is on the page.
//
//  Verify with: npm run phonemes:check
// ---------------------------------------------------------------------------

/** text -> IPA, via the full espeak-ng language data. */
export async function phonemise(text, lang) {
  const e = await ESpeakNg({
    arguments: ['-b', '1', '--phonout', 'o.txt', '-q', '--ipa=3', '-v', lang, text],
  });
  return e.FS.readFile('o.txt', { encoding: 'utf8' }).replace(/\s+/g, ' ').trim();
}

// NOT POSSIBLE: phonemising a whole article in one espeak call. espeak emits
// one output line per CLAUSE, not per input line — 71 chunks of the Spanish
// article came back as 236 lines — so there is no safe way to map the output
// back onto the chunks. Getting it wrong would narrate every chunk after the
// first mismatch with someone else's words, fluently, with nothing to show
// for it. The instance-per-chunk cost is handled in build/narrate.mjs by
// giving each article its own process instead.

/** Phonemise clause by clause and put the punctuation back. espeak drops
 *  commas and full stops from phoneme output; models that have ids for them
 *  read a single unpunctuated run as someone who has forgotten to breathe. */
export async function phonemiseClauses(text, lang) {
  const out = [];
  for (const p of text.split(/([,.;:!?…])/)) {
    if (!p.trim()) continue;
    if (/^[,.;:!?…]$/.test(p)) {
      if (out.length) out[out.length - 1] += p === '…' ? '.' : p;
      continue;
    }
    out.push(await phonemise(p.trim(), lang));
  }
  return out.join(' ');
}

/** Characters that mean the encoding has gone wrong. If any of these come
 *  back, the text was read as 8-bit and the audio will be nonsense. */
const MOJIBAKE = /atˈilðe|sˈɜːkəmflˌɛks|plˈʌs ɔː mˈa‍ɪnəs|ˈɛse ˈɛre/;

/** Throws if a phoneme string shows the 8-bit failure. Cheap, so callers run
 *  it on everything rather than trusting the flag stayed correct. */
export function assertClean(phonemes, context = '') {
  if (MOJIBAKE.test(phonemes)) {
    throw new Error(`Phonemes look mis-encoded${context ? ` in ${context}` : ''}. `
      + `espeak read UTF-8 as 8-bit. Check the -b flag in lib/phonemes.mjs.\n  ${phonemes.slice(0, 160)}`);
  }
  return phonemes;
}
