const meaningfulTokenPattern = /[\p{L}\p{N}]/u

export function normalizeSemanticQuery(value) {
  return String(value ?? '').trim()
}

export function validateSemanticQuery(value) {
  const query = normalizeSemanticQuery(value)
  const details = []
  if (!query) details.push({ field: 'q', issue: 'Must contain at least one meaningful alphanumeric token' })
  else if (query.length > 150) details.push({ field: 'q', issue: 'Must be 150 characters or fewer after trimming' })
  else if (!meaningfulTokenPattern.test(query)) details.push({ field: 'q', issue: 'Must contain at least one meaningful alphanumeric token' })
  return { query, details }
}
