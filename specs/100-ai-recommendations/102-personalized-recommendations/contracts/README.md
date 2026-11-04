# API Contracts: Personalized Recommendations (Feature 102)

## Overview

This directory contains the formal API specifications and contract documentation for **Feature 102: Personalized Recommendations** under **Group 100 – AI Recommendations**.

- [`personalized-recommendations-api.json`](./personalized-recommendations-api.json): OpenAPI 3.0.3 specification for client-facing recommendation endpoints.
- This document: Developer integration guide, internal AI service contract, error matrices, and degradation protocols.

---

## 1. Client-Facing Endpoints

### 1.1. `GET /api/v1/recommendations/personalized`

Retrieves a multi-entity recommendation feed tailored to the authenticated listener's history and affinity profile.

- **Authentication**: Required (`Bearer <access_token>`).
- **Allowed Roles**: `User`, `Artist`, `Admin`.
- **Query Parameters**:
  - `type` (optional, string): Filter candidates by type. Enum: `["all", "song", "album", "artist", "playlist"]`. Default: `"all"`.
  - `limit` (optional, integer): Maximum items to return. Min: 1, Max: 50. Default: 20.
- **HTTP Status Codes**:
  - `200 OK`: Request succeeded (returns personalized recommendations or graceful fallback).
  - `401 Unauthorized`: Missing, invalid, or expired Bearer token.
  - `403 Forbidden`: Account is locked or banned.

#### Success Response Structure (Personalized Mode)
```json
{
  "success": true,
  "message": "Danh sách gợi ý cá nhân hóa",
  "data": {
    "user_id": "4a7372cf-6c2e-4b47-9f7e-7c4273215891",
    "is_fallback": false,
    "fallback_reason": null,
    "message": null,
    "generated_at": "2026-11-03T18:30:00.000Z",
    "total_items": 4,
    "items": [
      {
        "id": "e0a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
        "type": "song",
        "title": "Nàng Thơ",
        "subtitle": "Hoàng Dũng",
        "image_url": "https://storage.auratune.vn/covers/nang-tho.jpg",
        "badge": "Gợi ý",
        "target_id": "e0a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
        "extra": {
          "duration": 254,
          "audio_url": "/api/v1/songs/e0a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c/stream"
        }
      }
    ]
  },
  "error": null
}
```

#### Success Response Structure (Cold-Start Fallback Mode)
Triggered when the user has $< 3$ qualifying playback events, or following history purge (`UC-070-004`):
```json
{
  "success": true,
  "message": "Nội dung phổ biến trên AuraTune",
  "data": {
    "user_id": "9b123456-789a-bcde-f012-3456789abcde",
    "is_fallback": true,
    "fallback_reason": "COLD_START",
    "message": null,
    "generated_at": "2026-11-03T18:30:00.000Z",
    "total_items": 10,
    "items": [ ... popular songs & official starter playlists ... ]
  },
  "error": null
}
```

#### Success Response Structure (AI Service Degradation Mode - EF-01)
Triggered when the internal Python AI Service times out ($> 2.5$s) or encounters an internal 5xx error:
```json
{
  "success": true,
  "message": "Hiển thị nội dung thịnh hành do hệ thống gợi ý đang bảo trì",
  "data": {
    "user_id": "4a7372cf-6c2e-4b47-9f7e-7c4273215891",
    "is_fallback": true,
    "fallback_reason": "AI_SERVICE_UNAVAILABLE",
    "message": "Hiển thị nội dung thịnh hành do hệ thống gợi ý đang bảo trì",
    "generated_at": "2026-11-03T18:30:00.000Z",
    "total_items": 10,
    "items": [ ... popular songs & official starter playlists ... ]
  },
  "error": null
}
```

---

### 1.2. `GET /api/v1/recommendations/songs` (Backward-Compatible Alias)

Maintains compatibility with `docs/analysis-and-design/api-contract.md` Line 104. Internally delegates to `GET /api/v1/recommendations/personalized?type=song`.

---

## 2. Internal Microservice Contract: Backend API → Python AI Service

In accordance with `docs/design/architecture/system-architecture.md` Section 3 & 4, the Frontend NEVER invokes the Python AI Service directly. The Backend API mediates all AI requests.

### `POST /ai/recommend`

- **Protocol**: HTTP/1.1 or HTTP/2 within internal Docker/Kubernetes network.
- **Client**: Backend API recommendation service.
- **Timeout**: Strict **2500ms** enforced on client request.
- **Header**: `Content-Type: application/json`, `X-Internal-Secret: <shared_service_secret>`.

#### Request Body
```json
{
  "user_id": "4a7372cf-6c2e-4b47-9f7e-7c4273215891",
  "signals": {
    "played_song_ids": [
      "e0a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
      "11111111-2222-3333-4444-555555555555"
    ],
    "liked_song_ids": [
      "e0a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c"
    ],
    "followed_artist_ids": [
      "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
    ]
  },
  "requested_types": ["song", "album", "artist", "playlist"],
  "limit": 30
}
```

#### Response Body (`200 OK`)
```json
{
  "status": "success",
  "model_version": "v1.2.0-als-vector",
  "candidates": [
    { "type": "song", "id": "e0a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c", "score": 0.96 },
    { "type": "playlist", "id": "f1a2b3c4-d5e6-7a8b-9c0d-1e2f3a4b5c6d", "score": 0.91 },
    { "type": "artist", "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d", "score": 0.85 },
    { "type": "album", "id": "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e", "score": 0.79 }
  ]
}
```

---

## 3. Error Codes & Fault Tolerance

| Error Code | HTTP Status | Trigger Condition | System Action |
|---|---|---|---|
| `UNAUTHORIZED` | `401` | Header `Authorization: Bearer <token>` is missing or token is invalid/expired | Rejects request; client prompts login |
| `ACCOUNT_BANNED` | `403` | User account status is disabled/banned | Rejects request with notification message |
| `VALIDATION_ERROR` | `400` | Query parameters violate limits (e.g. `limit > 50` or invalid `type`) | Returns descriptive error details |
| *(Internal AI Timeout / Error)* | `200 OK` (Degraded) | AI service unresponsive $> 2.5$s or returns HTTP 5xx | Backend intercepts error, logs warning, and serves popular fallback with non-blocking notice (FR-006) |
