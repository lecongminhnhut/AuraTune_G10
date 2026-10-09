import Icon from '../../components/common/Icon.jsx'
import CoverArt from '../../components/playlist/CoverArt.jsx'
import PlaylistCard from '../../components/playlist/PlaylistCard.jsx'
import SongRow from '../../components/song/SongRow.jsx'
import { playlists, recentlyPlayed, tracks } from '../../utils/mockData.js'

export default function HomePage({ onNavigate, onPlayTrack, onPlayPlaylist, onDownloadTrack }) {
  return (
    <div className="pb-12">
      <section className="relative overflow-hidden px-5 pb-8 pt-3 sm:px-8 sm:pt-6">
        <div className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full bg-violet-500/15 blur-[100px]" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-200/80">The music you want is right here</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">What are we listening to tonight?</h1>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
          <button onClick={() => onPlayPlaylist(playlists[0])} className="group relative min-h-[220px] overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-950 via-[#32214b] to-[#9b4c5d] p-6 text-left shadow-glow transition hover:border-violet-300/30 sm:min-h-[250px] sm:p-8">
            <div className="absolute -right-4 -top-10 h-64 w-64 rounded-full bg-fuchsia-300/20 blur-3xl transition group-hover:scale-125" />
            <div className="absolute -bottom-28 right-8 h-64 w-64 rounded-full border border-white/15 bg-white/[0.04]" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] text-violet-100"><Icon name="spark" size={14} /> AURATUNE MIX</span>
                <h2 className="mt-5 max-w-md text-2xl font-bold leading-tight sm:text-3xl">Music that matches<br className="hidden sm:block" /> your moment.</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-white/70">A collection refreshed daily, starting with the music you love.</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">Play Aura Mix <span className="transition group-hover:translate-x-1">→</span></span>
            </div>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            {recentlyPlayed.map((item) => (
              <button key={item.id} onClick={() => onNavigate(`/playlist/${item.id}`)} className="group flex min-w-0 items-center gap-3 overflow-hidden rounded-lg bg-white/[0.06] pr-2 text-left transition hover:bg-white/[0.12]">
                <CoverArt variant={item.cover} className="h-14 w-14 shrink-0 rounded-l-lg" />
                <span className="line-clamp-2 text-xs font-semibold leading-4 text-zinc-100">{item.title}</span>
              </button>
            ))}
            <div className="hidden items-center gap-3 overflow-hidden rounded-lg bg-white/[0.06] pr-3 sm:flex">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-l-lg bg-gradient-to-br from-sky-400 to-blue-900 text-xl">♫</div>
              <p className="text-xs font-semibold leading-4 text-zinc-200">The hits<br />you saved</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pt-2 sm:px-8">
        <SectionHeading title="You might like" subtitle="Music selected for your taste" action="Show all" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {playlists.slice(0, 5).map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} onNavigate={onNavigate} onPlayPlaylist={onPlayPlaylist} />)}
        </div>
      </section>

      <section className="mt-10 px-5 sm:px-8">
        <SectionHeading title="Collections for you" subtitle="A playlist for every mood" action="Discover more" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {playlists.slice(1).map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} onNavigate={onNavigate} onPlayPlaylist={onPlayPlaylist} />)}
        </div>
      </section>

      <section className="mt-10 px-5 sm:px-8">
        <SectionHeading title="Trending now" subtitle="The most played tracks this week" action="Charts" />
        <div className="mt-4 rounded-xl bg-white/[0.025] p-1 sm:p-2">
          {tracks.slice(0, 4).map((track, index) => <SongRow key={track.id} track={track} index={index} onPlay={onPlayTrack} onDownloadTrack={onDownloadTrack} />)}
        </div>
      </section>
      <div className="h-8" />
    </div>
  )
}

function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h2>
        <p className="mt-1.5 hidden text-xs text-zinc-500 sm:block">{subtitle}</p>
      </div>
      <button className="shrink-0 text-xs font-semibold text-zinc-400 transition hover:text-white">{action}</button>
    </div>
  )
}
