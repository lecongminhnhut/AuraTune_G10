import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import MoodChipBar from '../../src/components/mood/MoodChipBar.jsx';
import MoodItemCard from '../../src/components/mood/MoodItemCard.jsx';
import MoodEmptyState from '../../src/components/mood/MoodEmptyState.jsx';
import MoodDegradedBanner from '../../src/components/mood/MoodDegradedBanner.jsx';
import { MOCK_PRESET_TAGS } from '../../src/services/mock/mockMoodRecommendationService.js';

describe('Mood Discovery UI Components - Unit Tests (T035)', () => {
  describe('MoodChipBar (T016)', () => {
    test('renders all 8 preset chips with localized labels and active selection state', () => {
      const html = renderToStaticMarkup(
        <MoodChipBar
          tags={MOCK_PRESET_TAGS}
          selectedTag="chill"
          onSelectTag={() => {}}
        />
      );

      assert.ok(html.includes('Chill / Thư giãn'), 'Should display Chill label');
      assert.ok(html.includes('Năng lượng / Hưng phấn'), 'Should display Energetic label');
      assert.ok(html.includes('Trầm lắng / U buồn'), 'Should display Melancholy label');
      assert.ok(html.includes('Tập trung'), 'Should display Focus label');
      assert.ok(html.includes('Học tập / Làm việc'), 'Should display Study/Work label');
      assert.ok(html.includes('Tập luyện / Thể thao'), 'Should display Workout label');
      assert.ok(html.includes('Đêm muộn'), 'Should display Late Night label');
      assert.ok(html.includes('Di chuyển / Đi lại'), 'Should display Travel/Commute label');

      // The selected tag should have aria-pressed="true"
      assert.ok(html.includes('aria-pressed="true"'), 'Selected chip must have aria-pressed="true"');
    });
  });

  describe('MoodItemCard (T017 / FR-007, SC-004)', () => {
    test('renders song card with play button overlay', () => {
      const songItem = {
        id: 't8',
        type: 'song',
        title: 'Midnight Coffee',
        subtitle: 'AuraTune Studio',
        image_url: 'ocean',
        badge: 'Chill',
        target_id: 't8',
        extra: { duration: 204, audio_url: '/api/v1/songs/t8/stream' },
      };

      const html = renderToStaticMarkup(<MoodItemCard item={songItem} />);
      assert.ok(html.includes('Midnight Coffee'), 'Should render song title');
      assert.ok(html.includes('AuraTune Studio'), 'Should render artist subtitle');
      assert.ok(html.includes('Chill'), 'Should render Chill badge');
      assert.ok(html.includes('Phát ngay bài hát Midnight Coffee'), 'Should provide 1-click play button');
      assert.ok(html.includes('3:24'), 'Should format duration as mm:ss (204s -> 3:24)');
    });

    test('renders playlist card linking to /playlist/:id', () => {
      const playlistItem = {
        id: 'lofi-chill',
        type: 'playlist',
        title: 'Lofi bên cửa sổ',
        subtitle: 'AuraTune Curators',
        image_url: 'ocean',
        badge: 'Chill Playlist',
        target_id: 'lofi-chill',
        extra: { track_count: 32, is_official: true },
      };

      const html = renderToStaticMarkup(<MoodItemCard item={playlistItem} />);
      assert.ok(html.includes('Lofi bên cửa sổ'), 'Should render playlist title');
      assert.ok(html.includes('href="/playlist/lofi-chill"'), 'Should link to /playlist/lofi-chill');
      assert.ok(html.includes('32 bài'), 'Should render track count');
      assert.ok(html.includes('Chill Playlist'), 'Should render playlist badge');
    });
  });

  describe('MoodEmptyState (T023 / US2)', () => {
    test('renders empathetic empty state with alternative suggestion chips', () => {
      const html = renderToStaticMarkup(
        <MoodEmptyState
          tag="melancholy"
          alternativeSuggestions={['chill', 'focus']}
          onSelectAlternative={() => {}}
        />
      );

      assert.ok(
        html.includes('Hiện chưa có bài hát phù hợp với tâm trạng này'),
        'Should display clear message'
      );
      assert.ok(html.includes('#chill'), 'Should display #chill alternative suggestion chip');
      assert.ok(html.includes('#focus'), 'Should display #focus alternative suggestion chip');
    });
  });

  describe('MoodDegradedBanner (T027 / US3)', () => {
    test('renders degraded service notice with navigation shortcuts', () => {
      const shortcuts = [
        { title: 'Bảng xếp hạng thịnh hành', target_url: '/explore' },
        { title: 'Tuyển tập đã thích', target_url: '/playlist/liked' },
      ];

      const html = renderToStaticMarkup(
        <MoodDegradedBanner
          message="Hệ thống gợi ý AI đang bận. Đang hiển thị danh sách phát tâm trạng phổ biến."
          fallbackShortcuts={shortcuts}
        />
      );

      assert.ok(html.includes('Hệ thống gợi ý AI đang bận'), 'Should display degraded notice');
      assert.ok(html.includes('href="/explore"'), 'Should link to explore');
      assert.ok(html.includes('href="/playlist/liked"'), 'Should link to liked playlist');
    });
  });
});
