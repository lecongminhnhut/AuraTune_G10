// Group 040, Feature 044 (T031): lyrics stored in `songs.lyrics` (text).
// The column holds either time-stamped LRC lines ("[01:02.50]text") or plain lyrics.
// parseLyrics returns the shape the full player's LyricsPanel uses:
//   synced: [{ time: seconds, text }] sorted by time (empty when there are no time stamps)
//   plain:  string | null (only when the lyrics are not time-stamped)

const TIME_TAG = /\[(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?\]/y;
// LRC header tags (title, artist, album, author, creator, length, offset, editor, version, comment).
const META_TAG = /^\s*\[(ar|ti|al|au|by|length|offset|re|ve|#)\s*:[^\]]*\]\s*$/i;
const OFFSET_TAG = /^\s*\[offset\s*:\s*([+-]?\d+)\s*\]\s*$/i;
// Word-level time stamps of enhanced LRC ("<00:12.30>word").
const WORD_TAG = /<\d{1,3}:\d{1,2}(?:[.:]\d{1,3})?>/g;
const INSTRUMENTAL_MARK = '♪';

const fractionToSeconds = (digits) => (digits ? Number(digits) / 10 ** digits.length : 0);

// Reads the time tags at the start of a line; returns null when the line has none.
function readTimeTags(line) {
  const times = [];
  TIME_TAG.lastIndex = 0;
  let match;
  let position = 0;
  while ((match = TIME_TAG.exec(line))) {
    const seconds = Number(match[2]);
    if (seconds >= 60) return null;
    times.push(Number(match[1]) * 60 + seconds + fractionToSeconds(match[3]));
    position = TIME_TAG.lastIndex;
  }
  return times.length ? { times, text: line.slice(position) } : null;
}

function fromJson(text) {
  if (!text.startsWith('[{')) return null;
  try {
    const value = JSON.parse(text);
    if (!Array.isArray(value)) return null;
    const lines = value
      .filter((line) => line && Number.isFinite(Number(line.time)) && typeof line.text === 'string')
      .map((line) => ({ time: Math.max(0, Number(line.time)), text: line.text.trim() || INSTRUMENTAL_MARK }));
    return lines.length ? lines.sort((a, b) => a.time - b.time) : null;
  } catch {
    return null;
  }
}

export function parseLyrics(value) {
  const text = typeof value === 'string' ? value.replace(/\r\n?/g, '\n').trim() : '';
  if (!text) return { synced: [], plain: null };

  const json = fromJson(text);
  if (json) return { synced: json, plain: null };

  let offsetSeconds = 0;
  const synced = [];
  const plainLines = [];
  for (const line of text.split('\n')) {
    const offset = OFFSET_TAG.exec(line);
    if (offset) { offsetSeconds = Number(offset[1]) / 1000; continue; }
    if (META_TAG.test(line)) continue;
    const tagged = readTimeTags(line.trimStart());
    if (!tagged) { plainLines.push(line.trimEnd()); continue; }
    const lineText = tagged.text.replace(WORD_TAG, '').trim() || INSTRUMENTAL_MARK;
    for (const time of tagged.times) synced.push({ time, text: lineText });
  }

  if (synced.length) {
    // A positive offset makes the lyrics appear sooner.
    const lines = synced.map((line) => ({ time: Math.max(0, Math.round((line.time - offsetSeconds) * 1000) / 1000), text: line.text }));
    return { synced: lines.sort((a, b) => a.time - b.time), plain: null };
  }

  const plain = plainLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  return { synced: [], plain: plain || null };
}
