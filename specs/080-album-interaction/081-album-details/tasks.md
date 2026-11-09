---
description: "Dependency-ordered implementation tasks for Album Details"
---

# Tasks: Album Details

**Input**: Design documents from `specs/080-album-interaction/081-album-details/`

**Prerequisites**: `plan.md` and `spec.md`; supporting inputs are `research.md`, `data-model.md`, `contracts/README.md`, and `quickstart.md`.

**Tests**: The specification requires independent acceptance checks for all three user stories. The repository test runner is not declared, so identify and use the existing approved harness before adding automated tests; do not add a test dependency without approval.

**Organization**: Tasks are grouped by user story after shared contract and data-access prerequisites. Every task is limited to Feature 081 and uses existing AuraTune components and state patterns.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the external and repository prerequisites without inventing an API contract, catalog source, or test framework.

- [ ] T001 Identify the approved public `GET /albums/:id` contract owner and source of truth, including the service provider, route/base-path alignment, response mapping, and complete ordered track-list guarantee; record the confirmed reference in `specs/080-album-interaction/081-album-details/contracts/README.md`.
- [ ] T002 Confirm which existing approved catalog source supplies other albums by artist; keep the finding or unresolved blocker in `specs/080-album-interaction/081-album-details/research.md` and do not add album-detail response fields.
- [ ] T003 Identify the repository-approved frontend component/interaction test harness and available API fixtures from package manifests and test configuration; record runnable commands and test locations in `specs/080-album-interaction/081-album-details/quickstart.md` without adding dependencies.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish contract-backed frontend access and same-ID shared cache behavior used by the stories.

- [ ] T004 Implement a frontend album-details service in `src/frontend/src/services/albumDetailsService.js` that calls only the approved public `GET /albums/:id` route and maps only fields defined by its confirmed contract; do not create a backend route or infer a payload schema.
- [ ] T005 Extend `src/frontend/src/context/AppStore.jsx` to retain successful album-detail responses in the existing in-memory store keyed by album ID, without adding persistence or a cache TTL.
- [ ] T006 Add album request coordination in `src/frontend/src/context/AppStore.jsx` so each response is associated with its requested album ID and stale cross-ID results cannot replace the current album; preserve same-ID cached details while refresh is pending or fails.

**Checkpoint**: The approved API and related-album catalog source are confirmed, the service uses that contract, and same-ID cache identity is available before story work.

---

## Phase 3: User Story 1 - View Album Information (Priority: P1) - MVP

**Goal**: Display the current album's available metadata, release type, total duration, ordered tracks, and same-artist releases with correct loading and return behavior.

**Independent Test**: Open a known album anonymously and compare its visible metadata and track order with the approved response; verify one-track/two-track release type, complete-response duration aggregation, loading identity, and same-ID cached return refresh.

### Tests for User Story 1

- [ ] T007 [P] [US1] Add presentation tests for release type at one versus two tracks, `m:ss`/`h:mm:ss` boundaries, aggregation across all known durations, unavailable aggregate when no duration is known, and the valid zero sum in the repository-approved frontend test location identified by T003.
- [ ] T008 [P] [US1] Add request-state tests for initial loading, anonymous success, same-ID cached render and refresh, refresh failure retaining same-ID details, and a late old-ID response in the repository-approved frontend test location identified by T003.

### Implementation for User Story 1

- [ ] T009 [US1] Update `src/frontend/src/pages/Album/AlbumPage.jsx` to load the route's current album ID through the album-details service and render loading and success states without showing another album's data as current.
- [ ] T010 [US1] Update `src/frontend/src/pages/Album/AlbumPage.jsx` to render available title, artist, release year, cover art, and a `Single` badge for one track or `Album` badge for two or more tracks, preserving the existing route in `src/frontend/src/routes/AppRouter.jsx`.
- [ ] T011 [US1] Update `src/frontend/src/components/playlist/CoverArt.jsx` to render supplied cover art inside the existing responsive frame and retain its placeholder when the image is unavailable.
- [ ] T012 [US1] Update `src/frontend/src/pages/Album/AlbumPage.jsx` to render one flat track list in API response order without requiring disc metadata or changing the complete response.
- [ ] T013 [US1] Update `src/frontend/src/pages/Album/AlbumPage.jsx` to calculate total duration from all known durations in the complete response, independent of progressive row rendering, and show it as unavailable when no duration is known.
- [ ] T014 [US1] Update `src/frontend/src/pages/Album/AlbumPage.jsx` to display "More from [Artist]" using the confirmed existing catalog source, filtering to the same artist and excluding the current album without extending the detail API.
- [ ] T015 [US1] Add a loading presentation for Album Details using existing shared UI in `src/frontend/src/components/common/ui.jsx` and `src/frontend/src/pages/Album/AlbumPage.jsx`.
- [ ] T016 [US1] Verify the User Story 1 acceptance scenarios and SC-001, SC-005, and SC-006 using representative fixtures and commands recorded in `specs/080-album-interaction/081-album-details/quickstart.md`.

**Checkpoint**: User Story 1 displays current-album metadata, complete ordered track data, derived duration, related releases, and correct cached-return behavior independently.

---

## Phase 4: User Story 2 - Review Track-Level Play Counts (Priority: P1)

**Goal**: Show each track's own non-negative whole-number play count, preserving explicit zero and distinguishing unavailable values.

**Independent Test**: Open an album with distinct per-track counts; verify the count remains attached to its track, is locale-grouped, displays zero explicitly, and displays an em dash when unavailable.

### Tests for User Story 2

- [ ] T017 [P] [US2] Add track-row tests for correct per-track count mapping, locale grouping, explicit zero, and unavailable count display in the repository-approved frontend test location identified by T003.

### Implementation for User Story 2

- [ ] T018 [US2] Update `src/frontend/src/components/song/SongRow.jsx` to format available durations as `m:ss` below one hour and `h:mm:ss` at or above one hour, while displaying an em dash for unavailable durations.
- [ ] T019 [US2] Update `src/frontend/src/components/song/SongRow.jsx` to display each track's own non-negative whole-number play count with locale grouping, preserve zero, and display an em dash instead of converting missing counts to zero.
- [ ] T020 [US2] Update `src/frontend/src/components/song/SongTable.jsx` and `src/frontend/src/pages/Album/AlbumPage.jsx` to pass each response track's own count and duration to its row without changing API order or assigning another track's values.
- [ ] T021 [US2] Verify the User Story 2 acceptance scenarios and SC-002 through SC-004 using representative known, zero, and unavailable count values recorded in `specs/080-album-interaction/081-album-details/quickstart.md`.

**Checkpoint**: Every displayed track retains its own accurately formatted count and duration, including explicit zero and unavailable values.

---

## Phase 5: User Story 3 - Handle Missing or Unavailable Album Details (Priority: P2)

**Goal**: Distinguish a missing album from a retryable service failure and avoid misleading stale content.

**Independent Test**: Request a nonexistent album and separately simulate a network/service failure; verify a clear not-found state for the first, a retry action for the second, and no unrelated album data in either case.

### Tests for User Story 3

- [ ] T022 [P] [US3] Add request-state tests for not-found, network/service failure, retry success, empty track list, missing metadata, missing cover, and unavailable aggregate duration in the repository-approved frontend test location identified by T003.

### Implementation for User Story 3

- [ ] T023 [US3] Update `src/frontend/src/pages/Album/AlbumPage.jsx` to distinguish the approved API's not-found response from network/service failures and render the existing shared not-found or error presentation from `src/frontend/src/components/common/ui.jsx`.
- [ ] T024 [US3] Add a retry action for network/service failures in `src/frontend/src/pages/Album/AlbumPage.jsx`; when refreshing cached data fails, retain only same-ID details and show a clear refresh-failure indication.
- [ ] T025 [US3] Update `src/frontend/src/pages/Album/AlbumPage.jsx` to render the empty-track state and avoid inventing unavailable metadata, cover art, or total duration when no duration is known.
- [ ] T026 [US3] Verify the User Story 3 acceptance scenarios and SC-005 with not-found, service-failure/retry, empty-list, and missing-field fixtures in `specs/080-album-interaction/081-album-details/quickstart.md`.

**Checkpoint**: Missing albums, temporary failures, retries, and empty or incomplete details produce clear states without unrelated or invented data.

---

## Phase 6: Polish & Cross-Cutting Validation

**Purpose**: Validate anonymous contract integration, responsive behavior, and all acceptance criteria together.

- [ ] T027 Add API integration/contract checks for anonymous access, approved response mapping, per-track play-count association, complete ordered track aggregation, and the confirmed related-album source in the repository-approved API test location identified by T003.
- [ ] T028 Verify the album details view at responsive layouts, including the cover placeholder frame, with the acceptance walkthrough in `specs/080-album-interaction/081-album-details/quickstart.md`.
- [ ] T029 Run the frontend build and every confirmed Feature 081 test/acceptance command recorded in `specs/080-album-interaction/081-album-details/quickstart.md`; record outcomes there without claiming unavailable test tooling.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No implementation dependencies. T001 and T002 resolve blocking integration facts; T003 identifies the existing validation harness.
- **Foundational (Phase 2)**: Depends on the approved contract from T001; T004 precedes the store and page integrations. T005 and T006 establish shared same-ID cache behavior before the user stories.
- **User Stories**: Depend on the foundational service and store. US1 and US2 are both P1; US2 uses the track rows introduced in US1, so integrate US1's ordered rows before completing US2. US3 adds failure and retry states over the shared request flow.
- **Polish (Phase 6)**: Depends on all three stories and confirmed API/test prerequisites.

### User Story Dependencies

- **US1 (P1)**: Starts after Phases 1-2; establishes the album page and ordered track-list presentation.
- **US2 (P1)**: Starts after Phases 1-2 and depends on US1's track-list integration so row formatting is tested against actual response mapping.
- **US3 (P2)**: Starts after Phases 1-2; completes the shared request lifecycle with not-found, failure, retry, and empty-data states.

### Parallel Opportunities

- T001, T002, and T003 can proceed in parallel because they confirm separate external/repository prerequisites.
- After T003, US1 presentation tests (T007) and request-state tests (T008) can proceed in parallel; independent `CoverArt.jsx` work (T011) can proceed alongside AlbumPage work once its existing component interface is preserved.
- US2 row tests (T017) can proceed alongside US1 page work after the harness is identified; row duration and count formatting tasks (T018-T019) touch the same file and should be done together or sequentially.
- US3 request tests (T022) can be prepared alongside UI implementation; T023 and T024 both touch `AlbumPage.jsx` and should be integrated sequentially.

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1 and resolve the approved API contract, related-album catalog source, and test-harness prerequisites.
2. Complete Phase 2 to provide contract-backed data access and same-ID cache behavior.
3. Complete Phase 3 and validate User Story 1 independently against the acceptance walkthrough.
4. Add User Story 2 track counts, then User Story 3 failure and retry states.

### Incremental Delivery

Deliver each story after its independent acceptance checks pass. Keep API ownership, route/base-path, response mapping, related-album source, and test harness as explicit gates; do not substitute an invented endpoint, schema, catalog source, or dependency.

## Notes

- All tasks are scoped to Feature 081. No database migration or backend endpoint creation is planned unless the approved contract owner establishes that the existing provider is absent and confirms ownership; that architectural decision is outside this task breakdown.
- `[P]` marks work that can proceed independently without editing the same file or waiting on another task.
- The current feature introduces no writes, durable entities, API payload fields, or cache persistence.
