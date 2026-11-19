# Album Save and Share Integration Contracts

These interfaces are listed in `docs/analysis-and-design/api-contract.md` and Feature 083 `spec.md`. This document records only the approved methods, paths, and access classes. Request/response schemas, status mapping, and provider-specific share protocols are not defined here because the repository's contract inventory does not specify them.

## Saved album APIs

| Operation | Method and path | Access | Purpose |
| --- | --- | --- | --- |
| Read current user's saved albums | `GET /users/me/saved-albums` | User | Hydrate saved state for the active account. |
| Save album | `PUT /albums/:id/save` | User | Add the identified album to the active account's saved collection. |
| Remove saved album | `DELETE /albums/:id/save` | User | Remove the identified album from the active account's saved collection. |

Use the existing `sessionApiClient` base URL and authentication/refresh handling. The default base is `http://localhost:5000/api/v1`; paths above are the contract-relative paths. Do not assume request bodies, response fields, idempotency, or exact status codes. The API owner must supply those details before implementation of response mapping.

## Share URL

- Canonical target: same-origin `/album/{albumId}`.
- Access: share initiation is available to signed-in and signed-out visitors.
- Destination: existing Album Details route; existing access and not-found behavior remain unchanged.
- Copy Link: uses the canonical URL.
- Facebook, Instagram, X, and Zalo: each required control must refer to the same canonical URL. The invocation mechanism is unresolved; no provider URL template or SDK is specified here.

## Client behavior contract

- Do not change saved state on the client until a save/remove request is confirmed successful.
- Keep the last confirmed state visible and disable the corresponding control while a request is pending.
- On failed save/remove, preserve state and show action-specific inline feedback.
- Keep a Saved Albums item visible until removal is confirmed; on failure it remains visible.
- A signed-out visitor cannot mutate saved state; sharing remains available without authentication.
- A share cancellation/failure must not be reported as successful and must not mutate library state.

*Note: The explicit response schemas for these endpoints have been approved and are defined in [`album-save-share-api.json`](./album-save-share-api.json) in OpenAPI 3 format.*