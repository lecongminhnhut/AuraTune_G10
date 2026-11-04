# Quickstart & Validation Guide: Mood and Context Recommendations (Feature 103)

## Overview

This guide provides procedures to run, test, and validate **Feature 103: Mood and Context Recommendations** end-to-end across unit, contract, integration, and UI workflows.

---

## 1. Prerequisites & Environment Setup

- Node.js >= 18.x and npm
- PostgreSQL database (or active Docker test container)
- Python 3.10+ (if running the internal AI microservice locally)

### Standalone Mock Mode (Frontend Testing)
The frontend supports zero-dependency validation using mock fixtures:
```bash
cd src/frontend
npm install
npm run dev
```
Set `VITE_USE_MOCKS=true` in `src/frontend/.env.local` to exercise the mood discovery UI against mock adapters.

---

## 2. Core Validation Scenarios

### Scenario 1: Standard Mood Recommendation Stream (User Story 1 - P1)

**Goal**: Verify that an authenticated listener can select a mood chip (e.g., "Chill") and receive matching songs and mood playlists.

1. **Authenticate and obtain user JWT**:
   ```bash
   TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "listener1@auratune.vn", "password": "Password123!"}' \
     | jq -r '.data.access_token')
   ```

2. **Retrieve preset tags**:
   ```bash
   curl -s -X GET "http://localhost:5000/api/v1/recommendations/mood-context/tags" \
     -H "Authorization: Bearer $TOKEN" | jq .
   ```
   **Expected Outcome**: Returns array of 8 tags (4 Core Moods, 4 Contexts).

3. **Request recommendations for "chill"**:
   ```bash
   curl -s -X GET "http://localhost:5000/api/v1/recommendations/mood-context?tag=chill" \
     -H "Authorization: Bearer $TOKEN" | jq .
   ```

4. **Expected Outcomes**:
   - HTTP status `200 OK`.
   - `data.tag` is `"chill"`.
   - `data.items` contains individual `"song"` and `"playlist"` entities only (no individual albums or artists).
   - In UI: Clicking a song starts audio playback in the player bar; clicking a playlist opens playlist details (SC-004).
   - Zero duplicate cards in the feed (FR-014).

---

### Scenario 2: Empty Matches with Alternative Suggestions (User Story 2 - P2 / AF-02)

**Goal**: Verify that selecting a tag with zero catalog matches renders a friendly empty state with clickable alternative suggestion chips.

1. **Request recommendations for an empty or sparse tag** (e.g. `melancholy`):
   ```bash
   curl -s -X GET "http://localhost:5000/api/v1/recommendations/mood-context?tag=melancholy" \
     -H "Authorization: Bearer $TOKEN" | jq .
   ```

2. **Expected Outcomes**:
   - HTTP status `200 OK`.
   - `data.total_items` is `0` and `data.items` is `[]`.
   - `data.alternative_suggestions` contains 2–3 active alternative tags (e.g. `["chill", "focus"]`).
   - In UI: Empty state card renders ("Hiện chưa có bài hát phù hợp với tâm trạng này") with clickable suggestion chips (SC-002, SC-003).

---

### Scenario 3: AI Service Downtime & Graceful Degradation (User Story 3 - P2 / EF-01)

**Goal**: Verify that if the internal Python AI Service times out ($> 2.5$s) or is offline, the system degrades gracefully without breaking the Home Dashboard or Music Discovery view.

1. **Simulate AI Service Outage**:
   Stop or disconnect the Python AI Service container (`docker stop auratune-ai-service`).

2. **Request mood recommendations**:
   ```bash
   curl -s -X GET "http://localhost:5000/api/v1/recommendations/mood-context?tag=workout" \
     -H "Authorization: Bearer $TOKEN" | jq .
   ```

3. **Expected Outcomes**:
   - HTTP status `200 OK` (Must NOT return 500 or 503 to client).
   - Request completes within 2.6s.
   - `data.is_service_degraded` is `true`.
   - `data.fallback_shortcuts` provides navigation links (e.g. "Bảng xếp hạng thịnh hành").
   - UI renders an informative service notice with navigation shortcuts without crashing (SC-003).

---

### Scenario 4: Account Privacy & Boundary Isolation (User Story 4 - P1)

**Goal**: Verify that unauthenticated visitors cannot access private mood recommendation streams and no user data leaks across accounts.

1. **Attempt unauthenticated access**:
   ```bash
   curl -s -i -X GET "http://localhost:5000/api/v1/recommendations/mood-context?tag=chill"
   ```
   **Expected Outcome**: HTTP `401 Unauthorized`.

2. **Attempt request with invalid tag**:
   ```bash
   curl -s -X GET "http://localhost:5000/api/v1/recommendations/mood-context?tag=super_sad" \
     -H "Authorization: Bearer $TOKEN" | jq .
   ```
   **Expected Outcome**: HTTP `400 Bad Request` with code `INVALID_MOOD_TAG`.

---

### Scenario 5: Rapid Tag Switching & Request Cancellation (AF-01 / Edge Cases)

**Goal**: Verify that rapid consecutive tag selections (e.g. Chill -> Focus -> Workout) abort in-flight requests and never display stale results.

1. In UI: Rapidly click "Chill", then immediately click "Focus", then "Workout".
2. **Expected Outcomes**:
   - Network tab shows earlier HTTP requests aborted via `AbortController`.
   - Interface highlights "Workout" and displays results for "Workout" within 1.0 second.
   - No flickering or stale data from the earlier "Chill" or "Focus" queries.

---

## 3. Automated Test Execution Commands

### Unit & Service Tests
```bash
# Backend unit tests (tag validation, empty alternatives generator, deduplication)
npm run test:unit -- src/backend/tests/services/moodRecommendationService.test.js

# Frontend component & service tests
npm run test:unit -- src/frontend/tests/services/moodRecommendationService.test.jsx
```

### Contract & Integration Tests
```bash
# Validate endpoint response against OpenAPI spec
npm run test:contract -- tests/contracts/mood-context-recommendations.contract.test.js

# Security & privacy isolation test
npm run test:security -- tests/security/mood-privacy.test.js
```
