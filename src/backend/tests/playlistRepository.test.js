import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { PLAYLIST_CHILD_TABLES, createPlaylistRepository, fromPlaylistRow, isCatalogSongId } from '../repositories/playlistRepository.js';

// Group 060 (061 delete) on the shared schema: its foreign keys to playlists have no ON DELETE,
// so the repository must clear dependent rows before deleting the playlist (live run: 23503 → 500).

function createFakeClient({ failOn = null } = {}) {
  const calls = [];
  return {
    calls,
    from(table) {
      return {
        delete() {
          return {
            eq(column, value) {
              calls.push({ table, column, value });
              return Promise.resolve({ error: table === failOn ? { code: '42501', message: 'permission denied' } : null });
            },
          };
        },
      };
    },
  };
}

describe('playlistRepository.delete', () => {
  test('removes bookmarks, members and songs before the playlist row', async () => {
    const client = createFakeClient();
    await createPlaylistRepository(client).delete('3');
    assert.deepEqual(client.calls.map((call) => call.table), [...PLAYLIST_CHILD_TABLES, 'playlists']);
    assert.ok(client.calls.every((call) => call.column === 'playlist_id' && call.value === '3'));
  });

  test('covers every table that references playlists in the shared schema', () => {
    assert.deepEqual([...PLAYLIST_CHILD_TABLES].sort(), ['playlist_bookmarks', 'playlist_shared_users', 'playlist_songs']);
  });

  test('stops before the playlist row when a dependent delete fails', async () => {
    const client = createFakeClient({ failOn: 'playlist_songs' });
    await assert.rejects(createPlaylistRepository(client).delete('3'), (error) => error.code === '42501');
    assert.equal(client.calls.some((call) => call.table === 'playlists'), false);
  });

  test('reports missing storage instead of touching any table', async () => {
    await assert.rejects(createPlaylistRepository(null).delete('3'), (error) => error.code === 'STORAGE_UNAVAILABLE');
  });
});

describe('playlist row mapping', () => {
  test('maps playlist_id and name to the service fields id and title', () => {
    assert.deepEqual(fromPlaylistRow({ playlist_id: 7, name: 'Lo-fi', status: 'Private' }), { playlist_id: 7, name: 'Lo-fi', status: 'Private', id: '7', title: 'Lo-fi' });
  });

  test('accepts database song ids and rejects demo ids', () => {
    assert.equal(isCatalogSongId('8'), true);
    assert.equal(isCatalogSongId(8), true);
    assert.equal(isCatalogSongId('t1'), false);
    assert.equal(isCatalogSongId(''), false);
  });
});
