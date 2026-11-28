import CoverArt from '../playlist/CoverArt.jsx'

export default function TrackCover({ track, className = '' }) {
  const image = track?.coverUrl || track?.coverArt || track?.cover_url || track?.artwork || null
  return <CoverArt variant="aurora" backgroundVariant={track?.cover || 'aurora'} coverArt={image} title={track?.title} className={className} />
}
