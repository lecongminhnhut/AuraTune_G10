import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Search, Sparkles, X } from 'lucide-react'
import Icon from '../common/Icon.jsx'
import CoverArt from '../playlist/CoverArt.jsx'
import { getMockSearchResults, searchPlaceholder } from '../../utils/aiMockData.js'
import { searchCatalog } from '../../utils/searchEngine.js'
import { useStore } from '../../context/AppStore.jsx'
import { navigate } from '../../utils/navigation.jsx'

export default function SemanticSearch({ onPlayTrack, onPlayPlaylist }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const listId = useId()
  const store = useStore()
  const { results, reason } = useMemo(() => {
    if (store.aiAvailable) {
      const mock = getMockSearchResults(query)
      return { ...mock, results: mock.results.filter((result) => result.type === 'playlist' || store.isPlayable(result.item.id)) }
    }
    // Dự phòng khi AI không khả dụng: chỉ tìm theo từ khóa (Vision Document, mục 5.2).
    const keyword = searchCatalog(query, { tracks: store.publicTracks, aiAvailable: false })
    return {
      results: [...keyword.tracks.slice(0, 3).map((item) => ({ type: 'track', item })), ...keyword.playlists.slice(0, 2).map((item) => ({ type: 'playlist', item }))],
      reason: 'AI tạm thời không khả dụng, đang tìm theo từ khóa.',
    }
  }, [query, store.aiAvailable, store.publicTracks, store.isPlayable])
  const visible = open && query.trim().length > 0
  const openFullResults = () => {
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    setOpen(false)
    setActiveIndex(-1)
    inputRef.current?.blur()
  }

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }
    const onShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        if (document.querySelector('[aria-modal="true"]')) return
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onShortcut)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onShortcut)
    }
  }, [])

  const selectResult = (result) => {
    if (result.type === 'playlist') onPlayPlaylist(result.item)
    else onPlayTrack(result.item)
    setOpen(false)
    setActiveIndex(-1)
  }

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
    }
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && results.length) {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((index) => event.key === 'ArrowDown' ? (index + 1) % results.length : (index <= 0 ? results.length - 1 : index - 1))
    }
    if (event.key === 'Enter' && query.trim()) {
      event.preventDefault()
      if (visible && activeIndex >= 0 && results[activeIndex]) selectResult(results[activeIndex])
      else openFullResults()
    }
  }

  return (
    <div ref={containerRef} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }} className="relative min-w-0 flex-1">
      <div className={`flex h-11 items-center gap-2.5 rounded-xl border px-3.5 transition sm:gap-3 ${visible ? 'border-sky-300/40 bg-sky-300/[0.06] shadow-[0_0_24px_rgba(56,189,248,0.06)]' : 'border-white/[0.08] bg-white/[0.04] focus-within:border-sky-300/40'}`}>
        <Search size={18} aria-hidden="true" className="shrink-0 text-zinc-400" />
        <Sparkles size={16} aria-hidden="true" className="shrink-0 text-sky-300" />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-label="Tìm nhạc bằng tên bài hát, nghệ sĩ hoặc cảm xúc"
          aria-expanded={visible}
          aria-controls={visible ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={visible && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          autoComplete="off"
          maxLength={500}
          placeholder={searchPlaceholder}
          title={searchPlaceholder}
          value={query}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); setActiveIndex(-1) }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-zinc-500 sm:text-[13px]"
        />
        {query ? (
          <button type="button" aria-label="Xóa tìm kiếm" onClick={() => { setQuery(''); setActiveIndex(-1); inputRef.current?.focus() }} className="rounded-md p-1 text-zinc-500 hover:bg-white/10 hover:text-white"><X size={15} /></button>
        ) : <kbd className="hidden shrink-0 rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-500 xl:inline">Ctrl K</kbd>}
      </div>

      {visible && (
        <div className="search-dropdown absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-sky-200/15 bg-[#19191f] shadow-2xl shadow-black/60 sm:min-w-[360px]">
          <div className="border-b border-white/[0.06] px-4 py-3.5">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-xs font-semibold text-sky-100"><Sparkles size={14} aria-hidden="true" /> {store.aiAvailable ? 'Giai điệu dành cho cảm xúc của bạn' : 'Kết quả theo từ khóa'}</p>
              <span className="shrink-0 rounded bg-white/[0.05] px-1.5 py-1 text-[8px] font-semibold tracking-wider text-zinc-500">DEMO</span>
            </div>
            <p className="mt-1.5 text-[11px] leading-5 text-zinc-400">{reason}</p>
          </div>
          <div id={listId} role="listbox" aria-label="Bài hát và playlist gợi ý" className="max-h-[min(360px,45dvh)] space-y-1 overflow-y-auto p-2 scrollbar-thin">
            {results.length === 0 && <p className="px-3 py-5 text-center text-xs text-zinc-500">Không có gợi ý nhanh. Nhấn Enter để xem toàn bộ kết quả.</p>}
            {results.map((result, index) => (
              <button
                key={`${result.type}-${result.item.id}`}
                id={`${listId}-${index}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                aria-label={`Phát ${result.type === 'playlist' ? 'playlist ' : ''}${result.item.title}`}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => selectResult(result)}
                className={`group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-300 ${index === activeIndex ? 'bg-white/[0.08]' : 'bg-white/[0.025] hover:bg-white/[0.08]'}`}
              >
                <div className="relative shrink-0 overflow-hidden rounded-lg">
                  <CoverArt variant={result.item.cover} className="h-12 w-12 [&_span]:text-3xl" />
                  <span className="absolute inset-0 grid place-items-center bg-black/40 text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100"><Icon name="play" size={19} /></span>
                </div>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-zinc-100">{result.item.title}</span>
                  <span className="mt-1 block truncate text-[11px] text-zinc-500">{result.type === 'playlist' ? `Playlist · ${result.item.count} bài hát` : `Bài hát · ${result.item.artist}`}</span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-violet-300/10 bg-violet-300/10 px-2 py-1 text-[9px] font-medium text-violet-200"><Sparkles size={10} aria-hidden="true" /> AI Gợi ý</span>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-white/[0.06] px-4 py-2.5 text-[10px] text-zinc-500">
            <span>Gợi ý mô phỏng từ dữ liệu mẫu</span>
            <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={openFullResults} className="flex items-center gap-1 font-semibold text-sky-200 hover:text-white">Xem tất cả kết quả <ArrowUpRight size={12} aria-hidden="true" /></button>
          </div>
        </div>
      )}
    </div>
  )
}
