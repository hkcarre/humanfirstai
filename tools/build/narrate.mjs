import { KokoroTTS } from 'kokoro-js';
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
//  Policy for what this voice may and may not say: docs/07-photography.md,
//  "Synthetic voice". The short version — it reads our own prose, labelled.
//  It never speaks as a named person.
// ---------------------------------------------------------------------------
const VOICE = (() => {
  const i = process.argv.indexOf('--voice');
  return i > -1 ? process.argv[i + 1] : 'bf_emma';
})();
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
        out.push({ text: clean(lines[i].slice(2)).replace(/^"|"$/g, ''), pause: 420 });
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
const todo = articles.filter(f => FORCE || !existsSync(`${OUT}/${f.replace(/\.md$/, '')}.mp3`));

if (!todo.length) {
  console.log(`narrate: ${articles.length} article(s) already have audio. Use --force to rebuild.`);
  process.exit(0);
}

console.log(`narrate: ${todo.length} article(s), voice ${VOICE}`);
const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', { dtype: 'fp32', device: 'cpu' });
if (!tts.voices[VOICE]) {
  console.error(`Unknown voice "${VOICE}". Available: ${Object.keys(tts.voices).join(', ')}`);
  process.exit(1);
}
const grade = tts.voices[VOICE].overallGrade;

for (const file of todo) {
  const slug = file.replace(/\.md$/, '');
  const md = readFileSync(`${SRC}/${file}`, 'utf8');
  const chunks = toSpeech(md);
  const dir = `${TMP}/${slug}`;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  console.log(`\n  ${slug}: ${chunks.length} chunks`);
  const parts = [], marks = [];
  let n = 0, elapsed = 0, t0 = Date.now();

  for (const c of chunks) {
    if (c.lead) { const s = `${dir}/${String(n++).padStart(4, '0')}.wav`; silence(s, c.lead); parts.push(s); elapsed += c.lead / 1000; }
    const wav = `${dir}/${String(n++).padStart(4, '0')}.wav`;
    const audio = await tts.generate(c.text, { voice: VOICE });
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
    voice: VOICE, grade, model: 'hexgrad/Kokoro-82M v1.0 (Apache-2.0)',
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
