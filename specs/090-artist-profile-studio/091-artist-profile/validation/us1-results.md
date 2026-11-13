# 091 identity-first implementation — 2026-11-13

## Accepted delivery boundary

The owner explicitly approved identity-first delivery, the proposed wire/public-read design, use of the current technical structure/test harness, `artists.user_id → users.user_id`, and the proposed physical mapping. These answers authorize this implementation slice; they do not assert team ratification of the Constitution. Original C01 team governance remains historically unresolved for the broader backlog. No further ceremonial approval is required for the explicitly authorized slice.

Authoritative account state is existing `users.is_banned`, not a new `account_status` column. The supplied users DDL has distinct `user_id` and `id`; fixtures deliberately use different values. Artist source is the six supplied Supabase columns plus the approved visibility extension. Unlinked public artists qualify. Linked profiles require an existing nonbanned account. Legacy visibility NULL is ineligible. New omitted visibility defaults hidden. Ban and unban persist hidden; neither restores public state. Explicit subsequent publication is possible only after the account is active.

The approved successful identity response is exactly `{id,name,imageUrl,biography}` inside `{success,message,data,error}` at anonymous GET `/api/v1/artists/:id`. Catalog is a later increment; identity makes no content requests. Thus T013 independent state is identity-only in this slice; it does not claim independently implemented featured/album/playlist state. T014 installs parent guards on existing child paths but no content producers. The initial composite-detail conditional prerequisite for T019 does not apply to this approved identity boundary. The original Markdown contract is retained; [OpenAPI](../contracts/artist-profile-api.json) captures only the accepted increment.

## Implementation inventory

| Surface | Files and behavior |
| --- | --- |
| SQL | [003](../../../../src/database/migrations/003_artist_visibility.sql), [004](../../../../src/database/migrations/004_artist_profile_read_policy.sql): safe default/legacy NULL, backend-only filtered view, bigint cast before JSON, ban/unban hiding and publication eligibility triggers. Neither was applied remotely. |
| API | [repository](../../../../src/backend/repositories/artistRepository.js), [routes](../../../../src/backend/routes/artistRoutes.js), [controller](../../../../src/backend/controllers/artistController.js), [server](../../../../src/backend/server.js): one public view read through existing backend service-role Supabase client; safe 400/404/500; no-store; identical not-found without role bypass; explicit four-field projection. |
| Client | [service](../../../../src/frontend/src/services/artistProfileService.js), [hook](../../../../src/frontend/src/hooks/useArtistProfile.js), [page](../../../../src/frontend/src/pages/Artist/ArtistPage.jsx), [router](../../../../src/frontend/src/routes/AppRouter.jsx), [copy/decode helpers](../../../../src/frontend/src/utils/artistRoute.js): anonymous independent fetch, abort/generation guards, missing/broken image and biography states, escaped plain text, retry, canonical artist-link copy. No mock identity/catalog/counts; original 092 demo FollowButton retained but not mounted on real identity. |
| Tooling | Backend/frontend manifests now expose `test:artist-profile`; backend also `test:artist-migrations`. [Backend lockfile](../../../../src/backend/package-lock.json) synchronizes the combined integration manifest, existing Supertest/Vitest and pinned test-only PGlite 0.5.16. No runtime version pin was invented. Existing Node native tests and JSX loader are reused. |
| Tests | [SQL migration](../../../../src/database/tests/artistVisibilityMigration.test.mjs), [API](../../../../src/backend/tests/artist-profile-identity.test.js), [database fixture](../../../../src/backend/tests/fixtures/artistDatabase.mjs), [fixture server](../../../../src/backend/tests/fixtures/artist-profile-server.mjs), [service](../../../../src/frontend/src/services/artistProfileService.test.js), [component](../../../../src/frontend/src/pages/Artist/ArtistPage.identity.test.jsx), [browser runner](../../../../src/frontend/tests/e2e/artist-profile-identity.spec.js). |

Two preexisting textual conflict blocks in backend manifest/server were repaired by retaining both integrated application routes/dependencies and the Cloudinary routes/dependencies, then adding Artist routes. Existing staged upload work was preserved; no staging, branch switch, rebase, commit or push.

## Commands and observed results

Host Node v26.13.0/npm 11.20.0 are available outside the constrained shell. Initial API/service tests failed on missing implementation modules; after implementation the following passed:

| Command (from repository root unless noted) | Actual result |
| --- | --- |
| `npm --prefix src/backend install --save-dev --save-exact @electric-sql/pglite@0.5.16` | Installed; lock synchronized. npm audit reported 12 vulnerabilities (9 moderate, 1 high, 2 critical) across the combined existing dependency tree. No broad audit fix attempted. |
| `npm --prefix src/backend run test:artist-profile` | 7/7 PASS, no skips. Uses actual SQL migration/view/triggers and Express through a PostgREST-shaped fixture transport. |
| `npm --prefix src/backend run test:artist-migrations` | 8/8 PASS; fresh in-memory PostgreSQL per case. |
| `npm --prefix src/frontend run test:artist-profile` | 7/7 PASS. |
| `npm --prefix src/backend test` | 185/185 PASS, no skips. Existing suite logs env loading and local AI fallback; not the separate live auth smoke script. |
| `npm --prefix src/frontend test` | 91/91 PASS, no skips. Existing JSX loader reports Node module.register deprecation. |
| `npm --prefix src/frontend run build` | PASS, Vite 5.4.21; existing large-chunk warning (main JS ~805 kB). |
| `git diff --check` | PASS. |

Browser runner `runArtistIdentityChecks(page)` was executed in the integrated Playwright browser against the real app at `http://localhost:5174`, with disposable SQL API at `http://127.0.0.1:5098`. All seven scenario groups passed: anonymous SQL-backed identity and exact bigint; copy success/clipboard denial; unlinked/missing biography plus hidden/unreviewed/banned/dangling/unknown/malformed; temporary error and same-route retry; broken image and escaped biography; pending A→B isolation; no dependency on unavailable catalog. Raw API field/privacy assertions are in the seven backend tests. Browser fault responses are injected only with Playwright routing, never production query flags.

Reproduce the API fixture from root after backend install:

```sh
node src/backend/tests/fixtures/artist-profile-server.mjs
```

Start the frontend in another terminal with synthetic, nonsecret Firebase values (the existing app initializes Firebase even for anonymous routes):

```sh
VITE_API_BASE_URL=http://127.0.0.1:5098/api/v1 VITE_FIREBASE_API_KEY=fixture-api-key VITE_FIREBASE_PROJECT_ID=auratune-fixture VITE_FIREBASE_APP_ID=fixture-app VITE_FIREBASE_AUTH_DOMAIN=localhost npm --prefix src/frontend run dev -- --host localhost --port 5174
```

Import the saved browser module and call `await runArtistIdentityChecks(page)` with a Playwright Page, or run its self-contained function in the integrated browser tool. This runner is intentionally not auto-discovered by native Node unit tests. No second frontend/browser test framework dependency was introduced.

## Limits and remaining work

- SQL validation uses PGlite, not deployed Supabase/PostgREST. Production transport, service-role grants and existing base-table grants/RLS require deployment verification. The view denies anon/authenticated access; it does not retroactively restrict existing direct access to source tables. API-level four-field privacy is verified. Artist creation DDL, unseen FK/default/index definitions were not reconstructed from a schema screenshot.
- Apply 003 then 004 through the database rollout process, inspect live Artist DDL/grants, and review selected legacy records before explicitly publishing. Existing rows are never automatically made public. Absent view/configuration produces temporary error, not demo fallback.
- Triggers enforce account eligibility and hiding; they do not implement Admin actor authorization, an approval-request workflow or an Admin endpoint. Existing database write permissions still matter; a future publication operation must enforce Admin approval server-side.
- Direct malformed `%ZZ` page requests are rejected by Vite before SPA loading. Client navigation to malformed IDs is safe and tested. Deployment SPA fallback/reverse-proxy handling needs its own verification.
- The existing global shell attempts auth refresh and a restored demo player request even on anonymous routes. In the fixture these fail independently; Artist identity still loads. This increment does not modify shared auth/player behavior or claim those subsystems are production ready.
- T020–T042 remain unchecked: catalog schema/associations, eligible/playable predicates, native all-time counts/release-date rules, album completeness/order and official playlist mapping remain open. Owner-confirmed full-player close→profile/unavailable-content/copy-link behavior is retained; actual selected-song integration awaits real catalog producer work. No full 091, cross-section recovery, performance percentile, usability or accessibility acceptance is claimed.
- 092/093 remain at their existing preparation state. Follow persistence/count atomicity and track catalog/mutation ownership, API contracts and media lifecycle are not inferred from this identity work. See their existing gate indexes for affected tasks.

## Cloudinary boundary observed in current code

[media routes](../../../../src/backend/routes/mediaRoutes.js) and [controller](../../../../src/backend/controllers/mediaController.js) accept upload requests; [storage service](../../../../src/backend/services/cloudinaryStorageService.js) validates detected image/audio formats and calls `cloudinary.uploader.upload_stream`, returning `public_id`, `secure_url`, `resource_type`, `bytes`. Audio uses Cloudinary video resource type. Audio rights/license/source are checked and echoed by the controller. These handlers do **not** insert/update catalog songs, Artist image_url, ownership or rights persistence. No hide/delete destroy/invalidation/private delivery operation exists in this service. Therefore hiding an Artist suppresses its URL from this public identity API, but a previously copied Cloudinary URL is not revoked by this code. Catalog linking, upload orphan cleanup and URL behavior after track hide/delete remain separate 093 decisions, not implemented security guarantees.
