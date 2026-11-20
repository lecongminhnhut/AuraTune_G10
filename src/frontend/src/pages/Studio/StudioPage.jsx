import {useStore} from '../../context/AppStore.jsx';
import {useArtistTracks} from '../../hooks/useArtistTracks.js';
import {currentAuthIdentity} from '../../services/sessionApiClient.js';
import {LoginRequired,Forbidden,ErrorState,PageHeader} from '../../components/common/ui.jsx';
import {Link} from '../../utils/navigation.jsx';
const number=value=>value===null?'Chưa có dữ liệu':new Intl.NumberFormat('vi-VN').format(BigInt(value));
export function StudioReadView({state,onRetry}) {
  const {identity,catalog,stats}=state;
  if(identity.status==='loading')return <p role="status" className="p-8">Đang tải Studio…</p>;
  if(identity.error==='auth')return <LoginRequired description="Phiên đăng nhập không còn hợp lệ." />;
  if(identity.error==='denied')return <Forbidden description="Studio yêu cầu tài khoản nghệ sĩ đã liên kết và đang hoạt động. Liên hệ Admin để kiểm tra liên kết." />;
  if(!identity.data)return <ErrorState title="Không tải được Studio" onRetry={()=>onRetry('identity')} />;
  return <div className="pb-12"><PageHeader eyebrow="Artist Studio" title={identity.data.name} description="Danh sách bài hát thuộc quyền quản lý của bạn."><Link to={'/artist/'+encodeURIComponent(identity.data.id)} className="text-violet-300 underline">Xem hồ sơ công khai</Link></PageHeader>
    <div className="space-y-6 px-5 sm:px-8"><section aria-label="Thống kê"><SectionStatus section={stats} label="thống kê" retry={()=>onRetry('stats')} />
      {stats.data && <dl className="grid gap-4 sm:grid-cols-3">{[['Bài hát','totalTracks'],['Đang công khai','activeTracks'],['Tổng lượt nghe','historicalPlays']].map(([label,key])=><div key={key} className="rounded-xl bg-white/5 p-4"><dt>{label}</dt><dd className="text-2xl font-bold">{number(stats.data[key])}</dd></div>)}</dl>}
    </section><section aria-label="Bài hát của bạn"><SectionStatus section={catalog} label="danh sách bài hát" retry={()=>onRetry('catalog')} />
      {catalog.data && (catalog.data.tracks.length?<ul className="divide-y divide-white/10">{catalog.data.tracks.map(track=><li key={track.id} className="py-4"><p className="font-semibold">{track.title}</p><p className="text-sm text-zinc-400">{track.album?.title || 'Không có album'} · {track.genre || 'Chưa có thể loại'} · {track.durationSeconds===null?'Chưa có thời lượng':Math.floor(track.durationSeconds/60)+':'+String(track.durationSeconds%60).padStart(2,'0')}</p><p className="text-sm">{number(track.totalPlays)} lượt nghe · {track.adminRestricted?'Bị hạn chế':track.artistPreference==='hidden'?'Đang ẩn':identity.data.profileVisibility==='public'?'Công khai':'Hồ sơ chưa công khai'}</p></li>)}</ul>:<p>Chưa có bài hát được xác nhận thuộc quyền quản lý của bạn.</p>)}
    </section></div></div>;
}
function SectionStatus({section,label,retry}) {
  if(section.status==='loading')return <p role="status">Đang tải {label}…</p>;
  if(['error','stale'].includes(section.status))return <div role="alert"><p>{section.status==='stale'?'Dữ liệu cũ chưa được cập nhật: ':'Không tải được '}{label}.</p><button type="button" onClick={retry} className="text-violet-300 underline">Thử lại {label}</button></div>;
  return null;
}
export default function StudioPage() {
  const store=useStore();const state=useArtistTracks(store.currentUser && !store.sessionRestoring?currentAuthIdentity():null);
  if(store.sessionRestoring)return <p role="status" className="p-8">Đang kiểm tra phiên đăng nhập…</p>;
  if(!store.currentUser)return <LoginRequired description="Đăng nhập bằng tài khoản nghệ sĩ để mở Studio." />;
  return <StudioReadView state={state} onRetry={state.retry} />;
}
