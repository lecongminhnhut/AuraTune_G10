import {isArtistId} from './artistRepository.js';
export class StudioError extends Error {
  constructor(status,code) {super(code);this.status=status;this.code=code;}
}
const mapped={P0401:[401,'UNAUTHORIZED'],P0403:[403,'USER_BANNED'],P0405:[403,'FORBIDDEN']};
const count=value=>typeof value==='string' && /^(?:0|[1-9]\d*)$/.test(value);
const safeImage=value=>{try{const url=new URL(value);return ['http:','https:'].includes(url.protocol)?url.href:null;}catch{return null;}};
export function createArtistTrackRepository({getClient=async()=>(await import('../../database/supabaseClient.js')).supabase}={}) {
  return {async read(actor,section) {
    try {
      if(!['identity','catalog','stats'].includes(section))throw Error('Invalid section');
      const client=await getClient();if(!client)throw Error('Unavailable');
      const {data,error}=await client.rpc('artist_studio_read',{p_user_id:actor.userId,p_session_id:actor.sessionId,p_device:actor.device,p_section:section});
      if(error)throw new StudioError(...(mapped[error.code] || [500,'INTERNAL_ERROR']));
      if(section==='identity') {
        if(!isArtistId(data?.id) || typeof data.name!=='string' || !data.name.trim() || !['public','hidden','unreviewed'].includes(data.profileVisibility))throw Error('Invalid identity');
        return {id:data.id,name:data.name.trim(),imageUrl:safeImage(data.imageUrl),profileVisibility:data.profileVisibility};
      }
      if(section==='stats') {
        if(!isArtistId(data?.artistId) || !['totalTracks','activeTracks','historicalPlays'].every(key=>count(data[key])))throw Error('Invalid statistics');
        return {artistId:data.artistId,totalTracks:data.totalTracks,activeTracks:data.activeTracks,historicalPlays:data.historicalPlays};
      }
      if(!isArtistId(data?.artistId) || data.complete!==true || !Array.isArray(data.tracks))throw Error('Incomplete catalog');
      const seen=new Set();
      const tracks=data.tracks.map(row=>{
        if(!isArtistId(row.id) || seen.has(row.id) || typeof row.title!=='string' || !row.title.trim()
          || !['active','hidden'].includes(row.artistPreference) || typeof row.adminRestricted!=='boolean'
          || !(row.genre===null || typeof row.genre==='string')
          || !(row.durationSeconds===null || Number.isInteger(row.durationSeconds) && row.durationSeconds>=0)
          || !(row.totalPlays===null || count(row.totalPlays)))throw Error('Invalid catalog');
        if(row.album!==null && (!isArtistId(row.album?.id) || typeof row.album.title!=='string'))throw Error('Invalid album');
        seen.add(row.id);
        return {id:row.id,title:row.title,album:row.album===null?null:{id:row.album.id,title:row.album.title},genre:row.genre,
          durationSeconds:row.durationSeconds,totalPlays:row.totalPlays,artistPreference:row.artistPreference,
          adminRestricted:row.adminRestricted,coverUrl:safeImage(row.coverUrl),fileName:null};
      });
      return {artistId:data.artistId,complete:true,tracks};
    } catch(error) {if(error instanceof StudioError)throw error;throw new StudioError(500,'INTERNAL_ERROR');}
  }};
}
