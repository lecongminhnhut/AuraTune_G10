import test from 'node:test'
import assert from 'node:assert/strict'
import { createSearchController } from '../controllers/searchController.js'

const response = () => ({ statusCode: 200, body: null, status(code) { this.statusCode = code; return this }, json(body) { this.body = body; return this } })

test('semantic mode uses the existing search route and approved envelope', async () => {
  const controller = createSearchController({ search: async () => ({ data: [], pagination: { limit: 20, offset: 0, next_offset: null, has_more: false } }) }, async () => ({ data: [{ id: '1' }], pagination: { limit: 20, offset: 0, next_offset: null, has_more: false }, meta: { search_mode: 'semantic' }, message: 'Semantic search results retrieved' }))
  const result = response(); await controller({ query: { q: 'rainy night music', mode: 'semantic' }, signal: undefined }, result)
  assert.equal(result.statusCode, 200); assert.equal(result.body.meta.search_mode, 'semantic'); assert.equal(result.body.data[0].id, '1')
})

test('semantic mode rejects unknown parameters and invalid query locally', async () => {
  const controller = createSearchController({}, async () => { throw new Error('must not call') })
  const result = response(); await controller({ query: { q: '!!!', mode: 'semantic', secret: 'x' } }, result)
  assert.equal(result.statusCode, 400); assert.equal(result.body.error.code, 'VALIDATION_ERROR')
})
