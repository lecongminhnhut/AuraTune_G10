import { useMemo } from 'react'
import { Bookmark, BookmarkCheck, Share2, Shuffle } from 'lucide-react'
import Icon from '../../components/common/Icon.jsx'
import CoverArt from '../../components/playlist/CoverArt.jsx'
import { AlbumCard, releaseYear } from '../../components/playlist/MediaCards.jsx'
import SongTable from '../../components/song/SongTable.jsx'
import { EmptyState, NotFound, SectionHeading } from '../../components/common/ui.jsx'
import { formatTotalDuration, useStore } from '../../context/AppStore.jsx'
import { usePlayer } from '../../context/PlayerContext.jsx'
import { getArtist } from '../../utils/mockData.js'
import { getDurationSeconds } from '../../utils/playback.js'
import { Link } from '../../utils/navigation.jsx'

// Trang chi tiết album (G08): bìa, nghệ sĩ, năm phát hành, tổng thời lượng, danh sách bài kèm lượt nghe.
export default function AlbumPage({ albumId }) {
  const store = useStore()
  const player = usePlayer()
  const album = store.getAlbum(albumId)
  const artist = getArtist(album?.artistId)
  const albumTracks = useMemo(() => store.publicTracks.filter((track) => track.albumId === albumId), [store.publicTracks, albumId])
  const moreAlbums = useMemo(() => store.albums.filter((item) => item.artistId === album?.artistId && item.id !== albumId), [store.albums, album, albumId])

  if (!album) return <NotFound title="Không tìm thấy album" />

  const totalSeconds = albumTracks.reduce((sum, track) => sum + getDurationSeconds(track.duration), 0)
  const saved = store.isAlbumSaved(album.id)
  const toggleSave = () => {
    if (!store.toggleSaveAlbum(album.id)) { player.requireLogin('Đăng nhập để lưu album vào thư viện.'); return }
    store.toast(saved ? 'Đã xóa album khỏi thư viện.' : 'Đã lưu album vào thư viện.')
  }

  return (
    <div className="pb-12">
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-900/50 via-violet-950/20 to-transparent px-5 pb-7 pt-6 sm:px-8 sm:pb-9 sm:pt-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[100px]" />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:gap-7">
          <CoverArt variant={album.cover} title={album.title} showLabel className="h-48 w-48 shrink-0 rounded-xl shadow-2xl shadow-black/40 sm:h-56 sm:w-56" />
          <div className="min-w-0 pb-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-200">{albumTracks.length <= 1 ? 'Đĩa đơn' : 'Album'}</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">{album.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-300">
              {artist?.isPublic ? <Link to={`/artist/${artist.id}`} className="font-semibold text-white hover:underline">{artist.name}</Link> : <span className="font-semibold text-white">{artist?.name}</span>}
              <span className="text-zinc-600">·</span><span>{releaseYear(album.releaseDate)}</span>
              <span className="text-zinc-600">·</span><span>{albumTracks.length} bài hát</span>
              <span className="text-zinc-600">·</span><span>{formatTotalDuration(totalSeconds)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8">
        <div className="flex flex-wrap items-center gap-3 py-5">
          <button onClick={() => player.playCollection(albumTracks)} disabled={!albumTracks.length} aria-label="Phát album" className="grid h-14 w-14 place-items-center rounded-full bg-violet-300 text-zinc-950 shadow-glow transition hover:scale-105 hover:bg-violet-200 disabled:opacity-40"><Icon name="play" size={23} /></button>
          <button onClick={() => player.playCollection(albumTracks, { shuffle: true })} disabled={!albumTracks.length} aria-label="Phát ngẫu nhiên album" title="Phát ngẫu nhiên" className="rounded-full p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:opacity-40"><Shuffle size={21} /></button>
          <button onClick={toggleSave} aria-pressed={saved} className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition ${saved ? 'border-violet-300/40 bg-violet-300/10 text-violet-200' : 'border-white/20 text-zinc-300 hover:border-white/50 hover:text-white'}`}>{saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}{saved ? 'Đã lưu' : 'Lưu album'}</button>
          <button onClick={() => player.share(`/album/${album.id}`, `${album.title} · ${artist?.name ?? ''}`)} aria-label="Chia sẻ album" title="Chia sẻ" className="rounded-full p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white"><Share2 size={19} /></button>
          <button onClick={() => player.addManyToQueue(albumTracks)} disabled={!albumTracks.length} className="ml-auto text-xs font-semibold text-zinc-400 transition hover:text-white disabled:opacity-40">Thêm tất cả vào danh sách chờ</button>
        </div>

        {albumTracks.length ? (
          <SongTable songs={albumTracks} showPlays onPlayTrack={(track) => player.playTrack(track, albumTracks)} onDownloadTrack={player.downloadTrack} />
        ) : (
          <EmptyState title="Album chưa có bài hát khả dụng" description="Các bài hát có thể đang bị ẩn hoặc đã được gỡ." />
        )}
        <p className="mt-7 text-xs text-zinc-500">Phát hành {new Date(album.releaseDate).toLocaleDateString('vi-VN')} · © {releaseYear(album.releaseDate)} {artist?.name}</p>

        {moreAlbums.length > 0 && (
          <section className="mt-10">
            <SectionHeading title={`Thêm từ ${artist?.name}`} />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{moreAlbums.map((item) => <AlbumCard key={item.id} album={item} artistName={artist?.name} />)}</div>
          </section>
        )}
      </section>
    </div>
  )
}
