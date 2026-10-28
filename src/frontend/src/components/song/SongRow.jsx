import { useState } from 'react'
import { GripVertical } from 'lucide-react'
import Icon from '../common/Icon.jsx'
import CoverArt from '../playlist/CoverArt.jsx'
import TrackMenu from './TrackMenu.jsx'
import { useStore } from '../../context/AppStore.jsx'
import { usePlayer } from '../../context/PlayerContext.jsx'
import { Link } from '../../utils/navigation.jsx'

const formatPlays = (count) => new Intl.NumberFormat('vi-VN').format(count ?? 0)

// Các nút phụ chỉ ẩn khi thiết bị có hover (chuột); trên màn hình cảm ứng luôn hiển thị.
const hoverReveal = '[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100'

export default function SongRow({ track, index, onPlay, onDownloadTrack, compact = false, showPlays = false, onRemove, removeLabel, menuItems, dragHandleProps, rowProps }) {
  const [hovered, setHovered] = useState(false)
  const store = useStore()
  const player = usePlayer()
  const liked = store.isLiked(track.id)
  const isCurrent = player.track.id === track.id

  const toggleLike = () => {
    if (!store.toggleLike(track.id)) player.requireLogin('Đăng nhập để lưu bài hát yêu thích.')
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...rowProps}
      className={`group grid grid-cols-[28px_minmax(0,1fr)_132px] items-center gap-3 rounded-md px-3 py-2.5 text-sm transition hover:bg-white/[0.07] md:grid-cols-[28px_minmax(0,1.8fr)_minmax(120px,1fr)_minmax(90px,.8fr)_132px] ${rowProps?.className ?? ''}`}
    >
      <div className="flex items-center">
        {dragHandleProps ? (
          <span {...dragHandleProps} className="grid h-7 w-7 cursor-grab place-items-center text-zinc-500 hover:text-white active:cursor-grabbing" title="Kéo để sắp xếp"><GripVertical size={16} aria-hidden="true" /></span>
        ) : (
          <button onClick={() => onPlay(track)} aria-label={`Phát ${track.title}`} className={`grid h-7 w-7 place-items-center text-xs transition group-hover:text-white ${isCurrent ? 'text-violet-300' : 'text-zinc-500'}`}>
            {hovered ? <Icon name="play" size={15} /> : <span>{String(index + 1).padStart(2, '0')}</span>}
          </button>
        )}
      </div>
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={() => onPlay(track)} aria-label={`Phát ${track.title}`} className="shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">
          <CoverArt variant={track.cover} className="h-10 w-10 rounded-md [&_span]:text-2xl" />
        </button>
        <div className="min-w-0">
          <button onClick={() => onPlay(track)} className={`block max-w-full truncate text-left font-medium transition hover:underline ${isCurrent ? 'text-violet-200' : 'text-white'}`}>{track.title}</button>
          <p className="mt-0.5 truncate text-xs text-zinc-400">
            {track.artistId ? <Link to={`/artist/${track.artistId}`} className="hover:text-white hover:underline">{track.artist}</Link> : track.artist}
          </p>
        </div>
      </div>
      <span className="hidden truncate text-xs text-zinc-400 md:block">
        {track.albumId ? <Link to={`/album/${track.albumId}`} className="hover:text-white hover:underline">{track.album}</Link> : track.album}
      </span>
      {!compact && <span className="hidden truncate text-xs text-zinc-500 md:block">{showPlays ? `${formatPlays(track.playCount)} lượt nghe` : track.added}</span>}
      <div className="flex items-center justify-end gap-1.5 text-xs text-zinc-400 sm:gap-2">
        <button onClick={toggleLike} aria-label={liked ? `Bỏ thích ${track.title}` : `Thích ${track.title}`} aria-pressed={liked} className={`inline-flex transition ${liked ? 'text-violet-300' : `text-zinc-500 hover:text-violet-300 ${hoverReveal}`}`}><Icon name="heart" size={15} className={liked ? 'fill-current' : ''} /></button>
        {onDownloadTrack && <button onClick={() => onDownloadTrack(track)} aria-label={`Tải xuống ${track.title}`} title="Tải xuống" className={`hidden text-zinc-400 transition hover:text-violet-200 sm:inline-flex ${hoverReveal}`}><Icon name="download" size={15} /></button>}
        <span className="w-9 text-right tabular-nums">{track.duration}</span>
        <TrackMenu track={track} onRemove={onRemove} removeLabel={removeLabel} extraItems={menuItems} className={hoverReveal} />
      </div>
    </div>
  )
}
