import {
  isValidMoodTag,
  getTagCategory,
  getAlternativeSuggestions,
  DEFAULT_FALLBACK_SHORTCUTS,
} from '../constants/moodTaxonomy.js';
import * as defaultAiClient from '../clients/aiServiceClient.js';
import { hydrateMoodCandidates } from './moodCatalogHydrationService.js';
import * as moodCatalogRepo from '../repositories/moodCatalogRepository.js';

/**
 * Core Mood & Context Recommendation Service (Feature 103)
 * Orchestrates AI inference, catalog hydration, deduplication,
 * and resilient fallback degradation (FR-002, FR-003, FR-004, FR-014, EF-01).
 */
export async function getMoodRecommendationsService({
  tag,
  type = 'all',
  limit = 20,
  userId = null,
  aiClient = defaultAiClient,
} = {}) {
  const normalizedTag = (tag || '').trim().toLowerCase();

  if (!isValidMoodTag(normalizedTag)) {
    const error = new Error('Nhãn tâm trạng hoặc ngữ cảnh không hợp lệ');
    error.code = 'INVALID_MOOD_TAG';
    error.details = [
      'Tag must be one of: chill, energetic, melancholy, focus, study_work, workout, late_night, travel_commute',
    ];
    throw error;
  }

  const tagCategory = getTagCategory(normalizedTag);
  let candidates = [];
  let isServiceDegraded = false;
  let fallbackShortcuts = [];

  try {
    const aiResponse = await aiClient.getMoodRecommendations({
      tag: normalizedTag,
      type,
      limit,
      userId,
    });

    if (aiResponse && Array.isArray(aiResponse.candidates)) {
      candidates = aiResponse.candidates;
    } else {
      throw new Error('AI Service returned malformed response');
    }
  } catch (err) {
    // Graceful degradation per US3 & EF-01: catch AI timeout or 5xx error
    // Query local catalog playlists & songs as local fallback
    isServiceDegraded = true;
    fallbackShortcuts = [...DEFAULT_FALLBACK_SHORTCUTS];

    const localPlaylists = await moodCatalogRepo.getPublicMoodPlaylists(normalizedTag, limit);
    const localSongs = await moodCatalogRepo.getSongsByMoodTag(normalizedTag, limit);

    candidates = [
      ...localPlaylists.map((p) => ({ type: 'playlist', id: p.id, score: 0.9 })),
      ...localSongs.map((s) => ({ type: 'song', id: s.id, score: 0.85 })),
    ];
  }

  // Hydrate candidates & strictly filter to songs and playlists only (FR-003, FR-008, FR-014)
  let items = await hydrateMoodCandidates(candidates, {
    tag: normalizedTag,
    isServiceDegraded,
  });

  // Apply entity type filter if specified
  if (type && type !== 'all') {
    items = items.filter((item) => item.type === type);
  }

  // Limit final item count
  const safeLimit = Math.max(1, Math.min(50, parseInt(limit, 10) || 20));
  items = items.slice(0, safeLimit);

  // Alternative suggestions generator when matches count is 0 (US2 / AF-02)
  const alternativeSuggestions =
    items.length === 0 ? getAlternativeSuggestions(normalizedTag) : [];

  return {
    tag: normalizedTag,
    tag_category: tagCategory,
    is_service_degraded: isServiceDegraded,
    total_items: items.length,
    items,
    alternative_suggestions: alternativeSuggestions,
    fallback_shortcuts: fallbackShortcuts,
    generated_at: new Date().toISOString(),
  };
}

export default {
  getMoodRecommendationsService,
};
