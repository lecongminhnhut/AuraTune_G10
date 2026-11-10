# Research — Feature 111 User Management

**Date:** 2026-11-09 | **Branch:** `110-admin-functions-plan-tasks`  
**Status:** Review-ready evidence and open decisions; not implementation-ready.

## Authority and review method

Primary authority is the current [specification](./spec.md), [checklist](./checklists/requirements.md) and visually inspected [mockups](./ui/). Later explicit FRs/clarifications and latest project requirements are preserved alongside conflicting older statements; this research does not silently amend any source. Observed code is implementation evidence, not approval of mock policy.

“Latest” means this checkout. No fetch, branch operation, deployment discovery or live database verification occurred. Plan workflow research was split into read-only authentication and cross-feature/source investigations, then consolidated here; no application code/tests or agent-context files were generated.

| Source reviewed | Evidence / planning consequence |
| --- | --- |
| [111 spec](./spec.md), [checklist](./checklists/requirements.md) | Five stories, 23 FRs, seven SCs; exact fields/query/page rules, persistent ban and current auth, direct default reason and other-account roles. Older exclusions conflict with FR-022; default versus blank reason needs accepted mapping. |
| [Vision](../../../docs/proposal/Auratune_Vision_Document.md), §5.3.11/§6 | FR-110-001 directory; FR-110-002 reason and immediate active-session invalidation; FR-110-004 role changes/self-demotion protection. Shared security, query/browser and OpenAPI 3.0.3 goals. Wider Admin capabilities are not automatically part of 111. |
| [Proposal](../../../docs/proposal/proposal.md), §6.11; [Project Plan](../../../docs/proposal/project_plan.md) | Admin permission/account responsibility and backend/database integration; current technology evidence comes from code where options remain unfinalized in documents. No new 111 mutation SLA or full audit service selected. |
| [Constitution](../../../.specify/memory/constitution.md) | Unratified template; no principles/checklist pass inferred. U01. |
| [Team Contract](../../../docs/management/team-contract.md), [Spec Kit guide](../../../docs/management/speckit-workflow-guide.md) | Hoàng 110/090/media, Khoa auth/history, Đăng database, Nhựt architecture; English Markdown/Mermaid and review. Majority decisions/leader escalation are established, not exercised here; no named separate product/security approver invented. |
| [Architecture](../../../docs/design/architecture/system-architecture.md), [modules](../../../docs/design/architecture/feature-modules.md), [roles](../../../docs/design/architecture/role-navigation.md) | Backend role/permission enforcement; distinct user-management/moderation/stats capabilities; Artist role assignment process not fully resolved. |
| [Database](../../../docs/design/database/README.md), [ERD](../../../docs/design/database/er-diagram.md), [consistency](../../../docs/design/database/data-consistency.md), [data security](../../../docs/design/database/security-rules.md) | Reference user key/role rules versus actual auth migration differ. Server access, atomic multi-row work and duplicate/concurrent semantics need actual design; no new DDL/audit/cascade is selected. |
| [Security](../../../docs/design/security/README.md), [Firestore status](../../../docs/design/database/firestore-collections.md) | Least privilege, no secrets/direct client access; Firebase identity exchange is not Firestore selection or authorization. |
| [API Contract](../../../docs/analysis-and-design/api-contract.md), §1/2.10; [conventions](../../../docs/design/api/api-conventions.md) | Three established list/ban/unban paths and `q`,`role`,`is_banned`,`reason`; standard envelopes and errors. No role-update path, Admin per-user read, pagination metadata or final wire/no-op schema. Actual API authority is in analysis-and-design, not stale design/api links. |
| [112 spec](../112-content-moderation/spec.md) | Independent Artist preference/Admin restriction; account management excluded. Existing source drift in one-click versus confirmation language is peer-owned, not resolved by 111. |
| [113 spec](../113-platform-statistics/spec.md) | Current distinct users include banned/all roles; fresh authoritative source needed, no duplicate accounting. Four-metric/system-control additions conflict with older two-metric/read-only text; no stats/operational-control work is imported here. |
| [091 spec](../../090-artist-profile-studio/091-artist-profile/spec.md), [092 spec](../../090-artist-profile-studio/092-follow-artist/spec.md), [093 spec](../../090-artist-profile-studio/093-artist-track-management/spec.md), their checklists | Public profile privacy/anonymous access; own follows for User/Artist/Admin and hidden retention/time; Artist-only owned-track Studio. Ban/access restrictions do not authorize relationship or content mutations. |
| [Group 090 draft decision record](../../../docs/requirements/use-cases/090-artist-profile-studio/README.md) | Existing owner records distinguish account, public identity, ownership, Admin content restriction and request recovery; drafts are not team architecture approval. Its long-upload/current-authority concerns need shared coordination. |
| Group 090 prior planning package | No 091/092/093 plan/research/model/contracts/Tasks or consolidated planning review exists under Group 090 in this checkout. Do not link absent files, reuse remembered cluster IDs as approved current decisions or import another branch. U10 records synchronization evidence needed. |
| [Feature 131 plan](../../130-frontend/131-frontend-foundation/plan.md), current manifests | Proposed shared tests/incremental migration, not installed 111 harness. Runtime/tests U11. |

## Mockup inspection

All five PNGs were opened visually in this planning pass.

| Image | Observed scope / consequence |
| --- | --- |
| [01 directory](./ui/01-user-management-list.png) | Users tab, name/email/join date, role selector, lock action, self disabled. Other Admin tabs are shell context, not 111 scope; avatar initials can derive from approved display name, not an extra account field. |
| [02 search](./ui/02-user-search.png) | Search narrows to a named account. Does not establish fuzzy/diacritic behavior, pagination transport or omit required role/ban filters. |
| [03 role](./ui/03-change-user-role.png) | Other user changed to Artist, self role disabled, success toast. Supports FR-022 intent, not a new route or automatic artist link. |
| [04 ban](./ui/04-ban-user.png) | Direct lock action, banned badge and unlock control, toast, no prompt. Missing visible reason does not remove mandatory recorded/default reason. |
| [05 unban](./ui/05-unban-user.png) | Direct unlock returns normal control and toast. No automatic expiry, deletion, session revival or audit UI established. |

Mock self-disable is weaker than backend policy: code also permits clicking Ban on another Admin. Do not copy this defect. Images do not demonstrate durable writes, auth enforcement or a selected API.

## Implemented architecture and concrete gaps

| Observed code | Implemented capability / limitation |
| --- | --- |
| [AdminPage](../../../src/frontend/src/pages/Admin/AdminPage.jsx) | Frontend-only current-role gate and local directory; `normalizeText` over concatenated name/email, no production role/ban filter/paging/error lifecycle. Role/self controls and direct toasts mutate mocks. Overview/system/content tabs are not authoritative 111 behavior. |
| [AppStore](../../../src/frontend/src/context/AppStore.jsx), `setUserBanned`/`setUserRole` | Local state setters, no server auth or reason/audit persistence. Role setter preserves/nulls demo artist link; it is not artist provisioning. Login mappings force local `banned:false`. |
| AppStore refresh integration | Writes new token into whichever backend session is then current, ignores returned user role and lacks origin guard. Current UI privilege can remain stale or be assigned across accounts. |
| [Session client](../../../src/frontend/src/services/sessionApiClient.js) | Attaches access token, shared refresh and replay; no explicit originating account/session generation validation. A late UI-result guard does not prevent sending A's action as B. |
| [Server](../../../src/backend/server.js), [auth routes](../../../src/backend/routes/authRoutes.js) | Auth/health/Firebase exchange only, no implemented `/admin/users*`. `/api/v1/auth/me`, refresh and session management exist; no need to invent a self-current-role route. Generic fallback is not a compliant Admin error handler. |
| [Auth middleware](../../../src/backend/middleware/authMiddleware.js) | HS256 JWT, current session/user lookup, device/expiry/revocation checks; replaces JWT role with DB role. Banned returns 401/ad hoc envelope; storage failure generic 503, unlike shared 403/USER_BANNED and AI-specific 503 definition. No Admin guard currently supplied. |
| [Auth controller](../../../src/backend/controllers/authController.js), local login | Password/temporary lock checks then creates session **without ban check**. Thus banned local login is not prevented. This is an integration blocker, not a requirement to change password-lock policy. |
| [Firebase exchange](../../../src/backend/controllers/firebaseExchangeController.js) | Rejects banned account with 403 before session creation. Identity exchange continues to use AuraTune sessions; no provider-wide ban policy inferred. |
| Auth refresh/logout-all | Refresh rejects banned account and revokes only that refreshed session. Middleware ban denial does not revoke untouched sessions; they can revive after unban. Logout-all enumerates/revokes sequentially, not an atomic administrative ban transaction. |
| [Auth repository](../../../src/backend/repositories/authRepository.js) | Uses whole auth rows internally, lookup `id` then `user_id`, update by `id`, generic spread updates. Admin DTO must be independent and target IDs mapped safely; no arbitrary request-body spread or broad query serialization. |
| [Auth migration](../../../src/database/migrations/001_auth_tables.sql) | `users.id` text PK, distinct unique `user_id`; role text/default, no enum CHECK here; `is_banned` exists. Sessions reference `users(id)` with existing `is_revoked`. No `ban_reason` or ban audit representation. ER does not prove these missing fields exist. |
| [Supabase client](../../../src/database/supabaseClient.js), [demo DB](../../../src/backend/db.js) | Backend service-role integration when configured, otherwise volatile fallback. RLS enabled without policies in migration is not an Admin authorization layer. Neither direct browser access nor fallback-only success proves durable account administration. |

## Source conflicts and bounded interpretations

1. **Role policy:** FR-022/newer clarification and Vision support changing another user's `user|artist|admin`; Input/checklist still exclude Admin-role management. Preserve the newer requirement in design/verification and record alignment U02. Do not quietly drop Admin transitions, claim checklist approval or add self/last-Admin rules.
2. **Reason/default:** Required effective nonblank reason is fixed; custom absence uses the exact default under FR-023; explicit blank is invalid under FR-013. Distinguishing omission from explicit blank is a proposed compatibility interpretation; U03/U05 must approve how the direct UI and API express it. No forced confirmation prompt is added.
3. **Ban target/errors:** FR-010/US3 explicitly require forbidden for self/other Admin ban despite older “invalid” wording. Unban of Admin targets and role changes on banned targets are not settled by that ban rule. U02/U05 retain these edges.
4. **Feedback:** Immediate direct feedback must not contradict false-success prohibition. Proposed pending-now/confirmed-toast behavior respects both, but exact no-op/uncertain presentation and contract need U05/U09.
5. **Reason history:** Spec requires recorded reason, with later “ban audit record” wording. It does not approve a full audit table/API/history UI, arbitrary audit fields, duplicate reason overwrite or clearing/retention after unban. U03/U04 cover minimal representation and behavior.
6. **Sessions:** Immediate invalidation and fresh sign-in after unban are source requirements, not a new auth system. Existing session revocation is a candidate mechanism; exact atomic coordination with new login/refresh is still U06/U07.

## Decisions, rationale and alternatives

These directions follow existing evidence; they do not close physical/wire gates.

| Direction | Rationale | Alternatives / remaining choice |
| --- | --- | --- |
| Existing React/custom router/Express/auth modules | Implemented baseline; smallest scoped migration | No new stack/router/auth provider |
| Current DB-derived Admin role and identity | Existing middleware already reloads current account | JWT role alone/browser role cannot authorize; processing-time coordination U07 |
| Narrow Admin projection | FR-004/015 fixed allowlist | Do not reuse entire auth row/own-user response or reveal session/provider metadata |
| Backend query and authoritative state | Correct filters/order/page, no false local success | Downloading all auth rows/filtering client-side leaks data; exact transport U05/U08 |
| Desired ban/unban, no raw toggle | Existing contracted paths and duplicate-state requirements | No click-order or last-writer policy imported from peers; concurrency U07 |
| Durable existing-session invalidation candidate | Source ban rule and current revocation primitive | No invented token epoch/table/provider signout; exact deployment/atomicity U06/U07 |
| Keep profile/content/follow identity separate | Feature boundaries and shared specs | No ban cascade, artist provisioning or track reassignment |
| Review-ready Markdown contract first | Exact schemas/path gaps are real | Fabricated final OpenAPI would conceal unresolved decisions; complete accepted OpenAPI before implementation |

## Decision register

All U entries are **OPEN** for closure; known behavioral fragments above are not reopened as blank policy choices. Responsibilities identify established coordination, not proof of sign-off or newly appointed owners.

| ID | Unresolved dependency | Established coordination | Closure evidence / implementation blocked |
| --- | --- | --- | --- |
| U01 | Constitution/governance gap | Nhựt/team | Ratified principles or recorded governance disposition; blocks formal implementation/governance approval claims, not evidence gathering. |
| U02 | Role source precedence and target edges | Hoàng/Nhựt/team; Khoa permission integration | Document alignment of FR-022/newer clarification/Vision versus old exclusions/checklist; specify other-Admin role changes, banned-target role changes and Admin-target unban without inventing self/last-Admin policies. Blocks role-write and unresolved target cases. |
| U03 | Default/custom/blank reason, audit/no-op and unban reason behavior | Hoàng; Đăng persistence; Khoa auth effects | Accepted direct default-reason and explicit-blank request cases, minimal reason record, duplicate and post-unban presentation/retention rules. No full audit system by assumption. Blocks correct ban/default/no-op semantics. |
| U04 | Actual canonical account keys, persistent store, reason representation | Đăng/Hoàng/Khoa | Actual schema/config/mapping including `id` versus visible `user_id`, collision/legacy records, role constraints, reason storage and migration/rollback if needed. Confirm authoritative durable mode; no guessed DDL or production fallback success. Blocks repositories/projection/durable writes. |
| U05 | Exact Admin interfaces and current-target recognition | Hoàng/Khoa/Đăng | Approved list pagination/response schema, request validation, no-op/error/status examples, safe mutation acknowledgement/reconciliation; explicit approved role capability and any necessary target-read capability. OpenAPI 3.0.3 after acceptance; no guessed route/query field. Blocks handlers/adapters/final contract tests. |
| U06 | Complete login/ban/session enforcement and shared auth errors | Khoa/Hoàng; Đăng session persistence | Password/Firebase/refresh/protected paths reject banned users, all active pre-ban sessions durably invalid after unban, current-role enforcement and accepted error compatibility. Cover all devices, short ban/unban interval and concurrent session creation. Blocks FR-011 release; no new auth mechanism assumed. |
| U07 | Atomic actor/target/reason/session work and concurrent outcomes | Đăng/Khoa/Hoàng; Nhựt architecture | Approved deployable transaction/conditional boundary, current-Admin/self/target-role validation under races, rollback and duplicate/opposing-action behavior; coordinate login/refresh/final writes. No RPC/lock/version strategy selected by this plan. Blocks safe mutations and ban acknowledgement. |
| U08 | Query implementation, ordering and page consistency | Đăng/Hoàng | Reviewed canonical comparison/collation/time mapping, literal substring escaping, bound filter construction, exact boolean/role validation and filter-before-order-before-page execution. Demonstrate ties/≥21 rows/concurrent changes; no arbitrary sorting or invented snapshot policy. Blocks faithful directory query/paging. |
| U09 | Frontend current-role hydration, origin-bound replay and uncertain outcomes | Khoa/Hoàng; foundation assignment via team | Accepted shared auth-client contract and Admin lifecycle: A→B/logout/replacement, actor demotion/ban, stale row/list/toast, dropped response and authorized reconciliation. No blind mutation replay, persistent private cache or false success. Blocks safe frontend integration. |
| U10 | Shared Group 090/112/113 source and identity integration | Hoàng/Đăng/Khoa; peer owners per Team Contract | Link accepted identity/ban/role/lifecycle evidence on this branch; review available Group 090 specs/UC records and missing planning package status. Confirm no profile/follow/track side effects and authoritative user-source boundary for 113. Peer source conflicts stay peer-owned. Blocks final integration approval, not all standalone directory work. |
| U11 | Runtime, test harness and acceptance environment | Nhựt architecture; Hoàng feature verification; Khoa/Đăng shared tests | Supported runtime/shared runner/scripts/layout, actual persistent test fixtures and multi-session/concurrency checks, browser/keyboard and query measurements with real commands/results. No Feature 131 proposal or auth smoke treated as 111 pass. Blocks executable validation/readiness claims. |

## Recommended resolution order

1. U01/U02/U03: governance and source scope, preserving all explicit FRs.
2. U04/U08: one actual account key/store/query model and minimal reason persistence.
3. U05: exact list/default/role/no-op/error/reconciliation interfaces using accepted source rules.
4. U06/U07/U09 jointly: durable ban-time invalidation, concurrent authorization and origin-bound client state/replay. U11 tooling review can progress in parallel throughout.
5. U10 cross-feature confirmation and U11 actual FR/SC evidence; retain unresolved peer constraints rather than claiming integrated approval.

Directory/read-only implementation need not await a role-route decision if its own projection/auth/query gates close, but full feature acceptance requires FR-022 and all other applicable gates. No source decision is silently resolved to accelerate implementation.

## Workflow and validation record

Plan setup used the explicit 111 directory, branch context `110-admin-functions-plan-tasks` and `SPECIFY_FEATURE_NO_PERSIST=1`; it created only the authorized plan template before filling this package. Pre-plan extension configuration was absent. Constitution was checked before and after design; review-only HOLD remains under the user's explicit instruction.

Planning checks cover five output artifacts, existing relative links, source traceability and unchanged baseline files. No application build/test, live database/schema operation or auth/provider call is claimed. Final generation checks are recorded after document validation.

Final document validation confirmed all five artifacts, all 65 relative link targets and four anchor references, the eleven U01–U11 register entries, and coverage of all five original stories, FR-001–023 and SC-001–007 in the validation guide. A CRC/byte-length comparison of 1,014 baseline files found no changed or missing existing files and exactly five additions, all inside Feature 111. Original 111 requirements/UI and all peer features remain unchanged. The branch reference is still `110-admin-functions-plan-tasks`; no Git mutation was invoked. Post-plan extension check found no configuration, so no hooks apply. These are documentation checks, not passed implementation tests. No Tasks or agent-context files were generated; implementation HOLD remains.
