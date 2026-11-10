export class FollowError extends Error {
  constructor(status,code) { super(code);this.status=status;this.code=code; }
}
const codes={P0401:[401,'UNAUTHORIZED'],P0403:[403,'USER_BANNED'],P0404:[404,'NOT_FOUND'],P0405:[403,'FORBIDDEN']};
export function createFollowArtistRepository({getClient=async()=>(await import('../../database/supabaseClient.js')).supabase}={}) {
  async function rpc(name,actor,args) {
    try {
      const client=await getClient();if(!client)throw Error('Unavailable');
      const {data,error}=await client.rpc(name,{p_user_id:actor.userId,p_session_id:actor.sessionId,p_device:actor.device,...args});
      if(error)throw new FollowError(...(codes[error.code] || [500,'INTERNAL_ERROR']));
      return data;
    } catch(error) {if(error instanceof FollowError)throw error;throw new FollowError(500,'INTERNAL_ERROR');}
  }
  return {
    list:(actor,artistId=null)=>rpc('artist_follow_list',actor,{p_artist_id:artistId}),
    set:(actor,artistId,follow)=>rpc('artist_follow_set',actor,{p_artist_id:artistId,p_follow:follow}),
  };
}
