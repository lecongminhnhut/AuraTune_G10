import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, Loader2, Share2, UserPlus } from 'lucide-react'
import Icon from '../../components/common/Icon.jsx'
import PlaylistCard from '../../components/playlist/PlaylistCard.jsx'
import { AlbumCard, ArtistAvatar } from '../../components/playlist/MediaCards.jsx'
import SongRow from '../../components/song/SongRow.jsx'
import { EmptyState, ErrorState, NotFound, SectionHeading } from '../../components/common/ui.jsx'
import { useStore } from '../../context/AppStore.jsx'
import { usePlayer } from '../../context/PlayerContext.jsx'
import { getArtist, playlists } from '../../utils/mockData.js'

const grid = 'mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

// Thứ tự bài nổi bật theo spec 091 FR-010A/B: lượt nghe AuraTune giảm dần, ngày phát hành giảm dần, ID tăng dần.
const byFeatured = (a, b) => b.playCount - a.playCount || b.releaseDate.localeCompare(a.releaseDate) || a.id.localeCompare(b.id)
// Album theo FR-012: ngày phát hành giảm dần, tên tăng dần, ID tăng dần.
const byAlbum = (a, b) => b.releaseDate.localeCompare(a.releaseDate) || a.title.localeCompare(b.title, 'vi') || a.id.localeCompare(b.id)
// Playlist liên quan theo FR-014A: cập nhật gần nhất, rồi ID tăng dần.
const byPlaylist = (a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id)

// Mô phỏng tải dữ liệu từ API để có trạng thái đang tải / lỗi tạm thời / thử lại (FR-019, FR-021).
function useSimulatedLoad(key) {
  const [status, setStatus] = useState('loading')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    setStatus('loading')
    const timer = window.setTimeout(() => setStatus(navigator.onLine === false ? 'error' : 'ready'), 280)
    return () => window.clearTimeout(timer)
  }, [key, attempt])
  return { status, retry: useCallback(() => setAttempt((value) => value + 1), []) }
}

export default function ArtistPage({ artistId }) {
  const store = useStore()
  const player = usePlayer()
  const { status, retry } = useSimulatedLoad(artistId)
  const artist = getArtist(artistId)
  const visible = artist?.isPublic

  const featured = useMemo(() => store.publicTracks.filter((track) => track.artistId === artistId).sort(byFeatured).slice(0, 5), [store.publicTracks, artistId])
  const artistAlbums = useMemo(() => store.albums.filter((album) => album.artistId === artistId).sort(byAlbum), [store.albums, artistId])
  const relatedPlaylists = useMemo(() => playlists
    .filter((playlist) => playlist.official && playlist.trackIds.some((id) => store.publicTracks.some((track) => track.id === id && track.artistId === artistId)))
    .sort(byPlaylist).slice(0, 6), [store.publicTracks, artistId])

  if (status === 'loading') {
    return (
      <div className="animate-pulse px-5 py-10 sm:px-8" aria-busy="true" aria-label="Đang tải hồ sơ nghệ sĩ">
        <div className="flex items-end gap-6"><div className="h-40 w-40 rounded-full bg-white/[0.06]" /><div className="space-y-3"><div className="h-4 w-24 rounded bg-white/[0.06]" /><div className="h-10 w-64 rounded bg-white/[0.06]" /></div></div>
      </div>
    )
  }
  if (status === 'error') return <div className="px-5 py-10 sm:px-8"><ErrorState title="Không tải được hồ sơ nghệ sĩ" description="Kết nối đang gián đoạn. Đây là lỗi tạm thời, không phải nghệ sĩ không tồn tại." onRetry={retry} /></div>
  // Nghệ sĩ không tồn tại và hồ sơ chưa công khai cho cùng một kết quả (FR-018, FR-018A).
  if (!visible) return <NotFound title="Không tìm thấy nghệ sĩ" description="Nghệ sĩ bạn tìm không có trên AuraTune." />

  const playable = featured.length ? featured : store.publicTracks.filter((track) => track.artistId === artistId)
  const playAlbum = (album) => player.playCollection(store.publicTracks.filter((track) => track.albumId === album.id))

  return (
    <div className="pb-12">
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-900/50 via-violet-950/20 to-transparent px-5 pb-7 pt-8 sm:px-8 sm:pb-9 sm:pt-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[100px]" />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:gap-8">
          <div className="h-40 w-40 shrink-0 overflow-hidden rounded-full shadow-2xl shadow-black/40 sm:h-52 sm:w-52"><ArtistAvatar artist={artist} /></div>
          <div className="min-w-0 pb-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-200">Nghệ sĩ</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-6xl">{artist.name}</h1>
            <p className="mt-3 text-xs text-zinc-400">{featured.length} bài hát nổi bật · {artistAlbums.length} album</p>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8">
        <div className="flex flex-wrap items-center gap-3 py-5">
          <button onClick={() => player.playCollection(playable)} disabled={!playable.length} aria-label={`Phát nhạc của ${artist.name}`} className="grid h-14 w-14 place-items-center rounded-full bg-violet-300 text-zinc-950 shadow-glow transition hover:scale-105 hover:bg-violet-200 disabled:opacity-40"><Icon name="play" size={23} /></button>
          <FollowButton artist={artist} />
          <button onClick={() => player.share(`/artist/${artist.id}`, artist.name)} aria-label={`Chia sẻ ${artist.name}`} title="Chia sẻ" className="rounded-full p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white"><Share2 size={19} /></button>
        </div>

        <div className="grid gap-10 xl:grid-cols-[1.4fr_1fr]">
          <section>
            <SectionHeading title="Phổ biến" subtitle="Tối đa 5 bài được nghe nhiều nhất trên AuraTune" />
            {featured.length ? (
              <div className="mt-3 rounded-xl bg-white/[0.025] p-1 sm:p-2">{featured.map((track, index) => <SongRow key={track.id} track={track} index={index} showPlays onPlay={(item) => player.playTrack(item, featured)} />)}</div>
            ) : <div className="mt-4"><EmptyState compact title="Chưa có bài hát nổi bật" description="Nghệ sĩ chưa có bài hát nào có thể phát." /></div>}
          </section>
          <section>
            <SectionHeading title="Giới thiệu" />
            <div className="mt-4 rounded-xl bg-white/[0.035] p-5">
              {artist.bio ? <p className="text-sm leading-7 text-zinc-300">{artist.bio}</p> : <p className="text-sm italic text-zinc-500">Nghệ sĩ chưa cung cấp tiểu sử.</p>}
            </div>
          </section>
        </div>

        <section className="mt-10">
          <SectionHeading title="Album" />
          {artistAlbums.length ? <div className={grid}>{artistAlbums.map((album) => <AlbumCard key={album.id} album={album} artistName={artist.name} onPlay={playAlbum} />)}</div> : <div className="mt-4"><EmptyState compact title="Chưa có album" /></div>}
        </section>

        <section className="mt-10">
          <SectionHeading title="Có mặt trong playlist" subtitle="Playlist chính thức của AuraTune có bài hát của nghệ sĩ" />
          {relatedPlaylists.length ? <div className={grid}>{relatedPlaylists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} onPlayPlaylist={player.playPlaylist} />)}</div> : <div className="mt-4"><EmptyState compact title="Chưa có playlist liên quan" /></div>}
        </section>
      </section>
    </div>
  )
}

// Nút theo dõi (spec 092): phân biệt Đang theo dõi / Chưa theo dõi / Chưa xác định; lỗi giữ nguyên trạng thái đã lưu và cho thử lại.
function FollowButton({ artist }) {
  const store = useStore()
  const player = usePlayer()
  const [resolved, setResolved] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const userId = store.currentUser?.id
  const following = store.isFollowing(artist.id)

  useEffect(() => {
    setResolved(false)
    const timer = window.setTimeout(() => setResolved(true), 220)
    return () => window.clearTimeout(timer)
  }, [userId, artist.id])

  if (!userId) {
    return <button type="button" onClick={() => player.requireLogin('Đăng nhập để theo dõi nghệ sĩ.')} className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-zinc-300 transition hover:border-white/50 hover:text-white"><UserPlus size={15} /> Theo dõi</button>
  }
  if (!resolved) return <span className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-xs text-zinc-500" aria-live="polite"><Loader2 size={14} className="animate-spin" /> Đang kiểm tra…</span>

  const toggle = async () => {
    setPending(true)
    setError('')
    try {
      await store.setFollow(artist.id, !following)
      store.toast(following ? `Đã bỏ theo dõi ${artist.name}.` : `Đang theo dõi ${artist.name}.`)
    } catch (failure) {
      setError(failure.message || 'Không thể cập nhật. Vui lòng thử lại.')
    } finally {
      setPending(false)
    }
  }

  return (
    <span className="flex items-center gap-2">
      <button type="button" onClick={toggle} disabled={pending} aria-pressed={following} className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition disabled:cursor-wait ${following ? 'border-violet-300/40 bg-violet-300/10 text-violet-200' : 'border-white/20 text-zinc-300 hover:border-white/50 hover:text-white'}`}>
        {pending ? <Loader2 size={14} className="animate-spin" /> : following ? <Check size={15} /> : <UserPlus size={15} />}
        {pending ? 'Đang cập nhật…' : following ? 'Đang theo dõi' : 'Theo dõi'}
      </button>
      {error && <span role="alert" className="text-[11px] text-rose-300">{error} <button type="button" onClick={toggle} className="font-semibold underline">Thử lại</button></span>}
    </span>
  )
}
