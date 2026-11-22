import { supabase as defaultSupabase } from '../../database/supabaseClient.js'

const select = 'song_id,title,album_id,genre,duration,total_plays,image_url,lyrics,albums:albums(album_id,title,release_date,image_url,artists:artists(artist_id,name)),artists:artists(artist_id,name)'
const relation = (value) => Array.isArray(value) ? value[0] ?? null : value ?? null

const mapTrack = (row, aiReason = null) => {
  const album = relation(row.albums); const artist = relation(row.artists) || relation(album?.artists)
  return { id: String(row.song_id), type: 'track', title: row.title ?? '', artist: artist?.name ?? 'Unknown Artist', artist_id: artist?.artist_id ? String(artist.artist_id) : null, album: album?.title ?? null, album_id: row.album_id ? String(row.album_id) : null, genre: row.genre ?? null, release_date: album?.release_date ? String(album.release_date).slice(0, 10) : null, duration_seconds: row.duration == null ? null : Number(row.duration), play_count: row.total_plays == null ? null : Number(row.total_plays), cover_url: row.image_url ?? album?.image_url ?? null, ai_reason: aiReason }
}

export function createSemanticCatalogRepository(client = defaultSupabase) {
  let cache = null
  const load = async () => {
    if (cache) return cache
    if (!client) throw new Error('Catalog service is unavailable.')
    const result = await client.from('songs').select(select)
    if (result.error) throw result.error
    cache = result.data ?? []
    return cache
  }
  const page = (items, limit, offset) => { const data = items.slice(offset, offset + limit); const hasMore = offset + data.length < items.length; return { data, pagination: { limit, offset, next_offset: hasMore ? offset + data.length : null, has_more: hasMore } } }
  return {
    async getArtistNames() { const rows = await client.from('artists').select('name'); if (rows.error) throw rows.error; return (rows.data ?? []).map((row) => row.name) },
    async getRows() { return load() },
    async hydrate(results, limit, offset) { const rows = await load(); const byId = new Map(rows.map((row) => [String(row.song_id), row])); const mapped = results.map((item) => { const row = byId.get(String(item.id)); return row ? mapTrack(row, item.ai_reason ?? null) : null }).filter(Boolean); return page(mapped, limit, offset) },
    async fallback({ q, limit, offset }) {
      const rows = await load(); const normalized = String(q).toLocaleLowerCase('vi-VN').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      const results = rows.filter((row) => `${row.title ?? ''} ${row.genre ?? ''} ${relation(row.albums)?.title ?? ''} ${relation(row.artists)?.name ?? ''}`.toLocaleLowerCase('vi-VN').normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normalized)).sort((a, b) => Number(b.total_plays ?? -Infinity) - Number(a.total_plays ?? -Infinity) || String(a.song_id).localeCompare(String(b.song_id), undefined, { numeric: true })).map((row) => mapTrack(row, null))
      return page(results, limit, offset)
    },
  }
}
