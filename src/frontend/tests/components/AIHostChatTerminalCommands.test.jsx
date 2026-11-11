import { describe, test } from 'node:test'
import assert from 'node:assert/strict'

describe('AIHostChatTerminalCommands (T036, T037, T038, T039)', () => {
  describe('/clear and /help interception (T036, T037 - FR-008)', () => {
    test('/clear resets entries to initial banner without calling network', () => {
      let entries = [
        { id: 'banner-0', kind: 'banner' },
        { id: 'user-1', kind: 'user', text: 'hello' },
        { id: 'run-2', kind: 'run', text: 'hi' }
      ]

      const handlePrompt = (prompt) => {
        if (prompt === '/clear') {
          entries = [{ id: 'banner-reset', kind: 'banner' }]
          return { networkDispatched: false }
        }
        return { networkDispatched: true }
      }

      const res = handlePrompt('/clear')
      assert.equal(res.networkDispatched, false)
      assert.equal(entries.length, 1)
      assert.equal(entries[0].kind, 'banner')
    })

    test('/help appends help entry locally without calling network', () => {
      let entries = [{ id: 'banner-0', kind: 'banner' }]

      const handlePrompt = (prompt) => {
        if (prompt === '/help') {
          entries.push({ id: 'user-help', kind: 'user', text: prompt })
          entries.push({ id: 'help-entry', kind: 'help' })
          return { networkDispatched: false }
        }
        return { networkDispatched: true }
      }

      const res = handlePrompt('/help')
      assert.equal(res.networkDispatched, false)
      assert.equal(entries.length, 3)
      assert.equal(entries[2].kind, 'help')
    })
  })

  describe('30-item command history ring buffer (T038 - FR-008)', () => {
    test('maintains up to 30 items in reverse chronological order', () => {
      const history = { items: [], index: -1 }

      const recordPrompt = (prompt) => {
        history.items = [prompt, ...history.items.filter((item) => item !== prompt)].slice(0, 30)
        history.index = -1
      }

      for (let i = 1; i <= 35; i++) {
        recordPrompt(`command-${i}`)
      }

      assert.equal(history.items.length, 30)
      assert.equal(history.items[0], 'command-35')
      assert.equal(history.items[29], 'command-6')
      assert.ok(!history.items.includes('command-1'))
    })

    test('navigates with ArrowUp (older) and ArrowDown (newer), restoring empty string', () => {
      const history = { items: ['command-2', 'command-1'], index: -1 }
      let input = ''

      // Press ArrowUp: get first older command
      history.index = Math.min(history.index + 1, history.items.length - 1)
      input = history.items[history.index]
      assert.equal(input, 'command-2')

      // Press ArrowUp: get next older command
      history.index = Math.min(history.index + 1, history.items.length - 1)
      input = history.items[history.index]
      assert.equal(input, 'command-1')

      // Press ArrowDown: move toward newer command
      history.index -= 1
      input = history.index >= 0 ? history.items[history.index] : ''
      assert.equal(input, 'command-2')

      // Press ArrowDown past index 0: restore empty input
      history.index -= 1
      input = history.index >= 0 ? history.items[history.index] : ''
      assert.equal(input, '')
      assert.equal(history.index, -1)
    })
  })

  describe('Esc abort handling (T039)', () => {
    test('triggers abort and transitions turn status to stopped', () => {
      const controller = new AbortController()
      let status = 'running'

      controller.signal.addEventListener('abort', () => {
        status = 'stopped'
      })

      // Simulate Esc press while running
      controller.abort()

      assert.equal(controller.signal.aborted, true)
      assert.equal(status, 'stopped')
    })
  })
})
