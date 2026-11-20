import { findEntity } from '../repositories/moodCatalogRepository.js';
import { getTagMetadata } from '../constants/moodTaxonomy.js';

/**
 * Mood Catalog Hydration Service (Feature 103 - FR-003, FR-008, SC-005)
 * Strict entity boundary: Only hydrates 'song' and 'playlist'.
 * Drops albums, artists, inactive items, and private playlists.
 */

export async function hydrateMoodCandidate(candidate, { tag = '', isServiceDegraded = false } = {}) {
  const { type, id } = candidate || {};
  if (!type || !id) return null;

  // STRICT ENTITY RESTRICTION (FR-003): No albums, no artists
  if (type !== 'song' && type !== 'playlist') {
    return null;
  }

  const entity = await findEntity(type, id);
  if (!entity) return null;

  // Filter out deactivated or deleted items (FR-008)
  if (entity.is_active === false || entity.deleted_at) {
    return null;
  }

  // Filter out private playlists
  if (type === 'playlist' && entity.status && entity.status !== 'Public') {
    return null;
  }

  const meta = getTagMetadata(tag);
  let badge = meta ? meta.label.split('/')[0].trim() : 'Mood Match';
  if (type === 'playlist') {
    badge = `${badge} Playlist`;
  }

  if (isServiceDegraded) {
    badge = type === 'song' ? 'Phổ biến' : 'Thịnh hành';
  }

  const title = entity.title || entity.name || 'Giai điệu AuraTune';
  const subtitle =
    entity.subtitle ||
    entity.artist ||
    (type === 'playlist' ? (entity.is_official ? 'AuraTune Curators' : 'Tuyển tập') : 'AuraTune Artist');

  const imageUrl = entity.image_url || entity.cover || null;
  const targetId = entity.id || entity.song_id || id;

  let extra = {};
  if (type === 'song') {
    extra = {
      duration: entity.duration || 0,
      audio_url: entity.audio_url || `/api/v1/songs/${targetId}/stream`,
      artist_id: entity.artist_id || 'unknown-artist',
    };
  } else if (type === 'playlist') {
    extra = {
      track_count: entity.track_count || 0,
      is_official: Boolean(entity.is_official),
    };
  }

  return {
    id: targetId,
    type,
    title,
    subtitle,
    image_url: imageUrl,
    badge,
    target_id: targetId,
    extra,
  };
}

/**
 * Hydrates multiple candidates concurrently and eliminates duplicates
 * preserving the highest ranked instance of each (type, id) pair.
 */
export async function hydrateMoodCandidates(candidates = [], { tag = '', isServiceDegraded = false } = {}) {
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return [];
  }

  const hydratedList = await Promise.all(
    candidates.map((c) => hydrateMoodCandidate(c, { tag, isServiceDegraded }))
  );

  const seen = new Set();
  const result = [];

  for (const item of hydratedList) {
    if (!item) continue;
    const dedupeKey = `${item.type}:${item.id}`;
    if (!seen.has(dedupeKey)) {
      seen.add(dedupeKey);
      result.push(item);
    }
  }

  return result;
}

export default {
  hydrateMoodCandidate,
  hydrateMoodCandidates,
};
