# AuraTune — PA3 Changes Log

Document Information:
- **Project**: AuraTune (Group 10)
- **Course**: CS300 / CSC13002 — Introduction to Software Engineering
- **Target Submission**: Project Assignment 3 (PA3-2026)
- **Baseline Document Versions**: PA2-2026 Project Plan and Vision Document
- **Performed by**: Lê Công Minh Nhựt | **Reviewed by**: Nguyễn Khánh Đăng | **Edited by**: Lê Công Minh Nhựt
- **Date**: 2026-11-07
- **Document Status**: Approved & Baselined for PA3 Submission Package

---

## Executive Summary

In accordance with the Project Assignment 3 (PA3-2026) requirements and explicit instructional guidance from the course instructor, this unified `Changes.md` document provides a comprehensive, itemized audit log of all revisions made to the core project governance and specification documents since the PA2-2026 baseline.

This document is organized into two primary sections:
- **Section A**: Modifications, additions, and operational refinements made to the **Project Plan** (`docs/proposal/project_plan.md`), with particular focus on the granular elaboration of Sprint 3 (WBS, Jira keys, team workload, and Build Checkpoint BLD-02 / Alpha Checkpoint).
- **Section B**: Structural, functional, and non-functional enhancements made to the **Vision Document** (`docs/proposal/Auratune_Vision_Document.md`), focusing on the formalization of granular Functional Requirements directly mapped to the System-Level Use-Case Model, realistic user environments, competitive benchmarking, and verifiable non-functional metrics.

---

## Section A: Changes in Revised Project Plan (2nd Submission)

The table below itemizes every change made to `docs/proposal/project_plan.md` compared to the PA2-2026 baseline.

| Section / Item | Change Type | Description of Change in PA3 | Rationale & Alignment with Instructor / TA Feedback |
| :--- | :---: | :--- | :--- |
| **Section 1.1 & Document Information** | Modified | Updated the revision note and baseline references to establish the PA3 milestone status. Confirmed the five-member team roles and baseline alignment across `docs/`. | Reflects progress into the third project cycle and maintains documentation integrity across assignment baselines. |
| **Section 2.4.3 (Deliverables of Sprint 3 / PA3)** | Modified / Detailed | Updated statuses for deliverables **D-14 through D-20** from `Planned` to `Completed`. Explicitly designated **Functional Group 120 (AI Conversational Agent: 121, 122, 123)** as the chosen functional group implemented end-to-end via Spec Kit. Detailed verification paths for source code, Spec Kit artifacts, narrated YouTube demo video, and `PA3-Group10.zip`. | Directly satisfies PA3 Section E requirement to implement 1 functional group across frontend, backend, and database with Spec Kit, and resolves instructor requirement to explicitly confirm the delivered functional group. |
| **Section 2.5 (Assumptions & Constraints — Technical Spikes)** | Detailed | Added explicit verification outcomes for Sprint 3 technical spikes: confirmed HTTP 206 Byte-Range streaming feasibility on free-tier cloud storage (`ED-05`, `Q-040-1`), evaluated LLM provider connectivity and vector database options (`ED-08`, `Q-030-1`), and validated free-tier SMTP mail providers for password recovery (`Q-010-1`). | Addresses architectural uncertainties identified during PA2 review before proceeding with full implementation. |
| **Section 4.2.5 (Milestones of Sprints 3–5)** | Modified | Refined Sprint 3 completion criteria to explicitly mandate: System-Level Use-Case Model (Mermaid diagrams) covering all 12 functional groups, complete Use-Case Specifications with UI prototype screen mockups, Group 120 E2E delivery, AI Usage Log, and Weekly Report. | Clarifies milestone acceptance criteria for academic grading and provides measurable verification benchmarks. |
| **Section 4.2.8 (Sprint 3 Plan: 26 Oct – 8 Nov 2026)** | **Added (New Section)** | Added the complete operational plan for Sprint 3, structured identically to Sprint 2. Formulated a 5-pillar **Sprint Goal** covering: (1) Requirements Modeling (12 groups), (2) Spec-Driven Implementation of Group 120, (3) Governance revisions with unified `Changes.md`, (4) Technical Spikes & PoCs resolution, and (5) Scrum ceremonies, AI Log, and Weekly Reports. | Directly fulfills instructor feedback: *"Các nhóm không có yêu cầu điều chỉnh PA2 cũng cần lưu ý là Project Plan đến PA3 vẫn cần có thay đổi là cập nhật chi tiết hơn cho Sprint 3."* |
| **Section 4.2.8.1 (Sprint 3 Tasks — WBS with Jira Keys)** | **Added (New Section)** | Created a comprehensive Work Breakdown Structure (WBS) table containing **25 Jira issue keys (`SCRUM-201` to `SCRUM-225`)**. Each task specifies task name, assigned owner, independent peer reviewer, start date, due date, and predecessor dependencies covering all PA3 deliverables. | Establishes full traceability between the Project Plan and the team's Jira board (`NMSE_Group10`), ensuring task-level ownership and dependency control. |
| **Section 4.2.8.2 (Workload Check)** | **Added (New Section)** | Added a workload distribution matrix confirming balanced assignment across all five team members: Nhựt (6 tasks / 5 reviews), Khoa (4 tasks / 5 reviews), Đăng (4 tasks / 5 reviews), Hoàng (5 tasks / 4 reviews), Huy (6 tasks / 5 reviews). Analyzed role alignment with technical strengths. | Enforces team equity, eliminates single points of failure, and guarantees compliance with the Team Contract peer-review rule. |
| **Section 4.2.8.3 (Jira Synchronization & Definition of Done)** | **Added (New Section)** | Defined formal procedures for syncing progress with Jira and codified a 5-item **Sprint 3 Definition of Done (DoD)** covering Markdown format, author metadata headers, Mermaid diagram syntax, Spec Kit code quality, and YouTube demo availability. | Provides clear quality gates and prevents unfinished work from being tagged as complete. |
| **Section 4.3 (Build Plan Status Note)** | Modified | Updated status note recording that BLD-01 (Specification Baseline) was baselined in PA2 and **BLD-02 (First Integrated Build / Alpha Checkpoint)** has been delivered in Sprint 3 featuring Group 120 E2E integration. | Maintains temporal consistency between the project narrative and actual repository state. |
| **Section 4.3.2 (Build Checkpoint Plan — BLD-02)** | Modified / Detailed | Updated BLD-01 and BLD-02 status to `Completed`. Detailed the software increment delivered: Group 120 (Conversational Interface 121, Intent Understanding 122, Real-time Assistance 123) connected to web foundation (131) and local auth (011) over PostgreSQL. Specified smoke testing, API contract tests, AI fallback simulation, exit criteria, and release tag `v1.0.0-alpha.1`. | Satisfies PA3 Section E criteria for an executable Alpha build and documents the transition from design baseline to working software increment. |

---

## Section B: Changes in Detailed Vision Document (2nd Submission)

The table below itemizes every change made to `docs/proposal/Auratune_Vision_Document.md` compared to the PA2-2026 baseline.

| Section / Item | Change Type | Description of Change in PA3 | Rationale & Alignment with Instructor / TA Feedback |
| :--- | :---: | :--- | :--- |
| **Section 1.1 (Purpose of the Document)** | Modified | Updated purpose statement to formally record the second revision for PA3-2026, highlighting the inclusion of granular Functional Requirements, mapped Use Cases, enhanced NFRs, and competitor analysis. Linked changes to `docs/PA/Changes.md`. | Accurately frames the document's evolution from an initial vision concept (PA2) into a detailed requirements specification baseline (PA3). |
| **Section 1.4 (References)** | Modified / Detailed | Expanded the reference register from 6 to 8 entries, adding **PA3-2026 Assignment Guidelines** and the authoritative **System-Level Use-Case Model (`docs/requirements/use-case-model.md`)**. | Ensures complete cross-document traceability across requirements and architecture baselines. |
| **Section 3.3 (User Environment)** | Detailed / Expanded | Replaced high-level bullets with exhaustive operational parameters: minimum supported browser versions (Chrome 110+, Edge 110+, Firefox 115+ ESR, Safari 16+ on desktop/mobile); responsive display viewports (Desktop 1024px–1920px+, Tablet 768px–1023px, Mobile 375px–767px); network bandwidth requirements (≥ 5 Mbps broadband, ≥ 2 Mbps 4G mobile, latency < 100ms); and HTML5 audio peripheral specs (stereo 44.1/48 kHz 16-bit PCM). | Directly satisfies PA3 Section B grading rubric requiring detailed descriptions of target user environments and hardware/software constraints. |
| **Section 3.5 (Alternatives and Competition)** | Detailed / Expanded | Expanded competitor analysis to comprehensively evaluate four major platforms: **Spotify, SoundCloud, YouTube Music, and Zing MP3**. Added an 11-row **Systematic Capability Matrix** comparing player features, lyrics, vector search, conversational AI host, prompt playlists, collaborative curation, and open-copyright models. Articulated AuraTune's strategic positioning. | Fulfills PA3 Section B requirements to evaluate alternatives and competitors thoroughly, clarifying AuraTune's unique value proposition. |
| **Section 5.3 (Detailed Functional Requirements)** | **Added (New Section)** | Subdivided the high-level functional groups (G01–G12) into a structured inventory of granular **Functional Requirements (`FR-010-001` through `FR-120-004`)**. Each requirement is specified using formal syntax (*"The system shall..."*), accompanied by explicit **Mapped Use Case IDs (`UC-010-001` to `UC-120-004`)**, Primary Actors, and MoSCoW priorities (*Must Have, Should Have, Could Have*). | Directly resolves instructor feedback: *"Vision cần chú ý rà soát để Functional Requirements phải rõ hơn vì gắn liền với Use Case."* Transforms descriptive prose into verifiable engineering requirements. |
| **Section 5.4 (FR to UC Traceability Matrix)** | **Added (New Section)** | Created a consolidated master traceability matrix verifying 100% bidirectional mapping between the 12 Functional Groups / 72 Functional Requirements in the Vision Document and the 72 Use Cases in `docs/requirements/use-case-model.md`. | Eliminates requirement gaps, proves complete architectural coverage, and provides a dependable baseline for test planning in PA5. |
| **Section 5.5 (Key User Workflows)** | Renumbered | Renumbered from Section 5.3 to 5.5 to accommodate the detailed requirements sections. Verified and preserved both Mermaid flowchart workflows: Workflow 1 (Music Discovery & Playback) and Workflow 2 (AI Playlist Generation). | Maintains clear document hierarchy and visual workflow modeling without syntax errors. |
| **Section 6.1 (Performance Requirements)** | Quantified / Enhanced | Replaced general aspirations with precise, measurable performance thresholds: Dashboard TTI < 2.0s (broadband) / < 3.5s (4G); audio start latency < 500ms (buffered) / < 1.2s (cold stream byte-range via HTTP 206); text search < 300ms; AI vector search < 3.0s; AI conversational SSE initial token < 1.5s; and p95 database query latency < 100ms. | Upgrades qualitative statements to verifiable criteria that can be evaluated during automated testing and live demonstration. |
| **Section 6.2 (Security & Compliance)** | Quantified / Enhanced | Formalized concrete security standards: password hashing using Argon2id or bcrypt (work factor ≥ 12); mandatory HTTPS / TLS 1.3 transit encryption; dual-token session architecture (JWT Access Token + HttpOnly SameSite=Strict Refresh Token cookie); strict PII stripping / anonymization per **Vietnam Decree 13/2023/ND-CP** before sending queries to external LLMs; and brute-force mitigation (5 failed attempts per 15 minutes lockout). | Strengthens regulatory compliance and safeguards user privacy within the academic research scope. |
| **Section 6.3 (Platform & Accessibility)** | Quantified / Enhanced | Added explicit responsive viewport ranges (375px to 2560px), multi-modal input standards (full keyboard navigation with `Tab`, `Space`, `Enter`, `Arrows`), and mobile touch gesture support (tap, long-press, swipe-to-dismiss). | Ensures the application provides an inclusive, accessible user experience across all device form factors. |
| **Section 6.4 (Quality Attributes)** | Quantified / Enhanced | Specified quantitative availability (99.5% uptime target), audio buffer resilience (30-second pre-buffering to mitigate transient network drops), graceful AI degradation fallbacks, and modular API contract adherence adhering to OpenAPI 3.0.3 standards. | Guarantees system resilience during evaluation demonstrations and enforces clean separation of concerns. |

---

## Section C: Verification and Traceability Summary

All modifications documented above have been peer-reviewed and verified against the repository's codebase and specifications:

1. **Format Compliance**: Both revised documents are written in formal academic English using standard Markdown format. All diagrams adhere strictly to Mermaid syntax and render cleanly without warnings.
2. **Authorship & Accountability**: In compliance with course submission guidelines, every modified section and subsection header contains the mandatory authorship metadata line (`Performed by: [...] | Reviewed by: [...] | Edited by: [...]`).
3. **Cross-Artifact Consistency**: The Functional Requirements in Section 5.3 and the Traceability Matrix in Section 5.4 are 100% synchronized with the System-Level Use-Case Model (`docs/requirements/use-case-model.md`), the 12 feature folders in `specs/`, and the API contracts in `specs/120-ai-conversational-agent/`.
4. **Implementation Integrity**: The Sprint 3 WBS tasks (`SCRUM-201` to `SCRUM-225`) and Build Checkpoint BLD-02 directly match the delivered end-to-end implementation of Group 120 in `src/frontend/` and `src/backend/`.

*End of Changes Log — Baselined for PA3-2026 Submission.*
