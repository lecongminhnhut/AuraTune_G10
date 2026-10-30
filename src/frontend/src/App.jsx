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
import useMockPlayer from './hooks/useMockPlayer.js'
import { AppStoreProvider, useStore } from './context/AppStore.jsx'
import { PlayerContext } from './context/PlayerContext.jsx'
import { loginPath, navigate } from './utils/navigation.jsx'
import { shareLink, shareMessage, trackSharePath } from './utils/share.js'

export default function App() {
  return (
    <AppStoreProvider>
      <AppShell />
    </AppStoreProvider>
  )
}

function AppShell() {
  const store = useStore()
  const player = useMockPlayer()
  const [chatOpen, setChatOpen] = useState(false)
  const [fullScreenOpen, setFullScreenOpen] = useState(false)
  const queueOpen = store.ui.queueOpen
  const closeChat = useCallback(() => setChatOpen(false), [])
  const closeFullScreen = useCallback(() => setFullScreenOpen(false), [])
  const closeQueue = useCallback(() => store.setQueueOpen(false), [store.setQueueOpen])
  const openFullScreen = () => { setChatOpen(false); store.setQueueOpen(false); setFullScreenOpen(true) }
  const openChat = () => { store.setQueueOpen(false); setChatOpen(true) }
  const openQueue = () => { setChatOpen(false); setFullScreenOpen(false); store.setQueueOpen(true) }

  // Ghi lịch sử nghe: mỗi lần một bài bắt đầu phát tạo một bản ghi, thời lượng nghe được cập nhật khi đổi bài hoặc tạm dừng.
  const sessionRef = useRef(null)
  const userId = store.currentUser?.id
  const { recordPlay, updateListened } = store
  useEffect(() => {
    if (sessionRef.current && sessionRef.current.trackId === player.track.id) sessionRef.current.listened = player.elapsed
  }, [player.elapsed, player.track.id])

  useEffect(() => {
    const flush = () => { if (sessionRef.current) updateListened(sessionRef.current.entryId, sessionRef.current.listened) }
    if (!player.isPlaying || !userId) { flush(); return undefined }
    const key = `${userId}:${player.track.id}:${player.playKey}`
    if (sessionRef.current?.key !== key) {
      flush()
      sessionRef.current = { key, trackId: player.track.id, entryId: recordPlay(player.track.id), listened: 0 }
    }
    window.addEventListener('pagehide', flush)
    return () => window.removeEventListener('pagehide', flush)
  }, [player.isPlaying, player.track.id, player.playKey, userId, recordPlay, updateListened])

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
    const added = player.addToQueue(track)
    store.toast(added ? `Đã thêm “${track.title}” vào danh sách chờ.` : `“${track.title}” đã có trong danh sách chờ.`)
  }

  const playNext = (track) => {
    if (player.playNext(track)) store.toast(`“${track.title}” sẽ phát tiếp theo.`)
    else store.toast('Bài hát này đang được phát.')
  }

  const addManyToQueue = (items) => {
    const count = player.addManyToQueue(items.filter((track) => store.isPlayable(track.id)))
    store.toast(count ? `Đã thêm ${count} bài vào danh sách chờ.` : 'Các bài này đã có trong danh sách chờ.')
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
    playTrack, playCollection, playPlaylist, addToQueue, playNext, addManyToQueue,
    requestAddToPlaylist, share, requireLogin, openQueue, downloadTrack,
  }

  const modalOpen = fullScreenOpen

  return (
    <PlayerContext.Provider value={playerValue}>
      <div className="h-dvh overflow-hidden bg-zinc-950 text-white">
        <div className="h-full" inert={modalOpen ? '' : undefined}>
          <div className="flex h-[calc(100%-9rem)] gap-2 p-2 pb-0 md:h-[calc(100%-5.5rem)]">
            <Sidebar />
            <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg bg-[#111113]">
              <TopBar onOpenChat={openChat} chatOpen={chatOpen} onPlayTrack={(track) => playTrack(track)} onPlayPlaylist={playPlaylist} />
              <div id="page-content" className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
                <AppRouter />
              </div>
            </main>
          </div>
          <MobileNav />
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
