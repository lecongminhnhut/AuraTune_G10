import { getMockRecommendations, normalizeText } from './aiMockData.js'

/*
 * Lớp kết nối AI Host agent. Đây là bản GIẢ LẬP. Backend thay hàm runAgent bằng lời gọi API thật,
 * ví dụ POST /api/agent trả về luồng Server-Sent Events, mỗi sự kiện là một object JSON như dưới đây.
 *
 * runAgent(prompt, { context, signal }) là async iterator, lần lượt phát ra các sự kiện:
 *   { type: 'thinking', text }                                     một dòng suy nghĩ (hiện trong khối "Đang suy nghĩ")
 *   { type: 'tool_call', id, name, args, label, confirm? }         yêu cầu giao diện thực hiện một hành động
 *                                                                  (danh sách tool: components/chat/agentTools.js).
 *                                                                  confirm: câu hỏi xác nhận [y/N] trước khi chạy
 *   { type: 'text', delta }                                        một đoạn câu trả lời, được nối dần (streaming)
 *   { type: 'playlist', playlistId }                               đính kèm thẻ playlist dưới câu trả lời
 *   { type: 'error', message }                                     lỗi, hiện bằng chữ đỏ
 *   { type: 'done' }
 *
 * context gửi kèm: { currentTrack: { id, title, artist }, isPlaying, volume, user: { id, role } | null }.
 */

const wait = (ms, signal) => new Promise((resolve, reject) => {
  const timer = window.setTimeout(resolve, ms)
  signal?.addEventListener('abort', () => { window.clearTimeout(timer); reject(new DOMException('Đã dừng', 'AbortError')) }, { once: true })
})

const pages = [
  [['trang chu', 'home'], '/', 'Trang chủ'],
  [['bang xep hang', 'xep hang', 'top'], '/charts', 'Bảng xếp hạng'],
  [['kham pha'], '/explore', 'Khám phá'],
  [['thu vien'], '/library', 'Thư viện'],
  [['lich su', 'thong ke'], '/history', 'Lịch sử & thống kê'],
  [['ai playlist'], '/ai-playlist', 'AI Playlist'],
  [['tim kiem'], '/search', 'Tìm kiếm'],
]

let callId = 0
const call = (name, args, label, extra = {}) => ({ type: 'tool_call', id: `call_${++callId}`, name, args, label, ...extra })

// Kịch bản giả lập cho từng mệnh đề. Chỉ để demo giao diện; backend sẽ tự quyết định suy nghĩ, tool và câu trả lời.
function planClause(text, context) {
  const n = normalizeText(text)
  const track = context.currentTrack

  if (/(bai (nay|dang phat) (la )?(bai )?gi|dang phat (bai )?gi|ai hat|ca si nao)/.test(n)) {
    return { thinking: ['Đọc trạng thái trình phát hiện tại'], text: `Đang phát “${track.title}” của ${track.artist}.` }
  }
  const volume = n.match(/(?:am luong|volume)\D{0,10}(\d{1,3})/)
  if (volume) {
    const value = Math.min(100, Number(volume[1]))
    return { thinking: [`Người dùng muốn đặt âm lượng ${value}%`], calls: [call('set_volume', { value }, `set_volume(${value})`)], text: `Đã chỉnh âm lượng về ${value}%.` }
  }
  if (/(giam am luong|nho lai|nho xuong)/.test(n)) return { calls: [call('set_volume', { value: Math.max(0, context.volume - 20) }, `set_volume(${Math.max(0, context.volume - 20)})`)], text: 'Đã giảm âm lượng.' }
  if (/(tang am luong|to len|lon len)/.test(n)) return { calls: [call('set_volume', { value: Math.min(100, context.volume + 20) }, `set_volume(${Math.min(100, context.volume + 20)})`)], text: 'Đã tăng âm lượng.' }
  if (/^(tam dung|dung|pause|ngung)( nhac| phat)?$/.test(n)) return { calls: [call('playback', { action: 'pause' }, 'playback("pause")')], text: 'Đã tạm dừng.' }
  if (/^(tiep tuc|phat tiep|resume)( phat| nghe)?$/.test(n)) return { calls: [call('playback', { action: 'resume' }, 'playback("resume")')], text: 'Tiếp tục phát nhé.' }
  if (/^(bai tiep( theo)?|chuyen bai|qua bai|next|skip)$/.test(n)) return { calls: [call('playback', { action: 'next' }, 'playback("next")')], text: 'Đã chuyển sang bài tiếp theo.' }
  if (/^(bai truoc|quay lai bai truoc|previous)$/.test(n)) return { calls: [call('playback', { action: 'previous' }, 'playback("previous")')], text: 'Đã quay lại bài trước.' }
  if (/^(thich|tha tim|like|luu)( bai nay| bai dang phat)?$/.test(n)) return { calls: [call('like_track', { trackId: track.id }, `like_track("${track.id}")`)], text: `Đã thêm “${track.title}” vào Bài hát đã thích.` }
  if (/(xoa|don) (het )?(hang cho|danh sach cho|queue)/.test(n)) {
    return { thinking: ['Hành động này không hoàn tác được, cần hỏi lại người dùng'], calls: [call('clear_queue', {}, 'clear_queue()', { confirm: 'Xóa tất cả bài trong hàng chờ?' })], text: 'Hàng chờ đã trống.' }
  }
  const page = pages.find(([words]) => words.some((word) => n.includes(word)))
  if (page && /^(mo|vao|xem|di toi|chuyen sang)\b/.test(n)) return { calls: [call('navigate', { path: page[1] }, `navigate("${page[1]}")`)], text: `Đã mở ${page[2]}.` }

  const recommendation = getMockRecommendations(text)
  const playlist = recommendation.playlists[0]
  if (/(hang cho|danh sach cho|queue)/.test(n)) {
    return {
      thinking: ['Phân tích tâm trạng trong yêu cầu', `Chọn playlist “${playlist.title}” (${playlist.trackIds.length} bài)`],
      calls: [call('queue_add', { trackIds: playlist.trackIds }, `queue_add(${playlist.trackIds.length} bài)`)],
      text: `Đã thêm các bài trong “${playlist.title}” vào hàng chờ. ${recommendation.reason}`,
    }
  }
  if (/^(phat|mo|nghe|bat|play|cho (toi|minh|tui) nghe|muon nghe)\b/.test(n)) {
    return {
      thinking: ['Phân tích tâm trạng trong yêu cầu', `Tìm trong thư viện: 3 playlist phù hợp`, `Chọn “${playlist.title}”`],
      calls: [call('play_playlist', { playlistId: playlist.id }, `play_playlist("${playlist.id}")`)],
      text: `Đang phát “${playlist.title}”. ${recommendation.reason}`,
      playlistId: playlist.id,
    }
  }
  return null
}

export async function* runAgent(prompt, { context, signal }) {
  const clauses = prompt.normalize('NFC').split(/\s*(?:[,;]|\s+rồi\s+|\s+sau đó\s+)\s*/i).filter(Boolean)
  const plans = clauses.map((clause) => planClause(clause, context)).filter(Boolean)

  yield { type: 'thinking', text: 'Đọc yêu cầu' }
  await wait(500, signal)

  // Không nhận ra hành động nào: trả lời như trò chuyện bình thường.
  if (!plans.length) {
    const recommendation = getMockRecommendations(prompt)
    yield { type: 'thinking', text: 'Không cần hành động, chỉ trả lời' }
    await wait(700, signal)
    yield* streamText(`Mình nghe bạn rồi. ${recommendation.reason} Bạn có thể nói “phát ${recommendation.playlists[0].title}” để mình bật ngay.`, signal)
    yield { type: 'playlist', playlistId: recommendation.playlists[0].id }
    yield { type: 'done' }
    return
  }

  for (const plan of plans) {
    for (const line of plan.thinking ?? []) {
      yield { type: 'thinking', text: line }
      await wait(450 + Math.random() * 400, signal)
    }
  }
  for (const plan of plans) {
    for (const toolCall of plan.calls ?? []) {
      yield toolCall
      await wait(350, signal)
    }
  }
  yield* streamText(plans.map((plan) => plan.text).join(' '), signal)
  const withPlaylist = plans.find((plan) => plan.playlistId)
  if (withPlaylist) yield { type: 'playlist', playlistId: withPlaylist.playlistId }
  yield { type: 'done' }
}

async function* streamText(text, signal) {
  for (const word of text.split(/(\s+)/)) {
    yield { type: 'text', delta: word }
    if (word.trim()) await wait(28, signal)
  }
}
