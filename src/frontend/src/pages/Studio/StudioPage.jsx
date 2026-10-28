import { useMemo, useState } from 'react'
import { Eye, EyeOff, Pencil, Trash2, Upload } from 'lucide-react'
import CoverArt from '../../components/playlist/CoverArt.jsx'
import { EmptyState, Forbidden, LoginRequired, Modal, PageHeader, inputClass, primaryButton, secondaryButton } from '../../components/common/ui.jsx'
import { useStore } from '../../context/AppStore.jsx'
import { genres, getArtist, getGenre } from '../../utils/mockData.js'
import { Link } from '../../utils/navigation.jsx'

const DURATION_PATTERN = /^\d{1,2}:[0-5]\d$/
const statusLabel = { active: 'Công khai', hidden: 'Đang ẩn', removed: 'Đã gỡ' }

// Artist Studio (G09 / feature 093): nghệ sĩ tải bài lên, sửa, ẩn hoặc xóa bài của chính mình.
export default function StudioPage() {
  const store = useStore()
  const user = store.currentUser
  const artist = getArtist(user?.artistId)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const myTracks = useMemo(() => store.allTracks.filter((track) => track.artistId === user?.artistId && store.trackStatus(track.id) !== 'removed'), [store, user])

  if (!user) return <LoginRequired description="Đăng nhập bằng tài khoản nghệ sĩ để quản lý bài hát." />
  if (user.role !== 'artist' || !artist) return <Forbidden description="Chỉ tài khoản nghệ sĩ mới dùng được Artist Studio. Thử đăng nhập bằng artist@auratune.vn." />

  const totalPlays = myTracks.reduce((sum, track) => sum + track.playCount, 0)

  return (
    <div className="pb-12">
      <PageHeader eyebrow="Artist Studio" title={artist.name} description="Quản lý bài hát bạn phát hành trên AuraTune.">
        <div className="flex gap-2">
          <Link to={`/artist/${artist.id}`} className={secondaryButton}>Xem hồ sơ công khai</Link>
          <button type="button" onClick={() => setUploadOpen(true)} className={primaryButton}><Upload size={15} /> Tải bài hát lên</button>
        </div>
      </PageHeader>

      <div className="px-5 sm:px-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <StudioStat label="Bài hát" value={myTracks.length} />
          <StudioStat label="Đang công khai" value={myTracks.filter((track) => store.trackStatus(track.id) === 'active').length} />
          <StudioStat label="Tổng lượt nghe" value={new Intl.NumberFormat('vi-VN').format(totalPlays)} />
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-white/[0.06]">
          <div className="hidden grid-cols-[minmax(0,2fr)_1fr_90px_110px_120px] gap-3 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[11px] uppercase tracking-wider text-zinc-500 md:grid">
            <span>Bài hát</span><span>Thể loại</span><span>Lượt nghe</span><span>Trạng thái</span><span className="text-right">Thao tác</span>
          </div>
          {myTracks.length ? myTracks.map((track) => {
            const status = store.trackStatus(track.id)
            return (
              <div key={track.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-white/[0.04] px-4 py-3 last:border-0 md:grid-cols-[minmax(0,2fr)_1fr_90px_110px_120px]">
                <div className="flex min-w-0 items-center gap-3">
                  <CoverArt variant={track.cover} className="h-10 w-10 shrink-0 rounded-md [&_span]:text-xl" />
                  <div className="min-w-0"><p className="truncate text-[13px] font-semibold text-white">{track.title}</p><p className="truncate text-[11px] text-zinc-500">{track.album} · {track.duration}{track.fileName ? ` · ${track.fileName}` : ''}</p></div>
                </div>
                <span className="hidden text-xs text-zinc-400 md:block">{getGenre(track.genre)?.name}</span>
                <span className="hidden text-xs tabular-nums text-zinc-400 md:block">{new Intl.NumberFormat('vi-VN').format(track.playCount)}</span>
                <span className={`hidden w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold md:block ${status === 'active' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-amber-300/10 text-amber-200'}`}>{statusLabel[status]}</span>
                <div className="flex justify-end gap-1">
                  {track.uploadedBy && <button type="button" onClick={() => setEditing(track)} aria-label={`Sửa ${track.title}`} title="Sửa" className="rounded-md p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"><Pencil size={15} /></button>}
                  <button type="button" onClick={() => { store.setTrackStatus(track.id, status === 'active' ? 'hidden' : 'active'); store.toast(status === 'active' ? `Đã ẩn “${track.title}”.` : `“${track.title}” đã công khai trở lại.`) }} aria-label={status === 'active' ? `Ẩn ${track.title}` : `Hiện ${track.title}`} title={status === 'active' ? 'Ẩn' : 'Hiện'} className="rounded-md p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white">{status === 'active' ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                  <button type="button" onClick={() => setDeleting(track)} aria-label={`Xóa ${track.title}`} title="Xóa" className="rounded-md p-2 text-zinc-400 transition hover:bg-rose-400/10 hover:text-rose-300"><Trash2 size={15} /></button>
                </div>
              </div>
            )
          }) : <div className="p-6"><EmptyState compact title="Chưa có bài hát" description="Tải bài hát đầu tiên của bạn lên AuraTune." /></div>}
        </section>
        <p className="mt-4 text-[11px] text-zinc-500">Bài đang ẩn không xuất hiện với người nghe nhưng vẫn giữ lượt nghe. Bản demo chỉ lưu thông tin bài hát, chưa tải tệp âm thanh lên máy chủ.</p>
      </div>

      {(uploadOpen || editing) && <TrackFormDialog track={editing} onClose={() => { setUploadOpen(false); setEditing(null) }} />}
      {deleting && (
        <Modal title="Xóa bài hát?" description={`“${deleting.title}” sẽ bị gỡ khỏi AuraTune và không thể khôi phục từ Studio.`} onClose={() => setDeleting(null)} labelledBy="delete-track-title">
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setDeleting(null)} className={secondaryButton}>Hủy</button>
            <button type="button" onClick={() => { store.deleteStudioTrack(deleting.id); store.toast(`Đã xóa “${deleting.title}”.`); setDeleting(null) }} className="inline-flex h-10 items-center rounded-full bg-rose-400 px-5 text-xs font-bold text-zinc-950 transition hover:bg-rose-300">Xóa</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function TrackFormDialog({ track, onClose }) {
  const store = useStore()
  const [form, setForm] = useState({ title: track?.title ?? '', albumTitle: track?.album ?? '', genre: track?.genre ?? genres[0].id, duration: track?.duration ?? '', fileName: track?.fileName ?? '' })
  const [error, setError] = useState('')
  const set = (field) => (event) => { setForm((current) => ({ ...current, [field]: event.target.value })); setError('') }

  const submit = (event) => {
    event.preventDefault()
    if (!form.title.trim()) { setError('Vui lòng nhập tên bài hát.'); return }
    if (!DURATION_PATTERN.test(form.duration)) { setError('Thời lượng có dạng phút:giây, ví dụ 3:45.'); return }
    if (!track && !form.fileName) { setError('Vui lòng chọn tệp âm thanh.'); return }
    if (track) {
      store.updateStudioTrack(track.id, { title: form.title.trim(), album: form.albumTitle.trim() || 'Single', genre: form.genre, duration: form.duration })
      store.toast('Đã cập nhật bài hát.')
    } else {
      store.uploadTrack(form)
      store.toast(`Đã tải “${form.title.trim()}” lên AuraTune.`)
    }
    onClose()
  }

  return (
    <Modal title={track ? 'Chỉnh sửa bài hát' : 'Tải bài hát lên'} description="Chỉ tải nhạc bạn sở hữu bản quyền hoặc có giấy phép mở (CC0, NCS)." onClose={onClose} labelledBy="track-form-title">
      <form onSubmit={submit} className="space-y-4">
        {!track && (
          <label className="block text-xs font-semibold text-zinc-200">Tệp âm thanh (MP3, WAV)
            <input type="file" accept="audio/*" onChange={(event) => { setForm((current) => ({ ...current, fileName: event.target.files?.[0]?.name ?? '' })); setError('') }} className="mt-2 block w-full text-xs text-zinc-400 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white" />
          </label>
        )}
        <label className="block text-xs font-semibold text-zinc-200">Tên bài hát<input value={form.title} onChange={set('title')} maxLength={100} className={inputClass} /></label>
        <label className="block text-xs font-semibold text-zinc-200">Album <span className="font-normal text-zinc-500">(để trống nếu là đĩa đơn)</span><input value={form.albumTitle} onChange={set('albumTitle')} maxLength={100} className={inputClass} /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-semibold text-zinc-200">Thể loại
            <select value={form.genre} onChange={set('genre')} className={`${inputClass} bg-zinc-900`}>{genres.map((genre) => <option key={genre.id} value={genre.id}>{genre.name}</option>)}</select>
          </label>
          <label className="block text-xs font-semibold text-zinc-200">Thời lượng<input value={form.duration} onChange={set('duration')} placeholder="3:45" className={inputClass} /></label>
        </div>
        {error && <p role="alert" className="text-xs text-rose-300">{error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className={secondaryButton}>Hủy</button>
          <button type="submit" className={primaryButton}>{track ? 'Lưu' : 'Tải lên'}</button>
        </div>
      </form>
    </Modal>
  )
}

function StudioStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  )
}
