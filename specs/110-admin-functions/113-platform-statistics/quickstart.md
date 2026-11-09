# Quickstart and Acceptance Validation — Feature 113

**Date**: 2026-11-09 | **Performed by**: Codex | **Reviewed by**: Not assigned; pending | **Edited by**: Codex

**Status**: Future validation guide, not an implemented suite or passed result. [Plan/traceability](./plan.md#requirements-and-success-criteria-traceability), [research gates](./research.md#decision-register), [metric dictionary](./data-model.md#metric-dictionary), [contract](./contracts/platform-statistics.md).

## Prerequisites and execution boundary

1. Preserve `110-admin-functions-plan-tasks`; this planning pass performs no branch create/switch/merge/commit/push, no app change or Tasks generation.
2. Resolve applicable P01–P13, particularly P02 metric/System precedence. Written scenarios/source analysis can proceed now; exact wire/database/browser acceptance is gated. No test silently chooses a disputed policy.
3. Verify actual persistent account/catalog/listening sources, key mapping, event qualification/identity/invalidity and lifecycle. Existing auth migration alone does not provide catalog/history. Do not mark a mock-backed empty store as a correct 0.
4. Establish approved disposable fixtures and fault controls; no production user data, shared-data reset, speculative DDL or invented event flag. Configure existing backend SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY and production JWT_SECRET privately; no secrets/client VITE service keys in docs.
5. Verify supported Node/npm, exact runner and dependency setup P13. Existing manifests provide dev/build/auth smoke commands but no statistics suite. DB/provider access and actual deployment are not verified by this plan.
6. Use approved disposable Admin/User/Artist accounts with real AuraTune sessions. No copied demo password. Keep consistent original user agent for current session checks; verify current server role/ban, not only frontend role.
7. Record missing Group 090 planning evidence and unimplemented peer integrations. 111/112 plans and 071/101 proposals are coordination sources, not already delivered fixes.

## Existing baseline commands for a later implementation session

From repository root, only after implementation authorization and working runtime:

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

Backend defaults to port 5000 and frontend dev to 5173; frontend API default is http://localhost:5000/api/v1. Existing backend smoke script tests auth, **not** statistics correctness. No statistics test command, SQL setup, missing route/payload or automated browser suite is fabricated. P13 must provide exact approved commands later. No installation/build/application tests executed here.

## Fixture design and independent oracles

- Accounts: all three roles, multiple OAuth links for one account, no linked Artist, banned account, existing temporary lockout if supported, deleted/removed account per accepted lifecycle, extant demo/test account and guest. Count canonical identities independently from login/profile links.
- Artists: public/hidden/missing/deleted according to accepted source, optional linked user, Artist role without profile and profile without linked account if accepted. Include multiple albums/tracks per Artist to detect join multiplication. Never use role count as public profile count.
- Tracks: all independent Artist public/hidden × Admin clear/restricted combinations; both restrictions on one track, terminal deleted versus accepted reversible removed. Inventory/hint expected totals remain pending P04; no mock enum chosen.
- Events: known valid retained records, repeated same user/song at same timestamp with distinct source identities, known duplicate same source identity only where provided, known source-invalid event where represented, unknown/lost required identifiers. Include later-banned/removed users and hidden/restricted/deleted songs with event-time validity evidence.
- Producer qualification: source-approved normal and short-track thresholds, interruptions before qualification, replay/retry behavior. These are producer integration checks; no new threshold or ID introduced by 113.
- Lifecycle: permitted disposable clear-all/365-day purge boundary fixtures from 071, catalog removal/moderation and source-reference preservation fixtures. Do not invent a hidden archive to retain counts.
- Completeness: more rows than configured provider/client page limit, misleading first-page subtotal, source empty versus missing table/denied source/outage, invalid count shape/unsafe integer, partial source failure. Approve actual large-count encoding before exact DTO tests.
- Time/concurrency: controllable server calculation instants across UTC/UTC+7 midnight, delayed/out-of-order refreshes, concurrent registration/deletion/role/ban/profile/moderation/event/purge operations. No fake render-time timestamp.
- Security/client: Admin A/B, User/Artist, banned/demoted Admin, expired/revoked/replaced sessions; account switch during GET and token refresh; failed refresh after successful load; safe log/DOM/response inspection.
- Controls: accepted browser-demo versus platform AI/reset mode only after P02/P11; permitted reset effects and default state from approved source, not a production DB reset fixture.

Expected counts must be calculated from accepted source identities/definitions independently of the implementation. UI mock values and sums of private lists/song counters are not oracles.

## Planned acceptance scenarios

All scenarios below are **PLANNED, NOT EXECUTED**. Results must remain pending while corresponding policy, exact contract/source or harness is unresolved.

| ID | Procedure and required result | Traceability / gates |
| --- | --- | --- |
| **V01 — Backend current Admin boundary** | Request actual GET as guest, invalid/expired/revoked session, current User/Artist, valid Admin, banned/demoted Admin with old Admin token. Only current valid Admin receives aggregates; denied responses contain none. Fail closed on auth storage failure. | US1/3; FR-001/007/020; SC-001/003; P07/P09 |
| **V02 — Accepted overview scope** | Inspect approved cards/hints and actual API-backed data. Match recorded P02 disposition for four-card FR-002 versus earlier two-value clauses. No silently omitted requirement, extra KPI/chart/drilldown or mock fallback. | US1/3; FR-002/010; SC-001/006/007; P02/P04/P07 |
| **V03 — Current account count** | Count all extant User/Artist/Admin/test/demo/banned/locked accounts once, multiple providers/profile/album joins do not multiply. Guest/removed excluded. Ban/unban/role change keeps M1 fixed when membership unchanged; registration/removal updates per accepted read boundary. Empty authoritative account source yields 0. | US1/2; FR-003/005/015; SC-001/002/007; P03/P08/P12 |
| **V04 — Artist and account hints** | Public Artist count differs correctly from Artist-role accounts. Hidden profile changes accepted M2, not M1 or historical plays. Unlinked/role-without-profile cases and locked/temporary-lockout distinctions match accepted P04 dictionary. Source failure is not hint 0. | FR-002/003/018; SC-001/002/007; P02/P03/P04/P07/P08 |
| **V05 — Catalog inventory and hidden/removed hint** | Independently apply accepted inventory and subset/union rules. Both Artist-hide and Admin restriction on same track do not double-count where union defined; restore cannot bypass restriction, terminal deleted cannot return. No public-only inventory inference or account-ban cascade. Missing source unavailable. | FR-002/005/018; SC-001/002/007; P02/P04/P07/P08; 112 shared gates |
| **V06 — Valid play authority/duplicates** | Compare exact result to complete retained valid event oracle. Repeated qualified plays count separately; known duplicate source identity collapses only under source rule. Same user/song/time is not heuristic duplicate. No song-counter/browser/demo addition, no requalification/new ID. Producer thresholds/retries use approved 071 contract only. Zero valid events => 0 after trusted complete calculation. | US1/2; FR-004/005/015/018; SC-001/002/006/007; P05/P07/P08/P12 |
| **V07 — Historical lifecycle** | Record valid event then ban/remove account, hide Artist/track, restrict/remove/delete song; retained valid event remains counted. Do not inner-join current eligible entities. Required-ID/source conflict gives unavailable, not reduced subtotal. Clear-all/365-day purge follow accepted P06 retained-source policy; no lifetime/archive promise. | FR-004/015/018; SC-006/007; P05/P06/P08; 071/093/112 |
| **V08 — Zero/empty/unavailable** | Distinguish authoritative empty M1/M4=0 from missing source, denied query, validation conflict, truncated source and outage. No fake 0, partial subtotal or fabricated successful timestamp. Expanded metric zero semantics follow approved dictionary. Meaningful no-data presentation must not mislabel reliable zero. | US2; FR-005/006/018; SC-002; P04–P08/P12 |
| **V09 — Partial and failed refresh** | Load trusted users with failed history, reverse, shared source failure and malformed/full payload failure. Each trusted metric of current generation has own timestamp; failed peers unavailable. Refresh after success then fail: no old current number/hint or mixed snapshot, retry usable. Whole failure cannot report generic false success. | US2; FR-006/016/018/019; SC-002; P07/P08/P10 |
| **V10 — Freshness/timestamps/ordering** | Open and manual refresh trigger new calculation; no polling/network timer. Verify timestamps are successful calculation instants, UTC+7 display across midnight, independent of browser clock/render. Delay earlier request until after newer completes; older cannot overwrite or mix. Concurrent source writes obey accepted P08 boundary, no unapproved atomic-snapshot guarantee. | FR-015–018; SC-001/002/007; P07/P08/P10 |
| **V11 — Session/account races** | Start A load/refresh, switch to B/logout/replace session/demote/ban/expire; suppress all A results and prevent replay as B. Withhold existing values/hints/timestamps on lost Admin; safe same-origin recovery uses current role. Repeat with late success/error and cached page. Inspect request identity as well as UI. | US3; FR-007/019/020; SC-003/005; P09/P10 |
| **V12 — Privacy/security projection** | Inspect API, DOM, browser persistence/shared cache and safe logs for user IDs/emails/ban reasons/private history/follows/tokens/keys/source query/provider diagnostics. Only accepted aggregate allowlist, backend service credentials never browser-visible. Unauthorized errors disclose no metric. No Admin personal-history drilldown. | US3; FR-007/009/012/013; SC-003/005; P07/P09/P10 |
| **V13 — Completeness/performance/precision** | Compare >provider-page-limit and large-count results to independent oracle; truncation/estimate/overflow never accepted as trusted count. Capture dataset, query plan/count cost, concurrency, network, backend duration and UI load against accepted P12 budget/applicable Vision NFR. No job/cache/new index silently introduced. | US1/2; FR-004/014/018; SC-007; P03–P08/P12/P13 |
| **V14 — Read-only and cross-feature scope** | GET and stats UI cannot mutate accounts/roles/moderation/catalog/history/song counters or create background job. No filters/polling/follower metrics, exports, charts, AI analytics, audio replacement, album CRUD or approval queue. Public 091 remains anonymous; private follows/ownership unchanged. Stats do not repurpose personal analytics routes. | US4; FR-008/010–016; SC-004/006; P02/P07/P11 |
| **V15 — Conditional System acceptance** | After P02/P11 disposition verify both AI-toggle graceful fallback and clean browser-demo reset within approved mode/authority/effects, separately from stats GET. Deny non-Admin, protect authoritative DB/history, use accepted default/error/retry/session semantics. If remote mutations approved, test dropped response/uncertain outcome without blind replay; do not invent those APIs or confirmation policy. | FR-021 plus conflict US4/FR-008/SC-004; P02/P09/P10/P11 |
| **V16 — Responsive/accessibility and peer integration** | Keyboard/label/focus-safe refresh and announced loading/unavailable states, readable localized counts/timestamps, shared latest-two-major browsers/responsive widths. Validate actual account/moderation/Artist/history/Player integration, not just mocks; record missing peer evidence. | US1–4; FR-005–009/016–020; SC-001–007; P13/applicable Vision |

## Forced consistency and failure histories

| Sequence | Required evidence |
| --- | --- |
| Valid event commits → song restriction/deletion; stats load | Event remains if retained/valid; source IDs preserved or trusted result unavailable, never guessed subtotal |
| Event retry with source duplicate identity versus separate replay | Source-authorized duplicate rule only; genuine replay remains distinct |
| Account ban/role change during load | M1 existence unchanged; access/hints follow accepted read/current-authority boundary |
| Artist restore while Admin restriction remains | No effective public eligibility bypass; statistics do not mutate either layer |
| Clear/purge concurrently with aggregation | Accepted P06/P08 source retention/read semantics, no invented archive or mixed partial count |
| User metric success + history failure | Same-generation trusted user result only; failed play metric unavailable |
| Previous success → refresh both fail | No stale numbers/hints masquerading as current; manual retry remains |
| Slow load 1 → load 2 succeeds → load 1 returns | Load 1 discarded; no timestamp/value mixture |
| Admin A token refresh → B account takes over | No A replay/render under B; all A private state cleared |
| Complete empty source versus inaccessible/missing source | Trusted zero versus unavailable; no fake empty success |
| Demo reset in accepted local mode | Only accepted local effects; no authoritative remote reset or platform-play subtraction inferred |

## User-story and success-criteria completion

Trace every original scenario: US1 authorized/source-backed aggregates/non-Admin denial; US2 true zero/no-data/partial/full failure; US3 anonymous/wrong-role/minimal aggregate/unsupported-metric exclusion; US4 no edit/ban/unban/hide/remove/restore and read-only partial failure. FR-002/021 remain separately explicit, not dropped because older stories omit them.

| Criterion | Evidence required |
| --- | --- |
| SC-001 | V01–V07/V10 accepted scope/current Admin/source totals |
| SC-002 | V08–V11 zero/empty/partial/failure/current-only behavior |
| SC-003 | V01/V11/V12 denied access/no disclosure |
| SC-004 | V14 and explicit P02/P11 System disposition |
| SC-005 | V11/V12 actual response/DOM/cache/log privacy |
| SC-006 | V02/V04–V07/V14 source-backed scope/formulas/no new time windows |
| SC-007 | Accepted dictionary/source mappings and V03–V10/V13 complete independent oracle |

Record exact accepted P decisions and U/M dependencies, actual source schema/provenance, approved commands, fixture/oracle identity summaries without private data, observed responses/timestamps, failure/concurrency/auth results, query measurements, browser checks and independent review. Until these exist, documentation review readiness does not imply implementation readiness or passed tests.

