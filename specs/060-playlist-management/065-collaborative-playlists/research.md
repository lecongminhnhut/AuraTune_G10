# Research: Collaborative Playlists

**Feature**: [065 Collaborative Playlists](./spec.md)
**Date**: 2026-11-09

## Specification Source Selection

`spec.md` contains a primary Spec Kit requirements section followed by reconstructed UI notes with differently grouped scenarios. Task phases follow the primary four user stories and FR-065-01..10; the later notes locate prototype components only.

## Findings and Decisions

### Membership and permissions
- **Finding**: Reference schema has `playlist_shared_users(playlist_id, shared_with_user_id)` composite key but no roles, owner row semantics, collaboration flag, or invitation state. Spec says invitation to registered email grants immediate access; only owner manages members/metadata/deletion; collaborators edit tracks.
- **Decision**: Treat membership relation as the source of collaborator access. Agree whether owner is implicit and how role is represented before migration. Verify authorization at backend for every operation.

### Visibility and transitions
- **Finding**: Clarification states collaborative playlists are public to view; non-members remain read-only. Turning collaboration off revokes edit access but preserves tracks. Spec edge case says private playlist can become collaborative.
- **Decision**: Define an atomic visibility/collaboration transition consistent with `status` and `is_collaborative`; do not infer how disabling maps public status back to private without owner decision.

### Track authorship and synchronization
- **Finding**: 065 requires contributor identity but reference `playlist_songs` has no `added_by_user_id`. Schema notes real-time sync may start with refresh/polling; sockets are optional.
- **Decision**: Align contributor field and ordering with 062; use server-authoritative membership and existing refresh approach unless approved otherwise.

## Approval Gates

- Approve collaboration flag/visibility transition, role/owner representation, invited existing-user behavior, and revocation semantics.
- Approve schema fields for collaborator membership and track attribution with 062/database owner.
- Define exact endpoints/payloads and freshness behavior; no socket infrastructure is assumed.
- Check existing auth identity and actual migration/schema before planning persistence implementation.
