# Tasks: Semantic Vector Music Search

**Feature**: [033 Semantic Vector Music Search](./spec.md)
**Plan**: [Implementation Plan](./plan.md)  
**Status**: Draft; implementation depends on the approval gates in Phase 1.

## Phase 1: Setup and Approval Gates

- [ ] T001 Confirm the public semantic-search route, request/response schema, shared response envelope, and Express ownership in `specs/030-search/033-semantic-vector-search/contracts/semantic-search.md` before implementing a client or endpoint.
- [ ] T002 Complete and record the provider, embedding model, vector database, runtime, hosting, authentication, and service-owner comparison in `specs/030-search/033-semantic-vector-search/research.md` before selecting dependencies or service files.
- [ ] T003 Confirm the internal Backend-to-Python endpoint, authentication, and timeout propagation in `specs/030-search/033-semantic-vector-search/contracts/semantic-search.md` before implementing service communication.
- [ ] T004 Confirm whether the AI service returns per-dimension scores or the combined score, and record score ownership in `specs/030-search/033-semantic-vector-search/contracts/semantic-search.md`.
- [ ] T005 Confirm the canonical catalog source, available metadata/lyrics/audio fields, and index generation/update owner in `specs/030-search/033-semantic-vector-search/data-model.md`; do not infer a migration or index schema.
- [ ] T006 Confirm the authenticated profile source, supported locale/context name-detection policy, and trusted catalog-artist recognition source in `specs/030-search/033-semantic-vector-search/research.md` before implementing the privacy detector.
- [ ] T007 Confirm the approved song identity/playback fields, any explanation fields, semantic/fallback mode representation, unsafe-response validation policy, and equal-score tie-breaker in `specs/030-search/033-semantic-vector-search/contracts/semantic-search.md`.
- [ ] T008 Verify the plan and API contract consistently use the confirmed 1,500 ms fallback threshold and retain the separate 3-second SC-003 visible-result target in `specs/030-search/033-semantic-vector-search/plan.md` and `specs/030-search/033-semantic-vector-search/contracts/semantic-search.md`; do not treat these targets as conflicting.
- [ ] T009 Confirm how to treat screenshot-only playlist suggestions and verify the project constitution status in `specs/030-search/033-semantic-vector-search/plan.md` before claiming those behaviors or formal governance compliance.
- [ ] T010 Select feature-level test tooling and test commands consistent with repository conventions in `specs/030-search/033-semantic-vector-search/quickstart.md`; do not count the auth-only backend smoke test as semantic coverage.

## Phase 2: Foundational Search Infrastructure

- [ ] T011 Inspect the existing search UI, Express route mounting, app state, catalog, and playback conventions in `src/frontend/src/utils/searchEngine.js`, `src/frontend/src/pages/Search/SearchPage.jsx`, `src/frontend/src/components/search/SemanticSearch.jsx`, `src/backend/server.js`, `src/frontend/src/context/AppStore.jsx`, and `src/frontend/src/context/PlayerContext.jsx`.
- [ ] T012 Define the feature-owned semantic request/response adapter boundary and approved-field view model in `src/frontend/src/utils/semanticSearchAdapter.js` after T001, T003, T004, and T007.
- [ ] T013 Define active-query identity, cancellation, and stale-response handling for semantic and fallback requests in `src/frontend/src/hooks/useSemanticSearch.js`.
- [ ] T014 Map approved semantic result song identifiers to the existing catalog and playback model in `src/frontend/src/utils/semanticSearchAdapter.js` after T005 and T007; do not add unapproved score or explanation fields.

## Phase 3: User Story 1 - Describe a Mood and Discover Music (P1)

**Goal**: Submit a natural-language query and display relevant, playable song results.

**Independent test**: Submit a supported mood/context query and verify ranked results include approved song identity/playback information; empty or whitespace-only input produces local guidance and no search request.

- [ ] T015 [P] [US1] Add unit tests for empty/whitespace input, meaningful alphanumeric tokens, the 150-character boundary, supported language, punctuation, emojis, and meaning-preserving normalization in `src/frontend/src/utils/__tests__/semanticQuery.test.js`.
- [ ] T016 [P] [US1] Add component tests for query submission, local validation feedback, loading, and dropdown keyboard behavior in `src/frontend/src/components/search/__tests__/SemanticSearch.test.jsx`.
- [ ] T017 [P] [US1] Add contract tests for the approved public semantic-search route, response envelope, and invalid/unavailable responses in `src/backend/tests/semantic-search-route.test.js`.
- [ ] T018 [US1] Implement and mount the approved public semantic-search route with request/response validation using existing Express middleware conventions in `src/backend/routes/semanticSearch.js`, `src/backend/controllers/semanticSearchController.js`, and `src/backend/server.js` after T001 and T003.
- [ ] T019 [US1] Implement the backend client for the approved internal AI-service endpoint and authentication in `src/backend/services/semanticAiClient.js` after T002 and T003; keep third-party calls behind the US4 privacy gate.
- [ ] T020 [US1] Implement meaning-preserving query normalization and validation for at least one meaningful alphanumeric token and a 150-character maximum in `src/frontend/src/utils/semanticQuery.js`.
- [ ] T021 [US1] Implement the approved public semantic API call through the frontend API client in `src/frontend/src/utils/semanticSearchAdapter.js` after the API contract and privacy gate are approved and available.
- [ ] T022 [US1] Connect the top-navigation semantic input, suggestions, keyboard interactions, and request state to the adapter in `src/frontend/src/components/search/SemanticSearch.jsx`.
- [ ] T023 [US1] Render approved semantic song results and user-facing no-results feedback in `src/frontend/src/pages/Search/SearchPage.jsx`.
- [ ] T024 [US1] Connect semantic result selection to existing playback behavior in `src/frontend/src/pages/Search/SearchPage.jsx` and `src/frontend/src/context/PlayerContext.jsx`.
- [ ] T025 [US1] Prevent responses for superseded queries from changing the current dropdown or results page in `src/frontend/src/hooks/useSemanticSearch.js`.

## Phase 4: User Story 2 - Search Across Music Meaning and Characteristics (P1)

**Goal**: Rank songs using available metadata, lyrics, and the specified audio characteristics.

**Independent test**: Use fixtures with each available dimension and missing dimensions; verify the 30/40/30 weighted ensemble, availability re-normalization, duplicate removal, and descending score order.

- [ ] T026 [P] [US2] Add ranking tests for metadata 30%, lyrics 40%, audio characteristics 30%, and re-normalization across dimensions available for both query and song in `src/backend/tests/semantic-ranking.test.js`.
- [ ] T027 [P] [US2] Add fixtures/tests for BPM/tempo, key, mode, energy, valence, danceability, acousticness, instrumentalness, speechiness, loudness, liveness, time signature, and duration in `src/backend/tests/semantic-ranking.test.js`.
- [ ] T028 [US2] Map the complete approved audio-characteristic field set into the semantic search document in `src/backend/services/semanticDocumentMapper.js` after T005.
- [ ] T029 [US2] Implement or validate the spec-defined weighted ensemble and available-dimension re-normalization in the score owner selected by T004; use `src/backend/services/semanticRanking.js` only when the approved design assigns scoring to Express.
- [ ] T030 [US2] Treat unavailable metadata, lyrics, and audio values as absent dimensions while keeping songs eligible in `src/backend/services/semanticRanking.js`.
- [ ] T031 [US2] Remove duplicate song identities and order results by descending semantic score or approved equal-score tie-breaker in `src/backend/services/semanticRanking.js` after T007.
- [ ] T032 [US2] Verify the approved catalog can supply the fields needed by the search document and record any unavailable dimensions in `specs/030-search/033-semantic-vector-search/data-model.md` before enabling production indexing.

## Phase 5: User Story 3 - Continue Searching During AI Service Unavailability (P1)

**Goal**: Preserve usable search through keyword fallback and clear result states when semantic search cannot complete.

**Independent test**: Simulate semantic unavailability, invalid/unsafe responses, internal AI HTTP 429, unsafe query, and a response taking longer than 1,500 ms; verify keyword fallback, visible fallback indication, and no unhandled error.

- [ ] T033 [P] [US3] Add tests for unavailable, invalid, unsafe, internal HTTP 429, and timed-out semantic responses in `src/backend/tests/semantic-fallback.test.js`.
- [ ] T034 [P] [US3] Add component tests for fallback indication, fallback results, empty results, unavailable catalog, and subsequent semantic recovery in `src/frontend/src/pages/Search/__tests__/SearchPage.test.jsx`.
- [ ] T035 [US3] Implement the 1,500 ms semantic-result deadline and start keyword fallback when no usable response arrives in `src/backend/services/semanticSearchOrchestrator.js`.
- [ ] T036 [US3] Route unavailable, invalid, unsafe, and internal AI HTTP 429 outcomes to keyword fallback without adding retries in `src/backend/services/semanticSearchOrchestrator.js`.
- [ ] T037 [US3] Invoke the existing keyword search path for fallback and preserve the applicable keyword ranking order in `src/backend/services/semanticSearchOrchestrator.js` and `src/frontend/src/utils/searchEngine.js`.
- [ ] T038 [US3] Expose the approved fallback mode to the UI and show a clear fallback indicator without sensitive diagnostics in `src/frontend/src/pages/Search/SearchPage.jsx` and `src/frontend/src/components/search/SemanticSearch.jsx` after T007.
- [ ] T039 [US3] Render user-friendly no-results or catalog-unavailable states when neither semantic nor keyword search can return results in `src/frontend/src/pages/Search/SearchPage.jsx`.
- [ ] T040 [US3] Verify a later search can use semantic processing after the dependency recovers without a user configuration change in `src/backend/tests/semantic-fallback.test.js` and `src/frontend/src/pages/Search/__tests__/SearchPage.test.jsx`.

## Phase 6: User Story 4 - Keep Personal Data out of Third-Party AI Processing (P1)

**Goal**: Block listener names and email addresses from third-party requests, diagnostics, and AI error payloads.

**Independent test**: Inspect serialized third-party requests and AI-related diagnostics/errors for authenticated profile names, emails, context-aware personal names, and catalog artist names; verify PII is absent and uncertain cases use keyword fallback.

- [ ] T041 [P] [US4] Add unit tests for authenticated-profile matching, email detection, context-aware name detection, recognized catalog-artist preservation, and ambiguous-name fallback in `src/backend/tests/semanticPrivacy.test.js`.
- [ ] T042 [P] [US4] Add request-inspection tests proving names and email addresses are absent from serialized third-party requests, searchable payloads, diagnostics, and AI-related error payloads in `src/backend/tests/semanticPrivacyBoundary.test.js`.
- [ ] T043 [US4] Implement local profile matching, email detection, and context-aware name detection using the approved sources and locale policy in `src/backend/services/semanticPrivacyGuard.js` after T006.
- [ ] T044 [US4] Implement catalog-artist recognition and preserve recognized artist names while detecting personal names in `src/backend/services/semanticPrivacyGuard.js` after T006.
- [ ] T045 [US4] Sanitize query content before third-party processing and return a safe-to-send decision in `src/backend/services/semanticPrivacyGuard.js`.
- [ ] T046 [US4] Block third-party AI processing and select keyword fallback whenever PII removal cannot be verified safely in `src/backend/services/semanticSearchOrchestrator.js`.
- [ ] T047 [US4] Exclude original and detected listener identity data from third-party requests, searchable content, diagnostics, and AI-related error payloads in `src/backend/services/semanticSearchOrchestrator.js` and `src/backend/middleware/errorHandler.js`.
- [ ] T048 [US4] Verify the existing search-history, result-label, and error-message paths do not expose listener names or email addresses in `src/frontend/src/context/AppStore.jsx` and `src/frontend/src/pages/Search/SearchPage.jsx`; do not add search-history persistence.

## Phase 7: Polish and Cross-Cutting Validation

- [ ] T049 Add end-to-end coverage for natural-language search, playable results, privacy gating, fallback, and recovery in `src/frontend/e2e/semantic-search.spec.js`.
- [ ] T050 Evaluate at least 100 representative mood/context queries on the 1–5 relevance scale, count scores 4–5 as relevant, and allow multiple reasonable interpretations in `src/backend/evaluation/semantic-search-relevance.md`.
- [ ] T051 Measure SC-001 through SC-007, including 80% relevance, 90% first-attempt usability, 95% visible results within 3 seconds, 99% graceful fallback, 100% PII exclusion, fewer than 1% duplicate result sets, and 90% fallback-mode comprehension in `src/backend/evaluation/semantic-search-results.md`.
- [ ] T052 Add regression coverage for `/search` navigation, metadata and lyrics tabs, keyword search, playback, auth/health routes, and responsive shell behavior in `src/frontend/e2e/semantic-search-regression.spec.js`.
- [ ] T053 Verify responsive entry, dropdown, result, fallback, and empty/unavailable layouts against the feature screenshots without adding unapproved playlist or explanation fields in `src/frontend/src/components/search/SemanticSearch.jsx` and `src/frontend/src/pages/Search/SearchPage.jsx`.

## Dependencies and Execution Order

- Phase 1 decisions block dependent implementation: T001-T004 and T007 gate the API/service/ranking boundary; T005 gates catalog mapping; T006 gates privacy detection; T010 gates automated test execution. T008 records an already-confirmed threshold rather than leaving it as an open decision.
- Complete Phase 2 before story implementation. T012 and T014 depend on approved contracts and catalog decisions; T013 is required before overlapping semantic and fallback requests are integrated.
- The user-story order is US1 -> US2 -> US3 -> US4 for the initial MVP path. US2, US3, and US4 can proceed independently after their relevant Phase 1 gates and Phase 2 foundations; outbound semantic requests must remain blocked until the US4 privacy gate is implemented.
- Within each story, complete the test tasks before their corresponding implementation tasks. T021 must not enable third-party processing until T045-T047 are complete.
- Phase 7 acceptance evaluation depends on the semantic ranking, privacy, fallback, and UI behavior from Phases 3-6.

## Parallel Execution Examples

- **US1**: After Phase 2, T015 and T016 can run in parallel because they cover separate test files; implement T020 before integrating T022-T025. Keep T021 gated by the completed US4 privacy boundary.
- **US2**: After T004 and T005, T026 and T027 can run in parallel in the ranking test file only if the test harness supports isolated test ownership; otherwise implement them in sequence. T028-T031 depend on the confirmed score owner, data mapping, and tie-breaker.
- **US3**: T033 and T034 can run in parallel across backend and frontend test files after T007; implement the backend fallback path before connecting the UI indicator and empty states.
- **US4**: T041 and T042 can run in parallel in separate privacy test files after T006; implement T043-T047 only after the tests and privacy decisions are ready.

## Implementation Strategy

1. Resolve and record all applicable Phase 1 gates; do not select unapproved providers, APIs, data sources, or schemas.
2. Establish the shared adapter, request identity, and approved result mapping in Phase 2.
3. Deliver US1 as the first user-visible increment, but keep outbound semantic processing disabled until the US4 privacy gate is complete.
4. Add US2 ranking, US3 graceful fallback, and US4 privacy protection as independently testable story increments.
5. Complete Phase 7 evaluation and regression checks. Do not claim readiness for production until catalog, API, provider, privacy policy, and constitution gates are resolved.

**MVP scope**: US1 natural-language query validation, approved semantic results, and playback; service calls remain gated until the US4 privacy implementation and the API/provider decisions are approved.
