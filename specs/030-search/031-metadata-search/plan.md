# Implementation Plan: Metadata Search

**Branch**: `031-metadata-search` | **Date**: 2026-11-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/030-search/031-metadata-search/spec.md`

## Summary

Implement the metadata-search experience for Public and Listener users on `/search`. The feature will extend the existing React/Vite search page and local catalog search baseline with the approved metadata query contract (`GET /search` using `q`, `type`, `limit`, and `offset`), normalized matching, applicable filtering/sorting, Load More pagination, query-history storage, and explicit loading/empty/error/retry states. AI lyrics and semantic search remain separate tabs/features and are not implemented by this plan.

The repository currently has a working `/search` route, `SearchPage`, `SemanticSearch`, `searchCatalog`, `sortTracks`, shared media components, and demo data in the frontend. The backend currently exposes health and authentication routes only; no search service or search endpoint is present. The plan therefore separates reuse of existing UI/player primitives from the search API/service work still to be implemented.

## Technical Context

**Language/Version**: JavaScript ES modules; React 18.3.1/Vite 5.4.11 frontend; Node.js/Express 4.21.2 backend

**Primary Dependencies**: React, React DOM, Vite, Tailwind CSS, lucide-react, Express, CORS, cookie-parser, dotenv; existing Supabase client package is present but no search-specific persistence decision is documented

**Storage**: Existing approved catalog/content sources are the source of search results; browser LocalStorage stores up to 10 recent query strings. No new database schema is specified by this feature. The current repository still uses demo/in-memory catalog state in the frontend/backend baseline.

**Testing**: Existing backend Node test style (`src/backend/test-server.js`) and frontend Vite build; feature validation should add focused unit/component/API-contract coverage using the repository's selected test tooling when implementation tasks establish it. End-to-end acceptance scenarios should exercise `/search` in a running frontend/backend.

**Target Platform**: Responsive web application in supported desktop and mobile browsers; local/deployed Node.js backend where the approved search endpoint is hosted

**Project Type**: Web application with React frontend and Express backend, with a separate database integration package

**Performance Goals**: Return and render the requested result batch without stale results; preserve the existing responsive search interaction. No numeric latency target is defined for metadata search in the feature specification, so a service latency budget remains **NEEDS CLARIFICATION**.

**Constraints**: `q` must contain at least 2 characters before a request begins, must be capped at 100 characters, and matching must ignore case, diacritics, and punctuation. Requests are limited to the approved `q`, `type`, `limit`, and `offset` contract. Filters/sorts not defined by the approved project contract must not be invented. Search history is local-only and capped at 10 entries.

**Scale/Scope**: Songs, artists, albums, and playlists for Public and Listener users; one `/search` page with dedicated Metadata, AI Lyrics, and Semantic tabs. This plan covers feature 031 only.

## Constitution Check

*GATE: Must pass before implementation tasks are generated.*

The repository constitution file is still the Spec Kit placeholder template and contains no ratified project principles or governance rules. Therefore there is no project-specific constitutional rule to evaluate. This is recorded as a repository governance gap, not treated as permission to add requirements or technology.

| Gate | Result | Evidence / action |
|---|---|---|
| Feature scope is limited to 031 | PASS | All planned work maps to `spec.md` for `031-metadata-search`; AI lyrics and semantic search remain separate. |
| No unapproved API fields or search formula | PASS | Plan uses only `q`, `type`, `limit`, `offset`; filter/sort semantics remain delegated to the approved project contract. |
| Existing architecture is respected | PASS | Reuses React/Vite/Tailwind, `SearchPage`, `searchCatalog`, shared media/player components, and Express route conventions. |
| Constitution principles | NEEDS CLARIFICATION | `.specify/memory/constitution.md` is unratified placeholder content and must be clarified at project level before treating this gate as authoritative. |

## Existing Baseline, Planned Work, and Open Decisions

| Area | Existing baseline | Planned for feature 031 | Needs confirmation |
|---|---|---|---|
| Route/UI | `/search` is registered in `src/frontend/src/routes/AppRouter.jsx`; `SearchPage.jsx` renders demo results, category tabs, track sorting, empty states, and playback. | Refine the page around the metadata contract, request lifecycle, Load More, query history, and error/retry behavior while preserving reusable cards/player behavior. | Exact approved filter and sort fields/semantics are not included in this spec. |
| Search logic | `src/frontend/src/utils/searchEngine.js` normalizes demo keyword matching and sorts tracks locally. | Move/request search through the approved service boundary and keep normalization behavior consistent across client/server. | Canonical production content source and ranking/relevance rules are not specified. |
| Backend | `src/backend/server.js` mounts health and auth routes only; `src/backend/db.js` is an in-memory auth/session database. | Add the feature's search service/controller/route only when implementation tasks are approved, without changing auth behavior. | Whether `/search` is served by this Express app or another approved service is not documented. |
| Persistence | `AppStore` persists demo state in LocalStorage. | Add a separate bounded recent-query LocalStorage representation; do not mix it with account/library state unless implementation confirms that convention. | Storage key naming and migration policy are implementation details to confirm. |
| Search modes | Current UI includes keyword and AI/semantic demo behavior in shared components. | Keep Metadata, AI Lyrics, and Semantic as dedicated tabs; feature 031 owns only Metadata. | Cross-tab navigation contract and ownership with features 032/033 should be confirmed. |

## Technical Approach

### 1. Search contract and service boundary

- Treat `GET /search` with `q`, `type`, `limit`, and `offset` as the authoritative request shape from FR-007/FR-008.
- Validate and normalize `q` at the boundary: trim whitespace, reject/prevent requests below 2 characters, cap at 100 characters, and use the approved case/diacritic/punctuation-insensitive matching behavior.
- Preserve result type identity for tracks, artists, albums, and playlists. Do not introduce response fields or a ranking formula absent from the approved contract.
- Keep the endpoint accessible to Public and Listener users according to the feature assumptions; reuse the repository's existing auth/CORS conventions rather than designing a new authorization system.

### 2. Frontend page and state

- Extend `SearchPage` to own the metadata request state: current query, selected type, active approved constraints, current offset, accumulated results, loading, empty, error, and retry state.
- Reuse `AppRouter`, `TopBar`/search entry navigation, `SongRow`, `ArtistCard`, `AlbumCard`, `PlaylistCard`, `CoverArt`, `EmptyState`, and player context for rendering and playback.
- Keep the current URL-driven `q`/`type` navigation model. Add only the approved pagination parameters or state needed to request the next batch; do not add unsupported API parameters.
- Render filter controls only when applicable to the current result type (FR-011). Render the approved sorting controls and apply their semantics without inventing additional options.
- Add a Load More action that uses the current query and next `offset`, appends results without replacing the current batch, and hides/disables itself when no further batch is available.
- Use request identity/cancellation or equivalent stale-response protection so a response for an earlier query cannot overwrite the current query (FR-017), especially while a new query is loading.

### 3. Recent query history

- Store at most 10 recent query strings in browser LocalStorage.
- Show the dropdown on search-input focus, allow selecting an entry to reuse it, and provide individual removal plus clear-all actions (FR-019).
- Treat malformed or unavailable LocalStorage as a recoverable client condition; search itself must continue to work in memory.
- Do not persist result data, user credentials, or server-side search state in this history mechanism.

### 4. Data flow

```text
Search input / URL
        |
        v
validate q (2..100) + normalize request
        |
        v
GET /search?q=&type=&limit=&offset=
        |
        v
search service over approved metadata source
        |
        v
typed result batch + continuation information
        |
        v
SearchPage state -> applicable filters/sort -> typed cards/rows -> existing PlayerContext
```

On query/type/constraint changes, reset the accumulated batch and offset. On Load More, retain the current visible results and append only the next batch. On error, retain no stale result as the current successful result set; expose retry using the same request state.

## Components and Responsibilities

### Existing components/services to reuse

- `src/frontend/src/routes/AppRouter.jsx`: existing `/search` route.
- `src/frontend/src/pages/Search/SearchPage.jsx`: current page shell, URL query handling, result grouping, tabs, sort UI, and fallback states.
- `src/frontend/src/components/search/SemanticSearch.jsx`: existing search entry interaction and navigation to `/search`; metadata-specific behavior must remain distinct from AI behavior.
- `src/frontend/src/utils/searchEngine.js`: current local normalization and sorting baseline; use as behavioral reference and compatibility fallback only where approved.
- `src/frontend/src/context/AppStore.jsx` and `src/frontend/src/context/PlayerContext.jsx`: catalog visibility, playable checks, toasts, and playback.
- `src/frontend/src/components/song/SongRow.jsx`, `src/frontend/src/components/playlist/MediaCards.jsx`, `PlaylistCard.jsx`, and common UI primitives: typed result rendering and accessible states.
- `src/backend/server.js`: Express middleware, CORS, JSON parsing, and route mounting convention.

### Planned feature-owned implementation units

The exact file names should be finalized during `/speckit.tasks` from the repository's conventions, but tasks should cover these responsibilities:

- Frontend search API client/adapter for `GET /search` and normalized error handling.
- Frontend metadata-search state/controller (page hook or equivalent) for query validation, request identity, pagination, and retry.
- Recent-query history utility with LocalStorage guards and the 10-entry limit.
- Backend search route/controller/service integration at the approved host, using existing metadata sources and no new schema unless an approved architecture decision requires it.
- Focused tests for normalization, request parameters, pagination accumulation, history limit/actions, typed rendering, empty/error/retry states, and stale-response protection.

## Dependencies

- Feature 031 `spec.md` and its approved API Contract; the contract is authoritative for response behavior not repeated in this plan.
- Existing catalog metadata for songs, artists, albums, and playlists.
- Existing frontend route, UI primitives, player context, and demo data shape as compatibility references.
- Existing Express backend and CORS/auth conventions if the search endpoint is hosted there.
- Feature 032 and 033 tab ownership/integration boundaries, without implementing those features here.
- Confirmation of the project's ratified constitution and the canonical search service/content source before implementation is considered fully unblocked.

## Testing Strategy

1. Unit: `q` length/bounds, whitespace, Unicode normalization, diacritic and punctuation-insensitive matching, type/limit/offset serialization, sort/filter visibility rules, and LocalStorage history cap/removal/clear behavior.
2. Component: metadata tab, each result type label/rendering, applicable filter visibility, sort changes, Load More append/disable behavior, query history dropdown, no-results, loading, service-error, retry, and stale-result protection.
3. Backend/API integration: valid Public/Listener requests, invalid short/long query behavior, each approved `type`, pagination offsets, limit handling, typed results, and service failure mapping. Do not assert fields not defined by the approved contract.
4. End-to-end acceptance: known match across all four metadata types; category narrowing; approved filters and sorting; Load More; no match; unavailable service with retry; query replacement while loading; and recognition of result type/next action on responsive layouts.
5. Regression: existing `/search` navigation, playback from a track/playlist result, auth routes, health endpoint, and AI Lyrics/Semantic tabs remain outside feature 031 behavior and continue to render without cross-feature regressions.

## Risks and Technical Considerations

- **Unratified constitution**: the repository constitution is a placeholder. This plan records the gap and does not invent governance rules.
- **Ambiguous host/content source**: current backend has no catalog search service and frontend uses demo data. Implementation must confirm the production source and endpoint owner before binding tasks to a database or service.
- **Unspecified filter/sort contract**: FR-010/FR-012 explicitly defer semantics to an approved contract. Do not manufacture fields; mark task work blocked until the contract is available if needed.
- **Stale responses**: rapid query changes and Load More can reorder responses. Request identity or cancellation is required before state commit.
- **Unicode matching consistency**: client and server must use the same normalization policy; otherwise visible results can disagree with API results.
- **LocalStorage availability**: private browsing, quota, or disabled storage must not make the search page unusable.
- **Cross-feature boundary**: `/search` tabs for AI Lyrics and Semantic are navigation/ownership integration points only; their algorithms and requirements belong to features 032/033.
- **Pagination contract detail**: the spec defines `offset`/`limit` but does not repeat the exact continuation metadata. Tasks must follow the approved contract rather than infer a new response shape.

## Constitution Check (Post-Design)

The design remains within feature 031, reuses the existing React/Vite/Express architecture, avoids a new schema and unapproved search formula, and keeps Group 030 boundaries explicit. The only unresolved gate is project-level: `.specify/memory/constitution.md` is placeholder content, so formal constitutional compliance cannot be certified until that document is ratified.

## Open Clarifications

- What is the authoritative API response schema and continuation indicator for `GET /search` beyond the four request parameters?
- Which exact filter and sort controls/semantics are in the approved project contract?
- Which service owns `/search`, and which canonical catalog metadata source should it query?
- What latency/error-status budget is expected for metadata search?
- How should the Metadata tab coexist in the shared `/search` page with features 032 and 033 at the final integration boundary?

## Complexity Tracking

No constitution violation is being introduced. No new project or database schema is proposed. Complexity should remain limited to the request lifecycle, typed result rendering, pagination, and bounded local query history required by `spec.md`.
