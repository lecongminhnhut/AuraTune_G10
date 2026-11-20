import { getDurationSeconds } from './playback.js'

// Lưu và khôi phục trạng thái trình phát trong localStorage (045-FR-012, 051-FR-011).
// Chỉ lưu mã bài hát; khi khôi phục, bài hát được tra lại từ kho dữ liệu hiện tại và
// luôn ở trạng thái tạm dừng. Âm lượng cố ý không được lưu qua lần tải lại trang.

export const PLAYER_STORAGE_KEY = 'auratune:player'
const VERSION = 1
const REPEAT_MODES = ['off', 'all', 'one']

export function browserStorage() {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

export function savePlayerSnapshot(storage, state) {
  if (!storage) return
  const snapshot = {
    v: VERSION,
    trackId: state.track.id,
    queueIds: state.queue.map((track) => track.id),
    playlistId: state.playlistId ?? null,
    elapsed: Math.floor(state.elapsed),
    shuffle: state.shuffle,
    repeatMode: state.repeatMode,
    pinnedNextIds: state.pinnedNextIds ?? [],
  }
  try {
    storage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(snapshot))
  } catch {
    // Bộ nhớ đầy hoặc trình duyệt chặn lưu trữ: trình phát vẫn hoạt động, chỉ không khôi phục được.
  }
}

export function loadPlayerSnapshot(storage, { findTrack, isPlayable = () => true }) {
  let snapshot
  try {
    snapshot = JSON.parse(storage?.getItem(PLAYER_STORAGE_KEY) ?? 'null')
  } catch {
    return null
  }
  if (!snapshot || snapshot.v !== VERSION || typeof snapshot.trackId !== 'string') return null

  const track = findTrack(snapshot.trackId)
  if (!track || !isPlayable(track.id)) return null

  const seen = new Set()
  const queue = (Array.isArray(snapshot.queueIds) ? snapshot.queueIds : [])
    .map((id) => (typeof id === 'string' ? findTrack(id) : null))
    .filter((item) => item && !seen.has(item.id) && seen.add(item.id) && (item.id === track.id || isPlayable(item.id)))
  if (!queue.some((item) => item.id === track.id)) queue.unshift(track)

  const ids = new Set(queue.map((item) => item.id))
  const duration = getDurationSeconds(track.duration)
  const elapsed = Number.isFinite(snapshot.elapsed) ? Math.max(0, Math.min(snapshot.elapsed, Math.max(0, duration - 1))) : 0

  return {
    track,
    queue,
    playlistId: typeof snapshot.playlistId === 'string' ? snapshot.playlistId : null,
    elapsed,
    shuffle: snapshot.shuffle === true,
    repeatMode: REPEAT_MODES.includes(snapshot.repeatMode) ? snapshot.repeatMode : 'off',
    pinnedNextIds: Array.isArray(snapshot.pinnedNextIds) ? snapshot.pinnedNextIds.filter((id) => ids.has(id) && id !== track.id) : [],
  }
}
