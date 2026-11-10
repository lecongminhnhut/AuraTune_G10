# Quickstart and Validation — Feature 111 User Management

**Purpose:** Future implementation validation, not a delivered test suite or proof of implementation. [Plan](./plan.md), [research/gates](./research.md#decision-register), [data model](./data-model.md), [interface contract](./contracts/user-management.md).

## Prerequisites

1. Keep branch `110-admin-functions-plan-tasks`; this planning pass performs no branch operation, commit, push, source change or Tasks generation.
2. Obtain accepted relevant U01–U11 evidence. Directory-only work may proceed after its own auth/query/schema/contract gates, but full acceptance includes FR-022/023 and cannot bypass source conflict resolution.
3. Confirm Node/npm/shared harness/scripts (U11). Current manifests have build/dev/preview and root auth smoke, not a User Management suite. No `npm test` or Admin E2E command is presumed installed.
4. Use disposable persistent database and synthetic accounts/sessions under accepted U04 schema/config. Existing auth migration supplies accounts/sessions, not reason persistence or Admin handlers. Do not reset shared data, run speculative DDL or treat volatile fallback as durable acceptance.
5. Configure current backend `JWT_SECRET` in production, `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` privately using existing configuration; no real values in source/docs/browser `VITE_*`. Firebase exchange remains existing auth, not a new Admin provider.
6. Existing API base default `http://localhost:5000/api/v1`, frontend 5173/backend 5000; preserve session user-agent in API fixtures and existing login/refresh setup. Use the approved disposable auth setup rather than copying mock passwords or assuming identical auth/frontend seeds.

## Existing baseline commands

Run only in a later authorized implementation/validation session with a working runtime. From repository root, install current dependencies if needed:

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

The backend command is an authentication smoke check, not 111 acceptance. Database test placeholder and generic server fallback are not feature tests. U11 must supply approved exact unit/API/database/component/browser commands; record actual outputs later. No build, install or application test is run by this planning package.

## Fixtures and controls

- Admin A/B; current User and Artist; banned Admin fixture created by approved test setup, not an unauthorized 111 Admin-target ban; expired/invalid/revoked sessions; stale Admin JWT after demotion; same-account replacement and switch-to-B during refresh.
- At least 21 distinct accounts, including equal creation instants and nontrivial canonical `user_id` ties, all roles and ban states. Include legacy keys where `id` differs from `user_id` and a collision case to test U04 mapping safely.
- Names/emails with case variation, Unicode/diacritics, literal `%`, `_`, quotes and whitespace. Fixtures must distinguish substring in either field from concatenated-field/fuzzy matching and injection/filter-parser interpretation.
- Custom reason, omitted custom/default action, explicit empty/whitespace reason, duplicate ban, duplicate unban, post-unban reason state according to accepted U03; no new maximum length invented.
- User/Artist accounts with existing follows/original timestamps, optional artist links/owned tracks, public/non-public artist and independent Artist/Admin track visibility. No real personal data, provider tokens or commercial media needed for 111.
- Multiple valid target sessions that never send a request during a short ban/unban interval; a password-login attempt, Firebase exchange, refresh/session creation and long protected operation synchronized around ban.
- Approved database barriers for actor demotion versus management, target promotion to Admin versus ban, duplicates and opposing ban/unban. Inject definite rollback/reason-write/session-invalidation failures and dropped responses after commit; fault controls stay test-only.
- Approved standalone 113 calculation fixtures: banned remains an existing account, role changes do not create/delete accounts. If peer implementation/planning is unavailable, record the integration check pending, never simulate it as a pass.

## Acceptance and traceability matrix

Tests below are **planned**, not implemented/executed. Role/default behavior has explicit FRs despite older source conflicts; verify only after accepted alignment, without changing original documents in this pass.

| ID | Procedure / expected evidence | Requirements |
| --- | --- | --- |
| V01 — Admin directory | Current unbanned Admin loads users tab and actual GET; permitted fields only, no raw auth attributes in JSON/DOM/accessibility/error/logs. Guest/User/Artist/banned/expired/revoked callers receive no directory. | US1/4; FR-001/002/004/007–009/015; SC-001/003/004 |
| V02 — Exact filters | Trimmed case-insensitive substring in either email/name, exact role and boolean ban filter; all combined AND. Test empty matches, mixed roles/states, literal special characters, malformed/repeated/type-invalid params per accepted contract, and no SQL/PostgREST/filter injection. | US2/5; FR-003/013/014/021; SC-001/003/006 |
| V03 — Order/page/races | `created_at DESC,user_id ASC`, exactly approved ≤20 page behavior with 21+ rows/ties, filter change resets page1. Reverse slow responses after new filter/page; never display stale rows. Test approved concurrent-page behavior without fabricated complete-directory claim or unapproved total metadata. | US1/2; FR-003/014/021; SC-001/006 |
| V04 — Custom/default ban | Existing non-Admin target with valid custom reason becomes banned and reason is durable. Direct one-click missing-custom action records exact default; explicit blank/whitespace invalid under accepted distinction. Immediate pending feedback, confirmed persisted toast, no mandatory prompt. | US3; FR-005/011/013/017/023; SC-002/003/006 |
| V05 — Target protection | Ban self/other Admin forbidden server-side, no state/reason/session changes. Missing target not-found without old existence/secret hints. Manipulated IDs/canonical-key collisions cannot target another account. Never rely on disabled button. | US3/4/5; FR-005/010/012/015; SC-002–004/006 |
| V06 — Unban/duplicates | Ban/unban duplicate states truthful and noncontradictory; unban clears active ban, no expiry/unban reason requirement. Verify accepted duplicate reason and post-unban reason handling, Admin-target unban disposition and unrelated accounts unchanged. | US3; FR-006/012/016/017; SC-002/005/006 |
| V07 — All login paths | After confirmed ban, password login and Firebase exchange create no valid new target session; refresh and protected requests reject with accepted ban failure even with unexpired access token. Distinguish independent temporary password lock. | US4; FR-007–011/020; SC-003/004 |
| V08 — Old-session revival | With multiple sessions, ban then unban without those devices contacting server during ban. Every pre-ban access/refresh session remains unusable, while fresh sign-in after unban works subject to independent lock/role rules. Test concurrent login/refresh and no acknowledgement before required invalidation. | FR-011/020; Vision FR-110-002; SC-002/003/005 |
| V09 — Role changes | After U02/U05 closure, another account can change among approved `user`,`artist`,`admin`; self-role change denied server-side. Current database role governs subsequent protected requests despite stale JWT/UI. Cover other-Admin/banned-target disposition; no automatic artist creation/link, ban clearing, ownership transfer or follow mutation. | FR-007–009/013/018/019/022; source alignment U02; SC-003/004/007 |
| V10 — Actor/session races | A request/read/refresh then B login, logout or same-account replacement; no A list/toast/action replayed as B. Actor demotion/ban/revocation during operation follows accepted processing boundary; stale role/token cannot restore authority. Clear private Admin data on denied access. | US4; FR-007–011/015/017/022; SC-003/004 |
| V11 — Concurrent mutations | Force duplicates, opposing ban/unban, target promotion versus ban, actor demotion versus management and concurrent session creation. Verify approved outcomes, self/Admin-target guard under current state, no contradictory/partial state and no unrelated account effects. Do not substitute click order or peer winner policy. | FR-005–013/016/022; SC-002/003/005 |
| V12 — Failure/uncertainty | Read failure differs from empty; malformed/missing/forbidden differ correctly. Inject reason/account/session failures and rollback: no false success or partial durable ban enforcement. Drop committed response: remain uncertain, reconcile current target through accepted capability; filtered-page absence is not proof and no blind toggle/retry. | US5; FR-012–017/023; SC-003/005/006 |
| V13 — Boundary/privacy | No delete/reset/impersonate/export/artist-link/content/stats/system actions through 111. Ban does not hide public artist/track or delete follows/times; role grant not Studio ownership. Public anonymous browsing remains usable during auth restriction; admin email/reason stays out of public projections. | FR-011/015/018–020/022; SC-004/007; 091–093/112 |
| V14 — Authoritative peer source | Approved 113 load reads existing distinct users including banned, and role-derived metrics use persisted role rather than mock rows; no 111 counter/job/stat endpoint. Account actions leave 112 restriction and Artist preference separate. Record unavailable peer integration honestly. | FR-018/019; SC-007; 112/113 contracts remain peer-owned |
| V15 — Browser/accessibility/query evidence | Keyboard/search/select/filter/page/direct action/retry, clear labels/focus, shared responsive/browser requirements, long untrusted names/reasons rendered as text. Measure real metadata queries under documented conditions against applicable Vision guidance; no invented 111 mutation SLA or 093 timing reuse. | US1–5 UI; FR-004/017/021/023; shared Vision/security |

## Failure and concurrency minimum

| Injected event | Required outcome / open contract dependency |
| --- | --- |
| Validation, missing target, self/Admin ban or unauthorized actor | Correct safe failure, no administrative write; exact precedence/examples U05 |
| Account/reason/session persistence step fails before accepted commit | No acknowledged partial success; approved atomic rollback/recovery U04/U06/U07 |
| Commit succeeds but response lost | Uncertain UI; authorized current-target reconciliation U05/U09; no guessed inverse or automatic retry |
| Target disappears from a filtered/page result | Do not infer deletion, current role or ban state; accepted acknowledgement/reconciliation required |
| Ban→unban with idle old sessions | Old sessions remain invalid; fresh sign-in required; no revival loophole |
| Login/refresh races ban | Approved boundary prevents new usable session after acknowledged ban; all paths use current state |
| Target becomes Admin while another Admin bans it | Current-target eligibility guard preserved; outcome follows accepted atomic design, no stale-role ban |
| Actor demoted/revoked while managing another account | Current-Admin/session rule enforced at accepted boundary; no unauthorized later write |
| Duplicate/opposing actions | Truthful accepted no-op/order semantics, no contradictory state or unapproved audit overwrite |
| Client account replacement during refresh | No credential reassignment, foreign list/draft/toast or stale role; inspect request actor/storage, not only UI |

No public fault flags, new operation table, version header, endpoint or transaction mechanism is approved by this matrix.

## Success-criteria evidence

| Criterion | Required actual evidence |
| --- | --- |
| SC-001 | V01–V03 directory/filter/projection and deterministic page checks |
| SC-002 | V04–V06 and V11 durable own-target state changes with unrelated accounts unchanged |
| SC-003 | V01/V02/V05/V07/V10/V12 correct auth/permission/missing/validation/empty/failure cases |
| SC-004 | V01/V05/V07/V09/V10/V13 raw response/UI/log secret exclusion |
| SC-005 | V06/V08/V11/V12 duplicate and concurrent final-state/session consistency |
| SC-006 | V02/V03/V05/V12 truthful empty/missing/failed/uncertain outcomes and no false success |
| SC-007 | V09/V13/V14 no out-of-scope capability; role FR-022 separately preserved pending U02 |

All five original stories and FR-001–023 must be linked to actual results. FR-022 role and FR-023 direct default action require dedicated checks even though older stories/checklist did not fully incorporate them. Do not invent a sixth source story or mark their source conflict solved because tests exist.

## Completion evidence

Attach accepted U01–U11 dispositions, final OpenAPI/request-response examples, actual schema/config/key/reason/session mapping, synthetic fixture provenance, exact commands/results, raw disclosure checks, forced concurrency/session histories, browser/query observations and independent review. Scope changes require separately authorized source alignment. Planning completes with reviewable design and explicit gates; it does not claim implementation or test success.
