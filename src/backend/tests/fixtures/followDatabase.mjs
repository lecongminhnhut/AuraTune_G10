import { readFile } from 'node:fs/promises';
import { createArtistDatabase } from './artistDatabase.mjs';

export async function createFollowDatabase({migrate=true}={}) {
  const db = await createArtistDatabase();
  await db.exec(`
    ALTER TABLE users ADD COLUMN role text DEFAULT 'user';
    CREATE TABLE user_sessions (
      session_id text PRIMARY KEY, user_id text NOT NULL REFERENCES users(id),
      is_revoked boolean NOT NULL DEFAULT false, device_info text,
      expires_at timestamptz NOT NULL, inactive_at timestamptz NOT NULL
    );
    INSERT INTO user_sessions(session_id,user_id,expires_at,inactive_at) VALUES
      ('session-a','different-legacy-id-a',now()+interval '1 day',now()+interval '1 day'),
      ('session-b','different-legacy-id-b',now()+interval '1 day',now()+interval '1 day');
  `);
  try {
    if(migrate)await db.exec(await readFile(new URL('../../../database/migrations/005_artist_follows.sql', import.meta.url), 'utf8'));
    return db;
  } catch(error) { await db.close(); throw error; }
}

export function followSqlClient(db) {
  return { async rpc(name,args) {
    const params=[args.p_user_id,args.p_session_id,args.p_device ?? null];
    let sql;
    if(name==='artist_follow_list') {
      params.push(args.p_artist_id ?? null);
      sql='SELECT public.artist_follow_list($1,$2,$3,$4::bigint) AS result';
    } else if(name==='artist_follow_set') {
      params.push(args.p_artist_id,args.p_follow);
      sql='SELECT public.artist_follow_set($1,$2,$3,$4::bigint,$5::boolean) AS result';
    } else throw Error('Unknown RPC');
    try { return { data:(await db.query(sql,params)).rows[0].result,error:null }; }
    catch(error) { return {data:null,error:{code:error.code}}; }
  } };
}
