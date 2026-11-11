/**
 * Envelope response formatters for Mood and Context Recommendations (Feature 103)
 * Conforms strictly to OpenAPI schema in contracts/mood-context-recommendations-api.json
 */

export function successMoodResponse({
  tag,
  tagCategory,
  items = [],
  isServiceDegraded = false,
  alternativeSuggestions = [],
  fallbackShortcuts = [],
  message = null,
} = {}) {
  const defaultMessage = isServiceDegraded
    ? 'Dịch vụ gợi ý tâm trạng tạm thời không phản hồi'
    : items.length > 0
    ? `Gợi ý âm nhạc theo ${tagCategory === 'context' ? 'ngữ cảnh' : 'tâm trạng'} ${tag}`
    : 'Hiện chưa có bài hát phù hợp với tâm trạng này';

  const data = {
    tag,
    tag_category: tagCategory,
    is_service_degraded: Boolean(isServiceDegraded),
    total_items: items.length,
    items,
    alternative_suggestions: alternativeSuggestions || [],
    generated_at: new Date().toISOString(),
  };

  if (isServiceDegraded && Array.isArray(fallbackShortcuts) && fallbackShortcuts.length > 0) {
    data.fallback_shortcuts = fallbackShortcuts;
  }

  return {
    success: true,
    message: message || defaultMessage,
    data,
    error: null,
  };
}

export function tagsResponse(tags, message = 'Danh sách nhãn tâm trạng và ngữ cảnh') {
  return {
    success: true,
    message,
    data: {
      tags,
    },
    error: null,
  };
}

export function errorMoodResponse({
  code = 'INVALID_MOOD_TAG',
  message = 'Nhãn tâm trạng hoặc ngữ cảnh không hợp lệ',
  details = [],
} = {}) {
  return {
    success: false,
    message,
    data: null,
    error: {
      code,
      details: Array.isArray(details) ? details : [details],
    },
  };
}

export default {
  successMoodResponse,
  tagsResponse,
  errorMoodResponse,
};
