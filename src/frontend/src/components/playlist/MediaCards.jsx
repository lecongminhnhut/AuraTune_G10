import { UserRound } from 'lucide-react'
import Icon from '../common/Icon.jsx'
import CoverArt from './CoverArt.jsx'
import { Link } from '../../utils/navigation.jsx'

export const releaseYear = (date) => date?.slice(0, 4) ?? ''

// Ảnh đại diện nghệ sĩ; khi không có ảnh dùng biểu tượng trung tính (spec 091 FR-004).
export function ArtistAvatar({ artist, className = 'h-full w-full' }) {
  if (!artist?.cover) {
    return (
      <div role="img" aria-label="Ảnh nghệ sĩ chưa được cung cấp" className={`grid place-items-center rounded-full bg-zinc-800 text-zinc-500 ${className}`}>
        <UserRound className="h-1/2 w-1/2" strokeWidth={1.4} aria-hidden="true" />
      </div>
    )
  }
  return <CoverArt variant={artist.cover} className={`rounded-full ${className}`} />
}

export function AlbumCard({ album, artistName, onPlay }) {
  return (
    <article className="group relative min-w-0 rounded-xl bg-white/[0.035] p-3.5 transition duration-300 hover:bg-white/[0.085]">
      <div className="relative aspect-square">
        <Link to={`/album/${album.id}`} aria-label={`Xem album ${album.title}`} className="absolute inset-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">
          <CoverArt variant={album.cover} title={album.title} showLabel className="h-full w-full rounded-lg shadow-xl" />
        </Link>
        {onPlay && (
          <button type="button" onClick={() => onPlay(album)} aria-label={`Phát album ${album.title}`} className="absolute bottom-2 right-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-violet-300 text-zinc-950 shadow-xl transition duration-300 hover:scale-105 hover:bg-violet-200 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
            <Icon name="play" size={19} />
          </button>
        )}
      </div>
      <Link to={`/album/${album.id}`} className="mt-4 block truncate text-sm font-semibold text-white hover:underline">{album.title}</Link>
      <p className="mt-1 truncate text-xs text-zinc-400">{releaseYear(album.releaseDate)} · {artistName}</p>
    </article>
  )
}

export function ArtistCard({ artist, subtitle = 'Nghệ sĩ' }) {
  return (
    <Link to={`/artist/${artist.id}`} className="group block min-w-0 rounded-xl bg-white/[0.035] p-3.5 text-center transition duration-300 hover:bg-white/[0.085] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">
      <div className="mx-auto aspect-square w-full overflow-hidden rounded-full shadow-xl"><ArtistAvatar artist={artist} /></div>
      <p className="mt-4 truncate text-sm font-semibold text-white group-hover:underline">{artist.name}</p>
      <p className="mt-1 truncate text-xs text-zinc-400">{subtitle}</p>
    </Link>
  )
}

export function GenreTile({ genre }) {
  return (
    <Link to={`/explore?genre=${genre.id}`} className="group relative block h-24 overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 sm:h-28">
      <CoverArt variant={genre.cover} className="absolute inset-0 h-full w-full [&_.cover-motif]:text-6xl" />
      <span className="absolute left-3.5 top-3 text-base font-bold text-white drop-shadow">{genre.name}</span>
    </Link>
  )
}
