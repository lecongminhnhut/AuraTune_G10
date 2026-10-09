import { useState } from 'react'
import Icon from '../common/Icon.jsx'
import CoverArt from '../playlist/CoverArt.jsx'

const waveform = [15, 24, 12, 30, 20, 36, 16, 26, 14, 34, 22, 40, 20, 30, 12, 24, 18, 36, 14, 28, 20, 32, 13, 25, 17, 37, 22, 29, 15, 34, 19, 25, 13, 31, 17, 27, 12, 34, 18, 22, 14, 30, 19, 26, 12, 35, 16, 24]

export default function BottomPlayer({ track, isPlaying, onTogglePlay, onDownloadTrack }) {
  const [liked, setLiked] = useState(false)
  const [progress, setProgress] = useState(33)
  const [volume, setVolume] = useState(68)

  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 h-[88px] border-t border-white/[0.08] bg-[#09090b]/95 px-3 backdrop-blur-2xl sm:px-5">
      <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(150px,1.2fr)_minmax(0,1fr)] items-center gap-3 md:gap-6">
        <div className="flex min-w-0 items-center gap-3">
          <CoverArt variant={track.cover} className="h-12 w-12 shrink-0 rounded-md shadow-lg" />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white sm:text-sm">{track.title}</p>
          <p className="mt-1 truncate text-[11px] text-zinc-400">{track.artist}</p>
          </div>
          <button onClick={() => setLiked((value) => !value)} aria-label={liked ? 'Unlike song' : 'Like song'} className={`ml-1 hidden transition sm:inline-flex ${liked ? 'text-violet-300' : 'text-zinc-500 hover:text-white'}`}><Icon name="heart" size={17} /></button>
          <button onClick={() => onDownloadTrack(track)} aria-label={`Download ${track.title}`} title="Download" className="hidden text-zinc-500 transition hover:text-violet-200 sm:inline-flex"><Icon name="download" size={16} /></button>
        </div>

        <div className="flex min-w-0 flex-col items-center justify-center gap-1.5">
          <div className="flex items-center gap-3 sm:gap-5">
            <button aria-label="Shuffle" className="hidden text-zinc-500 transition hover:text-violet-300 sm:inline-flex"><Icon name="shuffle" size={17} /></button>
            <button aria-label="Previous track" className="text-zinc-400 transition hover:text-white"><Icon name="previous" size={19} /></button>
            <button onClick={onTogglePlay} aria-label={isPlaying ? 'Pause' : 'Play'} className="grid h-9 w-9 place-items-center rounded-full bg-white text-zinc-950 transition hover:scale-105 hover:bg-violet-200">
              <Icon name={isPlaying ? 'pause' : 'play'} size={18} />
            </button>
            <button aria-label="Next track" className="text-zinc-400 transition hover:text-white"><Icon name="next" size={19} /></button>
            <button aria-label="Repeat" className="hidden text-zinc-500 transition hover:text-violet-300 sm:inline-flex"><Icon name="repeat" size={17} /></button>
          </div>
          <div className="flex w-full items-center gap-2.5">
            <span className="hidden text-[10px] tabular-nums text-zinc-500 sm:inline">1:24</span>
            <div
              role="slider"
              aria-label="Playback progress"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={Math.round(progress)}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') setProgress((value) => Math.min(100, value + 3))
                if (event.key === 'ArrowLeft') setProgress((value) => Math.max(0, value - 3))
              }}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect()
                setProgress(Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)))
              }}
              className="group flex h-5 flex-1 cursor-pointer items-center gap-[2px] rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-300"
            >
              {waveform.map((height, index) => (
                <span
                  key={`${height}-${index}`}
                  className={`min-w-0 flex-1 rounded-full transition-colors ${((index + 1) / waveform.length) * 100 <= progress ? 'bg-gradient-to-t from-violet-400 to-orange-300' : 'bg-white/20 group-hover:bg-white/35'}`}
                  style={{ height: `${Math.max(4, Math.round(height / 3))}px` }}
                />
              ))}
            </div>
            <span className="hidden text-[10px] tabular-nums text-zinc-500 sm:inline">4:21</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 text-zinc-400 sm:gap-3">
          <button aria-label="Lyrics" className="hidden transition hover:text-violet-300 lg:inline-flex"><Icon name="lyrics" size={17} /></button>
          <button aria-label="Queue" className="hidden transition hover:text-violet-300 sm:inline-flex"><Icon name="queue" size={18} /></button>
          <button aria-label="Playback device" className="hidden transition hover:text-violet-300 xl:inline-flex"><Icon name="monitor" size={17} /></button>
          <Icon name="volume" size={17} className="hidden sm:block" />
          <input aria-label="Volume" type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} className="hidden h-1 w-20 cursor-pointer accent-violet-300 sm:block lg:w-24" />
        </div>
      </div>
    </footer>
  )
}
