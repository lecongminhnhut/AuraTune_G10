// Relative time for comments (046-FR-007): "Vừa xong", "5 phút trước", "3 giờ trước", "2 ngày trước",
// then the date after 30 days.
export function formatRelativeTime(iso, now = Date.now()) {
  const time = new Date(iso).getTime()
  if (!Number.isFinite(time)) return ''
  const minutes = Math.max(0, Math.floor((now - time) / 60000))
  if (minutes < 1) return 'Vừa xong'
  if (minutes < 60) return `${minutes} phút trước`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  if (days <= 30) return `${days} ngày trước`
  return new Date(time).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
