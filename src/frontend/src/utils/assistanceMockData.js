/**
 * Mock fixtures for Real-Time Music Assistance (Feature 123)
 * Simulates tool directives, confirmation prompts, and embedded preview widgets
 */

export const mockAssistancePlans = {
  play_playback_track: {
    planId: 'plan-mock-play-01',
    clientActions: [
      {
        id: 'call_1',
        name: 'play_tracks',
        args: { trackIds: ['t1'] },
        label: 'play_tracks(["t1"])',
        confirm: null,
      },
    ],
    embeddedWidget: null,
    confirmationText: 'Đang phát bài hát cho bạn.',
  },
  play_lofi_playlist: {
    planId: 'plan-mock-playlist-01',
    clientActions: [
      {
        id: 'call_1',
        name: 'play_playlist',
        args: { playlistId: 'lofi-chill' },
        label: 'play_playlist("lofi-chill")',
        confirm: null,
      },
    ],
    embeddedWidget: {
      type: 'playlist',
      playlistId: 'lofi-chill',
    },
    confirmationText: 'Đang phát danh sách Lofi Chill.',
  },
  volume_adjustment: {
    planId: 'plan-mock-vol-01',
    clientActions: [
      {
        id: 'call_1',
        name: 'set_volume',
        args: { value: 40 },
        label: 'set_volume(40)',
        confirm: null,
      },
    ],
    embeddedWidget: null,
    confirmationText: 'Đã chỉnh âm lượng về 40%.',
  },
  destructive_clear_queue: {
    planId: 'plan-mock-clear-01',
    clientActions: [
      {
        id: 'call_1',
        name: 'clear_queue',
        args: {},
        label: 'clear_queue()',
        confirm: 'Xóa tất cả bài trong hàng chờ?',
      },
    ],
    embeddedWidget: null,
    confirmationText: 'Đã xóa toàn bộ hàng chờ.',
  },
  compound_queue_volume: {
    planId: 'plan-mock-compound-01',
    clientActions: [
      {
        id: 'call_1',
        name: 'queue_add',
        args: { trackIds: ['t3', 't4'] },
        label: 'queue_add(["t3", "t4"])',
        confirm: null,
      },
      {
        id: 'call_2',
        name: 'set_volume',
        args: { value: 60 },
        label: 'set_volume(60)',
        confirm: null,
      },
    ],
    embeddedWidget: null,
    confirmationText: 'Đã thêm nhạc vào hàng chờ và đặt âm lượng 60%.',
  },
  like_favorite_track: {
    planId: 'plan-mock-like-01',
    clientActions: [
      {
        id: 'call_1',
        name: 'like_track',
        args: { trackId: 't1' },
        label: 'like_track("t1")',
        confirm: null,
      },
    ],
    embeddedWidget: null,
    confirmationText: 'Đã lưu vào Bài hát đã thích.',
  },
};

export function getMockAssistancePlan(intentType = 'play_music', extractedEntities = {}) {
  if (extractedEntities?.controlAction === 'clear_queue' || intentType === 'clear_queue') {
    return mockAssistancePlans.destructive_clear_queue;
  }
  if (extractedEntities?.volumeLevel !== undefined && extractedEntities?.volumeLevel !== null) {
    return {
      planId: `plan-mock-${Date.now()}`,
      clientActions: [
        {
          id: 'call_1',
          name: 'set_volume',
          args: { value: extractedEntities.volumeLevel },
          label: `set_volume(${extractedEntities.volumeLevel})`,
          confirm: null,
        },
      ],
      embeddedWidget: null,
      confirmationText: `Đã chỉnh âm lượng về ${extractedEntities.volumeLevel}%.`,
    };
  }
  if (extractedEntities?.playlistName || extractedEntities?.targetEntity === 'playlist') {
    return mockAssistancePlans.play_lofi_playlist;
  }
  return mockAssistancePlans.play_playback_track;
}

export default {
  mockAssistancePlans,
  getMockAssistancePlan,
};
