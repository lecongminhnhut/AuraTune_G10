import { API_BASE_URL } from './sessionApiClient.js';

export class ArtistProfileError extends Error {
  constructor(kind) { super(kind); this.name = 'ArtistProfileError'; this.kind = kind; }
}

export function validArtistId(id) {
  if (typeof id !== 'string' || !/^(?:0|-?[1-9]\d{0,18})$/.test(id)) return false;
  return BigInt(id) >= -9223372036854775808n && BigInt(id) <= 9223372036854775807n;
}

export async function loadArtistProfile(id, { signal, fetchImpl = globalThis.fetch } = {}) {
  if (!validArtistId(id)) throw new ArtistProfileError('invalid-id');
  try {
    const response = await fetchImpl(`${API_BASE_URL}/artists/${encodeURIComponent(id)}`, { signal, credentials: 'omit', cache: 'no-store' });
    const body = await response.json();
    if (response.status === 404 && body.success === false && body.data === null && body.error?.code === 'NOT_FOUND') {
      throw new ArtistProfileError('not-found');
    }
    const data = body.data;
    if (!response.ok || body.success !== true || body.error !== null || !data || data.id !== id || typeof data.name !== 'string' || !data.name.trim()
      || !(data.imageUrl === null || typeof data.imageUrl === 'string') || !(data.biography === null || typeof data.biography === 'string')) {
      throw new ArtistProfileError('unavailable');
    }
    // Safe projection; do not propagate extra response fields to UI/cache.
    return { id: data.id, name: data.name, imageUrl: data.imageUrl, biography: data.biography };
  } catch (error) {
    if (error?.name === 'AbortError' || error instanceof ArtistProfileError) throw error;
    throw new ArtistProfileError('unavailable');
  }
}
