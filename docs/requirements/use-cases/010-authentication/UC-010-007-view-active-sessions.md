# UC-010-007 – View Active Sessions

---

## 1. Metadata

| Field | Value |
|---|---|
| **Use Case ID** | UC-010-007 |
| **Use Case Name** | View Active Sessions |
| **Functional Group** | 010 – Authentication |
| **Primary Actor** | Listener |
| **Supporting Actors** | None |
| **Related FR IDs** | `FR-013-007` |
| **Related Feature ID** | 013 |
| **Related Spec Kit File** | [`specs/010-authentication/013-session-management/spec.md`](../../../specs/010-authentication/013-session-management/spec.md) |
| **Writer** | Mai Đăng Khoa |
| **Reviewer** | TBD |
| **Status** | In Review |
| **Last Updated** | 2026-11-03 |

---

## 2. Goal
The goal is to allow a user to monitor all devices, browsers, and approximate locations currently accessing their account to ensure no unauthorized activity is occurring.

## 3. Description
This use case describes how an authenticated user retrieves a list of their active login sessions. The system queries the session tracking table and presents details such as device type, IP address, and last activity timestamp to the user.

---

## 4. Preconditions
- The Listener is authenticated with an active session.
- The platform database contains active session records for the user.

---

## 5. Trigger
The Listener navigates to the "Active Sessions" or "Security" section within their account settings.

---

## 6. Basic Flow

1. **Actor:** Opens the Account Settings page.
2. **Actor:** Clicks on the "Active Sessions" or "Security" tab.
3. **System:** Verifies the user's current session and identity.
4. **System:** Queries the `user_sessions` table for all records matching the `user_id` (`FR-013-007`).
5. **System:** Formats the raw session data into a human-readable list (e.g., "Chrome on MacOS", "AuraTune Android App").
6. **System:** Displays the list, highlighting the "Current Session" (the device being used).
7. **Actor:** Reviews the list of devices and activity.

---

## 7. Alternative Flows

### AF-01 – No Other Active Sessions
- **Starting step:** 4
- **Condition:** Only one active session exists (the current one).
1. **System:** Displays the list containing only the current device with the label "This device".
- **Outcome:** Use Case ends successfully.

---

## 8. Exception Flow

### EF-01 – Session Data Load Failure
- **Starting step:** 4
- **Condition:** Database query fails or service is timed out.
1. **System:** Displays an error notification: "Không thể tải danh sách phiên làm việc. Vui lòng thử lại sau."
- **Outcome:** Use Case ends in failure.

---

## 9. Postconditions

### 9.1 Success Postconditions
- The user has viewed an accurate list of devices currently accessing their account.

### 9.2 Failure Postconditions
- The user is unable to verify their active login sessions.

---

## 10. Special Requirements
- **Privacy:** Full IP addresses SHOULD be partially masked (e.g., `192.168.x.x`) for security unless specific detail is requested.
- **Performance:** The session list SHOULD load within 1 second.

---

## 11. Business Rules

| Rule ID | Rule Description | Source |
|---|---|---|
| BR-01 | A maximum of 5 concurrent sessions are allowed per account. | FR-013-012 |
| BR-02 | Sessions are bound to the User-Agent to detect suspicious changes. | FR-013-013 |

---

## 12. Prototype and Screenshots
*Note: The session list follows standard AuraTune table/list layouts for security settings.*

---

## 12. Traceability and Sources
- `specs/010-authentication/013-session-management/spec.md` – User Story 3 (P2).
