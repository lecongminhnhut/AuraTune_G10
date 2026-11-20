import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeSearchText } from '../utils/searchNormalization.js'
import { createSearchController } from '../controllers/searchController.js'

const repository = { search: async ({ q, type, limit, offset }) => ({ data: [{ id: 't1', type: type === 'artists' ? 'artist' : 'track', title: q }], pagination: { limit, offset, next_offset: null, has_more: false } }) }
const invoke = async (controller, query) => {
  const response = { statusCode: 200, body: null, status(code) { this.statusCode = code; return this }, json(body) { this.body = body; return this } }
  await controller({ query }, response)
  return response
}

test('normalizes case, diacritics, punctuation, and whitespace', () => {
  assert.equal(normalizeSearchText('  CÓ-EM!  '), 'co em')
})

test('returns the approved success envelope', async () => {
  const response = await invoke(createSearchController(repository), { q: 'co em', type: 'tracks', limit: '10' })
  assert.equal(response.statusCode, 200)
  assert.equal(response.body.success, true)
  assert.equal(response.body.pagination.limit, 10)
  assert.equal(response.body.error, null)
})

test('rejects unknown, invalid, and inapplicable parameters', async () => {
  const response = await invoke(createSearchController(repository), { q: 'x', type: 'playlists', genre: 'lofi', unexpected: 'yes' })
  assert.equal(response.statusCode, 400)
  assert.equal(response.body.error.code, 'VALIDATION_ERROR')
  assert.ok(response.body.error.details.length >= 3)
})

test('rejects unavailable catalog failures as internal errors', async () => {
  const response = await invoke(createSearchController({ search: async () => { throw new Error('database details') } }), { q: 'valid' })
  assert.equal(response.statusCode, 500)
  assert.equal(response.body.error.code, 'INTERNAL_ERROR')
  assert.deepEqual(response.body.error.details, [])
})
