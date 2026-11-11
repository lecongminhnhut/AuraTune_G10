/**
 * Intent Constants for Music Intent Understanding (Feature 122)
 * Follows contracts/music-intent-understanding-api.json and data-model.md
 */

export const INTENT_TYPES = Object.freeze({
  PLAY_MUSIC: 'play_music',
  SEARCH_MUSIC: 'search_music',
  QUERY_MUSIC_INFO: 'query_music_info',
  MANAGE_LIBRARY: 'manage_library',
  GENERAL_CHITCHAT: 'general_chitchat',
  UNKNOWN: 'unknown',
});

export const COMPLETENESS_STATUS = Object.freeze({
  COMPLETE: 'complete',
  MISSING_PARAMETERS: 'missing_parameters',
  AMBIGUOUS: 'ambiguous',
});

export const SUGGESTED_ACTIONS = Object.freeze({
  REAL_TIME_ASSISTANCE: 'real_time_assistance',
  SEARCH_SERVICE: 'search_service',
  RECOMMENDATION_SERVICE: 'recommendation_service',
  DIALOGUE_RESPONSE: 'dialogue_response',
  UNRECOGNIZED_FALLBACK: 'unrecognized_fallback',
});

export const CONTROL_ACTIONS = Object.freeze({
  PLAY: 'play',
  PAUSE: 'pause',
  RESUME: 'resume',
  NEXT: 'next',
  PREVIOUS: 'previous',
  SET_VOLUME: 'set_volume',
  LIKE_TRACK: 'like_track',
  CLEAR_QUEUE: 'clear_queue',
  NAVIGATE: 'navigate',
});

/**
 * Conjunction delimiters for compound clauses
 * (e.g. "phát nhạc chill rồi giảm âm lượng 40%", "bật nhạc, sau đó chuyển bài")
 */
export const CLAUSE_DELIMITERS_REGEX = /\s*(?:[,;]\s*(?:rồi|sau đó|tiếp theo)?|\s+rồi\s+|\s+sau đó\s+|\s+tiếp theo\s+)\s*/i;

/**
 * Regex dictionaries for Vietnamese intent recognition & entity slot extraction
 */
export const PATTERNS = Object.freeze({
  // PII Patterns
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
  PHONE_VN: /(?:\+?84|0)(?:3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}\b/g,
  PHONE_INTL: /\b\+?[1-9]\d{1,14}\b/g,
  PASSWORD_SECRET: /\b(?:mật khẩu|mat khau|password|pass|secret)\s*[:=]\s*\S+/gi,

  // Direct Control Commands
  CONTROL_PAUSE: /^(?:dừng|tạm dừng|stop|pause|ngưng|tắt nhạc)(?:\s+lại)?(?:\s+nhạc|\s+bài)?$/i,
  CONTROL_RESUME: /^(?:tiếp tục|resume|phát tiếp|chơi tiếp)(?:\s+phát|\s+nhạc|\s+bài)?$/i,
  CONTROL_NEXT: /^(?:tiếp theo|next|chuyển bài|bài tiếp|qua bài|bỏ qua|skip)(?:\s+(?:tiếp theo|khác|bài))?$/i,
  CONTROL_PREV: /^(?:quay lại|previous|prev|bài trước|lui lại)(?:\s+(?:bài trước|bài))?$/i,
  CONTROL_LIKE: /(?:thích|like|yêu thích|thả tim)(?:\s+bài này)?$/i,
  CONTROL_CLEAR_QUEUE: /^(?:xóa hàng đợi|clear queue|dọn hàng chờ|xóa danh sách chờ)$/i,

  // Volume Commands
  VOLUME_SET_EXPLICIT: /(?:âm lượng|volume)\s*(?:về|thành|lên|xuống)?\s*(\d{1,3})%?/i,
  VOLUME_INCREASE: /(?:tăng âm lượng|cho to lên|to lên|lớn hơn|to hơn|bật to|tăng volume)/i,
  VOLUME_DECREASE: /(?:giảm âm lượng|cho nhỏ lại|nhỏ lại|bé hơn|nhỏ hơn|bật nhỏ|giảm volume)/i,

  // Playback patterns
  PLAY_TRIGGER: /^(?:phát|bật|chơi|play|mở|nghe)\b/i,
  PLAY_VAGUE: /^(?:phát|bật|chơi|play|mở|nghe)\s*(?:nhạc\s+lên|nhạc\s+đi|nhạc|bài\s+hát|gì\s+đó|lên|đi)?$/i,

  // Search & Discovery patterns
  SEARCH_TRIGGER: /^(?:tìm|tìm kiếm|search|kiếm|gợi ý|recommend|cho mình mấy bài|cho xin mấy bài|muốn nghe)(?:\s+|$|[!?,])/i,
  MOODS: /(?:^|\s)(chill|thư giãn|lofi|tập trung|buồn|vui|sôi động|phấn khích|hưng phấn|ngủ ngon|lãng mạn|relax|deep|acoustic)(?:$|\s|[!?,])/i,
  ACTIVITIES: /(?:^|\s)(học bài|học tập|làm việc|chạy bộ|tập gym|workout|đi ngủ|lái xe|đọc sách|uống cà phê|party|nấu ăn)(?:\s+đêm(?:\s+khuya)?)?(?:$|\s|[!?,])/i,
  GENRES: /(?:^|\s)(pop|ballad|rock|rap|hip hop|r&b|jazz|indie|edm|v-pop|k-pop|us-uk|bolero|nhạc trẻ|nhạc trữ tình)(?:$|\s|[!?,])/i,

  // Query Music Info patterns
  QUERY_CURRENT_TRACK: /(?:bài (?:này|đang phát|đang nghe|gì đây|gì thế)|tên bài (?:này|hát)|ai đang hát|đây là bài gì|bài hát tên gì|thông tin bài)/i,
  QUERY_ARTIST_INFO: /(?:ai hát|ca sĩ (?:này|nào)|thông tin ca sĩ|tiểu sử)/i,

  // Library Management patterns
  LIBRARY_ACTION: /(?:thêm vào playlist|lưu vào thư viện|tạo playlist|xóa khỏi playlist|danh sách phát|thả tim|yêu thích|thích bài|lưu bài)/i,

  // General Chit-chat patterns
  CHITCHAT: /(?:thời tiết|ăn gì|chào bạn|hello|(?:^|\s+)hi(?:\s+|$|[!?,])|bạn là ai|mấy giờ|hôm nay thế nào|kể(?:\s+.*?)\s*chuyện|kể chuyện|tâm sự|bot ơi)/i,
});
