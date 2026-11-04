# Conversational Interface API Contracts (Feature 121)

## Overview

This directory defines the interface contracts for **Feature 121: Conversational Interface** in AuraTune.

Feature 121 establishes the bidirectional conversational exchange between the AuraTune client and the backend agent service.

## Contracts in this Directory

| File | Protocol | Description | Consumer |
|---|---|---|---|
| [`conversational-interface-api.json`](./conversational-interface-api.json) | OpenAPI 3.0.3 (SSE + REST) | HTTP endpoints for streaming chat turns and service health. | `AIHostChat.jsx` / `agentService.js` |

## Endpoints Summary

### 1. `POST /api/v1/agent/chat`
- **Purpose**: Initiates a conversational turn with the AI host.
- **Authentication**: `Bearer <JWT>` (Required, Listener/Artist/Admin).
- **Request Body**: `application/json` containing `prompt` (1-500 chars) and `context` (`currentTrack`, `isPlaying`, `volume`).
- **Response**: `text/event-stream` (Server-Sent Events) emitting:
  - `event: thinking` — reasoning trace chunk
  - `event: text` — response Markdown delta chunk
  - `event: error` — error description
  - `event: done` — completion confirmation
- **Error Responses**:
  - `400 Bad Request` (`VALIDATION_ERROR`): Empty prompt or exceeds 500 chars.
  - `401 Unauthorized` (`UNAUTHORIZED`): Missing or invalid JWT.
  - `503 Service Unavailable` (`AI_SERVICE_UNAVAILABLE`): AI agent host unreachable or quota exhausted.

### 2. `GET /api/v1/agent/health`
- **Purpose**: Lightweight health probe to inspect AI host availability.
- **Authentication**: Public or Protected.
- **Response**: `200 OK` with `{ "status": "online" | "degraded" | "unavailable" }`.

## Envelope & Event Conventions

Standard JSON envelopes follow repository conventions defined in `docs/design/api/api-conventions.md`:
```json
{
  "success": true,
  "message": "AI Host is online",
  "data": {
    "status": "online"
  },
  "error": null
}
```

SSE events are formatted according to the W3C Server-Sent Events standard:
```text
event: thinking
data: {"text": "Đang phân tích giai điệu..."}

event: text
data: {"delta": "Chào bạn! Mình có thể giúp gì cho buổi nghe nhạc hôm nay?"}

event: done
data: {"totalDurationMs": 850}
```
