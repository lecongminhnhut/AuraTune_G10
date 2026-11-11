import React, { useContext } from 'react';
import Icon from '../common/Icon.jsx';
import CoverArt from '../playlist/CoverArt.jsx';
import { ArtistAvatar } from '../playlist/MediaCards.jsx';
import { Link, navigate } from '../../utils/navigation.jsx';
import { PlayerContext } from '../../context/PlayerContext.jsx';
import { useStore } from '../../context/AppStore.jsx';

/**
 * RecommendedItemCard (Feature 102 - T016, FR-007, SC-004)
 * Polymorphic card rendering song, album, artist, or playlist recommendation.
 * 1-click interactions:
 *  - Song: calls player.playTrack() immediately
 *  - Album / Artist / Playlist: navigates to /album/:id, /artist/:id, /playlist/:id
 */
export default function RecommendedItemCard({ item, onPlaySong }) {
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

  const handlePlaySong = (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (onPlaySong) {
      onPlaySong(item);
      return;
    }

    // Try finding full track in store, or build playable track
    const existingTrack = store?.findTrack?.(targetId);
    const track = existingTrack || {
      id: targetId,
      title,
      artist: subtitle,
      artistId: extra?.artist_id,
      albumId: extra?.album_id,
      duration: extra?.duration,
      audioUrl: extra?.audio_url || `/api/v1/songs/${targetId}/stream`,
      cover: image_url,
    };

    if (player?.playTrack) {
      player.playTrack(track);
    }
  };

  const getTargetUrl = () => {
    switch (type) {
      case 'album':
        return `/album/${targetId}`;
      case 'artist':
        return `/artist/${targetId}`;
      case 'playlist':
        return `/playlist/${targetId}`;
      case 'song':
      default:
        return null;
    }
  };

  const targetUrl = getTargetUrl();

  const getBadgeStyle = () => {
    if (badge === 'Phổ biến') {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    }
    if (badge === 'Thịnh hành') {
      return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    }
    return 'bg-violet-500/20 text-violet-300 border-violet-500/30';
  };

  const cardContent = (
    <article
      data-testid={`recommended-card-${type}-${targetId}`}
      className="group relative flex flex-col justify-between h-full min-w-0 rounded-xl bg-white/[0.035] p-3.5 transition duration-300 hover:bg-white/[0.085] cursor-pointer"
    >
      <div>
        <div className="relative aspect-square w-full">
          {type === 'artist' ? (
            <div className="mx-auto h-full w-full overflow-hidden rounded-full shadow-xl">
              <ArtistAvatar artist={{ cover: image_url, name: title }} />
            </div>
          ) : (
            <CoverArt
              variant={image_url}
              title={title}
              showLabel={type !== 'song'}
              className="h-full w-full rounded-lg shadow-xl"
            />
          )}

          {badge && (
            <span
              className={`absolute left-2 top-2 z-10 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-sm ${getBadgeStyle()}`}
            >
              {badge}
            </span>
          )}

          {type === 'song' && (
            <button
              type="button"
              onClick={handlePlaySong}
              aria-label={`Phát ngay bài hát ${title}`}
              className="absolute bottom-2 right-2 z-10 grid h-10 w-10 place-items-center rounded-full bg-violet-300 text-zinc-950 shadow-xl transition duration-300 hover:scale-105 hover:bg-violet-200 focus-visible:opacity-100 focus-visible:outline-none [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100"
            >
              <Icon name="play" size={18} />
            </button>
          )}
        </div>

        <p className="mt-3 truncate text-sm font-semibold text-white group-hover:underline">
          {title}
        </p>
        <p className="mt-1 truncate text-xs text-zinc-400">
          {subtitle}
        </p>
      </div>

      <div className="mt-2 text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
        {type === 'song' ? 'Bài hát' : type === 'album' ? 'Album' : type === 'artist' ? 'Nghệ sĩ' : 'Tuyển tập'}
      </div>
    </article>
  );

  if (type === 'song') {
    return (
      <button
        type="button"
        onClick={handlePlaySong}
        className="block text-left w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 rounded-xl"
      >
        {cardContent}
      </button>
    );
  }

  return (
    <Link
      to={targetUrl}
      className="block w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 rounded-xl"
    >
      {cardContent}
    </Link>
  );
}
