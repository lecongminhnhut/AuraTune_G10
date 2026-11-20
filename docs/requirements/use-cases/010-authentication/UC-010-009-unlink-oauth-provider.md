# UC-010-009 – Unlink OAuth Provider
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

---

## 1. Metadata
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

| Field | Value |
|---|---|
| **Use Case ID** | UC-010-009 |
| **Use Case Name** | Unlink OAuth Provider |
| **Functional Group** | 010 – Authentication |
| **Primary Actor** | Listener |
| **Supporting Actors** | None |
| **Related FR IDs** | `FR-012-011` |
| **Related Feature ID** | 012 |
| **Related Spec Kit File** | [`specs/010-authentication/012-oauth-authentication/spec.md`](../../../../specs/010-authentication/012-oauth-authentication/spec.md) |
| Writer | Lê Công Minh Nhựt |
| Original Writer (PA3 draft) | Mai Đăng Khoa |
| Reviewer | Group 10 team |
| **Status** | In Review |
| **Last Updated** | 2026-11-03 |

---

## 2. Goal
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
The goal is to allow a user to manage their privacy and linked identities by disconnecting a social login method (Google or Facebook) from their AuraTune account while ensuring they still have a way to access their profile.

## 3. Description
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
This use case describes how a user removes a third-party connection. The system enforces a safety rule: a user cannot unlink a provider if it is their only remaining login method, preventing permanent account lockout.

---

## 4. Preconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- The Listener is authenticated.
- The account has at least one OAuth provider linked.

---

## 5. Trigger
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
The Listener selects "Unlink" or "Disconnect" for a social provider in their account settings.

---

## 6. Basic Flow
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

1. **Actor:** Navigates to the "Connected Accounts" section in settings.
2. **System:** Displays the list of linked methods (Local Password, Google, Facebook).
3. **Actor:** Clicks "Unlink" for a specific social provider (e.g., Google).
4. **System:** Verifies that the user has at least one other authentication method remains (e.g., a password or another social link) (`FR-012-011`).
5. **System:** Displays a confirmation dialog.
6. **Actor:** Confirms the unlinking.
7. **System:** Deletes the specific record from the `oauth_links` table.
8. **System:** Updates the UI and displays a success notification: "Đã hủy liên kết tài khoản."

---

## 7. Alternative Flows
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### AF-01 – Only One Method Remaining
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Starting step:** 4
- **Condition:** The provider being unlinked is the ONLY way the user can log in.
1. **System:** Blocks the unlinking action.
2. **System:** Displays an error: "Bạn không thể hủy liên kết phương thức đăng nhập duy nhất. Vui lòng thiết lập mật khẩu hoặc liên kết tài khoản khác trước."
3. **System:** Provides a shortcut to "Set Password".
- **Outcome:** Use Case ends in failure.

---

## 8. Exception Flow
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### EF-01 – Database Deletion Failure
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Starting step:** 7
- **Condition:** The link removal fails due to a database error.
1. **System:** Displays an error message and retains the current link state.
- **Outcome:** Use Case ends in failure.

---

## 9. Postconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### 9.1 Success Postconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- The OAuth mapping record is removed.
- The user can no longer log in via that specific social account.

### 9.2 Failure Postconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- The account remains linked.

---

## 10. Special Requirements
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Usability:** Messaging MUST be clear about why unlinking is blocked to avoid user frustration.

---

## 11. Business Rules
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

| Rule ID | Rule Description | Source |
|---|---|---|
| BR-01 | Users must maintain at least one valid authentication method at all times. | FR-012-011 |

---

## 12. Traceability and Sources
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- `specs/010-authentication/012-oauth-authentication/spec.md` – User Story 4 (P3).

## PA4 implementation evidence and acceptance record
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Authentication routes and repositories exist in `src/backend/routes/authRoutes.js` and `src/backend/repositories/authRepository.js`. Firebase exchange is also present. Validate the actual login/recovery/session route and authoritative account state; frontend navigation alone is insufficient. The integrated backend entrypoint currently has a duplicate import. Automatic refresh is supporting session behavior, not a replacement for the existing View Active Sessions goal.

The flows above state required behavior. This revision records source inspection only; no browser acceptance or new feature-test run is claimed. Before acceptance, execute the basic flow and its applicable alternative/exception flows, checking the documented success and failure postconditions. Record results against this UC ID in [the PA4 review register](../../use-case-model.md#11-pa4-decisions-and-source-review).
