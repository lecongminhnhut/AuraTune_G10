/**
 * Envelope helper for Real-Time Music Assistance API (Feature 123)
 * Strictly conforms to contracts/real-time-music-assistance-api.json
 */

import { ASSISTANCE_ERROR_CODES } from '../constants/assistanceConstants.js';

/**
 * Formats a successful assistance plan response envelope
 * @param {object} data - AssistancePlanData
 * @param {string} [message] - Human-readable success message
 * @returns {object} Standard JSON response envelope
 */
export function formatAssistanceResponse(data, message = 'Assistance plan ready') {
  return {
    success: true,
    message,
    data: {
      planId: data.planId,
      clientActions: data.clientActions || [],
      embeddedWidget: data.embeddedWidget || null,
      confirmationText: data.confirmationText || '',
    },
    error: null,
  };
}

/**
 * Formats an assistance error response envelope
 * @param {string} message - Error description
 * @param {string} [code] - Error code
 * @param {Array<object>} [details] - Detailed error objects
 * @returns {object} Standard JSON error envelope
 */
export function formatAssistanceError(
  message,
  code = ASSISTANCE_ERROR_CODES.ACTION_EXECUTION_FAILED,
  details = []
) {
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
  formatAssistanceResponse,
  formatAssistanceError,
};
