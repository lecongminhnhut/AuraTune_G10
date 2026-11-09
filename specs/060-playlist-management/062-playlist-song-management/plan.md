# Implementation Plan: Playlist Song Management (Feature 062)

**Branch**: `062-playlist-song-management` | **Date**: 2026-11-09 | **Spec**: [spec.md](./spec.md)

## Summary

Manage playlist-song membership, liked songs, duplicate prevention, ordering, and derived count/duration. Use the existing `playlist_songs` and `user_liked_songs` relationships as the PostgreSQL reference, with server-side authorization for owners and collaborators. The reference schema lacks a playlist position and contributor field; ordering and collaboration metadata must be aligned with 065 before migrations are finalized.

## Technical Context

**Language/Version**: JavaScript ES modules; React 18.3.1, Vite 5.4.11; Node.js (repository runtime)
**Primary Dependencies**: React, React DOM, Vite, Tailwind CSS 3, `lucide-react`, Express 4.21.2, Supabase JS, existing auth middleware and player/store
**Storage**: `playlist_songs` composite `(playlist_id, song_id)`, `user_liked_songs`; playlist count/duration fields only if present in actual schema
**Testing**: Use the repository's available verification setup; no new test framework is assumed
**Target Platform**: AuraTune web client and backend API
**Project Type**: Web application
**Performance Goals**: Add feedback and persistence under 800ms; like UI under 300ms; reorder persistence within 1s
**Constraints**: Authenticated edits only; owner/editor policy shared with 065; duplicate memberships prohibited; update related data consistently; no Firestore assumption
**Scale/Scope**: Add/remove/reorder and like synchronization; playlist playback is 063

## Constitution Check

Constitution file is unfilled. Follow Team Contract and shared architecture: backend authorization is authoritative; shared schema/API changes require coordination; docs in English. Gate: approve ordering representation, derived duration/count strategy, and `added_by_user_id` alignment with feature 065. The ER/schema docs warn these details are not settled.

## Current Implementation Baseline

UI components exist at `src/frontend/src/components/song/TrackMenu.jsx`, `SongRow.jsx`, `pages/PlaylistDetail/PlaylistDetailPage.jsx`, and `context/AppStore.jsx`. Backend currently has an auth foundation but playlist operations must be discovered rather than presumed. Existing UI/mock data does not establish persistence behavior.

## Project Structure

### Planning artifacts

```text
specs/060-playlist-management/062-playlist-song-management/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/playlist-songs.md
└── tasks.md
```

```text
src/backend/{routes,controllers,services,repositories}/  # follow established backend pattern
src/database/migrations/                                # approved membership/order constraints
src/frontend/src/
├── services/                                           # playlist/song API adapter if absent
├── components/song/{TrackMenu.jsx,SongRow.jsx}
├── pages/PlaylistDetail/PlaylistDetailPage.jsx
└── context/AppStore.jsx
```

**Structure Decision**: Extend the existing app layout and keep playlist membership logic in the playlist domain. Reuse queue/player state only for playback integration, not as playlist persistence.

## Design and Delivery Phases

1. **Shared data rules**: Confirm position column, contributor attribution, duplicate handling, and whether count/duration are stored or calculated; align 065 and schema docs.
2. **Membership operations**: Add songs with duplicate-safe behavior, remove tracks, and reorder under owner/editor authorization.
3. **Liked songs**: Keep `user_liked_songs` and the user's Liked Songs playlist/UI synchronized without conflating likes with arbitrary playlist membership.
4. **Consistency and UI**: Keep membership and derived count/duration coherent on success; revert failed optimistic changes and report errors.
5. **Review**: Map UC-060-007..010 and FR-001..008 to endpoint, authorization, persistence, and UI behavior.

## Data and API Notes

The provided ER model includes `playlist_songs(playlist_id, song_id)` and `user_liked_songs(user_id, song_id)` with composite keys, but it does not define `sort_order`, `added_by_user_id`, or count/duration storage. `data-consistency.md` explicitly calls out ordering, duplicate/batch behavior, concurrent updates, and atomic multi-row operations. Use nested playlist-song routes per API conventions; add endpoint details to the shared contract before implementation. Use a transaction or equivalent atomic operation when a membership update and its derived metadata must change together.

## Risks

| Risk | Mitigation |
|---|---|
| Ordering and contributor fields absent from schema | Align 062/065 and approve one migration before implementation |
| Collaborative policy differs from playlist owner policy | Defer editor checks to the shared 065 authorization rule |
| Counters drift on retries/concurrent changes | Protect uniqueness and update derived values atomically or calculate from source rows |

## Complexity Tracking

No constitution violations. Schema decisions are explicit prerequisites.
