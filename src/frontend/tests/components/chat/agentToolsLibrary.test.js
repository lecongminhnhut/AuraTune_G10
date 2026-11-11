import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { executeTool } from '../../../src/components/chat/agentTools.js';

describe('agentToolsLibrary (T024 - US3 Library Tools & Auth Scope)', () => {
  test('like_track toggles liked state when user is authenticated', () => {
    let likedId = null;
    const mockStore = {
      currentUser: { id: 'u-1', name: 'Nhựt' },
      isLiked: () => false,
      toggleLike: (id) => {
        likedId = id;
        return true;
      },
    };

    const res = executeTool(
      { name: 'like_track', args: { trackId: 't1' } },
      { store: mockStore }
    );

    assert.equal(res.ok, true);
    assert.match(res.output, /Bài hát đã thích/);
    assert.equal(likedId, 't1');
  });

  test('like_track blocks unauthenticated guest and prompts login', () => {
    let called = false;
    const mockStore = {
      currentUser: null,
      toggleLike: () => {
        called = true;
      },
    };

    const res = executeTool(
      { name: 'like_track', args: { trackId: 't1' } },
      { store: mockStore }
    );

    assert.equal(res.ok, false);
    assert.match(res.output, /Cần đăng nhập/i);
    assert.equal(called, false);
  });

  test('save_to_playlist blocks guest and allows authenticated user', () => {
    const guestStore = { currentUser: null };
    const authStore = {
      currentUser: { id: 'u-1' },
      findPlaylistById: () => ({ id: 'pl-1', title: 'Yêu thích' }),
    };

    const guestRes = executeTool(
      { name: 'save_to_playlist', args: { playlistId: 'pl-1', trackId: 't1' } },
      { store: guestStore }
    );
    assert.equal(guestRes.ok, false);
    assert.match(guestRes.output, /Cần đăng nhập/);

    const authRes = executeTool(
      { name: 'save_to_playlist', args: { playlistId: 'pl-1', trackId: 't1' } },
      { store: authStore }
    );
    assert.equal(authRes.ok, true);
    assert.match(authRes.output, /Đã lưu/);
  });

  test('follow_artist blocks guest and allows authenticated user', () => {
    const guestStore = { currentUser: null };
    const authStore = { currentUser: { id: 'u-1' } };

    const guestRes = executeTool(
      { name: 'follow_artist', args: { artistName: 'Đức Phúc' } },
      { store: guestStore }
    );
    assert.equal(guestRes.ok, false);
    assert.match(guestRes.output, /Cần đăng nhập/);

    const authRes = executeTool(
      { name: 'follow_artist', args: { artistName: 'Đức Phúc' } },
      { store: authStore }
    );
    assert.equal(authRes.ok, true);
    assert.match(authRes.output, /(?:Đã|Đang) theo dõi/);
  });
});
