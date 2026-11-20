const punctuationPattern = /[^\p{L}\p{N}\s]/gu

export function normalizeSearchText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('vi-VN')
    .replace(punctuationPattern, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function normalizeSearchQuery(value) {
  return String(value ?? '').trim()
}

export function matchesSearchText(value, normalizedQuery) {
  return normalizeSearchText(value).includes(normalizedQuery)
}
