import { KokoroTTS } from 'kokoro-js';
import { phonemise, assertClean } from '../lib/phonemes.mjs';
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { C, BRAND, WAYS } from '../lib/brand.mjs';
import { lockup } from '../lib/lockup.mjs';

// ---------------------------------------------------------------------------
//  The voice picker.
//
//  Nobody can choose a narrator from a grade in a table. This builds a page
//  where you press play and decide. Samples are normalised to -16 LUFS and
//  written at 44.1kHz so they play on anything, including a cheap phone.
//
//      npm run voices            build the page (skips existing samples)
//      npm run voices -- --force regenerate every sample
// ---------------------------------------------------------------------------
const FORCE = process.argv.includes('--force');
const OUT = '../site/dist';
const AUD = `${OUT}/voice`;
mkdirSync(AUD, { recursive: true });

const SAMPLE = 'Make AI feel like an open door, not a locked lab. '
  + 'You do not need a computer science degree to use this. '
  + 'Free workshops in your neighbourhood, taught in your language.';
const SAMPLE_ES = 'Que la inteligencia artificial sea una puerta abierta, no un laboratorio cerrado. '
  + 'No hace falta un título en informática para usarla. '
  + 'Talleres gratuitos en tu barrio, en tu idioma.';

// phonemise lives in lib/phonemes.mjs — see the warning there about -b.

// The shortlist. Anything graded D or F is not a candidate for a brand that
// asks people to trust what it says.
const CURRENT = 'bf_emma';
const CURRENT_ES = 'es_dora_latam';
const SHORTLIST = [
  ['af_heart',   'Warm, unhurried, American. The only A in the set.'],
  ['af_bella',   'American, a little more energy and edge.'],
  ['af_nicole',  'American, close-mic and soft. Intimate — possibly too intimate.'],
  ['bf_emma',    'British, measured and calm.'],
  ['am_fenrir',  'American male, warm and low.'],
  ['am_michael', 'American male, plainer and more neutral.'],
  ['bm_fable',   'British male, storyteller cadence.'],
];

// id, label, voice pack, espeak language, sample text
const SPANISH = [
  ['es_dora_latam',  'ef_dora', 'es-419', SAMPLE_ES],
  ['es_dora_castil', 'ef_dora', 'es',     SAMPLE_ES],
  ['es_alex_latam',  'em_alex', 'es-419', SAMPLE_ES],
];
// --- Spanish from Spain ----------------------------------------------------
//  Kokoro's three Spanish packs have no published grade and no training-hours
//  figure — the only language in VOICES.md with neither — and nothing says the
//  speaker is from Spain. Pointing espeak at "es" gets Castilian pronunciation
//  out of them, which is real, but it is an accent worn by a voice of unstated
//  origin. These are the other thing: VITS models recorded in Spain, run
//  locally through onnxruntime. Weights are downloaded on demand and are not
//  committed — they are tens of megabytes and they are not ours.
const MODELS = '../.models';
const SPAIN = [
  ['es_davefx',   'es_ES-davefx-medium',   0, 'Dave',  'Masculina', 'CC0',
    'Grabada en España. Distinción &mdash; &ldquo;gracias&rdquo; con zeta.'],
  ['es_sharvard_f', 'es_ES-sharvard-medium', 1, 'Sharvard F', 'Femenina', 'CC BY 3.0',
    'Corpus SHARVARD, Universidad de Edimburgo. Lectura clara y pausada.'],
  ['es_sharvard_m', 'es_ES-sharvard-medium', 0, 'Sharvard M', 'Masculina', 'CC BY 3.0',
    'El otro hablante del mismo corpus.'],
];
const piperUrl = n => `https://huggingface.co/rhasspy/piper-voices/resolve/main/es/es_ES/`
  + `${n.split('-')[1]}/${n.split('-')[2]}/${n}.onnx`;

async function ensureModel(name) {
  mkdirSync(MODELS, { recursive: true });
  for (const ext of ['.onnx.json', '.onnx']) {
    const to = `${MODELS}/${name}${ext}`;
    if (existsSync(to)) continue;
    const url = piperUrl(name) + (ext === '.onnx.json' ? '.json' : '');
    process.stdout.write(`  fetching ${name}${ext} … `);
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${r.status} ${url}`);
    writeFileSync(to, Buffer.from(await r.arrayBuffer()));
    console.log(`${(statSync(to).size / 1048576).toFixed(1)}MB`);
  }
  return `${MODELS}/${name}.onnx`;
}

const need = SHORTLIST.filter(([v]) => FORCE || !existsSync(`${AUD}/${v}.mp3`));
const needEsp = SPAIN.filter(([id]) => FORCE || !existsSync(`${AUD}/${id}.mp3`));
const needEs = SPANISH.filter(([id]) => FORCE || !existsSync(`${AUD}/${id}.mp3`));
let voices = {};

if (need.length || needEs.length) {
  console.log(`voices: generating ${need.length} sample(s)`);
  const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', { dtype: 'fp32', device: 'cpu' });
  voices = tts.voices;
  for (const [v] of need) {
    const wav = `../.scratch/${v}.wav`;
    const audio = await tts.generate(SAMPLE, { voice: v });
    await audio.save(wav);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav,
      '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ac', '1', '-ar', '44100', '-b:a', '96k', `${AUD}/${v}.mp3`]);
    console.log(`  ${v.padEnd(16)} ${(statSync(`${AUD}/${v}.mp3`).size / 1024).toFixed(0)}KB`);
  }
  for (const [id, pack, lang, text] of needEs) {
    const wav = `../.scratch/${id}.wav`;
    const { input_ids } = tts.tokenizer(assertClean(await phonemise(text, lang), id), { truncation: true });
    const a = await tts.generate_from_ids(input_ids, { voice: pack });
    await a.save(wav);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav,
      '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ac', '1', '-ar', '44100', '-b:a', '96k', `${AUD}/${id}.mp3`]);
    console.log(`  ${id.padEnd(16)} ${(statSync(`${AUD}/${id}.mp3`).size / 1024).toFixed(0)}KB`);
  }
} else {
  console.log('voices: Kokoro samples already present, use --force to regenerate');
}

if (needEsp.length) {
  const { PiperVoice, writeWav } = await import('../lib/piper.mjs');
  const cache = new Map();
  for (const [id, model, sid] of needEsp) {
    if (!cache.has(model)) cache.set(model, await PiperVoice.load(await ensureModel(model)));
    const v = cache.get(model);
    const r = await v.say(SAMPLE_ES, { speaker: sid });
    const wav = `../.scratch/${id}.wav`;
    writeWav(wav, r.pcm, r.sampleRate);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav,
      '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ac', '1', '-ar', '44100', '-b:a', '96k', `${AUD}/${id}.mp3`]);
    console.log(`  ${id.padEnd(16)} ${(statSync(`${AUD}/${id}.mp3`).size / 1024).toFixed(0)}KB  (piper, ${r.skipped} phoneme(s) skipped)`);
  }
}

const GRADES = { af_heart: 'A', af_bella: 'A−', af_nicole: 'B−', bf_emma: 'B−', am_fenrir: 'C+', am_michael: 'C+', bm_fable: 'C' };
const META = {
  af_heart: ['Heart', 'American English', 'Female'], af_bella: ['Bella', 'American English', 'Female'],
  af_nicole: ['Nicole', 'American English', 'Female'], bf_emma: ['Emma', 'British English', 'Female'],
  am_fenrir: ['Fenrir', 'American English', 'Male'], am_michael: ['Michael', 'American English', 'Male'],
  bm_fable: ['Fable', 'British English', 'Male'],
};

const stripSvg = s => s.replace(/^[\s\S]*?<title>[\s\S]*?<\/title>/, '').replace(/<\/svg>\s*$/, '');
const mark = way => {
  const svg = lockup('horizontal', WAYS[way]);
  const [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
  return `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true" focusable="false">${stripSvg(svg)}</svg>`;
};

const ES_META = {
  es_dora_latam:  ['Dora', 'Español latinoamericano', 'Femenina', 'Seseo — "gracias" con ese. La variante que hablan nuestros capítulos.'],
  es_dora_castil: ['Dora', 'Español de España', 'Femenina', 'Distinción — "gracias" con zeta. Misma voz, otro acento.'],
  es_alex_latam:  ['Alex', 'Español latinoamericano', 'Masculina', 'Seseo, registro más grave.'],
};
const espRows = SPAIN.map(([id, model, sid, name, gender, licence, note]) => `      <tr>
        <td class="n"><strong>${name}</strong><span class="id">${model}${sid ? ` · ${sid}` : ''}</span></td>
        <td class="g"><span class="grade">&mdash;</span></td>
        <td class="d">Español de España · ${gender}<span class="note">${note} <em>${licence}</em></span></td>
        <td class="p"><audio controls preload="none" src="voice/${id}.mp3" aria-label="Muestra de la voz ${name}, español de España"></audio></td>
      </tr>`).join('\n');

const esRows = SPANISH.map(([id]) => {
  const [name, lang, gender, note] = ES_META[id];
  return `      <tr>
        <td class="n"><strong>${name}</strong><span class="id">${id}</span>${id === CURRENT_ES ? '<span class="live">in use</span>' : ''}</td>
        <td class="g"><span class="grade">&mdash;</span></td>
        <td class="d">${lang} · ${gender}<span class="note">${note}</span></td>
        <td class="p"><audio controls preload="none" src="voice/${id}.mp3" aria-label="Muestra de la voz ${name}, ${lang}"></audio></td>
      </tr>`;
}).join('\n');

const rows = SHORTLIST.map(([v, note]) => {
  const [name, lang, gender] = META[v];
  return `      <tr>
        <td class="n"><strong>${name}</strong><span class="id">${v}</span>${v === CURRENT ? '<span class="live">in use</span>' : ''}</td>
        <td class="g"><span class="grade${GRADES[v].startsWith('A') ? ' top' : ''}">${GRADES[v]}</span></td>
        <td class="d">${lang} · ${gender}<span class="note">${note}</span></td>
        <td class="p"><audio controls preload="none" src="voice/${v}.mp3" aria-label="Sample of the ${name} voice"></audio></td>
      </tr>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Choosing a narrator — ${BRAND.name}</title>
<meta name="description" content="Seven candidate narration voices for Human First AI, side by side.">
<meta name="color-scheme" content="light">
<meta name="theme-color" content="${C.ink}">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<meta name="robots" content="noindex">
<link rel="stylesheet" href="article.css">
<style>
  .sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
  table{width:100%;border-collapse:collapse;margin:2rem 0}
  th{text-align:left;font-family:var(--hf-font-brand);font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;color:var(--hf-text-muted);font-weight:700;padding:0 .75rem .6rem 0;border-bottom:2px solid var(--hf-text)}
  td{padding:1rem .75rem;border-bottom:1px solid var(--hf-border);vertical-align:middle}
  td.n strong{font-family:var(--hf-font-brand);font-size:1.0625rem;display:block}
  .id{font-family:ui-monospace,monospace;font-size:.75rem;color:var(--hf-text-muted)}
  .grade{font-family:var(--hf-font-brand);font-weight:800;font-size:1.0625rem;color:var(--hf-text-muted)}
  .grade.top{color:var(--hf-text-accent)}
  .live{display:inline-block;margin-top:.3rem;font-family:var(--hf-font-brand);font-weight:800;font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--hf-ink);background:var(--hf-sunrise);padding:.15rem .45rem;border-radius:4px}
  tr:has(.live){background:rgba(255,138,61,.07)}
  td.d{font-size:.9375rem;line-height:1.45}
  .note{display:block;color:var(--hf-text-muted);font-size:.875rem}
  td.p{width:260px}
  audio{width:250px;height:38px}
  @media (max-width:46rem){
    table,tbody,tr,td,th{display:block}thead{display:none}
    tr{padding:1.1rem 0;border-bottom:1px solid var(--hf-border)}
    td{border:0;padding:.15rem 0}td.p{width:auto}audio{width:100%}
  }
</style>
</head>
<body>
<a class="skip" href="#picker">Skip to the voices</a>
<header class="masthead">
  <div class="wide">
    <a href="index.html" aria-label="${BRAND.name} — home">${mark('full')}</a>
    <a class="back" href="https://github.com/hkcarre/humanfirstai">Brand system &rarr;</a>
  </div>
</header>

<div class="hero">
  <div class="wrap">
    <p class="kicker">Narration</p>
    <h1>Choosing a narrator</h1>
    <p class="standfirst">Seven candidates reading the same three lines. Grades are the model
      author's own. Press play and pick the one that sounds like a patient teacher.</p>
  </div>
</div>
<div class="colonnade" aria-hidden="true"></div>

<article id="picker">
  <div class="wrap" style="width:min(100% - 2.5rem,52rem)">
    <table>
      <caption class="sr">Candidate narration voices, with an audio sample of each</caption>
      <thead><tr><th>Voice</th><th>Grade</th><th>Character</th><th>Listen</th></tr></thead>
      <tbody>
${rows}
      </tbody>
    </table>

    <h2 id="spanish"><span class="sec-text">Spanish</span></h2>
    <p>Kokoro ships Spanish voice packs, but <code>kokoro-js</code> only ever phonemises as
      English and then applies English-only fixups, which turn Spanish into noise. We phonemise
      with the full espeak-ng build instead and feed the model token ids directly. The model has
      no published grade for these.</p>
    <table>
      <caption class="sr">Spanish narration voices, with an audio sample of each</caption>
      <thead><tr><th>Voz</th><th>Nota</th><th>Carácter</th><th>Escuchar</th></tr></thead>
      <tbody>
${esRows}
      </tbody>
    </table>
    <blockquote><p>${SAMPLE_ES}</p></blockquote>

    <h2 id="espana"><span class="sec-text">Spanish from Spain</span></h2>
    <p>The three above are Kokoro packs. Pointing the phonemiser at <code>es</code> rather than
      <code>es-419</code> gets Castilian pronunciation out of them &mdash; the <em>zeta</em> comes
      back &mdash; but that is an accent worn by a voice whose origin the model author never
      states. There is no published grade and no training-hours figure for Kokoro's Spanish, the
      only language in its voice list with neither.</p>
    <p>These are the other thing: <a href="https://github.com/OHF-Voice/piper1-gpl">Piper</a>
      voices recorded in Spain, run locally through onnxruntime at build time. Lower fidelity
      than Kokoro &mdash; 22.05kHz against 24 &mdash; and plainly a Spaniard reading.</p>
    <table>
      <caption class="sr">Spanish voices recorded in Spain, with an audio sample of each</caption>
      <thead><tr><th>Voz</th><th>Nota</th><th>Carácter</th><th>Escuchar</th></tr></thead>
      <tbody>
${espRows}
      </tbody>
    </table>

    <h2 id="what"><span class="sec-text">What the English voices are saying</span></h2>
    <blockquote><p>${SAMPLE}</p></blockquote>

    <h2 id="rules"><span class="sec-text">The rule this voice lives under</span></h2>
    <p>It may read our own published words, labelled as synthetic, with the written text on the
      same page. It may never speak as a named person, read a learner's quote, or appear anywhere
      a listener could think they are hearing a specific human being.</p>
    <p>A synthetic face invents a person who does not exist. A synthetic voice reading our own
      prose is a reading aid, much like a screen reader. The moment it speaks <em>as</em>
      somebody, it becomes the same lie. Full policy:
      <a href="https://github.com/hkcarre/humanfirstai/blob/main/docs/07-photography.md">docs/07-photography.md</a>.</p>

    <h2 id="switch"><span class="sec-text">Changing it</span></h2>
    <p>One flag. The narration is regenerated locally and committed — nothing is called at
      runtime, and no reader's text is ever sent anywhere.</p>
    <pre style="background:var(--hf-surface-raised);border:1px solid var(--hf-border);border-radius:10px;padding:1rem;overflow:auto;font-size:.875rem"><code>cd tools
npm run narrate -- --voice af_heart --force</code></pre>
    <p class="tags"><span>Kokoro-82M v1.0</span><span>Apache-2.0</span><span>Runs locally</span><span>No API</span></p>
  </div>
</article>

<footer>
  <div class="wide">
    <span>&copy; 2026 ${BRAND.name} &middot; Voices from <a href="https://huggingface.co/hexgrad/Kokoro-82M">hexgrad/Kokoro-82M</a>, Apache-2.0</span>
    <span><a href="https://github.com/hkcarre/humanfirstai">github.com/hkcarre/humanfirstai</a></span>
  </div>
</footer>
</body>
</html>
`;
writeFileSync(`${OUT}/voices.html`, html);
console.log(`voices: picker page -> site/dist/voices.html (${SHORTLIST.length + SPANISH.length + SPAIN.length} voices)`);
