# Use-Case Inventory: Functional Group 010 – Authentication

---

## 1. Inventory Summary
This document serves as the official tracking registry for all Use Cases belonging to **Group 010 – Authentication**. It establishes end-to-end traceability between Spec Kit features, Functional Requirements (FRs), and authoring statuses for PA3.

- **Functional Group**: 010 – Authentication
- **Group Owner**: Mai Đăng Khoa
- **Baseline Version**: 1.0.0 (PA3 Review Baseline)
- **Total Confirmed Use Cases**: 9

---

## 2. Confirmed Use-Case Inventory

| UC ID | Use-Case Name | Primary Actor | Supporting Actors | Related FR IDs | Related Feature | Assigned Writer | Status | Specification |
|---|---|---|---|---|---|---|---|---|
| **UC-010-001** | Register with Email | Visitor | None | `FR-011-001`, `002`, `003`, `010` | `011` | Mai Đăng Khoa | **In Review** | [./UC-010-001-register-with-email.md](./UC-010-001-register-with-email.md) |
| **UC-010-002** | Login with Email | Visitor | None | `FR-011-004`, `009` | `011` | Mai Đăng Khoa | **In Review** | [./UC-010-002-login-with-email.md](./UC-010-002-login-with-email.md) |
| **UC-010-003** | Recover Password | Visitor | None | `FR-011-011` | `011` | Mai Đăng Khoa | **In Review** | [./UC-010-003-recover-password.md](./UC-010-003-recover-password.md) |
| **UC-010-004** | Login with Google | Visitor | Google | `FR-012-001`, `003`, `004` | `012` | Mai Đăng Khoa | **In Review** | [./UC-010-004-login-with-google.md](./UC-010-004-login-with-google.md) |
| **UC-010-005** | Login with Facebook | Visitor | Facebook | `FR-012-002`, `003`, `004` | `012` | Mai Đăng Khoa | **In Review** | [./UC-010-005-login-with-facebook.md](./UC-010-005-login-with-facebook.md) |
| **UC-010-006** | Logout | Listener | None | `FR-013-006` | `013` | Mai Đăng Khoa | **In Review** | [./UC-010-006-logout.md](./UC-010-006-logout.md) |
| **UC-010-007** | View Active Sessions | Listener | None | `FR-013-007` | `013` | Mai Đăng Khoa | **In Review** | [./UC-010-007-view-active-sessions.md](./UC-010-007-view-active-sessions.md) |
| **UC-010-008** | Logout from All Devices | Listener | None | `FR-013-008` | `013` | Mai Đăng Khoa | **In Review** | [./UC-010-008-logout-all-devices.md](./UC-010-008-logout-all-devices.md) |
| **UC-010-009** | Unlink OAuth Provider | Listener | None | `FR-012-011` | `012` | Mai Đăng Khoa | **In Review** | [./UC-010-009-unlink-oauth-provider.md](./UC-010-009-unlink-oauth-provider.md) |

---

## 3. Status Definitions and Workflow

| Status | Definition |
|---|---|
| **Not Started** | Identified in requirements, but no specification document has been created. |
| **Draft** | Specification document drafted by author, undergoing internal self-check. |
| **In Review** | Ready for peer review or Group Owner approval. |
| **Approved** | Formally accepted by Group Owner; baseline for PA3. |

---

## 4. Traceability Matrix

| Feature Specification | Verified FR IDs | Mapped Use Case ID |
|---|---|---|
| `011-local-authentication` | `FR-011-001` to `011-003`, `011-010` | **UC-010-001** |
| `011-local-authentication` | `FR-011-004` | **UC-010-002** |
| `011-local-authentication" | `FR-011-011` | **UC-010-003** |
| `012-oauth-authentication` | `FR-012-001` | **UC-010-004** |
| `012-oauth-authentication` | `FR-012-002` | **UC-010-005** |
| `012-oauth-authentication` | `FR-012-011` | **UC-010-009** |
| `013-session-management` | `FR-013-006` | **UC-010-006** |
| `013-session-management` | `FR-013-007` | **UC-010-007** |
| `013-session-management` | `FR-013-008` | **UC-010-008** |

---

## 5. Review Checklist

- [x] Every UC in the diagram is listed in this inventory.
- [x] Every inventory entry has a corresponding specification file.
- [x] UC IDs and names are consistent across the model, inventory and specification files.
- [x] Every in-scope FR is mapped to one or more UCs.
- [x] Writers and reviewers are assigned.
