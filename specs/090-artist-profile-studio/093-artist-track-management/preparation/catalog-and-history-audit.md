# Catalog and historical metrics audit (093 T004)

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

Reuse the [shared catalog inventory](../../091-artist-profile/preparation/catalog-source-audit.md) rather than repeat a model choice. Reference ER artists→albums→songs and songs.total_plays do not solve direct ownership, nullable album, co-credit or attribution. Only auth migration exists; no song/genre/album/rights/media/history deployment mapping found.

| Input/read | Actual code evidence | Required C03/C10 evidence |
| --- | --- | --- |
| Title/album/genre/duration | StudioPage four fields; mock taxonomy; empty album becomes Single | Approved album-name↔ID and clear mapping, server genre membership and entered-duration lossless representation; no album CRUD or default invented. |
| Rights/media | Media controller temporary license/source fields and URL response; no catalog commit | Reviewed rights/attribution projection and persisted asset association; current fields not approved track DTO. |
| Catalog | allTracks filter by demo artistId and local status | Protected complete own manageable retrieval, every required metadata/filename/cover/action, beyond row cap, no B rows. |
| Total/active | Remaining myTracks count and local active status | Approved nondeleted management scope; active also excludes Admin restriction/current public ineligibility. |
| Historical plays | myTracks.reduce(playCount); local uploaded delete removes row | Counterexample: plays 7 on X + 3 on Y → delete X; required historical total 10, current sum 3. Empty after deleting Y still historical 10, not zero. |
| Failed stats | No independent real stats read | Missing/unavailable distinct from zero; catalog success survives stats failure, stale portions labelled not updated. |
| Public 091 | Mock direct artistId/count/releaseDate; upload date now | Same approved association/playability/AuraTune count/release sources; filter eligible before featured top five and playlist existence. No fabricated release date/zero plays. |

Khoa/Đăng/Hoàng must identify valid historical source and attribution, concurrent play/delete consistency and FK/playlist/media lifecycle. No schema, backfill, cascade, ledger, retention period or current-row aggregate is selected. Complete protected reads and partial failures need C05; media deletion is not proof that history survives.
