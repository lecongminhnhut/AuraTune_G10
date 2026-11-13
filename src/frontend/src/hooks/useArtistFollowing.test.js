import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createFollowingState } from './useArtistFollowing.js';
test('unknown state is not false; pending desired operation reconciles authoritative state',async()=>{
  let rows=[];let release;
  const state=createFollowingState({artistId:'2',isCurrent:()=>true,api:{list:async()=>rows,set:()=>new Promise(resolve=>{release=()=>{rows=[{id:'2'}];resolve();};})}});
  assert.equal(state.getSnapshot().following,null);await state.load();assert.equal(state.getSnapshot().following,false);
  const change=state.change(true);assert.equal(state.getSnapshot().status,'pending');release();await change;
  assert.equal(state.getSnapshot().following,true);state.dispose();
});
test('lost commit response reconciles without replay; failed reconciliation remains unresolved',async()=>{
  let writes=0;let reads=0;
  const state=createFollowingState({artistId:'2',isCurrent:()=>true,api:{list:async()=>{if(++reads===1)return [];throw Error('offline');},set:async()=>{writes++;throw Error('lost');}}});
  await state.load();await state.change(true);assert.equal(writes,1);assert.equal(state.getSnapshot().following,null);assert.equal(state.getSnapshot().status,'error');
  state.dispose();
});
test('account replacement and delayed pre-mutation read cannot overwrite latest state',async()=>{
  let current=true;let resolve;
  const state=createFollowingState({artistId:'2',isCurrent:()=>current,api:{list:()=>new Promise(done=>{resolve=done;})}});
  const request=state.load();current=false;resolve([{id:'2'}]);await request;
  assert.equal(state.getSnapshot().following,null);state.dispose();
});
test('StrictMode cleanup/setup can reactivate without accepting obsolete responses',async()=>{
  const state=createFollowingState({artistId:'2',isCurrent:()=>true,api:{list:async()=>[{id:'2'}]}});
  state.dispose();state.activate();await state.load();assert.equal(state.getSnapshot().following,true);state.dispose();
});
test('lost response after commit can reconcile true without claiming acknowledged success',async()=>{
  let committed=false;let writes=0;
  const state=createFollowingState({artistId:'2',isCurrent:()=>true,api:{list:async()=>committed?[{id:'2'}]:[],set:async()=>{writes++;committed=true;throw Error('lost response');}}});
  await state.load();assert.equal(await state.change(true),false);assert.equal(writes,1);
  assert.equal(state.getSnapshot().following,true);assert.match(state.getSnapshot().notice,/Chưa xác nhận/);state.dispose();
});
test('late reconciliation cannot replace a newer opposite-device state read',async()=>{
  let reads=0;let release;let started;
  const pending=new Promise(resolve=>{started=resolve;});
  const state=createFollowingState({artistId:'2',isCurrent:()=>true,api:{list:async()=>{reads++;if(reads===2){started();return new Promise(resolve=>{release=resolve;});}return [];},set:async()=>{}}});
  await state.load();const change=state.change(true);await pending;await state.load();release([{id:'2'}]);await change;
  assert.equal(state.getSnapshot().following,false);state.dispose();
});
