const ID_PATTERN = /^(?:0|-?[1-9]\d{0,18})$/;
const MIN_ID = -9223372036854775808n;
const MAX_ID = 9223372036854775807n;

export function isArtistId(value) {
  if (typeof value !== 'string' || !ID_PATTERN.test(value)) return false;
  const id = BigInt(value);
  return id >= MIN_ID && id <= MAX_ID;
}

function imageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}

export function createArtistRepository({ getClient = async () => (await import('../../database/supabaseClient.js')).supabase } = {}) {
  return {
    async findPublicArtistById(id) {
      if (!isArtistId(id)) throw new TypeError('Invalid Artist ID');
      const client = await getClient();
      if (!client) throw new Error('Artist storage unavailable');
      // A single SQL view applies parent/account policy and casts int8 to text
      // before PostgREST JSON. No raw rows, second account query or demo fallback.
      const { data, error } = await client.from('artist_profile_public')
        .select('id,name,image_url,biography').eq('id', id).maybeSingle();
      if (error) throw new Error('Artist storage unavailable');
      if (!data) return null;
      if (typeof data.id !== 'string' || data.id !== id || typeof data.name !== 'string' || !data.name.trim()) {
        throw new Error('Invalid Artist identity source');
      }
      return {
        id: data.id,
        name: data.name.trim(),
        imageUrl: imageUrl(data.image_url),
        biography: typeof data.biography === 'string' && data.biography.trim() ? data.biography : null,
      };
    },
  };
}
