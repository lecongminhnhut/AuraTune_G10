# Research: Playlist CRUD

**Feature**: [061 Playlist CRUD](./spec.md)
**Date**: 2026-11-09

## Specification Source Selection

`spec.md` contains a primary Spec Kit requirements section followed by a reconstructed UI/context section with different user-story grouping. Planning and task traceability use the primary `User Scenarios & Testing` and `Functional Requirements` at the top. The later section is used only to locate existing UI components; its prototype details do not replace the functional requirements.

## Findings and Decisions

### Persistence and runtime
- **Finding**: The project has a React/Vite client, Express backend, Supabase client, and PostgreSQL-oriented playlist schema. The checked-in migration is auth-focused; feature implementation and deployed catalog schema are not established by the prototype.
- **Decision**: Extend the existing backend and database boundary; treat existing UI and mock state as presentation references. Confirm actual schema before data access or migration.
- **Alternatives**: Firestore is rejected as an assumption because `firestore-collections.md` explicitly says it is not confirmed.

### Playlist ownership and visibility
- **Finding**: Spec 061 requires private-by-default creation, public reads, owner-only private reads and writes, permanent deletion after confirmation, title max 80, description max 300, last-write-wins metadata updates.
- **Decision**: Enforce all access and field rules in the backend; confirmation is a client interaction before permanent delete. Keep duplicate titles allowed.
- **Alternatives**: Soft delete, public default, client-only authorization are contrary to the spec/security guidance.

### Public-playlist bookmarks
- **Finding**: Spec calls for a read-only followed reference that stays synchronized with the owner's playlist. Reference ER includes no bookmark/follow-playlist relation.
- **Decision**: Bookmark persistence is an approval gate. Do not store copied playlist data or infer a schema/table until the group/database owner confirms it.
- **Alternatives**: Reusing `playlist_shared_users` is rejected because that relation represents collaborators, who can have edit access.

### API and current UI
- **Finding**: API conventions require `/api/v1`, auth bearer for protected operations, standard `{success,message,data,error}` envelope and backend authorization. Existing library/detail/dialog components are present; backend playlist routes are not established by the listed implementation baseline.
- **Decision**: Add to the established Express boundary and connect the existing client components through a service layer consistent with the actual code. Publish exact routes and payloads in the feature contract before implementation.

## Approval Gates

- Approve the bookmark relation/API and behavior for deleted or no-longer-public referenced playlists.
- Verify deployed playlist columns, default cover implementation, and FK/delete behavior against actual migrations.
- Constitution remains an unfilled Spec Kit template; no ratified principles are inferred.

## Live Database Check (2026-11-22, PA4 Section E)

Checked against the shared Supabase project through the PostgREST schema and live API runs (`docs/test/PA4_Section_E_evidence.md`, L4-L7).

- **Columns**: the project follows the team ER design: `playlists(playlist_id bigint, user_id_creator -> users.user_id, name, status, created_at)`, `playlist_songs(playlist_id, song_id bigint, added_at)`, `playlist_shared_users(playlist_id, shared_with_user_id, shared_at)`, `user_liked_songs(user_id, song_id, liked_at)`. Migration 003 (text `id`, `title`) never matched it. Migration `008_playlist_schema_alignment.sql`, applied on 2026-11-22, adds `description`, `cover_url`, `cover_key`, `is_official`, `is_collaborative`, `updated_at`, `playlist_songs.sort_order` and `added_by_user_id`, the `playlist_bookmarks` table, and the reorder and collaboration functions. The repository maps `playlist_id`/`name` to the API fields `id`/`title`.
- **Default cover**: `cover_key` defaults to `aurora` in the column and in `playlistRepository.create`; a chosen cover is stored as its key (live: `violet`).
- **Aggregates**: song count and total duration are computed when the playlist is read, from `playlist_songs` joined to `songs.duration` (live: 3 songs, 10 minutes; 4 songs after adding "Vintage").
- **Bookmarks**: stored in `playlist_bookmarks(user_id, playlist_id)` with `ON DELETE CASCADE` to both parents (created by migration 008). The bookmark approval gate above still needs the group owner's sign-off.
- **Delete / foreign keys**: the original foreign keys from `playlist_songs` and `playlist_shared_users` to `playlists` have no cascade on the live project: deleting a playlist with songs failed with 23503. `playlistRepository.delete` now removes bookmarks, members and songs before the playlist (live re-run: 200, no rows left). To close T004, read the exact rules in the SQL editor: `select conrelid::regclass, conname, confdeltype from pg_constraint where confrelid = 'public.playlists'::regclass;` (`a` = no action, `c` = cascade).
