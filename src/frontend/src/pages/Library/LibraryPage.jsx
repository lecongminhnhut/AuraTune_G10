import { useState } from 'react'
import { Heart, Plus, Sparkles } from 'lucide-react'
import PlaylistCard from '../../components/playlist/PlaylistCard.jsx'
import { AlbumCard, ArtistCard } from '../../components/playlist/MediaCards.jsx'
import { EmptyState, LoginRequired, PageHeader, SectionHeading, chipClass, primaryButton, secondaryButton } from '../../components/common/ui.jsx'
import { useStore } from '../../context/AppStore.jsx'
import { usePlayer } from '../../context/PlayerContext.jsx'
import { getArtist } from '../../utils/mockData.js'
import { Link } from '../../utils/navigation.jsx'
import { normalizeText } from '../../utils/aiMockData.js'

const grid = 'mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

export default function LibraryPage() {
  const store = useStore()
  const player = usePlayer()
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const needle = normalizeText(query.trim())
  const matches = (text) => !needle || normalizeText(text).includes(needle)

  const playlists = [store.likedPlaylist, ...store.userPlaylists].filter(Boolean).map((playlist) => store.findPlaylistById(playlist.id) ?? playlist)
  const albums = store.library.savedAlbumIds.map(store.getAlbum).filter(Boolean)
  const artists = store.library.follows.map((item) => getArtist(item.artistId)).filter((artist) => artist?.isPublic)

  if (!store.currentUser) return <LoginRequired description="Đăng nhập để xem playlist, album đã lưu và nghệ sĩ bạn theo dõi." />

  const shownPlaylists = playlists.filter((playlist) => matches(playlist.title))
  const shownAlbums = albums.filter((album) => matches(album.title))
  const shownArtists = artists.filter((artist) => matches(artist.name))

  return (
    <div className="pb-12">
      <PageHeader eyebrow="Thư viện của bạn" title="Thư viện" description="Playlist, album và nghệ sĩ bạn đã lưu.">
        <div className="flex gap-2">
          <Link to="/ai-playlist" className={secondaryButton}><Sparkles size={15} /> AI Playlist</Link>
          <button type="button" onClick={() => store.openCreatePlaylist()} className={primaryButton}><Plus size={15} /> Tạo playlist</button>
        </div>
      </PageHeader>
      <div className="px-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2" role="tablist" aria-label="Lọc thư viện">
            {[['all', 'Tất cả'], ['playlists', 'Playlist'], ['albums', 'Album'], ['artists', 'Nghệ sĩ']].map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={filter === id} onClick={() => setFilter(id)} className={chipClass(filter === id)}>{label}</button>)}
          </div>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm trong thư viện" aria-label="Tìm trong thư viện" className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs text-white outline-none focus:border-violet-300/50 sm:w-56" />
        </div>

        {(filter === 'all' || filter === 'playlists') && (
          <section className="mt-8">
            <SectionHeading title="Playlist" />
            {shownPlaylists.length ? <div className={grid}>{shownPlaylists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} onPlayPlaylist={player.playPlaylist} />)}</div> : <div className="mt-4"><EmptyState compact icon={Heart} title="Không có playlist phù hợp" /></div>}
          </section>
        )}
        {(filter === 'all' || filter === 'albums') && (
          <section className="mt-10">
            <SectionHeading title="Album đã lưu" />
            {shownAlbums.length ? <div className={grid}>{shownAlbums.map((album) => <AlbumCard key={album.id} album={album} artistName={getArtist(album.artistId)?.name} />)}</div> : <div className="mt-4"><EmptyState compact title="Chưa lưu album nào" description="Bấm “Lưu album” trên trang album để thêm vào đây." /></div>}
          </section>
        )}
        {(filter === 'all' || filter === 'artists') && (
          <section className="mt-10">
            <SectionHeading title="Nghệ sĩ đang theo dõi" action="Xem tất cả" actionTo="/following" />
            {shownArtists.length ? <div className={grid}>{shownArtists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)}</div> : <div className="mt-4"><EmptyState compact title="Chưa theo dõi nghệ sĩ nào" /></div>}
          </section>
        )}
      </div>
    </div>
  )
}
