import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { executeTool } from '../../../src/components/chat/agentTools.js';

describe('chatSessionIsolation (T035 - US5 Client Session Isolation - FR-005, SC-002)', () => {
  test('blocks unauthenticated guest from liking tracks without session', () => {
    let liked = false;
    const guestContext = {
      store: {
        currentUser: null,
        toggleLike: () => {
          liked = true;
        },
      },
    };

    const result = executeTool(
      { name: 'like_track', args: { trackId: 't1' } },
      guestContext
    );

    assert.equal(result.ok, false);
    assert.match(result.output, /Cần đăng nhập để thích bài hát/);
    assert.equal(liked, false, 'Guest must never mutate liked songs');
  });

  test('blocks unauthenticated guest from saving to playlist', () => {
    const guestContext = {
      store: {
        currentUser: null,
      },
    };

    const result = executeTool(
      { name: 'save_to_playlist', args: { playlistId: 'pl-1', trackId: 't1' } },
      guestContext
    );

    assert.equal(result.ok, false);
    assert.match(result.output, /Cần đăng nhập để lưu vào playlist/);
  });

  test('blocks unauthenticated guest from following artists', () => {
    const guestContext = {
      store: {
        currentUser: null,
      },
    };

    const result = executeTool(
      { name: 'follow_artist', args: { artistName: 'Sơn Tùng M-TP' } },
      guestContext
    );

    assert.equal(result.ok, false);
    assert.match(result.output, /Cần đăng nhập để theo dõi nghệ sĩ/);
  });

  test('isolates user sessions when switching from User A to User B', () => {
    let currentUserInStore = { id: 'user-A', name: 'User A' };
    const context = {
      get store() {
        return {
          currentUser: currentUserInStore,
          isLiked: () => false,
          toggleLike: () => true,
        };
      },
    };

    const resA = executeTool({ name: 'like_track', args: { trackId: 't1' } }, context);
    assert.equal(resA.ok, true);

    // Switch to Guest (logout)
    currentUserInStore = null;
    const resGuest = executeTool({ name: 'like_track', args: { trackId: 't1' } }, context);
    assert.equal(resGuest.ok, false);
    assert.match(resGuest.output, /Cần đăng nhập/);

    // Switch to User B
    currentUserInStore = { id: 'user-B', name: 'User B' };
    const resB = executeTool({ name: 'like_track', args: { trackId: 't1' } }, context);
    assert.equal(resB.ok, true);
  });
});
