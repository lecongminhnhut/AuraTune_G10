import { useState } from 'react'
import { Share2, UserRound } from 'lucide-react'
import { ErrorState, NotFound, SectionHeading } from '../../components/common/ui.jsx'
import { useStore } from '../../context/AppStore.jsx'
import FollowButton from '../../components/artist/FollowButton.jsx'
import { useArtistProfile } from '../../hooks/useArtistProfile.js'
import { copyArtistLink } from '../../utils/artistRoute.js'

function safeImage(value) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null
  } catch { return null }
}

export function ArtistImage({ name, imageUrl }) {
  const [failed, setFailed] = useState(false)
  const source = safeImage(imageUrl)
  if (!source || failed) {
    return <div role="img" aria-label="Ảnh nghệ sĩ chưa được cung cấp" className="grid h-full w-full place-items-center bg-zinc-800 text-zinc-500"><UserRound className="h-1/2 w-1/2" aria-hidden="true" /></div>
  }
  return <img src={source} alt={`Ảnh nghệ sĩ ${name}`} referrerPolicy="no-referrer" onError={() => setFailed(true)} className="h-full w-full object-cover" />
}

// Pure public presentation is also exercised independently of auth/player state.
export function ArtistIdentity({ artist, onCopy, followControl = null }) {
  return (
    <div className="pb-12">
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-900/50 via-violet-950/20 to-transparent px-5 pb-7 pt-8 sm:px-8 sm:pb-9 sm:pt-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[100px]" />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:gap-8">
          <div className="h-40 w-40 shrink-0 overflow-hidden rounded-full shadow-2xl shadow-black/40 sm:h-52 sm:w-52">
            <ArtistImage key={`${artist.id}/${artist.imageUrl}`} name={artist.name} imageUrl={artist.imageUrl} />
          </div>
          <div className="min-w-0 pb-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-200">Nghệ sĩ</p>
            <h1 className="mt-2 break-words text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-6xl">{artist.name}</h1>
          </div>
        </div>
      </section>
      <section className="px-5 sm:px-8">
        <div className="flex flex-wrap items-center gap-3 py-5">
          {followControl}
          <button type="button" onClick={onCopy} aria-label={`Sao chép liên kết nghệ sĩ ${artist.name}`} className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:border-white/50 hover:text-white"><Share2 size={16} aria-hidden="true" /> Sao chép liên kết</button>
        </div>
        <SectionHeading title="Giới thiệu" />
        <div className="mt-4 rounded-xl bg-white/[0.035] p-5">
          {artist.biography?.trim()
            ? <p className="whitespace-pre-wrap break-words text-sm leading-7 text-zinc-300">{artist.biography}</p>
            : <p className="text-sm italic text-zinc-500">Nghệ sĩ chưa cung cấp tiểu sử.</p>}
        </div>
      </section>
    </div>
  )
}

export default function ArtistPage({ artistId }) {
  const store = useStore()
  const { status, artist, retry } = useArtistProfile(artistId)
  const copy = async () => {
    try {
      await copyArtistLink(artist.id)
      store.toast('Đã sao chép liên kết nghệ sĩ.')
    } catch {
      store.toast('Không thể sao chép liên kết. Vui lòng thử lại.', 'error')
    }
  }
  if (status === 'loading') return <div className="animate-pulse px-5 py-10 sm:px-8" aria-busy="true" aria-label="Đang tải hồ sơ nghệ sĩ"><div className="h-40 w-40 rounded-full bg-white/[0.06]" /></div>
  if (status === 'error') return <div className="px-5 py-10 sm:px-8"><ErrorState title="Không tải được hồ sơ nghệ sĩ" description="Dữ liệu tạm thời chưa tải được. Vui lòng thử lại." onRetry={retry} /></div>
  if (status === 'not-found') return <NotFound title="Không tìm thấy nghệ sĩ" description="Nghệ sĩ bạn tìm không có trên AuraTune." />
  return <ArtistIdentity artist={artist} onCopy={copy} followControl={<FollowButton artistId={artist.id} onUnavailable={retry} />} />
}
