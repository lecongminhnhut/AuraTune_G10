# Implementation Plan: Top Artists and Genres

**Branch**: `073-top-artists-and-genres` | **Date**: 2026-11-09 | **Spec**: [spec.md](./spec.md)

**Status**: Draft; implementation depends on catalog, event source, and API approval.

## Summary

Add backend-generated personal top-artist, genre, and top-track analytics to the History page. Follow resolved requirements: artists sort by total listened duration then play count; genres count each qualifying play per associated tag; top tracks sort by play count; ranges are 7/30/365 days. Hidden/cleared and short events are excluded.

## Technical Context

**Language/Version**: React 18.3.1/Vite 5.4.11 frontend; Node.js/Express 4.21.2 backend.  
**Primary Dependencies**: Existing History page/player and approved 071 history store.  
**Storage**: Unconfirmed; no aggregate schema selected.  
**Testing**: Select feature-level aggregate/contract and responsive UI tooling; root backend test is auth-only.  
**Target Platform**: Responsive authenticated web application.  
**Project Type**: React frontend plus Express backend.  
**Performance Goals**: Load/render under 1.5 seconds; range updates within 500 ms after data fetch.  
**Constraints**: Backend aggregation; 365-day retention; tag-wise multi-genre counting; genre tail grouped as Other; owner-only results.  
**Scale/Scope**: Personal rankings in the existing History page; no public charts or recommendation generation.

## Constitution Check

The constitution is an unratified placeholder; formal compliance cannot be certified.

| Gate | Result | Evidence / action |
|---|---|---|
| FR/UC precedence resolved | PASS | G07 README Q-070-3 and UC-070-006 resolve narrative conflicts. |
| Catalog supports required aggregation | OPEN | Multiple genre tags and event duration source are not established in production storage. |
| Backend aggregation and owner scope | PASS WITH IMPLEMENTATION GATE | Required by FRs; route/auth pattern remains to be approved. |
| Empty-state threshold | OPEN | UC states <5 events; confirm whether it gates every ranking. |

## Existing Baseline and Technical Approach

The History page computes mock top artists/genres/tracks in the client. Replace production calculation with an approved backend contract, retaining the page layout and existing playback action. Current mock genre data is a single tag and cannot verify multi-tag behavior. Confirm catalog/event source and all output fields before service implementation.

Implement an explicit summary time range shared with 072 only if the UI and approved contract define that shared state; avoid duplicate conflicting selectors. Keep 072's top-five artist duration panel distinct from this feature's top-ten/genre-count view unless product design approves consolidation.

## Structure Decision

Extend existing Express and History page modules; add no datastore or service boundary until approved. Exact route/service files follow existing repository conventions after the contract is signed off.

## Complexity Tracking

No complexity exception. Aggregation caching is not selected until freshness and invalidation are approved.
