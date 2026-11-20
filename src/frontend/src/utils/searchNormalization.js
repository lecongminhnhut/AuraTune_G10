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

export const normalizeSearchQuery = (value) => String(value ?? '').trim()
