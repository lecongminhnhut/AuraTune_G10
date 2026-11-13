import { useEffect, useMemo, useState } from 'react'
import { Bookmark, BookmarkCheck, Share2, Shuffle } from 'lucide-react'
import Icon from '../../components/common/Icon.jsx'
import CoverArt from '../../components/playlist/CoverArt.jsx'
import { AlbumCard } from '../../components/playlist/MediaCards.jsx'
import SongTable from '../../components/song/SongTable.jsx'
import { EmptyState, ErrorState, LoadingState, NotFound, SectionHeading } from '../../components/common/ui.jsx'
import { useStore } from '../../context/AppStore.jsx'
import { usePlayer } from '../../context/PlayerContext.jsx'
import { Link } from '../../utils/navigation.jsx'
import { copyLink, shareLink, shareMessage } from '../../utils/share.js'

const formatDuration = (seconds) => {
  const value = Math.max(0, Math.floor(seconds))
  const remainingSeconds = String(value % 60).padStart(2, '0')
  const totalMinutes = Math.floor(value / 60)
  if (totalMinutes < 60) return `${totalMinutes}:${remainingSeconds}`
  return `${Math.floor(totalMinutes / 60)}:${String(totalMinutes % 60).padStart(2, '0')}:${remainingSeconds}`
}

export default function AlbumPage({ albumId }) {
  const store = useStore()
  const player = usePlayer()
  const request = store.getAlbumDetailsStatus(albumId)
  const album = request.data
  const [relatedAlbums, setRelatedAlbums] = useState([])
  const [visibleTrackCount, setVisibleTrackCount] = useState(50)
  const [savePending, setSavePending] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [shareFeedback, setShareFeedback] = useState(null)

  useEffect(() => {
    store.loadAlbumDetails(albumId).catch(() => {})
  }, [albumId, store.loadAlbumDetails])

  useEffect(() => {
    if (!album?.artist?.id) {
      setRelatedAlbums([])
      return undefined
    }

    let cancelled = false
    store.loadArtistAlbums(album.artist.id)
      .then((items) => {
        if (cancelled) return
        setRelatedAlbums(items.filter((item) => item.id !== album.id && (!item.artistId && !item.artist || item.artistId === album.artist.id || item.artist?.id === album.artist.id)))
      })
      .catch(() => { if (!cancelled) setRelatedAlbums([]) })
    return () => { cancelled = true }
  }, [album?.artist?.id, album?.id, store.loadArtistAlbums])

  useEffect(() => {
    setVisibleTrackCount(50)
  }, [albumId])

  const albumTracks = useMemo(() => {
    if (!album) return []

    const detailTracks = album.tracks ?? []
    const detailOrder = new Map(detailTracks.map((track, index) => [track.id, index]))
    const detailById = new Map(detailTracks.map((track) => [track.id, track]))

    return store.allTracks
      .map((track, catalogIndex) => ({ track, catalogIndex }))
      .filter(({ track }) => track.albumId === album.id || detailOrder.has(track.id))
      .sort((left, right) => {
        const leftOrder = detailOrder.get(left.track.id) ?? Number.MAX_SAFE_INTEGER
        const rightOrder = detailOrder.get(right.track.id) ?? Number.MAX_SAFE_INTEGER
        if (leftOrder !== rightOrder) return leftOrder - rightOrder
        return (left.track.trackNumber ?? left.catalogIndex) - (right.track.trackNumber ?? right.catalogIndex)
      })
      .map(({ track }) => ({
        ...track,
        ...detailById.get(track.id),
        artist: album.artist?.name,
        artistId: album.artist?.id,
        album: album.title,
        albumId: album.id,
        coverArt: album.coverArt,
        isPlayable: store.isPlayable(track.id),
        trackStatus: store.trackStatus(track.id),
        unavailableReason: store.isPlayable(track.id) ? null : 'This track is currently unavailable.',
      }))
  }, [album, store.allTracks, store.isPlayable, store.trackStatus])

  const totalDuration = useMemo(() => {
    const knownDurations = albumTracks.filter((track) => Number.isFinite(track.duration) && track.duration >= 0)
    if (!knownDurations.length) return null
    return knownDurations.reduce((sum, track) => sum + track.duration, 0)
  }, [albumTracks])

  const visibleAlbumTracks = useMemo(() => albumTracks.slice(0, visibleTrackCount), [albumTracks, visibleTrackCount])
  const playableAlbumTracks = useMemo(() => albumTracks.filter((track) => store.isPlayable(track.id)), [albumTracks, store.isPlayable])
  const hasMoreTracks = visibleTrackCount < albumTracks.length
  const loadMoreTracks = () => {
    const nextTracks = albumTracks.slice(visibleTrackCount, visibleTrackCount + 50)
    player.addManyToQueue(nextTracks)
    setVisibleTrackCount((count) => Math.min(count + 50, albumTracks.length))
  }

  if (!album && request.status === 'loading') return <LoadingState />
  if (!album && request.error?.code === 'NOT_FOUND') return <NotFound title="Album not found" />
  if (!album && request.error) return <ErrorState title="Album details unavailable" description="A temporary service error occurred. Please try again." onRetry={() => store.loadAlbumDetails(albumId).catch(() => {})} />
  if (!album) return <LoadingState />

  const saved = store.isAlbumSaved(album.id)
  const toggleSave = async () => {
    if (!store.currentUser) {
      player.requireLogin('Sign in to save this album to your library.')
      return
    }
    if (savePending || store.savedAlbumsLoading) return

    setSavePending(true)
    setSaveError(null)
    const result = saved ? await store.removeSavedAlbum(album.id) : await store.saveAlbum(album.id)
    if (!result.ok) setSaveError(`${result.error} Please try again.`)
    else store.toast(saved ? 'Album removed from your library.' : 'Album saved to your library.')
    setSavePending(false)
  }

  const canonicalAlbumUrl = new URL(`/album/${encodeURIComponent(album.id)}`, window.location.origin).toString()
  const copyAlbumLink = async () => {
    const result = await copyLink(`/album/${encodeURIComponent(album.id)}`)
    if (result === 'copied') setShareFeedback({ tone: 'success', message: shareMessage(result) })
    else setShareFeedback({ tone: 'error', message: 'Could not copy the album link. Please try again.' })
  }
  const shareAlbum = async () => {
    const result = await shareLink(`/album/${encodeURIComponent(album.id)}`, `${album.title} · ${album.artist.name}`)
    if (result === 'cancelled') setShareFeedback({ tone: 'info', message: 'Sharing was cancelled.' })
    else if (result === 'failed') setShareFeedback({ tone: 'error', message: 'Could not share this album. Please try again.' })
    else setShareFeedback({ tone: 'success', message: shareMessage(result) })
  }
  const shareToSocial = (provider) => {
    if (provider === 'instagram') {
      copyAlbumLink().then(() => setShareFeedback({ tone: 'success', message: '\u0110\u00e3 sao ch\u00e9p li\u00ean k\u1ebft, h\u00e3y d\u00e1n v\u00e0o Instagram' }))
      return
    }
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalAlbumUrl)}`,
      x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(canonicalAlbumUrl)}`,
      zalo: `https://share.zalo.me/?url=${encodeURIComponent(canonicalAlbumUrl)}`,
    }
    const popup = window.open(shareUrls[provider], '_blank', 'noopener,noreferrer')
    setShareFeedback(popup ? { tone: 'success', message: `${provider} share window opened.` } : { tone: 'error', message: 'Could not open the share window. Please allow pop-ups and try again.' })
  }

  return (
    <div className="pb-12">
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-900/50 via-violet-950/20 to-transparent px-5 pb-7 pt-6 sm:px-8 sm:pb-9 sm:pt-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[100px]" />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:gap-7">
          <CoverArt coverArt={album.coverArt} title={album.title} showLabel className="h-48 w-48 shrink-0 rounded-xl shadow-2xl shadow-black/40 sm:h-56 sm:w-56" />
          <div className="min-w-0 pb-1">
            {albumTracks.length > 0 && <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-200">{albumTracks.length === 1 ? 'Single' : 'Album'}</p>}
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">{album.title || 'Untitled album'}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-300">
              <Link to={`/artist/${album.artist.id}`} className="font-semibold text-white hover:underline">{album.artist.name}</Link>
              {album.releaseYear != null && <><span className="text-zinc-600">·</span><span>{album.releaseYear}</span></>}
              <span className="text-zinc-600">·</span><span>{albumTracks.length} tracks</span>
              <span className="text-zinc-600">·</span><span>{totalDuration == null ? '—' : formatDuration(totalDuration)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8">
        {request.status === 'error' && <ErrorState compact title="Refresh failed" description="Showing the last loaded details. Try again to refresh." onRetry={() => store.loadAlbumDetails(albumId).catch(() => {})} />}
        <div className="flex flex-wrap items-center gap-3 py-5">
          <button onClick={() => player.playAlbum(albumTracks)} disabled={!playableAlbumTracks.length} aria-label="Play album" className="grid h-14 w-14 place-items-center rounded-full bg-violet-300 text-zinc-950 shadow-glow transition hover:scale-105 hover:bg-violet-200 disabled:opacity-40"><Icon name="play" size={23} /></button>
          <button onClick={() => player.playCollection(playableAlbumTracks, { shuffle: true })} disabled={!playableAlbumTracks.length} aria-label="Shuffle album" className="rounded-full p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:opacity-40"><Shuffle size={21} /></button>
          <button onClick={toggleSave} disabled={savePending || store.savedAlbumsLoading} aria-pressed={saved} className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${saved ? 'border-violet-300/40 bg-violet-300/10 text-violet-200' : 'border-white/20 text-zinc-300 hover:border-white/50 hover:text-white'}`}>{savePending ? 'Saving...' : saved ? <><BookmarkCheck size={15} />Saved</> : <><Bookmark size={15} />Save album</>}</button>
          <button onClick={shareAlbum} aria-label="Share album" className="rounded-full p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white"><Share2 size={19} /></button>
          <button onClick={copyAlbumLink} aria-label="Copy album link" className="rounded-full px-2 text-xs text-zinc-400 transition hover:text-white">Copy Link</button>
          <button onClick={() => shareToSocial('facebook')} aria-label="Share album on Facebook" className="rounded-full px-2 text-xs text-zinc-400 transition hover:text-white">Facebook</button>
          <button onClick={() => shareToSocial('instagram')} aria-label="Share album on Instagram" className="rounded-full px-2 text-xs text-zinc-400 transition hover:text-white">Instagram</button>
          <button onClick={() => shareToSocial('x')} aria-label="Share album on X" className="rounded-full px-2 text-xs text-zinc-400 transition hover:text-white">X</button>
          <button onClick={() => shareToSocial('zalo')} aria-label="Share album on Zalo" className="rounded-full px-2 text-xs text-zinc-400 transition hover:text-white">Zalo</button>
          <button onClick={() => player.addManyToQueue(playableAlbumTracks)} disabled={!playableAlbumTracks.length} className="ml-auto text-xs font-semibold text-zinc-400 transition hover:text-white disabled:opacity-40">Add all to queue</button>
        </div>
        {saveError && <p role="alert" className="mt-1 text-xs text-rose-300">{saveError}</p>}
        {shareFeedback && <p role="status" className={`mt-1 text-xs ${shareFeedback.tone === 'error' ? 'text-rose-300' : shareFeedback.tone === 'success' ? 'text-emerald-300' : 'text-zinc-300'}`}>{shareFeedback.message}</p>}

        {albumTracks.length ? <>
          <SongTable songs={visibleAlbumTracks} showPlays onPlayTrack={(track) => player.playSelectedTrack(track, albumTracks)} onDownloadTrack={player.downloadTrack} />
          {hasMoreTracks && <button type="button" onClick={loadMoreTracks} className="mx-auto mt-5 block rounded-full border border-white/15 px-5 py-2 text-xs font-semibold text-zinc-300 transition hover:border-violet-300/50 hover:text-white">Load More</button>}
        </> : <EmptyState title="No tracks available" description="This album does not have any playable tracks." />}
        <p className="mt-7 text-xs text-zinc-500">{album.releaseYear ?? 'Release year unavailable'} · © {album.artist.name}</p>

        {relatedAlbums.length > 0 && <section className="mt-10"><SectionHeading title={`More from ${album.artist.name}`} /><div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{relatedAlbums.map((item) => <AlbumCard key={item.id} album={{ ...item, coverArt: item.coverArt ?? item.cover_art, releaseDate: item.releaseDate ?? (item.releaseYear ? String(item.releaseYear) : undefined) }} artistName={album.artist.name} />)}</div></section>}
      </section>
    </div>
  )
}
