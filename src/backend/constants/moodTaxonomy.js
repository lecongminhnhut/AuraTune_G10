/**
 * AuraTune Mood & Context Taxonomy (Feature 103)
 * Exactly 8 curated preset tags: 4 Core Moods + 4 Activity Contexts
 */

export const MOOD_TAGS = ['chill', 'energetic', 'melancholy', 'focus'];
export const CONTEXT_TAGS = ['study_work', 'workout', 'late_night', 'travel_commute'];

export const ALL_TAG_IDS = [...MOOD_TAGS, ...CONTEXT_TAGS];

export const PRESET_TAGS = [
  {
    id: 'chill',
    label: 'Chill / Thư giãn',
    category: 'mood',
    icon: 'coffee',
    color_gradient: 'from-teal-500 to-emerald-700',
    description: 'Âm điệu thư thái, êm dịu giúp tái tạo năng lượng tích cực'
  },
  {
    id: 'energetic',
    label: 'Năng lượng / Hưng phấn',
    category: 'mood',
    icon: 'zap',
    color_gradient: 'from-amber-500 to-orange-600',
    description: 'Nhịp điệu bùng nổ, khuấy động tinh thần sảng khoái'
  },
  {
    id: 'melancholy',
    label: 'Trầm lắng / U buồn',
    category: 'mood',
    icon: 'cloud-rain',
    color_gradient: 'from-indigo-600 to-blue-900',
    description: 'Giai điệu sâu lắng vỗ về những khoảng lặng tâm hồn'
  },
  {
    id: 'focus',
    label: 'Tập trung',
    category: 'mood',
    icon: 'target',
    color_gradient: 'from-violet-600 to-purple-800',
    description: 'Âm nhạc định tâm hỗ trợ tối đa sự tập trung cao độ'
  },
  {
    id: 'study_work',
    label: 'Học tập / Làm việc',
    category: 'context',
    icon: 'book-open',
    color_gradient: 'from-cyan-600 to-blue-700',
    description: 'Không gian âm thanh lý tưởng khi ngồi vào bàn học và làm việc'
  },
  {
    id: 'workout',
    label: 'Tập luyện / Thể thao',
    category: 'context',
    icon: 'flame',
    color_gradient: 'from-rose-500 to-red-700',
    description: 'Tiết tấu dồn dập, đẩy nhịp tim và bứt phá giới hạn thể lực'
  },
  {
    id: 'late_night',
    label: 'Đêm muộn',
    category: 'context',
    icon: 'moon',
    color_gradient: 'from-purple-900 to-slate-950',
    description: 'Không gian tĩnh mịch, ru êm giấc ngủ và thư giãn đêm khuya'
  },
  {
    id: 'travel_commute',
    label: 'Di chuyển / Đi lại',
    category: 'context',
    icon: 'compass',
    color_gradient: 'from-sky-500 to-indigo-700',
    description: 'Bạn đồng hành trên mọi cung đường và chuyến đi xa'
  }
];

export const TAG_MAP = Object.freeze(
  PRESET_TAGS.reduce((acc, tag) => {
    acc[tag.id] = tag;
    return acc;
  }, {})
);

export const ALTERNATIVE_SUGGESTIONS_MAP = Object.freeze({
  chill: ['focus', 'late_night', 'study_work'],
  energetic: ['workout', 'travel_commute', 'chill'],
  melancholy: ['chill', 'focus', 'late_night'],
  focus: ['study_work', 'chill', 'late_night'],
  study_work: ['focus', 'chill', 'late_night'],
  workout: ['energetic', 'focus', 'travel_commute'],
  late_night: ['chill', 'melancholy', 'focus'],
  travel_commute: ['energetic', 'chill', 'workout']
});

export const DEFAULT_FALLBACK_SHORTCUTS = Object.freeze([
  { title: 'Bảng xếp hạng thịnh hành', target_url: '/explore' },
  { title: 'Tuyển tập đã thích', target_url: '/playlist/liked' }
]);

export function isValidMoodTag(tag) {
  return typeof tag === 'string' && ALL_TAG_IDS.includes(tag.trim().toLowerCase());
}

export function getTagCategory(tag) {
  const normalized = tag?.trim().toLowerCase();
  if (MOOD_TAGS.includes(normalized)) return 'mood';
  if (CONTEXT_TAGS.includes(normalized)) return 'context';
  return null;
}

export function getTagMetadata(tag) {
  const normalized = tag?.trim().toLowerCase();
  return TAG_MAP[normalized] || null;
}

export function getAlternativeSuggestions(tag) {
  const normalized = tag?.trim().toLowerCase();
  return ALTERNATIVE_SUGGESTIONS_MAP[normalized] || ['chill', 'focus'];
}
