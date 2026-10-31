import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, ChevronRight, X } from 'lucide-react'
import brandMark from '../../assets/auratune-mark.png'
import PlaylistCard from '../playlist/PlaylistCard.jsx'
import { useStore } from '../../context/AppStore.jsx'
import { usePlayer } from '../../context/PlayerContext.jsx'
import { runAgent } from '../../utils/agentService.js'
import { executeTool } from './agentTools.js'

const SPINNER = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
const THINKING_VERBS = ['Đang suy nghĩ', 'Đang phân tích', 'Đang chọn giai điệu', 'Đang lên kế hoạch']
const suggestions = ['phát lofi chill để code', 'bài đang phát là gì?', 'thêm nhạc năng lượng vào hàng chờ, âm lượng 40%', 'xóa hàng chờ', 'mở bảng xếp hạng']
const helpLines = [
  ['/help', 'xem trợ giúp'],
  ['/clear', 'xóa màn hình'],
  ['↑ ↓', 'chọn lại lệnh đã gõ'],
  ['esc', 'dừng agent đang chạy'],
  ['y / n', 'trả lời câu hỏi xác nhận'],
]

const seconds = (ms) => `${(Math.max(0, ms) / 1000).toFixed(1)}s`

// AI Host dạng CLI: gõ yêu cầu → agent suy nghĩ → gọi tool (thực hiện hành động trong app) → trả lời.
// Dữ liệu đến từ utils/agentService.js (đang giả lập, backend sẽ thay bằng API thật).
export default function AIHostChat({ isOpen, onClose, onPlayPlaylist, currentPlaylistId, isPlaying }) {
  const store = useStore()
  const player = usePlayer()
  const available = store.aiAvailable
  const [entries, setEntries] = useState([{ id: 'banner', kind: 'banner' }])
  const [input, setInput] = useState('')
  const [running, setRunning] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const inputRef = useRef(null)
  const panelRef = useRef(null)
  const logRef = useRef(null)
  const abortRef = useRef(null)
  const confirmRef = useRef(null)
  const historyRef = useRef({ items: [], index: -1 })
  const nextIdRef = useRef(0)
  const contextRef = useRef({ store, player })
  contextRef.current = { store, player }
  const runningRef = useRef(false)
  runningRef.current = running

  useEffect(() => () => abortRef.current?.abort(), [])

  useEffect(() => {
    if (!running) return undefined
    const timer = window.setInterval(() => setNow(Date.now()), 100)
    return () => window.clearInterval(timer)
  }, [running])

  useEffect(() => {
    if (!isOpen) return undefined
    const previousFocus = document.activeElement
    inputRef.current?.focus({ preventScroll: true })

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (runningRef.current) abortRef.current?.abort()
        else onClose()
        return
      }
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
    if (isOpen && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [entries, isOpen])

  const newId = (prefix) => `${prefix}-${nextIdRef.current++}`
  const updateEntry = (id, updater) => setEntries((previous) => previous.map((entry) => (entry.id === id ? updater(entry) : entry)))
  const updateItem = (runId, callId, patch) => updateEntry(runId, (entry) => ({ ...entry, items: entry.items.map((item) => (item.call.id === callId ? { ...item, ...patch } : item)) }))

  const answerConfirm = (accepted) => {
    const pending = confirmRef.current
    if (!pending) return
    confirmRef.current = null
    pending.resolve(accepted)
    inputRef.current?.focus({ preventScroll: true })
  }

  const askConfirm = (signal) => new Promise((resolve) => {
    confirmRef.current = { resolve }
    signal.addEventListener('abort', () => { if (confirmRef.current?.resolve === resolve) confirmRef.current = null; resolve(false) }, { once: true })
  })

  const runPrompt = async (prompt) => {
    const runId = newId('run')
    const controller = new AbortController()
    abortRef.current = controller
    const startedAt = Date.now()
    setNow(startedAt)
    setRunning(true)
    setEntries((previous) => [...previous, { id: newId('user'), kind: 'user', text: prompt }, { id: runId, kind: 'run', status: 'running', startedAt, thinkingEndedAt: null, thinking: [], items: [], text: '', playlistId: null }])
    const endThinking = () => updateEntry(runId, (entry) => (entry.thinkingEndedAt ? entry : { ...entry, thinkingEndedAt: Date.now() }))

    const { store: currentStore, player: currentPlayer } = contextRef.current
    const context = {
      currentTrack: { id: currentPlayer.track.id, title: currentPlayer.track.title, artist: currentPlayer.track.artist },
      isPlaying: currentPlayer.isPlaying,
      volume: currentPlayer.volume,
      user: currentStore.currentUser ? { id: currentStore.currentUser.id, role: currentStore.currentUser.role } : null,
    }

    try {
      for await (const event of runAgent(prompt, { context, signal: controller.signal })) {
        if (controller.signal.aborted) break
        if (event.type === 'thinking') {
          updateEntry(runId, (entry) => ({ ...entry, thinking: [...entry.thinking, event.text] }))
        } else if (event.type === 'tool_call') {
          endThinking()
          updateEntry(runId, (entry) => ({ ...entry, items: [...entry.items, { call: event, state: event.confirm ? 'confirm' : 'running', output: '' }] }))
          if (event.confirm && !(await askConfirm(controller.signal))) {
            updateItem(runId, event.id, { state: 'skipped', output: 'Đã hủy theo yêu cầu' })
            if (controller.signal.aborted) break
            continue
          }
          updateItem(runId, event.id, { state: 'running' })
          const result = executeTool(event, contextRef.current)
          updateItem(runId, event.id, { state: result.ok ? 'ok' : 'error', output: result.output })
        } else if (event.type === 'text') {
          endThinking()
          updateEntry(runId, (entry) => ({ ...entry, text: entry.text + event.delta }))
        } else if (event.type === 'playlist') {
          updateEntry(runId, (entry) => ({ ...entry, playlistId: event.playlistId }))
        } else if (event.type === 'error') {
          updateEntry(runId, (entry) => ({ ...entry, error: event.message }))
        }
      }
      endThinking()
      updateEntry(runId, (entry) => ({ ...entry, status: controller.signal.aborted ? 'stopped' : 'done', endedAt: Date.now() }))
    } catch (error) {
      endThinking()
      const stopped = error.name === 'AbortError'
      updateEntry(runId, (entry) => ({ ...entry, status: stopped ? 'stopped' : 'error', error: stopped ? null : error.message, endedAt: Date.now() }))
    } finally {
      abortRef.current = null
      setRunning(false)
      inputRef.current?.focus({ preventScroll: true })
    }
  }

  const submit = (value) => {
    const prompt = value.trim()
    if (!prompt || running || !available) return
    const history = historyRef.current
    history.items = [prompt, ...history.items.filter((item) => item !== prompt)].slice(0, 30)
    history.index = -1
    setInput('')
    if (prompt === '/clear') { setEntries([{ id: newId('banner'), kind: 'banner' }]); return }
    if (prompt === '/help') { setEntries((previous) => [...previous, { id: newId('user'), kind: 'user', text: prompt }, { id: newId('help'), kind: 'help' }]); return }
    runPrompt(prompt)
  }

  const onInputKeyDown = (event) => {
    if (confirmRef.current && ['y', 'n', 'Enter'].includes(event.key) && !input) {
      event.preventDefault()
      answerConfirm(event.key === 'y')
      return
    }
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      submit(input)
      return
    }
    const history = historyRef.current
    const caretAtStart = event.currentTarget.selectionStart === 0 && event.currentTarget.selectionEnd === 0
    if (event.key === 'ArrowUp' && (caretAtStart || !input) && history.items.length) {
      event.preventDefault()
      history.index = Math.min(history.index + 1, history.items.length - 1)
      setInput(history.items[history.index])
    } else if (event.key === 'ArrowDown' && history.index >= 0) {
      event.preventDefault()
      history.index -= 1
      setInput(history.index >= 0 ? history.items[history.index] : '')
    }
  }

  if (!isOpen) return null

  const awaitingConfirm = entries.some((entry) => entry.kind === 'run' && entry.items.some((item) => item.state === 'confirm'))

  return (
    <div className="fixed inset-0 z-50">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-black/55 backdrop-blur-[3px]" />
      <section
        ref={panelRef}
        id="ai-host-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-host-title"
        className="ai-host-panel absolute bottom-[96px] right-2 top-2 flex w-[calc(100%-1rem)] max-w-[460px] flex-col overflow-hidden rounded-2xl border border-sky-200/15 bg-[#0c0d12] shadow-2xl shadow-black/60"
      >
        <header className="flex shrink-0 items-center gap-3 border-b border-white/[0.07] bg-[#111219] px-4 py-3">
          <img src={brandMark} alt="" aria-hidden="true" className="h-8 w-auto" />
          <div className="min-w-0 flex-1">
            <h2 id="ai-host-title" className="text-[14px] font-bold tracking-tight text-white">AuraTune Agent</h2>
            <p className="truncate font-mono text-[10px] text-zinc-500">~/auratune · {available ? <span className="text-emerald-300">● online</span> : <span className="text-amber-300">● tạm ngưng</span>}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng AI Host" className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"><X size={18} /></button>
        </header>

        <div ref={logRef} role="log" aria-label="Phiên làm việc với AuraTune Agent" aria-live="polite" className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 font-mono text-[12px] leading-[1.7] text-zinc-300 scrollbar-thin">
          {entries.map((entry) => {
            if (entry.kind === 'banner') return <Banner key={entry.id} />
            if (entry.kind === 'help') return <Help key={entry.id} />
            if (entry.kind === 'user') return <p key={entry.id} className="flex gap-2 text-zinc-100 [overflow-wrap:anywhere]"><span className="select-none text-sky-300">❯</span><span className="whitespace-pre-wrap">{entry.text}</span></p>
            return <AgentRun key={entry.id} run={entry} now={now} onConfirm={answerConfirm} onPlayPlaylist={onPlayPlaylist} currentPlaylistId={currentPlaylistId} isPlaying={isPlaying} store={store} />
          })}
        </div>

        <footer className="shrink-0 border-t border-white/[0.07] bg-[#0f1016] px-3 pb-3 pt-2.5">
          {!available && <p role="alert" className="mb-2.5 flex items-start gap-2 rounded-lg border border-amber-300/20 bg-amber-300/[0.06] px-3 py-2 text-[11px] leading-5 text-amber-100"><AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden="true" /> AI Host tạm thời không khả dụng. Các tính năng nghe nhạc khác vẫn hoạt động bình thường.</p>}
          {!running && available && (
            <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {suggestions.map((item) => <button key={item} type="button" onClick={() => submit(item)} className="shrink-0 rounded-md border border-white/10 px-2 py-1 font-mono text-[10px] text-zinc-400 transition hover:border-sky-300/30 hover:text-sky-100">{item}</button>)}
            </div>
          )}
          <form onSubmit={(event) => { event.preventDefault(); submit(input) }} className={`flex items-start gap-2 rounded-lg border px-3 py-2 font-mono transition ${running ? 'border-white/[0.06] bg-white/[0.02]' : 'border-white/10 bg-white/[0.035] focus-within:border-sky-300/40'}`}>
            <span aria-hidden="true" className="select-none pt-px text-[13px] text-sky-300">❯</span>
            <textarea
              ref={inputRef}
              aria-label="Nhập yêu cầu cho AuraTune Agent"
              placeholder={awaitingConfirm ? 'Nhấn y để đồng ý, n để hủy' : running ? 'Agent đang chạy… (esc để dừng)' : 'Bạn muốn nghe gì, hay cần mình làm gì?'}
              rows={1}
              maxLength={500}
              value={input}
              disabled={!available}
              onChange={(event) => { setInput(event.target.value); historyRef.current.index = -1 }}
              onKeyDown={onInputKeyDown}
              className="block max-h-28 min-h-[22px] w-full resize-none bg-transparent text-[12.5px] leading-[22px] text-zinc-100 outline-none [field-sizing:content] placeholder:text-zinc-600 disabled:cursor-not-allowed"
            />
          </form>
          <p className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 px-1 font-mono text-[9.5px] text-zinc-600">
            <span>⏎ gửi</span><span>↑↓ lịch sử</span><span>esc {running ? 'dừng' : 'đóng'}</span><span>/help</span><span className="ml-auto">agent giả lập · chưa nối backend</span>
          </p>
        </footer>
      </section>
    </div>
  )
}

function Banner() {
  return (
    <div className="rounded-lg border border-sky-300/20 px-3.5 py-3">
      <p className="text-sky-200"><span className="text-violet-300">✻</span> Chào mừng đến với <span className="font-bold text-white">AuraTune Agent</span></p>
      <p className="mt-1.5 text-zinc-500">Gõ yêu cầu bằng câu bình thường, mình sẽ trả lời hoặc thao tác giúp bạn.</p>
      <ul className="mt-2 space-y-0.5 text-zinc-400">
        <li><span className="text-zinc-600">›</span> phát nhạc chill rồi giảm âm lượng</li>
        <li><span className="text-zinc-600">›</span> thêm nhạc năng lượng vào hàng chờ</li>
        <li><span className="text-zinc-600">›</span> mở bảng xếp hạng</li>
      </ul>
      <p className="mt-2 text-[11px] text-zinc-600">/help để xem phím tắt</p>
    </div>
  )
}

function Help() {
  return (
    <div className="space-y-0.5 pl-4">
      {helpLines.map(([key, description]) => <p key={key}><span className="inline-block w-16 text-sky-200">{key}</span><span className="text-zinc-500">{description}</span></p>)}
    </div>
  )
}

function AgentRun({ run, now, onConfirm, onPlayPlaylist, currentPlaylistId, isPlaying, store }) {
  const [expanded, setExpanded] = useState(false)
  const thinking = !run.thinkingEndedAt && run.status === 'running'
  const thoughtFor = (run.thinkingEndedAt ?? now) - run.startedAt
  const playlist = run.playlistId ? store.findPlaylistById(run.playlistId) : null
  const spinner = SPINNER[Math.floor(now / 90) % SPINNER.length]
  const verb = THINKING_VERBS[Math.floor((now - run.startedAt) / 1800) % THINKING_VERBS.length]

  return (
    <div className="space-y-2 pl-0.5">
      {thinking ? (
        <div role="status">
          <p className="text-violet-200"><span className="inline-block w-4 text-violet-300">{spinner}</span>{verb}… <span className="text-zinc-500">({seconds(thoughtFor)} · esc để dừng)</span></p>
          {run.thinking.length > 0 && <div className="ml-[7px] mt-1 space-y-0.5 border-l border-white/[0.08] pl-3 text-[11px] italic text-zinc-500">{run.thinking.map((line, index) => <p key={index}>{line}</p>)}</div>}
        </div>
      ) : run.thinking.length > 0 && (
        <div>
          <button type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} className="flex items-center gap-1 text-zinc-500 transition hover:text-zinc-300">
            <span className="text-violet-300">✻</span> Đã suy nghĩ {seconds(thoughtFor)} <ChevronRight size={12} className={`transition ${expanded ? 'rotate-90' : ''}`} />
          </button>
          {expanded && <div className="ml-[7px] mt-1 space-y-0.5 border-l border-white/[0.08] pl-3 text-[11px] italic text-zinc-500">{run.thinking.map((line, index) => <p key={index}>{line}</p>)}</div>}
        </div>
      )}

      {run.items.map(({ call, state, output }) => (
        <div key={call.id}>
          <p className="flex items-baseline gap-2 [overflow-wrap:anywhere]">
            <span className={`select-none ${state === 'ok' ? 'text-emerald-400' : state === 'error' ? 'text-rose-400' : state === 'skipped' ? 'text-zinc-600' : state === 'confirm' ? 'text-amber-300' : 'animate-pulse text-sky-300'}`}>●</span>
            <span><span className="font-semibold text-zinc-100">{call.name}</span><span className="text-zinc-500">{call.label.slice(call.name.length)}</span></span>
          </p>
          {state === 'confirm' ? (
            <div className="ml-4 mt-1 rounded-md border border-amber-300/25 bg-amber-300/[0.05] px-3 py-2">
              <p className="text-amber-100">? {call.confirm} <span className="text-zinc-500">[y/N]</span></p>
              <div className="mt-2 flex gap-2">
                <button type="button" onClick={() => onConfirm(true)} className="rounded border border-amber-300/40 px-2.5 py-0.5 text-[11px] text-amber-100 transition hover:bg-amber-300/10">y · Đồng ý</button>
                <button type="button" onClick={() => onConfirm(false)} className="rounded border border-white/15 px-2.5 py-0.5 text-[11px] text-zinc-300 transition hover:bg-white/[0.06]">n · Hủy</button>
              </div>
            </div>
          ) : output && <p className={`ml-4 ${state === 'error' ? 'text-rose-300' : 'text-zinc-500'}`}><span className="select-none text-zinc-600">⎿ </span>{output}</p>}
        </div>
      ))}

      {run.text && <p className="whitespace-pre-wrap font-sans text-[13px] leading-[1.75] text-zinc-200 [overflow-wrap:anywhere]">{run.text}{run.status === 'running' && <span className="ml-0.5 inline-block h-[14px] w-[7px] translate-y-[2px] animate-pulse bg-sky-300/80" />}</p>}
      {playlist && run.status !== 'running' && <div className="font-sans"><PlaylistCard compact playlist={playlist} onPlayPlaylist={onPlayPlaylist} isPlaying={isPlaying && currentPlaylistId === playlist.id} /></div>}
      {run.error && <p className="text-rose-300">✗ {run.error}</p>}
      {run.status === 'stopped' && <p className="text-amber-300/80">■ Đã dừng</p>}
      {run.status === 'done' && <p className="text-[10px] text-zinc-600">✓ xong trong {seconds(run.endedAt - run.startedAt)}</p>}
    </div>
  )
}
