import {apiFetch} from './sessionApiClient.js';
import {validArtistId} from './artistProfileService.js';
const count=value=>typeof value==='string' && /^(?:0|[1-9]\d*)$/.test(value);
export function createArtistTrackApi({request=apiFetch}={}) {
  return {async read(section,{signal}={}) {
    try {
      const path={identity:'/studio/me',catalog:'/studio/me/tracks',stats:'/studio/me/stats'}[section];
      if(!path)throw Error('Invalid section');
      const response=await request(path,{signal,cache:'no-store'});
      if(!response.ok)throw Object.assign(Error('Studio request failed'),{kind:response.status===401?'auth':response.status===403?'denied':'unavailable'});
      const body=await response.json();const data=body.data;
      if(response.status!==200 || body.success!==true || body.error!==null)throw Error('Invalid envelope');
      if(section==='identity') {
        if(!validArtistId(data?.id) || typeof data.name!=='string' || !data.name.trim() || !['public','hidden','unreviewed'].includes(data.profileVisibility) || !(data.imageUrl===null || typeof data.imageUrl==='string'))throw Error('Invalid identity');
        return {id:data.id,name:data.name,imageUrl:data.imageUrl,profileVisibility:data.profileVisibility};
      }
      if(!validArtistId(data?.artistId))throw Error('Invalid artist');
      if(section==='stats') {
        if(!['totalTracks','activeTracks','historicalPlays'].every(key=>count(data[key])))throw Error('Invalid statistics');
        return {artistId:data.artistId,totalTracks:data.totalTracks,activeTracks:data.activeTracks,historicalPlays:data.historicalPlays};
      }
      if(data.complete!==true || !Array.isArray(data.tracks))throw Error('Incomplete catalog');
      const seen=new Set();
      const tracks=data.tracks.map(row=>{
        if(!validArtistId(row.id) || seen.has(row.id) || typeof row.title!=='string' || !row.title.trim() || !['active','hidden'].includes(row.artistPreference) || typeof row.adminRestricted!=='boolean'
          || !(row.totalPlays===null || count(row.totalPlays)) || !(row.durationSeconds===null || Number.isInteger(row.durationSeconds) && row.durationSeconds>=0)
          || !(row.genre===null || typeof row.genre==='string') || row.album!==null && (!validArtistId(row.album?.id) || typeof row.album.title!=='string'))throw Error('Invalid track');
        seen.add(row.id);
        return {id:row.id,title:row.title,album:row.album===null?null:{id:row.album.id,title:row.album.title},genre:row.genre,durationSeconds:row.durationSeconds,totalPlays:row.totalPlays,artistPreference:row.artistPreference,adminRestricted:row.adminRestricted,coverUrl:null,fileName:null};
      });
      return {artistId:data.artistId,complete:true,tracks};
    } catch(error) {
      if(error.name==='AbortError' || error.kind)throw error;
      throw Object.assign(Error('Studio unavailable'),{kind:'unavailable'});
    }
  }};
}
export const artistTrackApi=createArtistTrackApi();
