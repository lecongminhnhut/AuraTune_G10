import { useEffect, useMemo, useState } from 'react'
import { BarChart3, Clock3, History, Trash2 } from 'lucide-react'
import CoverArt from '../../components/playlist/CoverArt.jsx'
import { EmptyState, LoginRequired, Modal, PageHeader, chipClass, secondaryButton } from '../../components/common/ui.jsx'
import { formatTotalDuration, useStore } from '../../context/AppStore.jsx'
import { usePlayer } from '../../context/PlayerContext.jsx'
import { Link } from '../../utils/navigation.jsx'
import { getListeningAnalysis } from '../../services/statsService.js'

const ranges = [
  { id: '7', label: '7 ngày', days: 7 },
  { id: '30', label: '30 ngày', days: 30 },
  { id: 'all', label: 'Toàn bộ', days: null },
]

const dayLabel = (iso) => {
  const date = new Date(iso)
  const today = new Date()
  const diff = Math.floor((new Date(today.toDateString()) - new Date(date.toDateString())) / 86400000)
  if (diff === 0) return 'Hôm nay'
  if (diff === 1) return 'Hôm qua'
  return date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })
}

/**
 * Feature 101: Listening History Analysis (Group 100 - AI Recommendations)
 * Feature 070: Listening History (Group 070)
 * Note: Feature 101 strictly owns Total Playback Duration and Ranked Top Genres.
 * Top Artists and Top Tracks are exclusively owned by Group 070 (FR-004, FR-011).
 */
export default function HistoryPage() {
  const store = useStore()
  const player = usePlayer()
  const [tab, setTab] = useState('history')
  const [range, setRange] = useState('all')
  const [confirmClear, setConfirmClear] = useState(false)
  const [statsData, setStatsData] = useState(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [statsError, setStatsError] = useState(null)

  // Guard unauthenticated visitors (FR-005, T026)
  if (!store?.currentUser) {
    return <LoginRequired description="Đăng nhập để xem lịch sử nghe và thống kê của bạn." />
  }

  const history = store.library?.history || []

  // Eligible history entries for the 'Lịch sử' tab
  const eligibleHistory = useMemo(() => {
    const days = ranges.find((item) => item.id === range)?.days
    const since = days ? Date.now() - days * 86400000 : 0
    return history
      .map((entry) => ({ entry, track: store.findTrack?.(entry.trackId) }))
      .filter(({ entry, track }) => track && new Date(entry.playedAt).getTime() >= since)
  }, [history, range, store])

  const grouped = useMemo(() => {
    return eligibleHistory.reduce((groups, item) => {
      const label = dayLabel(item.entry.playedAt)
      const group = groups.find((entry) => entry.label === label)
      if (group) group.items.push(item)
      else groups.push({ label, items: [item] })
      return groups
    }, [])
  }, [eligibleHistory])

  // Fetch listening analysis dynamically on tab switch or range filter change (FR-013)
  useEffect(() => {
    if (tab !== 'stats') return

    let cancelled = false
    setLoadingStats(true)
    setStatsError(null)

    getListeningAnalysis(range, {
      userId: store.currentUser.id,
      history,
      tracks: store.tracks,
    })
      .then((res) => {
        if (cancelled) return
        if (res && res.success && res.data) {
          setStatsData(res.data)
        } else if (res && res.error) {
          setStatsError(res.message || 'Không thể tải thống kê.')
          store.toast?.(res.message || 'Thông tin phân tích tạm thời không khả dụng, vui lòng thử lại sau')
        }
      })
      .catch((err) => {
        if (cancelled) return
        console.error('Failed to load listening analysis:', err)
        setStatsError('Thông tin phân tích tạm thời không khả dụng, vui lòng thử lại sau')
        store.toast?.('Thông tin phân tích tạm thời không khả dụng, vui lòng thử lại sau')
      })
      .finally(() => {
        if (!cancelled) setLoadingStats(false)
      })

    return () => {
      cancelled = true
    }
  }, [tab, range, history, store.currentUser?.id])

  const maxGenreSeconds = statsData?.topGenres?.[0]?.accumulatedSeconds || 1

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Của riêng bạn"
        title="Lịch sử nghe & Thống kê"
        description="Chỉ bạn mới thấy được dữ liệu này. Số liệu được tính lại mỗi khi bạn mở trang."
      >
        {history.length > 0 && (
          <button type="button" onClick={() => setConfirmClear(true)} className={secondaryButton}>
            <Trash2 size={14} /> Xóa lịch sử
          </button>
        )}
      </PageHeader>

      <div className="px-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2" role="tablist" aria-label="Chế độ xem">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'history'}
              onClick={() => setTab('history')}
              className={`${chipClass(tab === 'history')} flex items-center gap-1.5`}
            >
              <History size={14} /> Lịch sử
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'stats'}
              onClick={() => setTab('stats')}
              className={`${chipClass(tab === 'stats')} flex items-center gap-1.5`}
            >
              <BarChart3 size={14} /> Thống kê
            </button>
          </div>
          <div className="flex gap-1.5" aria-label="Khoảng thời gian">
            {ranges.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={range === item.id}
                onClick={() => setRange(item.id)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                  range === item.id ? 'bg-white/15 text-white' : 'text-zinc-500 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'history' ? (
          eligibleHistory.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                icon={Clock3}
                title={history.length ? 'Không có lượt nghe trong khoảng thời gian này' : 'Chưa có đủ dữ liệu để phân tích'}
                description="Hãy nghe vài bài hát, AuraTune sẽ ghi lại lịch sử và tổng hợp thống kê cho bạn. Chúng tôi không tạo số liệu khi chưa có dữ liệu thật."
              >
                <Link to="/" className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-white transition hover:border-white/50">
                  Khám phá nhạc
                </Link>
              </EmptyState>
            </div>
          ) : (
            <div className="mt-6 space-y-7">
              {grouped.map((group) => (
                <section key={group.label}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">{group.label}</h2>
                  <ol className="mt-2 space-y-1">
                    {group.items.map(({ entry, track }) => (
                      <li key={entry.id}>
                        <button
                          type="button"
                          onClick={() => player.playTrack(track)}
                          className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-white/[0.05]"
                        >
                          <CoverArt variant={track.cover} className="h-11 w-11 shrink-0 rounded-md [&_span]:text-2xl" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-medium text-white">{track.title}</span>
                            <span className="block truncate text-[11px] text-zinc-500">{track.artist}</span>
                          </span>
                          <span className="shrink-0 text-right text-[11px] text-zinc-500">
                            {new Date(entry.playedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            <span className="block">{entry.listened ? `nghe ${formatTotalDuration(entry.listened)}` : 'vừa phát'}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          )
        ) : (
          /* Tab: Thống kê */
          loadingStats && !statsData ? (
            <div className="mt-12 text-center text-sm text-zinc-500">Đang tải thống kê nghe nhạc...</div>
          ) : statsData && (!statsData.hasSufficientData || statsData.totalPlays < 1) ? (
            <div className="mt-8">
              <EmptyState
                icon={Clock3}
                title="Chưa có đủ dữ liệu để phân tích"
                description="Hãy nghe vài bài hát, AuraTune sẽ ghi lại lịch sử và tổng hợp thống kê cho bạn. Chúng tôi không tạo số liệu khi chưa có dữ liệu thật."
              >
                <Link to="/" className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-white transition hover:border-white/50">
                  Khám phá nhạc
                </Link>
              </EmptyState>
            </div>
          ) : statsData ? (
            <div className="mt-6 space-y-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <Stat label="Tổng thời gian nghe" value={statsData.formattedTotalDuration} />
                <Stat label="Số lượt nghe" value={statsData.totalPlays} />
                <Stat label="Bài hát khác nhau" value={statsData.uniqueTracksCount} />
              </div>

              <section className="rounded-2xl bg-white/[0.03] p-5">
                <h2 className="text-base font-bold text-white">Top thể loại</h2>
                <p className="mt-1 text-[11px] text-zinc-500">Xếp theo tổng thời lượng nghe</p>
                {statsData.topGenres && statsData.topGenres.length > 0 ? (
                  <ol className="mt-4 space-y-3">
                    {statsData.topGenres.map((item) => (
                      <li key={item.genreId || item.rank}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-zinc-200">
                            {item.rank}. {item.genreName}
                          </span>
                          <span className="text-zinc-500">{item.formattedDuration}</span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-400 to-sky-300 transition-all duration-300"
                            style={{
                              width: `${Math.max(4, (item.accumulatedSeconds / maxGenreSeconds) * 100)}%`,
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-4 text-xs text-zinc-500">Chưa có bản ghi bài hát nào gắn thể loại trong khoảng thời gian này.</p>
                )}
              </section>
            </div>
          ) : statsError ? (
            <div className="mt-8 text-center text-rose-400">{statsError}</div>
          ) : null
        )}
      </div>

      {confirmClear && (
        <Modal
          title="Xóa lịch sử nghe?"
          description="Toàn bộ lịch sử và thống kê cá nhân sẽ bị xóa. Gợi ý cá nhân hóa có thể kém chính xác hơn."
          onClose={() => setConfirmClear(false)}
          labelledBy="clear-history-title"
        >
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setConfirmClear(false)} className={secondaryButton}>
              Hủy
            </button>
            <button
              type="button"
              onClick={() => {
                store.clearHistory?.()
                setConfirmClear(false)
                store.toast?.('Đã xóa lịch sử nghe.')
              }}
              className="inline-flex h-10 items-center rounded-full bg-rose-400 px-5 text-xs font-bold text-zinc-950 transition hover:bg-rose-300"
            >
              Xóa
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-violet-400/[0.08] to-sky-300/[0.04] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  )
}
