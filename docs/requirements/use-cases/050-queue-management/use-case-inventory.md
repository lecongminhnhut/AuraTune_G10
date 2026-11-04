# Use-Case Inventory: Functional Group 050 – Queue Management

---

## 1. Inventory Summary

This document serves as the official tracking registry for all Use Cases belonging to **Group 050 – Queue Management**. It establishes end-to-end traceability between Spec Kit features, Functional Requirements (FRs), assigned owners, and authoring statuses for PA3.

- **Functional Group**: 050 – Queue Management
- **Group Owner**: Nguyễn Thanh Huy
- **Baseline Version**: 1.0.0 (PA3 Review Baseline)
- **Total Confirmed Use Cases**: 7
- **Total Unconfirmed Candidates**: 2 (Documented with explicit exclusion rationale)

---

## 2. Confirmed Use-Case Inventory

| UC ID | Use-Case Name | Primary Actor | Supporting Actors | Related FR IDs | Related Feature | Assigned Writer | Status | Specification |
|---|---|---|---|---|---|---|---|---|
| **UC-050-001** | View Playback Queue | Guest / Listener | None | `051-FR-001` to `051-FR-005`, `051-FR-007` to `051-FR-011` | `051-view-queue` | Nguyễn Thanh Huy | **Draft** | [`UC-050-001-view-playback-queue.md`](./UC-050-001-view-playback-queue.md) |
| **UC-050-002** | Add Track to Queue | Guest / Listener | None | `052-FR-001` to `052-FR-007`, `052-FR-010` to `052-FR-012`, `051-FR-013` | `052-add-and-remove-queue-items` | Nguyễn Thanh Huy | **Draft** | [`UC-050-002-add-track-to-queue.md`](./UC-050-002-add-track-to-queue.md) |
| **UC-050-003** | Play Track Next | Guest / Listener | None | `054-FR-001` to `054-FR-010`, `052-FR-012`, `051-FR-013` | `054-play-next` | Nguyễn Thanh Huy | **Draft** | [`UC-050-003-play-track-next.md`](./UC-050-003-play-track-next.md) |
| **UC-050-004** | Reorder Upcoming Queue | Guest / Listener | None | `053-FR-001` to `053-FR-009` | `053-reorder-queue` | Nguyễn Thanh Huy | **Draft** | [`UC-050-004-reorder-upcoming-queue.md`](./UC-050-004-reorder-upcoming-queue.md) |
| **UC-050-005** | Remove Track from Queue | Guest / Listener | None | `052-FR-008` to `052-FR-011` | `052-add-and-remove-queue-items` | Nguyễn Thanh Huy | **Draft** | [`UC-050-005-remove-track-from-queue.md`](./UC-050-005-remove-track-from-queue.md) |
| **UC-050-006** | Clear Upcoming Queue | Guest / Listener | None | `051-FR-006`, `051-FR-007` | `051-view-queue` | Nguyễn Thanh Huy | **Draft** | [`UC-050-006-clear-upcoming-queue.md`](./UC-050-006-clear-upcoming-queue.md) |
| **UC-050-007** | Save Queue as Playlist | Listener | None | `051-FR-012` | `051-view-queue` | Nguyễn Thanh Huy | **Draft** (UI not implemented) | [`UC-050-007-save-queue-as-playlist.md`](./UC-050-007-save-queue-as-playlist.md) |

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

| Candidate ID | Proposed Name | Rationale / Exclusion Reason | Target Alternative Group |
|---|---|---|---|
| **CAND-050-A** | Sync Queue Across Devices | The API Contract defines no queue endpoints, and clarifications state that the queue is kept in local browser storage and does not sync across devices. | Out of Scope for MVP |
| **CAND-050-B** | Play Upcoming Track Immediately | Jumping to an upcoming track is a step inside the queue panel (`051-FR-005`), not a separate user goal. | Covered by **UC-050-001** (Steps 6–7) |

---

## 5. Traceability Matrix

| Feature Specification | Verified FR IDs | Mapped Use Case ID | Test Scenarios in Spec Kit |
|---|---|---|---|
| `051-view-queue` | `051-FR-001` to `051-FR-005`, `051-FR-007` to `051-FR-011` | **UC-050-001** | User Story 1 (P1), User Story 2 (P1), User Story 3 (P2) |
| `051-view-queue` | `051-FR-006`, `051-FR-007` | **UC-050-006** | User Story 3 (P2) |
| `051-view-queue` | `051-FR-012` | **UC-050-007** | Clarification session 2026-11-01 |
| `051-view-queue` | `051-FR-013` | **UC-050-002**, **UC-050-003** | Clarification session 2026-11-01 |
| `052-add-and-remove-queue-items` | `052-FR-001` to `052-FR-007`, `052-FR-010` to `052-FR-012` | **UC-050-002** | User Story 1 (P1) |
| `052-add-and-remove-queue-items` | `052-FR-008` to `052-FR-011` | **UC-050-005** | User Story 2 (P1) |
| `053-reorder-queue` | `053-FR-001` to `053-FR-009` | **UC-050-004** | User Story 1 (P1), User Story 2 (P1) |
| `054-play-next` | `054-FR-001` to `054-FR-010` | **UC-050-003** | User Story 1 (P1), User Story 2 (P1) |
