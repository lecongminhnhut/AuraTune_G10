import { Readable } from 'node:stream';

// Âm thanh demo được tổng hợp theo từng đoạn byte khi chưa có tệp nhạc thật.
// Mỗi bài có giai điệu riêng (sinh từ mã bài hát) và đúng thời lượng trong danh mục,
// nhờ vậy trình phát, thanh tua và Range request hoạt động như với tệp thật mà
// kho mã không phải chứa tệp nhạc có bản quyền.

const SAMPLE_RATE = 16000;
const BYTES_PER_SAMPLE = 2; // PCM 16-bit, mono
const HEADER_SIZE = 44;
const CHUNK_SIZE = 64 * 1024;
const FADE_SECONDS = 1.5;

// Vòng hợp âm I–V–vi–IV, mỗi hợp âm gồm các bậc nửa cung so với chủ âm.
const PROGRESSION = [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]];
const ARPEGGIO = [0, 1, 2, 1, 0, 2, 1, 2];

function hashString(value) {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createVoice(songId, durationSeconds) {
  const seed = hashString(songId);
  const rootHz = 196 * 2 ** ((seed % 7) / 12); // từ G3 trở lên
  const beatSeconds = 60 / (72 + (seed % 25));
  const noteSeconds = beatSeconds / 2;
  const chordSeconds = beatSeconds * 4;
  const totalSamples = Math.round(durationSeconds * SAMPLE_RATE);

  const noteHz = (index) => {
    const chord = PROGRESSION[Math.floor((index * noteSeconds) / chordSeconds) % PROGRESSION.length];
    return rootHz * 2 * 2 ** (chord[ARPEGGIO[index % ARPEGGIO.length]] / 12);
  };
  const pluck = (index, localTime) => (index < 0 ? 0 : Math.exp(-localTime * 6) * Math.sin(2 * Math.PI * noteHz(index) * localTime));

  return function sampleAt(sampleIndex) {
    const time = sampleIndex / SAMPLE_RATE;
    const note = Math.floor(time / noteSeconds);
    const noteTime = time - note * noteSeconds;
    const chordIndex = Math.floor(time / chordSeconds);
    const chordTime = time - chordIndex * chordSeconds;
    const chord = PROGRESSION[chordIndex % PROGRESSION.length];

    // Hai nốt gảy chồng nhau để đuôi nốt trước không bị cắt đột ngột.
    const melody = 0.22 * (pluck(note, noteTime) + pluck(note - 1, noteTime + noteSeconds));
    // Nền hợp âm phồng lên rồi lặng xuống trong mỗi hợp âm nên không gây tiếng lách cách khi đổi hợp âm.
    const padEnvelope = Math.sin((Math.PI * chordTime) / chordSeconds);
    const pad = 0.08 * padEnvelope * chord.reduce((sum, step) => sum + Math.sin(2 * Math.PI * rootHz * 2 ** (step / 12) * time), 0);
    const fade = Math.min(1, time / FADE_SECONDS, (totalSamples - sampleIndex) / SAMPLE_RATE / FADE_SECONDS);

    return Math.max(-1, Math.min(1, (melody + pad) * fade));
  };
}

function createHeader(dataSize) {
  const header = Buffer.alloc(HEADER_SIZE);
  header.write('RIFF', 0, 'ascii');
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8, 'ascii');
  header.write('fmt ', 12, 'ascii');
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * BYTES_PER_SAMPLE, 28);
  header.writeUInt16LE(BYTES_PER_SAMPLE, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36, 'ascii');
  header.writeUInt32LE(dataSize, 40);
  return header;
}

export function createDemoAudio(songId, durationSeconds) {
  const totalSamples = Math.max(1, Math.round(durationSeconds * SAMPLE_RATE));
  const dataSize = totalSamples * BYTES_PER_SAMPLE;
  const header = createHeader(dataSize);
  const sampleAt = createVoice(songId, durationSeconds);

  function* chunks(start, end) {
    let position = start;
    while (position <= end) {
      if (position < HEADER_SIZE) {
        const slice = header.subarray(position, Math.min(HEADER_SIZE, end + 1));
        position += slice.length;
        yield slice;
        continue;
      }
      const lastByte = Math.min(end, position + CHUNK_SIZE - 1);
      const firstSample = Math.floor((position - HEADER_SIZE) / BYTES_PER_SAMPLE);
      const lastSample = Math.floor((lastByte - HEADER_SIZE) / BYTES_PER_SAMPLE);
      const buffer = Buffer.alloc((lastSample - firstSample + 1) * BYTES_PER_SAMPLE);
      for (let index = firstSample; index <= lastSample; index += 1) {
        buffer.writeInt16LE(Math.round(sampleAt(index) * 32767), (index - firstSample) * BYTES_PER_SAMPLE);
      }
      const offset = position - HEADER_SIZE - firstSample * BYTES_PER_SAMPLE;
      const slice = buffer.subarray(offset, offset + (lastByte - position + 1));
      position += slice.length;
      yield slice;
    }
  }

  return {
    size: HEADER_SIZE + dataSize,
    contentType: 'audio/wav',
    createReadStream: ({ start = 0, end = HEADER_SIZE + dataSize - 1 } = {}) => Readable.from(chunks(start, end), { objectMode: false }),
  };
}
