# 093 read-only implementation — 2026-11-13

## Scope and evidence

The owner supplied a context-only source schema and accepted the proposed designs 2–8. See [accepted design](../preparation/accepted-design.md). No supplied export was executed; no live database migration, commit or push was performed.

Implemented [migration 006](../../../../src/database/migrations/006_artist_studio_reads.sql), the backend repository/service/controller/Studio routes and frontend API/hook/Studio page. Canonical users.user_id resolves the linked Artist; session validation retains the existing users.id FK. User/Admin/unlinked/banned/revoked actors cannot read Studio. Hidden profiles retain management access. Existing legacy songs remain unassigned; album credit is not an implicit management grant. Catalog and statistics fail independently. Bigint IDs/counters remain strings; missing stored counters produce unavailable statistics, not fabricated zeros. Retained soft-deleted owned rows contribute their stored counters; no valid-play recording writer or history recomputation is claimed.

The UI no longer presents local mock upload/edit/hide/delete as production success. It is read-only until the mutation and delivery gates are implemented. Complete catalog aggregates avoid PostgREST row caps; tested with more than 1,000 owned tracks. No provider URL/private account fields appear in responses.

## Commands and results

Native host Node v26.13.0 / npm 11.20.0; existing npm scripts and Node test runner reused. Tests use disposable PGlite fixtures executing actual migration SQL, Express HTTP and existing React JSX loader, not a live Supabase instance.

- Backend: `node --test tests/studio-authorization.test.js tests/artist-track-repository.test.js`: 9/9 PASS. Before implementations, tests failed because the new repository/routes did not exist.
- Backend: `npm test`: 212 tests, 207 PASS, 5 opt-in PostgreSQL concurrency tests SKIP, 0 failures. This run does not re-prove the skipped tests.
- Frontend: `npm test`: 109/109 PASS before the final Studio rendering tests were added. The new API/hook tests first failed with missing modules, then passed after implementation. Final UI run/build recorded below.
- Media: `node scripts/verifyStudioCloudinary.mjs`: configured=true, uploaded=true, unsignedDenied=true (401), signedRange=true (206), cleaned=true. Used only one generated 0.25-second synthetic MP3 and one UUID test asset, deleted in finally. No credentials or signed URLs were printed.

## Actual Cloudinary boundary

The existing upload middleware/service already uploads to Cloudinary but uses public delivery and returns provider secure_url/public_id. It does not insert songs/catalog rows or provide transactional final authorization, submission reconciliation or compensation. Existing song streaming can redirect to audio_url. The authenticated capability probe proves account support for authenticated upload, unsigned denial and signed byte ranges only. It does NOT prove that existing public URLs are revoked, player/queue changes are implemented, signed URL expiry implements immediate denial, or post-hide/delete new starts are blocked.

Required next implementation: authenticated-only new media, catalog association/final current-session authorization, operation dedup/reconciliation, backend eligibility-controlled stream/start and continuation, compensation/reconciliation worker and migration of existing public URLs. Do not enable lifecycle mutations before proving known URL/range/cache paths.

## Remaining decisions and gates

1. Legacy owner mapping: owner confirmed keeping management_artist_id NULL until reviewed. No automatic backfill; Hoàng/Đăng/Khoa coordinate future individual grants per C02.
2. Canonical genres: owner confirmed existing application taxonomy (vpop/indie/rnb/lofi/ballad/chill); Đăng/Hoàng coordinate C03. This closes the source decision, not implementation of write validation.
3. Governance C01 remains a documented unresolved template/ratification gap; user implementation authorization is not team ratification.
4. Upload/lifecycle execution, original acceptance scenarios, multi-worker races, media failure/compensation, full player/browser/queue integration and independent review remain open. This slice does not close the entire feature or all C08/C09/C10 gates.
5. Supplied history column duration_listened differs from existing repository listened_duration; separate integration correction remains required before claiming history writer coverage.

No live deployment is claimed. Rollout requires inspection of existing song grants/RLS and a database backup; 006 explicitly revokes browser access. Revoke function execution/restore recorded grants on rollback; avoid dropping added ownership/state columns after data is populated. Baseline source tables must exist, and migrations 003–005 precede 006.

## Final read-slice verification

Frontend `npm test`: **113/113 PASS**, including Studio SSR tests and delayed-response/account/link replacement tests. Frontend `npm run build`: PASS (811.41 kB initial JS chunk warning; existing JSX loader also reports module.register deprecation). `git diff --check`: PASS for tracked changes. No 093 browser end-to-end, full playback/queue or production ACL test is claimed.

### Changed file inventory for this increment

- Database: [006 Artist Studio reads](../../../../src/database/migrations/006_artist_studio_reads.sql).
- Backend: [repository](../../../../src/backend/repositories/artistTrackRepository.js), [service](../../../../src/backend/services/artistTrackService.js), [controller](../../../../src/backend/controllers/artistTrackController.js), [routes](../../../../src/backend/routes/studioRoutes.js), [authentication middleware](../../../../src/backend/middleware/authMiddleware.js), [server mount](../../../../src/backend/server.js).
- Backend verification: [repository tests](../../../../src/backend/tests/artist-track-repository.test.js), [authorization/API tests](../../../../src/backend/tests/studio-authorization.test.js), [SQL fixture](../../../../src/backend/tests/fixtures/studioDatabase.mjs), [Cloudinary capability probe](../../../../src/backend/scripts/verifyStudioCloudinary.mjs).
- Frontend: [API adapter](../../../../src/frontend/src/services/artistTrackService.js), [adapter tests](../../../../src/frontend/src/services/artistTrackService.test.js), [read lifecycle](../../../../src/frontend/src/hooks/useArtistTracks.js), [lifecycle tests](../../../../src/frontend/src/hooks/useArtistTracks.test.js), [session transport test](../../../../src/frontend/src/services/sessionApiClient.studio.test.js), [Studio page](../../../../src/frontend/src/pages/Studio/StudioPage.jsx), [rendering tests](../../../../src/frontend/src/pages/Studio/StudioPage.test.jsx).
- Documentation: [accepted design](../preparation/accepted-design.md), [gate index](../preparation/gate-evidence-index.md), [read OpenAPI](../contracts/artist-track-management-api.json), [spec alignment](../spec.md), [plan alignment](../plan.md), [task status](../tasks.md), [tooling](./tooling.md), [catalog mapping](./catalog-mapping.md), this result record. Existing 091/092 and staged Cloudinary changes are preserved.

### Task disposition

093 T001–T011 remain completed preparation. No additional whole task is ticked: T012–T018 have implementation evidence but their full recorded prerequisite/closure chain is not yet all closed; T019 lacks draft/operation lifecycle and the access/dashboard acceptance tasks still require their full scenarios. Upload/edit/visibility/delete remain pending. 092 T044–T048 still need 093 lifecycle integration and wider acceptance; this read slice does not close those dependencies.

Final build after linked-Artist lifecycle protection: PASS, main JS 811.54 kB. After tightening the adapter to require HTTP 200, the targeted Studio command `node --import ./tests/register-loader.js --test src/services/artistTrackService.test.js src/hooks/useArtistTracks.test.js src/pages/Studio/StudioPage.test.jsx src/services/sessionApiClient.studio.test.js` passed 8/8. Final tracked `git diff --check` passed. No task is held solely to request repeated implementation permission; remaining checkbox limits refer to recorded full acceptance/dependency evidence, not lack of user authorization to continue independent work.

After the owner confirmed both choices, extracted the unchanged six-genre taxonomy into [application genre configuration](../../../../src/frontend/src/config/genres.js); [mockData](../../../../src/frontend/src/utils/mockData.js) imports and re-exports it for compatibility. `npm test` in src/frontend passed 113/113; `git diff --check` passed. No production data or schema was changed, and no additional whole task was marked complete by this decision update.
