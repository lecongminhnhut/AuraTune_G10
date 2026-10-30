# Feature Specification: Session Management

**Feature Branch**: `013-session-management`

**Created**: 2026-10-29

**Status**: Draft

**Input**: User description: "Đặc tả tính năng Session Management (013) cho AuraTune. Tính năng này tập trung vào việc quản lý phiên làm việc của người dùng sau khi đã xác thực thành công qua Local Auth (011) hoặc OAuth (012), đảm bảo trải nghiệm liền mạch và bảo mật.

Yêu cầu cụ thể:
1. Cơ chế Token: Triển khai mô hình JWT kép gồm Access Token (thời hạn ngắn, ví dụ 15-60 phút) và Refresh Token (thời hạn dài, ví dụ 7-30 ngày).
2. Refresh Token Rotation: Hỗ trợ endpoint `/auth/refresh` để cấp Access Token mới khi bản cũ hết hạn. Refresh Token phải được xoay vòng (cấp mới mỗi lần sử dụng) để ngăn chặn replay attacks.
3. Đăng xuất (Logout): Triển khai endpoint `/auth/logout` để vô hiệu hóa phiên làm việc hiện tại bằng cách xóa/thu hồi Refresh Token trong cơ sở dữ liệu.
4. Lưu trữ và Bảo mật: 
   - Refresh Token PHẢI được lưu trong HttpOnly Cookie (Secure, SameSite=Strict) để chống XSS.
   - Access Token có thể trả về trong response body để Frontend lưu trữ trong bộ nhớ (Memory).
   - Mọi giao tiếp phải qua HTTPS/TLS 1.3 theo Security Requirement 6.2.
5. Quản lý phiên đa thiết bị: Cho phép lưu trữ Refresh Token trong bảng mới (ví dụ `user_sessions` hoặc `refresh_tokens`) liên kết với `user_id`, hỗ trợ khả năng đăng xuất khỏi tất cả thiết bị hoặc xem danh sách thiết bị đang hoạt động.
6. Trạng thái duy trì (Remember Me): Tùy chọn cho phép người dùng duy trì đăng nhập qua các lần đóng trình duyệt bằng cách điều chỉnh thời hạn của Refresh Token.

Tiêu chí chấp nhận:
- Sau khi login (011/012), hệ thống trả về đúng cặp token.
- Endpoint `/auth/refresh` hoạt động chính xác, từ chối token đã hết hạn hoặc đã bị thu hồi.
- Đăng xuất thành công làm cho Refresh Token cũ không còn giá trị sử dụng.
- Đảm bảo tính nhất quán với API Contract bản v1 (mục 2.1).

Ràng buộc:
- Cập nhật schema PostgreSQL để lưu trữ Refresh Token.
- Không thay đổi cấu trúc JWT đã thống nhất ở các tính năng trước nhưng bổ sung thêm logic kiểm tra hợp lệ."

## Clarifications

### Session 2026-10-29

- Q: Should the system implement a sliding window inactivity timeout for sessions, or should they stay active until the Refresh Token expires? → A: Sliding window inactivity timeout (extends with each refresh, e.g., 7 days).
- Q: Should there be a limit on the number of concurrent active sessions (devices) a user can have at once? → A: Moderate limit (5 concurrent sessions; oldest session is revoked when limit exceeded).
- Q: Should a session be bound to the IP address or User-Agent to prevent stolen tokens from being used on other devices? → A: Weak binding (validate User-Agent consistency and monitor for significant IP address changes).
- Q: Should there be a short grace period for Refresh Token rotation to handle network interruptions? → A: 60-second grace period (allows the previous token to be used once more if rotation fails to finalize).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure and Persistent Login (Priority: P1)

As a listener, I want to stay logged into AuraTune even after I close my browser, so that I don't have to re-enter my credentials every time I want to listen to music.

**Why this priority**: Fundamental for a modern user experience and reduces friction for returning users.

**Independent Test**: Can be tested by logging in, closing the browser/session, and verifying that reopening the app maintains the authenticated state using the refresh token.

**Acceptance Scenarios**:

1. **Given** a successfully logged-in user, **When** their Access Token expires, **Then** the system automatically uses the Refresh Token to obtain a new Access Token without user intervention.
2. **Given** a user who has chosen "Remember Me", **When** they return to the site after several days, **Then** they remain logged in.

---

### User Story 2 - Manual Logout (Priority: P1)

As a user, I want to be able to log out of my account securely so that I can prevent others from accessing my personal data on shared devices.

**Why this priority**: Critical for security and privacy, especially on public or shared computers.

**Independent Test**: Can be tested by clicking "Logout" and verifying that all session tokens (Access and Refresh) are invalidated and the user is redirected to the login page.

**Acceptance Scenarios**:

1. **Given** an active session, **When** the user clicks "Logout", **Then** the Refresh Token is deleted from the server database and the HttpOnly cookie is cleared.
2. **Given** a logged-out user, **When** they attempt to use a previously valid Access Token or Refresh Token, **Then** the system rejects the request with a 401 Unauthorized error.

---

### User Story 3 - Multi-Device Management (Priority: P2)

As a user, I want to see where I am logged in and have the ability to terminate sessions on other devices so that I can secure my account if I suspect unauthorized access.

**Why this priority**: Enhances security and gives users control over their account access points.

**Independent Test**: Can be tested by logging in from two different browsers, and using one to "Logout from all devices" or remove the other session, then verifying the other session is terminated.

**Acceptance Scenarios**:

1. **Given** a user logged in on multiple devices, **When** they view their account settings, **Then** they see a list of active sessions (device type, login time).
2. **Given** multiple active sessions, **When** the user chooses "Logout from all devices", **Then** all Refresh Tokens associated with their account are revoked.

---

### Edge Cases

- **Refresh Token Reuse**: What happens if a leaked Refresh Token is used after it has already been rotated? The system MUST detect the reuse, invalidate the entire session family (all tokens for that session), and potentially alert the user.
- **Expired Refresh Token**: What happens when the Refresh Token itself expires? The user is redirected to the login page and must re-authenticate.
- **Network Interruption during Rotation**: If the connection drops after the server rotates the token but before the client receives it, the client will have an old token. The system should handle this gracefully (e.g., allowing a very brief window for the old refresh token or requiring re-login).
- **Database Failure**: If the database storing Refresh Tokens is unavailable, the system should fail securely, denying access until the service is restored.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST issue a pair of tokens (Access and Refresh) upon successful authentication (Local or OAuth).
- **FR-002**: Access Token MUST have a short lifespan (15-60 minutes).
- **FR-003**: Refresh Token MUST have a long lifespan (7-30 days).
- **FR-004**: System MUST implement Refresh Token Rotation: every time a Refresh Token is used to get a new Access Token, a new Refresh Token is also issued and the old one is invalidated.
- **FR-005**: System MUST provide a `/auth/refresh` endpoint that accepts a valid Refresh Token.
- **FR-006**: System MUST provide a `/auth/logout` endpoint that revokes the specific Refresh Token used in the request.
- **FR-007**: System MUST store Refresh Tokens in a PostgreSQL table (e.g., `user_sessions`) linked to the `user_id`.
- **FR-008**: System MUST support revoking all sessions for a specific user.
- **FR-009**: System MUST use HttpOnly, Secure, and SameSite=Strict cookies for storing the Refresh Token in the browser.
- **FR-010**: System MUST enforce HTTPS/TLS 1.3 for all token transmissions.
- **FR-011**: System MUST implement a sliding window inactivity timeout (e.g., 7 days) that extends upon each successful token refresh.
- **FR-012**: System MUST limit concurrent active sessions to 5 per user, automatically revoking the oldest session when the limit is exceeded.
- **FR-013**: System MUST perform weak session binding by validating that the User-Agent remains consistent across requests and monitoring for suspicious IP address changes.
- **FR-014**: System MUST implement a 60-second grace period for Refresh Token rotation to prevent accidental logouts due to network failures.

### Key Entities *(include if feature involves data)*

- **UserSession (New Entity)**: Represents an active session for a user.
    - `session_id` (UUID): Primary key.
    - `user_id`: Reference to `users.user_id`.
    - `refresh_token_hash`: Hashed version of the current Refresh Token.
    - `device_info`: Description of the device/browser used.
    - `ip_address`: Last used IP address.
    - `expires_at`: Expiration timestamp of the session (absolute).
    - `inactive_at`: Expiration timestamp based on inactivity (sliding window).
    - `created_at`: Time of initial login.
    - `last_active_at`: Time of last token refresh.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of successful token refreshes result in a new Access/Refresh token pair in under 500ms.
- **SC-002**: 0% of revoked or expired Refresh Tokens can be used to obtain a new Access Token.
- **SC-003**: 100% of logout requests successfully clear the session data on the server.
- **SC-004**: Session persistence works across browser restarts for users who select "Remember Me".

## Assumptions

- **JWT Library**: Assumes the project uses a standard JWT library for signing and verification.
- **Cookie Support**: Assumes target browsers support HttpOnly and Secure cookie flags.
- **Database Availability**: Assumes the PostgreSQL database is reliable for session storage.
- **Time Sync**: Assumes server times are synchronized to ensure correct token expiration checks.
