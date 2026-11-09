# Research: Playlist Song Management

**Feature**: [062 Playlist Song Management](./spec.md)
**Date**: 2026-11-09

## Specification Source Selection

`spec.md` contains a primary Spec Kit requirements section followed by a reconstructed UI/context section with different user-story grouping. Planning and task traceability use the primary `User Scenarios & Testing` and `Functional Requirements` at the top. The later section is used only as UI context; it does not add a separate view-tracklist scope to this feature.

## Findings and Decisions

### Membership and ordering
- **Finding**: Reference schema defines `playlist_songs` with composite `(playlist_id,song_id)` key and `added_at`, but does not show position. Data consistency notes explicitly call out ordering and concurrent edits as unresolved.
- **Decision**: Keep membership duplicate-safe; ordering representation and concurrent reorder policy require schema/owner approval before implementation.

### Liked Songs and aggregates
- **Finding**: `user_liked_songs` has a composite user/song key. The spec also describes a Liked Songs playlist; the reference schema does not define its canonical playlist representation or aggregate columns.
- **Decision**: Treat liked status as the user/song relation; align presentation and playlist projection with the actual implementation before adding duplicate storage. Determine whether count/duration are derived or persisted and update consistently.

### Authorization and integration
- **Finding**: Security guidance requires server-side ownership checks. Feature 065 defines active collaborators as authorized to add/remove/reorder, while metadata/member administration stays owner-only.
- **Decision**: Reuse one backend authorization rule shared with 065; do not trust UI visibility. Follow API nested-resource naming and shared JSON envelope.

### Existing implementation
- **Finding**: Track menu, song rows, playlist detail, and AppStore exist as UI/prototype code. Actual playlist backend operations are not established by the prototype.
- **Decision**: Preserve component conventions and connect through existing backend/data layers after checking signatures. No Firestore assumption.

## Approval Gates

- Approve position/order representation and conflict policy with 065.
- Confirm `added_by_user_id` representation for collaborative tracks with 065.
- Confirm aggregate fields/calculation and Liked Songs projection against migrations and 061.
- Define exact API routes, batch semantics, duplicate response, and status/error mapping.
