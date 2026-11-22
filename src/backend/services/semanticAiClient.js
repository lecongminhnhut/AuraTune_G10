export class SemanticAiError extends Error {
  constructor(message, { status = 0, code = 'AI_SERVICE_UNAVAILABLE' } = {}) { super(message); this.name = 'SemanticAiError'; this.status = status; this.code = code }
}

export async function searchSemanticWithAi(payload, { fetchImpl = fetch, timeoutMs = 1500, signal } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const abort = () => controller.abort()
  signal?.addEventListener('abort', abort, { once: true })
  try {
    const response = await fetchImpl(`${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/ai/recommend`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Internal-Api-Key': process.env.INTERNAL_API_KEY || '' }, body: JSON.stringify(payload), signal: controller.signal })
    let body = null; try { body = await response.json() } catch { body = null }
    if (!response.ok) throw new SemanticAiError('Semantic service is unavailable.', { status: response.status, code: body?.error?.code || 'AI_SERVICE_UNAVAILABLE' })
    return body
  } catch (error) {
    if (error instanceof SemanticAiError) throw error
    throw new SemanticAiError('Semantic service is unavailable.', { status: 503 })
  } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort) }
}
