import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizePrompt, sanitizePii, REDACTION_TOKENS } from '../../services/piiSanitizerService.js';

describe('piiSanitizerService (T031 - US5 Privacy & PII Scrubbing - FR-008, SC-003)', () => {
  test('redacts email and Vietnamese phone number from user prompt (Scenario 7)', () => {
    const input = 'Tôi là Nam, email nam99@gmail.com, số điện thoại 0912345678, hãy bật nhạc Trịnh';
    const result = sanitizePrompt(input);

    assert.equal(
      result,
      'Tôi là Nam, email [EMAIL_REDACTED], số điện thoại [PHONE_REDACTED], hãy bật nhạc Trịnh'
    );
    assert.ok(!result.includes('nam99@gmail.com'), 'Email must be completely stripped');
    assert.ok(!result.includes('0912345678'), 'Phone must be completely stripped');
  });

  test('redacts various email formats (RFC 5322)', () => {
    const inputs = [
      'gửi qua user.name+tag@company.co.vn nhé',
      'liên hệ info-support@domain.org',
    ];

    for (const inp of inputs) {
      const sanitized = sanitizePrompt(inp);
      assert.ok(sanitized.includes(REDACTION_TOKENS.EMAIL));
      assert.ok(!sanitized.includes('@'));
    }
  });

  test('redacts Vietnamese and international phone formats', () => {
    const phones = [
      '0987654321',
      '+84912345678',
      '0389998877',
      '+18005550199',
    ];

    for (const p of phones) {
      const sanitized = sanitizePrompt(`Số của mình là ${p}`);
      assert.ok(
        sanitized.includes(REDACTION_TOKENS.PHONE),
        `Phone ${p} was not redacted in ${sanitized}`
      );
      assert.ok(!sanitized.includes(p));
    }
  });

  test('redacts passwords and secret keys', () => {
    const input = 'mật khẩu: MySecretPass123! hãy lưu lại';
    const sanitized = sanitizePrompt(input);

    assert.ok(!sanitized.includes('MySecretPass123!'));
    assert.ok(sanitized.includes(REDACTION_TOKENS.CREDENTIAL));
  });

  test('preserves normal musical titles and numbers without false positives', () => {
    const musicPrompts = [
      'bật bài 3107 của W/n',
      'phát bài 1900 hồi đó',
      'mở bài 1001 lý do',
    ];

    for (const prompt of musicPrompts) {
      const sanitized = sanitizePrompt(prompt);
      assert.equal(sanitized, prompt);
    }
  });

  test('sanitizePii returns accurate metadata', () => {
    const prompt = 'email của tôi là test@domain.com và mật khẩu: 123456';
    const info = sanitizePii(prompt);

    assert.equal(info.containsPii, true);
    assert.ok(info.redactedTypes.includes('email'));
    assert.ok(info.redactedTypes.includes('credential'));
  });
});
