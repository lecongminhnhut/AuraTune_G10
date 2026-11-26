import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { parseLyrics } from '../utils/lyrics.js';
import { normalizeSong } from '../repositories/songRepository.js';

// Group 040, Feature 044 (T031): lyrics from `songs.lyrics` for the full player.

describe('parseLyrics', () => {
  test('no lyrics', () => {
    for (const value of [null, undefined, '', '   \n ', 42]) assert.deepEqual(parseLyrics(value), { synced: [], plain: null });
  });

  test('LRC lines become time-stamped lines sorted by time', () => {
    const lrc = '[ti:Song]\n[ar:Artist]\n[00:12.50]Second line\n[00:01.00]First line\r\n[01:02.345]Third line\n';
    assert.deepEqual(parseLyrics(lrc), {
      synced: [
        { time: 1, text: 'First line' },
        { time: 12.5, text: 'Second line' },
        { time: 62.345, text: 'Third line' },
      ],
      plain: null,
    });
  });

  test('repeated time tags, empty lines, word tags and fractions', () => {
    const lrc = '[00:05][00:30.5]Chorus\n[00:10.00]\n[00:20.00]<00:20.00>Word <00:20.50>by <00:21.00>word';
    assert.deepEqual(parseLyrics(lrc).synced, [
      { time: 5, text: 'Chorus' },
      { time: 10, text: '♪' },
      { time: 20, text: 'Word by word' },
      { time: 30.5, text: 'Chorus' },
    ]);
  });

  test('the offset tag shifts lines (positive means sooner) without going below zero', () => {
    assert.deepEqual(parseLyrics('[offset:+500]\n[00:00.20]a\n[00:02.00]b').synced, [{ time: 0, text: 'a' }, { time: 1.5, text: 'b' }]);
    assert.deepEqual(parseLyrics('[offset:-1000]\n[00:02.00]b').synced, [{ time: 3, text: 'b' }]);
  });

  test('plain lyrics keep section labels and line breaks', () => {
    assert.deepEqual(parseLyrics('[Verse 1]\nLine one\nLine two\n\n\n\n[Chorus]\nLa la'), {
      synced: [],
      plain: '[Verse 1]\nLine one\nLine two\n\n[Chorus]\nLa la',
    });
  });

  test('a JSON array of { time, text } is accepted', () => {
    assert.deepEqual(parseLyrics('[{"time":3,"text":"b"},{"time":1,"text":"a"},{"time":"x","text":"bad"}]').synced, [
      { time: 1, text: 'a' },
      { time: 3, text: 'b' },
    ]);
  });

  test('invalid time tags are read as plain text', () => {
    assert.deepEqual(parseLyrics('[00:75.00]not a time'), { synced: [], plain: '[00:75.00]not a time' });
  });
});

describe('normalizeSong keeps the lyrics column', () => {
  test('string lyrics are kept, other values become null', () => {
    assert.equal(normalizeSong({ song_id: 1, title: 'x', lyrics: '[00:01.00]a' }).lyrics, '[00:01.00]a');
    assert.equal(normalizeSong({ song_id: 1, title: 'x' }).lyrics, null);
  });
});

describe('GET /api/v1/songs/:id/lyrics', () => {
  let server;
  let baseUrl;

  before(async () => {
    process.env.DEMO_AUDIO = 'true';
    const { default: songRoutes } = await import('../routes/songRoutes.js');
    const app = express();
    app.use('/api/v1/songs', songRoutes);
    await new Promise((resolve) => { server = app.listen(0, resolve); });
    baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/songs`;
  });

  after(() => server?.close());

  test('a song without lyrics answers 200 with has_lyrics false', async () => {
    const response = await fetch(`${baseUrl}/t8/lyrics`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('cache-control'), /max-age=300/);
    assert.deepEqual((await response.json()).data, { song_id: 't8', has_lyrics: false, synced: [], plain: null });
  });

  test('unknown and invalid ids', async () => {
    assert.equal((await fetch(`${baseUrl}/no-such-song/lyrics`)).status, 404);
    assert.equal((await fetch(`${baseUrl}/bad%20id/lyrics`)).status, 400);
  });
});
