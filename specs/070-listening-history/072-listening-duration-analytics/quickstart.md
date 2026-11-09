# Quickstart: Listening Duration Analytics Validation

**Feature**: [072 Listening Duration Analytics](./spec.md)  
**Status**: Outline pending approved aggregation contract and persistent 071 source.

## Prerequisites

- Approved analytics endpoint/response, timezone and range boundaries.
- Test account with qualifying, short, hidden, cleared, and expired events; controlled artist metadata.
- Feature-level test tooling selected.

## Start Applications

```sh
npm run dev:backend
npm run dev:frontend
```

## Scenarios

1. Compare 7-day, 30-day, and all-time totals against independently calculated qualifying event fixtures.
2. Verify sessions below 30 seconds, hidden events, cleared events, and events older than 365 days are excluded.
3. Verify top five artists are ordered by total listened duration and ties follow the approved deterministic rule.
4. Verify play count and unique song count for repeated plays of the same song.
5. Verify the seven-day daily trend includes its full fixed window, including zero days where required, under the approved timezone.
6. Switch ranges and verify only period-dependent metrics change; daily trend remains seven days.
7. Verify cross-user requests are denied and errors reveal no other user's data.
8. Measure load/render time for 10,000 events against the 1.5-second goal.

The existing root backend smoke command only covers authentication and is not analytics coverage.
