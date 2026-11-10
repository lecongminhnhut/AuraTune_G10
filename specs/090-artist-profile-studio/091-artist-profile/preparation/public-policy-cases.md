# Public policy cases (091 T002)

> **2026-11-13 confirmed owner policy:** account_status active/banned and artist_visibility public/hidden are distinct. Ban hides the linked Artist profile; unban always leaves it hidden, including a profile hidden manually before ban. Artist request/Admin review does not publish it; Admin approval is required. Add these transitions to real-schema privacy fixtures, keeping hidden and unknown outcomes equivalent. See [decision record](./owner-decisions-and-design-proposal.md#2-confirmed-accountvisibility-behavior) for accepted behavior versus proposed defensive read/race mechanics; actual field/key mapping remains pending.

**Audit date:** 2026-11-11. **Checkout:** `090-artist-profile-studio-implement` (read from Git HEAD; no branch operation).
**Status:** Written preparation for review; no implementation acceptance or gate approval is implied. Synthetic cases below are designs, not executed application tests.

[Source](../spec.md): FR-006–008/018/018A/023. Shared [mapping audit](./catalog-source-audit.md).

| Synthetic precondition / request | Expected externally observable result |
| --- | --- |
| Public artist, anonymous or non-banned User/Artist/Admin | Same public identity/content access; no Studio permission required and no role-based public bypass. |
| Public artist, expired/banned personal session | Public fetch remains credential-free and independent of auth hydration/refresh; personal denial does not hide public data. Ban-to-profile mapping remains C02. |
| Unknown, deleted, wrong entity, non-public/disabled under approved predicate | Same safe 404/NOT_FOUND envelope, message/data/details for each direct detail/songs/albums/playlists call. No identity or existence/reason hint. |
| Hidden parent with known public-looking child ID | Parent checked before children; no success-empty child bypass for any role. |
| Malformed percent sequence %, %ZZ, truncated UTF-8 %E0%A4; encoded slash %2F, double encoding %252F, empty/overlong/wrong-type ID | Never crash/decode twice or leak raw exception. Exact accepted ID syntax/status awaits C02/C05. Current decodeURIComponent has no local error handling. |
| Missing/whitespace image or bio; broken image; hostile long biography | Neutral image, explicit missing biography, safe text and usable sections; never account avatar/email/name fallback. |
| Only hidden/private/removed/ineligible children | Same section empty outcome as no eligible children; no count/slots/labels/reason distinguish underlying rows. |
| Read source unavailable | Retryable temporary error distinct from 404/empty; do not default permission to public or count to zero. |

Proposed conceptual identity allowlist is stable public ID/name and optional image/biography only (contract review still selects wire names/types). Explicitly reject email, password hash, session/token/provider IDs, ban flags, management owner, uploaded filename/object ID, internal predicates/reasons, hidden totals. Inspect raw response, DOM, aria/alt labels, errors/logs and browser caches. C02 needs reviewed physical predicate/projection/ID examples, not mock isPublic. These are fixed policy tests with unresolved mappings, not a new schema.
