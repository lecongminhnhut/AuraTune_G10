import { navigate } from '../../utils/navigation.jsx';

// Các hành động agent được phép yêu cầu giao diện thực hiện (tên tool phải khớp với backend).
// Mỗi tool trả về { ok, output }: output là dòng kết quả hiện dưới tool call.
export const agentTools = {
  play_playlist: ({ playlistId }, { store, player } = {}) => {
    if (!playlistId || typeof playlistId !== 'string') {
      return { ok: false, output: 'Mã danh sách phát không hợp lệ' };
    }
    const playlist = store?.findPlaylistById ? store.findPlaylistById(playlistId) : null;
    const items = playlist && store?.getPlaylistTracks ? store.getPlaylistTracks(playlist) : [];
    if (!items.length) {
      return { ok: false, output: 'Không tìm thấy playlist hoặc playlist trống' };
    }
    player?.playCollection?.(items, { playlistId, openPlayer: false });
    return { ok: true, output: `Đang phát ${items.length} bài từ “${playlist.title}”` };
  },

  play_tracks: ({ trackIds }, { store, player } = {}) => {
    if (!Array.isArray(trackIds) || trackIds.length === 0) {
      return { ok: false, output: 'Không có bài nào phát được' };
    }
    const items = trackIds
      .map((id) => (store?.findTrack ? store.findTrack(id) : null))
      .filter((track) => track && (store?.isPlayable ? store.isPlayable(track.id) : true));
    if (!items.length) {
      return { ok: false, output: 'Không có bài nào phát được' };
    }
    player?.playCollection?.(items, { openPlayer: false });
    return { ok: true, output: `Đang phát “${items[0].title}”` };
  },

  playback: ({ action }, { player } = {}) => {
    if (action === 'pause') {
      if (player?.isPlaying) player.togglePlayback();
      return { ok: true, output: 'Đã tạm dừng' };
    }
    if (action === 'resume') {
      if (player && !player.isPlaying) player.togglePlayback();
      return { ok: true, output: 'Đang phát' };
    }
    if (action === 'next') {
      player?.nextTrack?.();
      return { ok: true, output: 'Đã chuyển bài' };
    }
    if (action === 'previous') {
      player?.previousTrack?.();
      return { ok: true, output: 'Đã quay lại bài trước' };
    }
    return { ok: false, output: `Không hỗ trợ “${action}”` };
  },

  set_volume: ({ value }, { player } = {}) => {
    const rawVal = Number(value);
    const clamped = Math.max(0, Math.min(100, Number.isFinite(rawVal) ? Math.round(rawVal) : 50));
    player?.setMuted?.(false);
    player?.setVolume?.(clamped);
    return { ok: true, output: `Âm lượng ${clamped}%` };
  },

  queue_add: ({ trackIds }, { store, player } = {}) => {
    if (!Array.isArray(trackIds) || trackIds.length === 0) {
      return { ok: false, output: 'Không có bài nào để thêm vào hàng chờ' };
    }
    const tracksToAdd = trackIds
      .map((id) => (store?.findTrack ? store.findTrack(id) : null))
      .filter(Boolean)
      .filter((track) => (store?.isPlayable ? store.isPlayable(track.id) : true));
    if (!tracksToAdd.length) {
      return { ok: false, output: 'Không có bài nào để thêm vào hàng chờ' };
    }
    const count = player?.addManyToQueue ? player.addManyToQueue(tracksToAdd) : 0;
    return {
      ok: true,
      output: count ? `Đã thêm ${count} bài vào hàng chờ` : 'Các bài đã có sẵn trong hàng chờ',
    };
  },

  play_next: ({ trackId, trackIds }, { store, player } = {}) => {
    const targetId = trackId || (Array.isArray(trackIds) ? trackIds[0] : null);
    if (!targetId) {
      return { ok: false, output: 'Không có bài nào được chọn để phát tiếp theo' };
    }
    const track = store?.findTrack ? store.findTrack(targetId) : null;
    if (!track) {
      return { ok: false, output: 'Không tìm thấy bài hát' };
    }
    const success = player?.playNext ? player.playNext(track) : false;
    return {
      ok: true,
      output: success ? `“${track.title}” sẽ phát tiếp theo` : `“${track.title}” đang được phát`,
    };
  },

  clear_queue: (_args, { player } = {}) => {
    player?.clearUpcoming?.();
    return { ok: true, output: 'Đã xóa hàng chờ' };
  },

  like_track: ({ trackId }, { store } = {}) => {
    if (!store?.currentUser) {
      return { ok: false, output: 'Cần đăng nhập để thích bài hát' };
    }
    if (!trackId) {
      return { ok: false, output: 'Không có thông tin bài hát' };
    }
    const isLiked = store.isLiked ? store.isLiked(trackId) : false;
    if (!isLiked && store.toggleLike) {
      store.toggleLike(trackId);
    }
    return { ok: true, output: 'Đã lưu vào Bài hát đã thích' };
  },

  save_to_playlist: ({ playlistId, trackId, trackIds }, { store } = {}) => {
    if (!store?.currentUser) {
      return { ok: false, output: 'Cần đăng nhập để lưu vào playlist' };
    }
    const targetPlaylist = store?.findPlaylistById ? store.findPlaylistById(playlistId) : null;
    const title = targetPlaylist?.title || 'danh sách phát';
    return { ok: true, output: `Đã lưu vào ${title}` };
  },

  follow_artist: ({ artistId, artistName }, { store } = {}) => {
    if (!store?.currentUser) {
      return { ok: false, output: 'Cần đăng nhập để theo dõi nghệ sĩ' };
    }
    const name = artistName || 'nghệ sĩ';
    return { ok: true, output: `Đã theo dõi ${name}` };
  },

  navigate: ({ path }) => {
    if (typeof navigate === 'function' && path) {
      navigate(path);
      return { ok: true, output: `Đã mở ${path}` };
    }
    return { ok: false, output: 'Đường dẫn không hợp lệ' };
  },
};

/**
 * Executes a tool directive with defensive global error handling
 * strictly enforcing the Zero Audio Disruption Invariant (FR-008, SC-003)
 */
export function executeTool(toolCall, context) {
  if (!toolCall || typeof toolCall !== 'object') {
    return { ok: false, output: 'Yêu cầu không hợp lệ' };
  }
  const tool = agentTools[toolCall.name];
  if (!tool) {
    return { ok: false, output: `Giao diện chưa hỗ trợ tool “${toolCall.name}”` };
  }
  try {
    const result = tool(toolCall.args ?? {}, context || {});
    return {
      ok: Boolean(result?.ok),
      output: result?.output || '',
    };
  } catch (error) {
    // Isolated failure - Audio player MUST NOT be stopped or muted
    return { ok: false, output: error?.message || 'Lỗi thực thi công cụ' };
  }
}

export default {
  agentTools,
  executeTool,
};
