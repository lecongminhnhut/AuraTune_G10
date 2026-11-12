/**
 * Music Intent Understanding Service (Feature 122)
 * Strictly fulfills:
 * - FR-001, FR-002: 5 standard intent categories + unknown
 * - FR-003: Entity slot extraction (song, artist, album, mood, activity, genre, controls, volume)
 * - FR-004: Contextual reference resolution (deictic pronouns, relative volume)
 * - FR-005: Compound clause decomposition and smart defaults
 * - FR-008, SC-003: 100% PII sanitization
 * - FR-010, SC-002, SC-005: Two-tier architecture with strict 1,200ms timeout and fallback
 * - FR-012: Output structured JSON payload only; NO audio playback mutation.
 */

import { intentConfig } from '../config/intentConfig.js';
import {
  INTENT_TYPES,
  COMPLETENESS_STATUS,
  SUGGESTED_ACTIONS,
  CONTROL_ACTIONS,
  PATTERNS,
} from '../constants/intentConstants.js';
import { sanitizePrompt } from './piiSanitizerService.js';
import { splitPromptIntoClauses } from './clauseDecompositionService.js';

/**
 * Normalizes Vietnamese text for resilient regex matching
 */
function normalizeStr(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}

/**
 * Resolves relative volume shift from context
 * @param {string} clauseText
 * @param {object} [context]
 * @returns {number|null}
 */
export function resolveRelativeVolume(clauseText, context = {}) {
  const currentVolume = typeof context?.volume === 'number' ? context.volume : 50;

  // Check explicit volume percentage / number first (e.g. "40%", "80")
  const explicitMatch = /(?:âm lượng|volume)\s*(?:về|thành|lên|xuống)?\s*(\d{1,3})%?/i.exec(clauseText);
  if (explicitMatch) {
    const val = parseInt(explicitMatch[1], 10);
    return Math.min(100, Math.max(0, val));
  }

  // Check relative decrease (FR-004: -20%)
  if (PATTERNS.VOLUME_DECREASE.test(clauseText)) {
    return Math.max(0, currentVolume - 20);
  }

  // Check relative increase (FR-004: +20%)
  if (PATTERNS.VOLUME_INCREASE.test(clauseText)) {
    return Math.min(100, currentVolume + 20);
  }

  return null;
}

/**
 * Extracts entity slots from a single clause text
 * @param {string} text - Raw clause text
 * @param {object} [context] - PlaybackContextSnapshot
 * @returns {object} Extracted entity slots
 */
export function extractSlots(text, context = {}) {
  const trimmed = text.trim();
  const normalized = normalizeStr(trimmed);

  const slots = {
    songTitle: null,
    artistName: null,
    albumTitle: null,
    genre: null,
    mood: null,
    activity: null,
    lyricsSnippet: null,
    controlAction: null,
    volumeLevel: null,
    playlistName: null,
    targetTrackId: null,
  };

  // 0. Vague playback with smart defaults (FR-005)
  if (PATTERNS.PLAY_VAGUE.test(trimmed) || /^(?:bat nhac|mo nhac|phat nhac|nghe nhac)(?:\s+(?:len|di|nao|nhe|coi))?$/i.test(normalized)) {
    return slots;
  }

  // 1. Direct Controls
  if (PATTERNS.CONTROL_PAUSE.test(trimmed) || /^(?:tam dung|dung lai|tat nhac|pause|stop)$/i.test(normalized)) {
    slots.controlAction = CONTROL_ACTIONS.PAUSE;
    return slots;
  }
  if (PATTERNS.CONTROL_RESUME.test(trimmed) || /^(?:tiep tuc|phat tiep|resume)(?:\s+phat|\s+nhac|\s+bai)?$/i.test(normalized)) {
    slots.controlAction = CONTROL_ACTIONS.RESUME;
    return slots;
  }
  if (PATTERNS.CONTROL_NEXT.test(trimmed) || /^(?:chuyen bai|tiep theo|next|qua bai|bo qua|skip)(?:\s+(?:tiep theo|khac|bai))?$/i.test(normalized)) {
    slots.controlAction = CONTROL_ACTIONS.NEXT;
    return slots;
  }
  if (PATTERNS.CONTROL_PREV.test(trimmed) || /^(?:quay lai|previous|prev|bai truoc)(?:\s+(?:bai truoc|bai))?$/i.test(normalized)) {
    slots.controlAction = CONTROL_ACTIONS.PREVIOUS;
    return slots;
  }
  if (PATTERNS.CONTROL_LIKE.test(trimmed) || /(?:thich|yeu thich|like|tha tim)/i.test(normalized)) {
    slots.controlAction = CONTROL_ACTIONS.LIKE_TRACK;
    if (context?.currentTrack?.id) {
      slots.targetTrackId = context.currentTrack.id;
    }
  }
  if (PATTERNS.CONTROL_CLEAR_QUEUE.test(trimmed)) {
    slots.controlAction = CONTROL_ACTIONS.CLEAR_QUEUE;
    return slots;
  }

  // 2. Volume control
  const volumeVal = resolveRelativeVolume(trimmed, context);
  if (volumeVal !== null) {
    slots.controlAction = CONTROL_ACTIONS.SET_VOLUME;
    slots.volumeLevel = volumeVal;
  }

  // 3. Contextual pronoun resolution (FR-004)
  if (PATTERNS.QUERY_CURRENT_TRACK.test(trimmed) || PATTERNS.QUERY_ARTIST_INFO.test(trimmed)) {
    if (context?.currentTrack) {
      slots.targetTrackId = context.currentTrack.id || null;
      slots.songTitle = context.currentTrack.title || null;
      slots.artistName = context.currentTrack.artist || null;
    }
  }

  // 4. Mood, Activity, Genre
  const moodMatch = trimmed.match(PATTERNS.MOODS);
  if (moodMatch) {
    slots.mood = moodMatch[1].toLowerCase();
  }

  const activityMatch = trimmed.match(PATTERNS.ACTIVITIES);
  if (activityMatch) {
    slots.activity = activityMatch[1].toLowerCase();
    if (/đêm|khuya/i.test(trimmed)) {
      slots.activity += ' đêm khuya';
    }
  }

  const genreMatch = trimmed.match(PATTERNS.GENRES);
  if (genreMatch) {
    slots.genre = genreMatch[1].toLowerCase();
  }

  // 5. Lyrics snippet extraction
  const lyricsMatch = /(?:lời bài hát|lời có câu|lời là|có câu hát|có đoạn|ca từ)\s*[:"']?([^"']+)["']?/i.exec(trimmed);
  if (lyricsMatch) {
    slots.lyricsSnippet = lyricsMatch[1].trim();
  }

  // 5b. Album Search extraction
  const albumMatch = /(?:tìm|kiếm)\s+album\s+(.+?)(?:\s+của\s+(.+))?$/i.exec(trimmed);
  if (albumMatch) {
    slots.albumTitle = albumMatch[1].trim();
    if (albumMatch[2]) {
      slots.artistName = albumMatch[2].trim();
    }
    return slots;
  }

  // 5c. Explicit search song title
  const searchSongMatch = /^(?:tìm|tìm kiếm|kiếm)\s+(?:bài hát|bài)\s+(.+)/i.exec(trimmed);
  if (searchSongMatch && !slots.lyricsSnippet && !slots.mood && !slots.genre) {
    slots.songTitle = searchSongMatch[1].trim();
    return slots;
  }

  // 6. Song Title & Artist extraction
  // Pattern A: "bật bài [Title] của [Artist]" or "phát [Title] của [Artist]"
  const playPrefixMatch = /^(?:bật|phát|mở|nghe|chơi)\s+(?:bài|bài hát)?\s*/i.exec(trimmed);
  if (playPrefixMatch) {
    const afterPrefix = trimmed.slice(playPrefixMatch[0].length).trim();
    const lastCuaIndex = afterPrefix.toLowerCase().lastIndexOf(' của ');
    if (lastCuaIndex !== -1) {
      const candidateTitle = afterPrefix.slice(0, lastCuaIndex).trim().replace(/^bài\s+/i, '');
      const candidateArtist = afterPrefix.slice(lastCuaIndex + 5).trim().replace(/^(?:ca sĩ|nghệ sĩ)\s+/i, '');
      if (candidateTitle && candidateArtist) {
        slots.songTitle = candidateTitle;
        slots.artistName = candidateArtist;
        slots.controlAction = CONTROL_ACTIONS.PLAY;
        return slots;
      }
    }
  }

  const titleAndArtistMatch = /(?:bật|phát|mở|nghe|chơi)\s+(?:bài|bài hát)?\s*(.+?)\s+của\s+(.+)/i.exec(trimmed);
  if (titleAndArtistMatch) {
    slots.songTitle = titleAndArtistMatch[1].trim().replace(/^bài\s+/i, '');
    slots.artistName = titleAndArtistMatch[2].trim();
    slots.controlAction = CONTROL_ACTIONS.PLAY;
    return slots;
  }

  // Pattern B: "bật bài [Title]" or "phát bài [Title]"
  const titleOnlyMatch = /(?:bật|phát|mở|nghe|chơi)\s+(?:bài|bài hát)\s+(.+)/i.exec(trimmed);
  if (titleOnlyMatch) {
    const extracted = titleOnlyMatch[1].trim();
    // Verify it's not a mood
    if (!PATTERNS.MOODS.test(extracted) && !PATTERNS.GENRES.test(extracted)) {
      slots.songTitle = extracted;
      slots.controlAction = CONTROL_ACTIONS.PLAY;
      return slots;
    }
  }

  // Pattern C: "mở nhạc [Artist]" / "nghe nhạc [Artist]"
  const artistOnlyMatch = /(?:bật|phát|mở|nghe|chơi)\s+(?:nhạc|ca sĩ)\s+(.+)/i.exec(trimmed);
  if (artistOnlyMatch) {
    const extracted = artistOnlyMatch[1].trim();
    if (!PATTERNS.MOODS.test(extracted) && !PATTERNS.GENRES.test(extracted) && !/nhạc\s*(?:lên|đi)?$/i.test(extracted)) {
      slots.artistName = extracted;
      slots.controlAction = CONTROL_ACTIONS.PLAY;
      return slots;
    }
  }

  // Pattern D: "phát [Title]" (without the word "bài")
  const directPlayMatch = /^(?:phát|bật|chơi|play|mở)\s+([A-ZÀ-Ỹa-zà-ỹ0-9\s-]+)$/i.exec(trimmed);
  if (directPlayMatch) {
    const candidate = directPlayMatch[1].trim();
    if (!PATTERNS.PLAY_VAGUE.test(trimmed) && !PATTERNS.MOODS.test(candidate) && !PATTERNS.GENRES.test(candidate)) {
      slots.songTitle = candidate;
      slots.controlAction = CONTROL_ACTIONS.PLAY;
      return slots;
    }
  }

  // Pattern E: "của [Artist]"
  const artistByMatch = /(?:của ca sĩ|của)\s+([A-ZÀ-Ỹa-zà-ỹ0-9\s-]+)$/i.exec(trimmed);
  if (artistByMatch && !slots.artistName) {
    slots.artistName = artistByMatch[1].trim();
  }

  // Pattern F: Playlist name
  const playlistMatch = /(?:vào playlist|danh sách phát)\s*(.+)?/i.exec(trimmed);
  if (playlistMatch && playlistMatch[1]) {
    slots.playlistName = playlistMatch[1].trim();
  }

  return slots;
}

/**
 * Classifies intent of a single clause text
 * @param {string} clauseText
 * @param {object} slots
 * @param {object} [context]
 * @returns {{ intentType: string, confidenceScore: number, completenessStatus: string, suggestedAction: string }}
 */
export function classifyClauseIntent(clauseText, slots, context = {}) {
  const trimmed = clauseText.trim();
  const normalized = normalizeStr(trimmed);

  // 1. Library Management (FR-002)
  if (PATTERNS.LIBRARY_ACTION.test(trimmed) || slots.controlAction === CONTROL_ACTIONS.LIKE_TRACK) {
    return {
      intentType: INTENT_TYPES.MANAGE_LIBRARY,
      confidenceScore: 0.9,
      completenessStatus: COMPLETENESS_STATUS.COMPLETE,
      suggestedAction: SUGGESTED_ACTIONS.REAL_TIME_ASSISTANCE,
    };
  }

  // 2. Playback Controls (pause, resume, next, previous, volume)
  if (slots.controlAction && slots.controlAction !== CONTROL_ACTIONS.PLAY) {
    return {
      intentType: INTENT_TYPES.PLAY_MUSIC,
      confidenceScore: 0.95,
      completenessStatus: COMPLETENESS_STATUS.COMPLETE,
      suggestedAction: SUGGESTED_ACTIONS.REAL_TIME_ASSISTANCE,
    };
  }

  // 3. Query Music Info (FR-004)
  if (PATTERNS.QUERY_CURRENT_TRACK.test(trimmed) || PATTERNS.QUERY_ARTIST_INFO.test(trimmed)) {
    return {
      intentType: INTENT_TYPES.QUERY_MUSIC_INFO,
      confidenceScore: 0.92,
      completenessStatus: COMPLETENESS_STATUS.COMPLETE,
      suggestedAction: SUGGESTED_ACTIONS.DIALOGUE_RESPONSE,
    };
  }

  // 4. Search & Discovery requests
  const hasDiscoveryTrigger = PATTERNS.SEARCH_TRIGGER.test(trimmed);
  const hasMoodOrActivity = !!(slots.mood || slots.activity || slots.genre);

  if (hasDiscoveryTrigger) {
    const isRecommendation = hasMoodOrActivity && !slots.songTitle && !slots.albumTitle && !slots.lyricsSnippet;
    return {
      intentType: INTENT_TYPES.SEARCH_MUSIC,
      confidenceScore: 0.92,
      completenessStatus: COMPLETENESS_STATUS.COMPLETE,
      suggestedAction: isRecommendation
        ? SUGGESTED_ACTIONS.RECOMMENDATION_SERVICE
        : SUGGESTED_ACTIONS.SEARCH_SERVICE,
    };
  }

  // 5. Direct Playback with Song/Artist
  if (slots.songTitle || slots.artistName) {
    return {
      intentType: INTENT_TYPES.PLAY_MUSIC,
      confidenceScore: 0.95,
      completenessStatus: COMPLETENESS_STATUS.COMPLETE,
      suggestedAction: SUGGESTED_ACTIONS.REAL_TIME_ASSISTANCE,
    };
  }

  // 6. Playback with Mood only ("phát nhạc chill")
  if (PATTERNS.PLAY_TRIGGER.test(trimmed) && hasMoodOrActivity) {
    return {
      intentType: INTENT_TYPES.PLAY_MUSIC,
      confidenceScore: 0.9,
      completenessStatus: COMPLETENESS_STATUS.COMPLETE,
      suggestedAction: SUGGESTED_ACTIONS.REAL_TIME_ASSISTANCE,
    };
  }

  // 7. Vague playback ("bật nhạc lên", "mở nhạc đi") (FR-005)
  if (PATTERNS.PLAY_VAGUE.test(trimmed) || /^(?:bat nhac|mo nhac|phat nhac|nghe nhac|bat nhac len|bat nhac di)$/i.test(normalized)) {
    return {
      intentType: INTENT_TYPES.PLAY_MUSIC,
      confidenceScore: 0.88,
      completenessStatus: COMPLETENESS_STATUS.MISSING_PARAMETERS,
      suggestedAction: SUGGESTED_ACTIONS.REAL_TIME_ASSISTANCE,
    };
  }

  // 8. Chit-chat (FR-002, SC-004)
  if (
    PATTERNS.CHITCHAT.test(trimmed) ||
    /(?:thoi tiet|an gi|chao ban|hello|(?:^|\s+)hi(?:\s+|$|[!?,])|ban la ai|may gio|hom nay the nao|ke chuyen|tam su)/i.test(normalized)
  ) {
    return {
      intentType: INTENT_TYPES.GENERAL_CHITCHAT,
      confidenceScore: 0.95,
      completenessStatus: COMPLETENESS_STATUS.COMPLETE,
      suggestedAction: SUGGESTED_ACTIONS.DIALOGUE_RESPONSE,
    };
  }

  // 9. Discovery keywords without explicit trigger
  if (hasMoodOrActivity) {
    return {
      intentType: INTENT_TYPES.SEARCH_MUSIC,
      confidenceScore: 0.85,
      completenessStatus: COMPLETENESS_STATUS.COMPLETE,
      suggestedAction: SUGGESTED_ACTIONS.RECOMMENDATION_SERVICE,
    };
  }

  // 10. Fallback: Unknown
  return {
    intentType: INTENT_TYPES.UNKNOWN,
    confidenceScore: 0.4,
    completenessStatus: COMPLETENESS_STATUS.AMBIGUOUS,
    suggestedAction: SUGGESTED_ACTIONS.UNRECOGNIZED_FALLBACK,
  };
}

/**
 * Deterministic Tier-2 rule-based intent analyzer
 * @param {string} prompt - Raw or sanitized prompt
 * @param {object} [context] - PlaybackContextSnapshot
 * @returns {object} MusicIntentResultData payload
 */
export function analyzeIntentRuleBased(prompt, context = {}) {
  // 1. Mandatory PII sanitization (FR-008, SC-003)
  const sanitizedPrompt = sanitizePrompt(prompt);

  // 2. Clause decomposition (FR-005)
  const rawClauses = splitPromptIntoClauses(sanitizedPrompt);

  const clauses = rawClauses.map((clauseText, index) => {
    const slots = extractSlots(clauseText, context);
    const classification = classifyClauseIntent(clauseText, slots, context);

    return {
      clauseIndex: index,
      rawClauseText: clauseText,
      intentType: classification.intentType,
      extractedEntities: slots,
      suggestedAction: classification.suggestedAction,
    };
  });

  // Aggregate entities from all clauses
  const aggregatedEntities = {
    songTitle: null,
    artistName: null,
    albumTitle: null,
    genre: null,
    mood: null,
    activity: null,
    lyricsSnippet: null,
    controlAction: null,
    volumeLevel: null,
    playlistName: null,
    targetTrackId: null,
  };

  for (const clause of clauses) {
    for (const [key, value] of Object.entries(clause.extractedEntities)) {
      if (value !== null && aggregatedEntities[key] === null) {
        aggregatedEntities[key] = value;
      }
    }
  }

  // Derive top-level intent and action from primary clause
  const primaryClause = clauses[0] || {
    intentType: INTENT_TYPES.UNKNOWN,
    suggestedAction: SUGGESTED_ACTIONS.UNRECOGNIZED_FALLBACK,
    clauseIndex: 0,
    rawClauseText: sanitizedPrompt,
    extractedEntities: aggregatedEntities,
  };

  const primaryClassification = classifyClauseIntent(sanitizedPrompt, aggregatedEntities, context);

  // Check if vague request needs smart defaults (FR-005)
  let inferredDefaults = null;
  let completenessStatus = primaryClassification.completenessStatus;

  if (
    primaryClassification.intentType === INTENT_TYPES.PLAY_MUSIC &&
    !aggregatedEntities.songTitle &&
    !aggregatedEntities.artistName &&
    !aggregatedEntities.mood &&
    !aggregatedEntities.controlAction
  ) {
    completenessStatus = COMPLETENESS_STATUS.MISSING_PARAMETERS;
    inferredDefaults = { default_source: 'personalized_or_trending' };
  }

  return {
    requestId: `req-intent-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    intentType: primaryClassification.intentType,
    confidenceScore: primaryClassification.confidenceScore,
    completenessStatus,
    extractedEntities: aggregatedEntities,
    clauses,
    suggestedAction: primaryClassification.suggestedAction,
    inferredDefaults,
    sanitizedPrompt,
  };
}

/**
 * Two-Tier Intent Analysis Orchestrator with 1,200ms Timeout Fallback (FR-010, SC-002, SC-005)
 * @param {string} prompt - Raw user prompt
 * @param {object} [context] - PlaybackContextSnapshot
 * @returns {Promise<object>} MusicIntentResultData
 */
export async function analyzeIntent(prompt, context = {}) {
  const timeoutMs = intentConfig.intentTimeoutMs || 1200;
  const externalServiceUrl = intentConfig.aiIntentServiceUrl;

  // If external Tier 1 URL is default localhost or not reachable, use Tier 2 directly
  // Otherwise, attempt Tier 1 wrapped in AbortController timeout of 1,200ms
  const isExternalAvailable =
    externalServiceUrl &&
    !externalServiceUrl.includes('localhost:8000') &&
    !externalServiceUrl.includes('127.0.0.1:8000');

  if (!isExternalAvailable) {
    return analyzeIntentRuleBased(prompt, context);
  }

  const sanitizedPrompt = sanitizePrompt(prompt);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${externalServiceUrl}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: sanitizedPrompt, context }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (response.ok) {
      const data = await response.json();
      return {
        ...data,
        sanitizedPrompt,
      };
    }
  } catch (err) {
    // Timeout or network error caught: seamless fallback to Tier 2
  } finally {
    clearTimeout(timer);
  }

  // Tier 2 Fallback
  return analyzeIntentRuleBased(prompt, context);
}

export default {
  analyzeIntent,
  analyzeIntentRuleBased,
  extractSlots,
  classifyClauseIntent,
  resolveRelativeVolume,
};
