import { useCallback, useEffect, useRef, useState } from 'react'
import BottomPlayer from './components/player/BottomPlayer.jsx'
import FullScreenPlayer from './components/player/FullScreenPlayer.jsx'
import QueuePanel from './components/player/QueuePanel.jsx'
import AIHostChat from './components/chat/AIHostChat.jsx'
import Sidebar from './components/common/Sidebar.jsx'
import TopBar from './components/common/TopBar.jsx'
import MobileNav from './components/common/MobileNav.jsx'
import { Toaster } from './components/common/ui.jsx'
import { AddToPlaylistDialog, PlaylistFormDialog } from './components/playlist/PlaylistDialogs.jsx'
import AppRouter from './routes/AppRouter.jsx'
import useAudioPlayer from './hooks/useAudioPlayer.js'
import { AppStoreProvider, useStore } from './context/AppStore.jsx'
import { PlayerContext } from './context/PlayerContext.jsx'
import { loginPath, navigate } from './utils/navigation.jsx'
import { shareLink, shareMessage, trackSharePath } from './utils/share.js'

const MAX_QUEUE_ITEMS = 50

export default function App() {
  return (
    <AppStoreProvider>
      <AppShell />
    </AppStoreProvider>
  )
}

function AppShell() {
  const store = useStore()
  const player = useAudioPlayer({ findTrack: store.findTrack, isPlayable: store.isPlayable })
  const [chatOpen, setChatOpen] = useState(false)
  const [fullScreenOpen, setFullScreenOpen] = useState(false)
  const queueOpen = store.ui.queueOpen
  const closeChat = useCallback(() => setChatOpen(false), [])
  const closeFullScreen = useCallback(() => setFullScreenOpen(false), [])
  const closeQueue = useCallback(() => store.setQueueOpen(false), [store.setQueueOpen])
  const openFullScreen = () => { setChatOpen(false); store.setQueueOpen(false); setFullScreenOpen(true) }
  const openChat = () => { store.setQueueOpen(false); setChatOpen(true) }
  const openQueue = () => { setChatOpen(false); setFullScreenOpen(false); store.setQueueOpen(true) }

  // Ghi lịch sử nghe (041-FR-014): một phiên nghe chỉ thành lượt phát khi trình phát báo đã nghe liên tục
  // 30 giây hoặc nửa bài (playCounted). Thời lượng nghe được cập nhật khi đổi bài, tạm dừng hoặc rời trang.
  const sessionRef = useRef(null)
  const userId = store.currentUser?.id
  const { recordPlay, updateListened } = store
  const playSessionKey = `${userId}:${player.track.id}:${player.playKey}`

  useEffect(() => {
    const session = sessionRef.current
    if (session && session.key !== playSessionKey) {
      updateListened(session.entryId, session.listened)
      sessionRef.current = null
    }
    if (!userId || !player.playCounted) return
    if (sessionRef.current) sessionRef.current.listened = player.listened
    else sessionRef.current = { key: playSessionKey, entryId: recordPlay(player.track.id), listened: player.listened }
  }, [playSessionKey, userId, player.playCounted, player.listened, player.track.id, recordPlay, updateListened])

  useEffect(() => {
    const flush = () => { if (sessionRef.current) updateListened(sessionRef.current.entryId, sessionRef.current.listened) }
    if (!player.isPlaying) flush()
    window.addEventListener('pagehide', flush)
    return () => window.removeEventListener('pagehide', flush)
  }, [player.isPlaying, updateListened])

  const requireLogin = (message = 'Bạn cần đăng nhập để dùng tính năng này.') => {
    store.toast(message, 'error')
    navigate(loginPath())
  }

  const playTrack = (track, queue = null, playlistId = null) => {
    if (!store.isPlayable(track.id)) { store.toast('Bài hát này hiện không khả dụng.', 'error'); return }
    player.playTrack(track, { queue: queue?.filter((item) => store.isPlayable(item.id)), playlistId })
    openFullScreen()
  }

  const playCollection = (collectionTracks, { playlistId = null, shuffle = false, openPlayer = true } = {}) => {
    const playable = collectionTracks.filter((track) => store.isPlayable(track.id))
    if (!playable.length) { store.toast('Danh sách này chưa có bài hát nào để phát.', 'error'); return }
    player.playCollection(playable, { playlistId, shuffle })
    if (openPlayer) openFullScreen()
  }

  const playAlbum = (collectionTracks) => {
    const playable = collectionTracks.filter((track) => store.isPlayable(track.id)).slice(0, MAX_QUEUE_ITEMS)
    if (!playable.length) {
      store.toast('This album has no playable tracks.', 'error')
      return 0
    }
    if (player.shuffle) player.toggleShuffle()
    player.playCollection(playable, { shuffle: false })
    openFullScreen()
    return playable.length
  }

  const playSelectedTrack = (track, albumTracks = []) => {
    if (!track || !store.isPlayable(track.id)) {
      store.toast('This track is currently unavailable.', 'error')
      return false
    }

    const selectedIndex = albumTracks.findIndex((item) => item.id === track.id)
    const laterPlayable = albumTracks
      .slice(selectedIndex + 1)
      .filter((item) => store.isPlayable(item.id))
      .slice(0, MAX_QUEUE_ITEMS - 1)

    player.playTrack(track)
    for (const laterTrack of [...laterPlayable].reverse()) player.playNext(laterTrack)
    openFullScreen()
    return true
  }

  const playPlaylist = (playlist, { shuffle = false } = {}) => {
    if (player.playlistId === playlist.id && !shuffle) {
      if (!player.isPlaying) player.togglePlayback()
      openFullScreen()
      return
    }
    playCollection(store.getPlaylistTracks(playlist), { playlistId: playlist.id, shuffle })
  }

  const toggleFromBottomPlayer = () => {
    player.togglePlayback()
    if (!player.isPlaying) openFullScreen()
  }

  const toggleChatPlaylist = (playlist) => {
    if (player.playlistId === playlist.id && player.isPlaying) player.togglePlayback()
    else playPlaylist(playlist)
  }

  const addToQueue = (track) => {
    if (!store.isPlayable(track.id)) {
      store.toast('This track is currently unavailable.', 'error')
      return false
    }
    const added = player.addToQueue(track)
    store.toast(added ? `Đã thêm “${track.title}” vào danh sách chờ.` : `“${track.title}” đã có trong danh sách chờ.`)
  }

  const playNext = (track) => {
    if (!store.isPlayable(track.id)) {
      store.toast('This track is currently unavailable.', 'error')
      return false
    }
    if (player.playNext(track)) store.toast(`“${track.title}” sẽ phát tiếp theo.`)
    else store.toast('Bài hát này đang được phát.')
  }

  const addManyToQueue = (items) => {
    const playable = items.filter((track) => store.isPlayable(track.id))
    const existingIds = new Set(player.queue.map((track) => track.id))
    const fresh = playable.filter((track) => !existingIds.has(track.id))
    const availableSlots = Math.max(0, MAX_QUEUE_ITEMS - player.queue.length)
    const accepted = fresh.slice(0, availableSlots)
    const count = player.addManyToQueue(accepted)
    if (count) store.toast(`Added ${count} track${count === 1 ? '' : 's'} to the queue.`)
    else if (fresh.length && !availableSlots) store.toast('The queue is full (50 tracks).', 'error')
    else store.toast('These tracks are already in the queue.')
    return count
  }

  const requestAddToPlaylist = (track) => {
    if (!store.currentUser) { requireLogin('Đăng nhập để thêm bài hát vào playlist.'); return }
    setFullScreenOpen(false)
    store.openAddToPlaylist(track)
  }

  const share = async (path, title) => {
    const result = await shareLink(path, title)
    if (result !== 'cancelled') store.toast(shareMessage(result), result === 'failed' ? 'error' : 'info')
  }

  const toggleCurrentLike = () => {
    if (!store.toggleLike(player.track.id)) requireLogin('Đăng nhập để lưu bài hát yêu thích.')
  }

  const downloadTrack = (track) => {
    if (!track.audioUrl) { store.toast('Bản demo chưa có tệp âm thanh để tải xuống.', 'error'); return }
    const link = document.createElement('a')
    link.href = track.audioUrl
    link.download = `${track.title}.mp3`
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const playerValue = {
    ...player,
    playTrack, playCollection, playAlbum, playSelectedTrack, playPlaylist, addToQueue, playNext, addManyToQueue,
    requestAddToPlaylist, share, requireLogin, openQueue, downloadTrack,
  }

  const modalOpen = fullScreenOpen

  return (
    <PlayerContext.Provider value={playerValue}>
      <div className="h-dvh overflow-hidden bg-zinc-950 text-white">
        <div className="h-full" inert={modalOpen ? '' : undefined}>
          <div className="flex h-[calc(100%-7.75rem)] gap-2 p-2 pb-0 md:h-[calc(100%-9rem)] lg:h-[calc(100%-5.5rem)]">
            <Sidebar />
            <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg bg-[#111113]">
              <TopBar onOpenChat={openChat} chatOpen={chatOpen} onPlayTrack={(track) => playTrack(track)} onPlayPlaylist={playPlaylist} />
              <div id="page-content" className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
                <AppRouter />
              </div>
            </main>
          </div>
          <MobileNav onOpenChat={openChat} chatOpen={chatOpen} />
          <BottomPlayer
            player={player}
            liked={store.isLiked(player.track.id)}
            onToggleLike={toggleCurrentLike}
            onDownloadTrack={downloadTrack}
            onOpenChat={openChat}
            chatOpen={chatOpen}
            onExpand={openFullScreen}
            fullScreenOpen={fullScreenOpen}
            onTogglePlayback={toggleFromBottomPlayer}
            onOpenQueue={() => (queueOpen ? closeQueue() : openQueue())}
            queueOpen={queueOpen}
          />
          <AIHostChat isOpen={chatOpen} onClose={closeChat} onPlayPlaylist={toggleChatPlaylist} currentPlaylistId={player.playlistId} isPlaying={player.isPlaying} />
          <QueuePanel isOpen={queueOpen} onClose={closeQueue} />
        </div>
        <FullScreenPlayer
          isOpen={fullScreenOpen}
          onClose={closeFullScreen}
          player={player}
          liked={store.isLiked(player.track.id)}
          onToggleLike={toggleCurrentLike}
          onOpenQueue={openQueue}
          onAddToPlaylist={requestAddToPlaylist}
          onAddToQueue={addToQueue}
          onShare={(track) => share(trackSharePath(track), `${track.title} · ${track.artist}`)}
        />
        {store.ui.playlistDialog && <PlaylistFormDialog key={store.ui.playlistDialog.playlist?.id ?? 'new'} />}
        {store.ui.addToPlaylistTrack && <AddToPlaylistDialog />}
        <Toaster />
      </div>
    </PlayerContext.Provider>
  )
}
