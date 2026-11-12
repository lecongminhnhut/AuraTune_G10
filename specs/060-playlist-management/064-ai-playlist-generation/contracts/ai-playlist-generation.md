# AI Playlist Generation API Contract (Draft)

**Feature**: [064 AI Playlist Generation](../spec.md)
**Shared conventions**: [API Contract](../../../../docs/analysis-and-design/api-contract.md), [API conventions](../../../../docs/design/api/api-conventions.md)

## Confirmed Requirements

- Authenticated listener only; prompt maximum 200 characters.
- Browser calls AuraTune backend; backend calls internal `POST /ai/playlist/generate`.
- Successful proposal contains 10–20 playable tracks and rationale; restricted/unavailable tracks are excluded.
- AI unavailable maps to shared 503 / `AI_SERVICE_UNAVAILABLE` behavior where applicable.
- Save uses standard private playlist and song-membership operations from 061/062.

## Implemented Schema

- Public `POST /playlists/ai-generate` accepts `{ "prompt": "..." }` and requires the authenticated listener.
- The backend calls internal `POST /ai/playlist/generate` with `X-Internal-Secret` and the configured AI timeout. The internal endpoint validates the secret.
- AI response: `{ "title": string, "reason": string, "tracks": [{ "song_id": string, ... }] }`. The backend hydrates IDs from `songs`, filters inactive, deleted or restricted rows, and only returns a proposal with 10–20 available tracks; zero eligible matches return `{ noMatch: true }`.
- AI service errors map to `503 AI_SERVICE_UNAVAILABLE` without internal diagnostics. `/ai/*` is never called by the browser.

## Save Boundary

Proposal is transient. The client creates a standard private playlist, then inserts its edited track IDs in final order. If insertion fails, the client attempts to delete the newly created playlist and reports failure; it does not show success unless both operations complete.
