import { getPlaylist, playlists, tracks } from './mockData.js'

export const searchPlaceholder =
  'Nhập tên bài hát, nghệ sĩ hoặc miêu tả cảm xúc của bạn (VD: nhạc lofi chill để code)...'

export const normalizeText = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')

const moods = [
  {
    words: ['lofi', 'chill', 'code', 'cang thang', 'do an', 'thu gian'],
    ids: ['lofi-chill', 'deep-focus'],
    reason: 'Beat nhẹ, ít lời, cho một khoảng tập trung thật êm.'
  },
  {
    words: ['tap trung', 'focus', 'hoc', 'lam viec'],
    ids: ['deep-focus', 'lofi-chill'],
    reason: 'Âm thanh tối giản, giúp bạn giữ nhịp tập trung.'
  },
  {
    words: ['buon', 'dem', 'co don', 'tam trang', 'met'],
    ids: ['dem-thanh-pho', 'indie-viet'],
    reason: 'Một chút dịu dàng để đồng hành cùng cảm xúc của bạn.'
  },
  {
    words: ['vui', 'nang luong', 'tich cuc', 'sang', 'chay bo', 'gym'],
    ids: ['nang-len', 'aura-mix'],
    reason: 'Giai điệu tươi sáng cho một ngày nhiều năng lượng.'
  },
  {
    words: ['indie', 'viet', 'nhe nhang'],
    ids: ['indie-viet', 'dem-thanh-pho'],
    reason: 'Những giai điệu Việt gần gũi, nhẹ nhàng và nhiều cảm xúc.'
  }
]

export function getMockRecommendations(prompt) {
  const normalized = normalizeText(prompt)
  const mood = moods.find((item) => item.words.some((word) => normalized.includes(word)))
  return {
    playlists: (mood?.ids ?? ['aura-mix', 'lofi-chill']).map(getPlaylist),
    reason: mood?.reason ?? 'Thử một tuyển tập mới và tìm giai điệu hợp với bạn nhé.'
  }
}

export function getMockSearchResults(query) {
  const normalized = normalizeText(query.trim())
  if (!normalized) return { results: [], reason: '' }

  const recommendations = getMockRecommendations(query)
  const matchedTracks = tracks.filter((track) =>
    normalizeText(`${track.title} ${track.artist} ${track.album}`).includes(normalized)
  )
  const matchedPlaylists = playlists.filter((playlist) =>
    normalizeText(`${playlist.title} ${playlist.description}`).includes(normalized)
  )
  const suggestedPlaylists = [
    ...new Map(
      [...matchedPlaylists, ...recommendations.playlists].map((playlist) => [playlist.id, playlist])
    ).values()
  ]
  const suggestedTracks = matchedTracks.length
    ? matchedTracks
    : tracks.filter(
        (track) =>
          track.id ===
          (suggestedPlaylists[0].id === 'deep-focus'
            ? 't10'
            : suggestedPlaylists[0].id === 'lofi-chill'
            ? 't8'
            : 't1')
      )

  return {
    results: [
      ...matchedTracks.slice(0, 2).map((track) => ({ type: 'track', item: track })),
      ...suggestedPlaylists.slice(0, 2).map((playlist) => ({ type: 'playlist', item: playlist })),
      ...(!matchedTracks.length
        ? suggestedTracks.slice(0, 1).map((track) => ({ type: 'track', item: track }))
        : [])
    ],
    reason:
      matchedTracks.length || matchedPlaylists.length
        ? 'Kết quả phù hợp và một vài gợi ý để bạn khám phá.'
        : recommendations.reason
  }
}

export const quickPrompts = [
  'Lofi chill để code',
  'Bài đang phát là gì?',
  'Thêm nhạc năng lượng vào hàng chờ',
  'Nhạc cho đêm muộn'
]

export const mockMessages = [
  {
    id: 'demo-user',
    role: 'user',
    content:
      'Đang làm đồ án căng thẳng quá, cho mình vài bài nhạc giúp tập trung code nhưng có chút chill lofi nhé.'
  },
  {
    id: 'demo-host',
    role: 'assistant',
    content:
      'AuraTune hiểu rồi! Code mệt thì nghỉ tay uống ngụm nước nhé. Đây là playlist Lofi Chill cực mượt giúp bạn tập trung cao độ 🎧',
    playlist: getPlaylist('lofi-chill')
  }
]

const askAboutCurrent = [
  'bai nay',
  'bai gi',
  'dang phat',
  'dang nghe',
  'ca si nao',
  'ai hat',
  'nghe si nao',
  'bai hat nay'
]
const askToQueue = ['hang cho', 'danh sach cho', 'queue', 'phat tiep', 'them vao']

export function createMockHostReply(prompt, { currentTrack, genreName } = {}) {
  const normalized = normalizeText(prompt)
  if (currentTrack && askAboutCurrent.some((phrase) => normalized.includes(phrase))) {
    return {
      role: 'assistant',
      content: `Bạn đang nghe “${currentTrack.title}” của ${currentTrack.artist}, nằm trong album “${
        currentTrack.album
      }”${
        genreName ? `, thể loại ${genreName}` : ''
      }. Bấm vào tên nghệ sĩ trên trình phát để xem thêm các bài khác của họ nhé 🎶`
    }
  }
  const recommendation = getMockRecommendations(prompt)
  if (askToQueue.some((phrase) => normalized.includes(phrase))) {
    const playlist = recommendation.playlists[0]
    return {
      role: 'assistant',
      content: `Xong! Mình đã thêm các bài trong “${playlist.title}” vào hàng chờ, chúng sẽ phát ngay sau bài hiện tại. ${recommendation.reason}`,
      playlist,
      action: { type: 'queue', trackIds: playlist.trackIds }
    }
  }
  return {
    role: 'assistant',
    content: `Mình nghe bạn rồi 🎧 ${recommendation.reason} Thử playlist “${recommendation.playlists[0].title}” nhé. Bạn có thể bấm Play ngay bên dưới!`,
    playlist: recommendation.playlists[0]
  }
}

/**
 * Async generator mock streaming adapter for Feature 121 (T004)
 */
const sleep = (ms, signal) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      const error = new Error('Aborted')
      error.name = 'AbortError'
      return reject(error)
    }
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        const error = new Error('Aborted')
        error.name = 'AbortError'
        reject(error)
      },
      { once: true }
    )
  })

function getMockResponse(prompt, context = {}) {
  const p = prompt.toLowerCase()
  const track = context.currentTrack

  if (p.includes('bài đang phát') || p.includes('đang nghe gì')) {
    if (track && track.title) {
      return (
        `Bài hát đang phát là **${track.title}** của nghệ sĩ *${track.artist || 'Nghệ sĩ AuraTune'}*.\n\n` +
        `- Trạng thái: ${context.isPlaying ? 'Đang phát' : 'Đang tạm dừng'}\n` +
        `- Âm lượng hiện tại: \`${context.volume ?? 80}%\`\n\n` +
        `Bạn có muốn tìm hiểu thêm về bài hát này không?`
      )
    }
    return (
      `Hiện tại **chưa có bài hát nào** đang được phát.\n\n` +
      `Bạn có thể chọn một bài trong trang chủ hoặc gõ tên bài hát để mình hỗ trợ nhé!`
    )
  }

  if (p.includes('chào') || p.includes('hello') || p.includes('hi')) {
    return (
      `Xin chào! Mình là **AuraTune Agent** - người đồng hành âm nhạc của bạn.\n\n` +
      `Mình có thể hỗ trợ bạn:\n` +
      `- Giải đáp thông tin về các bài hát, nghệ sĩ và album\n` +
      `- Giới thiệu các danh sách phát phù hợp với tâm trạng\n` +
      `- Thảo luận về gu âm nhạc của bạn\n\n` +
      `*Bạn muốn nghe giai điệu như thế nào hôm nay?*`
    )
  }

  if (p.includes('lofi') || p.includes('chill') || p.includes('code')) {
    return (
      `Tuyệt vời! Những giai điệu **Lofi Chillhop** luôn là lựa chọn hoàn hảo để tập trung làm việc và lập trình.\n\n` +
      `Một số đặc trưng của dòng nhạc này:\n` +
      `- Tiết tấu vừa phải (70 - 90 BPM)\n` +
      `- Âm sắc ấm áp kết hợp tiếng mưa rơi nhẹ\n` +
      `- Giúp duy trì trạng thái *flow* sâu hơn\n\n` +
      `Chúc bạn có một buổi làm việc thật hiệu quả!`
    )
  }

  // Default response
  return (
    `Cảm ơn bạn đã gửi câu hỏi: *"${prompt}"*.\n\n` +
    `Mình đã ghi nhận yêu cầu của bạn. Trong không gian âm nhạc của **AuraTune**, bạn có thể khám phá thêm các nghệ sĩ và playlist nổi bật tại [Trang chủ](/).\n\n` +
    `Nếu cần trợ giúp thêm, hãy gõ \`/help\` hoặc hỏi mình bất cứ điều gì nhé!`
  )
}

export async function* mockAgentStream(prompt, options = {}) {
  const { context = {}, signal } = options
  const startedAt = Date.now()

  const thinkingPhrases = [
    'Đang phân tích câu hỏi của bạn...',
    'Đang tra cứu ngữ cảnh âm nhạc...',
    'Đang chuẩn bị câu trả lời phù hợp...'
  ]

  for (const phrase of thinkingPhrases) {
    if (signal?.aborted) return
    yield { type: 'thinking', text: phrase }
    try {
      await sleep(250, signal)
    } catch {
      return
    }
  }

  const fullResponse = getMockResponse(prompt, context)
  const chunks = fullResponse.match(/.{1,8}/g) || [fullResponse]

  for (const chunk of chunks) {
    if (signal?.aborted) return
    yield { type: 'text', delta: chunk }
    try {
      await sleep(40, signal)
    } catch {
      return
    }
  }

  const totalDurationMs = Date.now() - startedAt
  yield { type: 'done', totalDurationMs }
}

export default {
  searchPlaceholder,
  normalizeText,
  getMockRecommendations,
  getMockSearchResults,
  quickPrompts,
  mockMessages,
  createMockHostReply,
  mockAgentStream
}
