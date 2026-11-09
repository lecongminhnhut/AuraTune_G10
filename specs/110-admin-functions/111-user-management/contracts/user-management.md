# Interface Contract — Feature 111 User Management

**Status:** Review-ready behavioral/integration contract. Existing paths/query names, permitted account fields and shared envelope are evidenced; final list/pagination/no-op/role wire schemas remain U02–U09. This is **not** a newly approved JSON schema. [Decision register](../research.md#decision-register).

## Established surface

Base `/api/v1`; [shared API](../../../../docs/analysis-and-design/api-contract.md), §1/2.10 and [conventions](../../../../docs/design/api/api-conventions.md).

| Method/path | Required current authority | Confirmed capability |
| --- | --- | --- |
| GET `/admin/users` | Valid session, current unbanned Admin | Directory; documented `q`, `role`, `is_banned`; server-filtered ordered page |
| PUT `/admin/users/:id/ban` | Same, eligible non-Admin other target | Persistent ban; documented body name `reason`; exact default/custom/no-op schema pending |
| PUT `/admin/users/:id/unban` | Same, accepted target policy | Explicit clear of active ban; duplicate outcome truthful; no unban reason required by source |

**Missing capability:** FR-022 requires changing another account's role. No role-update method/path/body is approved by the shared API. Do not invent `/role`, a generic account update, PATCH, or repurpose artist-link. U02/U05 must approve the capability and source-precedence alignment before implementation.

**Missing detail/reconciliation contract:** The spec references reviewing/missing targets but establishes no Admin target-detail endpoint or separate page. Use the approved list for ordinary review. Exact current-target recognition after uncertain mutation requires U05 evidence; no GET `/admin/users/:id`, status route, new ID query or response property is silently added. Absence from one filtered/paged result is not target-not-found or mutation proof.

Existing `/api/v1/auth/me` and refresh are implemented auth-owned hydration candidates; 111 does not redefine their schemas or invent a new identity endpoint.

## Authorization and target policies

- Authenticate AuraTune bearer JWT through existing session/current-account verification; Firebase token goes through existing exchange, not directly to Admin operations.
- Derive actor from verified current account, not request body/query/role claim alone. Require current `admin` and not banned; stale JWT role must not bypass current DB role.
- No directory data or target-existence detail for guests/non-Admins/invalid or banned sessions. Reject protected access before account disclosure.
- Ban self/other Admin is forbidden, checked server-side against current target role. Self-role change prohibited. No client-disabled control substitutes for this.
- Admin-target unban and banned-target role-change edges remain U02; do not assume the ban prohibition is an approved universal target guard or auto-unban on role change.
- Validate canonical target ID under U04, including `id` versus `user_id` mapping; no assumed UUID-only validator or ambiguous alternate-ID targeting.
- No account deletion/reset/impersonation/export/artist linking; no moderation/stats/system-control actions through this router.

## Directory contract

Known query names and behavior:

| Name | Approved semantics |
| --- | --- |
| `q` | Trim edges; case-insensitive substring of `email` OR `display_name` |
| `role` | Exact allowed `user`, `artist`, `admin` |
| `is_banned` | Boolean true/false filter |
| Combined filters | AND |
| Default order | `created_at DESC`, then `user_id ASC` |
| Page size | At most 20 records; filter/search change resets first page |

The behavior does not approve pagination request fields, metadata wrappers, totals/cursors or arbitrary sort/size options. U05 supplies exact transport; U08 supplies literal matching/collation and concurrent-page semantics. Escape wildcard/filter syntax safely rather than expanding substring semantics or interpolating raw PostgREST/SQL fragments. Do not duplicate mock accent folding/concatenated-field matching as approved behavior.

Account item fields are restricted to **`user_id`, `display_name`, `email`, `role`, `created_at`, `is_banned`, and `ban_reason` when recorded**. Exact nullability/types/optional reason and enclosing page shape require accepted examples. This allowlist does not approve a physical `ban_reason` column. Never serialize password/hash/token/session ID, device/IP, OAuth/provider secrets, avatar or undeclared account fields. A derived initial from display name need not add a DTO field.

Successful empty page/result is distinct from validation/auth/storage failure. Use fresh authoritative state after writes; private response caching rules/headers must prevent shared disclosure under U05. No cache TTL/datastore or new count endpoint is selected.

## Mutations and reasons

Ban/unban are desired-state operations. Do not send a target's current frontend boolean as a server toggle or permit generic user-row updates.

- Effective ban reason must be recorded and nonblank after trim. Shared contract names the input `reason`.
- FR-023 direct action without custom reason must use exactly `Vi phạm tiêu chuẩn cộng đồng`. U03/U05 must accept omission/default insertion semantics; explicitly blank/whitespace remains invalid under FR-013. Do not silently collapse these cases.
- No mandatory confirmation/reason modal is introduced by 111. Custom reason input/API handling cannot remove direct default action.
- Duplicate ban/unban acknowledges no-op/idempotent state without contradiction. Exact status/data, duplicate-reason behavior and reason retained/cleared after unban remain U03/U05.
- Only approved safe outcome/account projection may be returned. No new `changed`, `no_op`, audit fields, version key or session revocation count is presumed.
- Never disclose target sessions/tokens or privileged internal audit/provider data.

Role mutation, once approved, may write only the accepted role of another account; three allowed values and self protection are fixed, but method/path/body/status are not. It must not change ban/artist link/media/follows or use artist provisioning as a side effect.

## Standard envelope and failure vocabulary

Success: `success: true`, `message`, `data`, `error: null`. Failure: `success: false`, `message`, `data: null`, `error` with `code` and `details`. These names come from shared API, not current auth/fallback drift. Exact operation-specific data/statuses remain U05.

| Condition | Established shared status/code | 111 safeguard |
| --- | --- | --- |
| Valid directory/mutation | Existing 200 success vocabulary; exact operation mapping U05 | Confirm actual durable result; no optimistic success or fake empty |
| Malformed filter/ID/payload/blank reason | 400 / `VALIDATION_ERROR` | Safe actionable details only; no state change |
| Missing/invalid/expired authentication | 401 / `UNAUTHORIZED` or `TOKEN_EXPIRED` | No data/write; same-origin bounded auth recovery only when accepted |
| Valid non-Admin / forbidden self/Admin-target ban | 403 / `FORBIDDEN` | No data/state change; self-role denial mapping U05 |
| Banned current account | 403 / `USER_BANNED` | Deny auth capability; current middleware/refresh 401 drift U06 |
| Missing authorized target | 404 / `NOT_FOUND` | No prior-existence/internal hints and no mutation |
| Unexpected read/write failure | 500 / `INTERNAL_ERROR` | No raw query/provider traces; uncertain commit remains uncertain |
| Duplicate state | No endpoint-specific status approved | U05 selects truthful no-op/idempotent outcome; generic 409 vocabulary is not an automatic choice |
| Shared throttling if applied | 429 / `RATE_LIMITED` | Reuse accepted infrastructure; no invented 111 quota |

Shared 503/`AI_SERVICE_UNAVAILABLE` is AI-specific; do not repurpose it for Admin storage or add new generic codes without shared agreement. Error precedence between target guards and malformed input needs accepted U05 examples, while auth/authorization must prevent protected disclosure.

## Sessions, consistency and recovery

After acknowledged ban, new local/Firebase login and subsequent authenticated operations must reject the account; active sessions are invalidated, and after unban old credentials must remain unusable. Reuse existing `user_sessions`/revocation as a candidate, not a selected all-session transaction. U06/U07 approves atomic account/reason/invalidation and concurrent login/refresh coordination.

Role changes must affect subsequent server checks using current DB role. On loss of Admin authority, withhold directory/private results and cancel unsafe refresh/replay. No provider-wide token revocation or universal role-change signout policy is introduced.

Request origin includes acting account/session generation; do not retry A's request using B credentials, even if B also has Admin role. A pre-write expiry rejection can use accepted same-origin recovery; a timeout/dropped response may hide a committed action and must not be automatically resent. U05/U09 must define authorized reconciliation. A successful later list alone is not target-state proof if the target is absent due to filtering/pagination. Without safe recognition, remain unresolved rather than claim ban/unban/role success or missing target.

U07 documents opposing/concurrent operation outcomes, protected current-role guards, rollback and acknowledged read consistency. No client timestamp precedence, version header, exactly-once key, RPC or transaction isolation level is approved here.

## UI integration contract

| Boundary | Required presentation/effect |
| --- | --- |
| Auth resolving/guest/non-Admin | No private list; existing login/forbidden pattern |
| Valid list request | Loading, successful data, successful empty or safe failure; old query results ignored |
| Search/role/ban filter change | New first-page generation; exact accepted request params only |
| Direct mutation | Pending feedback immediately; disable repeated action; success toast only after confirmed result |
| Duplicate/no-op | Truthful acknowledged state, no new-action claim beyond approved semantics |
| Definite error | Preserve truthful last-confirmed context if still authorized; correction/retry, no false saved state |
| Unknown commit | Uncertain/reconciling; no blind toggle/retry or definitive toast |
| Account/session replacement or lost Admin role | Clear private data/late feedback; prevent request replay under new principal |
| Other Admin tabs | 112/113/shared shell stay independent; no automatic mock-count/AI/reset implementation |

## Required contract completion before implementation

Accepted U02–U09 evidence and final OpenAPI **3.0.3** must cover:

1. Canonical target ID/field types, safe list schema, exact pagination navigation and empty/error behavior, all three filters and default ordering.
2. Ban custom/default/explicit-blank examples, required persistence/revocation success boundary, duplicate and unban reason outcomes.
3. Exact role capability and target/self policies, with no artist-link or generic-update bypass.
4. Forbidden/missing/invalid/banned/expired/storage responses including existing auth compatibility.
5. Current-target recognition for uncertain outcomes under filters/paging/concurrent changes without an invented endpoint.
6. Current actor/target role and login/refresh/ban races, durable old-session invalidation, origin-bound replay and private cache behavior.

This Markdown artifact is the reviewable interface boundary. It does not claim missing JSON schemas, physical structures or role paths are approved.
