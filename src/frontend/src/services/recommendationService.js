import { apiFetch } from './sessionApiClient.js';
import { getMockPersonalizedRecommendations } from './mock/mockRecommendationService.js';

export const isMockMode = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_USE_MOCKS === 'true') {
    return true;
  }
  return false;
};

/**
 * Retrieve personalized recommendations for the current authenticated user.
 * Connects to GET /api/v1/recommendations/personalized?type=${type}&limit=${limit}
 * Dynamically switches to mock adapter when VITE_USE_MOCKS=true or offline fallback.
 *
 * @param {object} [params]
 * @param {'all' | 'song' | 'album' | 'artist' | 'playlist'} [params.type='all']
 * @param {number} [params.limit=20]
 * @param {string} [params.token]
 * @param {boolean} [params.allowFallback=true]
 * @param {object} [params.options]
 * @returns {Promise<object>}
 */
export async function getPersonalizedRecommendations({
  type = 'all',
  limit = 20,
  token = null,
  allowFallback = true,
  options = {},
} = {}) {
  if (isMockMode()) {
    return getMockPersonalizedRecommendations({ type, limit, options });
  }

  try {
    const params = new URLSearchParams();
    if (type && type !== 'all') params.append('type', type);
    if (limit) params.append('limit', String(limit));

    const queryString = params.toString();
    const endpoint = `/recommendations/personalized${queryString ? `?${queryString}` : ''}`;

    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await apiFetch(endpoint, {
      method: 'GET',
      headers,
    });

    const json = await res.json();
    return json;
  } catch (err) {
    console.warn('Backend recommendation API call failed, attempting mock fallback:', err.message);
    if (allowFallback !== false) {
      return getMockPersonalizedRecommendations({ type, limit, options });
    }
    throw err;
  }
}

/**
 * Convenience method for requesting only recommended songs
 */
export async function getRecommendedSongs({ limit = 20, token = null, options = {} } = {}) {
  return getPersonalizedRecommendations({ type: 'song', limit, token, options });
}

export default {
  getPersonalizedRecommendations,
  getRecommendedSongs,
  isMockMode,
};
