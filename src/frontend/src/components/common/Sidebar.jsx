import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import Logo from './Logo.jsx'
import { playlists } from '../../utils/mockData.js'

const primaryLinks = [
  { label: 'Home', icon: 'home', href: '/' },
  { label: 'Discover', icon: 'compass', href: '/explore' },
  { label: 'Charts', icon: 'chart', href: '/charts' },
]

export default function Sidebar() {
  const [active, setActive] = useState(() => primaryLinks.find((item) => item.href === window.location.pathname)?.label ?? '')
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    const updateActive = () => setActive(primaryLinks.find((item) => item.href === window.location.pathname)?.label ?? '')
    window.addEventListener('popstate', updateActive)
    return () => window.removeEventListener('popstate', updateActive)
  }, [])

  const navigate = (event, href, label) => {
    event.preventDefault()
    window.history.pushState({}, '', href)
    window.dispatchEvent(new PopStateEvent('popstate'))
    if (label) setActive(label)
  }

  return (
    <aside className="hidden w-[248px] shrink-0 flex-col gap-2 md:flex">
      <div className="rounded-lg bg-[#111113] px-5 py-5">
        <a href="/" onClick={(event) => navigate(event, '/', 'Home')} className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
          <Logo />
        </a>
        <nav aria-label="Main navigation" className="mt-8 space-y-1">
          {primaryLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(event) => navigate(event, item.href, item.label)}
              className={`flex items-center gap-4 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${active === item.label ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              <Icon name={item.icon} size={21} className={active === item.label ? 'text-violet-300' : ''} />
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-[#111113] px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setExpanded((value) => !value)} className="flex items-center gap-3 text-sm font-semibold text-zinc-300 transition hover:text-white">
            <Icon name="library" size={20} />
            <span>Your library</span>
          </button>
          <button aria-label="Create playlist" className="rounded-full p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white">
            <Icon name="plus" size={18} />
          </button>
        </div>
        <div className="mt-5 flex gap-2 overflow-hidden">
          <button className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-900">Playlist</button>
          <button className="rounded-full bg-white/5 px-3 py-1.5 text-[11px] font-medium text-zinc-300 transition hover:bg-white/10">Artists</button>
        </div>

        {expanded && (
          <>
            <button className="mt-4 flex items-center gap-2 rounded-md px-2 py-2 text-xs text-zinc-500 transition hover:text-zinc-200">
              <Icon name="search" size={15} /> Search your library
            </button>
            <div className="mt-1 flex-1 space-y-1 overflow-y-auto scrollbar-thin">
              {playlists.slice(0, 5).map((playlist) => (
                <a
                  key={playlist.id}
                  href={`/playlist/${playlist.id}`}
                  onClick={(event) => navigate(event, `/playlist/${playlist.id}`)}
                  className="group flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-white/[0.06]"
                >
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-md bg-gradient-to-br ${coverTone(playlist.cover)} text-sm font-bold text-white/80`}>
                    {playlist.title.slice(0, 1)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-zinc-200 group-hover:text-white">{playlist.title}</p>
                    <p className="mt-0.5 truncate text-[11px] text-zinc-500">Playlist · {playlist.owner}</p>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}

        <div className="mt-4 space-y-2 border-t border-white/[0.07] pt-4 text-[11px] text-zinc-500">
          <button className="flex items-center gap-2 transition hover:text-zinc-300"><Icon name="headphones" size={15} /> AuraTune for Artists</button>
          <p>© 2026 AuraTune</p>
        </div>
      </div>
    </aside>
  )
}

function coverTone(cover) {
  const tones = {
    aurora: 'from-violet-500 to-orange-400',
    night: 'from-indigo-500 to-slate-950',
    ocean: 'from-cyan-400 to-blue-950',
    rose: 'from-rose-400 to-purple-950',
    sunset: 'from-orange-300 to-pink-700',
    forest: 'from-emerald-400 to-emerald-950',
  }
  return tones[cover] ?? 'from-violet-500 to-fuchsia-900'
}
