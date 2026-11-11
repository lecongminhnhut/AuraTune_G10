---
description: "Dependency-ordered implementation tasks for Album Tracklist Playback"
---

# Tasks: Album Tracklist Playback

**Input**: Design documents from `specs/080-album-interaction/082-album-tracklist/`

**Prerequisites**: `plan.md` and `spec.md`; supporting artifacts are `research.md`, `data-model.md`, `contracts/README.md`, and `quickstart.md`.

**Tests**: The specification marks its user scenarios and testing as mandatory. The repository test runner is not declared, so confirm the approved harness and fixtures before adding automated tests; do not add a test dependency without approval.

**Organization**: Tasks follow the three P1 user stories. Shared player and queue changes remain gated by the unresolved requirements and Group 040/050 contracts recorded in the plan.

## Phase 1: Setup (Shared Prerequisites)

**Purpose**: Resolve cross-feature behavior and validation prerequisites without changing another feature's contract.

- [x] T001 Investigate and obtain requirements-owner resolution for Play Album queue replacement in FR-004 versus insertion/preservation in the clarification, assumptions, and repeated-play behavior before implementing queue mutation; do not select a policy while this conflict remains open.
- [x] T002 Investigate and obtain requirements-owner and Group 050-owner resolution for the 50-item queue limit versus full playback and Add all behavior for albums with 100 or more tracks; retain the Group 050 limit until the conflict is resolved.
- [x] T003 Identify the Group 040 player error/recovery contract and owner for a track that becomes unavailable at playback time; do not define a new callback or skip policy in Feature 082.
- [x] T004 Confirm that album playback and selected-track insertion can coexist with the approved repeat-play segment identity and duplicate-handling behavior in the shared player/queue state.
- [x] T005 Confirm the existing frontend test runner, fixtures, and test locations from repository configuration, then record supported test commands in `specs/080-album-interaction/082-album-tracklist/quickstart.md` without adding dependencies.
- [x] T006 Confirm the active Group 050 queue persistence behavior against browser-local persistence and paused-on-reload requirements before relying on it for Feature 082 playback state.

---

## Phase 2: Foundational (Shared Track and Player Integration)

**Purpose**: Establish the complete album track set and reuse the existing shared player boundary.

- [ ] T007 Update `src/frontend/src/pages/Album/AlbumPage.jsx` to derive the visible album tracklist from the complete ordered `AppStore.allTracks` set instead of the filtered `publicTracks` set.
- [ ] T008 Update `src/frontend/src/pages/Album/AlbumPage.jsx` to consult existing `AppStore.isPlayable` and `AppStore.trackStatus` for eligibility while retaining catalog order and unavailable entries in the visible list.
- [ ] T009 Verify the shared player operations exposed through `src/frontend/src/context/PlayerContext.jsx` and wired in `src/frontend/src/App.jsx` before adding album-specific behavior; reuse these operations without creating AlbumPage-local player state.

**Checkpoint**: The page has the complete ordered source list, existing availability state, and a confirmed shared-player integration boundary.

---

## Phase 3: User Story 1 - Browse an Album Tracklist (Priority: P1) - MVP

**Goal**: Display all album tracks in artist-intended order, including unavailable tracks and long or empty albums.

**Independent Test**: Open an album with a known ordered catalog list and verify every track appears exactly once in that order; verify empty and long-list behavior independently of playback.

### Tests for User Story 1

- [ ] T010 [P] [US1] Add tracklist acceptance tests for exact order, completeness, empty albums, and progressive rendering with the approved frontend test harness and fixture location identified by T005.

### Implementation for User Story 1

- [ ] T011 [US1] Update `src/frontend/src/components/song/SongRow.jsx` to support a disabled play action and the existing generic unavailable reason while preserving default behavior for other consumers.
- [ ] T012 [US1] Update `src/frontend/src/components/song/SongTable.jsx` to pass per-track availability and disabled/reason presentation to rows without changing supplied row order or default behavior for existing consumers.
- [ ] T013 [US1] Update `src/frontend/src/pages/Album/AlbumPage.jsx` to render the complete artist-intended ordered tracklist with each track individually identifiable and playable rows exposing their play action.
- [ ] T014 [US1] Update `src/frontend/src/pages/Album/AlbumPage.jsx` to keep unavailable tracks visible in their catalog position, disable their play action, and show the existing generic unavailable reason.
- [ ] T015 [US1] Update `src/frontend/src/pages/Album/AlbumPage.jsx` to show a clear empty state and suppress Play Album when the album has no tracks or no playable tracks, without mutating player or queue state.
- [ ] T016 [US1] Keep the complete ordered track collection available to album actions in `src/frontend/src/pages/Album/AlbumPage.jsx` when `src/frontend/src/components/song/SongTable.jsx` progressively renders rows.
- [ ] T017 [US1] Validate FR-001, FR-002, FR-005, FR-010, FR-011, FR-015, SC-001, SC-007, and SC-009 using representative data and the walkthrough in `specs/080-album-interaction/082-album-tracklist/quickstart.md`.

**Checkpoint**: Browsing works independently, including empty and very long albums; unavailable tracks remain visible and disabled.

---

## Phase 4: User Story 2 - Play an Entire Album (Priority: P1)

**Goal**: Start from the first playable track, coordinate the full playable album sequence with the shared player and queue, disable Shuffle, and preserve persistent/editable shared controls.

**Independent Test**: After the queue policy prerequisites are resolved, select Play Album and verify the first playable current track, the approved ordered queue, Shuffle behavior, unavailable-track handling, repeat behavior, and navigation persistence.

### Tests for User Story 2

- [ ] T018 [P] [US2] Add shared-player integration tests for Play Album start position, ordered playable sequence, Shuffle reset, no-playable no-op, and repeat behavior using the approved test harness identified by T005; keep queue-policy assertions blocked until T001, T002, and T004 are resolved.
- [ ] T019 [P] [US2] Add navigation integration tests confirming `src/frontend/src/components/player/BottomPlayer.jsx` and `src/frontend/src/components/player/QueuePanel.jsx` retain shared playback state after route changes.

### Implementation for User Story 2

- [ ] T020 [US2] Update `src/frontend/src/pages/Album/AlbumPage.jsx` to construct Play Album candidates from the complete ordered album list, filter by current playability, and avoid relying on rendered rows.
- [ ] T021 [US2] Update the shared player integration in `src/frontend/src/App.jsx` and `src/frontend/src/hooks/useMockPlayer.js` to turn Shuffle off and start the first playable album track only after the approved Play Album queue policy from T001 is recorded.
- [ ] T022 [US2] Update `src/frontend/src/hooks/useMockPlayer.js` to rebuild the album queue segment without duplicate album entries on repeated Play Album while preserving non-album tracks according to the approved behavior from T001 and T004.
- [ ] T023 [US2] Update `src/frontend/src/pages/Album/AlbumPage.jsx` to keep Play Album unavailable when the album has no playable tracks and leave current player and queue state unchanged.
- [ ] T024 [US2] Integrate unavailable-track filtering and generic unavailable feedback through `src/frontend/src/App.jsx` and `src/frontend/src/context/PlayerContext.jsx` so later playable album tracks remain eligible without introducing a new availability taxonomy.
- [ ] T025 [US2] Integrate playback-time unavailable-track recovery through `src/frontend/src/hooks/useMockPlayer.js` only after the approved Group 040 recovery contract from T003 is identified; do not substitute an unrelated track.
- [ ] T026 [US2] Verify persistent player and editable queue behavior through the existing `src/frontend/src/components/player/BottomPlayer.jsx` and `src/frontend/src/components/player/QueuePanel.jsx` without redesigning Group 040/050 surfaces.
- [ ] T027 [US2] Validate FR-003, FR-004, FR-007, FR-008, FR-009, FR-011 through FR-015, SC-002, SC-004, and SC-006 through SC-009 against the approved queue and recovery policies using `specs/080-album-interaction/082-album-tracklist/quickstart.md`.

**Checkpoint**: Album playback is integrated with global player state and the resolved shared queue policy; no separate player or guessed queue semantics are introduced.

---

## Phase 5: User Story 3 - Play a Selected Track (Priority: P1)

**Goal**: Start a selected playable album track and place only its later playable album tracks before existing upcoming tracks.

**Independent Test**: Select a playable middle track; verify it becomes current, only later playable album tracks follow in album order, existing upcoming tracks remain after them, and an unavailable selection cannot start playback.

### Tests for User Story 3

- [ ] T028 [P] [US3] Add selected-track integration tests for current-track selection, later-track ordering, preservation of existing upcoming tracks, and unavailable-track refusal using the approved frontend test harness identified by T005.

### Implementation for User Story 3

- [ ] T029 [US3] Update `src/frontend/src/pages/Album/AlbumPage.jsx` to pass the selected playable track and only the later playable album tracks, in catalog order, to the existing shared player operation.
- [ ] T030 [US3] Update the shared player integration in `src/frontend/src/App.jsx` and `src/frontend/src/hooks/useMockPlayer.js` to make the selected track current and place its remaining album segment before prior upcoming tracks according to the approved shared queue contract.
- [ ] T031 [US3] Update `src/frontend/src/components/song/SongRow.jsx` and `src/frontend/src/pages/Album/AlbumPage.jsx` to prevent an unavailable row from starting playback and to use existing player feedback without substituting another track.
- [ ] T032 [US3] Validate FR-005 through FR-009, SC-003, and SC-004 for selected-track playback using `specs/080-album-interaction/082-album-tracklist/quickstart.md`.

**Checkpoint**: A selected track starts through the shared player and only its remaining playable album tracks are scheduled according to the approved queue behavior.

---

## Phase 6: Polish & Cross-Cutting Validation

**Purpose**: Verify bulk queue addition, queue capacity, long-list playback, and all acceptance scenarios without exceeding shared feature ownership.

- [ ] T033 [P] [US2] Add integration tests for Add all to queue confirming current playback continues, additions are requested in album order, and duplicate/capacity behavior follows Group 050 using its approved fixtures and the harness from T005.
- [ ] T034 [US2] Update `src/frontend/src/pages/Album/AlbumPage.jsx` to expose Add all to queue through the existing `PlayerContext` bulk-add operation, appending playable album tracks without interrupting current playback and following the approved Group 050 rules.
- [ ] T035 Verify queue capacity and bulk-add feedback through `src/frontend/src/hooks/useMockPlayer.js` only against the resolved requirement from T002 and Group 050's existing 50-item rule; do not silently truncate, remove the limit, or add chunked playback.
- [ ] T036 Verify responsive tracklist layouts and the long-album case with at least 100 tracks using the acceptance walkthrough in `specs/080-album-interaction/082-album-tracklist/quickstart.md`.
- [ ] T037 Run the frontend build and confirmed Feature 082 acceptance/integration checks recorded in `specs/080-album-interaction/082-album-tracklist/quickstart.md`, including representative listener validation for SC-005; record unresolved blocked cases without claiming unavailable test tooling.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No code dependency. T001, T002, T003, T005, and T006 are blocking confirmations for the respective queue, recovery, and validation paths; T004 depends on T001 and the shared player/queue owners.
- **Foundational (Phase 2)**: Establishes the complete ordered track source, availability mapping, and current shared player boundary before story integration.
- **User Stories (Phase 3+)**: All depend on the foundational track source. US2 and US3 both integrate the same shared queue/player; respect the resolved contracts before activating affected queue mutation.
- **Polish (Phase 6)**: Depends on the stories and on resolution of the queue policy, capacity, and recovery requirements for the scenarios it validates.

### User Story Dependencies

- **US1 (P1)**: Can start after the track source and availability mapping in Phase 2; it is the MVP browse increment.
- **US2 (P1)**: Depends on US1's complete ordered list and on queue-policy, capacity, repeat-segment, recovery, and persistence confirmations where applicable.
- **US3 (P1)**: Depends on US1's row playability and track order; insertion semantics must follow the existing approved shared queue contract.

### Parallel Opportunities

- Setup investigations T001, T002, T003, T005, and T006 can proceed independently; T004 depends on the queue policy resolution.
- US1 tracklist tests (T010) can run alongside row work after T005; `SongRow.jsx` (T011) and `AlbumPage.jsx`/`SongTable.jsx` tasks have file overlap and should be sequenced carefully.
- US2 navigation tests (T019) can be prepared independently from album-sequence tests (T018); player-hook changes T021/T022/T025 share `useMockPlayer.js` and should be coordinated.
- US3 tests (T028) can be prepared separately; T029 page wiring should precede shared player behavior T030.
- Cross-cutting Add all tests (T033) can be prepared independently, but execution and acceptance remain gated on T002.

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1 confirmations needed for the test harness and track source.
2. Complete Phase 2 and verify the complete ordered list and availability mapping.
3. Complete Phase 3 and validate the browse story independently, including empty and long albums.
4. Stop before queue mutation work if the blocking queue or shared-player requirements remain unresolved.

### Incremental Delivery

1. Deliver the browsable, complete ordered tracklist with unavailable and empty states.
2. After resolving queue and recovery prerequisites, add Play Album and persistent shared-player integration.
3. Add selected-track playback with later playable album tracks.
4. Add bulk queue append and validate shared capacity/duplicate behavior under Group 050 rules.

## Notes

- All tasks are scoped to Feature 082. No endpoint, payload, database schema, ordering field, player instance, or queue policy is invented.
- Play Album replacement versus insertion, the 50-item queue limit versus complete playback, and playback-time failure recovery remain explicit blockers from `plan.md`.
- `[P]` is used only where the work can proceed independently without editing the same file or depending on incomplete implementation.
