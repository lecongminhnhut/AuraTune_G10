# Contract: Song Comments API (Group 040, Feature 046)

Base path: `/api/v1`. The routes follow the team API contract (`docs/analysis-and-design/api-contract.md`): `GET` and `POST /songs/:id/comments`, `DELETE /comments/:id`.

Storage: Supabase table `public.song_comments` (`comment_id`, `song_id` → `songs.song_id`, `user_id` → `users.user_id`, `content`, `created_at`), created by `src/database/migrations/009_song_comments.sql`. Row-level security is on and `anon`/`authenticated` have no access: only the backend (service role) reads and writes, and it checks the permissions (046-FR-012). There is no in-memory fallback.

Comments belong to Supabase catalog songs, whose ids are numbers. Demo tracks (`t1`…`t10`) keep the prototype comments in the browser.

Errors use the Group 040 envelope `{ "success": false, "error": "<code>", "message": "<Vietnamese text>" }`. A missing or invalid token on a protected route answers 401 with the authentication middleware's envelope (`error.code: "UNAUTHORIZED"`).

## Comment object

```json
{
  "id": "12",
  "song_id": "2",
  "content": "Giai điệu này thật tuyệt vời để lắng nghe vào buổi tối! 🎧",
  "created_at": "2026-11-25T08:15:00.000Z",
  "author": { "id": "c0ffee…", "name": "Minh Anh", "avatar_url": null },
  "can_delete": true
}
```

- `author.name` is the account's `display_name`, else its `name`, else "Người nghe AuraTune". E-mail addresses are never returned.
- `can_delete` is true when the request carries the token of the author or of an administrator (`users.role = 'admin'`). Guests always get false (046-FR-011).

## GET /api/v1/songs/:id/comments?limit=50

Public (046-FR-006). A valid `Authorization: Bearer` token is optional; it only sets `can_delete`. An invalid token answers 401 instead of being treated as a guest.

**200**: `{ "success": true, "message": "Comments retrieved", "data": [Comment, …], "pagination": { "limit": 50, "has_more": false } }`, newest first.

| Status | `error` | When |
| --- | --- | --- |
| 400 | `invalid_song_id` | `:id` is not a catalog id (`^\d{1,18}$`) |
| 400 | `invalid_limit` | `limit` is not an integer from 1 to 100 |
| 404 | `song_not_found` | No such song |
| 503 | `comments_unavailable` | The table does not exist yet (migration 009 not applied) or the database is not configured |
| 503 | `comment_storage_failed` / `song_lookup_failed` | Database error |

## POST /api/v1/songs/:id/comments

Signed-in users only (046-FR-008). Body: `{ "content": "…" }`. The content is trimmed and control characters other than line breaks and tabs are removed. It must then have 1 to 300 characters, counted as Unicode characters (046-FR-009). The table has the same check.

**201**: `{ "success": true, "message": "Comment created", "data": Comment }`.

| Status | `error` | When |
| --- | --- | --- |
| 400 | `invalid_comment` | Empty, whitespace-only, not a string, or longer than 300 characters |
| 400 | `invalid_song_id` | As above |
| 401 | (`UNAUTHORIZED`) | No token, invalid or expired token, revoked session, or banned account |
| 404 | `song_not_found` | No such song |
| 410 | `song_unavailable` | The song is inactive (moderated or removed) |
| 503 | `comments_unavailable` / `comment_storage_failed` | As above |

## DELETE /api/v1/comments/:id

The comment's author or an administrator (046-FR-010). The check runs on the server, whatever the client shows (046-FR-012).

**200**: `{ "success": true, "message": "Comment deleted", "data": { "id": "12" } }`.

| Status | `error` | When |
| --- | --- | --- |
| 400 | `invalid_comment_id` | `:id` is not a number |
| 401 | (`UNAUTHORIZED`) | Not signed in |
| 403 | `forbidden` | Signed in, but neither the author nor an administrator |
| 404 | `comment_not_found` | No such comment, or it was already deleted |
| 503 | `comments_unavailable` / `comment_storage_failed` | As above |
