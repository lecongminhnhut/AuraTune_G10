# Listening History Contract (Draft)

**Feature**: [071 Listening History](../spec.md)  
**Status**: User-visible boundary requirements captured; routes and payloads require approval.  
**Shared conventions**: [AuraTune API Contract](../../../../docs/analysis-and-design/api-contract.md)

## Confirmed Behavior

- History operations require an authenticated listener and are scoped to that identity.
- A qualifying event is recorded after >=30 seconds, or >=90% completion for a track shorter than 30 seconds.
- Each qualifying replay is a separate event; repeated progress callbacks for one session must not duplicate it.
- Results are newest first and paginated; each row identifies track, artist, optional album, track duration, play timestamp, and listened duration where available.
- Clear-all requires explicit confirmation and permanently excludes cleared records from personal statistics and recommendation inputs.
- History older than 365 days is purged. Empty history has a path back to Home; replay uses existing playback behavior.

## Shared API Rules

Use the documented `{success,message,data,error}` envelope, authentication/authorization conventions, and safe errors when a public API is approved. The shared API document does not define a history endpoint or cursor schema. Do not infer route names, HTTP methods, field names, or a database from this draft.

## Approval Required Before Implementation

1. Public route/methods and event/list response shape.
2. Pagination cursor and deterministic ordering for equal timestamps.
3. Playback event idempotency key and whether listened seconds are sent or measured server-side.
4. Clear-all atomicity and partial-failure response.
5. Canonical storage source and retention-job owner/schedule.

## Security and Privacy

- Derive the owner from authentication, not a user ID in the request body or query.
- Deny cross-user reads, writes, and deletion.
- Do not expose history to other listeners. Administrative access follows the project's separately approved audit/security policy.
- Ensure clear-all excludes events from all personal analytics and recommendation inputs.
