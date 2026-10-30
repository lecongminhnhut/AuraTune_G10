import { albums, artists, genres, getArtist, playlists } from './mockData.js'
import { getMockRecommendations, normalizeText } from './aiMockData.js'

const includes = (haystack, needle) => normalizeText(haystack).includes(needle)

// Tìm kiếm mô phỏng (G03): khớp từ khóa theo tên bài, nghệ sĩ, album, playlist, lời bài hát
// và gợi ý "theo ý nghĩa" từ mô tả cảm xúc. Khi AI không khả dụng chỉ còn tìm theo từ khóa.
export function searchCatalog(query, { tracks, aiAvailable = true }) {
  const needle = normalizeText(query.trim())
  if (!needle) return { tracks: [], artists: [], albums: [], playlists: [], lyrics: [], ai: null }

  const matchedTracks = tracks.filter((track) => includes(`${track.title} ${track.artist} ${track.album}`, needle))
  const matchedArtists = artists.filter((artist) => artist.isPublic && includes(artist.name, needle))
  const matchedAlbums = albums.filter((album) => includes(`${album.title} ${getArtist(album.artistId)?.name ?? ''}`, needle))
  const matchedPlaylists = playlists.filter((playlist) => includes(`${playlist.title} ${playlist.description}`, needle))
  const lyrics = tracks.flatMap((track) => {
    const line = track.lyrics?.find((item) => includes(item.text, needle))
    return line ? [{ track, line: line.text }] : []
  })

  let ai = null
  if (aiAvailable) {
    const recommendation = getMockRecommendations(query)
    const genreIds = new Set(genres.filter((genre) => includes(`${genre.name} ${genre.description}`, needle)).map((genre) => genre.id))
    const fromPlaylists = recommendation.playlists.flatMap((playlist) => playlist.trackIds ?? [])
    const aiTracks = [...new Set(fromPlaylists)].map((id) => tracks.find((track) => track.id === id)).filter(Boolean)
    ai = {
      reason: recommendation.reason,
      playlists: recommendation.playlists,
      tracks: (aiTracks.length ? aiTracks : tracks.filter((track) => genreIds.has(track.genre))).slice(0, 5),
    }
  }

  return { tracks: matchedTracks, artists: matchedArtists, albums: matchedAlbums, playlists: matchedPlaylists, lyrics, ai }
}

export const sortTracks = (items, sort) => {
  const copy = [...items]
  if (sort === 'title') return copy.sort((a, b) => a.title.localeCompare(b.title, 'vi'))
  if (sort === 'plays') return copy.sort((a, b) => b.playCount - a.playCount)
  if (sort === 'newest') return copy.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
  return copy
}
