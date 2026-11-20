import assert from 'node:assert/strict';
import {before,after,test} from 'node:test';
import {createStudioDatabase,studioSqlClient} from './fixtures/studioDatabase.mjs';
import {createArtistTrackRepository} from '../repositories/artistTrackRepository.js';
let db,repository;
const actor={userId:'account-a',sessionId:'session-a',device:null};
before(async()=>{db=await createStudioDatabase();repository=createArtistTrackRepository({getClient:async()=>studioSqlClient(db)});});
after(async()=>{await db?.close();});
test('explicit owner read includes standalone/hidden rows, excludes legacy inferred ownership and another artist',async()=>{
  const data=await repository.read(actor,'catalog');
  assert.equal(data.complete,true);assert.deepEqual(data.tracks.map(row=>row.title),['Owned active','Owned hidden']);
  assert.equal(data.tracks[1].album,null);assert.equal(data.tracks[1].durationSeconds,0);
  assert.doesNotMatch(JSON.stringify(data),/audio_url|example.test|Legacy unreviewed|Other private|user_id/);
  assert.equal((await repository.read(actor,'identity')).id,'9007199254740993');
});
test('hidden Artist retains Studio access while effective active count is zero',async()=>{
  await db.exec("UPDATE artists SET artist_visibility='hidden' WHERE artist_id=9007199254740993");
  assert.equal((await repository.read(actor,'identity')).profileVisibility,'hidden');
  assert.equal((await repository.read(actor,'stats')).activeTracks,'0');
  await db.exec("UPDATE artists SET artist_visibility='public' WHERE artist_id=9007199254740993");
});
test('soft deletion retains historical plays and source FKs, restriction is independent',async()=>{
  assert.deepEqual(await repository.read(actor,'stats'),{artistId:'9007199254740993',totalTracks:'2',activeTracks:'1',historicalPlays:'10'});
  await db.exec("UPDATE songs SET admin_restricted=true WHERE title='Owned active'");
  assert.equal((await repository.read(actor,'stats')).activeTracks,'0');
  await db.exec("UPDATE songs SET deleted_at=now() WHERE management_artist_id=9007199254740993");
  assert.equal((await repository.read(actor,'catalog')).tracks.length,0);
  assert.deepEqual(await repository.read(actor,'stats'),{artistId:'9007199254740993',totalTracks:'0',activeTracks:'0',historicalPlays:'10'});
  await db.exec('UPDATE songs SET deleted_at=NULL,admin_restricted=false');
});
test('missing stored plays fails stats without falsifying zero or breaking catalog',async()=>{
  await db.exec("UPDATE songs SET total_plays=NULL WHERE title='Owned hidden'");
  await assert.rejects(repository.read(actor,'stats'),error=>error.status===500);
  assert.equal((await repository.read(actor,'catalog')).tracks[1].totalPlays,null);
  await db.exec("UPDATE songs SET total_plays=3 WHERE title='Owned hidden'");
});
test('Artist-only current linked sessions; no Admin impersonation or automatic link creation',async()=>{
  for(const user of ['listener','admin','unlinked'])await assert.rejects(repository.read({userId:user,sessionId:'session-'+user,device:null},'identity'),error=>error.status===403);
  await assert.rejects(repository.read({...actor,sessionId:'missing'},'catalog'),error=>error.status===401);
  await db.exec("UPDATE users SET is_banned=true WHERE user_id='account-a'");
  await assert.rejects(repository.read(actor,'identity'),error=>error.status===403);
  await db.exec("UPDATE users SET is_banned=false WHERE user_id='account-a'");
});
test('complete aggregate exceeds row caps and preserves bigint IDs before JSON',async()=>{
  await db.exec("INSERT INTO songs(song_id,title,audio_url,management_artist_id,total_plays) OVERRIDING SYSTEM VALUE SELECT n,'Owned '||n,'https://example.test/fixture.mp3',9007199254740993,0 FROM generate_series(10000,11005)n; INSERT INTO songs(song_id,title,audio_url,management_artist_id,total_plays) OVERRIDING SYSTEM VALUE VALUES(9007199254740995,'Large ID','https://example.test/fixture.mp3',9007199254740993,0)");
  const data=await repository.read(actor,'catalog');assert.equal(data.tracks.length,1009);assert.equal(data.tracks.at(-1).id,'9007199254740995');
});
