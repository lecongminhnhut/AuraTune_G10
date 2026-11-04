# Use-Case Inventory: Functional Group 030 – Search

---

## 1. Inventory Summary

This document serves as the official tracking registry for all Use Cases belonging to **Group 030 – Search**. It establishes end-to-end traceability between Spec Kit features, Functional Requirements (FRs), assigned owners, and authoring statuses for PA3.

- **Functional Group**: 030 – Search
- **Group Owner**: Nguyễn Khánh Đăng
- **Baseline Version**: 1.0.0 (PA3 Review Baseline)
- **Total Confirmed Use Cases**: 3

---

## 2. Confirmed Use-Case Inventory

| UC ID | Use-Case Name | Primary Actor | Supporting Actors | Related FR IDs | Related Feature | Assigned Writer | Status | Specification |
|---|---|---|---|---|---|---|---|---|
| **UC-030-001** | Search by Metadata | Public User, Listener | None | `FR-001` to `FR-019` | `031-metadata-search` | Nguyễn Khánh Đăng | **Draft** | [`UC-030-001-metadata-search.md`](./UC-030-001-metadata-search.md) |
| **UC-030-002** | AI Lyrics Search | Public User, Listener | External AI Service Provider | `FR-001` to `FR-019` | `032-ai-lyrics-search` | Nguyễn Khánh Đăng | **Draft** | [`UC-030-002-ai-lyrics-search.md`](./UC-030-002-ai-lyrics-search.md) |
| **UC-030-003** | Semantic Vector Search | Listener | External AI Service Provider | `FR-001` to `FR-017` | `033-semantic-vector-search` | Nguyễn Khánh Đăng | **Draft** | [`UC-030-003-semantic-vector-search.md`](./UC-030-003-semantic-vector-search.md) |

---

## 3. Status Definitions and Workflow

| Status | Definition |
|---|---|
| **Not Started** | Identified in requirements, but no specification document has been created. |
| **Draft** | Specification document drafted by author, undergoing internal self-check against the Spec Kit. |
| **In Review** | Formal peer review in progress on a pull request branch. |
| **Changes Requested** | Reviewer identified defects, missing flows, or unverified assumptions needing rework. |
| **Approved** | Formally accepted by peer reviewer and Group Owner; baseline for PA3 submission. |

---

## 4. Traceability Matrix

| Feature Specification | Verified FR IDs | Mapped Use Case ID | Test Scenarios in Spec Kit |
|---|---|---|---|
| `031-metadata-search` | `FR-001` through `FR-019` | **UC-030-001** | User Story 1 (P1), User Story 2 (P2), User Story 3 (P2) |
| `032-ai-lyrics-search` | `FR-001` through `FR-019` | **UC-030-002** | User Story 1 (P1), User Story 2 (P1), User Story 3 (P1) |
| `033-semantic-vector-search` | `FR-001` through `FR-017` | **UC-030-003** | User Story 1 (P1), User Story 2 (P1), User Story 3 (P1), User Story 4 (P1) |