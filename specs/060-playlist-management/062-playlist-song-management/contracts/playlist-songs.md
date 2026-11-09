# Playlist Song Management API Contract (Draft)

**Feature**: [062 Playlist Song Management](../spec.md)
**Shared conventions**: [API Contract](../../../../docs/analysis-and-design/api-contract.md), [API conventions](../../../../docs/design/api/api-conventions.md)

## Confirmed Behavior

- Nested playlist-song resources follow the API naming convention `/playlists/:id/songs`.
- Authenticated owner or active collaborator may add/remove/reorder; backend performs authorization on every request.
- Duplicate playlist-song membership is prohibited. Like state is per user/song. Responses follow the common JSON envelope.

## Unresolved Endpoint Schema

The shared API document does not define playlist-song or liked-song endpoints. Approve methods, request bodies, batch behavior, reorder payload, response aggregates, duplicate behavior/status, and error details before implementation. Do not infer fields from mock objects.

## Approval Required

- Position field and reorder semantics, including concurrent update behavior.
- Add/remove transaction and count/duration response semantics.
- Liked Songs API and its projection into the library.
- Contributor identity field returned for collaborative tracks (coordinate 065).
- Authentication/error mapping and treatment of unavailable/deleted song IDs.
