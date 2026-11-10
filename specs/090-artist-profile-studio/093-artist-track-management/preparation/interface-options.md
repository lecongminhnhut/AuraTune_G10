# Studio interface options (093 T005)

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

[Contract](../contracts/artist-track-management.md) / shared API establish multipart POST /songs, PUT/DELETE /songs/:id (Artist/Admin with own Artist scope), public GET songs/detail/artist songs/genres and binary GET /songs/:id/stream (200/206 Range). Current server has auth/media routes only; standalone POST /media/audio and /media/image now upload media, but no song/catalog/stat/read/reconciliation capability. Their status/media envelope and 502 do not implement shared song envelope.

| Alternative for review only | Implication / decision needed |
| --- | --- |
| Reuse an existing protected capability if owners identify one | Demonstrate complete identity/catalog/metrics safe own projection and exact request semantics; no such capability found now. |
| Explicitly approve a protected read extension | Owners review exact routes/modules/DTO/order/traversal/partial failure; this audit selects no /studio or /users/me/tracks endpoint. |
| Independent catalog and metric boundaries vs reviewed composite partial success | Preserve successful peers and distinguish stale/unavailable/empty; choose exact envelopes/examples and targeted retry. |
| Integrate existing media upload code into accepted song operation vs approved separate transfer/finalization | Need rights before provider work, final authorization, safe staging, commit reconciliation/dedup and protected delivery; current routes alone insufficient. No upload-session route assumed. |

C05 questions: safe identity/track/filename and historical metric fields? Complete transport under caps/concurrent changes? Multipart names/types for actual File/rights/duration/album? PUT strict four metadata fields versus Artist preference, clear semantics and independent restriction? Delete/no-op/unknown/forbidden statuses? Standard auth/outage errors with C04? Same-submission reconciliation on response loss? No final JSON/multipart keys, new endpoints or OpenAPI are invented. Public APIs never return hidden/private Studio data via browser filtering or include-hidden switch. Admin role branch stays separate from Artist-only Studio.
