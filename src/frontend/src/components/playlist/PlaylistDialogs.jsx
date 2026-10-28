import { useState } from 'react'
import { Check, Heart, Plus } from 'lucide-react'
import CoverArt from './CoverArt.jsx'
import { Modal, inputClass, primaryButton, secondaryButton } from '../common/ui.jsx'
import { LIKED_PLAYLIST_ID, useStore } from '../../context/AppStore.jsx'
import { navigate } from '../../utils/navigation.jsx'

const coverOptions = ['aurora', 'night', 'ocean', 'rose', 'sunset', 'forest', 'violet']

export function PlaylistFormDialog() {
  const store = useStore()
  const dialog = store.ui.playlistDialog
  const editing = dialog?.mode === 'edit' ? dialog.playlist : null
  const [title, setTitle] = useState(editing?.title ?? '')
  const [description, setDescription] = useState(editing?.description ?? '')
  const [cover, setCover] = useState(editing?.cover ?? 'aurora')
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (!title.trim()) { setError('Vui lòng đặt tên cho playlist.'); return }
    if (title.trim().length > 80) { setError('Tên playlist tối đa 80 ký tự.'); return }
    if (editing) {
      store.updatePlaylist(editing.id, { title: title.trim(), description: description.trim(), cover })
      store.toast('Đã cập nhật playlist.')
    } else {
      const id = store.createPlaylist({ title, description, cover, trackIds: dialog.initialTrackId ? [dialog.initialTrackId] : [] })
      store.toast(dialog.initialTrackId ? `Đã tạo “${title.trim()}” và thêm bài hát.` : `Đã tạo playlist “${title.trim()}”.`)
      navigate(`/playlist/${id}`)
    }
    store.closePlaylistDialog()
  }

  return (
    <Modal title={editing ? 'Chỉnh sửa playlist' : 'Tạo playlist mới'} description={editing ? 'Đổi tên, mô tả hoặc ảnh bìa.' : 'Đặt tên và mô tả để dễ tìm lại sau này.'} onClose={store.closePlaylistDialog} labelledBy="playlist-form-title">
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-xs font-semibold text-zinc-200">
          Tên playlist
          <input value={title} onChange={(event) => { setTitle(event.target.value); setError('') }} maxLength={80} placeholder="VD: Nhạc học bài cuối tuần" className={inputClass} aria-invalid={Boolean(error)} />
        </label>
        <label className="block text-xs font-semibold text-zinc-200">
          Mô tả <span className="font-normal text-zinc-500">(không bắt buộc)</span>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={300} rows={3} placeholder="Playlist này dành cho…" className={`${inputClass} h-auto resize-none py-2.5`} />
        </label>
        <fieldset>
          <legend className="text-xs font-semibold text-zinc-200">Ảnh bìa</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {coverOptions.map((option) => (
              <button key={option} type="button" onClick={() => setCover(option)} aria-label={`Chọn ảnh bìa ${option}`} aria-pressed={cover === option} className={`relative overflow-hidden rounded-lg ring-2 transition ${cover === option ? 'ring-violet-300' : 'ring-transparent hover:ring-white/30'}`}>
                <CoverArt variant={option} className="h-11 w-11 [&_span]:text-2xl" />
                {cover === option && <span className="absolute inset-0 grid place-items-center bg-black/30"><Check size={16} /></span>}
              </button>
            ))}
          </div>
        </fieldset>
        {error && <p role="alert" className="text-xs text-rose-300">{error}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={store.closePlaylistDialog} className={secondaryButton}>Hủy</button>
          <button type="submit" className={primaryButton}>{editing ? 'Lưu thay đổi' : 'Tạo playlist'}</button>
        </div>
      </form>
    </Modal>
  )
}

export function AddToPlaylistDialog() {
  const store = useStore()
  const track = store.ui.addToPlaylistTrack
  const editable = store.userPlaylists
  const liked = store.isLiked(track.id)

  const add = (playlist) => {
    const added = playlist.id === LIKED_PLAYLIST_ID && liked ? false : store.addTrackToPlaylist(playlist.id, track.id)
    store.toast(added ? `Đã thêm “${track.title}” vào ${playlist.title}.` : `“${track.title}” đã có trong ${playlist.title}.`)
    store.closeAddToPlaylist()
  }

  return (
    <Modal title="Thêm vào playlist" description={`${track.title} · ${track.artist}`} onClose={store.closeAddToPlaylist} labelledBy="add-to-playlist-title">
      <div className="space-y-1.5">
        <button type="button" onClick={() => store.openCreatePlaylist(track.id)} className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-white/[0.06]">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-white/10"><Plus size={18} /></span>
          <span className="text-sm font-semibold text-white">Playlist mới</span>
        </button>
        <button type="button" onClick={() => add({ id: LIKED_PLAYLIST_ID, title: 'Bài hát đã thích' })} className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-white/[0.06]">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-800"><Heart size={18} className="fill-current" /></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-white">Bài hát đã thích</span><span className="text-[11px] text-zinc-500">{store.library.likedIds.length} bài hát</span></span>
          {liked && <Check size={16} className="text-violet-300" aria-label="Đã có" />}
        </button>
        {editable.map((playlist) => {
          const contains = playlist.trackIds.includes(track.id)
          return (
            <button key={playlist.id} type="button" onClick={() => add(playlist)} className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-white/[0.06]">
              <CoverArt variant={playlist.cover} className="h-11 w-11 shrink-0 rounded-md [&_span]:text-2xl" />
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-white">{playlist.title}</span><span className="text-[11px] text-zinc-500">{playlist.trackIds.length} bài hát{playlist.isCollaborative ? ' · Cộng tác' : ''}</span></span>
              {contains && <Check size={16} className="text-violet-300" aria-label="Đã có" />}
            </button>
          )
        })}
        {!editable.length && <p className="px-2 pt-2 text-xs text-zinc-500">Bạn chưa có playlist riêng. Tạo playlist mới để bắt đầu.</p>}
      </div>
    </Modal>
  )
}
