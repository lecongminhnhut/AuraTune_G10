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

## Playlist Bookmark (Approval Required)

Spec requires a user-to-public-playlist read-only reference. The reference ER has no corresponding entity. Relationship key, timestamps, uniqueness, deleted target behavior, and persistence mechanism require approval; do not conflate this with collaborator membership.

## Access and State Rules

- Owner can read private/public playlist and update/delete it.
- Any visitor may read a public playlist; only authenticated users can bookmark it.
- A bookmark grants no edit permission and resolves current owner data on read.
- Delete is permanent after confirmation; dependent row behavior follows approved FK/migration rules.
- Concurrent metadata writes use last-write-wins as clarified in `spec.md`.
