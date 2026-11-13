import { findEntity } from '../repositories/catalogRepository.js';

/**
 * Catalog Hydration Service (Feature 102 - FR-008, FR-015)
 * Hydrates candidate IDs with full catalog metadata and filters out
 * any inactive, deleted, or nonexistent entities.
 */

export async function hydrateCandidate(candidate, { isFallback = false } = {}) {
  const { type, id } = candidate || {};
  if (!type || !id) return null;

  const entity = await findEntity(type, id);
  if (!entity) return null;

  // Silently drop inactive or deleted entities (FR-008)
  if (entity.is_active === false || entity.deleted_at) {
    return null;
  }

  let badge = 'Gợi ý';
  if (isFallback) {
    if (type === 'song') {
      badge = 'Phổ biến';
    } else if (type === 'playlist') {
      badge = 'Thịnh hành';
    } else {
      badge = 'Phổ biến';
    }
  }

  const title = entity.title || entity.name || 'Không có tiêu đề';
  const subtitle =
    entity.subtitle ||
    entity.artist ||
    (type === 'artist' ? entity.bio || 'Nghệ sĩ' : '') ||
    (type === 'playlist' ? (entity.is_official ? 'AuraTune Official' : 'Tuyển tập') : '') ||
    '';

  const imageUrl = entity.image_url || entity.cover || null;
  const targetId = entity.id || entity.song_id || id;

  let extra = {};
  if (type === 'song') {
    extra = {
      duration: entity.duration || 0,
      audio_url: entity.audio_url || `/api/v1/songs/${targetId}/stream`,
      artist_id: entity.artist_id || null,
      album_id: entity.album_id || null,
    };
  } else if (type === 'playlist') {
    extra = {
      track_count: entity.track_count || 0,
      is_official: Boolean(entity.is_official),
    };
  } else if (type === 'artist') {
    extra = {
      follower_count: entity.follower_count || 0,
    };
  } else if (type === 'album') {
    extra = {
      artist_id: entity.artist_id || null,
      track_count: entity.track_count || 0,
      release_year: entity.release_year || null,
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
 * Hydrate an array of candidates, filtering missing/inactive and deduplicating by type:id
 */
export async function hydrateCandidates(candidates = [], options = {}) {
  const hydratedList = [];
  const seen = new Set();

  for (const candidate of candidates) {
    const key = `${candidate.type}:${candidate.id}`;
    if (seen.has(key)) {
      continue;
    }

    const item = await hydrateCandidate(candidate, options);
    if (item) {
      seen.add(key);
      hydratedList.push(item);
    }
  }

  return hydratedList;
}

export default {
  hydrateCandidate,
  hydrateCandidates,
};
