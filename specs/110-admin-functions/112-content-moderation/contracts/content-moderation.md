# Interface Contract — Feature 112 Content Moderation

**Status:** Review-ready behavioral boundary. Exact fields/actions/pagination/status/media/Studio contracts remain M02–M11; no invented final JSON schema. [Decisions](../research.md#decision-register).

## Established HTTP inventory

Base `/api/v1`; [API Contract](../../../../docs/analysis-and-design/api-contract.md), §1/2.4/2.10 and [conventions](../../../../docs/design/api/api-conventions.md).

| Method/path | Existing permission | 112 integration / limit |
| --- | --- | --- |
| GET `/admin/songs` | Admin | Minimal non-deleted moderation list/review context, not a public catalog |
| PUT `/admin/songs/:id` | Admin | Narrow accepted restriction/reason action handling; generic shared “edit/hide” description does not authorize metadata/audio edits in 112 |
| DELETE `/admin/songs/:id` | Admin | Source-supported terminal removal mapping; exact reason/confirmation transport and physical lifecycle pending |
| GET `/songs/:id/stream` | Public eligible audio | Existing binary 200/206 Range surface; denied content still uses shared safe JSON error |
| Public songs/artist/search/recommendation paths | Context-specific public access | Consume shared eligibility; never return private restriction reason/rights/Admin records |
| Artist song POST/PUT/DELETE | Separate Artist/Admin capabilities | Existing role branches retained, but 112 is not an upload or Artist metadata implementation |

No separate restrict/restore/status/detail/reconcile route, action query field, version header or idempotency key is approved. No `/admin/songs/:id` GET appears in current inventory. M05 must approve review/target recognition within existing capabilities or an explicit extension rather than silently adding a path.

**Owner Studio gap:** US4A requires protected own restricted-song metadata/status/reason. Public detail filtered by client ownership cannot supply it. There is no accepted dedicated own-catalog/read schema here; M05/M11 must establish the exact capability jointly with 093. Do not invent `/studio/*`, `include_hidden`, a private flag on public GET or an Admin endpoint for Artist use.

## Authorization and disclosure classes

- Admin operations require current AuraTune bearer JWT/session, current unbanned Admin role and backend enforcement. Role claim alone/browser state is insufficient. Reject guest/non-Admin/expired/revoked/banned before private disclosure.
- Owner Studio requires current valid Artist and canonical ownership; Admin role does not supply ordinary Studio identity. Non-owner and public users receive no non-public metadata/reason.
- Admin may review approved non-deleted hidden/restricted records without target ownership, but cannot change track ownership or account state. No privileged preview/audio exception is added by metadata review permission.
- Restricted-owner projection includes only relevant own metadata, restriction status/reason; exclude Admin-private/personal identity. Public projection excludes non-public items and sensitive reasons/audit/rights evidence.
- `song_id`, artist/owner alternatives and visibility/deleted names in source are conditional review concepts. M03–M05 must approve concrete DTO fields/types/nullability and canonical target ID; do not promote mock properties or every alternative source name into a response schema.
- Admin review/owner/public deleted/missing distinctions must follow accepted principal-specific examples. Older blanket non-public-unavailable wording cannot erase explicit Admin/owner access, nor authorize a new deleted-content review workflow.

## List and rights review requirements

| Behavior | Confirmed semantics |
| --- | --- |
| Membership | Non-deleted songs; public, Artist-hidden and Admin-restricted states distinct |
| Search | Edge trim, lowercase comparison, substring of title OR artist name |
| Filters | AND-combined; yes/no Admin restriction with default both |
| Sort | Upload timestamp DESC, canonical `song_id` ASC |
| Paging | Twenty items/page; search/filter change resets first page |
| Empty/failure | Valid empty distinct from temporary read/validation/auth/not-found failure |
| Rights context | Available authorized source/distribution/license/attribution evidence, read-only; no invented proof or license claim |

No exact query/metadata names are approved by the shared Admin song inventory. M05 must accept pagination/navigation/filter/search fields, permitted review values and completeness for each page. Do not copy 111 user query names/DTOs or add arbitrary size/sort/count endpoints. Use bound/escaped matching rather than untrusted SQL/PostgREST syntax, locale defaults or browser array ordering.

Absent rights data may be presented as absent; failed retrieval must not become fabricated absence or verified permission. Minimal review field selection excludes unrelated accounts, credentials, tokens, session IDs, provider secrets/object internals and unnecessary Admin/owner personal data. M05 defines any optional cover/play/count display from mock context; no comment moderation/count field is automatically approved.

## Mutation boundaries and unresolved source mapping

Only moderation restriction handling/reason recording and source-supported terminal removal belong here. No editable title/artist/album/duration/cover/tags/audio/owner/uploader/source/rights/license/distribution/attribution and no separate moderation note.

| Operation concept | Fixed outcome | Required acceptance before wire implementation |
| --- | --- | --- |
| Restrict | Apply Admin layer, preserve Artist state; valid nonblank reason and confirmed execution per FR-005 | M02 direct/default interaction; M05 exact input/response; no assumed `status`/`reason`/`confirmed` body fields |
| Unrestrict | Clear Admin layer only, no new reason/second confirmation; Artist-hidden/deleted guards preserved | M02 FR-029 restore mapping; M05 exact PUT semantics |
| Duplicate restrict/unrestrict | No state/reason overwrite; truthful no-op | M05 exact status/data and invalid-input precedence |
| Terminal delete | Final no restoration through 112; missing delete not-found; preserved required history/audit | M02 action label/confirmation; M05 reason transport/status; M09 lifecycle |
| Direct removal/restoration | FR-029/030 preserved, copyright default literal from newer clarification `Vi phạm bản quyền` | M02 distinguishes reversible delisting versus terminal deletion and required confirmation/default/custom/blank cases |

Behavioral “reason” is not approval of a particular Admin-song payload key or DELETE-body/query design. Shared API names a reason field for **111 user ban**, which must not be copied as an approved moderation schema. No new default community literal, immutable audit schema or scope-wide prompt waiver is invented.

“Removed” is not automatically deleted. If the team maps direct removal to a reversible restriction/delisting while retaining terminal DELETE, that is a **proposal requiring M02 acceptance**, not a decision made by this document. If newer source intends a different scope, obtain authorized alignment before implementation; no deleted resurrection or silent FR omission.

Source-required confirmation is a user interaction to verify, not evidence for inventing a server `confirmed` flag, confirmation token or extra endpoint. Server still verifies current authority/target/input at execution. Exact request/UX mapping and Cancel/no-write tests depend on M02/M05.

## Shared envelope and error vocabulary

Success: `success: true`, `message`, `data`, `error: null`. Failure: `success: false`, `message`, `data: null`, `error` with `code`/`details`. Exact operation-specific data is pending; no new `changed`, `restorable`, `reason_history`, version or aggregate fields presumed.

| Condition | Established shared mapping | Limit |
| --- | --- | --- |
| Valid list/action | Existing 200 vocabulary; exact DELETE/no-op status M05 | Acknowledge required persisted/enforced outcome only |
| Malformed ID/filter/action/reason | 400 / `VALIDATION_ERROR` | No write; safe details, no private query/storage trace |
| Missing/invalid/expired auth | 401 / `UNAUTHORIZED` or `TOKEN_EXPIRED` | No private data/action; accepted same-origin recovery only |
| Wrong current role/ownership | 403 / `FORBIDDEN` | Owner-only Studio and Admin boundary enforced independently |
| Banned current principal | 403 / `USER_BANNED` | Existing auth 401 drift is shared M06, not copied |
| Missing target / disallowed terminal restore | 404 / `NOT_FOUND` under confirmed missing/deleted action rules | Exact authorized review distinctions M02/M05; no public hidden-detail leak |
| Unexpected data/delivery failure | 500 / `INTERNAL_ERROR` | Safe failure/uncertainty, not fake empty or success |
| Shared throttling if applied | 429 / `RATE_LIMITED` | No new moderation quota |
| Duplicate state | Endpoint-specific mapping open | Generic 409 is not an approved no-op status choice |

The shared 503/`AI_SERVICE_UNAVAILABLE` is AI-specific; do not repurpose it for storage/moderation. Existing auth/fallback nonstandard envelopes are compatibility work, not a new 112 format.

## Processing, recovery and media integration

Valid opposing actions follow successful system processing order, not response/click order. Duplicate no-op cannot replace reason or resurrect data. Current actor/target/deletion checks and approved atomic execution must protect concurrent Admin/Artist writes across workers. No new lock/transaction/RPC/version strategy chosen.

Timeout/dropped response may conceal a commit. Show uncertain/reconciling, use approved authorized target recognition before definitive feedback/manual retry and never infer state from filtered-page absence. Retrying later is not an exactly-once promise or protection against a newer opposite operation. M10 guards both stale results **and originating-actor refresh/replay**.

After acknowledged restriction/removal, every new public read/start must respect accepted eligibility, including known direct URLs and Range/cache paths; queue skips unavailable entries. Already-started playback may finish. M08 must document actual continuation-versus-new-start behavior without inventing playback session/token/DRM. UI cached before refresh may remain stale; no realtime repaint requirement is introduced.

History/audit preservation and physical media/reference cleanup follow accepted M09 scope. No full audit UI/API, history rewrite, permanent purge, retention period or provider selected. Private Admin/owner data must not enter shared caches; exact headers/cache design M05/M08.

## UI and owner integration

Admin content tab uses accepted list/search/filter/page and action vocabulary, with distinct intentional restricted/removed, missing and temporary unavailable states. Mutation pending feedback can be immediate; persisted-success toast cannot precede confirmed outcome. Default/custom/blank/confirmation behavior remains gated. Losing role/session or switching account clears private state/toasts and prevents replay as the replacement actor.

Owner Studio read is restricted to current owner metadata/status/reason and preserves unrelated 093 controls under their own policy; changing Artist preference is not self-unrestriction. No audio replacement/upload/album work is added. Missing/deleted content cannot become a default owner recovery/review view.

## Required completion artifacts

Before dependent implementation, accepted M02–M11 examples and OpenAPI **3.0.3** must specify:

1. Canonical keys/three projections, safe non-deleted list/search/filter/sort/page schemas and authorized current-target review.
2. Exact PUT restrict/unrestrict/default/custom/blank/no-op semantics, narrow allowlist, required confirmation interaction and precise DELETE reason/status behavior.
3. Source-aligned removed/terminal vocabulary, no deleted restoration, duplicate reason preservation and failure precedence.
4. Protected Artist-owner restricted-song capability and denied non-owner/public/Admin-private fields.
5. Atomic current authority and Admin/Artist race processing, uncertainty/reconciliation and origin-bound replay.
6. Actual public eligibility/media/range/cache/index/queue/history/audit integration with no bypass or invented provider/retention policy.

This Markdown contract is the current reviewable boundary; it is not permission to fabricate a final JSON schema or missing route to bypass open decisions.
