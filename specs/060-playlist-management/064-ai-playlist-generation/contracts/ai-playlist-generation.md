# AI Playlist Generation API Contract (Draft)

**Feature**: [064 AI Playlist Generation](../spec.md)
**Shared conventions**: [API Contract](../../../../docs/analysis-and-design/api-contract.md), [API conventions](../../../../docs/design/api/api-conventions.md)

## Confirmed Requirements

- Authenticated listener only; prompt maximum 200 characters.
- Browser calls AuraTune backend; backend calls internal `POST /ai/playlist/generate`.
- Successful proposal contains 10–20 playable tracks and rationale; restricted/unavailable tracks are excluded.
- AI unavailable maps to shared 503 / `AI_SERVICE_UNAVAILABLE` behavior where applicable.
- Save uses standard private playlist and song-membership operations from 061/062.

## Unresolved Schema

Neither public route/payload nor internal request/response schema is defined in the shared contract. Approve method/path, prompt field, response title/rationale/song identifiers/order/playability fields, timeout, internal auth, and error mapping before implementing either adapter. Do not expose `/ai/*` to the browser.

## Save Boundary

Proposal is transient. Define how backend/client coordinates playlist create and ordered song insertion and handles partial failure. Do not invent a transaction or compensation strategy across service boundaries.
