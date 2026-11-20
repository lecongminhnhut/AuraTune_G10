import { getPersonalizedRecommendations as fetchRecommendations } from '../services/recommendationService.js';
import {
  formatRecommendationSuccess,
  formatRecommendationError,
} from '../utils/recommendationResponse.js';

const ALLOWED_TYPES = new Set(['all', 'song', 'album', 'artist', 'playlist']);

/**
 * GET /api/v1/recommendations/personalized
 */
export async function getPersonalizedRecommendations(req, res) {
  try {
    const userId = req.user?.user_id || req.user?.id;
    if (!userId) {
      return res.status(401).json(
        formatRecommendationError('UNAUTHORIZED', 'Yêu cầu đăng nhập để nhận gợi ý cá nhân hóa')
      );
    }

    const { type = 'all', limit = 20 } = req.query;

    if (!ALLOWED_TYPES.has(type)) {
      return res.status(400).json(
        formatRecommendationError('VALIDATION_ERROR', 'Giá trị tham số type không hợp lệ', [
          'type phải là một trong: all, song, album, artist, playlist',
        ])
      );
    }

    const parsedLimit = Number(limit);
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
      return res.status(400).json(
        formatRecommendationError('VALIDATION_ERROR', 'Giá trị tham số limit không hợp lệ', [
          'limit phải là số nguyên từ 1 đến 50',
        ])
      );
    }

    const result = await fetchRecommendations(userId, {
      type,
      limit: parsedLimit,
    });

    const responseEnvelope = formatRecommendationSuccess({
      userId: result.userId,
      items: result.items,
      isFallback: result.isFallback,
      fallbackReason: result.fallbackReason,
      message: result.message,
    });

    return res.status(200).json(responseEnvelope);
  } catch (error) {
    console.error('Error in getPersonalizedRecommendations:', error.message);
    return res.status(500).json(
      formatRecommendationError(
        'INTERNAL_ERROR',
        'Không thể xử lý yêu cầu gợi ý, vui lòng thử lại sau',
        [error.message]
      )
    );
  }
}

/**
 * GET /api/v1/recommendations/songs (Backward-Compatible Alias)
 */
export async function getRecommendedSongs(req, res) {
  req.query.type = 'song';
  return getPersonalizedRecommendations(req, res);
}

export default {
  getPersonalizedRecommendations,
  getRecommendedSongs,
};
