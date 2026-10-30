import { useState } from 'react'
import { Heart, History, LayoutDashboard, Mic2, Sparkles } from 'lucide-react'
import Icon from './Icon.jsx'
import Logo from './Logo.jsx'
import CoverArt from '../playlist/CoverArt.jsx'
import { ArtistAvatar } from '../playlist/MediaCards.jsx'
import { useStore } from '../../context/AppStore.jsx'
import { usePlayer } from '../../context/PlayerContext.jsx'
import { getArtist } from '../../utils/mockData.js'
import { normalizeText } from '../../utils/aiMockData.js'
import { Link, useLocation } from '../../utils/navigation.jsx'

export const primaryLinks = [
  { label: 'Trang chủ', icon: 'home', href: '/' },
  { label: 'Tìm kiếm', icon: 'search', href: '/search' },
  { label: 'Khám phá', icon: 'compass', href: '/explore' },
  { label: 'Bảng xếp hạng', icon: 'chart', href: '/charts' },
]

export default function Sidebar() {
  const store = useStore()
  const player = usePlayer()
  const { pathname } = useLocation()
  const [expanded, setExpanded] = useState(true)
  const [filter, setFilter] = useState('playlists')
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const user = store.currentUser
  const needle = normalizeText(query.trim())
  const matches = (text) => !needle || normalizeText(text).includes(needle)

  const createPlaylist = () => (user ? store.openCreatePlaylist() : player.requireLogin('Đăng nhập để tạo playlist.'))
  const items = !user ? [] : filter === 'playlists'
    ? [store.likedPlaylist, ...store.userPlaylists].filter((playlist) => playlist && matches(playlist.title)).map((playlist) => ({ id: playlist.id, href: `/playlist/${playlist.id}`, title: playlist.title, subtitle: playlist.id === 'liked' ? `${playlist.trackIds.length} bài hát` : `Playlist · ${playlist.isCollaborative ? 'Cộng tác' : playlist.owner}`, cover: playlist.cover, liked: playlist.id === 'liked' }))
    : filter === 'albums'
      ? store.library.savedAlbumIds.map(store.getAlbum).filter((album) => album && matches(album.title)).map((album) => ({ id: album.id, href: `/album/${album.id}`, title: album.title, subtitle: `Album · ${getArtist(album.artistId)?.name ?? ''}`, cover: album.cover }))
      : store.library.follows.map((item) => getArtist(item.artistId)).filter((artist) => artist?.isPublic && matches(artist.name)).map((artist) => ({ id: artist.id, href: `/artist/${artist.id}`, title: artist.name, subtitle: 'Nghệ sĩ', artist }))

  const accountLinks = [
    user && { label: 'Lịch sử & thống kê', icon: History, href: '/history' },
    user && { label: 'AI Playlist', icon: Sparkles, href: '/ai-playlist' },
    user?.role === 'artist' && { label: 'Artist Studio', icon: Mic2, href: '/studio' },
    user?.role === 'admin' && { label: 'Quản trị', icon: LayoutDashboard, href: '/admin' },
  ].filter(Boolean)

  return (
    <aside className="hidden w-[248px] shrink-0 flex-col gap-2 md:flex">
      <div className="rounded-lg bg-[#111113] px-5 py-5">
        <Link to="/" className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
          <Logo />
        </Link>
        <p className="mt-3 text-center text-[10px] tracking-[0.18em] text-sky-200/60">ÂM NHẠC HIỂU BẠN</p>
        <nav aria-label="Điều hướng chính" className="mt-5 space-y-1">
          {primaryLinks.map((item) => {
            const active = pathname === item.href
            return (
              <Link key={item.label} to={item.href} aria-current={active ? 'page' : undefined} className={`flex items-center gap-4 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${active ? 'text-white' : 'text-zinc-400 hover:text-white'}`}>
                <Icon name={item.icon} size={21} className={active ? 'text-violet-300' : ''} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-[#111113] px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} className="flex items-center gap-3 text-sm font-semibold text-zinc-300 transition hover:text-white">
            <Icon name="library" size={20} />
            <span>Thư viện của bạn</span>
          </button>
          <button onClick={createPlaylist} aria-label="Tạo playlist" title="Tạo playlist" className="rounded-full p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white">
            <Icon name="plus" size={18} />
          </button>
        </div>

        {expanded && (user ? (
          <>
            <div className="mt-5 flex gap-1.5 overflow-hidden">
              {[['playlists', 'Playlist'], ['artists', 'Nghệ sĩ'], ['albums', 'Album']].map(([id, label]) => (
                <button key={id} onClick={() => setFilter(id)} aria-pressed={filter === id} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${filter === id ? 'bg-white text-zinc-900' : 'bg-white/5 text-zinc-300 hover:bg-white/10'}`}>{label}</button>
              ))}
            </div>
            {searching ? (
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} onBlur={() => !query && setSearching(false)} onKeyDown={(event) => event.key === 'Escape' && (setQuery(''), setSearching(false))} placeholder="Tìm trong thư viện" aria-label="Tìm trong thư viện" className="mt-4 h-8 rounded-md bg-white/[0.06] px-2.5 text-xs text-white outline-none placeholder:text-zinc-500" />
            ) : (
              <button onClick={() => setSearching(true)} className="mt-4 flex items-center gap-2 rounded-md px-2 py-2 text-xs text-zinc-500 transition hover:text-zinc-200">
                <Icon name="search" size={15} /> Tìm trong thư viện
              </button>
            )}
            <div className="mt-1 min-h-0 flex-1 space-y-1 overflow-y-auto scrollbar-thin">
              {items.map((item) => (
                <Link key={item.id} to={item.href} aria-current={pathname === item.href ? 'page' : undefined} className={`group flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-white/[0.06] ${pathname === item.href ? 'bg-white/[0.06]' : ''}`}>
                  {item.liked ? <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-800"><Heart size={16} className="fill-current" /></span>
                    : item.artist ? <span className="h-10 w-10 shrink-0 overflow-hidden rounded-full"><ArtistAvatar artist={item.artist} /></span>
                      : <CoverArt variant={item.cover} className="h-10 w-10 shrink-0 rounded-md [&_span]:text-xl" />}
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-zinc-200 group-hover:text-white">{item.title}</p>
                    <p className="mt-0.5 truncate text-[11px] text-zinc-500">{item.subtitle}</p>
                  </div>
                </Link>
              ))}
              {!items.length && <p className="px-2 py-4 text-xs leading-5 text-zinc-500">{needle ? 'Không có mục nào phù hợp.' : filter === 'playlists' ? 'Tạo playlist đầu tiên bằng nút +.' : filter === 'albums' ? 'Album bạn lưu sẽ hiện ở đây.' : 'Nghệ sĩ bạn theo dõi sẽ hiện ở đây.'}</p>}
            </div>
          </>
        ) : (
          <div className="mt-5 rounded-xl bg-white/[0.04] p-4">
            <p className="text-[13px] font-semibold text-white">Tạo thư viện của riêng bạn</p>
            <p className="mt-1.5 text-[11px] leading-5 text-zinc-400">Đăng nhập để lưu bài hát, tạo playlist và theo dõi nghệ sĩ.</p>
            <Link to="/login" className="mt-3 inline-flex rounded-full bg-white px-4 py-1.5 text-[11px] font-bold text-zinc-900">Đăng nhập</Link>
          </div>
        ))}

        <div className="mt-4 space-y-1 border-t border-white/[0.07] pt-3 text-[11px] text-zinc-500">
          {accountLinks.map(({ label, icon: IconComponent, href }) => (
            <Link key={href} to={href} aria-current={pathname === href ? 'page' : undefined} className={`flex items-center gap-2 rounded-md px-1 py-1.5 transition hover:text-zinc-200 ${pathname === href ? 'text-white' : ''}`}><IconComponent size={14} /> {label}</Link>
          ))}
          {!accountLinks.length && <p className="flex items-center gap-2 px-1 py-1"><Icon name="headphones" size={15} /> AuraTune dành cho nghệ sĩ</p>}
          <p className="px-1 pt-1">© 2026 AuraTune</p>
        </div>
      </div>
    </aside>
  )
}
