# Phase 0 Research: Listening History Analysis (Feature 101)

## Overview

This research document consolidates architectural findings, design decisions, and technology choices for **Feature 101: Listening History Analysis** under **Group 100 – AI Recommendations** in AuraTune.

Feature 101 calculates and presents personal listening statistics (total listening duration and top genres ranked by accumulated listening duration) exclusively derived from eligible `listening_history` records of the authenticated user.

---

## Research Tasks & Findings

### 1. Data Source & Computation Strategy: Real-time Dynamic Aggregation vs Pre-computed Stats

- **Context & Constraints**:
  - `spec.md` (FR-002, FR-003, FR-013): Derivation must use `listening_history` only. Must NOT use `user_listening_stats`, likes, follows, or other account data. Must refresh when user opens analysis.
  - `docs/design/database/README.md`: Identifies `user_listening_stats` as an optional pre-computed table, but explicitly notes that its format (`top_genres` as text) and update rules require clarification and are not confirmed for production use.
  - Performance requirement in `UC-100-001`: Aggregation for accounts up to 10,000 playback events must complete within 1.5s.
- **Decision**:
  - Implement **on-demand dynamic SQL aggregation** querying `listening_history` joined with `songs` directly upon request.
  - Do not read from or write to `user_listening_stats` in this feature.
- **Rationale**:
  - Guarantees immediate freshness when the user opens the analysis view (FR-013).
  - Strictly complies with FR-003 and the clarification session (2026-10-20).
  - On PostgreSQL with an index on `listening_history(user_id, played_at)`, aggregating 10,000 rows takes < 15ms, comfortably below the 1.5s requirement.
- **Alternatives Considered**:
  - *Reading from `user_listening_stats`*: Rejected because `spec.md` FR-003 strictly forbids using `user_listening_stats`. Furthermore, the background aggregation pipeline for that table has not been designed or scheduled.
  - *Caching in Redis*: Rejected as premature optimization. Current scale is prototype/demo academic scale (< 100 concurrent test users), and caching introduces cache invalidation complexity on new plays.

---

### 2. Data Filtering, Null Handling & Edge Cases

- **Context & Constraints**:
  - `docs/design/database/README.md` and `spec.md` Edge Cases: In the reference database schema, `listening_history.user_id` and `listening_history.song_id` allow `NULL`.
  - FR-012: The system MUST count only listening-history entries linked to the authenticated user and a valid song. At least one eligible entry is required to present analysis.
  - Missing metadata: If an individual insight lacks required metadata (e.g., song has no genre assigned), it must be reported as unavailable or excluded from genre rankings.
- **Decision**:
  - Query filtering:
    ```sql
    WHERE lh.user_id = :authenticated_user_id
      AND lh.user_id IS NOT NULL
      AND lh.song_id IS NOT NULL
      AND lh.listened_duration > 0
    ```
  - Join integrity: `INNER JOIN songs s ON lh.song_id = s.id` ensuring only existing songs count toward analysis.
  - Missing genre handling: Songs where `s.genre IS NULL` or `s.genre = ''` will not be grouped into valid genres. If all played songs lack genre metadata, total duration is still provided, but `top_genres` will return an empty list with a metadata notice.
  - Minimum threshold: If total eligible entries `< 1`, the response returns `has_sufficient_data: false` with empty metric structures, triggering the client empty state (`Chưa có đủ dữ liệu để phân tích`).
- **Rationale**:
  - Prevents database `NullPointerException` or incorrect metric sums.
  - Respects FR-007, FR-012, and prevents fabricated insights.
- **Alternatives Considered**:
  - *Treating null genre as "Unknown Genre"*: Partially acceptable in UI, but spec clarification states: "an individual insight without the metadata it requires MUST be reported as unavailable".

---

### 3. API Contract and Endpoint Routing

- **Context & Constraints**:
  - `docs/design/api/api-contract.md`: Section 2.5 defines Group 070 listening stats at:
    - `GET /users/me/stats/top-songs`
    - `GET /users/me/stats/top-artists`
  - `docs/design/api/api-conventions.md`: API root `/api/v1`, Bearer token authentication, standard envelope `{ success, message, data, error }`.
  - FR-004 & FR-011: Group 100 (Feature 101) owns total listening duration and top genres, while Group 070 owns top songs and top artists. Do not duplicate Group 070 endpoints.
- **Decision**:
  - Expose endpoint: `GET /api/v1/users/me/stats/listening-analysis`
  - Query parameters:
    - `range`: Optional enum string (`"7"`, `"30"`, `"all"`, default: `"all"`).
  - Scope: Protected endpoint requiring `User`, `Artist`, or `Admin` role (`Authorization: Bearer <token>`).
- **Rationale**:
  - Fits logically alongside `/users/me/stats/*` while preserving explicit domain ownership boundaries.
  - Scoping by `/users/me` enforces that users can only query their own data, fulfilling FR-005, FR-006, and Vietnamese Decree 13/2023/ND-CP privacy requirements.
- **Alternatives Considered**:
  - `GET /api/v1/recommendations/analysis`: Rejected because analysis is personal statistics, not a recommendation stream.
  - Overloading `GET /api/v1/users/me/history`: Rejected because history returns raw playback event streams, whereas analysis returns aggregated metrics.

---

### 4. Integration with Frontend Architecture

- **Context & Constraints**:
  - Frontend stack: React 18, Vite 5, Tailwind CSS, Lucide icons.
  - Existing implementation: `src/frontend/src/pages/History/HistoryPage.jsx` already contains UI for the "Thống kê" tab, including metric cards and top genres progress bars.
  - Frontend Foundation Plan (`specs/130-frontend/131-frontend-foundation/plan.md`): Introduces a `services/` layer with mock and HTTP adapters toggled by `VITE_USE_MOCKS`.
- **Decision**:
  - Define `statsService.js` (or integrate into `historyService.js`) under `src/frontend/src/services/`.
  - Provide an HTTP client function:
    `getListeningAnalysis(range)` calling `GET /api/v1/users/me/stats/listening-analysis?range={range}`.
  - Provide a fallback mock adapter in `src/frontend/src/services/mock/` that performs the same aggregation in-memory over mock history when `VITE_USE_MOCKS=true`.
  - Connect `HistoryPage.jsx` to this service instead of direct ad-hoc store filtering.
- **Rationale**:
  - Maximizes code reuse, aligns with repository architecture, and enables testing without a live backend.
- **Alternatives Considered**:
  - *Calling backend directly inside HistoryPage component*: Violates separation of concerns and the architecture plan in `specs/130-frontend/131-frontend-foundation/plan.md`.

---

### 5. Verification and Testing Strategy

- **Context & Constraints**:
  - Must verify acceptance scenarios for US1 (insights review), US2 (insufficient/unavailable history), and US3 (account isolation).
- **Decision**:
  - **Unit tests**:
    - Duration aggregation summing `listened_duration` (seconds conversion to formatted hours/minutes).
    - Genre ranking by accumulated seconds in descending order.
    - Tie-breaking rules for equal durations (alphabetical by genre name).
    - Date filtering for 7 days, 30 days, and all time.
  - **Integration / Contract tests**:
    - Validate `GET /api/v1/users/me/stats/listening-analysis` response structure matches API contract.
    - Validate 401 response when Authorization header is missing.
    - Validate empty response (`has_sufficient_data: false`) when user has 0 plays or only invalid records (null song/user).
  - **Security tests**:
    - Confirm request always resolves `user_id` from the verified JWT token claims, ignoring any client-supplied user parameters.
- **Rationale**:
  - Ensures robust compliance with both functional and non-functional requirements.
