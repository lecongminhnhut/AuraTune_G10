import test from 'node:test'
import assert from 'node:assert/strict'
import { createSemanticPrivacyGuard } from '../services/semanticPrivacyGuard.js'

test('privacy guard blocks email and authenticated profile identity', async () => {
  const guard = createSemanticPrivacyGuard({ getArtistNames: async () => ['Rainy Night'] })
  assert.equal((await guard.inspect('music me@example.com')).safe, false)
  assert.equal((await guard.inspect('songs for Minh Anh', { display_name: 'Minh Anh' })).safe, false)
})

test('privacy guard preserves recognized artists and blocks ambiguous personal names', async () => {
  const guard = createSemanticPrivacyGuard({ getArtistNames: async () => ['Minh Anh'] })
  assert.equal((await guard.inspect('songs by Minh Anh')).safe, true)
  assert.equal((await guard.inspect('my name is Nguyen Van A')).safe, false)
})
