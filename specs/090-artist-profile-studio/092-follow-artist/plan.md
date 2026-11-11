# Implementation Plan: Feature 092 — Follow Artist

**Branch**: `090-artist-profile-studio-plan-tasks` | **Date**: 2026-11-09 | **Spec**: [spec.md](./spec.md)

**Input**: [Feature specification](./spec.md), [requirements checklist](./checklists/requirements.md), and [UI mockups](./ui/).

**Status**: Complete for technical review; **not implementation-ready**. Critical persistence, transaction, contract and authentication dependencies remain open in [F01–F09](./research.md#decision-register). Recommendations are distinguished from approved decisions. This package changes no specifications, application code, shared documents or Git state. No Tasks are generated.

## Summary

Provide authenticated personal following on the existing artist profile and `/following` page: follow/unfollow an artist, distinguish confirmed Following/Not following from unresolved state, and display the current account's public followed artists in follow-time descending / artist-ID ascending order. Retain relationships and original times while profiles are non-public, omit those entries without hints, and allow the owner to unfollow an existing hidden profile through a valid request without exposing it. Unknown/deleted artist unfollow produces identical not-found. All authenticated, non-banned User, Artist and Admin accounts may act only for themselves.

Retain React/Vite/JavaScript, the custom router, Express and backend-only Supabase PostgreSQL integration. Use the three existing contracted follow/list endpoints and existing session lifecycle. PostgreSQL reference documentation names `user_follows_artist`; it does not establish a deployed follow table or timestamp column. No new table, field, status endpoint, authentication mechanism, count column or push transport is assumed.

## Technical Context

**Language/Version**: Existing JavaScript ES modules/JSX. Node runtime unpinned: NEEDS CLARIFICATION F09 (shared 091-D08).

**Primary Dependencies**: Existing React `^18.3.1`, Vite `^5.4.11`, Tailwind `^3.4.17`, Lucide React, Express `^4.21.2`, backend Supabase JS `^2.119.0`, JWT/cookie auth. Reuse native fetch and the session client; no extra router, query library or realtime service.

**Storage**: Existing server Supabase client; PostgreSQL reference `user_follows_artist(user_id, artist_id)` composite identity. Only auth migration is checked in. Actual follow persistence, account/artist key mapping and original-follow-time storage require F02/F03; transaction access requires F04. Browser demo libraries/localStorage and auth memory fallback are not durable relationship authority.

**Testing**: Existing frontend build/dev scripts; root backend auth smoke script. No installed feature runner; Feature 131 proposes Vitest/React Testing Library/Playwright. F09 must confirm executable harness and runtime. Real multi-session/backend concurrency tests are required; timer mocks alone cannot verify FR-015.

**Target Platform**: Responsive browser SPA; JSON API `/api/v1`; existing development defaults frontend 5173, backend 5000. Production transport follows Vision HTTPS requirements.

**Project Type**: Web application with frontend, backend and database directories.

**Performance Goals**: No follow-specific latency, scale or usability-percentage target exists in 092. Vision core metadata/profile query p95 <100 ms is relevant to joined artist reads. Measure follow/list latency and contention on an agreed dataset; do not invent a numeric write SLA. Following requests must not delay 091 identity/public sections.

**Constraints**: Server-authenticated ownership, no Admin cross-account privilege, durable uniqueness, original time retained on duplicate follow, processing-order concurrency, no hidden/deleted metadata or indirect counts. No new follow limits, pagination policy, notifications, automatic playback, recommendations, profile editing or Studio operations.

**Scale/Scope**: Three existing personal endpoints; follow button composition on `/artist/:id`, own list at `/following`. Count consistency is addressed below, but count exposure/storage remains F07 because Vision/current request and 092 scope differ.

## Constitution Check

*GATE: assessed before Phase 0 and after Phase 1.*

The [Constitution](../../../.specify/memory/constitution.md) remains an unratified template. Do not treat commented examples as policy. Use actual feature requirements, Team Contract and shared architecture/security rules for review while retaining F01.

| Check | Before research | After design |
| --- | --- | --- |
| Ratified constitutional principles | Unavailable | F01 unresolved; no constitutional pass claimed |
| 092 spec/checklist/mockups and allowed roles preserved | Required | Designed; scope/count mismatch explicitly registered |
| 091 public artist identity/visibility/non-disclosure aligned | Shared dependency | Same identity and public predicate; operation-specific hidden-unfollow exception retained |
| Existing technologies/endpoints/auth reused | Baseline inspected | Aligned; F02–F06 block production integration |
| Atomic processing order and account isolation | Required | Invariants specified; approved database mechanism pending F04 |
| Shared counts/lifecycle coordinated | Undecided | F07/F08 explicit; no invented policy |
| English Markdown/Mermaid, documents only, fixed branch | Pass | All outputs restricted to this feature; no Tasks or Git mutation |

The [planning skill](../../../.agents/skills/speckit-plan/SKILL.md) requires “ERROR on gate failures or unresolved clarifications.” The user's explicit instruction requests a review package while distinguishing readiness. Therefore the implementation gate stays **HOLD**, rather than silently resolving missing decisions or claiming workflow approval. Resolve applicable F01–F09, update this package and re-evaluate the gates before implementation. 091 decisions remain owned in 091 and are not edited here.

## Project Structure

### Documentation (this feature)

```text
specs/090-artist-profile-studio/092-follow-artist/
├── spec.md                         # authoritative, unchanged
├── checklists/requirements.md      # authoritative, unchanged
├── ui/                             # inspected mockups, unchanged
├── plan.md
├── research.md                     # sources, decisions, 091 dependency mapping
├── data-model.md                   # invariants and conceptual transactions, no DDL
├── contracts/follow-artist.md       # established API and pending wire decisions
└── quickstart.md                   # future setup/validation and traceability
```

No `tasks.md` is created in this Plan step.

### Source Code (repository root)

```text
src/frontend/src/
├── pages/Artist/ArtistPage.jsx           # existing inline FollowButton integration
├── pages/Artist/FollowingPage.jsx        # existing personal list
├── components/artist/FollowButton.jsx    # proposed extracted 092-owned component
├── hooks/useArtistFollowing.js          # proposed account/request-keyed state
├── services/followArtistService.js       # proposed personal API adapter
├── services/sessionApiClient.js         # existing auth/base/refresh seam
├── context/AppStore.jsx                 # replace 092 mock authority, retain other domains
├── routes/AppRouter.jsx                 # existing artist/following routes
└── components/common/ui.jsx             # existing login/empty/error primitives
src/backend/
├── server.js                            # register endpoints before fallback
├── middleware/authMiddleware.js         # existing auth, response alignment dependency
├── routes/artistRoutes.js               # proposed shared 091 public + 092 personal routes
├── routes/userRoutes.js                 # proposed own-list route mount
├── controllers/followArtistController.js # proposed validation/envelope handling
├── services/followArtistService.js       # proposed policy/atomic operation orchestration
└── repositories/followArtistRepository.js # proposed approved persistence interface
src/database/
├── supabaseClient.js                    # existing backend-only service client
└── migrations/                         # follow changes only after F03/F04 review
```

**Structure Decision**: Extend the existing service/repository architecture. Proposed names are future locations, not existing files. Coordinate the artist router/identity policy with 091; do not create two competing public gates or run global public-artist middleware over DELETE. Test file locations and actual commands remain F09. This phase creates none of the source files shown.

## Phase 0 — Research Outcome

[research.md](./research.md) records authoritative requirements, all five inspected mockups, current code, the full 091-D01–D09 mapping and the F decision register. Established behavior is settled; technical mappings are not. In particular: recognition can reuse the own-list capability only when completeness is guaranteed; absent entries must not falsely imply Not following when a profile is hidden or a response is incomplete. Follow-count semantics need explicit coordination, not a guessed field.

## Phase 1 — Technical Architecture

### Authentication and authorization

Reuse AuraTune access JWTs, existing session verification, current account lookup and the existing refresh-cookie flow. Firebase identities enter through the current exchange; never send a Firebase ID token as a replacement follow credential. Derive owner solely from verified server identity, not URL/body/query account IDs or browser libraries. Resolve `users.id` versus `user_id` once under F03; do not use an artist's optional linked user as the follower owner.

Permit personal endpoints for authenticated, non-banned `user`, `artist`, `admin`; deny guest/banned/invalid-session access before any personal data read or write. Admin gains no cross-account exception. Do not gate Artist on ownership of the target artist: following is a personal capability. Reject unsupported owner selectors rather than permit reassignment. The Supabase service-role client bypass risk requires explicit server ownership predicates on every query; frontend hiding and row policies alone are insufficient.

Existing middleware returns ad hoc `status` bodies, 401 for banned users and 503 for auth storage failures; shared contract defines standard envelopes and 403/USER_BANNED. F06 must align the integration with auth owners without rewriting identity/session design. No auth outage may fall back to anonymous personal access or demo relationships. Public 091 reads remain independently accessible when 092 auth fails.

### Operation policies

| Operation | Artist rule | Relationship rule | Public output |
| --- | --- | --- | --- |
| Follow | Existing and public under shared 091 policy at operation's authoritative processing point | Establish one own relation if absent; preserve time if present | Confirmed personal outcome using reviewed DTO; no restricted fields |
| Unfollow public artist | Existing/public | Ensure own relation absent; repeated absence stays absent | Reviewed generic outcome |
| Unfollow existing hidden artist | Existing internally; public visibility is not a prerequisite | Owner can remove retained relation; no hidden-artist interface is added | No name/image/status or reason; exact no-relation hidden case disposition is F05 |
| Follow unknown/deleted/non-public | Same not-found | No change | Same 404/NOT_FOUND without existence disclosure |
| Unfollow unknown/permanently deleted | Same not-found for both | No unrelated change; cleanup is not selected | Same 404/NOT_FOUND without old artist information |
| Own list | Join only own relations with existing/public artists | Preserve omitted relationships and original times | Eligible public entries only, no hidden/deleted placeholders or totals |

Do not apply 091's public-viewability guard indiscriminately to hidden owner-unfollow. Share canonical artist identity/existence and public predicate, then select the appropriate policy per operation. No status change, cleanup cascade or hidden relationship inventory is exposed.

### Persistence and concurrency

Use the documented account–artist composite identity once F03 confirms actual persistence. Every write needs a single atomic database operation containing authorization/artist-policy validation and relation change; eligibility must not be a stale frontend decision. Serialize same-pair operations even when the relation is absent. Define the successful processing point as the atomic committed operation; client click time, request start and response arrival do not select a winner.

Required semantics:

- Follow inserts only if absent, with authoritative server/database follow time; duplicate follow is a no-op for membership and time. No conflict-upsert that resets time.
- Unfollow removes only that owner's relation; no-op public unfollow does not touch another row. A later successful refollow creates a new original time.
- Opposing operations on the same pair must be ordered across workers/devices; whichever successfully processes last determines the saved state. Failed/rejected transactions leave relation/time and any approved counter unchanged.
- Reads after acknowledged completion must observe that committed state unless another later operation succeeds; do not serve a stale personal-list cache or lagging replica as current authority.
- A response lost after commit is uncertain, not evidence of rollback. Reconcile before claiming a definitive state; retries are desired-state PUT/DELETE, not an inverted toggle. A retry after another operation is itself later processing; no invented exactly-once key or client timestamp precedence.

Recommended for F04 review: a database transaction with a database-scoped lock that exists independently of the relationship row, then existence/public checks and conditional insert/delete. An existing artist-row lock is a simple candidate but serializes different followers of one artist; pair-scoped advisory locking is another candidate requiring shared conventions. Confirm how 093/110 hide/delete cooperates with the chosen transaction so eligibility has an authoritative ordering. Relation-row locks alone cannot serialize first follow versus absent unfollow. A Node mutex alone cannot cover multiple workers.

Current Supabase CRUD calls do not provide a demonstrated multi-call transaction interface in this repository. F04 must approve the transaction execution boundary (for example a reviewed database function invoked by the server) and deployment/security behavior. No RPC name, SQL function, lock key format or migration is invented here. See [data-model.md](./data-model.md#atomic-processing-and-concurrency) for transaction steps and test histories.

### Follow counts and list totals

The user requests count planning and Vision FR-090-002 says follower counts update in real time. The 092 spec explicitly assumes no follower counts, defines no count field/API, and requires no continuous device synchronization. Register this as F07, not an implied new counter feature. Mockups show catalog counts, not follower counts.

Relationship rows remain the authority. The account's visible followed-artists quantity, if displayed, must be derived only from eligible returned entries and never reveal hidden retained relations. It is distinct from an artist's follower total. Do not expose either an unfiltered relationship total or another person's following list.

If F07 confirms artist counts in delivery scope, prefer deriving the approved aggregate from committed relations rather than adding a stored counter. Define whether hidden artists/banned/deleted accounts contribute, who may read it, display/transport and what “real time” means before implementation. If a stored aggregate is already approved or later justified, increment/decrement only on actual relation creation/removal in the same transaction; duplicate/no-op/rejected/rolled-back operations have zero delta, concurrency across different followers must not lose updates, and reconciliation must recompute from the same approved relation predicate. No count is returned for a non-public profile or used as hidden-profile evidence. No websocket, trigger, column or count endpoint is selected without evidence.

### Personal state recognition and list retrieval

No dedicated following-status API exists. Use `GET /users/me/following-artists` as the existing-capability candidate: a present public artist entry confirms Following; absence confirms Not following only after successful, complete, same-account retrieval for an artist established as public, with visibility/completeness races covered by F05. An unfinished/failed/capped/paginated-prefix read is never negative evidence. If the artist is now unavailable, clear its public presentation per 091 rather than displaying personal state for a hidden artist.

F05 must confirm safe completeness and wire representation; do not solve the gap by adding `isFollowing` to public 091 DTOs or creating a status endpoint. Backend filtering must occur before pagination/totals. Retained hidden/deleted references cannot leak through gaps, cursor metadata or raw totals. No product pagination/search/filter/limit is added; if infrastructure requires transport traversal, agree it and guarantee complete safe state recognition.

Backend list query: authenticate owner → join own relations to currently public existing artists → deduplicate canonical artist IDs → order original follow time DESC, artist ID ASC → project allowlisted public identity and the account's own permitted follow time. Missing image has the shared neutral fallback. Resolve typed IDs and follow timestamp precision under F02/F03; no browser locale-dependent ID order. Do not substitute fetch time for missing historic time or reset it when a profile reappears.

### UI lifecycle, account isolation and failure handling

Extract the existing inline FollowButton as a 092-owned composition at the 091 profile integration point. 091 owns public identity/sections; 092 owns personal state/actions. A following-load/action failure does not turn a public profile into a full error, and guest CTA uses existing login behavior without blocking public content.

Use internal states: authentication resolving/guest/denied; personal loading; confirmed Following; confirmed Not following; mutation pending with last confirmed state; definite failure; uncertain outcome/reconciling. These labels do not prescribe JSON keys. Only confirmed states enable the corresponding action. Disable repeat interaction while a mutation/reconciliation is pending; do not optimistically claim success before confirmation. Show mockup labels, accessible pressed/focus states and success feedback only for the current account's confirmed action; no repeated “new follow” notification for a duplicate.

Capture account ID, session generation, artist ID, desired action and request generation at initiation. On logout/account replacement/revocation, abort what can be aborted, invalidate late responses, clear private state and pending feedback, and never reassign an A action to B. Aborting fetch does not undo a committed A operation; later A loads reconcile it. Do not perform browser-side mutation after a timer looks up the latest account, as current mock code does.

Existing `apiFetch` may refresh and replay a 401 request using the current shared auth context. Before adopting it, F06 must ensure refresh/replay remains bound to the originating account/session generation. If the account changed, cancel replay rather than sending A's desired action as B. Genuine pre-write authentication denial can use existing bounded refresh then replay; network/timeout/ambiguous server failure must not be automatically resent as if no commit occurred. Auth recovery failure clears private state and asks for sign-in. Banned/forbidden access is not an empty list.

On confirmed mutation, reconcile the current personal collection/state through the approved existing capability; invalidate earlier in-flight reads so they cannot overwrite new state. Responses from concurrent devices may arrive out of commit order; next successful authoritative load wins. No live subscription/poll interval is introduced. A stale boolean must not be sent back as a toggle. Reconciliation failure stays unresolved/uncertain with retry, not Not following or a false toast. Distinguish failures known to precede commit from unknown outcomes (including some 500 responses).

`/following` has distinct authentication-loading, login-required, loading, successful nonempty, successful empty and retryable error states. Hidden-only relationships use the same normal empty presentation as no relationships. Clear newly non-public/deleted entries on authoritative re-read without placeholder or retained name. Card selection uses existing `/artist/:id` navigation, never auto-play. Keyboard/touch controls and visible retry labels remain usable at shared responsive widths.

## Implementation Sequence and Review Gates

| Stage | Work for later task breakdown | Exit evidence |
| --- | --- | --- |
| A — Resolve shared design | F01–F09 dispositions, 091 identity alignment, schema/key/time mapping, transaction transport, count scope, safe DTOs | Reviewed evidence; OpenAPI completion; no invented columns/endpoints |
| B — Backend personal capability | Auth/role/owner validation, operation-specific artist policies, atomic writes and safe ordered list | Integration tests with real storage and two accounts/devices/workers |
| C — UI integration | Account-bound adapter/hook, 092-owned button, async following list, recovery/reconciliation | Component/request tests including account switch during refresh |
| D — Cross-feature verification | Public 091 remains independent, hidden/refollow lifecycle, delete/not-found, duplicate/time/count invariants | Privacy and race histories pass without changing source specs |
| E — Acceptance | All validation matrix cases, browser/accessibility and applicable query measurements | SC-001–006 evidence and independent review |

Fixture/state design may be prepared against the conceptual model; production persistence/wire work must wait for its decision gates. No code or Tasks are created by this package.

## Verification and Risks

[quickstart.md](./quickstart.md) supplies baseline run commands, fixture requirements, complete FR/SC mapping, deterministic concurrency histories and privacy checks. Main risks are missing follow schema/time, absent transaction capability, capped-list false negatives, refresh/account-switch replay, and count/lifecycle ambiguity. Their owners and closure evidence are in [research.md](./research.md).

Planning verification covers relative links, mockup inspection, expected outputs, unchanged existing files and branch reference. Build/tests are not claimed; this is documentation-only work and the feature endpoints/harness are not implemented. Future automated tests must target backend storage/auth, not merely reproduce mock sorting.

## Complexity Tracking

No constitutional exception is invented. A database atomic boundary is necessary for specified concurrency, but its concrete mechanism is an unresolved shared implementation decision, not permission to add a service/database. No extra infrastructure, private status endpoint, count schema or auth system is introduced.
