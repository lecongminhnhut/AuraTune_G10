import { apiFetch } from './sessionApiClient.js';
import { validArtistId } from './artistProfileService.js';
export class FollowApiError extends Error {
  constructor(kind) {super(kind);this.name='FollowApiError';this.kind=kind;}
}
export function createFollowArtistApi({request=apiFetch}={}) {
  async function execute(path,method,signal) {
    try {
      const response=await request(path,{method,signal,cache:'no-store'});
      const body=await response.json();
      if(!response.ok)throw new FollowApiError(response.status===401?'auth':response.status===403?'denied':response.status===404?'not-found':method!=='GET' && response.status>=500?'uncertain':'unavailable');
      if(body.success!==true || body.error!==null || response.status!==200)throw Error('Protocol');
      return body.data;
    } catch(error) {
      if(error?.name==='AbortError' || error instanceof FollowApiError)throw error;
      throw new FollowApiError(method==='GET'?'unavailable':'uncertain');
    }
  }
  return {
    async list(artistId=null,{signal}={}) {
      if(artistId!==null && !validArtistId(artistId))throw new FollowApiError('not-found');
      const data=await execute(`/users/me/following-artists${artistId===null?'':`?artistId=${encodeURIComponent(artistId)}`}`,'GET',signal);
      if(data?.complete!==true || !Array.isArray(data.artists))throw new FollowApiError('unavailable');
      const seen=new Set();
      return data.artists.map(row=>{
        if(!validArtistId(row.id) || seen.has(row.id) || typeof row.name!=='string' || !row.name.trim() || !(row.imageUrl===null || typeof row.imageUrl==='string') || typeof row.followedAt!=='string' || !Number.isFinite(Date.parse(row.followedAt)))throw new FollowApiError('unavailable');
        seen.add(row.id);return {id:row.id,name:row.name,imageUrl:row.imageUrl,followedAt:row.followedAt};
      });
    },
    async set(artistId,follow,{signal}={}) {
      if(!validArtistId(artistId) || typeof follow!=='boolean')throw new FollowApiError('unavailable');
      const data=await execute(`/artists/${encodeURIComponent(artistId)}/follow`,follow?'PUT':'DELETE',signal);
      if(data!==null)throw new FollowApiError('uncertain');
    },
  };
}
export const followArtistApi=createFollowArtistApi();
