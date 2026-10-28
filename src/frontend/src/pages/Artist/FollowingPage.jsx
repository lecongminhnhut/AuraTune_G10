import { useMemo } from 'react'
import { Users } from 'lucide-react'
import { ArtistCard } from '../../components/playlist/MediaCards.jsx'
import { EmptyState, LoginRequired, PageHeader } from '../../components/common/ui.jsx'
import { useStore } from '../../context/AppStore.jsx'
import { getArtist } from '../../utils/mockData.js'
import { Link } from '../../utils/navigation.jsx'

const followedLabel = (iso) => `Theo dõi từ ${new Date(iso).toLocaleDateString('vi-VN')}`

// Danh sách nghệ sĩ đang theo dõi (spec 092 FR-007, FR-008, FR-013, FR-014).
export default function FollowingPage() {
  const store = useStore()
  const follows = store.library.follows
  const visible = useMemo(() => [...follows]
    .sort((a, b) => b.followedAt.localeCompare(a.followedAt) || a.artistId.localeCompare(b.artistId))
    .map((item) => ({ ...item, artist: getArtist(item.artistId) }))
    .filter((item) => item.artist?.isPublic), [follows])

  if (!store.currentUser) return <LoginRequired description="Đăng nhập để xem các nghệ sĩ bạn đang theo dõi." />

  return (
    <div className="pb-12">
      <PageHeader eyebrow="Thư viện" title="Nghệ sĩ đang theo dõi" description="Sắp xếp theo thời điểm bạn bắt đầu theo dõi, mới nhất trước." />
      <div className="px-5 sm:px-8">
        {visible.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map(({ artist, followedAt }) => <ArtistCard key={artist.id} artist={artist} subtitle={followedLabel(followedAt)} />)}
          </div>
        ) : (
          <EmptyState icon={Users} title="Bạn chưa theo dõi nghệ sĩ nào" description="Theo dõi nghệ sĩ để nhanh chóng tìm lại họ ở đây.">
            <Link to="/explore" className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-white transition hover:border-white/50">Khám phá nghệ sĩ</Link>
          </EmptyState>
        )}
      </div>
    </div>
  )
}
