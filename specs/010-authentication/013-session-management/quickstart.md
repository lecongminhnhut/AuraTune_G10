# Quickstart & Verification Guide: Session Management (013)

## Environment Setup & Prerequisites

1. **Database Migration**: Ensure the `user_sessions` table is created in PostgreSQL with required indexes.
2. **Environment Configuration**:
   - `JWT_SECRET`: Standard JWT signing key.
   - `MAX_CONCURRENT_SESSIONS`: Set to `5`.
   - `SESSION_GRACE_PERIOD_SECONDS`: Set to `60`.
   - `COOKIE_SECURE`: `true` (in production) or `false` (local HTTP dev).

---

## Runnable Verification Scenarios

### Scenario 1: Persistent Login & Token Refresh (US1 - SC-001)

1. Open AuraTune web app in browser.
2. Log in with valid credentials, checking **"Remember Me"**.
3. Verify that an Access Token is stored in React memory and an HttpOnly cookie (`refreshToken`) is set in the browser network tab.
4. Fast-forward or mock Access Token expiration (or delete Access Token from state).
5. Trigger any authenticated API call.
6. **Expected Outcome**: App automatically calls `/api/v1/auth/refresh`, obtains a new Access Token in under 500ms, sets a new HttpOnly cookie, and completes the API request seamlessly.

---

### Scenario 2: Refresh Token Rotation & 60s Grace Window (FR-004, FR-014)

1. Issue a request to `/api/v1/auth/refresh` using `refreshToken_A`.
2. Observe server response returning a new `refreshToken_B` cookie.
3. Within 60 seconds, issue a secondary request using `refreshToken_A` (simulating concurrent tab refresh).
4. **Expected Outcome**: Request succeeds under the 60-second grace window, returning valid Access Token.
5. Wait 61 seconds and submit `refreshToken_A` again.
6. **Expected Outcome**: Server rejects request with `401 Unauthorized` as grace period has expired.

---

### Scenario 3: Token Theft & Reuse Invalidation Guard (Edge Case)

1. Intercept `refreshToken_Old` that was rotated 5 minutes ago.
2. Submit `refreshToken_Old` to `/api/v1/auth/refresh`.
3. **Expected Outcome**: Server detects token reuse, immediately revokes the session family (`is_revoked = true`), clears cookies, and returns `401 Unauthorized`. Any subsequent attempt to refresh with `refreshToken_New` fails.

---

### Scenario 4: Manual Logout (US2 - SC-003)

1. Log in to AuraTune.
2. Open the user menu at top-right avatar and click **"Đăng xuất"** (Logout).
3. **Expected Outcome**: `/api/v1/auth/logout` is called. `user_sessions` table marks session `is_revoked = true`, `refreshToken` cookie is cleared, user is redirected to `/login`, and subsequent access attempts return 401.

---

### Scenario 5: Multi-Device Logout (US3 - SC-003)

1. Log in to AuraTune from Device A (e.g. Chrome) and Device B (e.g. Firefox).
2. On Device A, click **"Logout from all devices"** in account settings.
3. **Expected Outcome**: All sessions for `user_id` are revoked in DB. Switching to Device B and refreshing/navigating causes automatic logout and redirection to `/login`.

---

### Scenario 6: Concurrent Session Limit Enforcer (FR-012)

1. Sequentially log in from 5 different browsers / incognito windows for the same user.
2. Log in a 6th time from another browser instance.
3. **Expected Outcome**: The 6th login succeeds. The 1st (oldest) session is automatically revoked (`is_revoked = true`). Attempting to use the 1st browser session results in a 401 error.
