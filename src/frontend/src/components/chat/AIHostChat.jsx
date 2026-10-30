import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, ArrowUp, Headphones, Sparkles, X } from 'lucide-react'
import brandMark from '../../assets/auratune-mark.jpg'
import PlaylistCard from '../playlist/PlaylistCard.jsx'
import { createMockHostReply, mockMessages, quickPrompts } from '../../utils/aiMockData.js'
import { useStore } from '../../context/AppStore.jsx'
import { usePlayer } from '../../context/PlayerContext.jsx'
import { getGenre } from '../../utils/mockData.js'

export default function AIHostChat({ isOpen, onClose, onPlayPlaylist, currentPlaylistId, isPlaying }) {
  const [messages, setMessages] = useState(mockMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef(null)
  const panelRef = useRef(null)
  const messageAreaRef = useRef(null)
  const replyTimerRef = useRef(null)
  const nextIdRef = useRef(0)
  const store = useStore()
  const player = usePlayer()
  const available = store.aiAvailable

  useEffect(() => () => window.clearTimeout(replyTimerRef.current), [])

  useEffect(() => {
    if (!isOpen) return undefined
    const previousFocus = document.activeElement
    inputRef.current?.focus({ preventScroll: true })

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const focusable = panelRef.current?.querySelectorAll('button:not(:disabled), textarea:not(:disabled), [tabindex="0"]')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen && messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight
    }
  }, [messages, isTyping, isOpen])

  const sendMessage = (value) => {
    const content = value.trim()
    if (!content || isTyping || !available) return
    setMessages((previous) => [...previous, { id: `user-${nextIdRef.current++}`, role: 'user', content }])
    setInput('')
    setIsTyping(true)
    inputRef.current?.focus({ preventScroll: true })
    replyTimerRef.current = window.setTimeout(() => {
      const reply = createMockHostReply(content, { currentTrack: player.track, genreName: getGenre(player.track.genre)?.name })
      if (reply.action?.type === 'queue') player.addManyToQueue(reply.action.trackIds.map(store.findTrack).filter(Boolean))
      setMessages((previous) => [...previous, { id: `host-${nextIdRef.current++}`, ...reply }])
      setIsTyping(false)
    }, 700)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-black/55 backdrop-blur-[3px]" />
      <section
        ref={panelRef}
        id="ai-host-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-host-title"
        aria-describedby="ai-host-description"
        className="ai-host-panel absolute bottom-[96px] right-2 top-2 flex w-[calc(100%-1rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-sky-200/15 bg-[#14151c] shadow-2xl shadow-black/60"
      >
        <header className="relative shrink-0 overflow-hidden border-b border-white/[0.07] px-5 pb-4 pt-5">
          <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="relative flex items-start gap-3">
            <HostAvatar large />
            <div className="min-w-0 flex-1 pt-0.5">
              <h2 id="ai-host-title" className="text-[15px] font-bold tracking-tight text-white">AuraTune AI Host</h2>
              {available ? <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]" /> Online <span className="ml-1 text-zinc-600">·</span><span className="ml-1 text-zinc-400">Luôn lắng nghe bạn</span></p> : <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-amber-300"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Tạm ngưng</p>}
            </div>
            <button type="button" onClick={onClose} aria-label="Đóng AI Host" className="-mr-1 -mt-1 rounded-lg p-2 text-zinc-400 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"><X size={18} /></button>
          </div>
          <div id="ai-host-description" className="mt-4 flex items-center gap-2 rounded-lg border border-sky-300/10 bg-sky-300/[0.04] px-3 py-2 text-[11px] text-sky-100/70"><Headphones size={14} aria-hidden="true" className="shrink-0 text-sky-300" /> Bạn kể tâm trạng. Mình chọn giai điệu.</div>
        </header>

        <div ref={messageAreaRef} role="log" aria-label="Hội thoại với AI Host" aria-live="polite" aria-relevant="additions text" className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-5 scrollbar-thin">
          <div className="flex items-center gap-3 px-2 text-[9px] tracking-[0.12em] text-zinc-600"><span className="h-px flex-1 bg-white/[0.05]" /> HÔM NAY · HỘI THOẠI MẪU <span className="h-px flex-1 bg-white/[0.05]" /></div>
          {messages.map((message) => (
            <div key={message.id} className={`flex items-start gap-2.5 ${message.role === 'user' ? 'justify-end pl-7' : 'pr-1'}`}>
              {message.role === 'assistant' && <HostAvatar />}
              <div className="min-w-0 max-w-full flex-1">
                <p className={`mb-1.5 text-[10px] font-medium ${message.role === 'user' ? 'text-right text-zinc-500' : 'text-sky-200/70'}`}>{message.role === 'user' ? 'Bạn' : 'AuraTune'}</p>
                <div className={`rounded-2xl px-3.5 py-3 text-[13px] leading-[1.8] [overflow-wrap:anywhere] ${message.role === 'user' ? 'rounded-tr-sm border border-violet-300/10 bg-violet-300/10 text-violet-50' : 'rounded-tl-sm border border-white/[0.06] bg-white/[0.035] text-zinc-300'}`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.playlist && <PlaylistCard compact playlist={message.playlist} onPlayPlaylist={onPlayPlaylist} isPlaying={isPlaying && currentPlaylistId === message.playlist.id} />}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div role="status" className="flex items-center gap-2.5 text-[11px] text-zinc-400">
              <HostAvatar />
              <span className="flex items-center gap-1.5 rounded-xl bg-white/[0.04] px-3 py-3"><span className="typing-dot" /><span className="typing-dot [animation-delay:150ms]" /><span className="typing-dot [animation-delay:300ms]" /><span className="ml-1">Đang chọn giai điệu…</span></span>
            </div>
          )}
        </div>

        <footer className="shrink-0 border-t border-white/[0.07] bg-[#12131a] p-4">
          {!available && <p role="alert" className="mb-3 flex items-start gap-2 rounded-lg border border-amber-300/20 bg-amber-300/[0.06] px-3 py-2 text-[11px] leading-5 text-amber-100"><AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden="true" /> AI Host tạm thời không khả dụng. Các tính năng nghe nhạc khác vẫn hoạt động bình thường.</p>}
          <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {quickPrompts.map((prompt) => <button key={prompt} type="button" disabled={isTyping || !available} onClick={() => sendMessage(prompt)} className="shrink-0 rounded-full border border-white/10 px-2.5 py-1.5 text-[10px] text-zinc-400 transition hover:border-sky-300/30 hover:bg-sky-300/5 hover:text-sky-100 disabled:cursor-wait disabled:opacity-40">{prompt}</button>)}
          </div>
          <form onSubmit={(event) => { event.preventDefault(); sendMessage(input) }} className="rounded-xl border border-white/10 bg-white/[0.035] p-2 transition focus-within:border-sky-300/40 focus-within:bg-sky-300/[0.03]">
            <textarea
              ref={inputRef}
              aria-label="Tin nhắn cho AuraTune AI Host"
              placeholder="Hôm nay bạn muốn nghe gì?"
              rows={2}
              maxLength={500}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault()
                  sendMessage(input)
                }
              }}
              className="block w-full resize-none bg-transparent px-1.5 pt-1 text-xs leading-5 text-zinc-100 outline-none placeholder:text-zinc-500"
            />
            <div className="mt-1 flex items-center justify-between gap-2 pl-1.5">
              <span className="text-[9px] text-zinc-600">Enter gửi · Shift + Enter xuống dòng</span>
              <button type="submit" aria-label="Gửi tin nhắn" disabled={!input.trim() || isTyping || !available} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sky-200 text-slate-950 transition hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:bg-white/[0.06] disabled:text-zinc-600"><ArrowUp size={18} /></button>
            </div>
          </form>
          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[9px] text-zinc-500"><Sparkles size={10} aria-hidden="true" /> Gợi ý mô phỏng · Chưa kết nối AI</p>
        </footer>
      </section>
    </div>
  )
}

function HostAvatar({ large = false }) {
  return (
    <div aria-hidden="true" className={`shrink-0 overflow-hidden border border-sky-300/20 bg-black ${large ? 'h-11 w-11 rounded-xl' : 'mt-5 h-7 w-7 rounded-lg'}`}>
      <img src={brandMark} alt="" className="h-full w-full scale-[1.4] object-cover" />
    </div>
  )
}
