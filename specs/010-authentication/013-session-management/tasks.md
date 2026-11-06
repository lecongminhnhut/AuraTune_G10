# Tasks: Session Management (013)

**Input**: Design documents from `specs/010-authentication/013-session-management/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/session-api.json, quickstart.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story mapping (US1, US2, US3)

---

## Phase 1: Setup & Infrastructure

- [x] T001 Setup PostgreSQL schema migration script for `user_sessions` table in `src/database/services/sessionService.js`
- [x] T002 Configure Session environment variables (`JWT_SECRET`, `MAX_CONCURRENT_SESSIONS=5`, `SESSION_GRACE_PERIOD_SECONDS=60`) in `src/database/supabaseClient.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T003 Create session management service module `src/database/services/sessionService.js` supporting CRUD operations on `user_sessions`
- [x] T004 Implement SHA-256 token hashing and helper utilities in `src/database/services/sessionService.js`

---

## Phase 3: User Story 1 - Secure and Persistent Login (Priority: P1) 🎯 MVP

**Goal**: Support dual-token authentication (short-lived Access Token in memory, long-lived Refresh Token in HttpOnly cookie) with silent background refresh.

**Independent Test**: Log in with "Remember Me", wait for Access Token expiry, verify background `/auth/refresh` restores session seamlessly.

- [x] T005 [P] [US1] Create `/auth/refresh` API endpoint handler in `src/database/services/sessionService.js`
- [x] T006 [P] [US1] Implement HttpOnly, Secure, SameSite=Strict cookie parser and generator in `src/database/services/sessionService.js`
- [x] T007 [US1] Update frontend Auth context (`src/frontend/src/context/AppStore.jsx`) to keep Access Token in memory and handle silent refresh on load
- [x] T008 [US1] Create API HTTP interceptor `src/frontend/src/services/sessionApiClient.js` to catch 401 errors and attempt automatic token refresh before retrying failed requests

---

## Phase 4: User Story 2 - Manual Logout (Priority: P1) 🎯 MVP

**Goal**: Revoke session upon clicking Logout, clearing HttpOnly cookies and server session data.

**Independent Test**: Click Logout in top menu -> server marks session revoked, cookie is cleared, user is redirected to Login.

- [x] T009 [P] [US2] Create `/auth/logout` API endpoint handler in `src/database/services/sessionService.js`
- [x] T010 [US2] Connect UI Logout button in `src/frontend/src/components/common/TopBar.jsx` to clear in-memory tokens and execute logout call
- [x] T011 [US2] Update route guards in `src/frontend/src/routes/AppRouter.jsx` to reject revoked/logged-out sessions

---

## Phase 5: User Story 3 - Multi-Device Management (Priority: P2)

**Goal**: Enable users to view active sessions and execute "Logout from all devices".

**Independent Test**: Log in from 2 devices, click "Logout from all devices" on Device A -> Device B is invalidated upon next request.

- [x] T012 [P] [US3] Create `/auth/sessions` endpoint to list active user sessions in `src/database/services/sessionService.js`
- [x] T013 [P] [US3] Create `/auth/logout-all` endpoint to revoke all active sessions for a user in `src/database/services/sessionService.js`
- [x] T014 [US3] Add "Logout from all devices" action to user menu in `src/frontend/src/components/common/TopBar.jsx`

---

## Phase 6: Edge Cases & Security Safeguards (Priority: P2)

**Goal**: Enforce 60-second grace period for rotation, reuse invalidation, 5-session LRU limit, and weak session binding.

- [x] T015 [US1] Implement 60-second rotation grace window logic in `src/database/services/sessionService.js`
- [x] T016 [US1] Implement token reuse detection (revoking entire session family on invalid token access) in `src/database/services/sessionService.js`
- [x] T017 [US1] Implement 5 concurrent session LRU eviction policy on new login in `src/database/services/sessionService.js`
- [x] T018 [US1] Implement weak User-Agent validation and sliding inactivity window (7-day extension) in `src/database/services/sessionService.js`

---

## Phase 7: Polish & Validation

- [x] T019 Execute all verification scenarios according to `quickstart.md`
- [x] T020 Run `speckit-analyze` skill to verify spec compliance
