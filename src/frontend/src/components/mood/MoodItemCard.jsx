import React, { useContext } from 'react';
import Icon from '../common/Icon.jsx';
import CoverArt from '../playlist/CoverArt.jsx';
import { Link, navigate } from '../../utils/navigation.jsx';
import { PlayerContext } from '../../context/PlayerContext.jsx';
import { useStore } from '../../context/AppStore.jsx';

/**
 * MoodItemCard (Feature 103 - T017, FR-007, SC-004)
 * Polymorphic card rendering Song or Playlist matching active mood/context.
 * Strictly 2 entity types: 'song' and 'playlist' (no albums, no artists).
 * 1-click interactions:
 *  - Song: calls player.playTrack() immediately
 *  - Playlist: navigates to /playlist/:id
 */
export default function MoodItemCard({ item, onPlaySong }) {
  const player = useContext(PlayerContext);
  let store = null;
  try {
    store = useStore();
  } catch {
    store = null;
  }

  if (!item) return null;

  const { type, id, title, subtitle, image_url, badge, target_id, extra } = item;
  const targetId = target_id || id;
  const isSong = type === 'song';

  const handlePlaySong = (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (onPlaySong) {
      onPlaySong(item);
      return;
    }

    const existingTrack = store?.findTrack?.(targetId);
    const track = existingTrack || {
      id: targetId,
      title,
      artist: subtitle,
      artistId: extra?.artist_id,
      duration: extra?.duration,
      audioUrl: extra?.audio_url || `/api/v1/songs/${targetId}/stream`,
      cover: image_url,
    };

    if (player?.playTrack) {
      player.playTrack(track);
    }
  };

  const playlistUrl = `/playlist/${targetId}`;

  return (
    <article
      data-testid="mood-item-card"
      data-entity-type={type}
      className="group relative flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-black/40"
    >
      {/* Artwork container */}
      <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-zinc-900">
        <CoverArt cover={image_url} title={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />

        {/* Badge */}
        {badge && (
          <div className="absolute left-2.5 top-2.5 z-10">
            <span className="inline-flex items-center rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-zinc-100 backdrop-blur-md ring-1 ring-white/10">
              {badge}
            </span>
          </div>
        )}

        {/* Hover action overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
          {isSong ? (
            <button
              type="button"
              onClick={handlePlaySong}
              aria-label={`Phát ngay bài hát ${title}`}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-400 text-zinc-950 shadow-lg shadow-sky-400/40 transition-transform duration-200 hover:scale-110 active:scale-95"
            >
              <Icon name="play" size={22} className="ml-0.5" />
            </button>
          ) : (
            <Link
              href={playlistUrl}
              onClick={(e) => {
                e.preventDefault();
                navigate(playlistUrl);
              }}
              aria-label={`Mở danh sách phát ${title}`}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-950 shadow-lg shadow-white/30 transition-transform duration-200 hover:scale-110 active:scale-95"
            >
              <Icon name="arrowRight" size={20} />
            </Link>
          )}
        </div>
      </div>

      {/* Item info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          {isSong ? (
            <button
              type="button"
              onClick={handlePlaySong}
              className="block w-full text-left font-bold text-zinc-100 transition-colors hover:text-sky-300"
            >
              <span className="line-clamp-1 text-sm">{title}</span>
            </button>
          ) : (
            <Link
              href={playlistUrl}
              onClick={(e) => {
                e.preventDefault();
                navigate(playlistUrl);
              }}
              className="block font-bold text-zinc-100 transition-colors hover:text-sky-300"
            >
              <span className="line-clamp-1 text-sm">{title}</span>
            </Link>
          )}

          <p className="mt-1 line-clamp-1 text-xs text-zinc-400">
            {subtitle}
          </p>
        </div>

        {/* Additional metadata info footer */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-400">
          <span className="capitalize text-zinc-400">
            {isSong ? 'Bài hát' : 'Playlist'}
          </span>
          {isSong && extra?.duration ? (
            <span>
              {Math.floor(extra.duration / 60)}:
              {String(extra.duration % 60).padStart(2, '0')}
            </span>
          ) : !isSong && extra?.track_count ? (
            <span>{extra.track_count} bài</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
