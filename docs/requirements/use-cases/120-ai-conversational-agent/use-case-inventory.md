# Use-Case Inventory: Functional Group 120 – AI Conversational Agent

---

## 1. Inventory Summary

This inventory serves as the authoritative tracking registry for all Use Cases belonging to **Group 120 – AI Conversational Agent**. It tracks end-to-end alignment between the Spec Kit, actual frontend implementation (`AIHostChat.jsx`), and PA3 documentation standards.

- **Functional Group**: 120 – AI Conversational Agent
- **Group Owner**: Lê Công Minh Nhựt
- **Baseline Version**: 1.0.0 (PA3 Review Baseline)
- **Total Confirmed Use Cases**: 4
- **Total Unconfirmed / Out-of-Scope Candidates**: 2

---

## 2. Confirmed Use-Case Inventory

| UC ID | Use-Case Name | Brief Description | Primary Actor | Supporting Actors | Related FR IDs | Related UI Component / Screen | Related Spec Kit | Implementation Status | Specification Link |
|---|---|---|---|---|---|---|---|---|---|
| **UC-120-001** | Converse with AI Music Host | Opens floating CLI agent panel, exchanges text prompts, views live thinking steps, and reads streamed responses. | Listener | External AI Service | `121-FR-001` to `121-FR-012` | `AIHostChat.jsx` (Terminal panel, thinking indicator, stream) | `121-conversational-interface` | **Implemented** (Frontend Agent UI) | [`UC-120-001`](./UC-120-001-converse-with-ai-music-host.md) |
| **UC-120-002** | Interpret Music Intent via Chat | Analyzes natural language prompts, decomposes compound commands, and extracts music entity slots with PII protection. | Listener | External AI Service | `122-FR-001` to `122-FR-012` | `AIHostChat.jsx` / `agentService.js` (Prompt bar, intent tags) | `122-music-intent-understanding` | **Implemented** (Clause Parser) | [`UC-120-002`](./UC-120-002-interpret-music-intent-via-chat.md) |
| **UC-120-003** | Execute Music Actions via Agent | Dispatches client tools to control playback, volume, queue, and likes, requesting confirmation for destructive actions. | Listener | External AI Service | `123-FR-001` to `123-FR-014` | `agentTools.js` / `AIHostChat.jsx` (Tool status, `[y/N]` prompt) | `123-real-time-music-assistance` | **Implemented** (Client Tools) | [`UC-120-003`](./UC-120-003-execute-music-actions-via-conversational-agent.md) |
| **UC-120-004** | Clear Conversation History | Clears current terminal session log and resets view to initial welcome banner using `/clear` command. | Listener | None | `121-FR-008` | `AIHostChat.jsx` (`/clear` command evaluation) | `121-conversational-interface` | **Implemented** (Client Command) | [`UC-120-004`](./UC-120-004-clear-conversation-history.md) |

---

## 3. Status Definitions

| Status | Definition |
|---|---|
| **Not Started** | Identified in requirements, but no specification document has been created. |
| **Draft** | Specification document drafted by author, reflecting verified requirements and current UI. |
| **In Review** | Under formal peer review on a pull request branch. |
| **Changes Requested** | Reviewer identified defects or unverified assumptions needing rework. |
| **Approved** | Formally accepted by peer reviewer and Group Owner for PA3 submission. |

---

## 4. Unconfirmed / Out-of-Scope Candidates

| Candidate ID | Proposed Capability | Reason for Exclusion / Current Status | Alternative Target Group |
|---|---|---|---|
| **CAND-120-A** | Voice Input and Audio Speech Synthesis | Real-time speech-to-text and voice conversation is noted as unconfirmed in Project Plan Section 2.3.1. The system baseline operates strictly as a text-based terminal conversational interface for MVP. | Future Release / Post-MVP |
| **CAND-120-B** | Cross-Session Server-Side Message Persistence | Long-term conversation archiving across distinct browser sessions requires adding server-side chat database tables. The current database schema stores no chat entities; conversational memory is strictly in-memory per session. | Database Schema v2 |

---

## 5. Traceability and Verification Matrix

| Spec Kit Feature | Verified Functional Requirements | Mapped Use Case(s) | UI Verification Evidence |
|---|---|---|---|
| **121-conversational-interface** | `121-FR-001` through `121-FR-012` | **UC-120-001**, **UC-120-004** | `specs/.../121/.../ui/` (6 screenshots), `AIHostChat.jsx` |
| **122-music-intent-understanding** | `122-FR-001` through `122-FR-012` | **UC-120-002** | `specs/.../122/.../ui/` (5 screenshots), `agentService.js` |
| **123-real-time-music-assistance** | `123-FR-001` through `123-FR-014` | **UC-120-003** | `specs/.../123/.../ui/` (5 screenshots), `agentTools.js` |
