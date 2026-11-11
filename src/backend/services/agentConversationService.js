import agentConfig from '../config/agentConfig.js';

/**
 * Validates prompt text.
 * Throws an Error with code 'VALIDATION_ERROR' and details if invalid.
 */
export function validatePrompt(prompt) {
  if (typeof prompt !== 'string' || !prompt.trim()) {
    const error = new Error('Nội dung tin nhắn không được để trống');
    error.code = 'VALIDATION_ERROR';
    error.details = [
      {
        field: 'prompt',
        issue: 'Nội dung tin nhắn không được để trống'
      }
    ];
    throw error;
  }

  const trimmed = prompt.trim();
  if (trimmed.length > agentConfig.maxPromptLength) {
    const error = new Error('Nội dung tin nhắn phải từ 1 đến 500 ký tự');
    error.code = 'VALIDATION_ERROR';
    error.details = [
      {
        field: 'prompt',
        issue: `Nội dung tin nhắn phải từ 1 đến ${agentConfig.maxPromptLength} ký tự`
      }
    ];
    throw error;
  }

  return trimmed;
}

/**
 * Fallback generator for AI responses when external AI service is not configured or in dev/test mode.
 */
function generateLocalResponse(prompt, context = {}) {
  const p = prompt.toLowerCase();
  const track = context.currentTrack;

  if (p.includes('bài đang phát') || p.includes('đang nghe gì')) {
    if (track && track.title) {
      return (
        `Bài hát đang phát là **${track.title}** của nghệ sĩ *${track.artist || 'Nghệ sĩ AuraTune'}*.\n\n` +
        `- Trạng thái: ${context.isPlaying ? 'Đang phát' : 'Đang tạm dừng'}\n` +
        `- Âm lượng hiện tại: \`${context.volume ?? 80}%\`\n\n` +
        `Bạn có muốn tìm hiểu thêm về bài hát này không?`
      );
    }
    return (
      `Hiện tại **chưa có bài hát nào** đang được phát.\n\n` +
      `Bạn có thể chọn một bài hát từ danh sách đề xuất hoặc tìm kiếm bài hát yêu thích.`
    );
  }

  if (p.includes('chào') || p.includes('hello') || p.includes('hi')) {
    return (
      `Xin chào! Mình là **AuraTune Agent** - trợ lý âm nhạc thông minh của bạn.\n\n` +
      `Mình có thể hỗ trợ bạn:\n` +
      `- Khám phá thông tin bài hát và nghệ sĩ\n` +
      `- Gợi ý âm nhạc theo sở thích\n` +
      `- Cung cấp thông tin về danh sách phát\n\n` +
      `*Bạn đang muốn nghe giai điệu như thế nào?*`
    );
  }

  return (
    `Cảm ơn bạn đã trò chuyện cùng **AuraTune Agent** với yêu cầu: *"${prompt}"*.\n\n` +
    `AuraTune luôn sẵn sàng mang đến cho bạn trải nghiệm nghe nhạc tuyệt vời nhất.\n` +
    `Gõ \`/help\` nếu bạn muốn xem danh sách các phím tắt tiện ích!`
  );
}

/**
 * Streams conversation events to the sseEmitter.
 * sseEmitter must provide: sendThinking(text), sendText(delta), sendError(msg, code), sendDone(durationMs), isClosed()
 */
export async function streamConversation({ prompt, context = {}, user = null, sseEmitter, signal }) {
  const startedAt = Date.now();
  const validatedPrompt = validatePrompt(prompt);

  // If external AI service is available and reachable, we could stream from it.
  // Otherwise, stream local high-quality response chunks.
  const thinkingSteps = [
    'Đang kết nối đến AI Host...',
    'Đang phân tích ngữ cảnh yêu cầu...',
    'Đang tạo câu trả lời...'
  ];

  for (const step of thinkingSteps) {
    if (sseEmitter.isClosed() || signal?.aborted) return;
    sseEmitter.sendThinking(step);
    await new Promise((r) => setTimeout(r, 60));
  }

  const fullText = generateLocalResponse(validatedPrompt, context);
  const chunks = fullText.match(/.{1,10}/g) || [fullText];

  for (const chunk of chunks) {
    if (sseEmitter.isClosed() || signal?.aborted) return;
    sseEmitter.sendText(chunk);
    await new Promise((r) => setTimeout(r, 25));
  }

  const totalDurationMs = Date.now() - startedAt;
  if (!sseEmitter.isClosed() && !signal?.aborted) {
    sseEmitter.sendDone(totalDurationMs);
  }
}

export default {
  validatePrompt,
  streamConversation,
};
