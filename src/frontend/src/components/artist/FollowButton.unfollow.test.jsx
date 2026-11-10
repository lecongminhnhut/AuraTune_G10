import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createFollowingState} from '../../hooks/useArtistFollowing.js';
test('confirmed following requests explicit DELETE, stays pending, then reconciles absence',async()=>{
  let rows=[{id:'2'}];let release;const operations=[];
  const state=createFollowingState({artistId:'2',isCurrent:()=>true,api:{list:async()=>rows,set:async(id,desired)=>{operations.push([id,desired]);await new Promise(resolve=>{release=resolve;});rows=[];}}});
  await state.load();assert.equal(state.getSnapshot().following,true);
  const action=state.change(false);assert.equal(state.getSnapshot().status,'pending');
  assert.equal(state.getSnapshot().following,true);release();assert.equal(await action,true);
  assert.deepEqual(operations,[['2',false]]);assert.equal(state.getSnapshot().following,false);state.dispose();
});
