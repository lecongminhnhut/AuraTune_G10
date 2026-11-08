# Research: Semantic Vector Music Search

**Feature**: [033 Semantic Vector Music Search](./spec.md)
**Date**: 2026-11-08

## Findings and Planning Decisions

### Product scope and scoring

- **Finding**: The feature spec fixes semantic content dimensions as metadata, lyrics, and audio characteristics; specifies weights of 30%, 40%, and 30%; and requires re-normalization across dimensions available for both the query and song. It also enumerates the audio fields and sets a 1–5 human relevance scale where 4–5 count as relevant.
- **Decision**: Carry those requirements into the plan verbatim. Do not substitute another score formula or narrow the listed audio dimension set.
- **Rationale**: The requirements are explicit and take precedence over high-level proposal alternatives.
- **Alternatives considered**: Equal weighting, an unweighted vector score, or treating absent dimensions as zero were rejected because they contradict the feature specification.

### Frontend and backend baseline

- **Finding**: React/Vite `SemanticSearch` and `SearchPage` render demo behavior using `getMockSearchResults`, local `searchCatalog`, and `AppStore.aiAvailable`. `AppStore` contains demo/localStorage state and restores a backend session, but the mock catalog does not establish production search data. Express mounts auth and health routes only; there is no semantic-search route. `src/ai-service` contains only `.gitkeep`.
- **Decision**: Reuse the existing UI and `PlayerContext` integration, but treat mock behavior as demo-only. The shared API contract supports an Express public API façade with an internal Backend-to-Python AI boundary; apply that as the planning direction while leaving the feature endpoint and payload unselected.
- **Rationale**: This follows the current API architecture and avoids browser-to-provider calls, while acknowledging that the semantic service is not implemented and no feature-specific contract exists.
- **Alternatives considered**: Treating mock responses or local availability state as production AI behavior was rejected.

### API and AI-service boundary

- **Finding**: The shared API contract defines the common `{success,message,data,error}` envelope, public `GET /search` and `GET /search/lyrics` routes, and internal Backend-to-Python AI endpoints. It defines no semantic-vector route or semantic request/response schema and says the frontend does not call the internal AI service directly.
- **Decision**: Preserve the shared envelope/status conventions and require an approved public-to-internal semantic contract before implementation. Do not infer that the existing metadata or lyrics route is the semantic endpoint, or invent payload fields, score/explanation fields, or service authentication.
- **Rationale**: A semantic API schema cannot be inferred from the lyrics search endpoint or the mock implementation.
- **Alternatives considered**: Reusing `POST /ai/search/lyrics`, exposing an undocumented route, or directly calling a third-party AI service from the browser was rejected as unsupported/out of scope.

### Provider, embedding, and vector storage

- **Finding**: The proposal describes LLM/vector-based semantic search and names ChromaDB/Pinecone as candidates. Project-plan ED-07 records external LLM, embedding, and vector infrastructure as a capability dependency; ED-08 calls for a time-boxed comparison and recorded selection, and states that no provider is selected. No AI/vector package, model, index, or implementation exists in the repository.
- **Decision**: Select no provider, embedding model, vector database, SDK, or hosting arrangement in this plan. Keep these items pending approval.
- **Rationale**: The proposal presents options, not a recorded architecture decision; the feature spec also leaves technologies to architecture/planning.
- **Alternatives considered**: Selecting either named vector database or inferring a Python provider from the shared internal boundary was rejected because neither establishes a chosen implementation.

### Public and internal service ownership

- **Finding**: The only implemented API server is Express at `src/backend/server.js`; it mounts auth and health routes. The shared API contract describes AI service calls as internal Backend-to-Python. The project plan lists Python/FastAPI as an AI-service option, not a completed service implementation.
- **Decision**: Plan for the existing Express backend to own any approved public semantic-search API and to call an internal AI service through the documented backend boundary. Keep the concrete internal endpoint, runtime, authentication, and provider-specific integration behind approval gates.
- **Rationale**: This is supported by the repository's current API architecture and avoids exposing internal AI or third-party calls to the browser; it does not assert that the AI service already exists.
- **Alternatives considered**: A frontend-to-provider request or treating the current `/search` and `/search/lyrics` routes as a semantic endpoint was rejected because neither is supported by the shared contract.

### Searchable data and persistence

- **Finding**: Current frontend mock tracks demonstrate song metadata and some lyrics, but do not establish a production catalog, complete audio characteristics, persistence schema, or index update process. Project-plan ED-06 records catalog coverage/licensing as a dependency; the repository does not define an approved semantic vector schema for this feature.
- **Decision**: Propose no database migration or embedding/index schema. Confirm catalog source, available fields, ownership, and index lifecycle before implementation.
- **Rationale**: The spec requires searching available dimensions but does not authorize new persistence structures or how absent audio data is produced.
- **Alternatives considered**: Adding vector columns/tables, Supabase schema, or a new content pipeline was rejected without an approved data design.

### Privacy boundary

- **Finding**: The feature spec explicitly requires local profile matching, email detection, context-aware name detection, preservation of recognized catalog artist names, and keyword fallback when personal-data ambiguity cannot be resolved safely. `AppStore` exposes the current session user's display name and email but also uses demo/localStorage state; the repository does not establish an approved production profile source or catalog-artist matcher. Project planning also calls out data-use terms for external AI services.
- **Decision**: Place query sanitization and the safe-to-send decision before the AI boundary. Ensure names/emails are absent from requests, searchable content sent externally, diagnostics, logs, and AI error payloads. Profile source, exact locale/context policy, and artist-name recognition source remain open implementation decisions.
- **Rationale**: Privacy behavior is explicit; the repo does not define the profile/detector implementation contract for this feature.
- **Alternatives considered**: Sending raw input and relying on a provider's privacy controls was rejected because the spec prohibits disclosure to third-party services.

### Timeout and fallback

- **Finding**: The latest clarification and FR-016 set fallback at 1,500 ms, matching SC-003a. SC-003 separately requires visible initial results within 3 seconds for 95% of normal searches.
- **Decision**: Start keyword fallback after 1,500 ms without a usable semantic result. Treat SC-003's 3-second target as a separate end-user result-state goal, not a competing fallback threshold.
- **Rationale**: The feature owner explicitly selected 1,500 ms, and the spec now uses that value consistently for fallback.
- **Alternatives considered**: A 3,000 ms fallback was superseded by the 1,500 ms clarification. The separate 3-second initial-results goal remains unchanged.

### AI-service rate limiting

- **Finding**: The feature edge case explicitly groups an AI-service rate-limit response with invalid, unsafe, unavailable, and timed-out operations, and says to use keyword fallback where possible. The shared API separately defines HTTP 429 `RATE_LIMITED` as a general API error.
- **Decision**: Treat HTTP 429 returned by the internal AI dependency as AI unavailability and enter the same keyword-fallback path. Do not add retries, retry delays, or a new user-facing status. A public API rate limit remains governed by the shared API contract and is not redefined by this feature.
- **Rationale**: This follows the feature's explicit edge-case behavior without expanding the public API contract.
- **Alternatives considered**: Retrying the internal call or surfacing the internal 429 directly was not selected because the feature specification requires fallback and defines no retry policy.

### UI references and result scope

- **Finding**: The UI screenshots include mock playlist suggestions and an AI-understanding card, while the functional requirements define ranked song results and playback but do not specify playlist generation or explanation fields.
- **Decision**: Reuse the visual patterns only where they can be populated with approved contract data. Do not add playlist generation or infer a response schema for the explanation card.
- **Rationale**: This preserves the functional scope and avoids turning demo-only mock content into new requirements.

### Testing constraints

- **Finding**: Frontend package scripts include `dev`, `build`, and `preview`; backend scripts include `start`/`dev`; root `test:backend` runs an auth-oriented smoke test. No semantic-specific test runner convention was found.
- **Decision**: Specify test scenarios and evidence now; choose or approve feature test tooling during implementation without treating the auth smoke script as semantic coverage.
- **Rationale**: Existing scripts do not cover semantic search, privacy, ranking, or fallback behavior.

## Remaining Approval Gates

These items remain explicit gates because the repository and approved feature requirements do not select an implementation. They must be decided by the feature owner/team before dependent implementation begins:

- Approve the public semantic route and payload, internal Python service endpoint/authentication, and timeout propagation.
- Complete the ED-08 comparison and select the LLM/provider, embedding model, vector database, and runtime using quality, latency, quotas/cost, and data-use terms; no specific option is selected here.
- Confirm whether per-dimension scores are returned to Express or the AI service returns the combined score.
- Confirm the canonical catalog, listed audio-field availability, and any approved index generation/update lifecycle; no persistence schema is proposed.
- Approve profile identity source, locale/context name-detection policy, and catalog-artist recognition source for the privacy gate.
- Approve stable tie-breakers and the exact AI-understanding fields, if any. Confirm whether screenshot playlist suggestions represent an in-scope result type; the functional requirements do not authorize playlist generation.
- Define the response-validation policy for what counts as an unsafe AI response; the spec requires fallback but does not define a content-safety taxonomy.
- Ratify the project constitution before claiming formal constitutional compliance.

The feature's HTTP 429 behavior is not an open gate: the spec edge case says an AI-service rate-limit response is handled as AI unavailability and uses keyword fallback where possible. No retry policy is inferred.

## Alternatives Summary

| Area | Planning position | Reason |
|---|---|---|
| Weighted ranking | Use the spec-defined 30/40/30 weighted ensemble and available-dimension re-normalization. | Explicit feature requirement. |
| AI/vector technology | No technology selected. | ChromaDB/Pinecone are proposal candidates only; no implementation or approval. |
| Service access | Approved backend-to-AI boundary required; route/schema unresolved. | Shared API says internal AI service is not called by frontend, but defines no semantic contract. |
| Service ownership | Express public façade to internal AI service is the planning direction; the service implementation/runtime remains unapproved. | Existing Express server and shared Backend-to-Python contract; no semantic endpoint exists. |
| Persistence | No new schema proposed. | Production content/index design is absent. |
| PII treatment | Local detection/sanitization; fallback on unresolved ambiguity. | Explicit privacy requirements. |
| Fallback threshold | 1,500 ms after no usable semantic response. | Explicit user clarification; the 3-second SC-003 goal measures visible results separately. |
| Internal AI rate limit | Internal AI HTTP 429 follows the feature fallback path; no retry policy is added. | Feature edge-case requirement and shared API distinction between internal and public errors. |
