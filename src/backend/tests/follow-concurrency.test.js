// Real PostgreSQL, independent psql connections. Opt-in, disposable container.
// FOLLOW_PG_CONTAINER must refer to the fixture container created in validation.
import assert from 'node:assert/strict';
import {test,before,after} from 'node:test';
import {readFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
const container=process.env.FOLLOW_PG_CONTAINER;
if(container && !/^auratune-follow-092-[a-z0-9-]+$/.test(container))throw Error('Only disposable 092 fixture containers are allowed');
const children=new Set();
function worker(sql,interactive=false) {
  const child=spawn('docker',['exec','-i',container,'psql','-X','-U','postgres','-d','auratune_follow_092','-v','ON_ERROR_STOP=1','-At','-f','-'],{stdio:['pipe','pipe','pipe']});
  children.add(child);let output='',errors='';
  child.stdout.on('data',data=>{output+=data;});child.stderr.on('data',data=>{errors+=data;});
  const done=new Promise((resolve,reject)=>{child.on('error',reject);child.on('exit',code=>{children.delete(child);resolve({code,output,errors});});});
  child.stdin.write(sql+'\n');if(!interactive)child.stdin.end();
  return {child,done,async ready(){const until=Date.now()+10000;while(!output.includes('WORKER_READY')){if(Date.now()>until)throw Error('No lock barrier: '+errors);await new Promise(resolve=>setTimeout(resolve,20));}},commit(){child.stdin.end('COMMIT;\n\\q\n');}};
}
async function query(sql) {const result=await worker(sql).done;assert.equal(result.code,0,result.errors);return result.output.trim();}
const set=value=>`SELECT artist_follow_set('account-a','session-a',NULL,2,${value});`;
const member=()=>query("SELECT count(*) FROM user_follows_artist WHERE user_id='account-a' AND artist_id=2;");
async function ordered(first,second,{failSecond=false}={}) {
  const a=worker(`SET application_name='follow-worker-a';BEGIN;${first}\n\\echo WORKER_READY`,true);
  await a.ready();
  const b=worker(`SET application_name='follow-worker-b';BEGIN;${second}${failSecond?'SELECT 1/0;':''}COMMIT;`);
  try {
    const until=Date.now()+10000;let waiting=false;
    while(Date.now()<until) {
      if(await query("SELECT count(*) FROM pg_stat_activity WHERE application_name='follow-worker-b' AND wait_event_type='Lock';")==='1'){waiting=true;break;}
      await new Promise(resolve=>setTimeout(resolve,20));
    }
    assert.equal(waiting,true,'second independent connection must actually block on a database lock');
  } finally {a.commit();}
  assert.equal((await a.done).code,0);
  const result=await b.done;
  assert.equal(result.code===0,!failSecond,result.errors);
  return result;
}
before(async()=>{
  if(!container)return;
  const migrations=await Promise.all(['003_artist_visibility.sql','004_artist_profile_read_policy.sql','005_artist_follows.sql'].map(file=>readFile(new URL('../../database/migrations/'+file,import.meta.url),'utf8')));
  await query(`CREATE ROLE anon;CREATE ROLE authenticated;CREATE ROLE service_role;
    CREATE TABLE users(user_id text PRIMARY KEY,id text UNIQUE NOT NULL,is_banned boolean NOT NULL DEFAULT false,role text DEFAULT 'user');
    CREATE TABLE artists(artist_id bigint PRIMARY KEY,user_id text,name text NOT NULL,biography text,image_url text,created_at timestamptz DEFAULT now());
    CREATE TABLE user_sessions(session_id text PRIMARY KEY,user_id text REFERENCES users(id),is_revoked boolean DEFAULT false,device_info text,expires_at timestamptz NOT NULL,inactive_at timestamptz NOT NULL);
    INSERT INTO users VALUES('account-a','legacy-a',false,'user'),('account-b','legacy-b',false,'admin');
    INSERT INTO user_sessions(session_id,user_id,expires_at,inactive_at) VALUES('session-a','legacy-a',now()+interval '1 day',now()+interval '1 day'),('session-b','legacy-b',now()+interval '1 day',now()+interval '1 day');
    INSERT INTO artists(artist_id,name)VALUES(2,'Independent Artist');\n${migrations.join('\n')}\nUPDATE artists SET artist_visibility='public' WHERE artist_id=2;`);
});
after(()=>{for(const child of children)child.kill();});
test('independent PostgreSQL connections: absent follow→unfollow and absent unfollow→follow',{skip:!container},async()=>{
  await ordered(set(true),set(false));assert.equal(await member(),'0');
  await ordered(set(false),set(true));assert.equal(await member(),'1');
});
test('concurrent duplicates preserve time; failed opposing transaction rolls back',{skip:!container},async()=>{
  const time=await query('SELECT created_at::text FROM user_follows_artist WHERE artist_id=2;');
  await ordered(set(true),set(true));assert.equal(await member(),'1');
  assert.equal(await query('SELECT created_at::text FROM user_follows_artist WHERE artist_id=2;'),time);
  await ordered(set(true),set(false),{failSecond:true});assert.equal(await member(),'1');
  assert.equal(await query('SELECT created_at::text FROM user_follows_artist WHERE artist_id=2;'),time);
});
test('hide writer orders after follow; next successful list omits retained pair',{skip:!container},async()=>{
  await ordered(set(true),"UPDATE artists SET artist_visibility='hidden' WHERE artist_id=2;");
  assert.equal(await member(),'1');
  const list=JSON.parse(await query("SELECT artist_follow_list('account-a','session-a',NULL,NULL);"));
  assert.deepEqual(list,{complete:true,artists:[]});
  await query("UPDATE artists SET artist_visibility='public' WHERE artist_id=2;");
});
test('unfollow then refollow creates a new instant and both connections read committed membership',{skip:!container},async()=>{
  const original=await query('SELECT created_at::text FROM user_follows_artist WHERE artist_id=2;');
  await ordered(set(false),set(true));
  const current=await query('SELECT created_at::text FROM user_follows_artist WHERE artist_id=2;');
  assert.notEqual(current,original);
  for(let i=0;i<2;i++) {
    const list=JSON.parse(await query("SELECT artist_follow_list('account-a','session-a',NULL,2);"));
    assert.equal(list.artists[0].id,'2');
  }
});
test('hide before follow rejects; different owners retain separate pairs; delete respects supplied FK',{skip:!container},async()=>{
  await query('DELETE FROM user_follows_artist;');
  const rejected=await ordered("UPDATE artists SET artist_visibility='hidden' WHERE artist_id=2;",set(true),{failSecond:true});
  assert.match(rejected.errors,/Artist not found/);assert.equal(await member(),'0');
  await query("UPDATE artists SET artist_visibility='public' WHERE artist_id=2;");
  await ordered(set(true),"SELECT artist_follow_set('account-b','session-b',NULL,2,true);");
  assert.equal(await query('SELECT count(*) FROM user_follows_artist;'),'2');
  const deleted=await ordered(set(true),'DELETE FROM artists WHERE artist_id=2;',{failSecond:true});
  assert.match(deleted.errors,/foreign key/);assert.equal(await query('SELECT count(*) FROM user_follows_artist;'),'2');
});
