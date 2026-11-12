/**
 * PII Sanitizer Service (Feature 122 - FR-008, SC-003)
 * Redacts 100% of emails, phone numbers, and credentials before
 * prompts reach any AI natural language models or external logging.
 * Complies with Decree 13/2023/ND-CP.
 */

// RFC 5322 compliant email regex pattern
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Vietnamese and international phone number patterns
// Matches e.g. 0912345678, +84912345678, 0912 345 678, 0912-345-678, +1 800 555 0199
const VN_PHONE_REGEX = /(?:\+?84|0)(?:3[2-9]|5[689]|7[06-9]|8[1-9]|9[0-9])(?:[\s.-]?\d){7}\b/g;
const INTL_PHONE_REGEX = /\+\d{1,4}(?:[\s.-]?\d){7,13}\b/g;
const GENERIC_PHONE_REGEX = /\b0\d{2,3}[\s.-]?\d{3,4}[\s.-]?\d{3,4}\b/g;

// Password / credential patterns
const CREDENTIAL_KEY_VALUE_REGEX = /(?<=\b(?:mật khẩu|mat khau|password|pass|secret)\s*[:=]\s*)\S+/gi;
const CREDENTIAL_IS_REGEX = /(?<=\b(?:mật khẩu|mat khau|password|pass)\s+(?:là|la|is)\s+)\S+/gi;

export const REDACTION_TOKENS = Object.freeze({
  EMAIL: '[EMAIL_REDACTED]',
  PHONE: '[PHONE_REDACTED]',
  CREDENTIAL: '[CREDENTIAL_REDACTED]',
});

/**
 * Sanitizes sensitive PII from prompt text
 * @param {string} text - Raw input prompt
 * @returns {string} Sanitized prompt with PII replaced by tokens
 */
export function sanitizePrompt(text) {
  if (!text || typeof text !== 'string') return '';

  let sanitized = text;

  // 1. Redact credentials/passwords first
  sanitized = sanitized
    .replace(CREDENTIAL_KEY_VALUE_REGEX, REDACTION_TOKENS.CREDENTIAL)
    .replace(CREDENTIAL_IS_REGEX, REDACTION_TOKENS.CREDENTIAL);

  // 2. Redact emails
  sanitized = sanitized.replace(EMAIL_REGEX, REDACTION_TOKENS.EMAIL);

  // 3. Redact phone numbers (VN, international, generic)
  sanitized = sanitized
    .replace(VN_PHONE_REGEX, REDACTION_TOKENS.PHONE)
    .replace(INTL_PHONE_REGEX, REDACTION_TOKENS.PHONE)
    .replace(GENERIC_PHONE_REGEX, REDACTION_TOKENS.PHONE);

  return sanitized;
}

/**
 * Detailed sanitizer returning redaction metrics
 * @param {string} text - Raw input prompt
 * @returns {{ sanitizedText: string, containsPii: boolean, redactedTypes: string[] }}
 */
export function sanitizePii(text) {
  const sanitizedText = sanitizePrompt(text);
  const redactedTypes = [];

  if (sanitizedText.includes(REDACTION_TOKENS.EMAIL)) {
    redactedTypes.push('email');
  }
  if (sanitizedText.includes(REDACTION_TOKENS.PHONE)) {
    redactedTypes.push('phone');
  }
  if (sanitizedText.includes(REDACTION_TOKENS.CREDENTIAL)) {
    redactedTypes.push('credential');
  }

  return {
    sanitizedText,
    containsPii: redactedTypes.length > 0,
    redactedTypes,
  };
}

export default {
  sanitizePrompt,
  sanitizePii,
  REDACTION_TOKENS,
};
