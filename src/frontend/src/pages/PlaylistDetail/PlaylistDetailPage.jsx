import { useMemo, useState } from 'react'
import { Pencil, Plus, Search, Share2, Shuffle, Trash2, Users, X } from 'lucide-react'
import Icon from '../../components/common/Icon.jsx'
import CoverArt from '../../components/playlist/CoverArt.jsx'
import SongTable from '../../components/song/SongTable.jsx'
import { EmptyState, LoginRequired, Modal, NotFound, inputClass, primaryButton, secondaryButton } from '../../components/common/ui.jsx'
import { LIKED_PLAYLIST_ID, useStore } from '../../context/AppStore.jsx'
import { usePlayer } from '../../context/PlayerContext.jsx'
import { normalizeText } from '../../utils/aiMockData.js'
import { navigate } from '../../utils/navigation.jsx'

export default function PlaylistDetailPage({ playlistId }) {
  const store = useStore()
  const player = usePlayer()
  const [following, setFollowing] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [collabOpen, setCollabOpen] = useState(false)
  const playlist = store.findPlaylistById(playlistId)
  const tracks = useMemo(() => store.getPlaylistTracks(playlist), [store, playlist])

  if (!playlist) {
    if (playlistId === LIKED_PLAYLIST_ID && !store.currentUser) return <LoginRequired description="Đăng nhập để xem những bài hát bạn đã thích." />
    return <NotFound title="Không tìm thấy playlist" description="Playlist có thể đã bị xóa hoặc bạn không có quyền xem." />
  }

  const isLiked = playlist.id === LIKED_PLAYLIST_ID
  const isOwner = Boolean(playlist.ownerId) && playlist.ownerId === store.currentUser?.id
  const canEdit = isLiked || isOwner || Boolean(playlist.collaborators?.includes(store.currentUser?.id))
  const removeTrack = (track) => {
    store.removeTrackFromPlaylist(playlist.id, track.id)
    store.toast(`Đã xóa “${track.title}” khỏi ${playlist.title}.`)
  }

  const deletePlaylist = () => {
    store.deletePlaylist(playlist.id)
    store.toast(`Đã xóa playlist “${playlist.title}”.`)
    navigate('/library', { replace: true })
  }

  return (
    <div className="pb-12">
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-900/50 via-violet-950/20 to-transparent px-5 pb-7 pt-6 sm:px-8 sm:pb-9 sm:pt-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[100px]" />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:gap-7">
          {isLiked ? (
            <div className="grid h-48 w-48 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-700 to-indigo-950 shadow-2xl shadow-black/40 sm:h-56 sm:w-56"><Icon name="heart" size={72} className="fill-current text-white/90" /></div>
          ) : (
            <CoverArt variant={playlist.cover} title={playlist.title} showLabel className="h-48 w-48 shrink-0 rounded-xl shadow-2xl shadow-black/40 sm:h-56 sm:w-56" />
          )}
          <div className="min-w-0 pb-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-200">{playlist.isCollaborative ? 'PLAYLIST CỘNG TÁC' : (playlist.label ?? 'PLAYLIST')}</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">{playlist.title}</h1>
            {playlist.description && <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">{playlist.description}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-300">
              <span className="font-semibold text-white">{playlist.owner}</span><span className="text-zinc-600">·</span><span>{playlist.count} bài hát</span><span className="text-zinc-600">·</span><span>{playlist.duration}</span>
              {playlist.official && <><span className="text-zinc-600">·</span><span className="text-zinc-400">AuraTune tuyển chọn</span></>}
              {playlist.collaborators?.length > 0 && <><span className="text-zinc-600">·</span><span className="text-zinc-400">{playlist.collaborators.length} cộng tác viên</span></>}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8">
        <div className="flex flex-wrap items-center gap-3 py-5">
          <button onClick={() => player.playPlaylist(playlist)} disabled={!tracks.length} aria-label="Phát playlist" className="grid h-14 w-14 place-items-center rounded-full bg-violet-300 text-zinc-950 shadow-glow transition hover:scale-105 hover:bg-violet-200 disabled:opacity-40"><Icon name="play" size={23} /></button>
          <button onClick={() => player.playPlaylist(playlist, { shuffle: true })} disabled={!tracks.length} aria-label="Phát ngẫu nhiên" title="Phát ngẫu nhiên" className="rounded-full p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:opacity-40"><Shuffle size={21} /></button>
          {!canEdit && <button onClick={() => setFollowing((value) => !value)} aria-pressed={following} className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${following ? 'border-violet-300/40 bg-violet-300/10 text-violet-200' : 'border-white/20 text-zinc-300 hover:border-white/50 hover:text-white'}`}>{following ? 'Đã lưu vào thư viện' : 'Lưu playlist'}</button>}
          {canEdit && !isLiked && <button onClick={() => setAddOpen(true)} className="flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-zinc-200 transition hover:border-white/50 hover:text-white"><Plus size={15} /> Thêm bài hát</button>}
          {isOwner && <button onClick={() => store.openEditPlaylist(playlist)} aria-label="Chỉnh sửa playlist" title="Chỉnh sửa" className="rounded-full p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white"><Pencil size={18} /></button>}
          {isOwner && <button onClick={() => setCollabOpen(true)} aria-label="Quản lý cộng tác" title="Cộng tác" className="rounded-full p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white"><Users size={19} /></button>}
          {!isLiked && <button onClick={() => player.share(`/playlist/${playlist.id}`, playlist.title)} aria-label="Chia sẻ playlist" title="Chia sẻ" className="rounded-full p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white"><Share2 size={18} /></button>}
          {isOwner && <button onClick={() => setConfirmDelete(true)} aria-label="Xóa playlist" title="Xóa playlist" className="rounded-full p-2 text-zinc-400 transition hover:bg-rose-400/10 hover:text-rose-300"><Trash2 size={18} /></button>}
          {tracks.length > 0 && <button onClick={() => player.addManyToQueue(tracks)} className="ml-auto text-xs font-semibold text-zinc-400 transition hover:text-white">Thêm vào danh sách chờ</button>}
        </div>

        {tracks.length ? (
          <SongTable
            songs={tracks}
            onPlayTrack={(track) => player.playTrack(track, tracks, playlist.id)}
            onDownloadTrack={player.downloadTrack}
            onRemove={canEdit ? removeTrack : undefined}
            removeLabel={isLiked ? 'Bỏ thích' : 'Xóa khỏi playlist'}
            onMove={canEdit && !isLiked ? (from, to) => store.moveTrackInPlaylist(playlist.id, from, to) : undefined}
          />
        ) : (
          <EmptyState title={isLiked ? 'Bạn chưa thích bài hát nào' : 'Playlist chưa có bài hát'} description={isLiked ? 'Thả tim một bài hát để lưu vào đây.' : 'Thêm bài hát từ tìm kiếm, album hoặc nút “Thêm bài hát”.'}>
            {canEdit && !isLiked && <button onClick={() => setAddOpen(true)} className={primaryButton}><Plus size={15} /> Thêm bài hát</button>}
          </EmptyState>
        )}
        {canEdit && !isLiked && tracks.length > 1 && <p className="mt-4 text-[11px] text-zinc-500">Mẹo: kéo biểu tượng ⋮⋮ để sắp xếp, hoặc dùng menu “…” để di chuyển lên/xuống.</p>}
        {playlist.official && <p className="mt-7 text-xs text-zinc-500">Cập nhật gần đây · {tracks.length} bài hát trong bản xem trước</p>}
      </section>

      {addOpen && <AddSongsDialog playlist={playlist} onClose={() => setAddOpen(false)} />}
      {collabOpen && <CollaboratorsDialog playlist={playlist} onClose={() => setCollabOpen(false)} />}
      {confirmDelete && (
        <Modal title="Xóa playlist?" description={`“${playlist.title}” sẽ bị xóa khỏi thư viện của bạn. Không thể hoàn tác.`} onClose={() => setConfirmDelete(false)} labelledBy="delete-playlist-title">
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setConfirmDelete(false)} className={secondaryButton}>Hủy</button>
            <button type="button" onClick={deletePlaylist} className="inline-flex h-10 items-center rounded-full bg-rose-400 px-5 text-xs font-bold text-zinc-950 transition hover:bg-rose-300">Xóa</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function AddSongsDialog({ playlist, onClose }) {
  const store = useStore()
  const [query, setQuery] = useState('')
  const current = store.findPlaylistById(playlist.id) ?? playlist
  const needle = normalizeText(query.trim())
  const results = store.publicTracks.filter((track) => !needle || normalizeText(`${track.title} ${track.artist} ${track.album}`).includes(needle)).slice(0, 30)

  return (
    <Modal title="Thêm bài hát" description={`Vào playlist “${playlist.title}”`} onClose={onClose} labelledBy="add-songs-title">
      <label className="relative block">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 mt-1 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm bài hát, nghệ sĩ…" aria-label="Tìm bài hát để thêm" className={`${inputClass} pl-9`} />
      </label>
      <div className="mt-3 max-h-[50dvh] space-y-1 overflow-y-auto scrollbar-thin">
        {results.map((track) => {
          const added = current.trackIds.includes(track.id)
          return (
            <div key={track.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/[0.05]">
              <CoverArt variant={track.cover} className="h-10 w-10 shrink-0 rounded-md [&_span]:text-xl" />
              <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium text-white">{track.title}</p><p className="truncate text-[11px] text-zinc-500">{track.artist}</p></div>
              <button type="button" disabled={added} onClick={() => store.addTrackToPlaylist(playlist.id, track.id)} className="rounded-full border border-white/20 px-3 py-1 text-[11px] font-semibold text-white transition hover:border-white/50 disabled:border-transparent disabled:text-violet-300">{added ? 'Đã thêm' : 'Thêm'}</button>
            </div>
          )
        })}
        {!results.length && <p className="py-6 text-center text-xs text-zinc-500">Không tìm thấy bài hát phù hợp.</p>}
      </div>
    </Modal>
  )
}

function CollaboratorsDialog({ playlist, onClose }) {
  const store = useStore()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const current = store.findPlaylistById(playlist.id) ?? playlist
  const collaborators = (current.collaborators ?? []).map((id) => store.state.users.find((user) => user.id === id)).filter(Boolean)

  const invite = (event) => {
    event.preventDefault()
    const result = store.addCollaborator(playlist.id, email)
    if (!result.ok) { setError(result.error); return }
    store.toast(`${result.user.displayName} có thể cùng chỉnh sửa playlist này.`)
    setEmail('')
    setError('')
  }

  return (
    <Modal title="Playlist cộng tác" description="Người được mời có thể thêm, xóa và sắp xếp bài hát cùng bạn." onClose={onClose} labelledBy="collab-title">
      <label className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] px-4 py-3 text-sm text-zinc-200">
        Cho phép cộng tác
        <input type="checkbox" checked={Boolean(current.isCollaborative)} onChange={(event) => store.updatePlaylist(playlist.id, { isCollaborative: event.target.checked })} className="h-4 w-4 accent-violet-300" />
      </label>
      <form onSubmit={invite} className="mt-4">
        <label className="block text-xs font-semibold text-zinc-200">Mời bằng email
          <div className="flex gap-2">
            <input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} placeholder="minhanh@example.com" className={inputClass} />
            <button type="submit" disabled={!email.trim()} className={`${primaryButton} mt-2 h-11`}>Mời</button>
          </div>
        </label>
        {error && <p role="alert" className="mt-2 text-xs text-rose-300">{error}</p>}
      </form>
      <div className="mt-5 space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Cộng tác viên</p>
        {collaborators.length ? collaborators.map((user) => (
          <div key={user.id} className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-violet-300/20 text-xs font-bold text-violet-100">{user.displayName.slice(0, 1)}</span>
            <div className="min-w-0 flex-1"><p className="truncate text-[13px] text-white">{user.displayName}</p><p className="truncate text-[11px] text-zinc-500">{user.email}</p></div>
            <button type="button" onClick={() => store.removeCollaborator(playlist.id, user.id)} aria-label={`Gỡ ${user.displayName}`} className="rounded p-1 text-zinc-500 hover:text-rose-300"><X size={15} /></button>
          </div>
        )) : <p className="text-xs text-zinc-500">Chưa có ai. Thử mời minhanh@example.com hoặc linh@example.com.</p>}
      </div>
    </Modal>
  )
}
