import { KokoroTTS } from 'kokoro-js';
import { phonemise, assertClean } from '../lib/phonemes.mjs';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs';

// ---------------------------------------------------------------------------
//  Narration.
//
//  Kokoro-82M, Apache-2.0, run locally at build time. The audio is generated
//  once and committed; nothing is called at runtime and no reader's text is
//  ever sent to a third party.
//
//  Slow (roughly half of real time on a CPU) and it wants a ~330MB model, so
//  it is skipped unless the audio is missing or you ask for it:
//
//      npm run narrate            every article that has no audio yet
//      npm run narrate -- --force  rebuild all of them
//      npm run narrate -- --voice af_heart
//
//  Languages: kokoro-js only ever phonemises as English and then applies
//  English-only fixups (r -> ɹ, x -> k), which would destroy Spanish. So we
//  phonemise ourselves with the full espeak-ng build and feed the model token
//  ids directly. Any of the 54 bundled voice packs works this way.
//
//  Policy for what this voice may and may not say: docs/07-photography.md,
//  "Synthetic voice". The short version — it reads our own prose, labelled.
//  It never speaks as a named person.
// ---------------------------------------------------------------------------
const argVoice = (() => { const i = process.argv.indexOf('--voice'); return i > -1 ? process.argv[i + 1] : null; })();
const DEFAULTS = { voice: 'bf_emma', phonemeLang: 'en-gb' };

// espeak-ng, full language data, IPA out. kokoro-js cannot do this.
// Lives in lib/phonemes.mjs — see the warning there about the -b flag.
const FORCE = process.argv.includes('--force');
const SRC = '../site/content';
const OUT = '../site/dist/articles';
const TMP = '../.scratch/narrate';

// --- markdown -> something worth listening to ------------------------------
// Headings get announced, the dialogue gets attributed, and markdown syntax
// never reaches the reader's ears.
function toSpeech(md) {
  const body = md.replace(/^---\n[\s\S]*?\n---\n/, '');
  const out = [];
  const lines = body.split('\n');
  let i = 0;
  const clean = s => s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/&mdash;|—/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (line.startsWith('```dialogue')) {
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        const at = lines[i].indexOf(':');
        if (at > 0) {
          const who = lines[i].slice(0, at).trim().toLowerCase();
          out.push({ text: `The ${who} says. ${clean(lines[i].slice(at + 1))}`, pause: 500 });
        }
        i++;
      }
      i++; continue;
    }

    // Testimony. The voice says that a quotation is there and does not read
    // it. Our rule: if someone said it, either they read it or nobody does.
    // A listener must never be able to mistake this voice for that person.
    if (line.startsWith('```testimony')) {
      i++;
      const buf = [];
      while (i < lines.length && !lines[i].startsWith('```')) { buf.push(lines[i]); i++; }
      i++;
      const who = buf.length && /^[—-]\s/.test(buf[buf.length - 1])
        ? buf.pop().replace(/^[—-]\s*/, '').replace(/^./, c => c.toLowerCase()) : '';
      // The author's own lead-in is the author's writing and is read. Only
      // what sits inside the quotation marks belongs to somebody else.
      const lead = clean(buf.join(' '))
        .replace(/["“][^"”]*["”]/g, '')
        .replace(/\s*[:,]\s*$/, '').replace(/\s+/g, ' ').trim();
      out.push({
        text: (lead ? `${lead}. ` : '')
          + `Their words are in the written text${who ? `, from ${clean(who)}` : ''}. `
          + `This voice does not read them aloud.`,
        pause: 700, lead: 400,
      });
      continue;
    }

    // Any other fenced block — a figure, a code sample. Skip the whole thing.
    // Without this the paragraph branch below matches nothing, never advances
    // i, and the loop spins until the heap dies. It did exactly that.
    if (line.startsWith('```')) {
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) i++;
      i++; continue;
    }

    // An image. The alt text describes the picture for someone who cannot see
    // it; it is not part of the piece being read aloud. Any caption beneath it
    // is prose and is read as a paragraph.
    if (/^!\[[^\]]*\]\([^)]*\)\s*$/.test(line)) { i++; continue; }

    let m;
    if ((m = line.match(/^##\s+(.*)$/))) {
      const num = m[1].match(/^(\d+)\s*·\s*(.*)$/);
      const words = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
      out.push({
        text: num ? `Part ${words[+num[1]] || num[1]}. ${clean(num[2])}.` : `${clean(m[1])}.`,
        pause: 900, lead: 700,
      });
      i++; continue;
    }
    if ((m = line.match(/^###\s+(.*)$/))) { out.push({ text: clean(m[1]) + '.', pause: 650, lead: 450 }); i++; continue; }
    if (line.startsWith('> ')) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith('> ')) { buf.push(lines[i].slice(2)); i++; }
      out.push({ text: clean(buf.join(' ')), pause: 800, lead: 500 });
      continue;
    }
    if (line.startsWith('- ')) {
      while (i < lines.length && lines[i].startsWith('- ')) {
        // Strip the wrapping quotes. English closes "like this." and Spanish
        // closes “like this”. — keep whichever full stop the language used.
        const item = clean(lines[i].slice(2)).replace(/^["“]/, '').replace(/["”](\.?)$/, '$1');
        out.push({ text: item, pause: 420 });
        i++;
      }
      continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|>\s|-\s|```)/.test(lines[i])) { buf.push(lines[i].trim()); i++; }
    out.push({ text: clean(buf.join(' ')), pause: 520 });
  }
  return out.filter(c => c.text.length > 1);
}

const meta = md => Object.fromEntries((md.match(/^---\n([\s\S]*?)\n---/) || ['', ''])[1]
  .split('\n').map(l => { const i = l.indexOf(':'); return i < 0 ? null : [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
  .filter(Boolean));

const articles = readdirSync(SRC).filter(f => f.endsWith('.md')).sort();
const metaOf = f => Object.fromEntries((readFileSync(`${SRC}/${f}`, 'utf8').match(/^---\n([\s\S]*?)\n---/) || ['', ''])[1]
  .split('\n').map(l => { const i = l.indexOf(':'); return i < 0 ? null : [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
  .filter(Boolean));
const todo = articles.filter(f => FORCE || !existsSync(`${OUT}/${f.replace(/\.md$/, '')}.mp3`));

if (!todo.length) {
  console.log(`narrate: ${articles.length} article(s) already have audio. Use --force to rebuild.`);
  process.exit(0);
}

// Each espeak-ng instance is a fresh ~20MB wasm module holding the full
// language data, and the build cannot re-run one (callMain is not exported).
// An article is ~70 chunks, so three articles in a single process walked into
// the 4GB heap limit and died with the audio half written. One process per
// article keeps the ceiling flat however many articles we add.
const ONLY = (() => { const i = process.argv.indexOf('--only'); return i > -1 ? process.argv[i + 1] : null; })();
if (!ONLY) {
  console.log(`narrate: ${todo.length} article(s), one process each`);
  for (const file of todo) {
    execFileSync(process.execPath, [process.argv[1], '--force', '--only', file,
      ...(argVoice ? ['--voice', argVoice] : [])], { stdio: 'inherit' });
  }
  process.exit(0);
}
if (!todo.includes(ONLY)) { console.error(`narrate: ${ONLY} is not an article`); process.exit(1); }
todo.length = 0;
todo.push(ONLY);
const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', { dtype: 'fp32', device: 'cpu' });

for (const file of todo) {
  const slug = file.replace(/\.md$/, '');
  const md = readFileSync(`${SRC}/${file}`, 'utf8');
  const fm = metaOf(file);
  const VOICE = argVoice || fm.voice || DEFAULTS.voice;
  const LANG = fm.phonemeLang || DEFAULTS.phonemeLang;
  const grade = tts.voices[VOICE]?.overallGrade || 'not graded by the model author';
  const chunks = toSpeech(md);
  const dir = `${TMP}/${slug}`;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  console.log(`\n  ${slug}: ${chunks.length} chunks, voice ${VOICE}, phonemes ${LANG}`);
  const parts = [], marks = [];
  let n = 0, elapsed = 0, t0 = Date.now();

  for (const [k, c] of chunks.entries()) {
    if (c.lead) { const s = `${dir}/${String(n++).padStart(4, '0')}.wav`; silence(s, c.lead); parts.push(s); elapsed += c.lead / 1000; }
    const wav = `${dir}/${String(n++).padStart(4, '0')}.wav`;
    const { input_ids } = tts.tokenizer(
      assertClean(await phonemise(c.text, LANG), `${slug} chunk ${k + 1}`), { truncation: true });
    const audio = await tts.generate_from_ids(input_ids, { voice: VOICE });
    await audio.save(wav);
    marks.push({ t: +elapsed.toFixed(2), text: c.text.slice(0, 80) });
    elapsed += audio.audio.length / audio.sampling_rate;
    parts.push(wav);
    const sil = `${dir}/${String(n++).padStart(4, '0')}.wav`;
    silence(sil, c.pause); parts.push(sil); elapsed += c.pause / 1000;
    if (marks.length % 10 === 0) process.stdout.write(`    ${marks.length}/${chunks.length}  ${elapsed.toFixed(0)}s audio\r`);
  }

  writeFileSync(`${dir}/list.txt`, parts.map(p => `file '${p.split('/').pop()}'`).join('\n'));
  mkdirSync(OUT, { recursive: true });
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', `${dir}/list.txt`,
    '-ac', '1', '-ar', '24000', '-b:a', '64k', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', `${OUT}/${slug}.mp3`]);

  const kb = statSync(`${OUT}/${slug}.mp3`).size / 1024;
  // measure the finished file rather than trusting the running total
  elapsed = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
    '-of', 'default=nw=1:nk=1', `${OUT}/${slug}.mp3`]).toString().trim();
  writeFileSync(`${OUT}/${slug}.audio.json`, JSON.stringify({
    voice: VOICE, grade, phonemeLang: LANG, lang: fm.lang || 'en',
    reviewed: fm.reviewed === 'true',
    model: 'hexgrad/Kokoro-82M v1.0 (Apache-2.0)', phonemiser: 'espeak-ng (GPL-3.0) via wasm',
    synthetic: true, generated: new Date().toISOString().slice(0, 10),
    seconds: +elapsed.toFixed(1), marks,
  }, null, 2));
  console.log(`    ${chunks.length}/${chunks.length}  ${Math.floor(elapsed / 60)}m ${Math.round(elapsed % 60)}s audio, `
    + `${kb.toFixed(0)}KB, generated in ${((Date.now() - t0) / 1000 / 60).toFixed(1)}min`);
  rmSync(dir, { recursive: true, force: true });
}

function silence(path, ms) {
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi',
    '-i', `anullsrc=r=24000:cl=mono`, '-t', (ms / 1000).toFixed(3), '-c:a', 'pcm_s16le', path]);
}
