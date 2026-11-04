# Use-Case Inventory – 070 Listening History

## 1. Purpose

This inventory lists the approved use cases within 070. Every use case shown in the group's Use-Case Model must be listed here and must have a corresponding specification file.

## 2. Inventory

| UC ID | Use-Case Name | Primary Actor | Supporting Actors | Related FR IDs | Feature ID | Writer | Reviewer | Status | Specification |
|---|---|---|---|---|---|---|---|---|---|
| UC-070-001 | Record Track Play Event | Player / System | None | `071-FR-001..003`, `071-FR-010` | 071 | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-070-001-record-track-play-event.md](./UC-070-001-record-track-play-event.md) |
| UC-070-002 | View Listening History | Listener | None | `071-FR-004..007`, `071-FR-009`, `071-FR-011` | 071 | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-070-002-view-listening-history.md](./UC-070-002-view-listening-history.md) |
| UC-070-004 | Purge Entire History | Listener | None | `071-FR-008`, `071-FR-013` | 071 | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-070-004-purge-entire-history.md](./UC-070-004-purge-entire-history.md) |
| UC-070-005 | View Duration Analytics | Listener | None | `072-FR-001..008`, `071-FR-013` | 072 | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-070-005-view-duration-analytics.md](./UC-070-005-view-duration-analytics.md) |
| UC-070-006 | View Top Artists & Genres | Listener | None | `073-FR-001..010`, `071-FR-013`, `072-FR-004` | 073 | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-070-006-view-top-artists-and-genres.md](./UC-070-006-view-top-artists-and-genres.md) |
| UC-070-007 | Purge Expired History | System | None | `071-FR-012` | 071 | Mai Đăng Khoa | [FULL NAME] | Draft | [./UC-070-007-purge-expired-history.md](./UC-070-007-purge-expired-history.md) |

## 3. Status Definitions

| Status | Meaning |
|---|---|
| Not Started | No specification draft exists. |
| Draft | The writer is preparing the specification. |
| In Review | The specification and its prototype are ready for peer review. |
| Changes Requested | Reviewer identified changes that must be addressed. |
| Approved | Group owner/reviewer accepted the specification and its traceability. |

## 4. Coverage Check

Coverage is mapped to the requirements in the three linked `spec.md` files. Note that 071 uses non-sequential FR IDs and includes FR-013.

| FR ID | Requirement Summary | Covered by UC IDs | Coverage Status | Notes |
|---|---|---|---|---|
| 071-FR-001 | Record a play after at least 30 seconds. | UC-070-001 | Covered | |
| 071-FR-002 | Record short tracks upon at least 90% completion. | UC-070-001 | Covered | |
| 071-FR-003 | Store user, song, and timestamp for each play. | UC-070-001 | Covered | |
| 071-FR-004 | Provide the dedicated History page. | UC-070-002 | Covered | |
| 071-FR-005 | Show entries newest first. | UC-070-002 | Covered | |
| 071-FR-006 | Show track, artist, optional album, duration, and timestamp. | UC-070-002 | Covered | |
| 071-FR-007 | Replay a track from the history list. | UC-070-002 | Covered | |
| 071-FR-008 | Clear all history after confirmation. | UC-070-004 | Covered | |
| 071-FR-009 | Paginate history results. | UC-070-002 | Covered | |
| 071-FR-010 | Have the Music Player trigger event recording. | UC-070-001 | Covered | |
| 071-FR-011 | Show an empty state and a path to Home. | UC-070-002 | Covered | |
| 071-FR-012 | Retain history for 365 days and purge older records. | UC-070-007 | Covered | Scheduler and operational ownership are implementation/operations details, not specified by the FR. |
| 071-FR-013 | Exclude cleared history from recommendation inputs and personal statistics. | UC-070-004, UC-070-005, UC-070-006 | Covered | Verify effects in the detailed UC specifications. |
| 072-FR-001 | Aggregate qualifying duration for 7-day, 30-day, and all-time windows. | UC-070-005 | Covered | |
| 072-FR-002 | Rank top five artists by listening duration. | UC-070-005 | Covered | FR is authoritative; the missing artist-ranking screen is recorded as a prototype coverage gap in UC-070-005. |
| 072-FR-003 | Provide daily totals for the previous seven days. | UC-070-005 | Covered | |
| 072-FR-004 | Exclude hidden history from statistics. | UC-070-005, UC-070-006 | Covered | |
| 072-FR-005 | Restrict analytics to the authenticated history owner. | UC-070-005 | Covered | |
| 072-FR-006 | Integrate analytics into History with load/manual refresh. | UC-070-005 | Covered | |
| 072-FR-007 | Aggregate on the backend with a fixed seven-day trend window. | UC-070-005 | Covered | |
| 072-FR-008 | Exclude sessions shorter than 30 seconds from aggregates. | UC-070-005 | Covered | |
| 073-FR-001 | Rank top ten artists by duration, then play count. | UC-070-006 | Covered | Explicit FR takes precedence over conflicting narrative/user-story wording. |
| 073-FR-002 | Rank genres by qualifying play count, counting every associated genre. | UC-070-006 | Covered | |
| 073-FR-003 | Provide 7-day, 30-day, and 365-day ranges. | UC-070-006 | Covered | |
| 073-FR-004 | Immediately exclude hidden history from calculations. | UC-070-006 | Covered | |
| 073-FR-005 | Aggregate statistics on the backend. | UC-070-006 | Covered | |
| 073-FR-006 | Integrate statistics into History. | UC-070-006 | Covered | |
| 073-FR-007 | Show a “Not enough data yet” state. | UC-070-006 | Covered | |
| 073-FR-008 | Support responsive mobile and desktop layouts. | UC-070-006 | Covered | |
| 073-FR-009 | Show top genres and group the rest as Other. | UC-070-006 | Covered | |
| 073-FR-010 | Rank top ten tracks and allow immediate playback. | UC-070-006 | Covered | |
## 5. Review Checklist

- [x] Every UC in the diagram is listed in this inventory.
- [x] Every inventory entry has a corresponding specification file.
- [x] UC IDs and names are consistent across the model, inventory and specification files.
- [x] Feature IDs and Spec Kit paths are valid.
- [ ] Reviewer names are still placeholders and must be assigned.
- [ ] Reconcile Draft statuses with the actual specification/prototype review state.
