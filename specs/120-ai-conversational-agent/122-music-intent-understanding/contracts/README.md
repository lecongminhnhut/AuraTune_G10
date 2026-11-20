# Music Intent Understanding Contracts (Feature 122)

## Overview

This directory defines the interface contracts for **Feature 122: Music Intent Understanding** in AuraTune.

Feature 122 provides the analytical endpoint and payload definitions for analyzing natural language messages, scrubbing PII, resolving situational context, decomposing compound clauses, and forwarding structured intent schemas to the Centralized AI Agent Orchestrator.

## Contracts in this Directory

| File | Protocol | Description | Consumer |
|---|---|---|---|
| [`music-intent-understanding-api.json`](./music-intent-understanding-api.json) | OpenAPI 3.0.3 (REST) | Internal/Backend endpoint for intent classification, entity extraction, and orchestrator payload delivery. | Centralized AI Agent Orchestrator / Backend API |

## Endpoints Summary

### 1. `POST /api/v1/agent/intent/analyze`
- **Purpose**: Evaluates a listener's natural language message and produces a structured intent payload.
- **Authentication**: `Bearer <JWT>` (Required, Listener/Artist/Admin).
- **Request Body**: `application/json` containing `rawPrompt` and `context` (`currentTrack`, `isPlaying`, `volume`).
- **Response**: `200 OK` with canonical `MusicIntentResultEnvelope` containing:
  - `intentType`: `"play_music" | "search_music" | "query_music_info" | "manage_library" | "general_chitchat" | "unknown"`
  - `confidenceScore`: `0.0` - `1.0`
  - `completenessStatus`: `"complete" | "missing_parameters" | "ambiguous"`
  - `extractedEntities`: Key-value map of recognized music slots
  - `clauses`: Array of sequential clause plans for compound instructions
  - `suggestedAction`: Downstream routing target (`"real_time_assistance" | "search_service" | "recommendation_service" | "dialogue_response" | "unrecognized_fallback"`)
  - `inferredDefaults`: Object containing heuristic fallback source (e.g. `{ "default_source": "personalized_or_trending" }`) or null
  - `sanitizedPrompt`: Prompt string with all PII scrubbed per Decree 13/2023/NĐ-CP
- **Error Responses**:
  - `400 Bad Request` (`VALIDATION_ERROR`): Empty, whitespace-only, or exceeding 500 characters.
  - `401 Unauthorized` (`UNAUTHORIZED`): Missing or invalid JWT session token.
  - `503 Service Unavailable` (`AI_SERVICE_UNAVAILABLE`): Fallback exhausted or service error.

## Payload Example

```json
{
  "success": true,
  "message": "Intent analysis completed successfully",
  "data": {
    "requestId": "req-intent-1698765432",
    "intentType": "play_music",
    "confidenceScore": 0.96,
    "completenessStatus": "complete",
    "extractedEntities": {
      "songTitle": "Nơi này có anh",
      "artistName": "Sơn Tùng M-TP",
      "volumeLevel": 40,
      "controlAction": "play"
    },
    "clauses": [
      {
        "clauseIndex": 0,
        "rawClauseText": "bật bài Nơi này có anh",
        "intentType": "play_music",
        "extractedEntities": {
          "songTitle": "Nơi này có anh",
          "controlAction": "play"
        },
        "suggestedAction": "real_time_assistance"
      },
      {
        "clauseIndex": 1,
        "rawClauseText": "âm lượng 40%",
        "intentType": "play_music",
        "extractedEntities": {
          "controlAction": "set_volume",
          "volumeLevel": 40
        },
        "suggestedAction": "real_time_assistance"
      }
    ],
    "suggestedAction": "real_time_assistance",
    "inferredDefaults": null,
    "sanitizedPrompt": "bật bài Nơi này có anh rồi chỉnh âm lượng 40%"
  },
  "error": null
}
```
