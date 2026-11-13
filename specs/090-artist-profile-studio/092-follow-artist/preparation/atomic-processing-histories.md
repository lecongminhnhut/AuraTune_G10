# Atomic processing histories (092 T005)

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

[Model](../data-model.md), FR-004/010/014/015 and SC-001/006 require a database successful-processing order. Use synthetic A/B, public artist X, initial original time t0 and new insertion instants t1/t2. Labels are conceptual, not columns or request timestamps.

| Initial state | Forced successful processing / fault | Required stored result and next successful read |
| --- | --- | --- |
| A-X absent | Follow@t1 → duplicate Follow@t2 | One pair, t1 unchanged. |
| Absent | Follow → Unfollow; responses reversed | Absent; later follow response cannot restore UI over fresh authoritative read. |
| Absent | Unfollow no-op → Follow@t2 | Present once at t2. |
| Present t0 | Duplicate Follow → opposing Unfollow rollback | Present t0; failure no side effects. |
| Present t0 | Unfollow → Follow@t2; old DELETE response last | Present t2, not t0; no stale response overwrite. |
| Present t0 | Hide → list → restore → list | Pair/time preserved; omit then return at original ordered position. |
| Hidden present t0 | Owner DELETE → public restore | Absent; no automatic restoration. |
| Any | Artist deletion racing follow/unfollow | Chosen atomic boundary orders existence check and write; no stale eligible follow or metadata leak; unknown/deleted safe outward result. |
| A-X and B-X | Parallel valid own writes | Independent owner pairs; B untouched by A. Count delta only if C11 authorizes it. |
| Any | Two backend workers, definite rejection vs committed response loss | Failed operation changes nothing; lost acknowledgment remains uncertain until current read. |

Candidate boundaries for Đăng/Hoàng/Nhựt review: transaction with existing artist-row lock (simple, contention across followers), or database pair-scoped advisory serialization (requires key/lifecycle conventions and cooperation with hide/delete). Unique pair constraint alone handles duplicates, not opposing absent-row order. Locking a missing relation cannot serialize; process-local mutex misses other workers; separate Supabase HTTP CRUD is not a demonstrated transaction. Choose no RPC/function/lock-key/schema here. Future tests force commit barriers, inspect actual pair/time/unrelated rows, reverse responses and read both devices; browser timers are insufficient.
