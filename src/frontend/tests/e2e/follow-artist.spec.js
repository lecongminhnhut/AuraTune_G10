// Pass a Playwright Page to run against the disposable follow-server fixture.
export async function runFollowArtistChecks(page) {
  const pageErrors=[];const onPageError=error=>pageErrors.push(error.message);page.on('pageerror',onPageError);
  const base='http://localhost:5174',api='http://localhost:5098';
  const results=[];
  const check=(value,message)=>{if(!value)throw Error(message);};
  const navigate=async path=>page.evaluate(value=>{history.pushState({},'',value);dispatchEvent(new PopStateEvent('popstate'));},path);
  async function login(actor) {
    // Clear only this disposable fixture's cookie before a full application
    // load, so restoration cannot race the test's login form interaction.
    await page.evaluate(async api=>{await fetch(api+'/api/v1/auth/logout',{method:'POST',credentials:'include'});},api);
    await page.goto(base+'/login?next=%2Fartist%2F2');
    await page.getByRole('textbox',{name:'Email',exact:true}).fill(actor+'@fixture.test');
    await page.locator('input[type=password]').fill('Fixture123!');
    await page.locator('form').getByRole('button',{name:'Đăng nhập',exact:true}).click();
    await page.getByRole('heading',{name:'Independent Artist',exact:true}).waitFor();
  }
  async function visibility(value) {
    await page.evaluate(async({api,value})=>{const result=await fetch(api+'/__fixture/artist/2/visibility',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visibility:value})});if(!result.ok)throw Error('Fixture control');},{api,value});
  }
  await page.evaluate(async api=>{await fetch(api+'/api/v1/auth/logout',{method:'POST',credentials:'include'});},api);
  await page.goto(base+'/artist/2');
  await page.getByRole('heading',{name:'Independent Artist',exact:true}).waitFor();
  await page.getByRole('link',{name:'Đăng nhập để theo dõi',exact:true}).waitFor();
  await page.goto(base+'/following');await page.getByText('Đăng nhập để tiếp tục',{exact:true}).waitFor();
  results.push('guest public identity / login CTA / protected following list');
  await login('a');
  const following=page.getByRole('button',{name:'Đang theo dõi',exact:true});
  if(await following.count())await following.click();
  await page.getByRole('button',{name:'Theo dõi',exact:true}).waitFor();
  await page.getByRole('button',{name:'Theo dõi',exact:true}).focus();await page.keyboard.press('Space');
  await following.waitFor();
  await navigate('/following');
  await page.getByRole('link',{name:/Independent Artist/}).waitFor();
  await page.getByRole('link',{name:/Independent Artist/}).focus();await page.keyboard.press('Enter');
  await following.waitFor();
  await page.goBack();await page.getByRole('link',{name:/Independent Artist/}).waitFor();
  await page.goForward();await following.waitFor();
  await page.reload();await following.waitFor();
  results.push('A keyboard follow / own list / profile / reload persistence');
  await following.click();
  await page.getByRole('button',{name:'Theo dõi',exact:true}).waitFor();
  await navigate('/following');
  await page.getByText('Bạn chưa theo dõi nghệ sĩ nào',{exact:true}).waitFor();
  results.push('unfollow / next successful own list is empty');
  await login('b');
  await page.getByRole('button',{name:'Theo dõi',exact:true}).waitFor();
  await navigate('/following');await page.getByText('Bạn chưa theo dõi nghệ sĩ nào',{exact:true}).waitFor();
  results.push('B Admin has own empty state, no A relationship');
  await login('a');
  await page.getByRole('button',{name:'Theo dõi',exact:true}).click();await following.waitFor();
  await visibility('hidden');
  await page.goto(base+'/following');await page.getByText('Bạn chưa theo dõi nghệ sĩ nào',{exact:true}).waitFor();
  check(!/Independent Artist/.test(await page.locator('main').innerText()),'no hidden identity');
  await visibility('public');
  await page.goto(base+'/following');await page.getByRole('link',{name:/Independent Artist/}).waitFor();
  await visibility('hidden');
  await page.evaluate(async api=>{
    const auth=await (await fetch(api+'/api/v1/auth/login',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'a@fixture.test',password:'Fixture123!'})})).json();
    const result=await fetch(api+'/api/v1/artists/2/follow',{method:'DELETE',headers:{Authorization:'Bearer '+auth.data.session.access_token}});
    if(result.status!==200)throw Error('Hidden own delete');
  },api);
  await visibility('public');await page.goto(base+'/artist/2');
  await page.getByRole('button',{name:'Theo dõi',exact:true}).waitFor();
  results.push('hide retains / restore reappears / direct hidden-owner removal prevents restoration');
  let fail=true;
  const route=async request=>fail?request.fulfill({status:500,contentType:'application/json',body:JSON.stringify({success:false,data:null,error:{code:'INTERNAL_ERROR'}})}):request.continue();
  await page.route('**/api/v1/users/me/following-artists',route);
  await page.goto(base+'/following');
  await page.getByText('Không tải được nghệ sĩ đang theo dõi',{exact:true}).waitFor();
  check(await page.getByText('Bạn chưa theo dõi nghệ sĩ nào',{exact:true}).count()===0,'failure is not empty');
  fail=false;await page.getByRole('button',{name:'Thử lại',exact:true}).click();
  await page.getByText('Bạn chưa theo dõi nghệ sĩ nào',{exact:true}).waitFor();
  await page.unroute('**/api/v1/users/me/following-artists',route);
  await page.setViewportSize({width:390,height:844});await page.goto(base+'/artist/2');
  await page.getByRole('button',{name:'Theo dõi',exact:true}).waitFor();
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile overflow');
  results.push('list failure / retry / mobile fit');
  await page.getByRole('button',{name:'Theo dõi',exact:true}).click();await following.waitFor();
  await navigate('/artist/9007199254740993');
  await page.getByRole('button',{name:'Theo dõi',exact:true}).click();await following.waitFor();
  await navigate('/following');
  const first=page.locator('main a[href^="/artist/"]').first();
  await page.getByRole('link',{name:/Public Artist/}).waitFor();
  check(await first.getAttribute('href')==='/artist/9007199254740993','newest first');
  await page.evaluate(async api=>{
    const auth=await (await fetch(api+'/api/v1/auth/login',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'a@fixture.test',password:'Fixture123!'})})).json();
    const result=await fetch(api+'/api/v1/artists/2/follow',{method:'PUT',headers:{Authorization:'Bearer '+auth.data.session.access_token}});
    if(result.status!==200)throw Error('Duplicate follow');
  },api);
  await page.reload();await page.getByRole('link',{name:/Public Artist/}).waitFor();
  check(await first.getAttribute('href')==='/artist/9007199254740993','duplicate does not reorder');
  await navigate('/artist/2');await following.waitFor();await following.click();
  await page.getByRole('button',{name:'Theo dõi',exact:true}).click();await following.waitFor();
  await navigate('/following');await page.getByRole('link',{name:/Independent Artist/}).waitFor();
  check(await first.getAttribute('href')==='/artist/2','refollow new placement');
  for(const id of ['2','9007199254740993']) {
    await navigate('/artist/'+id);await following.waitFor();await following.click();
    await page.getByRole('button',{name:'Theo dõi',exact:true}).waitFor();
  }
  results.push('authoritative list order / duplicate no reorder / refollow new position');
  await navigate('/artist/2');await page.getByRole('button',{name:'Theo dõi',exact:true}).waitFor();
  const lostResponse=async route=>{
    if(route.request().method()!=='PUT')return route.continue();
    // Forward once through the browser to the loopback fixture, bypassing only
    // this localhost interception, then lose the original response after commit.
    try {
      const status=await page.evaluate(async authorization=>(await fetch('http://127.0.0.1:5098/api/v1/artists/2/follow',{method:'PUT',headers:{Authorization:authorization}})).status,route.request().headers().authorization);
      check(status===200,'fixture commit before losing response');
    } finally {await route.abort('failed');}
  };
  await page.route('http://localhost:5098/api/v1/artists/2/follow',lostResponse);
  await page.getByRole('button',{name:'Theo dõi',exact:true}).click();await following.waitFor();
  await page.getByText('Chưa xác nhận được thao tác trước. Trạng thái hiện tại đã được tải lại.',{exact:true}).waitFor();
  await page.unroute('http://localhost:5098/api/v1/artists/2/follow',lostResponse);
  await following.click();await page.getByRole('button',{name:'Theo dõi',exact:true}).waitFor();
  results.push('real SQL commit / dropped response / truthful reconciliation without mutation replay');
  page.off('pageerror',onPageError);check(pageErrors.length===0,'runtime page errors: '+pageErrors.join('; '));
  return results;
}
