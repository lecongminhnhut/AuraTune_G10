# Tasks: Top Artists and Genres

**Feature**: [073 Top Artists and Genres](./spec.md)  
**Plan**: [plan.md](./plan.md)  
**Status**: Draft; source/API decisions gate implementation.

## Phase 1: Approval Gates

- [ ] T001 Confirm catalog artist identities, multi-genre source, event duration source, and hidden-state semantics in `specs/070-listening-history/073-top-artists-and-genres/data-model.md`.
- [ ] T002 Approve stats route, response shape, timezone/range boundaries, deterministic tie-breakers, genre denominator, and five-event threshold scope in `specs/070-listening-history/073-top-artists-and-genres/contracts/top-artists-and-genres.md`.
- [ ] T003 Select aggregate freshness strategy and feature test tooling in `research.md` and `quickstart.md`.
- [x] T004 Align the existing `spec.md` narrative, user stories, FRs, and acceptance scenarios with the resolved G07 decisions and document prototype gaps.

## Phase 2: Foundation

- [ ] T005 Inspect approved 071 event source and catalog genre/artist relationships.
- [ ] T006 Implement authenticated owner-scoped analytics access in the existing backend after T001/T002.
- [ ] T007 Implement a frontend adapter for approved artist, genre, and track response models.

## Phase 3: User Story 1 - View Top Artists (P1)

**Goal**: See the ten highest-ranked artists for the selected period.

**Independent test**: Verify duration-first ordering and play-count secondary ordering with qualifying event fixtures.

- [ ] T008 [US1] Add aggregate tests for duration ordering, secondary play-count ordering, ties, hidden events, and period boundaries.
- [ ] T009 [US1] Implement up-to-ten artist aggregation in the backend using actual listened duration and qualifying play count.
- [ ] T010 [US1] Render artist identity, duration, play count, and approved profile navigation in `src/frontend/src/pages/History/HistoryPage.jsx`.

## Phase 4: User Story 2 - Analyze Genre Distribution (P1)

**Goal**: Understand preferred genres by qualifying play counts.

**Independent test**: Verify multi-tag increments, percentages/counts, and Other aggregation with controlled fixtures.

- [ ] T011 [US2] Add tests for single/multiple genre tags, long-tail aggregation, missing genre metadata, and range updates.
- [ ] T012 [US2] Implement per-tag play-count aggregation and top 5–10 plus Other in the backend.
- [ ] T013 [US2] Render a responsive genre visualization with accessible count/label text in the History statistics tab.

## Phase 5: User Story 3 - View and Replay Top Tracks (P2)

**Goal**: Replay the most frequently played tracks for a selected range.

**Independent test**: Verify top-ten count ordering and playback from each result.

- [ ] T014 [US3] Add tests for top-track counts, tied ordering, hidden/short/expired exclusions, and playable identity mapping.
- [ ] T015 [US3] Implement up-to-ten track aggregation in the backend.
- [ ] T016 [US3] Render top tracks and connect selection to the existing playback context.

## Phase 6: User Story 4 - Handle Sparse History (P3)

**Goal**: Explain why rankings are absent for a new listener.

**Independent test**: Verify fewer than five qualifying events show the specified state; verify sufficient events show data.

- [ ] T017 [US4] Add tests for the five-event threshold and each component's empty/missing-metadata behavior.
- [ ] T018 [US4] Implement the agreed threshold behavior and "Not enough data yet" state.

## Phase 7: Cross-Cutting Validation

- [ ] T019 Verify hidden/cleared changes are reflected after re-aggregation and no other user's data is returned.
- [ ] T020 Measure under 1.5-second load/render and <=500ms post-fetch range update; verify 320px–1920px+ responsive behavior.
- [ ] T021 Reconcile UC-070-006 prototype coverage gaps and update traceability after behavior is approved.

## Dependencies

T001-T004 block implementation. Artist, genre, and track stories can proceed independently after the shared API/data foundation. Playback for top tracks reuses existing player behavior. Do not preserve the prototype's conflicting genre-duration metric in place of FR-002's play-count requirement.
