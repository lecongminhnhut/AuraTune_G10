# UC-010-006 – Logout
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

---

## 1. Metadata
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

| Field | Value |
|---|---|
| **Use Case ID** | UC-010-006 |
| **Use Case Name** | Logout |
| **Functional Group** | 010 – Authentication |
| **Primary Actor** | Listener |
| **Supporting Actors** | None |
| **Related FR IDs** | `FR-013-006`, `FR-013-009` |
| **Related Feature ID** | 013 |
| **Related Spec Kit File** | [`specs/010-authentication/013-session-management/spec.md`](../../../../specs/010-authentication/013-session-management/spec.md) |
| Writer | Lê Công Minh Nhựt |
| Original Writer (PA3 draft) | Mai Đăng Khoa |
| Reviewer | Group 10 team |
| **Status** | In Review |
| **Last Updated** | 2026-11-03 |

---

## 2. Goal
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
The goal is to securely terminate the current authenticated session to protect the user's personal data and library access, preventing unauthorized use on shared or public devices.

## 3. Description
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
This use case describes the manual logout process. The system revokes the active Refresh Token on the server-side database and instructs the browser to clear the secure HttpOnly cookie, effectively ending the user's authenticated state for the specific device.

---

## 4. Preconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- The Listener is currently authenticated with an active session.
- The server database is reachable to revoke the token.

---

## 5. Trigger
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
The Listener selects the "Logout" (Đăng xuất) action from the user account dropdown menu.

---

## 6. Basic Flow
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

1. **Actor:** Opens the user account menu by clicking on their avatar.
2. **System:** Displays the account menu with personal options and the "Logout" button (`FR-013-003`).
3. **Actor:** Clicks the "Logout" button.
4. **System:** Dispatches a revocation request to the `/auth/logout` endpoint (`FR-013-006`).
5. **System:** Locates the specific Refresh Token entry in the `user_sessions` table and removes it.
6. **System:** Responds with a command to clear the HttpOnly Refresh Token cookie in the browser (`FR-013-009`).
7. **System:** Invalidates the in-memory Access Token and redirects the user to the login page.
8. **System:** Displays a confirmation toast: "Bạn đã đăng xuất thành công."

---

## 7. Alternative Flows
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

None identified for the manual logout sequence.

---

## 8. Exception Flow
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### EF-01 – Logout Request Timeout
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Starting step:** 4
- **Condition:** The server fails to respond to the logout request within 5 seconds.
1. **System:** Forcefully clears local session storage and cookies to protect the user immediately.
2. **System:** Redirects the user to the login page.
- **Outcome:** Use Case ends successfully from the user's perspective, though the server-side revocation may be delayed.

---

## 9. Postconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### 9.1 Success Postconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- The specific Refresh Token is invalidated on the server.
- The user is redirected to a public route and can no longer access protected data.
- The session cookie is removed from the browser.

### 9.2 Failure Postconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- The session remains active (if the browser fails to clear cookies and the server request failed).

---

## 10. Special Requirements
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Security:** Logout MUST be robust against network failures (client-side cleanup is priority).
- **Usability:** The logout action MUST be easily accessible from any page via the navigation bar.

---

## 11. Prototype and Screenshots
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### 11.1 Basic Flow (User Menu)
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
![User Menu](../../../../specs/010-authentication/013-session-management/ui/03-user-account-session-menu.png)
*Figure 1: User account menu featuring the manual logout command.*

### 11.2 Basic Flow (Confirmation)
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
![Logout Feedback](../../../../specs/010-authentication/013-session-management/ui/05-logout-action-feedback.png)
*Figure 2: UI state following successful logout.*

---

## 12. Traceability and Sources
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- `specs/010-authentication/013-session-management/spec.md` – User Story 2 (P1).

## PA4 implementation evidence and acceptance record
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Authentication routes and repositories exist in `src/backend/routes/authRoutes.js` and `src/backend/repositories/authRepository.js`. Firebase exchange is also present. Validate the actual login/recovery/session route and authoritative account state; frontend navigation alone is insufficient. The integrated backend entrypoint currently has a duplicate import. Automatic refresh is supporting session behavior, not a replacement for the existing View Active Sessions goal.

The flows above state required behavior. This revision records source inspection only; no browser acceptance or new feature-test run is claimed. Before acceptance, execute the basic flow and its applicable alternative/exception flows, checking the documented success and failure postconditions. Record results against this UC ID in [the PA4 review register](../../use-case-model.md#11-pa4-decisions-and-source-review).
