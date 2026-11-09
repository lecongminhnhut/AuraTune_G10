# Research: Album Tracklist Playback

**Feature**: 082 — Album Tracklist Playback  
**Date**: 2026-11-09  
**Inputs**: Feature 082 `spec.md` and `plan.md`, project workflow/architecture documents, Group 040 and 050 specifications, current album/player/queue source.

## Findings and decisions

### Tracklist source and display

- **Finding**: The current album page filters `AppStore.publicTracks`, which excludes unavailable tracks. `AppStore.allTracks` retains catalog entries and `isPlayable`/`trackStatus` supplies availability. `SongTable` renders in input order.
- **Decision**: Build the visible list from the complete album track set in catalog order, preserve unavailable tracks with disabled state and a clear existing reason, and filter only when preparing playback sequences. Keep the full list available to actions if row rendering is progressive.
- **Alternatives considered**: Continue using only `publicTracks`; sort by a new position/disc field; omit unavailable items from the UI. Rejected because these conflict with completeness, source ordering, and visibility requirements or introduce unsupported data fields.

### Shared playback integration

- **Finding**: `App.jsx` owns a single `useMockPlayer` instance and exposes actions through `PlayerContext`; `BottomPlayer` and `QueuePanel` read that shared context. `AlbumPage` currently invokes `playCollection` and `addManyToQueue` through it.
- **Decision**: Keep the existing shared player and queue boundary. Add only the feature-required calls/behavior to this integration after confirming the queue and playback owners' contracts. Do not create player state in the album page or a second player.
- **Alternatives considered**: Maintain album-local player state or redesign Group 040/050 components. Rejected because FR-007–FR-009 require integration with existing player/queue behavior and persistent playback.

### Album playback ordering and queue mutation

- **Finding**: The spec clarification calls for inserting remaining album tracks immediately after the current track while retaining the old upcoming queue afterward. FR-004 and an acceptance scenario instead say Play Album replaces the queue. Repeated-play and selected-track rules introduce further segment identity/deduplication requirements.
- **Decision**: Preserve this as a blocking requirements conflict. Implement neither a replacement nor insertion precedence in planning. Once reconciled, sequence construction must retain catalog order, omit unavailable tracks, honor selected-track start position, and follow the approved repeat behavior.
- **Alternatives considered**: Prefer the clarification, prefer FR-004, or merge the two by an inferred queue policy. Rejected because the user/requirements owner has not approved precedence and the existing plan records this conflict as still blocked.

### Queue capacity and bulk add

- **Finding**: Group 050 Feature 052 defines a maximum of 50 queued tracks, with batch additions partially accepted when capacity is reached. Feature 082 requires complete album playback for albums with 100+ tracks and says Add all to queue appends every playable track.
- **Decision**: Respect Group 050's existing 50-item rule as the currently approved shared queue contract. Keep the conflict with Feature 082's complete-sequence outcomes open for requirements-owner reconciliation; do not silently truncate or invent chunked playback.
- **Alternatives considered**: Remove the queue cap, silently truncate, or add an album-specific streaming/chunking queue. Rejected because each changes shared behavior or creates unapproved behavior.

### Availability and playback-time failure

- **Finding**: `App.jsx` rejects currently unavailable tracks and shows a generic message; `useMockPlayer` advances through the queue without re-checking availability. Group 040 Feature 041 requires refusal, feedback, retry/skip on stream failure, but does not define the album-specific continue-to-next-playable behavior required by FR-014.
- **Decision**: Reuse existing playability and generic unavailable feedback for known-unavailable rows. Treat playback-time loss and continuation as blocked on the Group 040 recovery contract/owner; do not invent a callback or skip algorithm here.
- **Alternatives considered**: Add an album-specific recovery handler or automatically skip via new hook behavior. Rejected pending shared player contract approval.

### Persistence and data model

- **Finding**: Group 050 specifies browser-local queue persistence, restored paused after reload; current prototype's `useMockPlayer` queue is React in-memory state and does not persist. Feature 082 uses current track and upcoming queue managed by that shared experience.
- **Decision**: Define no new persistent schema. Route album actions through the existing queue persistence behavior once confirmed/implemented by its owner; represent album sequence as ordinary track references in existing player state.
- **Alternatives considered**: Add album-specific persisted queue records or change queue ownership. Rejected as duplication and outside Feature 082's authorized scope.

### Testing

- **Finding**: Frontend package scripts list Vite `dev`, `build`, and `preview`; no test script is declared. The Group 050 queue rules and Feature 082 acceptance cases provide behavioral oracles, but tests need the repository's runner/fixtures.
- **Decision**: Document scenario-based validation and existing run/build commands; identify the approved test harness before adding executable test commands. Do not add a test dependency in this plan.

## Confirmations required before implementation

1. Requirements owner: reconcile Play Album replacement vs clarified insertion/preservation semantics.
2. Requirements owner and Group 050 owner: reconcile queue capacity 50 with full 100+ track album playback and Add all acceptance criteria.
3. Group 040 owner: identify playback-time unavailability/failure recovery contract required by FR-014.
4. Confirm queue persistence implementation against Group 050's browser-local, paused-on-reload requirement.
5. Confirm repository test runner and fixtures.
