import { supabase as defaultSupabase } from '../../database/supabaseClient.js'

export function createSavedAlbumRepository({ getClient = async () => defaultSupabase } = {}) {
  async function clientOrThrow() {
    const client = await getClient()
    if (!client) throw new Error('Saved album storage is unavailable.')
    return client
  }

  return {
    async list(userId) {
      const client = await clientOrThrow()
      const { data, error } = await client
        .from('user_saved_albums')
        .select('album_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return (data ?? []).map((row) => String(row.album_id))
    },

    async add(userId, albumId) {
      const client = await clientOrThrow()
      const { error } = await client
        .from('user_saved_albums')
        .upsert({ user_id: userId, album_id: albumId }, { onConflict: 'user_id,album_id', ignoreDuplicates: true })
      if (error) throw error
    },

    async remove(userId, albumId) {
      const client = await clientOrThrow()
      const { error } = await client
        .from('user_saved_albums')
        .delete()
        .eq('user_id', userId)
        .eq('album_id', albumId)
      if (error) throw error
    },
  }
}

export const savedAlbumRepository = createSavedAlbumRepository()
