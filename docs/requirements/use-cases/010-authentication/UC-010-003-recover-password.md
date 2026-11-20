# UC-010-003 – Recover Password
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

---

## 1. Metadata
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

| Field | Value |
|---|---|
| **Use Case ID** | UC-010-003 |
| **Use Case Name** | Recover Password |
| **Functional Group** | 010 – Authentication |
| **Primary Actor** | Visitor |
| **Supporting Actors** | None |
| **Related FR IDs** | `FR-011-011` |
| **Related Feature ID** | 011 |
| **Related Spec Kit File** | [`specs/010-authentication/011-local-authentication/spec.md`](../../../../specs/010-authentication/011-local-authentication/spec.md) |
| Writer | Lê Công Minh Nhựt |
| Original Writer (PA3 draft) | Mai Đăng Khoa |
| Reviewer | Group 10 team |
| **Status** | In Review |
| **Last Updated** | 2026-11-03 |

---

## 2. Goal
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
The goal is to allow a user who has forgotten their password to securely regain access to their account by resetting it via their registered email, ensuring account continuity.

## 3. Description
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
This use case describes the self-service process of requesting a password reset. The system generates a secure, time-limited token and sends it to the user's email. Upon verification of the token, the user provides a new password which the system validates and updates, while terminating all existing sessions to ensure account security.

---

## 4. Preconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- The Visitor has a registered account.
- The platform's email delivery service is operational.

---

## 5. Trigger
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
The Visitor selects the "Forgot Password" link on the login page.

---

## 6. Basic Flow
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

1. **Actor:** Enters their registered email address into the recovery form.
2. **Actor:** Submits the recovery request.
3. **System:** Generates a temporary, secure password reset token linked to the account.
4. **System:** Dispatches an email containing the reset link or code to the provided address (`FR-011-011`).
5. **System:** Displays a confirmation message stating that if the email is registered, a reset link has been sent.
6. **Actor:** Opens the email and clicks the reset link.
7. **System:** Verifies the token and displays the "Set New Password" form.
8. **Actor:** Enters a new password meeting complexity requirements and confirms it.
9. **System:** Validates the new password against complexity rules (`FR-011-003`).
10. **System:** Updates the password hash in the PostgreSQL database and invalidates all active sessions for the account.
11. **System:** Redirects the user to the login page with a success message.

---

## 7. Alternative Flows
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### AF-01 – Unregistered Email
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Starting step:** 3
- **Condition:** The entered email address is not found in the database.
1. **System:** Displays the same generic confirmation message as in the Basic Flow (Step 5) to prevent email enumeration.
2. **System:** Does not generate or send any email.
- **Outcome:** Use Case ends successfully (privacy preserved).

### AF-02 – Invalid or Expired Token
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Starting step:** 7
- **Condition:** The reset link is clicked after expiration or the token has already been used.
1. **System:** Displays an error message: "The password reset link is invalid or has expired."
2. **Actor:** Returns to the Forgot Password page to request a new link.
- **Outcome:** Resume at Step 1.

---

## 8. Exception Flow
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### EF-01 – Email Service Failure
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Starting step:** 4
- **Condition:** The external email provider returns an error.
1. **System:** Logs the error and displays a message: "We are currently experiencing issues sending emails. Please try again later."
- **Outcome:** Use Case ends in failure.

---

## 9. Postconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### 9.1 Success Postconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- The user's password hash is updated.
- All prior sessions (Access/Refresh tokens) are invalidated.
- The user can log in with the new credentials.

### 9.2 Failure Postconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- The account remains secured with the old password.
- No sensitive account information is leaked during the process.

---

## 10. Special Requirements
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Security:** Reset tokens MUST be short-lived (e.g., 30 minutes) and one-time use only.
- **Privacy:** System responses MUST NOT disclose the existence of an account by email.

---

## 11. Prototype and Screenshots
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
*Note: UI for password recovery follows standard AuraTune input and confirmation patterns.*

---

## 12. Traceability and Sources
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- `specs/010-authentication/011-local-authentication/spec.md` – User Story 4 (P2).

## PA4 implementation evidence and acceptance record
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Authentication routes and repositories exist in `src/backend/routes/authRoutes.js` and `src/backend/repositories/authRepository.js`. Firebase exchange is also present. Validate the actual login/recovery/session route and authoritative account state; frontend navigation alone is insufficient. The integrated backend entrypoint currently has a duplicate import. Automatic refresh is supporting session behavior, not a replacement for the existing View Active Sessions goal.

The flows above state required behavior. This revision records source inspection only; no browser acceptance or new feature-test run is claimed. Before acceptance, execute the basic flow and its applicable alternative/exception flows, checking the documented success and failure postconditions. Record results against this UC ID in [the PA4 review register](../../use-case-model.md#11-pa4-decisions-and-source-review).
