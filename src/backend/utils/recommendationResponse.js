/**
 * Response helper and envelope formatter for Feature 102: Personalized Recommendations
 * Enforces OpenAPI contract envelope: { success, message, data, error }
 * per specs/100-ai-recommendations/102-personalized-recommendations/contracts/personalized-recommendations-api.json
 */

export function formatRecommendationSuccess({
  userId,
  items = [],
  isFallback = false,
  fallbackReason = null,
  message = null,
  generatedAt = new Date().toISOString(),
}) {
  let defaultMessage = 'Danh sách gợi ý cá nhân hóa';
  if (isFallback) {
    if (fallbackReason === 'COLD_START' || fallbackReason === 'INSUFFICIENT_HISTORY' || fallbackReason === 'HISTORY_PURGED') {
      defaultMessage = 'Nội dung phổ biến trên AuraTune';
    } else if (fallbackReason === 'AI_SERVICE_UNAVAILABLE') {
      defaultMessage = 'Hiển thị nội dung thịnh hành do hệ thống gợi ý đang bảo trì';
    }
  }

  const envelopeMessage = message || defaultMessage;

  return {
    success: true,
    message: envelopeMessage,
    data: {
      user_id: userId,
      is_fallback: Boolean(isFallback),
      fallback_reason: fallbackReason,
      message: isFallback && fallbackReason === 'AI_SERVICE_UNAVAILABLE' ? envelopeMessage : message,
      generated_at: generatedAt,
      total_items: items.length,
      items,
    },
    error: null,
  };
}

export function formatRecommendationError(code, message, details = []) {
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
  formatRecommendationSuccess,
  formatRecommendationError,
};
