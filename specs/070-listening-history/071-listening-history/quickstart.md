# Quickstart: Listening History Validation

**Feature**: [071 Listening History](./spec.md)  
**Status**: Validation outline; end-to-end validation requires an approved history contract and persistent store.

## Prerequisites

- Install repository dependencies using the existing setup.
- Approve the history routes/payload, storage, authenticated test accounts, and safe test catalog fixtures.
- Do not use production user history for validation.

## Start Applications

```sh
npm run dev:backend
npm run dev:frontend
```

## Validation Scenarios

1. Play a track for 29 seconds and stop; verify no history event is recorded.
2. Play a normal track for 30 seconds; verify exactly one event is recorded for the authenticated listener.
3. Complete a track shorter than 30 seconds to >=90%; verify exactly one event is recorded.
4. Replay the same track in a second session; verify it creates a distinct event.
5. Paginate through records with identical timestamps; verify stable ordering and no duplicate/missing entries.
6. Verify each row's track metadata, play time, duration, newest-first order, and playback action.
7. Verify empty history offers navigation to Home and retrieval failure has a clear retry state.
8. Cancel clear-all and verify data remains; confirm clear-all and verify history, stats, and recommendation inputs exclude cleared data.
9. Attempt cross-user access and verify denial.
10. Verify records older than 365 days are purged while records inside the retention window remain.
11. Simulate progress callback repeats, network interruption, request retry, and purge failure; verify behavior matches the approved idempotency and operational policies.

## Tooling Note

The root `npm run test:backend` currently runs authentication smoke coverage and is not evidence of listening-history behavior. Select feature-level test tooling before implementation claims automated coverage.
