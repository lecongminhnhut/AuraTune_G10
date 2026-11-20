# Ordering and completeness cases (091 T003)

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

Exact comparator/output cells from [data model](../data-model.md):

| Section | Ordering (verbatim) | Output (verbatim) |
| --- | --- | --- |
| Featured songs | AuraTune all-time count DESC; song release date DESC; song ID ASC | First ≤5 |
| Albums | Release date DESC; title ASC; album ID ASC | Every eligible album |
| Related playlists | Update time DESC; playlist ID ASC | First ≤6 |

Conceptual labels below are not persisted IDs or a chosen ID type. For equal tuples, “lower ID” means the as-yet-reviewed canonical comparator.

| Input, deliberately shuffled | Expected oracle |
| --- | --- |
| Seven eligible songs S1–S7; counts 70,60,50,40,30,20,10; shuffled S7,S3,S1,S6,S2,S5,S4 | S1,S2,S3,S4,S5. Add ineligible count 999: unchanged. |
| S2 and S3 count 60, S3 newer release | S3 before S2; equal dates then lower canonical ID first. Valid count zero retained. |
| Duplicate associations for S1 and dangling song reference | One S1; stale link omitted; no duplicate consumes limit. Conflicting duplicate values require source resolution, not arbitrary winner. |
| Nonfeatured S7 is only qualifying artist song in public official P | P qualifies; searching only top five would be wrong. |
| Seven qualifying playlists plus high-ranked private/shared/nonofficial and hidden-only ones | Filter/dedup before update DESC/ID ASC limit six. Losing last qualifying song removes P on next read. |
| Albums B1/B2 same release, different titles; equal titles B3/B4 | Agreed title collation then canonical ID; hidden B0 excluded. Public album with no playable song still follows album viewability policy. |
| K+3 eligible albums with backend row cap K, duplicate/stale joins near page boundary | All K+3 distinct albums in global order; traversal failure is incomplete/error, never completed empty. |
| Concurrent insert/delete/release change between album pages | Approved stable boundary or restart must prove no omission/duplication. No snapshot capability assumed. |

C03/C05/C07 must resolve real association, count/date/update sources, typed ID order, title collation, null/missing policy and complete transport. Missing count is not zero; no current-date/album-date fallback. All eligibility precedes order/limit. No external popularity data or substituted ineligible content.
