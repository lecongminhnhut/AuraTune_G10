# Quickstart: Save and Share Albums

This guide uses commands declared in the repository package manifests. Feature 083 acceptance is manual and adds no test dependency.

## Prerequisites

- Node.js/npm compatible with the checked-in lockfiles.
- Frontend and backend dependencies installed as required.
- An available album and accounts for signed-in/signed-out and cross-account scenarios.
- The checked-in Express server provides the approved saved-album routes with the response envelope defined in `contracts/album-save-share-api.json`.

## Run locally

Frontend:

```powershell
Set-Location src/frontend
npm install
npm run dev
```

Build frontend:

```powershell
Set-Location src/frontend
npm run build
```

Backend:

```powershell
Set-Location src/backend
npm install
npm run dev
```

## Acceptance walkthrough

1. As a signed-in account, load an album and verify its saved/unsaved control matches that account's server-confirmed Saved Albums state.
2. Save an unsaved album. While pending, verify the control is disabled, progress appears, and the last confirmed unsaved state remains visible. After confirmation, verify saved styling and the current account's Library collection update.
3. Remove an album from album details and from the Saved Albums view. Verify it stays visible while pending, disappears after confirmed removal without reload, and remains visible after failure.
4. Fail a save/remove request. Verify prior confirmed state remains and action-specific inline feedback offers retry guidance; verify no false success state.
5. Sign out and attempt save/remove. Verify sign-in is required and no account library changes. Share remains available while signed out.
6. Repeat save/remove checks with two accounts. Verify one account's action does not alter the other's displayed or persisted state.
7. Copy/share an album URL and verify it identifies the same `/album/{albumId}` destination. Verify valid links open that album and invalid/unavailable links do not show unrelated album data.
8. Verify Copy Link, Facebook, Instagram, X, and Zalo receive the same canonical URL after their approved invocation mechanisms are confirmed. Test cancellation and failures without false success feedback.

## Test tooling status

No new automated test framework or dependency was added for Feature 083. Acceptance remains a manual walkthrough covering authenticated API responses, account switching, pending/error states, canonical URLs, and provider intents.
