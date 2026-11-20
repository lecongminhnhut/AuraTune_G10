import {useEffect} from 'react';
import {Check,Loader2,UserPlus} from 'lucide-react';
import {useStore} from '../../context/AppStore.jsx';
import {useArtistFollowing} from '../../hooks/useArtistFollowing.js';
import {currentAuthIdentity} from '../../services/sessionApiClient.js';
import {Link,loginPath} from '../../utils/navigation.jsx';
const buttonClass='inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-xs font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300 disabled:cursor-wait disabled:opacity-60';
export function FollowControl({state,onChange,onRetry}) {
  if(state.status==='loading')return <span role="status" className="text-xs text-zinc-400">Đang kiểm tra theo dõi…</span>;
  if(state.status==='error')return <span role="status" className="text-xs text-zinc-400">Chưa xác định được trạng thái. <button type="button" onClick={onRetry} className={buttonClass}>Thử lại</button></span>;
  const pending=state.status==='pending';
  return <span className="inline-flex flex-wrap items-center gap-2"><button type="button" disabled={pending} aria-pressed={state.following} onClick={()=>onChange(!state.following)} className={buttonClass}>
    {pending?<Loader2 size={15} className="animate-spin" />:state.following?<Check size={15} />:<UserPlus size={15} />}
    {pending?'Đang cập nhật…':state.following?'Đang theo dõi':'Theo dõi'}
  </button>{state.notice && <span role="status" className="text-xs text-zinc-400">{state.notice}</span>}</span>;
}
export default function FollowButton({artistId,onUnavailable}) {
  const store=useStore();
  const origin=currentAuthIdentity();
  const state=useArtistFollowing(origin,artistId);
  useEffect(()=>{if(state.error==='not-found')onUnavailable?.();},[state.error,onUnavailable]);
  if(store.sessionRestoring)return <span role="status" className="text-xs text-zinc-400">Đang kiểm tra phiên đăng nhập…</span>;
  if(!origin || !store.currentUser)return <Link to={loginPath()} className={buttonClass}><UserPlus size={15} />Đăng nhập để theo dõi</Link>;
  if(['auth','denied'].includes(state.error))return <span role="status" className="text-xs text-zinc-400">Không thể sử dụng theo dõi với phiên hiện tại. <Link to={loginPath()} className={buttonClass}>Đăng nhập lại</Link></span>;
  return <FollowControl state={state} onRetry={state.retry} onChange={async follow=>{
    const confirmed=await state.change(follow);
    if(currentAuthIdentity()!==origin)return;
    window.dispatchEvent(new Event('auratune-following-changed'));
    if(confirmed)store.toast('Đã tải lại trạng thái theo dõi.');
  }} />;
}
