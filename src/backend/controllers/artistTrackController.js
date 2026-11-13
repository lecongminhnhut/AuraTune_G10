import {StudioError} from '../repositories/artistTrackRepository.js';
export function createArtistTrackController(service,section) {
  return async(req,res)=>{
    res.set('Cache-Control','private, no-store');
    try {
      if(Object.keys(req.query).length)throw new StudioError(400,'VALIDATION_ERROR');
      const data=await service.read(req.studioPrincipal,section);
      return res.status(200).json({success:true,message:'Studio data loaded',data,error:null});
    } catch(error) {
      const status=error instanceof StudioError?error.status:500;
      const code=error instanceof StudioError?error.code:'INTERNAL_ERROR';
      return res.status(status).json({success:false,message:status===400?'Invalid request':status===401?'Authentication required':status===403?'Artist Studio unavailable':'Studio temporarily unavailable',data:null,error:{code,details:[]}});
    }
  };
}
