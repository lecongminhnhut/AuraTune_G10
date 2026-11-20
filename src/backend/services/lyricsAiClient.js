export class LyricsAiError extends Error {
  constructor(message, { status = 0, code = 'INTERNAL_ERROR', details = [] } = {}) {
    super(message); this.name = 'LyricsAiError'; this.status = status; this.code = code; this.details = details
  }
}

export async function searchLyricsWithAi(payload, { signal, timeoutMs = 3000, fetchImpl = fetch } = {}) {
  const timeout = new AbortController()
  const timer = setTimeout(() => timeout.abort(), timeoutMs)
  const onAbort = () => timeout.abort()
  signal?.addEventListener('abort', onAbort, { once: true })
  try {
    const serviceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000'
    const internalApiKey = process.env.INTERNAL_API_KEY || ''
    const response = await fetchImpl(`${serviceUrl}/ai/search/lyrics`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Internal-Api-Key': internalApiKey }, body: JSON.stringify(payload), signal: timeout.signal })
    let body = null
    try { body = await response.json() } catch { body = null }
    if (!response.ok) throw new LyricsAiError(body?.message || 'AI lyrics search failed.', { status: response.status, code: body?.error?.code || (response.status === 503 ? 'AI_SERVICE_UNAVAILABLE' : response.status === 429 ? 'RATE_LIMITED' : 'INTERNAL_ERROR'), details: body?.error?.details || [] })
    return body
  } catch (error) {
    if (error.name === 'AbortError') throw new LyricsAiError('AI lyrics search timed out.', { status: 503, code: 'AI_SERVICE_UNAVAILABLE' })
    if (error instanceof LyricsAiError) throw error
    throw new LyricsAiError('AI lyrics search is unavailable.', { status: 503, code: 'AI_SERVICE_UNAVAILABLE' })
  } finally {
    clearTimeout(timer); signal?.removeEventListener('abort', onAbort)
  }
}
