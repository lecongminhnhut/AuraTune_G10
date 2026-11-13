// Dependency-free Playwright page runner. Start the disposable SQL API fixture
// and Vite as documented in validation/us1-results.md, then pass a Page here.
export async function runArtistIdentityChecks(page) {
  const base = 'http://localhost:5174';
  const results = [];
  const check = (value, message) => { if (!value) throw new Error(message); };
  const heading = name => page.getByRole('heading', { name, exact: true });
  const open = async id => { await page.goto(`${base}/artist/${id}`); };
  await open('9007199254740993');
  await heading('Public Artist').waitFor();
  check(await page.getByText('Public biography', { exact: true }).count() === 1, 'SQL biography');
  check(await page.getByRole('img', { name: 'Ảnh nghệ sĩ chưa được cung cấp' }).count() === 1, 'neutral image');
  check(await page.getByRole('button', { name: 'Theo dõi', exact: true }).count() === 0, 'no mock follow');
  results.push('anonymous SQL-backed identity / lossless bigint / missing image');
  await page.evaluate(() => { globalThis.__artistCopied = null; Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async value => { globalThis.__artistCopied = value; } } }); });
  await page.getByRole('button', { name: 'Sao chép liên kết nghệ sĩ Public Artist' }).click();
  check(await page.evaluate(() => globalThis.__artistCopied) === `${base}/artist/9007199254740993`, 'canonical copy');
  await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('denied'); }; });
  await page.getByRole('button', { name: 'Sao chép liên kết nghệ sĩ Public Artist' }).click();
  await page.getByText('Không thể sao chép liên kết. Vui lòng thử lại.', { exact: true }).waitFor();
  results.push('copy success and denied clipboard');
  await open('2');
  await heading('Independent Artist').waitFor();
  await page.getByText('Nghệ sĩ chưa cung cấp tiểu sử.', { exact: true }).waitFor();
  for (const id of ['3', '4', '5', '6', '999', '%ZZ']) {
    if (id === '%ZZ') {
      // Vite rejects malformed URI requests before serving the SPA. Exercise
      // the custom client router after the application has loaded instead.
      await page.evaluate(() => { history.pushState({}, '', '/artist/%ZZ'); dispatchEvent(new PopStateEvent('popstate')); });
    } else await open(id);
    await page.getByText('Không tìm thấy nghệ sĩ', { exact: true }).waitFor();
    check(await heading('Public Artist').count() === 0, 'old identity removed');
    check(!/Hidden secret|Unreviewed secret|Banned secret|Dangling secret/.test(await page.locator('main').innerText()), 'private DOM leak');
  }
  results.push('unlinked public / empty bio / hidden, unreviewed, banned, dangling, unknown, malformed');
  let failing = true;
  const failureRoute = async route => failing
    ? route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ success: false, data: null, error: { code: 'INTERNAL_ERROR' } }) })
    : route.continue();
  await page.route('**/api/v1/artists/2', failureRoute);
  await open('2');
  await page.getByText('Không tải được hồ sơ nghệ sĩ', { exact: true }).waitFor();
  failing = false;
  await page.getByRole('button', { name: /Thử lại/ }).click();
  await heading('Independent Artist').waitFor();
  await page.unroute('**/api/v1/artists/2', failureRoute);
  results.push('temporary failure / same-route retry to real API');
  const brokenImage = async route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, message: 'ok', error: null, data: { id: '2', name: 'Independent Artist', imageUrl: 'http://127.0.0.1:5098/fixture-broken-image', biography: '<script>bad()</script>' } }) });
  await page.route('**/api/v1/artists/2', brokenImage);
  await open('2');
  await heading('Independent Artist').waitFor();
  await page.getByRole('img', { name: 'Ảnh nghệ sĩ chưa được cung cấp' }).waitFor();
  check(await page.getByText('<script>bad()</script>', { exact: true }).count() === 1, 'untrusted bio is text');
  await page.unroute('**/api/v1/artists/2', brokenImage);
  results.push('broken image / escaped biography');
  let release;
  let observed;
  const pending = new Promise(resolve => { release = resolve; });
  const started = new Promise(resolve => { observed = resolve; });
  const slowRoute = async route => { observed(); await pending; try { await route.continue(); } catch { /* navigation aborted obsolete request */ } };
  await page.route('**/api/v1/artists/9007199254740993', slowRoute);
  await open('9007199254740993');
  await started;
  await page.getByLabel('Đang tải hồ sơ nghệ sĩ').waitFor();
  await page.evaluate(() => { history.pushState({}, '', '/artist/2'); dispatchEvent(new PopStateEvent('popstate')); });
  await heading('Independent Artist').waitFor();
  release();
  await page.unroute('**/api/v1/artists/9007199254740993', slowRoute);
  check(await heading('Public Artist').count() === 0, 'late A cannot replace B');
  results.push('loading / A-to-B stale-request isolation');
  const childRequests = [];
  const children = async route => { childRequests.push(route.request().url()); await route.abort(); };
  await page.route(/\/api\/v1\/artists\/[^/]+\/(songs|albums|playlists)/, children);
  await open('9007199254740993');
  await heading('Public Artist').waitFor();
  check(childRequests.length === 0, 'identity depends on no catalog request');
  await page.unroute(/\/api\/v1\/artists\/[^/]+\/(songs|albums|playlists)/, children);
  results.push('identity independent of unavailable catalog (no content requests)');
  return results;
}
