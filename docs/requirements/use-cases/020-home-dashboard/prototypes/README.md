# Prototype and UI Asset Guide – Group 020: Home Dashboard

---

## 1. Purpose

This document defines the organization, conventions, and status of user interface prototypes and screenshots for **Group 020 – Home Dashboard**. It connects the behavioral specifications (Use Cases) with the visual user experience, supporting PA3 deliverables and stakeholder reviews.

---

## 2. Prototype Directory Organization

All graphical assets for Group 020 reside directly in this directory:
`docs/requirements/use-cases/020-home-dashboard/prototypes/`

### Asset Naming Convention
Image files follow a standardized naming scheme tied to Use Case IDs and flows:

$$\text{UC-020-[SEQUENCE]-[flow-indicator]-[description].png}$$

- **Basic Flow Assets**: `UC-020-[SEQUENCE]-basic-flow[-step].png`
- **Alternative Flow Assets**: `UC-020-[SEQUENCE]-AF-[NN]-[description].png`
- **Exception Flow Assets**: `UC-020-[SEQUENCE]-EF-[NN]-[description].png`

---

## 3. Prototype vs. Implementation Distinction

In accordance with project engineering standards:
1. **Design Prototypes / Wireframes**: Interface designs that show intended layout and interaction states before or during implementation.
2. **Actual Implementation Screenshots**: Captured directly from the running web client (`src/frontend/`).
3. **Current Status**: All images in this directory are **implementation screenshots of the current frontend prototype**, copied from `specs/020-home-dashboard/*/ui/`. The prototype runs on demo data and is not yet connected to the backend API, so these images are not finished production screens.

---

## 4. Prototype Inventory and Mapping

| Use Case ID | Flow / Step | Image File | Source Spec Asset | Status | Description |
|---|---|---|---|---|---|
| **UC-020-001** | Basic Flow (Guest) | `UC-020-001-basic-flow-guest.png` | `021/ui/01-home-dashboard-initial.png` | **Available** | Home for a guest with sidebar, top bar, hero, quick access, and mini player. |
| **UC-020-001** | Basic Flow (Listener) | `UC-020-001-basic-flow-listener.png` | `021/ui/02-home-dashboard-authenticated.png` | **Available** | Personalized greeting and shortcuts for a signed-in listener. |
| **UC-020-001** | Basic Flow (Top Sections) | `UC-020-001-basic-flow-sections-top.png` | `021/ui/03-home-content-organization-top.png` | **Available** | Hero, recommended content, and new albums. |
| **UC-020-001** | Basic Flow (Middle Sections) | `UC-020-001-basic-flow-sections-mid.png` | `021/ui/04-home-content-organization-mid.png` | **Available** | Popular tracks and featured artists. |
| **UC-020-001** | Basic Flow (Bottom Sections) | `UC-020-001-basic-flow-sections-bottom.png` | `021/ui/05-home-content-organization-bottom.png` | **Available** | Curated playlists and genres. |
| **UC-020-001** | AF-01 (Full Destination) | `UC-020-001-AF-01-section-navigation.png` | `021/ui/06-home-navigation-explore-and-back.png` | **Available** | Section actions and sidebar navigation. |
| **UC-020-001** | AF-03 (Phone Layout) | `UC-020-001-AF-03-phone-layout.png` | `021/ui/07-home-mobile-layout.png` | **Available** | Home at 375 px wide. |
| **UC-020-001** | EF-01 / EF-02 (Failures) | `Pending` | `N/A` | **Pending** | Per-section fallback and page-level error with retry. |
| **UC-020-002** | Basic Flow (Overview) | `UC-020-002-basic-flow.png` | `022/ui/01-recommended-content-overview.png` | **Available** | Hero mix and recommended content section. |
| **UC-020-002** | Basic Flow (Card Focus) | `UC-020-002-basic-flow-card-focus.png` | `022/ui/02-recommended-playlist-card-hover.png` | **Available** | Focused recommended card with play action. |
| **UC-020-002** | Basic Flow (Playback) | `UC-020-002-basic-flow-playback.png` | `022/ui/03-recommended-playlist-playback.png` | **Available** | Playback started from recommended content. |
| **UC-020-002** | Basic Flow (Curated Playlists) | `UC-020-002-curated-playlists.png` | `022/ui/05-recommended-categories-curated-moods.png` | **Available** | Curated playlist section using the same playback entry point. |
| **UC-020-002** | AF-01 (Open Item) | `UC-020-002-AF-01-playlist-detail.png` | `022/ui/04-recommended-playlist-detail-navigation.png` | **Available** | Playlist details opened from a recommended card. |
| **UC-020-002** | AF-04 (Over 50 Tracks) | `Pending` | `N/A` | **Pending** | Notice that only the first 50 tracks were added to the queue. |
| **UC-020-002** | EF-01 (AI Unavailable) | `UC-020-002-EF-01-ai-fallback.png` | `022/ui/06-recommended-content-fallback-state.png` | **Available** | Popular fallback with a short notice. |
| **UC-020-003** | Basic Flow (Recent Tracks) | `UC-020-003-basic-flow.png` | `023/ui/01-recently-played-section-authenticated.png` | **Available** | Recent tracks in the quick access area. |
| **UC-020-003** | Basic Flow (Playback) | `UC-020-003-basic-flow-playback.png` | `023/ui/02-recently-played-track-playback.png` | **Available** | Playback started from a recent track. |
| **UC-020-003** | AF-01 (Guest) | `UC-020-003-AF-01-guest-shortcuts.png` | `023/ui/03-recently-played-guest-state.png` | **Available** | Suggested shortcuts for a guest. |
| **UC-020-003** | AF-02 (No History) | `UC-020-003-AF-02-no-history.png` | `023/ui/04-recently-played-empty-state.png` | **Available** | Suggested shortcuts for a listener with no history. |
| **UC-020-003** | AF-03 (Full History) | `UC-020-003-AF-03-full-history.png` | `023/ui/05-recently-played-full-history-navigation.png` | **Available** | Listening history page opened from Home. |
| **UC-020-003** | EF-01 (History Unavailable) | `Pending` | `N/A` | **Pending** | Fallback when history cannot be retrieved. |
| **UC-020-004** | Basic Flow (Home Preview) | `UC-020-004-basic-flow.png` | `024/ui/01-trending-charts-section.png` | **Available** | Top 5 popular tracks on Home. |
| **UC-020-004** | Basic Flow (Row Focus) | `UC-020-004-basic-flow-row-focus.png` | `024/ui/02-trending-song-hover-interaction.png` | **Available** | Focused chart row with actions. |
| **UC-020-004** | Basic Flow (Playback) | `UC-020-004-basic-flow-playback.png` | `024/ui/03-trending-song-playback-active.png` | **Available** | Ranked track playing. |
| **UC-020-004** | AF-01 (Charts Page) | `UC-020-004-AF-01-full-charts.png` | `024/ui/04-trending-charts-full-page-navigation.png` | **Available** | Charts page with the top 20 tracks. |
| **UC-020-004** | AF-02 (Genre Filter) | `UC-020-004-AF-02-genre-filter.png` | `024/ui/05-charts-genre-filter.png` | **Available** | Charts filtered by genre. |
| **UC-020-004** | AF-03 (Period) | `Pending` | `N/A` | **Pending** | Day, week, and month period selector, not yet implemented. |
| **UC-020-004** | EF-01 / EF-02 | `Pending` | `N/A` | **Pending** | Empty chart and error with retry. |
| **UC-020-005** | Basic Flow (Section) | `UC-020-005-basic-flow.png` | `025/ui/01-new-releases-section.png` | **Available** | New albums, newest first. |
| **UC-020-005** | Basic Flow (Card Focus) | `UC-020-005-basic-flow-card-focus.png` | `025/ui/02-new-album-card-hover.png` | **Available** | Focused album card with play action. |
| **UC-020-005** | Basic Flow (Playback) | `UC-020-005-basic-flow-playback.png` | `025/ui/03-new-album-direct-playback.png` | **Available** | Album played directly from its card. |
| **UC-020-005** | AF-01 (Album Page) | `UC-020-005-AF-01-album-detail.png` | `025/ui/04-new-album-detail-navigation.png` | **Available** | Album page opened from the card. |
| **UC-020-005** | AF-02 (Explore) | `UC-020-005-AF-02-explore.png` | `025/ui/05-new-releases-explore-navigation.png` | **Available** | Explore page opened from the section action. |
| **UC-020-005** | AF-04 (Over 50 Tracks) | `Pending` | `N/A` | **Pending** | Notice that only the first 50 tracks were added to the queue. |
| **UC-020-005** | EF-01 (Nothing Playable) | `Pending` | `N/A` | **Pending** | Message when an album has no available track. |

---

## 5. Guidelines for Linking Prototypes in Use-Case Specifications

When authoring or updating Use-Case Specifications (`UC-020-*.md`):
1. **Relative Markdown Image Path**: Reference images in this folder using `prototypes/[filename].png`.
   ```markdown
   ![Home Dashboard for a guest](prototypes/UC-020-001-basic-flow-guest.png)
   *Figure 1: Home Dashboard for a guest.*
   ```
2. **Pending Assets**: For flows without a visual asset, do not create fake or placeholder images. Annotate the section as `[Prototype Pending - To be generated during UI implementation]`.
3. **Accessibility**: Always provide descriptive alternative text explaining what the screenshot depicts.
