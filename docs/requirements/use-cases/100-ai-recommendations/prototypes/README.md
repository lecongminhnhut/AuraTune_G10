# Prototype and UI Asset Guide – Group 100: AI Recommendations

---

## 1. Purpose

This document defines the organization, conventions, and status of user interface prototypes and mockups for **Group 100 – AI Recommendations**. It bridges the gap between behavioral specifications (Use Cases) and visual user experience design, facilitating PA3 deliverables and stakeholder reviews.

---

## 2. Prototype Directory Organization

All graphical assets for Group 100 reside directly in this directory:
`docs/requirements/use-cases/100-ai-recommendations/prototypes/`

### Asset Naming Convention
Image files follow a standardized, predictable naming scheme tied directly to Use Case IDs and operational flows:

$$\text{UC-100-[SEQUENCE]-[flow-indicator]-[description].png}$$

- **Basic Flow Assets**: `UC-100-[SEQUENCE]-basic-flow[-step].png`
- **Alternative Flow Assets**: `UC-100-[SEQUENCE]-AF-[NN]-[description].png`
- **Exception Flow Assets**: `UC-100-[SEQUENCE]-EF-[NN]-[description].png`

---

## 3. Prototype vs. Implementation Distinction

In accordance with project engineering standards:
1. **Design Prototypes / Wireframes**: High-fidelity interface designs derived from the Spec Kit UI specifications (`specs/100-ai-recommendations/*/ui/`). These represent intended visual hierarchy, layout components, and interaction states prior to or during implementation.
2. **Actual Implementation Screenshots**: Captured directly from the running web client (`src/frontend/`) once frontend features are integrated with backend API endpoints.
3. **Current Status**: All images currently stored in this directory are **Design Wireframes / Prototypes** validated during the Spec Kit design phase. They demonstrate the target visual contract for Sprint 3 (PA3).

---

## 4. Prototype Inventory and Mapping

| Use Case ID | Flow / Step | Image File | Source Spec Asset | Status | Description |
|---|---|---|---|---|---|
| **UC-100-001** | Basic Flow (Overview) | `UC-100-001-basic-flow.png` | `101/.../01-listening-analysis-overview.png` | **Available** | Listening analytics dashboard on `/history` (Thống kê tab), showing metric summaries, time filters, and top genres. |
| **UC-100-001** | Basic Flow (Metric Card) | `UC-100-001-total-duration.png` | `101/.../02-total-listening-duration.png` | **Available** | Metric card showing total listening duration, play counts, and unique tracks. |
| **UC-100-001** | Basic Flow (Top Genres) | `UC-100-001-top-genres.png` | `101/.../03-top-genres.png` | **Available** | Ranked list of genres ordered by accumulated listening duration with progress bars. |
| **UC-100-001** | AF-01 (Insufficient Data) | `UC-100-001-AF-01-insufficient-history.png` | `101/.../04-insufficient-history.png` | **Available** | Empty state displayed when account has fewer than 1 eligible listening record. |
| **UC-100-001** | EF-01 (Unauthenticated) | `UC-100-001-EF-01-login-required.png` | `101/.../05-analysis-unavailable.png` | **Available** | Access denied / login required prompt when guest accesses private analytics. |
| **UC-100-002** | Basic Flow (Home Entry) | `UC-100-002-basic-flow-entry.png` | `102/.../01-personalized-recommendations-entry.png` | **Available** | "Gợi ý cho bạn" recommendation section embedded on the Home Dashboard. |
| **UC-100-002** | Basic Flow (Entity Feed) | `UC-100-002-basic-flow-list.png` | `102/.../02-personalized-recommendations-list.png` | **Available** | Multi-entity recommendation cards (Songs, Albums, Artists, Playlists). |
| **UC-100-002** | Basic Flow (Item Action) | `UC-100-002-item-selection.png` | `102/.../03-personalized-recommendation-details.png` | **Available** | Interactive selection card triggering playback or detail navigation. |
| **UC-100-002** | AF-01 (Cold Start) | `Pending` | `N/A` | **Pending** | Trending / popular fallback feed for new accounts with 0 listening history. |
| **UC-100-002** | EF-01 (Service Outage) | `Pending` | `N/A` | **Pending** | Graceful degradation notification banner when AI engine is offline. |
| **UC-100-003** | Basic Flow (Discovery Entry) | `UC-100-003-basic-flow-entry.png` | `103/.../01-mood-recommendations-entry.png` | **Available** | Mood & Context Discovery hub on the Discovery view. |
| **UC-100-003** | Basic Flow (Mood Selection) | `UC-100-003-mood-selection.png` | `103/.../02-mood-selection.png` | **Available** | Curated mood preset chips: Chill, Energetic, Melancholy, Focus. |
| **UC-100-003** | Basic Flow (Context Selection) | `UC-100-003-context-selection.png` | `103/.../03-context-recommendations.png` | **Available** | Curated context preset chips: Study, Workout, Late Night, Commute. |
| **UC-100-003** | Basic Flow (Results Stream) | `UC-100-003-recommendation-results.png` | `103/.../04-recommendation-results.png` | **Available** | Filtered stream of recommended songs and themed mood playlists. |
| **UC-100-003** | AF-01 (Empty Results) | `Pending` | `N/A` | **Pending** | Friendly empty state with alternative mood suggestion chips. |
| **UC-100-003** | EF-01 (AI Timeout) | `Pending` | `N/A` | **Pending** | Informative unavailable state when vector recommendation service times out. |

---

## 5. Guidelines for Linking Prototypes in Use-Case Specifications

When authoring or updating Use-Case Specifications (`UC-100-*.md`):
1. **Relative Markdown Image Path**: Reference images located in this folder using `prototypes/[filename].png`.
   ```markdown
   ![Basic Flow Overview](prototypes/UC-100-001-basic-flow.png)
   *Figure 1: Listening analytics dashboard overview.*
   ```
2. **Pending Assets**: For flows where a visual wireframe has not yet been designed, do not create fake or placeholder images. Explicitly annotate the section as `[Prototype Pending - To be generated during UI implementation]`.
3. **Accessibility**: Always provide descriptive Markdown alternative text explaining what the screenshot depicts.
