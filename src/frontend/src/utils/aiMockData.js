import { getPlaylist, playlists, tracks } from './mockData.js'

export const searchPlaceholder = 'Nhập tên bài hát, nghệ sĩ hoặc miêu tả cảm xúc của bạn (VD: nhạc lofi chill để code)...'

export const normalizeText = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')

const moods = [
  { words: ['lofi', 'chill', 'code', 'cang thang', 'do an', 'thu gian'], ids: ['lofi-chill', 'deep-focus'], reason: 'Beat nhẹ, ít lời, cho một khoảng tập trung thật êm.' },
  { words: ['tap trung', 'focus', 'hoc', 'lam viec'], ids: ['deep-focus', 'lofi-chill'], reason: 'Âm thanh tối giản, giúp bạn giữ nhịp tập trung.' },
  { words: ['buon', 'dem', 'co don', 'tam trang', 'met'], ids: ['dem-thanh-pho', 'indie-viet'], reason: 'Một chút dịu dàng để đồng hành cùng cảm xúc của bạn.' },
  { words: ['vui', 'nang luong', 'tich cuc', 'sang', 'chay bo', 'gym'], ids: ['nang-len', 'aura-mix'], reason: 'Giai điệu tươi sáng cho một ngày nhiều năng lượng.' },
  { words: ['indie', 'viet', 'nhe nhang'], ids: ['indie-viet', 'dem-thanh-pho'], reason: 'Những giai điệu Việt gần gũi, nhẹ nhàng và nhiều cảm xúc.' },
]

export function getMockRecommendations(prompt) {
  const normalized = normalizeText(prompt)
  const mood = moods.find((item) => item.words.some((word) => normalized.includes(word)))
  return {
    playlists: (mood?.ids ?? ['aura-mix', 'lofi-chill']).map(getPlaylist),
    reason: mood?.reason ?? 'Thử một tuyển tập mới và tìm giai điệu hợp với bạn nhé.',
  }
}

export function getMockSearchResults(query) {
  const normalized = normalizeText(query.trim())
  if (!normalized) return { results: [], reason: '' }

  const recommendations = getMockRecommendations(query)
  const matchedTracks = tracks.filter((track) => normalizeText(`${track.title} ${track.artist} ${track.album}`).includes(normalized))
  const matchedPlaylists = playlists.filter((playlist) => normalizeText(`${playlist.title} ${playlist.description}`).includes(normalized))
  const suggestedPlaylists = [...new Map([...matchedPlaylists, ...recommendations.playlists].map((playlist) => [playlist.id, playlist])).values()]
  const suggestedTracks = matchedTracks.length ? matchedTracks : tracks.filter((track) => track.id === (suggestedPlaylists[0].id === 'deep-focus' ? 't10' : suggestedPlaylists[0].id === 'lofi-chill' ? 't8' : 't1'))

  return {
    results: [
      ...matchedTracks.slice(0, 2).map((track) => ({ type: 'track', item: track })),
      ...suggestedPlaylists.slice(0, 2).map((playlist) => ({ type: 'playlist', item: playlist })),
      ...(!matchedTracks.length ? suggestedTracks.slice(0, 1).map((track) => ({ type: 'track', item: track })) : []),
    ],
    reason: matchedTracks.length || matchedPlaylists.length ? 'Kết quả phù hợp và một vài gợi ý để bạn khám phá.' : recommendations.reason,
  }
}

export const quickPrompts = ['Lofi chill để code', 'Bài đang phát là gì?', 'Thêm nhạc năng lượng vào hàng chờ', 'Nhạc cho đêm muộn']

export const mockMessages = [
  { id: 'demo-user', role: 'user', content: 'Đang làm đồ án căng thẳng quá, cho mình vài bài nhạc giúp tập trung code nhưng có chút chill lofi nhé.' },
  { id: 'demo-host', role: 'assistant', content: 'AuraTune hiểu rồi! Code mệt thì nghỉ tay uống ngụm nước nhé. Đây là playlist Lofi Chill cực mượt giúp bạn tập trung cao độ 🎧', playlist: getPlaylist('lofi-chill') },
]

const askAboutCurrent = ['bai nay', 'bai gi', 'dang phat', 'dang nghe', 'ca si nao', 'ai hat', 'nghe si nao', 'bai hat nay']
const askToQueue = ['hang cho', 'danh sach cho', 'queue', 'phat tiep', 'them vao']

// Câu trả lời mô phỏng của AI Host. context.currentTrack: bài đang phát; trả về action 'queue' khi người nghe muốn thêm vào hàng chờ.
export function createMockHostReply(prompt, { currentTrack, genreName } = {}) {
  const normalized = normalizeText(prompt)
  if (currentTrack && askAboutCurrent.some((phrase) => normalized.includes(phrase))) {
    return {
      role: 'assistant',
      content: `Bạn đang nghe “${currentTrack.title}” của ${currentTrack.artist}, nằm trong album “${currentTrack.album}”${genreName ? `, thể loại ${genreName}` : ''}. Bấm vào tên nghệ sĩ trên trình phát để xem thêm các bài khác của họ nhé 🎶`,
    }
  }
  const recommendation = getMockRecommendations(prompt)
  if (askToQueue.some((phrase) => normalized.includes(phrase))) {
    const playlist = recommendation.playlists[0]
    return {
      role: 'assistant',
      content: `Xong! Mình đã thêm các bài trong “${playlist.title}” vào hàng chờ, chúng sẽ phát ngay sau bài hiện tại. ${recommendation.reason}`,
      playlist,
      action: { type: 'queue', trackIds: playlist.trackIds },
    }
  }
  return {
    role: 'assistant',
    content: `Mình nghe bạn rồi 🎧 ${recommendation.reason} Thử playlist “${recommendation.playlists[0].title}” nhé. Bạn có thể bấm Play ngay bên dưới!`,
    playlist: recommendation.playlists[0],
  }
}
