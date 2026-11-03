# Interface Contracts: Feature 101 – Listening History Analysis

## 1. Overview

This directory contains the interface contracts for **Feature 101: Listening History Analysis**.

- **OpenAPI 3.0 Specification**: [`listening-analysis-api.json`](./listening-analysis-api.json)

---

## 2. API Endpoint Specification

### `GET /api/v1/users/me/stats/listening-analysis`

Retrieves the computed listening duration summary and ranked top genres for the authenticated listener.

- **Authentication**: Required (`Authorization: Bearer <access_token>`).
- **Roles**: `User`, `Artist`, `Admin`.
- **Query Parameters**:
  - `range` (optional, string):
    - `"7"`: Last 7 days (`played_at >= NOW() - INTERVAL '7 days'`)
    - `"30"`: Last 30 days (`played_at >= NOW() - INTERVAL '30 days'`)
    - `"all"` (default): Entire available listening history

---

## 3. Response Definitions

### 3.1. Success with History (HTTP 200 OK)

```json
{
  "success": true,
  "message": "Listening analysis retrieved successfully",
  "data": {
    "userId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "range": "all",
    "hasSufficientData": true,
    "totalDurationSeconds": 48250,
    "formattedTotalDuration": "13 giờ 24 phút",
    "totalPlays": 142,
    "uniqueTracksCount": 68,
    "topGenres": [
      {
        "rank": 1,
        "genreId": "lo-fi",
        "genreName": "Lo-Fi",
        "accumulatedSeconds": 24500,
        "formattedDuration": "6 giờ 48 phút",
        "percentage": 50.8
      },
      {
        "rank": 2,
        "genreId": "indie",
        "genreName": "Indie Pop",
        "accumulatedSeconds": 15200,
        "formattedDuration": "4 giờ 13 phút",
        "percentage": 31.5
      }
    ],
    "calculatedAt": "2026-11-03T10:30:00Z"
  },
  "error": null
}
```

### 3.2. Empty / Insufficient History (HTTP 200 OK)

When an account has `< 1` eligible playback record in the selected range:

```json
{
  "success": true,
  "message": "Insufficient listening history for analysis",
  "data": {
    "userId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "range": "all",
    "hasSufficientData": false,
    "totalDurationSeconds": 0,
    "formattedTotalDuration": "0 phút",
    "totalPlays": 0,
    "uniqueTracksCount": 0,
    "topGenres": [],
    "calculatedAt": "2026-11-03T10:30:00Z"
  },
  "error": null
}
```

### 3.3. Unauthenticated (HTTP 401 Unauthorized)

```json
{
  "success": false,
  "message": "Yêu cầu đăng nhập để truy cập thông tin phân tích",
  "data": null,
  "error": {
    "code": "UNAUTHORIZED",
    "details": []
  }
}
```

### 3.4. Database Error (HTTP 500 Internal Server Error)

```json
{
  "success": false,
  "message": "Thông tin phân tích tạm thời không khả dụng, vui lòng thử lại sau",
  "data": null,
  "error": {
    "code": "DATABASE_ERROR",
    "details": []
  }
}
```
