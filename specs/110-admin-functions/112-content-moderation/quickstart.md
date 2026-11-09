# Quickstart and Validation — Feature 112 Content Moderation

**Purpose:** Future implementation validation, not a delivered test suite or passed result. [Plan](./plan.md), [research/gates](./research.md#decision-register), [model](./data-model.md), [interface boundary](./contracts/content-moderation.md).

## Prerequisites

1. Keep `110-admin-functions-plan-tasks`; no branch create/switch/merge/commit/push is part of this pass. No Tasks or application changes are delivered.
2. Obtain accepted applicable M01–M12 evidence, especially M02 action/default/confirmation/removed mapping. Directory-only review can be independently validated after its auth/model/projection gates; whole feature includes US4A and public/media/history obligations.
3. Confirm supported Node/npm/shared runner/scripts/layout (M12). Existing manifests do not define a 112 suite. Feature 131 proposals and a timer player do not prove harness/delivery availability.
4. Use disposable persistent catalog/auth/history/media fixtures with permitted synthetic content and accepted actual keys/schema/provider access. Existing auth migration alone does not create a catalog or moderation/audit model. No speculative DDL, shared-data reset or volatile demo success as durable acceptance.
5. Configure current backend `JWT_SECRET` in production and `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` privately using existing configuration; no real values in docs/browser `VITE_*`. Media configuration comes only from accepted M08 evidence; no fabricated variable/provider names.
6. Existing frontend API default is `http://localhost:5000/api/v1`, frontend dev 5173/backend 5000. API sessions must preserve original user agent and existing auth/refresh setup. Use approved disposable accounts, not copied demo passwords.
7. Record absent Group 090 planning and unavailable peer implementation checks honestly. 111's open U gates are coordination evidence, not approval or completed code.

## Existing baseline commands

For a later authorized implementation/validation session with working runtime, from repository root:

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

Existing baseline checks:

```sh
npm --prefix src/frontend run build
npm run test:backend
```

The backend command is an auth smoke script, not moderation validation. No `npm test`, moderation E2E or media/range command is presumed installed. M12 must establish exact approved commands; record their actual results later. The current generic server 404 is not evidence of required missing/forbidden behavior. No install, application build or test runs in this planning pass.

## Fixtures and fault controls

- Current Admin A/B; guest/User/Artist; banned/demoted Admin fixture via approved setup; expired/invalid/revoked sessions; owner Artist X/non-owner Y; unlinked or invalid-owner cases per accepted mapping; account switch/logout/refresh/replacement controls.
- Existing tracks covering all Artist public/hidden × Admin clear/restricted combinations, owner/artist attribution cases, missing/deleted targets and source-aligned reversible removed label only after M02. Distinguish account ban, artist-profile visibility and track preference.
- At least 21 non-deleted songs with tied upload instants and canonical ID ordering, varied artist/title case, literal `%`, `_`, quotes/Unicode, source/rights present/absent/unavailable, enough candidates to test filtering before page/featured limits.
- Custom nonblank reason, explicit whitespace/blank, default direct action and existing duplicate-restriction reason; restore has no new reason/second confirmation under accepted mapping. No assumed length limit or hidden confirmation token.
- Real permitted playable assets through actual approved stream/provider paths, known media URLs, 200/206 Range and cache/index test controls; active playback before moderation and new starts/repeat/queue after it. No commercial tracks or public production fault parameters.
- Retained valid listening-history records and existing/minimum accepted audit representation with known identities; already restricted/deleted historical contributions. Missing data must remain unavailable, not invented zero or vacuous preservation.
- Database barriers for separate workers/sessions and Artist/Admin changes, reason/state/history rollback, media/access/index failure and dropped committed responses. Test controls are disposable infrastructure only.

## Acceptance and traceability matrix

All checks are **planned**. Source-conflicting branches cannot be marked passed until M02 disposition exists; writing a test does not approve its product interpretation.

| ID | Procedure / expected evidence | Traceability |
| --- | --- | --- |
| V01 — Current Admin boundary | Actual Admin API and content tab allow only current valid unbanned Admin. Guest/User/ordinary Artist/expired/revoked/demoted/banned denied, no private data or state change; stale token role insufficient. | US6; FR-001/009–011; SC-001/003/006 |
| V02 — Review projections | Minimal authorized Admin song/owner/moderation context; non-deleted public/Artist-hidden/Admin-restricted rows as accepted. Inspect JSON/DOM/logs for secret/PII/provider/Admin-private leakage. Resolve older blanket non-public/deleted review language through M02, not public access bypass. | US1/2; FR-002–004/012/028; SC-001/003/005 |
| V03 — Rights read-only | Existing available source/distribution/license/attribution shown only in allowed review; absent is absent, source failure unavailable; no fabricated verification or edit. Unexpected title/artist/album/duration/cover/tags/audio/owner/uploader/rights inputs cannot change them. | US2; FR-003/004/008/017; SC-001/004 |
| V04 — Exact list semantics | Non-deleted membership, trimmed lowercased title OR artist substring, AND restriction filter, default both, upload DESC/song ID ASC ties, 20/page, changed search/filter→page1. Test 21+ rows, literal special chars, malformed params, no mock order/accent/fuzzy widening, stale page responses and empty versus failure. | US1; FR-013–015/026; SC-001/003/005 |
| V05 — Restrict and reason | Authorized restrict preserves Artist preference, identity/metadata/media/rights/history and creates accepted restriction/reason. Exercise required confirmation and Cancel/no-write path, valid reason and explicit blank rejection; M02 determines relation to direct/default action. No false success before durable enforcement. | US3; FR-005/008/013/015/029; SC-002/003/006 |
| V06 — Duplicates and restore | Duplicate restrict/unrestrict no state/reason overwrite. Restore clears only Admin layer with no new reason/second confirmation; Artist-hidden remains non-public, other confirmed eligibility applies. Existing-public/nonrestricted restore no-op; missing/deleted restore not-found/no resurrection. | US4; FR-006/012/018/025/027/028; SC-002/003/005/006 |
| V07 — Source-aligned direct removal | After M02 acceptance, execute direct removal/restoration mapping and exact default copyright reason from source; distinguish removed label from terminal delete. Immediate pending versus confirmed toast truthful; no generic removed→active that bypasses Artist hiding/deletion or overwrites reason. | FR-013/015/028/029; newer clarification/mockups; SC-002/003 |
| V08 — Terminal delete | Valid reason/accepted confirmation, Cancel no effect and current Admin/existence checks; source-supported final removal with no later restore. Missing/repeated deleted target follows accepted not-found rule, no side effects; no unsupported physical-erasure claim or restoration workflow. | US5; FR-007/012/013/018/019/027/028; SC-002/003/005/006 |
| V09 — Owner restricted Studio | Current Artist-owner sees relevant own metadata/status/reason only, no Admin private details. Non-owner/guest/currently invalid owner denied. Owner cannot play/self-unrestrict/effectively republish; permitted own metadata/preference changes cannot clear restriction. Deleted item gives no default recovery/review. | US4A; FR-024/025; SC-003/004 |
| V10 — Public catalog exclusion | After successful restrict/remove/delete, freshly loaded search/recommendation/browse/public Artist queries omit unavailable track and private details. Include high-play track, filter before ranking/maxima and loss of last eligible related-playlist song. Restore only reintroduces eligibility when all accepted predicates hold. | FR-006/021/023/025; 091; SC-002/003 |
| V11 — Playback/queue/direct access | Test explicit/collection/playlist/queue/next/previous/shuffle/repeat/replay/direct URL starts after success: deny/skip unavailable. Known provider URL, Range, cache/index paths cannot bypass. Already-started playback may finish; test accepted range-continuation versus new-start design. Stale UI allowed until refresh, no global hard stop/realtime repaint assumed. | FR-021–023/030; Player/Queue; SC-002/003/006 |
| V12 — Historical/audit continuity | Record known valid history/audit identities, restrict/remove/delete per accepted mapping and verify required records/play counts persist without unauthorized mutation. Check concurrent valid play recording and approved reference/physical cleanup failures. No new full audit UI/service/retention, no mock-row sum/113 formula invented. | FR-019/020/030; 113 and Group D06; SC-002/004 |
| V13 — Successful system order | Force two Admins and Artist/Admin histories: restrict→unrestrict and reverse; duplicate restrict with differing reason; unrestrict versus Artist hide; restrict versus Artist restore/edit; delete versus late edit/restore/finalize. Reverse HTTP arrival; last successful applicable system action persists, failed action no change, duplicate reason intact, no resurrection. | FR-018/027; US3/4/5; SC-002/006 |
| V14 — Failure/uncertainty | Definite validation/auth/target/store failures give correct distinct safe outcome, no partial moderation/reason write or false toast. Drop committed response and fail reconciliation: uncertain until accepted current-target proof; filtered-page absence not proof, no blind toggle/replay or optimistic unchanged state. | US6; FR-012–015/027/028/029; SC-003/005/006 |
| V15 — Actor/role/session races | A load/action/refresh then B login/logout/session replacement; no foreign private rows/reasons/toast and no A mutation sent as B. Acting Admin demotion/ban/revocation and owner access loss follow approved execution boundary, clearing private state. Inspect persisted actor/request identity, not UI suppression alone. | US6/4A; FR-009–011/024/027; 111 shared auth; SC-003/006 |
| V16 — Scope and cross-feature boundaries | No user ban/role mutations, stats/AI/system/reset actions, upload/replacement/album/comment/report/notification or full audit feature through 112. No owner/artist/follow membership/time changes; no account-ban→profile-hide cascade. 113 reads retained authoritative history and applies its own definitions; missing peer integration remains pending. | FR-008/016/017/019/020/024/025/030; SC-004 |
| V17 — Browser/accessibility/query evidence | Content list/search/filter/page/reason/accepted confirmation/restore/retry usable by keyboard/touch, labelled/focus-safe, long/untrusted titles/reasons rendered as text. Shared latest-two-major browser/responsive conditions, real metadata-query measurements under documented dataset/network; no invented moderation write SLA or 093 stopwatch reuse. | US1–6/4A UI; FR-004/015/026/029; Vision/shared security |

## Forced histories and fault minimum

| Initial state / event | Required evidence |
| --- | --- |
| Public preference, clear Admin: restrict commits → unrestrict commits | Clear Admin layer; public only under accepted remaining eligibility; original owner/preference unchanged |
| Restricted: duplicate restrict with new/default reason | Original state/reason unchanged; truthful no-op |
| Admin restore versus Artist hide/restore | Each actor changes only its layer; no public claim while any required restriction remains |
| Delete commits → delayed Artist/Admin edit/restore/upload finalization | No resurrection or changed ownership; missing/terminal response per accepted contract |
| Valid play history recording overlaps restrict/delete | Valid preserved events/records follow accepted source consistency; no decrement by action or duplicate count invention |
| Storage/atomic reason write failure | No persisted partial action or false success; accepted rollback/recovery proof |
| Required access/cache/index enforcement unavailable | No acknowledged false completed enforcement or stale new public starts; exact safe failure/recovery M08 |
| Commit succeeds, response lost; reconciliation fails | Unknown, no blind resubmit; authorized current-target recognition M05/M10 |
| New Range/direct URL/repeat after restriction versus active continuation | No bypass, active finish allowed under accepted design; no fabricated playback-session schema |
| Account/role changes during refresh/action | Current authority honored, original actor binding preserved; no new-actor replay |

These are scenario requirements, not approval of a provider, RPC, lock, retention/cleanup policy or additional API fields. Failed runs remain failed; no default winner inferred from click order.

## Success criteria and story completeness

| Criterion | Required actual evidence |
| --- | --- |
| SC-001 | V01–V04 minimal authorized review, rights availability and truthful list |
| SC-002 | V05–V13 correct accepted action/state/public/history outcomes |
| SC-003 | V01–V03/V05–V11/V14/V15 safe denied/invalid/missing/failed/uncertain cases |
| SC-004 | V03/V09/V12/V16 exact scope and peer boundaries |
| SC-005 | V02/V04/V06/V08/V14 distinct empty/missing/unavailable without false success |
| SC-006 | V01/V05/V06/V08/V11/V13–V15 actual backend/current-authority/system-order evidence; older pending wording aligned under M02 |

Trace every original scenario individually: US1 list/minimum fields/non-public/empty/missing; US2 owner/rights/absent/deleted-or-unavailable review; US3 valid/duplicate/missing/unauthorized/blank; US4 restore/no-op/Artist-hide/deleted; **US4A** owner metadata/reason, non-owner denial, no bypass, lost access and no deleted recovery; US5 confirmed/duplicate/denied/failed/blank delete; US6 missing/expired/wrong-role/server failures. Do not renumber US4A away or omit FR-029/030 because older stories/checklist lag.

## Completion evidence

Record accepted M01–M12 and shared 111-U dispositions, source-aligned action table, exact OpenAPI/examples/commands, actual schema/projection/history/audit/media provenance without secrets, real processing/fault/session/range results, owner/public peer checks, browser/query observations and independent reviewer findings. Keep unmet requirements/open decisions visible; only documentation review readiness is claimed by this package.
