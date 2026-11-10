import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createArtistTrackApi} from './artistTrackService.js';
const response=data=>new Response(JSON.stringify({success:true,error:null,data}));
test('protected read validates exact section shape and never turns failure into an empty/zero success',async()=>{
  const api=createArtistTrackApi({request:async url=>response(url.endsWith('/stats')?{artistId:'1',totalTracks:'0',activeTracks:'0',historicalPlays:'9007199254740993'}:{artistId:'1',complete:true,tracks:[]})});
  assert.equal((await api.read('catalog')).complete,true);assert.equal((await api.read('stats')).historicalPlays,'9007199254740993');
  await assert.rejects(createArtistTrackApi({request:async()=>response({complete:false,tracks:[]})}).read('catalog'));
  await assert.rejects(createArtistTrackApi({request:async()=>new Response('{}',{status:500})}).read('stats'));
});
