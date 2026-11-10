# Group 110 — Admin Functions: Cross-feature Technical Review

**Date**: 2026-11-09  
**Branch inspected**: 110-admin-functions-plan-tasks  
**Performed by**: Codex, requested documentation review  
**Reviewed by**: Not assigned; independent review pending  
**Edited by**: Codex  
**Assessment**: **Review-ready with implementation HOLD.** No original decision is approved, closed or renumbered.

## 1. Executive summary

All three features have their expected specification/checklist, plan, research, model, Markdown interface boundary, validation guide and UI references. Documented coverage totals **74 functional requirements, 20 success criteria and 16 story headings**: 111 has 23/7/5; 112 has 30/6/7 including US4A; 113 has 21/7/4. This is planning coverage, not executed acceptance.

All **36 original unresolved entries** were found: **U01–U11**, **M01–M12**, **P01–P13**. They are organized below into **16 Group 110 dependency clusters** with complete original-ID traceability. Clusters coordinate shared dependencies; they do not replace decisions or imply that 36 approval questions become only 16 decisions.

The plans consistently distinguish account bans, Artist identity/ownership, public-profile visibility, Artist track preference, Admin restriction and terminal deletion. They reject frontend mock counts as authoritative statistics and preserve unapproved interfaces as gates. Production blockers remain source precedence, canonical durable data, server/client session safety, exact API contracts, atomic processing, media enforcement, historical event lifecycle and executable verification.

The latest Vision adds significant baseline alignment questions: FR-110-005 describes Admin metadata editing/purge while 112-FR-008 forbids metadata editing in this feature; FR-110-007 lists metrics beyond 113's explicit exclusions; FR-110-008 describes database reset/seeding while 113's newer clarification specifies browser-demo reset. These genuine scope differences belong in existing source-precedence decisions, **not in silently expanded implementation**.

**Recommendation**: review and preparation-only task planning can proceed when separately requested. A complete production Tasks package cannot be presented as unconditionally executable. Group 110 is not implementation-ready; no decision approval or passed application test is asserted.

## 2. Sources, authority and review limits

“Latest” means this checkout. No remote fetch, other-branch import, live database or deployed-service verification occurred. Explicit feature requirements, owner decisions, proposals, prototype observations and static code evidence are different evidence classes.

### Feature packages

| Feature | Requirements | Planning and validation | UI |
| --- | --- | --- | --- |
| 111 | [Spec](./111-user-management/spec.md), [checklist](./111-user-management/checklists/requirements.md) | [Plan](./111-user-management/plan.md), [research](./111-user-management/research.md), [model](./111-user-management/data-model.md), [contract](./111-user-management/contracts/user-management.md), [quickstart](./111-user-management/quickstart.md) | All five [mockups](./111-user-management/ui/) inspected: list/search/role/ban/unban. |
| 112 | [Spec](./112-content-moderation/spec.md), [checklist](./112-content-moderation/checklists/requirements.md) | [Plan](./112-content-moderation/plan.md), [research](./112-content-moderation/research.md), [model](./112-content-moderation/data-model.md), [contract](./112-content-moderation/contracts/content-moderation.md), [quickstart](./112-content-moderation/quickstart.md) | All four [mockups](./112-content-moderation/ui/) inspected: list/status/remove/restore. |
| 113 | [Spec](./113-platform-statistics/spec.md), [checklist](./113-platform-statistics/checklists/requirements.md) | [Plan](./113-platform-statistics/plan.md), [research](./113-platform-statistics/research.md), [model](./113-platform-statistics/data-model.md), [contract](./113-platform-statistics/contracts/platform-statistics.md), [quickstart](./113-platform-statistics/quickstart.md) | All five [mockups](./113-platform-statistics/ui/) inspected: overview/four card highlights; no inferred analytics drilldown. |

Mockups show local controls/toasts and seed values, not durable writes, backend enforcement or trustworthy aggregates. A missing prompt does not waive a required reason/confirmation.

### Shared sources

- Product/governance: [Vision](../../docs/proposal/Auratune_Vision_Document.md), [Proposal](../../docs/proposal/proposal.md), [Project Plan](../../docs/proposal/project_plan.md), [Team Contract](../../docs/management/team-contract.md), [Constitution](../../.specify/memory/constitution.md).
- Architecture: [system](../../docs/design/architecture/system-architecture.md), [modules](../../docs/design/architecture/feature-modules.md), [role navigation](../../docs/design/architecture/role-navigation.md).
- Data/security: [database](../../docs/design/database/README.md), [ERD](../../docs/design/database/er-diagram.md), [consistency](../../docs/design/database/data-consistency.md), [DB security](../../docs/design/database/security-rules.md), [security guidance](../../docs/design/security/README.md).
- Interfaces: [current API Contract](../../docs/analysis-and-design/api-contract.md), [conventions](../../docs/design/api/api-conventions.md). Inherited references to absent design/API aliases do not create another authoritative contract.
- Workflow: [project guide](../../docs/management/speckit-workflow-guide.md), [workflow](../../.specify/workflows/speckit/workflow.yml), [Tasks skill](../../.agents/skills/speckit-tasks/SKILL.md), [Tasks template](../../.specify/templates/tasks-template.md), [Plan template](../../.specify/templates/plan-template.md). No setup/Tasks generator executed for this review.
- Peers: [091](../090-artist-profile-studio/091-artist-profile/spec.md), [092](../090-artist-profile-studio/092-follow-artist/spec.md), [093](../090-artist-profile-studio/093-artist-track-management/spec.md), their available checklists and [Group 090 owner record](../../docs/requirements/use-cases/090-artist-profile-studio/README.md).
- History: [071 specification](../070-listening-history/071-listening-history/spec.md). Platform retained events differ from personal analytics, per-track popularity and own-Artist Studio totals.

**Missing evidence**: Group 090's 091/092/093 plans/research/models/contracts/Tasks and consolidated planning review are absent in this checkout. No Group 110 use-case directory was found. Available Group 090 records identify Drafts/no peer approval, while recording specific owner-confirmed decisions. Their behavioral confirmations remain evidence; their technical mechanisms/team approval cannot be presumed. Historical conversational artifacts are not current files.

### Observed implementation

| Evidence | Static observation | Consequence |
| --- | --- | --- |
| [AdminPage](../../src/frontend/src/pages/Admin/AdminPage.jsx), [AppStore](../../src/frontend/src/context/AppStore.jsx) | UI role gate, local role/ban/moderation setters/toasts, browser directory/cards/System controls. | Prototype, not authorized durable Admin functionality. Mock normalization/combined-field search does not establish exact required query semantics. |
| [Server](../../src/backend/server.js), [auth routes](../../src/backend/routes/authRoutes.js) | Auth/health/Firebase exchange only; no Admin users/songs/stats or authoritative history/catalog handlers. | Endpoint inventory is not implementation; generic fallback 404 is not acceptance. |
| [Auth middleware](../../src/backend/middleware/authMiddleware.js) | Current JWT/session/user/UA/expiry/revocation checks; DB role overrides token role. No provided Admin guard; banned returns ad hoc 401, storage failure ad hoc 503. | Reusable foundation, but shared API calls for 403/USER_BANNED/standard envelope; existing 503 contract is AI-specific. |
| [Local auth](../../src/backend/controllers/authController.js), [Firebase exchange](../../src/backend/controllers/firebaseExchangeController.js) | Local password login lacks ban check before creating session; Firebase rejects banned. Refresh revokes only the refreshed banned session; logout-all enumerates sessions. | No durable ban-time all-session/new-login race guarantee. Untouched pre-ban sessions can revive after unban unless gap is resolved. |
| [Session client](../../src/frontend/src/services/sessionApiClient.js), AppStore refresh | Global refresh/replay uses returned token without originating-session/current-role guard. | Ignoring stale rendering alone cannot prevent A's operation replay as B. |
| [Auth migration](../../src/database/migrations/001_auth_tables.sql), [repository](../../src/backend/repositories/authRepository.js) | users.id PK/separate unique user_id; role text/default, is_banned; no reason/audit representation. Lookup id then user_id, update id, internal whole-row reads. | ERD key/role CHECK differs; canonical mapping/minimal projection/reason persistence unresolved. Generic update spread is not an approved Admin allowlist. |
| [Supabase client](../../src/database/supabaseClient.js), [memory DB](../../src/backend/db.js) | Backend service-role path; missing configuration permits volatile auth fallback. | No client service key, fallback-as-production evidence or verified deployed catalog/history schema. RLS enablement alone is not Admin authorization. |
| [App](../../src/frontend/src/App.jsx), [mock player](../../src/frontend/src/hooks/useMockPlayer.js), AppStore recordPlay | Local history inserted at playback start/capped at 500; clear/reset local. Dashboard adds seed playCount and browser history lengths. | Not producer-qualified durable platform history; incompatible with 113-FR-004 counting authority. |
| [Root](../../package.json), [backend](../../src/backend/package.json), [frontend](../../src/frontend/package.json) manifests | Existing React/Vite/Tailwind/Express/JWT/Supabase/Firebase, dev/build/auth smoke scripts. | Existing stack established by code; no verified Admin/media/analytics runner/deployment. No application execution in this review. |

## 3. Feature readiness matrix

| Feature | Coverage | Established behavior usable for preparation | Remaining blockers | Assessment |
| --- | --- | --- | --- | --- |
| 111 | 5 stories, 23 FRs, 7 SCs | Named minimal fields; literal query/filter/order/page; non-Admin ban; ban distinct from login lock; fresh sign-in after unban; direct default reason; self-role prohibition | U01–U11: role/target precedence, reason persistence, canonical keys, exact APIs, durable auth, atomicity/client/query/harness | Complete review package; implementation HOLD. Directory slice need not wait for role route if its own gates close. |
| 112 | 7 stories including US4A, 30 FRs, 6 SCs | Independent restriction/preference, owner reason viewing/no bypass, no deleted restoration, list order, no-op/success processing order, active finish/new-start denial | M01–M12: action vocabulary/confirmation, actual model/three projections, media, history/audit, atomicity/auth/client/harness | Complete review package; implementation HOLD. A list alone cannot satisfy integrated moderation. |
| 113 | 4 stories, 21 FRs, 7 SCs | Distinct current users, valid retained history, true zero/unavailable, open/manual calculation, per-metric UTC+7 time, no stale merge/personal data | P01–P13: two/four/System scope, hints/sources/lifecycle, DTO/read consistency/precision, auth/client/harness | Complete review package; implementation HOLD. Disputed FR-002/021 explicitly remain covered. |

Markdown interface boundaries are not finalized OpenAPI. Vision §6.4 requires OpenAPI 3.0.3; that remains a completion requirement across all three. Quickstart scenarios are planned, not passed.

## 4. Consolidated decision register

### 4.1 Cluster definitions and deduplication

**G110-C01–G110-C16** are local review identifiers, distinct from historical Group 090 IDs. Each original has one primary cluster in §4.2 and may cross-link others. All original entries remain **OPEN**.

| Cluster | Primary entries / dependency | Duplicate or overlap assessment |
| --- | --- | --- |
| **G110-C01** | U01, M01, P01 — governance | Direct duplicate Constitution gap; P01 adds final scope/acceptance record. Shared evidence does not automatically close every entry. |
| **G110-C02** | U02, M02, P02 — source precedence | Shared process, different decisions: roles, moderation actions, metrics/System. Not duplicates of the same business choice. Includes latest Vision allocation conflicts. |
| **G110-C03** | U04, M03, P03 — identity/durable sources | U04/P03 directly overlap account keys/source; M03 adds Artist/song ownership/audience eligibility. U04 reason fragment also C04. |
| **G110-C04** | U03, M04 — reason/catalog persistence | Partial reason/no-op/persistence overlap; account ban and moderation reason/rights/state are separate. M04 query fragment also C07. |
| **G110-C05** | U05, M05, P07 — exact API/projections | Shared envelope/error fragments duplicate; resource DTO/routes/actions remain separate. No generic Admin CRUD permission. |
| **G110-C06** | U06, M06, P09 — server auth/current authority | M06/P09 directly depend on U06; U06 carries all-session ban/fresh-sign-in requirement. In-flight authority also C08. |
| **G110-C07** | U08 — query correctness | M04/M05 partially overlap implementation mechanics, not fields/order/transport. No invented universal pagination. |
| **G110-C08** | U07, M07 — atomic mutations | Partial execution-boundary overlap; account/session and track/Artist/delete invariants differ. 112 winner rule is not automatically 111 policy. |
| **G110-C09** | U09, M10, P10 — client session/load safety | Direct duplicate origin-bound refresh/replay foundation; mutation uncertainty and 113 strict no-stale refresh differ. |
| **G110-C10** | M08 — media/public eligibility | Distinct delivery dependency; cross-links M03/M07/M09/M11 and Group 090. Backend flags alone insufficient. |
| **G110-C11** | M09, P06 — historical/physical lifecycle | Partial preserved-reference overlap; audit/media cleanup differs from retained-history clear/purge policy. |
| **G110-C12** | P04, P05 — metric/event definitions | Related, not duplicates: catalog/hints versus producer validity/identity. Key/lifecycle fragments overlap P03/P06. |
| **G110-C13** | P08, P12 — read consistency/performance | Partial complete-query overlap; timestamps/read boundary differ from budget/precision. U08/M04 query evidence cross-links. |
| **G110-C14** | P11 — System capability | Distinct authority/effect dependency; scope P02, auth/client C06/C09. No global reset/toggle contract inferred. |
| **G110-C15** | U10, M11 — cross-group evidence | Direct missing Group 090 planning fragment; resource-specific interfaces remain separate. P13 cross-links. |
| **G110-C16** | U11, M12, P13 — runtime/verification | Direct shared runner/environment dependency, different account/media/event fixtures. P13 also peer integration C15. |

There are **36 unique primary assignments**. A cluster can contain multiple genuine decisions; this is dependency deduplication, not deletion or renumbering of the original register.

### 4.2 Complete original-ID traceability

Each link targets the original register; the ID names its exact row. “Evidence” is a resolvable fragment, not approval or closure of the composite entry. Owner coordination is recorded in §4.3.

| Original/source | Primary cluster; existing evidence | Required closure evidence | Blocked surfaces |
| --- | --- | --- | --- |
| [U01](./111-user-management/research.md#decision-register) | C01; placeholder Constitution/team process observed | Applicable ratification or recorded governance/acceptance disposition | Formal governance/implementation approval |
| [U02](./111-user-management/research.md#decision-register) | C02; FR-022/November/Vision other-account roles; own-role and Admin/self-ban guards | Align old exclusions; accepted other-Admin role/banned-target role/Admin-target unban edges; no invented last-Admin rule | Role writes/unresolved target cases |
| [U03](./111-user-management/research.md#decision-register) | C04; effective nonblank reason, exact direct default and blank rejection/no-op | Accepted omitted/custom/blank transport, minimal record, duplicate/post-unban reason behavior | Ban/default/no-op persistence/UI |
| [U04](./111-user-management/research.md#decision-register) | C03; actual id/user_id/is_banned known, reason migration absent | Canonical legacy/collision mapping, durable source/role constraints, minimal reason design and migration/rollback if needed | Repositories/projections/durable writes |
| [U05](./111-user-management/research.md#decision-register) | C05; list/ban/unban and q/role/is_banned/reason inventory exists | Exact list/page/types/no-op/errors, role capability and authorized current-target recognition, OpenAPI 3.0.3 | Handlers/adapters/final contract/reconciliation |
| [U06](./111-user-management/research.md#decision-register) | C06; DB role/session foundation; differing login/refresh paths | All paths reject ban; old sessions invalid after unban; concurrent login/refresh/all-device enforcement/error compatibility | FR-011 release/protected integration |
| [U07](./111-user-management/research.md#decision-register) | C08; current authority/atomic work required, mechanism unselected | Deployable actor/target/reason/session boundary, duplicate/opposing outcomes, rollback and login/refresh race proof | Safe mutations/ban acknowledgement |
| [U08](./111-user-management/research.md#decision-register) | C07; FR-021 query/order/page rules fixed | Actual typed key/time/collation/bound literal query; filter-before-order-before-page; ties/21+ rows/concurrent evidence | Directory query/paging |
| [U09](./111-user-management/research.md#decision-register) | C09; current-role/origin replay defects observed | Shared origin-bound refresh/replay, account generations/private clearing, unknown-commit recognition/safe retry | Frontend reads/writes/toasts |
| [U10](./111-user-management/research.md#decision-register) | C15; peer specs/owner record present, planning missing | Accepted current-branch identity/role/ban interfaces and no profile/follow/ownership side effects | Final integration acceptance |
| [U11](./111-user-management/research.md#decision-register) | C16; manifests/dev/build/auth smoke exist | Supported runner/runtime/layout, persistent multi-session fixtures, actual browser/query/concurrency commands/results | Executable account acceptance |
| [M01](./112-content-moderation/research.md#decision-register) | C01; duplicate governance gap | Shared governance disposition/applicable independent review | Formal approval claims |
| [M02](./112-content-moderation/research.md#decision-register) | C02; FR-027 fixes no-op/order/no resurrection; active finish/new-start separation | Accepted action identity/confirmation/direct/default/blank/removed-terminal mapping, old source drift and Vision scope disposition | Ambiguous actions/UI/lifecycle |
| [M03](./112-content-moderation/research.md#decision-register) | C03; independent account/profile/Artist preference/Admin restriction/deletion | Canonical keys/ownership, public/Admin/owner predicates incl FR-023, no link/ban cascade | Policies/audience reads/eligibility |
| [M04](./112-content-moderation/research.md#decision-register) | C04; durable moderation schema not verified, list rules known | Actual state/reason/rights/upload-time/key/query mappings and accepted migration/rollback | Persistence/review/query/rights |
| [M05](./112-content-moderation/research.md#decision-register) | C05; Admin GET/PUT/DELETE inventory, owner read gap | Exact actions/projections/page/error/no-op/target recognition/OpenAPI and protected restricted-owner capability | Handlers/adapters/Studio/schema tests |
| [M06](./112-content-moderation/research.md#decision-register) | C06; same current-session foundation | Accepted U06/current-action authority/error compatibility and verification | Protected moderation/owner release |
| [M07](./112-content-moderation/research.md#decision-register) | C08; system-order/no reason overwrite/deleted guard explicit | Multi-worker atomic authority/restriction/reason/preference/delete boundary; rollback/late finalization proof | Safe moderation/Artist concurrency |
| [M08](./112-content-moderation/research.md#decision-register) | C10; deny new plays/skip queue/active finish required | Actual direct URL/Range/cache/index eligibility and continuation-vs-new-start contract; real provider evidence | Public/media/playback acceptance |
| [M09](./112-content-moderation/research.md#decision-register) | C11; preserve history/audit, full audit feature excluded | Actual identities/records and logical/physical blob/reference lifecycle/failure recovery; no guessed cascade/job/retention | FR-030/removal/delete/cleanup |
| [M10](./112-content-moderation/research.md#decision-register) | C09; shared U09 hazard | Actor/session/query/target generations, reconciliation/no wrong-actor replay/truthful toasts | Safe moderation UI/retry |
| [M11](./112-content-moderation/research.md#decision-register) | C15; peer behaviors present, planning missing | Accepted owner status/reason read, public eligibility, independent follows and 113 history boundary | Integrated owner/public/history |
| [M12](./112-content-moderation/research.md#decision-register) | C16; dev/build/smoke only | Runner/runtime/permitted persistent fixtures and actual media/range/multi-worker/browser/query evidence | Executable moderation verification |
| [P01](./113-platform-statistics/research.md#decision-register) | C01; placeholder, team process and Sprint 3 DoD exist | Applicable feature acceptance/scope-record disposition; no claim DoD absent everywhere | Formal task/implementation acceptance |
| [P02](./113-platform-statistics/research.md#decision-register) | C02; two/four and System/read-only conflicts explicit | FR-002/021 and hints/story/SC/checklist/Vision FR-110-007/008 disposition | Final dashboard/control scope |
| [P03](./113-platform-statistics/research.md#decision-register) | C03; current-account inclusion fixed, dual keys observed | Deployed canonical membership/removal mapping/complete distinct counts; no memory fallback | User aggregate/role-locked hints |
| [P04](./113-platform-statistics/research.md#decision-register) | C12; public profiles differ from Artist-role accounts; four hints requested | Each card/hint formula/schema/predicate/overlap/deletion/locked/demo provenance | Artist/track/hint aggregates/DTO |
| [P05](./113-platform-statistics/research.md#decision-register) | C12; FR-004 history-only; 071 owns qualification | Durable producer/event-time validity/source identity/invalidity/duplicate/retry/replay evidence; no new heuristic/flag | Authoritative play counts |
| [P06](./113-platform-statistics/research.md#decision-register) | C11; later status not history filter; 071 clear/purge exists | Accepted reference/retained lifecycle matrix, lost-ID unavailable, actual clear/purge vs content preservation | Plays under lifecycle/concurrency |
| [P07](./113-platform-statistics/research.md#decision-register) | C05; GET/envelope known, data schema absent | Exact metric/hint types/timestamps/partial/all-unavailable/auth/status/count encoding, OpenAPI compliance | API/parser/contract tests |
| [P08](./113-platform-statistics/research.md#decision-register) | C13; open/manual calculation/no merge/per-metric time fixed | Accepted read/isolation/completeness/clock boundary and concurrent source/purge outcomes; no assumed distributed snapshot | Aggregate orchestration/time tests |
| [P09](./113-platform-statistics/research.md#decision-register) | C06; current DB role foundation, Admin guard missing | U06 shared authority/errors plus in-flight stats authorization behavior | Protected stats/System access |
| [P10](./113-platform-statistics/research.md#decision-register) | C09; no stale after failure/lost Admin | Origin-bound replay/current-role/latest-load/clearing and late-response proof | Live overview/refresh/race tests |
| [P11](./113-platform-statistics/research.md#decision-register) | C14; local AI/reset verified, remote contract absent | P02 scope, browser/platform authority/defaults/effects/session/persistence/interface/error/uncertainty as applicable | Both System controls/full readiness |
| [P12](./113-platform-statistics/research.md#decision-register) | C13; exact complete counts required, no aggregate SLA | Accepted dataset/concurrency/network budget, measured complete query/read permissions/precision/overflow/encoding and approved optimization design | Production count/performance sign-off |
| [P13](./113-platform-statistics/research.md#decision-register) | C16; runtime manifests only, peer/source/harness not proved | Accepted runtime/runner/fixtures, actual auth/catalog/event/peer checks and independent review | E2E/full Tasks readiness claims |

### 4.3 Established coordination

[Team Contract §1/§6](../../docs/management/team-contract.md) assigns Hoàng to 090/110/cloud fetching, Khoa to auth/history, Đăng to schema, Huy to Player/Queue, Nhựt to architecture/deployment and critical technical/tied-decision escalation. Routine decisions use majority voting. No separate product/security/data approver or vote is invented.

Hoàng coordinates feature/source/API/peer work; Khoa supplies C06/C09/history integration; Đăng C03/C04/C07/C08/C11–C13 schema input; Huy C10/player/event integration; Nhựt governance/architecture/runtime escalation. These are documented responsibilities, **not sole approval authority or newly assigned tasks**. Independent reviewer/actual assignments remain unrecorded.

## 5. Shared technical dependencies and conflicts

### 5.1 Source and governance findings

| Finding | Evidence/significance | Required disposition |
| --- | --- | --- |
| **Blocking: role scope drift** | 111 Input/checklist excludes Admin grant/revoke; FR-022/November/Vision FR-110-004 require other-account roles. Own-role change forbidden, stronger than self-demotion only. | U02/C02 aligns sources/target edges; no new last-Admin/provisioning policy. |
| **Blocking: moderation action identity** | 112-FR-005/007 require confirmation/reason; FR-029 describes direct one-click removal/restore. Default nonblank reason can satisfy reason requirement; no prompt is not itself a reason conflict. | M02 maps whether same action executes on initial click; preserve confirmation unless authorized alignment. No invented extra action/workflow. |
| **Blocking: two/four cards** | 113 October/checklist exactly two; November/FR-002 four cards/four hints. | P02/P04 accepted complete scope/formulas. Later date/no-open-clarifications statements alone are not approval. |
| **Blocking: System/read-only** | 113-FR-021 versus US4/FR-008/SC-004/assumptions. | P02/P11 boundary; separate System tab/read-only GET is proposal, not silent fix. |
| **Blocking baseline alignment: wider Vision** | FR-110-005 metadata editing/purge versus 112-FR-008; FR-110-006 comment moderation not covered by these three capabilities; FR-110-007 active sessions/streams/catalog/AI latency versus 113 exclusions; FR-110-008 database reset/seeding versus browser reset. Vision labels Group 110 Confirmed (100%). | C01/C02 explicit allocation/deferment or authorized changes. Do not claim all Vision Admin requirements implemented/planned here or import broader permissions/KPIs/reset. Comment moderation is an allocation gap, not a new original decision ID. |
| **Governance pass blocked, review allowed** | Constitution placeholders; Team Contract process exists; Project Plan has explicit Sprint 3 DoD but broader formal acceptance/authoritative scope record remains pending. | Shared C01 evidence; no invented ratification or blanket “no governance/DoD” claim. |

### 5.2 Authentication and permission boundaries

All three need the same current-principal/Admin enforcement built on AuraTune sessions. Firebase identity or cached role alone is insufficient. Public 091 APIs must remain anonymous-capable: global authentication middleware across every public catalog/profile route would regress requirements.

111 requires new-login denial, next protected request denial and old-session invalidation so unban requires fresh sign-in. Ban-flag checking alone cannot satisfy that last requirement. Password/Firebase login/refresh and current session creation must coordinate with acknowledged ban. Role updates affect current access but do not imply universal signout or Artist provisioning.

Current actor/target authority must hold at the accepted mutation boundary, including long asynchronous work. C06/C08 define deployable enforcement without assuming token epochs, locks, RPCs or isolation levels. Read authorization/lost-role behavior and client late-response disclosure also require C06/C09/C13.

### 5.3 Exact API and projections

The shared inventory already names GET admin/users, PUT ban/unban, GET admin/songs, PUT/DELETE admin/songs/:id and GET admin/stats. It does not finalize DTOs/paging, role mutation route, authorized target recognition, protected owner restricted-track read, metric result/hint schema or System interfaces.

A shared minimal envelope/error convention is appropriate; a shared generic Admin payload is not. 111 allows its seven named account fields, with ban_reason only when recorded; that does not approve a physical column. 112 needs separate minimal Admin/owner/public projections. 113 permits aggregates, not directory/history rows.

Generic “edit/hide” shared route wording does not expand 112 metadata permission. Existing artist-link route does not become 111 role provisioning. No guessed restore/status/reconcile/Studio route, confirmation flag, version key or idempotency field is finalized. Shared 403/USER_BANNED/envelopes differ from current auth drift; coordinate compatibility, never repurpose AI-only 503.

### 5.4 Database, query and atomic processing

Actual auth migration and reference ERD are not interchangeable. Resolve id/user_id/legacy consistency, canonical artist/song ownership and durable source completeness. Role assignment is not ownership; internal whole-auth-row reads are not safe response DTOs.

111 query is trimmed case-insensitive email OR display_name substring, exact role/boolean filters AND-combined, created_at DESC/user_id ASC, 20/page/reset on filter change. 112 uses non-deleted membership, title OR artist substring AND filters, upload DESC/song_id ASC, 20/page/reset. These rules are established; collation/typed ID/time mapping, safe binding/escaping and paging transport remain open. Mock accent normalization/concatenated-field matching and client-wide row downloads are not equivalent.

112 successful system processing order, duplicate no-op/no reason overwrite, failed no-write and no deleted restoration are explicit despite older FR-018/SC pending wording. Do not reopen the business rule or choose click/HTTP-response order. U07 still needs account-specific concurrent role/ban outcomes; sharing an execution primitive does not imply the same policy.

Dropped mutation responses can hide commits. Filtered/paged absence is not proof of missing/deleted/opposite state. C05/C09 require authorized recognition/uncertainty/retry. Desired-state idempotency does not ensure a later retry cannot override a newer opposite operation.

### 5.5 Media, public eligibility and lifecycle

Independent persisted restriction/preference flags alone do not deny an already-known media URL. C10 must verify fresh public surfaces, search/recommendations, stream/direct URL/Range/cache and Player/Queue. Active playback may finish; new/repeat starts denied, unavailable queue entries skipped. No global hard stop, DRM, invented playback session/token, provider TTL or new media service is selected.

Reversible removed/delisted is not automatically terminal deleted. Non-destructive history/audit preservation is compatible with final public deletion; soft storage does not permit resurrection. C02/C11 must map actual records/blobs/references and failures without inventing cascades/jobs/retention/full audit functionality.

### 5.6 Statistics definitions and correctness

| Result | Established requirement | Remaining contract |
| --- | --- | --- |
| Total Users | Current distinct all-role accounts, including banned/locked/disabled if represented and extant demo/test; exclude guests/removed. Ban/role change alone does not change existence. | C03 actual canonical membership/removal; no OAuth/profile/session join multiplication. |
| Public Artists | Newer clarification names public Artist records, unlike Artist-role account hint. | C02/C03/C12 accepted visibility/lifecycle source. Role count cannot substitute. |
| Total Tracks | FR-002 inventory card required under disputed scope, not defined as public/playable/all retained by mock tracks.length. | C12/C11 inventory/removed/terminal/overlap predicates. |
| Total Plays | Valid retained listening events, source identity duplicate rule only, validity at recording; later ban/hide/restriction/delete not a historical filter. | C11/C12 producer/reference/invalidity/retention contract. No counter/browser sum/current-song inner join/new heuristic. |
| Four hints | Locked accounts, Artist-role accounts, hidden/removed tracks, demo plays explicitly requested. | Every formula/source/overlap/parent failure/time boundary open; password lock distinct from ban, browser demo lengths not authority. |

071 requires 30-second/short-track >=90% producer qualification, clear-all and 365-day retention/purge. 113 consumes accepted valid records without its own threshold/session/dedup heuristic, counts retained events rather than lifetime plays and does not invent an archive. Preserve events through later content/account status changes; lost required identifiers/source conflict means unavailable, not guessed/partial/zero.

113 calculates on open/manual refresh, shows per-metric successful calculation instants in UTC+7 and independent failure, with no mixed load generations or stale current results after failed refresh/lost Admin. C13 defines concurrent read/completeness/count precision/performance. Vision metadata-query targets and 093's unresolved 500 ms upload acceptance are not statistics SLAs.

## 6. Cross-group integration findings

| Boundary | Established behavior to preserve | Open integration |
| --- | --- | --- |
| Ban/public profile | 111-FR-011 leaves anonymous public access outside authenticated ban; 091 public profile independent of personal auth. | Canonical eligibility; no ban→profile hide, delist or follow erasure. |
| Role/Studio ownership | 111-FR-019 excludes linking; 093 requires current Artist and own linked identity. | Role grant does not create/link Artist; Admin not ordinary Studio owner; no track reassignment on demotion. Proper no-linked-record state required. |
| Artist/Admin layers | 112-FR-006/024/025 and owner G090-D05: owner metadata/status/reason and permitted own metadata/preference/delete, no Admin bypass. | Exact protected projection/atomic state mapping; owner cannot play/self-unrestrict/effectively publish while restricted. |
| Delete/history | 112-FR-030 and owner G090-D06 preserve valid history through hidden/restricted/deleted content. D06 selects no 113 platform formula. | Source reference/blob lifecycle C11; inventory differs from historical totals; no deleted restore. |
| Follows/account lifecycle | 092 own User/Artist/Admin lists, hidden retention/unfollow/time/order/privacy remain. | No ban/role/track mutation cascade. Account deletion outside 111; 092 deleted-artist privacy does not settle physical account/follow cleanup. |
| Public catalog | 091 eligibility and 112 freshly loaded surface exclusion. | Filter before ranking/limits; no hidden reason/metadata leak, same canonical identity across public/Studio/follow/Admin. |
| Player/Queue | 112-FR-022/023 and owner D07: active finish, deny new/repeat/direct starts, skip unavailable. | Actual URL/Range/cache enforcement C10. Do not reopen settled active-finish behavior. |
| Studio uncertainty | Owner D08/D09–D13 settle submitted unknown outcome/cancel/input/session-recovery choices. | Shared replay/reconciliation design without replacing owner-confirmed behavior. |
| Feature-specific freshness | Owner D14 allows marked old Studio portions; 113-FR-019 rejects stale stats after failed refresh. | Shared client must support separate presentation rules, not copy Studio fallback. |
| Scope | Audio replacement excluded here; no album CRUD, follower KPI or prior approval queue. | Broader Vision/Group 090 allocation requires recorded disposition, not silent expansion. |

Group 090 source assessment S-01 already distinguishes conditional confirmation conflict, compatible default reasons, compatible active-finish wording and removed/deleted mapping gap. Retain those findings. D05/D06/D07/D08/D14 are owner-confirmed within their stated scope, not peer/team architecture approval. No settled choice is reopened merely because its implementation contract is absent.

## 7. Decisions requiring team approval or accepted design

| Area | Decisions/clusters | Required record |
| --- | --- | --- |
| Applicable governance/source precedence/feature allocation | U01/U02, M01/M02, P01/P02; C01/C02 | Recorded applicable authority, Vision allocation, scope clauses and independent review; no inferred ratification/vote. |
| Role target/reason handling | U02/U03/U04; C02/C04 | Accepted unresolved role/ban edges, omitted/default vs blank, duplicate/post-unban minimal reason persistence. |
| Moderation actions/removal | M02/M04/M09; C02/C04/C11 | Accepted action identity/confirmation/default/terminal mapping and lifecycle; no scope-wide prompt waiver. |
| Metrics/hints/event lifecycle | P02/P04/P05/P06; C02/C11/C12 | Source-backed each card/hint formula and source/retained-event rules; preserve FR-004 unless explicit change authorized. |
| System authority/effects | P02/P11; C02/C14 | Browser versus platform/database reset boundary, AI behavior and permitted effects/interface, distinct from read-only GET. |
| Actual model/atomic/read design | C03/C04/C08/C11–C13 | Accepted deployment/mapping/reason/state/event/precision/read approach; no schema/RPC/index/job inferred. |
| Interfaces/auth/client/media/verification | C05/C06/C09/C10/C15/C16 | Accepted OpenAPI/examples, current authority/replay/recognition, provider access and actual runner/fixture/integration evidence. |

Approval concerns remaining choices/design. Investigation may propose options without permission to self-approve them. Requirements already settled are constraints, not blank questions to put to a new vote.

## 8. Fragments resolvable from existing evidence

These can support preparation now **without closing composite U/M/P entries**:

- Existing stack and route inventory are ascertainable. Admin endpoints are unimplemented; exact role/owner/System interfaces remain absent. Current shared API lists history POST/GET, contrary to older 071 planning absence wording.
- Actual auth keys/role/ban flag and missing reason/catalog/history migration evidence are ascertainable. Live deployment and canonical legacy mappings are not.
- Server current-role/session checks, local-login ban gap, session-revival risk and client replay/hydration hazards are static findings; no exploit or passed test claimed.
- 111 guards, exact default/nonblank/blank distinctions, persistent ban/fresh-sign-in, temporary-lock separation, fields and list rules are explicit. Do not reselect them.
- 112 no-op/order/no resurrection, owner read/no bypass, independent layers/list and active/new playback rules are explicit. Older pending wording needs alignment, not policy reopening.
- 113 current user/history formulas, no counter sum/new heuristic, freshness/time/independent unavailable/no stale rules are explicit. Expanded cards/hints/System remain conflicted.
- Owner Group 090 decisions and limits are recorded. Team role/majority/leader process and Sprint 3 DoD exist; placeholder Constitution/general acceptance record remain narrower gaps.

Later authorized source correction can synchronize stale statements. This review makes none and closes no original decision.

## 9. Recommended decision-resolution order

1. **C01/C02**: applicable authority/acceptance and role/moderation/metric/System/Vision scope disposition first.
2. **C03/C04/C07/C12**: canonical keys/durable sources/reasons/catalog/rights/query/event/hint definitions; investigation streams can run in parallel, physical changes gated.
3. **C10/C11/C14** feasibility alongside step 2: actual media enforcement/history/reference cleanup/purge and System effects before choosing deletion/reset design.
4. **C05/C06/C08/C09/C13** jointly: accepted interfaces/projections, authority/ban invalidation, atomic writes, origin replay/uncertainty and read/count/time boundaries. Do not finalize APIs against undefined data.
5. **C15/C16** throughout: missing peer evidence/runtime/fixture work; actual acceptance execution follows accepted interfaces and later implementation authorization.
6. Independent review per coherent slice; full acceptance includes role updates, US4A, FR-002/021 disposition, public media and history obligations.

The dependency order is acyclic. Investigation may expose a need for authorized source revision; that is a review feedback loop, not an executable task dependency cycle.

## 10. Implementation readiness gates

None is satisfied for **complete Group 110**. Gates are slice-specific; unrelated System/media work does not block all directory preparation.

| Gate | Required evidence | Blocked surface |
| --- | --- | --- |
| **G1 Scope/governance** | C01/C02 recorded disposition/review/accepted scope and no omitted FR | Unconditional full Tasks approval; disputed implementation/readiness |
| **G2 Data/query** | C03/C04/C07 canonical durable schema/source/reason/state/rights and correct queries | Repositories/mutations/user/catalog aggregates |
| **G3 Current server authority** | C06/C08 current actor/target/session and durable ban-time invalidation | Protected handlers/safe account/moderation release |
| **G4 Exact interfaces** | C05 OpenAPI 3.0.3/types/paging/error/no-op/recognition/owner/stats examples | Final API/client/contract tests, no guessed DTO/routes |
| **G5 Atomic/client safety** | C08/C09 multi-worker rollback/order/deleted guards and origin replay/current role | Mutations/retry/private UI; stats load safety |
| **G6 Media/lifecycle** | C10/C11 URL/Range/cache/queue/history/audit/reference/cleanup/failure proof | Removal/delete/distribution/historical integration |
| **G7 Correct metrics** | C12/C13 complete authoritative source, exact count/precision/time/read and measured budget | Production statistics/numerical/performance acceptance |
| **G8 System capability** | C14 plus G1 scope/authority/default/effect/interface/failure/retry where applicable | FR-021 actions, never GET mutation |
| **G9 Executable integration** | C15/C16 actual peer/source/runner/fixtures/security/browser/concurrency/media results | Integrated release/tests-passed/implementation-ready claims |

Directory-only implementation may advance after its applicable G1–G5/G9 evidence without a role-route or media dependency unrelated to that slice. A moderation list cannot substitute for action/media acceptance. A stats skeleton cannot satisfy all FR-002/021.

## 11. Tasks-generation readiness assessment

The [workflow](../../.specify/workflows/speckit/workflow.yml) has a plan-review gate before Tasks; the [guide](../../docs/management/speckit-workflow-guide.md) requires clarified scope/dependencies. File completeness does not prove that review gate approved.

| Work class | Safe to plan without further product/design approval? | Concrete deliverables/limits |
| --- | --- | --- |
| Existing-evidence preparation | **Yes**, on a later Tasks request | FR/SC/owner-source matrix; route/caller/error inventory; static identity/auth/replay gap evidence; settled list/visibility/lifecycle tables. No product choice implemented. |
| Investigation/proposals | **Yes as investigation**, not final architecture | Deployed-schema evidence request, canonical alternatives, minimal reason/state options, API examples labelled proposal, media/read/count feasibility, supported-runner inventory. Resulting design/access still needs applicable approval/authorization. |
| Written scenarios | **Yes** | Synthetic fixture plans/independent expected outcomes for settled rules; disputed cases pending. Not exact unapproved DTO tests or executed acceptance. |
| Production implementation | **Gated** | Auth/replay, handlers/persistence/query/atomic/media/history/System integration require applicable G gates. No “implement and decide schema later.” |
| Executable contract/security/integration/performance/media tests | **Gated** | Accepted interfaces/authoritative fixtures/runner needed; writing scenarios is not execution. |
| Full /speckit.tasks document | **Conditional review artifact only** | Later may list runnable preparation and explicitly gated implementation with clusters/closure evidence; cannot imply full readiness or replace missing plan review. |

Safe preparation needs a concrete authorized deliverable and relevant source/output path in a later task document. This assessment does not create a Tasks file, task IDs or unrequested preparation artifacts.

Parallel investigation can separate account, catalog/media, event/metrics and runtime streams. Production edits in shared [AdminPage](../../src/frontend/src/pages/Admin/AdminPage.jsx), [AppStore](../../src/frontend/src/context/AppStore.jsx), [session client](../../src/frontend/src/services/sessionApiClient.js), backend middleware/server or canonical schema require explicit coordination. A parallel marker cannot hide shared-file/resource conflicts.

## 12. Recommendations for proceeding to /speckit.tasks

1. Review this document with the three plans and record C01/C02 scope decisions. Preserve original IDs; partial evidence never closes an entire cluster automatically.
2. Request preparation-first Tasks for one explicit feature directory. Require sequential IDs, concrete deliverables/paths, FR/story traceability, runnable/gated status, **G110 cluster IDs**, original decision references, closure evidence and dependencies.
3. Keep schema/API/media/System options labelled proposals until accepted. Source synchronization requires a later authorized pass; none occurs here.
4. Build shared auth/identity/API/client foundations once with established domain owners. Do not add personal auth to public 091, assign Admin Studio ownership, alter follows, resurrect deleted content, add audio replacement/follower KPI/album CRUD/approval queue or broaden reset.
5. Keep production/exact test work visibly blocked where G gates remain open. Generated tasks, checklist ticks, screenshots or auth smoke do not establish acceptance.
6. After relevant closure and later implementation, verify coherent slices with authoritative persistent data, concurrent current sessions and independent review. Complete Group 110 remains HOLD.

## 13. Validation record

### Method and limits

- Read all **21 required feature text artifacts** (seven per feature) and inspected **14 Group 110 PNGs**. Shared project/workflow sources and relevant Admin/auth/data/player implementation were inspected statically.
- Extracted **11 U + 12 M + 13 P = 36** original open entries and preserved them with one primary assignment across **16 clusters**.
- Documented coverage totals **74 FRs / 20 SCs / 16 stories**, including US4A. This reviews planned coverage, not implementation acceptance.
- Missing Group 090 planning/review and Group 110 use-case directory are recorded, not reconstructed. Available peer specs/checklists/owner decisions retain their authority limits.
- Relative link/anchor and output-scope checks for this new review are recorded below; inherited links in unchanged sources are not claimed repaired or exhaustively validated.
- No application tests/execution, database/provider calls, Tasks generation, source correction or Git branch mutation performed. No secret environment values read.
- Exactly this review document is authorized as output; no prior feature/application artifact may change.

### Final static checks

- Original-ID traceability check: 36 rows, 36 unique IDs, no missing or extra ID; U01–U11, M01–M12 and P01–P13 retained. All 16 cluster identifiers are sequential. Each original has exactly one primary cluster assignment.
- Source specification count check: 111 = 23 FRs/7 SCs/5 story headings; 112 = 30/6/7 including US4A; 113 = 21/7/4. Total 74/20/16 confirmed by identifier/heading extraction.
- All 108 Markdown links in this review resolve to 66 existing target paths; all 36 anchor references resolve to their source decision-register headings. No missing target or anchor found.
- CRC/byte-length comparison across 1,024 pre-existing inspected files under specs, source, docs and Spec Kit/agent configuration found no existing-file change/removal and exactly one addition: this review. No Tasks or application artifacts added.
- HEAD still references 110-admin-functions-plan-tasks; no Git mutation invoked. This records the current review's scope, not a claim that a pre-existing working tree or future PR contains no unrelated work.
- Static documentation checks passed. All original decisions remain open, production readiness remains HOLD, executable acceptance has not run and independent review remains pending.

These checks cannot approve decisions, establish deployed schemas/contracts or replace independent review.

