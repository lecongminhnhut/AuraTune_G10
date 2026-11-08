# Implementation Plan: AI Lyrics Search

**Branch**: `032-ai-lyrics-search` | **Date**: 2026-11-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/030-search/032-ai-lyrics-search/spec.md`

## Summary

Enable Public and Listener users to find songs from incomplete lyric fragments in the existing `/search` experience. The frontend validates a trimmed fragment, submits it through the approved lyrics-search boundary, renders identifiable song matches, and uses the existing playback path. An HTTP 503 or a request that has not completed within the clarified three-second threshold starts normalized-lyrics keyword fallback automatically. The fallback excludes title and artist matches, ranks exact phrase matches before matches containing more query words, shows a dismissible notice, and returns results in batches of 20. HTTP 429 and other failures do not trigger this fallback.

The repository has a prototype lyrics tab and mock lyric fixtures, but no production lyrics-search route, AI service implementation, or documented production lyric catalog. This plan distinguishes that baseline from planned work and leaves unresolved contract and deployment decisions explicit.

## Technical Context

**Language/Version**: Frontend JavaScript ES modules with React 18.3.1 and Vite 5.4.11; backend JavaScript ES modules with Node.js and Express 4.21.2. AI-service runtime is **NEEDS CLARIFICATION**.

**Primary Dependencies**: Existing React, Vite, Tailwind, Express, and shared AuraTune API conventions. No AI SDK, provider, model, embedding technique, vector database, or scoring formula is selected.

**Storage**: No feature-specific schema change is justified by the spec or current source. The current frontend fixtures are demo data, not an approved production lyrics source. Canonical lyric catalog ownership and retrieval are **NEEDS CLARIFICATION**.

**Testing**: Existing frontend scripts provide `dev`, `build`, and `preview`; the root backend test script targets authentication. No feature-specific test runner or lyrics-search tests currently exist. Plan focused unit, component, contract/integration, and acceptance coverage using the test tooling selected by implementation, without assuming a runner.

**Target Platform**: AuraTune responsive web application, with the AI capability behind a backend/service boundary. The exact deployed owner of that boundary is **NEEDS CLARIFICATION**.

**Project Type**: React web frontend, Express backend, and a documented but currently unimplemented AI-service boundary.

**Performance Goals**: Start fallback when the AI request has not completed within 3 seconds. No other latency/SLA or scale target is specified.

**Constraints**: Validate at least 3 words and at most 200 characters after trimming; normalize whitespace; display 20 results per batch; suppress duplicate in-flight submissions and stale responses; only HTTP 503 and the defined 3-second timeout trigger fallback; 429 remains retryable and must not trigger fallback.

**Scale/Scope**: AI Lyrics mode in the existing `/search` page only. Metadata and Semantic search behavior remain owned by their respective features.

## Constitution Check

`.specify/memory/constitution.md` contains the unmodified Spec Kit placeholder and does not define ratified project principles. Constitutional compliance cannot be certified until the project constitution is established. This is a governance dependency, not a reason to invent principles in this feature plan.

| Gate | Result | Evidence / action |
|---|---|---|
| Scope limited to feature 032 | PASS | Plan covers lyric-fragment discovery and integration points only. |
| Existing project stack retained | PASS | Reuses React/Vite, Express conventions, and existing player path; no new technology is selected. |
| No unapproved AI/schema/database decision | PASS | Provider, algorithm, payload schema, and schema changes remain unselected unless approved separately. |
| Failure behavior follows spec | PASS WITH SPEC ISSUE | FR-008 and the later clarification state 3 seconds; an earlier edge case and assumption still say 5 seconds. Resolve the stale wording in the spec before implementation acceptance. |
| Constitution principles | NEEDS CLARIFICATION | Repository constitution is a placeholder. |

## Existing Baseline, Planned Work, and Open Decisions

| Area | Existing baseline | Planned for feature 032 | Needs confirmation |
|---|---|---|---|
| Search UI | `/search` and a Lyrics tab exist in `src/frontend/src/pages/Search/SearchPage.jsx`; current results use local mock search and existing player components. | Integrate validation, AI request lifecycle, result states, fallback notice, and Load More into the Lyrics mode. | Final response-to-view mapping depends on an approved endpoint contract. |
| AI request boundary | `docs/analysis-and-design/api-contract.md` lists internal `POST /ai/search/lyrics` (backend to Python) and separately lists public `GET /search/lyrics` (query `q`, `limit`). | Implement the feature against one approved public-to-internal flow; frontend must not call an internal Python service directly. | Align the spec's `POST /ai/search/lyrics` wording with the shared contract's public/internal boundary and select the Express proxy/owner. |
| API envelope/errors | Shared contract defines `{success,message,data,error}`, `AI_SERVICE_UNAVAILABLE`/503, and `RATE_LIMITED`/429. | Preserve the shared envelope and distinguish 503/timeout from 429 and other errors. | No lyrics request body, response data schema, lyric context fields, or continuation format is documented. |
| AI service | `src/ai-service` contains only `.gitkeep`; no provider, runtime, model, route, or client is implemented. | Add an AI integration only after its owner, runtime/provider, and authentication are approved. | Service owner, runtime/provider, internal auth, and deployment are unresolved. |
| Lyrics data | Frontend mock fixtures include lyric text for a small number of demo tracks. | Search a confirmed available lyrics catalog; fallback must inspect normalized lyric text only. | Production catalog, rights/availability, indexing, and song identity mapping are unresolved. |
| Pagination and ranking | Prototype search has no approved AI continuation contract. | Return up to 20 results per batch; support Load More. Fallback ranks exact phrase above results matching more query words. | Continuation field and deterministic tie-breaker are unspecified. |

## Technical Approach

### Query validation and request lifecycle

- Trim leading/trailing whitespace and normalize repeated whitespace for request preparation. Reject empty fragments, fragments with fewer than three words, and fragments longer than 200 characters after trimming; show local feedback and send no request.
- Prevent duplicate submission of the same search while it is in flight.
- Associate each submission and every subsequent AI, fallback, and Load More response with the current search identity. Ignore stale responses; cancel older work only when the selected request mechanism supports cancellation.
- Clear prior results, pagination, errors, and fallback notice when a new search is submitted so stale results are never shown as current.

### API boundary and failure handling

- Use the shared API envelope and status meanings documented by [api-contract.md](../../../docs/analysis-and-design/api-contract.md).
- The feature spec names `POST /ai/search/lyrics`, while the shared contract currently identifies that path as internal backend-to-Python and lists public `GET /search/lyrics`. Resolve the route ownership and caller-facing boundary before implementation. The browser must not call an internal AI service directly.
- Do not invent request fields, result fields, lyric-context fields, pagination tokens, or a fallback-mode response property. The contract artifact records only confirmed behavior and marks schema gaps as pending approval.
- Treat HTTP 503 and the clarified three-second no-response threshold as unavailable-service conditions and start fallback automatically. Treat HTTP 429 as a retryable rate-limit state without fallback; present other failures according to the approved error contract.
- If fallback itself fails, show an error state and do not present old results as current. A fallback success displays the dismissible inline banner above results until dismissal or a new search.

### Matching and result presentation

- Implement fallback matching over normalized lyric text only; do not count title or artist matches. Rank exact normalized phrase matches above matches containing more submitted query words. A deterministic tie-breaker remains open and must be approved or explicitly derived from an existing project rule before implementation.
- AI matches must support incomplete fragments and ordinary whitespace, capitalization, punctuation, and diacritic differences as specified. The precise AI matching algorithm is not selected here.
- Render enough approved song identity and lyric context to recognize a match and open/play it using the existing player context. Show explicit no-results and retryable error states.
- Display up to 20 songs initially and fetch subsequent batches through Load More. Exact continuation semantics depend on the approved API contract.
- Preserve the responsive Lyrics tab and do not alter Metadata or Semantic feature behavior.

### Data flow

```text
Lyrics query -> local validation -> approved public API boundary -> AI lyrics service
                                      | 200: current AI result batch
                                      | 503 / 3s timeout: lyrics-only fallback
                                      | 429 / other error: retryable/error state
AI or fallback batch -> current-request check -> Lyrics results -> existing player
                                              -> Load More (20 per batch)
```

## Components and Responsibilities

### Existing components/services to reuse

- `src/frontend/src/routes/AppRouter.jsx`: existing `/search` route.
- `src/frontend/src/pages/Search/SearchPage.jsx`: current tabs, URL state, lyric result entry point, and playback integration.
- `src/frontend/src/utils/searchEngine.js`: normalization behavior as a reference; constrain feature fallback to lyrics only.
- `src/frontend/src/utils/aiMockData.js` and `src/frontend/src/utils/mockData.js`: demo fixtures only, not production contract or catalog.
- `src/frontend/src/components/song/SongRow.jsx`, `src/frontend/src/components/playlist/CoverArt.jsx`, common UI primitives, and `src/frontend/src/context/PlayerContext.jsx`: reuse for result rows, notices/states, and playback.
- `src/backend/server.js`: existing Express middleware and route-mounting pattern if confirmed as the public API owner.
- `src/ai-service/`: currently placeholder only; future service implementation location is not approved by this plan.

### Planned implementation units

- Lyrics query validation and request-state management, including duplicate submission prevention, request identity, timeout handling, and pagination.
- A frontend API adapter for the approved public boundary and shared response/error envelope.
- An approved backend-to-AI integration, gated on resolving API ownership, request/response schema, service runtime/provider, and authentication.
- A normalized lyrics-only fallback matcher with the specified exact phrase/query-word ranking.
- Lyrics result, empty/error/loading states, dismissible fallback notice, and 20-item Load More integration in the existing Search page.
- Focused validation, matching, request lifecycle, contract, responsive UI, and acceptance tests.

## Dependencies

- Feature specification, clarification answers, and UI references in this feature directory.
- A searchable, approved lyrics catalog with usable song identity and playback metadata.
- An approved public endpoint to frontend/internal AI service boundary and exact request/response/continuation contract.
- Confirmed owner, runtime/provider, and authentication for the AI service.
- Existing Search page, result components, player context, and backend conventions.
- Project constitution ratification before claiming formal constitutional compliance.

## Testing Strategy

1. **Unit**: trimmed length/word-count validation; whitespace, punctuation, case, and diacritic normalization; lyrics-only fallback matching; exact phrase/query-word ranking; 20-item batching; and status classification for 503, timeout, 429, and other errors.
2. **Component**: validation feedback, submission/loading, result identity and lyric context, Load More, empty/error state, dismissible fallback banner, duplicate submission protection, and stale-response suppression.
3. **Contract/integration**: approved public request/response mapping, shared success/error envelope, 503 and 3-second timeout fallback, 429 non-fallback behavior, continuation semantics, and fallback failure. Do not assert undocumented fields.
4. **Acceptance**: incomplete lyric fragment finds an expected catalog song; normalized query variations work; no-results is explicit; fallback and banner behave as specified; more than 20 results can be loaded; playback works; and a newer search supersedes older responses.
5. **Regression**: `/search` navigation, other search modes, existing playback, auth/health endpoints, and responsive layout. Keep tests within feature-owned scope and do not implement other search features.

## Risks and Technical Considerations

- **API boundary conflict**: shared contract distinguishes public `GET /search/lyrics` from internal `POST /ai/search/lyrics`, while the spec names POST without clarifying the browser-facing boundary. Resolve before implementation.
- **Undocumented schema**: no exact payload, response data, or continuation schema exists. Do not invent one.
- **Missing production AI and lyric services**: the repository contains no AI service implementation and only demo lyric fixtures. Do not mistake them for deployable dependencies.
- **Timeout conflict**: later clarification and FR-008 specify 3 seconds; earlier spec edge/assumption text says 5 seconds. The plan uses 3 seconds but requires spec cleanup/review.
- **Fallback tie-breaking**: required primary ordering is clear; equal-rank ordering is not. Leave the tie-breaker open pending an approved deterministic rule.
- **Request races**: AI timeout, fallback, Load More, and a newer query can overlap. Guard every result, notice, and error state update with the current search identity.
- **No established frontend test runner**: choose/approve tooling during implementation without expanding the plan into unrelated infrastructure work.
- **Constitution placeholder**: formal project-governance checks cannot be completed until constitution content is ratified.

## Open Clarifications

1. Is the caller-facing endpoint the public `GET /search/lyrics`, with Express proxying to internal `POST /ai/search/lyrics`, or is another approved routing design intended?
2. What are the exact approved request and response data schemas, including song identity/lyric context and the continuation mechanism for 20-item batches?
3. Which service owns the public route and internal AI call, and what runtime/provider/authentication are approved?
4. What is the approved production lyric source/index and its song identity mapping?
5. What deterministic tie-breaker applies when fallback candidates have equal phrase/query-word rank?
6. Should the response carry an explicit search/fallback mode, or should the UI derive fallback mode from the local 503/timeout transition?
7. Confirm the 3-second clarification supersedes the remaining 5-second text in `spec.md` and reconcile that text before implementation.

## Complexity Tracking

No database migration, AI provider, algorithm, or unrelated search behavior is proposed. Feature complexity is limited to the lyrics request lifecycle, approved service integration, lyrics-only fallback, pagination, and safe integration with the existing Search/player UI. Open architecture and contract decisions remain gates for implementation rather than hidden assumptions.
