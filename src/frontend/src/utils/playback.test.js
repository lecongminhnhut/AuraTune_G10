import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { findActiveLyricIndex, getDurationSeconds, pickAdjacentTrack, playThresholdSeconds } from './playback.js'

const track = (id) => ({ id, duration: '3:00' })
const queue = ['a', 'b', 'c', 'd'].map(track)
const stateAt = (id, overrides = {}) => ({ track: queue.find((item) => item.id === id), queue, shuffle: false, repeatMode: 'off', pinnedNextIds: [], ...overrides })

describe('getDurationSeconds', () => {
  test('reads m:ss strings and plain seconds, tolerating missing values', () => {
    assert.equal(getDurationSeconds('4:21'), 261)
    assert.equal(getDurationSeconds(204), 204)
    assert.equal(getDurationSeconds(undefined), 0)
    assert.equal(getDurationSeconds('abc'), 0)
  })
})

describe('playThresholdSeconds (041-FR-014)', () => {
  test('counts a play after 30 seconds, or half of a short track', () => {
    assert.equal(playThresholdSeconds(261), 30)
    assert.equal(playThresholdSeconds(40), 20)
    assert.equal(playThresholdSeconds(0), 30)
  })
})

describe('pickAdjacentTrack', () => {
  test('moves forward and backward in queue order', () => {
    assert.equal(pickAdjacentTrack(stateAt('b'), 1).id, 'c')
    assert.equal(pickAdjacentTrack(stateAt('b'), -1).id, 'a')
  })

  test('stops at the ends unless repeat all is on (041-FR-007, 043-FR-006)', () => {
    assert.equal(pickAdjacentTrack(stateAt('d'), 1), null)
    assert.equal(pickAdjacentTrack(stateAt('a'), -1), null)
    assert.equal(pickAdjacentTrack(stateAt('d', { repeatMode: 'all' }), 1).id, 'a')
    assert.equal(pickAdjacentTrack(stateAt('a', { repeatMode: 'all' }), -1).id, 'd')
  })

  test('skips unavailable tracks (041-FR-008)', () => {
    const isPlayable = (id) => id !== 'c'
    assert.equal(pickAdjacentTrack(stateAt('b'), 1, { isPlayable }).id, 'd')
  })

  test('shuffle picks another track without reordering the queue (043-FR-002/003)', () => {
    const state = stateAt('b', { shuffle: true })
    assert.equal(pickAdjacentTrack(state, 1, { random: () => 0 }).id, 'a')
    assert.equal(pickAdjacentTrack(state, 1, { random: () => 0.99 }).id, 'd')
    assert.deepEqual(state.queue.map((item) => item.id), ['a', 'b', 'c', 'd'])
  })

  test('a Play Next track wins over shuffle (054-FR-009)', () => {
    const state = stateAt('a', { shuffle: true, pinnedNextIds: ['c'] })
    assert.equal(pickAdjacentTrack(state, 1, { random: () => 0 }).id, 'c')
  })
})

describe('findActiveLyricIndex (044-FR-002)', () => {
  const lines = [{ time: 5, text: 'one' }, { time: 12, text: 'two' }, { time: 20, text: 'three' }]

  test('returns the last line whose start time has been reached', () => {
    assert.equal(findActiveLyricIndex(lines, 0), -1)
    assert.equal(findActiveLyricIndex(lines, 5), 0)
    assert.equal(findActiveLyricIndex(lines, 19.9), 1)
    assert.equal(findActiveLyricIndex(lines, 300), 2)
    assert.equal(findActiveLyricIndex(undefined, 10), -1)
  })
})
