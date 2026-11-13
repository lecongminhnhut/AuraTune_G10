# Research: Album Details

**Feature**: 081 — Album Details  
**Date**: 2026-11-09  
**Inputs**: `spec.md`, `plan.md`, AuraTune architecture/API/database documents, current frontend and backend source.

## Findings and decisions

### Album details API and ownership

- **Finding**: `spec.md` requires the approved public `GET /albums/:id` contract, including album metadata and the complete ordered track list. The checked-in API contract document and current backend entry point do not expose an authoritative schema or route implementation for this endpoint. The frontend API client defaults to `/api/v1`, while the feature contract's path is stated without a version prefix.
- **Decision**: Consume the already approved contract without creating or changing its endpoint, payload, or base path in Feature 081 planning. Resolve the contract owner, deployed service, path/base-path alignment, and response field mapping before implementation.
- **Alternatives considered**: Add an Express route and invent a response schema; use mock `AppStore` data as the production source; infer fields from UI mock data. Rejected because each would establish unapproved contract behavior.

### Frontend integration and request state

- **Finding**: `AppRouter.jsx` already routes `/album/:id` to `AlbumPage.jsx`. The page currently obtains album and track information synchronously from `AppStore`; it has no API-backed loading/retry lifecycle. The existing store is demo/mock-backed.
- **Decision**: Preserve the route and existing React/Vite stack. Integrate the approved public API at the established frontend service/store seam after confirming service ownership. Key request/cache identity by album ID; render cached data only for that same ID on return and refresh it. Ignore responses for an ID that is no longer current.
- **Alternatives considered**: Create a new state-management dependency or persist cache in browser storage. Rejected because the project already has a shared store and the spec defines no persistence or cache TTL.

### Track presentation and derived values

- **Finding**: `SongRow.jsx` currently converts missing play counts to zero and displays track duration without the feature's hour-aware format. `AlbumPage.jsx` derives data from the current full mock track collection.
- **Decision**: Keep the API-provided order and flat list. Format duration as `m:ss` below one hour and `h:mm:ss` from one hour onward. Render unknown count/duration as an em dash; preserve valid zero. Derive total from every known duration in the complete API response, independent of progressive row rendering.
- **Alternatives considered**: Treat absent values as zero or total only currently rendered rows. Rejected by FR-004, FR-007, FR-009, FR-014 and the spec assumptions.

### Related albums

- **Finding**: FR-016 requires “More from [Artist]”. The official API Contract defines existing public endpoints for this purpose.
- **Decision**: The team will use the existing `GET /artists/:id/albums` endpoint defined in the official API Contract. The frontend will extract the `artist.id` from the initial album details response and fetch the related albums, filtering out the currently viewed album on the client side.
- **Alternatives considered**: Expanding `GET /albums/:id` was rejected to strictly maintain the approved API boundaries defined in the official contract.

### Persistence and data model

- **Finding**: AuraTune database documents cover existing catalog entities, but Feature 081 only reads album and track metadata and derives a view; it introduces no writes or durable state.
- **Decision**: Add no database schema or persistent entity. Document only the feature's read projection and derived display values in `data-model.md`.
- **Alternatives considered**: Create a feature-specific album/track table or cache record. Rejected because it duplicates catalog ownership and is not required by `spec.md`.

### Testing and local validation

- **Finding**: Frontend package scripts expose Vite `dev`, `build`, and `preview`; backend exposes `start` and `dev`. Neither package manifest declares a test runner.
- **Decision**: Document existing runnable commands and acceptance scenarios; choose an automated test framework only after identifying the repository-approved harness. Do not add a dependency at planning time.
- **Alternatives considered**: Prescribe Jest/Vitest or claim automated tests can be run. Rejected because no runner is declared.

## Confirmations needed before implementation

1. Identify the owner and authoritative schema/location of the approved public `GET /albums/:id` contract, including its base path and the complete ordered track response.
2. Confirm the approved catalog source for “More from [Artist]”.
3. Confirm the repository test harness or approve a test framework if none exists.
