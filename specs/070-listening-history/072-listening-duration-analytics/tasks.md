# Tasks: Listening Duration Analytics

**Feature**: [072 Listening Duration Analytics](./spec.md)  
**Plan**: [plan.md](./plan.md)  
**Status**: Draft; source/API decisions gate implementation.

## Phase 1: Approval Gates

- [ ] T001 Confirm the 071 source-of-truth event fields include actual listened seconds and approved hidden/clear semantics in `specs/070-listening-history/072-listening-duration-analytics/data-model.md`.
- [ ] T002 Approve analytics route, response fields, range tokens, timezone source, boundaries, and deterministic tie-breakers in `specs/070-listening-history/072-listening-duration-analytics/contracts/listening-analytics.md`.
- [ ] T003 Select aggregation freshness strategy and feature test tooling in `specs/070-listening-history/072-listening-duration-analytics/research.md` and `quickstart.md`.

## Phase 2: Foundation

- [ ] T004 Inspect approved 071 event persistence and backend auth/route conventions.
- [ ] T005 Implement owner-scoped analytics data access using only approved event/catalog fields in the backend.
- [ ] T006 Implement a frontend analytics adapter for the approved response contract.

## Phase 3: User Story 1 - View Duration Summary (P1)

**Goal**: See total duration, qualifying plays and unique songs for a selected range.

**Independent test**: Compare returned values for 7/30/365-day event fixtures against an independent calculation.

- [ ] T007 [US1] Add aggregate tests covering qualifying duration, repeated plays, unique songs, range boundaries, hidden/cleared events, and owner isolation.
- [ ] T008 [US1] Implement 7-day, 30-day, and all-time-within-365-days summary aggregation.
- [ ] T009 [US1] Render summary cards and range controls in `src/frontend/src/pages/History/HistoryPage.jsx` using backend results.
- [ ] T010 [US1] Add loading, empty, stale-request, and unavailable states for the analytics tab.

## Phase 4: User Story 2 - Inspect Artist and Daily Trends (P1)

**Goal**: Identify top-five artists by duration and daily totals for the previous seven days.

**Independent test**: Verify ranking and each day against event-level fixtures, independent of 073.

- [ ] T011 [US2] Add tests for top-five duration ordering, deterministic ties, artist metadata, and fixed seven-day daily totals.
- [ ] T012 [US2] Implement top-five artist and fixed-window daily trend aggregation in the backend.
- [ ] T013 [US2] Render artist ranking and daily trend with responsive labels and empty-day handling.

## Phase 5: Cross-Cutting Validation

- [ ] T014 Verify hidden/cleared changes are reflected within the approved freshness target.
- [ ] T015 Measure response and render time with 10,000 events against the 1.5-second goal.
- [ ] T016 Update UC-070-005 and requirement traceability if the approved contract clarifies behavior.

## Dependencies

T001-T003 block production aggregation. US1 and US2 depend on the approved event source and owner-scoped foundation. Do not derive production analytics in the browser or conflate 072's duration ranking with 073's ranking requirements.
