/**
 * Compound Clause Decomposition Service (Feature 122 - FR-005)
 * Decomposes multi-clause user prompts connected by Vietnamese conjunctions
 * ('rồi', 'sau đó', 'tiếp theo', ',', ';') into sequential clause strings.
 */

import { CLAUSE_DELIMITERS_REGEX } from '../constants/intentConstants.js';

/**
 * Splits a compound prompt into sequential raw clause texts
 * @param {string} prompt - Raw or sanitized user prompt
 * @returns {string[]} Array of non-empty trimmed clause strings
 */
export function splitPromptIntoClauses(prompt) {
  if (!prompt || typeof prompt !== 'string') return [];

  const trimmed = prompt.trim();
  if (!trimmed) return [];

  // Split using conjunction delimiters
  const segments = trimmed
    .split(CLAUSE_DELIMITERS_REGEX)
    .map((s) => s.replace(/^(?:rồi|sau đó|tiếp theo)\s+/i, '').trim())
    .filter((s) => s.length > 0);

  return segments.length > 0 ? segments : [trimmed];
}

export default {
  splitPromptIntoClauses,
};
