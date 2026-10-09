import Icon from '../common/Icon.jsx'
import SongRow from './SongRow.jsx'

export default function SongTable({ songs, onPlayTrack, onDownloadTrack }) {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-[28px_minmax(0,1fr)_94px] items-center gap-3 border-b border-white/10 px-3 pb-3 text-[11px] uppercase tracking-wider text-zinc-500 md:grid-cols-[28px_minmax(0,1.8fr)_minmax(120px,1fr)_minmax(90px,.8fr)_108px]">
        <span>#</span><span>Title</span><span className="hidden md:block">Album</span><span className="hidden md:block">Date added</span><span className="flex justify-end"><Icon name="clock" size={15} /></span>
      </div>
      <div className="mt-2">
        {songs.map((track, index) => <SongRow key={track.id} track={track} index={index} onPlay={onPlayTrack} onDownloadTrack={onDownloadTrack} />)}
      </div>
    </div>
  )
}
