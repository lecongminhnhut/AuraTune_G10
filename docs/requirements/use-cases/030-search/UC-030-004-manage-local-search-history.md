# UC-030-004: Manage Local Search History
Performed by: Nguyễn Khánh Đăng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

## 1. Metadata
Performed by: Nguyễn Khánh Đăng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

| Field | Value |
| --- | --- |
| Use Case ID | UC-030-004 |
| Use Case Name | Manage Local Search History |
| Primary Actor | Guest / Listener |
| Related FR IDs | 031-FR-019; FR-030-004 |
| Status | Draft; pending team review |
| Writer | Lê Công Minh Nhựt |
| Reviewer | Group 10 team |
| Date | 2026-11-20 |

## 2. Goal and source
Performed by: Nguyễn Khánh Đăng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Reuse or remove recent queries stored in this browser. This is browser-local query history, separate from account listening history.

Source: [specs/030-search/031-metadata-search/spec.md](../../../../specs/030-search/031-metadata-search/spec.md). Feature-qualified IDs identify local FR numbers; Vision FR IDs keep their original namespace.

## 3. Preconditions
Performed by: Nguyễn Khánh Đăng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

- The Search interface is open.
- Recent queries may exist or the local history may be empty.

## 4. Trigger
Performed by: Nguyễn Khánh Đăng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

The visitor focuses the search field or selects a history removal action.

## 5. Basic flow
Performed by: Nguyễn Khánh Đăng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

1. Actor focuses the search field.
2. System reads the local recent-query list and presents up to ten queries in its dropdown.
3. Actor selects a stored query.
4. System places that query in the search interface and delegates its execution to UC-030-001.
5. System retains at most ten queries when updating recent history.

## 6. Alternative flows
Performed by: Nguyễn Khánh Đăng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### AF-01: Remove one query
Performed by: Nguyễn Khánh Đăng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

At Basic step 3, the actor selects the remove action for one stored query. The system removes that query from browser history and updates the dropdown.

### AF-02: Clear all / empty history
Performed by: Nguyễn Khánh Đăng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

At Basic step 3, the actor clears all local queries; the system shows the empty dropdown state. An already empty list is a valid empty state.

## 7. Exception flows
Performed by: Nguyễn Khánh Đăng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

### EX-01: Browser storage unavailable
Performed by: Nguyễn Khánh Đăng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

At Basic step 2 or 5, do not report a durable history update if browser storage cannot be accessed. Search remains a separate goal; fallback/retention behavior requires review rather than an invented persistence guarantee.

## 8. Postconditions
Performed by: Nguyễn Khánh Đăng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Success: The selected query is handed to search, or the requested history removal is reflected in this browser.

Failure: No failed local write is reported as durably saved or cleared. No account listening-history records are affected.

## 9. Special requirements and business rules
Performed by: Nguyễn Khánh Đăng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

Required behavior follows the cited sources and recorded PA4 decisions. Success is shown only after the required operation succeeds. An empty result is distinct from a failed retrieval. Access checks apply at the service boundary when an API is involved; browser-only goals do not gain a new backend dependency. No new storage schema, endpoint, retry policy or audit service is selected by this draft.

## 10. Prototype evidence
Performed by: Nguyễn Khánh Đăng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

No matching flow prototype was found. A prototype and review of the relevant states remain pending; no implementation screenshot is fabricated.

## 11. Open questions and implementation boundary
Performed by: Nguyễn Khánh Đăng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

The source sets the ten-query cap and removal actions but does not specify duplicate ordering or cross-tab synchronization. Those choices remain open.

`src/frontend/src/pages/Search/SearchPage.jsx` calls `utils/searchEngine.js`, which uses local catalog matching and mock recommendations. The required backend metadata/lyrics/vector search behavior is not established by that UI. Search history and live semantic results need separate acceptance evidence.

## 12. Acceptance checks
Performed by: Nguyễn Khánh Đăng | Reviewed by: Group 10 team | Edited by: Lê Công Minh Nhựt

- [ ] Execute the basic flow and verify its success postcondition.
- [ ] Execute the alternative and exception flows and verify their outcomes.
- [ ] Verify the actor/ownership boundary and inspect observable output for private data.
- [ ] Verify required persistence independently of browser-only state, where applicable.
- [ ] Review the prototype coverage and source decisions with the group owner.

Results are pending. This document is a specification draft, not a test execution report.
