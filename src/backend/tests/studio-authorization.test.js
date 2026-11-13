import assert from 'node:assert/strict';
import {before,after,test} from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../utils/authHelpers.js';
import {createStudioDatabase,studioSqlClient} from './fixtures/studioDatabase.mjs';
import {createArtistTrackRepository} from '../repositories/artistTrackRepository.js';
import {createStudioRouter} from '../routes/studioRoutes.js';
let db,server,base;
before(async()=>{
  db=await createStudioDatabase();const app=express();app.use('/studio',createStudioRouter(createArtistTrackRepository({getClient:async()=>studioSqlClient(db)})));
  server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));base=`http://127.0.0.1:${server.address().port}`;
});
after(async()=>{await new Promise(resolve=>server?.close(resolve));await db?.close();});
const token=(user='account-a',session='session-a')=>jwt.sign({user_id:user,session_id:session},JWT_SECRET,{expiresIn:'1h'});
async function get(path,auth=token()) {const response=await fetch(base+path,{headers:auth?{Authorization:`Bearer ${auth}`}:{}});return {status:response.status,body:await response.json(),cache:response.headers.get('Cache-Control')};}
test('real Studio identity/catalog/stats enforce Artist role, server link and no owner selectors',async()=>{
  for(const path of ['/studio/me','/studio/me/tracks','/studio/me/stats']) {
    assert.equal((await get(path,null)).status,401);
    for(const user of ['admin','listener','unlinked'])assert.equal((await get(path,token(user,'session-'+user))).status,403);
    assert.equal((await get(path+'?artistId=5')).status,400);
    const own=await get(path);assert.equal(own.status,200);assert.match(own.cache,/private.*no-store/);
    assert.doesNotMatch(JSON.stringify(own.body),/Other private|example.test|audio_url|password|user_id/);
  }
});
test('hidden own profile is not Studio denial; revoked/banned/mismatched sessions are denial',async()=>{
  await db.exec("UPDATE artists SET artist_visibility='hidden' WHERE artist_id=9007199254740993");
  assert.equal((await get('/studio/me')).status,200);
  assert.equal((await get('/studio/me',token('different-legacy-id-a'))).status,401);
  await db.exec("UPDATE user_sessions SET is_revoked=true WHERE session_id='session-a'");
  assert.equal((await get('/studio/me')).status,401);
  await db.exec("UPDATE user_sessions SET is_revoked=false WHERE session_id='session-a';UPDATE users SET is_banned=true WHERE user_id='account-a'");
  const denied=await get('/studio/me');assert.equal(denied.status,403);assert.equal(denied.body.error.code,'USER_BANNED');
  await db.exec("UPDATE users SET is_banned=false WHERE user_id='account-a'");
});
test('unknown stored counter fails stats only; complete real catalog still succeeds',async()=>{
  await db.exec("UPDATE songs SET total_plays=NULL WHERE title='Owned hidden'");
  const failed=await get('/studio/me/stats');assert.equal(failed.status,500);assert.equal(failed.body.data,null);
  assert.equal((await get('/studio/me/tracks')).body.data.tracks.length,2);
});
