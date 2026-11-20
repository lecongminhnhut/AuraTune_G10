import { RotateCcw, SkipForward, TriangleAlert } from 'lucide-react'

// 041-FR-009: báo lỗi luồng phát và cho người nghe thử lại hoặc chuyển bài.
export default function PlaybackAlert({ message, onRetry, onSkip, compact = false }) {
  const button = `inline-flex shrink-0 items-center gap-1 rounded-md font-semibold text-amber-100 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 ${compact ? 'px-1.5 py-0.5' : 'px-2 py-1'}`
  return (
    <div role="alert" className={`flex w-full items-center gap-2 rounded-lg border border-amber-300/25 bg-amber-400/10 text-amber-50 ${compact ? 'px-2 py-1 text-[11px]' : 'px-3 py-2 text-xs'}`}>
      <TriangleAlert size={compact ? 13 : 15} aria-hidden="true" className="shrink-0 text-amber-300" />
      <span className="min-w-0 flex-1 truncate">{message}</span>
      <button type="button" onClick={onRetry} className={button}><RotateCcw size={12} aria-hidden="true" /> Thử lại</button>
      <button type="button" onClick={onSkip} className={button}><SkipForward size={12} aria-hidden="true" /> Bỏ qua</button>
    </div>
  )
}
