# Use-Case Inventory: Functional Group 020 – Home Dashboard

---

## 1. Inventory Summary

This document serves as the official tracking registry for all Use Cases belonging to **Group 020 – Home Dashboard**. It establishes end-to-end traceability between Spec Kit features, Functional Requirements (FRs), assigned owners, and authoring statuses for PA3.

- **Functional Group**: 020 – Home Dashboard
- **Group Owner**: Nguyễn Thanh Huy
- **Baseline Version**: 1.0.0 (PA3 Review Baseline)
- **Total Confirmed Use Cases**: 5
- **Total Unconfirmed Candidates**: 2 (Documented with explicit exclusion rationale)

---

## 2. Confirmed Use-Case Inventory

| UC ID | Use-Case Name | Primary Actor | Supporting Actors | Related FR IDs | Related Feature | Assigned Writer | Status | Specification |
|---|---|---|---|---|---|---|---|---|
| **UC-020-001** | Browse Home Dashboard | Guest / Listener | None | `021-FR-001` to `021-FR-013` | `021-home-content-layout` | Nguyễn Thanh Huy | **Draft** | [`UC-020-001-browse-home-dashboard.md`](./UC-020-001-browse-home-dashboard.md) |
| **UC-020-002** | Stream Recommended Music from Home | Listener / Guest | None | `022-FR-001` to `022-FR-011` | `022-recommended-content` | Nguyễn Thanh Huy | **Draft** | [`UC-020-002-stream-recommended-music-from-home.md`](./UC-020-002-stream-recommended-music-from-home.md) |
| **UC-020-003** | Replay Recently Played Music | Listener | None | `023-FR-001` to `023-FR-011` | `023-recently-played` | Nguyễn Thanh Huy | **Draft** | [`UC-020-003-replay-recently-played-music.md`](./UC-020-003-replay-recently-played-music.md) |
| **UC-020-004** | Browse Trending Charts | Guest / Listener | None | `024-FR-001` to `024-FR-014` | `024-trending-charts` | Nguyễn Thanh Huy | **Draft** | [`UC-020-004-browse-trending-charts.md`](./UC-020-004-browse-trending-charts.md) |
| **UC-020-005** | Explore New Album Releases | Guest / Listener | None | `025-FR-001` to `025-FR-011` | `025-new-releases` | Nguyễn Thanh Huy | **Draft** | [`UC-020-005-explore-new-album-releases.md`](./UC-020-005-explore-new-album-releases.md) |

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

The following candidate use cases were analyzed during requirements engineering and determined to be out-of-scope or covered elsewhere:

| Candidate ID | Proposed Name | Rationale / Exclusion Reason | Target Alternative Group |
|---|---|---|---|
| **CAND-020-A** | Browse Featured Artists | Featured artists are a section of the Home layout populated automatically by play counts (`021-FR-013`). Opening an artist is covered by the artist profile use case, so a separate Home use case would duplicate it. | Covered by **UC-020-001**; artist page in **Group 090** (`UC-090-001`) |
| **CAND-020-B** | Browse Music by Genre | Genre tiles are part of the Home layout (`021-FR-004`). No feature specification defines genre browsing as a separate user goal. | Covered by **UC-020-001**; Explore page scope to be confirmed |

---

## 5. Traceability Matrix

| Feature Specification | Verified FR IDs | Mapped Use Case ID | Test Scenarios in Spec Kit |
|---|---|---|---|
| `021-home-content-layout` | `021-FR-001` through `021-FR-013` | **UC-020-001** | User Story 1 (P1), User Story 2 (P2), User Story 3 (P2) |
| `022-recommended-content` | `022-FR-001` through `022-FR-011` | **UC-020-002** | User Story 1 (P1), User Story 2 (P1), User Story 3 (P2) |
| `023-recently-played` | `023-FR-001` through `023-FR-011` | **UC-020-003** | User Story 1 (P1), User Story 2 (P2), User Story 3 (P2) |
| `024-trending-charts` | `024-FR-001` through `024-FR-014` | **UC-020-004** | User Story 1 (P1), User Story 2 (P2) |
| `025-new-releases` | `025-FR-001` through `025-FR-011` | **UC-020-005** | User Story 1 (P1), User Story 2 (P1), User Story 3 (P2) |
