# Use-Case Inventory: Functional Group 100 – AI Recommendations

---

## 1. Inventory Summary

This document serves as the official tracking registry for all Use Cases belonging to **Group 100 – AI Recommendations**. It establishes end-to-end traceability between Spec Kit features, Functional Requirements (FRs), assigned owners, and authoring statuses for PA3.

- **Functional Group**: 100 – AI Recommendations
- **Group Owner**: Lê Công Minh Nhựt
- **Baseline Version**: 1.0.0 (PA3 Review Baseline)
- **Total Confirmed Use Cases**: 3
- **Total Unconfirmed Candidates**: 2 (Documented with explicit exclusion rationale)

---

## 2. Confirmed Use-Case Inventory

| UC ID | Use-Case Name | Primary Actor | Supporting Actors | Related FR IDs | Related Feature | Assigned Writer | Status | Specification |
|---|---|---|---|---|---|---|---|---|
| **UC-100-001** | View Listening History Analysis | Listener | External AI Service Provider | `101-FR-001` to `101-FR-014` | `101-listening-history-analysis` | Lê Công Minh Nhựt | **Draft** | [`UC-100-001-view-listening-history-analysis.md`](./UC-100-001-view-listening-history-analysis.md) |
| **UC-100-002** | Receive Personalized Recommendations | Listener | External AI Service Provider | `102-FR-001` to `102-FR-015` | `102-personalized-recommendations` | Lê Công Minh Nhựt | **Draft** | [`UC-100-002-receive-personalized-recommendations.md`](./UC-100-002-receive-personalized-recommendations.md) |
| **UC-100-003** | Discover Music by Mood and Context | Listener | External AI Service Provider | `103-FR-001` to `103-FR-015` | `103-mood-and-context-recommendations` | Lê Công Minh Nhựt | **Draft** | [`UC-100-003-discover-music-by-mood-and-context.md`](./UC-100-003-discover-music-by-mood-and-context.md) |

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
| **CAND-100-A** | Input Free-Form Mood Prompts | Users typing free-form natural language prompts (e.g., *"give me rainy day jazz"*) is explicitly excluded from Feature 103 (clarification session 2026-10-30). Only curated preset chips are supported. Free-form text queries are handled by vector search. | **Group 030 – Search** (`033-semantic-vector-search`) |
| **CAND-100-B** | Direct Recommendation Feedback ("Dislike" / "Not Interested") | Spec Kit Feature 102 and AuraTune database schema do not define negative feedback signal storage or explicit dislike buttons. Personalization relies strictly on `listening_history`, `user_liked_songs`, and `user_follows_artist`. | Out of Scope for MVP / Future Sprint |

---

## 5. Traceability Matrix

| Feature Specification | Verified FR IDs | Mapped Use Case ID | Test Scenarios in Spec Kit |
|---|---|---|---|
| `101-listening-history-analysis` | `101-FR-001` through `101-FR-014` | **UC-100-001** | User Story 1 (P1), User Story 2 (P2), User Story 3 (P1) |
| `102-personalized-recommendations` | `102-FR-001` through `102-FR-015` | **UC-100-002** | User Story 1 (P1), User Story 2 (P2), User Story 3 (P2), User Story 4 (P1) |
| `103-mood-and-context-recommendations` | `103-FR-001` through `103-FR-015` | **UC-100-003** | User Story 1 (P1), User Story 2 (P2), User Story 3 (P2), User Story 4 (P1) |
