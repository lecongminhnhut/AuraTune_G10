import { Sparkles } from 'lucide-react'
import Icon from './Icon.jsx'
import { useStore } from '../../context/AppStore.jsx'
import { Link, useLocation } from '../../utils/navigation.jsx'

const items = [
  { label: 'Trang chủ', icon: 'home', href: '/' },
  { label: 'Tìm kiếm', icon: 'search', href: '/search' },
  { label: 'Thư viện', icon: 'library', href: '/library' },
]

const itemClass = (active) => `flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-300 ${active ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'}`

// Thanh điều hướng dưới đáy cho mobile và tablet, thay cho Sidebar bị ẩn dưới breakpoint lg.
export default function MobileNav({ onOpenChat, chatOpen }) {
  const { pathname } = useLocation()
  const { aiAvailable } = useStore()
  return (
    <nav aria-label="Điều hướng chính" className="fixed inset-x-0 bottom-0 z-30 grid h-14 grid-cols-4 border-t border-white/[0.06] bg-[#0c0c0f]/95 backdrop-blur-xl lg:hidden">
      {items.map((item) => {
        const active = !chatOpen && (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href))
        return (
          <Link key={item.href} to={item.href} aria-current={active ? 'page' : undefined} className={itemClass(active)}>
            <Icon name={item.icon} size={20} className={active ? 'text-violet-300' : ''} />
            {item.label}
          </Link>
        )
      })}
      <button type="button" onClick={onOpenChat} aria-label="Mở AuraTune AI Host" aria-expanded={chatOpen} aria-controls="ai-host-panel" className={itemClass(chatOpen)}>
        <span className="relative">
          <Sparkles size={20} aria-hidden="true" className={chatOpen ? 'text-sky-300' : 'text-sky-300/80'} />
          <span className={`absolute -right-1 -top-0.5 h-1.5 w-1.5 rounded-full ${aiAvailable ? 'bg-emerald-400' : 'bg-amber-400'}`} />
        </span>
        AI Host
      </button>
    </nav>
  )
}
