# Technical Research: Session Management (013)

## 1. Dual-Token Architecture & Storage Model

### Decision
- **Access Token**: Short-lived (15–60 minutes) JWT issued upon authentication or refresh. Stored in memory on the client (React state/context). Included in standard API calls via `Authorization: Bearer <access_token>`.
- **Refresh Token**: Long-lived token (7 days standard, 30 days if "Remember Me" is enabled). Delivered exclusively via `HttpOnly`, `Secure`, `SameSite=Strict` HTTP cookie (`path=/api/v1/auth`).

### Rationale
- **XSS Protection**: Storing the Refresh Token in an HttpOnly cookie prevents client-side JavaScript scripts from reading or exfiltrating persistent credentials.
- **CSRF Defense**: `SameSite=Strict` combined with origin verification ensures credentials are not automatically submitted on cross-site requests.
- **State Separation**: Access token memory storage ensures tokens disappear on tab close unless restored via the persistent Refresh Token cookie.

---

## 2. Refresh Token Rotation with 60-Second Grace Period

### Decision
- On every call to `/auth/refresh`, the server:
  1. Validates the incoming Refresh Token.
  2. Generates a new cryptographically secure Refresh Token.
  3. Updates `refresh_token_hash` in PostgreSQL to the new token's hash.
  4. Stores `previous_refresh_token_hash` and sets `grace_expires_at = NOW() + INTERVAL '60 seconds'`.
  5. Sets the new Refresh Token in the response cookie and returns a fresh Access Token.

### Rationale
- **Concurrency & Network Resilience**: High-frequency concurrent requests (e.g. multiple browser tabs triggering refresh simultaneously) or transient network drops won't log out legitimate users.
- **Rotation Enforcement**: Once the 60-second window elapses, the previous token becomes strictly invalid.

---

## 3. Token Reuse & Theft Invalidation Policy

### Decision
- If a Refresh Token matching `previous_refresh_token_hash` is presented **AFTER** `grace_expires_at` has passed, or if an already-invalidated token is used:
  - System immediately flags security breach / token theft.
  - Revokes the entire session (`is_revoked = true` or deletes session record).
  - Forces client to clear cookies and re-authenticate.

### Rationale
- Immediate containment of stolen credentials. Prevents attackers who intercepted an old token from extending unauthorized access.

---

## 4. Concurrent Active Session Control (Max 5 Limit)

### Decision
- When a user logs in (Local or OAuth):
  1. Count non-revoked sessions for `user_id` where `expires_at > NOW()` and `inactive_at > NOW()`.
  2. If active session count >= 5, identify the session with the oldest `last_active_at` timestamp and set `is_revoked = true`.
  3. Insert the newly established session.

### Rationale
- Prevents resource exhaustion, limits attack surface, and provides automatic cleanup for abandoned browser sessions.

---

## 5. Weak Session Binding & Inactivity Sliding Window

### Decision
- **Weak Session Binding**: Parse and compare `User-Agent` string on `/auth/refresh`. Reject request with `401 Unauthorized` if User-Agent drastically changes within the same session. Log IP changes for security audit.
- **Sliding Window Inactivity**: Initial `inactive_at` is set to `NOW() + 7 days`. On every valid token refresh, `inactive_at` is extended to `NOW() + 7 days` (up to `expires_at` maximum bound).

### Alternatives Evaluated
- **Strict IP Binding**: Rejected because mobile networks and VPNs change IP addresses frequently during normal usage, leading to false-positive session revocations.
