# Use-Case Inventory: Functional Group 040 – Music Player

---

## 1. Inventory Summary

This document serves as the official tracking registry for all Use Cases belonging to **Group 040 – Music Player**. It establishes end-to-end traceability between Spec Kit features, Functional Requirements (FRs), assigned owners, and authoring statuses for PA3.

- **Functional Group**: 040 – Music Player
- **Group Owner**: Nguyễn Thanh Huy
- **Baseline Version**: 1.0.0 (PA3 Review Baseline)
- **Total Confirmed Use Cases**: 10
- **Total Unconfirmed Candidates**: 2 (Documented with explicit exclusion rationale)

---

## 2. Confirmed Use-Case Inventory

| UC ID | Use-Case Name | Primary Actor | Supporting Actors | Related FR IDs | Related Feature | Assigned Writer | Status | Specification |
|---|---|---|---|---|---|---|---|---|
| **UC-040-001** | Control Audio Playback | Guest / Listener | Cloud Media Storage | `041-FR-001` to `041-FR-015` | `041-playback-controls` | Nguyễn Thanh Huy | **Draft** | [`UC-040-001-control-audio-playback.md`](./UC-040-001-control-audio-playback.md) |
| **UC-040-002** | Adjust Volume and Mute | Guest / Listener | None | `042-FR-006` to `042-FR-011` | `042-playback-progress-and-volume` | Nguyễn Thanh Huy | **Draft** | [`UC-040-002-adjust-volume-and-mute.md`](./UC-040-002-adjust-volume-and-mute.md) |
| **UC-040-003** | Seek Audio Playback Position | Guest / Listener | Cloud Media Storage | `042-FR-001` to `042-FR-005`, `042-FR-011`, `042-FR-012` | `042-playback-progress-and-volume` | Nguyễn Thanh Huy | **Draft** | [`UC-040-003-seek-audio-playback-position.md`](./UC-040-003-seek-audio-playback-position.md) |
| **UC-040-004** | Toggle Shuffle and Repeat Modes | Guest / Listener | None | `043-FR-001` to `043-FR-012` | `043-shuffle-and-repeat` | Nguyễn Thanh Huy | **Draft** | [`UC-040-004-toggle-shuffle-and-repeat-modes.md`](./UC-040-004-toggle-shuffle-and-repeat-modes.md) |
| **UC-040-005** | View Synchronized Lyrics | Guest / Listener | None | `044-FR-001` to `044-FR-012` | `044-synchronized-lyrics` | Nguyễn Thanh Huy | **Draft** | [`UC-040-005-view-synchronized-lyrics.md`](./UC-040-005-view-synchronized-lyrics.md) |
| **UC-040-006** | Toggle Persistent Mini and Full Player | Guest / Listener | None | `045-FR-001` to `045-FR-012` | `045-persistent-bottom-player` | Nguyễn Thanh Huy | **Draft** | [`UC-040-006-toggle-persistent-mini-and-full-player.md`](./UC-040-006-toggle-persistent-mini-and-full-player.md) |
| **UC-040-007** | Share Song | Guest / Listener | None | `046-FR-001` to `046-FR-005` | `046-song-sharing-and-comments` | Nguyễn Thanh Huy | **Draft** | [`UC-040-007-share-song.md`](./UC-040-007-share-song.md) |
| **UC-040-008** | Read Track Comments | Guest / Listener | None | `046-FR-006`, `046-FR-007`, `046-FR-014`, `046-FR-015` | `046-song-sharing-and-comments` | Nguyễn Thanh Huy | **Draft** | [`UC-040-008-read-track-comments.md`](./UC-040-008-read-track-comments.md) |
| **UC-040-009** | Post Track Comment | Listener | None | `046-FR-008`, `046-FR-009`, `046-FR-012`, `046-FR-013`, `046-FR-015` | `046-song-sharing-and-comments` | Nguyễn Thanh Huy | **Draft** | [`UC-040-009-post-track-comment.md`](./UC-040-009-post-track-comment.md) |
| **UC-040-010** | Delete Track Comment | Listener / Administrator | None | `046-FR-010` to `046-FR-012` | `046-song-sharing-and-comments` | Nguyễn Thanh Huy | **Draft** | [`UC-040-010-delete-track-comment.md`](./UC-040-010-delete-track-comment.md) |

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
| **CAND-040-A** | Download Track | The current frontend shows a download control, but no feature specification, proposal section, or API Contract endpoint defines downloading as a requirement. | Out of Scope until specified |
| **CAND-040-B** | Like Track From the Player | Liking is available as a quick action in the full player (`041-FR-015`) but the goal of saving a favorite belongs to playlist and library management. | Covered by **UC-040-001** AF-04; library behavior in **Group 060** |

---

## 5. Traceability Matrix

| Feature Specification | Verified FR IDs | Mapped Use Case ID | Test Scenarios in Spec Kit |
|---|---|---|---|
| `041-playback-controls` | `041-FR-001` to `041-FR-015` | **UC-040-001** | User Story 1 (P1), User Story 2 (P1), User Story 3 (P1) |
| `042-playback-progress-and-volume` | `042-FR-001` to `042-FR-005`, `042-FR-011`, `042-FR-012` | **UC-040-003** | User Story 1 (P1) |
| `042-playback-progress-and-volume` | `042-FR-006` to `042-FR-011` | **UC-040-002** | User Story 2 (P1) |
| `043-shuffle-and-repeat` | `043-FR-001` to `043-FR-012` | **UC-040-004** | User Story 1 (P1), User Story 2 (P1) |
| `044-synchronized-lyrics` | `044-FR-001` to `044-FR-012` | **UC-040-005** | User Story 1 (P1), User Story 2 (P2) |
| `045-persistent-bottom-player` | `045-FR-001` to `045-FR-012` | **UC-040-006** | User Story 1 (P1), User Story 2 (P1), User Story 3 (P2) |
| `046-song-sharing-and-comments` | `046-FR-001` to `046-FR-005` | **UC-040-007** | User Story 1 (P1) |
| `046-song-sharing-and-comments` | `046-FR-006`, `046-FR-007`, `046-FR-014`, `046-FR-015` | **UC-040-008** | User Story 2 (P1) |
| `046-song-sharing-and-comments` | `046-FR-008`, `046-FR-009`, `046-FR-012`, `046-FR-013`, `046-FR-015` | **UC-040-009** | User Story 3 (P1) |
| `046-song-sharing-and-comments` | `046-FR-010` to `046-FR-012` | **UC-040-010** | User Story 3 (P1) |
