import { useState } from 'react'
import BottomPlayer from './components/player/BottomPlayer.jsx'
import Icon from './components/common/Icon.jsx'
import Sidebar from './components/common/Sidebar.jsx'
import TopBar from './components/common/TopBar.jsx'
import AppRouter from './routes/AppRouter.jsx'
import { featuredTrack, playlists, tracks } from './utils/mockData.js'

export default function App() {
  const [isLoggedIn] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(featuredTrack)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loginPromptOpen, setLoginPromptOpen] = useState(false)

  const playTrack = (track) => {
    if (!isLoggedIn) {
      setLoginPromptOpen(true)
      return
    }
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  const playPlaylist = (playlist) => {
    const playlistIndex = playlists.findIndex((item) => item.id === playlist.id)
    playTrack(tracks[Math.max(0, playlistIndex) % tracks.length])
  }

  const togglePlayback = () => {
    if (!isLoggedIn) {
      setLoginPromptOpen(true)
      return
    }
    setIsPlaying((value) => !value)
  }

  const downloadTrack = (track) => {
    if (!track.audioUrl) return

    const link = document.createElement('a')
    link.href = track.audioUrl
    link.download = `${track.title}.mp3`
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const navigateToLogin = () => {
    window.history.pushState({}, '', '/login')
    window.dispatchEvent(new PopStateEvent('popstate'))
    setLoginPromptOpen(false)
  }

  return (
    <div className="h-screen overflow-hidden bg-zinc-950 text-white">
      <div className="flex h-[calc(100%-5.5rem)] gap-2 p-2 pb-0">
        <Sidebar />
        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg bg-[#111113]">
          <TopBar />
          <div id="page-content" className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
            <AppRouter onPlayTrack={playTrack} onPlayPlaylist={playPlaylist} onDownloadTrack={downloadTrack} />
          </div>
        </main>
      </div>
      <BottomPlayer
        track={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={togglePlayback}
        onDownloadTrack={downloadTrack}
      />
      {loginPromptOpen && (
        <LoginRequiredDialog onClose={() => setLoginPromptOpen(false)} onLogin={navigateToLogin} />
      )}
    </div>
  )
}

function LoginRequiredDialog({ onClose, onLogin }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section role="dialog" aria-modal="true" aria-labelledby="login-required-title" className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#19191d] p-7 text-center shadow-2xl shadow-black/50">
        <button onClick={onClose} aria-label="Close notification" className="absolute right-3 top-3 rounded-full p-2 text-zinc-500 transition hover:bg-white/10 hover:text-white"><Icon name="close" size={18} /></button>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-violet-300/20 bg-violet-300/10 text-violet-200"><Icon name="headphones" size={25} /></div>
        <h2 id="login-required-title" className="mt-5 text-xl font-bold text-white">Log in to listen to music</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">Log in to play your favorite songs and playlists.</p>
        <button onClick={onLogin} className="mt-6 h-11 w-full rounded-full bg-violet-300 text-sm font-bold text-zinc-950 transition hover:bg-violet-200">Log in</button>
        <button onClick={onClose} className="mt-3 h-10 w-full rounded-full text-xs font-semibold text-zinc-400 transition hover:bg-white/[0.05] hover:text-white">Maybe later</button>
      </section>
    </div>
  )
}
