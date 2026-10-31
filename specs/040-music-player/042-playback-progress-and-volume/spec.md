# Feature Specification: Playback Progress and Volume

**Feature ID**: `042-playback-progress-and-volume`  
**Functional Group**: `040 – Music Player`  
**Status**: Specification Missing / Pending (Frontend UI Documented)

> [!NOTE]
> The formal feature specification (`spec.md`, `plan.md`, `tasks.md`) for Feature 042 was not previously authored or committed in the repository.
> In accordance with project constraints, no artificial business requirements or synthetic acceptance criteria have been invented.
> The UI screenshots and workflows documented below reflect the actual frontend implementation discovered at `src/frontend/src/components/player/WaveformSeekBar.jsx`, `src/frontend/src/components/player/BottomPlayer.jsx`, and `src/frontend/src/components/player/FullScreenPlayer.jsx`, cross-referenced with `docs/proposal/proposal.md` and `docs/analysis-and-design/api-contract.md`.

---

## Documented Project Context

- **Proposal Reference**: `docs/proposal/proposal.md` (§ 5.1 & § 6.4):
  "Core music player — play/pause/skip/seek, adjust volume..."
- **API Contract Reference**: `docs/analysis-and-design/api-contract.md`:
  - `GET /songs/:id/stream` (Role: Public, Stream audio file supporting `Range` headers for seeking and progressive buffering)
- **Component Implementation Details**:
  - Waveform Progress Bar: Implemented in `WaveformSeekBar.jsx` using dynamic height-weighted audio waveform bars and an accessible overlay range slider (`input[type="range"]`).
  - Volume & Mute Controls: Integrated into both `BottomPlayer.jsx` and `FullScreenPlayer.jsx`, featuring mute toggle buttons and volume sliders from 0 to 100%.

---

## UI Screenshots

### 1. Playback Progress at Beginning (0:00)

This screenshot captures the compact waveform seek bar in the BottomPlayer at the beginning of a track (`0:00` / `4:21`). The waveform bars remain in their unfilled, dimmed state indicating playback has not yet commenced.

![Playback Progress at Beginning](ui/01-playback-progress-start.png)

### 2. Playback Progress During Active Playback

This screenshot illustrates the waveform seek bar advancing during playback. The waveform segments progressively fill with solid white color corresponding to the elapsed time ratio, and the numerical timestamp updates in real time.

![Playback Progress During Active Playback](ui/02-playback-progress-playing.png)

### 3. Seeking to an Advanced Playback Position

This screenshot captures the seeking interaction in the FullScreenPlayer. Dragging the waveform seek bar jumps playback immediately to the target timestamp (`2:30` of `4:21`), updating the waveform fill state and time indicators synchronously.

![Seeking to an Advanced Playback Position](ui/03-playback-seeking-position.png)

### 4. Volume Adjustment in Full-Screen Player

This screenshot shows volume control adjustment in the FullScreenPlayer controls tray. The volume slider is set to high volume (95%), providing granular auditory control for the listener.

![Volume Adjustment in Full-Screen Player](ui/04-volume-control-adjustment.png)

### 5. Volume Muted State

This screenshot demonstrates the muted audio state. Clicking the speaker icon toggles the mute state, updating the icon from a speaker to a crossed-out speaker (`VolumeX`) and dropping the visual volume slider to zero.

![Volume Muted State](ui/05-volume-muted-state.png)
