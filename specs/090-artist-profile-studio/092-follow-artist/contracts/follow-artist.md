# Interface Contract — Feature 092 Follow Artist

**Status**: Review-ready behavioral/integration contract. Existing paths, authentication and envelope are established; exact wire fields, no-op mapping and completeness are pending **F05/F06**. This is not a newly approved JSON schema. [Decision register](../research.md#decision-register).

## Established API surface

Base `/api/v1`; [shared API Contract](../../../../docs/analysis-and-design/api-contract.md) §1/2.8 and [conventions](../../../../docs/design/api/api-conventions.md). The `User` designation is interpreted with the spec's explicit clarification: authenticated, non-banned User, Artist and Admin may use their own personal capabilities.

| Method/path | Authentication | Required behavior |
| --- | --- | --- |
| PUT `/artists/:id/follow` | AuraTune bearer access JWT + valid existing session | Public existing artist only; ensure exactly one own relation; duplicate preserves original time |
| DELETE `/artists/:id/follow` | Same | Remove own relation, including retained relation to existing hidden artist; unknown/deleted same not-found |
| GET `/users/me/following-artists` | Same | Only caller's eligible public artists, distinct, original follow time DESC then typed artist ID ASC |

No dedicated status/count endpoint, alternate account path or new public profile field is added. Request-body/query schemas are unspecified in shared docs: do not send an owner, follow time, role, desired boolean or idempotency key as if contracted. PUT and DELETE already encode desired state. Implementation should require no body for these operations, subject to reviewed F05 request examples; unsupported owner selectors must not change principal. Artist ID domain is F02, not assumed UUID/numeric/slug.

Own state recognition must use an existing capability with approved semantics. Candidate: complete current own list, matched against the still-public current artist. No truncated list, failed load or hidden-filtered absence becomes Not following. F05 must specify completeness and visibility-race handling before implementation; no new status interface is smuggled into 091.

## Authentication/ownership boundary

- Owner comes exclusively from verified AuraTune session identity. Validate current account/role/ban state using existing auth infrastructure; role claims alone or browser state are insufficient.
- Artist/Admin can follow any eligible public artist on their own behalf, not manage other people's relations. No “Admin bypass” or target-artist ownership requirement applies.
- An invalid credential or banned caller receives no personal list or relationship changes. Public 091 reads continue anonymously and are not changed by this protected router.
- Firebase ID tokens enter existing auth exchange, not the follow endpoint. Reuse access token refresh; no new credential/cookie/CSRF system is introduced. Existing refresh cookie remains scoped to auth paths.
- Client refresh/replay must remain tied to origin account/session generation. F06 resolves current shared-client/middleware drift before use; do not retry A's mutation as B.
- Server-only Supabase service role requires explicit owner constraints and safe projection on every access. No client direct database calls.

## Operation-specific artist eligibility

| Artist state | Follow | Owner unfollow | List / profile |
| --- | --- | --- | --- |
| Existing/public | Ensure own relation present | Ensure own relation absent; repeat safe | Public fields in own list if followed; 091 profile public |
| Existing/non-public, retained own relation | Same not-found as nonexistent; no new follow | Valid own removal allowed; no name/image/visibility/existence explanation in response | Omit without placeholder/count; 091 profile identical not-found |
| Existing/non-public, no own relation | Reject new follow with same not-found | Exact no-op/rejection disposition pending F05; no relation/artist metadata leakage | Same omission; no hidden status UI |
| Nonexistent/permanently deleted | Same not-found | Same not-found, including previously known/deleted ID | Omit deleted references; no prior-existence hint |

Never place a universal public-artist guard before DELETE: that would violate hidden-owner removal. Shared identity/existence and public predicates must be reused with distinct operation policies. Authentication/ownership failures are checked without returning another account's state. Following never grants extra viewing rights.

## Existing envelope and error vocabulary

Success JSON: `success: true`, `message`, `data`, `error: null`. Failure JSON: `success: false`, `message`, `data: null`, `error` containing `code` and `details`. Exact success `data` fields/types remain F05. No copied auth `status: 'success'/'error'` alternate envelope for 092.

| Condition | Shared status/code | Behavior / limits |
| --- | --- | --- |
| Valid operation/list | Success status allowed by shared contract; exact mutation/no-op status pending F05 | Acknowledge durable outcome, or return safe public own-list projection; no invented boolean/count/time wire keys |
| Missing/invalid/expired session | 401 / `UNAUTHORIZED` or `TOKEN_EXPIRED` as applicable | Existing bounded refresh if origin unchanged; otherwise sign-in and clear private state |
| Banned authenticated account | 403 / `USER_BANNED` | Deny personal capability; current middleware returns 401, so F06 must align |
| Unauthorized owner/action | 403 / `FORBIDDEN` | No cross-account access, including Admin |
| Invalid ID/request | 400 / `VALIDATION_ERROR` | Validate approved ID domain; no sensitive details |
| Follow unknown/non-public; unfollow unknown/deleted | 404 / `NOT_FOUND` | Identical non-disclosing outcomes in each required equivalence class |
| Duplicate | 409 / `ALREADY_EXISTS` is a shared possibility, not the chosen endpoint rule | F05 selects duplicate success/no-op versus duplicate response. Either way preserve time and reconcile; never treat it as a new relationship |
| Throttled, if shared limits apply | 429 / `RATE_LIMITED` | Feedback/retry using existing infrastructure, no new feature-specific quota |
| Internal read/write failure | 500 / `INTERNAL_ERROR` | Safe error; storage rollback versus unknown commit must be distinguished internally; client may need reconciliation |

The shared `503 / AI_SERVICE_UNAVAILABLE` is AI-specific, not a follow-storage code. Existing auth's generic 503 is documented drift under F06; no new code is invented. A new general unavailable response needs shared agreement.

For not-found use a generic shared-envelope result, no artist name, image, biography, visibility flag/reason, deleted-record hint or relation metadata. Errors cannot reveal another account's relationship. A hidden-owner successful unfollow returns only an approved generic outcome, never a hidden artist DTO. No hidden names in toasts, labels, logs or response details.

## Commit, retry and reconciliation semantics

The atomic database processing point controls order. On success, the relation is committed and read-your-writes must hold for subsequent authoritative loads unless a later successful operation changes it. Response arrival order has no precedence. Duplicate follow retains original follow time; public repeated unfollow leaves absent. No raw toggle API exists.

A pre-write authentication denial can be safely refreshed/replayed only with the same originating principal/session context. Timeouts, lost responses, disconnects or ambiguous internal failures do not prove no mutation: show uncertain/reconciling state and reload authoritative current state before definitive feedback. Even an error-shaped response is insufficient if the commit result is unknown. Retrying PUT/DELETE later is another processing event and may follow another device's opposite action; no exactly-once or old-click precedence is promised.

A successful own-list load for a public artist can reconcile only if it is complete/current and F05's visibility boundary holds. If public status is lost, clear 091 content through the existing public invalidation path and omit the item; do not build a hidden relationship state viewer. If reconciliation fails, retain unresolved state with retry. Stale confirmed snapshots cannot overwrite newer confirmed results or another account's state.

## Required F05/F06 completion artifacts

Before implementation, record reviewed request/response examples and OpenAPI **3.0.3** JSON here covering:

1. New and duplicate follow, existing/absent public unfollow, hidden-owner removal, hidden/no-own-relation disposition, unknown/deleted errors.
2. Exact request-body/query acceptance, path ID type, no owner reassignment and no invented parameters.
3. Exact success/error envelopes/statuses and safe serialization, including allowed public identity and own follow-time representation/nullability.
4. Complete ordered list and authoritative state recognition under backend row caps and concurrent visibility/mutations; no hidden totals/cursor leakage. No new product pagination policy assumed.
5. Expiry/refresh failure, banned/forbidden, revoked session, auth-storage failure and principal-bound replay.
6. Count exposure/schema/freshness only if F07 resolves it in scope. No count contract is presumed by this document.

This Markdown contract records what is known; fabricating a final OpenAPI payload now would conceal unresolved decisions. Public 091 JSON remains unchanged. Shared document alignment is coordinated through owners in implementation, not modified in this planning pass.

## UI integration contract

| Boundary | Required state / effect |
| --- | --- |
| Guest at public artist | Existing login CTA; no personal read/mutation; public profile unaffected |
| Initial personal load/error | Checking/unresolved with retry, never default Not following |
| Confirmed Following/Not following | Mockup label/icon/pressed state, available desired action |
| Pending/uncertain operation | Prevent repeat toggle, retain truthful last-confirmed context, reconcile uncertainty |
| Confirmed action | Current-account feedback and next successful list/state reflect persistence; no playback |
| Account/session replacement | Clear private state, abort/ignore late responses/toasts and prevent reassigning replay |
| `/following` success-empty | Same normal state for no relations and hidden-only relations |
| `/following` error | Explicit retryable failure, not empty |
| Public artist card selection | Existing `/artist/:id` navigation; shared missing-image fallback |

Personal caches are volatile and keyed to owner/session; no migration of browser demo relationships into production authority or new persistent private cache. Use private/non-shared response caching behavior; exact cache headers belong in reviewed F05 contract. Public 091 caching must never acquire personal fields through this feature.
