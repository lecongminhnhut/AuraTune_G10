import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/AppStore.jsx';
import { getPersonalizedRecommendations } from '../../services/recommendationService.js';
import { sessionIdentity } from '../../services/sessionApiClient.js';
import RecommendedItemCard from './RecommendedItemCard.jsx';

const gridClass = 'grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
const recommendationCache = new Map();
const recommendationRequests = new Map();

function getRecommendationOnce(key, load) {
  if (recommendationCache.has(key)) return Promise.resolve(recommendationCache.get(key));
  if (recommendationRequests.has(key)) return recommendationRequests.get(key);

  const request = load()
    .then((result) => {
      recommendationCache.set(key, result);
      while (recommendationCache.size > 24) recommendationCache.delete(recommendationCache.keys().next().value);
      return result;
    })
    .finally(() => recommendationRequests.delete(key));
  recommendationRequests.set(key, request);
  return request;
}

/**
 * RecommendationFeed (Feature 102 - T017, T023, T027, T031)
 * Container feed managing catalog-backed recommendations and the polymorphic card grid.
 */
export default function RecommendationFeed({
  type = 'all',
  limit = 5,
  className = '',
  onPlaySong,
}) {
  const store = useStore?.() || {};
  const { currentUser } = store;
  const userId = currentUser?.id || currentUser?.user_id || null;
  const session = store.state?.session;
  const catalogKey = (store.publicTracks || []).map((track) => track.id).join(',');
  const sessionKey = sessionIdentity(session) || (userId ? `${userId}:${session?.expiresAt || 'active'}` : 'anonymous');

  const catalogItems = () => (store.publicTracks || []).slice(0, limit).map((track) => ({
    id: track.id, target_id: track.id, type: 'song', title: track.title, subtitle: track.artist,
    image_url: track.coverUrl || null,
    extra: { artist_id: track.artistId, album_id: track.albumId, duration: track.duration, audio_url: track.audioUrl, cover: track.cover },
  }));

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadRecommendations() {
      // T031: If unauthenticated, serve public trending items without calling private API
      if (!currentUser) {
        setItems(catalogItems());
        setLoading(false);
        return;
      }

      setLoading(true);
      const cacheKey = `${sessionKey}:${type}:${limit}`;

      try {
        const token = store.token || store.accessToken || null;
        const res = await getRecommendationOnce(cacheKey, () => getPersonalizedRecommendations({
          type: 'song',
          limit,
          token,
          options: {
            userId,
            history: store.library?.history || [],
          },
        }));

        if (!active) return;

        if (res && res.success && res.data) {
          const liveItems = (res.data.items || []).filter((item) => store.isPlayable?.(item.target_id || item.id));
          setItems(liveItems.length ? liveItems : catalogItems());
        } else {
          // Keep the feed useful from the live catalog if recommendations are unavailable.
          setItems(catalogItems());
        }
      } catch (err) {
        if (!active) return;
        console.warn('Error loading recommendations, falling back to popular items:', err.message);
        recommendationCache.set(cacheKey, { success: false });
        setItems(catalogItems());
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRecommendations();

    return () => {
      active = false;
    };
  // Listening duration is updated continuously during playback. Do not refetch
  // the feed for each history tick; re-run only when the identity or query changes.
  }, [sessionKey, userId, type, limit, catalogKey]);

  if (loading) {
    return (
      <div className={`${gridClass} ${className}`} data-testid="recommendation-feed-loading">
        {Array.from({ length: limit }).map((_, idx) => (
          <div
            key={idx}
            className="h-56 animate-pulse rounded-xl bg-white/[0.04] p-3.5"
          >
            <div className="aspect-square w-full rounded-lg bg-white/[0.06]" />
            <div className="mt-3 h-4 w-3/4 rounded bg-white/[0.06]" />
            <div className="mt-2 h-3 w-1/2 rounded bg-white/[0.04]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`recommendation-feed-container ${className}`} data-testid="recommendation-feed">
      {items.length === 0 ? (
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-8 text-center text-sm text-zinc-400">
          Chưa có nội dung gợi ý phù hợp. Hãy khám phá thêm bài hát yêu thích của bạn!
        </div>
      ) : (
        <div className={gridClass}>
          {items.map((item) => (
            <RecommendedItemCard
              key={`${item.type}-${item.id}`}
              item={item}
              onPlaySong={onPlaySong}
            />
          ))}
        </div>
      )}
    </div>
  );
}
