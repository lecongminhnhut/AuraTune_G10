export const SEMANTIC_WEIGHTS = Object.freeze({ metadata: 0.3, lyrics: 0.4, audio: 0.3 })

export function combineSemanticScores(dimensions) {
  const available = Object.entries(SEMANTIC_WEIGHTS).filter(([key]) => Number.isFinite(dimensions?.[key]))
  if (!available.length) return 0
  const totalWeight = available.reduce((sum, [, weight]) => sum + weight, 0)
  return available.reduce((sum, [key, weight]) => sum + dimensions[key] * (weight / totalWeight), 0)
}

export function deduplicateSemanticResults(results, catalogById = new Map()) {
  const best = new Map()
  for (const item of results ?? []) {
    const id = String(item.id ?? item.song_id ?? '')
    if (!id || !catalogById.has(id)) continue
    const candidate = { ...item, id, score: Number(item.score ?? item.relevance_score ?? 0) }
    const previous = best.get(id)
    if (!previous || candidate.score > previous.score) best.set(id, candidate)
  }
  return [...best.values()].sort((a, b) => b.score - a.score || (Number(catalogById.get(b.id)?.total_plays ?? -Infinity) - Number(catalogById.get(a.id)?.total_plays ?? -Infinity)) || a.id.localeCompare(b.id, undefined, { numeric: true }))
}
