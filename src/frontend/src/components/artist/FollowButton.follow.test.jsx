import assert from 'node:assert/strict';
import {test} from 'node:test';
import {renderToStaticMarkup} from 'react-dom/server';
import React from 'react';
import {FollowControl} from './FollowButton.jsx';
test('checking and failure never render a false confirmed negative; pending disables interaction',()=>{
  const html=state=>renderToStaticMarkup(<FollowControl state={state} onChange={()=>{}} onRetry={()=>{}} />);
  assert.match(html({status:'loading',following:null}),/Đang kiểm tra/);
  assert.match(html({status:'error',following:null}),/Thử lại/);
  assert.doesNotMatch(html({status:'error',following:null}),/aria-pressed="false"/);
  assert.match(html({status:'confirmed',following:false}),/aria-pressed="false"/);
  assert.match(html({status:'confirmed',following:true}),/aria-pressed="true"/);
  assert.match(html({status:'pending',following:true}),/disabled/);
});
