# Data Model: Collaborative Playlists

**Feature**: [065 Collaborative Playlists](./spec.md)

## Playlist collaboration state

| Field | Meaning / constraints |
|---|---|
| `playlist_id` | Existing playlist identity. |
| `is_collaborative` | Boolean default false. Enabling collaboration sets the playlist public; disabling makes it private and removes collaborator memberships. |
| `status` | `Public` or `Private`; collaboration transitions update status and flag together in the owner operation. |

## PlaylistSharedUser

| Field | Meaning / constraints |
|---|---|
| `playlist_id` | Shared playlist identity. |
| `shared_with_user_id` | Registered invited collaborator identity; unique with playlist ID. |
| `role` | Owner is derived from `playlists.user_id_creator`; stored membership rows represent collaborators only. |
| `joined_at` | Timestamp recorded when the collaborator is added. |

## PlaylistSong contributor

`added_by_user_id` records who added a track; field is required by FR-065-05 but absent from reference ER. Coordinate with 062 before schema changes. Tracks remain after collaboration is disabled or a member is revoked.

## Authorization

- Owner: manage collaboration, invite/revoke, edit metadata, delete, and edit tracks.
- Active collaborator: add/remove/reorder tracks only.
- Non-member: public read only; no mutations.
- Revoked member: no subsequent edits; server checks current membership for each mutation.
