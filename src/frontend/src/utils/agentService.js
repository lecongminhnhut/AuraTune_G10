import { mockAgentStream } from './aiMockData.js';
import { sanitizeClientPrompt } from './piiSanitizer.js';

/**
 * Splits compound prompt into clauses at client edge (FR-005)
 */
export function splitClauses(prompt) {
  if (!prompt || typeof prompt !== 'string') return [];
  const delimiterRegex = /\s*(?:[,;]\s*(?:rồi|sau đó|tiếp theo)?|\s+rồi\s+|\s+sau đó\s+|\s+tiếp theo\s+)\s*/i;
  const segments = prompt
    .trim()
    .split(delimiterRegex)
    .map((s) => s.replace(/^(?:rồi|sau đó|tiếp theo)\s+/i, '').trim())
    .filter(Boolean);
  return segments.length > 0 ? segments : [prompt.trim()];
}

/**
 * Tier-2 client-side deterministic rule matcher for a single clause
 * (FR-002, FR-003, FR-004, FR-010)
 */
export function planClause(clauseText, context = {}) {
  const sanitized = sanitizeClientPrompt(clauseText || '').trim();
  const lower = sanitized.toLowerCase();

  const currentVolume = typeof context?.volume === 'number' ? context.volume : 50;

  const slots = {
    songTitle: null,
    artistName: null,
    albumTitle: null,
    genre: null,
    mood: null,
    activity: null,
    lyricsSnippet: null,
    controlAction: null,
    volumeLevel: null,
    playlistName: null,
    targetTrackId: null,
  };

  // Direct controls
  if (/^(?:tạm dừng|dừng lại|pause|stop|ngưng nhạc|tắt nhạc)(?:\s+lại)?(?:\s+nhạc|\s+bài)?$/i.test(lower)) {
    slots.controlAction = 'pause';
    return {
      intentType: 'play_music',
      confidenceScore: 0.95,
      completenessStatus: 'complete',
      extractedEntities: slots,
      suggestedAction: 'real_time_assistance',
    };
  }

  if (/^(?:tiếp tục|resume|phát tiếp|chơi tiếp)(?:\s+nhạc|\s+bài)?$/i.test(lower)) {
    slots.controlAction = 'resume';
    return {
      intentType: 'play_music',
      confidenceScore: 0.95,
      completenessStatus: 'complete',
      extractedEntities: slots,
      suggestedAction: 'real_time_assistance',
    };
  }

  if (/^(?:chuyển bài|tiếp theo|next|qua bài|bài tiếp|bỏ qua|skip)(?:\s+khác)?$/i.test(lower)) {
    slots.controlAction = 'next';
    return {
      intentType: 'play_music',
      confidenceScore: 0.95,
      completenessStatus: 'complete',
      extractedEntities: slots,
      suggestedAction: 'real_time_assistance',
    };
  }

  if (/^(?:quay lại|previous|prev|bài trước|lui lại)$/i.test(lower)) {
    slots.controlAction = 'previous';
    return {
      intentType: 'play_music',
      confidenceScore: 0.95,
      completenessStatus: 'complete',
      extractedEntities: slots,
      suggestedAction: 'real_time_assistance',
    };
  }

  // Volume controls
  const volExplicit = /(?:âm lượng|volume)\s*(?:về|thành|lên|xuống)?\s*(\d{1,3})%?/i.exec(sanitized);
  if (volExplicit) {
    slots.controlAction = 'set_volume';
    slots.volumeLevel = Math.min(100, Math.max(0, parseInt(volExplicit[1], 10)));
    return {
      intentType: 'play_music',
      confidenceScore: 0.95,
      completenessStatus: 'complete',
      extractedEntities: slots,
      suggestedAction: 'real_time_assistance',
    };
  }

  if (/(?:giảm âm lượng|nhỏ lại|cho nhỏ lại|bật nhỏ|bé hơn|giảm volume)/i.test(sanitized)) {
    slots.controlAction = 'set_volume';
    slots.volumeLevel = Math.max(0, currentVolume - 20);
    return {
      intentType: 'play_music',
      confidenceScore: 0.92,
      completenessStatus: 'complete',
      extractedEntities: slots,
      suggestedAction: 'real_time_assistance',
    };
  }

  if (/(?:tăng âm lượng|to lên|cho to lên|bật to|lớn hơn|tăng volume)/i.test(sanitized)) {
    slots.controlAction = 'set_volume';
    slots.volumeLevel = Math.min(100, currentVolume + 20);
    return {
      intentType: 'play_music',
      confidenceScore: 0.92,
      completenessStatus: 'complete',
      extractedEntities: slots,
      suggestedAction: 'real_time_assistance',
    };
  }

  // Current track query (FR-004)
  if (/(?:bài (?:này|đang phát|đang nghe|gì đây|gì thế)|tên bài (?:này|hát)|ai đang hát|đây là bài gì)/i.test(sanitized)) {
    if (context?.currentTrack) {
      slots.targetTrackId = context.currentTrack.id || null;
      slots.songTitle = context.currentTrack.title || null;
      slots.artistName = context.currentTrack.artist || null;
    }
    return {
      intentType: 'query_music_info',
      confidenceScore: 0.92,
      completenessStatus: 'complete',
      extractedEntities: slots,
      suggestedAction: 'dialogue_response',
    };
  }

  // Moods & discovery
  const moodMatch = sanitized.match(/\b(chill|thư giãn|lofi|tập trung|buồn|vui|sôi động|lãng mạn|relax)\b/i);
  if (moodMatch) {
    slots.mood = moodMatch[1].toLowerCase();
  }

  const activityMatch = sanitized.match(/\b(học bài|làm việc|chạy bộ|tập gym|đi ngủ|đọc sách)(?:\s+đêm(?:\s+khuya)?)?\b/i);
  if (activityMatch) {
    slots.activity = activityMatch[0].toLowerCase();
    if (/đêm|khuya/i.test(sanitized) && !slots.activity.includes('đêm')) {
      slots.activity += ' đêm khuya';
    }
  }

  // Lyrics snippet
  const lyricsMatch = /(?:lời bài hát|lời có câu|lời là|có câu hát|có đoạn|ca từ)\s*[:"']?([^"']+)["']?/i.exec(sanitized);
  if (lyricsMatch) {
    slots.lyricsSnippet = lyricsMatch[1].trim();
  }

  // Album search
  const albumMatch = /(?:tìm|kiếm)\s+album\s+(.+?)(?:\s+của\s+(.+))?$/i.exec(sanitized);
  if (albumMatch) {
    slots.albumTitle = albumMatch[1].trim();
    if (albumMatch[2]) {
      slots.artistName = albumMatch[2].trim();
    }
  }

  // Explicit search song title
  const searchSongMatch = /^(?:tìm|tìm kiếm|kiếm)\s+(?:bài hát|bài)\s+(.+)/i.exec(sanitized);
  if (searchSongMatch && !slots.lyricsSnippet && !slots.mood && !slots.activity) {
    slots.songTitle = searchSongMatch[1].trim();
  }

  if (/^(?:tìm|tìm kiếm|search|gợi ý|recommend|cho mình mấy bài|muốn nghe)/i.test(sanitized)) {
    return {
      intentType: 'search_music',
      confidenceScore: 0.92,
      completenessStatus: 'complete',
      extractedEntities: slots,
      suggestedAction: slots.mood || slots.activity ? 'recommendation_service' : 'search_service',
    };
  }

  // General Chit-chat
  if (/(?:thời tiết|ăn gì|chào bạn|hello|(?:^|\s+)hi(?:\s+|$|[!?,])|bạn là ai|mấy giờ|hôm nay thế nào)/i.test(sanitized)) {
    return {
      intentType: 'general_chitchat',
      confidenceScore: 0.95,
      completenessStatus: 'complete',
      extractedEntities: slots,
      suggestedAction: 'dialogue_response',
    };
  }

  // Song title and artist
  const playPrefixMatch = /^(?:bật|phát|mở|nghe|chơi)\s+(?:bài|bài hát)?\s*/i.exec(sanitized);
  if (playPrefixMatch) {
    const afterPrefix = sanitized.slice(playPrefixMatch[0].length).trim();
    const lastCuaIndex = afterPrefix.toLowerCase().lastIndexOf(' của ');
    if (lastCuaIndex !== -1) {
      const candidateTitle = afterPrefix.slice(0, lastCuaIndex).trim().replace(/^bài\s+/i, '');
      const candidateArtist = afterPrefix.slice(lastCuaIndex + 5).trim().replace(/^(?:ca sĩ|nghệ sĩ)\s+/i, '');
      if (candidateTitle && candidateArtist) {
        slots.songTitle = candidateTitle;
        slots.artistName = candidateArtist;
        slots.controlAction = 'play';
        return {
          intentType: 'play_music',
          confidenceScore: 0.95,
          completenessStatus: 'complete',
          extractedEntities: slots,
          suggestedAction: 'real_time_assistance',
        };
      }
    }
  }

  const titleAndArtist = /(?:bật|phát|mở|nghe|chơi)\s+(?:bài|bài hát)?\s*(.+?)\s+của\s+(.+)/i.exec(sanitized);
  if (titleAndArtist) {
    slots.songTitle = titleAndArtist[1].trim().replace(/^bài\s+/i, '');
    slots.artistName = titleAndArtist[2].trim();
    slots.controlAction = 'play';
    return {
      intentType: 'play_music',
      confidenceScore: 0.95,
      completenessStatus: 'complete',
      extractedEntities: slots,
      suggestedAction: 'real_time_assistance',
    };
  }

  const titleOnly = /(?:bật|phát|mở|nghe|chơi)\s+(?:bài|bài hát)\s+(.+)/i.exec(sanitized);
  if (titleOnly && !moodMatch) {
    slots.songTitle = titleOnly[1].trim();
    slots.controlAction = 'play';
    return {
      intentType: 'play_music',
      confidenceScore: 0.93,
      completenessStatus: 'complete',
      extractedEntities: slots,
      suggestedAction: 'real_time_assistance',
    };
  }

  const artistOnly = /(?:bật|phát|mở|nghe|chơi)\s+(?:nhạc|ca sĩ)\s+(.+)/i.exec(sanitized);
  if (artistOnly && !moodMatch && !/nhạc\s*(?:lên|đi)?$/i.test(artistOnly[1])) {
    slots.artistName = artistOnly[1].trim();
    slots.controlAction = 'play';
    return {
      intentType: 'play_music',
      confidenceScore: 0.92,
      completenessStatus: 'complete',
      extractedEntities: slots,
      suggestedAction: 'real_time_assistance',
    };
  }

  // Vague playback (FR-005)
  if (/^(?:phát|bật|chơi|play|mở|nghe)\s*(?:nhạc\s+lên|nhạc\s+đi|nhạc|bài\s+hát|gì\s+đó|lên|đi)?$/i.test(sanitized)) {
    return {
      intentType: 'play_music',
      confidenceScore: 0.88,
      completenessStatus: 'missing_parameters',
      extractedEntities: slots,
      suggestedAction: 'real_time_assistance',
      inferredDefaults: { default_source: 'personalized_or_trending' },
    };
  }

  if (slots.mood || slots.activity) {
    return {
      intentType: 'search_music',
      confidenceScore: 0.88,
      completenessStatus: 'complete',
      extractedEntities: slots,
      suggestedAction: 'recommendation_service',
    };
  }

  return {
    intentType: 'unknown',
    confidenceScore: 0.4,
    completenessStatus: 'ambiguous',
    extractedEntities: slots,
    suggestedAction: 'unrecognized_fallback',
  };
}

/**
 * Parses raw SSE text chunk into an array of parsed event objects
 */
function parseSSEChunks(chunkText) {
  const events = [];
  const rawEvents = chunkText.split('\n\n');

  for (const raw of rawEvents) {
    if (!raw.trim()) continue;
    const lines = raw.split('\n');
    let eventType = 'message';
    let dataStr = '';

    for (const line of lines) {
      if (line.startsWith('event:')) {
        eventType = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        dataStr = line.slice(5).trim();
      }
    }

    if (dataStr) {
      try {
        const parsed = JSON.parse(dataStr);
        events.push({ eventType, data: parsed });
      } catch {
        events.push({ eventType, data: { type: eventType, text: dataStr } });
      }
    }
  }

  return events;
}

/**
 * Main agent runner connecting to backend SSE endpoint with fallback to mock data
 */
export async function* runAgent(prompt, { context = {}, signal } = {}) {
  // Edge PII sanitization (FR-008, SC-003)
  const sanitizedPrompt = sanitizeClientPrompt(prompt);

  const useMocks =
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_USE_MOCKS === 'true';

  if (useMocks) {
    yield* mockAgentStream(sanitizedPrompt, { context, signal });
    return;
  }

  // Determine token from context or storage
  const token =
    context?.token ||
    context?.user?.token ||
    context?.store?.session?.token ||
    (typeof localStorage !== 'undefined' &&
      JSON.parse(localStorage.getItem('auratune_session') || '{}')?.token) ||
    '';

  const rawApiUrl =
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL)) ||
    '';
  const cleanApiBase = rawApiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');
  const chatEndpoint = cleanApiBase ? `${cleanApiBase}/api/v1/agent/chat` : '/api/v1/agent/chat';

  let response;
  try {
    response = await fetch(chatEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        prompt: sanitizedPrompt,
        context: {
          currentTrack: context.currentTrack || null,
          isPlaying: Boolean(context.isPlaying),
          volume: typeof context.volume === 'number' ? context.volume : 80
        }
      }),
      signal
    });

    // If 404 on relative path, attempt direct localhost:5000 fallback
    if (response.status === 404 && !cleanApiBase) {
      const directEndpoint = 'http://localhost:5000/api/v1/agent/chat';
      const retryRes = await fetch(directEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          prompt: sanitizedPrompt,
          context: {
            currentTrack: context.currentTrack || null,
            isPlaying: Boolean(context.isPlaying),
            volume: typeof context.volume === 'number' ? context.volume : 80
          }
        }),
        signal
      });
      if (retryRes.ok) {
        response = retryRes;
      }
    }
  } catch (err) {
    if (signal?.aborted || err.name === 'AbortError') {
      const abortError = new Error('Đã dừng');
      abortError.name = 'AbortError';
      throw abortError;
    }

    // If fetch failed due to offline/mock environment, fallback to mockAgentStream
    console.warn('Backend SSE fetch failed, falling back to mock generator:', err.message);
    yield* mockAgentStream(prompt, { context, signal });
    return;
  }

  if (!response.ok) {
    // If backend 401 (unauthenticated/expired session), 404 or 503,
    // seamlessly fallback to local assistant generator for uninterrupted music experience (Zero Audio Disruption Invariant)
    if (response.status === 401 || response.status === 403 || response.status === 404 || response.status === 503) {
      console.warn(`Backend chat endpoint responded with HTTP ${response.status}. Seamlessly falling back to local assistant generator.`);
      yield* mockAgentStream(prompt, { context, signal });
      return;
    }

    let errorMessage = `Lỗi máy chủ (${response.status})`;
    try {
      const errorJson = await response.json();
      errorMessage = errorJson.message || errorMessage;
    } catch {
      // ignore
    }
    yield { type: 'error', message: errorMessage };
    return;
  }

  if (!response.body) {
    yield* mockAgentStream(prompt, { context, signal });
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      if (signal?.aborted) {
        await reader.cancel();
        break;
      }

      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lastDoubleNewline = buffer.lastIndexOf('\n\n');

      if (lastDoubleNewline !== -1) {
        const completeChunk = buffer.slice(0, lastDoubleNewline + 2);
        buffer = buffer.slice(lastDoubleNewline + 2);

        const events = parseSSEChunks(completeChunk);
        for (const ev of events) {
          if (signal?.aborted) break;
          yield ev.data;
        }
      }
    }

    if (buffer.trim()) {
      const remainingEvents = parseSSEChunks(buffer);
      for (const ev of remainingEvents) {
        if (signal?.aborted) break;
        yield ev.data;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export default {
  runAgent,
  splitClauses,
  planClause,
};
