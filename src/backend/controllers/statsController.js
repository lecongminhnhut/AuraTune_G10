import { calculateListeningAnalysis } from '../services/listeningAnalysisService.js';
import { formatSuccessResponse, formatErrorResponse } from '../utils/statsResponse.js';

/**
 * Controller handler for GET /api/v1/users/me/stats/listening-analysis (T013, T020)
 */
export async function getListeningAnalysis(req, res) {
  try {
    // Strictly extract userId from authenticated JWT token (FR-005, FR-006)
    const userId = req.user?.user_id || req.user?.id;
    if (!userId) {
      return res.status(401).json(
        formatErrorResponse('UNAUTHORIZED', 'Yêu cầu đăng nhập để truy cập thông tin phân tích')
      );
    }

    const rawRange = req.query?.range;
    const range = ['7', '30', 'all'].includes(rawRange) ? rawRange : 'all';

    const analysisData = await calculateListeningAnalysis(userId, range);

    const message = analysisData.hasSufficientData
      ? 'Listening analysis retrieved successfully'
      : 'Insufficient listening history for analysis';

    return res.status(200).json(formatSuccessResponse(analysisData, message));
  } catch (error) {
    console.error('Error calculating listening analysis:', error.message);
    return res.status(500).json(
      formatErrorResponse(
        'DATABASE_ERROR',
        'Thông tin phân tích tạm thời không khả dụng, vui lòng thử lại sau',
        []
      )
    );
  }
}
