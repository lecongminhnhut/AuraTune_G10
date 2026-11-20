import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { executeTool } from '../../../src/components/chat/agentTools.js';

describe('agentToolsQueue (T018 - US2 Queue Tools & Audio Continuity)', () => {
  const mockTrack1 = { id: 't1', title: 'Nàng thơ', artist: 'Hoàng Dũng' };
  const mockTrack2 = { id: 't2', title: 'Bước qua mùa cô đơn', artist: 'Vũ.' };

  test('queue_add appends multiple tracks to player queue', () => {
    let queuedItems = null;
    const mockPlayer = {
      isPlaying: true,
      addManyToQueue: (items) => {
        queuedItems = items;
        return items.length;
      },
    };
    const mockStore = {
      findTrack: (id) => (id === 't1' ? mockTrack1 : id === 't2' ? mockTrack2 : null),
      isPlayable: () => true,
    };

    const res = executeTool(
      { name: 'queue_add', args: { trackIds: ['t1', 't2'] } },
      { store: mockStore, player: mockPlayer }
    );

    assert.equal(res.ok, true);
    assert.match(res.output, /Đã thêm 2 bài vào hàng chờ/);
    assert.equal(mockPlayer.isPlaying, true); // Zero audio disruption
    assert.equal(queuedItems.length, 2);
  });

  test('queue_add returns informative message when tracks already exist in queue', () => {
    const mockPlayer = {
      isPlaying: true,
      addManyToQueue: () => 0,
    };
    const mockStore = {
      findTrack: (id) => (id === 't1' ? mockTrack1 : null),
      isPlayable: () => true,
    };

    const res = executeTool(
      { name: 'queue_add', args: { trackIds: ['t1'] } },
      { store: mockStore, player: mockPlayer }
    );

    assert.equal(res.ok, true);
    assert.match(res.output, /đã có sẵn trong hàng chờ/i);
    assert.equal(mockPlayer.isPlaying, true);
  });

  test('play_next places track at priority next position in queue', () => {
    let nextTrack = null;
    const mockPlayer = {
      isPlaying: true,
      playNext: (track) => {
        nextTrack = track;
        return true;
      },
    };
    const mockStore = {
      findTrack: (id) => (id === 't2' ? mockTrack2 : null),
      isPlayable: () => true,
    };

    const res = executeTool(
      { name: 'play_next', args: { trackId: 't2' } },
      { store: mockStore, player: mockPlayer }
    );

    assert.equal(res.ok, true);
    assert.match(res.output, /sẽ phát tiếp theo/);
    assert.equal(nextTrack.id, 't2');
    assert.equal(mockPlayer.isPlaying, true);
  });

  test('clear_queue clears upcoming tracks from player queue', () => {
    let cleared = false;
    const mockPlayer = {
      isPlaying: true,
      clearUpcoming: () => {
        cleared = true;
      },
    };

    const res = executeTool({ name: 'clear_queue', args: {} }, { player: mockPlayer });

    assert.equal(res.ok, true);
    assert.match(res.output, /Đã xóa hàng chờ/);
    assert.equal(cleared, true);
    assert.equal(mockPlayer.isPlaying, true);
  });
});
