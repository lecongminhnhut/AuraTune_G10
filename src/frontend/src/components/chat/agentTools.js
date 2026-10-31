import { navigate } from '../../utils/navigation.jsx'

// Các hành động agent được phép yêu cầu giao diện thực hiện (tên tool phải khớp với backend).
// Mỗi tool trả về { ok, output }: output là dòng kết quả hiện dưới tool call.
export const agentTools = {
  play_playlist: ({ playlistId }, { store, player }) => {
    const playlist = store.findPlaylistById(playlistId)
    const items = playlist ? store.getPlaylistTracks(playlist) : []
    if (!items.length) return { ok: false, output: 'Không tìm thấy playlist hoặc playlist trống' }
    player.playCollection(items, { playlistId, openPlayer: false })
    return { ok: true, output: `Đang phát ${items.length} bài từ “${playlist.title}”` }
  },
  play_tracks: ({ trackIds }, { store, player }) => {
    const items = trackIds.map(store.findTrack).filter((track) => track && store.isPlayable(track.id))
    if (!items.length) return { ok: false, output: 'Không có bài nào phát được' }
    player.playCollection(items, { openPlayer: false })
    return { ok: true, output: `Đang phát “${items[0].title}”` }
  },
  playback: ({ action }, { player }) => {
    if (action === 'pause') { if (player.isPlaying) player.togglePlayback(); return { ok: true, output: 'Đã tạm dừng' } }
    if (action === 'resume') { if (!player.isPlaying) player.togglePlayback(); return { ok: true, output: 'Đang phát' } }
    if (action === 'next') { player.nextTrack(); return { ok: true, output: 'Đã chuyển bài' } }
    if (action === 'previous') { player.previousTrack(); return { ok: true, output: 'Đã quay lại bài trước' } }
    return { ok: false, output: `Không hỗ trợ “${action}”` }
  },
  set_volume: ({ value }, { player }) => {
    player.setMuted(false)
    player.setVolume(value)
    return { ok: true, output: `Âm lượng ${value}%` }
  },
  queue_add: ({ trackIds }, { store, player }) => {
    const count = player.addManyToQueue(trackIds.map(store.findTrack).filter(Boolean))
    return { ok: true, output: count ? `Đã thêm ${count} bài vào hàng chờ` : 'Các bài đã có sẵn trong hàng chờ' }
  },
  clear_queue: (_args, { player }) => {
    player.clearUpcoming()
    return { ok: true, output: 'Đã xóa hàng chờ' }
  },
  like_track: ({ trackId }, { store }) => {
    if (!store.currentUser) return { ok: false, output: 'Cần đăng nhập để thích bài hát' }
    if (!store.isLiked(trackId)) store.toggleLike(trackId)
    return { ok: true, output: 'Đã lưu vào Bài hát đã thích' }
  },
  navigate: ({ path }) => {
    navigate(path)
    return { ok: true, output: `Đã mở ${path}` }
  },
}

export function executeTool(toolCall, context) {
  const tool = agentTools[toolCall.name]
  if (!tool) return { ok: false, output: `Giao diện chưa hỗ trợ tool “${toolCall.name}”` }
  try {
    return tool(toolCall.args ?? {}, context)
  } catch (error) {
    return { ok: false, output: error.message }
  }
}
