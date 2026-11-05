import { phonemise, assertClean } from './lib/phonemes.mjs';

// ---------------------------------------------------------------------------
//  Guards the phonemiser against the failure that cost us two narrations.
//
//  espeak-ng told to read UTF-8 as 8-bit does not error. It produces fluent,
//  plausible, confident nonsense: "niño" becomes "ni a-tilde en plus or minus
//  o", "don't" becomes "doughnut tea". The audio sounds like a real voice
//  reading real words, so the only way to catch it is to assert on known
//  pairs. These are those pairs.
//
//      npm run phonemes:check
// ---------------------------------------------------------------------------
const CASES = [
  // text, language, a fragment that MUST appear in correct output
  ['El niño de España', 'es', 'iɲo'],
  ['Una compañía española', 'es-419', 'paɲˈia'],
  ['Tiene un título en informática', 'es', 'itulo'],
  ['El corazón creció más rápido', 'es-419', 'oɾasˈon'],
  ['Les enseñó algo a todos', 'es-419', 'seɲˈo'],
  // the curly apostrophe is the one that broke English
  ['They don’t know what’s true', 'en-gb', 'dˈə‍ʊnt'],
  ['That’s the point', 'en-gb', 'ðats'],
  ['Élan and naïve', 'en-gb', ''],
];

let failed = 0;
console.log('\nPhonemiser check — espeak-ng via lib/phonemes.mjs');
console.log('-'.repeat(72));

for (const [text, lang, must] of CASES) {
  let out, err = null;
  try { out = assertClean(await phonemise(text, lang), text); }
  catch (e) { err = e.message.split('\n')[0]; }

  const missing = !err && must && !out.includes(must);
  const ok = !err && !missing;
  if (!ok) failed++;
  console.log(`  ${ok ? 'ok  ' : '!!  '}${lang.padEnd(7)}${text}`);
  if (err) console.log(`      ${err}`);
  else if (missing) console.log(`      expected to contain "${must}"\n      got: ${out}`);
}

console.log('-'.repeat(72));
if (failed) {
  console.error(`\n${failed} case(s) failed. The audio would be confident nonsense.`);
  console.error('Check the -b flag in lib/phonemes.mjs — it must be "-b", "1", not "-b=1".\n');
  process.exit(1);
}
console.log('\nAll clean. Accented and curly characters survive the phonemiser.\n');
