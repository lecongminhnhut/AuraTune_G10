# Requirements Checklist

## Feature
Content Moderation (112)

## Scope
This checklist captures the required outcomes for the Content Moderation feature in Group 110 as defined by the current project documents and the admin moderation specification.

## Status legend
- [ ] Not started
- [ ] In progress
- [x] Complete
- [ ] Needs clarification before implementation

## Source alignment
- [x] Reviewed the proposal, team contract, API contract, architecture docs, database docs, and security docs.
- [x] Confirmed the admin-only boundary from the active API contract and role-navigation documentation.
- [x] Kept the feature separated from user-management, platform-statistics, artist-upload management, and unrelated moderation features.
- [x] Identified the source-backed admin song endpoints and the current boundary of what the project explicitly defines.
- [x] Flagged unresolved business decisions instead of inventing them: admin-editable fields, mandatory reasons, restoration semantics, delete behavior, and downstream propagation effects.

## Functional coverage
- [x] Admin access to the moderation list for songs within the current scope.
- [x] Minimal song and ownership review context for moderation.
- [x] Rights/source metadata review when it is already available in the project documents.
- [x] Restriction/hide action within the admin moderation scope.
- [x] Restoration or unrestrict action within the current product rules.
- [x] Removal or delete action within the current admin scope.
- [x] Unauthorized access rejection for non-admin or unauthenticated requests.
- [x] Missing or invalid song handling.
- [x] Empty result handling as a valid empty state.
- [x] Failure handling without false success responses.
- [x] Sensitive field exclusion and backend-only enforcement.

## Explicitly not included
- [x] User ban or unban actions (feature 111)
- [x] Platform statistics (feature 113)
- [x] Artist upload management (feature 093)
- [x] Comment moderation, album moderation, or playlist moderation
- [x] User reports, AI review, notifications, or full admin audit-log design
- [x] Storage-level or schema-level decisions not explicitly supported by the current source set

## Confirmed decisions
- [x] Exact admin-editable song fields for moderation updates: confirmed as moderation restriction handling and reason recording only; no title/artist/album/duration/cover/tags/audio/owner/uploader edits, and no source/rights/license/distribution/attribution edits in 112.
- [x] Moderation reason policy: hide/restrict and delete require a non-blank reason and confirmation; restore/unrestrict does not require a reason or second confirmation.
- [x] Deletion storage semantics: hard delete vs. soft delete is a design detail, not a business decision still missing for 112; delete is not recoverable through 112.
- [x] Restore-to-public rules after an admin restriction is lifted: admin may clear its own restriction, but may not override artist self-hide/private; public visibility returns only when the artist has made the item public again, the admin restriction is cleared, and the song has not been deleted.
- [x] The permission boundary between public visibility, artist-owner Studio access, and admin moderation review: artist-owner may view only their own restricted song within Studio with metadata/status/reason, without admin-private data; non-owner and public users cannot view non-public content; Admin retains the moderation review view.
- [x] The exact downstream visibility and playback behavior after a moderation state change: no new public search/recommendation/browse/profile exposure, queue and playlist entries become unavailable and are skipped, already-started playback may continue, replay/repeat/new play attempts are blocked, and stale UI cache is allowed until refresh.
- [x] The moderation list behavior: non-deleted songs only with distinct public, artist-hidden, and admin-restricted states; case-insensitive trimmed substring search on title or artist; AND-combined filters with default include both restricted and unrestricted; newest upload first then ascending `song_id`; 20 items/page; reset page to 1 on search/filter changes; empty-state handling.
- [x] Repeated and concurrent action behavior: restrict on an already restricted song is a no-op, unrestrict on a non-restricted song is a no-op, delete on a missing song is not-found, valid opposing actions resolve in system order, the last successful action wins, failed actions do not mutate state, and a deleted song is not restorable through 112.

## Verification checklist
- [x] The spec is written in English and follows the repository’s Spec Kit format.
- [x] The spec includes user scenarios, acceptance scenarios, edge cases, requirements, key entities, success criteria, and assumptions.
- [x] The spec distinguishes source-backed decisions from unresolved assumptions and open product questions.
- [x] The feature folder is created under the required path: `specs/110-admin-functions/112-content-moderation`.
- [x] The required files are present: `spec.md` and `checklists/requirements.md`.
- [x] The draft reflects the confirmed policy decisions resolved so far: admin edit scope, reason + confirmation for hide/restrict and delete, no reason/confirmation required for restore/unrestrict, artist self-hide/private precedence, Artist-owner Studio view for restricted songs, downstream visibility/playback behavior, moderation-list semantics, and no-op/concurrent handling.
- [x] The draft remains in Clarify-only scope and does not cross into Plan, Tasks, or Implement.
