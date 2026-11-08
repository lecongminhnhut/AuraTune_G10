# Tasks: Metadata Search

**Input**: Design documents from `specs/030-search/031-metadata-search/`

**Prerequisites**: `spec.md`, `plan.md`, `contracts/search-api.md`, `research.md`, `data-model.md`, `quickstart.md`

**Scope**: Feature 031 Metadata search only. The Express backend owns `GET /api/v1/search`; PostgreSQL catalog data is accessed through Supabase. No feature-specific schema or migration is planned. AI Lyrics and Semantic behavior remains outside this feature.

**Testing**: Feature-level validation is required by the specification and plan. Confirm the test approach before adding dependencies because the repository has no configured search test suite.

## Phase 1: Resolve Remaining Implementation Gates

**Purpose**: Verify prerequisites explicitly left open by the implementation plan without changing approved feature scope.

- [ ] T001 Verify deployed PostgreSQL catalog tables and field mappings against the approved result projections in `specs/030-search/031-metadata-search/data-model.md`; record the mapping before implementing the search repository and do not add a feature schema or migration.
- [ ] T002 Confirm an available test approach for backend/API and frontend feature coverage in `src/backend/package.json` and `src/frontend/package.json` before adding any test dependencies.
- [ ] T003 Verify whether `.specify/memory/constitution.md` has been ratified and record the governance gap for the implementation review; do not claim constitutional compliance while it remains a placeholder.

---

## Phase 2: Foundational Search API

**Purpose**: Implement the approved backend boundary and reusable query behavior needed before the frontend can consume search results.

- [ ] T004 Implement query normalization in `src/backend/utils/searchNormalization.js` to trim whitespace and ignore case, diacritics, and punctuation consistently with the approved matching policy.
- [ ] T005 Create the catalog search repository in `src/backend/repositories/searchRepository.js` using the verified PostgreSQL/Supabase catalog mapping and the existing client boundary in `src/database/supabaseClient.js` for tracks, artists, albums, and playlists.
- [ ] T006 Implement approved `type`, `limit`, and `offset` handling in `src/backend/repositories/searchRepository.js`, including defaults `all`, `20`, and `0` and the contract bounds.
- [ ] T007 Implement typed result projection and grouped ordering in `src/backend/repositories/searchRepository.js` so `type=all` returns tracks, artists, albums, and playlists in the contract-defined group order without adding a ranking formula.
- [ ] T008 Implement pagination metadata in `src/backend/repositories/searchRepository.js` with `limit`, `offset`, `next_offset`, and `has_more` consistent with the filtered result set.
- [ ] T009 Create the search controller in `src/backend/controllers/searchController.js` to validate all approved query parameters, reject unknown or inapplicable values with `400 VALIDATION_ERROR`, and enforce the trimmed 2–100 character `q` constraint.
- [ ] T010 Map catalog failures in `src/backend/controllers/searchController.js` to the shared `500 INTERNAL_ERROR` envelope without exposing credentials, SQL, or stack traces; preserve catalog failures as errors rather than empty successes.
- [ ] T011 Create `GET /search` in `src/backend/routes/searchRoutes.js` using the approved success and error envelopes from `specs/030-search/031-metadata-search/contracts/search-api.md`.
- [ ] T012 Mount the search router in `src/backend/server.js` under `/api/v1` using existing Express, CORS, and shared rate-limit conventions; keep the endpoint public and preserve health and authentication routes.

---

## Phase 3: User Story 1 - Find Music and Related Metadata (Priority: P1)

**Goal**: Let Public and Listener users search all approved metadata types, identify results, load more results, and reuse recent queries.

**Independent Test**: Search known title, artist, album, and playlist metadata; confirm typed matches, category narrowing, continuation behavior, and recent-query interactions.

### Backend and API Tests for User Story 1

- [ ] T013 [P] [US1] Add search API tests in `src/backend/tests/search.test.js` for valid requests, all four result types, type selection, defaults, pagination, and the success envelope.
- [ ] T014 [P] [US1] Add query validation tests in `src/backend/tests/search.test.js` for missing, short, overlong, whitespace, unknown, and invalid query parameters.

### Implementation for User Story 1

- [ ] T015 [US1] Create frontend query normalization in `src/frontend/src/utils/searchNormalization.js` with the same whitespace, case, diacritic, and punctuation behavior as the backend.
- [ ] T016 [US1] Create the frontend search API adapter in `src/frontend/src/services/searchApi.js` to call `GET /api/v1/search` and serialize only `q`, `type`, `limit`, `offset`, `genre`, `release_year`, and `sort`.
- [ ] T017 [US1] Normalize HTTP and network errors in `src/frontend/src/services/searchApi.js` so the page can distinguish validation, rate-limit, and service failures.
- [ ] T018 [US1] Create metadata search state in `src/frontend/src/pages/Search/useMetadataSearch.js` for query, type, approved constraints, offset, accumulated results, loading, empty, error, retry, and continuation state.
- [ ] T019 [US1] Prevent requests for invalid trimmed queries, enforce the 2–100 character range, and provide clear overlength feedback in `src/frontend/src/pages/Search/useMetadataSearch.js` and `src/frontend/src/pages/Search/SearchPage.jsx`.
- [ ] T020 [US1] Reset the current result batch and offset when query, type, or approved constraints change in `src/frontend/src/pages/Search/useMetadataSearch.js`.
- [ ] T021 [US1] Protect current search state from stale responses in `src/frontend/src/pages/Search/useMetadataSearch.js` using cancellation or request identity checks.
- [ ] T022 [US1] Implement retry in `src/frontend/src/pages/Search/useMetadataSearch.js` using the same current query, type, constraints, and offset.
- [ ] T023 [US1] Implement Load More in `src/frontend/src/pages/Search/useMetadataSearch.js` to request `pagination.next_offset`, append results, and stop when `pagination.has_more` is false.
- [ ] T024 [US1] Create a LocalStorage-backed recent-query utility in `src/frontend/src/utils/searchHistory.js` that records no more than 10 query strings and stores no results, credentials, or server-side state.
- [ ] T025 [US1] Handle malformed or unavailable LocalStorage in `src/frontend/src/utils/searchHistory.js` while keeping in-memory search usable.
- [ ] T026 [US1] Add recent-query selection, individual removal, and clear-all operations in `src/frontend/src/utils/searchHistory.js`.
- [ ] T027 [US1] Integrate `useMetadataSearch` into `src/frontend/src/pages/Search/SearchPage.jsx` while preserving URL-driven `q` and `type` navigation.
- [ ] T028 [US1] Render identifiable track, artist, album, and playlist results in `src/frontend/src/pages/Search/SearchPage.jsx` using the existing `SongRow`, `ArtistCard`, `AlbumCard`, and `PlaylistCard` components.
- [ ] T029 [US1] Preserve track and playlist playback through the existing player context in `src/frontend/src/pages/Search/SearchPage.jsx`.
- [ ] T030 [US1] Add the focus-triggered recent-query dropdown to `src/frontend/src/pages/Search/SearchPage.jsx` and connect selection, individual removal, and clear-all actions.
- [ ] T031 [US1] Add a Load More action to `src/frontend/src/pages/Search/SearchPage.jsx` that appends the next batch and hides or disables itself when `has_more` is false.
- [ ] T032 [P] [US1] Add recent-query utility tests in `src/frontend/src/utils/searchHistory.test.js` for the 10-entry cap, selection, removal, clear-all, malformed storage, and unavailable storage.
- [ ] T033 [P] [US1] Add search state tests in `src/frontend/src/pages/Search/useMetadataSearch.test.js` for query validation, request parameters, reset behavior, pagination append, retry, and stale-response protection.

---

## Phase 4: User Story 2 - Refine and Order Results (Priority: P2)

**Goal**: Apply only the approved genre/year filters and relevance/plays/newest/title sorting, with applicability determined by the API contract.

**Independent Test**: Search a multi-result catalog, apply valid filters and sort choices, and verify the result set/order; verify invalid combinations are rejected and inapplicable UI filters are hidden.

- [ ] T034 [P] [US2] Add API tests in `src/backend/tests/search.test.js` for filter applicability, combined filters, each approved sort, type-group ordering, and pagination after filtering.
- [ ] T035 [P] [US2] Add search page tests in `src/frontend/src/pages/Search/SearchPage.test.jsx` for filter visibility, approved sort choices, selection changes, and result updates.
- [ ] T036 [US2] Apply `genre` and `release_year` together as AND constraints before sorting and pagination in `src/backend/repositories/searchRepository.js`, following the contract behavior for `all`, tracks, and albums.
- [ ] T037 [US2] Implement `relevance`, `plays`, `newest`, and `title` semantics in `src/backend/repositories/searchRepository.js` with only the approved type applicability and no custom relevance score.
- [ ] T038 [US2] Render `genre` and `release_year` filters for `all`, tracks, and albums, and hide them for artists and playlists in `src/frontend/src/pages/Search/SearchPage.jsx`.
- [ ] T039 [US2] Render and apply only the approved sort controls in `src/frontend/src/pages/Search/SearchPage.jsx`, resetting pagination when sort or filter selections change.

---

## Phase 5: User Story 3 - Understand Empty and Unavailable Results (Priority: P2)

**Goal**: Clearly distinguish successful empty results from loading and service failures, and allow a retry without presenting stale results as current.

**Independent Test**: Verify explicit no-results feedback for a successful empty response, actionable error and retry for service failure, and current-query protection during overlapping requests.

- [ ] T040 [P] [US3] Add search page tests in `src/frontend/src/pages/Search/SearchPage.test.jsx` for loading, empty success, service error, retry, and stale-result handling.
- [ ] T041 [US3] Render distinct loading, explicit no-results, and service-error states in `src/frontend/src/pages/Search/SearchPage.jsx` without presenting stale results as the current successful result set.
- [ ] T042 [US3] Add an actionable retry control in `src/frontend/src/pages/Search/SearchPage.jsx` wired to the current request state.

---

## Phase 6: Polish, Acceptance, and Regression

**Purpose**: Verify the end-to-end feature scope, responsive affordances, project performance reference, and existing neighboring behavior.

- [ ] T043 Keep Metadata behavior separate from AI Lyrics and Semantic tabs in `src/frontend/src/pages/Search/SearchPage.jsx` and preserve their navigation boundaries.
- [ ] T044 [P] Add end-to-end acceptance coverage in `src/frontend/tests/search/metadata-search.test.js` for known matches across four metadata types, category narrowing, filters, sorting, Load More, query replacement while loading, and responsive result identification.
- [ ] T045 [P] Verify `/search` navigation, track and playlist playback, health and authentication routes, and AI Lyrics/Semantic tab rendering in `src/frontend/tests/search/metadata-search.test.js` without implementing neighboring feature behavior.
- [ ] T046 Measure exact metadata search and PostgreSQL core-query latency against the project targets recorded in `specs/030-search/031-metadata-search/plan.md`; report measurements without claiming a pass until measured.
- [ ] T047 Run the feature's agreed backend/frontend validation commands from `specs/030-search/031-metadata-search/quickstart.md` after the feature implementation is complete.

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1** resolves the catalog mapping, test approach, and remaining project-governance status. Catalog mapping blocks repository implementation; test-tooling confirmation blocks adding test dependencies. The API owner, source technology, and request/response semantics are already approved in the contract.
- **Phase 2** depends on the verified catalog mapping and establishes the endpoint before frontend API integration.
- **Phase 3 (US1)** depends on the Phase 2 endpoint and its response contract. Query history can be implemented independently of backend search after the shared frontend conventions are known.
- **Phase 4 (US2)** depends on the search repository and frontend state from earlier phases because filters and sorting affect the request and pagination lifecycle.
- **Phase 5 (US3)** depends on the API error mapping and frontend request state from Phases 2–3.
- **Phase 6** depends on the completed user-story behavior and runs acceptance, regression, performance, and quickstart validation.

### User Story Dependencies

- **US1 (P1)** is the MVP and depends on the foundational API in Phase 2. It delivers text matching, typed results, pagination, history, and playback.
- **US2 (P2)** depends on the query state and endpoint from US1; its filter and sort behavior must follow `specs/030-search/031-metadata-search/contracts/search-api.md`.
- **US3 (P2)** depends on the request/error lifecycle from US1 and provides the specified empty, unavailable-service, and retry feedback.

### Parallel Opportunities

- T001, T002, and T003 can be investigated independently.
- After T001, backend normalization/repository work (T004–T008) can proceed separately from frontend history work (T024–T026), while endpoint integration remains dependent on Phase 2.
- Test tasks for separate backend, history, state, and page files can proceed in parallel after the selected test approach and relevant interfaces are stable.
- US2 and US3 work can proceed in parallel after the shared US1 request state and API behavior are established, provided their shared `SearchPage.jsx` edits are coordinated.

## Implementation Strategy

1. Resolve Phase 1 verification gates; do not create a catalog migration or infer unverified columns.
2. Implement the Express API and Supabase catalog query before connecting the frontend.
3. Deliver US1 as the MVP: validated metadata search, typed results, pagination, history, and playback.
4. Add US2 filters and sorting using only contract-approved applicability and semantics.
5. Add US3 empty/error/retry feedback and stale-result protection.
6. Complete acceptance, regression, latency measurement, and the quickstart checks.
