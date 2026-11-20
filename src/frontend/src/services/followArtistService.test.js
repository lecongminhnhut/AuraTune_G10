import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createFollowArtistApi } from './followArtistService.js';
const response=(data,status=200)=>new Response(JSON.stringify({success:status===200,message:'ok',data,error:status===200?null:{code:'INTERNAL_ERROR'}}),{status});
test('complete targeted list and desired PUT/DELETE map only approved fields',async()=>{
  const calls=[];const api=createFollowArtistApi({request:async(url,options)=>{calls.push([url,options]);return response(options.method==='GET'?{complete:true,artists:[{id:'2',name:'Artist',imageUrl:null,followedAt:'2026-01-01T00:00:00.123456Z',private:'secret'}]}:null);}});
  const list=await api.list('2');assert.equal(list.length,1);assert.equal(list[0].private,undefined);
  await api.set('2',true);await api.set('2',false);
  assert.match(calls[0][0],/following-artists\?artistId=2$/);
  assert.deepEqual(calls.slice(1).map(c=>c[1].method),['PUT','DELETE']);
  assert.equal(calls[1][1].body,undefined);
});
test('partial/malformed list and ambiguous mutation failure never become confirmed empty/success',async()=>{
  for(const data of [{complete:false,artists:[]},{artists:[]},{complete:true,artists:[{id:'2'}]}]) {
    await assert.rejects(createFollowArtistApi({request:async()=>response(data)}).list(),e=>e.kind==='unavailable');
  }
  await assert.rejects(createFollowArtistApi({request:async()=>response(null,500)}).set('2',true),e=>e.kind==='uncertain');
});
