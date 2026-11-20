import test from 'node:test';
import assert from 'node:assert/strict';
import { generateAssistancePlan } from '../../services/musicAssistanceService.js';
import { validateCatalogEntities } from '../../services/catalogValidationService.js';
import { TOOL_NAMES } from '../../constants/assistanceConstants.js';

test('assistanceErrorRecovery (T030 - US4 Resilience & Fallbacks - SC-004)', async (t) => {
  await t.test('resolves ambiguous playback command to smart default trending track (SC-004)', async () => {
    const plan = await generateAssistancePlan({
      intentType: 'play_music',
      extractedEntities: {
        songTitle: null,
        artistName: null,
        controlAction: null,
      },
    });

    assert.ok(plan.planId);
    assert.strictEqual(plan.clientActions.length, 1);
    const action = plan.clientActions[0];
    assert.strictEqual(action.name, TOOL_NAMES.PLAY_TRACKS);
    assert.ok(Array.isArray(action.args.trackIds));
    assert.ok(action.args.trackIds.length > 0);
    assert.ok(action.args.trackIds.includes('t1'));
    assert.match(plan.confirmationText, /Đang phát bài/i);
  });

  await t.test('catalog pre-flight verification flags missing entities safely', async () => {
    const check = await validateCatalogEntities({
      songId: 'non-existent-song-id-999',
    });

    assert.strictEqual(check.valid, false);
    assert.strictEqual(check.resolvedSong, null);
    assert.strictEqual(check.missingEntities.length, 1);
    assert.strictEqual(check.missingEntities[0].type, 'song');
  });

  await t.test('catalog pre-flight verification confirms valid demo song', async () => {
    const check = await validateCatalogEntities({
      songId: 't1',
    });

    assert.strictEqual(check.valid, true);
    assert.ok(check.resolvedSong);
    assert.strictEqual(check.resolvedSong.song_id, 't1');
  });
});
