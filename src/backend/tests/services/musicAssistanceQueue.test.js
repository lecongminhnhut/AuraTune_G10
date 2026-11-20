import test from 'node:test';
import assert from 'node:assert/strict';
import { generateAssistancePlan } from '../../services/musicAssistanceService.js';
import { TOOL_NAMES } from '../../constants/assistanceConstants.js';

test('musicAssistanceQueue (T017 - US2 Queue Management & Discovery Streams)', async (t) => {
  await t.test('generates queue_add directive for search_music discovery recommendation', async () => {
    const plan = await generateAssistancePlan({
      intentType: 'search_music',
      extractedEntities: { mood: 'chill', genre: 'lo-fi' },
    });

    assert.ok(plan.planId);
    assert.strictEqual(plan.clientActions.length, 1);
    const action = plan.clientActions[0];
    assert.strictEqual(action.name, TOOL_NAMES.QUEUE_ADD);
    assert.ok(Array.isArray(action.args.trackIds));
    assert.ok(action.args.trackIds.length > 0);
    assert.match(plan.confirmationText, /hàng chờ/i);
  });

  await t.test('generates play_next priority directive for play_next controlAction', async () => {
    const plan = await generateAssistancePlan({
      intentType: 'play_music',
      extractedEntities: {
        controlAction: 'play_next',
        songTitle: 'Bước qua mùa cô đơn',
      },
    });

    assert.strictEqual(plan.clientActions.length, 1);
    const action = plan.clientActions[0];
    assert.strictEqual(action.name, 'play_next');
    assert.strictEqual(action.args.trackId, 't2');
    assert.strictEqual(action.label, 'play_next("t2")');
    assert.match(plan.confirmationText, /tiếp theo/i);
  });

  await t.test('generates sequential queue_add and set_volume for compound command', async () => {
    const plan = await generateAssistancePlan({
      intentType: 'search_music',
      extractedEntities: {
        controlAction: 'queue_add',
        targetTrackId: 't3',
        volumeLevel: 60,
      },
    });

    assert.strictEqual(plan.clientActions.length, 2);
    assert.strictEqual(plan.clientActions[0].name, TOOL_NAMES.QUEUE_ADD);
    assert.deepStrictEqual(plan.clientActions[0].args, { trackIds: ['t3'] });
    assert.strictEqual(plan.clientActions[1].name, TOOL_NAMES.SET_VOLUME);
    assert.deepStrictEqual(plan.clientActions[1].args, { value: 60 });
    assert.match(plan.confirmationText, /hàng chờ.*60%/i);
  });
});
