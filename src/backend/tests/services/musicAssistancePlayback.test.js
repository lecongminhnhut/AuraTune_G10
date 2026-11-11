import test from 'node:test';
import assert from 'node:assert/strict';
import { generateAssistancePlan } from '../../services/musicAssistanceService.js';
import { TOOL_NAMES } from '../../constants/assistanceConstants.js';

test('musicAssistancePlayback (T010 - US1 Playback & Audio Controls)', async (t) => {
  await t.test('translates pause action into playback tool directive', async () => {
    const plan = await generateAssistancePlan({
      intentType: 'play_music',
      extractedEntities: { controlAction: 'pause' },
    });

    assert.ok(plan.planId);
    assert.strictEqual(plan.clientActions.length, 1);
    const action = plan.clientActions[0];
    assert.ok(action.id.startsWith('call_'));
    assert.strictEqual(action.name, TOOL_NAMES.PLAYBACK);
    assert.deepStrictEqual(action.args, { action: 'pause' });
    assert.strictEqual(action.label, 'playback("pause")');
    assert.match(plan.confirmationText, /tạm dừng/i);
  });

  await t.test('translates resume action into playback tool directive', async () => {
    const plan = await generateAssistancePlan({
      intentType: 'play_music',
      extractedEntities: { controlAction: 'resume' },
    });

    assert.strictEqual(plan.clientActions.length, 1);
    const action = plan.clientActions[0];
    assert.strictEqual(action.name, TOOL_NAMES.PLAYBACK);
    assert.deepStrictEqual(action.args, { action: 'resume' });
    assert.match(plan.confirmationText, /tiếp tục/i);
  });

  await t.test('translates next & previous skip actions', async () => {
    const nextPlan = await generateAssistancePlan({
      intentType: 'play_music',
      extractedEntities: { controlAction: 'next' },
    });
    assert.strictEqual(nextPlan.clientActions[0].args.action, 'next');

    const prevPlan = await generateAssistancePlan({
      intentType: 'play_music',
      extractedEntities: { controlAction: 'previous' },
    });
    assert.strictEqual(prevPlan.clientActions[0].args.action, 'previous');
  });

  await t.test('translates volumeLevel into set_volume directive clamped 0-100', async () => {
    const plan = await generateAssistancePlan({
      intentType: 'play_music',
      extractedEntities: { volumeLevel: 40 },
    });

    assert.strictEqual(plan.clientActions.length, 1);
    const action = plan.clientActions[0];
    assert.strictEqual(action.name, TOOL_NAMES.SET_VOLUME);
    assert.deepStrictEqual(action.args, { value: 40 });
    assert.strictEqual(action.label, 'set_volume(40)');
    assert.match(plan.confirmationText, /40%/);
  });

  await t.test('resolves song title into play_tracks directive', async () => {
    const plan = await generateAssistancePlan({
      intentType: 'play_music',
      extractedEntities: { songTitle: 'Nàng thơ', artistName: 'Hoàng Dũng' },
    });

    assert.strictEqual(plan.clientActions.length, 1);
    const action = plan.clientActions[0];
    assert.strictEqual(action.name, TOOL_NAMES.PLAY_TRACKS);
    assert.deepStrictEqual(action.args, { trackIds: ['t1'] });
    assert.match(plan.confirmationText, /Nàng thơ/i);
  });

  await t.test('resolves playlist into play_playlist directive and attaches embedded widget', async () => {
    const plan = await generateAssistancePlan({
      intentType: 'play_music',
      extractedEntities: { playlistName: 'lofi-chill' },
    });

    assert.strictEqual(plan.clientActions.length, 1);
    const action = plan.clientActions[0];
    assert.strictEqual(action.name, TOOL_NAMES.PLAY_PLAYLIST);
    assert.deepStrictEqual(action.args, { playlistId: 'lofi-chill' });
    assert.ok(plan.embeddedWidget);
    assert.strictEqual(plan.embeddedWidget.type, 'playlist');
    assert.strictEqual(plan.embeddedWidget.playlistId, 'lofi-chill');
  });
});
