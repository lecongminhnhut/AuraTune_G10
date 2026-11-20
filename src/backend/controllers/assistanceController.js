/**
 * Assistance Controller (Feature 123)
 * Handles POST /api/v1/agent/assistance/execute
 */

import { generateAssistancePlan } from '../services/musicAssistanceService.js';
import {
  formatAssistanceResponse,
  formatAssistanceError,
} from '../utils/assistanceResponse.js';
import { ASSISTANCE_ERROR_CODES } from '../constants/assistanceConstants.js';

export async function executeAssistancePlan(req, res) {
  const { intentType, extractedEntities, context } = req.body || {};

  // Validation per OpenAPI contract
  if (!intentType || typeof intentType !== 'string') {
    return res.status(400).json(
      formatAssistanceError(
        'Thuộc tính "intentType" là bắt buộc và phải là chuỗi ký tự',
        ASSISTANCE_ERROR_CODES.VALIDATION_ERROR,
        [{ field: 'intentType', message: 'Missing or invalid intentType' }]
      )
    );
  }

  if (!extractedEntities || typeof extractedEntities !== 'object') {
    return res.status(400).json(
      formatAssistanceError(
        'Thuộc tính "extractedEntities" là bắt buộc và phải là đối tượng',
        ASSISTANCE_ERROR_CODES.VALIDATION_ERROR,
        [{ field: 'extractedEntities', message: 'Missing or invalid extractedEntities' }]
      )
    );
  }

  // Cross-user permission & isolation guard (FR-011, SC-002)
  if (
    extractedEntities.targetOwnerId &&
    req.user &&
    extractedEntities.targetOwnerId !== req.user.id &&
    !extractedEntities.isCollaborative
  ) {
    return res.status(403).json(
      formatAssistanceError(
        'Bạn không có quyền chỉnh sửa tài nguyên của người dùng khác',
        ASSISTANCE_ERROR_CODES.FORBIDDEN,
        [{ field: 'targetOwnerId', message: 'Forbidden cross-tenant mutation' }]
      )
    );
  }

  try {
    const plan = await generateAssistancePlan({
      intentType,
      extractedEntities,
      context,
      user: req.user,
    });

    return res.status(200).json(formatAssistanceResponse(plan));
  } catch (error) {
    console.error('Assistance plan generation failed:', error);
    return res.status(503).json(
      formatAssistanceError(
        'Dịch vụ hỗ trợ âm nhạc thời gian thực hiện không khả dụng',
        ASSISTANCE_ERROR_CODES.DOWNSTREAM_SERVICE_UNAVAILABLE,
        [{ message: error.message }]
      )
    );
  }
}

export default {
  executeAssistancePlan,
};
