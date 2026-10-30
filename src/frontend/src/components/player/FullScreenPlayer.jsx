import { useEffect, useRef, useState } from 'react'
import { AudioLines, ChevronDown, Heart, ListEnd, ListMusic, ListPlus, MessageCircle, Pause, Play, Repeat, Repeat1, Share2, Shuffle, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import RecordDeck from './RecordDeck.jsx'
import WaveformSeekBar from './WaveformSeekBar.jsx'
import TrackComments from './TrackComments.jsx'
import { Link } from '../../utils/navigation.jsx'

const playerThemes = {
  ocean: { top: '#257bad', middle: '#286f9a', bottom: '#203f58' },
  rose: { top: '#986b91', middle: '#695378', bottom: '#342b47' },
  night: { top: '#3f5c9c', middle: '#344f80', bottom: '#212c48' },
  sunset: { top: '#a26556', middle: '#80505f', bottom: '#3f3049' },
  forest: { top: '#468c86', middle: '#3a706a', bottom: '#233d43' },
  violet: { top: '#8265a6', middle: '#655182', bottom: '#362e4d' },
  aurora: { top: '#656aa9', middle: '#645a93', bottom: '#35324f' },
}

const repeatLabels = { off: 'Bật lặp lại', all: 'Lặp lại danh sách', one: 'Lặp lại một bài' }

export default function FullScreenPlayer({ isOpen, onClose, player, liked, onToggleLike, onOpenQueue, onAddToPlaylist, onAddToQueue, onShare }) {
  const [panel, setPanel] = useState('lyrics')
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const closeActionRef = useRef(onClose)
  closeActionRef.current = onClose
  const { track, isPlaying, elapsed, shuffle, repeatMode, volume, muted } = player
  const theme = track.playerTheme ?? playerThemes[track.cover] ?? playerThemes.ocean
  const activeLyric = Math.max(0, (track.lyrics?.findLastIndex((line) => elapsed >= line.time) ?? 0))
  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat

  useEffect(() => {
    if (!isOpen) return undefined
    const previousFocus = document.activeElement
    closeRef.current?.focus({ preventScroll: true })
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeActionRef.current()
      if (event.key !== 'Tab') return
      const focusable = panelRef.current?.querySelectorAll('button, input, textarea, a[href]')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [isOpen])

  return (
    <section
      ref={panelRef}
      id="full-screen-player"
      role="dialog"
      aria-modal={isOpen ? true : undefined}
      aria-hidden={!isOpen}
      inert={!isOpen ? '' : undefined}
      aria-labelledby="now-playing-title"
      className={`fullscreen-player fixed inset-0 z-[60] overflow-y-auto overscroll-contain text-white transition-[transform,opacity,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-full opacity-0 pointer-events-none'}`}
      style={{ '--player-top': theme.top, '--player-middle': theme.middle, '--player-bottom': theme.bottom }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {track.artwork && <img src={track.artwork} alt="" className="absolute left-1/2 top-[22%] w-[115%] max-w-none -translate-x-1/2 scale-125 opacity-[0.08] blur-[100px]" />}
        <div className="absolute -left-1/4 top-[10%] h-[55%] w-[80%] rounded-full bg-sky-300/[0.07] blur-[100px]" />
      </div>
      <div className="now-playing-shell relative mx-auto flex min-h-full w-full max-w-[1140px] flex-col px-[22px] sm:px-8 lg:px-12">
        <header className="flex shrink-0 items-center justify-between gap-4">
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Thu nhỏ trình phát" title="Thu nhỏ (Esc)" className="player-icon-button -ml-2"><ChevronDown size={25} strokeWidth={1.7} /></button>
          <div className="flex min-w-0 items-center justify-center gap-2 text-[13px] font-medium tracking-wide text-white/75"><AudioLines size={14} aria-hidden="true" className="shrink-0 text-[#dbd9aa]" />{track.artistId ? <Link to={`/artist/${track.artistId}`} onClick={onClose} className="truncate hover:text-white hover:underline">{track.artist}</Link> : <span className="truncate">{track.artist}</span>}</div>
          <button type="button" onClick={onToggleLike} aria-label={liked ? 'Bỏ thích bài đang phát' : 'Thích bài đang phát'} aria-pressed={liked} className="player-icon-button -mr-2"><Heart size={25} strokeWidth={1.6} fill={liked ? 'currentColor' : 'none'} /></button>
        </header>

        <div className="now-playing-layout">
          <div className="now-playing-record-section min-w-0">
            <RecordDeck track={track} isOpen={isOpen} isPlaying={isPlaying} />
            <div className="now-playing-metadata text-center">
              <h1 id="now-playing-title" className="text-2xl font-semibold tracking-[-0.025em] drop-shadow-sm sm:text-[28px] lg:text-[34px]">{track.title}</h1>
              <p className="mt-1.5 text-[15px] font-normal tracking-wide text-white/70">{track.artist}</p>
            </div>
          </div>

          <div className="now-playing-details flex min-w-0 flex-col">
            <div className="mb-3 flex justify-center gap-1.5" role="tablist" aria-label="Nội dung bên cạnh trình phát">
              <button type="button" role="tab" aria-selected={panel === 'lyrics'} onClick={() => setPanel('lyrics')} className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${panel === 'lyrics' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}>Lời bài hát</button>
              <button type="button" role="tab" aria-selected={panel === 'comments'} onClick={() => setPanel('comments')} className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition ${panel === 'comments' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}><MessageCircle size={12} aria-hidden="true" /> Bình luận</button>
            </div>
            {panel === 'lyrics' ? (
              <div className="now-playing-lyrics text-center" aria-label="Lời bài hát" aria-live="polite">
                <p className="mb-7 hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40 lg:block">Trong khoảnh khắc này</p>
                {track.lyrics?.[activeLyric - 1] && <p className="mb-2.5 text-[14px] leading-6 text-white/30">{track.lyrics[activeLyric - 1].text}</p>}
                <p className="mx-auto max-w-[360px] bg-gradient-to-b from-white via-white to-white/55 bg-clip-text text-[19px] font-semibold leading-[1.35] tracking-[-0.02em] text-transparent lg:text-[25px]">{track.lyrics?.[activeLyric]?.text ?? 'Thả lỏng một chút, để âm nhạc dẫn lối.'}</p>
                <p className="mt-2.5 text-[14px] leading-6 tracking-[0.01em] text-white/40">{track.lyrics?.[activeLyric + 1]?.text ?? (track.lyrics ? 'Đang đồng hành cùng giai điệu của bạn.' : 'Bản xem trước này chưa có lời bài hát.')}</p>
              </div>
            ) : (
              <TrackComments track={track} onNavigateAway={onClose} />
            )}

            <div className="now-playing-controls rounded-[20px] border border-white/[0.12] bg-white/[0.12] px-[18px] pb-[14px] pt-[14px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_12px_40px_rgba(10,25,40,0.06)] backdrop-blur-2xl">
              <div className="mb-3 flex items-center justify-between">
                <button type="button" onClick={player.toggleShuffle} aria-label="Phát ngẫu nhiên" aria-pressed={shuffle} className={`player-icon-button relative ${shuffle ? 'bg-white/15' : ''}`}><Shuffle size={19} strokeWidth={1.8} />{shuffle && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-white" />}</button>
                <button type="button" onClick={player.previousTrack} aria-label="Bài trước" className="player-icon-button"><SkipBack size={21} fill="currentColor" strokeWidth={1.7} /></button>
                <button type="button" onClick={player.togglePlayback} aria-label={isPlaying ? 'Tạm dừng' : 'Phát'} className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-[15px] border border-white/80 bg-white text-[#111a20] shadow-[0_1px_4px_rgba(0,0,0,0.4)] transition hover:scale-105 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent active:scale-95">{isPlaying ? <Pause size={22} fill="currentColor" strokeWidth={0} /> : <Play size={23} fill="currentColor" strokeWidth={0} className="ml-0.5" />}</button>
                <button type="button" onClick={player.nextTrack} aria-label="Bài tiếp theo" className="player-icon-button"><SkipForward size={21} fill="currentColor" strokeWidth={1.7} /></button>
                <button type="button" onClick={player.cycleRepeat} aria-label={repeatLabels[repeatMode]} aria-pressed={repeatMode !== 'off'} className={`player-icon-button relative ${repeatMode !== 'off' ? 'bg-white/15' : ''}`}><RepeatIcon size={20} strokeWidth={1.8} />{repeatMode !== 'off' && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-white" />}</button>
              </div>
              <WaveformSeekBar track={track} elapsed={elapsed} onSeek={player.seek} />
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => onAddToPlaylist(track)} aria-label="Thêm vào playlist" title="Thêm vào playlist" className="player-icon-button h-9 w-9"><ListPlus size={18} /></button>
                  <button type="button" onClick={() => onAddToQueue(track)} aria-label="Thêm vào danh sách chờ" title="Thêm vào danh sách chờ" className="player-icon-button h-9 w-9"><ListEnd size={18} /></button>
                  <button type="button" onClick={onOpenQueue} aria-label="Xem danh sách chờ" title="Danh sách chờ" className="player-icon-button h-9 w-9"><ListMusic size={18} /></button>
                  <button type="button" onClick={() => onShare(track)} aria-label="Chia sẻ bài hát" title="Chia sẻ" className="player-icon-button h-9 w-9"><Share2 size={17} /></button>
                </div>
                <div className="flex min-w-0 items-center gap-2">
                  <button type="button" onClick={() => player.setMuted(!muted)} aria-label={muted ? 'Bật tiếng' : 'Tắt tiếng'} aria-pressed={muted} className="player-icon-button h-9 w-9">{muted || volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}</button>
                  <input aria-label="Âm lượng" type="range" min="0" max="100" value={muted ? 0 : volume} onChange={(event) => { player.setVolume(Number(event.target.value)); if (muted) player.setMuted(false) }} className="h-1 w-20 cursor-pointer accent-white" />
                </div>
              </div>
            </div>
            <p className="mt-4 hidden text-center text-[10px] tracking-wide text-white/30 lg:block">AuraTune · Bản phát mô phỏng</p>
          </div>
        </div>
      </div>
    </section>
  )
}
