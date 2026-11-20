# UC-010-008 – Logout from All Devices
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

---

## 1. Metadata
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

| Field | Value |
|---|---|
| **Use Case ID** | UC-010-008 |
| **Use Case Name** | Logout from All Devices |
| **Functional Group** | 010 – Authentication |
| **Primary Actor** | Listener |
| **Supporting Actors** | None |
| **Related FR IDs** | `FR-013-008` |
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
The goal is to provide a "panic button" security feature that allows a user to immediately invalidate all active sessions across all devices, securing the account after a suspected breach or lost device.

## 3. Description
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
This use case describes the global revocation process. Upon user confirmation, the system deletes all Refresh Token entries for the user from the database. Any subsequent request from any device (including the current one) will require a fresh login.

---

## 4. Preconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- The Listener is authenticated.
- The server database is reachable for batch revocation.

---

## 5. Trigger
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
The Listener clicks the "Logout from all devices" (Đăng xuất khỏi tất cả thiết bị) button in their security settings.

---

## 6. Basic Flow
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

1. **Actor:** Navigates to Account Security settings.
2. **Actor:** Clicks the "Logout from all devices" button.
3. **System:** Displays a confirmation dialog warning that this action will end all current sessions.
4. **Actor:** Confirms the action.
5. **System:** Dispatches a global revocation request (`FR-013-008`).
6. **System:** Deletes all records in the `user_sessions` table matching the `user_id`.
7. **System:** Clears the HttpOnly session cookie on the current device.
8. **System:** Redirects the user to the login page and displays a success notification.

---

## 7. Alternative Flows
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### AF-01 – User Cancels Global Logout
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Starting step:** 4
- **Condition:** The user clicks "Cancel" in the confirmation dialog.
1. **System:** Closes the dialog and returns the user to their previous view.
- **Outcome:** Use Case ends successfully (no changes made).

---

## 8. Exception Flow
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### EF-01 – Batch Revocation Failure
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Starting step:** 6
- **Condition:** The database fails to process the batch delete operation.
1. **System:** Displays an error message: "Không thể đăng xuất khỏi tất cả thiết bị lúc này. Vui lòng thử lại."
- **Outcome:** Use Case ends in failure.

---

## 9. Postconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### 9.1 Success Postconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- Zero active Refresh Tokens remain for the user in the database.
- Every device previously logged in is now unauthenticated.
- The current user is redirected to the login page.

### 9.2 Failure Postconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- Active sessions persist on other devices.

---

## 10. Special Requirements
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Security:** Global revocation MUST be immediate and atomic.
- **Usability:** A clear warning of the consequences (immediate logout everywhere) is MANDATORY.

---

## 11. Business Rules
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

| Rule ID | Rule Description | Source |
|---|---|---|
| BR-01 | Global revocation invalidates the entire session family for the user. | Spec 013 |

---

## 12. Traceability and Sources
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- `specs/010-authentication/013-session-management/spec.md` – User Story 3 (P2).

## PA4 implementation evidence and acceptance record
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Authentication routes and repositories exist in `src/backend/routes/authRoutes.js` and `src/backend/repositories/authRepository.js`. Firebase exchange is also present. Validate the actual login/recovery/session route and authoritative account state; frontend navigation alone is insufficient. The integrated backend entrypoint currently has a duplicate import. Automatic refresh is supporting session behavior, not a replacement for the existing View Active Sessions goal.

The flows above state required behavior. This revision records source inspection only; no browser acceptance or new feature-test run is claimed. Before acceptance, execute the basic flow and its applicable alternative/exception flows, checking the documented success and failure postconditions. Record results against this UC ID in [the PA4 review register](../../use-case-model.md#11-pa4-decisions-and-source-review).
