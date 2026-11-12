import { findActiveLyricIndex, formatTime } from '../../utils/playback.js'

// Feature 044 — Lời bài hát trong trình phát toàn màn hình.
// - Lời có mốc thời gian: nhấn mạnh dòng đang hát, dòng trước/sau mờ hơn, chạm để tua (FR-002..005, FR-012).
// - Chỉ có lời thường: hiển thị nguyên văn, không nhấn mạnh (FR-006).
// - Không có lời: hiển thị thông báo, nhạc vẫn phát (FR-007, FR-008).
export default function LyricsPanel({ track, elapsed, onSeekLine }) {
  const synced = Array.isArray(track.lyrics) && track.lyrics.length ? track.lyrics : null
  const plain = !synced && typeof track.plainLyrics === 'string' && track.plainLyrics.trim() ? track.plainLyrics.trim() : null

  if (synced) {
    const active = findActiveLyricIndex(synced, elapsed)
    const previous = synced[active - 1]
    const current = synced[active]
    const next = synced[active + 1]
    return (
      <div className="now-playing-lyrics text-center" aria-label="Lời bài hát">
        <p className="mb-7 hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40 lg:block">Trong khoảnh khắc này</p>
        {previous && <LyricLine line={previous} onSeek={onSeekLine} className="mb-2.5 text-[14px] leading-6 text-white/30 hover:text-white/60" />}
        {current ? (
          <LyricLine line={current} onSeek={onSeekLine} current className="mx-auto max-w-[360px] bg-gradient-to-b from-white via-white to-white/55 bg-clip-text text-[19px] font-semibold leading-[1.35] tracking-[-0.02em] text-transparent lg:text-[25px]" />
        ) : (
          <p aria-hidden="true" className="text-[25px] font-semibold text-white/70">♪</p>
        )}
        {next && <LyricLine line={next} onSeek={onSeekLine} className="mt-2.5 text-[14px] leading-6 tracking-[0.01em] text-white/40 hover:text-white/70" />}
      </div>
    )
  }

  if (plain) {
    return (
      <div tabIndex={0} aria-label="Lời bài hát" className="now-playing-lyrics max-h-[34vh] overflow-y-auto whitespace-pre-line rounded-lg text-center text-[15px] leading-7 text-white/75 scrollbar-thin focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50">
        {plain}
      </div>
    )
  }

  return (
    <div className="now-playing-lyrics text-center" role="status">
      <p className="mx-auto max-w-[360px] text-[19px] font-semibold leading-[1.35] tracking-[-0.02em] text-white/85 lg:text-[22px]">Bài hát này chưa có lời.</p>
      <p className="mt-2.5 text-[14px] leading-6 text-white/45">Nhạc vẫn tiếp tục phát.</p>
    </div>
  )
}

function LyricLine({ line, onSeek, current = false, className }) {
  return (
    <button
      type="button"
      onClick={() => onSeek(line.time)}
      aria-current={current ? 'true' : undefined}
      title={`Phát từ ${formatTime(line.time)}`}
      className={`block w-full rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${className}`}
    >
      {line.text}
    </button>
  )
}
