// Disposable localhost-only SQL/API fixture. Never mounted by production server.
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../../utils/authHelpers.js';
import {createFollowDatabase,followSqlClient} from './followDatabase.mjs';
import {postgresArtistClient} from './artistDatabase.mjs';
import {createArtistRepository} from '../../repositories/artistRepository.js';
import {createFollowArtistRepository} from '../../repositories/followArtistRepository.js';
import {createArtistRouter} from '../../routes/artistRoutes.js';
import {createUserRouter} from '../../routes/userRoutes.js';
import {followTransportError} from '../../controllers/followArtistController.js';
const db=await createFollowDatabase();
await db.exec("UPDATE users SET is_banned=false WHERE user_id='account-b'");
const app=express();app.use(cors({origin:'http://localhost:5174',credentials:true}));app.use(express.json());
const users={a:{id:'different-legacy-id-a',user_id:'account-a',email:'a@fixture.test',display_name:'Fixture A',role:'user'},b:{id:'different-legacy-id-b',user_id:'account-b',email:'b@fixture.test',display_name:'Fixture B',role:'admin'}};
function session(actor){return {access_token:jwt.sign({user_id:users[actor].user_id,session_id:'session-'+actor},JWT_SECRET,{expiresIn:'1h'}),expires_in:3600};}
app.post('/api/v1/auth/login',(req,res)=>{
  const actor=req.body.email==='a@fixture.test'?'a':req.body.email==='b@fixture.test'?'b':null;
  if(!actor || req.body.password!=='Fixture123!')return res.status(401).json({success:false});
  res.cookie('fixture_actor',actor,{httpOnly:true,path:'/api/v1/auth',sameSite:'lax'});
  res.json({success:true,data:{user:users[actor],session:session(actor)}});
});
app.post('/api/v1/auth/refresh',(req,res)=>{
  const actor=/fixture_actor=([ab])/.exec(req.headers.cookie || '')?.[1];
  if(!actor)return res.status(401).json({status:'error'});
  res.json({status:'success',data:{...session(actor),user:users[actor]}});
});
app.post('/api/v1/auth/logout',(req,res)=>{res.clearCookie('fixture_actor',{path:'/api/v1/auth'});res.json({status:'success'});});
app.post('/__fixture/artist/:id/visibility',async(req,res)=>{
  if(!['public','hidden'].includes(req.body.visibility))return res.sendStatus(400);
  await db.query('UPDATE artists SET artist_visibility=$1 WHERE artist_id=$2',[req.body.visibility,req.params.id]);res.json({ok:true});
});
const follows=createFollowArtistRepository({getClient:async()=>followSqlClient(db)});
app.use('/api/v1/artists',createArtistRouter(createArtistRepository({getClient:async()=>postgresArtistClient(db)}),follows));
app.use('/api/v1/users',createUserRouter(follows));
app.get('/health',(req,res)=>res.json({fixture:true}));
app.use(followTransportError);
const server=app.listen(5098,'127.0.0.1',()=>console.log('092 disposable SQL fixture on 5098'));
function close(){server.close(async()=>{await db.close();process.exit(0);});}
process.on('SIGINT',close);process.on('SIGTERM',close);
