import { useEffect, useState } from 'react'
import AuthPage from '../pages/Auth/AuthPage.jsx'
import HomePage from '../pages/Home/HomePage.jsx'
import PlaylistDetailPage from '../pages/PlaylistDetail/PlaylistDetailPage.jsx'
import { getPlaylist } from '../utils/mockData.js'

export default function AppRouter({ onPlayTrack, onPlayPlaylist, onDownloadTrack }) {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    const updatePath = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', updatePath)
    return () => window.removeEventListener('popstate', updatePath)
  }, [])

  useEffect(() => {
    document.getElementById('page-content')?.scrollTo(0, 0)
  }, [pathname])

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPathname(path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  if (pathname === '/login') return <AuthPage />

  if (pathname.startsWith('/playlist/')) {
    const playlistId = pathname.split('/')[2]
    return <PlaylistDetailPage playlist={getPlaylist(playlistId)} onPlayTrack={onPlayTrack} onDownloadTrack={onDownloadTrack} />
  }

  return <HomePage onNavigate={navigate} onPlayTrack={onPlayTrack} onPlayPlaylist={onPlayPlaylist} onDownloadTrack={onDownloadTrack} />
}
