# Data Model: Playlist Song Management

**Feature**: [062 Playlist Song Management](./spec.md)

## PlaylistSong

| Field | Meaning / constraints |
|---|---|
| `playlist_id` | Parent playlist identity. |
| `song_id` | Song identity; composite key with playlist prevents duplicate membership. |
| `added_at` | Association creation timestamp in reference schema. |
| `sort_order` / position | Required by reorder behavior but absent from reference ER; exact column/type/order semantics require approval. |
| `added_by_user_id` | Required to display collaborator attribution by 065; absent from reference ER and requires shared schema approval. |

## UserLikedSong

| Field | Meaning / constraints |
|---|---|
| `user_id` | Listener identity. |
| `song_id` | Liked song identity; composite key prevents duplicate likes. |
| `created_at` | Like timestamp in reference schema. |

## Invariants and Operations

- A `(playlist_id,song_id)` association exists at most once.
- Membership changes require owner or active collaborator authorization as defined by 065.
- Reorder persists a complete valid playlist ordering under the approved conflict policy.
- Count and duration remain consistent with membership; choose derived reads or atomic persisted aggregates after schema review.
- Like/unlike changes `user_liked_songs` and its library projection consistently; exact Liked Songs playlist representation is unresolved.
