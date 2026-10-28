import { useMemo, useState } from 'react'
import SongTable from '../../components/song/SongTable.jsx'
import { PageHeader, chipClass } from '../../components/common/ui.jsx'
import { useStore } from '../../context/AppStore.jsx'
import { usePlayer } from '../../context/PlayerContext.jsx'
import { genres } from '../../utils/mockData.js'

// Bảng xếp hạng tính theo lượt nghe trên AuraTune (G02).
export default function ChartsPage() {
  const store = useStore()
  const player = usePlayer()
  const [genre, setGenre] = useState('all')
  const ranked = useMemo(() => [...store.publicTracks].filter((track) => genre === 'all' || track.genre === genre).sort((a, b) => b.playCount - a.playCount || a.id.localeCompare(b.id)).slice(0, 20), [store.publicTracks, genre])

  return (
    <div className="pb-12">
      <PageHeader eyebrow="Bảng xếp hạng" title="Top bài hát AuraTune" description="Xếp hạng theo tổng lượt nghe được ghi nhận trên AuraTune.">
        <button type="button" onClick={() => player.playCollection(ranked)} className="rounded-full bg-violet-300 px-5 py-2.5 text-xs font-bold text-zinc-950 transition hover:bg-violet-200">Phát bảng xếp hạng</button>
      </PageHeader>
      <div className="px-5 sm:px-8">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin" role="tablist" aria-label="Lọc theo thể loại">
          <button type="button" role="tab" aria-selected={genre === 'all'} onClick={() => setGenre('all')} className={chipClass(genre === 'all')}>Tất cả</button>
          {genres.map((item) => <button key={item.id} type="button" role="tab" aria-selected={genre === item.id} onClick={() => setGenre(item.id)} className={chipClass(genre === item.id)}>{item.name}</button>)}
        </div>
        {ranked.length ? <SongTable songs={ranked} showPlays onPlayTrack={(track) => player.playTrack(track, ranked)} /> : <p className="mt-8 text-sm text-zinc-500">Chưa có bài hát trong thể loại này.</p>}
      </div>
    </div>
  )
}
