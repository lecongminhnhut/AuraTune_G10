# Implementation Plan: Collaborative Playlists (Feature 065)

**Branch**: `065-collaborative-playlists` | **Date**: 2026-11-09 | **Spec**: [spec.md](./spec.md)

## Summary

Let playlist owners enable collaboration, invite registered users by email, inspect/revoke membership, and allow active collaborators to add, remove, and reorder tracks with contributor attribution. Collaborative playlists are publicly viewable, but only owner and active collaborators may edit; only owner may edit metadata, delete, or manage members. Use `playlist_shared_users` as the membership source, with backend checks on every operation. Initial synchronization may use request refresh/polling; sockets are not required by the spec.

## Technical Context

**Language/Version**: JavaScript ES modules; React 18.3.1, Vite 5.4.11; Node.js (repository runtime)
**Primary Dependencies**: React, React DOM, Vite, Tailwind CSS 3, `lucide-react`, Express 4.21.2, Supabase JS, existing auth, playlist/song operations (061/062)
**Storage**: `playlists`, `playlist_shared_users`, `playlist_songs`; reference schema needs collaborative flag, membership role semantics, and contributor field alignment
**Testing**: Use repository-supported verification once established; no test framework assumed
**Target Platform**: AuraTune web client and backend API
**Project Type**: Web application
**Performance Goals**: Revocation blocks subsequent edits within 1 second; reflect updated membership/content on refresh or agreed sync mechanism
**Constraints**: Owner-only metadata/member administration; collaborator track edits; non-members read-only; membership changes server authoritative; Firestore is unconfirmed
**Scale/Scope**: Playlist collaboration, invitations to registered email accounts, member list/revocation, contributor presentation, and edit permissions

## Constitution Check

Constitution is unfilled. Follow Team Contract: 060 owned by Khoa; coordinate shared schema/API with database owner and 062. Gate: the reference schema has `playlist_shared_users` but does not specify role/owner representation, `is_collaborative`, `added_by_user_id`, or public/private transition. Approve and document these fields/rules before migration. The spec clarifies invitations target registered emails and collaborative playlists are publicly viewable.

## Current Implementation Baseline

`PlaylistDetailPage.jsx` and `AppStore.jsx` contain prototype collaborator UI/state, but the prototype's behavior is not evidence of backend authorization or synchronized persistence. Existing backend has auth scaffolding; verify actual session identity and repository pattern before implementation.

## Project Structure

### Planning artifacts

```text
specs/060-playlist-management/065-collaborative-playlists/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/collaborative-playlists.md
└── tasks.md
```

```text
src/backend/{routes,controllers,services,repositories}/  # collaboration and authorization operations
src/database/migrations/                                # approved membership/playlist/track fields
src/frontend/src/
├── pages/PlaylistDetail/PlaylistDetailPage.jsx
├── components/playlist/PlaylistDialogs.jsx             # locate/retain CollaboratorsDialog
└── context/AppStore.jsx
```

**Structure Decision**: Extend playlist domain in existing backend/frontend/database layout. Reuse 062 membership mutations with a shared authorization service; avoid duplicating track-edit endpoints in 065.

## Design and Delivery Phases

1. **Permission/data contract**: Define collaboration flag and visibility transition, membership representation, contributor field, and revocation consistency with 062. Define public-read and authenticated mutation API contracts.
2. **Owner membership management**: Enable/disable collaboration, invite existing users by normalized email, list collaborators, and revoke membership; disabling removes collaborator edit access but preserves tracks.
3. **Shared content authorization**: Make 062 add/remove/reorder checks accept active collaborators while keeping metadata/delete/member management owner-only; record contributor on track addition.
4. **UI integration and freshness**: Connect the dialog, roster, public collaborative view, collaborator badge/count, and contributor labels. Refresh or poll using existing patterns; real-time sockets remain optional.
5. **Security and review**: Verify non-member mutations are rejected server-side and revocation applies to the next request; map FR-065-01..10 and UC-060-011..014.

## Risks

| Risk | Mitigation |
|---|---|
| Membership schema does not define roles or owner row | Agree canonical representation before migration and make owner derivable consistently |
| Permission checks split across 062 and 065 | Centralize reusable authorization decision in backend domain service |
| Concurrent reorders and membership revocation | Use agreed 062 ordering policy and check membership on each mutation, not cached client state |
| Visibility semantics conflict with private playlists | Specify transition rules and make collaboration state/public visibility changes atomic |

## Complexity Tracking

No constitution violations.
