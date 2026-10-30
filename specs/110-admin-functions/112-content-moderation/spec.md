# Feature Specification: Content Moderation

**Feature Branch**: `112-content-moderation-spec`

**Created**: 2026-10-30

**Status**: Draft

**Input**: User description: "Admin can review and manage songs that violate or are unsuitable for the platform, including unauthorized distribution, within the project-defined scope. The feature must include listing songs for moderation, viewing the information necessary to identify the song and its owner, reviewing source, distribution rights, license and attribution information when defined by upload or source documents, editing song details within the admin scope, hiding or restricting songs, deleting songs, clarifying when restrictions can be removed and the song returned to public visibility, and enforcing admin-only permissions. The system must handle missing songs, expired sessions, insufficient permissions, invalid data, and failed operations. Only valid admins may perform moderation actions. Do not mix in account ban/unban management from feature 111, platform statistics from feature 113, artist upload management from feature 093, or a pre-approval workflow unless the upload spec explicitly defines it. Do not add commentary moderation, album moderation, playlist moderation, user reports, AI review, notification flows, or full admin audit logs unless the source clearly includes them. Do not decide storage technology, hard-delete mechanics, or schema details beyond the current project evidence."

## Clarifications

### Session 2026-10-30

- Q: Which source documents define the admin-content scope for this feature? → A: The current project evidence is the proposal, team contract, API contract, feature-module boundaries, database design overview, security rules, and the role-navigation docs. The feature is explicitly scoped to Admin Functions in Group 110 and the admin song endpoints in the active API contract. The upload, playlist, comment, and artist-content-management specs remain separate unless a specific later source document defines otherwise.
- Q: Is there a direct spec for 091/093/111 in the current branch? → A: No. The checked-out branch contains the 112 folder, but the 091/093/111 feature files are not present in this branch. This draft therefore uses the active project docs and API contract as the current source of truth and does not infer additional behavior from absent files.
- Q: What is the minimum admin-visible information for content moderation? → A: The source set supports a moderation list that includes a song record and its owner context, but it does not define a complete display contract. This draft therefore limits admin-visible review data to the minimum needed to identify the song, owner, and moderation status: `song_id`, `title`, `artist_id` or artist name if available, `owner_user_id` or creator identity if available, `status`/visibility state, `is_deleted` or equivalent non-public state if present, `license`/rights/attribution information when already defined by the source document, and the current moderation state. Sensitive personal data outside that boundary must not be exposed.
- Q: Which song fields can an admin edit? → A: Confirmed scope for 112: Admin may apply or remove a moderation restriction and record a reason using the already-confirmed moderation rules. Admin must not edit `title`, `artist`, `album`, `duration`, `cover`, `tags`, audio file content, owner, or uploader. Within 112, Admin may not edit source/rights, license/distribution, or attribution fields; those are read-only for this feature. There is no separate moderation-note feature in this scope.
- Q: Which moderation actions require a reason and confirmation? → A: Only a hide/restrict action and a delete action require a non-blank reason and a confirmation step before execution. A restore/unrestrict action does not require a reason and does not require a second confirmation; it simply clears the moderation restriction for a song that is currently restricted and still exists. A duplicate restore request remains a no-op.
- Q: Is a deletion request a hard delete or a soft delete? → A: Not a business decision for 112; deletion is a final admin action that removes the song from public availability. The storage mechanism (hard delete vs. soft delete) is a design detail and is not required to be decided in Clarify.
- Q: What happens when a song is hidden by an artist and then restricted by an admin? → A: Confirmed rule for 112: Admin may remove their own restriction, but Admin may not override an artist's self-hide/private status. A song becomes public only when the artist chooses to make it public again, there is no active admin restriction, and the song has not been deleted.
- Q: When can a restricted song be made public again? → A: A restricted song can be made public again only if the artist has restored the private/hidden state, the admin restriction has been lifted, and the song is not deleted. Admin may clear its own restriction but may not bypass an artist self-hide/private state.
- Q: How should admin moderation actions affect search, recommendations, public browsing, profile views, queueing, playback, and playlists? → A: Confirmed behavior for 112: after a successful restrict or delete action, the song must not appear in newly loaded search results, recommendations, public browse results, or the public artist profile. Existing playlist or queue entries are treated as unavailable; they must not start playback, and the queue skips them. UI already loaded before a refresh may still show stale data until reload, but any new playback request is denied. Playback already in progress may continue until completion, but replay, repeat, or a new play attempt is blocked. A restore only re-enables visibility and playback if the song remains Artist-public and the item has not been deleted. Delete is not recoverable via 112; this feature does not decide storage or physical-delete mechanics.
- Q: What does the moderation list include and how are search/filter/sort/paging defined? → A: The moderation list includes non-deleted songs, including public songs, artist-hidden songs, and admin-restricted songs, with these states kept distinct. Search matches a title or artist name via a substring check after trimming leading/trailing whitespace and lowercasing the comparison text. Filter logic is AND-combined, with a yes/no admin-restriction filter and the default being both values included. Sorting is newest upload first, then lower `song_id` first when timestamps are equal. Page size is 20; changing the search term or filter resets the page to 1. Empty results are displayed as a valid empty state. This is a behavior rule, not an API or schema invention.
- Q: What happens when moderation actions are repeated or performed concurrently? → A: Repeating a restrict on an already restricted song is a no-op and must not overwrite the reason; repeating an unrestrict on a non-restricted song is also a no-op. Delete on a missing song returns not-found and creates no side effect. Valid opposing actions are handled in system order, and the last successful action decides the persisted state. Once a song is deleted, later actions must not restore it through 112. Failed actions do not mutate the saved state. The next successful refresh reflects the current state; real-time UI synchronization is not required.
- Q: What can the artist-owner view in Studio when their song is restricted by Admin? → A: Confirmed rule for 112: A valid artist-owner with active access may view their own restricted song in Artist Studio. The view includes the song metadata relevant to ownership and moderation, the current restricted state, and the restriction reason. It must not expose any private information about the Admin who enforced the restriction. The artist-owner may not play the restricted song, self-unrestrict it, or republish it to bypass the admin decision. Other users may not access non-public song content through Studio or public UI. Admins may view the information needed to moderate the song. This rule applies only to restricted songs and does not imply a review or restore path for deleted songs. It applies only while the actor still has valid access rights.

## Source review summary

The current reviewed project source set supports a moderation feature for songs but does not define all operational decisions for the admin workflow.

- The vision document describes administrators as responsible for moderation and safe platform management, but it does not define song-restriction or deletion workflows in detail.
- The project proposal states administrators must manage and remove copyrighted or violating items, without defining the precise review workflow, edit scope, or automatic restoration semantics.
- The team contract assigns Group 110 to Hoàng and identifies Admin Functions as an ownership boundary for moderation and management, not for user-account bans or platform statistics.
- The API contract includes `GET /admin/songs`, `PUT /admin/songs/:id`, and `DELETE /admin/songs/:id`, which is the current evidence for the admin moderation endpoints. The contract does not define the exact moderation list semantics or a full list of editable fields.
- The architecture module documents confirm that Admin Functions must check role and ownership at the backend and keep Admin management separate from content moderation, user-account management, and platform-analytics features.
- The database documents confirm song and artist relationships and status-like concepts like `status`, but they do not define an exact moderation workflow, license-flagging rules, or admin-editable field set.
- The security documentation requires server-side authorization, minimal data exposure, strict separation of roles, and no secret leakage.

This spec follows only the current project evidence and clearly marks unresolved operational decisions as assumptions or open questions rather than inventing unsupported product behavior.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review the moderation queue and identify songs needing action (Priority: P1)

As an authenticated admin, I want to view the current song moderation queue so that I can identify songs that require review or enforcement action.

**Why this priority**: Reviewing the moderation list is the primary workflow; without it, the admin cannot identify problematic content.

**Independent Test**: Authenticate as a valid admin and request the admin song list, then verify that the list includes only reviewable song records and the minimal required fields for review.

**Acceptance Scenarios**:

1. **Given** an authenticated admin account with valid access, **When** they request the moderation list, **Then** the system returns the current set of song records in scope for moderation and shows only the approved admin-visible fields needed to identify the song, its owning artist, and its current moderation state.
2. **Given** a song is public, hidden, restricted, or otherwise non-public, **When** the admin opens the moderation list, **Then** the song appears in the moderation-view context if the system is configured to return such records and the admin is allowed to review them.
3. **Given** the moderation list is empty, **When** the admin requests it, **Then** the system returns a valid empty result rather than a misleading system error.
4. **Given** a request references a song that no longer exists, **When** the admin attempts to review it, **Then** the system returns a not-found outcome and no state change occurs.

---

### User Story 2 - Inspect the rights and ownership context needed for moderation decisions (Priority: P1)

As an authenticated admin, I want to inspect the minimum song ownership and rights information needed to determine whether the content should stay public, be restricted, or be removed.

**Why this priority**: Admin enforcement depends on understanding ownership and rights context before a moderation decision.

**Independent Test**: Open a song record for moderation and confirm the returned fields are limited to the evidence-backed ownership and rights metadata required for a review action.

**Acceptance Scenarios**:

1. **Given** a song exists and its owner or artist association is known, **When** the admin views the moderation record, **Then** the system shows the minimum required identity and ownership data needed to attribute the song to a valid owner or artist.
2. **Given** a song includes explicit source, distribution, license, or attribution information already defined by upload or project documentation, **When** the admin views the moderation record, **Then** the system presents that information in the moderation view without exposing unrelated personal or secret data.
3. **Given** that rights metadata is absent or not defined for the song, **When** the admin opens the moderation record, **Then** the system shows only the data that is available and does not invent ownership or licensing claims.
4. **Given** the target song has been deleted or is not publicly viewable, **When** the admin attempts to review it, **Then** the system returns the correct unavailable/not-found state and no hidden detail is disclosed.

---

### User Story 3 - Restrict or hide songs when the content is unsuitable or unauthorized (Priority: P1)

As an authenticated admin, I want to restrict or hide an unsuitable or unauthorized song so that the public and user-facing catalogue no longer exposes the item.

**Why this priority**: Restriction is the main enforcement action that removes an offending song from normal public access while preserving its record for admin review or later reinstatement.

**Independent Test**: Choose a valid song, apply a hide/restrict action, and verify the song is no longer available through the normal browsing flow while the admin record remains distinguishable from a missing or deleted song.

**Acceptance Scenarios**:

1. **Given** a valid admin and a valid song eligible for moderation, **When** the admin restricts or hides the song and provides a non-blank reason, **Then** the song enters the non-public or restricted state without deleting the underlying record and the action is confirmed before execution.
2. **Given** a song is already restricted or hidden, **When** the admin repeats the same action, **Then** the system returns a consistent no-op or duplicate-state result without creating contradictory state.
3. **Given** the admin attempts to restrict a non-existent or invalid song, **When** the action is evaluated, **Then** the system returns a not-found or validation outcome and does not mutate state.
4. **Given** the admin attempts to restrict a song while unauthenticated or without admin privileges, **When** the request is evaluated, **Then** the action is denied and no state change occurs.
5. **Given** the admin submits a blank or whitespace-only reason for a restrict or delete action, **When** the request is evaluated, **Then** the system rejects the action as invalid input and no state change occurs.

---

### User Story 4 - Restore restricted songs to normal visibility when the restriction is lifted (Priority: P1)

As an authenticated admin, I want to restore a song to normal public visibility when the restriction is lifted so that the platform can return content to eligible browsing if the product decision permits it.

**Why this priority**: Restoration is the inverse of restriction and is necessary to keep lawful and supported moderation decisions reversible.

**Independent Test**: Restrict a normal song, then unrestrict it, and verify that the item returns only if the product rules allow it and no other visibility restriction remains in place.

**Acceptance Scenarios**:

1. **Given** a valid admin and a song currently in a restricted state, **When** the admin restores the song, **Then** the song moves back to the eligible visibility state permitted by the current product rules.
2. **Given** the song is already restored or not restricted, **When** the admin requests a restore, **Then** the system reports a no-op or already-restored state without contradictory mutation.
3. **Given** the target song has an artist-level hide or private-visibility rule that still applies, **When** the admin attempts to restore it, **Then** the system preserves the artist-selected non-public state and does not make the song public again unless the artist or the project explicitly approves a separate public-visibility override.
4. **Given** the song is already deleted or missing, **When** the admin requests restoration, **Then** the system returns a not-found outcome and no state change occurs.

### User Story 4A - Artist-owner Studio visibility for a restricted song (Priority: P1)

As a valid artist-owner with active access, I want to view my own restricted song in Artist Studio so that I can understand the moderation status and the restriction reason without exposing any Admin private details or bypassing the moderation decision.

**Why this priority**: Artists need a limited internal view of their own restricted content so they can understand why it is hidden without gaining permission to bypass the admin restriction.

**Independent Test**: Log in as the owner of a restricted song, open the Studio view for that song, and verify that the song metadata, moderation status, and reason are visible while the admin's private information and general public visibility remain blocked.

**Acceptance Scenarios**:

1. **Given** a valid artist-owner with active access and a song that is restricted by Admin, **When** the artist opens the Studio view for that song, **Then** the system displays the song metadata relevant to ownership and moderation, the current restricted state, and the restriction reason without revealing the Admin's private or personal data.
2. **Given** a non-owner user, a public user, or an unauthenticated user, **When** they access the restricted song through Studio or public UI, **Then** the system denies access and does not expose the non-public content or the restricted metadata.
3. **Given** the artist-owner tries to play the restricted song, self-unrestrict it, or republish it to bypass the Admin decision, **When** the request is evaluated, **Then** the system rejects the action and the song remains under the existing admin restriction until the product rules allow a valid restore path.
4. **Given** the artist-owner account is no longer valid or has lost access, **When** the artist tries to view the restricted song in Studio, **Then** the system denies access and no non-public content is exposed.
5. **Given** a deleted song, **When** the artist-owner tries to access the deleted item in Studio, **Then** the system does not create a default “view deleted content again” workflow; the deleted item remains a deleted state and does not become a restored or reviewable moderation record unless a separate source explicitly defines that behavior.

---

### User Story 5 - Remove a song from the platform when the removal action is authorized (Priority: P1)

As an authenticated admin, I want to remove a song from the platform when the project scope and legal or platform policy allow it so that the system no longer serves the unauthorized or unsuitable content.

**Why this priority**: Deletion is a major enforcement action in the admin song-management scope and must be treated as high-importance and explicitly bounded.

**Independent Test**: Submit a valid admin deletion request for a song and verify the result matches the defined delete semantics without exposing hidden data or reporting false success.

**Acceptance Scenarios**:

1. **Given** a valid admin and a song in scope for removal, **When** the admin deletes the song and provides a non-blank reason, **Then** the system requires confirmation before execution and performs the removal according to the project-defined delete semantics without claiming success if the deletion fails.
2. **Given** a song is already removed or missing, **When** the admin repeats the delete action, **Then** the system returns a consistent no-op or not-found outcome and no contradictory state is created.
3. **Given** a delete request is attempted without valid admin authorization, **When** the request is evaluated, **Then** the system rejects it with an authorization failure and no state change occurs.
4. **Given** a delete request fails due to a backend or database error, **When** the request is processed, **Then** the system reports a failure outcome and does not falsely claim the song was removed.
5. **Given** the admin submits a blank or whitespace-only reason for a restrict or delete action, **When** the request is evaluated, **Then** the system rejects the action as invalid input and no state change occurs.

---

### User Story 6 - Protect moderation actions with backend authorization and safe failure handling (Priority: P1)

As a system, I want every moderation action to be enforced at the backend so that only valid admins can review, hide, restore, or delete songs and no expired, unauthenticated, or unauthorized request changes the moderation state.

**Why this priority**: The source set requires strict admin-only enforcement and safe handling of invalid requests and failed operations.

**Independent Test**: Attempt access to the admin song actions without authentication, with expired tokens, as a non-admin user, and as a banned admin user if one exists; verify that every request is denied and no state change occurs.

**Acceptance Scenarios**:

1. **Given** an unauthenticated request to a moderation endpoint, **When** the request is evaluated, **Then** the system denies access with an authentication error and does not reveal moderation data.
2. **Given** an expired or invalid token, **When** the admin attempts to list or manage songs, **Then** the system denies the request and does not perform the action.
3. **Given** a valid authenticated non-admin account, **When** it attempts to access admin moderation endpoints, **Then** the system denies access with a forbidden error and does not disclose moderation list data or mutate state.
4. **Given** an admin action fails for any server-side or data-layer reason, **When** the failure is returned, **Then** the system surfaces a failure result but never claims success without a persisted state change.

### Edge Cases

- A moderation list may contain songs with a mixture of public, hidden, restricted, or deleted states; the list must not imply that only public songs exist. The list includes non-deleted songs only, while the admin view still distinguishes deleted records as a separate state when they are retrieved for review.
- A requested song may no longer exist, may already be hidden, may already be restored, or may already be deleted; duplicate requests must be handled consistently without contradictory state.
- A song may be visible in one public context while also being hidden from another because of artist-owner or admin-level restrictions; the moderation state must be authoritative and not inferred from a single local UI hint.
- A hide/restrict action and a delete action require a non-blank reason and a confirmation step; a restore/unrestrict action does not require a reason or second confirmation and simply clears the restriction if the song is currently restricted and still exists. Artist-selected private or hidden visibility remains the governing rule after admin restore unless a separate approved product decision overrides it.
- The source documents do not define whether a hidden song can be restored automatically or only by an admin; the feature must not assume recovery semantics not approved by the product.
- The chosen admin edit scope is limited to moderation-safe metadata only; admin modifications must stay within the current project-backed moderation scope and not broaden into full artist upload management.
- A song may be unavailable because of a temporary backend failure, a missing record, or an intentional restricted state; the system must distinguish those states.
- Restricted or deleted songs must be removed from public browse/search/recommendation results and must not be playable from player, queue, or direct URL access; only admins may still view the record. Existing queue or playlist entries are treated as unavailable and are skipped; stale cached UI state may remain until reload, but new playback requests are denied.
- A request can be valid but still fail because of database or service problems; the system must never report success when the action has not actually changed state.
- A delete operation is a project-level admin action, but the precise hard-delete vs. soft-delete semantics are not in the current source set and must be confirmed by the product or implementation design; 112 does not create a restore path for deleted songs.
- The moderation listing and filtering logic is behavior-defined only: search is case-insensitive, trims whitespace, and matches substring on title or artist; filters are AND-combined; default includes both restricted and unrestricted; page resets to 1 with filter or search changes; page size is 20; sorting is newest upload first and then ascending `song_id` for same timestamp.
- Duplicate or conflicting moderation action attempts are handled as no-ops when they do not change state, and valid opposing actions are resolved in system order; the last successful action decides the persisted state. A deleted song cannot be restored via 112 after the delete is accepted.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow a valid authenticated admin to access the content-moderation capability within the current project scope.
- **FR-002**: The system MUST allow a valid authenticated admin to view the moderation list for songs that are in scope for review, while limiting exposure to the minimum fields needed to identify the song, its owner or artist, and the current moderation state.
- **FR-003**: The system MUST allow a valid authenticated admin to inspect the minimal rights, ownership, license, attribution, or source information already defined by the project source set for a song under review.
- **FR-004**: The system MUST ensure that moderation review does not expose unrelated user data, tokens, secrets, or password material.
- **FR-005**: The system MUST allow a valid authenticated admin to restrict or hide a song when the content is not permitted or is unsuitable under the current project scope, and MUST require both a non-blank reason and a confirmation step before execution.
- **FR-006**: The system MUST allow a valid authenticated admin to clear its own restriction on a song when the moderation condition is resolved and no higher-priority restriction remains in effect. This restore action MUST NOT require a reason or second confirmation. Admin may not override an artist-selected private/hidden state; a song becomes public only when the artist has made it public again, the admin restriction is cleared, and the song has not been deleted.
- **FR-007**: The system MUST allow a valid authenticated admin to remove a song from public availability and maintain a final consistent state, without claiming success when the removal fails. A delete action MUST require both a non-blank reason and a confirmation step before execution. Whether the implementation uses a hard delete or soft delete is a design detail, not a required business decision in this feature.
- **FR-008**: The system MUST restrict admin update operations to moderation restriction handling and reason recording only. Admins MUST NOT edit `title`, `artist`, `album`, `duration`, `cover`, `tags`, audio file content, owner or uploader identity, source/rights, license/distribution, or attribution metadata within 112. There is no separate moderation-notes feature in this scope.
- **FR-009**: The system MUST reject any request that does not originate from a valid authenticated admin.
- **FR-010**: The system MUST reject expired, invalid, or missing authentication and MUST not perform moderation actions without a valid admin session.
- **FR-011**: The system MUST deny access to non-admin accounts and must not disclose moderation data or mutate state for unauthorized roles.
- **FR-012**: The system MUST return a not-found result when the target song does not exist and MUST make no state change.
- **FR-013**: The system MUST return a validation error for malformed requests, invalid song references, blank moderation reasons, or data that does not satisfy the current moderation contract; it MUST not mutate state on invalid input.
- **FR-014**: The system MUST handle empty result sets as a valid empty state rather than as a failure.
- **FR-015**: The system MUST distinguish among valid empty results, validation failures, authorization failures, not-found results, and operation failures without reporting false success.
- **FR-016**: The system MUST maintain the feature boundary for Group 110 and MUST NOT mix in user-account ban or unban behavior from feature 111, platform-statistics features from 113, or artist upload-management behavior from feature 093.
- **FR-017**: The system MUST keep moderation scoped to songs and relevant song metadata unless a separate source document approves a broader moderation scope.
- **FR-018**: The system SHOULD treat repeated or contradictory moderation requests consistently and avoid creating conflicting states when the same song is already restricted, restored, or deleted. The preferred behavior is a no-op on duplicate requests and a single authoritative persisted state for conflicting actions, but this policy remains a proposal pending product confirmation.
- **FR-019**: The system MUST not define or invent storage, delete mechanism, or implementation technology beyond the project’s current documentation; any exact persistence semantics must be decided in design or implementation after an explicit product decision.
- **FR-020**: The system MUST not add report-management, abuse-triage, AI review, notification flows, or full admin audit trail behavior unless those flows are explicitly defined by an approved source document.
- **FR-021**: The system MUST remove a song from newly loaded search, recommendations, public browse, and public artist-profile results after a successful restrict or delete action. It MUST NOT reveal the item as public in those contexts after the state change.
- **FR-022**: The system MUST treat existing playlist and queue entries containing the song as unavailable after a successful restrict or delete action. Those entries MUST not trigger a new play attempt, and the queue MUST skip the item. UI state already cached before refresh may remain stale temporarily, but new playback requests MUST be denied.
- **FR-023**: The system MUST allow an already-started playback to continue until completion, but MUST prevent replay, repeat, or a new play attempt for the same song once it becomes unavailable. A restored song may become playable again only if the Artist remains publicly visible and the song has not been deleted.
- **FR-024**: The system MUST allow a valid artist-owner with active access to view their own restricted song in Artist Studio. The view MUST include the song metadata relevant to ownership and moderation, the current restricted state, and the restriction reason, but MUST NOT expose any private information about the Admin who applied the restriction. Other users may not access the non-public content through Studio or public UI.
- **FR-025**: The system MUST prevent an artist-owner from playing, self-unrestricting, or republishing a restricted song to bypass the admin moderation decision. The artist may only regain visibility if the product's valid restore path is satisfied, including a valid admin restore and the absence of any higher-priority visibility restriction. This rule applies only to restricted songs and does not create a default review or restore workflow for deleted songs.
- **FR-026**: The system MUST provide clear moderation list behavior: the list includes non-deleted songs with public, artist-hidden, and admin-restricted states distinguished; search is case-insensitive and trims whitespace; title and artist substring matching uses AND semantics with filter criteria; the default filter includes both restricted and unrestricted songs; sorting is newest upload first, then ascending `song_id`; results are paged at 20; changing a search or filter resets the page to 1; empty results show a valid empty state.
- **FR-027**: The system MUST handle repeated or conflicting moderation actions consistently: restricted-if-already-restricted and unrestrict-if-not-restricted are no-ops with no state or reason overwrite; delete of a missing song returns not-found with no side effect; valid opposing requests are resolved in system order; the last successful action decides persisted state; failed actions do not mutate saved state; and a deleted song cannot be restored through 112.
- **FR-028**: The system MUST provide a clear distinction between an intentionally restricted song, a removed song, and a missing or unavailable song so that the admin experience remains accurate and does not imply a false state.

### Key Entities

- **Admin Account**: An authenticated user with the `admin` role and a valid session authorized to review and manage songs in the moderation scope.
- **Song Record**: A music item identified by a unique `song_id`, related to an artist or uploader, and associated with a current public, private, hidden, restricted, or deleted state as defined by the system.
- **Owner / Artist Context**: The identity needed to attribute the song to its creator or managing artist, used only for moderation review and not as a general-purpose user-profile disclosure.
- **Rights and Source Metadata**: Optional information already available in the project source set about the song's source, rights, license, or attribution data. Its presence is not guaranteed.
- **Moderation State**: The admin-facing state of a song as it relates to public visibility and enforcement: public, restricted/hidden, deleted/removed, or unavailable/missing.
- **Moderation Action**: A valid admin action that restricts, restores, or removes a song; the exact reason requirement and persistence semantics remain design-level decisions unless approved by the product.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Valid authenticated admins can access the song moderation list and inspect the minimum required song and ownership context without exposing unrelated personal or secret data.
- **SC-002**: Valid authenticated admins can restrict, restore, or remove a song within the approved moderation scope, and the resulting state is consistent and does not contradict itself.
- **SC-003**: Invalid auth, insufficient role, expired session, missing song, invalid input, and backend failures all produce the correct result without exposing restricted content or false success.
- **SC-004**: The moderation feature remains within the Group 110 admin boundary and does not fuse in user-account bans, platform statistics, or artist upload management.
- **SC-005**: Empty results and missing data are handled as legitimate outcomes; they are not treated as misleading system errors.
- **SC-006**: Moderation actions do not rely on frontend-only checks; enforcement occurs on the server, and the preferred repeated/conflicting-action behavior is to avoid contradictory state, but the exact concurrency policy remains under product review.

## Assumptions

- The current project documents support an admin moderation feature for songs but do not fully define the editable fields, reason requirements, restoration semantics, or default moderation-list query behavior.
- The admin song endpoints in the API contract are the current source of truth for the existence of `GET /admin/songs`, `PUT /admin/songs/:id`, and `DELETE /admin/songs/:id`.
- The feature depends on the existing auth, role, and ownership checks already described in the project docs and must not assume a different security model.
- The project does not define a separate pre-approval workflow for upload or a new moderation queue beyond the admin list endpoints.
- This feature does not assume comment moderation, album moderation, playlist moderation, AI moderation, or user report processing unless a later source document explicitly approves those behaviors.
- The exact difference between artist self-hide and admin restriction is not defined in the current source set; this remains an explicit product decision.
- The exact semantics of restoring a restricted song to public visibility and the resulting propagation to browse/search/recommendation states are not fully defined; that behavior must be confirmed before implementation is treated as final.
- A deletion action is currently represented in the API contract, but the exact hard-delete vs. soft-delete semantics and any confirmation requirement remain open product/design decisions.
- The database and API documents do not specify a complete admin-editable field contract, so the feature does not assume an unrestricted admin song-edit workflow.
- The source documents do not define exact list filters, sorting, or pagination for the admin moderation queue, so this draft does not invent them.
- This draft intentionally keeps the feature narrow to moderation of songs within the current project scope and does not add unrelated platform-policy features.

## Out of Scope

- User account banning or unbanning.
- Platform statistics and dashboards.
- Artist upload management, track submission, or artist-owned edit flows outside admin moderation.
- Comment moderation, album moderation, or playlist moderation unless a separate approved feature defines it.
- Report-complaint workflow, AI content review, notifications, or full admin audit logs.
- Defining database or storage technology, hard-delete vs. soft-delete implementation, or exact schema updates beyond the current source evidence.
- A duplicate pre-submission review workflow that is not defined by the upload or artist-track specs.
