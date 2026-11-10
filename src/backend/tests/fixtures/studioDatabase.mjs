import {readFile} from 'node:fs/promises';
import {createFollowDatabase} from './followDatabase.mjs';
export async function createStudioDatabase() {
  const db=await createFollowDatabase();
  try {
    await db.exec(`
      UPDATE users SET role='artist' WHERE user_id='account-a';
      INSERT INTO users(user_id,id,role) VALUES('unlinked','legacy-unlinked','artist'),('listener','legacy-listener','user'),('admin','legacy-admin','admin');
      INSERT INTO user_sessions(session_id,user_id,expires_at,inactive_at) SELECT 'session-'||user_id,id,now()+interval '1 day',now()+interval '1 day' FROM users WHERE user_id IN ('unlinked','listener','admin');
      CREATE TABLE albums(album_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,title text NOT NULL,artist_id bigint REFERENCES artists(artist_id),release_date date);
      CREATE TABLE songs(song_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,title text NOT NULL,duration integer,audio_url text NOT NULL,album_id bigint REFERENCES albums(album_id),genre text,total_plays integer DEFAULT 0);
      INSERT INTO albums(title,artist_id) VALUES('Own album',9007199254740993),('Other album',5);
      INSERT INTO songs(title,duration,audio_url,album_id,genre,total_plays) VALUES('Legacy unreviewed',180,'https://example.test/old.mp3',1,'ballad',100);
    `);
    await db.exec(await readFile(new URL('../../../database/migrations/006_artist_studio_reads.sql',import.meta.url),'utf8'));
    await db.exec(`
      INSERT INTO songs(title,duration,audio_url,album_id,genre,total_plays,management_artist_id,artist_preference) VALUES
      ('Owned active',180,'https://example.test/a.mp3',1,'ballad',7,9007199254740993,'active'),
      ('Owned hidden',0,'https://example.test/b.mp3',NULL,NULL,3,9007199254740993,'hidden'),
      ('Other private',120,'https://example.test/private.mp3',2,'indie',50,5,'hidden');
    `);
    return db;
  } catch(error) {await db.close();throw error;}
}
export function studioSqlClient(db) {
  return {async rpc(name,args) {
    if(name!=='artist_studio_read')throw Error('Unexpected RPC');
    try{return {data:(await db.query('SELECT artist_studio_read($1,$2,$3,$4) AS result',[args.p_user_id,args.p_session_id,args.p_device,args.p_section])).rows[0].result,error:null};}
    catch(error){return {data:null,error:{code:error.code}};}
  }};
}
