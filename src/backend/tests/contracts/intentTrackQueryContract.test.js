import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import intentRoutes from '../../routes/intentRoutes.js';
import { JWT_SECRET } from '../../utils/authHelpers.js';
import { db as memDb } from '../../db.js';

let server;
let baseUrl;
let validToken;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/agent/intent', intentRoutes);

  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1/agent/intent`;

  const user = memDb.findUserById('u-demo') || {
    id: 'u-demo',
    email: 'demo@auratune.vn',
    role: 'listener',
  };
  const session = memDb.createSession({
    user_id: user.id,
    refresh_token_hash: 'mock-hash-context',
    device_info: 'test-context',
    ip_address: '127.0.0.1',
  });

  validToken = jwt.sign(
    {
      user_id: user.id,
      email: user.email,
      role: user.role,
      session_id: session.id,
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
});

after(() => {
  server?.close();
});

describe('POST /api/v1/agent/intent/analyze - Track Query Contract (T021 - US3 Contract Tests)', () => {
  test('returns query_music_info with targetTrackId and dialogue_response action', async () => {
    const res = await fetch(`${baseUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validToken}`,
      },
      body: JSON.stringify({
        rawPrompt: 'bài đang phát là gì thế?',
        context: {
          currentTrack: {
            id: 'song-1',
            title: 'Ánh Nắng Của Anh',
            artist: 'Đức Phúc',
          },
          isPlaying: true,
          volume: 60,
        },
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.error, null);
    assert.ok(body.data);
    assert.equal(body.data.intentType, 'query_music_info');
    assert.equal(body.data.extractedEntities?.targetTrackId, 'song-1');
    assert.equal(body.data.extractedEntities?.songTitle, 'Ánh Nắng Của Anh');
    assert.equal(body.data.extractedEntities?.artistName, 'Đức Phúc');
    assert.equal(body.data.suggestedAction, 'dialogue_response');
  });
});
