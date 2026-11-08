# Research: Metadata Search

**Feature**: [031-metadata-search](./spec.md)
**Planning source**: [Implementation Plan](./plan.md)
**API source of truth**: [Search API Contract](./contracts/search-api.md)

## Findings and Decisions

### Search ownership and request boundary

- **Decision**: Expose metadata search from the existing AuraTune Express backend as `GET /api/v1/search`; the frontend calls this endpoint through its service/API-client layer.
- **Rationale**: The feature clarification and API contract name the existing Express backend as owner. `src/backend/server.js` currently mounts health and authentication endpoints, and `src/backend/routes/authRoutes.js` demonstrates the existing route convention. `src/frontend/src/services/sessionApiClient.js` is the current frontend API-client precedent.
- **Alternatives considered**: Keep production search entirely in the browser using the existing local demo search; add the metadata endpoint to the AI service. Browser-only search cannot query the approved server-side catalog contract, and an AI-service endpoint would change the approved owner and cross the boundary into features 032/033.

### Catalog source and schema

- **Decision**: Read approved catalog metadata from PostgreSQL through Supabase. Reuse the existing catalog schema; do not add a feature-specific table, migration, or schema.
- **Rationale**: This source was confirmed for feature 031 and is recorded in the API contract. `src/database/supabaseClient.js` provides the existing Supabase client boundary. The current backend `db.js` is an in-memory authentication/session store, not the music catalog, and `server.js` does not yet mount a search route. Therefore the search repository and its catalog integration are planned work; no existing search query implementation was found.
- **Scope reconciliation**: The project plan lists PostgreSQL and other data technologies as broad project candidates. The feature-specific approval and contract select PostgreSQL/Supabase for this search endpoint; that decision does not imply a project-wide database migration or schema change.
- **Schema evidence**: The only checked-in SQL migration found for `src/database` is `001_auth_tables.sql`, which creates authentication tables and no catalog tables. `docs/design/database/README.md` and `docs/design/database/er-diagram.md` describe conceptual `songs`, `albums`, and `artists` entities but explicitly require checking against migrations. Treat catalog table/field availability as a prerequisite verification, not as an implicit schema approval.
- **Alternatives considered**: Search the frontend mock catalog only; introduce a new metadata schema or database migration; query a separate search engine. These alternatives either retain demo-only behavior or introduce unapproved storage/infrastructure.
- **Verification boundary**: The repository source inspected for this plan exposes the Supabase client, but not the deployed catalog schema or a backend catalog repository. The implementation must map contract fields to the already approved catalog and verify availability before coding the search repository. Do not infer or create database columns from the API response shape.

### Search behavior and ranking

- **Decision**: Use the rules in `contracts/search-api.md` for query validation, type scope, filters, sorting, bounded offset pagination, response envelope, and errors. `relevance` uses the search service's default relevance ordering; no scoring formula is defined.
- **Rationale**: The feature spec delegates parameter semantics to the API contract. The current `src/frontend/src/utils/searchEngine.js` is a local mock-data matcher and sorts tracks, but it is not the production API or an approved server ranking formula.
- **Alternatives considered**: Define an additional weighted score or use AI/vector relevance. Neither is authorized for metadata search; semantic and lyric search belong to features 033 and 032.

### Query history

- **Decision**: Store only up to ten recent query strings in browser LocalStorage, with focus-triggered selection, individual removal, and clear-all behavior.
- **Rationale**: This behavior is explicit in FR-019 and the clarification outcome in `spec.md`; `src/frontend/src/context/AppStore.jsx` is the existing app-state reference, while history remains a separate local-only utility rather than account or catalog state.
- **Alternatives considered**: Persist history on the server or store result/user data with each query. Those approaches exceed the approved local-only scope and would add privacy and persistence behavior not specified.

### Existing UI and playback integration

- **Decision**: Extend the existing `SearchPage` and reuse current typed media cards, `SongRow`, `CoverArt`, and `PlayerContext`.
- **Rationale**: `src/frontend/src/pages/Search/SearchPage.jsx` already owns `/search` query/type navigation, category controls, empty states, and playback entry points. The feature screenshots in `ui/` specify the Metadata experience; shared player and card components are already present.
- **Alternatives considered**: Add a separate search route or a new playback/card system. This duplicates the existing interaction and is not required by the feature.

### Test tooling and performance

- **Decision**: Do not introduce a new test framework as a planning assumption. Use existing project tooling where available and make the implementation team confirm a suitable frontend/API test runner before adding dependencies.
- **Evidence**: `src/frontend/package.json` provides `dev`, `build`, and `preview` only. `src/backend/package.json` provides `start` and `dev` only. The root `test:backend` script invokes `src/backend/test-server.js`, an auth-oriented smoke script rather than a metadata-search suite. The database package's placeholder test script intentionally exits with an error. No search-specific backend or frontend test tooling is configured.
- **Alternatives considered**: Treat the existing auth smoke script as feature coverage, or select a new frontend/API test framework during planning. The smoke script does not exercise search; selecting dependencies without implementation-owner confirmation would create an unsupported project-wide tooling decision. Use the Vite build for the currently available frontend check and settle focused test tooling in implementation planning.
- **Performance target**: The feature spec sets no numeric latency target. The approved Vision Document sets 300 ms p95 for exact text metadata search and under 100 ms p95 for core PostgreSQL queries. These project-level targets are recorded in `plan.md`; the feature must not claim they have been achieved until measured.

## Technical Decisions Not Made

- No feature-specific schema/table, index, or migration is approved; use the existing catalog and verify its field mapping.
- The reference catalog schema has not been verified against the deployed database; confirm it before implementation binds the API contract to concrete tables/columns.
- No relevance formula beyond the service default is approved.
- No new test dependency is selected in the current repository.
- No new authorization model is introduced; the API contract says the endpoint is Public and requires no access token.
