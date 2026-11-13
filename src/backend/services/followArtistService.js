import { isArtistId } from '../repositories/artistRepository.js';
import { FollowError } from '../repositories/followArtistRepository.js';
const safeImage=value=>{try{const url=new URL(value);return ['http:','https:'].includes(url.protocol)?url.href:null;}catch{return null;}};
export function createFollowArtistService(repository) {
  return {
    async list(actor,artistId) {
      const result=await repository.list(actor,artistId);
      if(result?.complete!==true || !Array.isArray(result.artists))throw new FollowError(500,'INTERNAL_ERROR');
      const seen=new Set();
      return {complete:true,artists:result.artists.map(row=>{
        if(!isArtistId(row.id) || seen.has(row.id) || typeof row.name!=='string' || !row.name.trim() || typeof row.followedAt!=='string' || !Number.isFinite(Date.parse(row.followedAt)))throw new FollowError(500,'INTERNAL_ERROR');
        seen.add(row.id);
        return {id:row.id,name:row.name.trim(),imageUrl:safeImage(row.imageUrl),followedAt:row.followedAt};
      })};
    },
    async set(actor,artistId,follow) {await repository.set(actor,artistId,follow);return null;},
  };
}
