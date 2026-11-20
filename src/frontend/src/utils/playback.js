// Hàm thuần cho trình phát (Group 040). Không phụ thuộc React hay phần tử <audio> để kiểm thử độc lập.

export const getDurationSeconds = (duration) => {
  if (typeof duration === 'number') return Number.isFinite(duration) && duration > 0 ? duration : 0
  if (typeof duration !== 'string' || !duration.includes(':')) return 0
  const [minutes, seconds] = duration.split(':').map(Number)
  return (minutes || 0) * 60 + (seconds || 0)
}

export const formatTime = (seconds, padMinutes = false) => {
  const value = Math.max(0, Math.floor(seconds))
  return `${String(Math.floor(value / 60)).padStart(padMinutes ? 2 : 1, '0')}:${String(value % 60).padStart(2, '0')}`
}

// 041-FR-014: một lượt phát được tính khi đã nghe liên tục 30 giây hoặc nửa thời lượng bài, điều kiện nào đến trước.
export const PLAY_THRESHOLD_SECONDS = 30

export const playThresholdSeconds = (durationSeconds) => (
  durationSeconds > 0 ? Math.min(PLAY_THRESHOLD_SECONDS, durationSeconds / 2) : PLAY_THRESHOLD_SECONDS
)

// Chọn bài kế tiếp (direction = 1) hoặc bài trước (direction = -1) trong hàng chờ.
// - Bỏ qua bài không khả dụng (041-FR-008).
// - Ngẫu nhiên: chọn một bài khác bài đang phát (043-FR-002) nhưng ưu tiên bài được
//   "Phát tiếp theo" (054-FR-009); thứ tự hiển thị của hàng chờ không đổi (043-FR-003).
// - Trả về null khi chạm đầu/cuối hàng chờ mà không bật lặp lại danh sách (041-FR-007, 043-FR-006).
export function pickAdjacentTrack(state, direction, { isPlayable = () => true, random = Math.random } = {}) {
  const queue = state.queue.filter((track) => track.id === state.track.id || isPlayable(track.id))
  const currentIndex = queue.findIndex((track) => track.id === state.track.id)

  if (direction > 0 && state.shuffle && queue.length > 1) {
    const pinned = queue.slice(currentIndex + 1).find((track) => state.pinnedNextIds?.includes(track.id))
    if (pinned) return pinned
    const candidates = queue.filter((track) => track.id !== state.track.id)
    return candidates[Math.floor(random() * candidates.length)]
  }

  let nextIndex = currentIndex + direction
  if (nextIndex < 0 || nextIndex >= queue.length) {
    if (state.repeatMode !== 'all' || !queue.length) return null
    nextIndex = (nextIndex + queue.length) % queue.length
  }
  return queue[nextIndex]
}

// 044-FR-002: dòng đang hát là dòng cuối cùng có mốc thời gian không vượt quá vị trí phát; -1 khi chưa tới dòng đầu.
export const findActiveLyricIndex = (lines, elapsed) => (
  Array.isArray(lines) ? lines.findLastIndex((line) => elapsed >= line.time) : -1
)
