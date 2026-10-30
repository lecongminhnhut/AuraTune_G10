import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import Icon from '../common/Icon.jsx'
import CoverArt from './CoverArt.jsx'
import { navigate } from '../../utils/navigation.jsx'

export default function PlaylistCard({ playlist, onNavigate = navigate, onPlayPlaylist, compact = false, isPlaying = false }) {
  const [hovered, setHovered] = useState(false)

  if (compact) {
    return (
      <article className="mt-3 rounded-xl border border-sky-300/15 bg-gradient-to-br from-sky-300/[0.08] to-violet-400/[0.06] p-3">
        <div className="flex items-center gap-3">
          <CoverArt variant={playlist.cover} className="h-14 w-14 shrink-0 rounded-lg [&_span]:text-4xl" />
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-200"><Sparkles size={11} aria-hidden="true" /> AI Gợi ý</span>
            <p className="mt-1 truncate text-[13px] font-semibold text-white">{playlist.title}</p>
            <p className="mt-1 text-[10px] text-zinc-400">{playlist.count} bài hát · {playlist.duration}</p>
          </div>
        </div>
        <button type="button" onClick={() => onPlayPlaylist(playlist)} aria-label={`${isPlaying ? 'Tạm dừng' : 'Phát'} playlist ${playlist.title}`} className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-sky-200 text-xs font-bold text-slate-950 transition hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          <Icon name={isPlaying ? 'pause' : 'play'} size={15} /> {isPlaying ? 'Đang phát · Tạm dừng' : 'Phát playlist'}
        </button>
      </article>
    )
  }

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative min-w-0 rounded-xl bg-white/[0.035] p-3.5 transition duration-300 hover:bg-white/[0.085]"
    >
      <div className="relative aspect-square">
        <a href={`/playlist/${playlist.id}`} onClick={(event) => { event.preventDefault(); onNavigate(`/playlist/${playlist.id}`) }} aria-label={`Xem playlist ${playlist.title}`} className="absolute inset-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">
          <CoverArt variant={playlist.cover} title={playlist.title} showLabel className="h-full w-full rounded-lg shadow-xl" />
        </a>
        <button type="button" onClick={() => onPlayPlaylist(playlist)} aria-label={`Phát playlist ${playlist.title}`} className={`absolute bottom-2 right-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-violet-300 text-zinc-950 shadow-xl transition duration-300 hover:scale-105 hover:bg-violet-200 focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-0 opacity-100 sm:translate-y-2 sm:opacity-0'}`}>
          <Icon name="play" size={19} />
        </button>
      </div>
      <a href={`/playlist/${playlist.id}`} onClick={(event) => { event.preventDefault(); onNavigate(`/playlist/${playlist.id}`) }} className="mt-4 block truncate text-sm font-semibold text-white hover:underline">{playlist.title}</a>
      <p className="mt-1 line-clamp-2 min-h-9 text-xs leading-5 text-zinc-400">{playlist.description}</p>
    </article>
  )
}
