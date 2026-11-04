# Prototype and UI Asset Guide – Group 080: Album

---

## 1. Purpose

This document defines the organization, conventions, and status of user interface prototypes and mockups for **Group 080 – Album**. It bridges the gap between behavioral specifications (Use Cases) and visual user experience design, facilitating PA3 deliverables and stakeholder reviews.

---

## 2. Prototype Directory Organization

All graphical assets for Group 080 reside directly in this directory:
`docs/requirements/use-cases/080-album/prototypes/`

### Asset Naming Convention
Image files follow a standardized, predictable naming scheme tied directly to Use Case IDs and operational flows:

$$\text{UC-080-[SEQUENCE]-[description].png}$$

- **Basic Flow Assets**: `UC-080-[SEQUENCE]-basic-flow-[description].png` or simply `UC-080-[SEQUENCE]-[description].png`
- **Alternative Flow Assets**: `UC-080-[SEQUENCE]-[AF-description].png`
- **Exception Flow Assets**: `UC-080-[SEQUENCE]-[EF-description].png`

---

## 3. Prototype vs. Implementation Distinction

In accordance with project engineering standards:
1. **Design Prototypes / Wireframes**: High-fidelity interface designs derived from the Spec Kit UI specifications.
2. **Actual Implementation Screenshots**: Captured directly from the running web client (`src/frontend/`) once frontend features are integrated with backend API endpoints.
3. **Current Status**: All images currently stored in this directory are **Actual Implemented UIs** captured from the working frontend application for Sprint 3 (PA3).

---

## 4. Prototype Inventory and Mapping

| Use Case ID | Flow / Step | Image File | Source Spec Asset | Status | Description |
|---|---|---|---|---|---|
| **UC-080-001** | Basic Flow (Header) | `UC-080-001-album-details.png` | `081/.../01-album-details.png` | **Available** | Album Details page header displaying responsive cover art, album title, artist, year, track count, total duration, and action toolbar. |
| **UC-080-001** | Basic Flow (Metadata) | `UC-080-001-album-metadata.png` | `081/.../02-album-metadata.png` | **Available** | Album release metadata and copyright footer, alongside the "More from Artist" related releases section. |
| **UC-080-001** | Basic Flow (Tracklist) | `UC-080-001-album-track-play-counts.png` | `081/.../03-album-track-play-counts.png` | **Available** | Individual track rows displaying index, title, artist, play counts (locale formatted), durations, and hover actions. |
| **UC-080-001** | EX-01 (Not Found) | `UC-080-001-album-error-state.png` | `081/.../05-album-error-state.png` | **Available** | Empty state displayed when requesting a nonexistent album ID ("Không tìm thấy album"). |
| **UC-080-002** | Basic Flow (Tracklist) | `UC-080-002-album-tracklist.png` | `082/.../01-album-tracklist.png` | **Available** | Complete album tracklist displayed in artist-intended order, ready for playback initiation. |
| **UC-080-002** | Basic Flow (Play Action) | `UC-080-002-play-album.png` | `082/.../02-play-album.png` | **Available** | Play Album action activated, starting playback from track #1 and updating the persistent player. |
| **UC-080-002** | AF-01 (Play Selected) | `UC-080-002-selected-track-playing.png` | `082/.../03-selected-track-playing.png` | **Available** | Playback initiated directly from a selected track row, making it active and updating the player. |
| **UC-080-002** | Basic Flow (Queue) | `UC-080-002-album-queue.png` | `082/.../04-album-queue.png` | **Available** | Queue Management drawer open during album playback, showing remaining album tracks properly sequenced. |
| **UC-080-003** | Basic Flow (Save Action) | `UC-080-003-album-save-action.png` | `083/.../01-album-save-action.png` | **Available** | Album detail action toolbar showing the "Lưu album" button prior to bookmarking. |
| **UC-080-003** | Basic Flow (Saved State) | `UC-080-003-album-saved-state.png` | `083/.../02-album-saved-state.png` | **Available** | Action toolbar showing "Đã lưu" active state (BookmarkCheck icon, violet styling) with confirmation toast. |
| **UC-080-003** | AF-01 (Share Action) | `UC-080-003-album-share-action.png` | `083/.../03-album-share-action.png` | **Available** | Action toolbar showing the "Chia sẻ album" button. |
| **UC-080-003** | EX-03 (Share Error) | `UC-080-003-album-share-result.png` | `083/.../04-album-share-result.png` | **Available** | Error toast notification displayed when native sharing fails or is blocked. |

---

## 5. Guidelines for Linking Prototypes in Use-Case Specifications

When authoring or updating Use-Case Specifications (`UC-080-*.md`):
1. **Relative Markdown Image Path**: Reference images located in this folder using `prototypes/[filename].png`.
   ```markdown
   ![Album Details](prototypes/UC-080-001-album-details.png)
    **Covered steps:** Basic Flow steps 5.
    **Prototype type:** Implemented UI
   ```
2. **Pending Assets**: For flows where a visual wireframe has not yet been designed, do not create fake or placeholder images. Explicitly annotate the section as `[Prototype Pending - To be generated during UI implementation]`.
3. **Accessibility**: Always provide descriptive Markdown alternative text explaining what the screenshot depicts.