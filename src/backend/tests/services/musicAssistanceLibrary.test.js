import test from 'node:test';
import assert from 'node:assert/strict';
import { generateAssistancePlan } from '../../services/musicAssistanceService.js';
import { TOOL_NAMES } from '../../constants/assistanceConstants.js';

test('musicAssistanceLibrary (T023 - US3 Library Interactions & Permissions)', async (t) => {
  await t.test('generates like_track directive for authenticated user turn', async () => {
    const plan = await generateAssistancePlan({
      intentType: 'manage_library',
      extractedEntities: {
        controlAction: 'like_track',
        targetTrackId: 't1',
      },
      user: { id: 'u-1', role: 'listener' },
    });

    assert.ok(plan.planId);
    assert.strictEqual(plan.clientActions.length, 1);
    const action = plan.clientActions[0];
    assert.strictEqual(action.name, TOOL_NAMES.LIKE_TRACK);
    assert.deepStrictEqual(action.args, { trackId: 't1' });
    assert.match(plan.confirmationText, /Bài hát đã thích/i);
  });

  await t.test('generates save_to_playlist directive for user owned playlist', async () => {
    const plan = await generateAssistancePlan({
      intentType: 'manage_library',
      extractedEntities: {
        controlAction: 'save_to_playlist',
        playlistName: 'lofi-chill',
        targetTrackId: 't2',
      },
      user: { id: 'u-1', role: 'listener' },
    });

    assert.strictEqual(plan.clientActions.length, 1);
    const action = plan.clientActions[0];
    assert.strictEqual(action.name, 'save_to_playlist');
    assert.strictEqual(action.args.trackId, 't2');
  });

  await t.test('generates follow_artist directive with artist details', async () => {
    const plan = await generateAssistancePlan({
      intentType: 'manage_library',
      extractedEntities: {
        controlAction: 'follow_artist',
        artistName: 'Đức Phúc',
      },
      user: { id: 'u-1', role: 'listener' },
    });

    assert.strictEqual(plan.clientActions.length, 1);
    const action = plan.clientActions[0];
    assert.strictEqual(action.name, 'follow_artist');
    assert.strictEqual(action.args.artistName, 'Đức Phúc');
  });
});
