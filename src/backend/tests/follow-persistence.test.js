import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createFollowDatabase } from './fixtures/followDatabase.mjs';
let db;
before(async()=>{db=await createFollowDatabase();});
after(async()=>{await db?.close();});
const call=async(follow,id='2')=>(await db.query('SELECT artist_follow_set($1,$2,NULL,$3::bigint,$4) AS result',['account-a','session-a',id,follow])).rows[0].result;
const list=async(id=null)=>(await db.query('SELECT artist_follow_list($1,$2,NULL,$3::bigint) AS result',['account-a','session-a',id])).rows[0].result;
test('SQL stores canonical owner and duplicate preserves original timestamp',async()=>{
  await call(true);
  const first=await list('2');
  assert.equal(first.complete,true); assert.equal(first.artists[0].id,'2');
  assert.deepEqual(Object.keys(first.artists[0]).sort(),['followedAt','id','imageUrl','name']);
  await call(true); assert.deepEqual(await list('2'),first);
  assert.equal((await db.query('SELECT user_id FROM user_follows_artist')).rows[0].user_id,'account-a');
});
test('hide retains time, prevents negative recognition; owner can remove hidden pair safely',async()=>{
  const original=await list();
  await db.exec("UPDATE artists SET artist_visibility='hidden' WHERE artist_id=2");
  assert.deepEqual(await list(),{artists:[],complete:true});
  await assert.rejects(list('2'),e=>e.code==='P0404');
  await db.exec("UPDATE artists SET artist_visibility='public' WHERE artist_id=2");
  assert.deepEqual(await list(),original);
  await db.exec("UPDATE artists SET artist_visibility='hidden' WHERE artist_id=2");
  await call(false);
  await assert.rejects(call(false),e=>e.code==='P0404');
  await db.exec("UPDATE artists SET artist_visibility='public' WHERE artist_id=2");
  assert.deepEqual(await list(),{artists:[],complete:true});
});
test('no-op unfollow, refollow, exact SQL tie order and lossless bigint',async()=>{
  await call(false); await call(true); await call(true,'9007199254740993');
  await db.exec("UPDATE user_follows_artist SET created_at='2026-01-01 00:00:00.123456+00'");
  const rows=(await list()).artists;
  assert.deepEqual(rows.map(a=>a.id),['2','9007199254740993']);
  assert.match(rows[0].followedAt,/123456/);
  await call(false); await call(true);
  assert.notEqual((await list()).artists[0].followedAt,rows[0].followedAt);
});
test('hidden, unknown, banned, revoked and nonexistent sessions do not mutate',async()=>{
  for(const id of ['3','4','5','6','999'])await assert.rejects(call(true,id),e=>e.code==='P0404');
  await assert.rejects(db.query("SELECT artist_follow_set('account-b','session-b',NULL,2,true)"),e=>e.code==='P0403');
  await assert.rejects(db.query("SELECT artist_follow_list('account-a','missing',NULL,NULL)"),e=>e.code==='P0401');
  await db.exec("UPDATE user_sessions SET is_revoked=true WHERE session_id='session-a'");
  await assert.rejects(list(),e=>e.code==='P0401');
  await db.exec("UPDATE user_sessions SET is_revoked=false WHERE session_id='session-a'");
});
test('transaction rollback preserves relation and supplied FK deletion behavior',async()=>{
  const previous=await list();
  await db.exec('BEGIN'); await call(false); await db.exec('ROLLBACK');
  assert.deepEqual(await list(),previous);
  await assert.rejects(db.exec('DELETE FROM artists WHERE artist_id=2'),e=>e.code==='23503');
});
test('complete list is not capped at 1000 and SQL functions deny browser roles',async()=>{
  await db.exec("INSERT INTO artists(artist_id,name,artist_visibility) SELECT n,'Artist '||n,'public' FROM generate_series(10000,11005) n; INSERT INTO user_follows_artist(user_id,artist_id) SELECT 'account-a',n FROM generate_series(10000,11005) n;");
  assert.equal((await list()).artists.length,1008);
  for(const role of ['anon','authenticated']) {
    const result=await db.query("SELECT has_function_privilege($1,'public.artist_follow_set(text,text,text,bigint,boolean)','EXECUTE') AS allowed",[role]);
    assert.equal(result.rows[0].allowed,false);
  }
});
