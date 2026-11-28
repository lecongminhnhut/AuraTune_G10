import React, { useState, useEffect, useContext } from 'react';
import MoodChipBar from './MoodChipBar.jsx';
import MoodItemCard from './MoodItemCard.jsx';
import MoodEmptyState from './MoodEmptyState.jsx';
import { getMoodContextTags } from '../../services/moodRecommendationService.js';
import { MOCK_PRESET_TAGS } from '../../services/mock/mockMoodRecommendationService.js';
import { PlayerContext } from '../../context/PlayerContext.jsx';
import { useStore } from '../../context/AppStore.jsx';

const MOOD_GENRES = {
  chill: ['lofi', 'chill', 'rnb'],
  energetic: ['vpop', 'rnb'],
  melancholy: ['indie', 'ballad'],
  focus: ['lofi', 'chill'],
  study_work: ['lofi', 'chill'],
  workout: ['vpop', 'rnb'],
  late_night: ['lofi', 'indie', 'ballad'],
  travel_commute: ['indie', 'vpop', 'rnb'],
};
const MOOD_ITEM_COUNT = 5;

function catalogMoodItemsByTag(tracks) {
  const moodIds = Object.keys(MOOD_GENRES);
  const rankedTracks = Object.fromEntries(moodIds.map((tag) => {
    const preferredGenres = MOOD_GENRES[tag];
    const ordered = [...tracks].sort((a, b) => {
      const aGenre = preferredGenres.indexOf(a.genre);
      const bGenre = preferredGenres.indexOf(b.genre);
      const aRank = aGenre < 0 ? preferredGenres.length : aGenre;
      const bRank = bGenre < 0 ? preferredGenres.length : bGenre;
      return aRank - bRank || (b.playCount || 0) - (a.playCount || 0);
    });
    return [tag, ordered];
  }));
  const assignments = Object.fromEntries(moodIds.map((tag) => [tag, []]));
  const usageCount = new Map();

  // Give each tab up to two distinct songs before any song is reused.
  for (let slot = 0; slot < 2; slot += 1) {
    for (const tag of moodIds) {
      const track = rankedTracks[tag].find((candidate) => !usageCount.has(String(candidate.id)));
      if (track) {
        assignments[tag].push(track);
        usageCount.set(String(track.id), 1);
      }
    }
  }

  // Fill remaining slots with the least-reused tracks, keeping genre fit as the tie-breaker.
  for (const tag of moodIds) {
    while (assignments[tag].length < MOOD_ITEM_COUNT) {
      const track = rankedTracks[tag]
        .filter((candidate) => !assignments[tag].some((item) => String(item.id) === String(candidate.id)))
        .sort((a, b) => (usageCount.get(String(a.id)) || 0) - (usageCount.get(String(b.id)) || 0))[0];
      if (!track) break;
      assignments[tag].push(track);
      usageCount.set(String(track.id), (usageCount.get(String(track.id)) || 0) + 1);
    }
  }

  return Object.fromEntries(moodIds.map((tag) => [tag, assignments[tag].map((track) => {
    const [minutes, seconds] = String(track.duration || '0:00').split(':').map(Number);
    return {
      id: String(track.id),
      target_id: String(track.id),
      type: 'song',
      title: track.title,
      subtitle: track.artist,
      image_url: track.coverUrl || null,
      extra: {
        cover: track.cover,
        duration: (minutes || 0) * 60 + (seconds || 0),
        artist_id: track.artistId,
        audio_url: track.audioUrl,
      },
    };
  })]));
}

export default function MoodDiscoverySection({ initialTag = 'chill' }) {
  const player = useContext(PlayerContext);
  const store = useStore();
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

  // Allocate catalog tracks across all tabs to keep their lists distinct.
  useEffect(() => {
    const items = catalogMoodItemsByTag(store.publicTracks)[selectedTag] || [];
    setData({ items, total_items: items.length, is_service_degraded: false, alternative_suggestions: [], fallback_shortcuts: [] });
    setLoading(false);
  }, [selectedTag, store.publicTracks]);

  const handleSelectTag = (newTag) => {
    if (newTag === selectedTag) return;
    setSelectedTag(newTag);
  };

  const handlePlaySong = (item) => {
    const track = store.findTrack(item.target_id || item.id);
    if (track && player?.playTrack) player.playTrack(track);
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
