# Feature Specification: Shuffle and Repeat

**Feature ID**: `043-shuffle-and-repeat`  
**Functional Group**: `040 – Music Player`  
**Status**: Specification Missing / Pending (Frontend UI Documented)

> [!NOTE]
> The formal feature specification (`spec.md`, `plan.md`, `tasks.md`) for Feature 043 was not previously authored or committed in the repository.
> In accordance with project constraints, no artificial business requirements or synthetic acceptance criteria have been invented.
> The UI screenshots and workflows documented below reflect the actual frontend implementation discovered at `src/frontend/src/components/player/FullScreenPlayer.jsx`, `src/frontend/src/components/player/BottomPlayer.jsx`, and `src/frontend/src/hooks/useMockPlayer.js`, cross-referenced with `docs/proposal/proposal.md`.

---

## Documented Project Context

- **Proposal Reference**: `docs/proposal/proposal.md` (§ 5.1 & § 6.4):
  "Core music player — ... shuffle/repeat, share, comment on tracks."
- **Playback Engine Implementation**:
  - Shuffle Mechanism: Managed by `toggleShuffle` in `useMockPlayer.js`. When enabled, collection tracks are randomly permuted (Fisher-Yates algorithm) and the shuffle state is displayed across both BottomPlayer and FullScreenPlayer.
  - Repeat Modes: Implemented via `cycleRepeat` cycling sequentially through three discrete states:
    1. `off`: Linear playback without looping.
    2. `all`: Repeats the entire queue / playlist upon reaching the final track.
    3. `one`: Continually replays the current song.

---

## UI Screenshots

### 1. Shuffle Mode Disabled (Default State)

This screenshot captures the player controls in FullScreenPlayer with Shuffle mode disabled (`shuffle = false`). The Shuffle icon appears in its neutral translucent styling without an indicator dot.

![Shuffle Mode Disabled](ui/01-shuffle-disabled.png)

### 2. Shuffle Mode Enabled

This screenshot shows the Shuffle mode activated (`shuffle = true`). The button highlights with subtle background elevation and a distinctive white indicator dot beneath the shuffle arrows, signaling that upcoming track order is randomized.

![Shuffle Mode Enabled](ui/02-shuffle-enabled.png)

### 3. Repeat Mode Off

This screenshot illustrates the repeat control in its inactive state (`repeatMode = 'off'`). Playback proceeds sequentially through the queue without repeating tracks.

![Repeat Mode Off](ui/03-repeat-off.png)

### 4. Repeat All Mode Active

This screenshot demonstrates the Repeat All mode (`repeatMode = 'all'`). The repeat button displays an active white indicator dot, signaling that the entire listening queue or playlist will loop indefinitely.

![Repeat All Mode Active](ui/04-repeat-all.png)

### 5. Repeat One Mode Active

This screenshot captures the Repeat One mode (`repeatMode = 'one'`). The interface dynamically replaces the standard repeat loop icon with the dedicated `Repeat1` (single track repeat) icon accompanied by an active indicator dot.

![Repeat One Mode Active](ui/05-repeat-one.png)
