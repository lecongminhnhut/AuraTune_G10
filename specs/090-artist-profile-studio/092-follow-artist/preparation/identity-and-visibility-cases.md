# Identity and visibility cases (092 T002)

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

Reuse the [shared canonical audit](../../091-artist-profile/preparation/catalog-source-audit.md); reference artists.user_id is an optional account link, never the follower's identity. Verified current session owner is the personal principal. Browser artistId is not a trusted key. [Authority](../spec.md): FR-001–003/007/009/011/013/016.

| Actor/target condition | Follow / owner removal / public projection |
| --- | --- |
| Non-banned User, Artist, Admin; public artist | Same own-account personal capabilities; no target ownership requirement, no Admin B bypass. |
| Guest, invalid/expired/revoked session, banned | No personal list/mutation; existing login recovery only; public 091 independent. |
| A supplies B through body/query/path | No B read/write; owner is server-verified A, unsupported selectors cannot reassign. |
| Hidden/disabled under approved predicate, retained A pair | New PUT same not-found as unknown; valid A DELETE removes retained pair without metadata; list omits, original time retained until removal. |
| Hidden target, no A relation | PUT rejects; exact DELETE no-op/rejection mapping awaits C06/F05, no existence/other-owner disclosure. |
| Unknown/permanently deleted | PUT/DELETE safe same not-found in required equivalence classes; no prior existence hint, no unrelated write; deleted absent from list. |
| Hidden later public | Retained relation returns in original time/ID position; removed one never returns until refollow. |
| Track hidden/deleted | No profile-visibility/follow-row/time change; track rights and personal artist relationships separate. |

C02 needs real canonical ID/validation, account-key/artist link, public/disabled predicate, ban relationship, safe fields and eligible/ineligible representative records. C06 defines hidden-no-pair response. No schema or hidden status viewer is chosen. Check raw JSON, DOM/accessibility, logs and caches for identity/reason/count leakage; 091 child reads remain identically not-found for all roles.
