# Feature Specification: Playback Controls

**Feature ID**: `041-playback-controls`  
**Functional Group**: `040 – Music Player`  
**Status**: Specification Missing / Pending (Frontend UI Documented)

> [!NOTE]
> The formal feature specification (`spec.md`, `plan.md`, `tasks.md`) for Feature 041 was not previously authored or committed in the repository.
> In accordance with project constraints, no artificial business requirements or synthetic acceptance criteria have been invented.
> The UI screenshots and workflows documented below reflect the actual frontend implementation discovered at `src/frontend/src/components/player/BottomPlayer.jsx`, `src/frontend/src/components/player/FullScreenPlayer.jsx`, and `src/frontend/src/hooks/useMockPlayer.js`, cross-referenced with `docs/proposal/proposal.md` and `docs/analysis-and-design/api-contract.md`.

---

## Documented Project Context

- **Proposal Reference**: `docs/proposal/proposal.md` (§ 5.1 & § 6.4):
  "Core music player — play/pause/skip/seek, adjust volume, sync real-time lyrics, shuffle/repeat, share, comment on tracks."
- **API Contract Reference**: `docs/analysis-and-design/api-contract.md`:
  - `GET /songs/:id` (Role: Public, Song details)
  - `GET /songs/:id/stream` (Role: Public, Stream audio file with `Range` header support)
- **Data Source & Playback Engine Disclosure**:
  In the current frontend implementation, playback state is managed through `src/frontend/src/hooks/useMockPlayer.js` and provided across the application via `PlayerContext.jsx`. The development environment runs a simulated playback timer with sample audio metadata from `mockData.js`. Actual audio decoding and HTTP Range-based chunk streaming will connect to the backend streaming endpoint upon production deployment.

---

## UI Screenshots

### 1. Player Initial State in Bottom Player

This screenshot captures the persistent BottomPlayer in its initial idle / paused state docked at the bottom of the screen. It displays the current loaded song artwork, title ("Giai điệu mùa thu"), artist ("AuraTune Studio"), a circular white Play button, previous and next track controls, and the compact waveform seek bar.

![Player Initial State in Bottom Player](ui/01-player-initial-bottom-bar.png)

### 2. Player Active Playing State

This screenshot illustrates the active playback state in the BottomPlayer. Upon clicking the Play button, playback initiates, the central control dynamically transitions from a Play icon to a Pause icon, and the waveform progress begins filling with white indicators.

![Player Active Playing State](ui/02-player-playing-state.png)

### 3. Player Paused State

This screenshot demonstrates the paused playback state. When the listener clicks the Pause button, playback suspends at the current position, the icon reverts back to the Play symbol, and progress increments halt.

![Player Paused State](ui/03-player-paused-state.png)

### 4. Next Track Transition

This screenshot captures the transition to the next song in the active queue when clicking the Next Track button (`SkipForward`). The player immediately loads the next track ("Nàng thơ" · Hoàng Dũng), updating the title, artist metadata, and cover art seamlessly.

![Next Track Transition](ui/04-player-next-track.png)

### 5. Previous Track Transition

This screenshot shows the transition when selecting the Previous Track button (`SkipBack`), navigating back to the preceding track in the listening queue.

![Previous Track Transition](ui/05-player-previous-track.png)

### 6. Full-Screen Player Controls Interface

This screenshot captures the expanded FullScreenPlayer interface (`FullScreenPlayer.jsx`). It showcases the vinyl tonearm deck (`RecordDeck.jsx`), song typography, and the dedicated playback controls cluster featuring central play/pause, skip controls, and quick action buttons.

![Full-Screen Player Controls Interface](ui/06-player-fullscreen-controls.png)
