import { useEffect, useMemo, useRef, useState } from 'react'
import { featuredTrack, tracks } from '../utils/mockData.js'
import { getDurationSeconds, pickAdjacentTrack, playThresholdSeconds } from '../utils/playback.js'
import { browserStorage, loadPlayerSnapshot, savePlayerSnapshot } from '../utils/playerStorage.js'
import { trackAudioUrl } from '../services/songApi.js'

// Trình phát nhạc dùng chung (Group 040) phát âm thanh thật qua phần tử <audio>.
// Giữ nguyên giao diện của useMockPlayer cũ để mọi trang dùng PlayerContext không phải sửa,
// đồng thời bổ sung: duration, status, error, retry, playFrom, listened, playCounted.
//
// Nguyên tắc: state React là ý định của người nghe (bài nào, đang phát hay dừng, vị trí);
// mỗi thao tác tính state mới rồi `commit` đồng bộ phần tử <audio> theo state đó.
// Mỗi lần một bài bắt đầu phát từ đầu, playKey tăng lên để tạo một phiên nghe mới.

const libraryQueue = [featuredTrack, ...tracks.filter((track) => track.id !== featuredTrack.id)]
const defaultFindTrack = (id) => tracks.find((track) => track.id === id)
const sessionKey = (state) => `${state.track.id}#${state.playKey}`
const upcomingOf = (state) => state.queue.slice(state.queue.findIndex((track) => track.id === state.track.id) + 1)
const clampVolume = (value) => Math.max(0, Math.min(100, Math.round(Number(value) || 0)))

const ERROR_MESSAGES = {
  1: 'Đã dừng tải bài hát.',
  2: 'Mất kết nối mạng.',
  3: 'Tệp âm thanh bị lỗi.',
  4: 'Không tải được bài hát.',
}

function initialState(options) {
  return {
    track: featuredTrack, queue: libraryQueue, playlistId: null, elapsed: 0,
    shuffle: false, repeatMode: 'off', pinnedNextIds: [],
    ...loadPlayerSnapshot(browserStorage(), options),
    isPlaying: false, playKey: 0,
  }
}

// Bắt đầu một bài từ đầu, giữ nguyên trạng thái phát/dừng trừ khi được ghi đè.
const startTrack = (state, track, overrides = {}) => ({
  ...state, track, elapsed: 0, playKey: state.playKey + 1,
  pinnedNextIds: state.pinnedNextIds.filter((id) => id !== track.id),
  ...overrides,
})

function createEngine({ refs, setState, setStatus, setError, setListen, setMediaDuration }) {
  const { stateRef, optionsRef, durationRef, listenRef, loadedKeyRef, loadedTrackRef, pendingSeekRef, ignorePauseUntilRef } = refs
  const audio = typeof Audio === 'undefined' ? null : new Audio()
  if (audio) audio.preload = 'metadata'

  const resetListen = (state) => {
    listenRef.current = { key: sessionKey(state), seconds: 0, reported: 0, last: state.elapsed, counted: false }
    setListen({ seconds: 0, counted: false })
  }

  const applySeek = (seconds) => {
    listenRef.current.last = seconds
    if (audio.readyState > 0) audio.currentTime = seconds
    else pendingSeekRef.current = seconds
  }

  // Nạp nguồn âm thanh cho phiên nghe hiện tại (chỉ khi cần phát, tránh tải trước lúc mở trang).
  const loadSource = (state) => {
    const key = sessionKey(state)
    if (loadedKeyRef.current === key && !audio.error) return
    const url = new URL(trackAudioUrl(state.track), window.location.href).href
    if (loadedTrackRef.current === state.track.id && audio.src === url && !audio.error) {
      applySeek(state.elapsed) // phát lại cùng bài: lặp một bài, bấm Trước sau 3 giây, phát lại khi đã hết
    } else {
      pendingSeekRef.current = state.elapsed > 0 ? state.elapsed : null
      ignorePauseUntilRef.current = performance.now() + 1000
      audio.src = url
      setError(null)
      setStatus('loading')
    }
    loadedKeyRef.current = key
    loadedTrackRef.current = state.track.id
  }

  const commit = (next, { seekTo = null } = {}) => {
    const previous = stateRef.current
    stateRef.current = next
    setState(next)
    const keyChanged = sessionKey(previous) !== sessionKey(next)
    if (keyChanged) {
      resetListen(next)
      setError(null)
      setStatus('idle')
    }
    if (!audio) return

    if (next.isPlaying) {
      loadSource(next)
      if (seekTo !== null) applySeek(seekTo)
      if (audio.paused) {
        audio.play()?.catch((reason) => {
          if (reason?.name === 'NotAllowedError') commit({ ...stateRef.current, isPlaying: false })
          // AbortError: nguồn vừa đổi; NotSupportedError: sự kiện 'error' sẽ báo cho người nghe.
        })
      }
    } else {
      if (!audio.paused) audio.pause()
      if (seekTo !== null && loadedKeyRef.current === sessionKey(next)) applySeek(seekTo)
    }
  }

  const stopAtEnd = (state) => commit({ ...state, isPlaying: false, elapsed: durationRef.current })

  const actions = {
    togglePlayback() {
      const state = stateRef.current
      if (state.isPlaying) return commit({ ...state, isPlaying: false })
      if (state.elapsed >= durationRef.current - 0.5) return commit({ ...state, elapsed: 0, isPlaying: true, playKey: state.playKey + 1 })
      return commit({ ...state, isPlaying: true })
    },

    // 041-FR-009: thử tải lại bài đang lỗi từ vị trí đang dừng.
    retry() {
      loadedKeyRef.current = null
      commit({ ...stateRef.current, isPlaying: true })
    },

    // 042-FR-003/004: tua trong khoảng [0, thời lượng].
    seek(seconds) {
      const target = Math.max(0, Math.min(durationRef.current, Number(seconds) || 0))
      commit({ ...stateRef.current, elapsed: target }, { seekTo: target })
    },

    // 044-FR-012: chạm vào một dòng lời để tua tới đó và tiếp tục phát.
    playFrom(seconds) {
      const target = Math.max(0, Math.min(durationRef.current, Number(seconds) || 0))
      commit({ ...stateRef.current, elapsed: target, isPlaying: true }, { seekTo: target })
    },

    nextTrack() {
      const state = stateRef.current
      const next = pickAdjacentTrack(state, 1, optionsRef.current)
      return next ? commit(startTrack(state, next)) : stopAtEnd(state)
    },

    previousTrack() {
      const state = stateRef.current
      if (state.elapsed > 3) return commit({ ...state, elapsed: 0, playKey: state.playKey + 1 })
      const previous = pickAdjacentTrack(state, -1, optionsRef.current)
      return commit(previous ? startTrack(state, previous) : { ...state, elapsed: 0, playKey: state.playKey + 1 })
    },

    toggleShuffle() {
      const state = stateRef.current
      commit({ ...state, shuffle: !state.shuffle })
    },

    cycleRepeat() {
      const state = stateRef.current
      commit({ ...state, repeatMode: { off: 'all', all: 'one', one: 'off' }[state.repeatMode] })
    },

    playTrack(track, { queue, playlistId = null } = {}) {
      const state = stateRef.current
      const baseQueue = queue?.length ? queue : (state.queue.some((item) => item.id === track.id) ? state.queue : libraryQueue)
      const nextQueue = baseQueue.some((item) => item.id === track.id) ? baseQueue : [track, ...baseQueue]
      const pinned = queue?.length ? [] : state.pinnedNextIds.filter((id) => nextQueue.some((item) => item.id === id))
      commit(startTrack({ ...state, pinnedNextIds: pinned }, track, { isPlaying: true, playlistId, queue: nextQueue }))
    },

    // 043-FR-012: bắt đầu một danh sách ở chế độ ngẫu nhiên mà không xáo thứ tự hiển thị (043-FR-003).
    playCollection(collectionTracks, { playlistId = null, shuffle = false } = {}) {
      if (!collectionTracks.length) return
      const state = stateRef.current
      const first = shuffle ? collectionTracks[Math.floor(Math.random() * collectionTracks.length)] : collectionTracks[0]
      commit(startTrack(state, first, { isPlaying: true, playlistId, queue: collectionTracks, shuffle: shuffle || state.shuffle, pinnedNextIds: [] }))
    },

    // ---------- Hàng chờ (Group 050) ----------
    // Trả về false nếu bài đang phát hoặc đã nằm trong phần "tiếp theo".
    addToQueue(track) {
      const state = stateRef.current
      if (track.id === state.track.id || upcomingOf(state).some((item) => item.id === track.id)) return false
      commit({ ...state, queue: [...state.queue.filter((item) => item.id !== track.id), track] })
      return true
    },

    addManyToQueue(items) {
      const state = stateRef.current
      const upcoming = upcomingOf(state)
      const fresh = items.filter((track) => track.id !== state.track.id && !upcoming.some((item) => item.id === track.id))
      if (!fresh.length) return 0
      const ids = new Set(fresh.map((track) => track.id))
      commit({ ...state, queue: [...state.queue.filter((item) => !ids.has(item.id)), ...fresh] })
      return fresh.length
    },

    playNext(track) {
      const state = stateRef.current
      if (track.id === state.track.id) return false
      const rest = state.queue.filter((item) => item.id !== track.id)
      rest.splice(rest.findIndex((item) => item.id === state.track.id) + 1, 0, track)
      commit({ ...state, queue: rest, pinnedNextIds: [track.id, ...state.pinnedNextIds.filter((id) => id !== track.id)] })
      return true
    },

    removeFromQueue(trackId) {
      const state = stateRef.current
      if (trackId === state.track.id) return
      commit({ ...state, queue: state.queue.filter((item) => item.id !== trackId), pinnedNextIds: state.pinnedNextIds.filter((id) => id !== trackId) })
    },

    // from/to là vị trí trong phần "tiếp theo" (không tính bài đang phát).
    moveInQueue(from, to) {
      const state = stateRef.current
      const index = state.queue.findIndex((item) => item.id === state.track.id)
      const head = state.queue.slice(0, index + 1)
      const next = state.queue.slice(index + 1)
      if (from < 0 || from >= next.length || to < 0 || to >= next.length) return
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      commit({ ...state, queue: [...head, ...next] })
    },

    clearUpcoming() {
      const state = stateRef.current
      commit({ ...state, queue: state.queue.slice(0, state.queue.findIndex((item) => item.id === state.track.id) + 1), pinnedNextIds: [] })
    },

    playFromQueue(trackId) {
      const state = stateRef.current
      const track = state.queue.find((item) => item.id === trackId)
      if (track) commit(startTrack(state, track, { isPlaying: true }))
    },
  }

  // ---------- Sự kiện của phần tử <audio> ----------
  const handlers = {
    timeupdate() {
      if (pendingSeekRef.current !== null) return // đang chờ tua tới vị trí khôi phục, bỏ qua mốc 0 tạm thời
      const time = audio.currentTime
      const session = listenRef.current
      if (session.key === loadedKeyRef.current) {
        // Chỉ cộng thời gian phát liên tục: tua tới không được tính, tạm dừng giữ nguyên số đã nghe.
        const delta = time - session.last
        if (!audio.seeking && delta > 0 && delta < 2) session.seconds += delta
        session.last = time
        const counted = session.counted || session.seconds >= playThresholdSeconds(durationRef.current)
        if (counted !== session.counted || Math.floor(session.seconds) !== session.reported) {
          session.counted = counted
          session.reported = Math.floor(session.seconds)
          setListen({ seconds: session.reported, counted })
        }
      }
      const current = stateRef.current
      if (loadedKeyRef.current === sessionKey(current) && Math.floor(time) !== Math.floor(current.elapsed)) {
        stateRef.current = { ...current, elapsed: time }
        setState(stateRef.current)
      }
    },
    durationchange() {
      if (Number.isFinite(audio.duration) && audio.duration > 0) setMediaDuration({ trackId: loadedTrackRef.current, seconds: audio.duration })
    },
    loadedmetadata() {
      handlers.durationchange()
      if (pendingSeekRef.current === null) return
      const target = Math.min(pendingSeekRef.current, Math.max(0, audio.duration - 0.5))
      pendingSeekRef.current = null
      listenRef.current.last = target
      audio.currentTime = target
    },
    waiting: () => setStatus('buffering'),
    seeking() {
      listenRef.current.last = audio.currentTime
      window.setTimeout(() => { if (audio.seeking) setStatus('buffering') }, 150)
    },
    seeked: () => setStatus((status) => (status === 'buffering' ? 'ready' : status)),
    canplay: () => setStatus((status) => (status === 'error' ? status : 'ready')),
    playing: () => setStatus('ready'),
    ended() {
      const state = stateRef.current
      // 043-FR-009: lặp một bài được ưu tiên hơn ngẫu nhiên khi bài kết thúc.
      if (state.repeatMode === 'one') return commit({ ...state, elapsed: 0, isPlaying: true, playKey: state.playKey + 1 })
      const next = pickAdjacentTrack(state, 1, optionsRef.current)
      return next ? commit(startTrack(state, next, { isPlaying: true })) : stopAtEnd(state)
    },
    error() {
      if (!audio.getAttribute('src')) return
      loadedKeyRef.current = null
      setError(ERROR_MESSAGES[audio.error?.code] ?? ERROR_MESSAGES[4])
      setStatus('error')
      if (stateRef.current.isPlaying) commit({ ...stateRef.current, isPlaying: false })
    },
    // Đồng bộ khi trình duyệt/hệ điều hành tự tạm dừng hoặc phát (tai nghe, phím media...).
    pause() {
      if (audio.ended || performance.now() < ignorePauseUntilRef.current) return
      if (stateRef.current.isPlaying) commit({ ...stateRef.current, isPlaying: false })
    },
    play() {
      const current = stateRef.current
      if (!current.isPlaying && loadedKeyRef.current === sessionKey(current)) commit({ ...current, isPlaying: true })
    },
  }

  return { audio, actions, handlers }
}

export default function useAudioPlayer({ findTrack, isPlayable } = {}) {
  const options = { findTrack: findTrack ?? defaultFindTrack, isPlayable: isPlayable ?? (() => true) }
  const [state, setState] = useState(() => initialState(options))
  const [status, setStatus] = useState('idle') // idle | loading | buffering | ready | error
  const [error, setError] = useState(null)
  const [listen, setListen] = useState({ seconds: 0, counted: false })
  const [mediaDuration, setMediaDuration] = useState({ trackId: null, seconds: 0 })
  const [volume, setVolumeState] = useState(68)
  const [muted, setMuted] = useState(false)

  const duration = mediaDuration.trackId === state.track.id ? mediaDuration.seconds : getDurationSeconds(state.track.duration)

  const refs = {
    stateRef: useRef(state),
    optionsRef: useRef(options),
    durationRef: useRef(duration),
    listenRef: useRef({ key: sessionKey(state), seconds: 0, reported: 0, last: state.elapsed, counted: false }),
    loadedKeyRef: useRef(null),
    loadedTrackRef: useRef(null),
    pendingSeekRef: useRef(null),
    ignorePauseUntilRef: useRef(0),
  }
  refs.optionsRef.current = options
  refs.durationRef.current = duration

  const [engine] = useState(() => createEngine({ refs, setState, setStatus, setError, setListen, setMediaDuration }))
  const { audio, actions, handlers } = engine

  useEffect(() => {
    if (!audio) return undefined
    Object.entries(handlers).forEach(([event, handler]) => audio.addEventListener(event, handler))
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => audio.removeEventListener(event, handler))
      audio.pause()
    }
  }, [audio, handlers])

  // 042-FR-006..010: âm lượng 0–100, tắt tiếng giữ nguyên mức cũ, giữ qua các bài.
  useEffect(() => {
    if (!audio) return
    audio.volume = volume / 100
    audio.muted = muted
  }, [audio, volume, muted])

  // 045-FR-012: lưu bài, hàng chờ và vị trí (làm tròn 5 giây) để khôi phục sau khi tải lại trang.
  const elapsedBucket = Math.floor(state.elapsed / 5)
  useEffect(() => {
    savePlayerSnapshot(browserStorage(), refs.stateRef.current)
  }, [state.track, state.queue, state.playlistId, state.shuffle, state.repeatMode, state.pinnedNextIds, elapsedBucket])

  useEffect(() => {
    const save = () => savePlayerSnapshot(browserStorage(), refs.stateRef.current)
    window.addEventListener('pagehide', save)
    return () => window.removeEventListener('pagehide', save)
  }, [])

  // Phím media và điều khiển trên màn hình khóa của hệ điều hành.
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.mediaSession || typeof window.MediaMetadata !== 'function') return
    const { track } = state
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: track.title, artist: track.artist, album: track.album ?? '',
      artwork: track.artwork ? [{ src: track.artwork }] : [],
    })
  }, [state.track])

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaSession) navigator.mediaSession.playbackState = state.isPlaying ? 'playing' : 'paused'
  }, [state.isPlaying])

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.mediaSession) return undefined
    const session = navigator.mediaSession
    const bindings = {
      play: () => { if (!refs.stateRef.current.isPlaying) actions.togglePlayback() },
      pause: () => { if (refs.stateRef.current.isPlaying) actions.togglePlayback() },
      previoustrack: actions.previousTrack,
      nexttrack: actions.nextTrack,
      seekto: (details) => actions.seek(details.seekTime),
    }
    Object.entries(bindings).forEach(([action, handler]) => { try { session.setActionHandler(action, handler) } catch { /* không hỗ trợ */ } })
    return () => Object.keys(bindings).forEach((action) => { try { session.setActionHandler(action, null) } catch { /* không hỗ trợ */ } })
  }, [actions])

  const upcoming = useMemo(() => upcomingOf(state), [state])

  const setVolume = (value) => {
    setVolumeState(clampVolume(value))
    setMuted(false) // 042-FR-009: kéo thanh âm lượng thì bỏ tắt tiếng
  }

  return {
    ...state,
    duration,
    status,
    error,
    isBuffering: status === 'buffering' || (state.isPlaying && status === 'loading'),
    listened: listen.seconds,
    playCounted: listen.counted,
    upcoming,
    volume,
    setVolume,
    muted,
    setMuted,
    ...actions,
  }
}
