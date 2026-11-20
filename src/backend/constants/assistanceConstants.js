export const TOOL_NAMES = {
  PLAY_PLAYLIST: 'play_playlist',
  PLAY_TRACKS: 'play_tracks',
  PLAYBACK: 'playback',
  SET_VOLUME: 'set_volume',
  QUEUE_ADD: 'queue_add',
  CLEAR_QUEUE: 'clear_queue',
  LIKE_TRACK: 'like_track',
  NAVIGATE: 'navigate',
};

export const WHITELISTED_TOOLS = Object.values(TOOL_NAMES);

export const PLAYBACK_ACTIONS = ['pause', 'resume', 'next', 'previous'];

export const TOOL_STATUS = {
  RUNNING: 'running',
  CONFIRM: 'confirm',
  OK: 'ok',
  ERROR: 'error',
  SKIPPED: 'skipped',
};

export const CLEAR_QUEUE_CONFIRM_PROMPT = 'Xóa tất cả bài trong hàng chờ?';

export const ASSISTANCE_ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CATALOG_ENTITY_NOT_FOUND: 'CATALOG_ENTITY_NOT_FOUND',
  ACTION_EXECUTION_FAILED: 'ACTION_EXECUTION_FAILED',
  DOWNSTREAM_SERVICE_UNAVAILABLE: 'DOWNSTREAM_SERVICE_UNAVAILABLE',
};

export default {
  TOOL_NAMES,
  WHITELISTED_TOOLS,
  PLAYBACK_ACTIONS,
  TOOL_STATUS,
  CLEAR_QUEUE_CONFIRM_PROMPT,
  ASSISTANCE_ERROR_CODES,
};
