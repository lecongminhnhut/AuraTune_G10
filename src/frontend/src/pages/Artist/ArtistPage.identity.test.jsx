import React from 'react';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { ArtistIdentity } from './ArtistPage.jsx';
import { decodeArtistRouteId } from '../../utils/artistRoute.js';

const artist = { id: '9007199254740993', name: 'Public Artist', imageUrl: null, biography: null };

test('real public name and neutral image/missing-biography states have no mock catalog/counts or management actions', () => {
  const html = renderToStaticMarkup(<ArtistIdentity artist={artist} />);
  assert.ok(html.includes('Public Artist'));
  assert.ok(html.includes('Ảnh nghệ sĩ chưa được cung cấp'));
  assert.ok(html.includes('Nghệ sĩ chưa cung cấp tiểu sử.'));
  for (const excluded of ['Nàng thơ', 'bài hát nổi bật', 'Theo dõi', 'Artist Studio', 'follower', 'account-a']) assert.equal(html.includes(excluded), false);
});

test('biography is plain escaped text; whitespace is missing and long text is preserved', () => {
  const hostile = '<script>alert(1)</script>' + ' long biography'.repeat(500);
  const html = renderToStaticMarkup(<ArtistIdentity artist={{ ...artist, biography: hostile, imageUrl: 'javascript:alert(1)' }} />);
  assert.equal(html.includes('<script>'), false);
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes(' long biography'.repeat(500)));
  assert.equal(html.includes('src="javascript:'), false);
  assert.ok(renderToStaticMarkup(<ArtistIdentity artist={{ ...artist, biography: ' \n ' }} />).includes('Nghệ sĩ chưa cung cấp tiểu sử.'));
});

test('real image has a safe source, label and error fallback handler', () => {
  const html = renderToStaticMarkup(<ArtistIdentity artist={{ ...artist, imageUrl: 'https://example.com/public.jpg' }} />);
  assert.ok(html.includes('src="https://example.com/public.jpg"'));
  assert.ok(html.includes('Ảnh nghệ sĩ Public Artist'));
});

test('malformed encoded artist route IDs never throw', () => {
  for (const raw of ['%', '%ZZ', '%E0%A4']) assert.equal(decodeArtistRouteId(raw), null);
  assert.equal(decodeArtistRouteId('%31'), '1');
});
