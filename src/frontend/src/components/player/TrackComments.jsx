import { useStore } from '../../context/AppStore.jsx'
import { isCatalogSongId } from '../../services/songApi.js'
import useTrackComments from '../../hooks/useTrackComments.js'
import CommentThread from './CommentThread.jsx'

// Feature 046: comments on the song in the full player.
// Catalog songs (numeric ids) use the backend, so everyone sees the same comments and the server
// checks who may post and delete (FR-012). Demo tracks keep the local prototype comments.
export default function TrackComments({ track, onNavigateAway, active = true }) {
  const store = useStore()
  const user = store.currentUser
  const remote = isCatalogSongId(track.id)
  const backendSession = store.state?.session?.source === 'backend'
  const thread = useTrackComments(remote ? String(track.id) : null, { enabled: remote && active, viewerKey: user?.id ?? null })

  const props = remote
    ? {
        comments: thread.comments,
        status: thread.status,
        error: thread.error,
        onRetry: thread.retry,
        canPost: Boolean(user && backendSession),
        posting: thread.posting,
        deletingId: thread.deletingId,
        onSubmit: thread.post,
        onDelete: async (commentId) => {
          const error = await thread.remove(commentId)
          if (error) store.toast(error, 'error')
        },
      }
    : {
        comments: [...(store.comments[track.id] ?? [])].reverse().map((comment) => ({
          ...comment,
          canDelete: Boolean(user && (user.id === comment.userId || user.role === 'admin')),
        })),
        status: 'ready',
        canPost: Boolean(user),
        onSubmit: async (text) => (store.addComment(track.id, text) ? null : 'Không gửi được bình luận, vui lòng thử lại.'),
        onDelete: async (commentId) => { store.deleteComment(track.id, commentId) },
      }

  return <CommentThread key={track.id} title={track.title} signedIn={Boolean(user)} onNavigateAway={onNavigateAway} {...props} />
}
