import { supabase as defaultSupabase } from '../../database/supabaseClient.js'
import { CATALOG_ALBUMS, CATALOG_SONGS } from './catalogRepository.js'

const relation = (value) => Array.isArray(value) ? value[0] ?? null : value ?? null
const asNumberOrNull = (value) => value == null || !Number.isFinite(Number(value)) ? null : Number(value)

const mapAlbum = (row) => {
  const artist = relation(row.artists)
  const tracks = Array.isArray(row.songs) ? row.songs : []
  return {
    id: String(row.album_id ?? row.id),
    title: row.title ?? '',
    releaseYear: row.release_date ? Number(String(row.release_date).slice(0, 4)) : null,
    coverArt: row.image_url ?? row.cover ?? null,
    artist: {
      id: String(row.artist_id ?? artist?.artist_id ?? artist?.id ?? ''),
      name: artist?.name ?? row.subtitle ?? '',
    },
    tracks: tracks.map((track) => ({
      id: String(track.song_id ?? track.id),
      title: track.title ?? '',
      duration: asNumberOrNull(track.duration ?? track.duration_seconds),
      playCount: asNumberOrNull(track.total_plays ?? track.play_count) ?? 0,
      trackNumber: asNumberOrNull(track.track_number),
    })),
  }
}

export function createAlbumRepository(client = defaultSupabase) {
  return {
    async findAlbumDetails(id) {
      if (client) {
        const { data, error } = await client
          .from('albums')
          .select('album_id,title,artist_id,release_date,image_url,artists:artists(artist_id,name),songs:songs(song_id,title,duration,total_plays)')
          .eq('album_id', id)
          .maybeSingle()
        if (error && error.code !== '22P02') throw error
        if (data) return mapAlbum(data)
      }

      const album = CATALOG_ALBUMS.find((item) => String(item.id) === String(id) && item.is_active !== false && !item.deleted_at)
      if (!album) return null
      const songs = CATALOG_SONGS
        .filter((song) => String(song.album_id) === String(id) && song.is_active !== false && !song.deleted_at)
        .map((song) => ({
          song_id: song.song_id ?? song.id,
          title: song.title,
          duration: song.duration,
          total_plays: song.total_plays,
        }))
      return mapAlbum({ ...album, album_id: album.id, songs, artists: { artist_id: album.artist_id, name: album.subtitle } })
    },
  }
}

export const albumRepository = createAlbumRepository()
