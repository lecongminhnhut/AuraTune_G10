# Research — Feature 091 Artist Profile

**Date**: 2026-11-09 | **Branch**: `090-artist-profile-studio-plan-tasks`

**Status**: Source review complete; production implementation remains conditional on the explicit decisions below.

## Authority and source review

The [091 specification](./spec.md) and [requirements checklist](./checklists/requirements.md) control behavior. Code identifies integration seams, not permission to weaken requirements. Draft/candidate decisions are not approval evidence. Sources are the latest versions available in this checkout; no remote synchronization occurred.

| Source reviewed | Findings and effect |
| --- | --- |
| [Vision](../../../docs/proposal/Auratune_Vision_Document.md), §3.3–3.4, §5.3.9, §6 | Public biography/avatar, five featured songs, complete discography/playlists; browser/accessibility goals; core queries p95 <100 ms. Follow/Studio remain separate. |
| [Proposal](../../../docs/proposal/proposal.md), §2–6 | Responsive web artist discovery and separate artist management; no final catalog provider/stack established here. |
| [Project Plan](../../../docs/proposal/project_plan.md), §2.5, §3.2–3.3, §4.3/4.5/4.6 | Free-tier/student-credit PC-03, approved catalog PC-04; Spotify ED-01/03/11 unresolved. R1/R4/R7 cover data/technology/integration risk. Candidate-stack sections and BLD-02 integration claims are not proof of an implemented catalog. |
| [Constitution](../../../.specify/memory/constitution.md) | Unfilled template, no ratified gates. D01. |
| [Architecture](../../../docs/design/architecture/system-architecture.md), [modules](../../../docs/design/architecture/feature-modules.md), [role navigation](../../../docs/design/architecture/role-navigation.md) | Frontend→backend→database and backend authorization; conceptual docs leave technology open, whereas code supplies the current implementation baseline. |
| [API Contract](../../../docs/analysis-and-design/api-contract.md), §1, §2.4/2.6/2.7/2.8/2.10 | Existing public artist paths; envelope/status/error codes. No field-level artist DTOs, pagination or partial-success shape. |
| [API conventions](../../../docs/design/api/api-conventions.md), [API README](../../../docs/design/api/README.md) | Public endpoints need no token; server permissions and agreed pagination. Their references to `docs/design/api/api-contract.md` are stale; use the actual analysis-and-design contract above. |
| [Database README](../../../docs/design/database/README.md), [ER](../../../docs/design/database/er-diagram.md), [consistency](../../../docs/design/database/data-consistency.md) | Reference artists→albums→songs and playlist membership. `songs.total_plays` default zero is documented, update semantics unresolved. No runnable catalog migration or confirmed standalone/multiple-artist/official/visibility/release/update mappings. |
| [Data security](../../../docs/design/database/security-rules.md), [Firestore note](../../../docs/design/database/firestore-collections.md), [security](../../../docs/design/security/README.md) | Deny-by-default, least privilege, server checks, no private data. Firestore is explicitly unconfirmed. |
| [092 spec](../092-follow-artist/spec.md), [checklist](../092-follow-artist/checklists/requirements.md) | Authenticated personal following, account isolation, hidden relationship retention/restoration. Public hidden profiles still get identical not-found. No follow mutation or state is added to 091. |
| [093 spec](../093-artist-track-management/spec.md), [checklist](../093-artist-track-management/checklists/requirements.md) | Artist-only Studio, hidden songs excluded publicly with counts preserved, deletion removes distribution. Optional album uploads reveal a gap in album-only ER attribution. Mock status names do not establish columns. |
| [Public-profile UC](../../../docs/requirements/use-cases/090-artist-profile-studio/UC-090-001-view-public-artist-profile.md) | Updated 2026-11-04, Draft/unreviewed. Owner-session G090-D17 selection-unavailable return and G090-D18 sharing supplement literal 091 requirements. Record divergence without silently expanding this plan. |
| [Team Contract](../../../docs/management/team-contract.md), [Spec Kit guide](../../../docs/management/speckit-workflow-guide.md), [spec conventions](../../README.md) | English Markdown/Mermaid; Hoàng owns 090, Đăng database/albums, Khoa auth/playlists/history, Huy player, Nhựt architecture. Plan/Tasks/Implement separation. User's fixed-branch instruction overrides ordinary branch-creation advice. |
| [131 plan](../../130-frontend/131-frontend-foundation/plan.md) | Incremental services/custom router; Vitest/RTL/Playwright proposed, not installed here. Reuse eventual foundation without requiring its full refactor. |
| [081 plan](../../080-album-interaction/081-album-details/plan.md) | Album route and catalog dependency; wire schemas remain uncertain. Do not copy its album-cache behavior into 091 as a requirement. |

## Current implementation evidence

- [Frontend manifest](../../../src/frontend/package.json): React 18/Vite 5/Tailwind 3, no test runner/router library. [Router](../../../src/frontend/src/routes/AppRouter.jsx): artist, album and playlist routes; no song route.
- [ArtistPage](../../../src/frontend/src/pages/Artist/ArtistPage.jsx): synchronous mock identity/catalog, one simulated loading timer, local comparators, embedded follow/play/share controls. Missing server filtering and independent remote section failures.
- [AppStore](../../../src/frontend/src/context/AppStore.jsx) defaults missing mock track status to active; [mockData](../../../src/frontend/src/utils/mockData.js) supplies slug IDs, direct artist IDs, `isPublic`, `official`, `releaseDate`, `updatedAt`, `playCount`. These are not approved database columns or safe production defaults.
- [SongRow](../../../src/frontend/src/components/song/SongRow.jsx) invokes playback and includes personal actions. [App](../../../src/frontend/src/App.jsx) opens full player on `playTrack`; [share helper](../../../src/frontend/src/utils/share.js) produces album-query/search URLs. None alone settles selected-song navigation.
- [Server](../../../src/backend/server.js): health/auth/Firebase exchange only; generic fallback uses a different envelope. New artist handlers must precede fallback and follow the shared contract.
- [Auth middleware](../../../src/backend/middleware/authMiddleware.js) requires JWT/session/user lookup. [Auth repository](../../../src/backend/repositories/authRepository.js) supports Supabase/memory. [Supabase client](../../../src/database/supabaseClient.js) is server-only/service-role. [Migration](../../../src/database/migrations/001_auth_tables.sql) is auth-only. Firebase is identity integration, not catalog storage.
- [Session client](../../../src/frontend/src/services/sessionApiClient.js) exposes API base but attaches credentials and refreshes sessions: public profile reads need an auth-independent mode.

## Resolved choices

| Decision | Rationale | Alternatives considered |
| --- | --- | --- |
| Retain current JS/React/custom router/Express | Existing code is the integration baseline | New stack/router: unnecessary migration and unapproved scope |
| Backend eligibility and public projection | Required for non-disclosure | Sending raw catalog/accounts to browser then filtering: leaks data |
| Eligibility→deduplication→ranking→limit | Exact spec semantics | External popularity, arbitrary first-page ranking, substitutes: conflict with FRs |
| Independent section states/retry | FR-019–021 | One fail-fast page result loses successful data |
| Public-parent gate on every child request | Prevent direct route/old-identity bypass | Frontend/detail-only check exposes hidden artist content |
| No new persistence/AI/catalog ingestion | Read-only feature scope | Cache service, count writes, new provider: unrelated responsibilities |
| Wire schemas remain pending review | Existing contract defines paths/envelope, not fields | Publishing mock fields or invented section payload as approved: unsupported |

## Unresolved decisions and implementation gates

Owners follow existing responsibilities; this session has not contacted them or assigned new external work. These are technical dependencies, not unresolved product ranking choices.

| ID | Gap / decision | Owner(s) | Closure evidence and blocked work |
| --- | --- | --- | --- |
| D01 | Constitution is unratified template | Nhựt/team | Ratified principles or recorded governance disposition; blocks constitutional sign-off, not permission to rewrite it here. |
| D02 | Actual catalog schema/provider, canonical IDs, public artist/album/song predicates, hidden/disabled meaning, account-ban relationship, public fields | Đăng + Hoàng; Khoa for account policy | Reviewed schema/migration and policy mapping including unknown/missing state. Blocks repository queries, ID validation and DTO projection. No assumption that banned account means disabled artist. |
| D03 | Standalone/multiple-artist song association versus album-only reference ER | Đăng + Hoàng | Approved association source covering albumless/collaborative tracks and stale references. Blocks complete songs/playlists. No invented join table, direct artist column or forced album creation. |
| D04 | Official/public playlist evidence and update timestamp | Khoa + Hoàng + Đăng | Confirm authoritative designation, public status and update field semantics. Admin creation path/owner role alone does not prove official designation. Blocks related-playlist query. |
| D05 | Canonical all-time counts, song release dates, null rules, title collation and typed ID comparison | Khoa/history + Đăng + Hoàng | Map documented `total_plays` to real count source; agree release-date source and missing-data handling. Confirm numeric versus string ID ordering and title collation across DB/API. No zero/date-now/album-date fallback silently invented. Blocks faithful ranking on incomplete records. |
| D06 | Public wire DTOs and identity/featured partial-failure/retry contract | Hoàng + foundation owner + Đăng | Reviewed fields/examples within existing paths/envelope, exact child semantics, anonymous request mode. Demonstrate identity success when featured fails and targeted recovery. Blocks controller/adapter integration and final OpenAPI. |
| D07 | All albums versus database row caps/payload/pagination | Đăng + Hoàng | Approved complete response or traversal with stable order, no hidden totals and demonstrable completeness. Partial list cannot be represented as complete/empty. Blocks complete-discography acceptance. |
| D08 | Node runtime and executable test harness absent | Nhựt/foundation owner + Hoàng | Supported runtime, shared runner/scripts/layout. Blocks executable automated test commands, not scenario design. |
| D09 | Existing selected-song destination | Huy + Hoàng | Confirm existing full-player handoff satisfies navigation or identify approved destination. No song route exists; share URLs alone do not settle this. Blocks song-selection acceptance. |

## Contract recommendation requiring review

Prefer preserving detail identity-plus-featured semantics with isolated featured failure; albums/playlists use existing children, and a reviewed songs-child behavior supports exact featured retry. Alternative: independently retrievable identity with three children, explicitly reconciling the current detail description. Neither is approved here. Do not invent parameters, embedded section codes or DTO field names.

Vision §6.4 calls for OpenAPI 3.0.3. Final machine-readable schemas require D06/D07; [contract artifact](./contracts/artist-profile.md) records the known interface and completion gate rather than falsely finalizing hypothetical payloads.

## Workflow execution record

Read the [planning skill](../../../.agents/skills/speckit-plan/SKILL.md) and [template](../../../.specify/templates/plan-template.md). Ran `setup-plan.sh --json` with `SPECIFY_FEATURE_DIRECTORY=specs/090-artist-profile-studio/091-artist-profile`, `SPECIFY_FEATURE_NO_PERSIST=1`, `SPECIFY_FEATURE=090-artist-profile-studio-plan-tasks`; correct paths resolved with no persistent feature-state change. No pre-plan extension configuration exists; recheck after generation. No branch operations or task generation. Unresolved decisions hold implementation readiness; review artifacts are still produced as explicitly requested.

## Planning validation results

- All relative file links in the five generated Markdown artifacts resolve; section anchors were reviewed against their target headings.
- The validation matrix covers US1–US4, all 091 FRs including suffix IDs, and SC-001–008. This is planned coverage, not passed application validation.
- A before/after SHA-256 comparison of existing files under specifications, source, project docs, Spec Kit and agent skills found only the intended plan-template replacement changed. The feature specification, requirements checklist, 092/093 specifications and application code match the snapshot.
- The branch reference still names `090-artist-profile-studio-plan-tasks`. Git status/diff cannot run because macOS Command Line Tools are missing. No branch command was used to create, switch or push a branch.
- Post-plan hook check: no extension configuration exists; no before/after hooks apply. No persistent Spec Kit feature-state file was created. Five planning artifacts were produced; no task file or implementation was created.
- Application build/tests were not run: this is documentation-only planning, the local Node executable is unavailable, and catalog routes/test harness remain implementation dependencies. No runtime success is claimed.
