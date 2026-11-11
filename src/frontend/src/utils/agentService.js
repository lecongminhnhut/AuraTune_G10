import { mockAgentStream } from './aiMockData.js';

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
  const useMocks =
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_USE_MOCKS === 'true';

  if (useMocks) {
    yield* mockAgentStream(prompt, { context, signal });
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

  const apiBase =
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.VITE_API_URL) ||
    '';
  const chatEndpoint = `${apiBase}/api/v1/agent/chat`;

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
        prompt,
        context: {
          currentTrack: context.currentTrack || null,
          isPlaying: Boolean(context.isPlaying),
          volume: typeof context.volume === 'number' ? context.volume : 80
        }
      }),
      signal
    });
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
};
