# Persistence and lifecycle audit (092 T003)

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

[Shared source audit](../../091-artist-profile/preparation/catalog-source-audit.md) inventories ER/auth keys/migrations. [Model](../data-model.md) states “duplicate follow preserves original time exactly” and “Non-public visibility suppresses projection, not membership”. These invariant fragments remain exact even when transport responds with an approved duplicate/no-op outcome.

| Evidence | Interpretation / remaining C02/C06/C10 gap |
| --- | --- |
| Reference ER composite user_follows_artist(user_id, artist_id) | Pair uniqueness is reference context, no installed migration or follow-time column/type/precision exists. |
| Auth users.id versus unique user_id; session.user_id references users.id | Current repository searches both. Resolve legacy IDs and artist FK consistently before migration; no copied ER FK assumption. |
| AppStore library.follows, followedAt browser ISO, timer mutation | Demo persistence in localStorage, no cross-device/worker authority. Preserve no browser import/backfill assumption. |
| FollowingPage sorts time string then localeCompare artist ID | Demonstrates UI intent only; canonical time precision/typed IDs/collation unapproved. |
| No artist-delete/follow repository handler | No proof of FK cleanup or deletion-race safety. 092 controls outward not-found/omission, does not choose cascade/retention. |

Questions for Đăng/Hoàng/Khoa: deployed pair constraint/source and canonical key? Authoritative original follow instant/type/precision and historic-data evidence? What if historic time is absent? Which deletion writer cooperates with follow commits, and what storage/lifecycle mechanism is accepted? Do not substitute now/epoch, add columns, select cascades/backfill or assume local values are trustworthy. Revalidate with synthetic duplicate/refollow/hidden-restoration histories after acceptance. No migration path/version is approved; the gate index records that explicitly.
