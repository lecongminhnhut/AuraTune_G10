import test from 'node:test'
import assert from 'node:assert/strict'
import { createSemanticSearchOrchestrator } from '../services/semanticSearchOrchestrator.js'

const catalog = {
  getRows: async () => [{ song_id: '1', total_plays: 5 }],
  hydrate: async (items, limit, offset) => ({ data: items.map((item) => ({ id: item.id, type: 'track', title: 'Song', artist: 'Artist' })), pagination: { limit, offset, next_offset: null, has_more: false } }),
  fallback: async ({ limit, offset }) => ({ data: [{ id: '1', type: 'track', title: 'Fallback', artist: 'Artist' }], pagination: { limit, offset, next_offset: null, has_more: false } }),
}

for (const error of [{ status: 503 }, { status: 429 }, { status: 500 }]) test(`AI status ${error.status} falls back without retry`, async () => {
  let calls = 0
  const result = await createSemanticSearchOrchestrator({ catalog, privacyGuard: { inspect: async () => ({ safe: true, sanitizedQuery: 'rain music' }) }, aiSearch: async () => { calls += 1; const failure = new Error('unavailable'); failure.status = error.status; throw failure } })({ q: 'rain music' })
  assert.equal(calls, 1); assert.equal(result.meta.search_mode, 'keyword_fallback')
})
