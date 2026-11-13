# Implementation Plan: Feature 093 — Artist Track Management

**Branch**: `090-artist-profile-studio-plan-tasks` | **Date**: 2026-11-09 | **Spec**: [spec.md](./spec.md)

**Input**: [Feature specification](./spec.md), [requirements checklist](./checklists/requirements.md) and all five [UI mockups](./ui/).

**Status**: Complete for technical review; **not implementation-ready**. Critical decisions S01–S12 remain in [research.md](./research.md#decision-register). Source-backed behavior, supplemental recorded owner decisions, and technical proposals are distinguished. No specification/checklist/mockup, application code, shared document or Git branch is changed; no Tasks are generated.

## Summary

Replace the existing local Studio simulation with authenticated, artist-owned track management at `/studio`: complete own catalog and metrics, binary audio upload with required metadata, metadata-only editing, self-hide/restore and confirmed deletion. Valid uploads publish immediately as active under existing visibility rules; no admin approval workflow is added. Hidden tracks remain manageable with historical plays preserved; successful hide/delete removes them from newly loaded public discovery. Server authentication and ownership, not browser fields, control all reads/writes.

Keep the existing React/Vite JavaScript frontend, custom router, Express backend, AuraTune JWT/session flow and backend-only Supabase integration. The repository has auth persistence but no catalog migration, song-management routes, multipart parser or implemented media-storage adapter. Cloud media storage is required, but a provider is not selected by the spec's examples. Existing POST/PUT/DELETE song routes are the contract baseline; protected own-catalog/metrics retrieval and exact payloads are unresolved. Audio replacement is unsupported by 093 and remains future scope, not another upload mode.

## Technical Context

**Language/Version**: JavaScript ES modules/JSX. Node version unpinned: NEEDS CLARIFICATION S12, shared 091-D08/092-F09.

**Primary Dependencies**: Existing React `^18.3.1`, Vite `^5.4.11`, Tailwind `^3.4.17`, Lucide React; Express `^4.21.2`, backend Supabase JS `^2.119.0`, JWT/cookie/Firebase exchange. Native fetch/FormData can carry uploads. Multipart parser/media adapter are absent; select implementation only through S06, without assuming Multer, an SDK or a provider.

**Storage**: Supabase PostgreSQL client exists server-side; only auth migration exists. Reference catalog uses artists→albums→songs, with no confirmed standalone-track ownership, status, rights or media-object mapping. S02/S03/S06/S09 resolve this. Browser localStorage/filenames are not audio persistence.

**Testing**: Frontend dev/build/preview; root auth smoke script; no 093 automated runner. Shared proposed Vitest/React Testing Library/Playwright require S12 confirmation. Real database/media fault tests are necessary, not timer simulations.

**Target Platform**: Browser SPA and backend `/api/v1`; production HTTPS per Vision. Development defaults frontend 5173/backend 5000.

**Project Type**: Web application with separate frontend/backend/database modules and external media boundary.

**Performance Goals**: Owner-approved SC-002 alignment (2026-11-13): metadata edits retain **500 ms from submission**; binary uploads show progress and measure full submission-to-confirmed-persistence duration separately. Do not start the clock after transfer or call optimistic insertion persistence. See preparation/accepted-design.md; the original binary 500 ms promise is superseded. Vision core metadata query p95 <100 ms and existing range-stream contract apply at integration boundaries.

**Constraints**: Artist-only Studio, authenticated ownership, immediate active publication after validation, no admin override/approval UI, metadata edits limited to title/album/genre/duration, no binary replacement. No invented provider, DB column, endpoint payload, licensing rule or file limit. Recorded Group 090 decisions provide explicit supplemental limits/rights rules with provenance; source alignment is S04.

**Scale/Scope**: One Studio route, all own tracks and three metric cards. No source-backed page-size, studio sorting control, upload quota or realtime service. Complete protected retrieval and deterministic transport/order policy require S05. Full album management, waveform/mastering, payments, profile/follow editing and moderation workflows remain outside 093.

## Constitution Check

*GATE: assessed before Phase 0 and re-evaluated after Phase 1.*

The [Constitution](../../../.specify/memory/constitution.md) is an unfilled template, not ratified policy. Example comments do not establish principles or waivers. Actual sources support these review checks:

| Check | Before research | After design |
| --- | --- | --- |
| Ratified governance | Missing | S01 unresolved; no constitutional pass claimed |
| 093 scope/spec/checklist/UI preserved | Required | Core behavior covered; supplemental owner decisions explicitly sourced, alignment S04 |
| Existing architecture/auth/API reuse | Gaps identified | Design aligned; protected reads/storage/payloads remain gates |
| Backend artist role and ownership | Required | Designed; role/auth drift and identity mapping S02/S05 |
| No Group 110 override or invented approval | Required | Artist preference cannot clear Admin restriction; no approval states added |
| Binary storage/consistency/security | Missing implementation | S06–S10 block production delivery |
| 091/092 identity/lifecycle consistency | Shared dependencies | Mapped in research; no upstream artifact changed |
| English Markdown/Mermaid, documents only, branch fixed | Pass | Outputs confined to 093, no Tasks/Git mutation |

The [planning skill](../../../.agents/skills/speckit-plan/SKILL.md) says “ERROR on gate failures or unresolved clarifications.” The user explicitly requests a review package with unresolved blockers; therefore the implementation gate remains **HOLD**. Do not present unknown schemas/providers as chosen to manufacture a gate pass. Resolve applicable S01–S12 and re-evaluate before implementation.

## Project Structure

### Documentation (this feature)

```text
specs/090-artist-profile-studio/093-artist-track-management/
├── spec.md                           # authoritative, unchanged
├── checklists/requirements.md        # authoritative, unchanged
├── ui/                               # inspected, unchanged
├── plan.md
├── research.md                       # source evidence, shared decisions, blockers
├── data-model.md                     # logical state/consistency, no DDL
├── quickstart.md                     # setup and acceptance/fault verification
└── contracts/artist-track-management.md # known paths and pending interface design
```

`tasks.md` belongs to `/speckit.tasks` and is not created here.

### Source Code (repository root)

```text
src/frontend/src/
├── pages/Studio/StudioPage.jsx          # existing main surface
├── components/common/ui.jsx            # existing Modal/LoginRequired/Forbidden
├── services/sessionApiClient.js        # existing auth/FormData/base URL seam
├── services/artistTrackService.js       # proposed protected catalog/mutation adapter
├── hooks/useArtistTracks.js            # proposed account/request-keyed lifecycle
├── context/AppStore.jsx                # replace 093 demo authority only
└── routes/AppRouter.jsx                # existing /studio
src/backend/
├── server.js                           # mount approved routes before fallback
├── middleware/authMiddleware.js        # existing auth; coordinate drift fixes
├── routes/songRoutes.js                # proposed existing POST/PUT/DELETE paths
├── controllers/artistTrackController.js # proposed validation/envelope
├── services/artistTrackService.js       # proposed ownership/operation orchestration
├── repositories/artistTrackRepository.js # proposed approved catalog persistence
└── services/mediaStorageService.js      # proposed provider-neutral backend boundary
src/database/
├── supabaseClient.js                    # existing server-only client
└── migrations/                        # only after schema/lifecycle review
```

**Structure Decision**: Extend current modules; proposed names are future locations, not existing implementations. Protected read route location depends on S05; do not assume a new `/studio/*` API because that path appears conceptually in Vision. Share artist identity/public policy with 091 and auth corrections with 092. Test layout/runner are S12. No source files above are created by planning.

## Phase 0 — Evidence and Scope

[research.md](./research.md) reviews project sources, current code, all 091/092 artifacts and the newer Group 090 decision record. Core authority is the requested 093 spec/checklist/UI. Recorded G090-D01–D16 are existing owner instructions in draft use-case documents, not newly invented FRs, schemas or team approvals. Their divergence from old mockups/Vision must be reconciled before implementation under S04; answered business choices are not falsely reopened as unknown policy.

Not supported: audio replacement, cover-image upload flow, lyric/release-date editor, full album management, moderation/approval workflow, automated license verification. Vision mentions some broader goals; record gaps without adding controls to 093.

## Phase 1 — Architecture and Behavior

### Artist identity, authorization and sessions

Reuse existing AuraTune bearer JWT/session verification and current role/ban lookup. Firebase tokens enter existing identity exchange, not Studio mutations directly. Resolve the account's current artist link server-side; role `artist` alone without a valid linked artist is insufficient. Reference `artists.user_id` is optional; S02 maps actual `users.id`/`user_id`, artist IDs and authoritative management ownership. Collaboration/display attribution does not automatically grant management rights.

Studio is restricted to the `artist` role: guest sees LoginRequired, ordinary User and Admin accounts see Forbidden. The shared song mutation contract also permits Admin under its own capability; do not remove that project-wide permission or expose it through Studio. Keep separate policy branches owned by Group 110. Every list/stat/read/edit/hide/delete/upload validates origin identity and ownership server-side. Reject client-supplied artist/owner/plays/admin state reassignment. Validate album association permissions as well as track ID.

Supabase service credentials remain backend-only and can bypass row security; explicit owner constraints and safe projections are mandatory. Protected reads cannot be assembled by fetching public `/songs` and filtering locally, because hidden own tracks and private totals are required.

Current auth middleware has nonstandard bodies and banned-account 401 versus shared 403/USER_BANNED. S05 aligns errors with auth owners. Reuse bounded auth recovery, but bind request, draft, refresh and replay to account/session generation as identified in 092-F06. Never replay A's upload/edit as B. For long-running storage work, recheck current authorization at final publication/commit using the approved S07 boundary; expired/revoked permissions cannot authorize a later write merely because transfer started earlier.

### Protected catalog and metrics

Authenticated own-artist query returns every associated manageable track, including self-hidden tracks, with spec-defined metadata, status/actions, optional sanitized uploaded filename and canonical AuraTune play count. Track attribution versus ownership and management of imported/co-credited tracks need S02/S03; the mock `uploadedBy` condition is not security policy. No raw account rows, service credentials, private storage addresses or another artist's metadata are returned.

Metric meanings: total tracks and active tracks concern this Studio catalog; hidden tracks remain total members but not publicly active. Core spec preserves plays on hiding. Recorded G090-D06 additionally retains valid historical total plays after hiding, restriction and deletion, with active count limited to non-deleted, Artist-public, unrestricted tracks. Thus historical total cannot be implemented solely as a sum of current visible rows after deletion. S03/S09 settle the approved source without inventing a ledger or counter. Missing metrics are unavailable, not zero. Follower counts from 092 do not belong here.

S05 must supply a complete protected read/metrics contract and collection order/transport. Do not add unreviewed pagination, count fields, “include hidden” on a public route or a new stats endpoint. Independent catalog/stat failure preserves successful portions and marks prior data not updated per recorded G090-D14; retry does not erase valid peers. A public profile being non-public does not itself prove Studio authorization is revoked; S02 defines account/profile-disable linkage. Public-profile link still uses 091's neutral not-found when appropriate.

### Input validation, rights and file handling

Validate on client for feedback and on server as authority before publishing. Retain actual File/blob bytes in memory while accessible; the current filename-only input is insufficient. Multipart field names and metadata types are S05. Do not set multipart Content-Type manually; let FormData supply boundary through the existing client seam.

Core inputs: title, optional album name, genre, duration and required audio file on create; edit title/album/genre/duration only. Use exact `^\d{1,2}:[0-5]\d$` duration validation. No unapproved positivity rule or format expansion; recorded G090-D04 confirms entered duration need not be measured/matched to actual audio length. If database uses numeric duration, mapping and round-trip precision need S03, not a new duration policy.

Evidence-backed supplements, with S04 source reconciliation:

- G090-D01: MP3 only, at most **52,428,800 bytes (50 MiB), inclusive**. Old mock MP3/WAV label and Vision MP3/FLAC differ. Do not claim `audio/*` or extension-only validation proves valid MP3. Server validates actual media type/content using the S06-approved parser/checks; zero/truncated/corrupt-file disposition must be explicit, not a guessed size quota or duration rule.
- G090-D02/D03: initially unchecked per-upload distribution-rights declaration; Self-owned / Licensed / Open license; for Licensed/Open license, nonempty source and distribution-permission basis; every type declares attribution required or not, and required attribution text must be nonempty. No proof-document upload or automatic legal verification. Validate required declarations before audio upload or track save. Exact API/storage representation is S03/S05.
- G090-D15/D16 for **editing**: title nonempty after edge trim; optional/clearable album; genre from existing catalog; title and album each ≤200 Unicode code points inclusive. Do not use UTF-16 units or extend this edit-only limit to upload automatically. Existing maxLength=100 is demo drift, not approved policy. Upload metadata length policy remains S03/S04 alignment.

Project Plan PC-04/ED-06 require permitted content and source/license/attribution records. The mock notice's “CC0, NCS” examples do not establish blanket permission for every work. Record actual declaration/source evidence under the reviewed policy; do not invent a license allowlist, rights transfer, proof-review queue or legal guarantee. Moderation remains 110, and rights declarations do not replace ownership checks.

### Upload and storage consistency

Recommended orchestration, pending S06/S07 mechanics:

1. Authenticate Artist, resolve owner, validate metadata/declarations and parse bounded binary input before publication. Use reviewed parser limits matching the evidenced policy; do not buffer unbounded uploads or trust filenames/URLs.
2. Backend media adapter stores the bytes using the approved provider. Object addressing/credentials come from the backend, never an arbitrary client storage key or remote audio URL. Rejecting a supplied remote URL avoids turning upload into an unrestricted fetch service.
3. Verify successful media persistence and a stable playable reference; then atomically save the approved track metadata, ownership, media association and active preference under current authorization. Immediately publish the valid committed track subject to existing visibility/moderation restrictions; no manual approval/pending-review state.
4. Return success only when the required media and catalog commit are confirmed. Update Studio through acknowledged data/reconciliation and show the appropriate toast. No fake URL, filename-only record, optimistic-only success or play-count invention.
5. If media save succeeds but catalog commit fails, do not expose a partial public track. Compensate/clean up or reconcile the unreferenced object through a reviewed mechanism. If cleanup fails, make it operationally recoverable without claiming a completed upload. No TTL, cleanup job, operation table or distributed transaction is selected here.

Blob storage and database do not share a demonstrated transaction in this code. S07 must approve failure ownership, attempt identity and durable deduplication/reconciliation. Same-submission retry must not create another track per G090-D08; title equality or file hash alone must not collapse intentional separate uploads. No invented idempotency header or request-ID field. A lost response after commit is uncertain, not failure; do not automatically repeat POST. Public media access during staging and hidden/deleted direct-link access are S08 release blockers. A “permanent playable URL” requirement does not automatically approve publicly readable raw objects that bypass catalog eligibility.

### Metadata edit and audio replacement boundary

Prepopulate permitted fields from current authorized saved data. Submit an allowlisted metadata patch through the reviewed PUT semantics; do not spread browser track objects back to storage. Revalidate ownership, album permission, genre and duration. Preserve original identity, media association, plays/history, artist preference and independent Admin restriction. Album-name text is not proof of an album ID; blank album supports standalone tracks. S03 resolves matching/clear semantics without creating/deleting albums or stealing another artist's album.

**Audio replacement is not supported** by 093 or its edit mockup; Group README explicitly calls it future scope. No edit file picker, multipart update binary field, replacement/version lifecycle or replace endpoint is planned. Unexpected audio/owner/admin/count inputs must not mutate those fields. Do not interpret generic PUT `/songs/:id` as permission to add replacement behavior.

### Hide, restore, publication and moderation boundary

Artist preference transitions active↔hidden. Hidden remains in Studio, keeps media association and historical plays, and is excluded from newly loaded public search/browse/profile featured-song/related-playlist eligibility. Restore changes only Artist preference; it does not restore deleted tracks or clear Group 110 restrictions. Recorded G090-D05 permits existing metadata/preference changes and confirmed deletion of owned Admin-restricted tracks while preserving restriction. Do not show a “public again” success message when an independent restriction still blocks publication; use truthful result feedback.

No moderation queue, submitted/approved/rejected release state, Artist unrestrict action or mandatory Admin approval is introduced. Internal upload-in-progress/reconciliation bookkeeping is not a new product publication state. S10 resolves how shared state/guards prevent an Artist update from overwriting Admin restrictions.

Recorded G090-D07 requires hiding/deleting to prevent **new** play starts through player/playlist/queue/direct URL, skip unavailable queued items, allow already-started playback to finish, and deny replay/repeat while unavailable. S08 must coordinate existing streaming owner Huy and chosen storage access to honor those outcomes. Do not claim browser row removal or an openly readable permanent blob URL meets them. No new automatic public refresh/subscription requirement or global hard stop for existing playback is inferred.

### Delete, concurrency and recovery

Show title, irreversibility warning, Cancel/Delete modal. Cancel sends no delete. On confirmation revalidate Artist/ownership/existence and remove the track from Studio/public distribution; update appropriate metrics and toast only after confirmed result. There is no restore workflow. Logical distribution removal is required; physical object erasure timing, hard/soft deletion, FK/history/playlist cleanup and retention are S09, not selected by the modal wording.

Order concurrent applicable changes by successful processing under recorded G090-D08; deleted content cannot be resurrected by late edits, upload finalization or restore. Preserve independent admin restrictions. A database atomic conditional-write/transaction boundary is necessary; current Supabase calls do not demonstrate one. S07 reviews the concrete execution method and coordination with media cleanup, without borrowing 092's relation-specific locking as a song policy.

UI drafts/results are keyed by account, linked artist, session and request generation. Prevent duplicate submit while pending. Validation/operation errors preserve open-form data and accessible File, show correction/retry, and do not close with false success. Before submission, Cancel/close discards form and sends no operation (G090-D09/10). After submission, leaving upload/edit does not cancel the request; reconcile actual result on return (D09/12). Expiry retains accessible temporary input only for same-account recovery in the working session; a different account receives no former draft/action/result (D13). No durable draft/file storage or automatic replay is introduced. Distinguish definite rejection from unknown commit outcome and stale data from current confirmation. Delete retry/repeated-delete wire behavior is S05/S07; no unsupported success guarantee is invented.

## Implementation Phases and Gates

| Phase | Work for subsequent task decomposition | Exit evidence |
| --- | --- | --- |
| A — Resolve shared design | S01–S12 source alignment, identity/schema/reads, storage/media access, transactions/dedup, moderation separation, 500ms measurement | Reviewed decisions and exact interface examples; no hypothetical schema/provider |
| B — Protected catalog | Current-auth Artist ownership, complete own catalog/metrics and safe state lifecycle | Backend authorization/data-projection tests, complete retrieval and partial failure |
| C — Binary upload | Approved multipart validation/rights/media adapter, commit and compensation/reconciliation | Real storage/database fault matrix and same-submission duplicate prevention |
| D — Management | Metadata-only editing, preference transitions, confirmed irreversible removal, current-account recovery | No binary replacement/ownership/admin override; races and metric invariants pass |
| E — Cross-feature verification | 091 ranking/eligibility, 092 identity/follow retention, public search/stream/queue and Group 110 restriction boundary | Visibility/privacy/last-successful-change assertions across services |
| F — Review/acceptance | All FR/SC scenarios, actual 500ms timing, browser/accessibility and query measurements | Evidence and independent reviewer; no scope/implementation-readiness overclaim |

## Verification and Risks

[quickstart.md](./quickstart.md) maps FR-001–010, SC-001–003, all six stories and supplemental source decisions to concrete tests. Key risks: public endpoint misuse for private Studio data, filename-only persistence, unbound auth replay, cross-owner album assignment, duplicate POSTs after response loss, raw media URL bypass, delete/history inconsistency, admin-state overwrite and misleading 500ms measurement. Each has an explicit decision owner and closure evidence.

Planning validates links, artifact completeness, source preservation and branch reference; it does not run application tests or prove the storage feature works. No Tasks or code are produced.

## Complexity Tracking

No constitutional waiver is invented. A provider-neutral media boundary and database atomic operation are necessary responsibilities, not permission to add a provider, queue, new datastore, operation table or background system without review. Unresolved decisions keep production implementation on hold.
