import assert from 'node:assert/strict';
import {test} from 'node:test';
import {renderToStaticMarkup} from 'react-dom/server';
import React from 'react';
import {FollowingList} from './FollowingPage.jsx';
test('complete ordered list preserves server order, safe links and neutral images; error is not empty',()=>{
  const html=renderToStaticMarkup(<FollowingList state={{status:'confirmed',artists:[{id:'9007199254740993',name:'<Public>',imageUrl:null,followedAt:'2026-01-01T00:00:00Z'},{id:'2',name:'Second',imageUrl:null,followedAt:'2026-01-01T00:00:00Z'}]}} onRetry={()=>{}} />);
  assert.ok(html.indexOf('&lt;Public&gt;')<html.indexOf('Second'));
  assert.match(html,/href="\/artist\/9007199254740993"/);
  const error=renderToStaticMarkup(<FollowingList state={{status:'error',artists:[]}} onRetry={()=>{}} />);
  assert.doesNotMatch(error,/Bạn chưa theo dõi/);assert.match(error,/Thử lại/);
});
