# UC-010-003 – Recover Password

---

## 1. Metadata

| Field | Value |
|---|---|
| **Use Case ID** | UC-010-003 |
| **Use Case Name** | Recover Password |
| **Functional Group** | 010 – Authentication |
| **Primary Actor** | Visitor |
| **Supporting Actors** | None |
| **Related FR IDs** | `FR-011-011` |
| **Related Feature ID** | 011 |
| **Related Spec Kit File** | [`specs/010-authentication/011-local-authentication/spec.md`](../../../specs/010-authentication/011-local-authentication/spec.md) |
| **Writer** | Mai Đăng Khoa |
| **Reviewer** | TBD |
| **Status** | In Review |
| **Last Updated** | 2026-11-03 |

---

## 2. Goal
The goal is to allow a user who has forgotten their password to securely regain access to their account by resetting it via their registered email, ensuring account continuity.

## 3. Description
This use case describes the self-service process of requesting a password reset. The system generates a secure, time-limited token and sends it to the user's email. Upon verification of the token, the user provides a new password which the system validates and updates, while terminating all existing sessions to ensure account security.

---

## 4. Preconditions
- The Visitor has a registered account.
- The platform's email delivery service is operational.

---

## 5. Trigger
The Visitor selects the "Forgot Password" link on the login page.

---

## 6. Basic Flow

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

### AF-01 – Unregistered Email
- **Starting step:** 3
- **Condition:** The entered email address is not found in the database.
1. **System:** Displays the same generic confirmation message as in the Basic Flow (Step 5) to prevent email enumeration.
2. **System:** Does not generate or send any email.
- **Outcome:** Use Case ends successfully (privacy preserved).

### AF-02 – Invalid or Expired Token
- **Starting step:** 7
- **Condition:** The reset link is clicked after expiration or the token has already been used.
1. **System:** Displays an error message: "The password reset link is invalid or has expired."
2. **Actor:** Returns to the Forgot Password page to request a new link.
- **Outcome:** Resume at Step 1.

---

## 8. Exception Flow

### EF-01 – Email Service Failure
- **Starting step:** 4
- **Condition:** The external email provider returns an error.
1. **System:** Logs the error and displays a message: "We are currently experiencing issues sending emails. Please try again later."
- **Outcome:** Use Case ends in failure.

---

## 9. Postconditions

### 9.1 Success Postconditions
- The user's password hash is updated.
- All prior sessions (Access/Refresh tokens) are invalidated.
- The user can log in with the new credentials.

### 9.2 Failure Postconditions
- The account remains secured with the old password.
- No sensitive account information is leaked during the process.

---

## 10. Special Requirements
- **Security:** Reset tokens MUST be short-lived (e.g., 30 minutes) and one-time use only.
- **Privacy:** System responses MUST NOT disclose the existence of an account by email.

---

## 11. Prototype and Screenshots
*Note: UI for password recovery follows standard AuraTune input and confirmation patterns.*

---

## 12. Traceability and Sources
- `specs/010-authentication/011-local-authentication/spec.md` – User Story 4 (P2).
