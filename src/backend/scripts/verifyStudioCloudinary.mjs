// Opt-in external capability probe: only a UUID-named synthetic MP3 is uploaded
// and cleanup of that exact ID is attempted even after an ambiguous upload.
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import dotenv from 'dotenv';
dotenv.config({quiet:true});
const required=['CLOUDINARY_CLOUD_NAME','CLOUDINARY_API_KEY','CLOUDINARY_API_SECRET'];
const missing=required.filter(name=>!process.env[name]);
if(missing.length) {console.log(JSON.stringify({configured:false,missing}));process.exitCode=1;}
else {
  const {v2:cloudinary}=await import('cloudinary');
  cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET,secure:true});
  const folder=await mkdtemp(path.join(tmpdir(),'auratune-093-media-'));
  const publicId='auratune/093-validation/'+randomUUID();
  const options={resource_type:'video',type:'authenticated',format:'mp3'};
  const result={configured:true,uploaded:false,unsignedDenied:false,signedRange:false,cleaned:false};
  try {
    const file=path.join(folder,'synthetic.mp3');
    await promisify(execFile)('ffmpeg',['-hide_banner','-loglevel','error','-f','lavfi','-i','sine=frequency=440:duration=0.25','-codec:a','libmp3lame','-y',file]);
    const saved=await cloudinary.uploader.upload(file,{...options,public_id:publicId,overwrite:false});
    result.uploaded=true;
    const unsigned=cloudinary.url(publicId,{...options,version:saved.version,secure:true});
    const denied=await fetch(unsigned,{redirect:'manual',signal:AbortSignal.timeout(15000)});
    result.unsignedStatus=denied.status;result.unsignedDenied=[401,403,404].includes(denied.status);await denied.body?.cancel();
    const signed=cloudinary.url(publicId,{...options,version:saved.version,sign_url:true,secure:true});
    const ranged=await fetch(signed,{headers:{Range:'bytes=0-15'},redirect:'manual',signal:AbortSignal.timeout(15000)});
    result.signedStatus=ranged.status;result.signedRange=ranged.status===206 && /^bytes 0-15\//.test(ranged.headers.get('content-range') || '');await ranged.body?.cancel();
    if(!result.unsignedDenied || !result.signedRange)process.exitCode=1;
  } catch(error) {result.failure=typeof error.http_code==='number'?'PROVIDER_'+error.http_code:'CAPABILITY_PROBE_FAILED';process.exitCode=1;}
  finally {
    try {const cleanup=await cloudinary.uploader.destroy(publicId,{resource_type:'video',type:'authenticated',invalidate:true});result.cleaned=['ok','not found'].includes(cleanup.result);}catch{result.cleaned=false;process.exitCode=1;}
    if(!result.cleaned)process.exitCode=1;
    await rm(folder,{recursive:true,force:true});
    console.log(JSON.stringify(result));
  }
}
