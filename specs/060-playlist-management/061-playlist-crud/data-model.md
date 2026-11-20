# Data Model: Playlist CRUD

**Feature**: [061 Playlist CRUD](./spec.md)

## Playlist

| Field | Meaning / constraints |
|---|---|
| `playlist_id` | Unique playlist identity; exact DB type follows deployed schema. |
| `user_id_creator` | Creator/owner identity; required by feature behavior. |
| `name` | Required; 1–80 characters. Duplicate names are allowed. |
| `description` | Optional; maximum 300 characters. |
| `cover_url` | Optional supplied cover URL; use an approved default cover when absent. Upload/storage is outside this feature. |
| `status` | `Private` or `Public`; defaults to `Private`. |
| track count / total duration | Detail-view aggregates; source and storage strategy must match actual schema and 062 membership operations. |

## Playlist Bookmark

`playlist_bookmarks(user_id, playlist_id, created_at)` is a separate read-only reference with a composite primary key. It points to the source playlist, so owner changes are reflected on the next read. Deleting the playlist cascades its bookmarks. Per Q-060-03, this feature exposes save/bookmark only; unfollow is out of scope.

## Access and State Rules

- Owner can read private/public playlist and update/delete it.
- Any visitor may read a public playlist; only authenticated users can bookmark it.
- A bookmark grants no edit permission and resolves current owner data on read.
- Delete is permanent after confirmation; song memberships, bookmarks and collaborator memberships cascade, while liked songs and history remain separate.
- Concurrent metadata writes use last-write-wins as clarified in `spec.md`.
