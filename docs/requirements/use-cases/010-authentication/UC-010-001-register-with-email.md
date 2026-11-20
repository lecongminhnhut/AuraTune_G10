# UC-010-001 – Register with Email
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

---

## 1. Metadata
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

| Field | Value |
|---|---|
| **Use Case ID** | UC-010-001 |
| **Use Case Name** | Register with Email |
| **Functional Group** | 010 – Authentication |
| **Primary Actor** | Visitor |
| **Supporting Actors** | None |
| **Related FR IDs** | `FR-011-001`, `FR-011-002`, `FR-011-003`, `FR-011-010` |
| **Related Feature ID** | 011 |
| **Related Spec Kit File** | [`specs/010-authentication/011-local-authentication/spec.md`](../../../../specs/010-authentication/011-local-authentication/spec.md) |
| Writer | Lê Công Minh Nhựt |
| Original Writer (PA3 draft) | Roo |
| Reviewer | Group 10 team |
| Original Reviewer (PA3 draft) | Mai Đăng Khoa |
| **Status** | In Review |
| **Last Updated** | 2026-11-03 |

---

## 2. Goal
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
The goal is to create a new AuraTune account using a unique email address and a secure password to access personalized features and save playback activity.

## 3. Description
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
This use case allows a Visitor to register an account. The system validates the email format, password strength, and ensures the email is not already in use. Upon successful registration, a new user record is created with the default 'user' role and the user is granted immediate access.

---

## 4. Preconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- The Visitor can access the registration interface.
- The platform database is reachable.

---

## 5. Trigger
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
The Visitor selects the "Sign up" or "Register" action on the authentication landing page.

---

## 6. Basic Flow
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

1. **Actor:** Opens the registration page.
2. **System:** Displays the registration form including fields for Display Name, Email, Password, and the TOS consent checkbox.
3. **Actor:** Enters a unique email, a password meeting complexity rules, and a non-unique display name (`FR-011-001`).
4. **Actor:** Checks the box to explicitly accept the Terms of Service and Privacy Policy (`FR-011-010`).
5. **Actor:** Submits the registration form.
6. **System:** Validates that the email address follows a standard format (`FR-011-002`).
7. **System:** Validates that the password meets complexity requirements (minimum 8 characters, combination of letters and numbers) (`FR-011-003`).
8. **System:** Ensures the email is unique in the PostgreSQL database.
9. **System:** Securely hashes the password (`FR-011-006`) and creates a new record in the `users` table with the default 'user' role (`FR-011-005`).
10. **System:** Issues a JWT access token and refresh token, then redirects the user to the authenticated home page (`FR-011-008`, `FR-011-009`).

---

## 7. Alternative Flows
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### AF-01 – Email Already in Use
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Starting step:** 8
- **Condition:** The submitted email already exists in the database.
1. **System:** Displays a specific error message: "Email đã được sử dụng."
2. **Actor:** Corrects the email or navigates to the login page if they already have an account.
- **Outcome:** Resume at Step 3.

### AF-02 – Incomplete or Invalid Input
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Starting step:** 6
- **Condition:** Fields are empty, email format is invalid, or password is weak.
1. **System:** Identifies the invalid fields and displays relevant validation messages.
2. **Actor:** Corrects the information.
- **Outcome:** Resume at Step 3.

### AF-03 – TOS/Privacy Policy Not Accepted
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Starting step:** 5
- **Condition:** The user submits without checking the consent box.
1. **System:** Prevents submission and highlights the mandatory consent requirement.
2. **Actor:** Checks the consent box.
- **Outcome:** Resume at Step 5.

---

## 8. Exception Flow
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### EF-01 – Database Connection Failure
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Starting step:** 8
- **Condition:** The system cannot connect to the PostgreSQL database.
1. **System:** Displays a generic error message: "Service temporarily unavailable. Please try again later."
- **Outcome:** Use Case ends in failure.

---

## 9. Postconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### 9.1 Success Postconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- A new record exists in the `users` table with a unique email and hashed password.
- The user is logged into the application and redirected to the dashboard.

### 9.2 Failure Postconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- No account is created.
- System integrity and user privacy boundaries remain intact.

---

## 10. Special Requirements
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- **Security:** Passwords MUST be securely hashed before storage.
- **Privacy:** Compliance with Vietnamese Decree 13/2023/ND-CP regarding data consent.
- **Performance:** Registration processing SHOULD complete in under 2 seconds.

---

## 11. Prototype and Screenshots
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### 11.1 Basic Flow
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
![Registration Form Filled](../../../../specs/010-authentication/011-local-authentication/ui/02-registration-form-filled.png)
*Figure 1: Registration form with valid input and password complexity indicators.*

### 11.2 Alternative Flow – AF-02
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
![Validation Errors](../../../../specs/010-authentication/011-local-authentication/ui/04-registration-validation-errors.png)
*Figure 2: Form state when invalid or incomplete data is submitted.*

---

## 12. Traceability and Sources
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- `specs/010-authentication/011-local-authentication/spec.md` – User Story 1 (P1).
- `docs/proposal/Auratune_Vision_Document.md` – Section 3.2.

## PA4 implementation evidence and acceptance record
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Authentication routes and repositories exist in `src/backend/routes/authRoutes.js` and `src/backend/repositories/authRepository.js`. Firebase exchange is also present. Validate the actual login/recovery/session route and authoritative account state; frontend navigation alone is insufficient. The integrated backend entrypoint currently has a duplicate import. Automatic refresh is supporting session behavior, not a replacement for the existing View Active Sessions goal.

The flows above state required behavior. This revision records source inspection only; no browser acceptance or new feature-test run is claimed. Before acceptance, execute the basic flow and its applicable alternative/exception flows, checking the documented success and failure postconditions. Record results against this UC ID in [the PA4 review register](../../use-case-model.md#11-pa4-decisions-and-source-review).
