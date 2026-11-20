import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import RecommendedItemCard from '../../src/components/recommendation/RecommendedItemCard.jsx';
import FallbackNoticeBanner from '../../src/components/recommendation/FallbackNoticeBanner.jsx';
import {
  mockPersonalizedItems,
  mockPopularFallbackItems,
} from '../../src/services/mock/mockRecommendationService.js';

describe('Recommendation UI Components - Unit & Component Tests (T033 - Polish)', () => {
  describe('RecommendedItemCard (FR-007, SC-004)', () => {
    test('renders song card with title, subtitle, badge and play button', () => {
      const songItem = {
        id: 't1',
        type: 'song',
        title: 'Nàng thơ',
        subtitle: 'Hoàng Dũng',
        image_url: 'rose',
        badge: 'Gợi ý',
        target_id: 't1',
        extra: { duration: 261, audio_url: '/api/v1/songs/t1/stream' },
      };

      const html = renderToStaticMarkup(<RecommendedItemCard item={songItem} />);
      assert.ok(html.includes('Nàng thơ'), 'Card should display song title');
      assert.ok(html.includes('Hoàng Dũng'), 'Card should display artist subtitle');
      assert.ok(html.includes('Gợi ý'), 'Card should render recommendation badge');
      assert.ok(html.includes('Phát ngay bài hát Nàng thơ'), 'Card should provide 1-click play button');
    });

    test('renders album card linking to /album/:id', () => {
      const albumItem = {
        id: 'al-25',
        type: 'album',
        title: '25',
        subtitle: 'Hoàng Dũng',
        image_url: 'rose',
        badge: 'Gợi ý',
        target_id: 'al-25',
      };

      const html = renderToStaticMarkup(<RecommendedItemCard item={albumItem} />);
      assert.ok(html.includes('href="/album/al-25"'), 'Card must link to /album/al-25');
      assert.ok(html.includes('25'), 'Card should display album title');
    });

    test('renders artist card linking to /artist/:id', () => {
      const artistItem = {
        id: 'vu',
        type: 'artist',
        title: 'Vũ.',
        subtitle: 'Nghệ sĩ Indie Pop',
        image_url: 'night',
        badge: 'Gợi ý',
        target_id: 'vu',
      };

      const html = renderToStaticMarkup(<RecommendedItemCard item={artistItem} />);
      assert.ok(html.includes('href="/artist/vu"'), 'Card must link to /artist/vu');
      assert.ok(html.includes('Vũ.'), 'Card should display artist title');
    });

    test('renders playlist card linking to /playlist/:id', () => {
      const playlistItem = {
        id: 'lofi-chill',
        type: 'playlist',
        title: 'Lofi bên cửa sổ',
        subtitle: 'AuraTune Official',
        image_url: 'ocean',
        badge: 'Thịnh hành',
        target_id: 'lofi-chill',
      };

      const html = renderToStaticMarkup(<RecommendedItemCard item={playlistItem} />);
      assert.ok(html.includes('href="/playlist/lofi-chill"'), 'Card must link to /playlist/lofi-chill');
      assert.ok(html.includes('Thịnh hành'), 'Card should display Thịnh hành badge');
    });

    test('renders popular fallback card with "Phổ biến" badge (SC-002)', () => {
      const popularItem = {
        id: 't2',
        type: 'song',
        title: 'Bước qua mùa cô đơn',
        subtitle: 'Vũ.',
        badge: 'Phổ biến',
        target_id: 't2',
      };

      const html = renderToStaticMarkup(<RecommendedItemCard item={popularItem} />);
      assert.ok(html.includes('Phổ biến'), 'Card should display Phổ biến badge');
    });
  });

  describe('FallbackNoticeBanner (FR-006, EF-01, SC-003)', () => {
    test('renders subtle maintenance notice banner when AI service is unavailable', () => {
      const noticeText = 'Hiển thị nội dung thịnh hành do hệ thống gợi ý đang bảo trì';
      const html = renderToStaticMarkup(<FallbackNoticeBanner message={noticeText} />);
      assert.ok(html.includes(noticeText), 'Banner should contain the exact notice message');
      assert.ok(html.includes('role="status"'), 'Banner should use aria role status');
    });
  });

  describe('Mock Recommendation Fixtures', () => {
    test('mockPersonalizedItems contains multi-entity fixtures', () => {
      assert.ok(mockPersonalizedItems.length >= 4);
      const types = mockPersonalizedItems.map((i) => i.type);
      assert.ok(types.includes('song'));
      assert.ok(types.includes('playlist'));
      assert.ok(types.includes('artist'));
      assert.ok(types.includes('album'));
    });

    test('mockPopularFallbackItems contains popular songs and official playlists', () => {
      assert.ok(mockPopularFallbackItems.length >= 3);
      const badges = mockPopularFallbackItems.map((i) => i.badge);
      assert.ok(badges.includes('Phổ biến'));
      assert.ok(badges.includes('Thịnh hành'));
    });
  });
});
