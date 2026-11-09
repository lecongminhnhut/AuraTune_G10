# Tasks: Listening History

**Feature**: [071 Listening History](./spec.md)  
**Plan**: [plan.md](./plan.md)  
**Status**: Draft; implementation tasks remain gated by storage and API approval.

## Phase 1: Approval Gates

- [ ] T001 Confirm canonical persistence engine and authoritative event schema using `docs/design/database/README.md`, `docs/design/database/er-diagram.md`, and `docs/design/database/data-consistency.md`.
- [ ] T002 Approve history record/list/purge routes, payloads, cursor, stable ordering, and shared envelope in `specs/070-listening-history/071-listening-history/contracts/listening-history.md`.
- [ ] T003 Decide playback event identity/idempotency, listened-seconds source, clear-all atomicity, and retention-job ownership in `specs/070-listening-history/research.md`.
- [ ] T004 Select feature-level test tooling and commands in `specs/070-listening-history/071-listening-history/quickstart.md`.

## Phase 2: Foundation

- [ ] T005 Inspect existing playback progress and route/auth patterns in `src/frontend/src/context/PlayerContext.jsx`, `src/frontend/src/context/AppStore.jsx`, and `src/backend/server.js`.
- [ ] T006 Add the approved persistent event model/indexes and 365-day retention mechanism in the selected storage layer, only after T001.
- [ ] T007 Implement authenticated history authorization deriving owner identity from the principal in the backend after T002.
- [ ] T008 Implement a shared history API adapter for approved request/response shapes in `src/frontend/src/` after T002.

## Phase 3: User Story 1 - Record Qualified Plays (P1)

**Goal**: Capture each qualifying session exactly once for the authenticated listener.

**Independent test**: Exercise >=30-second playback, short-track >=90% completion, below-threshold stop, and repeated progress callbacks.

- [ ] T009 [US1] Add qualification and idempotency unit tests in the selected backend/frontend test locations.
- [ ] T010 [US1] Implement per-session qualification for >=30 seconds and short-track >=90% completion in the player playback tracking path.
- [ ] T011 [US1] Implement the approved authenticated record-event operation in the backend history service/route.
- [ ] T012 [US1] Prevent duplicate event creation from repeated progress notifications and approved client retries.
- [ ] T013 [US1] Handle unauthenticated sessions and transient record failures according to the approved contract without adding offline synchronization.

## Phase 4: User Story 2 - View and Replay History (P1)

**Goal**: Browse a private, newest-first, paginated history and replay a track.

**Independent test**: Verify owner-only access, stable pagination, displayed record data, and playback from an entry.

- [ ] T014 [US2] Add contract tests for list authorization, ordering, cursor boundaries, and response shape.
- [ ] T015 [US2] Implement the approved owner-scoped paginated list service and route.
- [ ] T016 [US2] Replace demo-only history loading in `src/frontend/src/pages/History/HistoryPage.jsx` and `src/frontend/src/context/AppStore.jsx` with the approved adapter.
- [ ] T017 [US2] Preserve chronological grouping and display title, artist, optional album, duration, timestamp, and listened duration where available.
- [ ] T018 [US2] Connect history selection to existing playback and add loading, empty, error, and pagination states.
- [ ] T019 [US2] Verify a second authenticated user cannot read another user's history.

## Phase 5: User Story 3 - Clear History and Retain Within Policy (P2)

**Goal**: Let the listener confirm full history removal and ensure cleared/expired events stop contributing to personal data.

**Independent test**: Cancel and confirm purge; verify history, analytics, and recommendation inputs reflect the outcome and retention boundary.

- [ ] T020 [US3] Add tests for confirmation cancellation, successful purge, partial failure, and downstream exclusion.
- [ ] T021 [US3] Implement owner-scoped clear-all according to approved atomicity/deletion semantics.
- [ ] T022 [US3] Update the History UI after success and preserve records with a clear error on failure.
- [ ] T023 [US3] Connect purge state to personal analytics and recommendation input exclusion in the approved data flow.
- [ ] T024 [US3] Implement and observe purge of records older than 365 days according to the approved operational schedule.

## Phase 6: Cross-Cutting Validation

- [ ] T025 Verify first-page load under 1 second for 5,000 records and clear reflection within 500 ms under the defined test conditions.
- [ ] T026 Verify keyboard/screen-reader accessible confirmation and responsive History page states.
- [ ] T027 Update feature docs and traceability only after implemented behavior matches `spec.md`, UC-070-001/002/004/007, and the approved contract.

## Dependencies and Execution

- T001-T004 gate persistence, route, event identity, retention, and automated validation.
- T005 can run while approval decisions are resolved. T006-T008 depend on T001/T002.
- US1 and US2 depend on the shared identity/contract foundation; US3 depends on owner-scoped persistence and analytics/recommendation integration.
- Do not claim production readiness until retention operations, privacy authorization, and cross-feature purge propagation are verified.
