# Quickstart: Album Tracklist Playback

This guide lists current project commands and acceptance walkthroughs. It does not claim an automated test runner is configured.

## Prerequisites

- Node.js/npm compatible with the checked-in lockfiles; install dependencies for the frontend and backend as needed.
- Local AuraTune demo data with an album containing ordered, playable and unavailable tracks.
- Confirmed shared-player/queue behavior for the blocking decisions recorded in `plan.md` before treating playback acceptance as final.

## Run locally

Frontend:

```powershell
Set-Location src/frontend
npm install
npm run dev
```

Build the frontend:

```powershell
Set-Location src/frontend
npm run build
```

The frontend package currently declares Vite `dev`, `build`, and `preview` scripts. The backend package declares `start` and `dev`; Feature 082 currently uses mock catalog/player state and adds no backend endpoint.

In the current managed Windows workspace, `npm.cmd run build` is blocked before Vite loads the configuration because esbuild reports `Cannot read directory "../../../../..": Access is denied` while resolving `src/frontend/vite.config.js`. This is an environment permission issue and must be cleared before build status can be considered successful.

## Acceptance walkthrough

1. Open an album with a known ordered track list. Verify every track appears once and in catalog order.
2. Use an album with unavailable entries. Verify those rows remain visible, are disabled with a reason, and are omitted from playback; verify later playable tracks remain in the album sequence.
3. Use an empty album and an album with no playable tracks. Verify the empty/unavailable state and that neither player nor queue is changed.
4. After the queue policy is approved, select Play Album and verify the first playable track starts, Shuffle is off, and the expected album sequence appears in the shared queue.
5. Select a playable middle track. Verify it becomes current and only later playable album tracks follow it; pre-existing upcoming tracks stay after the album segment as specified.
6. Select Add all to queue. Verify current playback continues, accepted additions appear in album order, and duplicate/capacity feedback follows Group 050.
7. Repeat Play Album. Verify restart from the first playable track, no duplicate album segment, and unrelated queued tracks preserved per the approved policy.
8. Navigate away during playback. Verify BottomPlayer and QueuePanel continue to reflect the same shared state and the queue remains editable.
9. For an album with at least 100 tracks, verify the full list remains accessible and playback uses the full source list rather than only rendered rows. Resolve the 50-item queue conflict before accepting this criterion.
10. Simulate a track becoming unavailable at activation/playback time. Verify Group 040's approved recovery once identified; do not infer a new skip mechanism.

## Test tooling status

- **Automated Testing**: The frontend package declares Vite `dev`, `build`, and `preview` scripts. Per project constraints (T005), no automated test dependencies (e.g., Vitest, Jest) have been added.
- **Current Approach**: Validation for Feature 082 will rely strictly on the manual **Acceptance walkthrough** scenarios defined above, utilizing `npm run dev`.
