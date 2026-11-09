# Research: Save and Share Albums

**Feature**: 083 — Save and Share Albums  
**Date**: 2026-11-09  
**Inputs**: Feature 083 `spec.md` and `plan.md`, UC-080-003, approved API inventory, project workflow/architecture/database documents, current frontend/backend source.

## Findings and decisions

### Save/remove API and saved-state read

- **Finding**: The API contract inventory lists `PUT /albums/:id/save`, `DELETE /albums/:id/save`, and `GET /users/me/saved-albums`, each requiring a User. It does not specify request/response schemas. The existing `sessionApiClient` attaches the active bearer token and uses the configurable `/api/v1` base. The current backend does not mount album/library routes.
- **Decision**: Use only the listed methods and paths through the existing authenticated client. Use the existing saved-albums read contract for account hydration after its service owner and result mapping are confirmed. Do not infer body, response fields, idempotency, or status-code semantics.
- **Alternatives considered**: Add a new read endpoint; keep localStorage authoritative; infer a success body from the API method table. Rejected because the existing contract has the saved-list route and no payload schema is approved.

### Saved state and mutation lifecycle

- **Finding**: `AppStore` partitions demo library state by active user and persists it in browser localStorage. `toggleSaveAlbum` currently changes state synchronously; `AlbumPage` immediately treats that change as successful. It does not meet the spec's server-confirmed pending/error behavior.
- **Decision**: Keep the existing UI/store boundary but make confirmed server state authoritative. While a request is pending, retain the last confirmed state, disable the action, and show progress. Update account-scoped store state only after confirmed success. Preserve the item in the current Saved Albums view until removal succeeds.
- **Alternatives considered**: Optimistic toggle with rollback, or treating localStorage as the source of truth. Rejected by the clarified requirement that unconfirmed changes must not appear successful and account state must remain synchronized.

### Authentication and account isolation

- **Finding**: The shared auth client supports bearer token attachment, refresh, and session revocation; the current `AppStore` exposes the active account's library. API inventory marks save/read operations as User-only, while sharing is available to any visitor.
- **Decision**: Require the existing authenticated session for mutations and saved-state reads. Keep share controls independent of account state. On account changes, display only the newly active account's confirmed data; session expiration follows existing Group 010 behavior.
- **Alternatives considered**: Allow guest mutations or share account-specific state between users. Rejected by FR-003, FR-007, and the contract's User designation.

### Sharing and album URL

- **Finding**: The current `/album/:id` route is handled by `AppRouter`. `share.js` constructs a same-origin URL, uses Web Share API when available, falls back to clipboard, and distinguishes cancellation/failure. The UI-derived `spec.md` describes generic platform sharing/link copy; UC-080-003 and the clarification history record Copy Link plus Facebook, Instagram, X, and Zalo, without defining provider-specific mechanics.
- **Decision**: Use the canonical same-origin `/album/:id` URL for every destination and retain current route access behavior. Reuse `share.js` for Copy Link/generic sharing where suitable. Keep named destination mechanism as a confirmation gate; do not add SDKs, deep links, or provider URL formats without approval.
- **Alternatives considered**: Treat generic Web Share as satisfying all named destinations or invent provider-specific URL templates. Rejected because the requirements list distinct controls, and no destination mechanism is approved.

### Persistence and data model

- **Finding**: The current demo library is stored client-side, while the feature requires account-level server-confirmed state. Database documents define broader account/library concepts but no feature-specific persistence mapping was confirmed for the listed API.
- **Decision**: Document the logical Saved Album relationship and transient UI states, but propose no database schema or local cache authority. Persistence implementation remains with the approved API owner.
- **Alternatives considered**: Add a client-only saved-album table or persist speculative response fields. Rejected because it conflicts with server-confirmed account state and invents data shape.

### Testing and provenance

- **Finding**: Frontend scripts expose Vite `dev`, `build`, and `preview`; backend scripts expose `start` and `dev`; no test runner is declared. The spec has a provenance note stating it was reconstructed from UI; UC-080-003 and AI clarification history document broader behavior than that reconstruction.
- **Decision**: Use the current spec as the feature artifact, trace additional expected behavior only to the cited use case/clarification records, and flag the source mismatch for feature-owner review. Document acceptance scenarios and existing runnable commands; identify the approved test harness before tasks prescribe test commands.
- **Alternatives considered**: Treat current implementation as the full requirement and discard pending/error/social controls; or assume a test framework. Rejected because these contradict documented requirements or lack repository evidence.

## Confirmations required before implementation

1. API owner: confirm the service/persistence owner and schemas/error semantics for the listed save/remove and saved-albums read routes.
2. Feature owner: reconcile the UI-derived `spec.md` with UC-080-003 and the clarification history as the canonical baseline for the API-backed mutation and named-sharing requirements.
3. Product/feature owner: confirm the technical mechanism for Facebook, Instagram, X, and Zalo controls while ensuring each uses the same album URL.
4. Confirm the repository test runner and browser/API fixtures.
