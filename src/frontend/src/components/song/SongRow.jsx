import { useState } from 'react'
import Icon from '../common/Icon.jsx'
import CoverArt from '../playlist/CoverArt.jsx'

export default function SongRow({ track, index, onPlay, onDownloadTrack, compact = false }) {
  const [liked, setLiked] = useState(false)
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group grid grid-cols-[28px_minmax(0,1fr)_94px] items-center gap-3 rounded-md px-3 py-2.5 text-sm transition hover:bg-white/[0.07] md:grid-cols-[28px_minmax(0,1.8fr)_minmax(120px,1fr)_minmax(90px,.8fr)_108px]"
    >
      <button onClick={() => onPlay(track)} aria-label={`Play ${track.title}`} className="grid h-7 w-7 place-items-center text-xs text-zinc-500 transition group-hover:text-white">
        {hovered ? <Icon name="play" size={15} /> : <span>{String(index + 1).padStart(2, '0')}</span>}
      </button>
      <div className="flex min-w-0 items-center gap-3">
        <CoverArt variant={track.cover} className="h-10 w-10 shrink-0 rounded-md" />
        <div className="min-w-0">
          <button onClick={() => onPlay(track)} className="block max-w-full truncate text-left font-medium text-white transition hover:underline">{track.title}</button>
          <p className="mt-0.5 truncate text-xs text-zinc-400">{track.artist}</p>
        </div>
      </div>
      <span className="hidden truncate text-xs text-zinc-400 md:block">{track.album}</span>
      {!compact && <span className="hidden truncate text-xs text-zinc-500 md:block">{track.added}</span>}
      <div className="flex items-center justify-end gap-1.5 text-xs text-zinc-400 sm:gap-2">
        <button onClick={() => setLiked((value) => !value)} aria-label={liked ? 'Unlike song' : 'Like song'} className={`hidden transition group-hover:opacity-100 sm:inline-flex ${liked ? 'text-violet-300 opacity-100' : 'text-zinc-500 opacity-0 hover:text-violet-300'}`}><Icon name="heart" size={15} /></button>
        <button onClick={() => onDownloadTrack(track)} aria-label={`Download ${track.title}`} title="Download" className="text-zinc-400 transition hover:text-violet-200 sm:opacity-70 sm:group-hover:opacity-100"><Icon name="download" size={15} /></button>
        <span>{track.duration}</span>
        <button aria-label="Song options" className="hidden text-zinc-500 opacity-0 transition hover:text-white group-hover:opacity-100 lg:inline-flex"><Icon name="more" size={17} /></button>
      </div>
    </div>
  )
}
