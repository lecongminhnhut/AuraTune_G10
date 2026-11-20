import { useEffect,useMemo,useSyncExternalStore } from 'react';
import { followArtistApi } from '../services/followArtistService.js';
import { currentAuthIdentity } from '../services/sessionApiClient.js';

export function createFollowingState({artistId=null,isCurrent,api=followArtistApi}) {
  let state={status:'loading',following:null,artists:[],error:null};
  let generation=0;let disposed=false;const listeners=new Set();const controllers=new Set();
  const active=number=>!disposed && number===generation && isCurrent();
  const publish=value=>{state=value;for(const listener of listeners)listener();};
  const begin=()=>{for(const c of controllers)c.abort();controllers.clear();const c=new AbortController();controllers.add(c);return c;};
  async function load() {
    const number=++generation;const c=begin();
    publish({status:'loading',following:null,artists:[],error:null});
    try {
      const artists=await api.list(artistId,{signal:c.signal});
      if(!active(number))return false;
      publish({status:'confirmed',artists,following:artistId===null?null:artists.some(row=>row.id===artistId),error:null});
      return true;
    } catch(error) {
      if(active(number))publish({status:'error',following:null,artists:[],error:error.kind || 'unavailable'});
      return false;
    } finally {controllers.delete(c);}
  }
  async function change(follow) {
    if(state.status!=='confirmed' || artistId===null || !isCurrent() || disposed)return false;
    const number=++generation;const c=begin();
    publish({...state,status:'pending',error:null});let acknowledged=false;
    try {await api.set(artistId,follow,{signal:c.signal});acknowledged=true;}
    catch(error) {
      if(!active(number))return false;
      if(['auth','denied','not-found'].includes(error.kind)) {
        publish({status:'error',following:null,artists:[],error:error.kind});return false;
      }
    } finally {controllers.delete(c);}
    if(!active(number))return false;
    // Always reconcile: a response lost after commit is not a definite failure,
    // and another device may have processed an opposite operation meanwhile.
    const confirmed=await load();
    if(confirmed && !acknowledged && !disposed && isCurrent())publish({...state,notice:'Chưa xác nhận được thao tác trước. Trạng thái hiện tại đã được tải lại.'});
    return acknowledged && confirmed && isCurrent();
  }
  return {getSnapshot:()=>state,subscribe:listener=>{listeners.add(listener);return()=>listeners.delete(listener);},load,change,
    activate(){disposed=false;},
    dispose(){disposed=true;generation++;for(const c of controllers)c.abort();controllers.clear();listeners.clear();}};
}

export function useArtistFollowing(origin,artistId=null) {
  const model=useMemo(()=>createFollowingState({artistId,isCurrent:()=>Boolean(origin) && currentAuthIdentity()===origin}),[origin,artistId]);
  const state=useSyncExternalStore(model.subscribe,model.getSnapshot,model.getSnapshot);
  useEffect(()=>{
    model.activate();
    if(origin)model.load();
    // The initiating control already reconciles itself. Refresh only the shared
    // list so an uncertain-operation notice is not immediately cleared.
    const reload=()=>{if(origin && artistId===null)model.load();};
    globalThis.addEventListener?.('auratune-following-changed',reload);
    return()=>{globalThis.removeEventListener?.('auratune-following-changed',reload);model.dispose();};
  },[model,origin]);
  return {...state,retry:model.load,change:model.change};
}
