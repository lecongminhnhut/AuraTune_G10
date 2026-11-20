/**
 * Intent Controller (Feature 122 - Music Intent Understanding)
 * Handles POST /api/v1/agent/intent/analyze
 * Enforces:
 * - 1-500 character validation (HTTP 400 VALIDATION_ERROR)
 * - User session isolation (FR-009)
 * - Returns standard MusicIntentResult envelope
 */

import { formatIntentResponse, formatIntentError } from '../utils/intentResponse.js';
import { analyzeIntent } from '../services/intentUnderstandingService.js';

export async function analyzeMusicIntent(req, res) {
  try {
    const { rawPrompt, context } = req.body || {};

    // Validate rawPrompt presence and string type
    if (!rawPrompt || typeof rawPrompt !== 'string' || !rawPrompt.trim()) {
      return res.status(400).json(
        formatIntentError('Nội dung tin nhắn không được để trống', 'VALIDATION_ERROR', [
          {
            field: 'rawPrompt',
            issue: 'Nội dung tin nhắn phải từ 1 đến 500 ký tự',
          },
        ])
      );
    }

    const trimmedPrompt = rawPrompt.trim();

    // Validate length 1-500 characters
    if (trimmedPrompt.length > 500) {
      return res.status(400).json(
        formatIntentError('Nội dung tin nhắn vượt quá độ dài cho phép', 'VALIDATION_ERROR', [
          {
            field: 'rawPrompt',
            issue: 'Nội dung tin nhắn phải từ 1 đến 500 ký tự',
          },
        ])
      );
    }

    // Call two-tier intent understanding service
    const intentResult = await analyzeIntent(trimmedPrompt, context);

    // Bind requestId with user ID context if available (FR-009)
    const userId = req.user?.id || 'anon';
    const enrichedResult = {
      ...intentResult,
      requestId: `req-intent-${userId}-${Date.now()}`,
    };

    return res.status(200).json(
      formatIntentResponse(enrichedResult, 'Intent analysis completed successfully')
    );
  } catch (error) {
    console.error('Intent analysis error:', error);
    return res.status(503).json(
      formatIntentError('Dịch vụ nhận diện ý định tạm thời không khả dụng', 'AI_SERVICE_UNAVAILABLE', [
        { issue: error.message },
      ])
    );
  }
}

export default {
  analyzeMusicIntent,
};
