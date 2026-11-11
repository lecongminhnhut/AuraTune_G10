import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { executeTool } from '../../src/components/chat/agentTools.js';

describe('audioContinuityStress (T029 - US4 Zero Audio Disruption Invariant - FR-008, SC-003)', () => {
  test('asserts player.isPlaying remains true across catalog misses', () => {
    let playCollectionCalled = false;
    let stopCalled = false;

    const mockPlayer = {
      isPlaying: true,
      volume: 75,
      muted: false,
      playCollection: () => {
        playCollectionCalled = true;
      },
      stop: () => {
        stopCalled = true;
      },
    };
    const mockStore = {
      findTrack: () => null,
      isPlayable: () => false,
    };

    const res = executeTool(
      { name: 'play_tracks', args: { trackIds: ['non-existent-uuid-999'] } },
      { store: mockStore, player: mockPlayer }
    );

    assert.equal(res.ok, false);
    assert.match(res.output, /Không có bài nào/);
    assert.equal(mockPlayer.isPlaying, true, 'Active audio must not be paused or stopped');
    assert.equal(mockPlayer.muted, false, 'Audio must not be muted');
    assert.equal(playCollectionCalled, false);
    assert.equal(stopCalled, false);
  });

  test('asserts player.isPlaying remains true when invalid tool arguments are provided', () => {
    const mockPlayer = {
      isPlaying: true,
      volume: 60,
    };

    const res = executeTool(
      { name: 'playback', args: { action: 'invalid_action_xyz' } },
      { player: mockPlayer }
    );

    assert.equal(res.ok, false);
    assert.match(res.output, /Không hỗ trợ/);
    assert.equal(mockPlayer.isPlaying, true);
  });

  test('asserts player.isPlaying remains true when unknown tool name is dispatched', () => {
    const mockPlayer = {
      isPlaying: true,
    };

    const res = executeTool(
      { name: 'unsupported_random_tool', args: {} },
      { player: mockPlayer }
    );

    assert.equal(res.ok, false);
    assert.match(res.output, /chưa hỗ trợ tool/);
    assert.equal(mockPlayer.isPlaying, true);
  });

  test('asserts player.isPlaying remains true even if tool handler throws unexpected error', () => {
    const mockPlayer = {
      isPlaying: true,
      setVolume: () => {
        throw new Error('Simulated internal controller crash');
      },
    };

    const res = executeTool(
      { name: 'set_volume', args: { value: 50 } },
      { player: mockPlayer }
    );

    assert.equal(res.ok, false);
    assert.match(res.output, /Simulated internal controller crash/);
    assert.equal(mockPlayer.isPlaying, true, 'Audio must remain playing even after tool failure');
  });
});
