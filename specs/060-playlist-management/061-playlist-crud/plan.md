# Implementation Plan: Playlist CRUD (Feature 061)

**Branch**: `061-playlist-crud` | **Date**: 2026-11-09 | **Spec**: [spec.md](./spec.md)

## Summary

Deliver playlist creation, owner library and detail reads, public read-only access, metadata editing, permanent confirmed deletion, and public-playlist bookmarks. Keep playlist operations in the existing frontend store/service boundary and backend API; enforce visibility and ownership on the backend. New playlists are private. Metadata limits are 80 characters for the title and 300 for description. Bookmarking stores a reference to the owner's playlist; it does not copy tracks or grant edit rights.

## Technical Context

**Language/Version**: JavaScript ES modules; React 18.3.1, Vite 5.4.11; Node.js (repository runtime)
**Primary Dependencies**: React, React DOM, Vite, Tailwind CSS 3, `lucide-react`, Express 4.21.2, Supabase JS, existing authentication middleware
**Storage**: `playlists`; a bookmark relationship is required but is not clearly represented in the provided schema and must be resolved before persistence implementation
**Testing**: Repository currently has no established test/lint scripts; add focused tests only through the project quality setup when available
**Target Platform**: AuraTune web client and backend API
**Project Type**: Web application
**Performance Goals**: Library list under 1 second; create under 15 seconds of user interaction; deletion reflected in open views within 500ms
**Constraints**: API root `/api/v1`; standard response envelope; auth and ownership checks server-side; PostgreSQL schema is reference, migrations/code are authoritative; Firestore document is explicitly unconfirmed
**Scale/Scope**: Playlist CRUD and bookmark flows only; song association mutations belong to 062

## Constitution Check

The Spec Kit constitution is still an unfilled template. Apply the repository Team Contract and architecture guidance: stay within 060 ownership, document in English, coordinate shared schema/API changes, and keep secrets out of source control. **Gate**: bookmark persistence and playlist deletion FK behavior require schema/migration review before implementation; do not infer a Firestore design.

## Current Implementation Baseline

The repository contains `src/frontend/src/pages/Library/LibraryPage.jsx`, `pages/PlaylistDetail/PlaylistDetailPage.jsx`, `components/playlist/PlaylistDialogs.jsx`, `components/playlist/PlaylistCard.jsx`, and `context/AppStore.jsx`, plus an Express backend/auth foundation. These are UI/prototype baselines, not proof that playlist APIs or persistence exist. Confirm exact current signatures before changing them.

## Project Structure

### Planning artifacts

```text
specs/060-playlist-management/061-playlist-crud/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/playlist-crud.md
└── tasks.md
```

```text
src/backend/
├── controllers/             # playlist request validation and response mapping
├── routes/                  # playlist routes mounted under /api/v1
├── services/                # ownership, visibility, and CRUD rules
└── repositories/             # persistence if consistent with existing backend pattern
src/database/migrations/      # approved playlist/bookmark schema changes
src/frontend/src/
├── services/                 # playlist API adapter (add if absent)
├── context/AppStore.jsx      # playlist state integration
├── pages/Library/LibraryPage.jsx
├── pages/PlaylistDetail/PlaylistDetailPage.jsx
└── components/playlist/PlaylistDialogs.jsx
```

**Structure Decision**: Extend the existing `src/backend`, `src/database`, and `src/frontend` layout. Avoid introducing a new persistence technology or duplicating domain state.

## Design and Delivery Phases

1. **Contract and persistence alignment**: Map the feature requirements to `playlists`; agree bookmark relationship and FK deletion behavior; document any required API additions before implementation.
2. **Authenticated CRUD and visibility**: Implement create/list/detail/update/delete with private-by-default creation, field validation, public/private read rules, owner-only writes, and permanent deletion after client confirmation.
3. **Bookmarks and library integration**: Persist a read-only reference to a public playlist, include followed references in the user's library, and reflect owner updates through normal reads.
4. **UI states and integration**: Connect existing dialogs/pages/store to APIs; handle loading, empty, validation, permission, missing-resource, and network states without optimistic permanent loss on failure.
5. **Review**: Trace each acceptance scenario and FR-001..010 to implementation and API/schema; coordinate any shared API contract changes.

## API and Data Notes

Use `/api/v1/playlists` resource naming and the common JSON envelope. The API contract must be checked before choosing exact methods/payloads. Enforce `401` for unauthenticated writes, `403` for non-owner mutations/private reads, `404` for missing or hidden private resources, and `400` for field validation as appropriate to the shared contract. The provided ER model has `playlists` with `user_id_creator` and status, but does not show a bookmark table or cover default mechanism. Confirm actual migrations and FK delete behavior. Metadata conflict handling follows the spec's last-write-wins rule.

## Risks

| Risk | Mitigation |
|---|---|
| Bookmark relation absent from reference schema | Agree a minimal relation and update shared schema/API docs before code |
| Existing prototype state methods differ from plan | Inspect signatures and preserve current UI behavior during service integration |
| Cascade deletion semantics unspecified | Explicitly decide dependent rows and references before adding FK actions |

## Complexity Tracking

No constitution violations. Schema/API decisions above are coordination gates, not permission to invent a storage design.
