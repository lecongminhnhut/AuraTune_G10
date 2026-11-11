import test from 'node:test';
import assert from 'node:assert/strict';
import { generateAssistancePlan } from '../../services/musicAssistanceService.js';
import { TOOL_NAMES } from '../../constants/assistanceConstants.js';

test('assistanceQuickstartScenarios (T041 - 8 Acceptance Scenarios from quickstart.md)', async (t) => {
  // Scenario 1: Core Playback Controls via Conversation (FR-002, SC-001)
  await t.test('Scenario 1: Core Playback Controls via Conversation ("tạm dừng nhạc" / "tiếp tục phát")', async () => {
    const pausePlan = await generateAssistancePlan({
      intentType: 'play_music',
      extractedEntities: { controlAction: 'pause' },
    });
    assert.strictEqual(pausePlan.clientActions.length, 1);
    assert.strictEqual(pausePlan.clientActions[0].name, TOOL_NAMES.PLAYBACK);
    assert.strictEqual(pausePlan.clientActions[0].args.action, 'pause');
    assert.match(pausePlan.confirmationText, /tạm dừng/i);

    const resumePlan = await generateAssistancePlan({
      intentType: 'play_music',
      extractedEntities: { controlAction: 'resume' },
    });
    assert.strictEqual(resumePlan.clientActions.length, 1);
    assert.strictEqual(resumePlan.clientActions[0].name, TOOL_NAMES.PLAYBACK);
    assert.strictEqual(resumePlan.clientActions[0].args.action, 'resume');
    assert.match(resumePlan.confirmationText, /tiếp tục/i);
  });

  // Scenario 2: Adjust Volume Dynamically (FR-002)
  await t.test('Scenario 2: Adjust Volume Dynamically ("đặt âm lượng 40%")', async () => {
    const plan = await generateAssistancePlan({
      intentType: 'play_music',
      extractedEntities: { volumeLevel: 40 },
    });
    assert.strictEqual(plan.clientActions.length, 1);
    assert.strictEqual(plan.clientActions[0].name, TOOL_NAMES.SET_VOLUME);
    assert.strictEqual(plan.clientActions[0].args.value, 40);
    assert.strictEqual(plan.clientActions[0].label, 'set_volume(40)');
    assert.match(plan.confirmationText, /40%/);
  });

  // Scenario 3: Queue Management and Compound Action (FR-002, FR-014)
  await t.test('Scenario 3: Queue Management and Compound Action ("thêm nhạc vào hàng chờ, âm lượng 60%")', async () => {
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
    assert.strictEqual(plan.clientActions[1].name, TOOL_NAMES.SET_VOLUME);
    assert.strictEqual(plan.clientActions[1].args.value, 60);
    assert.match(plan.confirmationText, /hàng chờ.*60%/i);
  });

  // Scenario 4: Destructive Queue Clearance with Interactive Confirmation (FR-013)
  await t.test('Scenario 4: Destructive Queue Clearance with Interactive Confirmation ("xóa hàng chờ")', async () => {
    const plan = await generateAssistancePlan({
      intentType: 'clear_queue',
      extractedEntities: { controlAction: 'clear_queue' },
    });
    assert.strictEqual(plan.clientActions.length, 1);
    assert.strictEqual(plan.clientActions[0].name, TOOL_NAMES.CLEAR_QUEUE);
    assert.ok(plan.clientActions[0].confirm, 'Confirmation string must be present for clear_queue');
    assert.strictEqual(plan.clientActions[0].confirm, 'Xóa tất cả bài trong hàng chờ?');
  });

  // Scenario 5: Embedded Interactive Preview Card for Playlists (FR-004)
  await t.test('Scenario 5: Embedded Interactive Preview Card for Playlists ("phát lofi chill để code")', async () => {
    const plan = await generateAssistancePlan({
      intentType: 'play_music',
      extractedEntities: { playlistName: 'lofi-chill' },
    });
    assert.strictEqual(plan.clientActions.length, 1);
    assert.strictEqual(plan.clientActions[0].name, TOOL_NAMES.PLAY_PLAYLIST);
    assert.ok(plan.embeddedWidget);
    assert.strictEqual(plan.embeddedWidget.type, 'playlist');
    assert.strictEqual(plan.embeddedWidget.playlistId, 'lofi-chill');
  });

  // Scenario 6: Catalog Miss Failure Isolation (FR-008, SC-003)
  await t.test('Scenario 6: Catalog Miss Failure Isolation ("phát bài XYZ123NotReal")', async () => {
    const plan = await generateAssistancePlan({
      intentType: 'play_music',
      extractedEntities: { songTitle: 'XYZ123NotReal' },
    });
    assert.ok(plan.planId);
    assert.ok(plan.clientActions.length > 0);
  });

  // Scenario 7: Library Favorite Toggle (like_track) (FR-002, FR-005, SC-002)
  await t.test('Scenario 7: Library Favorite Toggle ("thích bài này")', async () => {
    const plan = await generateAssistancePlan({
      intentType: 'manage_library',
      extractedEntities: { controlAction: 'like_track', targetTrackId: 't1' },
      user: { id: 'u-1', role: 'listener' },
    });
    assert.strictEqual(plan.clientActions.length, 1);
    assert.strictEqual(plan.clientActions[0].name, TOOL_NAMES.LIKE_TRACK);
    assert.strictEqual(plan.clientActions[0].args.trackId, 't1');
  });

  // Scenario 8: Automatic Listening History Registration (FR-010, SC-005)
  await t.test('Scenario 8: Automatic Listening History Registration (FR-010, SC-005)', async () => {
    const plan = await generateAssistancePlan({
      intentType: 'play_music',
      extractedEntities: { targetTrackId: 't1' },
    });
    assert.strictEqual(plan.clientActions[0].name, TOOL_NAMES.PLAY_TRACKS);
    assert.deepStrictEqual(plan.clientActions[0].args.trackIds, ['t1']);
  });
});
