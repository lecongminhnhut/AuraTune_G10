/**
 * Mock Service Adapter for Mood & Context Recommendations (Feature 103)
 * Provides offline mock responses conforming to OpenAPI schema.
 * Strictly returns 'song' and 'playlist' entities only (FR-003).
 */

import { tracks as mockTracks, playlists as mockPlaylists } from '../../utils/mockData.js';

export const MOCK_PRESET_TAGS = [
  { id: 'chill', label: 'Chill / Thư giãn', category: 'mood', icon: 'coffee', color_gradient: 'from-teal-500 to-emerald-700' },
  { id: 'energetic', label: 'Năng lượng / Hưng phấn', category: 'mood', icon: 'zap', color_gradient: 'from-amber-500 to-orange-600' },
  { id: 'melancholy', label: 'Trầm lắng / U buồn', category: 'mood', icon: 'cloud-rain', color_gradient: 'from-indigo-600 to-blue-900' },
  { id: 'focus', label: 'Tập trung', category: 'mood', icon: 'target', color_gradient: 'from-violet-600 to-purple-800' },
  { id: 'study_work', label: 'Học tập / Làm việc', category: 'context', icon: 'book-open', color_gradient: 'from-cyan-600 to-blue-700' },
  { id: 'workout', label: 'Tập luyện / Thể thao', category: 'context', icon: 'flame', color_gradient: 'from-rose-500 to-red-700' },
  { id: 'late_night', label: 'Đêm muộn', category: 'context', icon: 'moon', color_gradient: 'from-purple-900 to-slate-950' },
  { id: 'travel_commute', label: 'Di chuyển / Đi lại', category: 'context', icon: 'compass', color_gradient: 'from-sky-500 to-indigo-700' },
];

const ALTERNATIVE_SUGGESTIONS_MAP = {
  chill: ['focus', 'late_night', 'study_work'],
  energetic: ['workout', 'travel_commute', 'chill'],
  melancholy: ['chill', 'focus', 'late_night'],
  focus: ['study_work', 'chill', 'late_night'],
  study_work: ['focus', 'chill', 'late_night'],
  workout: ['energetic', 'focus', 'travel_commute'],
  late_night: ['chill', 'melancholy', 'focus'],
  travel_commute: ['energetic', 'chill', 'workout'],
};

const TAG_ITEMS_MAPPING = {
  chill: [
    {
      id: 't8',
      type: 'song',
      title: 'Midnight Coffee',
      subtitle: 'AuraTune Studio',
      image_url: 'ocean',
      badge: 'Chill',
      target_id: 't8',
      extra: {
        duration: 204,
        audio_url: '/api/v1/songs/t8/stream',
        artist_id: 'auratune-studio',
      },
    },
    {
      id: 'lofi-chill',
      type: 'playlist',
      title: 'Lofi bên cửa sổ',
      subtitle: 'AuraTune Curators',
      image_url: 'ocean',
      badge: 'Chill Playlist',
      target_id: 'lofi-chill',
      extra: {
        track_count: 32,
        is_official: true,
      },
    },
    {
      id: 't9',
      type: 'song',
      title: 'Rainy Window',
      subtitle: 'AuraTune Studio',
      image_url: 'night',
      badge: 'Chill',
      target_id: 't9',
      extra: {
        duration: 178,
        audio_url: '/api/v1/songs/t9/stream',
        artist_id: 'auratune-studio',
      },
    },
    {
      id: 't1',
      type: 'song',
      title: 'Nàng thơ',
      subtitle: 'Hoàng Dũng',
      image_url: 'rose',
      badge: 'Acoustic Chill',
      target_id: 't1',
      extra: {
        duration: 261,
        audio_url: '/api/v1/songs/t1/stream',
        artist_id: 'hoang-dung',
      },
    },
  ],
  energetic: [
    {
      id: 't4',
      type: 'song',
      title: 'Bật Tình Yêu Lên',
      subtitle: 'Tăng Duy Tân, Hòa Minzy',
      image_url: 'sunset',
      badge: 'Năng lượng',
      target_id: 't4',
      extra: {
        duration: 198,
        audio_url: '/api/v1/songs/t4/stream',
        artist_id: 'tang-duy-tan',
      },
    },
    {
      id: 'aura-mix',
      type: 'playlist',
      title: 'Aura Mix Hàng Ngày',
      subtitle: 'AuraTune Curators',
      image_url: 'aurora',
      badge: 'Upbeat Playlist',
      target_id: 'aura-mix',
      extra: {
        track_count: 50,
        is_official: true,
      },
    },
    {
      id: 't5',
      type: 'song',
      title: 'Cắt Đôi Nỗi Sầu',
      subtitle: 'Tăng Duy Tân',
      image_url: 'night',
      badge: 'Năng lượng',
      target_id: 't5',
      extra: {
        duration: 185,
        audio_url: '/api/v1/songs/t5/stream',
        artist_id: 'tang-duy-tan',
      },
    },
  ],
  melancholy: [], // Empty matches fixture to test US2 (AF-02)
  focus: [
    {
      id: 't10',
      type: 'song',
      title: 'Coding at 2 AM',
      subtitle: 'AuraTune Studio',
      image_url: 'violet',
      badge: 'Tập trung',
      target_id: 't10',
      extra: {
        duration: 222,
        audio_url: '/api/v1/songs/t10/stream',
        artist_id: 'auratune-studio',
      },
    },
    {
      id: 'deep-focus',
      type: 'playlist',
      title: 'Deep Focus Ambient',
      subtitle: 'AuraTune Curators',
      image_url: 'forest',
      badge: 'Focus Playlist',
      target_id: 'deep-focus',
      extra: {
        track_count: 40,
        is_official: true,
      },
    },
    {
      id: 't8',
      type: 'song',
      title: 'Midnight Coffee',
      subtitle: 'AuraTune Studio',
      image_url: 'ocean',
      badge: 'Tập trung',
      target_id: 't8',
      extra: {
        duration: 204,
        audio_url: '/api/v1/songs/t8/stream',
        artist_id: 'auratune-studio',
      },
    },
  ],
  study_work: [
    {
      id: 'deep-focus',
      type: 'playlist',
      title: 'Deep Focus Ambient',
      subtitle: 'AuraTune Curators',
      image_url: 'forest',
      badge: 'Làm việc',
      target_id: 'deep-focus',
      extra: {
        track_count: 40,
        is_official: true,
      },
    },
    {
      id: 't10',
      type: 'song',
      title: 'Coding at 2 AM',
      subtitle: 'AuraTune Studio',
      image_url: 'violet',
      badge: 'Làm việc',
      target_id: 't10',
      extra: {
        duration: 222,
        audio_url: '/api/v1/songs/t10/stream',
        artist_id: 'auratune-studio',
      },
    },
  ],
  workout: [
    {
      id: 't4',
      type: 'song',
      title: 'Bật Tình Yêu Lên',
      subtitle: 'Tăng Duy Tân, Hòa Minzy',
      image_url: 'sunset',
      badge: 'Thể thao',
      target_id: 't4',
      extra: {
        duration: 198,
        audio_url: '/api/v1/songs/t4/stream',
        artist_id: 'tang-duy-tan',
      },
    },
    {
      id: 'aura-mix',
      type: 'playlist',
      title: 'Aura Mix Hàng Ngày',
      subtitle: 'AuraTune Curators',
      image_url: 'aurora',
      badge: 'Workout Playlist',
      target_id: 'aura-mix',
      extra: {
        track_count: 50,
        is_official: true,
      },
    },
  ],
  late_night: [
    {
      id: 'lofi-chill',
      type: 'playlist',
      title: 'Lofi bên cửa sổ',
      subtitle: 'AuraTune Curators',
      image_url: 'ocean',
      badge: 'Đêm muộn',
      target_id: 'lofi-chill',
      extra: {
        track_count: 32,
        is_official: true,
      },
    },
    {
      id: 't9',
      type: 'song',
      title: 'Rainy Window',
      subtitle: 'AuraTune Studio',
      image_url: 'night',
      badge: 'Đêm muộn',
      target_id: 't9',
      extra: {
        duration: 178,
        audio_url: '/api/v1/songs/t9/stream',
        artist_id: 'auratune-studio',
      },
    },
  ],
  travel_commute: [
    {
      id: 't1',
      type: 'song',
      title: 'Nàng thơ',
      subtitle: 'Hoàng Dũng',
      image_url: 'rose',
      badge: 'Trên đường',
      target_id: 't1',
      extra: {
        duration: 261,
        audio_url: '/api/v1/songs/t1/stream',
        artist_id: 'hoang-dung',
      },
    },
    {
      id: 'indie-viet',
      type: 'playlist',
      title: 'Indie Việt Nổi Bật',
      subtitle: 'AuraTune Curators',
      image_url: 'night',
      badge: 'Du lịch',
      target_id: 'indie-viet',
      extra: {
        track_count: 28,
        is_official: true,
      },
    },
  ],
};

export async function mockGetMoodContextTags() {
  return {
    success: true,
    message: 'Danh sách nhãn tâm trạng và ngữ cảnh',
    data: {
      tags: MOCK_PRESET_TAGS,
    },
    error: null,
  };
}

export async function mockGetMoodContextRecommendations(tag, { type = 'all', limit = 20 } = {}) {
  const normTag = (tag || '').trim().toLowerCase();

  const foundTag = MOCK_PRESET_TAGS.find((t) => t.id === normTag);
  if (!foundTag) {
    return {
      success: false,
      message: 'Nhãn tâm trạng hoặc ngữ cảnh không hợp lệ',
      data: null,
      error: {
        code: 'INVALID_MOOD_TAG',
        details: [
          'Tag must be one of: chill, energetic, melancholy, focus, study_work, workout, late_night, travel_commute',
        ],
      },
    };
  }

  let rawItems = TAG_ITEMS_MAPPING[normTag] ? [...TAG_ITEMS_MAPPING[normTag]] : [];

  if (type && type !== 'all') {
    rawItems = rawItems.filter((item) => item.type === type);
  }

  const items = rawItems.slice(0, limit);
  const alternatives = ALTERNATIVE_SUGGESTIONS_MAP[normTag] || ['chill', 'focus'];

  return {
    success: true,
    message:
      items.length > 0
        ? `Gợi ý âm nhạc theo ${foundTag.category === 'context' ? 'ngữ cảnh' : 'tâm trạng'} ${normTag}`
        : 'Hiện chưa có bài hát phù hợp với tâm trạng này',
    data: {
      tag: normTag,
      tag_category: foundTag.category,
      is_service_degraded: false,
      total_items: items.length,
      items,
      alternative_suggestions: items.length === 0 ? alternatives : [],
      generated_at: new Date().toISOString(),
    },
    error: null,
  };
}

export default {
  mockGetMoodContextTags,
  mockGetMoodContextRecommendations,
  MOCK_PRESET_TAGS,
};
