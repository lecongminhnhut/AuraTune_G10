import test from 'node:test'
import assert from 'node:assert/strict'
import { searchMetadata } from '../../src/services/searchApi.js'
import { normalizeSearchText } from '../../src/utils/searchNormalization.js'

test('metadata search serializes only approved parameters', async () => {
  let requestedUrl = ''
  global.fetch = async (url) => {
    requestedUrl = url
    return { ok: true, json: async () => ({ success: true, data: [], pagination: { limit: 20, offset: 0, next_offset: null, has_more: false }, error: null }) }
  }
  await searchMetadata({ q: ' CÓ em ', type: 'tracks', limit: 20, offset: 0, genre: 'rnb', release_year: 2026, sort: 'newest', ignored: 'secret' })
  assert.match(requestedUrl, /q=\+C%C3%93\+em\+/)
  assert.match(requestedUrl, /type=tracks/)
  assert.doesNotMatch(requestedUrl, /ignored/)
})

test('frontend normalization matches backend normalization policy', () => {
  assert.equal(normalizeSearchText('  CÓ-EM! '), 'co em')
})

test('network and contract errors expose actionable codes', async () => {
  global.fetch = async () => ({ ok: false, status: 429, json: async () => ({ success: false, message: 'Too many requests', error: { code: 'RATE_LIMITED', details: [] } }) })
  await assert.rejects(() => searchMetadata({ q: 'valid' }), (error) => error.code === 'RATE_LIMITED' && error.status === 429)
})
