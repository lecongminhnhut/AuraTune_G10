import { useMemo } from 'react'
import Icon from '../../components/common/Icon.jsx'
import CoverArt from '../../components/playlist/CoverArt.jsx'
import PlaylistCard from '../../components/playlist/PlaylistCard.jsx'
import { AlbumCard, ArtistCard, GenreTile } from '../../components/playlist/MediaCards.jsx'
import SongRow from '../../components/song/SongRow.jsx'
import { SectionHeading } from '../../components/common/ui.jsx'
import { useStore } from '../../context/AppStore.jsx'
import { usePlayer } from '../../context/PlayerContext.jsx'
import { genres, getArtist, playlists, recentlyPlayed } from '../../utils/mockData.js'
import { Link } from '../../utils/navigation.jsx'

const gridClass = 'mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

export default function HomePage() {
  const store = useStore()
  const player = usePlayer()
  const { publicTracks, albums, artists, currentUser, library, aiAvailable } = store

  const trending = useMemo(() => [...publicTracks].sort((a, b) => b.playCount - a.playCount).slice(0, 5), [publicTracks])
  const newAlbums = useMemo(() => [...albums].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate)).slice(0, 5), [albums])
  const featuredArtists = useMemo(() => artists.filter((artist) => artist.isPublic).slice(0, 5), [artists])

  // "Nghe gần đây" lấy từ lịch sử nghe khi đã đăng nhập; khách xem các playlist gợi ý.
  const recentTracks = useMemo(() => {
    const seen = new Set()
    return library.history.map((entry) => store.findTrack(entry.trackId)).filter((track) => track && store.isPlayable(track.id) && !seen.has(track.id) && seen.add(track.id)).slice(0, 6)
  }, [library.history, store])

  // Gợi ý: ưu tiên thể loại nghe nhiều trong lịch sử; khi AI offline dùng bài phổ biến (fallback G10).
  const recommendedPlaylists = useMemo(() => {
    if (!aiAvailable) return [...playlists].filter((playlist) => playlist.official).slice(0, 5)
    return playlists.slice(0, 5)
  }, [aiAvailable])

  const playAlbum = (album) => player.playCollection(publicTracks.filter((track) => track.albumId === album.id))

  return (
    <div className="pb-12">
      <section className="relative overflow-hidden px-5 pb-8 pt-3 sm:px-8 sm:pt-6">
        <div className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full bg-violet-500/15 blur-[100px]" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-200/80">{currentUser ? `Chào ${currentUser.displayName}` : 'Thứ bạn muốn nghe, ở đây'}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Tối nay, nghe gì?</h1>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
          <button onClick={() => player.playPlaylist(playlists[0])} className="group relative min-h-[220px] overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-950 via-[#32214b] to-[#9b4c5d] p-6 text-left shadow-glow transition hover:border-violet-300/30 sm:min-h-[250px] sm:p-8">
            <div className="absolute -right-4 -top-10 h-64 w-64 rounded-full bg-fuchsia-300/20 blur-3xl transition group-hover:scale-125" />
            <div className="absolute -bottom-28 right-8 h-64 w-64 rounded-full border border-white/15 bg-white/[0.04]" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] text-violet-100"><Icon name="spark" size={14} /> AURATUNE MIX</span>
                <h2 className="mt-5 max-w-md text-2xl font-bold leading-tight sm:text-3xl">Giai điệu hợp với<br className="hidden sm:block" /> khoảnh khắc của bạn.</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-white/70">Một tuyển tập được làm mới mỗi ngày, bắt đầu từ những gì bạn yêu thích.</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">Phát Aura Mix <span className="transition group-hover:translate-x-1">→</span></span>
            </div>
          </button>

          <div className="grid grid-cols-2 content-start gap-2.5">
            {recentTracks.length > 0 ? recentTracks.slice(0, 4).map((track) => (
              <button key={track.id} onClick={() => player.playTrack(track, recentTracks)} className="group flex min-w-0 items-center gap-3 overflow-hidden rounded-lg bg-white/[0.06] pr-2 text-left transition hover:bg-white/[0.12]">
                <CoverArt variant={track.cover} className="h-14 w-14 shrink-0 rounded-l-lg [&_span]:text-3xl" />
                <span className="min-w-0"><span className="line-clamp-1 text-xs font-semibold leading-4 text-zinc-100">{track.title}</span><span className="mt-0.5 line-clamp-1 text-[10px] text-zinc-500">{track.artist}</span></span>
              </button>
            )) : recentlyPlayed.map((item) => (
              <Link key={item.id} to={`/playlist/${item.id}`} className="group flex min-w-0 items-center gap-3 overflow-hidden rounded-lg bg-white/[0.06] pr-2 text-left transition hover:bg-white/[0.12]">
                <CoverArt variant={item.cover} className="h-14 w-14 shrink-0 rounded-l-lg" />
                <span className="line-clamp-2 text-xs font-semibold leading-4 text-zinc-100">{item.title}</span>
              </Link>
            ))}
            <Link to={currentUser ? '/playlist/liked' : '/login?next=%2Fplaylist%2Fliked'} className="flex items-center gap-3 overflow-hidden rounded-lg bg-white/[0.06] pr-3 transition hover:bg-white/[0.12]">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-l-lg bg-gradient-to-br from-sky-400 to-blue-900 text-xl">♫</div>
              <p className="text-xs font-semibold leading-4 text-zinc-200">Những bản hit<br />bạn đã lưu</p>
            </Link>
          </div>
        </div>
        {recentTracks.length > 0 && <p className="mt-3 text-[11px] text-zinc-500">Bài hát bạn nghe gần đây · <Link to="/history" className="font-semibold text-zinc-300 hover:text-white">Xem lịch sử</Link></p>}
      </section>

      <section className="px-5 pt-2 sm:px-8">
        <SectionHeading
          title={aiAvailable ? 'Có thể bạn sẽ thích' : 'Phổ biến trên AuraTune'}
          subtitle={aiAvailable ? 'Giai điệu được chọn theo gu nghe nhạc của bạn' : 'AI gợi ý đang tạm gián đoạn, đây là các tuyển tập được nghe nhiều'}
          action="Xem tất cả"
          actionTo="/explore"
        />
        <div className={gridClass}>
          {recommendedPlaylists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} onPlayPlaylist={player.playPlaylist} />)}
        </div>
      </section>

      <section className="mt-10 px-5 sm:px-8">
        <SectionHeading title="Album mới phát hành" subtitle="Những phát hành mới nhất trên AuraTune" action="Khám phá thêm" actionTo="/explore" />
        <div className={gridClass}>
          {newAlbums.map((album) => <AlbumCard key={album.id} album={album} artistName={getArtist(album.artistId)?.name} onPlay={playAlbum} />)}
        </div>
      </section>

      <section className="mt-10 px-5 sm:px-8">
        <SectionHeading title="Đang được yêu thích" subtitle="Những giai điệu đang được nghe nhiều tuần này" action="Bảng xếp hạng" actionTo="/charts" />
        <div className="mt-4 rounded-xl bg-white/[0.025] p-1 sm:p-2">
          {trending.map((track, index) => <SongRow key={track.id} track={track} index={index} showPlays onPlay={(item) => player.playTrack(item, trending)} onDownloadTrack={player.downloadTrack} />)}
        </div>
      </section>

      <section className="mt-10 px-5 sm:px-8">
        <SectionHeading title="Nghệ sĩ nổi bật" subtitle="Những nghệ sĩ bạn có thể muốn theo dõi" />
        <div className={gridClass}>
          {featuredArtists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)}
        </div>
      </section>

      <section className="mt-10 px-5 sm:px-8">
        <SectionHeading title="Tuyển tập dành cho bạn" subtitle="Mood nào cũng có một playlist vừa vặn" action="Khám phá thêm" actionTo="/explore" />
        <div className={gridClass}>
          {playlists.slice(1).map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} onPlayPlaylist={player.playPlaylist} />)}
        </div>
      </section>

      <section className="mt-10 px-5 sm:px-8">
        <SectionHeading title="Thể loại" subtitle="Chọn một thể loại để bắt đầu" action="Tất cả thể loại" actionTo="/explore" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {genres.map((genre) => <GenreTile key={genre.id} genre={genre} />)}
        </div>
      </section>
      <div className="h-8" />
    </div>
  )
}
