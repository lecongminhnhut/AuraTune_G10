# Data Model: Playlist Song Management

**Feature**: [062 Playlist Song Management](./spec.md)

## PlaylistSong

| Field | Meaning / constraints |
|---|---|
| `playlist_id` | Parent playlist identity. |
| `song_id` | Song identity; composite key with playlist prevents duplicate membership. |
| `added_at` | Association creation timestamp in reference schema. |
| `sort_order` | Non-negative integer persisted with a unique `(playlist_id, sort_order)` index. Reorder writes the complete ordered song ID list; later request wins. |
| `added_by_user_id` | Nullable user reference recording the member who added the track; retained as null if that user is deleted. |

## UserLikedSong

| Field | Meaning / constraints |
|---|---|
| `user_id` | Listener identity. |
| `song_id` | Liked song identity; composite key prevents duplicate likes. |
| `created_at` | Like timestamp in reference schema. |

## Invariants and Operations

- A `(playlist_id,song_id)` association exists at most once.
- Membership changes require owner or active collaborator authorization as defined by 065.
- Reorder persists a complete valid playlist ordering. Requests are serialized by the backend operation; concurrent complete-order writes use last-write-wins.
- Count and duration are derived from active song memberships on reads, avoiding stale stored aggregates.
- Like/unlike changes `user_liked_songs` and its library projection consistently; exact Liked Songs playlist representation is unresolved.
