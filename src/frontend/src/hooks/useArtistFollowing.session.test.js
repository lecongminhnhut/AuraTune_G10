import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createFollowingState} from './useArtistFollowing.js';
import {createFollowArtistApi} from '../services/followArtistService.js';
import {configureAuthContext} from '../services/sessionApiClient.js';
test('origin-bound controller and refresh client never send A pending action under B/new-session credentials',async()=>{
  const originalFetch=globalThis.fetch;
  try {
    for(const replacement of ['B','A-new-session',null]) {
      let identity='A';let release;let started;
      const refreshing=new Promise(resolve=>{started=resolve;});const writes=[];
      configureAuthContext({getAccessToken:()=>identity,getSessionIdentity:()=>identity,refreshSession:()=>{started();return new Promise(resolve=>{release=resolve;});}});
      globalThis.fetch=async(url,options)=>{
        if(options.method==='GET')return new Response(JSON.stringify({success:true,error:null,data:{complete:true,artists:[]}}));
        writes.push(options.headers.get('Authorization'));return new Response('{}',{status:401});
      };
      const state=createFollowingState({artistId:'2',isCurrent:()=>identity==='A',api:createFollowArtistApi()});
      await state.load();const action=state.change(true);await refreshing;
      identity=replacement;release({ok:true,accessToken:replacement});
      assert.equal(await action,false);assert.deepEqual(writes,['Bearer A']);state.dispose();
    }
  } finally {globalThis.fetch=originalFetch;configureAuthContext({});}
});
