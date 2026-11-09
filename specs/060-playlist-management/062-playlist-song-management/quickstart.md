# Quickstart: Playlist Song Management

**Feature**: [062 Playlist Song Management](./spec.md)

## Prerequisites

- Start backend/frontend using repository root scripts and authenticate as a listener.
- Resolve ordering, contributor, aggregate, and Liked Songs gates in [research.md](./research.md).
- Refer to [data model](./data-model.md) and [membership contract](./contracts/playlist-songs.md).

## Validation Scenarios

1. Add a song to an owned playlist and verify it appears once at the end with updated count/duration.
2. Add the same song again from both menu and add dialog; verify no duplicate and clear feedback.
3. Like and unlike a song; verify heart state and Liked Songs library projection remain synchronized.
4. Remove a song and verify membership/order/aggregates update together.
5. Reorder first/middle/last items and reload; verify persisted order.
6. Verify owner and active collaborator can edit, while unrelated user and revoked collaborator cannot.
7. Simulate failed membership/reorder requests; verify UI restores prior state and shows an error.
8. Exercise concurrent reorder and retry after the approved policy is recorded.

Choose feature-specific test commands only after confirming repository tooling; do not treat mock state as persistence evidence.
