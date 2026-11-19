# Playlist CRUD API Contract (Draft)

**Feature**: [061 Playlist CRUD](../spec.md)
**Shared conventions**: [API Contract](../../../../docs/analysis-and-design/api-contract.md), [API conventions](../../../../docs/design/api/api-conventions.md)

## Confirmed Behavior

- API root is `/api/v1`; ordinary JSON uses `{success,message,data,error}`.
- Create/list/bookmark require authenticated user. Public playlist detail may be anonymous. Private detail, update, and delete require owner access.
- Validation: name required and max 80 characters; description max 300; new status defaults private.
- Delete is permanent after client confirmation. Bookmark is a read-only reference.

## Implemented Endpoints

- `GET /users/me/playlists`, `POST /playlists`, `GET /playlists/:id`, `PUT /playlists/:id`, `DELETE /playlists/:id`.
- `PUT /playlists/:id/bookmark` stores a duplicate-safe read-only reference; no unbookmark operation is exposed per Q-060-03.
- Responses use the shared JSON envelope. Private playlist reads return `404` to non-members; owner-only writes return `403` to other authenticated users.
- PostgreSQL migration `003_playlist_management.sql` uses `playlists.id`, `user_id_creator`, a private default and a cover key. Delete cascades playlist-owned memberships and references.
