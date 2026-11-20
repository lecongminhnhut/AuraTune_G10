import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { agentTools, executeTool } from '../../../src/components/chat/agentTools.js';

describe('agentToolsPlayback (T012 - US1 Core Playback Tools)', () => {
  const mockTrack1 = { id: 't1', title: 'Nàng thơ', artist: 'Hoàng Dũng' };
  const mockPlaylist = { id: 'pl-1', title: 'Lofi Chill' };

  test('play_tracks dispatches playable tracks to player.playCollection', () => {
    let playCollectionCalledWith = null;
    const mockPlayer = {
      playCollection: (items, opts) => {
        playCollectionCalledWith = { items, opts };
      },
    };
    const mockStore = {
      findTrack: (id) => (id === 't1' ? mockTrack1 : null),
      isPlayable: () => true,
    };

    const res = executeTool(
      { name: 'play_tracks', args: { trackIds: ['t1'] } },
      { store: mockStore, player: mockPlayer }
    );

    assert.equal(res.ok, true);
    assert.match(res.output, /Nàng thơ/);
    assert.deepEqual(playCollectionCalledWith.items, [mockTrack1]);
  });

  test('play_tracks fails safely without calling playCollection on missing tracks', () => {
    let called = false;
    const mockPlayer = {
      playCollection: () => {
        called = true;
      },
    };
    const mockStore = {
      findTrack: () => null,
      isPlayable: () => false,
    };

    const res = executeTool(
      { name: 'play_tracks', args: { trackIds: ['invalid_id'] } },
      { store: mockStore, player: mockPlayer }
    );

    assert.equal(res.ok, false);
    assert.match(res.output, /Không có bài nào phát được/);
    assert.equal(called, false);
  });

  test('play_playlist plays tracks from resolved playlist', () => {
    let playCollectionCalled = false;
    const mockPlayer = {
      playCollection: () => {
        playCollectionCalled = true;
      },
    };
    const mockStore = {
      findPlaylistById: (id) => (id === 'pl-1' ? mockPlaylist : null),
      getPlaylistTracks: () => [mockTrack1],
    };

    const res = executeTool(
      { name: 'play_playlist', args: { playlistId: 'pl-1' } },
      { store: mockStore, player: mockPlayer }
    );

    assert.equal(res.ok, true);
    assert.match(res.output, /Lofi Chill/);
    assert.equal(playCollectionCalled, true);
  });

  test('playback controls handle pause, resume, next, and previous', () => {
    let toggled = false;
    let nextCalled = false;
    let prevCalled = false;

    const mockPlayer = {
      isPlaying: true,
      togglePlayback: () => {
        toggled = true;
      },
      nextTrack: () => {
        nextCalled = true;
      },
      previousTrack: () => {
        prevCalled = true;
      },
    };

    const pauseRes = executeTool({ name: 'playback', args: { action: 'pause' } }, { player: mockPlayer });
    assert.equal(pauseRes.ok, true);
    assert.equal(toggled, true);

    mockPlayer.isPlaying = false;
    toggled = false;
    const resumeRes = executeTool({ name: 'playback', args: { action: 'resume' } }, { player: mockPlayer });
    assert.equal(resumeRes.ok, true);
    assert.equal(toggled, true);

    const nextRes = executeTool({ name: 'playback', args: { action: 'next' } }, { player: mockPlayer });
    assert.equal(nextRes.ok, true);
    assert.equal(nextCalled, true);

    const prevRes = executeTool({ name: 'playback', args: { action: 'previous' } }, { player: mockPlayer });
    assert.equal(prevRes.ok, true);
    assert.equal(prevCalled, true);
  });

  test('set_volume un-mutes and clamps volume to 0-100', () => {
    let unmuted = false;
    let setVolumeVal = null;
    const mockPlayer = {
      setMuted: (val) => {
        unmuted = !val;
      },
      setVolume: (val) => {
        setVolumeVal = val;
      },
    };

    const res = executeTool({ name: 'set_volume', args: { value: 40 } }, { player: mockPlayer });
    assert.equal(res.ok, true);
    assert.equal(unmuted, true);
    assert.equal(setVolumeVal, 40);
    assert.match(res.output, /40%/);

    executeTool({ name: 'set_volume', args: { value: 150 } }, { player: mockPlayer });
    assert.equal(setVolumeVal, 100);

    executeTool({ name: 'set_volume', args: { value: -20 } }, { player: mockPlayer });
    assert.equal(setVolumeVal, 0);
  });
});
