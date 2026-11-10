import assert from 'node:assert/strict';
import {test} from 'node:test';
import {apiFetch,configureAuthContext} from './sessionApiClient.js';
test('Studio FormData retains browser boundary and ambiguous POST is not replayed',async()=>{
  const old=globalThis.fetch;let calls=0;
  configureAuthContext({getAccessToken:()=> 'fixture',getSessionIdentity:()=> 'fixture-session'});
  try {
    globalThis.fetch=async(url,options)=>{calls++;assert.equal(options.headers.has('Content-Type'),false);return new Response('{}',{status:500});};
    await apiFetch('/songs',{method:'POST',body:new FormData()});assert.equal(calls,1);
  } finally {globalThis.fetch=old;configureAuthContext({});}
});
