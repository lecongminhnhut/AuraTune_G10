# Quickstart and Validation — Feature 093 Artist Track Management

**Purpose**: Future implementation validation. This planning package creates no API, schema, media adapter or application test suite. [Plan](./plan.md), [decisions](./research.md#decision-register), [model](./data-model.md), [contract](./contracts/artist-track-management.md).

## Prerequisites and environment

1. Remain on `090-artist-profile-studio-plan-tasks`; no branch create/switch/merge/commit/push is part of this pass. Resolve critical S01–S12 before dependent implementation. Preserve 091/092 sources.
2. Confirm supported Node/npm and actual shared test harness (S12). Current manifests do not pin runtime or define 093 tests. Prior planning shell had no Node and broken macOS Command Line Tools; do not claim runtime commands passed without execution.
3. Use disposable/test database and permitted synthetic media. Confirm actual catalog/artist ownership, complete protected read contract, historical metric source and media provider access (S02/S03/S05/S06). Existing auth migration alone does not create catalog/media schema. No guessed SQL or shared database reset.
4. Configure existing backend `JWT_SECRET` in production and `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` privately. Media provider settings are defined only after S06; no fabricated environment-variable names. Never put service keys in frontend `VITE_*` values. Firebase identity setup remains existing auth, not a new upload requirement.
5. Existing frontend `VITE_API_BASE_URL` default is `http://localhost:5000/api/v1`; frontend dev 5173/backend 5000, existing CORS permits development origin. Preserve session user-agent for API tests using existing authentication. Do not copy spec/demo passwords into new seed requirements: spec and current auth seed differ; use approved disposable auth setup.

## Existing baseline commands

From repository root, install current dependencies if needed:

```sh
npm install
npm --prefix src/backend install
npm --prefix src/frontend install
```

Separate terminals:

```sh
npm run dev:backend
```

```sh
npm run dev:frontend
```

Existing checks:

```sh
npm --prefix src/frontend run build
npm run test:backend
```

Root backend test is an authentication smoke script, not a Studio/media suite. No `npm test`, Studio lint or upload E2E command currently exists; the database test script is a failure placeholder. After S12, record real approved unit/component/API/storage/browser commands here. Build/auth smoke success does not establish 093 compliance. Before implementation, POST/PUT/DELETE song paths hit the generic fallback; that 404 is not evidence of ownership or delete behavior.

## Fixture and fault setup

Use approved seed/test adapters only after schema/contract decisions. No 093 seed command is currently available.

- Two authenticated Artist accounts A/B linked to distinct artists; guest, User, Admin, banned/revoked/expired sessions; Artist role with no artist link; non-public artist profile; same-account recovery and switch-to-B during refresh/transfer.
- Own and B-owned active/hidden tracks, an Admin-restricted own track, unknown/deleted IDs, imported/co-credited/standalone cases using S02-approved management scope; multiple albums including duplicate titles and unauthorized album assignment; canonical genre fixtures.
- Real permitted MP3 bytes, spoofed extension/MIME, invalid/truncated/non-MP3 files, and boundary files under recorded G090-D01: exactly 52,428,800 bytes and one byte over. Do not use commercial recordings or treat fabricated invalid bytes as valid MP3. Provider-specific safety/content checks come from S06.
- Missing title/file/genre/rights declarations, duration format boundaries; edit title/album at 200/201 Unicode code points, including non-BMP characters; blank-clear album and invalid genre. Do not extend edit maximum to upload or add duration positivity/matching rules.
- Sufficient own catalog rows to exceed backend default row caps; mixed active/hidden/restricted, nonzero historical plays on a deleted track, empty catalog with historical plays, unavailable metric source. No hidden public-data inference.
- Injectable media failure, media-success/DB-failure, cleanup failure, DB commit/response loss, unknown commit, auth expiry/revocation mid-transfer and validation/read failures. Fault controls are test-only, not public query parameters.
- Database synchronization barriers for concurrent edit/hide/restore/delete/moderation and concurrent valid play updates; stale route/account results, repeated submit, same-submission retry after lost response and intentional separate upload of same bytes.

## Acceptance and source-traceability matrix

Rows distinguish core 093 FR/SC coverage from supplemental recorded owner decisions; none creates new FR IDs.

| ID | Procedure / required outcome | Traceability |
| --- | --- | --- |
| V01 — Studio access/ownership | Guest login prompt; User/Admin forbidden in Studio; linked non-banned Artist reads own catalog/metrics only. Direct API role/ID tampering cannot expose/edit B data or assign ownership. Unlinked Artist does not auto-provision. Existing Admin mutation capability stays separate. | FR-001/003; US1/6; SC-001 |
| V02 — Complete catalog/statistics | Own name/profile link, every manageable track and required display metadata, active/hidden states, total/active/plays; no silent backend row cap. Empty has upload prompt. Missing stats distinguish unavailable from zero; partial catalog/stat failure preserves successful portions and labels stale data not updated. | FR-002/003; US1; G090-D06/D14 |
| V03 — Real upload/publication | Submit actual permitted MP3 + required metadata/declarations; verify bytes persist and stable playable association exists in backend store, own row committed, active publication without Admin approval, confirmed toast. Reload/relogin still has track/media. No filename-only success. | FR-004/009/010; US2; checklist immediate-publication decision |
| V04 — Metadata/duration | Missing/invalid input shows correction without closing open form. Exact duration regex accepts/rejects accordingly; entered duration not claimed measured. Edit prepopulates and saves only title/album/genre/duration; blank album clears approved mapping; canonical genre only; 200 vs 201 code-point edit cases. Owner/media/plays/restriction remain unchanged. | FR-004/005/006; US2/3; G090-D04/D15/D16 |
| V05 — Binary policy | With S04 source alignment recorded, MP3 type/content checks and ≤50MiB inclusive boundary; extension/MIME spoof/truncated/invalid file has no upload-success/partial public row. Old MP3/WAV/`audio/*` UI cannot broaden accepted format. | FR-010; recorded G090-D01; S06 |
| V06 — Rights | Declaration starts unchecked each new upload; missing declaration blocks before audio/save. Self-owned versus Licensed/Open conditional source/permission and attribution rules enforced on server. No proof-upload/legal-verification claim or unsupported blanket license. | Project Plan PC-04/ED-06, Vision rights confirmation; recorded G090-D02/03 |
| V07 — No replacement/escalation | Edit has no audio replacement; unexpected audio/owner/play/Admin fields do not mutate them. Do not create albums/genres, lyrics/release-date editor, approval workflow or profile/follow controls. | FR-006 scope; edit mockup; Group README deferred scope |
| V08 — Hide/restore | Hide retains Studio membership, media and historical plays, reduces effective active count; new public search/browse/091 featured rows omit track without hidden count. Restore only Artist preference; no public-again claim if Admin restriction applies; no deleted restoration. | FR-007/009; US4; SC-003; G090-D05/D06 |
| V09 — Delete confirmation/lifecycle | Cancel sends no request; confirmed delete rechecks own authority, removes Studio/public distribution and updates counts, truthful toast. No restore through stale edit/restore. Historical plays retained under recorded D06; physical cleanup/FK behavior matches reviewed S09 rather than guessed cascade. | FR-002/008/009; US5; G090-D06 |
| V10 — Streaming/access | After successful hide/delete, new player/playlist/queue/direct-URL starts/repeat denied, queue skips unavailable; already-started playback may finish. Test known media URL, range 206 and CDN/cache cases under S08. A hidden catalog row alone is insufficient. | FR-007/010, public-distribution outcome; G090-D07 |
| V11 — Upload consistency/retry | Exercise fault matrix below; no partial public row, false success, duplicate same-submission track or unsafe cleanup of committed/other-owned media. Lost response reconciles before retry; separate intentional upload not collapsed merely by title/hash. | FR-004/009/010; G090-D08; S07 |
| V12 — Auth/account/departure | Session expiry/revocation mid-upload/edit, close before/after submission, same-account sign-in and A→B account switch; no B draft/action/result or A→B replay. Retain only accessible temporary input as allowed; departure after submit is not cancellation. | FR-001 ownership; G090-D09–D13; shared 092-F06 |
| V13 — Concurrency/moderation | Force edit/hide/restore/delete and Admin restriction histories; last successful applicable change persists, fields not in patch unaffected, Admin constraint preserved, deleted track not resurrected. No stale false publication toast. | FR-006/007/008; G090-D05/D08; Group 110 boundary |
| V14 — Cross-feature consistency | Upload standalone/album-associated track then reload 091; visibility/plays/release/association feeds eligible deterministic top-five and related-playlist rules. Hide/delete removes eligibility; album text not auto-created release. Profile visibility/follows/original follow time unchanged. 092 still permits personal roles; Studio does not. | 091 FR-007–014A, 092 identity/lifecycle; 093 FR-001/003/007 |
| V15 — Security/error contract | Inspect raw JSON/DOM/accessibility labels/logs; no private B data/keys/provider traces or hidden public inference. Server validates multipart/owner/album/genre and content; standard errors, no guessed upload codes. Fault/read errors not empty/zero. | FR-001/003/005/010; shared security; G090-D14 |
| V16 — Timing/accessibility | Measure SC-002 literally and record conditions; keyboard/focus/modal/retry/touch and responsive/browser tests below. No optimistic-only success or changed timing baseline. | SC-002; Vision §6 |

## Storage failure and recovery matrix

| Injected condition | Expected evidence |
| --- | --- |
| Validation/auth/rights rejected before work | No completed media/catalog side effect; safe correction/login/forbidden feedback |
| Media write definite failure | No acknowledged/active track; retained accessible form for manual correction/retry |
| Media success, DB definite rollback | No public partial track; compensation/reconciliation per reviewed mechanism, no duplicate later |
| Cleanup fails after DB rollback | No success claim; safe recoverable discrepancy assigned to approved operational mechanism, not leaked raw object |
| DB commit succeeds, response dropped | Explicit uncertain outcome, authorized reconciliation finds actual row; same-submission retry does not create another |
| Commit outcome unknown | No false saved/failed/unchanged claim; reconcile first, no blind POST replay |
| Authorization changes during transfer | Final write checks current origin principal/role/ownership; no publish based solely on start-time role |
| Delete distribution commit versus media erasure failure | No newly accessible public track; historical plays and reviewed cleanup semantics preserved without declaring unsupported erasure |

S07/S09 must select actual mechanisms before these can be run; this table does not approve a job queue, operation table, idempotency header, retention TTL or provider.

## Success criteria evidence

- **SC-001**: Every non-Artist/guest management test denies access (V01/V12/V15), including direct requests and Admin exclusion from Studio, while preserving separate project-wide Admin capability.
- **SC-002**: Upload and metadata edit reflect in Studio catalog and backend store within **500 ms of user submission**. Instrument submission, transfer, server validation/media commit/catalog commit and UI confirmation separately; retain the end-to-end assertion. Record payload size/network/warm-cold conditions. Do not move start after transfer, exclude slow samples silently or count optimistic insertion as committed. If measurements fail, report unmet target; S11 requires authorized review for any target change.
- **SC-003**: Every hidden-track fresh public search/catalog/091 query excludes it; own Studio historical plays remain preserved (V08/V10/V14). Include hidden high-play tracks and loss of the last eligible playlist song, with filtering before public limits.

All six stories and FR-001–010 must pass relevant rows; record supplemental G090-D assertions separately so they are not mislabelled original FR wording. Test Vision's metadata-query p95 <100ms on actual reviewed queries; browser parity/latest two major Chrome/Edge/Firefox/Safari, widths 375–2560px/tablet breakpoints, focus trap/return, keyboard Cancel/Delete, labelled errors/retries and touch controls. No waveform or playback redesign required to prove Studio accessibility.

## Review completion record

Attach S decision dispositions, exact reviewed OpenAPI/actual commands, media provenance, provider/config evidence (no secrets), raw response/auth/ownership checks, complete catalog/historical-metric checks, fault/concurrency histories, real timing and browser observations, and independent reviewer results. Keep implementation readiness on hold until critical decisions close. Planning success does not claim uploads, media security or tests have been implemented.
