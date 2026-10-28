import { useState } from 'react'
import Icon from '../common/Icon.jsx'
import CoverArt from './CoverArt.jsx'

export default function PlaylistCard({ playlist, onNavigate, onPlayPlaylist }) {
  const [hovered, setHovered] = useState(false)
  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative min-w-0 rounded-xl bg-white/[0.035] p-3.5 transition duration-300 hover:bg-white/[0.085]"
    >
      <div className="relative aspect-square">
        <a href={`/playlist/${playlist.id}`} onClick={(event) => { event.preventDefault(); onNavigate(`/playlist/${playlist.id}`) }} aria-label={`View playlist ${playlist.title}`} className="absolute inset-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">
          <CoverArt variant={playlist.cover} title={playlist.title} showLabel className="h-full w-full rounded-lg shadow-xl" />
        </a>
        <button type="button" onClick={() => onPlayPlaylist(playlist)} aria-label={`Play playlist ${playlist.title}`} className={`absolute bottom-2 right-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-violet-300 text-zinc-950 shadow-xl transition duration-300 hover:scale-105 hover:bg-violet-200 focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-0 opacity-100 sm:translate-y-2 sm:opacity-0'}`}>
          <Icon name="play" size={19} />
        </button>
      </div>
      <a href={`/playlist/${playlist.id}`} onClick={(event) => { event.preventDefault(); onNavigate(`/playlist/${playlist.id}`) }} className="mt-4 block truncate text-sm font-semibold text-white hover:underline">{playlist.title}</a>
      <p className="mt-1 line-clamp-2 min-h-9 text-xs leading-5 text-zinc-400">{playlist.description}</p>
    </article>
  )
}
