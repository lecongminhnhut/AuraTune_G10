# Collaborative Playlist API Contract (Draft)

**Feature**: [065 Collaborative Playlists](../spec.md)
**Shared conventions**: [API Contract](../../../../docs/analysis-and-design/api-contract.md), [API conventions](../../../../docs/design/api/api-conventions.md)

## Confirmed Permission Contract

| Caller | Read collaborative playlist | Edit tracks | Metadata/delete | Manage collaborators |
|---|---|---|---|---|
| Public/non-member | Yes | No | No | No |
| Active collaborator | Yes | Yes | No | No |
| Owner | Yes | Yes | Yes | Yes |

Every mutation checks current server-side membership. Revocation takes effect on subsequent requests. Disable collaboration revokes collaborator access and keeps contributed tracks.

## Implemented Endpoint Boundary

- `PUT /playlists/:id/collaboration` accepts `{ "enabled": boolean }`. Enabling makes the playlist public; disabling makes it private and revokes collaborator memberships while preserving tracks.
- `POST /playlists/:id/collaborators` accepts `{ "email": "..." }`, requires an existing account and grants immediate access. Duplicate invitation is idempotent.
- `DELETE /playlists/:id/collaborators/:userId` revokes membership. `GET /playlists/:id` returns a collaborator roster; emails are visible only to the owner.
- Owner identity is derived from `user_id_creator`; `playlist_shared_users` rows store collaborators and `joined_at`.
- `playlist_songs.added_by_user_id` records track contribution. Playlist detail polls every 10 seconds; authorization is always rechecked by the backend on mutations.
