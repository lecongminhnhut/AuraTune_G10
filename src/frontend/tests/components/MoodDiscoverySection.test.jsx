import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import MoodDiscoverySection from '../../src/components/mood/MoodDiscoverySection.jsx';
import {
  getMoodContextRecommendations,
  clearMoodCache,
} from '../../src/services/moodRecommendationService.js';

describe('MoodDiscoverySection Integration & Cache Tests (T033, T034, T035)', () => {
  test('renders initial container with loading skeleton or chip bar', () => {
    const html = renderToStaticMarkup(<MoodDiscoverySection initialTag="chill" />);
    assert.ok(html.includes('data-testid="mood-discovery-section"'));
    assert.ok(html.includes('Âm nhạc theo Tâm trạng &amp; Ngữ cảnh'));
  });

  test('in-memory cache retrieves cached tag within 50ms (AF-01 / T033)', async () => {
    clearMoodCache();

    // First call (populates cache)
    const t0 = Date.now();
    const res1 = await getMoodContextRecommendations('chill');
    const firstCallDuration = Date.now() - t0;

    assert.ok(res1.success);
    assert.equal(res1.data.tag, 'chill');

    // Second call (hits 5-minute in-memory cache)
    const t1 = Date.now();
    const res2 = await getMoodContextRecommendations('chill');
    const cachedCallDuration = Date.now() - t1;

    assert.ok(res2.success);
    assert.deepEqual(res1.data.items, res2.data.items);
    assert.ok(
      cachedCallDuration < 50,
      `Cached call duration (${cachedCallDuration}ms) should be strictly under 50ms (AF-01)`
    );
  });
});
