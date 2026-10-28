import { useEffect } from 'react'
import AuthPage from '../pages/Auth/AuthPage.jsx'
import HomePage from '../pages/Home/HomePage.jsx'
import PlaylistDetailPage from '../pages/PlaylistDetail/PlaylistDetailPage.jsx'
import SearchPage from '../pages/Search/SearchPage.jsx'
import ExplorePage from '../pages/Explore/ExplorePage.jsx'
import ChartsPage from '../pages/Charts/ChartsPage.jsx'
import AlbumPage from '../pages/Album/AlbumPage.jsx'
import ArtistPage from '../pages/Artist/ArtistPage.jsx'
import FollowingPage from '../pages/Artist/FollowingPage.jsx'
import LibraryPage from '../pages/Library/LibraryPage.jsx'
import HistoryPage from '../pages/History/HistoryPage.jsx'
import AIPlaylistPage from '../pages/AIPlaylist/AIPlaylistPage.jsx'
import StudioPage from '../pages/Studio/StudioPage.jsx'
import AdminPage from '../pages/Admin/AdminPage.jsx'
import { NotFound } from '../components/common/ui.jsx'
import { useLocation } from '../utils/navigation.jsx'

const routes = [
  { pattern: /^\/$/, render: () => <HomePage /> },
  { pattern: /^\/login$/, render: () => <AuthPage mode="login" /> },
  { pattern: /^\/register$/, render: () => <AuthPage mode="register" /> },
  { pattern: /^\/search$/, render: () => <SearchPage /> },
  { pattern: /^\/explore$/, render: () => <ExplorePage /> },
  { pattern: /^\/charts$/, render: () => <ChartsPage /> },
  { pattern: /^\/library$/, render: () => <LibraryPage /> },
  { pattern: /^\/following$/, render: () => <FollowingPage /> },
  { pattern: /^\/history$/, render: () => <HistoryPage /> },
  { pattern: /^\/ai-playlist$/, render: () => <AIPlaylistPage /> },
  { pattern: /^\/studio$/, render: () => <StudioPage /> },
  { pattern: /^\/admin$/, render: () => <AdminPage /> },
  { pattern: /^\/playlist\/([^/]+)$/, render: ([id]) => <PlaylistDetailPage key={id} playlistId={decodeURIComponent(id)} /> },
  { pattern: /^\/album\/([^/]+)$/, render: ([id]) => <AlbumPage key={id} albumId={decodeURIComponent(id)} /> },
  { pattern: /^\/artist\/([^/]+)$/, render: ([id]) => <ArtistPage key={id} artistId={decodeURIComponent(id)} /> },
]

export default function AppRouter() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.getElementById('page-content')?.scrollTo(0, 0)
  }, [pathname])

  for (const route of routes) {
    const match = pathname.match(route.pattern)
    if (match) return route.render(match.slice(1))
  }
  return <NotFound title="Không tìm thấy trang" />
}
