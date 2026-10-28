import { useEffect, useRef, useState } from 'react'
import { BarChart3, Heart, LayoutDashboard, Library, LogOut, Mic2, Sparkles, Users } from 'lucide-react'
import Icon from './Icon.jsx'
import Logo from './Logo.jsx'
import SemanticSearch from '../search/SemanticSearch.jsx'
import { useStore } from '../../context/AppStore.jsx'
import { Link, navigate } from '../../utils/navigation.jsx'

const roleLabel = { user: 'Người nghe', artist: 'Nghệ sĩ', admin: 'Quản trị viên' }

export default function TopBar({ onOpenChat, chatOpen, onPlayTrack, onPlayPlaylist }) {
  const store = useStore()

  return (
    <header className="sticky top-0 z-20 flex shrink-0 flex-wrap items-center gap-3 border-b border-white/[0.04] bg-[#111113]/95 px-4 py-3.5 backdrop-blur-xl sm:h-[80px] sm:flex-nowrap sm:gap-4 sm:px-6">
      <Link to="/" aria-label="AuraTune — Trang chủ" className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 md:hidden"><Logo compact /></Link>
      <div className="hidden items-center gap-2 lg:flex">
        <button aria-label="Quay lại" onClick={() => window.history.back()} className="grid h-8 w-8 place-items-center rounded-full bg-black/40 text-zinc-300 transition hover:bg-black/70 hover:text-white"><Icon name="arrowLeft" size={18} /></button>
        <button aria-label="Tiến tới" onClick={() => window.history.forward()} className="grid h-8 w-8 place-items-center rounded-full bg-black/40 text-zinc-300 transition hover:bg-black/70 hover:text-white"><Icon name="arrowRight" size={18} /></button>
      </div>

      <div className="order-last w-full min-w-0 sm:order-none sm:w-auto sm:flex-1">
        <SemanticSearch onPlayTrack={onPlayTrack} onPlayPlaylist={onPlayPlaylist} />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0">
        <button type="button" onClick={onOpenChat} aria-label="Mở AuraTune AI Host" aria-expanded={chatOpen} aria-controls="ai-host-panel" className="flex h-9 items-center gap-2 rounded-full border border-sky-300/20 bg-gradient-to-r from-sky-300/10 to-violet-300/10 px-3 text-xs font-semibold text-sky-100 transition hover:border-sky-300/50 hover:bg-sky-300/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
          <Sparkles size={16} aria-hidden="true" /> <span>AI Host</span><span className={`h-1.5 w-1.5 rounded-full ${store.aiAvailable ? 'bg-emerald-400' : 'bg-amber-400'}`} />
        </button>
        {store.currentUser ? <UserMenu /> : (
          <>
            <Link to="/register" className="hidden h-9 items-center rounded-full px-3 text-xs font-semibold text-zinc-300 transition hover:text-white xl:flex">Đăng ký</Link>
            <button onClick={() => navigate('/login')} aria-label="Đăng nhập" className="flex h-9 items-center justify-center gap-2 rounded-full border border-white/15 px-2.5 text-xs font-semibold text-zinc-200 transition hover:border-white/40 hover:bg-white/[0.06] xl:px-3.5">
              <Icon name="user" size={17} /><span className="hidden xl:inline">Đăng nhập</span>
            </button>
          </>
        )}
      </div>
    </header>
  )
}

function UserMenu() {
  const store = useStore()
  const user = store.currentUser
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const close = (event) => { if (!ref.current?.contains(event.target)) setOpen(false) }
    const onKey = (event) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', onKey) }
  }, [open])

  const links = [
    { label: 'Thư viện', icon: Library, href: '/library' },
    { label: 'Bài hát đã thích', icon: Heart, href: '/playlist/liked' },
    { label: 'Nghệ sĩ đang theo dõi', icon: Users, href: '/following' },
    { label: 'Lịch sử & thống kê', icon: BarChart3, href: '/history' },
    user.role === 'artist' && { label: 'Artist Studio', icon: Mic2, href: '/studio' },
    user.role === 'admin' && { label: 'Quản trị', icon: LayoutDashboard, href: '/admin' },
  ].filter(Boolean)

  const logout = () => {
    setOpen(false)
    store.logout()
    store.toast('Bạn đã đăng xuất.')
    navigate('/')
  }

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-haspopup="menu" aria-expanded={open} aria-label={`Tài khoản: ${user.displayName}`} className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-300 to-sky-300 text-sm font-bold text-zinc-950 ring-2 ring-transparent transition hover:ring-white/30">
        {user.displayName.slice(0, 1).toUpperCase()}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-40 mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-[#1c1c22] p-1.5 shadow-2xl shadow-black/60">
          <div className="border-b border-white/[0.06] px-3 pb-3 pt-2">
            <p className="truncate text-sm font-semibold text-white">{user.displayName}</p>
            <p className="truncate text-[11px] text-zinc-500">{user.email}</p>
            <span className="mt-2 inline-flex rounded-full bg-violet-300/10 px-2 py-0.5 text-[10px] font-semibold text-violet-200">{roleLabel[user.role]}</span>
          </div>
          <div className="py-1">
            {links.map(({ label, icon: IconComponent, href }) => (
              <Link key={href} to={href} role="menuitem" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-zinc-200 transition hover:bg-white/[0.08]"><IconComponent size={15} className="text-zinc-400" /> {label}</Link>
            ))}
          </div>
          <button type="button" role="menuitem" onClick={logout} className="flex w-full items-center gap-3 rounded-lg border-t border-white/[0.06] px-3 py-2.5 text-left text-[13px] text-rose-200 transition hover:bg-white/[0.08]"><LogOut size={15} /> Đăng xuất</button>
        </div>
      )}
    </div>
  )
}
