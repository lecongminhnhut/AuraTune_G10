import assert from 'node:assert/strict';
import { test } from 'node:test';
import { apiFetch, configureAuthContext } from './sessionApiClient.js';

test('refresh cannot replay an A mutation with B credentials or after logout',async()=>{
  const oldFetch=globalThis.fetch;
  try {
    for(const replacement of ['B','A-new-session',null]) {
      let origin='A'; let resolveRefresh; const sent=[];
      configureAuthContext({getAccessToken:()=>origin, getSessionIdentity:()=>origin,
        refreshSession:()=>new Promise(resolve=>{resolveRefresh=resolve;})});
      globalThis.fetch=async(url,options)=>{sent.push(options.headers.get('Authorization'));return new Response('{}',{status:401});};
      const request=apiFetch('/artists/2/follow',{method:'PUT'});
      await new Promise(resolve=>setTimeout(resolve,0));
      origin=replacement; resolveRefresh({ok:true,accessToken:replacement});
      await assert.rejects(request,e=>e.name==='AbortError');
      assert.deepEqual(sent,['Bearer A']);
    }
  } finally {globalThis.fetch=oldFetch;configureAuthContext({});}
});
test('one refresh for same origin may replay; 500 mutations are not replayed',async()=>{
  const oldFetch=globalThis.fetch;
  try {
    let count=0;let refreshes=0;
    configureAuthContext({getAccessToken:()=> 'old',getSessionIdentity:()=> 'same-session',refreshSession:async()=>{refreshes++;return {ok:true,accessToken:'renewed'};}});
    globalThis.fetch=async()=>new Response('{}',{status:++count===1?401:200});
    assert.equal((await apiFetch('/artists/2/follow',{method:'PUT'})).status,200);
    assert.equal(refreshes,1);assert.equal(count,2);
    count=0;globalThis.fetch=async()=>{count++;return new Response('{}',{status:500});};
    assert.equal((await apiFetch('/artists/2/follow',{method:'PUT'})).status,500);assert.equal(count,1);
  } finally {globalThis.fetch=oldFetch;configureAuthContext({});}
});
