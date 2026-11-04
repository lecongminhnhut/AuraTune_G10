# Prototype and UI Asset Guide – Group 030: Search

---

## 1. Purpose

This document defines the organization, conventions, and status of user interface prototypes and mockups for **Group 030 – Search**. It bridges the gap between behavioral specifications (Use Cases) and visual user experience design, facilitating PA3 deliverables and stakeholder reviews.

---

## 2. Prototype Directory Organization

All graphical assets for Group 030 reside directly in this directory:
`docs/requirements/use-cases/030-search/prototypes/`

### Asset Naming Convention
Image files follow a standardized, predictable naming scheme tied directly to Use Case IDs and operational flows:

$$\text{UC-030-[SEQUENCE]-[description].png}$$

- **Basic Flow Assets**: `UC-030-[SEQUENCE]-[description].png`
- **Alternative Flow Assets**: `UC-030-[SEQUENCE]-[AF-description].png` (or contextually named, e.g., `-category-tracks.png`)
- **Exception Flow Assets**: `UC-030-[SEQUENCE]-[EF-description].png` (or contextually named, e.g., `-error-state.png`)

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
| **UC-030-001** | Basic Flow (Entry) | `UC-030-001-metadata-search-entry.png` | `031/.../01-metadata-search-entry.png` | **Available** | Initial `/search` view prior to query entry showing category browsing options. |
| **UC-030-001** | Basic Flow (Results) | `UC-030-001-metadata-search-results-all.png` | `031/.../02-metadata-search-results-all.png` | **Available** | Match results displayed across multiple entity types on the "Tất cả" (All) tab. |
| **UC-030-001** | AF-04 (Songs Filter) | `UC-030-001-metadata-search-category-tracks.png` | `031/.../03-metadata-search-category-tracks.png` | **Available** | Results scoped specifically to Songs (`type=tracks`). |
| **UC-030-001** | AF-04 (Albums Filter) | `UC-030-001-metadata-search-category-albums.png` | `031/.../05-metadata-search-category-albums.png` | **Available** | Results scoped specifically to Albums (`type=albums`). |
| **UC-030-001** | AF-04 (Artists Filter) | `UC-030-001-metadata-search-category-artists.png` | `031/.../04-metadata-search-category-artists.png` | **Available** | Results scoped specifically to Artists (`type=artists`). |
| **UC-030-001** | AF-04 (Playlists Filter) | `UC-030-001-metadata-search-category-playlists.png` | `031/.../06-metadata-search-category-playlists.png` | **Available** | Results scoped specifically to Playlists (`type=playlists`). |
| **UC-030-001** | AF-05 (Sorting) | `UC-030-001-metadata-search-sorting-plays.png` | `031/.../07-metadata-search-sorting-plays.png` | **Available** | Sorting dropdown reordering the result set by play count. |
| **UC-030-001** | AF-03 (Empty State) | `UC-030-001-metadata-search-empty-state.png` | `031/.../08-metadata-search-empty-state.png` | **Available** | Friendly empty-state card rendered when zero database records match the keyword. |
| **UC-030-001** | Basic Flow (Playback) | `UC-030-001-metadata-search-track-playback.png` | `031/.../09-metadata-search-track-playback.png` | **Available** | Hovering over a song result displays playback and secondary action controls. |
| **UC-030-002** | Basic Flow (Tab Entry) | `UC-030-002-lyrics-search-tab-entry.png` | `032/.../01-lyrics-search-tab-entry.png` | **Available** | Dedicated "Theo lời bài hát" category tab active on the Search Page. |
| **UC-030-002** | Basic Flow (Results) | `UC-030-002-lyrics-search-results.png` | `032/.../02-lyrics-search-results.png` | **Available** | Search results matching a remembered lyric fragment, highlighting the matching lyric line. |
| **UC-030-002** | Basic Flow (Multi-Match) | `UC-030-002-lyrics-search-multiple-matches.png` | `032/.../03-lyrics-search-multiple-matches.png` | **Available** | Multiple song results returned for a single lyric query, demonstrating semantic matching. |
| **UC-030-002** | Basic Flow (Playback) | `UC-030-002-lyrics-search-track-playback.png` | `032/.../04-lyrics-search-track-playback.png` | **Available** | Hovering over a returned lyric result displays playback and secondary action controls. |
| **UC-030-002** | AF-02 (No Results) | `UC-030-002-lyrics-search-no-results.png` | `032/.../05-lyrics-search-no-results.png` | **Available** | Explicit empty state rendered when no synchronized lyrics match the query. |
| **UC-030-002** | EF-01 (Fallback Banner) | `UC-030-002-lyrics-search-fallback-banner.png` | `032/.../06-lyrics-search-fallback-banner.png` | **Available** | Graceful degradation state showing the amber dismissible fallback banner. |
| **UC-030-003** | Basic Flow (Entry) | `UC-030-003-semantic-search-entry.png` | `033/.../01-semantic-search-entry.png` | **Available** | Semantic Search Entry in Top Navigation. |
| **UC-030-003** | Basic Flow (Dropdown) | `UC-030-003-semantic-search-live-dropdown.png` | `033/.../02-semantic-search-live-dropdown.png` | **Available** | Live Natural-Language Dropdown Suggestions. |
| **UC-030-003** | Basic Flow (Full Results) | `UC-030-003-semantic-search-results-page.png` | `033/.../03-semantic-search-results-page.png` | **Available** | Full Semantic Search Results with AI Understanding Card. |
| **UC-030-003** | Basic Flow (Context) | `UC-030-003-semantic-search-mood-energy.png` | `033/.../04-semantic-search-mood-energy.png` | **Available** | Semantic Search matching an Energetic Context ("vui năng lượng"). |
| **UC-030-003** | EF-01 (Degradation) | `UC-030-003-semantic-search-fallback-mode.png` | `033/.../05-semantic-search-fallback-mode.png` | **Available** | Semantic Search Fallback Mode indicating keyword search is in use. |
| **UC-030-003** | Basic Flow (Playback) | `UC-030-003-semantic-search-result-playback.png` | `033/.../06-semantic-search-result-playback.png` | **Available** | Semantic Result Playback Interaction. |

---

## 5. Guidelines for Linking Prototypes in Use-Case Specifications

When authoring or updating Use-Case Specifications (`UC-030-*.md`):
1. **Relative Markdown Image Path**: Reference images located in this folder using `prototypes/[filename].png`.
   ```markdown
   ![Metadata Search Entry](prototypes/UC-030-001-metadata-search-entry.png)
    **Covered steps:** Basic Flow steps 1-2.
    **Prototype type:** Implemented UI
    ```