import { isArtistId } from '../repositories/artistRepository.js';
import { FollowError } from '../repositories/followArtistRepository.js';
export function followTransportError(error,req,res,next) {
  const path=req.originalUrl.split('?')[0];
  const personal=/^\/(?:api\/v1\/)?(?:artists\/[^/]+\/follow|users\/me\/following-artists)$/.test(path);
  if(personal && ['entity.parse.failed','entity.too.large'].includes(error.type)) {
    res.set('Cache-Control','private, no-store');
    return res.status(400).json({success:false,message:'Invalid request',data:null,error:{code:'VALIDATION_ERROR',details:[]}});
  }
  return next(error);
}
export function createFollowArtistController(service) {
  return async function handle(req,res) {
    res.set('Cache-Control','private, no-store');
    try {
      const read=req.method==='GET';
      const artistId=read?req.query.artistId:req.params.id;
      if((artistId!==undefined && !isArtistId(artistId)) || (!read && artistId===undefined)
        || Object.keys(req.query).some(key=>!read || key!=='artistId')
        || (req.body && Object.keys(req.body).length))throw new FollowError(400,'VALIDATION_ERROR');
      const data=read?await service.list(req.followPrincipal,artistId ?? null):await service.set(req.followPrincipal,artistId,req.method==='PUT');
      return res.status(200).json({success:true,message:read?'Following artists loaded':'Following updated',data,error:null});
    } catch(error) {
      const status=error instanceof FollowError?error.status:500;
      const code=error instanceof FollowError?error.code:'INTERNAL_ERROR';
      const message=status===404?'Artist not found':status===400?'Invalid request':status===401?'Authentication required':status===403?'Access denied':'Following temporarily unavailable';
      return res.status(status).json({success:false,message,data:null,error:{code,details:[]}});
    }
  };
}
