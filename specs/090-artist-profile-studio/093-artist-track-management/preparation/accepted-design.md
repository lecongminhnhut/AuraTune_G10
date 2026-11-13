# 093 accepted decisions and schema evidence — 2026-11-13

The owner supplied a **context-only** Supabase schema export, explicitly not runnable SQL, and accepted proposals 2–8 from the preceding clarification. Do not execute that export or recreate deployed source tables from its order. This authorization permits technical design/migrations/API implementation without inventing team Constitution ratification.

## Accepted product choices

- Each song has one explicit management owner; display/co-performer credit alone grants no management permission. New albumless songs must be supported without creating an album.
- Active linked Artist accounts can use Studio while their public profile is hidden. Effective public availability still requires the shared public profile policy. No automatic profile creation/link repair.
- Album input selects an existing own album or no album; clearing is allowed. No automatic album CRUD from text.
- Cloudinary remains media storage. Provider URLs are internal; controlled backend delivery must enforce new-start eligibility. Authenticated assets/proxy/ranges and continuation require real verification, not merely signing a URL or redirecting to a public secure_url.
- Artist deletion is irreversible from Studio but implemented as soft deletion, retaining row/history/play counts. Blob cleanup is separate and must not reopen distribution after logical deletion. Artist preference and Admin restriction remain independent.
- Separate protected Studio API, migrations and an upload-operation identity/reconciliation mechanism are authorized for design. Same submission must not duplicate; a separate intentional identical-file submission remains distinct.
- Owner accepts removing binary upload from the literal 500ms completion promise. Metadata edits retain the 500ms target. Full binary upload duration must be measured from submission through persistence, with progress; no optimistic success or clock shifted past transfer.
- Prior MP3-only <=52,428,800 bytes, rights declaration/attribution, entered duration and edit-only 200-code-point constraints remain.

## Actual supplied storage

`artists.user_id → users.user_id`; `albums.artist_id → artists.artist_id`; `songs.album_id → albums.album_id`; songs have bigint identity song_id, title, integer duration, nonnull audio_url, nullable text genre and nullable integer total_plays DEFAULT 0. There is **no direct song management owner, track visibility, moderation, deletion, filename/media-object or rights storage** in the export. Album association alone does not prove a management grant for legacy songs.

Listening history uses `duration_listened`, whereas current historyRepository queries `listened_duration`; record this integration drift rather than copy that query into Studio. Historical Studio reads use the supplied stored `songs.total_plays` counter and include soft-deleted owned rows; they do not count history rows as valid plays or fabricate a playback-recording writer. NULL/negative stored counts are unavailable, not zero. No external popularity or upload date is substituted.

Existing session FKs target users.id, distinct from canonical users.user_id. Reuse 092's transaction-bound authorization mapping. The export omits the separately supplied users.id unique index; existing auth migrations supply it. Do not treat omission in this context export as permission to change keys.

## First independently executable boundary

Read-only Studio access/catalog/stats does not depend on completed media delivery. Prepare `src/database/migrations/006_artist_studio_reads.sql`: minimal explicit nullable management_artist_id, Artist preference, independent Admin restriction and deleted_at; **no inferred legacy-owner backfill**, album creation, history rewrite or media upload. Existing songs remain unassigned to management until reviewed. The owner has confirmed keeping legacy ownership unassigned until reviewed and using the existing application genre taxonomy. No album-credit inference or arbitrary text taxonomy is introduced.

Protected read routes: GET `/api/v1/studio/me`, `/api/v1/studio/me/tracks`, `/api/v1/studio/me/stats`, backed by one backend-only SQL function with section parameter and strict current Artist/link/session checks. Separate requests isolate catalog/stat failures. Complete SQL JSON aggregates avoid transport row caps. Catalog order is bigint song ID ASC, not invented creation-date order. Counters/IDs serialize as decimal strings. Deleted rows are absent from catalog but retained in historical counter sum. Missing counters cause stats failure, while catalog can still show unavailable row counts.

No upload/edit/visibility/delete UI is enabled by this read slice. Those tasks require their actual media/finalization/public-delivery protections; do not leave demo mutation buttons wired to localStorage while presenting real catalog data.

## Cloudinary documentation evidence

Official [access-control documentation](https://cloudinary.com/documentation/control_access_to_media), [video delivery types](https://cloudinary.com/documentation/video_trans_flags_delivery_types) and [Upload API](https://cloudinary.com/documentation/image_upload_api_reference) describe authenticated delivery and audio using resource_type video. This is capability/design evidence, not a test of the configured account. Current upload adapter uses default public upload type and exposes secure_url; current song stream redirects external audio URLs. Neither satisfies controlled hide/delete delivery. Do not claim revocation of previously public URLs, complete MP3 validation or already-started continuation until tested.

## Configured-provider evidence — 2026-11-13

The explicit opt-in probe completed: authenticated synthetic MP3 uploaded; unsigned request 401; signed byte-range request 206; exact UUID test asset cleanup succeeded. See [execution results](../validation/read-slice-results.md). This replaces the earlier lack of account capability evidence only; production adapter/catalog/player and lifecycle enforcement remain unimplemented.

## Owner confirmation — 2026-11-13

The owner explicitly accepted both remaining proposals: legacy songs retain NULL management_artist_id until reviewed, with no automatic album-derived backfill; canonical genres are vpop, indie, rnb, lofi, ballad and chill from the existing application. The taxonomy is extracted to src/frontend/src/config/genres.js and re-exported by mockData for compatibility. Legacy song genre text is not silently rewritten or rejected on reads. New write validation must use these approved IDs; implementation of that write boundary remains pending.
