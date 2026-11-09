# Research — Feature 112 Content Moderation

**Date:** 2026-11-09 | **Branch:** `110-admin-functions-plan-tasks`  
**Status:** Review-ready findings; not implementation-ready. M-prefixed IDs are local to 112; 111-U and Group 090-G090-D IDs retain their provenance.

## Authority and sources

Primary authority: [112 spec](./spec.md), [checklist](./checklists/requirements.md) and all four visually inspected [images](./ui/). Preserve explicit requirements even where later paragraphs conflict with older statements; record the conflict instead of rewriting either. Code is observed implementation, mockups are UI evidence, and proposed architecture is not an approved schema or provider.

“Latest” means the current checkout; no fetch, live schema/provider discovery, branch switch or peer-file import occurred. The installed Plan workflow's research-agent step was performed as read-only authentication/backend/player and source/cross-feature investigations, consolidated here. No research agent changed files or ran application tests.

| Source reviewed | Consequence |
| --- | --- |
| [Spec/checklist](./spec.md), [checklist](./checklists/requirements.md) | 30 FRs, six SCs and seven story headings including US4A. Exact restriction-only edit scope, two-layer visibility, reason/confirmation, query/no-op/system-order and downstream requirements coexist with source drift. |
| [Vision](../../../docs/proposal/Auratune_Vision_Document.md), §5.3.11/§6 | Admin moderation and safe distribution, shared security/browser/query and OpenAPI 3.0.3. Broad Admin metadata/comment/operational goals do not override 112's narrower confirmed scope. |
| [Proposal](../../../docs/proposal/proposal.md), [Project Plan](../../../docs/proposal/project_plan.md) | Permitted-content/source/license responsibilities and external-media dependencies. Spike/checkpoint statements do not establish an implemented provider, moderation transaction or media guard in this checkout. |
| [Constitution](../../../.specify/memory/constitution.md), [Team Contract](../../../docs/management/team-contract.md), [Spec Kit guide](../../../docs/management/speckit-workflow-guide.md) | Constitution unratified; English Markdown/Mermaid and established team review. Hoàng 090/110/cloud, Đăng database/search, Khoa auth/history, Huy Player/Queue, Nhựt architecture. No new product/security approver assigned. |
| [Architecture](../../../docs/design/architecture/system-architecture.md), [modules](../../../docs/design/architecture/feature-modules.md), [roles](../../../docs/design/architecture/role-navigation.md) | Backend current-role enforcement and separate Admin/user/Artist capabilities; no UI-only security or Artist ownership inherited from Admin. |
| [Database](../../../docs/design/database/README.md), [ERD](../../../docs/design/database/er-diagram.md), [consistency](../../../docs/design/database/data-consistency.md), [data security](../../../docs/design/database/security-rules.md) | Reference artists→albums→songs and history/follows, optional ownership references and no final lifecycle/cascade/transaction choice. Compare actual auth-only migration; no presumed song status/audit fields. |
| [Security](../../../docs/design/security/README.md), [Firestore status](../../../docs/design/database/firestore-collections.md) | Backend policy, least privilege, no secret disclosure; Firebase identity exchange does not select Firestore or media storage. |
| [API](../../../docs/analysis-and-design/api-contract.md), §1/2.4/2.10; [conventions](../../../docs/design/api/api-conventions.md) | GET/PUT/DELETE Admin songs and public stream 200/206 exist in contract inventory. Exact moderation fields/search/restriction/page/reason/no-op schemas, Admin detail and owner Studio reads are missing. No new path/parameter chosen. |
| [111 spec](../111-user-management/spec.md), [plan](../111-user-management/plan.md), [research](../111-user-management/research.md), [model](../111-user-management/data-model.md), [contract](../111-user-management/contracts/user-management.md), [validation](../111-user-management/quickstart.md) | U01/U04/U06/U07/U09/U11 are open shared governance/key/auth/atomic/replay/tooling dependencies. Reuse accepted future evidence, not approval inferred from file presence. Account restriction/role change is not song moderation. |
| [113 spec](../113-platform-statistics/spec.md) | Valid retained listening-history events remain authoritative for plays, distinct from `songs.total_plays`; no new formula/counter from 112. Four-metric/system-control additions versus older read-only/two-metric text remain peer-owned. |
| [091](../../090-artist-profile-studio/091-artist-profile/spec.md), [092](../../090-artist-profile-studio/092-follow-artist/spec.md), [093](../../090-artist-profile-studio/093-artist-track-management/spec.md) and [093 checklist](../../090-artist-profile-studio/093-artist-track-management/checklists/requirements.md) | Public eligible profile filtering; own follows independent of content; Artist-only owned Studio and no prior Admin upload approval. No audio replacement or new ownership permission from this plan. |
| [Group 090 owner record](../../../docs/requirements/use-cases/090-artist-profile-studio/README.md), D03/D05–D08 and Source assessment S-01 | Rights declarations are not verified licenses; owner preference/metadata changes cannot clear restriction; valid historical plays and active playback completion preserved; uncertain results reconcile. S-01 identifies confirmation conflict as conditional on the same executed action. These are owner-confirmed draft records, not team architecture approval. |
| Group 090 prior planning files | Plans/research/Tasks/consolidated planning review are absent under Group 090 here. Do not reference remembered cluster IDs or phantom files. M11 records needed shared evidence without changing branches. |

## Mockup observations

All four PNGs were opened in this pass.

| Image | Observed evidence / limit |
| --- | --- |
| [01 list](./ui/01-content-moderation-list.png) | Existing Admin content tab, song/artist/status and direct Remove action. Plays/comment counts and covers are demo presentation, not automatically approved minimal review DTOs or comment-moderation scope. |
| [02 status](./ui/02-track-moderation-status.png) | Public, hidden and removed badges; Restore on removed row. One label/map does not establish independent Artist/Admin/deletion dimensions. |
| [03 removal](./ui/03-remove-track.png) | Direct click gives removed badge and copyright toast with no reason/confirmation prompt. Supports newer FR-029 intent but conflicts conditionally with confirmed reason/confirmation flow. |
| [04 restore](./ui/04-restore-track.png) | Removed row becomes public with toast. Does not approve restoration of terminally deleted content or overriding Artist hiding. |

No image proves production persistence, authorization, real playable media, retained history/audit or a selected provider. A single mutable status copied from mock would violate independent preference/restriction and no-resurrection requirements.

## Implemented evidence

- [Server](../../../src/backend/server.js) mounts auth/health/Firebase exchange only; Admin/catalog/stream/history routes in shared inventory are not implemented. Generic fallback is not a moderation missing/forbidden handler.
- [Auth middleware](../../../src/backend/middleware/authMiddleware.js) verifies JWT/current session and loads current user role/ban; it replaces stale token role but uses ad hoc errors and 401 for banned. [Auth controller](../../../src/backend/controllers/authController.js) local login lacks ban check, refresh revokes only the refreshed banned session. Untouched old sessions can revive after unban unless durable invalidation is added; 111 already records U06/U07.
- [Auth migration](../../../src/database/migrations/001_auth_tables.sql) establishes only accounts/sessions. Actual account keys differ from reference ER; no catalog/moderation/rights/history/audit schema is demonstrated. [Supabase client](../../../src/database/supabaseClient.js) service role stays backend-only; null configuration can use volatile auth fallback, not proof of durable moderation.
- [AdminPage](../../../src/frontend/src/pages/Admin/AdminPage.jsx) filters local tracks and writes removed→active directly. It has no server page/filter/status/rights/reason/error/uncertainty protocol. Shared Admin shell overview/system/user actions remain peer scope.
- [AppStore](../../../src/frontend/src/context/AppStore.jsx) combines mock/Studio tracks and one default-active `trackStatus`; unrestricted local `setTrackStatus` stores no reason. Local history is capped, and current track sums are not authoritative retained history/audit. Generic Studio patch can overwrite arbitrary local fields.
- [StudioPage](../../../src/frontend/src/pages/Studio/StudioPage.jsx) derives ownership from mock artist ID, excludes removed rows and writes the same status map. There is no separate restricted-owner metadata/reason projection or independent Admin guard.
- [App](../../../src/frontend/src/App.jsx) checks local eligibility for initial explicit/collection play but exposes raw player methods too; direct download uses supplied audio URL.
- [Mock player](../../../src/frontend/src/hooks/useMockPlayer.js) is a timer, not an audio stream. Toggle/next/queue and [playback helpers](../../../src/frontend/src/utils/playback.js) repeat/advance do not recheck current availability. Real direct-link/range/continuation enforcement is unproven.
- [Session client](../../../src/frontend/src/services/sessionApiClient.js) shared refresh/replay has no explicit origin-account/session guard; AppStore refresh can update the current session without validating origin/current returned role. Ignoring late UI results alone cannot prevent a wrong-actor mutation.

## Source conflicts and interpretations requiring disposition

| Issue | Fixed evidence retained | What remains unresolved |
| --- | --- | --- |
| Direct versus confirmed action | FR-005/007/US3/US5/checklist reason+confirmation; FR-029/newer direct/default wording | Are labels describing the same action or separate restriction/delisting/terminal-delete operations? Exact accepted interaction/default/custom/blank cases. No silent replacement of either source. |
| Removed versus deleted | Newer non-destructive `removed` and reversible mock; FR-027/US4/checklist no deleted restore | Accepted vocabulary/transition/API mapping. Non-destructive history retention does not imply terminal deletion is reversible. |
| History/audit versus full audit scope | FR-030 preserves historical records/audit logs; FR-020 excludes a new full audit feature | Actual existing/minimal required record mapping and preservation proof, no invented audit UI/service/table/retention. |
| Concrete concurrency versus older pending text | FR-027/clarification/checklist explicitly fix no-op/no-reason overwrite/system-order/no resurrection | Source precedence record and actual atomic mechanism; no new vote needed to invent those known behaviors. |
| Three read audiences | FR-026 Admin non-deleted review; FR-024/US4A owner restricted read | Older US2 non-public-unavailable and edge Admin-only wording require alignment; no deleted-review endpoint invented. |
| Public Artist wording | FR-006 Artist-selected track preference; FR-023 publicly visible Artist | Exact context-specific artist-profile/song eligibility and account separation; no ban/profile cascade. |
| Immediate queue/stream block | FR-021–023 permit stale UI/active finish but deny new starts; FR-030 says immediate skip/block | Accepted interpretation/enforcement at processing boundary without globally stopping current playback or adding realtime UI requirements. |
| Historical context/assumptions | Older absence/undefined claims versus present peers and confirmed decisions | Record stale wording; do not act as if present specs/settled behaviors are missing. |

## Decisions, rationale and alternatives

Directions below follow current evidence; exact wire/model/deployment choices remain gated.

| Direction | Rationale | Alternative not adopted / pending |
| --- | --- | --- |
| Existing React/custom router/Express/auth seams | Implemented architecture; incremental content-tab migration | No new stack/router/moderation platform |
| Current Admin permission and separate owner projection | FR-009–011/024; safe authorization boundary | Public GET plus client filter or Admin→Studio impersonation leaks content |
| Independent Artist preference/Admin restriction/deletion | Explicit restore/non-bypass/no-resurrection rules | One editable `status` copied from mock cannot preserve semantics; physical representation M04 |
| Strict restriction/reason writes | FR-008 narrow scope | Generic song metadata/audio/rights edits and replacement are unsupported |
| Shared authoritative eligibility for every entry point | FR-021–023/030 | UI row removal or public raw blob URL alone cannot prove enforcement; M08 |
| Atomic system processing and truthful outcomes | FR-027 and false-success prohibition | Response arrival/click order/local mutex insufficient; M07/M10 |
| Retained required history/audit without new full audit scope | FR-030 and FR-020 both preserved | No purge, invented audit subsystem or local-row total; M09 |
| Reviewable Markdown contract pending accepted exact schemas | Missing interface choices are real blockers | Fake final OpenAPI would conceal source conflicts; M05 |

## Decision register

All M01–M12 entries are **OPEN**. Known requirements remain known; a source/technical gate does not erase an FR. Coordination roles come from Team Contract/Project Plan, not new appointments or proof of approval.

| ID | Unresolved dependency | Established coordination | Closure evidence / blocked work |
| --- | --- | --- | --- |
| M01 | Governance template | Nhựt/team | Ratified principles or recorded governance disposition; coordinate 111-U01. Blocks implementation/governance approval claims, not written review. |
| M02 | Source precedence and action vocabulary | Hoàng/Nhựt/team | Recorded mapping of FR-005/007/029/030, confirmation/default/custom/blank, removed versus terminal delete, immediate queue versus active finish, older concurrency/read-scope/assumption drift. Preserve every FR or separately authorize a source change. Blocks ambiguous action/UI/lifecycle acceptance. |
| M03 | Canonical identity, ownership and context eligibility | Hoàng/Đăng/Khoa; Huy playback input | Actual account/artist/song keys and manageable-owner mapping, independent profile-public/Artist preference/Admin restriction/deletion/account-ban predicates; FR-023 wording and three audience policies aligned. No artist linking/ban cascade. Blocks policies, safe reads and public eligibility. |
| M04 | Catalog/moderation/reason/rights persistence and query mappings | Đăng/Hoàng; Khoa history | Actual durable schema/source, separate state/reason representation, upload timestamp/typed-ID order, literal lowercased title-or-artist search and page consistency, optional rights mapping; accepted migration/rollback if needed. No guessed flags/enums/columns or volatile success. Blocks repositories/ordered review/state persistence. |
| M05 | Exact interfaces/projections/reconciliation | Hoàng/Đăng/Khoa | Accepted Admin GET/PUT/DELETE request-response/status/no-op/error/examples and OpenAPI 3.0.3, search/filter/page transport, authorized target/reason review and owner Studio capability. Missing/deleted/uncertain recognition cannot be inferred from a filtered page; no guessed detail/restore/status route or fields. Blocks handlers/adapters/final schema tests. |
| M06 | Shared authentication/current-role/session behavior | Khoa/Hoàng; Đăng session storage | Accepted 111-U06/security evidence for all auth paths, banned/demoted/revoked denials and standard envelopes without breaking current callers; current authorization at action boundary. No new provider/token design or 111 management implementation. Blocks protected integration/release. |
| M07 | Atomic Admin/Artist processing and deletion guards | Đăng/Hoàng/Khoa; Nhựt architecture | Approved deployable execution boundary across current authority, restriction/reason/preference/deletion/history; multi-worker success-order, rollback/no-op/no-reason-overwrite and no late resurrection proof. Coordinate 111-U07 capability, not a copied account/follow lock algorithm. Blocks safe actions and acknowledgement. |
| M08 | Media/public-surface eligibility enforcement | Hoàng/Huy/Đăng; Nhựt architecture/provider coordination | Actual provider/access/range/direct-URL/cache/index behavior; denied new/repeat starts, queue skip and active continuation after success, including range continuation versus new attempt. Coordinate 093 media contract without choosing provider, playback token, TTL, DRM or global stop here. Blocks distribution/playback acceptance. |
| M09 | Historical/audit preservation and physical lifecycle | Đăng/Khoa/Hoàng; Huy active stream | Actual required history/audit/source identities, approved logical/physical record/blob/reference handling and failure recovery, preservation after removed/deleted actions, no resurrection. No guessed cascades/ledger/audit table/cleanup job/retention period. Blocks FR-030 and delete/lifecycle acceptance. |
| M10 | Frontend origin-bound lifecycle and uncertainty | Khoa/Hoàng; foundation assignment via team | Accepted 111-U09 shared client contract and moderation query/target generations, account replacement/demotion/ban clearing, safe reconciliation/retry and truthful toasts. No wrong-actor replay, blind uncertain resubmit or persistent private cache. Blocks safe UI integration. |
| M11 | Peer integration/source availability | Hoàng with Đăng/Khoa/Huy for affected boundaries | Accepted shared 093 ownership/Studio/status/reason contract, 091 eligibility and independent 092 follows, 113 authoritative history/metric boundary; explicitly record absent Group 090 planning package and pending peer checks. No new peer implementation/source decisions presumed. Blocks integrated owner/public/history acceptance, not all standalone review preparation. |
| M12 | Runtime/harness and verification environment | Nhựt architecture; Hoàng feature verification; team assigns foundation role | Supported runtime, approved shared runner/scripts/layout, permitted persistent fixtures, real media/range/multi-worker/browser tests and applicable query measurements with actual commands/results. Coordinate 111-U11; no timer/auth-smoke substitute. Blocks runnable verification/readiness claims. |

## Resolution order and workflow record

Resolve governance/source action semantics first; then canonical model/projections and interfaces. Review media delivery and history/lifecycle together before choosing physical deletion/access. Resolve auth/atomic/client boundaries jointly with existing owners; verification tooling can progress in parallel. Read-only review can proceed after its relevant gates without waiting for every media implementation, but whole-feature acceptance includes US4A and all downstream obligations.

Plan setup used the explicit 112 directory, `SPECIFY_FEATURE_NO_PERSIST=1` and branch context `110-admin-functions-plan-tasks`. It copied only the authorized plan template. Constitution was assessed before/after design; implementation HOLD remains under the user's explicit review-ready instruction. No extension configuration was present before planning. Final document/scope checks are recorded after generation; no application build/test, database/provider operation or Tasks execution is claimed.

Final documentation checks confirmed all five artifacts, all 68 relative link targets and five anchor references, the twelve M01–M12 decision entries, and planned coverage of all 30 FRs, six SCs and seven original stories including US4A through 17 validation groups. CRC/byte-length comparison found all 1,019 baseline files unchanged and exactly five additions, exclusively inside Feature 112. Original 112 spec/checklist/UI, Feature 111, Feature 113, Group 090 and application files remain unchanged. Branch reference is still `110-admin-functions-plan-tasks`; no Git mutation, Tasks or agent-context generation occurred. Post-plan extension check found no configuration, so no hooks apply. These are document checks, not passing implementation/media/concurrency tests; every M entry remains open and implementation readiness is not claimed.
