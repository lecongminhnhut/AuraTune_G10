# Interface and recognition options (092 T004)

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

[Contract](../contracts/follow-artist.md) establishes PUT and DELETE /artists/:id/follow plus GET /users/me/following-artists; actual server registers none. No status/count endpoint is authorized. Shared success/error envelope is established; exact mutation/no-op statuses, own DTO/time projection, hidden-without-own-pair DELETE and cache policy remain C06/F05. Current auth ad hoc status bodies/banned 401/503 drift is C04.

| Proposed read strategy (not selected) | Safe use / unresolved requirement |
| --- | --- |
| Complete server result | Positive match confirms Following. Negative only for still-public target after full current same-owner result; row-cap and visibility-race proof required. |
| Approved complete traversal over existing capability | Requires reviewed transport/termination/consistency, safe metadata and global ordering. Do not invent cursor/limit/status endpoint. |

Counterexamples: A follows target in row K+1 while cap K returns a prefix → absence proves nothing. Hidden retained pair filtered out → absent list entry still has membership. Page two fails → not complete. Public identity read then target hides before list → cannot confirm Not following. Unknown commit after PUT/DELETE → old local snapshot and response arrival cannot resolve current state. Concurrent list change between pages → need agreed stable/current strategy, no snapshot assumption.

Complete successful no-visible-entry list uses normal empty state (including hidden-only). Loading/error/incomplete/uncertain remain unresolved with retry; no guessed false boolean. Public profile never acquires personalized fields. Review request examples (body acceptance/unsupported owner selectors), public safe DTO, error/no-op outcomes and visibility/read boundaries before OpenAPI. Alternatives are conceptual and contain no final payload keys or invented route.
