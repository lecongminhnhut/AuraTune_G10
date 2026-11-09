# Implementation Plan: Listening Duration Analytics

**Branch**: `072-listening-duration-analytics` | **Date**: 2026-11-09 | **Spec**: [spec.md](./spec.md)

**Status**: Draft; implementation depends on the source event duration and API decisions below.

## Summary

Provide private duration analytics for 7-day, 30-day, and 365-day windows, including total duration, play count, unique songs, top-five artists by duration, and a seven-day daily trend. Aggregation belongs on the backend. Reuse the existing History statistics tab as a UI baseline; current values are derived from mock client state.

## Technical Context

**Language/Version**: React 18.3.1/Vite 5.4.11 frontend; Node.js/Express 4.21.2 backend.  
**Primary Dependencies**: Existing History page, shared API conventions, approved 071 event store.  
**Storage**: 071 source of truth; canonical DB is unconfirmed. No aggregate schema selected.  
**Testing**: Select feature-level backend aggregate and frontend contract tooling; root backend smoke test is auth-only.  
**Target Platform**: Responsive authenticated web application.  
**Project Type**: React frontend plus Express backend.  
**Performance Goals**: Render stats in under 1.5 seconds for 10,000 history events.  
**Constraints**: Exclude hidden/cleared and <30-second events; all-time <=365 days; daily trend fixed to previous seven days; private owner scope.  
**Scale/Scope**: Personal duration metrics only; frequency-first genre/chart behavior belongs to 073.

## Constitution Check

The constitution is an unratified placeholder; formal compliance cannot be certified.

| Gate | Result | Evidence / action |
|---|---|---|
| Backend owns aggregation | PASS | Required by 072-FR-007. |
| Correct duration source | OPEN | Event-level listened seconds are not established in the current production store. |
| Privacy/hidden event filtering | PASS WITH IMPLEMENTATION GATE | Requirements are clear; implementation depends on 071 visibility semantics. |
| API/timezone choices | OPEN | Route, response, timezone and boundaries need approval. |

## Existing Baseline and Technical Approach

`HistoryPage.jsx` aggregates demo events in the browser; backend has no analytics service. First verify 071 event fields and storage. Then implement owner-scoped backend aggregation, a contract adapter, range controls and loading/error/empty states. Preserve 072's top-five artists-by-duration behavior independently of 073.

The aggregate must sum actual listened seconds, not full track length, unless the owner explicitly revises the source requirement. Do not add a materialized view/cache until freshness and invalidation are approved.

## Structure Decision

Extend existing `src/backend` route/service conventions and `src/frontend/src/pages/History/HistoryPage.jsx`; exact file names follow the approved endpoint. No new service or datastore is introduced by this plan.

## Complexity Tracking

No complexity exception. Cache/materialized aggregation remains unselected pending source and consistency review.
