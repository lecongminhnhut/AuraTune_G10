# Quickstart: Metadata Search

**Feature**: [031-metadata-search](./spec.md)
**Contract**: [Search API Contract](./contracts/search-api.md)
**Data model**: [Data Model](./data-model.md)

## Prerequisites

- Node.js and npm versions supported by the repository.
- The AuraTune frontend and Express backend dependencies installed from their respective package manifests.
- Local Supabase/PostgreSQL connection configuration supplied through the repository's approved ignored environment configuration and consumed by `src/database/supabaseClient.js`. Do not commit `.env`, service keys, or credentials. Confirm that this client is configured and that the deployed catalog schema contains the mapped fields before exercising search.
- Catalog records containing the approved metadata fields required by the API contract.

## Start the Backend

In a terminal:

```powershell
Set-Location src/backend
npm install
npm run dev
```

The existing health endpoint should respond at `http://localhost:5000/api/health`. Once the feature's endpoint is implemented and catalog configuration is available, the search endpoint is `http://localhost:5000/api/v1/search`.

## Start the Frontend

In a second terminal:

```powershell
Set-Location src/frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal and navigate to `/search`.

## Validate the API Contract

After implementing and configuring the endpoint, run these requests from PowerShell:

```powershell
curl.exe -i "http://localhost:5000/api/v1/search?q=lofi&type=tracks&limit=20&offset=0"
curl.exe -i "http://localhost:5000/api/v1/search?q=lofi&type=albums&genre=lofi&release_year=2026&sort=newest"
curl.exe -i "http://localhost:5000/api/v1/search?q=lofi&type=all&limit=20&offset=20"
```

Verify successful responses include the shared success envelope, an array-valued `data`, and `pagination` with `limit`, `offset`, `next_offset`, and `has_more`. Use the returned `next_offset` only when `has_more` is true.

Check validation and failure behavior:

```powershell
curl.exe -i "http://localhost:5000/api/v1/search?q=x"
curl.exe -i "http://localhost:5000/api/v1/search?q=lofi&type=artists&genre=lofi"
```

These should return the contract's `400 VALIDATION_ERROR` envelope. An empty match should instead return `200 OK`, `data: []`, and `has_more: false`. A catalog/service failure must return the documented error response rather than an empty success.

## Validate the UI

1. Search for a known title, artist, album, and playlist; switch between `all` and each type and confirm the visible items correspond to the selected type.
2. Confirm `genre` and `release_year` controls appear only for applicable result types, and that only contract-approved sort choices are offered.
3. Load another batch and confirm results append, offsets follow `pagination.next_offset`, and Load More stops when `has_more` is false.
4. Focus the search input; select a recent query, remove one entry, and clear history. Confirm history is limited to ten query strings and the page still works if LocalStorage is unavailable.
5. Verify loading, no-results, connection/service error, retry, query replacement while loading, keyboard interaction, and responsive layout states.
6. Play a track or playlist result and confirm the existing PlayerContext flow remains in use.

## Build Check

The frontend currently exposes a production build command:

```powershell
Set-Location src/frontend
npm run build
```

The current package manifests do not define a dedicated feature test command. Confirm the selected test tooling with the implementation team before adding dependencies or documenting a test runner.
