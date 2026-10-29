# Feature Specification: Artist Track Management

**Feature Branch**: `093-artist-track-management-spec`
**Created**: 2026-10-29  
**Status**: Draft — Source-confirmation required for upload policy and lifecycle decisions  
**Input**: User description: "Authenticated artists can upload and manage their own songs within the scope approved by the project documents."

## Clarifications

### Session 2026-10-29

- Q: What happens when an artist uploads a valid track?  
  A: Confirmed in this session: a valid track upload that passes the final validation checks is immediately published and visible in the public-facing catalogue under the existing public-content rules. No Admin approval is required before publication. The track must appear in the artist's studio as `Published` and may appear in the public-facing content flows that are already allowed by current AuraTune visibility rules.

- Q: What rights do Admin and banned accounts have for track ownership and management?  
  A: The reviewed sources define Admin as a platform-level role and banned accounts as restricted, but they do not grant Admin or banned accounts ownership over artist content. This feature treats only authenticated, non-banned artist owners as eligible managers for their own tracks. It does not grant Admin or banned accounts access to content management outside the documented platform-admin scope.

- Q: If an Admin later restricts a published track, can the artist restore it via feature 093?  
  A: No. A restriction or moderation decision made by Admin is outside the artist-owner workflow in this feature. The artist may hide or republish only their own track under normal artist ownership, but they cannot override an Admin restriction or re-enable public visibility after an Admin restriction. Only the Group 110 admin workflow may remove or reverse that restriction.

- Q: What exact metadata and validation rules are required for a track upload?  
  A: Confirmed in this session: a valid upload requires a valid MP3 file up to 50 MB (50,000,000 bytes), a non-empty song title, genre, rights/source information, license/distribution rights and attribution details when required, and an explicit artist-distribution confirmation. The owner is determined from the authenticated account; no user may assign a track to another artist. Duration is derived from the valid audio file, not entered manually. Album is optional, and cover art/lyrics remain optional. The file must be a valid readable MP3, not merely a renamed `.mp3` file. Empty, corrupt, malformed, or oversized files must be rejected without creating a public record.

- Q: What is the required format for source rights, license/distribution information, and attribution?  
  A: Confirmed in this session: these are business-level fields, not a DB/API schema decision. The system requires free-form text input for source rights and license/distribution details; no normalized structure is imposed by this feature. Attribution is a separate field and is required only when the license or stated rights conditions require it; if no attribution is required, the field may be left blank. This requirement applies to the product workflow only and does not determine database columns, API payload shape, or file-storage structure.

- Q: Can an artist replace an already-published audio file after upload?  
  A: Confirmed in this session: no. Once a track is published, the artist may not replace the audio file for that published track through feature 093. The artist may still edit non-file metadata, hide or restore visibility, or delete the track as permitted by the ownership rules, but the original published audio file remains the canonical version unless a separate future business decision or admin workflow explicitly allows a replacement. This is a product-level business rule and does not prescribe technical storage or API structure.

- Q: When a track is hidden or deleted, may it remain visible through search, recommendation, public browse, playlist, or queue results?  
  A: Confirmed in this session: after a successful hide or delete, the track must not appear in newly loaded search, recommendation, public browse, or public artist-profile results. In already-loaded playlist or queue data, the track is treated as unavailable: it cannot be started as a new play, and queue logic must skip it. Existing cached UI data may remain until reload, but any new playback attempt must be rejected with a suitable unavailable message. A playback already started before the hide/delete may continue to completion; no replay, repeat, or new playback start is allowed for the unavailable track. A track hidden by the artist may become available again when restored to public status if no Admin restriction is active; a deleted track is not restorable in feature 093. These rules apply to listeners; the owning artist still sees their own hidden tracks in the Artist Studio under ownership rights. Storage, physical deletion, and cleanup are not specified by this feature.

- Q: What rights do banned accounts or restricted accounts have to upload and manage tracks?  
  A: Source-backed and not deferred: the reviewed API contract and security guidance define a `USER_BANNED` / `403 FORBIDDEN` state and the feature spec treats a banned account as not eligible to manage or upload tracks. A banned account must not create, edit, hide, restore, or delete artist-owned tracks under feature 093. The artist-owner workflow is restricted to authenticated, non-banned artists only.

- Q: What can an artist do if an Admin restricts a track?  
  A: Source-backed and not deferred: the artist cannot override an Admin restriction through feature 093. A restricted track remains under the Admin moderation workflow. The artist may manage only their own track in normal ownership flows, but cannot restore public visibility after an Admin restriction without the Group 110 admin workflow.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review personal managed tracks (Priority: P1)

As an authenticated artist, I want to view the list of songs I manage so that I can see what I have published and what is currently visible or hidden.

**Why this priority**: The artist's own content list is the primary entry point for track management and is explicitly required by the project scope.

**Independent Test**: Sign in as an artist account with multiple managed tracks, open the list of tracks, and verify that only that artist's own tracks appear.

**Acceptance Scenarios**:

1. **Given** an authenticated artist with one or more tracks they own, **When** they open their managed-track list, **Then** the system shows only tracks associated with that artist and not tracks owned by other artists.
2. **Given** an artist with no managed tracks, **When** they open the managed-track list, **Then** the system shows a clear empty state and does not suggest that tracks exist.
3. **Given** an artist tries to open a list of another artist's tracks, **When** the request is evaluated, **Then** the system denies access and does not expose the other artist's track list.

---

### User Story 2 - Upload a new track (Priority: P1)

As an authenticated artist, I want to upload a new audio file and the required track information so that I can publish my work to AuraTune within the project-approved distribution scope.

**Why this priority**: Track upload is the core capability of this feature and the direct channel by which an artist adds content to the platform.

**Independent Test**: Sign in as an artist, submit a valid MP3 file up to 50 MB, provide the required upload metadata, and verify that the track is recorded as a managed track for the authenticated artist and immediately appears as published when the upload succeeds.

**Acceptance Scenarios**:

1. **Given** an authenticated artist with a valid upload request, **When** the track is submitted and passes all validation checks, **Then** the system creates a new managed track associated with that artist and shows the track as `Published` in the artist studio, with the track allowed to appear in the current public-facing catalogue rules.
2. **Given** the uploaded file is not a valid MP3 file, is empty, corrupt, malformed, or exceeds 50 MB, **When** the artist submits the request, **Then** the system rejects the upload with a clear validation error and does not create a partial track record or a public track.
3. **Given** the uploaded file has a valid MP3 structure but the metadata is missing or blank required values, **When** the artist submits the request, **Then** the system rejects the upload and does not create a track record or a public track.
4. **Given** the artist submits a track with metadata that identifies a different artist or a request that attempts to assign ownership outside the authenticated account, **When** the request is evaluated, **Then** the system rejects the request and does not assign ownership to any other artist record.
5. **Given** the audio storage service is temporarily unavailable, **When** the upload is attempted, **Then** the system communicates the failure without creating a misleading successful result or a public record.
6. **Given** the user session is expired or the user is unauthenticated, **When** upload is attempted, **Then** the system requires re-authentication and does not create or update track records.

---

### User Story 3 - Edit track information (Priority: P1)

As an authenticated artist, I want to update the information on my own track so that I can correct metadata and reflect the current state of the work.

**Why this priority**: Editing is required to keep artist-managed content accurate and aligned with the artist's ownership.

**Independent Test**: Select an existing track owned by the signed-in artist, update one or more editable fields, and verify that the updated values are saved only for that artist's track.

**Acceptance Scenarios**:

1. **Given** an authenticated artist owns a track, **When** they submit a valid edit request for that track, **Then** the system updates the track and stores the new values for that artist's record.
2. **Given** the artist edits a track that belongs to another artist, **When** the edit is evaluated, **Then** the system denies the request and does not modify the other artist's track.
3. **Given** the edit payload is invalid, **When** the artist submits it, **Then** the system rejects the update and preserves the last valid version of the track.
4. **Given** the track metadata is missing required valid values or the request cannot be processed, **When** the artist submits the edit, **Then** the system displays a clear failure state without corrupting or partially updating the track record.
5. **Given** an authenticated artist owns a published track, **When** they attempt to upload a different audio file for the same track in place of the published file, **Then** the system rejects the replacement request and preserves the original published audio file without creating a second or conflicting primary file.
6. **Given** a listener has a public track in newly loaded search, recommendation, or public-profile results, **When** the owning artist successfully hides or deletes the track, **Then** the later reload does not include that track in those results and the track is treated as unavailable for any new playback or queue start.
7. **Given** a listener has an older cached playlist or queue containing a hidden or deleted track, **When** the queue logic attempts to start that item or advance to the next item, **Then** the unavailable track is skipped and the listener is prevented from starting a new playback of that item until the queue or page is refreshed with valid data.
8. **Given** a listener's existing playback of a track has already started before the track is hidden or deleted, **When** the playback reaches completion, **Then** the current play may finish naturally without replay, repeat, or a new start for the same unavailable track.
9. **Given** the owning artist has hidden a track and later restores it to public status without an Admin restriction, **When** the track is re-opened in public flows, **Then** the track returns to public availability and new playback is allowed again.
10. **Given** a track has been deleted by the owner, **When** the artist or listener attempts to restore it through feature 093, **Then** restoration is rejected and the deleted track remains unavailable in the public-facing flows.
11. **Given** a listener attempts to start a hidden or deleted track that is already in a cached queue or playlist, **When** the player evaluates playback eligibility, **Then** it denies the new playback request and shows a truthful unavailable message without starting the stream.

---

### User Story 4 - Hide and restore track visibility (Priority: P1)

As an authenticated artist, I want to hide a track and restore it to public visibility when needed so that I can control what is shown to listeners while retaining ownership of the content.

**Why this priority**: Public visibility is a core management decision in the artist studio, and the project scope explicitly includes hiding and making content public again.

**Independent Test**: View a managed track under one artist account, hide it, confirm the visibility change, then restore it and confirm visibility returns without changing ownership or affecting another artist's track. Also verify that an Admin-restricted track cannot be restored via the artist workflow.

**Acceptance Scenarios**:

1. **Given** an authenticated artist owns a track, **When** the artist hides it, **Then** the system stores that track in a hidden state for that artist and does not expose the hidden track as active content to the public via the artist-managed view or public content flows that depend on active visibility.
2. **Given** an artist hides a track, **When** they later restore it, **Then** the track returns to an active visible state and the system reflects the restored status for that track.
3. **Given** a track is hidden or restored for one artist, **When** the system evaluates a request for another artist's track, **Then** no other artist's track state is changed.
4. **Given** an Admin has restricted a track because of a platform moderation decision, **When** the artist attempts to restore it through the artist-owning workflow, **Then** the system denies the action and the artist cannot override the Admin restriction through feature 093.
5. **Given** a hidden track is not permitted to be shown for public display, **When** the artist opens their own managed list, **Then** the system shows the hidden state clearly, without revealing or inventing other users' or artists' track data.

---

### User Story 5 - Delete a track with confirmation (Priority: P1)

As an authenticated artist, I want to delete one of my own tracks with a clear confirmation step so that I can remove content when it is no longer valid to distribute or keep.

**Why this priority**: Deletion is part of the project's expected artist studio actions and must be controlled by owner identity and a deliberate user confirmation.

**Independent Test**: Choose a track the artist owns, initiate deletion, confirm the action, and verify the track is no longer available in the artist's managed list and no longer active for the artist's own track operations.

**Acceptance Scenarios**:

1. **Given** an authenticated artist owns a track, **When** they choose to delete it and confirm the action, **Then** the system removes the track from the artist's managed list and does not preserve it as an active managed record.
2. **Given** the delete action is cancelled or rejected, **When** the request is evaluated, **Then** the track remains unchanged and the artist receives a clear non-success outcome.
3. **Given** an artist attempts to delete a track they do not own, **When** the request is evaluated, **Then** the system denies the request and no other artist's track is modified.
4. **Given** a track was deleted successfully, **When** the artist later requests a track list or track details for that record, **Then** the system treats it as unavailable and does not disclose private data that belongs to another account or a different track state.

---

### User Story 6 - Enforce artist ownership and access boundaries (Priority: P1)

As an authenticated artist, I want every track action to be checked against my identity and ownership so that I cannot modify or view another artist's content.

**Why this priority**: Ownership enforcement is the key security boundary for artist-managed content and is explicitly required by the project sources.

**Independent Test**: Authenticate as artist A and attempt to edit, hide, restore, or delete artist B's track; verify all attempts are denied.

**Acceptance Scenarios**:

1. **Given** an authenticated artist is not the owner of a track, **When** they request any managed-track action on that track, **Then** the system denies the action and returns a clear authorization failure.
2. **Given** an authenticated artist is the owner of a track, **When** they request a valid action on that track, **Then** the system executes the action within their own scope and does not affect other artists' data.
3. **Given** an unauthenticated user or a session that has expired, **When** they request artist track management, **Then** the system requires sign-in again and does not expose or change track data.
4. **Given** a banned account attempts to manage tracks, **When** the request is evaluated, **Then** the system rejects the action according to the applicable security policy and does not expose private track data.

---

### User Story 7 - Handle invalid data and service issues (Priority: P1)

As an authenticated artist, I want the system to reject invalid uploads and failed operations cleanly so that I understand what happened without risking partial or misleading track state.

**Why this priority**: Invalid submissions and storage failures are straightforward failure cases that must not create fake success states or partial records.

**Independent Test**: Submit bad metadata, an invalid audio file type, oversized content, and a storage outage; verify that each operation shows a truthful failure and leaves existing valid data unchanged.

**Acceptance Scenarios**:

1. **Given** an invalid audio file or unsupported format, **When** upload is attempted, **Then** the system rejects the upload and does not create a track record.
2. **Given** an oversized file or unacceptable metadata payload, **When** upload is attempted, **Then** the system rejects the data and provides a precise validation message.
3. **Given** the storage service is unavailable, **When** upload or delete is attempted, **Then** the system communicates the temporary failure and preserves the current valid state.
4. **Given** the request payload is syntactically invalid or incomplete, **When** the system evaluates the request, **Then** the system returns a validation error and does not partially update a record.

### Edge Cases

- A track belongs to an artist who is no longer active or whose account is disabled; access must remain bounded by ownership and session validity, and no external artist's records may be exposed.
- A track upload is attempted with missing metadata, invalid audio, or unsupported file content; the system must reject the submission without leaving a partial track record or creating a public track.
- A published track is later restricted by Admin; the artist may not override that restriction through feature 093 and must not be able to set the track back to public by using the artist-owner hide/restore workflow.
- The artist edits a track while the underlying storage or media service is failing; the system must not claim success if the update did not persist.
- A track is hidden and then restored within the same session; the final visible state must reflect the last successful action and no stale state may be shown as confirmed.
- An artist deletes a track and the user cancels the confirmation; the record must remain unchanged.
- A valid request is submitted by an authenticated artist with an expired session; no action may be treated as successful unless the session is valid and ownership is verified.
- One track request fails while another track request succeeds; state changes must remain isolated to the track under the valid request.
- The same track is referenced by more than one artist-owned collection or profile entry; the system must not duplicate content or assume ownership beyond the authenticated artist's direct record.
- A request includes cross-account identifiers or manipulated ownership signals; authorization checks must reject it before any state change.
- The project sources do not define final schema-level fields for cover art or lyrics, nor a replacement-file policy; these remain open implementation decisions and are excluded from this feature's behavior requirements.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow an authenticated artist to view the list of tracks they manage and to identify their own track records without exposing other artists' data.
- **FR-002**: The system MUST restrict each track-management action to the authenticated artist's own managed tracks and MUST deny any request that targets a track owned by a different artist.
- **FR-003**: The system MUST allow an authenticated artist to submit a new track upload for their own artist identity, subject to the upload validation policy defined by the final implementation contract and the confirmed decision recorded in this session.
- **FR-003A**: A valid upload request that passes validation MUST create a new managed track in the `Published` state immediately, without requiring an Admin approval step before the track becomes public under the existing public-content rules.
- **FR-003B**: The upload MUST reject files that are empty, malformed, unreadable, not valid MP3 data, or greater than 50 MB (50,000,000 bytes), and MUST not create a public track record on failure.
- **FR-003C**: The upload MUST require the authenticated account to be the owner of the track being uploaded; the system MUST NOT allow a user to assign or upload a track under a different artist identity.
- **FR-003D**: The upload MUST require a non-empty song title, genre, free-form rights/source information, free-form license/distribution information, and a separate attribution entry only when the stated rights or license requires attribution; if attribution is not required, the field may be left blank. The feature MUST treat these as business requirements only and MUST NOT decide database columns, API payload shapes, or storage structure.
- **FR-003E**: The track duration MUST be read from the valid audio file itself and MUST NOT be manually entered by the artist.
- **FR-003F**: Album, cover art, and lyrics are optional; they are not required for a valid upload.
- **FR-004**: The system MUST reject invalid upload payloads, invalid audio files, unsupported file types, oversized files, blank required metadata, or unauthorized ownership assignments without creating a partial or misleading track record or a public track.
- **FR-005**: The system MUST allow only valid uploaded tracks to be stored as managed records; temporary storage or media-service failures MUST be reported as failed operations without claiming success.
- **FR-006**: The system MUST allow an authenticated artist to edit the information of a track they own and MUST preserve the last valid saved version if validation fails or the request is otherwise rejected.
- **FR-006A**: A published track MUST NOT be replaced by uploading a different audio file through feature 093. The original published audio file remains the canonical file for that track unless a separate future business rule or admin workflow explicitly allows replacement.
- **FR-007**: The system MUST allow an authenticated artist to hide a track they own and to restore it to a visible state later without changing ownership or affecting other artists' track records, provided the track is not restricted by an Admin moderation decision.
- **FR-007A**: If an Admin has restricted a track through the Group 110 moderation workflow, the artist MUST NOT be able to restore public visibility through feature 093; the Admin restriction remains authoritative until the Admin workflow reverses or removes it.
- **FR-007B**: After a successful hide or delete, the track MUST not appear in newly loaded search, recommendation, public browse, or public artist-profile results. In playlist or queue data already loaded, the track is treated as unavailable and cannot be started as a new playback; queue logic must skip the unavailable track. Cached UI data may remain until refresh, but any new playback request against the unavailable track MUST be denied with a clear unavailable message. Existing plays already started before the hide/delete may continue to completion, but the user MUST NOT be able to replay, repeat, or start a new playback of the same unavailable track.
- **FR-007C**: A track hidden by its artist MAY become publicly available again when the artist restores it and no Admin restriction is active. A deleted track must not be restored in feature 093 and must remain unavailable in public-facing flows unless a separate admin or future product workflow explicitly supports restoration.
- **FR-008**: The system MUST allow an authenticated artist to delete a track they own only after an explicit confirmation step and MUST reject the action when confirmation is not provided or the request is unauthorized.
- **FR-009**: The system MUST provide a clear, truthful user-facing outcome when an upload, edit, hide, restore, or delete attempt fails because of invalid data, storage issues, validation errors, an expired session, or authorization checks.
- **FR-010**: The system MUST require a valid authenticated artist session for track upload, tracking, editing, hide/restore, and deletion. Unauthenticated, expired-session, banned, or unauthorized requests MUST be denied without creation or modification of track data.
- **FR-011**: The system MUST not allow a non-owner artist, Admin, or banned account to manage a track they do not own or do not have permission to manage, and MUST not expose another artist's track list or track details.
- **FR-012**: The system MUST ensure the delete, hide, and restore operations are applied to the correct track record and cannot affect another artist's track or unrelated content.
- **FR-013**: The system MUST maintain viewability state separately from ownership and MUST clearly distinguish a hidden track from a deleted track within the artist-managed workflow, without expanding the feature into a full album or moderation system.
- **FR-014**: The system MUST comply with the project's approved distribution boundary: artist-managed tracks must only be uploaded and managed when the content is within the legal and project-approved scope described in the proposal and team documents; unsupported or unclear rights must be rejected or flagged by the final content policy before publication.
- **FR-015**: This feature MUST not redefine public artist profile behavior, follow behavior, or admin moderation workflows outside the artist's own content management. It also MUST not expand into full album management, playlist management, or Group 110 moderation workflows.
- **FR-016**: This feature MUST not assume a specific storage provider, database schema, physical-delete strategy, or background synchronization mechanism beyond the requirement that the system keeps artist ownership and state changes correct and truthful.

### Key Entities

- **Artist Account**: An authenticated account that is recognized as an artist and is eligible to manage tracks it owns.
- **Managed Track**: A musical recording record associated with an artist, including its managed-state metadata and current visibility status.
- **Upload Request**: The transaction used to add a new track to the artist's owned catalog; it includes the file and any metadata defined by the final implementation contract.
- **Track Visibility State**: The current state of a track in the artist studio, including active, hidden, and deleted/unavailable as appropriate to the final lifecycle rules.
- **Authorization Result**: The outcome of the ownership and session checks governing whether the artist may view, edit, hide, restore, or delete the track.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For every artist-owned track-management acceptance test, only the authenticated owner may view, edit, hide, restore, or delete the track; cross-artist actions are denied in 100% of tested cases.
- **SC-002**: For 100% of valid artist upload attempts, the system creates the track as an owned record only when the request is valid and authorized; invalid or unauthorized requests result in failure without partial success.
- **SC-003**: For 100% of tested validation and storage-failure scenarios, the system presents a truthful error or rejection message and does not claim success for an unsuccessful action.
- **SC-004**: For 100% of successful hide and restore cases, the visible state of the artist-owned track changes only according to the last confirmed action and the system does not alter other artists' records.
- **SC-005**: For 100% of successful delete flows, the system requires explicit confirmation and removes the track from the artist's managed list only after the confirmed action.
- **SC-006**: For 100% of unauthenticated, expired-session, banned, or non-owner attempts, the system denies access without exposing the targeted track data or modifying the record.
- **SC-007**: The managed-track list remains usable as a truthful owned content dashboard: empty states are shown for artists with no records, while valid records remain visible for the owning artist.
- **SC-008**: The feature stays within the documented scope boundaries and does not redefine public artist profile access, follow logic, album management, admin moderation, or other feature groups.

## Assumptions

- This feature is attached to the Artist Profile & Studio scope defined by the proposal and team assignment, and it depends on existing artist identity and authentication flows.
- This feature is limited to the owner-managed content lifecycle of a track and does not define album management, playlist management, or admin moderation capabilities.
- The system uses a valid authenticated artist session and ownership check for each track action; the exact backend enforcement logic is outside the source documents and remains a technical implementation decision.
- The project proposal and team documentation require legal and project-approved distribution scope for uploaded music, but they do not define the final media-rights policy or an upload review workflow.
- The reviewed sources do not identify final field names, file constraints, default visibility, replacement policy, or deletion semantics beyond the required artist-owned actions. These remain open decisions and are documented in the Clarifications section rather than being invented here.
- A track can be hidden, restored, or deleted only as an artist-managed content action; this feature does not create or redefine a separate admin moderation workflow.

## Dependencies

- Existing authentication and artist role checks must be available to scope access by the current signed-in artist.
- Artist identity and artist-owned track records must be available for the managed-track list and ownership checks.
- Existing public-content visibility rules must remain consistent with the artist profile and any public browse flows, without redefining them in this feature.
- Media storage and upload processing must be available for valid track files, but the source documents do not specify a provider or implementation approach.

## Out of Scope

- Public artist profile details or follow/unfollow behavior from feature 091 and feature 092.
- Full album CRUD and album-level management.
- Group 110 admin moderation workflows or approval systems.
- A full catalog review or content-moderation pipeline.
- Defining storage technology, physical-delete mechanics, or technical migration strategies.
- Inventing required upload metadata, file size limits, MIME validation policy, replacement semantics, auto-publication rules, or approval policies when the reviewed sources do not specify them.
