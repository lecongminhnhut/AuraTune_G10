const lrcTimestampPattern = /\[\d{1,2}:\d{2}(?:\.\d{1,3})?\]/g
const punctuationPattern = /[^\p{L}\p{N}\s]/gu

export const normalizeLyrics = (value) => String(value ?? '').replace(lrcTimestampPattern, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('vi-VN').replace(punctuationPattern, ' ').replace(/\s+/g, ' ').trim()

export function searchLyricsFallback(rows, query, limit = 20, offset = 0) {
  const normalizedQuery = normalizeLyrics(query)
  const words = [...new Set(normalizedQuery.split(' ').filter(Boolean))]
  const ranked = rows.map((row) => {
    const lyric = String(row.lyrics ?? '').replace(lrcTimestampPattern, '').trim()
    const normalizedLyric = normalizeLyrics(lyric)
    const matchedWords = words.filter((word) => normalizedLyric.split(' ').includes(word)).length
    return { row, lyric, exactPhrase: normalizedLyric.includes(normalizedQuery), matchedWords }
  }).filter((candidate) => candidate.exactPhrase || candidate.matchedWords > 0).sort((a, b) => Number(b.exactPhrase) - Number(a.exactPhrase) || b.matchedWords - a.matchedWords || (Number(b.row.play_count ?? -Infinity) - Number(a.row.play_count ?? -Infinity)) || String(a.row.id).localeCompare(String(b.row.id), undefined, { numeric: true }))
  const data = ranked.slice(offset, offset + limit).map(({ row, lyric }) => ({ ...row, matched_lyric: lyric }))
  const hasMore = offset + data.length < ranked.length
  return { data, pagination: { limit, offset, next_offset: hasMore ? offset + data.length : null, has_more: hasMore } }
}
