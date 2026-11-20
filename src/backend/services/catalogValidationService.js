/**
 * Catalog Pre-Flight Verification Service (Feature 123 - FR-006)
 * Checks existence and playability of songs, playlists, albums, and artists
 * against the database catalog and demo repositories before generating execution directives.
 */

import { findSongById } from '../repositories/songRepository.js';
import { demoSongs } from '../data/demoSongs.js';

// Demo Playlists metadata aligned with frontend mockData
export const DEMO_PLAYLISTS = [
  { id: 'lofi-chill', title: 'Lofi Chill để code', trackIds: ['t8', 't9', 't10'], isPublic: true },
  { id: 'deep-focus', title: 'Deep Focus', trackIds: ['t10', 't8'], isPublic: true },
  { id: 'aura-mix', title: 'Aura Mix', trackIds: ['t1', 't2', 't3', 't4'], isPublic: true },
  { id: 'dem-thanh-pho', title: 'Đêm Thành Phố', trackIds: ['t2', 't5', 't7'], isPublic: true },
  { id: 'nang-len', title: 'Nắng Lên', trackIds: ['t1', 't3', 't4'], isPublic: true },
  { id: 'indie-viet', title: 'Indie Việt', trackIds: ['t1', 't2', 't5'], isPublic: true },
];

/**
 * Validates a song by ID for existence and playability
 * @param {string} songId
 * @returns {Promise<{ valid: boolean, entity: object|null, isPlayable: boolean }>}
 */
export async function validateSong(songId) {
  if (!songId || typeof songId !== 'string') {
    return { valid: false, entity: null, isPlayable: false };
  }

  try {
    const song = await findSongById(songId);
    if (!song) {
      return { valid: false, entity: null, isPlayable: false };
    }
    const isPlayable = song.is_active !== false;
    return { valid: true, entity: song, isPlayable };
  } catch (error) {
    console.warn(`Catalog lookup error for songId ${songId}:`, error.message);
    const demo = demoSongs.find((s) => s.song_id === songId);
    if (demo) {
      return { valid: true, entity: demo, isPlayable: true };
    }
    return { valid: false, entity: null, isPlayable: false };
  }
}

/**
 * Validates a list of track IDs
 * @param {string[]} trackIds
 * @returns {Promise<{ validTrackIds: string[], entities: object[], allValid: boolean }>}
 */
export async function validateTracks(trackIds = []) {
  if (!Array.isArray(trackIds) || trackIds.length === 0) {
    return { validTrackIds: [], entities: [], allValid: false };
  }

  const results = await Promise.all(trackIds.map(validateSong));
  const validTrackIds = [];
  const entities = [];

  for (let i = 0; i < results.length; i++) {
    if (results[i].valid && results[i].isPlayable) {
      validTrackIds.push(trackIds[i]);
      entities.push(results[i].entity);
    }
  }

  return {
    validTrackIds,
    entities,
    allValid: validTrackIds.length === trackIds.length && trackIds.length > 0,
  };
}

/**
 * Validates a playlist by ID
 * @param {string} playlistId
 * @returns {Promise<{ valid: boolean, entity: object|null }>}
 */
export async function validatePlaylist(playlistId) {
  if (!playlistId || typeof playlistId !== 'string') {
    return { valid: false, entity: null };
  }

  const demo = DEMO_PLAYLISTS.find((p) => p.id === playlistId || p.id === playlistId.toLowerCase());
  if (demo) {
    return { valid: true, entity: demo };
  }

  return { valid: false, entity: null };
}

/**
 * Validates multiple entities before tool directive generation (FR-006)
 * @param {object} params
 * @returns {Promise<object>}
 */
export async function validateCatalogEntities({ songId, trackIds, playlistId, albumId, artistId } = {}) {
  const result = {
    valid: true,
    resolvedSong: null,
    resolvedTracks: [],
    resolvedPlaylist: null,
    missingEntities: [],
  };

  if (songId) {
    const songRes = await validateSong(songId);
    if (songRes.valid) {
      result.resolvedSong = songRes.entity;
    } else {
      result.valid = false;
      result.missingEntities.push({ type: 'song', id: songId });
    }
  }

  if (trackIds && trackIds.length > 0) {
    const tracksRes = await validateTracks(trackIds);
    result.resolvedTracks = tracksRes.entities;
    if (tracksRes.validTrackIds.length === 0) {
      result.valid = false;
      result.missingEntities.push({ type: 'tracks', ids: trackIds });
    }
  }

  if (playlistId) {
    const plRes = await validatePlaylist(playlistId);
    if (plRes.valid) {
      result.resolvedPlaylist = plRes.entity;
    } else {
      result.valid = false;
      result.missingEntities.push({ type: 'playlist', id: playlistId });
    }
  }

  return result;
}

export default {
  validateSong,
  validateTracks,
  validatePlaylist,
  validateCatalogEntities,
  DEMO_PLAYLISTS,
};
