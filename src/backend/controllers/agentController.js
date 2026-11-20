import { createSSEResponse } from '../utils/sseResponse.js';
import { streamConversation, validatePrompt } from '../services/agentConversationService.js';
import agentConfig from '../config/agentConfig.js';

/**
 * GET /api/v1/agent/health
 * Returns service status conforming to OpenAPI contract
 */
export async function getAgentHealth(req, res) {
  const start = Date.now();
  // Simulating lightweight latency probe
  const latencyMs = Math.min(50, Math.max(5, Date.now() - start + 5));

  return res.status(200).json({
    success: true,
    message: 'AI Host is online',
    data: {
      status: agentConfig.defaultStatus,
      latencyMs
    },
    error: null
  });
}

/**
 * POST /api/v1/agent/chat
 * Streams thinking steps and markdown delta chunks via SSE
 */
export async function streamAgentChat(req, res) {
  const { prompt, context = {} } = req.body || {};

  // Input validation
  try {
    validatePrompt(prompt);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Nội dung tin nhắn không hợp lệ',
      data: null,
      error: {
        code: err.code || 'VALIDATION_ERROR',
        details: err.details || [
          {
            field: 'prompt',
            issue: err.message
          }
        ]
      }
    });
  }

  // Check if AI service is suspended/unavailable
  if (agentConfig.defaultStatus === 'unavailable') {
    return res.status(503).json({
      success: false,
      message: 'AI Host tạm thời không khả dụng. Vui lòng thử lại sau.',
      data: null,
      error: {
        code: 'AI_SERVICE_UNAVAILABLE',
        details: []
      }
    });
  }

  // Initialize SSE stream
  const sseEmitter = createSSEResponse(res);

  const abortController = new AbortController();
  req.on('close', () => {
    abortController.abort();
  });

  // Timeout guard (15s)
  const timeoutId = setTimeout(() => {
    if (!sseEmitter.isClosed()) {
      sseEmitter.sendError('Yêu cầu xử lý quá thời gian quy định (15s)', 'AI_SERVICE_TIMEOUT');
      sseEmitter.end();
    }
  }, agentConfig.agentTimeoutMs);

  try {
    await streamConversation({
      prompt,
      context,
      user: req.user,
      sseEmitter,
      signal: abortController.signal
    });
  } catch (streamError) {
    if (!sseEmitter.isClosed()) {
      sseEmitter.sendError(streamError.message || 'Lỗi xử lý luồng AI Host', 'AI_SERVICE_ERROR');
      sseEmitter.end();
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

export default {
  getAgentHealth,
  streamAgentChat,
};
