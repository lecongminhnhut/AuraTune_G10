import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { copyLink, shareLink, shareMessage, trackSharePath } from './share.js'

// Feature 046, User Story 1: share a track.
const origin = 'https://auratune.example'
const error = (name) => Object.assign(new Error(name), { name })

function fakeNavigator({ share, clipboard = true, clipboardFails = false } = {}) {
  const calls = { shared: [], copied: [] }
  const nav = {}
  if (share) nav.share = async (data) => { calls.shared.push(data); if (share !== true) throw share }
  if (clipboard) nav.clipboard = { writeText: async (text) => { if (clipboardFails) throw error('NotAllowedError'); calls.copied.push(text) } }
  return { nav, calls }
}

describe('shareLink (FR-002..FR-004)', () => {
  test('opens the share sheet with the track link when the device has one', async () => {
    const { nav, calls } = fakeNavigator({ share: true })
    assert.equal(await shareLink('/album/3?track=17', 'Song · Artist', { origin, nav }), 'shared')
    assert.deepEqual(calls.shared, [{ title: 'Song · Artist', url: `${origin}/album/3?track=17` }])
    assert.deepEqual(calls.copied, [])
  })

  test('cancelling the share sheet is reported as cancelled, without copying', async () => {
    const { nav, calls } = fakeNavigator({ share: error('AbortError') })
    assert.equal(await shareLink('/x', 't', { origin, nav }), 'cancelled')
    assert.deepEqual(calls.copied, [])
  })

  test('a share sheet that cannot open falls back to copying the link', async () => {
    const { nav, calls } = fakeNavigator({ share: error('NotAllowedError') })
    assert.equal(await shareLink('/x', 't', { origin, nav }), 'copied')
    assert.deepEqual(calls.copied, [`${origin}/x`])
  })

  test('without a share sheet the link is copied', async () => {
    const { nav, calls } = fakeNavigator()
    assert.equal(await shareLink('/search?q=a%20b', 't', { origin, nav }), 'copied')
    assert.deepEqual(calls.copied, [`${origin}/search?q=a%20b`])
  })

  test('fails when neither sharing nor copying works', async () => {
    assert.equal(await shareLink('/x', 't', { origin, nav: fakeNavigator({ clipboard: false }).nav }), 'failed')
    assert.equal(await shareLink('/x', 't', { origin, nav: fakeNavigator({ clipboardFails: true }).nav }), 'failed')
    assert.equal(await shareLink('/x', 't', { origin, nav: undefined }), 'failed')
  })

  test('when the Clipboard API is missing or refuses, the link is copied through a hidden text field', async () => {
    const fakeDocument = (copyResult) => {
      const log = []
      const focused = { focus: () => log.push('focus restored') }
      const doc = {
        activeElement: focused,
        body: { appendChild: (field) => log.push(`append ${field.value}`) },
        createElement: () => ({ style: {}, setAttribute() {}, select: () => log.push('select'), remove: () => log.push('remove') }),
        execCommand: (command) => { log.push(command); return copyResult },
      }
      return { doc, log }
    }
    const denied = fakeDocument(true)
    assert.equal(await shareLink('/x', 't', { origin, nav: fakeNavigator({ clipboardFails: true }).nav, doc: denied.doc }), 'copied')
    assert.deepEqual(denied.log, [`append ${origin}/x`, 'select', 'copy', 'remove', 'focus restored'])
    const missing = fakeDocument(true)
    assert.equal(await copyLink('/y', { origin, nav: fakeNavigator({ clipboard: false }).nav, doc: missing.doc }), 'copied')
    const refused = fakeDocument(false)
    assert.equal(await copyLink('/y', { origin, nav: undefined, doc: refused.doc }), 'failed')
    assert.deepEqual(refused.log.slice(-2), ['remove', 'focus restored'], 'the hidden field is always removed')
  })

  test('copyLink copies without opening a share sheet', async () => {
    const { nav, calls } = fakeNavigator({ share: true })
    assert.equal(await copyLink('/album/1', { origin, nav }), 'copied')
    assert.deepEqual(calls.shared, [])
  })
})

describe('trackSharePath (FR-005)', () => {
  test('tracks are shared as a search while the album page cannot load albums', () => {
    assert.equal(trackSharePath({ id: '2', title: 'Glad To Be Stuck Inside', albumId: '1' }), '/search?q=Glad%20To%20Be%20Stuck%20Inside')
  })

  test('with album links enabled, a track with an album opens the album page that contains it', () => {
    assert.equal(trackSharePath({ id: '17', title: 'Glad', albumId: '3' }, { albumLinks: true }), '/album/3?track=17')
    assert.equal(trackSharePath({ id: 't 1', title: 'x', albumId: 'a/b' }, { albumLinks: true }), '/album/a%2Fb?track=t%201')
  })

  test('a track without an album opens a search for it', () => {
    assert.equal(trackSharePath({ id: '17', title: 'Mưa & Lofi', albumId: null }), '/search?q=M%C6%B0a%20%26%20Lofi')
  })
})

test('shareMessage confirms copying and explains failures; nothing for cancel', () => {
  assert.equal(shareMessage('copied'), 'Đã sao chép liên kết vào bộ nhớ tạm.')
  assert.match(shareMessage('failed'), /Không thể chia sẻ/)
  assert.equal(shareMessage('cancelled'), undefined)
})
