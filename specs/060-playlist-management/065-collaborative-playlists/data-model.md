# Data Model: Collaborative Playlists

**Feature**: [065 Collaborative Playlists](./spec.md)

## Playlist collaboration state

| Field | Meaning / constraints |
|---|---|
| `playlist_id` | Existing playlist identity. |
| `is_collaborative` | Spec requires boolean; absent from reference ER and requires migration approval. |
| `status` | Existing Public/Private state. Collaborative visibility transition must be specified so `status` and collaboration state cannot conflict. |

## PlaylistSharedUser

| Field | Meaning / constraints |
|---|---|
| `playlist_id` | Shared playlist identity. |
| `shared_with_user_id` | Registered invited collaborator identity; unique with playlist ID. |
| `role` | Owner/Collaborator appears in spec entity, but owner-row versus derived owner is unresolved. |
| `joined_at` | Membership timestamp in spec entity; actual schema must be verified. |

## PlaylistSong contributor

`added_by_user_id` records who added a track; field is required by FR-065-05 but absent from reference ER. Coordinate with 062 before schema changes. Tracks remain after collaboration is disabled or a member is revoked.

## Authorization

- Owner: manage collaboration, invite/revoke, edit metadata, delete, and edit tracks.
- Active collaborator: add/remove/reorder tracks only.
- Non-member: public read only; no mutations.
- Revoked member: no subsequent edits; server checks current membership for each mutation.
