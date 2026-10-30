import { useLayoutEffect, useRef } from 'react'
import CoverArt from '../playlist/CoverArt.jsx'

const parkedAngle = -14
const playingAngle = 16

export default function RecordDeck({ track, isOpen, isPlaying }) {
  const armRef = useRef(null)
  const previousRef = useRef({ isOpen: false, trackId: null })

  useLayoutEffect(() => {
    const arm = armRef.current
    const previous = previousRef.current
    previousRef.current = { isOpen, trackId: track.id }
    if (!arm || !isOpen) return undefined

    const opening = !previous.isOpen
    const changingTrack = previous.trackId !== track.id
    const matrix = new DOMMatrixReadOnly(getComputedStyle(arm).transform)
    const startAngle = opening ? parkedAngle : Math.atan2(matrix.b, matrix.a) * 180 / Math.PI
    const startY = opening ? 0 : matrix.f
    const targetAngle = isPlaying ? playingAngle : parkedAngle
    const finalTransform = `translateY(0px) rotate(${targetAngle}deg)`
    const position = (angle, height) => `translateY(${height}px) rotate(${angle}deg)`

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const liftHeight = reducedMotion ? -4 : -9

    arm.style.transform = position(startAngle, startY)
    if (!isPlaying && opening) return undefined

    const frames = [
      { transform: position(startAngle, startY), offset: 0 },
      { transform: position(startAngle, liftHeight), offset: 0.2 },
      ...(isPlaying && changingTrack && !opening ? [{ transform: position(parkedAngle, liftHeight), offset: 0.4 }] : []),
      { transform: position(targetAngle, liftHeight), offset: 0.78 },
      { transform: position(targetAngle, -1), offset: 0.94 },
      { transform: finalTransform, offset: 1 },
    ]
    const animation = arm.animate(frames, {
      duration: reducedMotion ? 650 : isPlaying ? 1200 : 900,
      delay: opening ? 180 : 0,
      easing: 'cubic-bezier(0.22, 0.65, 0.3, 1)',
      fill: 'both',
    })
    animation.id = isPlaying ? 'tonearm-cue' : 'tonearm-park'
    animation.onfinish = () => {
      arm.style.transform = finalTransform
      animation.cancel()
    }

    return () => {
      const currentTransform = getComputedStyle(arm).transform
      animation.cancel()
      arm.style.transform = currentTransform
    }
  }, [isOpen, isPlaying, track.id])

  return (
    <div className="record-stage relative mx-auto aspect-[1.28]" role="img" aria-label={`Bìa album ${track.album} trên đĩa vinyl`}>
      <div aria-hidden="true" className="vinyl-record absolute right-[1%] top-[3%] aspect-square w-[76%] rounded-full shadow-[8px_14px_22px_rgba(0,0,0,0.45)]">
        <div className="vinyl-disc absolute inset-0 rounded-full" data-spinning={isOpen && isPlaying}>
          <span className="vinyl-groove-highlight" />
          <span className="vinyl-rim-mark" />
          <div className="absolute inset-[35%] grid place-items-center overflow-hidden rounded-full border border-white/10 bg-[#b2aca0]">
            {track.artwork ? <img src={track.artwork} alt="" className="h-full w-full object-cover opacity-70" /> : <span className="text-[8px] font-bold tracking-widest text-black/60">AURA</span>}
            <span className="absolute h-2 w-2 rounded-full bg-[#18191a] ring-2 ring-black/10" />
          </div>
        </div>
      </div>
      <div key={track.id} className="record-sleeve absolute left-0 top-0 aspect-square w-[78%] overflow-hidden rounded-[7px] bg-slate-900 shadow-[3px_14px_26px_rgba(0,0,0,0.25)]">
        {track.artwork ? <img src={track.artwork} alt="" className="h-full w-full object-cover" /> : <CoverArt variant={track.cover} title={track.title} showLabel className="h-full w-full [&_.cover-motif]:text-8xl" />}
      </div>
      <div ref={armRef} aria-hidden="true" className="record-tonearm absolute right-[3%] top-[-2%] h-[70%] w-[13%]">
        <div className="tonearm-counterweight" /><div className="tonearm-pivot" /><div className="tonearm-shaft" /><div className="tonearm-head" />
      </div>
    </div>
  )
}
