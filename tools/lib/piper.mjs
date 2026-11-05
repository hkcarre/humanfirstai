import ort from 'onnxruntime-node';
import { readFileSync, writeFileSync } from 'node:fs';
import { phonemise, phonemiseClauses, assertClean } from './phonemes.mjs';

// ---------------------------------------------------------------------------
//  Piper, run from Node.
//
//  Why this exists. Kokoro ships three Spanish voice packs and the model's own
//  author publishes no grade and no training-hours figure for any of them — the
//  only language section in VOICES.md with neither. Pointing espeak at "es"
//  rather than "es-419" gets you Castilian *pronunciation*, which is a real
//  improvement, but the voice behind it was never described as a speaker from
//  Spain. For "Spanish from Spain" we wanted a voice actually recorded there.
//
//  Piper's es_ES voices are. They are VITS models in ONNX, a few tens of MB,
//  and they run on the CPU faster than real time. There is no Python here, so
//  this does the inference directly: espeak-ng for phonemes (the same wasm
//  build the Kokoro path already uses), onnxruntime-node for the model.
//
//  Licences: Piper's voices carry their own. es_ES-davefx-medium is CC0.
//  espeak-ng is GPL-3.0 and is used as a build-time tool, as it already was.
// ---------------------------------------------------------------------------

const BOS = '^', EOS = '$', PAD = '_';

export class PiperVoice {
  constructor(session, cfg) { this.session = session; this.cfg = cfg; }

  static async load(onnxPath, jsonPath = `${onnxPath}.json`) {
    const cfg = JSON.parse(readFileSync(jsonPath, 'utf8'));
    const session = await ort.InferenceSession.create(onnxPath);
    return new PiperVoice(session, cfg);
  }

  get sampleRate() { return this.cfg.audio.sample_rate; }
  get espeakVoice() { return this.cfg.espeak?.voice || 'es'; }

  /** Phoneme string -> model ids. Piper pads between every phoneme. */
  toIds(phonemes) {
    const m = this.cfg.phoneme_id_map;
    const ids = [...(m[BOS] || []), ...(m[PAD] || [])];
    let skipped = 0;
    for (const ch of phonemes) {           // iterates by codepoint
      if (!m[ch]) { skipped++; continue; }
      ids.push(...m[ch], ...(m[PAD] || []));
    }
    ids.push(...(m[EOS] || []));
    return { ids, skipped };
  }

  async say(text, { lang, speaker = 0 } = {}) {
    const phonemes = assertClean(await phonemiseClauses(text, lang || this.espeakVoice), `piper ${this.espeakVoice}`);
    const { ids, skipped } = this.toIds(phonemes);
    const inf = this.cfg.inference || {};
    const feeds = {
      input: new ort.Tensor('int64', BigInt64Array.from(ids.map(BigInt)), [1, ids.length]),
      input_lengths: new ort.Tensor('int64', BigInt64Array.from([BigInt(ids.length)]), [1]),
      scales: new ort.Tensor('float32',
        Float32Array.from([inf.noise_scale ?? 0.667, inf.length_scale ?? 1, inf.noise_w ?? 0.8]), [3]),
    };
    if ((this.cfg.num_speakers || 1) > 1) {
      feeds.sid = new ort.Tensor('int64', BigInt64Array.from([BigInt(speaker)]), [1]);
    }
    const out = await this.session.run(feeds);
    const pcm = out[Object.keys(out)[0]].data;      // float32, -1..1
    return { pcm, sampleRate: this.sampleRate, phonemes, skipped };
  }
}

/** 16-bit mono WAV. ffmpeg does the rest downstream. */
export function writeWav(path, pcm, sampleRate) {
  const n = pcm.length, buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22); buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, pcm[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  writeFileSync(path, buf);
  return n / sampleRate;
}
