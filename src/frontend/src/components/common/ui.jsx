import { useEffect, useRef } from 'react'
import { AlertTriangle, CheckCircle2, Info, Lock, X } from 'lucide-react'
import { Link, loginPath } from '../../utils/navigation.jsx'
import { useStore } from '../../context/AppStore.jsx'

export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <section className="relative overflow-hidden px-5 pb-6 pt-6 sm:px-8 sm:pt-8">
      <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-violet-500/15 blur-[100px]" />
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-200/80">{eyebrow}</p>}
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{description}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}

export function SectionHeading({ title, subtitle, action, actionTo, onAction }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1.5 hidden text-xs text-zinc-500 sm:block">{subtitle}</p>}
      </div>
      {action && (actionTo
        ? <Link to={actionTo} className="shrink-0 text-xs font-semibold text-zinc-400 transition hover:text-white">{action}</Link>
        : <button type="button" onClick={onAction} className="shrink-0 text-xs font-semibold text-zinc-400 transition hover:text-white">{action}</button>)}
    </div>
  )
}

export function EmptyState({ icon: IconComponent = Info, title, description, children, compact = false }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-center ${compact ? 'px-4 py-6' : 'px-6 py-12'}`}>
      <IconComponent size={compact ? 22 : 28} aria-hidden="true" className="text-zinc-500" />
      <p className={`font-semibold text-zinc-200 ${compact ? 'mt-2 text-sm' : 'mt-3 text-base'}`}>{title}</p>
      {description && <p className="mt-1.5 max-w-md text-xs leading-5 text-zinc-500">{description}</p>}
      {children && <div className="mt-4 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  )
}

export function ErrorState({ title = 'Không tải được dữ liệu', description = 'Có lỗi tạm thời. Vui lòng thử lại.', onRetry, compact = false }) {
  return (
    <EmptyState icon={AlertTriangle} title={title} description={description} compact={compact}>
      {onRetry && <button type="button" onClick={onRetry} className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-white transition hover:border-white/50">Thử lại</button>}
    </EmptyState>
  )
}

export function LoginRequired({ title = 'Đăng nhập để tiếp tục', description = 'Tính năng này cần tài khoản AuraTune.' }) {
  return (
    <div className="px-5 py-10 sm:px-8">
      <EmptyState icon={Lock} title={title} description={description}>
        <Link to={loginPath()} className="rounded-full bg-violet-300 px-5 py-2 text-xs font-bold text-zinc-950 transition hover:bg-violet-200">Đăng nhập</Link>
        <Link to="/register" className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-white transition hover:border-white/50">Tạo tài khoản</Link>
      </EmptyState>
    </div>
  )
}

export function Forbidden({ description = 'Tài khoản của bạn không có quyền truy cập khu vực này.' }) {
  return (
    <div className="px-5 py-10 sm:px-8">
      <EmptyState icon={Lock} title="Không đủ quyền truy cập" description={description}>
        <Link to="/" className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-white transition hover:border-white/50">Về trang chủ</Link>
      </EmptyState>
    </div>
  )
}

export function NotFound({ title = 'Không tìm thấy nội dung', description = 'Liên kết có thể đã thay đổi hoặc nội dung không còn khả dụng.' }) {
  return (
    <div className="px-5 py-10 sm:px-8">
      <EmptyState title={title} description={description}>
        <Link to="/" className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-white transition hover:border-white/50">Về trang chủ</Link>
      </EmptyState>
    </div>
  )
}

export function Modal({ title, description, onClose, children, labelledBy = 'modal-title' }) {
  const panelRef = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    const previousFocus = document.activeElement
    const first = panelRef.current?.querySelector('input, textarea, select, button:not([data-close])')
    first?.focus({ preventScroll: true })
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeRef.current()
      if (event.key !== 'Tab') return
      const focusable = panelRef.current?.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea, select, a[href]')
      if (!focusable?.length) return
      const firstItem = focusable[0]
      const lastItem = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === firstItem) { event.preventDefault(); lastItem.focus() }
      else if (!event.shiftKey && document.activeElement === lastItem) { event.preventDefault(); firstItem.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-4">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" />
      <section ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={labelledBy} className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-[#17171b] p-5 shadow-2xl shadow-black/60 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id={labelledBy} className="text-lg font-bold text-white">{title}</h2>
            {description && <p className="mt-1 text-xs leading-5 text-zinc-400">{description}</p>}
          </div>
          <button type="button" data-close onClick={onClose} aria-label="Đóng" className="-mr-2 -mt-1 rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"><X size={18} /></button>
        </div>
        <div className="mt-5">{children}</div>
      </section>
    </div>
  )
}

export function Toaster() {
  const { toasts } = useStore()
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[152px] z-[80] flex flex-col items-center gap-2 px-4 md:bottom-[100px]">
      {toasts.map((item) => (
        <div key={item.id} role="status" className="pointer-events-auto flex max-w-md items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/95 px-4 py-2.5 text-xs font-medium text-zinc-100 shadow-xl shadow-black/40 backdrop-blur-xl">
          {item.tone === 'error' ? <AlertTriangle size={15} className="shrink-0 text-rose-300" aria-hidden="true" /> : <CheckCircle2 size={15} className="shrink-0 text-emerald-300" aria-hidden="true" />}
          {item.message}
        </div>
      ))}
    </div>
  )
}

export const inputClass = 'mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/20 px-3.5 text-sm font-normal text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-300/70 focus:ring-2 focus:ring-violet-300/10'
export const primaryButton = 'inline-flex h-10 items-center justify-center gap-2 rounded-full bg-violet-300 px-5 text-xs font-bold text-zinc-950 transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-50'
export const secondaryButton = 'inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/20 px-5 text-xs font-semibold text-white transition hover:border-white/50 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50'
export const chipClass = (active) => `shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${active ? 'bg-white text-zinc-900' : 'bg-white/[0.06] text-zinc-300 hover:bg-white/10'}`
