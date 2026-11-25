import { useState } from 'react'
import { Loader2, RotateCw, Send, Trash2 } from 'lucide-react'
import { Link, loginPath } from '../../utils/navigation.jsx'
import { MAX_COMMENT_LENGTH } from '../../services/commentApi.js'
import { formatRelativeTime } from '../../utils/relativeTime.js'

const COUNTER_FROM = MAX_COMMENT_LENGTH - 50

// Feature 046: comment list and input of the full player. It receives the comments and the
// actions from TrackComments, so it renders the same way for backend and prototype comments.
export default function CommentThread({
  title,
  comments,
  status = 'ready',
  error = null,
  onRetry,
  signedIn,
  canPost,
  posting = false,
  deletingId = null,
  onSubmit,
  onDelete,
  onNavigateAway,
  now = Date.now(),
}) {
  const [text, setText] = useState('')
  const [postError, setPostError] = useState(null)
  const length = [...text].length

  const submit = async (event) => {
    event.preventDefault()
    const value = text.trim()
    if (!value || posting) return
    setPostError(null)
    const failure = await onSubmit(value)
    if (failure) setPostError(failure) // FR-013: the text stays in the input.
    else setText('')
  }

  return (
    <div className="mb-6 flex max-h-[340px] min-h-[220px] flex-col rounded-2xl border border-white/10 bg-black/15 p-3 lg:mb-8">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 scrollbar-thin" aria-label={`Bình luận về ${title}`} aria-busy={status === 'loading' || undefined}>
        {status === 'loading' && comments.length === 0 && (
          <p role="status" className="flex items-center justify-center gap-2 py-8 text-xs text-white/60"><Loader2 size={14} className="animate-spin" aria-hidden="true" /> Đang tải bình luận…</p>
        )}
        {status === 'error' && (
          <div role="alert" className="py-6 text-center text-xs text-white/70">
            <p>{error || 'Không tải được bình luận.'}</p>
            {onRetry && <button type="button" onClick={onRetry} className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-semibold text-white transition hover:bg-white/25"><RotateCw size={12} aria-hidden="true" /> Thử lại</button>}
          </div>
        )}
        {status === 'ready' && comments.length === 0 && <p className="py-8 text-center text-xs text-white/50">Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nhận!</p>}
        {status !== 'error' && comments.map((comment) => (
          <div key={comment.id} className="group flex gap-2.5">
            {comment.avatarUrl
              ? <img src={comment.avatarUrl} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
              : <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15 text-[11px] font-bold">{comment.author.slice(0, 1).toUpperCase()}</span>}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-white/60"><span className="font-semibold text-white/90">{comment.author}</span> · <time dateTime={comment.createdAt}>{formatRelativeTime(comment.createdAt, now)}</time></p>
              <p className="mt-0.5 text-[13px] leading-5 text-white/85 [overflow-wrap:anywhere]">{comment.text}</p>
            </div>
            {comment.canDelete && (
              <button
                type="button"
                onClick={() => onDelete(comment.id)}
                disabled={deletingId === comment.id}
                aria-label="Xóa bình luận"
                className="self-start rounded p-1 text-white/40 transition hover:text-rose-200 disabled:opacity-50 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:focus-visible:opacity-100"
              >
                {deletingId === comment.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
              </button>
            )}
          </div>
        ))}
      </div>
      {canPost ? (
        <form onSubmit={submit} className="mt-3">
          <div className="flex items-center gap-2 rounded-xl bg-white/10 p-1.5 pl-3">
            <input
              value={text}
              onChange={(event) => { setText(event.target.value); if (postError) setPostError(null) }}
              maxLength={MAX_COMMENT_LENGTH}
              placeholder="Viết bình luận…"
              aria-label="Viết bình luận"
              aria-invalid={postError ? true : undefined}
              aria-describedby={postError ? 'comment-post-error' : undefined}
              className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/40"
            />
            {length >= COUNTER_FROM && <span className="shrink-0 text-[10px] tabular-nums text-white/50" aria-live="polite">{length}/{MAX_COMMENT_LENGTH}</span>}
            <button type="submit" disabled={!text.trim() || posting} aria-label="Gửi bình luận" className="grid h-8 w-8 place-items-center rounded-lg bg-white text-zinc-900 transition disabled:bg-white/20 disabled:text-white/40">
              {posting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            </button>
          </div>
          {postError && <p id="comment-post-error" role="alert" className="mt-1.5 px-1 text-[11px] text-rose-200">{postError}</p>}
        </form>
      ) : (
        <p className="mt-3 text-center text-xs text-white/60">
          <Link to={loginPath()} onClick={onNavigateAway} className="font-semibold text-white underline underline-offset-4">Đăng nhập</Link>
          {signedIn ? ' bằng tài khoản AuraTune để bình luận.' : ' để bình luận.'}
        </p>
      )}
    </div>
  )
}
