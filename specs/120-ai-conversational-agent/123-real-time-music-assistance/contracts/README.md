# Real-Time Music Assistance Contracts (Feature 123)

## Overview

This directory defines the interface contracts for **Feature 123: Real-Time Music Assistance** in AuraTune.

Feature 123 defines the command schema for client tool execution, interactive confirmation rules, and the integration endpoints connecting the conversational assistant with player actions and library mutations.

## Contracts in this Directory

| File | Protocol | Description | Consumer |
|---|---|---|---|
| [`real-time-music-assistance-api.json`](./real-time-music-assistance-api.json) | OpenAPI 3.0.3 | Schema for tool call directives (`client_actions`), execution feedback, and library assistance endpoints. | `AIHostChat.jsx` / `agentTools.js` / Backend API |

## Tool Directives (Client-Side Dispatching)

Tool directives are emitted in SSE streams (under event `tool_call`) or within response payloads (`client_actions`):

```json
{
  "type": "tool_call",
  "id": "call_1",
  "name": "set_volume",
  "args": { "value": 40 },
  "label": "set_volume(40)"
}
```

For destructive tools (`clear_queue`):
```json
{
  "type": "tool_call",
  "id": "call_2",
  "name": "clear_queue",
  "args": {},
  "label": "clear_queue()",
  "confirm": "Xóa tất cả bài trong hàng chờ?"
}
```

For embedded interactive cards:
```json
{
  "type": "playlist",
  "playlistId": "pl-lofi-chill"
}
```

## Backend Library Assistance REST Endpoints

Feature 123 uses standard platform REST endpoints for library mutations:
- `PUT /api/v1/songs/:id/like` — Toggle liked track
- `POST /api/v1/playlists/:id/songs` — Add track to custom playlist
- `PUT /api/v1/artists/:id/follow` — Follow artist
- `POST /api/v1/users/me/history` — Register assisted playback event
