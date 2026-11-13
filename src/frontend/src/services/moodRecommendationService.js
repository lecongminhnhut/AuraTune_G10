/**
 * Mood & Context Recommendation API Service (Feature 103)
 * Connects Frontend UI to `/api/v1/recommendations/mood-context`.
 * Includes 5-minute in-memory cache (AF-01) and mock fallback toggle.
 */

import { apiFetch } from './sessionApiClient.js';
import {
  mockGetMoodContextTags,
  mockGetMoodContextRecommendations,
} from './mock/mockMoodRecommendationService.js';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const moodCache = new Map();

export function clearMoodCache() {
  moodCache.clear();
}

export function isMockMode() {
  return (
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_USE_MOCKS === 'true'
  );
}

/**
 * Retrieve the 8 curated preset tags taxonomy
 */
export async function getMoodContextTags() {
  if (isMockMode()) {
    return mockGetMoodContextTags();
  }

  try {
    const res = await apiFetch('/recommendations/mood-context/tags', {
      method: 'GET',
    });
    if (res.status === 401) {
      return {
        success: false,
        message: 'Yêu cầu đăng nhập để nhận gợi ý theo tâm trạng',
        data: null,
        error: { code: 'UNAUTHORIZED' },
      };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Backend getMoodContextTags failed, falling back to mock:', err.message);
    return mockGetMoodContextTags();
  }
}

/**
 * Retrieve recommendation stream for a mood/context tag
 * Supports client AbortController signal and in-memory cache (AF-01)
 */
export async function getMoodContextRecommendations(
  tag,
  { type = 'all', limit = 20, signal = null, bypassCache = false } = {}
) {
  const normTag = (tag || '').trim().toLowerCase();
  const cacheKey = `${normTag}:${type}:${limit}`;

  // Check 5-minute in-memory cache for instant switching (< 50ms)
  if (!bypassCache && moodCache.has(cacheKey)) {
    const cached = moodCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
    moodCache.delete(cacheKey);
  }

  if (isMockMode()) {
    const mockRes = await mockGetMoodContextRecommendations(normTag, { type, limit });
    if (mockRes.success) {
      moodCache.set(cacheKey, { data: mockRes, timestamp: Date.now() });
    }
    return mockRes;
  }

  try {
    const query = new URLSearchParams({ tag: normTag, type, limit: String(limit) });
    const res = await apiFetch(`/recommendations/mood-context?${query.toString()}`, {
      method: 'GET',
      signal,
    });

    if (res.status === 401) {
      return {
        success: false,
        message: 'Yêu cầu đăng nhập để nhận gợi ý theo tâm trạng',
        data: null,
        error: { code: 'UNAUTHORIZED' },
      };
    }

    const data = await res.json();
    if (data.success) {
      moodCache.set(cacheKey, { data, timestamp: Date.now() });
    }
    return data;
  } catch (err) {
    if (signal?.aborted || err.name === 'AbortError') {
      const abortError = new Error('Yêu cầu đã bị hủy');
      abortError.name = 'AbortError';
      throw abortError;
    }

    console.warn('Backend getMoodContextRecommendations failed, falling back to mock:', err.message);
    const fallbackRes = await mockGetMoodContextRecommendations(normTag, { type, limit });
    return fallbackRes;
  }
}

export default {
  getMoodContextTags,
  getMoodContextRecommendations,
  clearMoodCache,
  isMockMode,
};
