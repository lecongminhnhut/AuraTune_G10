import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeClientPrompt, REDACTION_TOKENS } from '../../src/utils/piiSanitizer.js';

describe('piiSanitizer (T032 - US5 Client Edge PII Redaction - FR-008, SC-003)', () => {
  test('redacts email and phone at client edge (Scenario 7)', () => {
    const input = 'Tôi là Nam, email nam99@gmail.com, số điện thoại 0912345678, hãy bật nhạc Trịnh';
    const result = sanitizeClientPrompt(input);

    assert.equal(
      result,
      'Tôi là Nam, email [EMAIL_REDACTED], số điện thoại [PHONE_REDACTED], hãy bật nhạc Trịnh'
    );
    assert.ok(!result.includes('nam99@gmail.com'));
    assert.ok(!result.includes('0912345678'));
  });

  test('redacts passwords at client edge', () => {
    const input = 'password: superSecret! bật nhạc chill';
    const result = sanitizeClientPrompt(input);

    assert.ok(!result.includes('superSecret!'));
    assert.ok(result.includes(REDACTION_TOKENS.CREDENTIAL));
  });

  test('handles empty or non-string inputs safely', () => {
    assert.equal(sanitizeClientPrompt(''), '');
    assert.equal(sanitizeClientPrompt(null), '');
    assert.equal(sanitizeClientPrompt(undefined), '');
  });
});
