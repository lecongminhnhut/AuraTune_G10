import React, { useState, useEffect, useRef, useContext } from 'react';
import MoodChipBar from './MoodChipBar.jsx';
import MoodItemCard from './MoodItemCard.jsx';
import MoodEmptyState from './MoodEmptyState.jsx';
import MoodDegradedBanner from './MoodDegradedBanner.jsx';
import {
  getMoodContextTags,
  getMoodContextRecommendations,
} from '../../services/moodRecommendationService.js';
import { MOCK_PRESET_TAGS } from '../../services/mock/mockMoodRecommendationService.js';
import { PlayerContext } from '../../context/PlayerContext.jsx';

export default function MoodDiscoverySection({ initialTag = 'chill' }) {
  const player = useContext(PlayerContext);
  const [tags, setTags] = useState(MOCK_PRESET_TAGS);
  const [selectedTag, setSelectedTag] = useState(initialTag);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    items: [],
    total_items: 0,
    is_service_degraded: false,
    alternative_suggestions: [],
    fallback_shortcuts: [],
  });
  const [error, setError] = useState(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const abortControllerRef = useRef(null);

  // Load preset tags on mount
  useEffect(() => {
    let isMounted = true;
    async function loadTags() {
      try {
        const res = await getMoodContextTags();
        if (isMounted && res?.data?.tags?.length > 0) {
          setTags(res.data.tags);
        }
      } catch (err) {
        console.warn('Failed to load mood tags:', err.message);
      }
    }
    loadTags();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch recommendations whenever selectedTag changes (with AbortController AF-01)
  useEffect(() => {
    // Abort previous in-flight request if user rapidly toggles chips
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    setIsUnauthorized(false);

    async function loadRecommendations() {
      try {
        const res = await getMoodContextRecommendations(selectedTag, {
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        if (res.error?.code === 'UNAUTHORIZED') {
          setIsUnauthorized(true);
          return;
        }

        if (res.success && res.data) {
          setData({
            items: res.data.items || [],
            total_items: res.data.total_items ?? (res.data.items?.length || 0),
            is_service_degraded: Boolean(res.data.is_service_degraded),
            alternative_suggestions: res.data.alternative_suggestions || [],
            fallback_shortcuts: res.data.fallback_shortcuts || [],
          });
        } else {
          setError(res.message || 'Không thể tải gợi ý');
        }
      } catch (err) {
        if (err.name === 'AbortError' || controller.signal.aborted) {
          return; // Ignore aborted requests
        }
        setError(err.message || 'Không thể kết nối đến máy chủ');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadRecommendations();

    return () => {
      controller.abort();
    };
  }, [selectedTag]);

  const handleSelectTag = (newTag) => {
    if (newTag === selectedTag) return;
    setSelectedTag(newTag);
  };

  const handlePlaySong = (item) => {
    if (player?.playTrack) {
      player.playTrack({
        id: item.target_id || item.id,
        title: item.title,
        artist: item.subtitle,
        duration: item.extra?.duration,
        audioUrl: item.extra?.audio_url || `/api/v1/songs/${item.target_id || item.id}/stream`,
        cover: item.image_url,
      });
    }
  };

  return (
    <section
      data-testid="mood-discovery-section"
      className="my-8 rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-4 sm:p-6"
    >
      {/* 8-chip preset taxonomy bar */}
      <MoodChipBar
        tags={tags}
        selectedTag={selectedTag}
        onSelectTag={handleSelectTag}
        disabled={loading}
      />

      {/* Graceful Degradation Notice (US3 / EF-01) */}
      {data.is_service_degraded && !loading && (
        <div className="mt-4">
          <MoodDegradedBanner
            message="Hệ thống gợi ý AI đang bận. Đang hiển thị danh sách phát tâm trạng phổ biến."
            fallbackShortcuts={data.fallback_shortcuts}
          />
        </div>
      )}

      {/* Main content area */}
      <div className="mt-5">
        {loading ? (
          <div
            data-testid="mood-loading-skeletons"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3"
              >
                <div className="aspect-square w-full rounded-xl bg-white/[0.06]" />
                <div className="mt-3 h-4 w-3/4 rounded bg-white/[0.06]" />
                <div className="mt-2 h-3 w-1/2 rounded bg-white/[0.04]" />
              </div>
            ))}
          </div>
        ) : isUnauthorized ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/5 px-6 py-10 text-center">
            <h3 className="text-base font-semibold text-white">Yêu cầu đăng nhập</h3>
            <p className="mt-1 text-xs text-zinc-400">Vui lòng đăng nhập để nhận các đề xuất âm nhạc theo tâm trạng dành riêng cho bạn.</p>
            <a
              href="/login"
              className="mt-4 rounded-full bg-sky-400 px-5 py-2 text-xs font-bold text-zinc-950 transition hover:bg-sky-300"
            >
              Đăng nhập ngay
            </a>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/5 py-8 text-center">
            <p className="text-sm text-rose-300">{error}</p>
            <button
              type="button"
              onClick={() => setSelectedTag((t) => `${t}`)}
              className="mt-3 rounded-full border border-rose-400/30 px-4 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/10"
            >
              Thử lại
            </button>
          </div>
        ) : data.items.length === 0 ? (
          /* Empty matches with alternative suggestions (US2 / AF-02) */
          <MoodEmptyState
            tag={selectedTag}
            alternativeSuggestions={data.alternative_suggestions}
            onSelectAlternative={handleSelectTag}
          />
        ) : (
          /* Polymorphic card grid */
          <div
            data-testid="mood-cards-grid"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {data.items.map((item) => (
              <MoodItemCard
                key={`${item.type}:${item.target_id || item.id}`}
                item={item}
                onPlaySong={handlePlaySong}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
