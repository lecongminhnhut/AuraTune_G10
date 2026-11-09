# Implementation Plan: Listening History

**Branch**: `071-listening-history` | **Date**: 2026-11-09 | **Spec**: [spec.md](./spec.md)

**Status**: Draft; implementation is gated on the storage and API decisions in Phase 1.

## Summary

Deliver private, chronological listening history with qualified play capture, paginated browsing, replay, confirmed clear-all, and 365-day retention. Reuse the existing History page and player experience, but replace demo-only local history behavior with an approved authenticated backend contract. No production history persistence currently exists in the codebase.

## Technical Context

**Language/Version**: Frontend JavaScript ES modules, React 18.3.1 and Vite 5.4.11; backend JavaScript ES modules, Node.js and Express 4.21.2.  
**Primary Dependencies**: Existing frontend state/player, Express routes and shared API envelope.  
**Storage**: Unconfirmed; docs describe PostgreSQL-style tables but explicitly leave database selection open. No schema is proposed.  
**Testing**: Existing root `test:backend` is an auth smoke test; no feature test runner convention is established. Select focused unit/contract/integration tooling before implementation.  
**Target Platform**: Responsive AuraTune web application and authenticated backend.  
**Project Type**: React frontend plus Express backend.  
**Performance Goals**: First history page under 1 second for up to 5,000 stored events; clear reflected within 500 ms under normal conditions.  
**Constraints**: Qualifying thresholds (30 sec or >=90% for tracks shorter than 30 sec), private owner scoping, stable pagination, 365-day retention, cross-feature purge propagation.  
**Scale/Scope**: User-owned playback history only; no offline sync or public sharing.

## Constitution Check

`.specify/memory/constitution.md` is an unratified placeholder. Formal constitutional compliance cannot be certified.

| Gate | Result | Evidence / action |
|---|---|---|
| Scope is limited to 071 | PASS | Covers recording, listing, replay, clear-all, retention. Analytics presentation remains in 072/073. |
| Private owner scoping | PASS WITH IMPLEMENTATION GATE | Contract requires principal-derived ownership; route/auth pattern must be reviewed. |
| Storage and API are approved | OPEN | Neither canonical DB nor history endpoint/payload is established. |
| Avoid unsupported offline behavior | PASS | No offline synchronization is added. |
| Constitution | OPEN | Placeholder must be ratified before formal compliance claim. |

## Existing Baseline and Planned Work

`HistoryPage.jsx` and `AppStore.jsx` implement local demo data. `recordPlay` currently records immediately and `clearHistory` clears local state. The backend has no history route/service. Use these as UI/playback references, not as evidence of production persistence, threshold enforcement, pagination, privacy, or retention.

## Technical Approach

1. Approve the storage source, public history contract, event idempotency, cursor and deletion semantics.
2. Implement authenticated backend capture/list/purge operations and 365-day retention using the approved store.
3. Qualify a playback session once at the specified threshold, including short-track completion, and prevent duplicate event creation from repeated progress updates/retries.
4. Replace local-history reads/writes in the History page/store with the approved API; retain chronological grouping, replay, confirmation, empty/error/loading states, and pagination.
5. Ensure clear-all is reflected across stats and recommendation inputs according to 071-FR-013.

## Project Structure

```text
src/backend/                 # existing Express app; add approved history route/service
src/frontend/src/pages/History/HistoryPage.jsx
src/frontend/src/context/AppStore.jsx
src/frontend/src/context/PlayerContext.jsx
specs/070-listening-history/071-listening-history/
```

**Structure Decision**: Extend the existing single React + Express application. Exact backend file paths should follow current route conventions after the contract is approved.

## Complexity Tracking

No justified complexity exception identified. Storage/API decisions are approval gates, not assumed architecture.
