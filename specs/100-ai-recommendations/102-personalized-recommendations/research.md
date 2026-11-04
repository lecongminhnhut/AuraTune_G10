# Phase 0 Research: Personalized Recommendations (Feature 102)

## Overview

This research document consolidates architectural findings, design decisions, and technical trade-offs for **Feature 102: Personalized Recommendations** under **Group 100 – AI Recommendations** in AuraTune.

Feature 102 delivers an authenticated listener recommendation feed across multiple entity types (Songs, Albums, Artists, Playlists) based on qualifying listening history, liked songs, and followed artists. It specifies robust cold-start handling for new listeners, graceful degradation during AI service timeouts/outages, and strict account boundary isolation in compliance with Vietnamese Personal Data Protection Decree 13/2023/ND-CP.

---

## Research Tasks & Technical Decisions

### 1. Multi-Entity Recommendation Representation & Retrieval Strategy

- **Context & Constraints**:
  - `spec.md` (FR-002, Clarification 1B): The feature must support multiple music entity types: Songs, Albums, Artists, and Playlists. Selecting an item must navigate to its detail view or initiate audio playback (FR-007).
  - Catalog integrity (FR-008): Recommended items referencing inactive, deleted, or missing catalog entities must be filtered out prior to UI presentation.
  - Deduplication (FR-015): The recommendation list must not contain duplicate entries of the same item.
- **Decision**:
  - Adopt a **polymorphic `RecommendedItem` schema** with a discriminator field `type` (`"song" | "album" | "artist" | "playlist"`), containing display metadata (`id`, `type`, `title`, `subtitle`, `image_url`, `badge`, `target_id`, `extra`).
  - Architecture flow:
    1. Recommendation engine (or fallback logic) produces candidate entity tuples `(type, entity_id, score)`.
    2. Backend queries PostgreSQL to hydrate current catalog details (title, cover artwork, creator name, active status).
    3. Missing or soft-deleted entities are eliminated during hydration.
    4. An in-memory deduplication pass ensures each `type:id` tuple appears at most once in the feed.
- **Rationale**:
  - Decouples recommendation scoring from catalog display metadata storage.
  - Hydrating from PostgreSQL guarantees that renamed songs, updated cover artwork, or newly deleted items are immediately reflected without stale vector cache artifacts.
  - Satisfies SC-004 (1-step action) and SC-005 (zero broken links/references).
- **Alternatives Considered**:
  - *Separate endpoints per entity type (`/recommendations/songs`, `/recommendations/albums`, etc.)*: Rejected because it requires multiple HTTP round-trips from the Home Dashboard, complicates layout coordination, and degrades mobile network performance.
  - *Storing full display metadata in the AI vector store*: Rejected because catalog changes (e.g., song title edits, artist name changes, audio file deactivation) would cause out-of-sync presentation and broken playback.

---

### 2. Preference Signal Ingestion & Cold-Start Fallback Policy

- **Context & Constraints**:
  - `spec.md` (FR-005, FR-009, Clarification 2A): Preference signals include qualifying playback events (`listening_history.listened_duration >= 30`), liked tracks (`user_liked_songs`), and followed artists (`user_follows_artist`).
  - Records with null `user_id` or `song_id` must be ignored.
  - For new accounts, accounts with insufficient activity, or accounts whose listening history has been purged (`UC-070-004`), the system must immediately fall back to popular/trending content without crashing or showing blank states (FR-005, SC-002).
- **Decision**:
  - **Signal Query**:
    ```sql
    -- 1. Qualifying listening history (last 90 days, listened >= 30 seconds)
    SELECT song_id, COUNT(*) as play_count, SUM(listened_duration) as total_duration
    FROM listening_history
    WHERE user_id = :authenticated_user_id
      AND song_id IS NOT NULL
      AND listened_duration >= 30
    GROUP BY song_id
    ORDER BY total_duration DESC
    LIMIT 50;

    -- 2. Liked songs
    SELECT song_id FROM user_liked_songs
    WHERE user_id = :authenticated_user_id AND song_id IS NOT NULL;

    -- 3. Followed artists
    SELECT artist_id FROM user_follows_artist
    WHERE user_id = :authenticated_user_id AND artist_id IS NOT NULL;
    ```
  - **Cold-Start Threshold**:
    - If total qualifying playback events `< 3` and total liked songs `< 1` and total followed artists `< 1`:
      Mark as **Cold-Start** (`is_fallback: true`, `fallback_reason: "COLD_START"`).
    - Immediately retrieve platform-wide popular tracks (`songs.total_plays` ranked) and official starter playlists (`playlists.status = 'Public' AND playlists.is_official = true`), labeled with `"Phổ biến"` / `"Thịnh hành"` badges.
- **Rationale**:
  - Accurately captures listener intent while filtering short skips (< 30s) as non-intent noise.
  - Instant transition to cold-start trending baseline satisfies FR-009 when history is purged.
  - 100% prevents blank screens for new users (SC-002).
- **Alternatives Considered**:
  - *Counting skips (< 30s) as negative signals*: Deferred because negative feedback modeling is not currently specified in proposal or use case.
  - *Using `user_listening_stats` for signals*: Rejected per FR-009 which explicitly binds signals to `listening_history`, `user_liked_songs`, and `user_follows_artist`.

---

### 3. AI Service Communication, Timeout & Graceful Degradation (EF-01)

- **Context & Constraints**:
  - `UC-100-002` (EF-01, Special Requirements): Recommendation response time must not exceed 2.0s under standard load. AI service timeout is strictly enforced at 2.5s.
  - `docs/design/architecture/system-architecture.md`: Defines internal backend-to-AI communication at `POST /ai/recommend`.
  - When the external/internal AI service is offline, unreachable, or times out, the system must degrade gracefully to popular content with a subtle fallback notification without disrupting home dashboard browsing or throwing 5xx errors (FR-006, SC-003).
- **Decision**:
  - Backend wraps the internal HTTP call to Python AI Service (`POST /ai/recommend`) with a strict **2500ms timeout** using `AbortController` (Node.js) or equivalent client timeout.
  - **Circuit Breaker / Resilient Fallback Pattern**:
    - Catch all network errors, timeouts (`AbortError`), and HTTP 5xx responses from the AI Service.
    - Log error details securely on backend (`logger.warn("AI Service degraded, serving trending fallback", { error })`).
    - Execute fallback query for popular songs and curated playlists.
    - Return **HTTP 200 OK** with structured fallback metadata:
      ```json
      {
        "success": true,
        "message": "Hiển thị nội dung thịnh hành do hệ thống gợi ý đang bảo trì",
        "data": {
          "is_fallback": true,
          "fallback_reason": "AI_SERVICE_UNAVAILABLE",
          "items": [...]
        },
        "error": null
      }
      ```
- **Rationale**:
  - Crucial UX principle: AI failure must NOT crash the user dashboard or trigger intrusive error modals.
  - Satisfies FR-006, SC-003, and guarantees 99.9% UI uptime for home discovery.
- **Alternatives Considered**:
  - *Returning HTTP 503 Service Unavailable to client*: Strictly rejected because the frontend would display an error toast or blank container, degrading user experience and violating FR-006.
  - *Retrying AI service multiple times synchronously*: Rejected because multiple retries would exceed the 2.0s overall latency budget and stall page load.

---

### 4. API Endpoint Contract & Path Design

- **Context & Constraints**:
  - `docs/analysis-and-design/api-contract.md`: Line 104 lists `GET /recommendations/songs` (Role: User).
  - `docs/design/api/api-conventions.md`: Root `/api/v1`, Bearer token authentication, standard envelope `{ success, message, data, error }`.
  - Clarification 1B expanded scope to multi-entity (songs, albums, artists, playlists).
- **Decision**:
  - Primary endpoint: `GET /api/v1/recommendations/personalized`
  - Alias / Backward-compatibility: `GET /api/v1/recommendations/songs` delegates to the primary endpoint with `type=song`.
  - Query parameters:
    - `type`: Optional enum string (`"all"`, `"song"`, `"album"`, `"artist"`, `"playlist"`, default: `"all"`).
    - `limit`: Optional integer (min: 1, max: 50, default: 20).
  - Access Control: Protected endpoint requiring `User`, `Artist`, or `Admin` role.
- **Rationale**:
  - `GET /api/v1/recommendations/personalized` accurately describes the multi-entity personalized feed.
  - Aliasing `/recommendations/songs` guarantees full backward compatibility with earlier API drafts.
- **Alternatives Considered**:
  - `GET /api/v1/users/me/recommendations`: Valid alternative, but `/api/v1/recommendations/*` is the established route group in `api-contract.md` alongside `/recommendations/songs`.

---

### 5. Account Isolation, Privacy & Decree 13/2023/ND-CP

- **Context & Constraints**:
  - `spec.md` (FR-003, FR-004, SC-001): Under no circumstances are User A's preferences, history, or distinct recommendations disclosed to User B or unauthenticated visitors.
  - Vietnamese Decree 13/2023/ND-CP on Personal Data Protection.
- **Decision**:
  - **Token-Bound Identity**: The caller's `user_id` is extracted strictly from the verified JWT payload (`req.user.id`).
  - No client-supplied user ID in path or query parameters is accepted or parsed.
  - Database queries are strictly scoped: `WHERE user_id = :req_user_id`.
  - The internal AI service receives an anonymized request payload (`{ "user_id": "<uuid>", "signals": { ... } }`) containing only catalog IDs; no PII (email, display name, IP address) is transmitted.
  - Unauthenticated requests are rejected immediately by authentication middleware with HTTP 401 `UNAUTHORIZED`.
- **Rationale**:
  - Eliminates Insecure Direct Object Reference (IDOR) vulnerabilities.
  - Guarantees 100% privacy isolation and satisfies SC-001.
- **Alternatives Considered**:
  - *Accepting `?user_id=...` for testing/admin impersonation*: Strictly rejected due to severe data leak risks.

---

### 6. Frontend Integration & Interaction Handling

- **Context & Constraints**:
  - Existing `HomePage.jsx` currently displays mock recommendation cards and checks `store.aiAvailable`.
  - `spec.md` (FR-007, SC-004): Selecting an item opens or plays it in 1 interaction step.
- **Decision**:
  - Create `src/frontend/src/services/recommendationService.js` and `src/frontend/src/services/mock/mockRecommendationService.js`.
  - Interaction dispatcher in `HomePage.jsx` / recommendation cards:
    - `song`: calls `player.playTrack(song, trackList)` to initiate immediate audio streaming via `MusicPlayerContext`.
    - `album`: executes client-side routing to `/album/${id}`.
    - `artist`: executes client-side routing to `/artist/${id}`.
    - `playlist`: executes client-side routing to `/playlist/${id}`.
  - Non-intrusive alert: If `is_fallback: true` and `fallback_reason === "AI_SERVICE_UNAVAILABLE"`, render an informative banner:
    *"Hiển thị nội dung thịnh hành do hệ thống gợi ý đang bảo trì"* above the recommendation feed.
- **Rationale**:
  - Matches the established pattern in `HistoryPage.jsx` and `specs/130-frontend/131-frontend-foundation/plan.md`.
  - Fulfills SC-004 and ensures seamless navigation.

---

## Summary of Technical Decisions

| Dimension | Decision | Reference |
|---|---|---|
| **Content Scope** | Multi-entity (`song`, `album`, `artist`, `playlist`) with unified `RecommendedItem` schema | Clarification 1B, FR-002 |
| **Primary Endpoint** | `GET /api/v1/recommendations/personalized` (alias: `GET /api/v1/recommendations/songs`) | `api-contract.md`, `api-conventions.md` |
| **Input Signals** | `listening_history` (duration >= 30s), `user_liked_songs`, `user_follows_artist` | FR-009, UC-100-002 |
| **Cold-Start Policy** | Fallback to platform-wide popular songs + official playlists tagged with "Phổ biến" | FR-005, Clarification 2A |
| **AI Timeout** | Strict 2.5s timeout on internal `POST /ai/recommend` | UC-100-002 Special Req |
| **Fault Tolerance** | Return HTTP 200 with popular fallback + subtle notice (never crash home view) | FR-006, Clarification 3A |
| **Catalog Filter** | Discard deleted/inactive catalog entities and deduplicate in memory | FR-008, FR-015, SC-005 |
| **Account Privacy** | Strict JWT scoping (`req.user.id`), no PII to AI service, 401 on unauthenticated | FR-003, FR-004, SC-001 |
