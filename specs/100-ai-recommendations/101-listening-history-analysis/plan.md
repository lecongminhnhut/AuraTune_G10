# Implementation Plan: Listening History Analysis (Feature 101)

**Branch**: `101-listening-history-analysis` | **Date**: 2026-11-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/100-ai-recommendations/101-listening-history-analysis/spec.md`

---

## 1. Summary

Feature 101 enables authenticated listeners to review personal insights derived strictly from their own playback activity. The analysis computes **total listening duration** and **top genres ranked by accumulated listening duration** across a selectable time window (7 days, 30 days, or all time).

The technical approach executes **on-demand dynamic SQL aggregation** over the existing `listening_history` table joined with `songs`, strictly filtered by `user_id = :authenticated_user_id` and excluding invalid records (null references or zero duration). Results refresh every time the user opens the analysis view. The frontend consumes these metrics via a new service layer adapter connecting the existing `HistoryPage.jsx` UI to `GET /api/v1/users/me/stats/listening-analysis`.

---

## 2. Technical Context

**Language/Version**:
- Frontend: JavaScript (ES Modules, JSX), Node.js >= 18
- Backend: JavaScript / Node.js (ES Modules), runtime Node.js >= 18
- Database: PostgreSQL (SQL syntax matching `docs/design/database/README.md`)

**Primary Dependencies**:
- Frontend: React 18 (`react`, `react-dom`), Vite 5, Tailwind CSS 3, `lucide-react`
- Backend: Express.js (or NestJS REST framework), `pg` / `knex` (or equivalent PostgreSQL client), `jsonwebtoken`
- Shared/Dev: Vitest, Supertest, ESLint

**Storage**:
- PostgreSQL database: existing `listening_history`, `songs`, and `users` tables
- Browser memory for active JWT access token; `localStorage` demo state only in standalone mock mode

**Testing**:
- Unit Tests: Vitest for frontend duration formatters and genre ranking calculation; Vitest/Jest for backend aggregation logic
- Contract Tests: Supertest validating endpoint responses against OpenAPI contract ([`listening-analysis-api.json`](./contracts/listening-analysis-api.json))
- Security Tests: Integration tests verifying that cross-account access attempts are strictly denied (HTTP 401 / scoped `WHERE user_id`)

**Target Platform**:
- Web application running on modern desktop and mobile browsers (Chrome, Edge, Firefox, Safari)

**Project Type**:
- Full-stack Web Application (Client + Backend API + PostgreSQL Database)

**Performance Goals**:
- Statistical aggregation for accounts with up to 10,000 playback records completes and renders within **1.5 seconds** (per `UC-100-001`).

**Constraints**:
- Strict compliance with Vietnamese Personal Data Protection Decree 13/2023/ND-CP: account data isolation is non-negotiable.
- Input data source restricted to `listening_history` only (FR-003). Must NOT use `user_listening_stats`, likes, follows, or other account data.
- Must NOT compute top songs or top artists (reserved for Group 070).
- Must NOT generate song recommendations or mood/context suggestions (reserved for Features 102 and 103).
- Must NOT invoke Python AI service for this feature; computation is purely deterministic statistical aggregation (FR-009).

**Scale/Scope**:
- 1 feature (Feature 101) within Group 100. Single REST endpoint + 1 UI view tab ("Thống kê" on `/history`).

---

## 3. Current Implementation Baseline vs Planned Work

To prevent confusion and maintain strict project boundaries, the codebase baseline is categorized below:

| Component / Layer | What Currently Exists | What Will Be Implemented in Feature 101 | What Needs Future Confirmation |
|---|---|---|---|
| **Frontend UI** | Prototype in `src/frontend/src/pages/History/HistoryPage.jsx` with working "Thống kê" tab, mock duration calculation, and genre progress bars. | Connect `HistoryPage.jsx` to `statsService.js`; handle remote loading, error, and empty states cleanly. | Integration into global notification toast / refresh triggers when new tracks play. |
| **Frontend Service** | Ad-hoc in-memory filtering directly against React context (`store.library.history`). | `src/frontend/src/services/statsService.js` and `mock/mockStatsService.js` supporting `getListeningAnalysis(range)`. | Global API client error interceptors and token refresh hooks. |
| **Backend API** | Concept and endpoint conventions in `docs/analysis-and-design/api-contract.md` and `docs/design/api/api-conventions.md`. `src/backend` currently has `.gitkeep`. | `statsController.js`, `statsRoutes.js`, and `listeningAnalysisService.js` implementing `GET /api/v1/users/me/stats/listening-analysis`. | Final backend framework selection (Express vs NestJS) for entire repository. |
| **Database** | Reference schema in `docs/design/database/README.md` (`listening_history`, `songs`, `users`). | SQL aggregation queries with strict null filtering and genre joins. | Production migration runner and compound index creation (`user_id, played_at`). |
| **External AI** | Python AI Service concept in `docs/design/architecture/system-architecture.md`. | **None (Zero AI integration)**. Feature 101 is purely deterministic statistical aggregation. | N/A (Feature 101 explicitly excludes external AI per FR-009). |

---

## 4. Constitution Check

Checking compliance against repository principles, Team Contract, Proposal, and Project Plan:

| Gate | Status | Notes |
|---|---|---|
| **No New Product Scope** | **PASS** | Scope strictly matches Feature 101 in `spec.md` and Proposal Section 6.10. No feature creep. |
| **Group Ownership Boundary** | **PASS** | Group 100 (Nhựt) owns Listening History Analysis (total duration + top genres). Group 070 (Khoa) retains ownership of top songs and top artists. |
| **Data Privacy & Isolation** | **PASS** | SQL queries enforce `WHERE user_id = :authenticated_user_id`. Unauthenticated requests yield 401. |
| **No Secrets Committed** | **PASS** | No API keys, credentials, or `.env` entries are committed. |
| **Language & Conventions** | **PASS** | Documentation in English Markdown; diagrams in Mermaid; API conventions match `/api/v1` standard envelope. |
| **Test-First & Verifiable** | **PASS** | Unit, contract, and edge-case testing plans established before implementation. |

---

## 5. Project Structure

### Documentation (`specs/100-ai-recommendations/101-listening-history-analysis/`)

```text
specs/100-ai-recommendations/101-listening-history-analysis/
├── spec.md                          # Feature specification (Source of truth)
├── plan.md                          # This implementation plan
├── research.md                      # Phase 0 architectural research & decisions
├── data-model.md                    # Phase 1 data model & state machine
├── quickstart.md                    # Phase 1 validation & test scenarios
├── checklists/
│   └── requirements.md              # Quality checklist
├── contracts/
│   ├── README.md                    # Interface documentation
│   └── listening-analysis-api.json  # OpenAPI 3.0 specification
└── ui/
    ├── 01-listening-analysis-overview.png
    ├── 02-total-listening-duration.png
    ├── 03-top-genres.png
    ├── 04-insufficient-history.png
    └── 05-analysis-unavailable.png
```

### Source Code Layout (`src/`)

```text
src/
├── backend/
│   └── src/
│       ├── controllers/
│       │   └── statsController.js          # Handles GET /api/v1/users/me/stats/listening-analysis
│       ├── services/
│       │   └── listeningAnalysisService.js # Business logic: aggregation, ranking, tie-breaking
│       ├── repositories/
│       │   └── historyRepository.js        # SQL queries on listening_history and songs
│       ├── routes/
│       │   └── statsRoutes.js              # Express/framework route mounting
│       └── middlewares/
│           └── authMiddleware.js           # JWT verification & req.user assignment
│
└── frontend/
    └── src/
        ├── services/                       # Added as defined in Frontend Foundation Plan
        │   ├── statsService.js             # HTTP API client for analysis
        │   └── mock/
        │       └── mockStatsService.js     # Standalone mock fallback for demo mode
        └── pages/
            └── History/
                └── HistoryPage.jsx         # View component rendering "Thống kê" tab
```

**Structure Decision**: Preserves the established `src/frontend` and `src/backend` separation. Does not introduce new top-level directories or monorepo tools.

---

## 6. Architecture & Data Flow

### Architectural Overview

```mermaid
flowchart TD
    subgraph Client["Frontend Client (Browser)"]
        UI["HistoryPage.jsx (Thống kê tab)"]
        Service["statsService.js"]
        MockAdapter["mockStatsService.js"]
        Switch{"VITE_USE_MOCKS?"}
        
        UI --> Service
        Service --> Switch
        Switch -->|true| MockAdapter
    end

    subgraph Server["Backend API (/api/v1)"]
        Router["statsRoutes.js"]
        AuthGuard["authMiddleware.js (JWT)"]
        Controller["statsController.js"]
        AnalysisService["listeningAnalysisService.js"]
        Repo["historyRepository.js"]

        Switch -->|false (HTTP)| Router
        Router --> AuthGuard
        AuthGuard --> Controller
        Controller --> AnalysisService
        AnalysisService --> Repo
    end

    subgraph Database["PostgreSQL Database"]
        HistoryTable[("listening_history\n(user_id, song_id, played_at, listened_duration)")]
        SongsTable[("songs\n(id, title, genre)")]

        Repo -->|Dynamic SQL Join & Aggregation| HistoryTable
        Repo --> SongsTable
    end
```

### Detailed Data Flow

1. **Request Trigger**: The user navigates to `/history` and clicks the **"Thống kê"** tab (optionally choosing range: 7 days, 30 days, or all).
2. **Client Dispatch**: `HistoryPage.jsx` calls `statsService.getListeningAnalysis(range)`.
3. **Authentication Verification**:
   - The backend `authMiddleware` extracts `Bearer <token>` from the `Authorization` header.
   - If invalid or missing, immediately responds with HTTP 401 (`UNAUTHORIZED`).
   - If valid, attaches authenticated `userId` to `req.user`.
4. **Data Aggregation Query**:
   - `historyRepository` executes a parameterized query against PostgreSQL:
     ```sql
     SELECT 
         COUNT(lh.id) AS total_plays,
         COUNT(DISTINCT lh.song_id) AS unique_tracks_count,
         COALESCE(SUM(lh.listened_duration), 0) AS total_duration_seconds
     FROM listening_history lh
     INNER JOIN songs s ON lh.song_id = s.id
     WHERE lh.user_id = $1
       AND lh.user_id IS NOT NULL
       AND lh.song_id IS NOT NULL
       AND lh.listened_duration > 0
       AND ($2::timestamptz IS NULL OR lh.played_at >= $2::timestamptz);
     ```
   - Concurrently or sequentially, retrieves genre breakdown:
     ```sql
     SELECT 
         s.genre AS genre_name,
         SUM(lh.listened_duration) AS accumulated_seconds,
         COUNT(lh.id) AS plays_count
     FROM listening_history lh
     INNER JOIN songs s ON lh.song_id = s.id
     WHERE lh.user_id = $1
       AND lh.user_id IS NOT NULL
       AND lh.song_id IS NOT NULL
       AND lh.listened_duration > 0
       AND s.genre IS NOT NULL 
       AND s.genre <> ''
       AND ($2::timestamptz IS NULL OR lh.played_at >= $2::timestamptz)
     GROUP BY s.genre
     ORDER BY accumulated_seconds DESC, plays_count DESC, s.genre ASC;
     ```
5. **Sufficiency & Business Logic (`listeningAnalysisService.js`)**:
   - If `total_plays < 1`: Returns `hasSufficientData: false`, `topGenres: []`, `totalDurationSeconds: 0`.
   - If `total_plays >= 1`:
     - Computes formatted total duration string (e.g., `"14 giờ 25 phút"`).
     - Calculates relative duration percentage for each genre:
       `percentage = (accumulated_seconds / total_genre_duration) * 100`.
     - Assigns rank (1, 2, 3...) to each genre item.
6. **Response Delivery**:
   - Controller sends standard JSON envelope (`HTTP 200 OK`).
   - Frontend updates state and renders summary cards and progress bars. If `hasSufficientData: false`, renders the empty state card.

---

## 7. Technical Approach & Detailed Rules

### 7.1. Time Range Boundary Rules

| Range Parameter | Query Boundary Condition |
|---|---|
| `"7"` | `played_at >= NOW() - INTERVAL '7 days'` |
| `"30"` | `played_at >= NOW() - INTERVAL '30 days'` |
| `"all"` (default) | No lower date bound (`$2 IS NULL`) |

### 7.2. Genre Tie-Breaking and Formatting

1. **Ranking criteria**:
   - Primary: `accumulated_seconds DESC`
   - Secondary: `plays_count DESC`
   - Tertiary: `genre_name ASC` (alphabetical tie-breaker)
2. **Proportional Visualization**:
   - Relative to the #1 top genre: `width_pct = max(4, (genre.accumulated_seconds / top_genre.accumulated_seconds) * 100)`.
   - Ensures smaller genres remain visible with a minimum bar width of 4%.
3. **Missing Metadata Isolation**:
   - If a song record has `genre = NULL` or `genre = ''`:
     - Its `listened_duration` **is included** in `total_duration_seconds` and `total_plays` (it is an eligible listening event).
     - It **is excluded** from `top_genres` ranking, adhering to FR-012.

---

## 8. Testing Strategy

### 8.1. Unit Tests

- **Duration Formatter (`formatTotalDuration`)**:
  - `0 seconds` → `"0 phút"`
  - `45 seconds` → `"1 phút"` (rounded)
  - `3660 seconds` → `"1 giờ 1 phút"`
  - `86400 seconds` → `"24 giờ 0 phút"`
- **Genre Aggregation & Ranking Logic**:
  - Single genre playback → 100% percentage, rank 1.
  - Multiple genres with distinct durations → ordered descending.
  - Tied durations → tie-broken by play count, then alphabetical name.
  - Zero duration entries → filtered out.
  - Null `song_id` or null `user_id` entries → filtered out.
- **Date Window Filtering**:
  - Entry within 6 days included in `"7"`, `"30"`, `"all"`.
  - Entry at 15 days excluded from `"7"`, included in `"30"`, `"all"`.
  - Entry at 45 days excluded from `"7"` and `"30"`, included in `"all"`.

### 8.2. Integration & Contract Tests

- **Endpoint Contract Compliance**:
  - Send `GET /api/v1/users/me/stats/listening-analysis` with valid JWT.
  - Validate response status `200` and schema conforms to `ListeningAnalysisApiResponse`.
- **Empty State Compliance**:
  - Test account with zero plays receives `200 OK` with `hasSufficientData: false`.
- **Database Failure Simulation**:
  - Simulated database timeout returns `500 Internal Server Error` with code `DATABASE_ERROR`.

### 8.3. Security & Access Control Tests

- **Unauthenticated Request**:
  - Request without `Authorization` header returns `401 Unauthorized`.
- **Account Data Isolation**:
  - User A authenticates and requests analysis.
  - Verify returned `data.userId` strictly matches User A.
  - Verify that playback events belonging to User B are completely excluded from User A's totals.

---

## 9. Risks & Technical Considerations

| Risk / Consideration | Severity | Mitigation Strategy |
|---|---|---|
| **Query Performance on Large History (>50,000 rows)** | Medium | Add compound index: `CREATE INDEX idx_listening_history_user_played ON listening_history(user_id, played_at)`. |
| **Songs with Missing Genre Metadata** | Low | Count duration toward total listening time, but cleanly exclude from genre ranking. Display metadata status notice if all songs lack genre. |
| **Scope Drift with Group 070 (History)** | High | Strictly forbid Feature 101 from returning top songs or top artists; those remain exclusively in Group 070's `/users/me/stats/top-songs` and `/top-artists`. |
| **Premature Dependency on Pre-computed Table** | High | Do NOT read `user_listening_stats`. Stick strictly to dynamic query on `listening_history` per FR-003. |
| **Unauthenticated Data Disclosure** | Critical | Server-side JWT authentication check before any database access. No endpoint takes `user_id` as a client argument. |

---

## 10. Readiness for `/speckit.tasks`

This implementation plan satisfies all completion gates:
1. Requirements from `spec.md` are completely accounted for (FR-001 through FR-014).
2. Interface contracts are fully defined in `contracts/`.
3. Entity models and state transitions are specified in `data-model.md`.
4. Verification scenarios are documented in `quickstart.md`.
5. Technical decisions and rationale are resolved in `research.md`.

Next phase: Execute `/speckit.tasks` to generate ordered, actionable implementation tasks.
