import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { loadPlayerSnapshot, PLAYER_STORAGE_KEY, savePlayerSnapshot } from './playerStorage.js'

const catalog = ['a', 'b', 'c'].map((id) => ({ id, duration: '3:00' }))
const findTrack = (id) => catalog.find((track) => track.id === id) ?? null

function memoryStorage(initial = {}) {
  const data = { ...initial }
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => { data[key] = String(value) },
  }
}

const playerState = {
  track: catalog[1], queue: catalog, playlistId: 'p1', elapsed: 42.7,
  shuffle: true, repeatMode: 'all', pinnedNextIds: ['c'], isPlaying: true, playKey: 3,
}

describe('player snapshot (045-FR-012)', () => {
  test('stores ids only and restores the same track, queue and position', () => {
    const storage = memoryStorage()
    savePlayerSnapshot(storage, playerState)
    const saved = JSON.parse(storage.data[PLAYER_STORAGE_KEY])
    assert.deepEqual(saved.queueIds, ['a', 'b', 'c'])
    assert.equal(saved.elapsed, 42)
    assert.equal('isPlaying' in saved, false)

    const restored = loadPlayerSnapshot(storage, { findTrack })
    assert.equal(restored.track.id, 'b')
    assert.deepEqual(restored.queue.map((track) => track.id), ['a', 'b', 'c'])
    assert.equal(restored.elapsed, 42)
    assert.equal(restored.repeatMode, 'all')
    assert.deepEqual(restored.pinnedNextIds, ['c'])
  })

  test('drops tracks that no longer exist or are unavailable', () => {
    const storage = memoryStorage({ [PLAYER_STORAGE_KEY]: JSON.stringify({ v: 1, trackId: 'a', queueIds: ['a', 'gone', 'b', 'c'], elapsed: 10 }) })
    const restored = loadPlayerSnapshot(storage, { findTrack, isPlayable: (id) => id !== 'c' })
    assert.deepEqual(restored.queue.map((track) => track.id), ['a', 'b'])
  })

  test('ignores corrupt, outdated or unplayable snapshots', () => {
    assert.equal(loadPlayerSnapshot(memoryStorage({ [PLAYER_STORAGE_KEY]: '{oops' }), { findTrack }), null)
    assert.equal(loadPlayerSnapshot(memoryStorage({ [PLAYER_STORAGE_KEY]: JSON.stringify({ v: 0, trackId: 'a' }) }), { findTrack }), null)
    assert.equal(loadPlayerSnapshot(memoryStorage({ [PLAYER_STORAGE_KEY]: JSON.stringify({ v: 1, trackId: 'a' }) }), { findTrack, isPlayable: () => false }), null)
    assert.equal(loadPlayerSnapshot(null, { findTrack }), null)
  })

  test('clamps a stored position to the track length', () => {
    const storage = memoryStorage({ [PLAYER_STORAGE_KEY]: JSON.stringify({ v: 1, trackId: 'a', queueIds: ['a'], elapsed: 9999 }) })
    assert.equal(loadPlayerSnapshot(storage, { findTrack }).elapsed, 179)
  })
})
