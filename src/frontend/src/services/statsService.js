import { apiFetch } from './sessionApiClient.js';
import { getMockListeningAnalysis } from './mock/mockStatsService.js';

export const isMockMode = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_USE_MOCKS === 'true') {
    return true;
  }
  return false;
};

/**
 * Retrieve personal listening history analysis for the authenticated user.
 * Connects to GET /api/v1/users/me/stats/listening-analysis?range=${range}
 * Fallback to mock adapter when VITE_USE_MOCKS=true or live backend unavailable.
 *
 * @param {'7' | '30' | 'all'} range
 * @param {object} [options]
 * @returns {Promise<import('../../types').ListeningAnalysisApiResponse>}
 */
export async function getListeningAnalysis(range = 'all', options = {}) {
  if (isMockMode()) {
    return getMockListeningAnalysis(range, options);
  }

  try {
    const query = new URLSearchParams({ range }).toString();
    const headers = options.token ? { Authorization: `Bearer ${options.token}` } : {};

    const res = await apiFetch(`/users/me/stats/listening-analysis?${query}`, {
      method: 'GET',
      headers,
    });

    const json = await res.json();
    return json;
  } catch (err) {
    console.warn('Backend listening-analysis API call failed, attempting mock fallback:', err.message);
    // If live call fails and options allow fallback or during offline mock dev:
    if (options.allowFallback !== false) {
      return getMockListeningAnalysis(range, options);
    }
    throw err;
  }
}

export default {
  getListeningAnalysis,
  isMockMode,
};
