/**
 * Client-Side Edge PII Sanitizer Utility (Feature 122 - FR-008, SC-003)
 * Redacts emails, phone numbers, and credentials before network transmission.
 */

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const VN_PHONE_REGEX = /(?:\+?84|0)(?:3[2-9]|5[689]|7[06-9]|8[1-9]|9[0-9])(?:[\s.-]?\d){7}\b/g;
const INTL_PHONE_REGEX = /\+\d{1,4}(?:[\s.-]?\d){7,13}\b/g;
const GENERIC_PHONE_REGEX = /\b0\d{2,3}[\s.-]?\d{3,4}[\s.-]?\d{3,4}\b/g;

const CREDENTIAL_KEY_VALUE_REGEX = /(?<=\b(?:mật khẩu|mat khau|password|pass|secret)\s*[:=]\s*)\S+/gi;
const CREDENTIAL_IS_REGEX = /(?<=\b(?:mật khẩu|mat khau|password|pass)\s+(?:là|la|is)\s+)\S+/gi;

export const REDACTION_TOKENS = Object.freeze({
  EMAIL: '[EMAIL_REDACTED]',
  PHONE: '[PHONE_REDACTED]',
  CREDENTIAL: '[CREDENTIAL_REDACTED]',
});

/**
 * Sanitizes sensitive personal information from prompt string at client edge
 * @param {string} text - User prompt input
 * @returns {string} Redacted prompt
 */
export function sanitizeClientPrompt(text) {
  if (!text || typeof text !== 'string') return '';

  let sanitized = text;

  // 1. Redact credentials/passwords
  sanitized = sanitized
    .replace(CREDENTIAL_KEY_VALUE_REGEX, REDACTION_TOKENS.CREDENTIAL)
    .replace(CREDENTIAL_IS_REGEX, REDACTION_TOKENS.CREDENTIAL);

  // 2. Redact emails
  sanitized = sanitized.replace(EMAIL_REGEX, REDACTION_TOKENS.EMAIL);

  // 3. Redact phone numbers
  sanitized = sanitized
    .replace(VN_PHONE_REGEX, REDACTION_TOKENS.PHONE)
    .replace(INTL_PHONE_REGEX, REDACTION_TOKENS.PHONE)
    .replace(GENERIC_PHONE_REGEX, REDACTION_TOKENS.PHONE);

  return sanitized;
}

export default {
  sanitizeClientPrompt,
  REDACTION_TOKENS,
};
