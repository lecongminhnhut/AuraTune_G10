# Research: Top Artists and Genres

**Feature**: [073 Top Artists and Genres](./spec.md)  
**Status**: Draft; analytics source and API contract require approval.

## Findings

| Topic | Finding | Planning consequence |
|---|---|---|
| Requirement conflicts | G07 inventory and UC-070-006 resolve the spec's narrative conflicts: artist ranking is duration-first then play count; genres rank by qualifying play count; ranges are 7 days, 30 days, and 365-day all-time. | Treat the explicit FRs and resolved UC decisions as authoritative. Existing reconstructed screenshots/text that imply other behavior are coverage gaps. |
| Current UI | `HistoryPage.jsx` derives artist/genre/top-track lists in the browser from mock history; it currently ranks genres by duration and artists by duration. | Reuse the responsive visual shell, but use backend results for production analytics and use genre play counts. |
| Metadata | Mock tracks have one `genre` field; catalog relationship for multiple genre tags is not established. | The contract/data source must support all associated genre tags. A track with multiple genres increments each tag. |
| User experience | FR-007 requires a "Not enough data yet" state; UC-070-006 defines fewer than five qualifying plays as the threshold. | Apply the threshold consistently to this statistics view, as recorded in the feature spec. |
| Long-tail categories | Clarification directs top 5–10 genres with remaining counts grouped into Other. | Return or derive the Other aggregate from backend-computed genre counts; do not silently discard the tail. |
| Storage/API | No production stats route/service or confirmed canonical database exists. | Do not invent API fields or persistence schema. |

## Decisions and Open Gates

- Follow FR-001/002/003/009/010 as mapped in the G07 inventory and resolved UC: duration-first artist ranking, per-tag genre play counts, 7/30/365-day ranges, top genres plus Other, top ten tracks by play count.
- Approve artist/song/genre result shapes, route, timezone/window boundaries, and tie-breakers.
- Confirm genre tag source and artist/song identity mapping in the canonical catalog.
- Apply the UC-070-006 minimum-five-event threshold to this statistics view, as recorded in the feature spec.
- Ensure hidden/cleared events are excluded and refresh is immediate after re-aggregation; no cache strategy is inferred.

## Sources

- `docs/requirements/use-cases/070-listening-history/README.md` decisions Q-070-3 and UC-070-006.
- G07 use-case inventory FR coverage and UC-070-006.
- `docs/design/database/README.md`, `data-consistency.md`, and existing `HistoryPage.jsx`/`AppStore.jsx`.
