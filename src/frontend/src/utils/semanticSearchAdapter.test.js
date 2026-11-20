import test from 'node:test'
import assert from 'node:assert/strict'
import { mapSemanticResult } from './semanticSearchAdapter.js'

test('semantic adapter maps only approved playback fields', () => {
  const result = mapSemanticResult({ id: '1', type: 'track', title: 'Song', artist: 'Artist', duration_seconds: 120, play_count: 3, cover_url: '/cover', ai_reason: null })
  assert.equal(result.duration, 120); assert.equal(result.artistId, undefined); assert.equal(result.ai_reason, null)
})
