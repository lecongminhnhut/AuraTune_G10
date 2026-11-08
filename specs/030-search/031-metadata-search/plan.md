# Implementation Plan: Metadata Search

**Branch**: `031-metadata-search` | **Date**: 2026-11-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/030-search/031-metadata-search/spec.md`

## Summary

Implement the metadata-search experience for Public and Listener users on `/search`. The feature will extend the existing React/Vite search page and local catalog search baseline with the approved metadata query contract (`GET /search` using `q`, `type`, `limit`, `offset`, `genre`, `release_year`, and `sort`; see [Search API Contract](./contracts/search-api.md)), normalized matching, applicable filtering/sorting, Load More pagination, query-history storage, and explicit loading/empty/error/retry states. AI lyrics and semantic search remain separate tabs/features and are not implemented by this plan.

The repository currently has a working `/search` page, `SearchPage`, `SemanticSearch`, `searchCatalog`, `sortTracks`, shared media components, and demo data in the frontend. The existing Express backend owns the new metadata-search endpoint. It queries the approved catalog metadata in PostgreSQL through Supabase; implementation must reuse the existing catalog schema and must not introduce a feature-specific schema or migration. The plan separates reuse of existing UI/player primitives from the search API/service work still to be implemented.

## Technical Context

**Language/Version**: JavaScript ES modules; React 18.3.1/Vite 5.4.11 frontend; Node.js/Express 4.21.2 backend

**Primary Dependencies**: React, React DOM, Vite, Tailwind CSS, lucide-react, Express, CORS, cookie-parser, dotenv, and the existing `src/database/supabaseClient.js` integration boundary for the approved PostgreSQL catalog source; no catalog search query implementation currently exists

**Storage**: PostgreSQL catalog metadata accessed through the existing Supabase client is the approved search source; browser LocalStorage stores up to 10 recent query strings. No new database schema or migration is specified by this feature. The checked-in SQL migration currently covers authentication only; catalog entities are described in reference database documentation but must be verified against the approved/deployed schema before implementation.

**Testing**: The frontend package exposes a Vite production build but no test script or component-test dependencies. The backend package exposes start/dev scripts but no dedicated search test suite; the root `test:backend` script invokes an auth-oriented `src/backend/test-server.js`, not feature 031 tests. Preserve existing JavaScript/Node conventions; confirm or add feature test tooling only as an implementation decision, and cover the API contract, normalization, pagination, history, UI states, and end-to-end behavior.

**Target Platform**: Responsive web application in supported desktop and mobile browsers; local/deployed Node.js backend where the approved search endpoint is hosted

**Project Type**: Web application with React frontend and Express backend, plus the existing `src/database` integration package for Supabase/PostgreSQL access

**Performance Goals**: Return and render the requested result batch without stale results and preserve the responsive search interaction. The approved Vision Document sets a project-level target of 300 ms p95 for exact text metadata search queries (title, artist, album); its PostgreSQL core-query target is under 100 ms p95. The feature spec defines no separate numeric target. The endpoint returns bounded batches, supports offset pagination, and follows the shared API error envelope.

**Constraints**: `q` must contain at least 2 characters before a request begins, must be capped at 100 characters, and matching must ignore case, diacritics, and punctuation. Requests use only the approved `q`, `type`, `limit`, `offset`, `genre`, `release_year`, and `sort` contract in [Search API Contract](./contracts/search-api.md). Search history is local-only and capped at 10 entries.

**Scale/Scope**: Songs, artists, albums, and playlists for Public and Listener users; one `/search` page with dedicated Metadata, AI Lyrics, and Semantic tabs. This plan covers feature 031 only.

## Constitution Check

*GATE: Must pass before implementation tasks are generated.*

The repository constitution file is still the Spec Kit placeholder template and contains no ratified project principles or governance rules. Therefore there is no project-specific constitutional rule to evaluate. This is recorded as a repository governance gap, not treated as permission to add requirements or technology.

| Gate | Result | Evidence / action |
|---|---|---|
| Feature scope is limited to 031 | PASS | All planned work maps to `spec.md` for `031-metadata-search`; AI lyrics and semantic search remain separate. |
| Search API contract | PASS | Request fields, response shape, filters, sort options, and pagination are defined in [Search API Contract](./contracts/search-api.md). |
| Existing architecture is respected | PASS | Reuses React/Vite/Tailwind, `SearchPage`, `searchCatalog`, shared media/player components, and Express route conventions. |
| Constitution principles | NEEDS CLARIFICATION | `.specify/memory/constitution.md` is unratified placeholder content and must be clarified at project level before treating this gate as authoritative. |

## Existing Baseline and Planned Work

| Area | Existing baseline | Planned for feature 031 | Notes |
|---|---|---|---|
| Route/UI | `/search` is registered in `src/frontend/src/routes/AppRouter.jsx`; `SearchPage.jsx` renders demo results, category tabs, track sorting, empty states, and playback. | Refine the page around the approved API contract, request lifecycle, Load More, query history, and error/retry behavior while preserving reusable cards/player behavior. | No unresolved feature-level decision. |
| Search logic | `src/frontend/src/utils/searchEngine.js` normalizes demo keyword matching and sorts tracks locally. | Move search through the Express API boundary, query PostgreSQL/Supabase metadata, and keep normalization consistent across client/server. The `relevance` order is the service default; no ranking formula is prescribed. | No unresolved feature-level decision. |
| Backend | `src/backend/server.js` mounts health and auth routes only; `src/backend/db.js` is an in-memory auth/session database. | Add the feature's search service/controller/route to the existing Express backend without changing auth behavior; read catalog metadata from PostgreSQL through Supabase. | No unresolved feature-level decision. |
| Persistence | `AppStore` persists demo state in LocalStorage. `src/database/supabaseClient.js` creates a Supabase client when its approved server configuration is available. | Add a separate bounded recent-query LocalStorage representation; read catalog metadata through the database package without mixing history with account/library state. | The checked-in SQL migration is auth-only; confirm deployed catalog tables and field mappings before implementation. |
| Search modes | Current UI includes keyword and AI/semantic demo behavior in shared components. | Keep Metadata, AI Lyrics, and Semantic as dedicated tabs; feature 031 owns only Metadata, while features 032/033 own AI Lyrics/Semantic. | No unresolved feature-level decision. |

## Technical Approach

### 1. Search contract and service boundary

- Treat [Search API Contract](./contracts/search-api.md) as the authoritative definition for `GET /search`, including all query parameters, response envelopes, validation errors, result identity, and pagination metadata.
- Validate and normalize `q` at the boundary: trim whitespace, reject/prevent requests below 2 characters, cap at 100 characters, and use the approved case/diacritic/punctuation-insensitive matching behavior.
- Preserve result type identity for tracks, artists, albums, and playlists. Do not add a ranking formula; `relevance` uses the service default.
- Keep the endpoint Public as defined by the project API conventions and feature assumptions; reuse existing Express middleware and CORS conventions rather than designing a new authorization system.

### 2. Frontend page and state

- Extend `SearchPage` to own the metadata request state: current query, selected type, active approved constraints, current offset, accumulated results, loading, empty, error, and retry state.
- Reuse `AppRouter`, `TopBar`/search entry navigation, `SongRow`, `ArtistCard`, `AlbumCard`, `PlaylistCard`, `CoverArt`, `EmptyState`, and player context for rendering and playback.
- Keep the current URL-driven `q`/`type` navigation model and serialize `limit`, `offset`, `genre`, `release_year`, and `sort` only as defined by the [Search API Contract](./contracts/search-api.md).
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
GET /api/v1/search?q=&type=&limit=&offset=&genre=&release_year=&sort=
        |
        v
Express search service over PostgreSQL/Supabase catalog metadata
        |
        v
typed result batch + continuation information
        |
        v
SearchPage state -> applicable filters/sort -> typed cards/rows -> existing PlayerContext
```

On query/type/constraint changes, reset the accumulated batch and offset. On Load More, retain the current visible results and append only the next batch using `pagination.next_offset` while `pagination.has_more` is true. On error, retain no stale result as the current successful result set; expose retry using the same request state.

## Components and Responsibilities

### Existing components/services to reuse

- `src/frontend/src/routes/AppRouter.jsx`: existing `/search` route.
- `src/frontend/src/pages/Search/SearchPage.jsx`: current page shell, URL query handling, result grouping, tabs, sort UI, and fallback states.
- `src/frontend/src/components/search/SemanticSearch.jsx`: existing search entry interaction and navigation to `/search`; metadata-specific behavior must remain distinct from AI behavior.
- `src/frontend/src/utils/searchEngine.js`: current local normalization and sorting baseline; use as behavioral reference and compatibility fallback only where approved.
- `src/frontend/src/context/AppStore.jsx` and `src/frontend/src/context/PlayerContext.jsx`: catalog visibility, playable checks, toasts, and playback.
- `src/frontend/src/components/song/SongRow.jsx`, `src/frontend/src/components/playlist/MediaCards.jsx`, `PlaylistCard.jsx`, and common UI primitives: typed result rendering and accessible states.
- `src/backend/server.js`: Express middleware, CORS, JSON parsing, and route mounting convention.
- `src/database/supabaseClient.js`: existing Supabase client boundary; verify the approved configuration and deployed catalog schema before adding metadata queries.

### Planned feature-owned implementation units

Implementation tasks should follow the repository conventions and cover these responsibilities:

- Frontend search API client/adapter for `GET /search` and normalized error handling.
- Frontend metadata-search state/controller (page hook or equivalent) for query validation, request identity, pagination, and retry.
- Recent-query history utility with LocalStorage guards and the 10-entry limit.
- Backend search route/controller/service integration in the existing Express backend, querying PostgreSQL through Supabase and reusing the approved catalog schema.
- Focused tests for normalization, request parameters, pagination accumulation, history limit/actions, typed rendering, empty/error/retry states, and stale-response protection.

## Dependencies

- Feature 031 `spec.md` and its approved API Contract; the contract is authoritative for response behavior not repeated in this plan.
- Existing catalog metadata for songs, artists, albums, and playlists.
- Existing frontend route, UI primitives, player context, and demo data shape as compatibility references.
- Existing Express backend and CORS/auth conventions; this backend owns the search endpoint.
- Feature 032 and 033 tab ownership/integration boundaries, without implementing those features here.
- The project constitution remains an unratified placeholder and must be ratified independently before constitutional compliance can be certified.

## Testing Strategy

1. Unit: `q` length/bounds, whitespace, Unicode normalization, diacritic and punctuation-insensitive matching, request parameter serialization, sort/filter visibility rules, and LocalStorage history cap/removal/clear behavior; use [Search API Contract](./contracts/search-api.md) as the source for request values and response pagination behavior.
2. Component: metadata tab, each result type label/rendering, applicable filter visibility, sort changes, Load More append/disable behavior, query history dropdown, no-results, loading, service-error, retry, and stale-result protection.
3. Backend/API integration: valid Public/Listener requests, invalid short/long query behavior, each approved `type`, pagination offsets, limit handling, typed results, and service failure mapping. Do not assert fields not defined by the approved contract.
4. End-to-end acceptance: known match across all four metadata types; category narrowing; approved filters and sorting; Load More; no match; unavailable service with retry; query replacement while loading; and recognition of result type/next action on responsive layouts.
5. Regression: existing `/search` navigation, playback from a track/playlist result, auth routes, health endpoint, and AI Lyrics/Semantic tabs remain outside feature 031 behavior and continue to render without cross-feature regressions.

## Project Structure

### Planning artifacts

```text
specs/030-search/031-metadata-search/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── search-api.md
└── tasks.md
```

`tasks.md` is an existing downstream artifact and is not generated or edited by `/speckit.plan`.

### Existing source and planned implementation locations

```text
src/backend/
├── server.js                       # Existing Express app and route mounting
├── routes/authRoutes.js            # Existing route convention
├── controllers/                    # Existing auth controller convention
├── repositories/authRepository.js  # Existing repository convention
└── utils/authHelpers.js            # Existing backend utility convention

src/database/
├── supabaseClient.js               # Existing Supabase client boundary
└── migrations/                     # Existing migrations; current checked-in SQL is auth-only

src/frontend/src/
├── pages/Search/SearchPage.jsx      # Existing page to extend
├── services/sessionApiClient.js    # Existing API-client convention
├── utils/searchEngine.js           # Existing local search baseline
├── context/AppStore.jsx            # Existing catalog state
└── context/PlayerContext.jsx       # Existing playback integration
```

New feature files should follow these repository locations and conventions: a backend search route/controller/repository, a frontend search API adapter and page-level state controller, and a guarded local query-history utility. Exact implementation names are task-level details. No new database schema or migration is planned; verify that the approved catalog schema supplies the fields required by [the API contract](./contracts/search-api.md).

## Risks and Technical Considerations

- **Unratified constitution**: the repository constitution is a placeholder. This plan records the gap and does not invent governance rules.
- **Stale responses**: rapid query changes and Load More can reorder responses. Request identity or cancellation is required before state commit.
- **Unicode matching consistency**: client and server must use the same normalization policy; otherwise visible results can disagree with API results.
- **Catalog schema is not established by checked-in migrations**: `src/database/migrations/001_auth_tables.sql` creates authentication tables only. Database reference documents describe catalog entities but warn they are not necessarily deploy-ready; verify the approved/deployed catalog schema and its metadata fields before implementing the search repository. Do not add a feature-specific schema to close this gap.
- **Test tooling is incomplete**: existing package scripts do not provide dedicated frontend/API tests for feature 031. Confirm the test approach before adding dependencies; the root backend smoke script covers authentication, not metadata search.
- **LocalStorage availability**: private browsing, quota, or disabled storage must not make the search page unusable.
- **Cross-feature boundary**: `/search` tabs for AI Lyrics and Semantic are navigation/ownership integration points only; their algorithms and requirements belong to features 032/033.

## Constitution Check (Post-Design)

The design remains within feature 031, reuses the existing React/Vite/Express architecture, avoids a new schema and unapproved search formula, and keeps Group 030 boundaries explicit. The only unresolved gate is project-level: `.specify/memory/constitution.md` is placeholder content, so formal constitutional compliance cannot be certified until that document is ratified.

## Clarification Outcomes

- API owner: existing Express backend; data source: PostgreSQL through Supabase.
- Request parameters, filter/sort applicability, success/error envelopes, result item shape, and pagination are defined in [Search API Contract](./contracts/search-api.md).
- Feature 031 owns the Metadata tab only; AI Lyrics and Semantic remain separate features (032/033).
- No feature-specific numeric latency or availability target is defined; the endpoint uses bounded batches and the shared error envelope.
- The project-level Vision Document target for exact text metadata search is 300 ms p95; it is recorded separately from feature-specific success criteria.
- The project constitution remains an unratified placeholder; constitutional compliance cannot be certified until the project-level document is ratified.

## Complexity Tracking

No constitution violation is being introduced. No new project or database schema is proposed. Complexity should remain limited to the request lifecycle, typed result rendering, pagination, and bounded local query history required by `spec.md`.
