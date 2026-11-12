import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/AppStore.jsx';
import { getPersonalizedRecommendations } from '../../services/recommendationService.js';
import RecommendedItemCard from './RecommendedItemCard.jsx';
import FallbackNoticeBanner from './FallbackNoticeBanner.jsx';
import { mockPopularFallbackItems } from '../../services/mock/mockRecommendationService.js';

const gridClass = 'grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

/**
 * RecommendationFeed (Feature 102 - T017, T023, T027, T031)
 * Container feed managing recommendation state, fallback banners, and polymorphic card grid.
 */
export default function RecommendationFeed({
  type = 'all',
  limit = 5,
  className = '',
  onPlaySong,
}) {
  const store = useStore?.() || {};
  const { currentUser } = store;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [fallbackReason, setFallbackReason] = useState(null);
  const [fallbackMessage, setFallbackMessage] = useState(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadRecommendations() {
      // T031: If unauthenticated, serve public trending items without calling private API
      if (!currentUser) {
        setItems(mockPopularFallbackItems.slice(0, limit));
        setIsFallback(true);
        setFallbackReason('COLD_START');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const token = store.token || store.accessToken || null;
        const res = await getPersonalizedRecommendations({
          type,
          limit,
          token,
          options: {
            userId: currentUser.id || currentUser.user_id,
            history: store.library?.history || [],
          },
        });

        if (!active) return;

        if (res && res.success && res.data) {
          setItems(res.data.items || []);
          setIsFallback(Boolean(res.data.is_fallback));
          setFallbackReason(res.data.fallback_reason || null);
          setFallbackMessage(res.data.message || null);
        } else {
          // Graceful fallback to mock popular items if API returns an error
          setItems(mockPopularFallbackItems.slice(0, limit));
          setIsFallback(true);
          setFallbackReason('AI_SERVICE_UNAVAILABLE');
          setFallbackMessage('Hiển thị nội dung thịnh hành do hệ thống gợi ý đang bảo trì');
        }
      } catch (err) {
        if (!active) return;
        console.warn('Error loading recommendations, falling back to popular items:', err.message);
        setItems(mockPopularFallbackItems.slice(0, limit));
        setIsFallback(true);
        setFallbackReason('AI_SERVICE_UNAVAILABLE');
        setFallbackMessage('Hiển thị nội dung thịnh hành do hệ thống gợi ý đang bảo trì');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRecommendations();

    return () => {
      active = false;
    };
  }, [currentUser, type, limit, store.token, store.library?.history]);

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
      {/* Non-intrusive alert notice when AI service is unavailable (US3 / EF-01) */}
      {isFallback && fallbackReason === 'AI_SERVICE_UNAVAILABLE' && !bannerDismissed && (
        <FallbackNoticeBanner
          message={fallbackMessage}
          onDismiss={() => setBannerDismissed(true)}
        />
      )}

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
