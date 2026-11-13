# Public interface options (091 T004)

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

[Existing contract](../contracts/artist-profile.md) and [shared API](../../../../docs/analysis-and-design/api-contract.md) establish GET artist detail (identity + featured), songs, albums and playlists under /api/v1/artists/:id. Current [server](../../../../src/backend/server.js) mounts auth/media only; these catalog paths fall through generic 404, which is not privacy/DTO compliance.

| Alternative for review, not selected | Benefits | Required C05 disposition |
| --- | --- | --- |
| Preserve detail responsibility; independently represent featured failure within successful identity composition | Identity usable when featured fails; keeps established description | Exact schema/examples for successful featured, zero featured, featured failure; status/error vocabulary; targeted retry on existing songs capability without redefining general songs as top five. |
| Independently retrieve identity using a reviewed existing detail behavior | Smallest identity increment could operate before catalog producer | Explicit reconciliation of identity-plus-featured contract; approved fields and request semantics. Cannot assume identity-only success today. |
| Complete albums in one response vs internal reviewed traversal | One response simple; traversal supports row caps | Full ordering, concurrent-change behavior, termination and incomplete/error handling; no guessed cursor/page query or product limit. |

Outcome matrix: public identity + nonempty/empty featured are successes with distinct section content; featured error preserves identity/albums/playlists; album/playlist empty differs from temporary error; targeted retry replaces only failed data; parent becomes non-public during any child retry clears whole profile and rejects stale successes. Full identity read failure is retryable and distinct from not-found. No fabricated empty success for unimplemented producer.

Anonymous adapter must use existing API base without token/cookies, auth refresh or personalization; current sessionApiClient includes credentials and is unsuitable unchanged for anonymous isolation. Coordinate any shared client change under the relevant C04 slice. Questions: exact approved projection/nullability/ID type, identity/featured boundaries and retries, status/envelopes, all-album transfer, and independently usable identity MVP? C02/C03/C07 remain separate producer gates. No final fields, parameters, routes or OpenAPI invented.
