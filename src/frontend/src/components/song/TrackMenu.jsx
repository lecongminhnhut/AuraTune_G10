import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Disc3, ListEnd, ListPlus, ListStart, MoreHorizontal, Share2, Trash2, UserRound } from 'lucide-react'
import { useStore } from '../../context/AppStore.jsx'
import { usePlayer } from '../../context/PlayerContext.jsx'
import { navigate } from '../../utils/navigation.jsx'
import { trackSharePath } from '../../utils/share.js'

// Menu "…" cho một bài hát: phát tiếp theo, thêm vào hàng chờ / playlist, đi tới album / nghệ sĩ, chia sẻ.
export default function TrackMenu({ track, onRemove, removeLabel = 'Xóa khỏi playlist', extraItems = [], className = '', size = 17 }) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(null)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const store = useStore()
  const player = usePlayer()

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const menuHeight = menuRef.current?.offsetHeight ?? 280
    const openUp = rect.bottom + menuHeight + 8 > window.innerHeight - 96
    setPosition({ top: openUp ? Math.max(8, rect.top - menuHeight - 6) : rect.bottom + 6, right: Math.max(8, window.innerWidth - rect.right) })
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const close = (event) => {
      if (menuRef.current?.contains(event.target) || buttonRef.current?.contains(event.target)) return
      setOpen(false)
    }
    const onKey = (event) => { if (event.key === 'Escape') { setOpen(false); buttonRef.current?.focus() } }
    const onScroll = () => setOpen(false)
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onScroll)
    document.getElementById('page-content')?.addEventListener('scroll', onScroll, { passive: true })
    menuRef.current?.querySelector('button')?.focus({ preventScroll: true })
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onScroll)
      document.getElementById('page-content')?.removeEventListener('scroll', onScroll)
    }
  }, [open])

  const run = (action) => () => { setOpen(false); action() }
  const items = [
    { label: 'Phát tiếp theo', icon: ListStart, action: () => player.playNext(track) },
    { label: 'Thêm vào danh sách chờ', icon: ListEnd, action: () => player.addToQueue(track) },
    { label: 'Thêm vào playlist', icon: ListPlus, action: () => player.requestAddToPlaylist(track) },
    track.albumId && { label: 'Đi tới album', icon: Disc3, action: () => navigate(`/album/${track.albumId}`) },
    track.artistId && { label: 'Đi tới nghệ sĩ', icon: UserRound, action: () => navigate(`/artist/${track.artistId}`) },
    { label: 'Chia sẻ', icon: Share2, action: () => player.share(trackSharePath(track), `${track.title} · ${track.artist}`) },
    ...extraItems,
    onRemove && { label: removeLabel, icon: Trash2, action: onRemove, danger: true },
  ].filter(Boolean)

  return (
    <>
      <button ref={buttonRef} type="button" onClick={() => setOpen((value) => !value)} aria-haspopup="menu" aria-expanded={open} aria-label={`Tùy chọn cho ${track.title}`} className={`rounded-md p-1 text-zinc-400 transition hover:bg-white/10 hover:text-white ${className}`}>
        <MoreHorizontal size={size} />
      </button>
      {open && createPortal(
        <div ref={menuRef} role="menu" aria-label={`Tùy chọn cho ${track.title}`} style={position ? { top: position.top, right: position.right } : { visibility: 'hidden', top: 0, right: 0 }} className="fixed z-[75] w-56 overflow-hidden rounded-xl border border-white/10 bg-[#1c1c22] p-1.5 shadow-2xl shadow-black/60">
          {items.map(({ label, icon: IconComponent, action, danger }) => (
            <button key={label} type="button" role="menuitem" onClick={run(action)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition hover:bg-white/[0.08] focus-visible:bg-white/[0.08] focus-visible:outline-none ${danger ? 'text-rose-300' : 'text-zinc-200'}`}>
              <IconComponent size={16} aria-hidden="true" className={danger ? 'text-rose-300' : 'text-zinc-400'} /> {label}
            </button>
          ))}
          {!store.isPlayable(track.id) && <p className="px-3 py-2 text-[11px] text-zinc-500">Bài hát này hiện không khả dụng.</p>}
        </div>,
        document.body,
      )}
    </>
  )
}
