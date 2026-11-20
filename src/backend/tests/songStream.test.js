import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import express from 'express';

const mediaDir = mkdtempSync(path.join(tmpdir(), 'auratune-media-'));
process.env.MEDIA_DIR = mediaDir;
process.env.DEMO_AUDIO = 'true';

const { default: songRoutes } = await import('../routes/songRoutes.js');
const { parseByteRange } = await import('../utils/httpRange.js');
const { resolveAudioSource } = await import('../utils/audioSource.js');
const { demoSongs } = await import('../data/demoSongs.js');

const wavSize = (seconds) => 44 + seconds * 16000 * 2;

let server;
let baseUrl;

before(async () => {
  const app = express();
  app.use('/api/v1/songs', songRoutes);
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/songs`;
});

after(() => {
  server?.close();
  rmSync(mediaDir, { recursive: true, force: true });
});

describe('parseByteRange', () => {
  test('returns null when there is no usable range', () => {
    assert.equal(parseByteRange(undefined, 100), null);
    assert.equal(parseByteRange('bytes=-', 100), null);
    assert.equal(parseByteRange('bytes=0-10,20-30', 100), null);
    assert.equal(parseByteRange('items=0-10', 100), null);
    assert.equal(parseByteRange('bytes=50-10', 100), null);
  });

  test('parses closed, open-ended and suffix ranges', () => {
    assert.deepEqual(parseByteRange('bytes=0-9', 100), { start: 0, end: 9 });
    assert.deepEqual(parseByteRange('bytes=90-', 100), { start: 90, end: 99 });
    assert.deepEqual(parseByteRange('bytes=95-500', 100), { start: 95, end: 99 });
    assert.deepEqual(parseByteRange('bytes=-10', 100), { start: 90, end: 99 });
    assert.deepEqual(parseByteRange('bytes=-500', 100), { start: 0, end: 99 });
  });

  test('flags ranges outside the file as unsatisfiable', () => {
    assert.equal(parseByteRange('bytes=100-', 100), 'unsatisfiable');
    assert.equal(parseByteRange('bytes=-0', 100), 'unsatisfiable');
  });
});

describe('GET /api/v1/songs/:id', () => {
  test('returns song metadata with its stream URL', async () => {
    const response = await fetch(`${baseUrl}/t8`);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.data.id, 't8');
    assert.equal(body.data.duration, 204);
    assert.equal(body.data.stream_url, '/api/v1/songs/t8/stream');
  });

  test('rejects malformed ids and unknown songs with the JSON error envelope', async () => {
    const invalid = await fetch(`${baseUrl}/bad.id`);
    assert.equal(invalid.status, 400);
    assert.equal((await invalid.json()).error, 'invalid_song_id');

    const missing = await fetch(`${baseUrl}/nope/stream`);
    assert.equal(missing.status, 404);
    assert.equal((await missing.json()).error, 'song_not_found');
  });
});

describe('GET /api/v1/songs/:id/stream', () => {
  test('advertises byte ranges and the full length without a Range header', async () => {
    const response = await fetch(`${baseUrl}/t9/stream`, { method: 'HEAD' });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('accept-ranges'), 'bytes');
    assert.equal(response.headers.get('content-type'), 'audio/wav');
    assert.equal(Number(response.headers.get('content-length')), wavSize(178));
  });

  test('serves a valid WAV header in a 206 partial response', async () => {
    const response = await fetch(`${baseUrl}/t9/stream`, { headers: { Range: 'bytes=0-43' } });
    assert.equal(response.status, 206);
    assert.equal(response.headers.get('content-range'), `bytes 0-43/${wavSize(178)}`);
    const header = Buffer.from(await response.arrayBuffer());
    assert.equal(header.length, 44);
    assert.equal(header.toString('ascii', 0, 4), 'RIFF');
    assert.equal(header.toString('ascii', 8, 12), 'WAVE');
    assert.equal(header.readUInt32LE(40), wavSize(178) - 44);
  });

  test('returns identical bytes for overlapping ranges, including odd offsets', async () => {
    const wide = Buffer.from(await (await fetch(`${baseUrl}/t9/stream`, { headers: { Range: 'bytes=500000-500099' } })).arrayBuffer());
    const narrow = Buffer.from(await (await fetch(`${baseUrl}/t9/stream`, { headers: { Range: 'bytes=500013-500020' } })).arrayBuffer());
    assert.equal(wide.length, 100);
    assert.deepEqual(narrow, wide.subarray(13, 21));
    assert.ok(wide.some((byte) => byte !== 0), 'demo audio should not be silent mid-track');
  });

  test('answers 416 with the resource size when the range is out of bounds', async () => {
    const response = await fetch(`${baseUrl}/t9/stream`, { headers: { Range: `bytes=${wavSize(178)}-` } });
    assert.equal(response.status, 416);
    assert.equal(response.headers.get('content-range'), `bytes */${wavSize(178)}`);
    assert.equal((await response.json()).error, 'range_not_satisfiable');
  });

  test('refuses unavailable songs', async () => {
    const song = demoSongs.find((item) => item.song_id === 't2');
    song.is_active = false;
    try {
      const response = await fetch(`${baseUrl}/t2/stream`);
      assert.equal(response.status, 410);
      assert.equal((await response.json()).error, 'song_unavailable');
    } finally {
      song.is_active = true;
    }
  });

  test('prefers a local media file named after the song id', async () => {
    const bytes = Buffer.from(Array.from({ length: 256 }, (_, index) => index));
    writeFileSync(path.join(mediaDir, 't1.mp3'), bytes);
    const response = await fetch(`${baseUrl}/t1/stream`, { headers: { Range: 'bytes=10-19' } });
    assert.equal(response.status, 206);
    assert.equal(response.headers.get('content-type'), 'audio/mpeg');
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes.subarray(10, 20));
  });
});

describe('resolveAudioSource', () => {
  test('never reads files outside the media directory', async () => {
    writeFileSync(path.join(path.dirname(mediaDir), 'outside.mp3'), 'secret');
    const source = await resolveAudioSource({ song_id: 'zz', audio_url: '../outside.mp3', duration: 5 });
    assert.equal(source.type, 'demo');
    rmSync(path.join(path.dirname(mediaDir), 'outside.mp3'), { force: true });
  });

  test('redirects to remote storage URLs', async () => {
    const source = await resolveAudioSource({ song_id: 'zz', audio_url: 'https://cdn.example.com/a.mp3' });
    assert.deepEqual(source, { type: 'redirect', url: 'https://cdn.example.com/a.mp3' });
  });
});
