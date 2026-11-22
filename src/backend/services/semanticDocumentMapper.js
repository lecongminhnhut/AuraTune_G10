export const AUDIO_FIELDS = Object.freeze(['tempo', 'bpm', 'key', 'mode', 'energy', 'valence', 'danceability', 'acousticness', 'instrumentalness', 'speechiness', 'loudness', 'liveness', 'time_signature', 'duration'])

export function mapSemanticDocument(row) {
  const album = Array.isArray(row.albums) ? row.albums[0] : row.albums
  const artist = Array.isArray(row.artists) ? row.artists[0] : row.artists
  const artistName = artist?.name ?? 'Unknown Artist'
  const metadata = [row.title, row.genre, album?.title, artistName].filter(Boolean).join(' ')
  const audio = Object.fromEntries(AUDIO_FIELDS.map((field) => [field, row[field] ?? (field === 'duration' ? row.duration : null)]))
  return { song_id: String(row.song_id), metadata, lyrics: row.lyrics ? String(row.lyrics) : null, audio }
}
