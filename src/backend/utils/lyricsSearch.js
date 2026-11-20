const lrcTimestampPattern = /\[\d{1,2}:\d{2}(?:\.\d{1,3})?\]/g
const punctuationPattern = /[^\p{L}\p{N}\s]/gu

export function stripLrcTimestamps(value) {
  return String(value ?? '').replace(lrcTimestampPattern, '').replace(/\r\n/g, '\n').trim()
}

export function normalizeLyricText(value) {
  return stripLrcTimestamps(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('vi-VN')
    .replace(punctuationPattern, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function normalizeLyricQuery(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim()
}

export function validateLyricQuery(value) {
  const query = normalizeLyricQuery(value)
  const details = []
  if (!query) details.push({ field: 'q', issue: 'Must contain at least 3 words and at most 200 characters after trimming' })
  else if (query.length > 200) details.push({ field: 'q', issue: 'Must contain at least 3 words and at most 200 characters after trimming' })
  else if (query.split(' ').filter(Boolean).length < 3) details.push({ field: 'q', issue: 'Must contain at least 3 words and at most 200 characters after trimming' })
  return { query, details }
}

export function rankLyricRows(rows, query) {
  const normalizedQuery = normalizeLyricText(query)
  const queryWords = [...new Set(normalizedQuery.split(' ').filter(Boolean))]
  return rows
    .map((row) => {
      const lyric = stripLrcTimestamps(row.lyrics)
      const normalizedLyric = normalizeLyricText(lyric)
      const matchedWords = queryWords.filter((word) => normalizedLyric.split(' ').includes(word)).length
      return { row, lyric, normalizedLyric, exactPhrase: normalizedLyric.includes(normalizedQuery), matchedWords }
    })
    .filter((candidate) => candidate.normalizedLyric && (candidate.exactPhrase || candidate.matchedWords > 0))
    .sort((a, b) => Number(b.exactPhrase) - Number(a.exactPhrase) || b.matchedWords - a.matchedWords || (Number(b.row.total_plays ?? -Infinity) - Number(a.row.total_plays ?? -Infinity)) || String(a.row.song_id).localeCompare(String(b.row.song_id), undefined, { numeric: true }))
}

export function mapLyricTrack(row, matchedLyric = null) {
  const album = Array.isArray(row.albums) ? row.albums[0] : row.albums
  const artist = Array.isArray(row.artists) ? row.artists[0] : row.artists
  const albumArtist = album && (Array.isArray(album.artists) ? album.artists[0] : album.artists)
  const resolvedArtist = artist || albumArtist
  return {
    id: String(row.song_id), type: 'track', title: row.title ?? '',
    artist: resolvedArtist?.name ?? 'Unknown Artist',
    artist_id: resolvedArtist?.artist_id ? String(resolvedArtist.artist_id) : null,
    album: album?.title ?? null, album_id: row.album_id ? String(row.album_id) : null,
    genre: row.genre ?? null,
    release_date: album?.release_date ? String(album.release_date).slice(0, 10) : null,
    duration_seconds: row.duration == null ? null : Number(row.duration),
    play_count: row.total_plays == null ? null : Number(row.total_plays),
    cover_url: row.image_url ?? album?.image_url ?? null,
    matched_lyric: matchedLyric == null ? null : matchedLyric,
  }
}

export function paginateLyricResults(data, limit = 20, offset = 0) {
  const page = data.slice(offset, offset + limit)
  const hasMore = offset + page.length < data.length
  return { data: page, pagination: { limit, offset, next_offset: hasMore ? offset + page.length : null, has_more: hasMore } }
}
