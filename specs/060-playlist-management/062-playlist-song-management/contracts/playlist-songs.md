# Playlist Song Management API Contract (Draft)

**Feature**: [062 Playlist Song Management](../spec.md)
**Shared conventions**: [API Contract](../../../../docs/analysis-and-design/api-contract.md), [API conventions](../../../../docs/design/api/api-conventions.md)

## Confirmed Behavior

- Nested playlist-song resources follow the API naming convention `/playlists/:id/songs`.
- Authenticated owner or active collaborator may add/remove/reorder; backend performs authorization on every request.
- Duplicate playlist-song membership is prohibited. Like state is per user/song. Responses follow the common JSON envelope.

## Implemented Endpoint Schema

- `POST /playlists/:id/songs` accepts `{ "songIds": ["..."] }`; duplicate membership is idempotently ignored and invalid catalog IDs are not inserted.
- `DELETE /playlists/:id/songs/:songId` removes membership and compacts ordering.
- `PUT /playlists/:id/songs/order` accepts the complete `{ "songIds": [...] }` order and rejects missing, duplicate, or extra IDs.
- `PUT` / `DELETE /songs/:songId/like` update `user_liked_songs`; `GET /users/me/liked-songs` returns song IDs.
- Detail responses derive count/duration from active songs and return contributor display data when available.
- Every mutation authorizes the owner or active collaborator. Database constraints prevent duplicate songs and duplicate positions.
