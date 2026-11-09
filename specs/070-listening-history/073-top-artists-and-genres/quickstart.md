# Quickstart: Top Artists and Genres Validation

**Feature**: [073 Top Artists and Genres](./spec.md)  
**Status**: Outline pending approved analytics endpoint and multi-genre catalog source.

## Prerequisites

- Approved event, catalog, and analytics response contracts.
- Authenticated test account and controlled fixtures for multi-genre songs, tied ranks, hidden/cleared events, and range boundaries.
- Feature test tooling selected.

## Start Applications

```sh
npm run dev:backend
npm run dev:frontend
```

## Scenarios

1. Verify 7-day, 30-day, and 365-day ranges and boundary timestamps under the approved timezone.
2. Verify artists sort by listened seconds, then play count; ties follow the approved deterministic rule.
3. Verify every tag on a multi-genre song receives one count per qualifying event.
4. Verify top 5–10 genres appear and the rest sum into Other without losing counts.
5. Verify top ten tracks sort by qualifying play count and selection starts existing playback.
6. Verify hidden/cleared, <30-second, and expired events are excluded.
7. Verify the not-enough-data state below five events per the resolved UC interpretation.
8. Verify owner-only responses, responsive layout at 320px and 1920px+, and range updates within 500 ms after fetch.
9. Measure load/render under 1.5 seconds with representative data.

Existing demo page calculations are not evidence of backend aggregation behavior.
