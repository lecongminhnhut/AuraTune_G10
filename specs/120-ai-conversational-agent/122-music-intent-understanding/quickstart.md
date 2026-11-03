# Quickstart Validation Guide: Music Intent Understanding (Feature 122)

## Overview

This guide outlines runnable verification scenarios to validate that **Feature 122: Music Intent Understanding** correctly parses natural language prompts, sanitizes PII, resolves situational context, decomposes compound clauses, and delivers structured intent payloads to the Centralized Orchestrator in accordance with `spec.md`.

---

## Prerequisites & Environment Setup

1. **Node.js**: Ensure Node.js >= 18 is installed.
2. **Directory**: Root of AuraTune repository.
3. **Frontend / Agent Service**:
   ```bash
   cd src/frontend
   npm install
   ```

---

## Validation Scenarios

### Scenario 1: Specific Song & Artist Playback Request (FR-001, FR-002, FR-003)

- **Input Prompt**: `"bật bài Chúng ta của hiện tại của Sơn Tùng M-TP"`
- **Expected Outcome**:
  - `intentType`: `"play_music"`
  - `confidenceScore` >= 0.90
  - `extractedEntities`:
    - `songTitle`: `"Chúng ta của hiện tại"`
    - `artistName`: `"Sơn Tùng M-TP"`
    - `controlAction`: `"play"`
  - `suggestedAction`: `"real_time_assistance"`
  - `completenessStatus`: `"complete"`

---

### Scenario 2: Contextual Track Query & Relative Volume Control (FR-004)

- **Context Snapshot**: `{ currentTrack: { id: "song-1", title: "Ánh Nắng Của Anh", artist: "Đức Phúc" }, isPlaying: true, volume: 60 }`
- **Sub-test 2A - Track Query**:
  - **Input Prompt**: `"bài đang phát là gì thế?"`
  - **Expected Outcome**:
    - `intentType`: `"query_music_info"`
    - `extractedEntities.targetTrackId`: `"song-1"`
    - `suggestedAction`: `"dialogue_response"`
    - Response formats title & artist without changing playback state.
- **Sub-test 2B - Relative Volume**:
  - **Input Prompt**: `"giảm âm lượng"`
  - **Expected Outcome**:
    - `intentType`: `"play_music"`
    - `extractedEntities.controlAction`: `"set_volume"`
    - `extractedEntities.volumeLevel`: `40` (60 - 20)
    - `suggestedAction`: `"real_time_assistance"`

---

### Scenario 3: Music Discovery by Mood and Context (FR-002, FR-003)

- **Input Prompt**: `"tìm cho mình mấy bài chill để học bài đêm khuya"`
- **Expected Outcome**:
  - `intentType`: `"search_music"`
  - `extractedEntities`:
    - `mood`: `"chill"`
    - `activity`: `"học bài đêm khuya"`
  - `suggestedAction`: `"recommendation_service"` (or `"search_service"`)
  - No accidental direct playback mutation occurs before search resolution.

---

### Scenario 4: Compound Chained Request Decomposition (FR-005, Session 2026-11-01)

- **Input Prompt**: `"phát nhạc chill rồi giảm âm lượng 40%"`
- **Expected Outcome**:
  - `clauses.length`: `2`
  - `clauses[0]`:
    - `rawClauseText`: `"phát nhạc chill"`
    - `intentType`: `"play_music"`
    - `extractedEntities.mood`: `"chill"`
  - `clauses[1]`:
    - `rawClauseText`: `"giảm âm lượng 40%"`
    - `intentType`: `"play_music"`
    - `extractedEntities.controlAction`: `"set_volume"`
    - `extractedEntities.volumeLevel`: `40`
  - Clauses ordered sequentially for execution by the Orchestrator.

---

### Scenario 5: Vague Request with Smart Heuristic Defaults (FR-005, Session 2026-10-30)

- **Input Prompt**: `"bật nhạc lên"`
- **Expected Outcome**:
  - `intentType`: `"play_music"`
  - `completenessStatus`: `"missing_parameters"`
  - `inferredDefaults.default_source`: `"personalized_or_trending"`
  - System does NOT halt with a blocking question ("bạn muốn nghe gì?") but provides default playback action immediately.

---

### Scenario 6: Non-Music Chit-Chat Isolation (FR-002, SC-004)

- **Input Prompt**: `"hôm nay thời tiết thế nào bạn ơi?"`
- **Expected Outcome**:
  - `intentType`: `"general_chitchat"`
  - `suggestedAction`: `"dialogue_response"`
  - Zero playback commands or queue operations are generated.
  - Background music playback continues completely uninterrupted.

---

### Scenario 7: Sensitive PII Scrubbing Compliance (FR-008, SC-003)

- **Input Prompt**: `"Tôi là Nam, email nam99@gmail.com, số điện thoại 0912345678, hãy bật nhạc Trịnh"`
- **Expected Outcome**:
  - Inbound text to Tier-1 external AI endpoint:
    `"Tôi là Nam, email [EMAIL_REDACTED], số điện thoại [PHONE_REDACTED], hãy bật nhạc Trịnh"`
  - `extractedEntities.artistName`: `"Trịnh"`
  - 100% of emails and phone numbers stripped; zero PII leakage into external logs or payloads.

---

### Scenario 8: Fallback to Tier-2 Rule Matcher on AI Outage (FR-010, SC-005)

- **Setup**: Simulate external LLM API outage (timeout > 1,200ms or 503 response).
- **Input Prompt**: `"tạm dừng nhạc"`
- **Expected Outcome**:
  - System catches timeout at 1,200ms.
  - Tier-2 local rule matcher (`planClause`) activates immediately.
  - Returns `intentType: "play_music"`, `controlAction: "pause"`.
  - Zero application crash, zero disruption to active audio stream.

---

## Automated Verification

```bash
# Run unit & contract tests for intent parsing
cd src/frontend
npm run test -- agentService.test.js
```
