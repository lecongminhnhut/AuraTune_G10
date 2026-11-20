import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile} from 'node:fs/promises';
import {createFollowDatabase} from './fixtures/followDatabase.mjs';
const migration=await readFile(new URL('../../database/migrations/005_artist_follows.sql',import.meta.url),'utf8');
const supplied=`CREATE TABLE public.user_follows_artist(user_id text NOT NULL REFERENCES users(user_id),artist_id bigint NOT NULL REFERENCES artists(artist_id),created_at timestamptz DEFAULT now(),PRIMARY KEY(user_id,artist_id));`;
test('existing timestamp preserved exactly and nullable historic data stops rollout without backfill',async()=>{
  for(const time of [null,'2020-02-01 12:34:56.123456+00']) {
    const db=await createFollowDatabase({migrate:false});
    try {
      await db.exec(supplied);
      await db.query('INSERT INTO user_follows_artist VALUES($1,2,$2)',['account-a',time]);
      if(time===null) {
        await assert.rejects(db.exec(migration),/NULL created_at/);await db.exec('ROLLBACK');
        assert.equal((await db.query('SELECT created_at FROM user_follows_artist')).rows[0].created_at,null);
        assert.equal((await db.query("SELECT to_regprocedure('public.artist_follow_set(text,text,text,bigint,boolean)') AS fn")).rows[0].fn,null);
      } else {
        await db.exec(migration);
        const value=(await db.query("SELECT to_char(created_at AT TIME ZONE 'UTC','YYYY-MM-DD HH24:MI:SS.US') AS time FROM user_follows_artist")).rows[0].time;
        assert.equal(value,'2020-02-01 12:34:56.123456');
        await assert.rejects(db.exec("INSERT INTO user_follows_artist VALUES('account-a',3,NULL)"),e=>e.code==='23502');
      }
    } finally {await db.close();}
  }
});
