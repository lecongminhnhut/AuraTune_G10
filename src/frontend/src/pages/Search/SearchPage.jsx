import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, SearchX } from 'lucide-react'
import PlaylistCard from '../../components/playlist/PlaylistCard.jsx'
import { AlbumCard, ArtistCard } from '../../components/playlist/MediaCards.jsx'
import SongRow from '../../components/song/SongRow.jsx'
import { EmptyState, PageHeader, SectionHeading, chipClass } from '../../components/common/ui.jsx'
import { useStore } from '../../context/AppStore.jsx'
import { usePlayer } from '../../context/PlayerContext.jsx'
import { getQueryParam, navigate, useLocation } from '../../utils/navigation.jsx'
import { addSearchHistory, clearSearchHistory, getSearchHistory, removeSearchHistory } from '../../utils/searchHistory.js'
import useMetadataSearch from './useMetadataSearch.js'
import useLyricsSearch from './useLyricsSearch.js'
import useSemanticSearch from '../../hooks/useSemanticSearch.js'
import { validateSemanticQuery } from '../../utils/semanticQuery.js'

const tabs = [{ id: 'all', label: 'All' }, { id: 'tracks', label: 'Tracks' }, { id: 'artists', label: 'Artists' }, { id: 'albums', label: 'Albums' }, { id: 'playlists', label: 'Playlists' }, { id: 'lyrics', label: 'AI Lyrics' }]
const grid = 'mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

export default function SearchPage() {
  const store = useStore(); const player = usePlayer(); const { search } = useLocation()
  const query = getQueryParam(search, 'q'); const tab = getQueryParam(search, 'type') || 'all'; const semanticMode = getQueryParam(search, 'mode') === 'semantic'
  const [draft, setDraft] = useState(query); const [history, setHistory] = useState(() => getSearchHistory()); const [focused, setFocused] = useState(false)
  const [constraints, setConstraints] = useState({ genre: getQueryParam(search, 'genre'), release_year: getQueryParam(search, 'release_year'), sort: getQueryParam(search, 'sort') || 'relevance' })
  useEffect(() => setDraft(query), [query])
  useEffect(() => setConstraints({ genre: getQueryParam(search, 'genre'), release_year: getQueryParam(search, 'release_year'), sort: getQueryParam(search, 'sort') || 'relevance' }), [search])
  const effectiveType = tab === 'lyrics' ? 'all' : tab
  const metadataState = useMetadataSearch(semanticMode ? '' : query, effectiveType, constraints)
  const lyricsState = useLyricsSearch(!semanticMode && tab === 'lyrics' ? query : '')
  const semanticState = useSemanticSearch(query, semanticMode)
  const setParam = (next) => { const params = new URLSearchParams(search); if (Object.prototype.hasOwnProperty.call(next, 'type') && !Object.prototype.hasOwnProperty.call(next, 'mode')) params.delete('mode'); Object.entries(next).forEach(([key, value]) => value ? params.set(key, value) : params.delete(key)); navigate(`/search?${params.toString()}`, { replace: true }) }
  const submit = (event) => { event.preventDefault(); const value = draft.trim(); const valid = semanticMode ? !validateSemanticQuery(value).error : tab === 'lyrics' ? value.replace(/\s+/g, ' ').trim().length <= 200 && value.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length >= 3 : value.length >= 2 && value.length <= 100; if (valid) { setHistory(addSearchHistory(value)); setParam({ q: value, mode: semanticMode ? 'semantic' : '' }) } }
  const playAlbum = (album) => player.playCollection(store.publicTracks.filter((track) => track.albumId === album.id))
  const show = (id) => tab === 'all' || tab === id
  const total = Object.values(metadataState.results).reduce((sum, items) => sum + items.length, 0)
  const tracks = useMemo(() => metadataState.results.tracks.map((item) => ({ ...item, duration: item.duration_seconds, playCount: item.play_count, artistId: item.artist_id, albumId: item.album_id, coverArt: item.cover_url })), [metadataState.results.tracks])
  const visibleFilters = tab === 'all' || tab === 'tracks' || tab === 'albums'
  return <div className="pb-12"><PageHeader eyebrow="Search" title={query ? `Results for “${query}”` : 'Search'} description={semanticMode ? 'Discover songs by mood, emotion, or context.' : tab === 'lyrics' ? 'Find songs from remembered lyric fragments.' : 'Search public tracks, artists, albums, and playlists.'} /><div className="px-5 sm:px-8">
    <form onSubmit={submit} className="relative flex gap-2"><input type="search" value={draft} onChange={(event) => setDraft(event.target.value)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)} placeholder={semanticMode ? 'Describe a mood or context' : tab === 'lyrics' ? 'Search lyrics (at least 3 words)' : 'Search metadata'} aria-label="Search query" className="h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-base text-white outline-none focus:border-sky-300/40" /><button type="submit" className="rounded-xl bg-sky-200 px-4 text-xs font-bold text-slate-950">Search</button>{focused && history.length > 0 && <div className="absolute top-12 z-20 w-full rounded-xl border border-white/10 bg-zinc-900 p-2 shadow-xl">{history.map((item) => <div key={item} className="flex items-center gap-2 px-2 py-1"><button type="button" className="min-w-0 flex-1 truncate text-left text-sm text-white" onMouseDown={() => { setDraft(item); setHistory(addSearchHistory(item)); setParam({ q: item, mode: semanticMode ? 'semantic' : '' }) }}>{item}</button><button type="button" className="text-xs text-zinc-400" onMouseDown={() => setHistory(removeSearchHistory(item))}>Remove</button></div>)}<button type="button" className="mt-1 w-full border-t border-white/10 pt-2 text-xs text-zinc-400" onMouseDown={() => setHistory(clearSearchHistory())}>Clear all</button></div>}</form>
    {!query ? <div className="mt-8"><EmptyState icon={SearchX} title={semanticMode ? 'Describe a mood or context' : tab === 'lyrics' ? 'Enter at least 3 words' : 'Enter at least 2 characters'} description={semanticMode ? 'Try a natural-language description such as music for a rainy night.' : tab === 'lyrics' ? 'Search the catalog by a remembered lyric fragment.' : 'Search the public catalog by metadata.'} /></div> : <>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><div className="flex gap-2 overflow-x-auto pb-1" role="tablist">{tabs.map((item) => <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} onClick={() => setParam({ type: item.id === 'all' ? '' : item.id })} className={chipClass(tab === item.id)}>{item.label}</button>)}</div>{visibleFilters && <div className="flex flex-wrap gap-2"><input aria-label="Genre filter" value={constraints.genre} onChange={(event) => setParam({ genre: event.target.value })} placeholder="Genre" className="w-24 rounded-lg border border-white/10 bg-zinc-900 px-2 py-1.5 text-xs text-white" /><input aria-label="Release year filter" value={constraints.release_year} onChange={(event) => setParam({ release_year: event.target.value })} placeholder="Year" className="w-20 rounded-lg border border-white/10 bg-zinc-900 px-2 py-1.5 text-xs text-white" /><select aria-label="Sort results" value={constraints.sort} onChange={(event) => setParam({ sort: event.target.value })} className="rounded-lg border border-white/10 bg-zinc-900 px-2 py-1.5 text-xs text-white"><option value="relevance">Relevance</option><option value="plays">Most played</option><option value="newest">Newest</option><option value="title">Title</option></select></div>}</div>
      {semanticMode ? <SemanticResults state={semanticState} onPlay={(track) => player.playTrack(track, semanticState.results)} /> : tab === 'lyrics' ? <LyricsResults state={lyricsState} onPlay={(track) => player.playTrack(track, lyricsState.results)} /> : metadataState.loading && total === 0 ? <p role="status" className="mt-8 text-sm text-zinc-400">Loading results…</p> : metadataState.error ? <ErrorState error={metadataState.error} retry={metadataState.retry} /> : total === 0 ? <div className="mt-8"><EmptyState icon={SearchX} title={`No results for “${query}”`} description="Try another title, artist, album, or playlist." /></div> : <>
        {show('tracks') && tracks.length > 0 && <section className="mt-8"><SectionHeading title="Tracks" /><div className="mt-3 rounded-xl bg-white/[0.025] p-1 sm:p-2">{tracks.map((track, index) => <SongRow key={track.id} track={track} index={index} showPlays onPlay={(item) => player.playTrack(item, tracks)} />)}</div></section>}
        {show('artists') && metadataState.results.artists.length > 0 && <section className="mt-8"><SectionHeading title="Artists" /><div className={grid}>{metadataState.results.artists.map((artist) => <ArtistCard key={artist.id} artist={{ ...artist, cover: artist.avatar_url }} />)}</div></section>}
        {show('albums') && metadataState.results.albums.length > 0 && <section className="mt-8"><SectionHeading title="Albums" /><div className={grid}>{metadataState.results.albums.map((album) => <AlbumCard key={album.id} album={{ ...album, artistId: album.artist_id, releaseDate: album.release_date, coverArt: album.cover_url }} artistName={album.artist} onPlay={playAlbum} />)}</div></section>}
        {show('playlists') && metadataState.results.playlists.length > 0 && <section className="mt-8"><SectionHeading title="Playlists" /><div className={grid}>{metadataState.results.playlists.map((playlist) => <PlaylistCard key={playlist.id} playlist={{ ...playlist, cover: 'aurora', count: playlist.track_count }} onPlayPlaylist={() => player.playPlaylist(playlist)} />)}</div></section>}
        {metadataState.pagination.has_more && <button type="button" onClick={metadataState.loadMore} disabled={metadataState.loading} className="mx-auto mt-8 block rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{metadataState.loading ? 'Loading…' : 'Load More'}</button>}
      </>}
    </>}
  </div></div>
}

function ErrorState({ error, retry }) { return <div className="mt-8 rounded-xl border border-red-300/20 bg-red-300/[0.06] p-4"><p className="flex items-center gap-2 text-sm text-red-100"><AlertTriangle size={16} />{error.message || String(error)}</p><button type="button" onClick={retry} className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-xs text-white">Retry</button></div> }

function LyricsResults({ state, onPlay }) {
  if (state.validationError) return <p role="alert" className="mt-8 text-sm text-amber-200">{state.validationError}</p>
  if (state.loading && state.results.length === 0) return <p role="status" className="mt-8 text-sm text-zinc-400">Searching lyrics…</p>
  if (state.error) return <ErrorState error={state.error} retry={state.retry} />
  return <>
    {state.searchMode === 'keyword_fallback' && !state.bannerDismissed && <div role="status" className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-amber-200/20 bg-amber-200/[0.08] p-3 text-sm text-amber-100"><span>AI search was unavailable. Keyword lyrics search was used.</span><button type="button" onClick={state.dismissBanner} aria-label="Dismiss fallback notice" className="text-xs text-amber-200 underline">Dismiss</button></div>}
    {state.results.length === 0 ? <div className="mt-8"><EmptyState icon={SearchX} title="No lyric matches" description="Try another lyric fragment with at least three words." /></div> : <section className="mt-8"><SectionHeading title="Lyrics matches" /><div className="mt-3 rounded-xl bg-white/[0.025] p-1 sm:p-2">{state.results.map((track, index) => <div key={`${track.id}-${index}`}><SongRow track={track} index={index} showPlays onPlay={onPlay} /><p className="ml-14 -mt-1 mb-2 pr-3 text-xs italic text-zinc-500">{track.matched_lyric || 'Lyric context unavailable.'}</p></div>)}</div></section>}
    {state.pagination.has_more && <button type="button" onClick={state.loadMore} disabled={state.loading} className="mx-auto mt-8 block rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{state.loading ? 'Loading…' : 'Load More'}</button>}
  </>
}

function SemanticResults({ state, onPlay }) {
  if (state.validationError) return <p role="alert" className="mt-8 text-sm text-amber-200">{state.validationError}</p>
  if (state.loading && state.results.length === 0) return <p role="status" className="mt-8 text-sm text-zinc-400">Searching by meaning…</p>
  if (state.error) return <ErrorState error={state.error} retry={state.retry} />
  return <>
    {state.searchMode === 'keyword_fallback' && <div role="status" className="mt-6 rounded-xl border border-amber-200/20 bg-amber-200/[0.08] p-3 text-sm text-amber-100">Semantic search is temporarily unavailable. Showing keyword results.</div>}
    {state.results.length === 0 ? <div className="mt-8"><EmptyState icon={SearchX} title="No matching songs" description="Try another mood, emotion, or context." /></div> : <section className="mt-8"><SectionHeading title="Semantic matches" /><div className="mt-3 rounded-xl bg-white/[0.025] p-1 sm:p-2">{state.results.map((track, index) => <div key={`${track.id}-${index}`}><SongRow track={track} index={index} showPlays onPlay={onPlay} />{track.ai_reason && <p className="ml-14 -mt-1 mb-2 pr-3 text-xs text-zinc-500">{track.ai_reason}</p>}</div>)}</div></section>}
    {state.pagination.has_more && <button type="button" onClick={state.loadMore} disabled={state.loading} className="mx-auto mt-8 block rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{state.loading ? 'Loading…' : 'Load More'}</button>}
  </>
}
