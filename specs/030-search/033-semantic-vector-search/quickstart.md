# Quickstart: Semantic Vector Search Validation

**Feature**: [033 Semantic Vector Music Search](./spec.md)
**Status**: Validation outline; end-to-end execution requires an approved contract, service, and searchable catalog.

## Prerequisites

- Node.js/npm versions supported by the repository.
- Frontend and Express dependencies installed through the existing repository setup.
- Approved public semantic-search endpoint and internal AI-service contract from [semantic-search.md](./contracts/semantic-search.md).
- Approved AI/vector service, catalog data containing available search dimensions, and safe local profile/artist-name test fixtures.
- Controlled test credentials/configuration supplied locally; do not commit secrets or PII fixtures.

## Start Existing Applications

From the repository root, start the backend:

```sh
npm run dev:backend
```

In a second terminal, start the frontend:

```sh
npm run dev:frontend
```

The repository currently has no semantic-search-specific test command. The root `npm run test:backend` exercises authentication smoke tests and is not evidence of semantic search behavior. Select feature-level test tooling before treating these scenarios as automated coverage.

## Validation Scenarios

Run these after the endpoint, timeout policy, AI service, and test tooling have been approved:

1. Submit a natural-language mood/context query with at least one alphanumeric token; verify semantic results are ranked and playable.
2. Submit an empty/whitespace-only query and a query over 150 characters; verify local feedback and no AI request.
3. Use a query containing the authenticated profile's name and email; inspect all third-party requests, searchable content, diagnostics, and AI errors to prove neither value leaves the trusted boundary.
4. Use a query containing a recognized catalog artist name; verify it is preserved as intended catalog content, not removed as personal data.
5. Use a contextually ambiguous name that cannot be safely classified; verify the third-party AI request is skipped and keyword fallback is used.
6. Search a catalog song with missing lyrics or audio characteristics; verify available dimensions continue to contribute and weights are re-normalized.
7. Verify the metadata/lyrics/audio weighted ensemble is 30/40/30 when all dimensions are available and follows the approved dimension-availability behavior when one or more are absent.
8. Simulate AI unavailability, an invalid response, and a response rejected by the approved safety-validation policy; verify fallback is automatic, indicated to the listener, and has a clear no-results/unavailable state when needed.
9. Return HTTP 429 from the internal AI dependency; verify keyword fallback is used where possible, the fallback mode is shown, and no retry or retry delay is assumed. Keep public API rate-limit behavior aligned with the shared API contract.
10. Withhold a usable semantic response for 1,500 ms; verify keyword fallback starts and stale AI responses cannot replace current fallback results. Separately measure whether at least 95% of normal searches show an initial result state within 3 seconds.
11. Provide duplicate candidate songs and equal scores; verify deduplication and the approved deterministic tie-breaker.
12. Evaluate at least 100 representative mood/context queries with the specified 1–5 scale; count ratings 4–5 as relevant and allow multiple reasonable interpretations satisfying the stated intent.
13. Test live dropdown keyboard behavior, responsive layout, result playback, and regression of the other `/search` modes. Treat mock playlist suggestions and explanation text as visual references until corresponding response fields/result types are approved.

## Pending Before End-to-End Validation

- Approve the exact public and internal semantic routes, request/response schema, service authentication, and timeout propagation.
- Select provider, embedding/model, vector store, runtime/deployment, and service authentication.
- Confirm canonical data source, audio-field availability, and index update lifecycle.
- Verify the 1,500 ms fallback behavior and the separate SC-003 initial-result target.
- Approve profile source, local name-detection policy, artist recognition, and result explanation fields.
- Approve the semantic route/schema, provider/vector architecture, score ownership, and deterministic tie-breaker.
- Select feature-level test tooling.
