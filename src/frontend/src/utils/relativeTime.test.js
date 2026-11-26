import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatRelativeTime } from './relativeTime.js'

// Feature 046 (FR-007): relative time of a comment.
test('formatRelativeTime', () => {
  const now = Date.parse('2026-11-25T12:00:00Z')
  const ago = (ms) => new Date(now - ms).toISOString()
  assert.equal(formatRelativeTime(ago(20 * 1000), now), 'Vừa xong')
  assert.equal(formatRelativeTime(ago(-5000), now), 'Vừa xong', 'clock skew in the future')
  assert.equal(formatRelativeTime(ago(5 * 60000), now), '5 phút trước')
  assert.equal(formatRelativeTime(ago(90 * 60000), now), '1 giờ trước')
  assert.equal(formatRelativeTime(ago(23 * 3600000), now), '23 giờ trước')
  assert.equal(formatRelativeTime(ago(2 * 86400000), now), '2 ngày trước')
  assert.equal(formatRelativeTime(ago(30 * 86400000), now), '30 ngày trước')
  assert.match(formatRelativeTime(ago(45 * 86400000), now), /^\d{2}\/\d{2}\/2026$/)
  assert.equal(formatRelativeTime('not a date', now), '')
})
