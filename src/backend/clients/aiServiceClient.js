import { aiConfig } from '../config/aiConfig.js';

/**
 * AI Microservice HTTP Client
 * Dispatches inference requests to internal Python AI Service with strict timeout
 */
export async function getRecommendations({
  userId,
  signals = {},
  requestedTypes = ['song', 'album', 'artist', 'playlist'],
  limit = 30,
  timeoutMs = aiConfig.aiServiceTimeoutMs,
  baseUrl = aiConfig.aiServiceUrl,
  fetchImpl = fetch,
} = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetchImpl(`${baseUrl}/ai/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': aiConfig.internalSecret,
      },
      body: JSON.stringify({
        user_id: userId,
        signals: {
          played_song_ids: signals.played_song_ids || [],
          liked_song_ids: signals.liked_song_ids || [],
          followed_artist_ids: signals.followed_artist_ids || [],
        },
        requested_types: requestedTypes,
        limit,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      const error = new Error(`AI Service returned HTTP ${response.status}: ${errorText}`);
      error.status = response.status;
      throw error;
    }

    const json = await response.json();
    return json;
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error(`AI Service request timed out after ${timeoutMs}ms`);
      timeoutError.name = 'TimeoutError';
      timeoutError.code = 'ETIMEDOUT';
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Dispatches mood/context recommendation requests to Python AI Service
 * (Feature 103, strictly 2.5s timeout)
 */
export async function getMoodRecommendations({
  tag,
  type = 'all',
  limit = 20,
  userId = null,
  timeoutMs = aiConfig.aiServiceTimeoutMs,
  baseUrl = aiConfig.aiServiceUrl,
  fetchImpl = fetch,
} = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetchImpl(`${baseUrl}/ai/recommend/mood`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': aiConfig.internalSecret,
      },
      body: JSON.stringify({
        user_id: userId,
        tag,
        type,
        limit,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      const error = new Error(`AI Service returned HTTP ${response.status}: ${errorText}`);
      error.status = response.status;
      throw error;
    }

    const json = await response.json();
    return json;
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error(`AI Service request timed out after ${timeoutMs}ms`);
      timeoutError.name = 'TimeoutError';
      timeoutError.code = 'ETIMEDOUT';
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export default {
  getRecommendations,
  getMoodRecommendations,
};
