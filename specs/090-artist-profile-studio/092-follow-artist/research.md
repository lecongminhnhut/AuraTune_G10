# Research — Feature 092 Follow Artist

**Date**: 2026-11-09 | **Branch**: `090-artist-profile-studio-plan-tasks`

**Status**: Research/design package ready for review. Critical unresolved dependencies prevent implementation readiness. F-prefixed IDs are local to 092; 091-D references retain their original meaning.

## Authority and reviewed sources

Use the [specification](./spec.md), [checklist](./checklists/requirements.md) and inspected [mockups](./ui/) as feature authority. Written failure/privacy/concurrency rules fill states not illustrated by screenshots. The current request explicitly asks for count architecture; it does not supply count schema or resolve its conflict with the spec's no-follower-count assumption. Do not change sources or pretend a technical choice is approved. “Latest” means current checked-out versions; no fetch/sync or Git mutation was performed.

| Source | Relevant findings / impact |
| --- | --- |
| [092 spec](./spec.md), [checklist](./checklists/requirements.md) | FR-001–016; four stories, six success criteria; User/Artist/Admin allowed when non-banned; own-account only; duplicate/time, hidden retention/restoration, last successfully processed operation and deleted-ID behavior explicitly settled. No status endpoint or payload prescribed. |
| [Vision](../../../docs/proposal/Auratune_Vision_Document.md), N-08, §5.3.9, §6 | Artist following/library; FR-090-002 says real-time follower counts. Conflicts in detail with 092 no-count assumption and no-required-live-sync behavior; F07. Shared responsive/keyboard/browser/HTTPS, core query and OpenAPI 3.0.3 expectations apply. |
| [Proposal](../../../docs/proposal/proposal.md), §2–6 | Responsive web and personal following; separate Studio/admin features. No endpoint-specific response or count storage decision. |
| [Project Plan](../../../docs/proposal/project_plan.md), §2.5, §3.2, §4.3/4.5/4.6 | Free/student-tier resources; real stack decisions must match evidence. Some sections still list candidates while integrated-build descriptions mention PostgreSQL. Follow requires no Spotify/AI dependency; ED-03 external follower counts do not replace AuraTune relationships. Owners and cross-review/change management apply. |
| [Constitution](../../../.specify/memory/constitution.md) | Still placeholders. Shared 091-D01/F01, no ratified exception procedure invented. |
| [Architecture](../../../docs/design/architecture/system-architecture.md), [module ownership](../../../docs/design/architecture/feature-modules.md), [roles](../../../docs/design/architecture/role-navigation.md) | Frontend→backend→database, server authorization, shared ownership. Public and personal boundaries must remain separate. |
| [Database](../../../docs/design/database/README.md), [ER](../../../docs/design/database/er-diagram.md), [consistency](../../../docs/design/database/data-consistency.md) | Reference `user_follows_artist(user_id, artist_id)` composite key; `artists.user_id` optional. No confirmed follow timestamp, deployed catalog/follow migration, count column or cascade policy. Concurrent writes/derived values require reviewed atomic consistency. |
| [Data security](../../../docs/design/database/security-rules.md), [Firestore status](../../../docs/design/database/firestore-collections.md), [security guidance](../../../docs/design/security/README.md) | Default deny, server ownership, no cross-account data or secrets. Firestore is unconfirmed; service credentials cannot rely solely on row rules. |
| [API Contract](../../../docs/analysis-and-design/api-contract.md), §1/2.8, [conventions](../../../docs/design/api/api-conventions.md) | PUT/DELETE artist follow; GET own following-artists; bearer JWT, standard envelope/status/error list. No personal status endpoint, list DTO, mutation body/DTO, no-op mapping or pagination. References elsewhere to `docs/design/api/api-contract.md` are stale; actual source is analysis-and-design. |
| [Team Contract](../../../docs/management/team-contract.md), [workflow](../../../docs/management/speckit-workflow-guide.md), [spec index](../../README.md) | Hoàng owns 090, Khoa auth, Đăng DB, Nhựt architecture. English Markdown/Mermaid, independent review. Current no-Git/no-Tasks/exclusive-output instructions override routine workflow suggestions to branch/log elsewhere. |
| [091 plan](../091-artist-profile/plan.md), [research](../091-artist-profile/research.md), [model](../091-artist-profile/data-model.md), [contract](../091-artist-profile/contracts/artist-profile.md), [validation](../091-artist-profile/quickstart.md) | Shared public identity/visibility, no leakage, separate personal following composition; implementation held on D01–D09. Reviewed all artifacts, no edits made. Mapping below avoids making irrelevant catalog details block 092. |
| [Frontend foundation plan](../../130-frontend/131-frontend-foundation/plan.md) | Incremental shared clients/services; proposed Vitest/RTL/Playwright not installed. Do not require full store/router rewrite to deliver 092. |

## UI inspection

All five existing PNGs were opened and visually inspected, not inferred from filenames alone.

| Mockup | Observed presentation / planning consequence |
| --- | --- |
| [01 — Not following](./ui/01-artist-not-following.png) | Wren Evans public profile, outlined “Theo dõi” and UserPlus icon. Catalog song/album counts, not follower counts. Personal component composes with 091 without owning its content. |
| [02 — Following](./ui/02-artist-following.png) | Checked/highlighted “Đang theo dõi” and success toast. Apply after authoritative confirmation, not optimistic saved-state claims. |
| [03 — Unfollow](./ui/03-unfollow-artist.png) | Button returns to “Theo dõi”; old follow and new unfollow toasts coexist in screenshot. This does not authorize stale/account-crossing or duplicate success notifications. |
| [04 — Own list](./ui/04-following-artists-list.png) | `/following`, public artist cards, newest follow first, “Theo dõi từ…” dates; dates are presentation, not sort keys or approved column names. |
| [05 — Empty](./ui/05-following-list-empty.png) | Normal empty message and exploration CTA. Same state for hidden-only relationships, with no hidden placeholders/counts. |

Screenshots do not illustrate unresolved state, failed list, expired/banned auth, concurrency or hidden-owner requests. These still follow the written spec. Do not add live counters, sort controls or hidden management UI based on unrelated shell/player elements.

## Current implementation evidence

- [Frontend manifest](../../../src/frontend/package.json): React 18/Vite 5/Tailwind 3, no installed test runner or router library. [Backend manifest](../../../src/backend/package.json): Express/Supabase/JWT. [Root manifest](../../../package.json): backend auth smoke script, no 092 suite/runtime pin.
- [ArtistPage](../../../src/frontend/src/pages/Artist/ArtistPage.jsx) embeds a mock FollowButton: delayed “resolved” flag, store boolean, timed action, toast. It does not read an authoritative personal state.
- [FollowingPage](../../../src/frontend/src/pages/Artist/FollowingPage.jsx) sorts local follow objects, joins mock artists, filters `isPublic`; no async server loading/error handling. Reuse presentation/routes, replace authority through a feature service.
- [AppStore](../../../src/frontend/src/context/AppStore.jsx) persists demo libraries locally. `setFollow` reads current session inside its timer, which can reassign an initiated action after account change; `isFollowing` is a local boolean. Original mock `followedAt` is a UI data property, not deployed schema evidence.
- [Session client](../../../src/frontend/src/services/sessionApiClient.js) attaches the current access token and cookies, refreshes on 401, then retries using returned token. Refresh/replay and callbacks need origin-account/session binding (F06); ignoring only the final response is insufficient to prevent B's mutation.
- [Auth middleware](../../../src/backend/middleware/authMiddleware.js) validates JWT/session/user, uses current role, rejects banned users with 401 and returns nonstandard error bodies. [Auth helpers](../../../src/backend/utils/authHelpers.js) issue 15-minute access JWT, refresh cookies scoped to `/api/v1/auth`; normal refresh is already implemented, not a new 092 mechanism.
- [Server](../../../src/backend/server.js) exposes auth/health/Firebase exchange; follow/list routes absent. Fallback envelope differs from approved contract. [Auth repository](../../../src/backend/repositories/authRepository.js) supports Supabase or memory; [migration](../../../src/database/migrations/001_auth_tables.sql) creates auth tables with text `id`/`user_id`, unlike reference ER's abstract key description. Mapping requires review.
- [Supabase client](../../../src/database/supabaseClient.js) is server-only/service-role, not a demonstrated multi-call transaction API. Neither a follow schema nor approved transactional function exists in checked-in migrations. Firebase identity exchange does not imply Firestore.

## Resolved decisions, rationale and alternatives

| Decision | Rationale | Alternatives considered |
| --- | --- | --- |
| Keep current React/custom router/Express/server Supabase seam | Existing implementation baseline | New auth/router/database: unsupported migration |
| Existing three personal endpoints only | Spec explicitly requires existing capabilities | New GET status/count endpoint or public `isFollowing` field: unapproved interface |
| Authenticated owner derived server-side for all roles | FR-003/009; Admin not exempt | Body/query owner or admin override: cross-account exposure |
| Public artist gate for follow/list; internal existence + own relation for hidden unfollow | FR-011/013/016 with 091 public privacy | Public gate on every mutation: prevents permitted hidden-unfollow; bypassing follow visibility: discloses/creates restricted relations |
| Atomic durable processing, server time, insert-if-absent | FR-004/014/015 | Browser click timestamps, reset-on-upsert, Node-only mutex or independent read/write: violate concurrency/uniqueness |
| Explicit unknown/reconciling personal state | FR-005/010 | Failed list means Not following, toast-on-timeout or blind toggle retry: false state |
| Account-bound request/refresh generation | FR-012 | Resolve owner at delayed execution/replay time: mutates wrong account |
| Count source is relationships; exposure/storage pending F07 | Count request must be addressed without inventing scope/schema | Guessed `follower_count` column or counting returned visible cards as artist followers: unsupported semantics |

## Shared 091 dependency mapping

| 091 ID | Relevance to 092 / local action |
| --- | --- |
| D01 — Constitution | Direct shared governance gap → F01. |
| D02 — Catalog identity/public predicate/fields | Critical shared artist identity, ban-versus-visibility policy and public projection → F02/F03. Resolve once with 091; no separate hidden flag. |
| D03 — Song association | Not a prerequisite for follow relationships. 092 does not discover songs or need standalone/multi-artist song mappings. |
| D04 — Official playlists | Not a follow dependency; no copied playlist policy. |
| D05 — Ranking inputs/typed IDs | Only stable typed artist-ID ordering is shared → F02/F03. Song plays/dates/title collation are not follow prerequisites. |
| D06 — Public DTO/partial failure | Public artist projection/personal component boundary relevant → F02/F05. 092 personal failure must not collapse 091; no personal fields added to public DTO. Featured-song failure composition remains 091-owned. |
| D07 — Complete albums | Not a follow dependency. Own-list completeness is a separate F05 question, not solved by album paging decisions. |
| D08 — Runtime/test harness | Shared tooling gap → F09. |
| D09 — Selected-song destination | Not a follow dependency. 092 list uses already-existing `/artist/:id`, not a song handoff. |

## Decision register

All items are **OPEN** at planning completion. Owners reflect existing roles, not newly assigned external work. No decision is silently closed by a mock field or suggested mechanism.

| ID | Unresolved question / evidence gap | Owners | Closure evidence; implementation impact |
| --- | --- | --- | --- |
| F01 | Ratified Constitution absent | Nhựt/team | Ratification or recorded governance disposition, aligned with 091-D01; constitutional approval cannot be claimed. |
| F02 | Canonical artist IDs, public/hidden/disabled predicate and safe fields; effect of linked-account ban not defined | Hoàng + Đăng, Khoa for account policy | Reviewed shared policy and catalog schema/ID validation, reuse 091-D02 and ID portion of D05; blocks correct follow/list/non-disclosure. |
| F03 | Actual relation persistence/key mapping and original follow time absent from migrations | Đăng + Hoàng + Khoa | Confirm existing reference table deployment, map verified auth owner (`id`/`user_id`) and artist key, uniqueness, timestamp type/precision/source, migration of missing historic times. No guessed timestamp name/backfill date; blocks durable follows/order. |
| F04 | Atomic transaction/serialization transport not implemented | Đăng + Hoàng + Nhựt | Approved DB execution boundary and lock strategy covering absent pairs, multiple workers, visibility/delete races and rollback; demonstrate commit-order histories. No invented RPC/function/lock schema; blocks FR-015 and count atomicity if applicable. |
| F05 | Exact personal DTOs, duplicate/no-op statuses, complete own-list traversal/state recognition, hidden-unfollow no-own-relation case | Hoàng + Khoa + Đăng | Reviewed examples/OpenAPI using only current endpoints; absence-as-negative safe only for public artist and complete authoritative list. Define non-disclosing no-op/404 treatment without leaking another account's relation. Blocks UI/backend integration and final contract schemas. |
| F06 | Auth error-envelope/status drift; origin-bound refresh/replay and session revocation/ban ordering | Khoa + Hoàng | Shared auth alignment: bearer/session checks retained; standard failures, banned denial, no A→B replay. Tests cover refresh in flight, same-account new session, logout and revocation. No new authentication mechanism; blocks safe personal integration. |
| F07 | User/Vision request follow counts while 092 excludes assumed follower counts; no schema/API/count predicate/live semantics | Hoàng + Nhựt + Đăng + Khoa | Decide count meaning (artist follower total vs own visible list), eligible membership incl. hidden/banned/deleted states, audience, freshness and approved read/representation. Confirm in-scope change or explicit deferral; no count column/API/UI invented. Blocks any count implementation/claim of full Vision count coverage. |
| F08 | Permanent deletion cleanup/storage and races undecided | Đăng + Hoàng + Khoa | Shared lifecycle disposition needed for FK/delete integration and stale refs; preserve FR-016 outward result without selecting cascade/retention policy. Can validate behavior through approved fixtures meanwhile; no cleanup migration under 092 assumptions. |
| F09 | Runtime/tests not pinned/installed | Nhựt/foundation owner + Hoàng | Supported runtime, shared runner/scripts/layout incl. multi-worker integration tests; maps 091-D08. Blocks runnable automated validation instructions, not review of scenarios. |

## Count direction for review

Distinguish an artist's aggregate follower count from the owner's number of publicly visible followed artists. Neither may disclose hidden/deleted artist existence or another account's private relationships. Relationship presence remains the source of truth; duplicate/no-op/failed mutations cause no aggregate delta. A derived aggregate is the simplest candidate if F07 approves count scope; stored aggregates, if necessary, must update atomically with actual row transitions and reconcile to the approved predicate. No external follower counts or realtime subscription is selected. “Next successful state load” concurrency remains the approved 092 behavior regardless of a separate count decision.

## Workflow record

Read the [plan skill](../../../.agents/skills/speckit-plan/SKILL.md) and [plan template](../../../.specify/templates/plan-template.md). Pre-plan extension configuration is absent. Ran setup with explicit 092 feature directory, `SPECIFY_FEATURE_NO_PERSIST=1`, and branch context `090-artist-profile-studio-plan-tasks`; it resolved the requested spec/plan without modifying persistent feature state. No delegation, Git mutation, task generation or application implementation. Unresolved dependencies are retained under the user's explicit review-readiness instruction; the skill's unresolved-clarification gate is not claimed passed.

## Planning validation results

- All five required planning artifacts are present; all relative file links resolve. Decision/transaction section anchors match their headings. No Tasks were generated.
- All five PNG mockups were visually inspected; the validation guide maps every FR-001–016 and SC-001–006, plus the separate count-scope decision, to concrete review/test evidence.
- Before/after CRC and byte-length checks of 1,004 pre-existing files under specifications, source, project docs, Spec Kit, agent/Gemini configuration and root manifests/readme/ignore/branch reference found no changed or missing existing files. Exactly five new planning files appeared, all in Feature 092. This includes preservation of Feature 091 planning, all feature specifications/checklists and 092 UI images.
- The branch reference remains `090-artist-profile-studio-plan-tasks`. No Git create/switch/merge/commit/push or other branch mutation was invoked. No persistent Spec Kit feature-state output was created.
- Post-plan extension check: no extension configuration exists, so no before/after hooks apply.
- No build or application tests were executed; no Node executable is available in this planning shell, and the follow backend/test harness is not implemented. Readiness remains review-only with F01–F09 open.
