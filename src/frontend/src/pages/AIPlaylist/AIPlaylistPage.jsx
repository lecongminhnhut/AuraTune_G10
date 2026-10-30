import { useState } from 'react'
import { AlertTriangle, Loader2, RefreshCw, Sparkles } from 'lucide-react'
import SongTable from '../../components/song/SongTable.jsx'
import { LoginRequired, PageHeader, inputClass, primaryButton, secondaryButton } from '../../components/common/ui.jsx'
import { useStore } from '../../context/AppStore.jsx'
import { usePlayer } from '../../context/PlayerContext.jsx'
import { getMockRecommendations, normalizeText } from '../../utils/aiMockData.js'
import { genres } from '../../utils/mockData.js'
import { navigate } from '../../utils/navigation.jsx'

const examples = ['Nhạc nhẹ nhàng để học bài buổi tối', 'Năng lượng cho buổi chạy bộ sáng', 'Indie Việt cho chuyến đi xa', 'Lofi chill khi trời mưa']

// AI Playlist (G06): mô tả một câu → AI đề xuất danh sách → người nghe xem lại, bỏ bớt, sắp xếp rồi lưu.
export default function AIPlaylistPage() {
  const store = useStore()
  const player = usePlayer()
  const [prompt, setPrompt] = useState('')
  const [status, setStatus] = useState('idle')
  const [proposal, setProposal] = useState(null)

  if (!store.currentUser) return <LoginRequired description="Đăng nhập để tạo và lưu playlist bằng AI." />

  const generate = (event) => {
    event?.preventDefault()
    if (!prompt.trim()) return
    if (!store.aiAvailable) { setStatus('unavailable'); return }
    setStatus('loading')
    window.setTimeout(() => {
      const recommendation = getMockRecommendations(prompt)
      const normalized = normalizeText(prompt)
      const genreIds = genres.filter((genre) => normalizeText(`${genre.name} ${genre.description}`).split(/\s+/).some((word) => word.length > 3 && normalized.includes(word))).map((genre) => genre.id)
      const ids = [...new Set([...recommendation.playlists.flatMap((playlist) => playlist.trackIds), ...store.publicTracks.filter((track) => genreIds.includes(track.genre)).map((track) => track.id)])]
      const proposed = ids.map(store.findTrack).filter((track) => track && store.isPlayable(track.id)).slice(0, 10)
      setProposal({ title: prompt.trim().slice(0, 60), reason: recommendation.reason, tracks: proposed })
      setStatus('ready')
    }, 650)
  }

  const save = () => {
    const id = store.createPlaylist({ title: proposal.title, description: `Tạo bởi AI từ mô tả: “${prompt.trim()}”`, trackIds: proposal.tracks.map((track) => track.id), cover: 'violet' })
    store.toast('Đã lưu playlist AI vào thư viện.')
    navigate(`/playlist/${id}`)
  }

  const move = (from, to) => setProposal((current) => {
    const next = [...current.tracks]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    return { ...current, tracks: next }
  })

  return (
    <div className="pb-12">
      <PageHeader eyebrow="AI Playlist" title="Tạo playlist bằng một câu" description="Mô tả dịp hoặc tâm trạng, AuraTune sẽ đề xuất danh sách từ những bài hát có thể phát ngay. Bạn xem lại và chỉnh sửa trước khi lưu." />
      <div className="px-5 sm:px-8">
        <form onSubmit={generate} className="rounded-2xl border border-sky-300/15 bg-gradient-to-br from-sky-300/[0.06] to-violet-400/[0.05] p-4 sm:p-5">
          <label className="block text-xs font-semibold text-sky-100">Bạn muốn playlist cho dịp nào?
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={2} maxLength={200} placeholder="VD: Nhạc nhẹ nhàng để học bài buổi tối" className={`${inputClass} h-auto resize-none py-2.5`} />
          </label>
          <div className="mt-3 flex flex-wrap gap-1.5">{examples.map((example) => <button key={example} type="button" onClick={() => setPrompt(example)} className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-zinc-400 transition hover:border-sky-300/30 hover:text-sky-100">{example}</button>)}</div>
          <div className="mt-4 flex justify-end">
            <button type="submit" disabled={!prompt.trim() || status === 'loading'} className={primaryButton}>{status === 'loading' ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />} {proposal ? 'Tạo lại' : 'Đề xuất playlist'}</button>
          </div>
        </form>

        {status === 'unavailable' && (
          <div role="alert" className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300/20 bg-amber-300/[0.06] px-4 py-3 text-xs text-amber-100">
            <span className="flex items-center gap-2"><AlertTriangle size={15} aria-hidden="true" /> AI Playlist tạm thời không khả dụng. Bạn vẫn có thể tạo playlist thủ công.</span>
            <button type="button" onClick={() => store.openCreatePlaylist()} className={secondaryButton}>Tạo thủ công</button>
          </div>
        )}

        {status === 'ready' && proposal && (
          <section className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0 flex-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Tên playlist
                  <input value={proposal.title} onChange={(event) => setProposal((current) => ({ ...current, title: event.target.value }))} maxLength={80} className="mt-1 w-full bg-transparent text-2xl font-bold text-white outline-none focus:underline" />
                </label>
                <p className="mt-1 text-xs text-zinc-400">{proposal.reason} · {proposal.tracks.length} bài hát</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => generate()} className={secondaryButton}><RefreshCw size={14} /> Đề xuất khác</button>
                <button type="button" onClick={() => player.playCollection(proposal.tracks)} disabled={!proposal.tracks.length} className={secondaryButton}>Nghe thử</button>
                <button type="button" onClick={save} disabled={!proposal.tracks.length || !proposal.title.trim()} className={primaryButton}>Lưu playlist</button>
              </div>
            </div>
            {proposal.tracks.length ? (
              <SongTable songs={proposal.tracks} onPlayTrack={(track) => player.playTrack(track, proposal.tracks)} onRemove={(track) => setProposal((current) => ({ ...current, tracks: current.tracks.filter((item) => item.id !== track.id) }))} removeLabel="Bỏ khỏi đề xuất" onMove={move} />
            ) : <p className="mt-6 text-sm text-zinc-500">Bạn đã bỏ hết bài hát. Hãy bấm “Đề xuất khác” để thử lại.</p>}
          </section>
        )}
      </div>
    </div>
  )
}
