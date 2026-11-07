# Implementation Plan: Semantic Vector Music Search

**Branch**: `033-semantic-vector-search` | **Date**: 2026-11-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/030-search/033-semantic-vector-search/spec.md`

## Summary

Implement the Semantic Search mode of AuraTune's existing `/search` experience. A Listener can submit a natural-language mood, emotion, or context query; the system sanitizes it locally, sends only safe content to the approved semantic-search boundary, combines available metadata, lyric, and audio-characteristic similarities using the specified 30%/40%/30% weighted ensemble with availability re-normalization, removes duplicate songs, and returns ranked playable results. When semantic processing is unavailable, unsafe to process, invalid, or times out, the system falls back to keyword search and clearly identifies the fallback mode.

The repository already contains a `/search` route, a `SemanticSearch` top-navigation component, `SearchPage`, `searchEngine`, demo AI/mock data, shared result/player components, and local app state. The backend exposes Express health/auth infrastructure but no semantic-search route, while `src/ai-service` has no implementation. This plan treats the current AI behavior as a demo baseline and keeps provider/vector-database selection behind an approved service contract; it does not invent an AI algorithm beyond the weighted ensemble explicitly required by `spec.md`.

## Technical Context

**Language/Version**: JavaScript ES modules; React 18.3.1/Vite 5.4.11 frontend; Node.js/Express 4.21.2 backend. The AI/vector-search runtime and provider are not selected in the repository and remain **NEEDS CLARIFICATION**.

**Primary Dependencies**: React, React DOM, Vite, Tailwind CSS, lucide-react, existing Express/CORS middleware, the approved semantic-search service contract, and whichever embedding/vector components are approved later. No new SDK, model, embedding model, or vector database is selected by this plan.

**Storage**: Existing approved catalog metadata, lyrics, and audio-characteristic content. No new database schema is specified by this feature. The current frontend uses demo/mock catalog data and LocalStorage-backed app state.

**Testing**: Frontend unit/component tests, semantic contract integration tests, privacy/request-inspection tests, deterministic ranking tests, timeout/fallback tests, and responsive end-to-end usability/relevance evaluation. The repository currently provides Vite build scripts and a Node backend test file but no semantic-search-specific test runner convention.

**Target Platform**: AuraTune responsive web application plus the approved semantic-search/AI service boundary.

**Project Type**: Web application with React frontend, Express backend, separate AI-service boundary, and catalog/database integrations.

**Performance Goals**: Initial semantic results should be visible within 3 seconds for at least 95% of normal-condition searches (SC-003). SC-003a also requires fallback to begin when no usable semantic response exists by 1,500 ms; the conflict between this threshold and FR-016's 3,000 ms timeout is recorded as an open clarification.

**Constraints**: Query accepts at least one alphanumeric token and at most 150 characters; reject only empty/whitespace-only input or over-limit input. Preserve query meaning across supported language, punctuation, emojis, and common variations. Never send listener names or emails to third-party AI services, diagnostics, or AI error payloads. Fallback must be explicit and safe.

**Scale/Scope**: Natural-language semantic discovery for songs by mood/context/emotion, with playable ranked results, live suggestions, AI-understanding result presentation, fallback state, and privacy safeguards. Feature 033 only; lyric-fragment search and metadata search remain separate features.

## Constitution Check

*GATE: Must pass before implementation tasks are generated.*

`.specify/memory/constitution.md` is still the unratified Spec Kit placeholder template and contains no actual project principles or governance rules. No project-specific constitutional gate can be certified; this is recorded as a repository governance gap rather than filled with invented policy.

| Gate | Result | Evidence / action |
|---|---|---|
| Feature scope is limited to 033 | PASS | All planned behavior maps to `033-semantic-vector-search`; Metadata and AI Lyrics search remain outside this plan. |
| Explicit semantic algorithm is respected | PASS | Uses only the spec-defined metadata 30%, lyrics 40%, audio 30% weighted ensemble with availability re-normalization. |
| Privacy boundaries are respected | PASS | Local sanitization and safe fallback are required before any third-party AI request; names/emails are excluded from requests and diagnostics. |
| Existing architecture is reused | PASS | Extends the current search route, `SemanticSearch`, `SearchPage`, shared cards/player, and Express/service boundaries. |
| No unapproved provider/schema/database is introduced | PASS | Provider, vector database, response schema, and storage changes remain contract/architecture decisions. |
| Constitution principles | NEEDS CLARIFICATION | Constitution is placeholder content and must be ratified at project level before formal compliance can be claimed. |

## Existing Baseline, Planned Work, and Open Decisions

| Area | Existing baseline | Planned for feature 033 | Needs confirmation |
|---|---|---|---|
| Route/UI | `/search` is registered in `src/frontend/src/routes/AppRouter.jsx`; `SearchPage.jsx` supports search tabs and demo AI sections; `SemanticSearch.jsx` provides a top-navigation suggestion dropdown. | Connect the Semantic mode to the approved semantic service, live suggestions, result understanding state, ranked result rendering, fallback indicator, and playback. | Exact URL/query contract and response envelope for semantic search are not in the repository. |
| Search logic | `src/frontend/src/utils/searchEngine.js` normalizes local keyword search; `aiMockData.js` supplies demo recommendations; current semantic dropdown uses mock AI or a broad keyword fallback. | Replace production semantic behavior with a service adapter and keep local keyword logic only as the explicit fallback path. | Canonical catalog index and service-side ranking implementation are unresolved. |
| AI service | `src/ai-service` contains only `.gitkeep`; no provider, embedding, vector DB, or endpoint implementation exists. | Integrate through the approved service boundary and isolate provider/vector implementation behind it. | AI provider, embedding model, vector database, hosting, authentication, and response schema require confirmation. |
| Backend | `src/backend/server.js` contains health/auth routes, JSON/CORS middleware, and no semantic route. | Add only the approved semantic endpoint/proxy/service integration during implementation; preserve auth behavior. | Whether the current Express backend or `src/ai-service` owns the endpoint is unresolved. |
| Data/privacy | `AppStore` and demo catalog contain local user/session and content data; no third-party AI privacy filter exists. | Build a local sanitizer/redaction gate before AI calls; use profile matching, email detection, context-aware name detection, artist-name preservation, and safe fallback as specified. | Exact authenticated-profile source and locale-aware name detector policy need implementation confirmation. |
| Playback/results | `SongRow`, `CoverArt`, `PlaylistCard`, `PlayerContext`, and common UI primitives exist. | Reuse them for ranked songs, standard identity, understanding card, fallback notice, and playback. | Exact semantic response-to-view-model mapping follows the approved contract. |

## Technical Approach

### 1. Query lifecycle and privacy gate

- Trim and normalize only enough to validate and preserve meaning; support the specified language, punctuation, emojis, and common variations without replacing the user's intent with a new query.
- Reject empty/whitespace-only input and input over 150 characters with clear local validation. Accept at least one alphanumeric token.
- Run personal-data detection locally before any third-party AI request: compare against the authenticated profile, detect email addresses, and perform context-aware name detection. Preserve names recognized as catalog artists.
- If personal-data removal cannot be verified, do not send the query to third-party AI; use the safe keyword fallback instead.
- Ensure redacted/original personal data is excluded from AI requests, search diagnostics, logs, and AI-related error payloads.

### 2. Semantic service boundary and ranking

- Use the approved semantic-search contract through a service adapter; do not expose provider credentials or couple the browser directly to an unapproved third-party AI service.
- Represent the natural-language query and available song content in the comparable semantic form required by the approved service. The implementation must support metadata, lyrics, and audio-characteristic dimensions when available.
- Apply the explicit weighted ensemble: metadata similarity 30%, lyrics similarity 40%, audio-characteristics similarity 30%; re-normalize weights across dimensions available for both the query and song.
- Deduplicate songs before presentation and order descending by weighted semantic score, or by the approved keyword ranking when fallback is active.
- Keep the client view model limited to standard song identity, playable metadata, result relevance/context, and any approved explanation content; do not invent response fields.

### 3. Timeout, fallback, and failure states

- Start keyword fallback for an unavailable semantic operation, timeout, invalid response, or unsafe-to-process request, as required by FR-007.
- The spec contains two timing thresholds: FR-016 says stop waiting after 3,000 ms, while SC-003a says fallback begins at 1,500 ms without a usable response. Do not silently choose a new requirement; isolate the timeout policy behind configuration and resolve the conflict before implementation acceptance.
- Show a clear user-facing fallback indicator without credentials or sensitive diagnostics. Preserve a friendly no-results/unavailable-catalog state when neither path produces results.
- Protect every state commit with a request identity/cancellation mechanism so a previous semantic or fallback response cannot overwrite a newer search.

### 4. Search entry, suggestions, results, and playback

- Extend the existing `SemanticSearch` dropdown to use the semantic service only after the local privacy gate and validation. Live suggestions must not leak profile data or send unsafe content.
- Extend `SearchPage`'s dedicated Semantic mode to render the approved AI-understanding card, ranked song results, fallback state, loading, empty, and unavailable states.
- Reuse `SongRow`, `CoverArt`, common UI primitives, `AppStore`, and `PlayerContext` for consistent visual identity and existing playback flow.
- Keep Metadata (`031`) and AI Lyrics (`032`) behavior outside this plan; shared `/search` tab navigation is an integration boundary only.

### 5. Data flow

```text
Natural-language query
        |
        v
trim + validate + local privacy detection/redaction
        | unsafe/unverifiable ------------------------------+
        |                                                   |
        v                                                   v
approved semantic service                         keyword fallback
        | usable response / timeout / invalid / unavailable |
        +------------------------------+--------------------+
                                       v
                  deduplicate + rank (weighted ensemble or keyword rank)
                                       |
                                       v
          Semantic Search state -> result cards/understanding -> PlayerContext
                                       |
                                       +--> loading / fallback / empty / unavailable
```

No listener identity is included after the privacy gate. Diagnostics and errors carry only safe, contract-approved information.

## Components and Responsibilities

### Existing components/services to reuse

- `src/frontend/src/routes/AppRouter.jsx`: existing `/search` route.
- `src/frontend/src/pages/Search/SearchPage.jsx`: current search tabs, AI section, URL state, empty state, and playback integration point.
- `src/frontend/src/components/search/SemanticSearch.jsx`: current top-navigation input, dropdown, keyboard interaction, and navigation to full results.
- `src/frontend/src/utils/searchEngine.js`: local normalized keyword baseline for explicit fallback only.
- `src/frontend/src/utils/aiMockData.js`: demo AI behavior reference; not a production semantic contract.
- `src/frontend/src/components/song/SongRow.jsx`, `src/frontend/src/components/playlist/CoverArt.jsx`, `PlaylistCard.jsx`, and common UI primitives: result rendering and state presentation.
- `src/frontend/src/context/AppStore.jsx` and `src/frontend/src/context/PlayerContext.jsx`: catalog/playability, feedback, and existing playback flow.
- `src/backend/server.js`: Express middleware and route conventions if the approved backend owns the service boundary.

### Planned feature-owned implementation units

Exact file names should be finalized by `/speckit.tasks` from repository conventions, but tasks should cover:

- Local privacy/sanitization utility with profile, email, and context-aware name detection and safe fallback decision.
- Semantic-search API adapter with contract mapping, timeout policy, invalid-response handling, and safe errors.
- Semantic result/ranking adapter implementing the explicitly specified weighted ensemble and availability re-normalization without introducing another formula.
- Search controller/hook for request identity, loading/fallback/error states, duplicate/stale response protection, and mode state.
- Semantic dropdown/page integration, AI-understanding card, fallback indicator, result rendering, and playback wiring.
- Tests covering privacy leakage, ranking, fallback, timing policy, deduplication, and responsive user flows.

## Dependencies

- Feature 033 `spec.md`, clarification decisions, UI references, and project-approved semantic-search contract.
- Searchable catalog content with song metadata, lyrics, and available audio characteristics.
- Existing frontend route, search components, player context, and Express middleware.
- Approved AI provider/embedding/vector-search architecture and service deployment boundary.
- Profile/session data source for local privacy detection; catalog artist data for artist-name preservation.
- Integration boundary with features 031 and 032, without implementing those features here.
- Ratified project constitution and canonical semantic response schema before formal implementation gating.

## Testing Strategy

1. Unit: query validation/normalization, Unicode/punctuation/emoji handling, 150-character limit, email/name/profile detection, artist-name preservation, redaction decisions, weighted ensemble/re-normalization, duplicate removal, and keyword fallback ranking.
2. Contract/integration: safe semantic request formation, response validation, metadata/lyrics/audio dimension handling, provider error mapping, invalid response fallback, timeout policy, and safe diagnostics. Inspect serialized requests to verify no listener names/emails are transmitted.
3. Component: semantic search entry, live suggestions, validation, loading, AI-understanding card, ranked results, fallback indicator, no-results/unavailable state, stale-response suppression, and playback integration.
4. End-to-end: representative mood/context queries, incomplete content dimensions, multiple reasonable genre/style interpretations, service unavailability, unsafe personal-data query, timeout/fallback, duplicate results, responsive layout, and first-attempt usability.
5. Evaluation: at least 100 representative mood/context queries using the specified 1–5 human relevance scale, with 4/5 counted as relevant; measure SC-001 through SC-007 including privacy request inspection and duplicate-result rate.
6. Regression: existing `/search` navigation, Metadata and AI Lyrics tabs, normal keyword search, playback, auth/health routes, and responsive shell remain unaffected.

## Risks and Technical Considerations

- **Timeout conflict**: FR-016 specifies 3 seconds while SC-003a specifies 1,500 ms. Make the policy configurable and obtain a product/architecture decision before final tasks; do not silently reinterpret the spec.
- **Provider/vector architecture is absent**: no AI implementation exists under `src/ai-service`; provider, embedding model, vector database, hosting, and API ownership must be confirmed before implementation.
- **Privacy false positives/negatives**: name detection is context-sensitive and must preserve catalog artist searches while safely falling back when uncertain. Privacy tests must inspect actual serialized requests and diagnostics.
- **Missing content dimensions**: songs may lack lyrics/audio characteristics. Re-normalize only across dimensions available for both query and song as required; do not penalize or fabricate absent values.
- **Ranking reproducibility**: semantic scores may vary by provider. Preserve the specified weighted ensemble and test deterministic post-processing (availability normalization, deduplication, ordering) around the provider response.
- **Stale requests and fallback races**: semantic timeout, keyword fallback, live suggestions, and a newer query may overlap. Every async path needs request identity/cancellation protection.
- **Sensitive configuration**: existing uncommitted backend configuration is outside this task; no credentials or provider secrets belong in this Plan or frontend code.
- **Cross-feature boundary**: only Semantic mode is planned; Metadata and AI Lyrics algorithms and contracts remain owned by features 031 and 032.

## Constitution Check (Post-Design)

The design remains limited to feature 033, uses the existing React/Vite/Express/player architecture, follows the spec-defined weighted ensemble and privacy boundary, and avoids an unapproved provider, API schema, or database schema. Formal constitutional compliance remains unresolved because `.specify/memory/constitution.md` is placeholder content.

## Open Clarifications

- Which AI provider, embedding model, vector database, runtime, and hosting boundary are approved?
- What exact request/response schema and endpoint ownership define the semantic-search contract?
- Does the approved contract return per-dimension scores/content availability, or must the service perform the weighted ensemble internally?
- Should fallback begin at 1,500 ms per SC-003a or at 3,000 ms per FR-016?
- What is the approved authenticated-profile source and locale/context policy for personal-name detection?
- What stable tie-breaker should be used after equal semantic scores and duplicate removal?
- What exact user-facing fields are permitted in the AI-understanding card?

## Complexity Tracking

No constitution violation is introduced. No new database schema or cross-group feature is proposed. Complexity is limited to the privacy gate, semantic service boundary, explicit weighted ranking, fallback policy, async state protection, and integration with the existing search/player UI.
