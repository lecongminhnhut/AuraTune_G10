# Implementation Plan: Semantic Vector Music Search

**Branch**: `033-semantic-vector-search` | **Date**: 2026-11-08 | **Spec**: [spec.md](./spec.md)

**Status**: Draft pending approval of the semantic API, AI/vector technology, catalog/index, privacy-detection, and response-field decisions listed below.

**Input**: Feature specification from `specs/030-search/033-semantic-vector-search/spec.md`

## Summary

Implement the Semantic Search mode in AuraTune's existing search experience. A Listener can enter a natural-language mood, emotion, or context query. The system validates and sanitizes the query locally before any third-party processing, searches available song metadata, lyrics, and audio characteristics, deduplicates results, and ranks them using the spec-defined weighted ensemble: metadata 30%, lyrics 40%, and audio characteristics 30%, re-normalized over dimensions available for both the query and song. When processing is unavailable, invalid, times out, or cannot safely proceed, keyword fallback returns usable results or a clear no-results/unavailable state and identifies the fallback mode.

The existing `/search` page and top-navigation semantic dropdown provide demo UI and mock behavior. Express currently exposes auth/health endpoints only, `src/ai-service` is a placeholder, and mock/localStorage data does not establish a production semantic index. The project API contract describes a public API layer with internal Backend-to-Python AI calls; applying that boundary to this feature is the planning direction, while the semantic route, payload, provider, and production data/index remain unapproved. This plan reuses existing UI and playback integration and marks those open decisions explicitly.

## Technical Context

**Language/Version**: Frontend JavaScript ES modules with React 18.3.1 and Vite 5.4.11; backend JavaScript ES modules with Node.js and Express 4.21.2. The shared API design describes an internal Backend-to-Python AI Service boundary, but no implementation exists in `src/ai-service`.

**Primary Dependencies**: Existing React, Vite, Tailwind, Express, current search/player components, and the shared API envelope. No new AI provider, embedding model, vector database, or SDK is approved; select none until the planned comparison and team decision recorded in project-plan dependency ED-08.

**Storage**: Existing catalog metadata, lyrics, and audio characteristics are the intended search dimensions. No production semantic index or feature-specific database schema is established by this repository; no schema change is proposed.

**Testing**: Focused unit, component, privacy/request-inspection, contract/integration, timeout/fallback, responsive acceptance, and human relevance-evaluation tests. Existing frontend scripts are `dev`, `build`, and `preview`; backend scripts are `start` and `dev`; root `test:backend` covers auth, and no semantic-specific test runner convention exists.

**Target Platform**: AuraTune responsive web application with semantic processing behind an approved backend/service boundary.

**Project Type**: React web frontend, Express backend, and a documented but currently unimplemented internal AI-service boundary.

**Performance Goals**: Start keyword fallback when semantic processing has not produced a usable result within 1,500 ms (FR-016 and SC-003a). SC-003 separately calls for visible initial results within 3 seconds for at least 95% of normal-condition searches.

**Constraints**: Accept one meaningful alphanumeric token up to 150 characters; reject empty/whitespace-only and over-limit input. Never send listener names/emails to third-party AI, diagnostics, or AI-related error payloads. Locally match profile identity, detect email and context-aware names, preserve recognized catalog artist names, and use keyword fallback when safe distinction/removal is uncertain. Use the specified 30/40/30 ensemble with availability re-normalization; do not substitute a scoring formula.

**Scale/Scope**: Natural-language song discovery by mood, emotion, or context, including live suggestions, ranked playable results, privacy gate, and keyword fallback. Feature 033 only; Metadata and AI Lyrics behavior are outside scope.

## Constitution Check

`.specify/memory/constitution.md` remains the unratified Spec Kit placeholder and contains no project-specific principles or governance rules. Formal constitutional compliance cannot be certified until that document is ratified.

| Gate | Result | Evidence / action |
|---|---|---|
| Scope limited to feature 033 | PASS | Plan covers semantic music search only; Metadata and AI Lyrics remain separate. |
| Ranking follows the approved feature requirements | PASS | Uses only the 30% metadata, 40% lyrics, 30% audio-characteristic ensemble and availability re-normalization stated in the spec. |
| Personal data protection | PASS WITH OPEN IMPLEMENTATION POLICY | Local detection/redaction and safe fallback are specified; profile source and locale/name detection policy need confirmation. |
| Existing technology retained | PASS | Reuses React/Vite, Express conventions, shared UI/player, and documented Backend-to-Python boundary; selects no provider/vector technology. |
| No unapproved API or persistence schema | PASS | Semantic route, payload, index shape, and schema remain unselected. |
| Constitution principles | NEEDS CLARIFICATION | Constitution file is still a placeholder. |

- **Governance & Scope Gate (T009):** `.specify/memory/constitution.md` remains an unratified template placeholder; formal compliance is not claimed. Screenshot-only playlist suggestions are confirmed as visual references only and remain out of scope for Feature 033 (`GET /api/v1/search?mode=semantic` returns ranked `track` items only; playlist generation is owned by `POST /playlists/ai-generate`).

## Existing Baseline, Planned Work, and Open Decisions

| Area | Existing baseline | Planned for feature 033 | Needs confirmation |
|---|---|---|---|
| Search UI | `/search`, `SearchPage`, and `SemanticSearch` exist; their AI results use demo/mock data. Existing result and player components are reusable. | Connect semantic input, suggestions, results, fallback states, and playback to an approved service boundary. | Final route/query and response mapping. |
| API boundary | The frontend API client calls Express at `/api/v1`; `src/backend/server.js` currently mounts auth and health routes only. The shared API contract defines `{success,message,data,error}`, 503 `AI_SERVICE_UNAVAILABLE`, 429 `RATE_LIMITED`, and internal Backend-to-Python AI calls. | Use Express as the public API façade and preserve the documented internal AI boundary as the planning direction; add only a reviewed semantic contract. | Semantic route, request/response fields, Python service endpoint/authentication, score/explanation mapping, and timeout propagation. |
| AI/vector service | `src/ai-service` contains only `.gitkeep`; no provider/model/indexing code exists. Proposal mentions ChromaDB/Pinecone as candidates, not a selected technology. | Implement against the approved service architecture after design approval. | Provider, embedding model, vector database, runtime/deployment, authentication, and where scoring runs. |
| Searchable data | Frontend fixtures provide mock songs/lyrics; current code does not establish a production searchable corpus or semantic index. | Search available metadata, lyrics, and audio dimensions, tolerating missing dimensions. | Canonical catalog source, field availability/population, index build/update ownership, and whether audio characteristics are already sourced. |
| Privacy | Existing mock search has no third-party privacy gate. AppStore provides local app/session state but its profile data source and canonical artist matching policy are not a feature contract. | Match profile details, detect emails and context-aware names locally, preserve catalog artist names, and route ambiguous/unsafe queries to keyword fallback. | Profile data source and locale/context detection policy. |
| Timing, ranking, and rate limits | Spec fixes fallback at 1,500 ms and the weighted component weights. Its edge case treats an AI rate-limit response as unavailability and calls for keyword fallback where possible. | Start fallback at 1,500 ms; map an AI-service 429 to the fallback path; implement the exact ensemble, deduplicate, and order results. | Confirm per-dimension score ownership and equal-score tie-breaker. Do not add a retry policy without approval. |

## Technical Approach

### 1. Query validation and local privacy gate

- Trim and normalize whitespace for validation while preserving the query meaning, supported language, punctuation, emojis, and common variations.
- Accept a query with at least one meaningful alphanumeric token up to 150 characters. Reject only empty/whitespace-only input and over-limit input with clear local feedback.
- Before any third-party AI request, locally compare against the authenticated profile, detect email addresses, and perform context-aware name detection. Preserve names recognized as catalog artists.
- Remove or mask personal information before external processing. If the system cannot verify safe sanitization, do not send to third-party AI; use the keyword fallback.
- Exclude listener names/emails and original/redacted PII from AI requests, searchable payloads, diagnostics, logs, and AI-related error payloads.
- Do not add search-history behavior in this feature; if any query history or result labels are surfaced by the existing application, verify they do not expose listener names or email addresses.

### 2. Semantic processing and ranking

- Route semantic work through the Express public API façade and the documented internal Backend-to-Python AI boundary. The exact semantic endpoints and payloads still require approval; the frontend must not call the internal AI service or a third-party provider directly.
- Represent available metadata, lyrics, and listed audio characteristics in the approved service's comparable semantic representation. Do not choose an embedding/model/vector technology until approved.
- Apply metadata similarity at 30%, lyric similarity at 40%, and audio-characteristic similarity at 30%. Re-normalize weights over dimensions available for both the query and song, as specified.
- The listed audio dimension set is BPM/tempo, key, mode, energy, valence, danceability, acousticness, instrumentalness, speechiness, loudness, liveness, time signature, and duration.
- Deduplicate songs and sort by descending semantic score, or by the approved keyword rank in fallback mode. Equal-score tie-breaking is not specified and remains open.
- Validate semantic responses against the approved contract. Invalid or unsafe responses must use keyword fallback; the unsafe-response policy needs definition in that contract before implementation.
- Map only approved contract fields into song identity/playback state and any approved AI-understanding content. Do not infer/expose undocumented explanation or score fields.

### 3. Timeout, failure, and fallback behavior

- Start keyword fallback when semantic processing is unavailable, times out, produces an invalid or unsafe response, or cannot safely process the query, as required by FR-007 and the feature edge cases.
- Start keyword fallback when semantic processing has not produced a usable result within 1,500 ms, as now specified by FR-016 and SC-003a. SC-003 remains a separate goal for the initial visible result within 3 seconds in at least 95% of normal-condition searches.
- Treat an AI-service rate-limit response (HTTP 429) as unavailability and use keyword fallback where possible, as specified by the feature edge case. Do not infer retries, retry intervals, or a new public error response.
- Use the existing keyword search path only as a fallback baseline after confirming it covers the required catalog access; expose that fallback was used without credentials or sensitive diagnostics.
- Show user-friendly no-results or catalog-unavailable feedback if neither semantic search nor fallback can produce results. Guard all async state updates so stale semantic/fallback responses cannot overwrite a newer query.
- A later search may resume semantic processing automatically after service recovery, without a user configuration change.

### 4. Entry, suggestions, results, and playback

- Integrate the top navigation `SemanticSearch` dropdown and the dedicated Semantic mode in `SearchPage`; retain the documented keyboard/search navigation behavior.
- Render ranked song results with standard identifying information and existing playback actions. Render an AI-understanding card only with approved, privacy-safe explanation data.
- Display a clear fallback mode indicator and clear empty/unavailable state; avoid adding playlists or recommendation behavior beyond what the feature spec authorizes.
- Reuse `SongRow`, cover/result components, common UI primitives, `AppStore`, and `PlayerContext`.
- Keep feature 031 metadata behavior and feature 032 lyrics-fragment behavior outside this plan.

### Screenshot scope boundary

- The current UI screenshots include playlist suggestions and mock AI explanations. The functional requirements define semantic ranked song results and playback; they do not define semantic playlist generation or a response field for explanations. Treat screenshot-only playlist/AI-card details as visual references, and render only fields and result types explicitly approved in the feature contract. Do not add playlist generation or infer an explanation schema.

### 5. Data flow

```text
Natural-language query
       -> local validation and profile/email/name privacy gate
       -> safe query to approved backend boundary
       -> AI semantic search over available metadata/lyrics/audio dimensions
       -> weighted ensemble (30/40/30, available-dimension re-normalization)
       -> deduplicate and order -> current Semantic Search results -> existing player

Unsafe/ambiguous query, unavailable/invalid service, or approved timeout
       -> keyword fallback -> explicit fallback state or no-results/unavailable state
```

No listener identity is sent to a third-party AI service or included in diagnostics/errors.

## Components and Responsibilities

### Existing components and services to reuse

- `src/frontend/src/routes/AppRouter.jsx`: current `/search` route.
- `src/frontend/src/components/search/SemanticSearch.jsx`: top-navigation search input, dropdown, keyboard handling, and result selection.
- `src/frontend/src/pages/Search/SearchPage.jsx`: search query state, semantic/AI demo presentation, empty state, and playback entry points.
- `src/frontend/src/utils/searchEngine.js`: local keyword search for the explicit fallback path only.
- `src/frontend/src/utils/aiMockData.js`: demo behavior reference only; not a semantic API contract.
- `src/frontend/src/context/AppStore.jsx` and `src/frontend/src/context/PlayerContext.jsx`: catalog/playability and existing playback flow.
- `src/frontend/src/components/song/SongRow.jsx`, playlist/media cards, and common UI primitives: result and status presentation.
- `src/backend/server.js`: existing Express middleware and route-mount convention if selected as the public backend boundary.
- `src/ai-service/`: currently placeholder only; intended internal service implementation is not yet present.

### Planned implementation units

- Local query validation/privacy utility and safe-to-process/fallback decision.
- Approved semantic API adapter and contract validation, including safe error/diagnostic handling.
- Semantic ranking adapter implementing only the required weighted ensemble/re-normalization and deduplication.
- Query controller/hook for loading, timing policy, current-request identity, fallback, errors, and result mode.
- `SemanticSearch` dropdown and `SearchPage` semantic result integration using approved response fields.
- Unit, privacy leakage, ranking, contract, timeout/fallback, component, and acceptance tests.
- Index/data ingestion work only after the approved source, ownership, and vector architecture are established; no schema is specified in this plan.

## Project Structure

Feature work is expected to integrate with the existing `src/frontend/` and `src/backend/` applications. The current integration points are `src/frontend/src/components/search/SemanticSearch.jsx`, `src/frontend/src/pages/Search/SearchPage.jsx`, `src/frontend/src/utils/searchEngine.js`, `src/frontend/src/context/AppStore.jsx`, `src/frontend/src/context/PlayerContext.jsx`, and `src/backend/server.js`. `src/ai-service/` currently contains only `.gitkeep`; the internal AI implementation location/runtime must be confirmed before implementation. No source files, endpoints, migrations, or provider-specific structure are created by this planning document.

## Dependencies

- Feature 033 specification, clarification decisions, and UI references in this directory.
- Searchable catalog content for metadata, lyrics, and the specified audio-characteristic fields.
- Approved public semantic route, internal Backend-to-Python service contract, response schema, and service owner.
- Approved provider, embedding/model, vector database, hosting, and authentication arrangement.
- Authenticated profile source for local PII detection and catalog artist data for artist-name preservation.
- Existing search UI, keyword fallback, shared result components, and player context.
- Project constitution ratification before claiming formal governance compliance.

## Testing Strategy

1. **Unit**: input validation/normalization; email/profile/contextual-name detection; catalog artist preservation; redaction and unsafe fallback; weighted ensemble and missing-dimension re-normalization; duplicate removal; deterministic post-processing; and keyword fallback status behavior.
2. **Privacy/contract integration**: inspect serialized requests, searchable content, diagnostics, and AI error payloads to prove no listener name/email is transmitted; validate only the approved schema; test safe handling of invalid/unavailable responses and HTTP 429 fallback.
3. **Timing/fallback integration**: exercise the 1,500 ms threshold, unavailable service, invalid response, unsafe query, HTTP 429, fallback results, no-results, and recovered-service subsequent search. Measure SC-003's 3-second initial-result goal separately.
4. **Component**: entry/dropdown keyboard behavior, local validation, loading, semantic understanding card, ranked results, explicit fallback indication, empty/unavailable states, stale request handling, and playback integration.
5. **Acceptance and relevance evaluation**: at least 100 representative mood/context queries using the spec's 1–5 scale; ratings 4–5 count as relevant; allow multiple reasonable interpretations satisfying the stated intent; measure SC-001 through SC-007 including privacy and duplicate checks.
6. **Regression**: `/search` navigation, metadata and lyrics tabs, keyword search, playback, auth/health routes, and responsive application shell.

## Risks and Technical Considerations

- **Timeout and latency goals**: fallback starts at 1,500 ms; SC-003 measures visible initial results within 3 seconds in normal conditions. Validate that fallback and its keyword results can satisfy the intended experience.
- **Provider/vector architecture absent**: proposal mentions ChromaDB/Pinecone as alternatives but selects neither; `src/ai-service` is empty. Do not add an SDK, provider, embedding model, or database before approval.
- **Unspecified semantic contract**: API docs define shared envelope/error codes but no semantic endpoint or payload. A request/response contract is an implementation gate.
- **Rate limiting**: the feature edge case includes rate limits in AI unavailability, while FR-007 lists other failure causes. Follow the more specific edge-case behavior and fall back on AI-service 429; retry behavior is unspecified and must not be invented.
- **Privacy detector errors**: false negatives can disclose PII; false positives can block legitimate catalog-artist searches. Test profile matching, email detection, contextual names, and preservation of catalog artists.
- **Data completeness**: missing lyrics/audio dimensions must not fail search; weights are re-normalized only across dimensions available for both query and song. Production field source and index lifecycle are unknown.
- **Score reproducibility**: provider similarity scores may vary. Keep the required weighting and deterministic post-processing separate from the provider; equal-score tie-breaker remains open.
- **Async races**: live dropdown, full search, timeout, fallback, and newer queries can overlap. Associate each response and state update with its active query.
- **No semantic test runner**: choose feature-focused tooling consistent with the project during implementation; existing backend smoke test is auth-only.
- **Constitution placeholder**: formal compliance remains unverified until project principles are ratified.

## Open Clarifications (All Resolved in Phase 1)

1. ~~Which public semantic route and request/response fields should be approved?~~ *(Resolved in T001 & T003: Extends `GET /api/v1/search?mode=semantic` on Express proxying to internal `POST /ai/recommend` with `purpose: "semantic_search"` and a 1,500 ms deadline, keeping `api-contract.md` unchanged.)*
2. ~~Which provider, embedding/model, vector database, runtime/deployment, and service authentication should be selected?~~ *(Resolved in T002: Python FastAPI in `src/ai-service` using `paraphrase-multilingual-MiniLM-L12-v2` and local ChromaDB/in-memory vector store, authenticated via `X-Internal-Api-Key`.)*
3. ~~Does the AI service return metadata/lyrics/audio similarity values separately, or return a combined score?~~ *(Resolved in T004: Python AI service computes the 30/40/30 ensemble with availability re-normalization and returns the combined normalized score.)*
4. ~~What is the canonical catalog source and index update lifecycle?~~ *(Resolved in T005: Supabase `songs`/`albums`/`artists` + cached Cloudinary `songs.lyrics_url`; unpopulated audio fields trigger weight re-normalization.)*
5. ~~What profile source and policy should local personal-name detection use?~~ *(Resolved in T006: Authenticated `users` session profile + regex email + contextual name patterns, preserving cached `public.artists.name`.)*
6. ~~What stable tie-breaker applies to equal semantic or keyword ranks, and which explanation fields may appear?~~ *(Resolved in T007: Tie-breaker `songs.total_plays DESC, songs.song_id ASC`; optional privacy-safe `ai_reason` field documented in `contracts/semantic-search.md`.)*
7. ~~Do screenshot-only playlist suggestions indicate an in-scope semantic result type?~~ *(Resolved in T009: Out of scope; visual reference only.)*

## Complexity Tracking

No additional project or database schema is proposed without approval. The feature's implementation complexity comes from the privacy gate, semantic-service boundary, explicitly weighted ranking, timeout/fallback handling, and async search UX. Unresolved decisions are recorded as approval gates rather than silently encoded as architecture.
