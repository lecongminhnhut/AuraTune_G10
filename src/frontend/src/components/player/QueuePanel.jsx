import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, GripVertical, ListMusic, Play, X } from 'lucide-react'
import CoverArt from '../playlist/CoverArt.jsx'
import { usePlayer } from '../../context/PlayerContext.jsx'

// Hàng chờ (G05): xem bài tiếp theo, phát ngay, xóa, kéo thả hoặc dùng nút mũi tên để sắp xếp.
export default function QueuePanel({ isOpen, onClose }) {
  const player = usePlayer()
  const panelRef = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  const [dragIndex, setDragIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)

  useEffect(() => {
    if (!isOpen) return undefined
    const previousFocus = document.activeElement
    panelRef.current?.querySelector('button')?.focus({ preventScroll: true })
    const onKeyDown = (event) => { if (event.key === 'Escape') closeRef.current() }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [isOpen])

  if (!isOpen) return null
  const { track, upcoming } = player

  return (
    <div className="fixed inset-0 z-50">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />
      <section ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="queue-title" className="ai-host-panel absolute bottom-[96px] right-2 top-2 flex w-[calc(100%-1rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#14151c] shadow-2xl shadow-black/60">
        <header className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-4">
          <h2 id="queue-title" className="flex items-center gap-2 text-[15px] font-bold text-white"><ListMusic size={18} aria-hidden="true" className="text-violet-300" /> Danh sách chờ</h2>
          <button type="button" onClick={onClose} aria-label="Đóng danh sách chờ" className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"><X size={18} /></button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Đang phát</p>
          <div className="mt-2 flex items-center gap-3 rounded-xl bg-violet-300/[0.08] p-2.5">
            <CoverArt variant={track.cover} className="h-11 w-11 shrink-0 rounded-md [&_span]:text-2xl" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-violet-100">{track.title}</p>
              <p className="truncate text-[11px] text-zinc-400">{track.artist}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between px-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Tiếp theo · {upcoming.length}</p>
            {upcoming.length > 0 && <button type="button" onClick={player.clearUpcoming} className="text-[11px] font-semibold text-zinc-400 transition hover:text-white">Xóa tất cả</button>}
          </div>

          {upcoming.length === 0 ? (
            <p className="mt-3 rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-xs leading-5 text-zinc-500">Chưa có bài nào trong hàng chờ. Chọn “Thêm vào danh sách chờ” ở menu “…” của một bài hát.</p>
          ) : (
            <ol className="mt-2 space-y-1">
              {upcoming.map((item, index) => (
                <li
                  key={item.id}
                  draggable
                  onDragStart={(event) => { setDragIndex(index); event.dataTransfer.effectAllowed = 'move' }}
                  onDragOver={(event) => { event.preventDefault(); setOverIndex(index) }}
                  onDragEnd={() => { setDragIndex(null); setOverIndex(null) }}
                  onDrop={(event) => { event.preventDefault(); if (dragIndex !== null && dragIndex !== index) player.moveInQueue(dragIndex, index); setDragIndex(null); setOverIndex(null) }}
                  className={`group flex items-center gap-2 rounded-xl p-2 transition hover:bg-white/[0.05] ${dragIndex === index ? 'opacity-40' : ''} ${overIndex === index && dragIndex !== index ? 'ring-1 ring-violet-300/50' : ''}`}
                >
                  <span className="cursor-grab text-zinc-600 group-hover:text-zinc-300" title="Kéo để sắp xếp"><GripVertical size={15} aria-hidden="true" /></span>
                  <button type="button" onClick={() => player.playFromQueue(item.id)} aria-label={`Phát ngay ${item.title}`} className="relative shrink-0 overflow-hidden rounded-md">
                    <CoverArt variant={item.cover} className="h-10 w-10 [&_span]:text-xl" />
                    <span className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition group-hover:opacity-100"><Play size={14} fill="currentColor" /></span>
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-zinc-100">{item.title}</p>
                    <p className="truncate text-[11px] text-zinc-500">{item.artist}</p>
                  </div>
                  <div className="flex shrink-0 items-center">
                    <button type="button" disabled={index === 0} onClick={() => player.moveInQueue(index, index - 1)} aria-label={`Đưa ${item.title} lên`} className="rounded p-1 text-zinc-500 transition hover:text-white disabled:opacity-30"><ArrowUp size={14} /></button>
                    <button type="button" disabled={index === upcoming.length - 1} onClick={() => player.moveInQueue(index, index + 1)} aria-label={`Đưa ${item.title} xuống`} className="rounded p-1 text-zinc-500 transition hover:text-white disabled:opacity-30"><ArrowDown size={14} /></button>
                    <button type="button" onClick={() => player.removeFromQueue(item.id)} aria-label={`Xóa ${item.title} khỏi danh sách chờ`} className="rounded p-1 text-zinc-500 transition hover:text-rose-300"><X size={15} /></button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </div>
  )
}
