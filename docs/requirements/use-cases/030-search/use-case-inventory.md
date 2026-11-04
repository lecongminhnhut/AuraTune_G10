# Use-Case Inventory: Functional Group 030 – Search

---

## 1. Inventory Summary

This document serves as the official tracking registry for all Use Cases belonging to **Group 030 – Search**. It establishes end-to-end traceability between Spec Kit features, Functional Requirements (FRs), assigned owners, and authoring statuses for PA3.

- **Functional Group**: 030 – Search
- **Group Owner**: Nguyễn Khánh Đăng
- **Baseline Version**: 1.0.0 (PA3 Review Baseline)
- **Total Draft Use Cases**: 3

---

## 2. Draft Use-Case Inventory

| UC ID | Use-Case Name | Primary Actor | Supporting Actors | Related FR IDs | Related Feature | Assigned Writer | Status | Specification |
|---|---|---|---|---|---|---|---|---|
| **UC-030-001** | Search by Metadata | Public User, Listener | None | `031-FR-001` to `031-FR-019` | `031-metadata-search` | Nguyễn Khánh Đăng | **Draft** | [`UC-030-001-metadata-search.md`](./UC-030-001-metadata-search.md) |
| **UC-030-002** | AI Lyrics Search | Public User, Listener | External AI Service Provider | `032-FR-001` to `032-FR-019` | `032-ai-lyrics-search` | Nguyễn Khánh Đăng | **Draft** | [`UC-030-002-ai-lyrics-search.md`](./UC-030-002-ai-lyrics-search.md) |
| **UC-030-003** | Semantic Vector Search | Listener | External AI Service Provider | `033-FR-001` to `033-FR-017`, including lettered FRs | `033-semantic-vector-search` | Nguyễn Khánh Đăng | **Draft** | [`UC-030-003-semantic-vector-search.md`](./UC-030-003-semantic-vector-search.md) |

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
| `specs/030-search/031-metadata-search/spec.md` | `031-FR-001` through `031-FR-019` | **UC-030-001** | User Story 1 (P1), User Story 2 (P2), User Story 3 (P2) |
| `specs/030-search/032-ai-lyrics-search/spec.md` | `032-FR-001` through `032-FR-019` | **UC-030-002** | User Story 1 (P1), User Story 2 (P1), User Story 3 (P1) |
| `specs/030-search/033-semantic-vector-search/spec.md` | `033-FR-001` through `033-FR-017`, including `033-FR-003a`, `033-FR-004a`, `033-FR-011a` | **UC-030-003** | User Story 1 (P1), User Story 2 (P1), User Story 3 (P1), User Story 4 (P1) |
