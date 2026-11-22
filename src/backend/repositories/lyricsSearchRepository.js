import { supabase as defaultSupabase } from '../../database/supabaseClient.js'
import { mapLyricTrack, paginateLyricResults, rankLyricRows } from '../utils/lyricsSearch.js'

const select = 'song_id,title,album_id,genre,duration,total_plays,image_url,lyrics,albums:albums(album_id,title,release_date,image_url,artists:artists(artist_id,name)),artists:artists(artist_id,name)'

async function fetchCatalog(client) {
  if (!client) throw new Error('Lyrics catalog service is unavailable.')
  const result = await client.from('songs').select(select).not('lyrics', 'is', null)
  if (result.error) throw result.error
  return (result.data ?? []).filter((row) => String(row.lyrics ?? '').trim())
}

export function createLyricsSearchRepository(client = defaultSupabase) {
  let cache = null
  let cachePromise = null
  const getCatalog = async () => {
    if (cache) return cache
    if (!cachePromise) cachePromise = fetchCatalog(client).then((rows) => { cache = rows; return rows }).finally(() => { cachePromise = null })
    return cachePromise
  }
  return {
    async refresh() { cache = await fetchCatalog(client); return cache },
    async searchFallback({ query, limit = 20, offset = 0 }) {
      const ranked = rankLyricRows(await getCatalog(), query)
      return paginateLyricResults(ranked.map(({ row, lyric }) => mapLyricTrack(row, lyric)), limit, offset)
    },
    async mapAiResults(items, pagination) {
      const catalog = await getCatalog()
      const byId = new Map(catalog.map((row) => [String(row.song_id), row]))
      const data = (items ?? []).map((item) => {
        const row = byId.get(String(item.id ?? item.song_id))
        return row ? mapLyricTrack(row, item.matched_lyric ?? item.lyric ?? null) : null
      }).filter(Boolean)
      return { data, pagination: pagination ?? paginateLyricResults(data, 20, 0).pagination }
    },
  }
}

export const lyricsSearchRepository = createLyricsSearchRepository()
