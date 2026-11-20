# 092 tooling — executed 2026-11-13

Reused 091's host Node v26.13.0/npm 11.20.0, native Node tests, existing JSX loader, pinned backend PGlite 0.5.16 and integrated Playwright Page runner. No new runtime pin, framework or app. Requirements checklist 22/22 checked; explicit feature prerequisite check passed with SPECIFY_FEATURE_DIRECTORY and SPECIFY_FEATURE_NO_PERSIST=1. No AGENTS.md or extension hooks found. Existing ignore rules cover dependencies, env files and build output.

- `npm --prefix src/backend run test:follow`: 13/13 PASS (SQL, supplied-schema migration/preflight and actual Express API).
- `npm --prefix src/frontend run test:follow`: 14/14 PASS, targeted component/service/state/session runner. Full frontend discovery additionally executes the new session and unfollow test files; see [regression results](./regression-and-query-evidence.md).
- `FOLLOW_PG_CONTAINER=auratune-follow-092-validation node --test tests/follow-concurrency.test.js` from backend: 5/5 PASS, zero skips, on real PostgreSQL independent connections. Native general tests intentionally skip these opt-in cases when no disposable container is named; that does not replace the separate real run.
- Browser: [runFollowArtistChecks](../../../../src/frontend/tests/e2e/follow-artist.spec.js), called with integrated Playwright Page on localhost:5174 and the SQL-backed [fixture server](../../../../src/backend/tests/fixtures/follow-server.mjs) at localhost:5098: eight scenario groups PASS; cold-run page-error assertion PASS.

Test-first evidence: persistence tests initially failed because migration 005 did not exist; session replay test reproduced a real missing rejection before the client fix; service/hook tests failed on missing modules; component tests failed on missing control/FollowingList exports. Subsequent HTTP, adversarial and concurrency cases supplement those shared red baselines. No assertion is made that every supplementary test individually ran red before existing behavior.

The existing Docker CLI initially had no daemon; Docker Desktop was started with tool approval. A disposable `postgres:17-alpine` container was downloaded/created with explicit tool approval, no host port or volume, fixture-only password. Image digest: sha256:d3244e8ce3f165ee3c93d9c4a4b1d0fe48b3a89e2287b717fdcbbde92d405065. This is a test engine selection, not a claimed deployed Supabase version. Native tests use PGlite; production uses existing backend-only Supabase RPC.

Reproduce real concurrency in a **fresh** container (the fixture intentionally does not reset existing schemas):

```sh
docker run --rm --detach --name auratune-follow-092-validation -e POSTGRES_PASSWORD=disposable-fixture-only -e POSTGRES_DB=auratune_follow_092 postgres:17-alpine
# Wait for pg_isready in this container, then from src/backend:
FOLLOW_PG_CONTAINER=auratune-follow-092-validation npm run test:follow:concurrency
docker stop auratune-follow-092-validation
```

For browser tests, start `JWT_SECRET=auratune-disposable-fixture-secret node tests/fixtures/follow-server.mjs` from backend. Start Vite with VITE_API_BASE_URL=http://localhost:5098/api/v1 and synthetic Firebase values as in the [091 instructions](../../091-artist-profile/validation/us1-results.md), on localhost:5174. Use the same hostname for API/frontend so the fixture refresh cookie is same-site. Fixture auth/control routes are never mounted by production server. No real account credentials or production secrets appear in tests/reports.
