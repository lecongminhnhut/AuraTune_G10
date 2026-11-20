import assert from 'node:assert/strict';
import { before,after,test } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/authHelpers.js';
import { createFollowDatabase,followSqlClient } from './fixtures/followDatabase.mjs';
import { postgresArtistClient } from './fixtures/artistDatabase.mjs';
import { createArtistRepository } from '../repositories/artistRepository.js';
import { createFollowArtistRepository } from '../repositories/followArtistRepository.js';
import { createArtistRouter } from '../routes/artistRoutes.js';
import { createUserRouter } from '../routes/userRoutes.js';
import { followTransportError } from '../controllers/followArtistController.js';
let db,server,base;
const token=(user='account-a',session='session-a')=>jwt.sign({user_id:user,session_id:session},JWT_SECRET,{expiresIn:'1h'});
before(async()=>{
  db=await createFollowDatabase();const app=express();app.use(express.json());
  const follows=createFollowArtistRepository({getClient:async()=>followSqlClient(db)});
  app.use('/api/v1/artists',createArtistRouter(createArtistRepository({getClient:async()=>postgresArtistClient(db)}),follows));
  app.use('/api/v1/users',createUserRouter(follows));
  app.use(followTransportError);
  server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));base=`http://127.0.0.1:${server.address().port}/api/v1`;
});
after(async()=>{await new Promise(resolve=>server?.close(resolve));await db?.close();});
async function request(path,method='GET',auth=token(),body){
  const headers={};if(auth)headers.Authorization=`Bearer ${auth}`;
  if(body!==undefined)headers['Content-Type']='application/json';
  const response=await fetch(base+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
  return {status:response.status,body:await response.json(),cache:response.headers.get('Cache-Control')};
}
test('own follow/list/delete uses shared envelopes and rejects guest, bad session, banned and selectors',async()=>{
  assert.equal((await request('/artists/2/follow','PUT',null)).status,401);
  assert.equal((await request('/artists/2/follow','PUT',token('account-a','missing'))).status,401);
  const banned=await request('/artists/2/follow','PUT',token('account-b','session-b'));
  assert.equal(banned.status,403);assert.equal(banned.body.error.code,'USER_BANNED');
  assert.equal((await request('/artists/2/follow','PUT',token(),{user_id:'account-b'})).status,400);
  assert.equal((await request('/users/me/following-artists?user_id=account-b')).status,400);
  for(const role of ['user','artist','admin']) {
    await db.query('UPDATE users SET role=$1 WHERE user_id=$2',[role,'account-a']);
    const result=await request('/artists/2/follow','PUT');
    assert.equal(result.status,200);assert.equal(result.body.data,null);assert.match(result.cache,/private.*no-store/);
    assert.equal((await request('/artists/2/follow','DELETE',token(),{user_id:'account-b'})).status,400);
    assert.equal((await request('/users/me/following-artists?user_id=account-b')).status,400);
  }
  const list=await request('/users/me/following-artists?artistId=2');
  assert.equal(list.status,200);assert.equal(list.body.data.complete,true);assert.equal(list.body.data.artists[0].id,'2');
  assert.equal((await request('/artists/2/follow','DELETE')).status,200);
  assert.deepEqual((await request('/users/me/following-artists')).body.data,{complete:true,artists:[]});
});
test('hidden owner removal does not use public GET guard; unknown has exact same safe rejection',async()=>{
  await request('/artists/2/follow','PUT');
  await db.exec("UPDATE artists SET artist_visibility='hidden' WHERE artist_id=2");
  const unknown=await request('/artists/999/follow','PUT');
  assert.deepEqual((await request('/artists/2/follow','PUT')).body,unknown.body);
  assert.equal((await request('/artists/2/follow','DELETE')).status,200);
  assert.deepEqual((await request('/artists/2/follow','DELETE')).body,(await request('/artists/999/follow','DELETE')).body);
  assert.equal((await request('/users/me/following-artists?artistId=2')).status,404);
  assert.equal((await request('/artists/9007199254740993','GET',null)).status,200);
});
test('revoked, expired, forged, mismatched canonical owner and malformed IDs are denied',async()=>{
  const expired=jwt.sign({user_id:'account-a',session_id:'session-a'},JWT_SECRET,{expiresIn:-1});
  assert.equal((await request('/artists/3/follow','PUT',expired)).body.error.code,'TOKEN_EXPIRED');
  assert.equal((await request('/artists/3/follow','PUT','forged')).status,401);
  assert.equal((await request('/artists/3/follow','PUT',token('different-legacy-id-a','session-a'))).status,401);
  assert.equal((await request('/artists/%25ZZ/follow','PUT')).status,400);
  await db.exec("UPDATE user_sessions SET is_revoked=true WHERE session_id='session-a'");
  assert.equal((await request('/users/me/following-artists')).status,401);
  await db.exec("UPDATE user_sessions SET is_revoked=false WHERE session_id='session-a'");
});
test('a committed old PUT response arriving after DELETE cannot resurrect membership',async()=>{
  await db.exec("UPDATE artists SET artist_visibility='public' WHERE artist_id=2");
  const repository=createFollowArtistRepository({getClient:async()=>followSqlClient(db)});
  let release;let observed;
  const blocked=new Promise(resolve=>{release=resolve;});const committed=new Promise(resolve=>{observed=resolve;});
  const delayed={...repository,set:async(...args)=>{const result=await repository.set(...args);if(args[2]){observed();await blocked;}return result;}};
  const app=express();app.use(express.json());app.use('/artists',createArtistRouter(createArtistRepository({getClient:async()=>postgresArtistClient(db)}),delayed));
  const extra=app.listen(0,'127.0.0.1');await new Promise(resolve=>extra.once('listening',resolve));
  const endpoint=`http://127.0.0.1:${extra.address().port}/artists/2/follow`;
  try {
    const put=fetch(endpoint,{method:'PUT',headers:{Authorization:`Bearer ${token()}`}});
    await committed;
    assert.equal((await fetch(endpoint,{method:'DELETE',headers:{Authorization:`Bearer ${token()}`}})).status,200);
    release();assert.equal((await put).status,200);
    assert.deepEqual((await request('/users/me/following-artists?artistId=2')).body.data.artists,[]);
  } finally {release();await new Promise(resolve=>extra.close(resolve));}
});
test('storage outage has a safe failure envelope, never memory/demo/empty success',async()=>{
  const repository=createFollowArtistRepository({getClient:async()=>{throw Error('private storage diagnostic');}});
  const app=express();app.use('/users',createUserRouter(repository));
  const extra=app.listen(0,'127.0.0.1');await new Promise(resolve=>extra.once('listening',resolve));
  try {
    const response=await fetch(`http://127.0.0.1:${extra.address().port}/users/me/following-artists`,{headers:{Authorization:`Bearer ${token()}`}});
    const body=await response.json();assert.equal(response.status,500);assert.equal(body.data,null);assert.equal(body.error.code,'INTERNAL_ERROR');
    assert.doesNotMatch(JSON.stringify(body),/private storage diagnostic|account-a|session-a/);
  } finally {await new Promise(resolve=>extra.close(resolve));}
});
test('malformed JSON on a personal follow request uses safe JSON instead of an HTML stack',async()=>{
  const response=await fetch(base+'/artists/2/follow',{method:'PUT',headers:{Authorization:`Bearer ${token()}`,'Content-Type':'application/json'},body:'{'});
  assert.equal(response.status,400);assert.match(response.headers.get('Content-Type'),/application\/json/);
  const body=await response.json();assert.equal(body.error.code,'VALIDATION_ERROR');assert.equal(body.data,null);
});
