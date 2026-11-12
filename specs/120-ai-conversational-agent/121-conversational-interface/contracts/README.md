# Conversational Interface API Contracts (Feature 121)

## Overview

This directory defines the interface contracts for **Feature 121: Conversational Interface** in AuraTune.

Feature 121 establishes the bidirectional conversational exchange between the AuraTune client (`AIHostChat.jsx` / `agentService.js`) and the backend agent service (`agentRoutes.js` / `agentController.js`).

## Contracts in this Directory

| File | Protocol | Description | Consumer |
|---|---|---|---|
| [`conversational-interface-api.json`](./conversational-interface-api.json) | OpenAPI 3.0.3 (SSE + REST) | HTTP endpoints for streaming chat turns and service health. | `AIHostChat.jsx` / `agentService.js` |

---

## Endpoints Specification

### 1. `POST /api/v1/agent/chat`
- **Purpose**: Initiates a conversational turn with the AI host and streams responses via Server-Sent Events.
- **Authentication**: `Bearer <JWT>` (Required, Listener/Artist/Admin).
- **Headers**:
  - `Content-Type: application/json`
  - `Accept: text/event-stream`
  - `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "prompt": "bài đang phát là gì?",
    "context": {
      "currentTrack": {
        "id": "t1",
        "title": "Nơi Này Có Anh",
        "artist": "Sơn Tùng M-TP"
      },
      "isPlaying": true,
      "volume": 80
    }
  }
  ```
- **Response**: `text/event-stream` (W3C SSE standard) emitting sequential events:
  - `event: thinking`
    ```text
    event: thinking
    data: {"type": "thinking", "text": "Đang phân tích bài hát..."}
    ```
  - `event: text`
    ```text
    event: text
    data: {"type": "text", "delta": "Bài hát đang phát là **Nơi Này Có Anh**..."}
    ```
  - `event: error` (if failure occurs during stream)
    ```text
    event: error
    data: {"type": "error", "message": "Lỗi kết nối", "code": "AI_SERVICE_UNAVAILABLE"}
    ```
  - `event: done`
    ```text
    event: done
    data: {"type": "done", "totalDurationMs": 1250}
    ```
- **Error Envelopes** (`application/json`):
  - `400 Bad Request` (`VALIDATION_ERROR`):
    ```json
    {
      "success": false,
      "message": "Nội dung tin nhắn không được để trống",
      "data": null,
      "error": {
        "code": "VALIDATION_ERROR",
        "details": [{ "field": "prompt", "issue": "Nội dung tin nhắn phải từ 1 đến 500 ký tự" }]
      }
    }
    ```
  - `401 Unauthorized` (`UNAUTHORIZED`):
    ```json
    {
      "success": false,
      "message": "Phiên đăng nhập không hợp lệ hoặc đã hết hạn",
      "data": null,
      "error": {
        "code": "UNAUTHORIZED",
        "details": []
      }
    }
    ```
  - `503 Service Unavailable` (`AI_SERVICE_UNAVAILABLE`):
    ```json
    {
      "success": false,
      "message": "AI Host tạm thời không khả dụng. Vui lòng thử lại sau.",
      "data": null,
      "error": {
        "code": "AI_SERVICE_UNAVAILABLE",
        "details": []
      }
    }
    ```

---

### 2. `GET /api/v1/agent/health`
- **Purpose**: Lightweight health check probe to inspect AI host availability.
- **Authentication**: Public.
- **Response**: `200 OK` (`application/json`):
  ```json
  {
    "success": true,
    "message": "AI Host is online",
    "data": {
      "status": "online",
      "latencyMs": 28
    },
    "error": null
  }
  ```

---

## Standalone Mock Mode (`VITE_USE_MOCKS=true`)

When `VITE_USE_MOCKS=true` is set in `src/frontend/.env` (or when running without a live backend), `src/frontend/src/utils/agentService.js` automatically delegates to `src/frontend/src/utils/aiMockData.js`. The mock generator yields realistic thinking states and Markdown delta chunks with full support for cancellation via `AbortController`.

## Running Contract and Integration Tests

```bash
# Run backend contract and security tests
npm --prefix src/backend test

# Run frontend component, markdown, and isolation tests
npm --prefix src/frontend test
```
