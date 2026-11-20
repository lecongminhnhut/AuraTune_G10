# UC-070-007 – Purge Expired History
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

## 1. Metadata
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

| Field | Value |
|---|---|
| Use Case ID | UC-070-007 |
| Use Case Name | Purge Expired History |
| Functional Group | 070 – Listening History |
| Primary Actor | System |
| Supporting Actors | None |
| Related FR IDs | `071-FR-012` |
| Related Feature ID | 071 |
| Related Spec Kit File | [specs/070-listening-history/071-listening-history/spec.md](../../../../specs/070-listening-history/071-listening-history/spec.md) |
| Writer | Lê Công Minh Nhựt |
| Original Writer (PA3 draft) | Mai Đăng Khoa |
| Reviewer | Group 10 team |
| Status | Draft |
| Last Updated | 2026-11-04 |

## 2. Goal
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

The system keeps listening history within the specified 365-day retention period.

## 3. Description
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

This background use case represents the automatic removal of history records older than 365 days. The feature requirements do not prescribe the job schedule or deletion mechanism.

## 4. Preconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

- Listening history records exist.
- The system can evaluate each record's age using its play timestamp.

## 5. Trigger
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

The system's retention process runs. Its schedule is not specified in the source requirements.

## 6. Basic Flow
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

1. **System:** Identifies listening history records with timestamps older than 365 days.
2. **System:** Purges the expired records.
3. **System:** Leaves records within the 365-day retention period available to their owners.

## 7. Alternative Flows
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

None identified.

## 8. Exception Flows
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### EX-01 – Retention Process Fails
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

- **Starting step:** 2
- **Condition:** The system cannot complete the purge.
1. **System:** Records or surfaces the failure according to the platform's operational monitoring policy.

- **Outcome:** Expired records remain until a later successful run; monitoring and retry policy require confirmation.

## 9. Postconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### 9.1 Success Postconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- Records older than 365 days are purged.
- Recent history remains available.

### 9.2 Failure Postconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt
- Unpurged expired records remain pending cleanup.

## 10. Special Requirements
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

- **Privacy:** Expired history must not be retained beyond the period specified by `071-FR-012`.

## 11. Business Rules
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

| Rule ID | Rule Description | Source |
|---|---|---|
| BR-070-07 | Retain only the most recent 365 days of listening history. | 071-FR-012 |

## 12. Prototype and Screenshots
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

No UI prototype applies to this background maintenance use case.

## 13. Related Use Cases
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

- UC-070-001 – Record Track Play Event
- UC-070-002 – View Listening History

## 14. Traceability and Sources
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

| Source Type | ID / File | Relevant Section |
|---|---|---|
| Functional Requirement | 071-FR-012 | 365-day history retention |
| Spec Kit Specification | specs/070-listening-history/071-listening-history/spec.md | Functional Requirements |

## 15. Open Questions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

| Question ID | Question | Owner | Status | Resolution |
|---|---|---|---|---|
| Q-071-02 | What runs the retention purge, how often, and how are failures monitored/retried? | Group Owner | Resolved | The source requirement fixes the 365-day retention outcome only. Scheduler, ownership, monitoring, and retry policy are operational design decisions outside this use case. |

## PA4 implementation evidence and acceptance record
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

`AppStore.jsx` records and clears browser-side history. Backend analysis readers exist, but the integrated history write/delete/retention path is not established. Clearing local state does not prove removal from database statistics or recommendation inputs. The history-recording threshold also needs alignment across source features.

The flows above state required behavior. This revision records source inspection only; no browser acceptance or new feature-test run is claimed. Before acceptance, execute the basic flow and its applicable alternative/exception flows, checking the documented success and failure postconditions. Record results against this UC ID in [the PA4 review register](../../use-case-model.md#11-pa4-decisions-and-source-review).
