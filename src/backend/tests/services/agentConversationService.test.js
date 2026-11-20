import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { validatePrompt, streamConversation } from '../../services/agentConversationService.js';

describe('agentConversationService (T015 - US2 Unit Tests)', () => {
  describe('validatePrompt (FR-006)', () => {
    test('trims and accepts valid prompt between 1 and 500 characters', () => {
      const valid = '   Bài đang phát là gì?   ';
      const result = validatePrompt(valid);
      assert.equal(result, 'Bài đang phát là gì?');
    });

    test('accepts prompt of exact 500 characters', () => {
      const exact500 = 'a'.repeat(500);
      assert.equal(validatePrompt(exact500), exact500);
    });

    test('rejects empty string with VALIDATION_ERROR', () => {
      assert.throws(
        () => validatePrompt(''),
        (err) => err.code === 'VALIDATION_ERROR' && err.message.includes('không được để trống')
      );
    });

    test('rejects whitespace-only string with VALIDATION_ERROR', () => {
      assert.throws(
        () => validatePrompt('    \t\n   '),
        (err) => err.code === 'VALIDATION_ERROR' && err.message.includes('không được để trống')
      );
    });

    test('rejects non-string types with VALIDATION_ERROR', () => {
      assert.throws(() => validatePrompt(null), (err) => err.code === 'VALIDATION_ERROR');
      assert.throws(() => validatePrompt(undefined), (err) => err.code === 'VALIDATION_ERROR');
      assert.throws(() => validatePrompt(123), (err) => err.code === 'VALIDATION_ERROR');
    });

    test('rejects prompt exceeding 500 characters with VALIDATION_ERROR', () => {
      const over500 = 'a'.repeat(501);
      assert.throws(
        () => validatePrompt(over500),
        (err) => err.code === 'VALIDATION_ERROR' && err.message.includes('500')
      );
    });
  });

  describe('streamConversation pipeline', () => {
    test('emits thinking, text chunks, and done events in proper sequence', async () => {
      const events = [];
      const sseEmitter = {
        isClosed: () => false,
        sendThinking: (text) => events.push({ type: 'thinking', text }),
        sendText: (delta) => events.push({ type: 'text', delta }),
        sendError: (message, code) => events.push({ type: 'error', message, code }),
        sendDone: (totalDurationMs) => events.push({ type: 'done', totalDurationMs })
      };

      await streamConversation({
        prompt: 'Xin chào',
        context: { isPlaying: false },
        sseEmitter
      });

      assert.ok(events.length >= 3, 'Expected at least 3 events');
      assert.equal(events[0].type, 'thinking');

      const textEvents = events.filter((e) => e.type === 'text');
      assert.ok(textEvents.length > 0, 'Expected text delta events');

      const lastEvent = events[events.length - 1];
      assert.equal(lastEvent.type, 'done');
      assert.ok(typeof lastEvent.totalDurationMs === 'number');
    });
  });
});
