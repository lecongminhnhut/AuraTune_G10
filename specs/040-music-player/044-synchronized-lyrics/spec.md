# Feature Specification: Synchronized Lyrics

**Feature ID**: `044-synchronized-lyrics`  
**Functional Group**: `040 – Music Player`  
**Status**: Specification Missing / Pending (Frontend UI Documented)

> [!NOTE]
> The formal feature specification (`spec.md`, `plan.md`, `tasks.md`) for Feature 044 was not previously authored or committed in the repository.
> In accordance with project constraints, no artificial business requirements or synthetic acceptance criteria have been invented.
> The UI screenshots and workflows documented below reflect the actual frontend implementation discovered at `src/frontend/src/components/player/FullScreenPlayer.jsx`, cross-referenced with `docs/proposal/proposal.md`.

---

## Documented Project Context

- **Proposal Reference**: `docs/proposal/proposal.md` (§ 5.1 & § 6.4):
  "Core music player — ... sync real-time lyrics..."
- **Real-Time Synchronization Mechanism**:
  In `FullScreenPlayer.jsx`, synchronized lyrics are indexed against playback elapsed time:
  `activeLyric = Math.max(0, track.lyrics?.findLastIndex((line) => elapsed >= line.time) ?? 0)`.
  The active lyric line is highlighted using high-contrast typography (`text-[19px] sm:text-[25px]` with a white gradient fill), while the preceding and succeeding lyric lines are rendered with diminished opacity (`text-white/30`, `text-white/40`) to create a fluid, karaoke-style focus effect.
- **Unavailable Lyrics Handling**:
  For tracks that do not have synchronized timecoded lyric arrays in the catalog dataset, the interface gracefully falls back to displaying a friendly notice: "Bản xem trước này chưa có lời bài hát."

---

## UI Screenshots

### 1. Synchronized Lyrics Panel Layout

This screenshot captures the FullScreenPlayer with the "Lời bài hát" (Lyrics) tab active. The layout presents the uppercase header "TRONG KHOẢNG KHẮC NÀY", displaying the current synchronized verse in focus beside the spinning vinyl turntable.

![Synchronized Lyrics Panel Layout](ui/01-lyrics-panel-entry.png)

### 2. Synchronized Active Lyric Line Highlighting

This screenshot shows the synchronized lyric line ("Ly cà phê nguội bên khung cửa") at timestamp `0:02` of "Midnight Coffee". The current sung line is prominently enlarged with glowing gradient text, providing immediate visual reinforcement of the audio playback.

![Synchronized Active Lyric Line Highlighting](ui/02-synchronized-lyrics-active-line.png)

### 3. Lyrics Progression During Continuous Playback

This screenshot illustrates real-time lyric advancement as playback progresses to timestamp `0:10`. The active line smoothly transitions to the second lyric verse ("Thành phố ngủ, chỉ còn tiếng mưa"), shifting the previous line upwards with reduced opacity.

![Lyrics Progression During Continuous Playback](ui/03-synchronized-lyrics-progression.png)

### 4. Unavailable Synchronized Lyrics Fallback State

This screenshot captures the interface behavior when playing a song that currently lacks timecoded lyric data (e.g., "Nàng thơ"). The lyrics panel displays the fallback guidance message: "Bản xem trước này chưa có lời bài hát." without breaking layout integrity.

![Unavailable Synchronized Lyrics Fallback State](ui/04-lyrics-unavailable-state.png)
