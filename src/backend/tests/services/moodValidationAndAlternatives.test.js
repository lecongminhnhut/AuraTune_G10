import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidMoodTag,
  getAlternativeSuggestions,
} from '../../constants/moodTaxonomy.js';
import { getMoodRecommendationsService } from '../../services/moodRecommendationService.js';
import { setUseInMemory } from '../../repositories/moodCatalogRepository.js';

setUseInMemory(true);

test('User Story 2 - Taxonomy: validates all 8 curated tags and rejects invalid strings', () => {
  const validTags = [
    'chill',
    'energetic',
    'melancholy',
    'focus',
    'study_work',
    'workout',
    'late_night',
    'travel_commute',
  ];

  for (const tag of validTags) {
    assert.equal(isValidMoodTag(tag), true, `Tag ${tag} should be valid`);
    assert.equal(isValidMoodTag(tag.toUpperCase()), true, `Uppercase ${tag} should be valid`);
  }

  const invalidTags = ['super_sad', 'rock', 'edm', '', null, undefined, 'unknown', 'angry'];
  for (const invalid of invalidTags) {
    assert.equal(isValidMoodTag(invalid), false, `Invalid tag ${invalid} should be rejected`);
  }
});

test('User Story 2 - Service: throws INVALID_MOOD_TAG error on non-whitelisted tags', async () => {
  await assert.rejects(
    async () => {
      await getMoodRecommendationsService({
        tag: 'super_sad',
        userId: 'u-123',
      });
    },
    (err) => {
      assert.equal(err.code, 'INVALID_MOOD_TAG');
      assert.ok(err.details?.length > 0);
      assert.match(err.details[0], /Tag must be one of:/);
      return true;
    }
  );
});

test('User Story 2 - Alternatives: returns 2-3 active alternative suggestions when items list is empty', async () => {
  const mockAiEmptyClient = {
    getMoodRecommendations: async () => ({
      status: 'success',
      candidates: [],
    }),
  };

  const result = await getMoodRecommendationsService({
    tag: 'melancholy',
    userId: 'u-123',
    aiClient: mockAiEmptyClient,
  });

  assert.equal(result.tag, 'melancholy');
  assert.equal(result.total_items, 0);
  assert.deepEqual(result.items, []);
  assert.ok(Array.isArray(result.alternative_suggestions));
  assert.ok(
    result.alternative_suggestions.length >= 2 && result.alternative_suggestions.length <= 3,
    'Must return 2-3 alternative suggestions'
  );

  // Each alternative must be a valid tag and cannot be the same as the queried tag
  for (const alt of result.alternative_suggestions) {
    assert.equal(isValidMoodTag(alt), true, `Alternative suggestion ${alt} must be valid tag`);
    assert.notEqual(alt, 'melancholy', 'Alternative suggestion cannot be the same as queried tag');
  }
});
