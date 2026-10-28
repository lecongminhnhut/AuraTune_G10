import { useState } from 'react'
import Icon from '../../components/common/Icon.jsx'
import CoverArt from '../../components/playlist/CoverArt.jsx'
import SongTable from '../../components/song/SongTable.jsx'
import { tracks } from '../../utils/mockData.js'

export default function PlaylistDetailPage({ playlist, onPlayTrack, onDownloadTrack }) {
  const [following, setFollowing] = useState(false)

  return (
    <div className="pb-12">
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-900/50 via-violet-950/20 to-transparent px-5 pb-7 pt-6 sm:px-8 sm:pb-9 sm:pt-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[100px]" />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:gap-7">
          <CoverArt variant={playlist.cover} title={playlist.title} showLabel className="h-48 w-48 shrink-0 rounded-xl shadow-2xl shadow-black/40 sm:h-56 sm:w-56" />
          <div className="min-w-0 pb-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-200">{playlist.label ?? 'PLAYLIST'}</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">{playlist.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">{playlist.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-300">
              <span className="font-semibold text-white">{playlist.owner}</span><span className="text-zinc-600">·</span><span>{playlist.count} songs</span><span className="text-zinc-600">·</span><span>{playlist.duration}</span>
              <span className="text-zinc-600">·</span><span className="text-zinc-400">Curated by AuraTune</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8">
        <div className="flex items-center gap-4 py-5">
          <button onClick={() => onPlayTrack(tracks[0])} aria-label="Play playlist" className="grid h-14 w-14 place-items-center rounded-full bg-violet-300 text-zinc-950 shadow-glow transition hover:scale-105 hover:bg-violet-200"><Icon name="play" size={23} /></button>
          <button onClick={() => setFollowing((value) => !value)} className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${following ? 'border-violet-300/40 bg-violet-300/10 text-violet-200' : 'border-white/20 text-zinc-300 hover:border-white/50 hover:text-white'}`}>{following ? 'Following' : 'Follow'}</button>
          <button aria-label="Playlist options" className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"><Icon name="more" size={21} /></button>
          <div className="ml-auto hidden items-center gap-2 text-xs text-zinc-500 sm:flex"><span>Track list</span><Icon name="queue" size={16} /></div>
        </div>

        <SongTable songs={tracks} onPlayTrack={onPlayTrack} onDownloadTrack={onDownloadTrack} />
        <p className="mt-7 text-xs text-zinc-500">Recently updated · {tracks.length} songs in this preview</p>
      </section>
    </div>
  )
}
