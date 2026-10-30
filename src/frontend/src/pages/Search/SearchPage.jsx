import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Quote, SearchX, Sparkles } from 'lucide-react'
import PlaylistCard from '../../components/playlist/PlaylistCard.jsx'
import CoverArt from '../../components/playlist/CoverArt.jsx'
import { AlbumCard, ArtistCard, GenreTile } from '../../components/playlist/MediaCards.jsx'
import SongRow from '../../components/song/SongRow.jsx'
import { EmptyState, PageHeader, SectionHeading, chipClass } from '../../components/common/ui.jsx'
import { useStore } from '../../context/AppStore.jsx'
import { usePlayer } from '../../context/PlayerContext.jsx'
import { genres, getArtist } from '../../utils/mockData.js'
import { getQueryParam, navigate, useLocation } from '../../utils/navigation.jsx'
import { searchCatalog, sortTracks } from '../../utils/searchEngine.js'

const tabs = [
  { id: 'all', label: 'Tất cả' },
  { id: 'tracks', label: 'Bài hát' },
  { id: 'artists', label: 'Nghệ sĩ' },
  { id: 'albums', label: 'Album' },
  { id: 'playlists', label: 'Playlist' },
  { id: 'lyrics', label: 'Theo lời bài hát' },
]

const grid = 'mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

export default function SearchPage() {
  const store = useStore()
  const player = usePlayer()
  const { search } = useLocation()
  const query = getQueryParam(search, 'q')
  const tab = getQueryParam(search, 'type') || 'all'
  const [sort, setSort] = useState('relevance')
  const [draft, setDraft] = useState(query)
  useEffect(() => setDraft(query), [query])

  const results = useMemo(() => searchCatalog(query, { tracks: store.publicTracks, aiAvailable: store.aiAvailable }), [query, store.publicTracks, store.aiAvailable])
  const sortedTracks = useMemo(() => sortTracks(results.tracks, sort), [results.tracks, sort])
  const total = results.tracks.length + results.artists.length + results.albums.length + results.playlists.length + results.lyrics.length

  const setParam = (next) => {
    const params = new URLSearchParams(search)
    Object.entries(next).forEach(([key, value]) => (value ? params.set(key, value) : params.delete(key)))
    navigate(`/search?${params.toString()}`, { replace: true })
  }

  const playAlbum = (album) => player.playCollection(store.publicTracks.filter((track) => track.albumId === album.id))
  const show = (id) => tab === 'all' || tab === id

  return (
    <div className="pb-12">
      <PageHeader eyebrow="Tìm kiếm" title={query ? `Kết quả cho “${query}”` : 'Tìm kiếm'} description="Tìm theo tên bài hát, nghệ sĩ, album, playlist, một câu hát bạn nhớ hoặc mô tả cảm xúc." />

      <div className="px-5 sm:px-8">
        <form onSubmit={(event) => { event.preventDefault(); setParam({ q: draft.trim() }) }} className="flex gap-2 md:hidden">
          <input type="search" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Bạn muốn nghe gì?" aria-label="Từ khóa tìm kiếm" className="h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm text-white outline-none focus:border-sky-300/40" />
          <button type="submit" className="rounded-xl bg-sky-200 px-4 text-xs font-bold text-slate-950">Tìm</button>
        </form>

        {!query ? (
          <>
            <SectionHeading title="Duyệt theo thể loại" />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">{genres.map((genre) => <GenreTile key={genre.id} genre={genre} />)}</div>
          </>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin" role="tablist" aria-label="Lọc kết quả">
                {tabs.map((item) => <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} onClick={() => setParam({ type: item.id === 'all' ? '' : item.id })} className={chipClass(tab === item.id)}>{item.label}</button>)}
              </div>
              {(tab === 'all' || tab === 'tracks') && results.tracks.length > 1 && (
                <label className="flex items-center gap-2 text-xs text-zinc-400">Sắp xếp
                  <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-1.5 text-xs text-white outline-none">
                    <option value="relevance">Liên quan nhất</option>
                    <option value="plays">Lượt nghe nhiều nhất</option>
                    <option value="newest">Mới phát hành</option>
                    <option value="title">Tên A–Z</option>
                  </select>
                </label>
              )}
            </div>

            {!store.aiAvailable && (
              <p role="status" className="mt-4 flex items-start gap-2 rounded-xl border border-amber-300/20 bg-amber-300/[0.06] px-4 py-3 text-xs leading-5 text-amber-100"><AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden="true" /> Tìm kiếm AI theo ý nghĩa tạm thời không khả dụng. Kết quả bên dưới chỉ dựa trên từ khóa trong tên bài hát, nghệ sĩ, album và playlist.</p>
            )}

            {results.ai && tab === 'all' && (
              <section className="mt-6 rounded-2xl border border-sky-300/15 bg-gradient-to-br from-sky-300/[0.06] to-violet-400/[0.05] p-4 sm:p-5">
                <p className="flex items-center gap-2 text-xs font-semibold text-sky-100"><Sparkles size={14} aria-hidden="true" /> AI hiểu ý bạn</p>
                <p className="mt-1.5 text-xs leading-5 text-zinc-400">{results.ai.reason}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {results.ai.tracks.slice(0, 4).map((track) => (
                    <button key={track.id} type="button" onClick={() => player.playTrack(track, results.ai.tracks)} className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-2 text-left transition hover:bg-white/[0.09]">
                      <CoverArt variant={track.cover} className="h-11 w-11 shrink-0 rounded-md [&_span]:text-2xl" />
                      <span className="min-w-0"><span className="block truncate text-[13px] font-semibold text-white">{track.title}</span><span className="block truncate text-[11px] text-zinc-500">{track.artist}</span></span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {total === 0 && !(results.ai && tab === 'all') && (
              <div className="mt-8"><EmptyState icon={SearchX} title={`Không tìm thấy kết quả cho “${query}”`} description="Hãy kiểm tra chính tả, thử từ khóa ngắn hơn hoặc mô tả cảm xúc như “nhạc buồn đêm mưa”." /></div>
            )}

            {show('tracks') && sortedTracks.length > 0 && (
              <section className="mt-8">
                <SectionHeading title="Bài hát" subtitle={`${sortedTracks.length} kết quả`} />
                <div className="mt-3 rounded-xl bg-white/[0.025] p-1 sm:p-2">
                  {(tab === 'all' ? sortedTracks.slice(0, 5) : sortedTracks).map((track, index) => <SongRow key={track.id} track={track} index={index} showPlays onPlay={(item) => player.playTrack(item, sortedTracks)} />)}
                </div>
              </section>
            )}
            {tab === 'tracks' && !sortedTracks.length && <div className="mt-8"><EmptyState compact icon={SearchX} title="Không có bài hát khớp từ khóa" /></div>}

            {show('lyrics') && results.lyrics.length > 0 && (
              <section className="mt-8">
                <SectionHeading title="Khớp lời bài hát" />
                <div className="mt-3 space-y-2">
                  {results.lyrics.map(({ track, line }) => (
                    <button key={track.id} type="button" onClick={() => player.playTrack(track)} className="flex w-full items-center gap-3 rounded-xl bg-white/[0.03] p-3 text-left transition hover:bg-white/[0.07]">
                      <CoverArt variant={track.cover} className="h-12 w-12 shrink-0 rounded-md [&_span]:text-2xl" />
                      <span className="min-w-0 flex-1"><span className="flex items-center gap-1.5 text-sm italic text-zinc-200"><Quote size={13} aria-hidden="true" className="shrink-0 text-violet-300" /> <span className="truncate">{line}</span></span><span className="mt-1 block truncate text-[11px] text-zinc-500">{track.title} · {track.artist}</span></span>
                    </button>
                  ))}
                </div>
              </section>
            )}
            {tab === 'lyrics' && !results.lyrics.length && <div className="mt-8"><EmptyState compact icon={Quote} title="Không tìm thấy câu hát nào khớp" description="Hiện chỉ một số bài hát có lời được đồng bộ. Hãy thử một cụm từ khác." /></div>}

            {show('artists') && results.artists.length > 0 && (
              <section className="mt-8"><SectionHeading title="Nghệ sĩ" /><div className={grid}>{results.artists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)}</div></section>
            )}
            {tab === 'artists' && !results.artists.length && <div className="mt-8"><EmptyState compact icon={SearchX} title="Không có nghệ sĩ khớp từ khóa" /></div>}

            {show('albums') && results.albums.length > 0 && (
              <section className="mt-8"><SectionHeading title="Album" /><div className={grid}>{results.albums.map((album) => <AlbumCard key={album.id} album={album} artistName={getArtist(album.artistId)?.name} onPlay={playAlbum} />)}</div></section>
            )}
            {tab === 'albums' && !results.albums.length && <div className="mt-8"><EmptyState compact icon={SearchX} title="Không có album khớp từ khóa" /></div>}

            {show('playlists') && (results.playlists.length > 0 || (tab === 'all' && results.ai)) && (
              <section className="mt-8">
                <SectionHeading title="Playlist" subtitle={results.playlists.length ? '' : 'Gợi ý từ AI theo mô tả của bạn'} />
                <div className={grid}>{(results.playlists.length ? results.playlists : results.ai.playlists).map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} onPlayPlaylist={player.playPlaylist} />)}</div>
              </section>
            )}
            {tab === 'playlists' && !results.playlists.length && <div className="mt-8"><EmptyState compact icon={SearchX} title="Không có playlist khớp từ khóa" /></div>}
          </>
        )}
      </div>
    </div>
  )
}
