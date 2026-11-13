import {Users,UserRound} from 'lucide-react';
import {useState} from 'react';
import {EmptyState,ErrorState,LoginRequired,PageHeader} from '../../components/common/ui.jsx';
import {useStore} from '../../context/AppStore.jsx';
import {Link} from '../../utils/navigation.jsx';
export function FollowedArtistImage({artist}) {
  const [failed,setFailed]=useState(false);
  let url=null;try{const source=new URL(artist.imageUrl);if(['http:','https:'].includes(source.protocol))url=source.href;}catch{}
  return url && !failed?<img src={url} alt={'Ảnh nghệ sĩ '+artist.name} onError={()=>setFailed(true)} referrerPolicy="no-referrer" className="h-full w-full rounded-full object-cover" />:<span role="img" aria-label="Ảnh nghệ sĩ chưa được cung cấp" className="grid h-full w-full place-items-center rounded-full bg-zinc-800 text-zinc-500"><UserRound size={44} /></span>;
}
export function FollowingList({state,onRetry}) {
  if(state.status==='loading')return <p role="status" className="py-8 text-sm text-zinc-400">Đang tải nghệ sĩ đang theo dõi…</p>;
  if(state.status!=='confirmed')return <ErrorState title="Không tải được nghệ sĩ đang theo dõi" onRetry={onRetry} />;
  if(!state.artists.length)return <EmptyState icon={Users} title="Bạn chưa theo dõi nghệ sĩ nào" description="Theo dõi nghệ sĩ để nhanh chóng tìm lại họ ở đây."><Link to="/explore" className="text-violet-300 underline">Khám phá nghệ sĩ</Link></EmptyState>;
  return <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{state.artists.map(artist=><Link key={artist.id} to={'/artist/'+encodeURIComponent(artist.id)} className="min-w-0 rounded-xl p-4 transition hover:bg-white/5 focus-visible:outline focus-visible:outline-violet-300"><div className="mx-auto aspect-square max-w-44"><FollowedArtistImage key={artist.id+'/'+artist.imageUrl} artist={artist} /></div><p className="mt-3 break-words font-semibold text-white">{artist.name}</p><p className="mt-1 text-xs text-zinc-400">Theo dõi từ {new Date(artist.followedAt).toLocaleDateString('vi-VN')}</p></Link>)}</div>;
}
export default function FollowingPage() {
  const store=useStore();const state=store.followingList;
  if(store.sessionRestoring)return <p role="status" className="p-8 text-zinc-400">Đang kiểm tra phiên đăng nhập…</p>;
  if(!store.currentUser || ['auth','denied'].includes(state.error))return <LoginRequired description="Đăng nhập để xem các nghệ sĩ bạn đang theo dõi." />;
  return <div className="pb-12"><PageHeader eyebrow="Thư viện" title="Nghệ sĩ đang theo dõi" description="Sắp xếp theo thời điểm bạn bắt đầu theo dõi, mới nhất trước." /><div className="px-5 sm:px-8"><FollowingList state={state} onRetry={state.retry} /></div></div>;
}
