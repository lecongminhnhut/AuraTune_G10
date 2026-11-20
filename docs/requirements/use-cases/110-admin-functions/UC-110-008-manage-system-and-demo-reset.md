# UC-110-008: Manage System Availability and Demo Reset
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

## 1. Metadata
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

| Field | Value |
| --- | --- |
| Use Case ID | UC-110-008 |
| Use Case Name | Manage System Availability and Demo Reset |
| Primary Actor | Administrator |
| Related FR IDs | FR-110-008; Vision goal beyond the read-only 113 scope |
| Status | Draft; pending team review |
| Writer | Lê Công Minh Nhựt |
| Reviewer | Group 10 team |
| Date | 2026-11-20 |

## 2. Goal and source
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Specify the Vision goal for an AI availability toggle and demo reset without treating it as part of read-only statistics.

Source: [docs/proposal/Auratune_Vision_Document.md](../../../../docs/proposal/Auratune_Vision_Document.md). Feature-qualified IDs identify local FR numbers; Vision FR IDs keep their original namespace.

## 3. Preconditions
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

- The acting account has a valid, non-banned Administrator session.
- The requested operation is within the acting account's authorized scope.

## 4. Trigger
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

The admin requests an AI setting change or demo reset.

## 5. Basic flow
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

1. Actor opens the authorized system/demo controls.
2. System verifies current admin authority.
3. Actor selects the intended AI availability setting.
4. System applies the authorized setting within its defined scope.
5. System reports the completed setting change.

## 6. Alternative flows
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### AF-01: Demo reset
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Instead of Basic step 3, the actor requests reset of the designated demo dataset. The system must use an approved reset scope and confirmation/recovery design before this branch can be accepted. No reset of production or unrelated data is authorized by this draft.

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

Success: Only an operation with a separately approved scope can reach success; unrelated data remains outside the authorized action.

Failure: No denied or failed operation is presented as successful. No unauthorized data is disclosed.

## 9. Special requirements and business rules
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Required behavior follows the cited sources and recorded PA4 decisions. Success is shown only after the required operation succeeds. An empty result is distinct from a failed retrieval. Access checks apply at the service boundary when an API is involved; browser-only goals do not gain a new backend dependency. No new storage schema, endpoint, retry policy or audit service is selected by this draft.

## 10. Prototype evidence
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

No matching flow prototype was found. A prototype and review of the relevant states remain pending; no implementation screenshot is fabricated.

## 11. Open questions and implementation boundary
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Feature 113 is read-only and excludes this goal. Reset dataset, confirmation, persistence/rollback and AI-toggle scope are unapproved. No destructive operation was performed.

`src/frontend/src/pages/Admin/AdminPage.jsx` and AppStore provide browser-state administration. No Admin API module is mounted in the current backend entrypoint. UI role checks, toasts and local state updates do not establish server authorization, audit persistence, session enforcement or authoritative aggregates.

## 12. Acceptance checks
Performed by: Thái Hoàng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

- [ ] Execute the basic flow and verify its success postcondition.
- [ ] Execute the alternative and exception flows and verify their outcomes.
- [ ] Verify the actor/ownership boundary and inspect observable output for private data.
- [ ] Verify required persistence independently of browser-only state, where applicable.
- [ ] Review the prototype coverage and source decisions with the group owner.

Results are pending. This document is a specification draft, not a test execution report.
