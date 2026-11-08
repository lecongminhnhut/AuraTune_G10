# Implementation Plan: AI Lyrics Search

**Branch**: `032-ai-lyrics-search` | **Date**: 2026-11-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/030-search/032-ai-lyrics-search/spec.md`

## Summary

Implement lyric-fragment search for Public and Listener users on the existing `/search` page. The Metadata, AI Lyrics, and Semantic modes remain separate tabs; this plan owns only the AI Lyrics mode. The frontend will validate a trimmed lyric fragment, call the approved `POST /ai/search/lyrics` contract, render typed song/lyric matches, and protect the current search from stale or duplicate responses. An AI `503` or unavailable-service timeout will automatically trigger normalized-lyrics keyword fallback, show a dismissible inline notice, and preserve direct playback through the existing player context. Other failures, including `429`, remain retryable error states and must not silently invoke the 503 fallback.

The current repository already has `/search`, `SearchPage`, lyric matching in the demo `searchEngine`, shared `SongRow`/cover/player components, and seeded lyric data. The backend has Express/auth infrastructure but no AI lyrics route, and `src/ai-service` contains only `.gitkeep`. The plan therefore distinguishes the existing demo UI/data baseline from the AI service integration and production contract work still required.

## Technical Context

**Language/Version**: JavaScript ES modules; React 18.3.1/Vite 5.4.11 frontend; Node.js/Express 4.21.2 backend. The AI service runtime/provider is not selected in the repository and is **NEEDS CLARIFICATION**.

**Primary Dependencies**: React, React DOM, Vite, Tailwind CSS, lucide-react, existing Express/CORS middleware, and the approved AI lyrics-search service contract. No new AI SDK, model, embedding method, or vector database is selected by this plan.

**Storage**: Existing approved lyric catalog/content source. The current demo uses local frontend mock data and LocalStorage-backed app state; this feature does not define a new database schema or persistence model.

**Testing**: Focused frontend unit/component tests, backend/API contract integration tests, mocked AI-service failure/timeout tests, and responsive end-to-end acceptance tests. The repository currently exposes Vite build scripts and a Node backend test file but no feature-specific test runner convention.

**Target Platform**: AuraTune responsive web application and the approved AI search service reachable by the backend/service boundary.

**Project Type**: Web application with React frontend, Express backend, and a separate AI-service boundary.

**Performance Goals**: The AI request is treated as unavailable after 3 seconds and fallback begins automatically. No separate end-to-end latency target or AI provider SLA is specified.

**Constraints**: Query must contain at least 3 words and at most 200 characters after trimming whitespace. Search must use the approved `POST /ai/search/lyrics` contract. Initial and subsequent batches contain 20 songs. Fallback searches normalized lyric text only, ranks exact phrase matches above matches containing more query words, and excludes title-only/artist-only matches. Duplicate in-flight submissions and stale superseded responses must be prevented.

**Scale/Scope**: Lyric-fragment discovery for songs, with Public and Listener access, one AI Lyrics tab within `/search`, automatic fallback for only the defined unavailable-service conditions, and direct playback of returned songs.

## Constitution Check

*GATE: Must pass before implementation tasks are generated.*

`.specify/memory/constitution.md` is still the unratified Spec Kit placeholder template and contains no actual project principles or governance rules. No project-specific constitutional gate can therefore be certified; this is recorded as a repository governance gap rather than filled with invented rules.

| Gate | Result | Evidence / action |
|---|---|---|
| Feature scope is limited to 032 | PASS | All planned behavior maps to AI lyric search in `032-ai-lyrics-search`; Metadata and Semantic search remain outside this plan. |
| Approved contract and fallback boundaries are respected | PASS | Uses only `POST /ai/search/lyrics`, the specified 503/timeout fallback, and the explicitly defined normalized-lyrics fallback ranking. |
| Existing architecture is reused | PASS | Extends the current `/search` page, shared result/player components, Express conventions, and existing search normalization baseline. |
| No unapproved AI algorithm/provider/schema | PASS | No model, embedding, vector database, response schema, or scoring formula is invented. |
| Constitution principles | NEEDS CLARIFICATION | Constitution is placeholder content and must be ratified at project level before formal compliance can be claimed. |

## Existing Baseline, Planned Work, and Open Decisions

| Area | Existing baseline | Planned for feature 032 | Needs confirmation |
|---|---|---|---|
| Route and search page | `/search` is registered in `src/frontend/src/routes/AppRouter.jsx`; `SearchPage.jsx` already reads `q`/`type`, renders a `lyrics` tab, searches demo lyrics, shows empty states, and plays tracks. | Make the Lyrics tab submit/consume the AI contract, render request lifecycle states, 20-item batches, Load More, fallback banner, validation, retry, and stale-response protection. | Exact approved response envelope and continuation indicator are not present in this repository. |
| Local lyric search | `src/frontend/src/utils/searchEngine.js` normalizes query text and searches `track.lyrics`; current `SearchPage` combines lyric matches with broader demo search behavior. | Keep the normalization behavior as a compatibility reference, but implement fallback against lyrics only with the required exact-phrase/query-word ordering. | Canonical server-side lyric index/content source is not documented. |
| AI service | `src/ai-service` has only `.gitkeep`; no provider, runtime, route, or client is implemented. | Integrate through the approved service boundary and keep provider choice behind that contract. | AI service ownership, runtime, provider, authentication, and response schema require confirmation. |
| Backend | `src/backend/server.js` mounts health and auth routes and provides CORS/JSON middleware. | Add the AI lyrics route/proxy/service integration only through approved implementation tasks; preserve auth behavior. | Whether `POST /ai/search/lyrics` is hosted by this Express app or a separate AI service is unresolved. |
| UI and playback | `SongRow`, `CoverArt`, `PlayerContext`, `AppStore`, and existing empty/banner primitives are available. | Reuse them for lyric result identity, matching lyric line, open/play action, loading/error/empty states, and responsive layout. | Final copy and exact response-to-view-model mapping must follow the approved contract/UI agreement. |

## Technical Approach

### 1. Query validation and request lifecycle

- Normalize leading/trailing/repeated whitespace for validation and request preparation.
- Reject locally when the fragment is empty, has fewer than 3 words, or exceeds 200 characters after trimming. Show inline feedback and do not send a request.
- Prevent duplicate submission of the same current search while it is in flight.
- On a new search, increment a request identity or use cancellation where supported; only the newest request may commit results, fallback state, or errors.
- Reset current results, pagination, banner state, and error state for a new submitted fragment so previous results cannot appear as the current result.

### 2. AI request and unavailable-service handling

- Call the approved `POST /ai/search/lyrics` contract through a frontend service adapter or the approved backend boundary. Do not add request fields beyond the contract.
- Treat HTTP 503 as unavailable and start fallback automatically without another user action.
- Treat lack of a completed response after 3 seconds as the same unavailable-service condition and start the same fallback. The specification's edge-case text mentions 5 seconds, but the later clarification and FR-008 explicitly establish 3 seconds; this plan follows the explicit FR/clarification value and records the inconsistency for review.
- Treat HTTP 429 separately: show a retryable rate-limit message and do not invoke fallback.
- Treat other failures as an error state governed by the approved contract; do not present unrelated or stale results as successful AI results.

### 3. Fallback keyword search

- Search normalized lyric text only. Title, artist, album, playlist, or other metadata matches are not valid fallback matches.
- Rank an exact normalized phrase match ahead of results containing more of the normalized query words. Keep the ranking deterministic and limited to the behavior stated in FR-017; do not introduce an unapproved relevance formula.
- Use the same 20-song batching and Load More behavior as the AI result display where the approved service contract permits it.
- On fallback results, render a dismissible inline banner above the results. It remains until dismissal or the next search and does not block result inspection.
- If fallback returns no results, render the explicit no-results state and clearly distinguish it from successful AI search.

### 4. Result rendering, pagination, and playback

- Map the approved AI/fallback response to a lyric result view model containing enough song identity and the matching lyric context required by FR-004 and the existing UI.
- Render no more than 20 songs in the current batch and provide Load More for the next 20 when additional results exist.
- Reuse `SongRow`, `CoverArt`, `EmptyState`, common alert/banner primitives, and `PlayerContext`/`AppStore` playback checks. Selecting a result must use the existing playback path rather than creating a second player implementation.
- Keep the AI Lyrics tab at `/search?type=lyrics` within the existing dedicated search-mode navigation. Do not implement Metadata feature behavior or Semantic feature behavior here.

### 5. Data flow

```text
User lyric fragment
        |
        v
trim + validate (3 words..200 chars) + deduplicate in-flight submit
        |
        v
POST /ai/search/lyrics  -- 3s timeout / HTTP 503 --> normalized-lyrics fallback
        |                                             |
        | AI result                                   | exact phrase > query-word matches
        v                                             v
typed 20-song batch + continuation               typed 20-song fallback batch + notice
        \                                             /
         v                                           v
request identity check -> Lyrics tab state -> result rows -> existing PlayerContext
                                      |
                                      +--> Load More (next 20)
                                      +--> empty / retryable error / dismissible fallback banner
```

## Components and Responsibilities

### Existing components/services to reuse

- `src/frontend/src/routes/AppRouter.jsx`: existing `/search` route.
- `src/frontend/src/pages/Search/SearchPage.jsx`: current search tabs, URL state, lyric result section, empty state, and direct playback integration point.
- `src/frontend/src/utils/searchEngine.js`: current normalized local lyric search baseline; reuse behavior selectively for the specified fallback only.
- `src/frontend/src/utils/aiMockData.js`: existing demo AI behavior reference only; it must not be treated as the production AI contract.
- `src/frontend/src/components/song/SongRow.jsx`, `src/frontend/src/components/playlist/CoverArt.jsx`, and common UI primitives: result and state rendering.
- `src/frontend/src/context/PlayerContext.jsx` and `src/frontend/src/context/AppStore.jsx`: playback, playable-track checks, and user feedback.
- `src/backend/server.js`: existing Express middleware and route mounting convention if this backend owns the contract boundary.

### Planned feature-owned implementation units

Exact file names should be finalized by `/speckit.tasks` from repository conventions, but tasks should cover:

- A frontend AI-lyrics API adapter with timeout, HTTP status classification, and contract-shaped error handling.
- A lyric-search controller/hook or equivalent for validation, request identity/cancellation, duplicate-submit prevention, AI-to-fallback transition, pagination, and retry.
- A normalized-lyrics fallback matcher/ranker that is independently testable and metadata-independent.
- A lyrics result/banner/pagination view integration in the existing Search page.
- Backend/AI-service route or proxy integration only after the approved service owner and contract boundary are confirmed.
- Focused unit, component, API-contract, timeout/503/429, stale-response, and end-to-end tests.

## Dependencies

- Feature 032 `spec.md`, its clarification decisions, UI references, and approved `POST /ai/search/lyrics` contract.
- A searchable lyric catalog with synchronized/usable lyric text and song identity/playback metadata.
- Existing frontend search route, result components, player context, demo data shape, and Express middleware conventions.
- AI service availability and a confirmed provider/runtime boundary; no provider is selected in this plan.
- Feature 031's shared `/search` navigation and pagination conventions, plus feature 033's tab ownership boundary, without implementing either feature here.
- Ratified project constitution and the canonical AI response schema before formal implementation gating.

## Testing Strategy

1. Unit: whitespace/word-count/character-limit validation; Unicode, diacritic, punctuation, and repeated-space normalization; exact-phrase versus query-word fallback ranking; lyrics-only filtering; 20-item pagination; and request-status classification.
2. Component: AI Lyrics tab selection, inline validation, submit/loading state, result identity and lyric context, Load More, empty state, dismissible fallback banner, retryable 429/other error states, duplicate-submit prevention, and stale-response suppression.
3. Contract/integration: valid `POST /ai/search/lyrics` request/response mapping, HTTP 503 fallback, 3-second timeout fallback, HTTP 429 non-fallback handling, pagination batches, and approved error information. Do not assert response fields not documented by the contract.
4. End-to-end acceptance: incomplete lyric fragment finds the expected track; ordinary spacing/case/punctuation differences still work; multiple matches are useful; no-results is explicit; 503 and timeout automatically show fallback results/banner; banner dismissal and reset work; 20-item Load More works; result playback works; newer searches supersede older ones.
5. Regression: existing `/search` route/navigation, Metadata and Semantic tabs, normal track playback, auth/health routes, and responsive layout continue to work without implementing or changing features 031/033.

## Risks and Technical Considerations

- **Timeout inconsistency in spec**: one edge-case bullet says 5 seconds while the later clarification and FR-008 say 3 seconds. Use 3 seconds for this plan and resolve/document the discrepancy before task acceptance.
- **Unknown AI contract envelope**: do not invent fields or continuation metadata. The adapter and tasks must use the approved contract as source of truth.
- **No AI service exists in the repository**: provider/runtime ownership and deployment are unresolved; implementation must not silently couple the frontend to an unapproved service.
- **Fallback ranking ambiguity**: exact phrase and query-word ordering is specified, but tie-breaking is not. Keep tie-breaking stable and document the chosen deterministic rule during task design without changing the required ranking.
- **Stale and duplicate requests**: AI timeout plus fallback can overlap with a newer search. Request identity/cancellation must guard every state commit, including fallback and Load More.
- **Rate limiting**: HTTP 429 is explicitly not a fallback trigger; the retry state must avoid accidental repeated submissions while preserving user control.
- **Lyric availability**: songs without synchronized/indexed lyrics cannot be treated as matches; the empty state should guide the user without implying a provider failure.
- **Cross-feature boundary**: shared `/search` tabs are integration points only; Metadata and Semantic algorithms remain outside feature 032.
- **Sensitive configuration**: existing uncommitted backend configuration is outside this task and must remain untouched; no credentials or provider configuration belongs in this Plan.

## Constitution Check (Post-Design)

The design remains limited to feature 032, reuses the existing React/Vite/Express/player architecture, follows the approved endpoint and fallback boundaries, and does not introduce an AI algorithm, provider, API schema, or database schema without evidence. Formal constitutional compliance remains unresolved because the repository constitution is placeholder content.

## Open Clarifications

- What is the exact approved request/response schema and pagination continuation field for `POST /ai/search/lyrics`?
- Which component/service owns the endpoint in deployment: the current Express backend, `src/ai-service`, or another approved service?
- Which AI provider/runtime and authentication mechanism are approved for the AI service?
- What deterministic tie-breaker should be used when fallback results have equal phrase/query-word rank?
- Should the contract expose an explicit fallback/search-mode field, or should the frontend infer mode from the request path/status transition?
- Confirm that the clarified 3-second timeout supersedes the 5-second edge-case wording in `spec.md`.

## Complexity Tracking

No constitution violation is introduced. No new database schema or cross-group feature is proposed. Complexity is limited to the AI request lifecycle, defined unavailable-service fallback, normalized lyric matching, 20-item pagination, and safe integration with the existing search/player UI.
