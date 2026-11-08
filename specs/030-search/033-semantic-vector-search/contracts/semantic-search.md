# Semantic Search Contract (Draft)

**Feature**: [033 Semantic Vector Music Search](../spec.md)
**Status**: Boundary requirements captured; semantic endpoints and payload require approval.
**Shared conventions**: [AuraTune API Contract](../../../../docs/analysis-and-design/api-contract.md)

## Service Boundary

- The existing Express backend is the planning owner for any approved public semantic-search API.
- Semantic processing is expected to remain behind the shared internal Backend-to-Python AI-service boundary; the frontend must not call an internal AI service or third-party provider directly.
- The feature-specific public route, internal route, request/response schema, service runtime, provider, authentication, and timeout propagation are not defined by this draft and require approval before implementation.
- The existing public `GET /search` contract is for text search, and `GET /search/lyrics` is for lyrics search. Neither is a semantic-vector endpoint by inference.

## Confirmed Feature Requirements

- Accept a Listener's natural-language mood, emotion, or context query.
- Use available metadata, lyrics, and audio characteristics for semantic ranking.
- Re-normalize the specified metadata 30%, lyrics 40%, and audio 30% weights across dimensions available for both the query and song.
- Do not send listener names or email addresses to third-party AI services, diagnostics, or AI error payloads.
- Start keyword fallback when semantic processing is unavailable, invalid, times out, returns an unsafe response, or cannot safely process the request.
- Validate query length and content locally: accept at least one meaningful alphanumeric token up to 150 characters; reject empty/whitespace-only or over-limit input before semantic processing.
- Start keyword fallback after 1,500 ms without a usable semantic response; this is separate from the 3-second SC-003 initial-result goal.
- Treat HTTP 429 returned by the internal AI dependency as unavailability and use keyword fallback where possible, as specified by the feature edge case.
- Do not include duplicate songs; order results by descending semantic score or applicable keyword ranking.
- Use the existing shared success/error envelope and relevant HTTP error conventions where the approved public endpoint applies them.

## Shared API Conventions

The shared API contract defines the JSON envelope `{success,message,data,error}` and error codes including `AI_SERVICE_UNAVAILABLE` (503) and `RATE_LIMITED` (429). It describes internal AI Service communication as Backend-to-Python and states the frontend does not call that internal service directly. The AI-service 429 fallback rule here applies to the internal dependency; any rate limit on the public API continues to follow the shared API convention.

The shared API document does not define a semantic-vector endpoint, request payload, response data, vector format, per-dimension scores, pagination, or explanation fields. Its lyrics endpoint is not a semantic-vector contract and must not be reused by inference.

## Unresolved Contract Boundary

Before implementation, approve:

1. The public route/method and request inputs used by the frontend.
2. The internal AI-service route/method and service owner.
3. The request/response schema and validation/error mapping.
4. Whether the AI service returns separate metadata/lyrics/audio similarities or the combined weighted score.
5. The schema for song identity, playable result information, optional relevance explanations, and semantic/fallback mode.
6. Provider/service authentication and timeout propagation.

This document intentionally does not invent those values or field names. The current Express backend is the public-boundary planning choice based on the implemented API server; the exact route and the internal AI-service owner/runtime remain approval items.

## Privacy Contract

- Perform profile matching, email detection, and context-aware name detection locally before any third-party AI processing.
- Preserve a name only when recognized as a catalog artist under the approved recognition policy.
- Do not transmit listener names/emails or include them in external semantic requests, searchable payloads sent to the provider, diagnostics, logs, or AI-related error payloads.
- If safe sanitization or the distinction between personal and artist names cannot be verified, do not call the third-party AI service and use the approved keyword fallback.
- Keep profile values and unsanitized query content inside the trusted application boundary. Exact retention/logging policy must follow project security guidance.

## Semantic Ranking Contract

The ranking weights are fixed by the feature spec:

| Dimension | Weight |
|---|---:|
| Metadata similarity | 30% |
| Lyrics similarity | 40% |
| Audio-characteristic similarity | 30% |

Re-normalize across dimensions available for both the query and song. The contract owner must specify whether dimension scores are returned to the backend/client or the weighted score is calculated within the AI service. No alternate formula or score range is defined here.

## Timeout Behavior

Start keyword fallback when semantic processing has not produced a usable response within 1,500 ms. This is the threshold recorded in the latest clarification, FR-016, and SC-003a. SC-003 separately measures visible initial results within 3 seconds for at least 95% of normal searches. Do not extend the fallback threshold to 3 seconds.

## Error and Fallback Behavior

| Condition | Required behavior |
|---|---|
| AI unavailable, invalid response, or approved timeout | Start keyword fallback automatically. |
| AI response is unsafe under the approved response-validation policy | Reject the semantic response and start keyword fallback. The detailed policy must be approved; this draft does not invent content filters. |
| Internal AI service returns HTTP 429 | Treat as AI unavailability and use keyword fallback where possible; do not infer a retry policy. |
| Query unsafe to send or PII removal cannot be verified | Do not call third-party AI; use keyword fallback. |
| Semantic and keyword search produce no results | Show a clear no-results state. |
| Catalog temporarily unavailable | Show a clear unavailable-catalog state. |
| Any error response | Avoid credentials and sensitive diagnostic details; do not expose PII. |

The feature spec's edge case explicitly treats an AI-service rate-limit response as unavailability and uses keyword fallback where possible. The feature does not define retries or retry delays. This rule does not override the shared public API's `RATE_LIMITED` response for any separately enforced public request limit.
