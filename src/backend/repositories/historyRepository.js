import { supabase } from '../../database/supabaseClient.js';
import { demoSongs } from '../data/demoSongs.js';

let forceSimulateDbError = false;

// In-memory playback events for offline development and testing
const inMemoryHistory = [
  // Seed history for u-demo matching seedHistory in frontend
  { id: 'h-seed-0', user_id: 'u-demo', song_id: 't1', listened_duration: 261, played_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString() },
  { id: 'h-seed-1', user_id: 'u-demo', song_id: 't8', listened_duration: 204, played_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString() },
  { id: 'h-seed-2', user_id: 'u-demo', song_id: 't9', listened_duration: 178, played_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString() },
  { id: 'h-seed-3', user_id: 'u-demo', song_id: 't2', listened_duration: 248, played_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString() },
  { id: 'h-seed-4', user_id: 'u-demo', song_id: 't1', listened_duration: 261, played_at: new Date(Date.now() - 29 * 3600 * 1000).toISOString() },
  { id: 'h-seed-5', user_id: 'u-demo', song_id: 't3', listened_duration: 224, played_at: new Date(Date.now() - 49 * 3600 * 1000).toISOString() },
  { id: 'h-seed-6', user_id: 'u-demo', song_id: 't10', listened_duration: 252, played_at: new Date(Date.now() - 54 * 3600 * 1000).toISOString() },
  { id: 'h-seed-7', user_id: 'u-demo', song_id: 't5', listened_duration: 120, played_at: new Date(Date.now() - 74 * 3600 * 1000).toISOString() },
  { id: 'h-seed-8', user_id: 'u-demo', song_id: 't8', listened_duration: 204, played_at: new Date(Date.now() - 97 * 3600 * 1000).toISOString() },
  { id: 'h-seed-9', user_id: 'u-demo', song_id: 't4', listened_duration: 192, played_at: new Date(Date.now() - 123 * 3600 * 1000).toISOString() },
];

const SCHEMA_FALLBACK_CODES = new Set(['42P01', '42703', 'PGRST205', 'PGRST200']);
let useInMemoryOnly = process.env.NODE_ENV === 'test';

export function setUseInMemory(value) {
  useInMemoryOnly = Boolean(value);
}

export function setSimulateDbError(value) {
  forceSimulateDbError = Boolean(value);
}

export function setInMemoryHistory(records) {
  useInMemoryOnly = true;
  inMemoryHistory.length = 0;
  if (Array.isArray(records)) {
    inMemoryHistory.push(...records);
  }
}

export function addInMemoryHistory(record) {
  inMemoryHistory.push(record);
}

export function clearInMemoryHistory(userId) {
  if (!userId) {
    inMemoryHistory.length = 0;
    return;
  }
  const remaining = inMemoryHistory.filter((item) => item.user_id !== userId);
  inMemoryHistory.length = 0;
  inMemoryHistory.push(...remaining);
}

/**
 * Execute dynamic aggregation query for Feature 101.
 * Purely deterministic SQL/database statistical aggregation (FR-003, FR-009).
 * Parameterized with strictly bound userId = $1 (FR-005, FR-006).
 */
export async function findListeningAnalysis(userId, range = 'all', options = {}) {
  if (forceSimulateDbError) {
    const error = new Error('Database connection timed out or query failed');
    error.code = 'DATABASE_ERROR';
    throw error;
  }

  if (!userId) {
    throw new Error('User ID is required for listening analysis query');
  }

  // Calculate cutoff date based on range ('7', '30', or 'all')
  let cutoffDate = null;
  if (range === '7') {
    cutoffDate = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  } else if (range === '30') {
    cutoffDate = new Date(Date.now() - 30 * 24 * 3600 * 1000);
  }

  // If Supabase client is connected and not forcing in-memory mode
  if (supabase && !useInMemoryOnly && !options.useInMemory) {
    try {
      let query = supabase
        .from('listening_history')
        .select(`
          id,
          user_id,
          song_id,
          listened_duration,
          played_at,
          songs (
            song_id,
            genre,
            title
          )
        `)
        .eq('user_id', userId)
        .not('user_id', 'is', null)
        .not('song_id', 'is', null)
        .gt('listened_duration', 0);

      if (cutoffDate) {
        query = query.gte('played_at', cutoffDate.toISOString());
      }

      const { data, error } = await query;
      if (!error && data) {
        return processRawPlaybackRows(data, options);
      }
      if (error) {
        if (SCHEMA_FALLBACK_CODES.has(error.code)) {
          // Schema/relationship not yet established on Supabase, fallback to in-memory store
          return executeInMemoryAggregation(userId, cutoffDate, options);
        }
        const dbErr = new Error(`Database aggregation error: ${error.message}`);
        dbErr.code = 'DATABASE_ERROR';
        throw dbErr;
      }
    } catch (err) {
      if (err.code === 'DATABASE_ERROR') throw err;
      // Fallback on network or schema error
      console.warn('Supabase listening_history table unavailable, falling back to in-memory store:', err.message);
    }
  }

  // In-memory aggregation fallback (offline & testing)
  return executeInMemoryAggregation(userId, cutoffDate, options);
}

function processRawPlaybackRows(rows, options = {}) {
  const customSongs = options.customSongs || {};
  const eligibleRows = rows.filter((row) => {
    return (
      row.user_id &&
      row.song_id &&
      typeof row.listened_duration === 'number' &&
      row.listened_duration > 0
    );
  });

  const totalPlays = eligibleRows.length;
  const uniqueTracksCount = new Set(eligibleRows.map((r) => r.song_id)).size;
  const totalDurationSeconds = eligibleRows.reduce((sum, r) => sum + r.listened_duration, 0);

  const genreMap = new Map();
  eligibleRows.forEach((row) => {
    const custom = customSongs[row.song_id];
    const song = custom !== undefined ? custom : (row.songs || demoSongs.find((s) => s.song_id === row.song_id || s.id === row.song_id));
    const genre = song?.genre;
    if (!genre || typeof genre !== 'string' || !genre.trim()) return;

    const genreKey = genre.trim();
    const curr = genreMap.get(genreKey) || {
      genreName: genreKey,
      accumulatedSeconds: 0,
      playsCount: 0,
    };
    curr.accumulatedSeconds += row.listened_duration;
    curr.playsCount += 1;
    genreMap.set(genreKey, curr);
  });

  return {
    totalPlays,
    uniqueTracksCount,
    totalDurationSeconds,
    genreBreakdown: Array.from(genreMap.values()),
  };
}

function executeInMemoryAggregation(userId, cutoffDate, options = {}) {
  const customSongs = options.customSongs || {};
  const songMap = new Map(demoSongs.map((s) => [s.song_id, s]));

  const eligibleRows = inMemoryHistory.filter((entry) => {
    if (entry.user_id !== userId) return false;
    if (!entry.song_id) return false;
    if (!entry.listened_duration || entry.listened_duration <= 0) return false;
    if (cutoffDate) {
      const playedAtTime = new Date(entry.played_at).getTime();
      if (Number.isNaN(playedAtTime) || playedAtTime < cutoffDate.getTime()) return false;
    }
    return true;
  });

  const totalPlays = eligibleRows.length;
  const uniqueTracksCount = new Set(eligibleRows.map((r) => r.song_id)).size;
  const totalDurationSeconds = eligibleRows.reduce((sum, r) => sum + r.listened_duration, 0);

  const genreMap = new Map();
  eligibleRows.forEach((row) => {
    const custom = customSongs[row.song_id];
    const song = custom !== undefined ? custom : songMap.get(row.song_id);
    const genre = song?.genre;
    if (!genre || typeof genre !== 'string' || !genre.trim()) return;

    const genreKey = genre.trim();
    const curr = genreMap.get(genreKey) || {
      genreName: genreKey,
      accumulatedSeconds: 0,
      playsCount: 0,
    };
    curr.accumulatedSeconds += row.listened_duration;
    curr.playsCount += 1;
    genreMap.set(genreKey, curr);
  });

  return {
    totalPlays,
    uniqueTracksCount,
    totalDurationSeconds,
    genreBreakdown: Array.from(genreMap.values()),
  };
}
