import test from 'node:test'
import assert from 'node:assert/strict'
import { addSearchHistory, clearSearchHistory, getSearchHistory, removeSearchHistory } from './searchHistory.js'

test('caps recent searches at ten unique entries and supports removal', () => {
  global.window = { localStorage: { data: new Map(), getItem(key) { return this.data.get(key) ?? null }, setItem(key, value) { this.data.set(key, value) }, removeItem(key) { this.data.delete(key) } } }
  clearSearchHistory()
  for (let index = 0; index < 12; index += 1) addSearchHistory(`query-${index}`)
  assert.equal(getSearchHistory().length, 10)
  removeSearchHistory('query-11')
  assert.equal(getSearchHistory().includes('query-11'), false)
  clearSearchHistory()
  assert.deepEqual(getSearchHistory(), [])
})

test('keeps an in-memory history when storage is unavailable', () => {
  global.window = { get localStorage() { throw new Error('blocked') } }
  addSearchHistory('offline query')
  assert.ok(getSearchHistory().includes('offline query'))
})
