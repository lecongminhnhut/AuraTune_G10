import { Maximize2, Repeat1, Sparkles, VolumeX } from 'lucide-react'
import Icon from '../common/Icon.jsx'
import CoverArt from '../playlist/CoverArt.jsx'
import WaveformSeekBar from './WaveformSeekBar.jsx'

export default function BottomPlayer({ player, liked, onToggleLike, onDownloadTrack, onOpenChat, chatOpen, onExpand, fullScreenOpen, onTogglePlayback, onOpenQueue, queueOpen }) {
  const { track, isPlaying, elapsed, shuffle, repeatMode, volume, muted } = player

  return (
    <footer aria-label="Trình phát nhạc demo" className="fixed inset-x-0 bottom-0 z-40 h-[88px] border-t border-white/[0.08] bg-[#09090b]/95 px-3 backdrop-blur-2xl sm:px-5">
      <div className="grid h-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(180px,1.2fr)_minmax(0,1fr)] md:gap-6">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={onExpand} aria-label={`Mở trình phát toàn màn hình: ${track.title}`} aria-expanded={fullScreenOpen} aria-controls="full-screen-player" title="Mở giao diện đang phát" className="group flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
            <div className="relative shrink-0 overflow-hidden rounded-md">
              {track.artwork ? <img src={track.artwork} alt={`Bìa ${track.album}`} className="h-10 w-10 object-cover shadow-lg sm:h-12 sm:w-12" /> : <CoverArt variant={track.cover} className="h-10 w-10 shadow-lg sm:h-12 sm:w-12 [&_span]:text-3xl" />}
              <span className="absolute inset-0 grid place-items-center bg-black/40 text-white opacity-0 transition group-hover:opacity-100"><Maximize2 size={17} aria-hidden="true" /></span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2"><p className="truncate text-xs font-semibold text-white sm:text-sm">{track.title}</p><span title="Phát mô phỏng, không có âm thanh" className="hidden rounded border border-sky-300/15 bg-sky-300/5 px-1 py-0.5 text-[8px] font-semibold tracking-wider text-sky-300/70 lg:inline">DEMO</span></div>
              <p className="mt-1 truncate text-[11px] text-zinc-400">{track.artist}</p>
            </div>
          </button>
          <button onClick={onToggleLike} aria-label={liked ? 'Bỏ thích bài hát' : 'Thích bài hát'} aria-pressed={liked} className={`ml-1 hidden transition sm:inline-flex ${liked ? 'text-violet-300' : 'text-zinc-500 hover:text-white'}`}><Icon name="heart" size={17} className={liked ? 'fill-current' : ''} /></button>
          <button onClick={() => onDownloadTrack(track)} aria-label={`Tải xuống ${track.title}`} title="Tải xuống" className="hidden text-zinc-500 transition hover:text-violet-200 sm:inline-flex"><Icon name="download" size={16} /></button>
        </div>

        <div className="flex min-w-0 flex-col items-center justify-center gap-1.5">
          <div className="flex items-center gap-3 sm:gap-5">
            <button onClick={player.toggleShuffle} aria-label="Phát ngẫu nhiên" aria-pressed={shuffle} className={`hidden transition hover:text-violet-300 sm:inline-flex ${shuffle ? 'text-violet-300' : 'text-zinc-500'}`}><Icon name="shuffle" size={17} /></button>
            <button onClick={player.previousTrack} aria-label="Bài trước" className="hidden text-zinc-400 transition hover:text-white sm:inline-flex"><Icon name="previous" size={19} /></button>
            <button onClick={onTogglePlayback} aria-label={isPlaying ? 'Tạm dừng' : 'Phát'} className="grid h-9 w-9 place-items-center rounded-full bg-white text-zinc-950 transition hover:scale-105 hover:bg-violet-200">
              <Icon name={isPlaying ? 'pause' : 'play'} size={18} />
            </button>
            <button onClick={player.nextTrack} aria-label="Bài tiếp theo" className="hidden text-zinc-400 transition hover:text-white sm:inline-flex"><Icon name="next" size={19} /></button>
            <button onClick={player.cycleRepeat} aria-label="Lặp lại" aria-pressed={repeatMode !== 'off'} className={`hidden transition hover:text-violet-300 sm:inline-flex ${repeatMode !== 'off' ? 'text-violet-300' : 'text-zinc-500'}`}>{repeatMode === 'one' ? <Repeat1 size={17} /> : <Icon name="repeat" size={17} />}</button>
          </div>
          <div className="hidden w-full sm:block"><WaveformSeekBar compact track={track} elapsed={elapsed} onSeek={player.seek} /></div>
        </div>

        <div className="flex items-center justify-end gap-2 text-zinc-400 sm:gap-3">
          <button onClick={onExpand} aria-label="Xem lời bài hát" className="hidden transition hover:text-violet-300 lg:inline-flex"><Icon name="lyrics" size={17} /></button>
          <button onClick={onOpenQueue} aria-label="Danh sách chờ" aria-expanded={queueOpen} title="Danh sách chờ" className={`inline-flex transition hover:text-violet-300 ${queueOpen ? 'text-violet-300' : ''}`}><Icon name="queue" size={18} /></button>
                    <button onClick={() => player.setMuted(!muted)} aria-label={muted ? 'Bật tiếng' : 'Tắt tiếng'} aria-pressed={muted} className="hidden transition hover:text-white md:inline-flex">{muted || volume === 0 ? <VolumeX size={17} /> : <Icon name="volume" size={17} />}</button>
          <input aria-label="Âm lượng" type="range" min="0" max="100" value={muted ? 0 : volume} onChange={(event) => { player.setVolume(Number(event.target.value)); if (muted) player.setMuted(false) }} className="hidden h-1 w-16 cursor-pointer accent-violet-300 md:block xl:w-24" />
          <button onClick={onExpand} aria-label="Mở rộng trình phát" aria-expanded={fullScreenOpen} aria-controls="full-screen-player" title="Toàn màn hình" className="hidden rounded-md p-1.5 transition hover:bg-white/5 hover:text-white sm:inline-flex"><Maximize2 size={17} /></button>
          <button type="button" onClick={onOpenChat} aria-label="Mở AI Host từ trình phát" aria-expanded={chatOpen} aria-controls="ai-host-panel" className="relative ml-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-sky-300/20 bg-sky-300/[0.07] text-sky-200 transition hover:border-sky-300/50 hover:bg-sky-300/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
            <Sparkles size={18} aria-hidden="true" /><span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-zinc-950 bg-emerald-400" />
          </button>
        </div>
      </div>
    </footer>
  )
}
