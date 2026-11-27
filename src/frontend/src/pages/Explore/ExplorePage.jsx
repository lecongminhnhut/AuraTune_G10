import { useMemo } from 'react'
import SongTable from '../../components/song/SongTable.jsx'
import { EmptyState, PageHeader, chipClass } from '../../components/common/ui.jsx'
import { useStore } from '../../context/AppStore.jsx'
import { usePlayer } from '../../context/PlayerContext.jsx'
import { genres } from '../../config/genres.js'
import { Link, getQueryParam, useLocation } from '../../utils/navigation.jsx'

export default function ExplorePage() {
  const store = useStore()
  const player = usePlayer()
  const { search } = useLocation()
  const genreId = getQueryParam(search, 'genre')
  const genre = genres.find((item) => item.id === genreId)
  const genreTracks = useMemo(() => store.publicTracks.filter((track) => !genreId || track.genre === genreId), [store.publicTracks, genreId])

  return (
    <div className="pb-12">
      <PageHeader eyebrow="Khám phá" title={genre ? genre.name : 'Khám phá âm nhạc'} description="Duyệt và phát các bài hát đang có trong catalog AuraTune.">
        {genreTracks.length > 0 && <button type="button" onClick={() => player.playCollection(genreTracks)} className="rounded-full bg-violet-300 px-5 py-2.5 text-xs font-bold text-zinc-950 transition hover:bg-violet-200">Phát {genre?.name || 'catalog'}</button>}
      </PageHeader>
      <div className="px-5 sm:px-8">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin" aria-label="Thể loại">
          <Link to="/explore" className={chipClass(!genre)}>Tất cả</Link>
          {genres.map((item) => <Link key={item.id} to={`/explore?genre=${item.id}`} className={chipClass(item.id === genreId)}>{item.name}</Link>)}
        </div>
        {genreTracks.length ? <div className="mt-8"><SongTable songs={genreTracks} showPlays onPlayTrack={(track) => player.playTrack(track, genreTracks)} /></div> : <div className="mt-8"><EmptyState title={genre ? `Chưa có bài hát thuộc ${genre.name}` : 'Chưa tải được catalog'} description="Các bài hát trong Supabase sẽ xuất hiện tại đây khi kho nhạc tải thành công." /></div>}
      </div>
    </div>
  )
}
