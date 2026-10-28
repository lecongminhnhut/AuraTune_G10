import { useMemo, useState } from 'react'
import { Ban, BarChart3, Music2, RotateCcw, Settings2, ShieldCheck, Users } from 'lucide-react'
import CoverArt from '../../components/playlist/CoverArt.jsx'
import { Forbidden, LoginRequired, PageHeader, chipClass, secondaryButton } from '../../components/common/ui.jsx'
import { useStore } from '../../context/AppStore.jsx'
import { normalizeText } from '../../utils/aiMockData.js'

const roleLabel = { user: 'Người nghe', artist: 'Nghệ sĩ', admin: 'Quản trị' }
const statusLabel = { active: 'Công khai', hidden: 'Đang ẩn', removed: 'Đã gỡ' }
const format = (value) => new Intl.NumberFormat('vi-VN').format(value)

// Khu vực quản trị (G11): thống kê nền tảng, quản lý người dùng, kiểm duyệt bài hát, cấu hình dịch vụ AI.
export default function AdminPage() {
  const store = useStore()
  const [tab, setTab] = useState('overview')
  const [query, setQuery] = useState('')
  const needle = normalizeText(query.trim())
  const users = store.state.users
  const tracks = store.allTracks

  const totalPlays = useMemo(() => tracks.reduce((sum, track) => sum + track.playCount, 0), [tracks])
  const demoPlays = useMemo(() => Object.values(store.state.libraries).reduce((sum, library) => sum + library.history.length, 0), [store.state.libraries])

  if (!store.currentUser) return <LoginRequired description="Đăng nhập bằng tài khoản quản trị để tiếp tục." />
  if (store.currentUser.role !== 'admin') return <Forbidden description="Chỉ quản trị viên mới truy cập được trang này. Thử đăng nhập bằng admin@auratune.vn." />

  const filteredUsers = users.filter((user) => !needle || normalizeText(`${user.displayName} ${user.email}`).includes(needle))
  const filteredTracks = tracks.filter((track) => !needle || normalizeText(`${track.title} ${track.artist}`).includes(needle))
  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
    { id: 'users', label: 'Người dùng', icon: Users },
    { id: 'content', label: 'Kiểm duyệt bài hát', icon: Music2 },
    { id: 'system', label: 'Hệ thống', icon: Settings2 },
  ]

  return (
    <div className="pb-12">
      <PageHeader eyebrow="Quản trị" title="Bảng điều khiển AuraTune" description="Quản lý người dùng, nội dung và dịch vụ của nền tảng." />
      <div className="px-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin" role="tablist" aria-label="Khu vực quản trị">
            {tabs.map(({ id, label, icon: IconComponent }) => <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`${chipClass(tab === id)} flex items-center gap-1.5`}><IconComponent size={14} /> {label}</button>)}
          </div>
          {(tab === 'users' || tab === 'content') && <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm…" aria-label="Tìm kiếm" className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs text-white outline-none focus:border-violet-300/50 sm:w-60" />}
        </div>

        {tab === 'overview' && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStat label="Người dùng" value={format(users.length)} hint={`${users.filter((user) => user.banned).length} tài khoản bị khóa`} />
            <AdminStat label="Nghệ sĩ" value={format(store.artists.filter((artist) => artist.isPublic).length)} hint={`${users.filter((user) => user.role === 'artist').length} tài khoản nghệ sĩ`} />
            <AdminStat label="Bài hát" value={format(tracks.length)} hint={`${tracks.filter((track) => store.trackStatus(track.id) !== 'active').length} bài bị ẩn/gỡ`} />
            <AdminStat label="Tổng lượt nghe" value={format(totalPlays + demoPlays)} hint={`${format(demoPlays)} lượt từ bản demo`} />
          </div>
        )}

        {tab === 'users' && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.06]">
            {filteredUsers.map((user) => {
              const isSelf = user.id === store.currentUser.id
              return (
                <div key={user.id} className="flex flex-wrap items-center gap-3 border-b border-white/[0.04] px-4 py-3 last:border-0">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-300/15 text-xs font-bold text-violet-100">{user.displayName.slice(0, 1)}</span>
                  <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold text-white">{user.displayName} {isSelf && <span className="text-[11px] font-normal text-zinc-500">(bạn)</span>}</p><p className="truncate text-[11px] text-zinc-500">{user.email} · tham gia {new Date(user.createdAt).toLocaleDateString('vi-VN')}</p></div>
                  <select value={user.role} disabled={isSelf} onChange={(event) => { store.setUserRole(user.id, event.target.value); store.toast(`Đã đổi vai trò của ${user.displayName}.`) }} aria-label={`Vai trò của ${user.displayName}`} className="rounded-lg border border-white/10 bg-zinc-900 px-2 py-1.5 text-xs text-white disabled:opacity-50">
                    {Object.entries(roleLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                  {user.banned && <span className="rounded-full bg-rose-400/10 px-2 py-0.5 text-[10px] font-semibold text-rose-300">Đã khóa</span>}
                  <button type="button" disabled={isSelf} onClick={() => { store.setUserBanned(user.id, !user.banned); store.toast(user.banned ? `Đã mở khóa ${user.displayName}.` : `Đã khóa ${user.displayName}.`) }} className={`${secondaryButton} h-8 px-3 ${user.banned ? '' : 'hover:border-rose-300/60 hover:text-rose-200'}`}>
                    {user.banned ? <><RotateCcw size={13} /> Mở khóa</> : <><Ban size={13} /> Khóa</>}
                  </button>
                </div>
              )
            })}
          </section>
        )}

        {tab === 'content' && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.06]">
            {filteredTracks.map((track) => {
              const status = store.trackStatus(track.id)
              return (
                <div key={track.id} className="flex flex-wrap items-center gap-3 border-b border-white/[0.04] px-4 py-3 last:border-0">
                  <CoverArt variant={track.cover} className="h-10 w-10 shrink-0 rounded-md [&_span]:text-xl" />
                  <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold text-white">{track.title}</p><p className="truncate text-[11px] text-zinc-500">{track.artist} · {format(track.playCount)} lượt nghe · {(store.comments[track.id] ?? []).length} bình luận</p></div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${status === 'active' ? 'bg-emerald-400/10 text-emerald-300' : status === 'hidden' ? 'bg-amber-300/10 text-amber-200' : 'bg-rose-400/10 text-rose-300'}`}>{statusLabel[status]}</span>
                  {status === 'removed' ? (
                    <button type="button" onClick={() => { store.setTrackStatus(track.id, 'active'); store.toast(`Đã khôi phục “${track.title}”.`) }} className={`${secondaryButton} h-8 px-3`}><RotateCcw size={13} /> Khôi phục</button>
                  ) : (
                    <button type="button" onClick={() => { store.setTrackStatus(track.id, 'removed'); store.toast(`Đã gỡ “${track.title}” vì vi phạm bản quyền.`) }} className={`${secondaryButton} h-8 px-3 hover:border-rose-300/60 hover:text-rose-200`}><Ban size={13} /> Gỡ bài</button>
                  )}
                </div>
              )
            })}
          </section>
        )}

        {tab === 'system' && (
          <section className="mt-6 space-y-3">
            <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
              <span>
                <span className="flex items-center gap-2 text-sm font-semibold text-white"><ShieldCheck size={16} className="text-sky-300" /> Dịch vụ AI đang hoạt động</span>
                <span className="mt-1 block text-xs leading-5 text-zinc-500">Tắt để mô phỏng AI gặp sự cố. Khi tắt: tìm kiếm chỉ theo từ khóa, AI Playlist hiện thông báo, trang chủ dùng bài phổ biến và AI Host báo tạm ngưng.</span>
              </span>
              <input type="checkbox" checked={store.aiAvailable} onChange={(event) => { store.setAiAvailable(event.target.checked); store.toast(event.target.checked ? 'Đã bật lại dịch vụ AI.' : 'Đã chuyển sang chế độ dự phòng khi AI không khả dụng.') }} className="h-5 w-5 shrink-0 accent-violet-300" />
            </label>
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
              <span>
                <span className="text-sm font-semibold text-white">Khôi phục dữ liệu demo</span>
                <span className="mt-1 block text-xs text-zinc-500">Xóa mọi thay đổi trong trình duyệt và đăng xuất.</span>
              </span>
              <button type="button" onClick={store.resetDemo} className={`${secondaryButton} h-9 shrink-0`}><RotateCcw size={14} /> Khôi phục</button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function AdminStat({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-violet-400/[0.08] to-sky-300/[0.04] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-[11px] text-zinc-500">{hint}</p>
    </div>
  )
}
