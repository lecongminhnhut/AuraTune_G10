# Quickstart & Validation Guide: Personalized Recommendations (Feature 102)

## Overview

This guide provides step-by-step procedures to run, test, and validate **Feature 102: Personalized Recommendations** end-to-end across unit, contract, integration, and UI workflows.

---

## 1. Prerequisites & Environment Setup

Ensure the following tools are available:
- Node.js >= 18.x and npm
- PostgreSQL database (or active Docker test container)
- Python 3.10+ (if running the internal AI microservice locally)

### Mock / Standalone Mode (Frontend Verification)
The frontend supports zero-dependency validation using mock services:
```bash
cd src/frontend
npm install
npm run dev
```
Set `VITE_USE_MOCKS=true` in `src/frontend/.env.local` to exercise the recommendation adapter against local fixtures.

---

## 2. Core Validation Scenarios

### Scenario 1: Standard Personalized Recommendations Feed (User Story 1 - P1)

**Goal**: Verify that an authenticated user with established listening activity receives a personalized multi-entity recommendation feed and can interact with items in 1 click.

1. **Authenticate as test user with listening history**:
   ```bash
   # Obtain user JWT
   TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "listener1@auratune.vn", "password": "Password123!"}' \
     | jq -r '.data.access_token')
   ```

2. **Retrieve personalized feed**:
   ```bash
   curl -s -X GET "http://localhost:5000/api/v1/recommendations/personalized?limit=10" \
     -H "Authorization: Bearer $TOKEN" | jq .
   ```

3. **Expected Outcomes**:
   - HTTP status `200 OK`.
   - `data.is_fallback` is `false` and `data.fallback_reason` is `null`.
   - `data.items` contains supported entity types (`song`, `album`, `artist`, `playlist`).
   - Every item has valid display metadata (`title`, `subtitle`, `badge`, `target_id`).
   - Zero duplicated items in the list (FR-015).
   - In UI: Clicking a song starts playback in the Music Player bar; clicking an album/artist/playlist navigates to the target page (SC-004).

---

### Scenario 2: Cold-Start Fallback for New or Low-Data Account (User Story 2 - P2)

**Goal**: Verify that an account with zero playback events receives the designated popular fallback without crashing or showing blank containers.

1. **Authenticate as newly registered test user**:
   ```bash
   TOKEN_NEW=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "newuser@auratune.vn", "password": "Password123!"}' \
     | jq -r '.data.access_token')
   ```

2. **Retrieve recommendations**:
   ```bash
   curl -s -X GET "http://localhost:5000/api/v1/recommendations/personalized" \
     -H "Authorization: Bearer $TOKEN_NEW" | jq .
   ```

3. **Expected Outcomes**:
   - HTTP status `200 OK`.
   - `data.is_fallback` is `true`.
   - `data.fallback_reason` is `"COLD_START"`.
   - `data.items` returns platform-wide popular songs and official starter playlists.
   - Cards display `"Phổ biến"` or `"Thịnh hành"` badges (SC-002).
   - Zero application crashes or blank sections.

---

### Scenario 3: AI Service Downtime / Graceful Degradation (User Story 3 - P2 / EF-01)

**Goal**: Verify that if the internal Python AI Service is down or times out ($> 2.5$s), the system degrades gracefully without breaking the Home Dashboard.

1. **Simulate AI Service Outage**:
   Stop or disconnect the Python AI Service container (`docker stop auratune-ai-service`), or point backend to an unreachable AI host.

2. **Request recommendation feed as established user**:
   ```bash
   curl -s -X GET "http://localhost:5000/api/v1/recommendations/personalized" \
     -H "Authorization: Bearer $TOKEN" | jq .
   ```

3. **Expected Outcomes**:
   - HTTP status `200 OK` (Must NOT return 500 or 503 to the client).
   - Request completes within 2.5s timeout.
   - `data.is_fallback` is `true`.
   - `data.fallback_reason` is `"AI_SERVICE_UNAVAILABLE"`.
   - `message` contains: `"Hiển thị nội dung thịnh hành do hệ thống gợi ý đang bảo trì"`.
   - Dashboard displays popular backup music with a subtle non-intrusive notification banner (SC-003).

---

### Scenario 4: Account Privacy & Boundary Isolation (User Story 4 - P1)

**Goal**: Verify that User B cannot access User A's recommendations or infer User A's private signals.

1. **Attempt unauthenticated access**:
   ```bash
   curl -s -i -X GET "http://localhost:5000/api/v1/recommendations/personalized"
   ```
   **Expected Outcome**: HTTP `401 Unauthorized`.

2. **Attempt access with User B's token**:
   ```bash
   curl -s -X GET "http://localhost:5000/api/v1/recommendations/personalized" \
     -H "Authorization: Bearer $TOKEN_USER_B" | jq '.data.user_id'
   ```
   **Expected Outcome**: Returned `user_id` strictly matches User B. None of User A's private listening history or liked songs affect User B's feed (SC-001).

---

### Scenario 5: Transition to Cold-Start Following History Purge (AF-03)

**Goal**: Verify that clearing listening history in Group 070 immediately resets recommendations to cold-start baseline.

1. **Purge User A's history**:
   ```bash
   curl -s -X DELETE "http://localhost:5000/api/v1/users/me/history" \
     -H "Authorization: Bearer $TOKEN"
   ```

2. **Fetch recommendations**:
   ```bash
   curl -s -X GET "http://localhost:5000/api/v1/recommendations/personalized" \
     -H "Authorization: Bearer $TOKEN" | jq .data.is_fallback
   ```

3. **Expected Outcome**:
   - `is_fallback` transitions immediately to `true`.
   - Personal vectors invalidated; popular fallback served (FR-009, AF-03).

---

## 3. Automated Test Execution Commands

### Unit & Service Tests
```bash
# Backend unit tests (signal extraction, cold-start logic, deduplication)
npm run test:unit -- src/backend/tests/services/recommendationService.test.js

# Frontend component & adapter tests
npm run test:unit -- src/frontend/tests/services/recommendationService.test.jsx
```

### Contract & Integration Tests
```bash
# Validate endpoint response against OpenAPI spec
npm run test:contract -- tests/contracts/personalized-recommendations.contract.test.js

# Multi-account privacy isolation tests
npm run test:security -- tests/security/recommendation-privacy.test.js
```
