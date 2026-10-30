import Icon from './Icon.jsx'
import { Link, useLocation } from '../../utils/navigation.jsx'

const items = [
  { label: 'Trang chủ', icon: 'home', href: '/' },
  { label: 'Tìm kiếm', icon: 'search', href: '/search' },
  { label: 'Khám phá', icon: 'compass', href: '/explore' },
  { label: 'BXH', icon: 'chart', href: '/charts' },
  { label: 'Thư viện', icon: 'library', href: '/library' },
]

// Thanh điều hướng cho màn hình nhỏ, thay cho Sidebar bị ẩn dưới breakpoint md.
export default function MobileNav() {
  const { pathname } = useLocation()
  return (
    <nav aria-label="Điều hướng chính" className="fixed inset-x-0 bottom-[88px] z-30 grid h-14 grid-cols-5 border-t border-white/[0.06] bg-[#0c0c0f]/95 backdrop-blur-xl md:hidden">
      {items.map((item) => {
        const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
        return (
          <Link key={item.href} to={item.href} aria-current={active ? 'page' : undefined} className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition ${active ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'}`}>
            <Icon name={item.icon} size={20} className={active ? 'text-violet-300' : ''} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
