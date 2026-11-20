const tokenPattern = /[\p{L}\p{N}]/u

export function normalizeSemanticQuery(value) { return String(value ?? '').trim() }
export function validateSemanticQuery(value) {
  const query = normalizeSemanticQuery(value)
  if (!query) return { query, error: 'Enter a meaningful search description.' }
  if (query.length > 150) return { query, error: 'Search descriptions must be 150 characters or fewer.' }
  if (!tokenPattern.test(query)) return { query, error: 'Enter at least one meaningful letter or number.' }
  return { query, error: null }
}
