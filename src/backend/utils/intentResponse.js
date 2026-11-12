/**
 * Envelope helper for Music Intent Understanding API (Feature 122)
 * Strictly conforms to contracts/music-intent-understanding-api.json
 */

/**
 * Formats a successful response envelope
 * @param {object} data - MusicIntentResultData payload
 * @param {string} [message] - Human-readable success message
 * @returns {object} Standard JSON response envelope
 */
export function formatIntentResponse(data, message = 'Intent analysis completed successfully') {
  return {
    success: true,
    message,
    data,
    error: null,
  };
}

/**
 * Formats an error response envelope
 * @param {string} message - Error description
 * @param {string} [code] - Error code (e.g. VALIDATION_ERROR, UNAUTHORIZED, AI_SERVICE_UNAVAILABLE)
 * @param {Array<object>} [details] - Additional error details
 * @returns {object} Standard JSON error envelope
 */
export function formatIntentError(message, code = 'VALIDATION_ERROR', details = []) {
  return {
    success: false,
    message,
    data: null,
    error: {
      code,
      details,
    },
  };
}

export default {
  formatIntentResponse,
  formatIntentError,
};
