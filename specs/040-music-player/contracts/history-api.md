# Contract: Listening History API for the Music Player (Group 040)

Base path: `/api/v1/users/me/history`. Every endpoint requires `Authorization: Bearer <access token>` from the authentication service (Group 010); the user id comes from the token, never from the request body.

Storage: Supabase table `public.listening_history` (`id`, `user_id`, `song_id`, `listened_duration` in seconds, `played_at`), created by `src/database/migrations/007_listening_history.sql`. There is no in-memory fallback: without database credentials the API answers 503.

Errors use the JSON envelope `{ "success": false, "error": "<code>", "message": "<Vietnamese text>" }`.

## When the player calls it

- The player sends `POST` once per listening session, when the session reaches the play threshold: 30 seconds, or half of a short track (041-FR-014).
- It sends `PATCH` with the listened time when the track changes, playback pauses, or the page is hidden (`keepalive`).
- History, Home (recently played) and Recommendations read the entries back with `GET`.

## POST /api/v1/users/me/history

Request: `{ "songId": "17", "listenedSeconds": 31 }`. `listenedSeconds` is optional and defaults to 0. The server sets `played_at`.

**201**

```json
{
  "success": true,
  "data": {
    "id": "6f1c…",
    "song_id": "17",
    "listened_duration": 31,
    "played_at": "2026-11-22T11:40:02.000Z",
    "song": { "id": "17", "title": "Glad To Be Stuck Inside", "artist": "HoliznaCC0", "album": "Lo-fi And Chill", "duration": 161, "cover_url": null, "is_active": true }
  }
}
```

| Status | `error` | When |
| --- | --- | --- |
| 400 | `invalid_song_id` | `songId` is missing or does not match `^[A-Za-z0-9_-]{1,64}$` |
| 400 | `invalid_listened_seconds` | Not a number from 0 to 86400 |
| 401 | `UNAUTHORIZED` | Missing, invalid or revoked session |
| 404 | `song_not_found` | No song in the database or the demo catalog |
| 410 | `song_unavailable` | The song is inactive, restricted or deleted |
| 422 | `song_not_in_catalog` | The id is not a database catalog key (for example a demo id `t8` when `songs.song_id` is numeric) |
| 503 | `history_unavailable` / `history_storage_failed` | Database not configured, or the write failed |

## PATCH /api/v1/users/me/history/:entryId

Request: `{ "listenedSeconds": 95 }`. The stored value only increases. **200** returns the entry. **404** `history_entry_not_found` when the entry does not exist or belongs to another user. **400** for an invalid id or value.

## GET /api/v1/users/me/history?limit=50

Returns the caller's entries, newest first, each with `song` metadata (`null` when the song is no longer in the catalog). `limit` must be from 1 to 200 (default 50). Responses carry `Cache-Control: private, no-store`.

## DELETE /api/v1/users/me/history

Deletes all of the caller's entries. **200** `{ "success": true, "data": { "removed": 12 } }`.
