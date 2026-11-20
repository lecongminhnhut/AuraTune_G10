import { tracks as mockTracks, albums as mockAlbums, artists as mockArtists, playlists as mockPlaylists } from '../../utils/mockData.js';

export const mockPersonalizedItems = [
  {
    id: 't1',
    type: 'song',
    title: 'Nàng thơ',
    subtitle: 'Hoàng Dũng',
    image_url: 'rose',
    badge: 'Gợi ý',
    target_id: 't1',
    extra: {
      duration: 261,
      audio_url: '/api/v1/songs/t1/stream',
      artist_id: 'hoang-dung',
      album_id: 'al-25',
    },
  },
  {
    id: 'lofi-chill',
    type: 'playlist',
    title: 'Lofi bên cửa sổ',
    subtitle: 'AuraTune Curators',
    image_url: 'ocean',
    badge: 'Gợi ý',
    target_id: 'lofi-chill',
    extra: {
      track_count: 32,
      is_official: true,
    },
  },
  {
    id: 'vu',
    type: 'artist',
    title: 'Vũ.',
    subtitle: 'Nghệ sĩ Indie Pop',
    image_url: 'night',
    badge: 'Gợi ý',
    target_id: 'vu',
    extra: {
      follower_count: 128500,
    },
  },
  {
    id: 'al-25',
    type: 'album',
    title: '25',
    subtitle: 'Hoàng Dũng',
    image_url: 'rose',
    badge: 'Gợi ý',
    target_id: 'al-25',
    extra: {
      artist_id: 'hoang-dung',
      track_count: 9,
      release_year: 2022,
    },
  },
  {
    id: 't2',
    type: 'song',
    title: 'Bước qua mùa cô đơn',
    subtitle: 'Vũ.',
    image_url: 'night',
    badge: 'Gợi ý',
    target_id: 't2',
    extra: {
      duration: 248,
      audio_url: '/api/v1/songs/t2/stream',
      artist_id: 'vu',
      album_id: 'al-mot-van-nam',
    },
  },
];

export const mockPopularFallbackItems = [
  {
    id: 't1',
    type: 'song',
    title: 'Nàng thơ',
    subtitle: 'Hoàng Dũng',
    image_url: 'rose',
    badge: 'Phổ biến',
    target_id: 't1',
    extra: {
      duration: 261,
      audio_url: '/api/v1/songs/t1/stream',
      artist_id: 'hoang-dung',
      album_id: 'al-25',
    },
  },
  {
    id: 't2',
    type: 'song',
    title: 'Bước qua mùa cô đơn',
    subtitle: 'Vũ.',
    image_url: 'night',
    badge: 'Phổ biến',
    target_id: 't2',
    extra: {
      duration: 248,
      audio_url: '/api/v1/songs/t2/stream',
      artist_id: 'vu',
      album_id: 'al-mot-van-nam',
    },
  },
  {
    id: 'aura-mix',
    type: 'playlist',
    title: 'Aura Mix hôm nay',
    subtitle: 'Tuyển tập thịnh hành',
    image_url: 'aurora',
    badge: 'Thịnh hành',
    target_id: 'aura-mix',
    extra: {
      track_count: 24,
      is_official: true,
    },
  },
  {
    id: 'lofi-chill',
    type: 'playlist',
    title: 'Lofi bên cửa sổ',
    subtitle: 'AuraTune Official',
    image_url: 'ocean',
    badge: 'Thịnh hành',
    target_id: 'lofi-chill',
    extra: {
      track_count: 32,
      is_official: true,
    },
  },
];

/**
 * Mock generator for personalized recommendations
 */
export function getMockPersonalizedRecommendations({
  type = 'all',
  limit = 20,
  userId = 'u-demo',
  options = {},
} = {}) {
  let history = options.history;

  if (!history && typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem('auratune-demo-state-v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        history = parsed.libraries?.[userId]?.history || parsed.libraries?.['u-demo']?.history || [];
      }
    } catch {
      history = [];
    }
  }

  const qualifyingPlays = (history || []).filter(
    (h) => (h.listened ?? h.listened_duration ?? 0) >= 30
  );

  const isColdStart =
    options.forceColdStart ||
    (!options.forcePersonalized && qualifyingPlays.length < 3);

  const isAiOutage = options.forceAiDowntime;

  if (isAiOutage) {
    const items = filterByType(mockPopularFallbackItems, type).slice(0, limit);
    return {
      success: true,
      message: 'Hiển thị nội dung thịnh hành do hệ thống gợi ý đang bảo trì',
      data: {
        user_id: userId,
        is_fallback: true,
        fallback_reason: 'AI_SERVICE_UNAVAILABLE',
        message: 'Hiển thị nội dung thịnh hành do hệ thống gợi ý đang bảo trì',
        generated_at: new Date().toISOString(),
        total_items: items.length,
        items,
      },
      error: null,
    };
  }

  if (isColdStart) {
    const items = filterByType(mockPopularFallbackItems, type).slice(0, limit);
    return {
      success: true,
      message: 'Nội dung phổ biến trên AuraTune',
      data: {
        user_id: userId,
        is_fallback: true,
        fallback_reason: 'COLD_START',
        message: null,
        generated_at: new Date().toISOString(),
        total_items: items.length,
        items,
      },
      error: null,
    };
  }

  const items = filterByType(mockPersonalizedItems, type).slice(0, limit);
  return {
    success: true,
    message: 'Danh sách gợi ý cá nhân hóa',
    data: {
      user_id: userId,
      is_fallback: false,
      fallback_reason: null,
      message: null,
      generated_at: new Date().toISOString(),
      total_items: items.length,
      items,
    },
    error: null,
  };
}

function filterByType(items, type) {
  if (!type || type === 'all') return items;
  return items.filter((item) => item.type === type);
}

export default {
  getMockPersonalizedRecommendations,
  mockPersonalizedItems,
  mockPopularFallbackItems,
};
