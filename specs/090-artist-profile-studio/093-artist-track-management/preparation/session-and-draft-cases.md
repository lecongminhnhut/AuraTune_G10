# Session and draft cases (093 T008)

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

Reuse [shared auth/replay trace](../../092-follow-artist/preparation/session-replay-audit.md). sessionApiClient preserves FormData boundary but unguarded post-refresh replay lacks origin session comparison. StudioPage retains fileName only, closes after local mutation and has no private service/current final-auth lifecycle. Existing media route authenticates before transfer, not after cloud persistence.

| Event | Required stored-owner and UI oracle |
| --- | --- |
| Pre-submit upload/edit Cancel/close | Discard unsaved form; no media request/save. Reopen edit reads current saved metadata. |
| Validation or definite operation error while open | Retain accessible input/File; show field/action error and manual correction/retry. |
| Submitted upload/edit then close/departure | Does not cancel operation; on return reconcile actual current result before retry/edit/claim. |
| Expiry in working session | Temporary accessible input retained only for same-account sign-in; recheck current permission; File not promised after reload/loss. |
| A→B/logout while pending/refreshing | No A draft/action/result/toast delivered to B; never finalize/replay A operation as B. A completed operation remains owned by A. |
| Same account replacement session | Invalidate old request generation; reviewed same-account recovery only after current auth and outcome reconciliation. |
| Role/ban/link revocation mid-transfer/precommit | Final server authorization denies unauthorized publication; merely ignoring late UI is insufficient. |
| Commit acknowledgment lost/unknown | Uncertain state, reconcile before manual retry; no ambiguous automatic POST replay or false success/failure. |
| Catalog succeeds/stats fails and inverse | Preserve successful portion, failed portion unavailable with retry; prior data labelled not updated, never invented zero/empty. |

G090-D08–D14 provide behavior, C04/C05/C08 choose actual shared mechanism. Do not store durable audio/drafts/tokens or invent operation endpoints/keys. Future tests inspect DB owner and media/catalog side effects as well as suppressed foreign UI/cache state.
