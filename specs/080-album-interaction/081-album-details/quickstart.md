# Quickstart: Album Details

This guide uses only commands currently declared in the project package manifests. It does not assume an automated test runner is installed. Run from the repository root unless a working directory is shown.

## Prerequisites

- Node.js and npm compatible with the checked-in lockfiles.
- Dependencies installed for the repository and the frontend/backend packages.
- A configured catalog service implementing the already approved public `GET /albums/:id` contract. Its owner and base URL are still to be confirmed; do not substitute an invented endpoint or payload.

## Run locally

Frontend:

```powershell
Set-Location src/frontend
npm install
npm run dev
```

Backend (only if the approved contract owner confirms this backend serves it; the checked-in backend currently exposes health/auth routes, not album details):

```powershell
Set-Location src/backend
npm install
npm run dev
```

Build the frontend:

```powershell
Set-Location src/frontend
npm run build
```

## Acceptance walkthrough

1. Open `/album/{existing-album-id}` without signing in. Verify available cover, title, artist, release year, release-type badge, total duration, ordered flat track list, and the “More from [Artist]” section.
2. Use an album with known and unknown track durations, including a total at least one hour. Verify the total includes all known durations even if rows render progressively; verify formatting as `m:ss` or `h:mm:ss`.
3. Verify each row shows its own grouped play count, explicit zero, or em dash for unavailable values. Verify the same distinction for track duration.
4. Open an album with no tracks, missing optional metadata/cover, or no known durations. Verify the empty state and placeholder do not invent metadata or duration.
5. Request a nonexistent ID. Verify not-found state without unrelated album data. Simulate network/service failure and verify clear error and retry.
6. Navigate between album IDs while requests are pending. Verify a late response for the old ID cannot replace the current album. Return to a previously loaded album and verify same-ID cached details display immediately while refresh runs.

## Test tooling status

## Test tooling status

- **Automated Testing**: The frontend package manifest declares `dev`, `build`, and `preview`; the backend declares `start` and `dev`. Neither manifest currently declares an automated test script (e.g., Vitest, Jest). Per project constraints, no test dependency has been added during planning.
- **Current Approach**: Validation for Feature 081 will rely strictly on the manual **Acceptance walkthrough** defined above, using `npm run dev`.
- **Future Action**: Once the team (Vision Owner/Admin) officially approves and configures a repository-wide test harness, the automated presentation and request-state tests (T007, T008, T017, T022, T027) will be implemented using that framework.
