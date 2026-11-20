import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createArtistTracksState} from './useArtistTracks.js';
test('catalog and stats survive peer errors, stale refresh stays labelled, and account replacement ignores old replies',async()=>{
  let fail=false;let current=true;
  const api={read:async section=>{
    if(section==='identity')return {id:'1',name:'Artist'};
    if(section==='stats' && fail)throw Error('unavailable');
    return section==='stats'?{artistId:'1',totalTracks:'1',activeTracks:'1',historicalPlays:'7'}:{artistId:'1',complete:true,tracks:[{id:'2'}]};
  }};
  const state=createArtistTracksState({isCurrent:()=>current,api});await state.load();
  assert.equal(state.getSnapshot().catalog.status,'ready');
  fail=true;await state.reload('stats');assert.equal(state.getSnapshot().stats.status,'stale');assert.equal(state.getSnapshot().stats.data.historicalPlays,'7');assert.equal(state.getSnapshot().catalog.status,'ready');
  current=false;await state.reload('catalog');state.dispose();
});
test('section ownership mismatch is never composed under another Artist header',async()=>{
  const state=createArtistTracksState({isCurrent:()=>true,api:{read:async section=>section==='identity'?{id:'1'}:{artistId:'2',complete:true,tracks:[]}}});
  await state.load();assert.equal(state.getSnapshot().catalog.data,null);assert.equal(state.getSnapshot().catalog.status,'error');state.dispose();
});
test('account replacement suppresses in-flight results and denial clears successful private peers',async()=>{
  let current=true;let release;let deny=false;
  const state=createArtistTracksState({isCurrent:()=>current,api:{read:async section=>{
    if(section==='identity')return {id:'1'};
    if(deny)throw Object.assign(Error('denied'),{kind:'denied'});
    if(section==='catalog')return {artistId:'1',tracks:[]};
    return new Promise(resolve=>{release=resolve;});
  }}});
  const pending=state.load();while(!release)await Promise.resolve();current=false;
  release({artistId:'1',historicalPlays:'7'});await pending;
  assert.equal(state.getSnapshot().stats.data,null);
  current=true;deny=true;await state.reload('catalog');
  assert.equal(state.getSnapshot().identity.error,'denied');assert.equal(state.getSnapshot().catalog.data,null);state.dispose();
});
test('refreshing server identity clears prior link projections before loading the replacement',async()=>{
  let id='1';
  const state=createArtistTracksState({isCurrent:()=>true,api:{read:async section=>section==='identity'?{id}:{artistId:id,tracks:[]}}});
  await state.load();id='2';const refresh=state.reload('identity');
  assert.equal(state.getSnapshot().catalog.data,null);await refresh;
  assert.equal(state.getSnapshot().identity.data.id,'2');state.dispose();
});
