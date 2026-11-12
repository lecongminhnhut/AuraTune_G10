# Quickstart: Playlist CRUD

**Feature**: [061 Playlist CRUD](./spec.md)

## Prerequisites

- Run the existing backend and frontend using the commands documented in the repository root `package.json`.
- Configure local backend/database credentials using the project setup; never commit secrets.
- Apply `src/database/migrations/003_playlist_management.sql` in the Supabase SQL editor after `001_auth_tables.sql` and verify `songs.song_id` matches the configured catalog schema.
- API and entity expectations: [playlist CRUD contract](./contracts/playlist-crud.md), [data model](./data-model.md).

## Validation Scenarios

1. Create a playlist with a valid title and no cover; verify private default, default cover, and detail navigation.
2. Reject an empty title, an 81-character title, and a 301-character description; accept the exact 80/300 boundaries.
3. Verify owner library includes created playlists and detail aggregates reflect playlist contents.
4. Verify a guest can read a public playlist but cannot read a private playlist or mutate any playlist.
5. Verify only the owner can edit metadata or delete; confirm deletion is permanent and the UI asks before sending it.
6. After bookmark design is approved, bookmark a public playlist and confirm it appears as a read-only reference and reflects owner updates.
7. Simulate network failure during create/update/delete and verify visible state is not falsely reported as persisted.

The repository has no confirmed playlist-specific test command. Select verification tooling during implementation; the existing backend smoke command is not playlist coverage.
