# UC-070-003: Delete History Record
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

## 1. Metadata
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

| Field | Value |
| --- | --- |
| Use Case ID | UC-070-003 |
| Use Case Name | Delete History Record |
| Primary Actor | Listener |
| Related FR IDs | FR-070-003 (Vision); PA4-D04 |
| Status | Draft; pending team review |
| Writer | Lê Công Minh Nhựt |
| Reviewer | Group 10 team |
| Date | 2026-11-20 |

## 2. Goal and source
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Remove one selected entry from the listener's personal history. The owner confirmed retaining this Vision goal on 2026-11-20; it was absent from the current Feature 071 detail.

Source: [docs/proposal/Auratune_Vision_Document.md](../../../../docs/proposal/Auratune_Vision_Document.md). Feature-qualified IDs identify local FR numbers; Vision FR IDs keep their original namespace.

## 3. Preconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

- The listener is authenticated.
- The selected history entry belongs to the listener.

## 4. Trigger
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

The listener requests removal of a specific history entry.

## 5. Basic flow
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

1. Actor opens their own history and identifies one entry.
2. Actor requests removal of that entry.
3. System verifies the current authenticated owner and the target entry.
4. System completes the removal of the selected entry from the owner's history.
5. System refreshes the visible history and confirms the completed removal.

## 6. Alternative flows
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### AF-01: Other history remains
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

After Basic step 4, keep all other entries available in their existing order.

### AF-02: No entries remain
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

After Basic step 4, show the existing History empty state and navigation to Home.

## 7. Exception flows
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### EX-01: Session/ownership failure
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

At Basic step 3, deny unauthenticated or cross-account removal without exposing another user's entry.

### EX-02: Missing target or failed write
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

At Basic step 3 or 4, distinguish missing/unavailable target from a failed operation and avoid a false removal confirmation.

## 8. Postconditions
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Success: The selected entry no longer appears in the owner's history; unrelated history is unaffected.

Failure: No successful deletion is claimed for a denied or failed request.

## 9. Special requirements and business rules
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Required behavior follows the cited sources and recorded PA4 decisions. Success is shown only after the required operation succeeds. An empty result is distinct from a failed retrieval. Access checks apply at the service boundary when an API is involved; browser-only goals do not gain a new backend dependency. No new storage schema, endpoint, retry policy or audit service is selected by this draft.

## 10. Prototype evidence
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

No matching flow prototype was found. A prototype and review of the relevant states remain pending; no implementation screenshot is fabricated.

## 11. Open questions and implementation boundary
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Feature 071 and the API contract need a separately authorized alignment. Confirmation/cancel interaction, repeated deletion, hard versus soft deletion, and effects on aggregates/AI inputs for individual deletion remain undecided. The Clear All policy is not silently extended to this goal.

`AppStore.jsx` records and clears browser-side history. Backend analysis readers exist, but the integrated history write/delete/retention path is not established. Clearing local state does not prove removal from database statistics or recommendation inputs. The history-recording threshold also needs alignment across source features.

## 12. Acceptance checks
Performed by: Mai Đăng Khoa | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

- [ ] Execute the basic flow and verify its success postcondition.
- [ ] Execute the alternative and exception flows and verify their outcomes.
- [ ] Verify the actor/ownership boundary and inspect observable output for private data.
- [ ] Verify required persistence independently of browser-only state, where applicable.
- [ ] Review the prototype coverage and source decisions with the group owner.

Results are pending. This document is a specification draft, not a test execution report.
