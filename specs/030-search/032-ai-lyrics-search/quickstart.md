# Quickstart: AI Lyrics Search Validation

**Feature**: [032 AI Lyrics Search](./spec.md)  
**Status**: Validation outline; end-to-end execution depends on the approved API boundary, schema, AI service, and production lyric source.

## Prerequisites

- Node.js/npm versions supported by the repository.
- Frontend and Express dependencies installed using the repository's existing setup.
- Approved caller-facing API route and exact contract from [lyrics-search.md](./contracts/lyrics-search.md).
- An available AI service and searchable lyric catalog, or controlled mocks for contract/failure tests.
- No production credentials committed to the repository; configure any approved secrets through the existing local environment mechanism.

## Start the Existing Applications

From the repository root, start the backend:

```sh
npm run dev:backend
```

In a second terminal, start the frontend:

```sh
npm run dev:frontend
```

The repository currently provides no feature-specific frontend test command. The root `npm run test:backend` exercises existing backend authentication behavior and is not a lyrics-search validation suite.

## Validation Scenarios

Run these scenarios after the approved integration and focused tests exist:

1. Submit a lyric fragment with at least three words and no more than 200 trimmed characters; verify the approved request returns recognizable song results and existing playback works.
2. Submit empty, whitespace-only, too-short, and over-limit fragments; verify local feedback appears and no search request is sent.
3. Return HTTP 503; verify lyrics-only fallback starts automatically and the inline notice appears above results.
4. Hold the AI request beyond three seconds; verify the same fallback transition occurs and a later stale AI response cannot replace fallback/current-query results.
5. Return HTTP 429; verify a retryable message appears and no fallback request starts.
6. Return another documented error or fail the fallback; verify an error state appears and old results are not presented as current.
7. Provide more than 20 matches; verify the first batch is capped at 20 and Load More uses the approved continuation contract.
8. Dismiss the fallback notice, then submit a new search; verify the notice remains dismissed for the current result and resets for the new search as specified.
9. Submit a newer query while an older AI/fallback request is pending; verify only the newer query can update visible state.
10. Use query variants with ordinary case, whitespace, punctuation, and diacritic differences; verify the approved normalization behavior and lyrics-only fallback ranking.

## Pending Before End-to-End Validation

- Approve the public versus internal endpoint boundary and exact request/response schema.
- Confirm AI service owner, runtime/provider, authentication, and deployment.
- Identify the production lyric source and its song/playback identity mapping.
- Resolve the 3-second versus 5-second wording conflict in `spec.md`.
- Select a deterministic tie-breaker for equal-rank fallback matches.
- Establish a feature-level test runner/commands if implementation requires one.
