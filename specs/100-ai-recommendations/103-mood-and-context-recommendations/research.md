# Phase 0 Research: Mood and Context Recommendations (Feature 103)

## Overview

This research document consolidates architectural findings, design decisions, and technical trade-offs for **Feature 103: Mood and Context Recommendations** under **Group 100 – AI Recommendations** in AuraTune.

Feature 103 allows authenticated listeners to discover music aligned with their real-time emotional vibe or situational context via curated preset tags (Core Moods and Activity Contexts). It specifies multi-entity delivery limited to individual Songs and theme-curated Mood Playlists, handles empty matches and AI service outages with alternative mood suggestions and graceful degradation, and guarantees strict account boundary isolation in compliance with Vietnamese Personal Data Protection Decree 13/2023/ND-CP.

---

## Research Tasks & Technical Decisions

### 1. Mood & Activity Context Taxonomy & Input Validation Strategy

- **Context & Constraints**:
  - `spec.md` (FR-002, Clarification 2026-10-30): Input must be provided via curated preset tags and chips categorized into 4 core moods and 4 activity contexts.
  - Exclusions (FR-011, FR-013): Free-form text queries (reserved for Group 030 Search) and conversational prompts (reserved for Group 120 AI Conversational Agent) are strictly excluded.
  - Edge cases: Simultaneous conflicting mood selections (e.g., Chill vs Energetic) must be avoided.
- **Decision**:
  - Adopt a **curated 8-tag taxonomy** with two explicit categories:
    - **Core Moods**:
      - `chill`: "Chill / Thư giãn"
      - `energetic`: "Năng lượng / Hưng phấn"
      - `melancholy`: "Trầm lắng / U buồn"
      - `focus`: "Tập trung"
    - **Activity Contexts**:
      - `study_work`: "Học tập / Làm việc"
      - `workout`: "Tập luyện / Thể thao"
      - `late_night`: "Đêm muộn"
      - `travel_commute`: "Di chuyển / Đi lại"
  - **Enforce Single-Tag Query Evaluation**: Requests accept a single active `tag` parameter. The server strictly validates `tag` against the taxonomy whitelist.
  - **Metadata Endpoint**: Expose `GET /api/v1/recommendations/mood-context/tags` so frontend dynamically fetches active tag chips, display labels, visual icons, and category groupings without hardcoded client divergence.
  - Validation: Unrecognized tags return HTTP `400 Bad Request` with error code `INVALID_MOOD_TAG` and the list of permitted values.
- **Rationale**:
  - Eliminates semantic ambiguity, prevents contradictory prompt states (e.g., simultaneously sad and energetic), and adheres strictly to Clarification 2026-10-30.
  - Aligns with UI wireframe prototypes showing curated pill/chip buttons.
- **Alternatives Considered**:
  - *Free-form natural language mood prompt ("Tôi muốn nghe nhạc vừa buồn vừa nhớ người yêu")*: Strictly rejected because natural language understanding belongs to Group 030 (Semantic Search) and Group 120 (AI Conversational Agent Host).
  - *Allowing arbitrary user-defined hashtags*: Rejected as catalog clustering requires structured acoustic vectors or curated editorial tags.

---

### 2. Multi-Entity Scope: Songs & Mood Playlists Only

- **Context & Constraints**:
  - `spec.md` (FR-003, Clarification 2026-10-30): Results must include individual Songs and theme-curated Mood Playlists (e.g., "Late Night Chill", "Study Focus").
  - Difference from Feature 102: Feature 102 recommends Songs, Albums, Artists, and Playlists. Feature 103 deliberately excludes individual Albums and Artists as entities because artists/albums generally exhibit broad musical heterogeneity and cannot guarantee a single consistent mood throughout.
  - Catalog availability (FR-008): Only active, playable songs and public playlists must be served.
- **Decision**:
  - Output stream comprises a polymorphic list restricted to two entity types: `"song"` and `"playlist"`.
  - **Retrieval Pipeline**:
    1. Internal AI Service (`POST /ai/recommend/mood`) returns scored candidate tuples `(type, id, score)`.
    2. Backend validates candidates against PostgreSQL catalog:
       - For `type: "song"`: verifies `is_active = true` and joins artist/album for display metadata.
       - For `type: "playlist"`: verifies `status = 'Public'` and `is_active = true`.
    3. Inactive or missing entities are filtered out.
    4. An in-memory Set deduplicates any identical `(type, id)` pairs (FR-014).
- **Rationale**:
  - Fulfills Clarification 2026-10-30 exactly. Individual songs satisfy immediate listening, while mood playlists satisfy continuous extended activities (e.g., a 2-hour workout or study session).
  - Guarantees 100% active playable links (SC-005).
- **Alternatives Considered**:
  - *Including individual albums/artists in mood feeds*: Rejected per Clarification Session 2026-10-30; albums contain varied tracks with conflicting tempos/emotions.

---

### 3. Empty Matches & Alternative Mood Suggestions (AF-02)

- **Context & Constraints**:
  - `spec.md` (FR-004, Acceptance Scenario 2.1): When a selected tag yields zero matches, the system must display a friendly empty state ("No tracks currently found for this mood") with quick suggestion chips for other active moods, avoiding emotional mismatches or unhandled crashes.
- **Decision**:
  - When candidate query returns 0 items for a valid tag:
    - Backend returns HTTP `200 OK` with:
      ```json
      {
        "success": true,
        "message": "Hiện chưa có bài hát phù hợp với tâm trạng này",
        "data": {
          "tag": "melancholy",
          "tag_category": "mood",
          "total_items": 0,
          "items": [],
          "alternative_suggestions": ["chill", "focus"]
        },
        "error": null
      }
      ```
    - The `alternative_suggestions` array returns 2–3 active tags that currently have rich playable content.
    - Frontend renders a friendly empty-state card with quick clickable suggestion chips (SC-002, SC-003).
- **Rationale**:
  - Prevents emotional dissonance (e.g., serving upbeat dance pop when a user requests sad/melancholy music).
  - Guides the listener to working discovery paths in 1 click.
- **Alternatives Considered**:
  - *Serving arbitrary random songs when no mood match exists*: Rejected because serving happy songs to a melancholy user violates intent and breaks user trust.

---

### 4. AI Service Timeout & Graceful Degradation (EF-01)

- **Context & Constraints**:
  - `UC-100-003` (EF-01, Special Requirements): Mood recommendation stream must render within 2.0s. AI service timeout is strictly enforced at 2.5s.
  - When AI Service is unavailable or times out, system must display an informative unavailable state with navigation shortcuts without crashing the home dashboard (FR-004, SC-003).
- **Decision**:
  - Backend wraps the internal HTTP call to Python AI Service (`POST /ai/recommend/mood`) with a **2500ms timeout** using `AbortController`.
  - **Graceful Degradation Protocol**:
    - If AI Service times out or fails (5xx):
      - Backend attempts a local catalog fallback: queries public playlists tagged with the mood keyword.
      - If local fallback is also unavailable, backend catches the error and returns HTTP `200 OK` with:
        ```json
        {
          "success": true,
          "message": "Dịch vụ gợi ý tâm trạng tạm thời không phản hồi",
          "data": {
            "tag": "chill",
            "tag_category": "mood",
            "is_service_degraded": true,
            "total_items": 0,
            "items": [],
            "alternative_suggestions": ["focus", "late_night"],
            "fallback_shortcuts": [
              { "title": "Khám phá thịnh hành", "target_url": "/explore" },
              { "title": "Tuyển tập đã thích", "target_url": "/playlist/liked" }
            ]
          },
          "error": null
        }
        ```
- **Rationale**:
  - Satisfies FR-004 and EF-01. Never returns HTTP 500/503 to client; the UI displays an informative banner with exit paths rather than an unhandled error modal.
- **Alternatives Considered**:
  - *Throwing 503 Service Unavailable*: Rejected because client global error boundaries would display crash toasts or break the discovery view.

---

### 5. Client-Side Race Conditions & Rapid Tag Switching (AF-01)

- **Context & Constraints**:
  - `UC-100-003` Special Requirements: Toggling between chips must update results within 1.0 second.
  - Edge Case: Rapid consecutive clicks on different chips (e.g., Chill -> Focus -> Workout) could result in slow requests resolving out of order and displaying stale data.
- **Decision**:
  - **Request Cancellation**: Frontend `recommendationService.js` creates a dedicated `AbortController` for each tag selection; previous pending HTTP requests are aborted immediately when a new chip is clicked.
  - **Request Echo Matching**: Backend echoes `tag` in response payload; frontend discards any response whose `data.tag` does not match the currently selected chip.
  - **Short-Lived Client Cache**: Frontend maintains an in-memory `Map<tag, { result, timestamp }>` with 5-minute TTL. Switching back to an already-loaded mood displays cached items in < 50ms, comfortably beating the 1.0s requirement.
- **Rationale**:
  - Guarantees snappy, flicker-free tag switching with zero race conditions.
- **Alternatives Considered**:
  - *Disabling all chips while an HTTP request is in-flight*: Rejected as it impairs UI responsiveness and frustrates users.

---

### 6. API Endpoint Contract & Path Conventions

- **Context & Constraints**:
  - `docs/analysis-and-design/api-contract.md`: Section 2.2 defines discovery and recommendation endpoints.
  - `docs/design/api/api-conventions.md`: Root `/api/v1`, Bearer token authentication, standard envelope `{ success, message, data, error }`.
- **Decision**:
  - Primary recommendation endpoint: `GET /api/v1/recommendations/mood-context`
    - Parameters: `tag` (required, string), `type` (optional, `"all" | "song" | "playlist"`, default `"all"`), `limit` (optional, 1..50, default 20).
  - Tags metadata endpoint: `GET /api/v1/recommendations/mood-context/tags`
  - Access Control: Protected endpoint requiring `User`, `Artist`, or `Admin` role.
- **Rationale**:
  - Clean, RESTful design grouped logically under `/api/v1/recommendations/*`.
  - Supports both tag discovery and stream retrieval.

---

## Summary of Technical Decisions

| Dimension | Decision | Reference |
|---|---|---|
| **Taxonomy** | Fixed 8 preset tags (4 Core Moods, 4 Activity Contexts); single-tag selection | FR-002, Clarification 2026-10-30 |
| **Content Scope** | Polymorphic stream restricted to Songs and Mood Playlists | FR-003, Clarification 2026-10-30 |
| **Primary Endpoint** | `GET /api/v1/recommendations/mood-context?tag={tag}` | `api-conventions.md` |
| **Tags Endpoint** | `GET /api/v1/recommendations/mood-context/tags` | Dynamic metadata sync |
| **Empty State Handling** | Friendly notice + alternative suggestion chips (`alternative_suggestions`) | FR-004, AF-02, SC-003 |
| **AI Outage Handling** | 2.5s timeout on `POST /ai/recommend/mood`; HTTP 200 with degraded state & shortcuts | FR-004, EF-01, SC-003 |
| **Rapid Switching** | Client-side `AbortController` + tag echo verification + in-memory cache | AF-01, Edge Cases |
| **Account Privacy** | Bearer JWT required; mood inputs confidential; zero cross-account leakage | FR-005, FR-006, SC-001 |
