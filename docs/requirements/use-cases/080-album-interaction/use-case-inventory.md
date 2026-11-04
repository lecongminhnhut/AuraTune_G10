# Use-Case Inventory: Functional Group 080 – Album

---

## 1. Inventory Summary

This document serves as the official tracking registry for all Use Cases belonging to **Group 080 – Album**. It establishes end-to-end traceability between Spec Kit features, Functional Requirements (FRs), assigned owners, and authoring statuses for PA3.

- **Functional Group**: 080 – Album
- **Group Owner**: Nguyễn Khánh Đăng
- **Baseline Version**: 1.0.0 (PA3 Review Baseline)
- **Total Draft Use Cases**: 3

---

## 2. Draft Use-Case Inventory

| UC ID | Use-Case Name | Primary Actor | Supporting Actors | Related FR IDs | Related Feature | Assigned Writer | Status | Specification |
|---|---|---|---|---|---|---|---|---|
| **UC-080-001** | View Album Details | Listener, Guest | None | `081-FR-001` to `081-FR-016`, including lettered FRs | `081-album-details` | Nguyễn Khánh Đăng | **Draft** | [`UC-080-001-album-details.md`](./UC-080-001-album-details.md) |
| **UC-080-002** | Play Album Tracklist | Listener | Music Player (`040`) | `082-FR-001` to `082-FR-016` | `082-album-tracklist` | Nguyễn Khánh Đăng | **Draft** | [`UC-080-002-album-tracklist.md`](./UC-080-002-album-tracklist.md) |
| **UC-080-003** | Save and Share Album | Listener, Guest | Auth (`010`) | `083-FR-001` to `083-FR-014` | `083-save-and-share-album` | Nguyễn Khánh Đăng | **Draft** | [`UC-080-003-save-and-share-album.md`](./UC-080-003-save-and-share-album.md) |

---

## 3. Status Definitions and Workflow

| Status | Definition |
|---|---|
| **Not Started** | Identified in requirements, but no specification document has been created. |
| **Draft** | Specification document drafted by author, undergoing internal self-check against the Spec Kit. |
| **In Review** | Formal peer review in progress on a pull request branch. |
| **Changes Requested** | Reviewer identified defects, missing flows, or unverified assumptions needing rework. |
| **Approved** | Formally accepted by peer reviewer and Group Owner; baseline for PA3 submission. |
| **Requires Clarification** | Blocked due to conflicting, ambiguous, or incomplete source requirements. |

---

## 4. Unconfirmed / Out-of-Scope Candidates

The following candidate use cases were analyzed during requirements engineering and determined to be out-of-scope or unconfirmed:

| Candidate ID | Proposed Name | Rational / Exclusion Reason | Target Alternative Group |
|---|---|---|---|
| **CAND-080-A** | Edit Album Metadata | Editing catalog releases is restricted to the platform Content Management team. Listeners and Guests cannot modify albums. | **Admin CMS** |

---

## 5. Traceability Matrix

| Feature Specification | Verified FR IDs | Mapped Use Case ID | Test Scenarios in Spec Kit |
|---|---|---|---|
| `specs/080-album-interaction/081-album-details/spec.md` | `081-FR-001` through `081-FR-016`, including lettered FRs | **UC-080-001** | User Story 1 (P1), User Story 2 (P1), User Story 3 (P2) |
| `specs/080-album-interaction/082-album-tracklist/spec.md` | `082-FR-001` through `082-FR-016` | **UC-080-002** | User Story 1 (P1), User Story 2 (P1), User Story 3 (P1) |
| `specs/080-album-interaction/083-save-and-share-album/spec.md` | `083-FR-001` through `083-FR-014` | **UC-080-003** | User Story 1 (P1), User Story 2 (P1) |
