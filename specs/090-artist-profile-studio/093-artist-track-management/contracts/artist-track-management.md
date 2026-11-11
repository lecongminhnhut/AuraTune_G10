# Interface Contract — Feature 093 Artist Track Management

**Status**: Review-ready interface requirements; exact payload/read/storage contracts remain S03/S05–S10. No invented field names, endpoint extensions, media provider or final OpenAPI schema. [Decision register](../research.md#decision-register).

## Existing HTTP surface

Base `/api/v1`; [API Contract](../../../../docs/analysis-and-design/api-contract.md), §1/2.4/2.10 and [conventions](../../../../docs/design/api/api-conventions.md).

| Existing method/path | Existing contract | 093 integration / limitation |
| --- | --- | --- |
| POST `/songs` | Artist/Admin; multipart/form-data | Artist-owned create with actual binary and approved metadata/declarations. Multipart field names/types missing; no client owner assignment. |
| PUT `/songs/:id` | Artist/Admin; edit song | Metadata edit or Artist preference under reviewed payload semantics. No binary replacement/admin override implied by generic edit path. |
| DELETE `/songs/:id` | Artist/Admin; delete song | Artist-owned confirmed removal; response/no-op policy and lifecycle S05/S09. |
| GET `/songs`, `/songs/:id`, `/artists/:id/songs` | Public catalog/detail | Public projection only, not an all-own-hidden-track Studio read. Do not expand public response with management fields. |
| GET `/songs/:id/stream` | Public binary stream; 200/206, Range | Existing owner supplies stream behavior; eligibility/direct-link/range enforcement S08, no new stream protocol. |
| GET `/genres` | Public genre catalog | Approved taxonomy integration; actual mapping/backend implementation S03. |
| `/admin/songs*` capabilities | Admin moderation | Owned by Group 110; not Studio actions or a substitute private Studio list. |

**Missing contract**: protected retrieval of own complete Studio catalog, artist identity and three metrics, including hidden/restricted tracks and partial failures. S05 must select reviewed reuse or an explicit approved extension; no new `/studio/*`, `/users/me/tracks`, stats, upload-session or reconciliation route is asserted here. Public endpoint filtering by `artist_id` cannot safely provide private management data.

The shared mutation roles include Admin; Studio FR-001 is Artist-only. Preserve both by operation/policy composition: User/Admin cannot enter Artist Studio or impersonate an Artist; existing Admin capability is separately authorized and remains 110-owned. No changes to shared contract are made by this artifact.

## Request and projection requirements

- Authenticate using existing AuraTune access JWT/session. Derive current Artist/owner server-side. Body/query owner/artist, plays, approval or moderation attributes cannot reassign authority.
- Upload transports actual binary, title, optional album, genre, entered duration, plus reviewed representation of recorded rights declarations if reconciled in S04. No guessed multipart names/types, storage keys, upload IDs or credential fields.
- FormData client lets the browser create multipart boundary. Existing server JSON middleware cannot parse binary; approved bounded parser is S06.
- Core duration exactly `^\d{1,2}:[0-5]\d$`. Recorded MP3-only ≤52,428,800 bytes and edit-only 200-code-point limits have source provenance; do not infer MP3/WAV support from older mock or extend edit limits to upload.
- Metadata edit permits title/album/genre/duration only, preserving media/ownership/plays/preferences/Admin restriction. Optional/clearable album representation and PUT update semantics must be explicit under S03/S05. No audio replacement.
- Preference updates cannot clear Group 110 restriction or recreate deleted content. Exact status/body representation unconfirmed; no invented `status`, `is_hidden` or publication enum wire key.
- Protected responses contain only current owner's approved track/metrics data, with sanitized display filename if uploaded. Internal provider object identity/credentials, other artists' private data and raw account rows are never serialized. Public projection remains narrower and excludes hidden/deleted/restricted content and inference through totals.

## Publication, rights and storage boundary

Spec/checklist require active publication immediately after valid completed upload under existing visibility rules, without Admin review. No awaiting-approval/published/rejected workflow is introduced. Technical transfer/reconciliation state is internal, not a new publication policy.

Recorded owner rights choices are declarations, not system verification/legal approval. Source/permission/attribution storage/public attribution needs reviewed fields. Do not add proof-document upload, provider licenses or a blanket permission claim for any named catalog/source.

The backend media interface must support approved binary persistence and safe reference lifecycle; concrete method names, provider SDK/options/object IDs are not selected. Required outcomes are persisted playable media association, safe failure/compensation, current-authorization finalization and S08 access control for hidden/deleted tracks. S07 must specify deduplication/reconciliation using actual existing or reviewed capability; no invented idempotency/reconcile endpoint or persistent operation table.

Recorded G090-D07 is an integration outcome: deny new starts/replays after hide/delete through all entry points, skip unavailable queued items, permit already-started playback to finish. A permanent externally public raw URL may bypass this; do not claim it is compliant merely because the catalog omits the track. Range/content-type delivery must remain consistent with existing stream contract; provider selection alone does not solve authorization.

## Shared envelope and errors

Use existing success JSON `success: true`, `message`, `data`, `error: null`; failure JSON `success: false`, `message`, `data: null`, `error` with `code` and `details`. Exact data/field-error schemas and mutation statuses require S05. Existing auth/fallback `status`/raw-error bodies are drift to align, not copied into 093.

| Outcome | Established vocabulary | Required interpretation |
| --- | --- | --- |
| Valid create/read/update/delete | Shared 200/201 vocabulary; exact mapping S05 | Acknowledge confirmed persistence/outcome, not filename selection or optimistic local state |
| Invalid metadata/file/declaration | 400 / `VALIDATION_ERROR` where applicable | Safe actionable feedback; retain open form; exact field names unavailable until reviewed |
| Missing/invalid/expired auth | 401 / `UNAUTHORIZED` or `TOKEN_EXPIRED` | Existing bounded recovery only for same origin account/session; no uncertain POST replay |
| Banned account | 403 / `USER_BANNED` | Shared contract; current middleware drift requires S05 |
| Wrong role/ownership | 403 / `FORBIDDEN` | No private target metadata; unknown versus inaccessible protected-target mapping finalized S05 |
| Missing/deleted resource | 404 / `NOT_FOUND` | No resurrection or stale public data; repeated-delete outcome explicitly reviewed, not guessed |
| Conflict/throttling | 409 / `ALREADY_EXISTS`, 429 / `RATE_LIMITED` only when semantically valid | Do not label identical bytes/title as duplicate policy or invent a version-conflict code |
| Unexpected persistence/media error | 500 / `INTERNAL_ERROR` | Safe failure or uncertainty feedback; never raw provider traces/secrets; reconciliation if commit unknown |

No 413/415/422 or new upload-specific codes are added as approved vocabulary; if desired they require shared-contract review. `503 / AI_SERVICE_UNAVAILABLE` is AI-specific, not a media-storage code. S05 aligns general outage semantics with auth owners.

Validation rejection before work is a definite failure; timeout/disconnect/ambiguous error after submission may conceal commit. No false success, unchanged/deleted claim or automatic POST replay. Client retries only after reconciliation under recorded D08; auth refresh must not change principal or duplicate an accepted submission.

## Required completion of the contract

Before implementation, S05 must publish reviewed examples and OpenAPI **3.0.3** JSON here, coordinated with affected owners:

1. Protected catalog/identity/metrics read path, auth roles/ownership, safe DTOs and complete deterministic transport, including partial failure/stale presentation and historical plays after deletion.
2. Exact upload multipart schema, rights declarations, field validation, approved parser/content/byte limits and stable media association semantics.
3. Metadata and preference PUT bodies/types/clear semantics, strict allowlist, Admin restriction preservation and response truthfulness.
4. Confirmed delete, repeated delete/missing/forbidden outcomes, physical/lifecycle failure boundary and safe metric update.
5. Origin-bound auth refresh, unknown submission reconciliation and same-submission deduplication without guessed endpoints/keys.
6. Provider interface/evidence, failure mapping, safe media cleanup/access/range behavior and authorization across long upload/commit.
7. Distinction between recorded supplemental source decisions and adopted contract fields; S04 alignment does not itself approve DB structures.

Until these decisions close, this Markdown artifact is the known interface boundary; it deliberately does not pretend an invented JSON schema is implementation-ready.

## UI integration requirements

Existing `/studio` reuses Modal/LoginRequired/Forbidden and profile link. Identity, catalog, metrics and mutation state must be account/session/artist keyed. Successful catalog/stat portions survive peer failures; no fake zero/empty. Preserve open input/accessibly selected File after error, discard on explicit pre-submit close, reconcile after submitted departure, and allow only same-account recovery of temporary accessible input. No durable browser draft/audio storage is introduced.

Success toasts follow confirmed upload/edit/preference/delete outcomes for current account; no “public again” if moderation still restricts. Delete Cancel sends nothing. Unlinked Artist is not silently repaired/provisioned. Guest/User/Admin Studio access follows Artist-only gate without changing public 091 or personal 092 role rules.
