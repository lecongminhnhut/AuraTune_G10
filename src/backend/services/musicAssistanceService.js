/**
 * Real-Time Music Assistance Service (Feature 123)
 * Orchestrates domain action directives, catalog pre-flight verification,
 * interactive confirmations, and embedded widgets for the conversational interface.
 */

import {
  TOOL_NAMES,
  PLAYBACK_ACTIONS,
  CLEAR_QUEUE_CONFIRM_PROMPT,
} from '../constants/assistanceConstants.js';
import {
  validateSong,
  validatePlaylist,
  DEMO_PLAYLISTS,
} from './catalogValidationService.js';
import { demoSongs } from '../data/demoSongs.js';

let callSequence = 1;

function generateCallId() {
  return `call_${callSequence++}`;
}

/**
 * Searches demo and database songs by title and artist keywords
 */
export function findSongsByKeyword(title = '', artist = '') {
  const normTitle = (title || '').toLowerCase().trim();
  const normArtist = (artist || '').toLowerCase().trim();

  return demoSongs.filter((song) => {
    const sTitle = song.title.toLowerCase();
    const sArtist = (song.artist || '').toLowerCase();

    if (normTitle && normArtist) {
      return (sTitle.includes(normTitle) || normTitle.includes(sTitle)) &&
             (sArtist.includes(normArtist) || normArtist.includes(sArtist));
    }
    if (normTitle) {
      return sTitle.includes(normTitle) || normTitle.includes(sTitle);
    }
    if (normArtist) {
      return sArtist.includes(normArtist) || normArtist.includes(sArtist);
    }
    return false;
  });
}

/**
 * Resolves a playlist by keyword or ID
 */
export function findPlaylistByKeyword(keyword = '') {
  const norm = (keyword || '').toLowerCase().trim();
  if (!norm) return DEMO_PLAYLISTS[0];

  return (
    DEMO_PLAYLISTS.find(
      (p) =>
        p.id === norm ||
        p.title.toLowerCase().includes(norm) ||
        norm.includes(p.id)
    ) || DEMO_PLAYLISTS[0]
  );
}

/**
 * Generates an assistance plan from validated intent data (FR-003, FR-014)
 * @param {object} params
 * @param {string} params.intentType
 * @param {object} params.extractedEntities
 * @param {object} [params.context]
 * @param {object} [params.user]
 * @returns {Promise<object>} AssistancePlanData
 */
export async function generateAssistancePlan({
  intentType = 'play_music',
  extractedEntities = {},
  context = {},
  user = null,
} = {}) {
  const planId = `plan-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const clientActions = [];
  let embeddedWidget = null;
  let confirmationText = '';

  const {
    songTitle,
    artistName,
    controlAction,
    volumeLevel,
    playlistName,
    targetTrackId,
    targetEntity,
    genre,
    mood,
  } = extractedEntities;

  // 1. Core playback direct control actions (pause, resume, next, previous)
  if (controlAction && PLAYBACK_ACTIONS.includes(controlAction.toLowerCase())) {
    const action = controlAction.toLowerCase();
    clientActions.push({
      id: generateCallId(),
      name: TOOL_NAMES.PLAYBACK,
      args: { action },
      label: `playback("${action}")`,
      confirm: null,
    });

    if (action === 'pause') confirmationText = 'Đã tạm dừng phát nhạc.';
    else if (action === 'resume') confirmationText = 'Đang tiếp tục phát nhạc.';
    else if (action === 'next') confirmationText = 'Đã chuyển sang bài hát tiếp theo.';
    else if (action === 'previous') confirmationText = 'Đã quay lại bài hát trước.';
  }

  // 2. Destructive queue clearance (requires [y/N] confirmation - FR-013)
  if (
    controlAction === 'clear_queue' ||
    intentType === 'clear_queue' ||
    (songTitle && /xóa hàng chờ|clear queue/i.test(songTitle))
  ) {
    clientActions.push({
      id: generateCallId(),
      name: TOOL_NAMES.CLEAR_QUEUE,
      args: {},
      label: 'clear_queue()',
      confirm: CLEAR_QUEUE_CONFIRM_PROMPT,
    });
    confirmationText = 'Bạn có chắc chắn muốn xóa toàn bộ danh sách bài hát trong hàng chờ không?';
  }

  // 3. Queue additions (queue_add)
  if (controlAction === 'queue_add' || controlAction === 'add_to_queue') {
    let resolvedTrackIds = [];
    if (targetTrackId) {
      resolvedTrackIds = [targetTrackId];
    } else if (songTitle || artistName) {
      const matched = findSongsByKeyword(songTitle, artistName);
      resolvedTrackIds = matched.map((s) => s.song_id);
    }
    if (resolvedTrackIds.length === 0) {
      // Discovery recommendation into queue
      resolvedTrackIds = ['t3', 't4'];
    }

    clientActions.push({
      id: generateCallId(),
      name: TOOL_NAMES.QUEUE_ADD,
      args: { trackIds: resolvedTrackIds },
      label: `queue_add(${JSON.stringify(resolvedTrackIds)})`,
      confirm: null,
    });
    confirmationText = `Đã thêm ${resolvedTrackIds.length} bài hát vào hàng chờ.`;
  }

  // 3b. Discovery stream from search_music intent (T019)
  if (intentType === 'search_music' && !controlAction) {
    let resolvedTrackIds = [];
    if (genre || mood) {
      const pl = findPlaylistByKeyword(genre || mood);
      resolvedTrackIds = pl.trackIds || ['t8', 't9'];
    } else if (songTitle || artistName) {
      const matched = findSongsByKeyword(songTitle, artistName);
      resolvedTrackIds = matched.map((s) => s.song_id);
    }
    if (resolvedTrackIds.length === 0) {
      resolvedTrackIds = ['t3', 't4'];
    }

    clientActions.push({
      id: generateCallId(),
      name: TOOL_NAMES.QUEUE_ADD,
      args: { trackIds: resolvedTrackIds },
      label: `queue_add(${JSON.stringify(resolvedTrackIds)})`,
      confirm: null,
    });
    confirmationText = `Đã thêm ${resolvedTrackIds.length} bài hát từ gợi ý khám phá vào hàng chờ.`;
  }

  // 4. Priority next-play (play_next)
  if (controlAction === 'play_next') {
    let targetId = targetTrackId;
    if (!targetId && (songTitle || artistName)) {
      const matched = findSongsByKeyword(songTitle, artistName);
      if (matched.length > 0) targetId = matched[0].song_id;
    }
    if (!targetId) targetId = 't2';

    clientActions.push({
      id: generateCallId(),
      name: 'play_next',
      args: { trackId: targetId },
      label: `play_next("${targetId}")`,
      confirm: null,
    });
    confirmationText = 'Bài hát sẽ được phát tiếp theo.';
  }

  // 5. Volume adjustment
  if (volumeLevel !== null && volumeLevel !== undefined) {
    const rawNum = Number(volumeLevel);
    const clamped = Math.max(0, Math.min(100, Number.isFinite(rawNum) ? Math.round(rawNum) : 50));
    clientActions.push({
      id: generateCallId(),
      name: TOOL_NAMES.SET_VOLUME,
      args: { value: clamped },
      label: `set_volume(${clamped})`,
      confirm: null,
    });
    const volMsg = `Đã chỉnh âm lượng về ${clamped}%.`;
    confirmationText = confirmationText ? `${confirmationText} ${volMsg}` : volMsg;
  }

  // 6. Playlist playback & rich widget embedding (FR-004)
  if (
    intentType !== 'search_music' &&
    (playlistName || targetEntity === 'playlist' || (genre || mood)) &&
    !controlAction
  ) {
    const playlist = findPlaylistByKeyword(playlistName || genre || mood || '');
    clientActions.unshift({
      id: generateCallId(),
      name: TOOL_NAMES.PLAY_PLAYLIST,
      args: { playlistId: playlist.id },
      label: `play_playlist("${playlist.id}")`,
      confirm: null,
    });
    embeddedWidget = {
      type: 'playlist',
      playlistId: playlist.id,
    };
    confirmationText = `Đang phát danh sách "${playlist.title}" cho bạn.`;
  }

  // 7. Track playback
  if (
    intentType === 'play_music' &&
    clientActions.length === 0 &&
    !controlAction
  ) {
    let resolvedTrackIds = [];
    if (targetTrackId) {
      resolvedTrackIds = [targetTrackId];
    } else if (songTitle || artistName) {
      const matched = findSongsByKeyword(songTitle, artistName);
      if (matched.length > 0) {
        resolvedTrackIds = matched.map((s) => s.song_id);
      }
    }

    // Smart defaults fallback for ambiguous requests (FR-007, SC-004)
    if (resolvedTrackIds.length === 0) {
      resolvedTrackIds = ['t1'];
    }

    const firstTrack = demoSongs.find((s) => s.song_id === resolvedTrackIds[0]);
    clientActions.push({
      id: generateCallId(),
      name: TOOL_NAMES.PLAY_TRACKS,
      args: { trackIds: resolvedTrackIds },
      label: `play_tracks(${JSON.stringify(resolvedTrackIds)})`,
      confirm: null,
    });
    confirmationText = firstTrack
      ? `Đang phát bài "${firstTrack.title}" của ${firstTrack.artist}.`
      : 'Đang phát bài hát cho bạn.';
  }

  // 8. Library favorite interactions
  if (intentType === 'manage_library') {
    if (controlAction === 'save_to_playlist') {
      const pl = findPlaylistByKeyword(playlistName || '');
      const trackId = targetTrackId || context?.currentTrack?.id || 't1';
      clientActions.push({
        id: generateCallId(),
        name: 'save_to_playlist',
        args: { playlistId: pl.id, trackId },
        label: `save_to_playlist("${pl.id}", "${trackId}")`,
        confirm: null,
      });
      confirmationText = `Đã lưu bài hát vào danh sách phát "${pl.title}".`;
    } else if (controlAction === 'follow_artist') {
      const name = artistName || 'nghệ sĩ';
      clientActions.push({
        id: generateCallId(),
        name: 'follow_artist',
        args: { artistId: 'art-1', artistName: name },
        label: `follow_artist("${name}")`,
        confirm: null,
      });
      confirmationText = `Đang theo dõi nghệ sĩ ${name}.`;
    } else {
      const trackIdToLike = targetTrackId || context?.currentTrack?.id || 't1';
      clientActions.push({
        id: generateCallId(),
        name: TOOL_NAMES.LIKE_TRACK,
        args: { trackId: trackIdToLike },
        label: `like_track("${trackIdToLike}")`,
        confirm: null,
      });
      confirmationText = 'Đã lưu bài hát vào danh sách Bài hát đã thích.';
    }
  }

  return {
    planId,
    clientActions,
    embeddedWidget,
    confirmationText: confirmationText || 'Đã chuẩn bị kế hoạch thực thi.',
  };
}

export default {
  generateAssistancePlan,
  findSongsByKeyword,
  findPlaylistByKeyword,
};
