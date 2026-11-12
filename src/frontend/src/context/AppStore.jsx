import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { authApi, configureAuthContext } from '../services/sessionApiClient.js'
import { logoutFirebase } from '../services/firebaseAuth.js'
import { albums, artists, getAlbum, getArtist, playlists as officialPlaylists, tracks as seedTracks } from '../utils/mockData.js'
import { getDurationSeconds } from '../utils/playback.js'

// Toàn bộ dữ liệu ở đây là dữ liệu demo lưu trong localStorage của trình duyệt.
// Khi có backend, các hàm trong store sẽ được thay bằng lời gọi API tương ứng.
const STORAGE_KEY = 'auratune-demo-state-v1'
const SESSION_HOURS = 24
const MAX_FAILED_LOGINS = 5
const LOCK_MINUTES = 15
export const LIKED_PLAYLIST_ID = 'liked'

// Hàm băm minh họa để không lưu mật khẩu dạng chữ thường trong localStorage.
// Không dùng cho môi trường thật: backend phải băm bằng bcrypt/Argon2 (spec 011 FR-006).
export const demoHash = (value) => {
  let hash = 5381
  for (const char of value) hash = ((hash << 5) + hash + char.charCodeAt(0)) | 0
  return `demo$${(hash >>> 0).toString(16)}`
}

const daysAgo = (days, hours = 0) => new Date(Date.now() - (days * 24 + hours) * 3600 * 1000).toISOString()

const seedUsers = [
  { id: 'u-demo', email: 'demo@auratune.vn', displayName: 'Người nghe Demo', passwordHash: demoHash('Aura1234'), role: 'user', createdAt: daysAgo(30), banned: false },
  { id: 'u-artist', email: 'artist@auratune.vn', displayName: 'AuraTune Studio', passwordHash: demoHash('Aura1234'), role: 'artist', artistId: 'auratune-studio', createdAt: daysAgo(60), banned: false },
  { id: 'u-admin', email: 'admin@auratune.vn', displayName: 'Quản trị viên', passwordHash: demoHash('Aura1234'), role: 'admin', createdAt: daysAgo(90), banned: false },
  { id: 'u-minh-anh', email: 'minhanh@example.com', displayName: 'Minh Anh', passwordHash: demoHash('Aura1234'), role: 'user', createdAt: daysAgo(12), banned: false },
  { id: 'u-linh', email: 'linh@example.com', displayName: 'Linh Nguyễn', passwordHash: demoHash('Aura1234'), role: 'user', createdAt: daysAgo(8), banned: false },
]

const emptyLibrary = () => ({ playlists: [], likedIds: [], savedAlbumIds: [], follows: [], history: [] })

const seedHistory = [
  ['t1', 0, 1, 261], ['t8', 0, 3, 204], ['t9', 0, 4, 178], ['t2', 1, 2, 248], ['t1', 1, 5, 261],
  ['t3', 2, 1, 224], ['t10', 2, 6, 252], ['t5', 3, 2, 120], ['t8', 4, 1, 204], ['t4', 5, 3, 192],
].map(([trackId, days, hours, listened], index) => ({ id: `h-seed-${index}`, trackId, playedAt: daysAgo(days, hours), listened }))

const createInitialState = () => ({
  version: 1,
  users: seedUsers,
  session: null,
  loginAttempts: {},
  libraries: {
    'u-demo': { ...emptyLibrary(), likedIds: ['t1', 't8'], follows: [{ artistId: 'hoang-dung', followedAt: daysAgo(6) }, { artistId: 'auratune-studio', followedAt: daysAgo(2) }], history: seedHistory },
  },
  comments: {
    t1: [
      { id: 'c-1', trackId: 't1', userId: 'u-minh-anh', author: 'Minh Anh', text: 'Nghe bài này mỗi tối, thấy bình yên lạ.', createdAt: daysAgo(1) },
      { id: 'c-2', trackId: 't1', userId: 'u-linh', author: 'Linh Nguyễn', text: 'Giai điệu dễ thương quá 💜', createdAt: daysAgo(0, 5) },
    ],
    t8: [{ id: 'c-3', trackId: 't8', userId: 'u-minh-anh', author: 'Minh Anh', text: 'Bản lofi hợp để code nhất!', createdAt: daysAgo(0, 2) }],
  },
  studioTracks: [],
  trackStatus: {},
  aiAvailable: true,
})

const loadState = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    if (saved?.version === 1) return { ...createInitialState(), ...saved }
  } catch {
    // Bỏ qua dữ liệu hỏng hoặc localStorage bị chặn.
  }
  return createInitialState()
}

const uid = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
const normalizeEmail = (value) => value.trim().toLowerCase()
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const isStrongPassword = (value) => {
  if (!value || value.length < 8) return false
  const hasUpper = /[A-Z]/.test(value)
  const hasLower = /[a-z]/.test(value)
  const hasDigit = /\d/.test(value)
  const hasSpecial = /[^A-Za-z0-9]/.test(value)
  return hasUpper && hasLower && hasDigit && hasSpecial
}

export const formatTotalDuration = (seconds) => {
  const totalMinutes = Math.round(seconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (!hours) return `${minutes} phút`
  return `${hours} giờ ${String(minutes).padStart(2, '0')} phút`
}

  const StoreContext = createContext(null)

  export function AppStoreProvider({ children }) {
    const [state, setState] = useState(loadState)
    const [sessionRestoring, setSessionRestoring] = useState(true)
    const [toasts, setToasts] = useState([])
    const [ui, setUi] = useState({ playlistDialog: null, addToPlaylistTrack: null, queueOpen: false })
    const stateRef = useRef(state)
    stateRef.current = state

    useEffect(() => {
      try {
        const persistedState = {
    ...state,
    session: state.session?.source === 'backend'
      ? null
      : state.session
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(persistedState)
  )
    } catch {
      // localStorage có thể bị chặn ở chế độ riêng tư; ứng dụng vẫn chạy trong bộ nhớ.
    }
  }, [state])

    useEffect(() => {
      configureAuthContext({
        getAccessToken: () => stateRef.current.session?.token || null,
        refreshSession: async () => {
          try {
            const response = await authApi.refresh()
            const accessToken = response.data?.access_token
            if (response.status !== 'success' || !accessToken) {
              return { ok: false, message: response.message }
            }

            const expiresIn = response.data.expires_in || 900
            setState((previous) => previous.session?.source === 'backend'
              ? {
                  ...previous,
                  session: {
                    ...previous.session,
                    token: accessToken,
                    expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
                  },
                }
              : previous)

            return { ok: true, accessToken }
          } catch (error) {
            return { ok: false, message: error.message }
          }
        },
        onSessionRevoked: () => {
          setState((previous) => ({ ...previous, session: null }))
        },
      })

      return () => configureAuthContext({})
    }, [])

  // Restore an authenticated backend session via HttpOnly cookie.
  useEffect(() => {
    let cancelled = false

    const restoreSession = async () => {
      try {
        const response = await authApi.refresh()

        if (cancelled) return

        if (
          response.status !== 'success' ||
          !response.data?.access_token ||
          !response.data?.user
        ) {
          return
        }

        const apiUser = response.data.user

        const user = {
          id: apiUser.id || apiUser.user_id,
          email: apiUser.email,
          displayName: apiUser.display_name,
          role: apiUser.role || 'user',
          avatarUrl: apiUser.avatar_url || null,
          linkedProviders: apiUser.linked_providers || [],
          hasLocalPassword: Boolean(apiUser.has_local_password),
          createdAt: apiUser.created_at,
          banned: false
        }

        setState((previous) => ({
          ...previous,
          users: [
            ...previous.users.filter((u) => u.id !== user.id),
            user
          ],
          libraries: previous.libraries[user.id]
            ? previous.libraries
            : {
                ...previous.libraries,
                [user.id]: emptyLibrary()
              },
          session: {
            source: 'backend',
            userId: user.id,
            token: response.data.access_token,
            expiresAt: new Date(
              Date.now() +
              (response.data.expires_in || 900) * 1000
            ).toISOString()
          }
        }))
      } catch {
        // No valid backend session, or backend unavailable.
        // Do not create a demo session as a fallback.
        if (!cancelled) {
          setState((previous) =>
            previous.session?.source === 'backend'
              ? { ...previous, session: null }
              : previous
          )
        }
      } finally {
        if (!cancelled) {
          setSessionRestoring(false)
        }
      }
    }

    restoreSession()

    return () => {
      cancelled = true
    }
  }, [])

  const toast = useCallback((message, tone = 'info') => {
    const id = uid('toast')
    setToasts((previous) => [...previous.slice(-2), { id, message, tone }])
    window.setTimeout(() => setToasts((previous) => previous.filter((item) => item.id !== id)), 3200)
  }, [])

  const sessionValid = state.session && new Date(state.session.expiresAt).getTime() > Date.now()
  const currentUser = sessionValid ? state.users.find((user) => user.id === state.session.userId && !user.banned) ?? null : null

  // Clear invalid sessions after restoration finishes.
  useEffect(() => {
    if (sessionRestoring) return

    if (state.session && !currentUser) {
      setState((previous) => {
        if (
          previous.session &&
          (
            new Date(previous.session.expiresAt).getTime() <= Date.now() ||
            !previous.users.some(
              (user) =>
                user.id === previous.session.userId &&
                !user.banned
            )
          )
        ) {
          return { ...previous, session: null }
        }

        return previous
      })
    }
  }, [sessionRestoring, state.session, currentUser])

  const library =
    (currentUser && state.libraries[currentUser.id]) ||
    emptyLibrary()

  const updateLibrary = useCallback((updater) => {
    setState((previous) => {
      const userId = previous.session?.userId
      if (!userId) return previous

      const current = previous.libraries[userId] ?? emptyLibrary()

      return {
        ...previous,
        libraries: {
          ...previous.libraries,
          [userId]: updater(current)
        }
      }
    })
  }, [])
  // ---------- Danh mục bài hát (gồm bài nghệ sĩ tải lên trong Studio) ----------
  const allTracks = useMemo(() => [...seedTracks, ...state.studioTracks], [state.studioTracks])
  const trackStatus = (trackId) => state.trackStatus[trackId] ?? 'active'
  const publicTracks = useMemo(() => allTracks.filter((track) => (state.trackStatus[track.id] ?? 'active') === 'active'), [allTracks, state.trackStatus])
  const findTrack = useCallback((id) => allTracks.find((track) => track.id === id) ?? null, [allTracks])
  const isPlayable = useCallback((trackId) => (state.trackStatus[trackId] ?? 'active') === 'active', [state.trackStatus])

  const userPlaylistsVisible = useMemo(() => {
    if (!currentUser) return []
    return Object.entries(state.libraries).flatMap(([ownerId, ownerLibrary]) => ownerLibrary.playlists
      .filter((playlist) => ownerId === currentUser.id || playlist.collaborators?.includes(currentUser.id))
      .map((playlist) => ({ ...playlist, ownerId })))
  }, [state.libraries, currentUser])

  const likedPlaylist = useMemo(() => currentUser ? ({
    id: LIKED_PLAYLIST_ID,
    title: 'Bài hát đã thích',
    description: 'Những bài hát bạn đã thả tim sẽ được lưu ở đây.',
    owner: currentUser.displayName,
    cover: 'violet',
    label: 'PLAYLIST',
    trackIds: [...library.likedIds].reverse(),
    isLiked: true,
  }) : null, [currentUser, library.likedIds])

  const getPlaylistTracks = useCallback((playlist) => (playlist?.trackIds ?? []).map(findTrack).filter((track) => track && isPlayable(track.id)), [findTrack, isPlayable])

  const describePlaylist = useCallback((playlist) => {
    if (!playlist) return null
    const playlistTracks = getPlaylistTracks(playlist)
    if (playlist.official || playlist.count) return playlist
    const seconds = playlistTracks.reduce((sum, track) => sum + getDurationSeconds(track.duration), 0)
    return { ...playlist, count: playlistTracks.length, duration: formatTotalDuration(seconds) }
  }, [getPlaylistTracks])

  const findPlaylistById = useCallback((id) => {
    if (id === LIKED_PLAYLIST_ID) return likedPlaylist ? describePlaylist(likedPlaylist) : null
    const playlist = officialPlaylists.find((item) => item.id === id) ?? userPlaylistsVisible.find((item) => item.id === id)
    return describePlaylist(playlist)
  }, [likedPlaylist, userPlaylistsVisible, describePlaylist])

  // ---------- Xác thực API / Backend (Spec 011, 012, 013) ----------
  const register = useCallback(async ({ email, password, displayName, termsAccepted = true }) => {
    const normalized = normalizeEmail(email)
    if (!EMAIL_PATTERN.test(normalized)) return { ok: false, field: 'email', error: 'Email không đúng định dạng.' }
    if (!isStrongPassword(password)) return { ok: false, field: 'password', error: 'Mật khẩu chưa đủ mạnh.' }
    if (!displayName?.trim()) return { ok: false, field: 'displayName', error: 'Vui lòng nhập tên hiển thị.' }

    try {
      const response = await authApi.register({ email: normalized, password, display_name: displayName.trim(), terms_accepted: termsAccepted })
      if (!response.success || !response.data?.user || !response.data?.session?.access_token) {
        return { ok: false, field: 'email', error: response.message || 'Đăng ký không thành công.' }
      }
      const apiUser = response.data.user
      const user = {
        id: apiUser.id || apiUser.user_id,
        email: apiUser.email,
        displayName: apiUser.display_name,
        role: apiUser.role || 'user',
        avatarUrl: apiUser.avatar_url,
        linkedProviders: apiUser.linked_providers || [],
        hasLocalPassword: Boolean(apiUser.has_local_password),
        createdAt: apiUser.created_at || new Date().toISOString(),
        banned: false,
      }
      setState((previous) => ({
        ...previous,
        users: [...previous.users.filter((item) => item.id !== user.id), user],
        libraries: previous.libraries[user.id] ? previous.libraries : { ...previous.libraries, [user.id]: emptyLibrary() },
        session: { source: 'backend', userId: user.id, token: response.data.session.access_token, expiresAt: new Date(Date.now() + (response.data.session.expires_in || 900) * 1000).toISOString() },
      }))
      return { ok: true, user }
    } catch (error) {
      return { ok: false, field: error.field, error: error.message || 'Không thể kết nối dịch vụ xác thực.' }
    }
  }, [])
  const login = useCallback(async ({ email, password, rememberMe = false }) => {
    const normalized = normalizeEmail(email)
    if (!EMAIL_PATTERN.test(normalized)) return { ok: false, error: 'Email không đúng định dạng.' }

    try {
      const response = await authApi.login({ email: normalized, password, remember_me: rememberMe })
      if (!response.success || !response.data?.user || !response.data?.session?.access_token) {
        return { ok: false, locked: response.remainingMinutes > 0, error: response.message || 'Email hoặc mật khẩu không chính xác.', remaining: response.remainingAttempts }
      }
      const apiUser = response.data.user
      const user = {
        id: apiUser.id || apiUser.user_id,
        email: apiUser.email,
        displayName: apiUser.display_name,
        role: apiUser.role || 'user',
        avatarUrl: apiUser.avatar_url,
        linkedProviders: apiUser.linked_providers || [],
        hasLocalPassword: Boolean(apiUser.has_local_password),
        createdAt: apiUser.created_at || new Date().toISOString(),
        banned: false,
      }
      setState((previous) => ({
        ...previous,
        users: [...previous.users.filter((item) => item.id !== user.id), user],
        libraries: previous.libraries[user.id] ? previous.libraries : { ...previous.libraries, [user.id]: emptyLibrary() },
        session: { source: 'backend', userId: user.id, token: response.data.session.access_token, expiresAt: new Date(Date.now() + (response.data.session.expires_in || 900) * 1000).toISOString() },
      }))
      return { ok: true, user }
    } catch (error) {
      return {
        ok: false,
        locked: error.status === 423,
        error: error.name === 'TypeError'
          ? 'Không thể kết nối tới máy chủ đăng nhập. Hãy kiểm tra backend rồi thử lại.'
          : error.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
      }
    }
  }, [])
  const logout = useCallback(async () => {
    await Promise.allSettled([authApi.logout(), logoutFirebase()])
    setState((previous) => ({ ...previous, session: null }))
    setUi({ playlistDialog: null, addToPlaylistTrack: null, queueOpen: false })
  }, [])

  const logoutFromAllDevices = useCallback(async () => {
    const token = stateRef.current.session?.token
    await Promise.allSettled([
      token ? authApi.logoutAll(token) : Promise.resolve(),
      logoutFirebase(),
    ])
    setState((previous) => ({ ...previous, session: null }))
    setUi({ playlistDialog: null, addToPlaylistTrack: null, queueOpen: false })
  }, [])

  const getActiveSessions = useCallback(async () => {
    try {
      const token = stateRef.current.session?.token
      if (token) {
        const res = await authApi.getSessions(token)
        if (res.status === 'success' && res.data) return res.data
      }
    } catch {
      return []
    }
    return []
  }, [])

  // Firebase Authentication -> AuraTune Session
  const loginWithFirebase = useCallback(
    async ({ firebaseUser, termsAccepted = false, displayName }) => {
      try {
        if (!firebaseUser) {
          return {
            ok: false,
            error: 'Firebase user is required.'
          }
        }

        const firebaseIdToken = await firebaseUser.getIdToken()

        const response = await authApi.firebaseExchange(
          firebaseIdToken,
          termsAccepted,
          displayName
        )

        if (!response.success || !response.data?.session?.access_token) {
          return {
            ok: false,
            code: response.code,
            error: response.message || 'Firebase login failed.'
          }
        }

        const apiUser = response.data.user

        const user = {
          id: apiUser.id || apiUser.user_id,
          email: apiUser.email,
          displayName: apiUser.display_name,
          role: apiUser.role || 'user',
          avatarUrl: apiUser.avatar_url || null,
          linkedProviders: apiUser.linked_providers || [],
          hasLocalPassword: Boolean(apiUser.has_local_password),
          createdAt: apiUser.created_at || new Date().toISOString(),
          banned: false
        }

        setState((previous) => ({
          ...previous,
          users: [
            ...previous.users.filter((u) => u.id !== user.id),
            user
          ],
          libraries: previous.libraries[user.id]
            ? previous.libraries
            : {
                ...previous.libraries,
                [user.id]: emptyLibrary()
              },
          session: {
            source: 'backend',
            userId: user.id,
            token: response.data.session.access_token,
            expiresAt: new Date(
              Date.now() +
                (response.data.session.expires_in || 900) * 1000
            ).toISOString()
          }
        }))

        return { ok: true, user }
      } catch (error) {
        return {
          ok: false,
          code: error.code || null,
          status: error.status || null,
          error: error.message || 'Firebase Authentication failed.'
        }
      }
    },
    []
  )

  const loginWithOAuth = useCallback(async () => ({
    ok: false,
    error: 'Unverified OAuth profile callbacks are not accepted. Use Google or Facebook sign-in from the authentication page.',
  }), [])

  const linkFacebook = useCallback(async (firebaseUser) => {
    const user = stateRef.current.users.find((item) => item.id === stateRef.current.session?.userId)
    const accessToken = stateRef.current.session?.token
    if (!user || !accessToken) return { ok: false, error: 'Please sign in to AuraTune before linking Facebook.' }
    if (!firebaseUser) return { ok: false, error: 'Facebook authentication did not return a user.' }

    try {
      const firebaseIdToken = await firebaseUser.getIdToken(true)
      const response = await authApi.linkFacebook(firebaseIdToken, accessToken)
      if (!response.success) return { ok: false, code: response.code || null, error: response.message || 'Could not link Facebook.' }

      setState((previous) => ({
        ...previous,
        users: previous.users.map((item) => item.id === user.id
          ? { ...item, linkedProviders: Array.from(new Set([...(item.linkedProviders || []), 'facebook'])) }
          : item),
      }))
      return { ok: true, message: response.message }
    } catch (error) {
      return { ok: false, code: error.code || null, status: error.status || null, error: error.message || 'Could not link Facebook.' }
    }
  }, [])

  const unlinkOAuthProvider = useCallback(async (provider) => {
    const user = currentUser
    if (!user) return { ok: false, error: 'Not signed in.' }

    try {
      const token = stateRef.current.session?.token
      if (!token) return { ok: false, error: 'Your session has expired. Sign in again.' }
      const response = await authApi.oauthUnlink(provider, token)
      if (!response.success) return { ok: false, error: response.message || 'Could not unlink this provider.' }

      setState((previous) => ({
        ...previous,
        users: previous.users.map((item) => item.id === user.id
          ? { ...item, linkedProviders: (item.linkedProviders || []).filter((itemProvider) => itemProvider !== provider) }
          : item),
      }))
      return { ok: true, message: response.message }
    } catch (error) {
      return { ok: false, error: error.message || 'Could not connect to the authentication service.' }
    }
  }, [currentUser])
  // ---------- Thư viện cá nhân ----------
  const isLiked = (trackId) => library.likedIds.includes(trackId)
  const toggleLike = useCallback((trackId) => {
    if (!stateRef.current.session) return false
    updateLibrary((current) => ({
      ...current,
      likedIds: current.likedIds.includes(trackId) ? current.likedIds.filter((id) => id !== trackId) : [...current.likedIds, trackId],
    }))
    return true
  }, [updateLibrary])

  const createPlaylist = useCallback(({ title, description = '', trackIds = [], cover = 'aurora', isCollaborative = false }) => {
    const id = uid('pl')
    updateLibrary((current) => ({
      ...current,
      playlists: [{ id, title: title.trim(), description: description.trim(), trackIds, cover, label: 'PLAYLIST CỦA BẠN', owner: currentUser?.displayName ?? 'Bạn', isCollaborative, collaborators: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...current.playlists],
    }))
    return id
  }, [updateLibrary, currentUser])

  // Playlist cộng tác có thể thuộc thư viện của người khác, nên cập nhật theo chủ sở hữu.
  const updateOwnedPlaylist = useCallback((playlistId, updater) => {
    setState((previous) => {
      const entry = Object.entries(previous.libraries).find(([, ownerLibrary]) => ownerLibrary.playlists.some((playlist) => playlist.id === playlistId))
      if (!entry) return previous
      const [ownerId, ownerLibrary] = entry
      const nextPlaylists = ownerLibrary.playlists.flatMap((playlist) => {
        if (playlist.id !== playlistId) return [playlist]
        const next = updater(playlist)
        return next ? [{ ...next, updatedAt: new Date().toISOString() }] : []
      })
      return { ...previous, libraries: { ...previous.libraries, [ownerId]: { ...ownerLibrary, playlists: nextPlaylists } } }
    })
  }, [])

  const updatePlaylist = useCallback((playlistId, patch) => updateOwnedPlaylist(playlistId, (playlist) => ({ ...playlist, ...patch })), [updateOwnedPlaylist])
  const deletePlaylist = useCallback((playlistId) => updateOwnedPlaylist(playlistId, () => null), [updateOwnedPlaylist])

  const addTrackToPlaylist = useCallback((playlistId, trackId) => {
    if (playlistId === LIKED_PLAYLIST_ID) {
      if (!stateRef.current.libraries[stateRef.current.session?.userId]?.likedIds.includes(trackId)) toggleLike(trackId)
      return true
    }
    const existing = Object.values(stateRef.current.libraries).flatMap((ownerLibrary) => ownerLibrary.playlists).find((playlist) => playlist.id === playlistId)
    if (!existing || existing.trackIds.includes(trackId)) return false
    updateOwnedPlaylist(playlistId, (playlist) => playlist.trackIds.includes(trackId) ? playlist : { ...playlist, trackIds: [...playlist.trackIds, trackId] })
    return true
  }, [updateOwnedPlaylist, toggleLike])

  const removeTrackFromPlaylist = useCallback((playlistId, trackId) => {
    if (playlistId === LIKED_PLAYLIST_ID) return toggleLike(trackId)
    updateOwnedPlaylist(playlistId, (playlist) => ({ ...playlist, trackIds: playlist.trackIds.filter((id) => id !== trackId) }))
    return true
  }, [updateOwnedPlaylist, toggleLike])

  const moveTrackInPlaylist = useCallback((playlistId, from, to) => updateOwnedPlaylist(playlistId, (playlist) => {
    const trackIds = [...playlist.trackIds]
    const [moved] = trackIds.splice(from, 1)
    trackIds.splice(to, 0, moved)
    return { ...playlist, trackIds }
  }), [updateOwnedPlaylist])

  const addCollaborator = useCallback((playlistId, email) => {
    const user = stateRef.current.users.find((item) => item.email === normalizeEmail(email))
    if (!user) return { ok: false, error: 'Không tìm thấy người dùng AuraTune với email này.' }
    if (user.id === stateRef.current.session?.userId) return { ok: false, error: 'Bạn đã là chủ sở hữu playlist này.' }
    updateOwnedPlaylist(playlistId, (playlist) => ({ ...playlist, isCollaborative: true, collaborators: [...new Set([...(playlist.collaborators ?? []), user.id])] }))
    return { ok: true, user }
  }, [updateOwnedPlaylist])

  const removeCollaborator = useCallback((playlistId, userId) => updateOwnedPlaylist(playlistId, (playlist) => ({ ...playlist, collaborators: (playlist.collaborators ?? []).filter((id) => id !== userId) })), [updateOwnedPlaylist])

  const toggleSaveAlbum = useCallback((albumId) => {
    if (!stateRef.current.session) return false
    updateLibrary((current) => ({ ...current, savedAlbumIds: current.savedAlbumIds.includes(albumId) ? current.savedAlbumIds.filter((id) => id !== albumId) : [albumId, ...current.savedAlbumIds] }))
    return true
  }, [updateLibrary])

  // ---------- Theo dõi nghệ sĩ (spec 092) ----------
  // Mô phỏng một lời gọi mạng để giao diện có trạng thái "đang cập nhật".
  const setFollow = useCallback((artistId, follow) => new Promise((resolve, reject) => {
    window.setTimeout(() => {
      const userId = stateRef.current.session?.userId
      if (!userId) { reject(new Error('Bạn cần đăng nhập để theo dõi nghệ sĩ.')); return }
      const artist = getArtist(artistId)
      if (!artist || (!artist.isPublic && follow)) { reject(new Error('Không tìm thấy nghệ sĩ.')); return }
      setState((previous) => {
        const current = previous.libraries[userId] ?? emptyLibrary()
        const exists = current.follows.some((item) => item.artistId === artistId)
        const follows = follow
          ? (exists ? current.follows : [...current.follows, { artistId, followedAt: new Date().toISOString() }])
          : current.follows.filter((item) => item.artistId !== artistId)
        return { ...previous, libraries: { ...previous.libraries, [userId]: { ...current, follows } } }
      })
      resolve(follow)
    }, 450)
  }), [])

  const isFollowing = (artistId) => library.follows.some((item) => item.artistId === artistId)

  // ---------- Lịch sử nghe (G07 / spec 101) ----------
  const recordPlay = useCallback((trackId) => {
    if (!stateRef.current.session) return null
    const id = uid('h')
    updateLibrary((current) => ({ ...current, history: [{ id, trackId, playedAt: new Date().toISOString(), listened: 0 }, ...current.history].slice(0, 500) }))
    return id
  }, [updateLibrary])

  const updateListened = useCallback((entryId, seconds) => {
    if (!entryId) return
    updateLibrary((current) => ({ ...current, history: current.history.map((entry) => entry.id === entryId ? { ...entry, listened: Math.max(entry.listened, Math.round(seconds)) } : entry) }))
  }, [updateLibrary])

  const clearHistory = useCallback(() => updateLibrary((current) => ({ ...current, history: [] })), [updateLibrary])

  // ---------- Bình luận ----------
  const addComment = useCallback((trackId, text) => {
    const user = stateRef.current.users.find((item) => item.id === stateRef.current.session?.userId)
    if (!user || !text.trim()) return false
    const comment = { id: uid('c'), trackId, userId: user.id, author: user.displayName, text: text.trim(), createdAt: new Date().toISOString() }
    setState((previous) => ({ ...previous, comments: { ...previous.comments, [trackId]: [...(previous.comments[trackId] ?? []), comment] } }))
    return true
  }, [])

  const deleteComment = useCallback((trackId, commentId) => setState((previous) => ({ ...previous, comments: { ...previous.comments, [trackId]: (previous.comments[trackId] ?? []).filter((comment) => comment.id !== commentId) } })), [])

  // ---------- Artist Studio ----------
  const uploadTrack = useCallback(({ title, albumTitle, genre, duration, fileName }) => {
    const user = stateRef.current.users.find((item) => item.id === stateRef.current.session?.userId)
    const artist = getArtist(user?.artistId)
    if (!artist) return null
    const track = {
      id: uid('st'), title: title.trim(), artist: artist.name, artistId: artist.id, album: albumTitle.trim() || 'Single', albumId: null,
      genre, duration, added: 'Vừa xong', cover: ['aurora', 'night', 'ocean', 'rose', 'sunset', 'forest', 'violet'][Math.floor(Math.random() * 7)],
      plays: '0', playCount: 0, releaseDate: new Date().toISOString().slice(0, 10), fileName, uploadedBy: user.id,
    }
    setState((previous) => ({ ...previous, studioTracks: [track, ...previous.studioTracks] }))
    return track
  }, [])

  const updateStudioTrack = useCallback((trackId, patch) => setState((previous) => ({ ...previous, studioTracks: previous.studioTracks.map((track) => track.id === trackId ? { ...track, ...patch } : track) })), [])
  const deleteStudioTrack = useCallback((trackId) => setState((previous) => ({
    ...previous,
    studioTracks: previous.studioTracks.filter((track) => track.id !== trackId),
    trackStatus: seedTracks.some((track) => track.id === trackId) ? { ...previous.trackStatus, [trackId]: 'removed' } : previous.trackStatus,
  })), [])

  const setTrackStatus = useCallback((trackId, status) => setState((previous) => ({ ...previous, trackStatus: { ...previous.trackStatus, [trackId]: status } })), [])

  // ---------- Quản trị ----------
  const setUserBanned = useCallback((userId, banned) => setState((previous) => ({ ...previous, users: previous.users.map((user) => user.id === userId ? { ...user, banned } : user) })), [])
  const setUserRole = useCallback((userId, role) => setState((previous) => ({ ...previous, users: previous.users.map((user) => user.id === userId ? { ...user, role, artistId: role === 'artist' ? (user.artistId ?? null) : user.artistId } : user) })), [])
  const setAiAvailable = useCallback((aiAvailable) => setState((previous) => ({ ...previous, aiAvailable })), [])
  const resetDemo = useCallback(() => setState(createInitialState()), [])

  // ---------- Hộp thoại dùng chung ----------
  const openCreatePlaylist = useCallback((initialTrackId = null) => setUi((previous) => ({ ...previous, playlistDialog: { mode: 'create', initialTrackId }, addToPlaylistTrack: null })), [])
  const openEditPlaylist = useCallback((playlist) => setUi((previous) => ({ ...previous, playlistDialog: { mode: 'edit', playlist } })), [])
  const closePlaylistDialog = useCallback(() => setUi((previous) => ({ ...previous, playlistDialog: null })), [])
  const openAddToPlaylist = useCallback((track) => setUi((previous) => ({ ...previous, addToPlaylistTrack: track })), [])
  const closeAddToPlaylist = useCallback(() => setUi((previous) => ({ ...previous, addToPlaylistTrack: null })), [])
  const setQueueOpen = useCallback((queueOpen) => setUi((previous) => ({ ...previous, queueOpen })), [])

  const value = {
    state, currentUser, library, toasts, ui, toast,
    artists, albums, allTracks, publicTracks, findTrack, isPlayable, trackStatus,
    likedPlaylist, userPlaylists: userPlaylistsVisible, findPlaylistById, getPlaylistTracks,
    register, login, loginWithFirebase, logout, logoutFromAllDevices, getActiveSessions, loginWithOAuth, linkFacebook, unlinkOAuthProvider,
    isLiked, toggleLike, createPlaylist, updatePlaylist, deletePlaylist, addTrackToPlaylist, removeTrackFromPlaylist, moveTrackInPlaylist, addCollaborator, removeCollaborator,
    toggleSaveAlbum, isAlbumSaved: (albumId) => library.savedAlbumIds.includes(albumId), getAlbum,
    setFollow, isFollowing,
    recordPlay, updateListened, clearHistory,
    comments: state.comments, addComment, deleteComment,
    uploadTrack, updateStudioTrack, deleteStudioTrack, setTrackStatus,
    setUserBanned, setUserRole, aiAvailable: state.aiAvailable, setAiAvailable, resetDemo,
    openCreatePlaylist, openEditPlaylist, closePlaylistDialog, openAddToPlaylist, closeAddToPlaylist, setQueueOpen,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore phải được dùng bên trong AppStoreProvider')
  return store
}
