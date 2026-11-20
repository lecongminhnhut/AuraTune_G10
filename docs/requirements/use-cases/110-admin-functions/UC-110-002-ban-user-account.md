# UC-110-002: Ban User Account
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

## 1. Metadata
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

| Field | Value |
| --- | --- |
| Use Case ID | UC-110-002 |
| Use Case Name | Ban User Account |
| Primary Actor | Administrator |
| Related FR IDs | 111-FR-005, 007..013, 015..017, 020, 023; FR-110-002 |
| Status | Draft; pending team review |
| Writer | Lê Công Minh Nhựt |
| Reviewer | Group 10 team |
| Date | 2026-11-20 |

## 2. Goal and source
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Block a non-admin account through the newer direct-action policy selected by the owner (PA4-D06).

Source: [specs/110-admin-functions/111-user-management/spec.md](../../../../specs/110-admin-functions/111-user-management/spec.md). Feature-qualified IDs identify local FR numbers; Vision FR IDs keep their original namespace.

## 3. Preconditions
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

- The acting account has a valid, non-banned Administrator session.
- The requested operation is within the acting account's authorized scope.

## 4. Trigger
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

The admin selects Ban for a non-admin account.

## 5. Basic flow
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

1. Actor selects Ban on the intended non-admin account.
2. System checks current admin authority and rejects self/admin-target bans.
3. System records a supplied reason or the newer default reason "Vi phạm tiêu chuẩn cộng đồng" when a custom reason is absent.
4. System commits the persistent ban state and required reason.
5. System blocks new login and subsequent protected requests for the banned account; public access remains separate.
6. System updates the account state and shows a success toast only after success.

## 6. Alternative flows
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### AF-01: Already banned
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

At Basic step 4, report an idempotent/no-op result without overwriting the saved reason.

### AF-02: Invalid supplied data
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Reject malformed fields before mutation; the default applies to an absent custom reason under PA4-D06.

## 7. Exception flows
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### EX-01: Invalid or unauthorized session
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

At Basic step 2, reject a missing, expired, banned or non-admin session. Disclose no management data and perform no mutation. Re-authentication does not authorize a non-admin role.

### EX-02: Service or persistence failure
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

At the retrieval or commit step, show a failure state and a permitted manual retry. Do not display success or fabricate data from a failed response; reconcile uncertain writes before claiming an outcome.

### EX-03: Missing or malformed target
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Reject a missing target or invalid input at validation without fabricating a successful operation. For a read-only overview, metric unavailability follows its own partial-data flow.

## 8. Postconditions
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Success: The account remains banned until an explicit authorized unban. The successful reason is recorded.

Failure: No denied or failed operation is presented as successful. No unauthorized data is disclosed.

## 9. Special requirements and business rules
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Required behavior follows the cited sources and recorded PA4 decisions. Success is shown only after the required operation succeeds. An empty result is distinct from a failed retrieval. Access checks apply at the service boundary when an API is involved; browser-only goals do not gain a new backend dependency. No new storage schema, endpoint, retry policy or audit service is selected by this draft.

## 10. Prototype evidence
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

![Source UI reference](../../../../specs/110-admin-functions/111-user-management/ui/04-ban-user.png)

Source UI reference only. It is not evidence that backend permission, persistence or every error state passes acceptance.

## 11. Open questions and implementation boundary
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

PA4-D06 selects newer FR-023/default-reason behavior over the older mandatory custom-reason prompt. Source spec and Vision alignment remain separately tracked.

`src/frontend/src/pages/Admin/AdminPage.jsx` and AppStore provide browser-state administration. No Admin API module is mounted in the current backend entrypoint. UI role checks, toasts and local state updates do not establish server authorization, audit persistence, session enforcement or authoritative aggregates.

## 12. Acceptance checks
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

- [ ] Execute the basic flow and verify its success postcondition.
- [ ] Execute the alternative and exception flows and verify their outcomes.
- [ ] Verify the actor/ownership boundary and inspect observable output for private data.
- [ ] Verify required persistence independently of browser-only state, where applicable.
- [ ] Review the prototype coverage and source decisions with the group owner.

Results are pending. This document is a specification draft, not a test execution report.
