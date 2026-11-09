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
