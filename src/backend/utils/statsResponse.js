/**
 * Response helper and envelope formatter for Feature 101: Listening History Analysis
 * Enforces OpenAPI contract envelope: { success, message, data, error }
 */

export function formatSuccessResponse(data, message = 'Listening analysis retrieved successfully') {
  return {
    success: true,
    message,
    data,
    error: null,
  };
}

export function formatInsufficientDataResponse(userId, range = 'all', calculatedAt = new Date().toISOString()) {
  return {
    success: true,
    message: 'Insufficient listening history for analysis',
    data: {
      userId,
      range,
      hasSufficientData: false,
      totalDurationSeconds: 0,
      formattedTotalDuration: '0 phút',
      totalPlays: 0,
      uniqueTracksCount: 0,
      topGenres: [],
      calculatedAt,
    },
    error: null,
  };
}

export function formatErrorResponse(code, message, details = []) {
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
