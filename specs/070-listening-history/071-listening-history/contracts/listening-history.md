# Listening History Contract (Current Implementation)

**Feature**: [071 Listening History](../spec.md)  
**Status**: Implemented contract for the current AuraTune application.  
**Shared conventions**: [AuraTune API Contract](../../../../docs/analysis-and-design/api-contract.md)

## Confirmed Behavior

- History operations require an authenticated listener and are scoped to that identity.
- A qualifying event is recorded after >=30 seconds, or >=90% completion for a track shorter than 30 seconds.
- Each qualifying replay is a separate event; repeated progress callbacks for one session must not duplicate it.
- Results are newest first and paginated; each row identifies track, artist, optional album, track duration, play timestamp, and listened duration where available.
- Clear-all requires explicit confirmation and permanently excludes cleared records from personal statistics and recommendation inputs.
- History older than 365 days is purged. Empty history has a path back to Home; replay uses existing playback behavior.

## Shared API Rules

History uses the documented success/error envelope and authenticated owner scoping.

## Current API and Storage

- Storage is the shared PostgreSQL/Supabase `public.listening_history` table with columns `history_id`, `user_id`, `song_id`, `played_at`, and `duration_listened`. API responses map the primary key and duration to `id` and `listened_duration`.
- `POST /api/v1/users/me/history` accepts `{ songId, listenedSeconds }`; user ownership comes from the authenticated token.
- `GET /api/v1/users/me/history?limit=50&cursor=...` returns `{ success, data, nextCursor }`. `data` is an array and `nextCursor` is an opaque base64url keyset cursor over `(played_at, history_id)`, both ordered descending.
- `PATCH /api/v1/users/me/history/:entryId` raises listened duration without lowering it. `DELETE /api/v1/users/me/history` physically removes only the authenticated user's rows.
- Reads, analytics, and recommendation signals use the latest 365 days. Migration `010_listening_history_retention_pagination.sql` installs the pagination index and daily `pg_cron` cleanup when the extension is available; read paths exclude expired records even without a scheduler.
- Analytics and recommendation queries use `duration_listened`. Live database errors surface as errors rather than silently substituting demo history for signed-in users.
- All player playback, including playback initiated by the AI assistant, goes through the shared player session tracker. Tracks under 30 seconds qualify at 90% completion; other tracks qualify at 30 seconds.

## Security and Privacy

- Derive the owner from authentication, not a user ID in the request body or query.
- Deny cross-user reads, writes, and deletion.
- Do not expose history to other listeners. Administrative access follows the project's separately approved audit/security policy.
- Ensure clear-all excludes events from all personal analytics and recommendation inputs.
