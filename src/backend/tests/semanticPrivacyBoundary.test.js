import test from 'node:test'
import assert from 'node:assert/strict'
import { createSemanticSearchOrchestrator } from '../services/semanticSearchOrchestrator.js'

test('unsafe query never reaches the AI payload', async () => {
  let called = false
  const orchestrator = createSemanticSearchOrchestrator({
    privacyGuard: { inspect: async () => ({ safe: false, sanitizedQuery: null }) },
    aiSearch: async () => { called = true; throw new Error('must not call') },
    catalog: { fallback: async () => ({ data: [], pagination: { limit: 20, offset: 0, next_offset: null, has_more: false } }) },
  })
  const result = await orchestrator({ q: 'private query', limit: 20, offset: 0 })
  assert.equal(called, false); assert.equal(result.meta.search_mode, 'keyword_fallback')
})
