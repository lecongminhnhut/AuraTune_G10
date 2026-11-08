# AI Lyrics Search Contract (Partial)

**Feature**: [032 AI Lyrics Search](../spec.md)  
**Status**: Partial design record; implementation contract requires approval.  
**Shared conventions**: [AuraTune API Contract](../../../../docs/analysis-and-design/api-contract.md)

## Confirmed by the Feature Specification

- The feature spec names `POST /ai/search/lyrics` for AI lyric-fragment search.
- Public and Listener users can use the feature without an additional feature-specific permission.
- The request is treated as unavailable when it returns HTTP 503 or has not completed within 3 seconds; these conditions start keyword fallback.
- HTTP 429 is rate limiting and must remain a retryable error without invoking the 503/timeout fallback.
- Search results are presented in batches of up to 20 with a Load More action.

## Shared API Requirements

AuraTune's shared API convention uses the `{success,message,data,error}` JSON envelope. The shared error codes relevant to this feature are `AI_SERVICE_UNAVAILABLE` for HTTP 503 and `RATE_LIMITED` for HTTP 429. Follow the full shared contract for common status and error behavior.

## Boundary Conflict Requiring Resolution

The shared API document lists public `GET /search/lyrics` with query parameters `q` and `limit`, and separately lists internal `POST /ai/search/lyrics` as a backend-to-Python AI Service endpoint. The feature specification names the POST path but does not state whether the browser calls it or whether Express exposes/proxies a public endpoint. The shared document says the frontend does not call the internal AI service directly.

Before implementation, the feature owner must approve the public route and the internal service call path. This partial artifact does not select one.

## Unspecified Schema (Must Be Approved)

The following are intentionally undefined; do not infer them from frontend mock objects:

- POST request content type and body fields, including the lyric-fragment field name.
- Successful response `data` fields for song identity, display metadata, and lyric context.
- Pagination continuation field(s) for 20-item batches.
- Whether the response includes an AI/fallback mode indicator.
- Exact error `message` and `details` content presented to users.
- Internal service authentication and timeout propagation details.

## Status Handling Required by the Feature

| Condition | Required feature behavior |
|---|---|
| HTTP 503 / `AI_SERVICE_UNAVAILABLE` | Start normalized-lyrics fallback automatically. |
| No completed response within 3 seconds | Treat as unavailable and start the same fallback. |
| HTTP 429 / `RATE_LIMITED` | Show a retryable rate-limit state; do not invoke fallback. |
| Other failure | Show an appropriate error state; do not show stale results as current. |

## Approval Gate

Do not implement API adapters or contract tests against invented request, response, or continuation fields. Resolve the boundary conflict and publish the exact contract before those tasks are considered ready.
