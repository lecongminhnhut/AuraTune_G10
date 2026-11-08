# Research: AI Lyrics Search

**Feature**: [032 AI Lyrics Search](./spec.md)  
**Date**: 2026-11-08

## Decisions and Findings

### Existing application boundary

- **Finding**: AuraTune has a React/Vite frontend and an Express backend. The frontend already has a Lyrics tab and local demo lyric matching. The backend currently mounts auth and health routes; no production lyrics-search route exists. `src/ai-service` contains only `.gitkeep`.
- **Decision**: Plan integration around existing frontend/backend boundaries, but do not assign the new route to Express or the placeholder AI service until the team confirms ownership.
- **Rationale**: The implementation structure is observable, but the repository does not establish the owner or deployment topology for this new feature.
- **Alternatives considered**: Calling the internal AI service directly from the browser was rejected because the shared contract explicitly describes the AI service as backend-to-Python and says the frontend does not call it directly. Assuming Express hosts the AI implementation was also rejected because the current code provides no such route or decision.

### Endpoint and API schema

- **Finding**: The shared [API contract](../../../docs/analysis-and-design/api-contract.md) specifies the common `{success,message,data,error}` envelope, maps `AI_SERVICE_UNAVAILABLE` to HTTP 503 and `RATE_LIMITED` to HTTP 429, lists public `GET /search/lyrics` with `q` and `limit`, and separately lists internal `POST /ai/search/lyrics` (backend to Python). It defines no request body, result schema, lyric-context fields, or pagination continuation format.
- **Decision**: Preserve the shared envelope and status meanings. Treat the endpoint ownership/method conflict and all missing payload fields as approval gates; do not write a guessed payload schema.
- **Rationale**: The feature spec requires the POST path, but does not clarify whether that is the browser-facing request or an internal service call. Both interpretations conflict with or extend the shared API table differently.
- **Alternatives considered**: Creating fields based on mock song objects or assuming `next_offset`/`has_more` was rejected because fixtures are not an API contract and no pagination shape is documented.

### AI provider, runtime, and authentication

- **Finding**: No AI provider, SDK, model, runtime, internal auth arrangement, or AI service implementation is present in the inspected repository. The product proposal describes AI-assisted search at a capability level but does not approve an implementation technology for this feature.
- **Decision**: Select none in this plan. Record service owner, runtime/provider, and internal authentication as decisions needed before implementation.
- **Rationale**: Choosing a provider or model would exceed the approved design evidence and the feature spec's instruction against inventing an algorithm.
- **Alternatives considered**: Choosing a project mentioned in high-level proposal material or inferring a Python service from the shared contract was rejected; neither establishes an approved provider/runtime for this feature.

### Searchable lyric source

- **Finding**: The frontend mock catalog has lyric text for a small set of demo tracks; the repository does not identify a canonical production lyric store/index or its relationship to song IDs and playback metadata.
- **Decision**: Use mock data only as a local UI/test fixture. Keep production source, indexing, and identity mapping unresolved; do not add a database schema.
- **Rationale**: The feature spec assumes an available lyric source but does not specify a schema, and the current mock data is not evidence of production persistence.
- **Alternatives considered**: Creating a new PostgreSQL/Supabase schema or treating browser mock data as the production catalog was rejected as unsupported by the feature design.

### Timeout and fallback classification

- **Finding**: The latest clarification and FR-008 define a three-second timeout; one earlier edge-case and an assumption in `spec.md` still say five seconds. The shared API contract identifies 503 as `AI_SERVICE_UNAVAILABLE` and 429 as `RATE_LIMITED`.
- **Decision**: The plan uses three seconds and HTTP 503 as fallback conditions; HTTP 429 and other errors do not trigger fallback. Record the stale five-second text for spec-owner reconciliation.
- **Rationale**: FR-008 and the later clarification are the explicit latest requirement; status code handling follows the shared contract and FR-018.
- **Alternatives considered**: Using five seconds was rejected because it conflicts with the latest clarification and FR-008. Treating 429 as unavailable was rejected by FR-018.

### Fallback matching and tie-breaking

- **Finding**: The spec requires normalized lyric-only matching, exact phrase matches above matches containing more query words, and exclusion of title/artist-only matches. It does not define ordering among candidates with equal rank.
- **Decision**: Implement only the required primary ranking and lyrics-only filter after the catalog and normalization rules are approved. Leave equal-rank tie-breaking open.
- **Rationale**: A stable tie-breaker would affect observable ordering and should not be invented in a planning artifact.
- **Alternatives considered**: Sorting by title, artist, popularity, or source order was not selected because none is authorized by the feature spec.

### Pagination and fallback notice

- **Finding**: The feature spec establishes 20 songs per batch, a Load More action, and a dismissible inline fallback banner. The shared API contract does not define continuation metadata or a response mode field.
- **Decision**: Preserve the UI behavior; leave server continuation details and whether fallback mode is returned by the API unresolved. The client may only infer mode from a local transition if that behavior is approved.
- **Rationale**: UI behavior is specified, while the corresponding API fields are not.
- **Alternatives considered**: Inventing `offset`, `next_cursor`, `has_more`, or a response `mode` property was rejected.

## Project and Testing Constraints

- Team documentation standard requires English Markdown.
- `.specify/memory/constitution.md` is still the template placeholder, so project-specific constitutional gates cannot be evaluated.
- Existing frontend scripts provide `dev`, `build`, and `preview`; the backend exposes `start` and `dev`; the root backend test script covers auth. No frontend test runner or lyrics-search suite was found. Implementation should select/approve focused test tooling without assuming a repository-wide convention.

## Alternatives Summary

| Decision area | Selected planning position | Why alternatives are not selected |
|---|---|---|
| Browser-to-AI topology | Unresolved; browser must not call internal AI directly | Ownership is absent and the shared API distinguishes public and internal paths. |
| AI technology | No provider/runtime/model chosen | No approval or implementation exists. |
| Lyrics storage | No schema change; source remains to be confirmed | Mock fixtures do not establish production storage. |
| Timeout | Three seconds, pending cleanup of stale five-second spec text | Latest clarification and FR-008 specify three seconds. |
| Fallback ranking | Required phrase/query-word ordering only; tie-breaker open | No tie-break rule is specified. |
| API payload and pagination | No fields invented | The shared contract lacks a detailed lyrics schema. |
