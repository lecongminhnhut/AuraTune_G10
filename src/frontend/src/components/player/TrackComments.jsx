import { useState } from 'react'
import { Send, Trash2 } from 'lucide-react'
import { useStore } from '../../context/AppStore.jsx'
import { Link, loginPath } from '../../utils/navigation.jsx'

const timeAgo = (iso) => {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (minutes < 1) return 'Vừa xong'
  if (minutes < 60) return `${minutes} phút trước`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} giờ trước`
  return `${Math.round(hours / 24)} ngày trước`
}

// Bình luận về bài hát trong trình phát toàn màn hình (G04).
export default function TrackComments({ track, onNavigateAway }) {
  const store = useStore()
  const [text, setText] = useState('')
  const comments = store.comments[track.id] ?? []
  const user = store.currentUser

  const submit = (event) => {
    event.preventDefault()
    if (store.addComment(track.id, text)) setText('')
  }

  return (
    <div className="mb-6 flex max-h-[340px] min-h-[220px] flex-col rounded-2xl border border-white/10 bg-black/15 p-3 lg:mb-8">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 scrollbar-thin" aria-label={`Bình luận về ${track.title}`}>
        {comments.length === 0 && <p className="py-8 text-center text-xs text-white/50">Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nhận!</p>}
        {comments.map((comment) => (
          <div key={comment.id} className="group flex gap-2.5">
            <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15 text-[11px] font-bold">{comment.author.slice(0, 1).toUpperCase()}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-white/60"><span className="font-semibold text-white/90">{comment.author}</span> · {timeAgo(comment.createdAt)}</p>
              <p className="mt-0.5 text-[13px] leading-5 text-white/85 [overflow-wrap:anywhere]">{comment.text}</p>
            </div>
            {(user?.id === comment.userId || user?.role === 'admin') && (
              <button type="button" onClick={() => store.deleteComment(track.id, comment.id)} aria-label="Xóa bình luận" className="self-start rounded p-1 text-white/40 transition hover:text-rose-200 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"><Trash2 size={13} /></button>
            )}
          </div>
        ))}
      </div>
      {user ? (
        <form onSubmit={submit} className="mt-3 flex items-center gap-2 rounded-xl bg-white/10 p-1.5 pl-3">
          <input value={text} onChange={(event) => setText(event.target.value)} maxLength={300} placeholder="Viết bình luận…" aria-label="Viết bình luận" className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/40" />
          <button type="submit" disabled={!text.trim()} aria-label="Gửi bình luận" className="grid h-8 w-8 place-items-center rounded-lg bg-white text-zinc-900 transition disabled:bg-white/20 disabled:text-white/40"><Send size={15} /></button>
        </form>
      ) : (
        <p className="mt-3 text-center text-xs text-white/60"><Link to={loginPath()} onClick={onNavigateAway} className="font-semibold text-white underline underline-offset-4">Đăng nhập</Link> để bình luận.</p>
      )}
    </div>
  )
}
