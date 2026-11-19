import { apiFetch } from './sessionApiClient.js'

const mapTrack = (track) => ({
  id: track.id,
  title: track.title,
  duration: track.duration,
  playCount: track.playCount,
  trackNumber: track.trackNumber,
})

const mapAlbumDetails = (album) => ({
  id: album.id,
  title: album.title,
  releaseYear: album.releaseYear,
  coverArt: album.coverArt,
  artist: {
    id: album.artist?.id,
    name: album.artist?.name,
  },
  tracks: Array.isArray(album.tracks) ? album.tracks.map(mapTrack) : [],
})

const assertEnvelope = (payload, response, mapData = (data) => data) => {
  if (payload?.success && payload.data) return mapData(payload.data)

  const error = new Error(payload?.message || 'Album details are unavailable.')
  error.code = payload?.error?.code || (response.status === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR')
  error.status = response.status
  throw error
}

export async function getAlbumDetails(albumId) {
  const response = await apiFetch(`/albums/${encodeURIComponent(albumId)}`)
  const payload = await response.json()
  return assertEnvelope(payload, response, mapAlbumDetails)
}

export async function getArtistAlbums(artistId) {
  const response = await apiFetch(`/artists/${encodeURIComponent(artistId)}/albums`)
  const payload = await response.json()
  const data = assertEnvelope(payload, response)
  return Array.isArray(data) ? data : data.albums ?? []
}
