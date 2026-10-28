import { getDurationSeconds, formatTime } from '../../utils/playback.js'

const waveform = [6, 9, 12, 17, 13, 21, 19, 24, 22, 17, 21, 24, 20, 26, 19, 23, 25, 17, 21, 25, 16, 19, 22, 26, 15, 19, 12, 15, 25, 22, 18, 13, 10, 13, 18, 22, 26, 21, 24, 19, 23, 15, 18, 24, 22, 17, 19, 25, 23, 20, 16, 22, 17, 20, 15, 18, 12, 16, 11, 14, 10, 7, 9, 6]

export default function WaveformSeekBar({ track, elapsed, onSeek, compact = false }) {
  const duration = getDurationSeconds(track.duration)
  const progress = elapsed / duration

  return (
    <div className={`w-full ${compact ? 'flex items-center gap-2.5' : ''}`}>
      {compact && <span className="w-7 shrink-0 text-[10px] tabular-nums text-zinc-500">{formatTime(elapsed)}</span>}
      <div className={`relative flex min-w-0 items-center gap-[2px] rounded-md focus-within:ring-2 focus-within:ring-white/70 focus-within:ring-offset-4 focus-within:ring-offset-transparent ${compact ? 'h-5 flex-1' : 'h-9 w-full'}`}>
        {waveform.map((height, index) => (
          <span key={index} aria-hidden="true" className={`min-w-0 flex-1 rounded-full transition-colors duration-200 ${index / waveform.length <= progress ? 'bg-white/95' : compact ? 'bg-white/20' : 'bg-white/35'}`} style={{ height: `${compact ? Math.max(3, height / 2) : height}px` }} />
        ))}
        <input type="range" aria-label={compact ? 'Tiến trình bài hát' : 'Tua bài hát'} aria-valuetext={`${formatTime(elapsed)} trên ${track.duration}`} min={0} max={duration} step={1} value={elapsed} onChange={(event) => onSeek(Number(event.target.value))} className="absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0" />
      </div>
      {compact ? <span className="w-7 shrink-0 text-[10px] tabular-nums text-zinc-500">{track.duration}</span> : (
        <div className="mt-1.5 flex items-center justify-between text-xs tabular-nums text-white/80"><span>{formatTime(elapsed, true)}</span><span>{formatTime(duration, true)}</span></div>
      )}
    </div>
  )
}
