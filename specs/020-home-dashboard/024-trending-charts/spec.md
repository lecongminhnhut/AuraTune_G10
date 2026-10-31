# Feature Specification: Trending Charts

**Feature ID**: `024-trending-charts`  
**Functional Group**: `020 – Home Dashboard`  
**Status**: Specification Missing / Pending (Frontend UI Documented)

> [!NOTE]
> The formal feature specification (`spec.md`, `plan.md`, `tasks.md`) for Feature 024 was not previously authored or committed in the repository.
> In accordance with project constraints, no artificial business requirements or synthetic acceptance criteria have been invented.
> The UI screenshots and workflows documented below reflect the actual frontend implementation discovered at `src/frontend/src/pages/Home/HomePage.jsx`, `src/frontend/src/components/song/SongRow.jsx`, and `src/frontend/src/pages/Charts/ChartsPage.jsx`, cross-referenced with `docs/proposal/proposal.md` and `docs/analysis-and-design/api-contract.md`.

---

## Documented Project Context

- **Proposal Reference**: `docs/proposal/proposal.md` (§ 5.1 & § 6.2):
  "Home dashboard — browse trending charts and new albums... automatically aggregating AI-recommended playlists, trending charts, and recently played tracks into a single, organized interface."
- **API Contract Reference**: `docs/analysis-and-design/api-contract.md`:
  - `GET /songs/popular` (Role: Public, Popular / trending tracks)
  - `GET /songs` (Role: Public, Query parameter: `sort`)
- **Data Source & Ranking Disclosure**:
  In the current frontend implementation, trending songs on the Home Dashboard are derived from `publicTracks` sorted descending by recorded play count (`playCount`) in `src/frontend/src/pages/Home/HomePage.jsx`. The top 5 tracks are presented. All popularity counts and ranking orders reflect the seed dataset in `src/frontend/src/utils/mockData.js`. No backend ranking algorithms, streaming time windows, or synthetic popularity scores were fabricated.

---

## UI Screenshots

### 1. Trending Charts Section on Home Dashboard

This screenshot captures the "Đang được yêu thích" trending charts section on the Home Dashboard. It displays the top 5 trending songs on AuraTune, featuring sequential rank numbers (01 to 05), song artwork, track title, artist link, album link, total play counts (e.g., "1.200.000 lượt nghe"), and song duration.

![Trending Charts Section on Home Dashboard](ui/01-trending-charts-section.png)

### 2. Trending Song Row Hover Interaction

This screenshot documents the user interaction when hovering a mouse cursor over a trending song row (#1 "Nàng thơ"). The static rank index dynamically transforms into a Play button, and action controls (like heart icon, download button) become visible for direct interaction.

![Trending Song Row Hover Interaction](ui/02-trending-song-hover-interaction.png)

### 3. Trending Song Playback Active State

This screenshot illustrates the active playback state when a trending song is selected. The active track row is prominently highlighted with violet accents, and the persistent BottomPlayer updates with the track artwork, playback progress, volume, and playback controls.

![Trending Song Playback Active State](ui/03-trending-song-playback-active.png)

### 4. Navigation to Full Charts Page

This screenshot captures the full Charts Page view (`/charts`) reached by clicking the "Bảng xếp hạng" action in the section header. The dedicated charts page presents the complete Top bài hát AuraTune rankings, genre filtering tabs ("Tất cả", "Pop", "Ballad", "Indie", "R&B", "Hip-hop"), and a "Phát bảng xếp hạng" batch playback button.

![Navigation to Full Charts Page](ui/04-trending-charts-full-page-navigation.png)
