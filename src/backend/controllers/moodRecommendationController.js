import { PRESET_TAGS, isValidMoodTag } from '../constants/moodTaxonomy.js';
import { tagsResponse, successMoodResponse, errorMoodResponse } from '../utils/moodResponse.js';
import { getMoodRecommendationsService } from '../services/moodRecommendationService.js';

/**
 * Mood & Context Recommendations Controller (Feature 103)
 */

export async function getMoodContextTags(req, res) {
  return res.status(200).json(tagsResponse(PRESET_TAGS));
}

export async function getMoodContextRecommendations(req, res) {
  const rawTag = req.query.tag;
  const rawType = req.query.type || 'all';
  const rawLimit = req.query.limit;

  // Tag is mandatory and must belong to the 8 preset tags (FR-002, SC-003)
  if (!rawTag || !isValidMoodTag(rawTag)) {
    return res.status(400).json(
      errorMoodResponse({
        code: 'INVALID_MOOD_TAG',
        message: 'Nhãn tâm trạng hoặc ngữ cảnh không hợp lệ',
        details: [
          'Tag must be one of: chill, energetic, melancholy, focus, study_work, workout, late_night, travel_commute',
        ],
      })
    );
  }

  const validTypes = ['all', 'song', 'playlist'];
  const type = validTypes.includes(rawType) ? rawType : 'all';

  let limit = 20;
  if (rawLimit !== undefined) {
    const parsed = parseInt(rawLimit, 10);
    if (!Number.isNaN(parsed)) {
      limit = Math.max(1, Math.min(50, parsed));
    }
  }

  try {
    const serviceResult = await getMoodRecommendationsService({
      tag: rawTag,
      type,
      limit,
      userId: req.user?.id || req.user?.user_id || null,
    });

    return res.status(200).json(
      successMoodResponse({
        tag: serviceResult.tag,
        tagCategory: serviceResult.tag_category,
        items: serviceResult.items,
        isServiceDegraded: serviceResult.is_service_degraded,
        alternativeSuggestions: serviceResult.alternative_suggestions,
        fallbackShortcuts: serviceResult.fallback_shortcuts,
      })
    );
  } catch (error) {
    if (error.code === 'INVALID_MOOD_TAG') {
      return res.status(400).json(
        errorMoodResponse({
          code: error.code,
          message: error.message,
          details: error.details,
        })
      );
    }

    // Unexpected internal errors
    return res.status(500).json({
      success: false,
      message: 'Lỗi nội bộ khi tạo gợi ý tâm trạng',
      data: null,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        details: [error.message],
      },
    });
  }
}

export default {
  getMoodContextTags,
  getMoodContextRecommendations,
};
