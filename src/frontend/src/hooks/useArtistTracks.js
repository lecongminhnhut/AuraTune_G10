import {useEffect,useMemo,useSyncExternalStore} from 'react';
import {artistTrackApi} from '../services/artistTrackService.js';
import {currentAuthIdentity} from '../services/sessionApiClient.js';
const empty=()=>({status:'loading',data:null,error:null});
export function createArtistTracksState({isCurrent,api=artistTrackApi}) {
  let state={identity:empty(),catalog:empty(),stats:empty()};let disposed=false;
  const listeners=new Set();const requests=new Map();const generations={identity:0,catalog:0,stats:0};
  const publish=next=>{state=next;for(const listener of listeners)listener();};
  const active=(section,generation)=>!disposed && isCurrent() && generations[section]===generation;
  async function reload(section) {
    if(disposed || !isCurrent())return;
    if(section==='identity') {
      // Link changes invalidate every dependent projection, including requests
      // already in flight under the previous server-resolved Artist.
      for(const key of ['catalog','stats']){requests.get(key)?.abort();generations[key]++;}
      publish({identity:empty(),catalog:empty(),stats:empty()});
    }
    requests.get(section)?.abort();const controller=new AbortController();requests.set(section,controller);const generation=++generations[section];
    publish({...state,[section]:{...state[section],status:'loading',error:null}});
    try {
      const data=await api.read(section,{signal:controller.signal});
      if(!active(section,generation))return;
      if(section!=='identity' && data.artistId!==state.identity.data?.id)throw Error('Artist changed');
      publish({...state,[section]:{status:'ready',data,error:null}});
    } catch(error) {
      if(!active(section,generation))return;
      if(['auth','denied'].includes(error.kind)) {
        for(const request of requests.values())request.abort();
        for(const key of Object.keys(generations))generations[key]++;
        publish({identity:{status:'error',data:null,error:error.kind},catalog:empty(),stats:empty()});
      } else publish({...state,[section]:{...state[section],status:state[section].data?'stale':'error',error:error.kind || 'unavailable'}});
    }
  }
  async function load(){await reload('identity');if(state.identity.status==='ready')await Promise.all([reload('catalog'),reload('stats')]);}
  return {getSnapshot:()=>state,subscribe:listener=>{listeners.add(listener);return()=>listeners.delete(listener);},reload,load,
    activate(){disposed=false;},dispose(){disposed=true;for(const key of Object.keys(generations))generations[key]++;for(const request of requests.values())request.abort();listeners.clear();}};
}
export function useArtistTracks(origin) {
  const model=useMemo(()=>createArtistTracksState({isCurrent:()=>Boolean(origin) && currentAuthIdentity()===origin}),[origin]);
  const state=useSyncExternalStore(model.subscribe,model.getSnapshot,model.getSnapshot);
  useEffect(()=>{model.activate();if(origin)model.load();return()=>model.dispose();},[model,origin]);
  return {...state,retry:section=>section==='identity'?model.load():model.reload(section)};
}
