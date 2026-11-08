# Tasks: AI Lyrics Search

**Input**: Design documents from `specs/030-search/032-ai-lyrics-search/`

**Prerequisites**: `spec.md`, `plan.md`, `contracts/lyrics-search.md`, `research.md`, `data-model.md`, `quickstart.md`

**Scope**: Feature 032 AI Lyrics Search only. Metadata Search and Semantic Search remain owned by features 031 and 033. Do not invent an AI provider, model, API fields, pagination token, lyric schema, or fallback tie-break rule.

**Testing**: Add focused tests after confirming the existing project test approach; do not add a new runner without approval. Acceptance testing is required by the feature specification and plan.

## Phase 1: Resolve Service, Contract, and Test Gates

**Purpose**: Confirm decisions that the plan and partial contract explicitly leave open before implementation binds to a service, schema, or catalog.

- [ ] T001 Verify and approve the caller-facing lyrics-search route and the backend-to-AI route using `docs/analysis-and-design/api-contract.md` and `specs/030-search/032-ai-lyrics-search/contracts/lyrics-search.md`; record the approved public-to-internal flow.
- [ ] T002 Approve the exact request fields, response fields for song identity and lyric context, shared envelope behavior, and continuation fields for 20-item batches in `specs/030-search/032-ai-lyrics-search/contracts/lyrics-search.md`.
- [ ] T003 Confirm the owner of the public route and internal AI call, runtime/provider, internal authentication, deployment boundary, and secure configuration location in `specs/030-search/032-ai-lyrics-search/plan.md`.
- [ ] T004 Verify the production searchable lyric source, availability/rights assumptions, and song identity/playback mapping in `specs/030-search/032-ai-lyrics-search/data-model.md`; keep `src/frontend/src/utils/mockData.js` as demo data only.
- [ ] T005 Confirm whether the approved response includes a fallback-mode indicator or whether the client should infer fallback mode from the local 503/timeout transition in `specs/030-search/032-ai-lyrics-search/contracts/lyrics-search.md`.
- [ ] T006 Confirm with the spec owner whether the clarified 3-second threshold in `specs/030-search/032-ai-lyrics-search/plan.md` supersedes the stale 5-second wording in `specs/030-search/032-ai-lyrics-search/spec.md`; keep the decision as an implementation gate and do not edit the spec during task generation.
- [ ] T007 Verify the approved fallback normalization rules for punctuation and diacritics and obtain approval for a deterministic equal-rank tie-break in `specs/030-search/032-ai-lyrics-search/plan.md`; do not select unapproved matcher rules.
- [ ] T008 Verify constitution ratification status in `.specify/memory/constitution.md` and record the governance gate without inventing project principles.
- [ ] T009 Confirm the existing frontend/backend test tooling and test locations in `src/frontend/package.json` and `src/backend/package.json` before adding test dependencies.

---

## Phase 2: Foundational AI Service Boundary

**Purpose**: Implement the approved public-to-internal service path and common error behavior before frontend story integration.

- [ ] T010 Add contract tests in `src/backend/tests/lyricsSearch.integration.test.js` or `src/ai-service/tests/lyricsSearch.integration.test.js` at the confirmed service owner for the approved public request/response mapping and shared success/error envelope before implementing the route or proxy.
- [ ] T011 Integrate the approved AI provider/runtime at the confirmed owner in `src/backend/` or `src/ai-service/` using the approved secure configuration and authentication from T003; keep provider credentials out of frontend code and source control.
- [ ] T012 Implement the approved caller-facing route or proxy at the confirmed owner in `src/backend/server.js` or the approved service entry point, preserving existing middleware, Public/Listener access, and keeping the internal AI service inaccessible directly from the browser.
- [ ] T013 Map the approved lyrics request and response fields at the confirmed service boundary under `src/backend/` or `src/ai-service/` without adding undocumented fields.
- [ ] T014 Map HTTP 503 to the shared `AI_SERVICE_UNAVAILABLE` response at the confirmed service boundary under `src/backend/` or `src/ai-service/` while preserving the shared API envelope.
- [ ] T015 Map HTTP 429 to a retryable `RATE_LIMITED` response at the confirmed service boundary under `src/backend/` or `src/ai-service/` and keep it distinct from service unavailability.
- [ ] T016 Map other AI-service and catalog failures at the confirmed service boundary under `src/backend/` or `src/ai-service/` to the approved error response without returning success or exposing internal details.

---

## Phase 3: User Story 1 - Find a Song from a Lyric Fragment (Priority: P1)

**Goal**: Let Public and Listener users submit an incomplete lyric fragment and find an identifiable, playable song through the approved AI boundary.

**Independent Test**: Submit a valid fragment from known lyrics and verify that the approved response yields an identifiable song result; invalid fragments send no request.

### Tests for User Story 1

- [ ] T017 [P] [US1] Add query validation and normalization tests in `src/frontend/src/pages/Search/useLyricsSearch.test.js` for trimming, whitespace, punctuation, case, diacritics, at least 3 words, and at most 200 characters.
- [ ] T018 [P] [US1] Add API adapter tests in `src/frontend/src/services/aiLyricsSearchApi.test.js` for approved request serialization, response mapping, and shared success/error envelopes without asserting undocumented fields.

### Implementation for User Story 1

- [ ] T019 [US1] Create the frontend lyrics-search API adapter in `src/frontend/src/services/aiLyricsSearchApi.js` to call only the approved caller-facing route and use only T002's approved request fields.
- [ ] T020 [US1] Map the approved song identity and lyric-context response fields into a lyrics result view model in `src/frontend/src/services/aiLyricsSearchApi.js`.
- [ ] T021 [US1] Validate lyric fragments in `src/frontend/src/pages/Search/useLyricsSearch.js` after trimming and whitespace normalization; require at least 3 words and at most 200 characters, show feedback, and send no request for invalid input.
- [ ] T022 [US1] Prevent duplicate submissions of the same in-flight query in `src/frontend/src/pages/Search/useLyricsSearch.js`.
- [ ] T023 [US1] Associate AI, fallback, and pagination requests with the current search identity in `src/frontend/src/pages/Search/useLyricsSearch.js` so stale results, errors, banners, and pagination cannot replace current state; cancel older requests only when supported.
- [ ] T024 [US1] Reset results, pagination, errors, and fallback notice when a new lyric query is submitted in `src/frontend/src/pages/Search/useLyricsSearch.js`.
- [ ] T025 [US1] Implement 20-song batches and Load More state in `src/frontend/src/pages/Search/useLyricsSearch.js` using only the approved continuation fields from T002 and preventing stale batch appends.
- [ ] T026 [US1] Integrate `useLyricsSearch` into the AI Lyrics tab in `src/frontend/src/pages/Search/SearchPage.jsx` while preserving `/search?type=lyrics` navigation and the Metadata/Semantic tab boundaries.
- [ ] T027 [US1] Connect lyric-result selection to the existing `PlayerContext` and `AppStore` playback checks in `src/frontend/src/pages/Search/SearchPage.jsx`.

---

## Phase 4: User Story 2 - Understand Search Results and Empty Matches (Priority: P1)

**Goal**: Show enough approved song information to identify a result and make no-match and superseded-query outcomes clear.

**Independent Test**: Search a known fragment and a fragment with no match; verify identifiable results and lyric context for the first, explicit guidance for the second, and no stale results after a newer query.

- [ ] T028 [P] [US2] Add component tests in `src/frontend/src/pages/Search/SearchPage.test.jsx` for result identity, lyric context, no-results guidance, and current-query result display.
- [ ] T029 [US2] Render lyric results with approved identifying metadata and matching lyric context in `src/frontend/src/pages/Search/SearchPage.jsx` using existing `SongRow` and cover components.
- [ ] T030 [US2] Render an explicit no-results state with guidance in `src/frontend/src/pages/Search/SearchPage.jsx` when the approved AI result and any applicable fallback contain no matches.

---

## Phase 5: User Story 3 - Continue Searching When AI Search Is Unavailable (Priority: P1)

**Goal**: Automatically use lyrics-only keyword fallback for HTTP 503 or the resolved timeout while keeping rate limits and other failures distinct.

**Independent Test**: Simulate HTTP 503 and the confirmed timeout; verify automatic lyrics-only fallback and the dismissible notice. Simulate HTTP 429 and another error; verify no fallback and an appropriate error state.

### Tests for User Story 3

- [ ] T031 [P] [US3] Add lyrics-only fallback matcher tests in `src/frontend/src/utils/lyricsFallbackSearch.test.js` for exact-phrase precedence, query-word ranking, exclusion of title/artist/album/playlist-only matches, and the approved tie-break rule.
- [ ] T032 [P] [US3] Add service-boundary tests in `src/backend/tests/lyricsSearch.integration.test.js` or `src/ai-service/tests/lyricsSearch.integration.test.js` at the confirmed owner for 503, 429, other failures, and approved response mapping.
- [ ] T033 [P] [US3] Add lyrics-search state tests in `src/frontend/src/pages/Search/useLyricsSearch.test.js` for 503 fallback, timeout fallback, 429 non-fallback, other errors, fallback failure, and stale AI responses.
- [ ] T034 [P] [US3] Add component tests in `src/frontend/src/pages/Search/SearchPage.test.jsx` for the fallback banner, dismissal, reset on new search, rate-limit feedback, and fallback failure states.

### Implementation for User Story 3

- [ ] T035 [US3] Start normalized-lyrics fallback automatically after HTTP 503 in `src/frontend/src/pages/Search/useLyricsSearch.js` without another user submission.
- [ ] T036 [US3] Start the same fallback when the AI request has not completed within the confirmed 3-second threshold in `src/frontend/src/pages/Search/useLyricsSearch.js`; guard the transition against late AI responses.
- [ ] T037 [US3] Keep HTTP 429 in a retryable rate-limit state and prevent fallback for HTTP 429 and other failures in `src/frontend/src/pages/Search/useLyricsSearch.js`.
- [ ] T038 [US3] Implement an independently testable lyrics-only fallback matcher in `src/frontend/src/utils/lyricsFallbackSearch.js` using the confirmed lyric source from T004 and approved normalization behavior.
- [ ] T039 [US3] Rank fallback matches by exact normalized phrase first and then by the number of matching normalized query words in `src/frontend/src/utils/lyricsFallbackSearch.js`, applying only the approved tie-break from T007.
- [ ] T040 [US3] Exclude title-, artist-, album-, and playlist-only matches from fallback results in `src/frontend/src/utils/lyricsFallbackSearch.js`.
- [ ] T041 [US3] Track fallback mode in `src/frontend/src/pages/Search/useLyricsSearch.js` using only the approved response indicator or client transition from T005.
- [ ] T042 [US3] Preserve distinct no-results and error states when fallback returns no matches or fails in `src/frontend/src/pages/Search/useLyricsSearch.js`.
- [ ] T043 [US3] Render a dismissible inline fallback notice above fallback results in `src/frontend/src/pages/Search/SearchPage.jsx`; keep it until dismissal or a new search.
- [ ] T044 [US3] Render distinct loading, unavailable-service, retryable rate-limit, other-error, and fallback-failure states with retry actions where approved in `src/frontend/src/pages/Search/SearchPage.jsx`, without showing stale results as current.

---

## Phase 6: Polish, Acceptance, and Regression

**Purpose**: Validate complete user journeys and existing application behavior without extending feature scope.

- [ ] T045 [P] Add end-to-end acceptance coverage in `tests/e2e/032-ai-lyrics-search.test.js` for incomplete fragments, normalized query variations, matching results, playback, and Load More batches of 20.
- [ ] T046 [P] Add end-to-end fallback coverage in `tests/e2e/032-ai-lyrics-search.test.js` for HTTP 503, the resolved timeout, banner behavior, fallback no-results, HTTP 429 non-fallback, and newer queries superseding older requests.
- [ ] T047 Verify `/search` navigation, Metadata and Semantic tabs, normal playback, auth/health routes, and responsive layout in `tests/e2e/032-ai-lyrics-search.test.js` without implementing features 031 or 033.
- [ ] T048 Run the approved feature validation commands from `specs/030-search/032-ai-lyrics-search/quickstart.md` after the contract, service, lyric source, and test runner gates are resolved.
- [ ] T049 Evaluate the spec's 90% recognition/next-action success criterion with representative Public and Listener users and record the outcome in `specs/030-search/032-ai-lyrics-search/quickstart.md`.

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1** blocks implementation: approve the route, schema, service owner/runtime/authentication, production lyric source, mode indication, timeout wording, fallback tie-break, constitution status, and test approach.
- **Phase 2** depends on T001–T003 and implements the approved service boundary before the frontend API adapter.
- **Phase 3 (US1)** depends on Phase 2 and the approved request/response/continuation fields from T002.
- **Phase 4 (US2)** depends on the result mapping and current-query state from US1.
- **Phase 5 (US3)** depends on the approved lyric source and tie-break from T004/T007 and the API/error boundary from Phases 1–2.
- **Phase 6** depends on all user-story implementation and the confirmed test tooling from T009.

### User Story Dependencies

- **US1 (P1)** delivers validated lyric search, identifiable AI matches, request safety, playback, and 20-item pagination after the service contract gates are resolved.
- **US2 (P1)** depends on US1's result mapping and request identity; it adds focused result and empty-state behavior.
- **US3 (P1)** depends on the approved service boundary and lyric source; it adds 503/3-second fallback and distinct error handling.

### Parallel Opportunities

- T001–T009 can be investigated independently because they resolve separate implementation decisions.
- After Phase 1, service-boundary tests and frontend validation tests touch separate files; actual frontend API integration still depends on the approved boundary and Phase 2.
- Within Phase 5, matcher, service-boundary, request-state, and component tests can proceed in parallel after the approved interfaces and test harness are available.
- Phase 4 page work and Phase 5 fallback logic should be coordinated where both modify `SearchPage.jsx` or `useLyricsSearch.js`.

### Parallel Execution Examples

After Phase 2 establishes the boundary and Phase 1 confirms the test tooling, these Phase 3 tests touch separate files and can start together:

```text
T017 Add query validation and normalization tests in src/frontend/src/pages/Search/useLyricsSearch.test.js
T018 Add API adapter tests in src/frontend/src/services/aiLyricsSearchApi.test.js
```

After Phase 1 confirms the interfaces and test harness, these Phase 5 tests also use separate files:

```text
T031 Add lyrics-only fallback matcher tests in src/frontend/src/utils/lyricsFallbackSearch.test.js
T032 Add service-boundary tests at the confirmed AI service owner's test location
T034 Add fallback and error-state component tests in src/frontend/src/pages/Search/SearchPage.test.jsx
```

US2 has no safe parallel implementation pair because its page changes share `SearchPage.jsx`; write T027 first, then implement T028 and T029 sequentially.

## Implementation Strategy

1. Resolve Phase 1 gates; do not infer provider, API fields, continuation format, lyric schema, or ranking tie-break.
2. Implement the approved public-to-internal API boundary and error mapping in Phase 2.
3. Deliver US1 as the MVP path for valid lyric queries, identifiable playable results, and 20-item pagination.
4. Complete US2 explicit result and no-results behavior.
5. Complete US3 fallback behavior for HTTP 503 and the confirmed 3-second timeout, while keeping HTTP 429 and other errors distinct.
6. Run acceptance, regression, and quickstart validation only after the remaining design and tooling gates are resolved.
