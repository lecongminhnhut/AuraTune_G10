---
description: "Dependency-aware review Tasks for Feature 111; implementation remains gated"
---

# Tasks: Feature 111 — User Management

**Branch**: 110-admin-functions-plan-tasks | **Date**: 2026-11-09  
**Performed by**: Codex, requested Tasks draft | **Reviewed by**: Not assigned; review pending | **Edited by**: Codex

**Input**: [spec](./spec.md), [requirements checklist](./checklists/requirements.md), [plan](./plan.md), [research](./research.md), [data model](./data-model.md), [interface contract](./contracts/user-management.md), [quickstart](./quickstart.md), [Group 110 cross-feature review](../group-110-cross-feature-review.md).

**Status**: Review-ready Tasks document, **not implementation-ready**. **58 tasks: 10 runnable preparation, 48 gated**. All tasks are unchecked. No task was implemented or test executed by generating this file. U01–U11 and shared M/P decisions remain open. This task-generation request authorizes the document, not source-decision approval, code changes or external operations.

**Tests**: Planned verification is explicitly requested. Test-writing/execution tasks depend on approved interfaces, persistent fixtures and runner. Record real baseline/red failures where functionality is absent before its implementation; never manufacture a failed or passed run. Build/auth smoke does not prove 111 acceptance.

**Organization**: Setup → shared foundations → the five original stories in priority order → cross-cutting integration/validation. FR-022 roles and FR-023 direct actions are explicitly included in US3's account-management phase; no sixth source story is invented.

## Format, path and execution conventions

- Checklist format: task ID, optional [P], story label in story phases, concrete action/path. RUNNABLE means executable preparation **without resolving a decision**; it produces evidence/options/scenarios only. GATED means implementation/acceptance cannot start until its external closure evidence and predecessors exist.
- [P] means independent file-writing work can overlap **after prerequisites and gates**, never permission to bypass them. Shared fixtures/database mutations, shared source files and actual test execution are serialized unless accepted isolated environments exist.
- Paths in task descriptions are repository-relative. New preparation/evidence/module/test paths are **proposed work locations**, not existing artifacts, approved API routes or schema. Proposed test locations are contingent on E16's accepted layout; record any approved relocation in the gate ledger before dependent tasks. Do not choose a new runner/framework from a filename.
- Only this file is created in this pass. Later tasks describe future work; they do not authorize editing protected source documentation now, creating branches/commits, or implementing Features 112/113/090.
- All gated tasks additionally require **E01/G110-C01** applicable governance/slice review and **E16/G110-C16** accepted runtime/path/verification setup. These are included on every gated task line. Dependencies and gates are cumulative through predecessors; task completion is never a substitute for external approval.
- V01–V15 refer to the existing [quickstart acceptance matrix](./quickstart.md#acceptance-and-traceability-matrix). FR/SC/US references refer to Feature 111 unless explicitly prefixed.
- A migration folder path means only the exact accepted delta, if needed; no table, column, reason ledger, token epoch or revocation mechanism is prescribed. Account projection is exactly user_id, display_name, email, role, created_at, is_banned, and ban_reason when recorded; optional reason is not an approved physical column. Roles are exactly user, artist, admin; no unapproved reason length limit is added. A banned-Admin test fixture comes from approved disposable setup, never an otherwise-forbidden 111 Admin-target ban.

## Sources and shared architecture

Reviewed [112 spec](../112-content-moderation/spec.md), [plan](../112-content-moderation/plan.md), [research](../112-content-moderation/research.md), [model](../112-content-moderation/data-model.md), [contract](../112-content-moderation/contracts/content-moderation.md), [quickstart](../112-content-moderation/quickstart.md); and [113 spec](../113-platform-statistics/spec.md), [plan](../113-platform-statistics/plan.md), [research](../113-platform-statistics/research.md), [model](../113-platform-statistics/data-model.md), [contract](../113-platform-statistics/contracts/platform-statistics.md), [quickstart](../113-platform-statistics/quickstart.md).

| Architecture key | Existing sources and shared dependency |
| --- | --- |
| **A1 — Identity/database** | [Auth migration](../../../src/database/migrations/001_auth_tables.sql), [auth repository](../../../src/backend/repositories/authRepository.js), [database](../../../docs/design/database/README.md), [ERD](../../../docs/design/database/er-diagram.md), [consistency](../../../docs/design/database/data-consistency.md): actual id/user_id differs from reference model; no approved reason persistence. Canonical mapping and durable mode required. |
| **A2 — Authentication/current authority** | [Middleware](../../../src/backend/middleware/authMiddleware.js), [auth controller](../../../src/backend/controllers/authController.js), [Firebase exchange](../../../src/backend/controllers/firebaseExchangeController.js), [role navigation](../../../docs/design/architecture/role-navigation.md): current session/current DB role, ban across all entry paths and current action boundary; no new auth mechanism. |
| **A3 — Transport/projection** | [API Contract](../../../docs/analysis-and-design/api-contract.md), [conventions](../../../docs/design/api/api-conventions.md), [server](../../../src/backend/server.js): approved list/ban/unban inventory, missing exact role/page/reconciliation interfaces; standard safe envelope, OpenAPI 3.0.3 completion. No Admin handler currently mounted. |
| **A4 — Frontend/session isolation** | [AdminPage](../../../src/frontend/src/pages/Admin/AdminPage.jsx), [AppStore](../../../src/frontend/src/context/AppStore.jsx), [session client](../../../src/frontend/src/services/sessionApiClient.js): React/Vite/custom shell; current local data/toasts are mocks, refresh/replay and role hydration require origin binding. |
| **A5 — Peer boundaries** | [091](../../090-artist-profile-studio/091-artist-profile/spec.md), [092](../../090-artist-profile-studio/092-follow-artist/spec.md), [093](../../090-artist-profile-studio/093-artist-track-management/spec.md), [owner record](../../../docs/requirements/use-cases/090-artist-profile-studio/README.md), 112/113 sources above: account restrictions distinct from profile/track visibility, follows and ownership. Group 090 planning/research/contracts/Tasks/consolidated review are absent in this checkout; do not invent them or switch branches. |
| **A6 — Governance/security/verification** | [Constitution](../../../.specify/memory/constitution.md) is placeholder; [Team Contract](../../../docs/management/team-contract.md), [architecture](../../../docs/design/architecture/system-architecture.md), [modules](../../../docs/design/architecture/feature-modules.md), [security](../../../docs/design/security/README.md), [DB security](../../../docs/design/database/security-rules.md), [root](../../../package.json), [backend](../../../src/backend/package.json), [frontend](../../../src/frontend/package.json) manifests; approved test runner/deployment remains unverified. |

## Closure evidence register — all 16 Group 110 clusters

These **E** labels index required evidence from the [consolidated register](../group-110-cross-feature-review.md#4-consolidated-decision-register), not new decisions. Gated tasks cite applicable labels and original U decisions. No approval owner is appointed here: Team Contract establishes Hoàng for 110/090, Khoa auth/history, Đăng schema, Huy Player/Queue, Nhựt architecture/escalation; independent reviewer remains unassigned.

| Evidence / cluster | Original decisions | Required closure evidence / Feature 111 applicability |
| --- | --- | --- |
| **E01 / G110-C01** | U01, M01, P01 | Applicable recorded governance/slice review and external acceptance record. Placeholder Constitution is not ratified; existing team process/Sprint 3 DoD is not absent. Not self-signoff. |
| **E02 / G110-C02** | U02, M02, P02 | Source-aligned 111 role/target scope and omitted/default/blank/direct-action disposition where relevant. FR-022 preserves other-account user/artist/admin and no self-role change; resolve old exclusions and target edges. Peer moderation/statistics/System/Vision conflicts remain peer-owned, not blanket blockers on standalone directory work. |
| **E03 / G110-C03** | U04, M03, P03 | Actual durable canonical account/visible/path/session key mapping, legacy collision proof, role representation and source fields; no fallback memory success or guessed DDL. |
| **E04 / G110-C04** | U03, M04; U04 fragment | Accepted effective reason storage, omitted/custom/explicit blank request cases, duplicate/post-unban reason disposition and minimal migration/rollback if needed; no full audit subsystem. |
| **E05 / G110-C05** | U05, M05, P07 | Accepted exact 111 schemas/types/page navigation/standard envelope/error/no-op/default cases and authorized target recognition; exact role capability before role work. No guessed route, field or generic update; OpenAPI 3.0.3. |
| **E06 / G110-C06** | U06, M06, P09 | Accepted current-session/current-DB-role Admin enforcement and compatible errors; password/Firebase/refresh/protected denials; pre-ban sessions invalid after unban and coordinated session creation. Public access preserved. |
| **E07 / G110-C07** | U08; M04/M05 overlap | Accepted actual comparison/collation/time/typed ID and bound literal query, filter-before-order-before-page, 20/page/ties/reset and concurrent-page behavior; transport in E05. |
| **E08 / G110-C08** | U07, M07 | Accepted deployable account/reason/session/current-actor/current-target atomic boundary, duplicates/opposing outcomes/rollback and login/refresh races. Do not copy 112's winner policy or choose RPC/lock/version/token strategy here. |
| **E09 / G110-C09** | U09, M10, P10 | Accepted shared current-role hydration/origin-session refresh/replay, private clearing/query/target generations, lost-response recognition/safe retry and truthful feedback; no A-to-B send. |
| **E10 / G110-C10** | M08 | Peer public/media eligibility evidence. 111 verifies it does not alter profile/track/media state; no stream/provider implementation task here. Only a selected live peer verification needs its applicable interface closed. |
| **E11 / G110-C11** | M09, P06 | Peer history/audit/physical lifecycle. 111 changes no history/media/follow lifecycle and adds no account deletion; do not block standalone directory for unresolved cleanup unrelated to it. |
| **E12 / G110-C12** | P04, P05 | Peer metric/event definitions. Preserve all-current-account count and no side effects; no metric/hint/event producer implementation in 111. Live 113 numerical checks wait for its source contract. |
| **E13 / G110-C13** | P08, P12 | Peer aggregate read/precision/performance design; no 113 SLA/query optimization imported. 111's own query evidence uses E07/E16 and applicable Vision guidance. |
| **E14 / G110-C14** | P11 | Peer System scope/authority. No AI toggle/reset/database reset through 111; unresolved System decisions do not gate independent directory implementation. |
| **E15 / G110-C15** | U10, M11; P13 overlap | Accepted available identity/ban/role/public/own-relationship interfaces and no-side-effects evidence. Record missing Group 090 package/pending peer checks; owner decisions are not team architecture approval. A documented limit is not a fabricated integrated pass. |
| **E16 / G110-C16** | U11, M12, P13 | Accepted supported runtime/test layout/commands, permitted persistent synthetic fixtures, actual multi-session/browser/query/concurrency setup and later results; build/auth smoke not feature acceptance. |

E01–E09/E15/E16 are direct 111 gates as applicable. E10–E14 are peer constraints/conditional integration evidence, not permission to implement or a blanket requirement to complete unrelated 112/113 work. Future gate ledger records exact accepted artifact/revision/reviewer and unresolved remainder; this Tasks file closes nothing.

## Phase 1: Setup and immediately executable preparation

Produce evidence, proposals and written scenarios only. These ten tasks have no unresolved-decision prerequisite and can be performed against current files. Producing a proposal never satisfies a required approval. All future outputs are feature-local; none is created now.

- [ ] T001 [P] **RUNNABLE** — Record current branch, feature artifact inventory and source fingerprints without Git mutations; distinguish checked-in evidence from deployment claims — **Deliverable/path:** specs/110-admin-functions/111-user-management/preparation/source-inventory.md. **Depends:** none. **Trace:** All FR/SC; plan inputs.

- [ ] T002 [P] **RUNNABLE** — Draft a source-reconciliation proposal for FR-022 versus older Admin-role exclusions, FR-023 omitted/default versus explicit blank reason, target edges and wider Vision allocation; preserve unresolved options and request evidence, not approval by inference — **Deliverable/path:** specs/110-admin-functions/111-user-management/preparation/source-conflicts.md. **Depends:** none. **Trace:** FR-005/006/010/013/022/023; U01–U03; G110-C01/C02/C04.

- [ ] T003 [P] **RUNNABLE** — Analyze actual users.id/user_id, auth/session references, legacy collisions, role text and absent reason persistence against reference ERD; document mapping alternatives without DDL or a chosen canonical key — **Deliverable/path:** specs/110-admin-functions/111-user-management/preparation/identity-evidence.md. **Depends:** none. **Trace:** FR-004/005/012/019/022; U04; G110-C03/C04.

- [ ] T004 [P] **RUNNABLE** — Produce proposed directory/ban/unban/role/reconciliation interface cases from current API inventory, including missing capabilities, safe projections, errors and paging; label every unapproved field/path as unresolved and do not select a role endpoint — **Deliverable/path:** specs/110-admin-functions/111-user-management/preparation/interface-proposals.md. **Depends:** none. **Trace:** FR-001–017/021–023; U05; G110-C05.

- [ ] T005 [P] **RUNNABLE** — Map current password/Firebase/refresh/protected-request and client replay code to ban/session/current-role gaps; include idle-session revival and A-to-B replay histories without executing auth — **Deliverable/path:** specs/110-admin-functions/111-user-management/preparation/auth-session-evidence.md. **Depends:** none. **Trace:** FR-007–011/015/020/022; U06/U07/U09; G110-C06/C08/C09.

- [ ] T006 [P] **RUNNABLE** — Write independent account-projection and query fixtures covering exact allowlist, literal special characters, OR field search, AND filters, ties and more than 20 accounts; mark transport/collation choices pending — **Deliverable/path:** specs/110-admin-functions/111-user-management/preparation/directory-scenarios.md. **Depends:** none. **Trace:** US1/US2; FR-002–004/013–015/021; U04/U05/U08.

- [ ] T007 [P] **RUNNABLE** — Write ban/default/blank/no-op/role/missing/concurrent action and rollback scenarios, separating settled guards from pending target/reason/opposing-order policy; do not inherit moderation processing order as account policy — **Deliverable/path:** specs/110-admin-functions/111-user-management/preparation/mutation-scenarios.md. **Depends:** none. **Trace:** US3/US4/US5; FR-005–013/016/017/020/022/023; U02/U03/U07.

- [ ] T008 [P] **RUNNABLE** — Inventory 112/113 and available Group 090 boundaries and owner decisions; record absent Group 090 plans/review, independent visibility/follows/ownership, user-count invariants and non-imported metrics/System scope — **Deliverable/path:** specs/110-admin-functions/111-user-management/preparation/peer-boundaries.md. **Depends:** none. **Trace:** FR-011/018–020/022; SC-007; U10; G110-C10–C15.

- [ ] T009 [P] **RUNNABLE** — Inspect manifests/scripts and write a proposed test-path/runtime/fixture plan; distinguish existing auth smoke/build from missing Admin suites, no dependency install or test execution — **Deliverable/path:** specs/110-admin-functions/111-user-management/preparation/verification-environment.md. **Depends:** none. **Trace:** All SC; U11; G110-C16.

- [ ] T010 [P] **RUNNABLE** — Write private UI state, keyboard/focus, empty/error/uncertain feedback, current-role hydration and account-switch test scenarios with no persistent PII or invented confirmation flow — **Deliverable/path:** specs/110-admin-functions/111-user-management/preparation/ui-session-scenarios.md. **Depends:** none. **Trace:** US1–US5; FR-007–009/014–017/021–023; U09.

**Checkpoint:** Evidence and scenarios may be complete while every unresolved decision remains open. No implementation starts merely because these tasks finish.

## Phase 2: Shared foundational work — gated

Foundational tasks are conditional, not a signal that foundations exist. Each story needs its relevant foundation subset: canonical/API/current authority for server work and session-safe client for UI. Do not require unrelated peer media/System closure or all mutation-specific decisions for a directory-only slice.

- [ ] T011 **GATED** — Record externally accepted applicable governance, directory-slice scope, source dispositions, source/test-path choices and unresolved remainder; do not self-approve or close U/M/P entries — **Deliverable/path:** specs/110-admin-functions/111-user-management/evidence/accepted-gates.md. **Depends:** T001, T002, T003, T004, T005, T008, T009. **Blocked by:** G110-C01, G110-C02, G110-C15, G110-C16. **Closure:** E01/E16 plus E01/E02/E15: recorded applicable team/independent review; directory slice can leave unrelated role/media/System questions gated. **Shared architecture:** A1–A6. **Trace:** All FR/SC; U01/U02/U10.

- [ ] T012 **GATED** — Establish accepted Admin test runner and disposable persistent account/session fixtures with canonical legacy/collision cases and safe fault barriers; record exact commands; no speculative schema or shared-data reset — **Deliverable/path:** src/backend/tests/fixtures/adminUsers.js. **Depends:** T011, T006, T007, T009. **Blocked by:** G110-C01, G110-C03, G110-C16. **Closure:** E01/E16 plus E03/E16: accepted keys, permitted persistent fixture setup, runtime/runner/layout; tests use approved source, not memory fallback. **Shared architecture:** A1/A6. **Trace:** All SC; U04/U11.

- [ ] T013 [P] **GATED** — Implement the accepted canonical account resolver and narrow read projection in a dedicated Admin repository, preserving auth-owned keys; exclude all undeclared fields and do not expose internal lookup fallbacks — **Deliverable/path:** src/backend/repositories/adminUserRepository.js. **Depends:** T011, T003, T004. **Blocked by:** G110-C01, G110-C03, G110-C05, G110-C16. **Closure:** E01/E16 plus E03/E05: deployed key/legacy mapping and exact safe item types; optional recorded reason mapping approved, not an assumed column. **Shared architecture:** A1/A3. **Trace:** FR-002/004/012/015/019; U04/U05.

- [ ] T014 **GATED** — Write shared current-session/current-DB-role Admin guard contract tests for guest/User/Artist/expired/revoked/banned/demoted and auth-store failure, using accepted standard errors — **Deliverable/path:** src/backend/tests/contract/adminAuthorization.test.js. **Depends:** T012, T005, T013. **Blocked by:** G110-C01, G110-C05, G110-C06, G110-C08, G110-C16. **Closure:** E01/E16 plus E05/E06/E08/E16: current actor boundary, error compatibility and runner accepted; record actual baseline failures, never fabricate a red run. **Shared architecture:** A1/A2/A3/A6. **Trace:** FR-001/007–011/015/020/022; U05/U06/U07/U11.

- [ ] T015 **GATED** — Implement shared current-principal/Admin enforcement and ban-aware password/Firebase/refresh/session-creation coordination at the accepted execution boundary; preserve public routes and existing auth callers; ban transaction integration follows T032 — **Deliverable/path:** src/backend/middleware/authMiddleware.js; src/backend/controllers/authController.js; src/backend/controllers/firebaseExchangeController.js. **Depends:** T013, T014. **Blocked by:** G110-C01, G110-C03, G110-C05, G110-C06, G110-C08, G110-C16. **Closure:** E01/E16 plus E03/E05/E06/E08: approved deployable auth/ban/session creation boundary and compatible errors; no token epoch/provider revocation/lock chosen by this task. **Shared architecture:** A1/A2/A3. **Trace:** FR-001/007–011/020/022; U04–U07.

- [ ] T016 **GATED** — Establish the accepted narrow Admin router and standard JSON error/validation boundary, deriving actor server-side and rejecting undeclared writable input; register only approved capabilities — **Deliverable/path:** src/backend/routes/adminUserRoutes.js; src/backend/server.js. **Depends:** T013, T015, T004. **Blocked by:** G110-C01, G110-C05, G110-C06, G110-C16. **Closure:** E01/E16 plus E05/E06: accepted current-admin interface/error policy, no generic account update or guessed role/reconcile route. **Shared architecture:** A2/A3. **Trace:** FR-001/007–009/013/015/017/018; U05/U06.

- [ ] T017 [P] **GATED** — Write session-origin/current-role hydration tests covering A-to-B, logout, same-account replacement, refresh coalescing, stale result/toast and mutation replay; separate GET retry from unknown commit — **Deliverable/path:** src/frontend/src/services/__tests__/adminSessionSafety.test.js. **Depends:** T012, T005, T010. **Blocked by:** G110-C01, G110-C05, G110-C06, G110-C09, G110-C16. **Closure:** E01/E16 plus E05/E06/E09/E16: accepted origin-bound shared client contract and frontend runner; no network send under replacement actor. **Shared architecture:** A2/A3/A4/A6. **Trace:** FR-007–011/015/017/022; U05/U06/U09/U11.

- [ ] T018 **GATED** — Implement accepted origin-account/session-bound refresh/replay and current-role hydration, preserving auth callers and clearing private Admin state on loss/replacement; no blind mutation retry — **Deliverable/path:** src/frontend/src/services/sessionApiClient.js; src/frontend/src/context/AppStore.jsx. **Depends:** T015, T017. **Blocked by:** G110-C01, G110-C05, G110-C06, G110-C09, G110-C16. **Closure:** E01/E16 plus E05/E06/E09: approved shared auth-client lifecycle, safe retry classification and role hydration; public anonymous flows unaffected. **Shared architecture:** A2/A3/A4. **Trace:** FR-007–011/015/017/022; U05/U06/U09.

**Checkpoint:** Conditional acceptance only after relevant predecessors, external gate evidence and actual results; no checkpoint is satisfied by this document.

## Phase 3: User Story 1 — View and review the user directory (P1; proposed read-only MVP)

Goal: current valid Admin reviews the authoritative minimal directory. Independent acceptance: V01/V03 with mixed roles, deterministic <=20-row pages, true empty and denied callers, no secret disclosure. Tests precede new directory implementation; T024 records actual results.

- [ ] T019 [P] [US1] **GATED** — Write directory GET/projection/empty/page contract tests with the exact seven-field allowlist and no password/hash/token/session/provider fields in any outcome — **Deliverable/path:** src/backend/tests/contract/adminUserDirectory.test.js. **Depends:** T012, T013, T016, T006. **Blocked by:** G110-C01, G110-C03, G110-C05, G110-C06, G110-C07, G110-C16. **Closure:** E01/E16 plus E03/E05/E06/E07/E16: accepted item/page/error schema, key/time comparator and runner. **Shared architecture:** A1/A2/A3/A6. **Trace:** FR-001/002/004/007–009/014/015/021; V01/V03.

- [ ] T020 [US1] **GATED** — Implement complete server-side default directory page query, 'created_at descending, then user_id ascending', at most 20 records; preserve canonical type/time and optional recorded reason without raw auth serialization — **Deliverable/path:** src/backend/repositories/adminUserRepository.js. **Depends:** T019. **Blocked by:** G110-C01, G110-C03, G110-C05, G110-C07, G110-C16. **Closure:** E01/E16 plus E03/E05/E07: accepted canonical query/comparison and exact navigation; no guessed totals/cursor or date-now fallback. **Shared architecture:** A1/A3. **Trace:** FR-002/004/014/015/021; V01/V03.

- [ ] T021 [US1] **GATED** — Implement authenticated GET /api/v1/admin/users controller using accepted query/projection/envelope and meaningful loading-independent empty/failure outcomes — **Deliverable/path:** src/backend/controllers/adminUserController.js; src/backend/routes/adminUserRoutes.js. **Depends:** T020, T016. **Blocked by:** G110-C01, G110-C03, G110-C05, G110-C06, G110-C07, G110-C16. **Closure:** E01/E16 plus E03/E05/E06/E07: approved full directory response and permission/error contract. **Shared architecture:** A1/A2/A3. **Trace:** FR-001/002/004/007–009/014/015/017/021; V01/V03.

- [ ] T022 [P] [US1] **GATED** — Implement directory HTTP adapter with exact approved page/item types and origin/query generation binding; do not return mocks or fetch all private auth rows — **Deliverable/path:** src/frontend/src/services/adminUserApi.js. **Depends:** T021, T018. **Blocked by:** G110-C01, G110-C05, G110-C06, G110-C09, G110-C16. **Closure:** E01/E16 plus E05/E06/E09: accepted directory schema, session-bound request and safe error parsing. **Shared architecture:** A2/A3/A4. **Trace:** FR-001/002/004/014/015/017/021; V01/V03.

- [ ] T023 [US1] **GATED** — Replace only users-tab mock directory with accepted API-backed minimal account rows and loading/empty/failure states; maintain independent 112/113 tabs and current-session privacy — **Deliverable/path:** src/frontend/src/pages/Admin/AdminPage.jsx. **Depends:** T022. **Blocked by:** G110-C01, G110-C03, G110-C05, G110-C06, G110-C09, G110-C16. **Closure:** E01/E16 plus E03/E05/E06/E09: approved fields/state/guard integration; no production counts/System changes. **Shared architecture:** A1/A2/A3/A4/A5. **Trace:** FR-001/002/004/007–009/014/015/018; V01.

- [ ] T024 [US1] **GATED** — Execute independent Admin directory checks with persisted mixed-role accounts, 21+ tied rows and denied principals; record actual raw response/DOM/log disclosure and exact command results — **Deliverable/path:** specs/110-admin-functions/111-user-management/evidence/us1-directory-results.md. **Depends:** T019, T023. **Blocked by:** G110-C01, G110-C03, G110-C05, G110-C06, G110-C07, G110-C09, G110-C16. **Closure:** E01/E16 plus E03/E05/E06/E07/E09/E16: working authoritative source/interface/UI/runner; no auth-smoke substitute. **Shared architecture:** A1–A6. **Trace:** FR-001/002/004/007–009/014/015/021; SC-001/003/004/006; V01/V03.

**Checkpoint:** Conditional acceptance only after relevant predecessors, external gate evidence and actual results; no checkpoint is satisfied by this document.

## Phase 4: User Story 2 — Search and filter users by documented criteria (P1)

Goal: exact q/role/is_banned semantics and deterministic page navigation. Independent acceptance: V02/V03 with literal special characters, OR fields/AND filters, ties, malformed inputs, empty results and out-of-order responses. No fuzzy/accent-folding widening.

- [ ] T025 [P] [US2] **GATED** — Write query/filter tests for trimmed case-insensitive email OR display_name substring, exact roles, true/false booleans, AND filters, literal %, _, quotes, Unicode and invalid/repeated inputs per accepted contract — **Deliverable/path:** src/backend/tests/integration/adminUserSearch.test.js. **Depends:** T012, T020, T006. **Blocked by:** G110-C01, G110-C03, G110-C05, G110-C07, G110-C16. **Closure:** E01/E16 plus E03/E05/E07/E16: exact parsing/comparison/literal escape and paging cases accepted. **Shared architecture:** A1/A3/A6. **Trace:** FR-003/013/014/021; V02/V03.

- [ ] T026 [US2] **GATED** — Implement bound/escaped literal search and exact role/is_banned filters before ordering and pagination; never copy mock concatenated-field/accent/fuzzy widening or truthy-string boolean conversion — **Deliverable/path:** src/backend/repositories/adminUserRepository.js. **Depends:** T025, T020. **Blocked by:** G110-C01, G110-C03, G110-C05, G110-C07, G110-C16. **Closure:** E01/E16 plus E03/E05/E07: accepted source comparator and query construction; no extra filters/sorts/page sizes. **Shared architecture:** A1/A3. **Trace:** FR-003/013/014/021; V02/V03.

- [ ] T027 [US2] **GATED** — Validate documented q/role/is_banned and accepted page transport, return standard invalid-filter/empty outcomes and preserve filter-before-page semantics — **Deliverable/path:** src/backend/controllers/adminUserController.js. **Depends:** T026, T021. **Blocked by:** G110-C01, G110-C05, G110-C07, G110-C16. **Closure:** E01/E16 plus E05/E07: approved exact query grammar/booleans/page metadata/error precedence. **Shared architecture:** A1/A3. **Trace:** FR-003/013/014/017/021; V02/V03.

- [ ] T028 [US2] **GATED** — Wire search/role/ban filters and page navigation to API; filter change resets first page, discard older query responses, render valid empty and safe retry without full-directory inference — **Deliverable/path:** src/frontend/src/pages/Admin/AdminPage.jsx; src/frontend/src/services/adminUserApi.js. **Depends:** T027, T023. **Blocked by:** G110-C01, G110-C05, G110-C07, G110-C09, G110-C16. **Closure:** E01/E16 plus E05/E07/E09: accepted navigation/query-generation contract; no guessed page-size/sort controls. **Shared architecture:** A3/A4. **Trace:** FR-003/014/017/021; V02/V03.

- [ ] T029 [US2] **GATED** — Execute combined filters, empty, malformed values, deterministic ties/21+ records, literal injection-resistance and reverse-response races; document accepted concurrent-page observations — **Deliverable/path:** specs/110-admin-functions/111-user-management/evidence/us2-search-results.md. **Depends:** T025, T028. **Blocked by:** G110-C01, G110-C03, G110-C05, G110-C07, G110-C09, G110-C16. **Closure:** E01/E16 plus E03/E05/E07/E09/E16: authoritative fixtures/query comparator/runner; no fabricated snapshot guarantee. **Shared architecture:** A1/A3/A4/A6. **Trace:** FR-003/013/014/017/021; SC-001/003/006; V02/V03.

**Checkpoint:** Conditional acceptance only after relevant predecessors, external gate evidence and actual results; no checkpoint is satisfied by this document.

## Phase 5: User Story 3 — Ban/unban non-Admin accounts; explicit FR-022 role coverage (P1)

Goal: authoritative account-state transitions with valid effective reason, current target/actor guards and durable sessions. FR-022/023 are explicit specification extensions here, not a new source story. Independent acceptance: V04–V09/V11/V12, including default/blank, duplicate, current permissions, old-session invalidation and no unrelated data changes. Exact role route/target cases and account-specific concurrency remain externally gated.

- [ ] T030 [P] [US3] **GATED** — Write ban/unban contract tests for custom/default/explicit blank reason, current non-Admin/self/Admin/missing targets, no-op and accepted duplicate/post-unban reason behavior — **Deliverable/path:** src/backend/tests/contract/adminUserBan.test.js. **Depends:** T012, T016, T007. **Blocked by:** G110-C01, G110-C02, G110-C03, G110-C04, G110-C05, G110-C06, G110-C08, G110-C16. **Closure:** E01/E16 plus E02–E06/E08/E16: source-aligned reason/target/no-op schema and current guards accepted. **Shared architecture:** A1/A2/A3/A6. **Trace:** FR-005/006/010/012/013/016/017/020/023; V04–V06.

- [ ] T031 [US3] **GATED** — Implement only accepted minimal durable reason representation and rollback mapping; use an approved migration only if required, otherwise record no-DDL rationale; do not assume a ban_reason column or create a full audit subsystem — **Deliverable/path:** src/backend/repositories/adminUserRepository.js; src/database/migrations/; specs/110-admin-functions/111-user-management/evidence/reason-persistence.md. **Depends:** T030, T013. **Blocked by:** G110-C01, G110-C03, G110-C04, G110-C08, G110-C16. **Closure:** E01/E16 plus E03/E04/E08: accepted actual reason/store/schema delta and rollback, duplicate/unban disposition; no speculative DDL. **Shared architecture:** A1/A2. **Trace:** FR-004/005/006/013/016/023; U03/U04/U07; V04/V06.

- [ ] T032 [US3] **GATED** — Implement accepted atomic desired-state ban/unban service with current actor/session/current target-role guards, effective reason and coordinated durable all-session invalidation; rollback/failure/duplicate policy and opposing outcomes follow accepted U07, not click order or peer policy — **Deliverable/path:** src/backend/services/adminUserService.js; src/backend/repositories/adminUserRepository.js. **Depends:** T031, T015. **Blocked by:** G110-C01, G110-C02, G110-C03, G110-C04, G110-C06, G110-C08, G110-C16. **Closure:** E01/E16 plus E02/E03/E04/E06/E08: deployable account/reason/session boundary including concurrent login/refresh, idle old sessions and rollback; unban never revives pre-ban sessions. **Shared architecture:** A1/A2/A3. **Trace:** FR-005/006/010–013/016/017/020/023; V04–V08/V11.

- [ ] T033 [US3] **GATED** — Wire established PUT /admin/users/:id/ban and /unban to accepted service and safe acknowledgement/error projection; reject unsupported body fields, no toggle/generic-update endpoint — **Deliverable/path:** src/backend/controllers/adminUserController.js; src/backend/routes/adminUserRoutes.js. **Depends:** T032, T021. **Blocked by:** G110-C01, G110-C02, G110-C03, G110-C04, G110-C05, G110-C06, G110-C08, G110-C16. **Closure:** E01/E16 plus E02–E06/E08: accepted reason/default/no-op/error/target-ID/acknowledgement cases and durable success boundary. **Shared architecture:** A1/A2/A3. **Trace:** FR-005/006/010/012/013/015–017/023; V04–V06/V12.

- [ ] T034 [US3] **GATED** — Implement direct one-click ban/unban actions with immediate truthful pending feedback, required exact default 'Vi phạm tiêu chuẩn cộng đồng', confirmed-only success/no-op toasts and server-backed guards; no mandatory prompt or automatic expiry — **Deliverable/path:** src/frontend/src/pages/Admin/AdminPage.jsx; src/frontend/src/services/adminUserApi.js. **Depends:** T033, T028, T018. **Blocked by:** G110-C01, G110-C02, G110-C04, G110-C05, G110-C06, G110-C09, G110-C16. **Closure:** E01/E16 plus E02/E04/E05/E06/E09: approved omitted/custom/blank request and pending/confirmed interaction, no false success. **Shared architecture:** A2/A3/A4. **Trace:** FR-005/006/010/013/016/017/020/023; V04–V06.

- [ ] T035 [P] [US3] **GATED** — Write role-change tests for other accounts among exactly user/artist/admin, self-role denial, accepted other-Admin/banned-target edges, invalid roles and no ban/link/ownership/follow mutation — **Deliverable/path:** src/backend/tests/contract/adminUserRoles.test.js. **Depends:** T012, T007, T016. **Blocked by:** G110-C01, G110-C02, G110-C03, G110-C05, G110-C06, G110-C08, G110-C15, G110-C16. **Closure:** E01/E16 plus E02/E03/E05/E06/E08/E15/E16: accepted FR-022 scope/target policies and exact role interface; no invented route. **Shared architecture:** A1/A2/A3/A5/A6. **Trace:** FR-007–009/013/018/019/022; V09/V11/V13.

- [ ] T036 [US3] **GATED** — Implement accepted other-account role capability with exact approved method/path/body, canonical targeting and current-authority/self guard; allowlist only accepted role change, no provisioning/ban clearing/ownership transfer — **Deliverable/path:** src/backend/services/adminUserService.js; src/backend/controllers/adminUserController.js; src/backend/routes/adminUserRoutes.js. **Depends:** T035, T032. **Blocked by:** G110-C01, G110-C02, G110-C03, G110-C05, G110-C06, G110-C08, G110-C15, G110-C16. **Closure:** E01/E16 plus E02/E03/E05/E06/E08/E15: accepted role route/schema/target cases/atomic boundary; do not repurpose artist-link. **Shared architecture:** A1/A2/A3/A5. **Trace:** FR-007–009/013/018/019/022; V09/V11/V13.

- [ ] T037 [US3] **GATED** — Wire role selector for another account to approved capability; self disabled plus server guard, refresh current permitted projection, no local-only success or implicit artistId changes — **Deliverable/path:** src/frontend/src/pages/Admin/AdminPage.jsx; src/frontend/src/services/adminUserApi.js. **Depends:** T036, T034. **Blocked by:** G110-C01, G110-C02, G110-C03, G110-C05, G110-C06, G110-C09, G110-C15, G110-C16. **Closure:** E01/E16 plus E02/E03/E05/E06/E09/E15: accepted role/current-user hydration and no-side-effects contract. **Shared architecture:** A1/A2/A3/A4/A5. **Trace:** FR-007–009/015/017–019/022; V09/V10/V13.

- [ ] T038 [US3] **GATED** — Implement accepted mutation acknowledgement/current-target reconciliation for ban/unban/role timeout or dropped response; remain uncertain without proof, filtered/paged absence is not state/not-found proof; no blind resend or guessed status route — **Deliverable/path:** src/frontend/src/services/adminUserApi.js; src/frontend/src/pages/Admin/AdminPage.jsx. **Depends:** T037, T018. **Blocked by:** G110-C01, G110-C05, G110-C06, G110-C08, G110-C09, G110-C16. **Closure:** E01/E16 plus E05/E06/E08/E09: approved authorized target-recognition capability, no-op/current outcome interpretation and safe manual retry. **Shared architecture:** A2/A3/A4. **Trace:** FR-012/016/017/022/023; V10/V12.

- [ ] T039 [US3] **GATED** — Write multi-worker race/rollback tests for duplicates/opposing ban-unban, actor demotion/revocation, target promotion vs ban, role races, session creation/refresh and reason failure; expected winners only from accepted account-specific U07 policy — **Deliverable/path:** src/backend/tests/integration/adminUserConcurrency.test.js. **Depends:** T012, T036, T007. **Blocked by:** G110-C01, G110-C02, G110-C03, G110-C04, G110-C05, G110-C06, G110-C08, G110-C16. **Closure:** E01/E16 plus E02–E06/E08/E16: accepted transaction/concurrency/target/default/no-op policy and real barriers; no per-process-mutex proof. **Shared architecture:** A1/A2/A3/A6. **Trace:** FR-005–013/016/022/023; SC-002/003/005; V08/V11/V12.

- [ ] T040 [US3] **GATED** — Execute forced concurrency/rollback/drop-response histories and verify persisted account/reason/session outcomes, no unrelated changes and no acknowledgement before required invalidation; record real commands/outcomes — **Deliverable/path:** specs/110-admin-functions/111-user-management/evidence/us3-concurrency-results.md. **Depends:** T039, T038. **Blocked by:** G110-C01, G110-C02, G110-C03, G110-C04, G110-C05, G110-C06, G110-C08, G110-C09, G110-C16. **Closure:** E01/E16 plus E02–E06/E08/E09/E16: actual multi-worker persistent fixtures and accepted outcome/reconciliation contracts. **Shared architecture:** A1/A2/A3/A4/A6. **Trace:** FR-005–013/016/017/022/023; SC-002/003/005/006; V08/V11/V12.

- [ ] T041 [US3] **GATED** — Run independent ban/unban/default/no-op and role acceptance, including old-session non-revival after short ban/unban and fresh login, exact permissions and unaffected links/follows/ownership; record remaining peer limitations — **Deliverable/path:** specs/110-admin-functions/111-user-management/evidence/us3-mutation-results.md. **Depends:** T030, T035, T040. **Blocked by:** G110-C01, G110-C02, G110-C03, G110-C04, G110-C05, G110-C06, G110-C08, G110-C09, G110-C15, G110-C16. **Closure:** E01/E16 plus E02–E06/E08/E09/E15/E16: accepted full mutation/auth/UI contracts and durable fixtures; unresolved peer evidence never a pass. **Shared architecture:** A1–A6. **Trace:** FR-005/006/010–013/016–020/022/023; SC-002/003/005/007; V04–V09/V13.

**Checkpoint:** Conditional acceptance only after relevant predecessors, external gate evidence and actual results; no checkpoint is satisfied by this document.

## Phase 6: User Story 4 — Guard unauthorized, expired or banned Admin access (P1)

Goal: backend current authority and origin-safe private UI across all supplied 111 capabilities. Independent acceptance: V01/V05/V07–V10/V13 using approved persistent fixtures; stale token/frontend role cannot authorize. This phase completes and verifies shared enforcement, rather than implementing a separate auth system.

- [ ] T042 [P] [US4] **GATED** — Write complete protected-endpoint authorization tests for all list/search/ban/unban/role paths, stale JWT roles, invalid/expired/revoked/banned/demoted and auth-store failure; deny before data/target-existence disclosure — **Deliverable/path:** src/backend/tests/integration/adminUserAccess.test.js. **Depends:** T012, T027, T036. **Blocked by:** G110-C01, G110-C02, G110-C03, G110-C05, G110-C06, G110-C08, G110-C16. **Closure:** E01/E16 plus E02/E03/E05/E06/E08/E16: accepted role routes, current authority and safe standard errors; no auth-provider replacement. **Shared architecture:** A1/A2/A3/A6. **Trace:** FR-001/007–011/015/020/022; V01/V05/V07/V09/V10.

- [ ] T043 [US4] **GATED** — Audit and complete all Admin user-router authorization attachment/current execution checks and login/refresh compatibility against T042; close any missing guard without guarding anonymous public routes or exposing broad repository fields — **Deliverable/path:** src/backend/routes/adminUserRoutes.js; src/backend/middleware/authMiddleware.js; src/backend/services/adminUserService.js. **Depends:** T042, T015, T016. **Blocked by:** G110-C01, G110-C03, G110-C05, G110-C06, G110-C08, G110-C16. **Closure:** E01/E16 plus E03/E05/E06/E08: accepted guard placement/in-flight authority and compatible error contract; no universal role-change signout rule. **Shared architecture:** A1/A2/A3. **Trace:** FR-001/007–011/015/020/022; V01/V05/V07/V10.

- [ ] T044 [US4] **GATED** — Complete Admin auth-resolving/login/forbidden/current-role UI boundaries and clear private rows/drafts/late toasts on logout, account/session replacement or lost Admin; preserve public Artist Profile access — **Deliverable/path:** src/frontend/src/pages/Admin/AdminPage.jsx; src/frontend/src/context/AppStore.jsx. **Depends:** T043, T038, T018. **Blocked by:** G110-C01, G110-C05, G110-C06, G110-C09, G110-C15, G110-C16. **Closure:** E01/E16 plus E05/E06/E09/E15: accepted frontend/session-generation contract; no cross-account current-user overwrite. **Shared architecture:** A2/A3/A4/A5. **Trace:** FR-007–011/015/017/022; V10/V13.

- [ ] T045 [US4] **GATED** — Write browser/session histories for idle old sessions across ban/unban, local/Firebase/refresh races, A-to-B/Admin-to-Admin replay, same-account replacement and current-role loss; inspect actual request actor as well as DOM — **Deliverable/path:** src/frontend/tests/e2e/adminUserSessions.spec.js. **Depends:** T012, T044, T041. **Blocked by:** G110-C01, G110-C02, G110-C03, G110-C05, G110-C06, G110-C08, G110-C09, G110-C16. **Closure:** E01/E16 plus E02/E03/E05/E06/E08/E09/E16: accepted browser runner/auth/session fixtures; no copied demo credentials. **Shared architecture:** A1/A2/A3/A4/A6. **Trace:** FR-007–011/015/017/020/022; V07–V10.

- [ ] T046 [US4] **GATED** — Execute full authorization/session/account-switch matrix, verify no old-session revival or wrong-actor network replay and no private stale-role disclosure; record actual errors and remaining failures — **Deliverable/path:** specs/110-admin-functions/111-user-management/evidence/us4-auth-results.md. **Depends:** T045, T043, T044. **Blocked by:** G110-C01, G110-C02, G110-C03, G110-C05, G110-C06, G110-C08, G110-C09, G110-C16. **Closure:** E01/E16 plus E02/E03/E05/E06/E08/E09/E16: all relevant server/client/auth interfaces and runnable persistent fixtures. **Shared architecture:** A1–A4/A6. **Trace:** FR-001/007–011/015/020/022; SC-003/004/005; V01/V07–V10.

- [ ] T047 [US4] **GATED** — Verify anonymous public 091 remains accessible under account restrictions while protected own follows/Studio honor current role/ownership; Admin role alone supplies neither owner identity nor artist linking; record absent peer capability as pending — **Deliverable/path:** specs/110-admin-functions/111-user-management/evidence/us4-public-owner-boundaries.md. **Depends:** T046, T008. **Blocked by:** G110-C01, G110-C03, G110-C05, G110-C06, G110-C09, G110-C15, G110-C16. **Closure:** E01/E16 plus E03/E05/E06/E09/E15/E16: accepted available peer/public/own-account interfaces; no new Group 090 implementation or endpoint. **Shared architecture:** A1/A2/A3/A4/A5/A6. **Trace:** FR-011/018–020/022; SC-004/007; V09/V10/V13.

**Checkpoint:** Conditional acceptance only after relevant predecessors, external gate evidence and actual results; no checkpoint is satisfied by this document.

## Phase 7: User Story 5 — Empty, invalid or failed outcomes safely (P2)

Goal: distinct empty/validation/auth/not-found/definite-failure/uncertain states with no false success or private disclosure. Independent acceptance: V02/V05/V06/V10/V12, with dropped committed response and failed recognition. Final integrated acceptance requires supplied operations, although error contract tests can be authored independently after their gates.

- [ ] T048 [P] [US5] **GATED** — Write error/privacy contracts distinguishing valid empty, malformed ID/filter/body, blank reason, wrong authority, missing target, definite store failure and unknown outcome; cover accepted guard/input precedence — **Deliverable/path:** src/backend/tests/contract/adminUserErrors.test.js. **Depends:** T012, T027, T036. **Blocked by:** G110-C01, G110-C02, G110-C03, G110-C04, G110-C05, G110-C06, G110-C08, G110-C16. **Closure:** E01/E16 plus E02–E06/E08/E16: exact error/default/no-op/reconciliation examples, no generic duplicate 409 or storage-as-AI-503 assumption. **Shared architecture:** A1/A2/A3/A6. **Trace:** FR-012–017/021–023; V02/V05/V06/V12.

- [ ] T049 [US5] **GATED** — Complete safe user-controller/repository validation, missing-target handling and response/log projection using accepted standard envelope; no raw trace, secret, unsupported mutation or false empty/success — **Deliverable/path:** src/backend/controllers/adminUserController.js; src/backend/repositories/adminUserRepository.js. **Depends:** T048, T043. **Blocked by:** G110-C01, G110-C03, G110-C04, G110-C05, G110-C06, G110-C08, G110-C16. **Closure:** E01/E16 plus E03–E06/E08: accepted typed validation/error precedence/projection and rollback contracts. **Shared architecture:** A1/A2/A3. **Trace:** FR-012–017/023; V01/V02/V05/V12.

- [ ] T050 [US5] **GATED** — Complete UI distinct empty/invalid/forbidden/not-found/definite-failure/uncertain states and safe manual retry; last-confirmed context only while authorized, no guessed mutation result from filtered-page absence — **Deliverable/path:** src/frontend/src/pages/Admin/AdminPage.jsx; src/frontend/src/services/adminUserApi.js. **Depends:** T049, T044. **Blocked by:** G110-C01, G110-C04, G110-C05, G110-C06, G110-C08, G110-C09, G110-C16. **Closure:** E01/E16 plus E04–E06/E08/E09: accepted reason/no-op/error/recognition states, no blind replay or toast before durable proof. **Shared architecture:** A2/A3/A4. **Trace:** FR-012–017/022/023; V10/V12.

- [ ] T051 [US5] **GATED** — Add accepted disposable fault controls for reason/account/session failure, commit-success/response-loss and reconciliation outage; assert no partial acknowledged ban or guessed inverse; expose no public fault parameters — **Deliverable/path:** src/backend/tests/integration/adminUserFailures.test.js. **Depends:** T012, T049, T032. **Blocked by:** G110-C01, G110-C03, G110-C04, G110-C05, G110-C06, G110-C08, G110-C09, G110-C16. **Closure:** E01/E16 plus E03–E06/E08/E09/E16: actual atomic/fault barriers and safe recognition fixtures approved. **Shared architecture:** A1/A2/A3/A4/A6. **Trace:** FR-005/011–017/023; V08/V11/V12.

- [ ] T052 [US5] **GATED** — Execute empty/invalid/missing/definite-error/unknown-commit journeys including manual retry and lost authorization during failure; record actual API/UI/log outcomes and pending cases — **Deliverable/path:** specs/110-admin-functions/111-user-management/evidence/us5-error-results.md. **Depends:** T048, T050, T051. **Blocked by:** G110-C01, G110-C03, G110-C04, G110-C05, G110-C06, G110-C08, G110-C09, G110-C16. **Closure:** E01/E16 plus E03–E06/E08/E09/E16: exact API/state/transaction and executable fault setup, no assumed success. **Shared architecture:** A1–A4/A6. **Trace:** FR-012–017/022/023; SC-003/005/006; V02/V05/V06/V10/V12.

**Checkpoint:** Conditional acceptance only after relevant predecessors, external gate evidence and actual results; no checkpoint is satisfied by this document.

## Phase 8: Integration, security, polish and acceptance — gated

Validate all five stories and cross-feature boundaries with actual evidence. Do not implement 112/113/090, fix source scope by assumption, treat unavailable peer flows as passed or run unrelated broad checks absent a reason.

- [ ] T053 **GATED** — Execute raw response/DOM/log/browser persistence/shared-cache privacy and input-allowlist checks, confirming only permitted account fields and no password/hash/token/session/provider secret leak or injection — **Deliverable/path:** specs/110-admin-functions/111-user-management/evidence/security-results.md. **Depends:** T024, T029, T041, T046, T052. **Blocked by:** G110-C01, G110-C03, G110-C05, G110-C06, G110-C07, G110-C08, G110-C09, G110-C16. **Closure:** E01/E16 plus E03/E05–E09/E16: accepted projections/query/auth/transaction/client and runnable security fixtures; no new cache policy/quota invented. **Shared architecture:** A1–A4/A6. **Trace:** FR-004/007–009/013/015/018/019; SC-003/004/006; V01/V02/V10/V13.

- [ ] T054 **GATED** — Verify ban/role changes preserve 112 restriction and Artist preference, 092 relationships/original times and 093 ownership; verify 113 current-account source invariant without implementing metrics or System controls, retaining absent-peer integration as unresolved — **Deliverable/path:** specs/110-admin-functions/111-user-management/evidence/cross-feature-results.md. **Depends:** T047, T053, T008. **Blocked by:** G110-C01, G110-C02, G110-C03, G110-C05, G110-C06, G110-C08, G110-C09, G110-C15, G110-C16. **Closure:** E01/E16 plus E02/E03/E05/E06/E08/E09/E15/E16: accepted identity/peer contracts and available authoritative fixtures; C10–C14 are external impact checks only, not permission to implement them. **Shared architecture:** A1–A6. **Trace:** FR-011/018–020/022; SC-002/004/007; V09/V13/V14.

- [ ] T055 **GATED** — Measure accepted directory-query budget under documented dataset/network/concurrency and validate keyboard/focus/search/filters/role/direct action/retry on required browsers/responsive widths; render untrusted strings as text — **Deliverable/path:** specs/110-admin-functions/111-user-management/evidence/browser-query-results.md. **Depends:** T029, T041, T046, T052. **Blocked by:** G110-C01, G110-C03, G110-C05, G110-C07, G110-C09, G110-C16. **Closure:** E01/E16 plus E03/E05/E07/E09/E16: accepted representative query/runtime/browser setup; no invented mutation SLA or 093 upload timing. **Shared architecture:** A1/A3/A4/A6. **Trace:** FR-004/017/021/022/023; SC-001/003/006; V15.

- [ ] T056 **GATED** — Assemble requirement/story/SC-to-test-result matrix with exact accepted interface/schema/commands and remaining U/peer blockers; do not edit source specs/plans/contracts or mark an open original decision approved by test existence — **Deliverable/path:** specs/110-admin-functions/111-user-management/evidence/traceability-results.md. **Depends:** T053, T054, T055. **Blocked by:** G110-C01, G110-C02, G110-C03, G110-C04, G110-C05, G110-C06, G110-C07, G110-C08, G110-C09, G110-C15, G110-C16. **Closure:** E01/E16 plus E01–E09/E15/E16: real individual results and externally accepted applicable dispositions; failed/unavailable peer cases stay pending. **Shared architecture:** A1–A6. **Trace:** FR-001–023; SC-001–007; US1–US5.

- [ ] T057 **GATED** — Run all approved Feature 111 quickstart checks and relevant auth/public regressions using exact accepted commands; record outcomes and discrepancies without broad unrelated feature implementation — **Deliverable/path:** specs/110-admin-functions/111-user-management/evidence/acceptance-run.md. **Depends:** T056. **Blocked by:** G110-C01, G110-C02, G110-C03, G110-C04, G110-C05, G110-C06, G110-C07, G110-C08, G110-C09, G110-C15, G110-C16. **Closure:** E01/E16 plus E01–E09/E15/E16: complete applicable source/interface/runtime/peer evidence and actual runnable suites; build/auth smoke alone insufficient. **Shared architecture:** A1–A6. **Trace:** FR-001–023; SC-001–007; V01–V15.

- [ ] T058 **GATED** — Record independent reviewer assessment of scope, all FR/story/SC results and every applicable gate; retain HOLD and open decisions whenever evidence is missing, without auto-approval, branch operations or deployment — **Deliverable/path:** specs/110-admin-functions/111-user-management/evidence/review-readiness.md. **Depends:** T057. **Blocked by:** G110-C01, G110-C02, G110-C03, G110-C04, G110-C05, G110-C06, G110-C07, G110-C08, G110-C09, G110-C15, G110-C16. **Closure:** E01/E16 plus E01–E09/E15/E16: actual independent review and accepted applicable evidence; no self-signoff or documentation-only readiness claim. **Shared architecture:** A1–A6. **Trace:** All FR/SC/stories; U01–U11.

**Checkpoint:** Conditional acceptance only after relevant predecessors, external gate evidence and actual results; no checkpoint is satisfied by this document.

## Dependencies and execution order

**Exact graph:** every checklist line states its direct predecessors. All predecessor IDs are lower than the dependent task ID; gates are external evidence, not “complete this task to approve itself.” Readiness propagates through predecessors.

Gate evidence is staged: approved applicable **design/interface/path/fixture decisions** are prerequisites for authoring implementation/tests; actual executable setup is prerequisite for running them; successful implementation results are deliverables for acceptance. A task's own future passing test is not a circular prerequisite for writing that test. If approval requires prior feasibility evidence, obtain it through the recorded investigation/owner process first.

| Work slice | Prerequisites and completion boundary |
| --- | --- |
| Preparation | T001–T010 have no dependencies and no decision closure requirement. Each produces a different evidence/proposal/scenario file; reading shared sources is safe. |
| Shared foundations | T011 records external dispositions; T012 accepted fixture/runner setup, T013 canonical repository, T014–T016 server authority/transport and T017–T018 client safety. Story tasks cite required subsets, not a blanket “all 16 clusters closed.” |
| US1 | T019–T024: server requires T013/T016, frontend also T018; accepted source/query/projection contracts. |
| US2 | T025–T029 extend US1's repository/UI deterministically; test authoring T025 can start after its own predecessors. |
| US3 | T030–T041: API work depends on foundational authority and accepted mutation design; role work additionally E02/role portion E05. Full UI acceptance reuses US1/US2's shared Admin page in this decomposition. |
| US4 | T042–T047 verify all delivered endpoints, current-role/session/UI and public/owner boundaries. Shared enforcement begins in foundation/US3, not delayed until this phase. |
| US5 | T048–T052 verify safe outcomes across delivered capabilities. Error contract authoring T048 can overlap other ready test-writing work; actual end-to-end completion follows needed services/UI. |
| Cross-cutting | T053–T058 require actual relevant story evidence; no full-feature readiness if peer/source/decision/test evidence remains missing. |

Full story integration order in this shared-file decomposition is US1 → US2 → US3 → US4 → US5 → final acceptance, after relevant foundations. This is an implementation sequencing choice, not a new product requirement. Independent acceptance criteria use approved synthetic fixtures; shared auth/other story results do not substitute for testing the story.

### Parallel opportunities and examples

Every pair below writes different files, has no dependency on the other task, and must wait for **both sets** of predecessors/gates. They are test/proposal authoring examples, not permission to execute destructive tests concurrently against one persistent environment.

| Scope | Safe example once ready | Shared-resource restriction |
| --- | --- | --- |
| Setup | T001–T010: distinct preparation outputs, no predecessors | Read-only analysis only; no team decision self-approval. |
| Foundation | T013 canonical repository and T017 frontend test authoring | No conflicting AppStore/auth-controller changes or concurrent fixture resets. |
| US1 | T019 directory contracts and T017 client test authoring | Separate test files; actual runs need accepted isolated runner. |
| US2 | T025 query tests and T035 role contract tests | Tests may be authored independently; no unapproved wire examples or mutable DB overlap. |
| US3 | T030 ban contracts and T035 role contracts | Shared proposed fixtures consumed read-only while writing; results still gated. |
| US4 | T042 access contracts and T048 error contracts | Different test files, same accepted error/authority contracts; execution serialized unless isolated. |
| US5 | T048 error contracts and T042 access contracts | Reuse the pair once, not duplicate tasks. |
| Integration | No blanket parallel marker | Browser/query/privacy/concurrency verification shares accounts/sessions and is serialized by default. |

Serialize all tasks touching adminUserRepository, adminUserController/adminUserService/adminUserRoutes, AdminPage/adminUserApi, AppStore/session client or shared auth controller/middleware/server. In particular T013/T020/T026/T031/T032/T049 share repository work; T023/T028/T034/T037/T038/T044/T050 share the Admin UI/adapter. No “[P] means independent stories” assumption.

## Requirement and plan-to-Tasks coverage

These rows preserve every FR; T001–T010 gather evidence, while listed implementation/result tasks remain gated. V references and independent tests above tie this to the existing plan/quickstart, not invented acceptance.

| Requirement | Deliverable task coverage / acceptance |
| --- | --- |
| FR-001 Admin user management | T014–T016, T019–T024, T042–T046; V01 |
| FR-002 directory | T013, T019–T024; V01/V03 |
| FR-003 search/filters | T006, T025–T029; V02/V03 |
| FR-004 allowed identifying fields | T006, T013, T019–T024, T053; V01 |
| FR-005 non-Admin ban/effective nonblank reason | T007, T030–T034, T039–T041; V04/V05/V11 |
| FR-006 explicit unban/no automatic expiry | T030–T034, T039–T041; V06/V08 |
| FR-007 valid Admin only | T014–T018, T042–T046; V01/V07/V10 |
| FR-008 missing/invalid/expired authentication | T014–T018, T042–T046; V01/V07/V10 |
| FR-009 non-Admin denial/no disclosure | T014–T018, T019/T024, T042–T047, T053; V01/V10/V13 |
| FR-010 self/other Admin ban forbidden | T030/T032/T033, T039–T043; V05/V11 |
| FR-011 ban login/protected requests; public access independent | T005, T014/T015, T032/T040/T041, T045–T047; V07/V08/V13 |
| FR-012 missing target/no mutation | T013, T030–T033, T038–T040, T048–T052; V05/V12 |
| FR-013 validation/no mutation | T025–T027, T030–T033, T035/T036, T048–T053; V02/V04/V12 |
| FR-014 valid empty | T019–T024, T025–T029, T048–T052; V01/V02/V12 |
| FR-015 secret exclusion | T013–T018, T019/T024, T042–T044, T048–T053; V01/V10/V13 |
| FR-016 idempotent/no contradictory duplicates | T030–T034, T038–T041, T048–T052; V06/V11/V12 |
| FR-017 distinct safe states/no false success | T021–T024, T027–T029, T033/T034/T037/T038, T048–T052; V10/V12 |
| FR-018 account-only scope | T008/T016/T036/T037/T047/T053/T054; V09/V13/V14 |
| FR-019 no artist linking/admin artist actions | T003/T008/T013/T035–T037/T047/T054; V09/V13 |
| FR-020 ban distinct from password lock | T005/T015/T032/T041/T045–T047/T054; V07/V08/V13 |
| FR-021 query/order/page | T006/T019/T020/T025–T029/T055; V02/V03 |
| FR-022 other-account roles, no self-role change | T002/T007/T035–T041/T042–T047/T054; V09–V11/V13 |
| FR-023 direct/default reason and truthful feedback | T002/T007/T030–T034/T038–T041/T048–T052; V04/V06/V12 |

| Story / success criterion | Planned verification and result deliverable |
| --- | --- |
| US1 (P1) | T019–T024: authorized minimal directory, mixed roles/statuses, empty, deterministic page and secret-free responses; V01/V03. |
| US2 (P1) | T025–T029: exact filters, no matches, invalid filters, literal search/order/page/query race; V02/V03. |
| US3 (P1) | T030–T041: valid/default/custom/blank ban, guards, duplicate/unban/missing, durable sessions, atomicity and explicit FR-022 role coverage; V04–V09/V11/V12. |
| US4 (P1) | T042–T047 plus foundation T014–T018: unauthorized/expired/current-role/ban/login/account-switch/public access; V01/V05/V07–V10/V13. |
| US5 (P2) | T048–T052: malformed/missing/empty/forbidden/store failure/unknown commit, no false success or private disclosure; V02/V05/V06/V10/V12. |
| SC-001 | T024/T029/T055: directory/filter/projection/deterministic page outcomes. |
| SC-002 | T040/T041/T054: durable ban/unban with unrelated accounts/context unchanged. |
| SC-003 | T024/T029/T040/T046/T052/T053: correct authorization/validation/not-found/empty/failure and privacy. |
| SC-004 | T024/T046/T053: raw API/DOM/log secret exclusion. |
| SC-005 | T040/T041/T045/T046/T051/T052: duplicate/concurrent/old-session/uncertain consistency. |
| SC-006 | T029/T052/T055: truthful state distinctions, deterministic interactions, no false success. |
| SC-007 | T037/T047/T054/T056: no out-of-scope capability/peer mutation, FR-022 preserved under accepted source alignment. |

All original scenarios must map to individual actual results in T056; group-level coverage is not a claim that each scenario has passed. FR-022/023 remain requirements even where older checklist/story prose lags; U02/U03/U05 acceptance is not silently inferred.

## Decision traceability and scope safeguards

| Original 111 decision | Preparation | Gated closure/implementation/verification |
| --- | --- | --- |
| U01 governance | T001/T002 | T011/E01, inherited by all gated tasks; T058 independent record |
| U02 role precedence/target edges | T002/T007 | E02 in T030/T032/T035–T047, exact role E05; no source edits or last-Admin rule |
| U03 reason/default/blank/no-op/unban | T002/T007 | E04 in T030–T034/T039–T041/T048–T052; exact persistence E03/E08 |
| U04 canonical key/store/reason | T003 | T013/T020/T031/T032 and E03/E04 across mutations/query/results |
| U05 exact API/current-target recognition | T004 | T016/T019–T023/T027/T030/T033/T035–T038/T048–T052 and E05 |
| U06 login/ban/session enforcement | T005 | T014/T015/T032/T040–T047 and E06/E08 |
| U07 atomic current actor/target/session | T005/T007 | T030–T033/T036/T039/T040/T043/T051 and E08 |
| U08 query/collation/page consistency | T006 | T019/T020/T025–T029/T055 and E07 |
| U09 frontend/replay/uncertain outcome | T005/T010 | T017/T018/T022/T023/T028/T034/T037/T038/T044–T052 and E09 |
| U10 peer evidence/identity integration | T008 | T011/T035–T037/T041/T047/T054/T056–T058 and E15 |
| U11 runtime/runner/environment | T009 | T012 plus E16 on all gated tasks and all real execution/results |

No task closes M01–M12/P01–P13 as a side effect. E10–E14 constrain cross-feature verification; no moderation/media cleanup, statistics event aggregation, AI/System reset or provider task is imported into 111. The wider Vision conflicts remain visible through E01/E02/E15, without changing approved source scope here.

Banning is independent of public Artist visibility, Artist preference/Admin restriction and follow relationships/timestamps. Role changes affect current permissions, never automatically create/link Artist records, reassign track ownership or grant Admin ordinary Artist Studio privileges. Account deletion, password reset, impersonation, export, full audit UI, follower metrics, audio replacement, album CRUD and prior approval queues remain outside these tasks.

## Implementation strategy

**MVP first**: execute only runnable preparation now. After relevant external closure, deliver the US1 directory slice with current authority, canonical source, exact projection/query and session-safe UI. Do not wait for unrelated media/System architecture, but do not claim complete user management, ban safety or role management from that slice.

**Incremental delivery**: validate US1, add exact US2 query interactions, then accepted US3 desired-state/role capabilities with atomic ban/session enforcement, complete US4 full-surface safety and US5 failure handling, then run cross-feature/privacy/browser/query acceptance. Shared foundations are built once, coordinated with 112/113 owners rather than parallel competing rewrites.

**Stop conditions**: missing scope/target/reason/API/key/session/transaction/runner evidence keeps affected tasks gated. Unknown commit remains unknown until approved recognition. Missing peer implementation remains pending evidence, not a mocked integrated pass. A test failure is reported as failure; writing tests or generating this document never approves source decisions.

No deploy, branch create/switch/merge, commit or push is part of this Tasks package. A later task execution must have appropriate authorization for its scope and external environment. Current instruction performs document generation only.

## Document validation record

Task generation used the installed [Tasks skill](../../../.agents/skills/speckit-tasks/SKILL.md), [template](../../../.specify/templates/tasks-template.md) and [project workflow](../../../.specify/workflows/speckit/workflow.yml). Explicit feature setup was read-only with no selector persistence; no extension-hooks file existed at pre-check. The user explicitly requires a review-ready gated document, so the workflow's generic “immediately executable” wording is not used to hide open decisions.

Validated format/count: T001–T058 are unique and sequential; 10 RUNNABLE and 48 GATED. Story task counts: US1 6, US2 5, US3 12, US4 6, US5 5; setup 10, foundation 8 and final integration 6 have no story labels. All tasks have deliverable/path, predecessor and traceability metadata; all gated tasks have cluster, closure-evidence and shared-architecture metadata. Every predecessor exists and has a lower ID, proving the listed task graph acyclic. Parallel authoring examples use separate output files and no mutual dependency; shared-source edits/test fixtures remain serialized.

All 23 FR and seven SC rows and all five source stories are represented. All 53 Markdown links resolve to 51 existing target paths; both anchor references resolve. Future deliverable paths are explicitly proposed and are not asserted to exist. CRC/byte-length comparison found 1,025 pre-existing inspected files unchanged and exactly one addition, this Tasks document. HEAD remains 110-admin-functions-plan-tasks. No extension-hooks file exists at post-check, so no pre/post hooks apply. No branch mutation, application change, task implementation or application test execution occurred. All tasks remain unchecked, all original decisions remain open and implementation readiness is not claimed.

