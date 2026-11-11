/**
 * SSE Response Helpers for AuraTune AI Conversational Agent (Feature 121)
 * Enforces W3C Server-Sent Events format and contracts/conversational-interface-api.json schema
 */

export function initSSEResponse(res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  if (typeof res.flushHeaders === 'function') {
    res.flushHeaders();
  }
}

export function formatSSEEvent(event, data) {
  const payload = typeof data === 'string' ? data : JSON.stringify(data);
  return `event: ${event}\ndata: ${payload}\n\n`;
}

export function createSSEResponse(res) {
  initSSEResponse(res);

  let closed = false;

  res.on('close', () => {
    closed = true;
  });

  const send = (event, data) => {
    if (closed || res.writableEnded) return false;
    res.write(formatSSEEvent(event, data));
    return true;
  };

  return {
    isClosed: () => closed || res.writableEnded,
    sendThinking: (text) => send('thinking', { type: 'thinking', text }),
    sendText: (delta) => send('text', { type: 'text', delta }),
    sendError: (message, code = 'AI_SERVICE_UNAVAILABLE') => {
      send('error', { type: 'error', message, code });
    },
    sendDone: (totalDurationMs) => {
      send('done', { type: 'done', totalDurationMs });
      if (!res.writableEnded) {
        res.end();
      }
    },
    end: () => {
      if (!res.writableEnded) {
        res.end();
      }
    }
  };
}

export default {
  initSSEResponse,
  formatSSEEvent,
  createSSEResponse,
};
