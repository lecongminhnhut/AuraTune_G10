import { supabase as defaultSupabase } from '../../database/supabaseClient.js'
import { matchesSearchText, normalizeSearchText } from '../utils/searchNormalization.js'

const GROUPS = ['tracks', 'artists', 'albums', 'playlists']

const toDate = (value) => value ? String(value).slice(0, 10) : null
const asNumber = (value) => Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0
const relation = (value) => Array.isArray(value) ? value[0] ?? null : value ?? null

const fetchRows = async (client, table, select) => {
  if (!client) throw new Error('Catalog service is unavailable.')
  const result = await client.from(table).select(select)
  if (result.error) throw result.error
  return result.data ?? []
}

const mapTrack = (row) => {
  const album = relation(row.albums)
  const artist = relation(row.artists) || relation(album?.artists)
  return {
    id: String(row.song_id), type: 'track', title: row.title ?? '',
    artist: artist?.name ?? 'Unknown Artist', artist_id: artist?.artist_id ? String(artist.artist_id) : null,
    album: album?.title ?? null, album_id: row.album_id ? String(row.album_id) : null,
    genre: row.genre ?? null, release_date: toDate(album?.release_date),
    duration_seconds: asNumber(row.duration), play_count: asNumber(row.total_plays),
    cover_url: row.image_url ?? album?.image_url ?? null,
  }
}

const mapArtist = (row) => {
  const user = relation(row.users)
  return { id: String(row.artist_id), type: 'artist', name: row.name ?? '', role: user?.role ?? 'artist', avatar_url: row.image_url ?? user?.avatar_url ?? null }
}

const mapAlbum = (row) => {
  const artist = relation(row.artists)
  const songs = Array.isArray(row.songs) ? row.songs : []
  const genres = [...new Set(songs.map((song) => song.genre).filter(Boolean))]
  return { id: String(row.album_id), type: 'album', title: row.title ?? '', artist: artist?.name ?? 'Unknown Artist', artist_id: row.artist_id ? String(row.artist_id) : null, genre: genres[0] ?? null, _genres: genres, release_date: toDate(row.release_date), cover_url: row.image_url ?? null }
}

const mapPlaylist = (row) => {
  const user = relation(row.users)
  return { id: String(row.playlist_id), type: 'playlist', title: row.name ?? '', description: null, owner: user?.display_name ?? user?.name ?? null, track_count: asNumber(row.playlist_songs?.length ?? row.track_count), cover_url: null }
}

const sortItems = (items, sort) => {
  const copy = [...items]
  if (sort === 'title') copy.sort((a, b) => (a.title ?? a.name ?? '').localeCompare(b.title ?? b.name ?? '', 'vi'))
  if (sort === 'plays') copy.sort((a, b) => (b.play_count ?? 0) - (a.play_count ?? 0) || a.id.localeCompare(b.id))
  if (sort === 'newest') copy.sort((a, b) => (b.release_date ?? '').localeCompare(a.release_date ?? '') || b.id.localeCompare(a.id))
  return copy
}

const filterItems = (items, query, genre, releaseYear) => items.filter((item) => {
  const text = item.type === 'artist' ? item.name : item.type === 'playlist' ? item.title : `${item.title} ${item.artist} ${item.album ?? ''}`
  const matchesQuery = matchesSearchText(text, normalizeSearchText(query))
  const matchesGenre = !genre || item.genre === genre || item._genres?.includes(genre)
  const matchesYear = !releaseYear || item.release_date?.slice(0, 4) === String(releaseYear)
  return matchesQuery && matchesGenre && matchesYear
})

export function createSearchRepository(client = defaultSupabase) {
  return {
    async search({ q, type = 'all', limit = 20, offset = 0, genre, release_year: releaseYear, sort = 'relevance' }) {
      const need = type === 'all' ? GROUPS : [type]
      const groups = {}
      if (need.includes('tracks')) groups.tracks = (await fetchRows(client, 'songs', 'song_id,title,album_id,genre,duration,total_plays,image_url,albums:albums(album_id,title,release_date,image_url,artists:artists(artist_id,name))')).map(mapTrack)
      if (need.includes('artists')) groups.artists = (await fetchRows(client, 'artists', 'artist_id,name,image_url,users:user_id(role,avatar_url)')).map(mapArtist)
      if (need.includes('albums')) groups.albums = (await fetchRows(client, 'albums', 'album_id,title,artist_id,release_date,image_url,artists:artists(artist_id,name),songs: songs(genre)')).map(mapAlbum)
      if (need.includes('playlists')) groups.playlists = (await fetchRows(client, 'playlists', 'playlist_id,name,status,user_id_creator,users:user_id_creator(display_name,name),playlist_songs(playlist_id)')).filter((row) => row.status === 'Public').map(mapPlaylist)

      const resultGroups = {}
      for (const group of need) resultGroups[group] = sortItems(filterItems(groups[group] ?? [], q, genre, releaseYear), sort)
      const ordered = need.flatMap((group) => resultGroups[group]).map(({ _genres, ...item }) => item)
      const page = ordered.slice(offset, offset + limit)
      const hasMore = offset + page.length < ordered.length
      return { data: page, pagination: { limit, offset, next_offset: hasMore ? offset + page.length : null, has_more: hasMore } }
    },
  }
}

export const searchRepository = createSearchRepository()
