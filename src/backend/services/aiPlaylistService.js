import { findSongsByIds } from '../repositories/songRepository.js';

// Feature 064 (T010): turn the AI service answer into a playlist proposal.
// The AI only suggests song ids; titles, artists and availability come from the catalog
// (Supabase `songs` joined to albums/artists, demo catalog for local ids).

export const MIN_PROPOSAL_TRACKS = 10;
export const MAX_PROPOSAL_TRACKS = 20;
const MAX_TITLE_LENGTH = 80;
const MAX_REASON_LENGTH = 500;
const SONG_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

const text = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

// Unique, well-formed ids in the order the AI ranked them.
export function candidateIds(response) {
  const tracks = Array.isArray(response?.tracks) ? response.tracks : [];
  const ids = tracks
    .map((track) => String((typeof track === 'object' && track !== null ? track.song_id ?? track.id : track) ?? '').trim())
    .filter((id) => SONG_ID_PATTERN.test(id));
  return [...new Set(ids)];
}

const toProposalTrack = (song) => ({
  song_id: song.song_id,
  title: song.title,
  artist: song.artist ?? '',
  artist_id: song.artist_id ?? null,
  album: song.album ?? null,
  album_id: song.album_id ?? null,
  genre: song.genre ?? null,
  duration: song.duration ?? null,
  cover_url: song.cover_url ?? null,
});

export async function normalizeAiPlaylistResponse(response, prompt, { findSongs = findSongsByIds } = {}) {
  const title = text(response?.title, MAX_TITLE_LENGTH) || prompt.trim().slice(0, MAX_TITLE_LENGTH);
  const reason = text(response?.reason, MAX_REASON_LENGTH);
  const ids = candidateIds(response);
  if (!ids.length) return { title, reason, tracks: [], noMatch: true };

  const catalog = await findSongs(ids);
  // normalizeSong marks inactive, restricted and soft-deleted songs with is_active === false.
  const eligible = ids.map((id) => catalog.get(id)).filter((song) => song && song.is_active !== false);
  if (eligible.length < MIN_PROPOSAL_TRACKS) return { title, reason, tracks: [], noMatch: true };
  return { title, reason, tracks: eligible.slice(0, MAX_PROPOSAL_TRACKS).map(toProposalTrack) };
}
