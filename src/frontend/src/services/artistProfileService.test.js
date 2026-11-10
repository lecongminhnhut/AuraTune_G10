import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadArtistProfile } from './artistProfileService.js';

const dto = { id: '1', name: 'Artist', imageUrl: null, biography: null };
const reply = (status, data) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

test('public fetch omits credentials, bearer, refresh and persistent cache', async () => {
  const controller = new AbortController();
  const result = await loadArtistProfile('1', { signal: controller.signal, fetchImpl: async (url, options) => {
    assert.match(url, /\/artists\/1$/);
    assert.equal(options.credentials, 'omit');
    assert.equal(options.cache, 'no-store');
    assert.equal(options.signal, controller.signal);
    assert.equal(new Headers(options.headers).has('Authorization'), false);
    return reply(200, { success: true, message: 'ok', data: dto, error: null });
  } });
  assert.deepEqual(result, dto);
});

test('confirmed not-found is distinct from read/transport/protocol failure', async () => {
  await assert.rejects(loadArtistProfile('1', { fetchImpl: async () => reply(404, { success: false, data: null, error: { code: 'NOT_FOUND', details: [] } }) }), e => e.kind === 'not-found');
  for (const [status, data] of [[500, { data: [] }], [404, { error: 'route not found' }], [200, { success: true, data: { ...dto, id: '2' }, error: null }], [200, { success: true, data: { ...dto, name: '' }, error: null }]]) {
    await assert.rejects(loadArtistProfile('1', { fetchImpl: async () => reply(status, data) }), e => e.kind === 'unavailable');
  }
});

test('malformed ID never issues a request and network errors do not become empty profile', async () => {
  await assert.rejects(loadArtistProfile('%ZZ', { fetchImpl: () => { throw new Error('must not fetch'); } }), e => e.kind === 'invalid-id');
  await assert.rejects(loadArtistProfile('1', { fetchImpl: async () => { throw new TypeError('network'); } }), e => e.kind === 'unavailable');
});
