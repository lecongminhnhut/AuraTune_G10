import assert from 'node:assert/strict';
import {test} from 'node:test';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {StudioReadView} from './StudioPage.jsx';
const ready=data=>({status:'ready',data,error:null});
test('Studio renders real identity and lossless history while catalog independently fails without demo mutation controls',()=>{
 const html=renderToStaticMarkup(<StudioReadView state={{identity:ready({id:'9007199254740993',name:'Real Artist',profileVisibility:'hidden'}),catalog:{status:'error',data:null},stats:ready({totalTracks:'0',activeTracks:'0',historicalPlays:'9007199254740993'})}} onRetry={()=>{}} />);
 assert.match(html,/Real Artist/);assert.match(html,/9007199254740993/);assert.match(html,/9\.007\.199\.254\.740\.993/);assert.match(html,/Không tải được/);assert.doesNotMatch(html,/artist@auratune|Tải bài hát lên|Chưa có bài hát được/);
});
test('Studio distinguishes empty owned catalog from unavailable statistics',()=>{
 const html=renderToStaticMarkup(<StudioReadView state={{identity:ready({id:'1',name:'Artist'}),catalog:ready({tracks:[]}),stats:{status:'error',data:null}}} onRetry={()=>{}} />);
 assert.match(html,/Chưa có bài hát được xác nhận/);assert.match(html,/Không tải được/);assert.doesNotMatch(html,/Tổng lượt nghe/);
});
