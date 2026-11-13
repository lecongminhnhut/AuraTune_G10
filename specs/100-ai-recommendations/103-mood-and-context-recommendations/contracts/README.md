# API Contracts: Mood and Context Recommendations (Feature 103)

## Overview

This directory contains the API contracts, interface specifications, and internal microservice protocols for **Feature 103: Mood and Context Recommendations** under **Group 100 – AI Recommendations**.

- [`mood-context-recommendations-api.json`](./mood-context-recommendations-api.json): OpenAPI 3.0.3 specification for client-facing mood and context discovery endpoints.
- This document: Developer guide, query parameters, internal AI service contract, empty-state alternative protocols, and degradation behaviors.

---

## 1. Client-Facing Endpoints

### 1.1. `GET /api/v1/recommendations/mood-context/tags`

Retrieves the active taxonomy of curated preset chips organized into Core Moods and Activity Contexts.

- **Authentication**: Required (`Bearer <access_token>`).
- **Allowed Roles**: `User`, `Artist`, `Admin`.
- **Response**: Array of `MoodTag` objects containing `id`, `label`, `category`, `icon`, and `color_gradient`.

---

### 1.2. `GET /api/v1/recommendations/mood-context`

Retrieves a dedicated stream of individual Songs and theme-curated Mood Playlists matching the requested preset tag.

- **Authentication**: Required (`Bearer <access_token>`).
- **Allowed Roles**: `User`, `Artist`, `Admin`.
- **Query Parameters**:
  - `tag` (**required**, string): Preset tag token. Allowed values:
    - Core Moods: `"chill"`, `"energetic"`, `"melancholy"`, `"focus"`.
    - Activity Contexts: `"study_work"`, `"workout"`, `"late_night"`, `"travel_commute"`.
  - `type` (optional, string): Entity filter. Enum: `["all", "song", "playlist"]`. Default: `"all"`.
  - `limit` (optional, integer): Maximum items to return. Min: 1, Max: 50. Default: 20.
- **HTTP Status Codes**:
  - `200 OK`: Request succeeded (returns matching items, or empty items with alternative suggestions, or degraded state).
  - `400 Bad Request`: Invalid or missing `tag` parameter (`INVALID_MOOD_TAG`).
  - `401 Unauthorized`: Missing, invalid, or expired Bearer token.
  - `403 Forbidden`: Account is locked or banned.

#### Response Modes

1. **Standard Success (Matching Content)**:
   ```json
   {
     "success": true,
     "message": "Gợi ý âm nhạc theo tâm trạng/ngữ cảnh",
     "data": {
       "tag": "chill",
       "tag_category": "mood",
       "is_service_degraded": false,
       "total_items": 2,
       "items": [
         {
           "id": "e0a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
           "type": "song",
           "title": "Mùa Hè Của Em",
           "subtitle": "Vũ.",
           "image_url": "https://storage.auratune.vn/covers/mua-he.jpg",
           "badge": "Chill",
           "target_id": "e0a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
           "extra": {
             "duration": 215,
             "audio_url": "/api/v1/songs/e0a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c/stream"
           }
         },
         {
           "id": "f1a2b3c4-d5e6-7a8b-9c0d-1e2f3a4b5c6d",
           "type": "playlist",
           "title": "Lofi Chill Cho Đêm Muộn",
           "subtitle": "AuraTune Curators",
           "image_url": "https://storage.auratune.vn/covers/lofi-chill.jpg",
           "badge": "Chill Playlist",
           "target_id": "f1a2b3c4-d5e6-7a8b-9c0d-1e2f3a4b5c6d",
           "extra": {
             "track_count": 30,
             "is_official": true
           }
         }
       ],
       "alternative_suggestions": ["focus", "late_night"],
       "generated_at": "2026-11-03T18:45:00.000Z"
     },
     "error": null
   }
   ```

2. **Empty Matches with Alternative Suggestions (AF-02)**:
   ```json
   {
     "success": true,
     "message": "Hiện chưa có bài hát phù hợp với tâm trạng này",
     "data": {
       "tag": "melancholy",
       "tag_category": "mood",
       "is_service_degraded": false,
       "total_items": 0,
       "items": [],
       "alternative_suggestions": ["chill", "focus"],
       "generated_at": "2026-11-03T18:45:00.000Z"
     },
     "error": null
   }
   ```

3. **Graceful Degradation State on AI Service Failure (EF-01)**:
   ```json
   {
     "success": true,
     "message": "Dịch vụ gợi ý tâm trạng tạm thời không phản hồi",
     "data": {
       "tag": "workout",
       "tag_category": "context",
       "is_service_degraded": true,
       "total_items": 0,
       "items": [],
       "alternative_suggestions": ["energetic", "focus"],
       "fallback_shortcuts": [
         { "title": "Bảng xếp hạng thịnh hành", "target_url": "/explore" },
         { "title": "Tuyển tập đã thích", "target_url": "/playlist/liked" }
       ],
       "generated_at": "2026-11-03T18:45:00.000Z"
     },
     "error": null
   }
   ```

---

## 2. Internal Microservice Contract: Backend API → Python AI Service

In accordance with `docs/design/architecture/system-architecture.md`, Frontend calls the Backend API, which communicates with the internal Python AI microservice.

### `POST /ai/recommend/mood`

- **Protocol**: Internal HTTP/JSON.
- **Client**: Backend API recommendation service.
- **Timeout**: Strict **2500ms** client-enforced timeout.
- **Headers**: `Content-Type: application/json`, `X-Internal-Secret: <secret>`.

#### Request Body
```json
{
  "tag": "chill",
  "category": "mood",
  "requested_types": ["song", "playlist"],
  "limit": 30
}
```

#### Response Body (`200 OK`)
```json
{
  "status": "success",
  "model_version": "v1.1.0-mood-cluster",
  "candidates": [
    { "type": "song", "id": "e0a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c", "score": 0.95 },
    { "type": "playlist", "id": "f1a2b3c4-d5e6-7a8b-9c0d-1e2f3a4b5c6d", "score": 0.91 }
  ]
}
```

---

## 3. Error Codes & Fault Tolerance Matrix

| Error Code | HTTP Status | Trigger Condition | System Action |
|---|---|---|---|
| `UNAUTHORIZED` | `401` | Missing or invalid Bearer JWT | Rejects request; client prompts login |
| `INVALID_MOOD_TAG` | `400` | `tag` parameter missing or not in 8-tag whitelist | Returns 400 with list of allowed tags |
| `ACCOUNT_BANNED` | `403` | User account is disabled/banned | Rejects request with notification message |
| *(Empty Catalog Matches)* | `200 OK` | Tag matches 0 active songs/playlists | Returns HTTP 200 with `items: []` and 2–3 `alternative_suggestions` (FR-004) |
| *(AI Service Timeout / Outage)* | `200 OK` | AI service unresponsive $> 2.5$s or returns HTTP 5xx | Intercepts error, logs warning, and returns HTTP 200 with `is_service_degraded: true` & fallback shortcuts (FR-004, EF-01) |

---

## 4. Client-Side In-Memory Cache & Mock Testing

- **In-Memory Cache (TTL 5 mins)**: `src/frontend/src/services/moodRecommendationService.js` caches recent recommendation results in a Map keyed by `${tag}:${type}:${limit}`. Toggling back to recently viewed chips completes in $< 50$ms without network re-fetch (AF-01).
- **Client Request Cancellation**: Active fetch requests are tied to `AbortController`, aborting previous queries when chips are rapidly switched to eliminate race conditions.
- **Standalone Mock Mode**: Set `VITE_USE_MOCKS=true` in `src/frontend/.env.local` to exercise the complete UI against `mockMoodRecommendationService.js`.

