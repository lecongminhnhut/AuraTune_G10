# Implementation Plan: Album Details

**Branch**: `081-album-details` | **Date**: 2026-11-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/080-album-interaction/081-album-details/spec.md`

## Summary

Implement the Album Details visitor experience: load the album identified by the route ID through the approved public `GET /albums/:id` contract, then present the returned album metadata and complete ordered track list, including per-track play counts, aggregate duration, loading and failure states, cached return behavior, and other available albums by the same artist. Keep the response shape and persistence model governed by the already approved API and catalog; this plan introduces no API fields or database changes.

## Technical Context

**Language/Version**: JavaScript (ES modules); React 18.3.1 in the frontend, Node.js/Express in the backend.

**Primary Dependencies**: Existing React/Vite frontend, existing shared UI components and application store; the API client and contract for `GET /albums/:id` must be confirmed before implementation. No new package is required by this plan.

**Storage**: Existing catalog/API data source. No new persistence schema. Keep previously loaded album responses in the shared in-memory `AppStore`, keyed by album ID, for immediate same-session return display, then refresh on return. No fixed cache duration is specified.

**Testing**: Frontend component/interaction tests and API integration/contract checks using the repository's established test setup (specific runner and available API test environment require confirmation). Acceptance checks must cover the scenarios in this plan; the current frontend package scripts expose build/dev/preview only.

**Target Platform**: Responsive web application.

**Project Type**: Web application with `src/frontend` and `src/backend` projects.

**Performance Goals**: Render a large complete track response progressively when useful while deriving total duration from every track with a known duration, independent of rendered rows.

**Constraints**: Preserve the approved public API contract; do not require sign-in just to view details; preserve response ordering; do not require disc metadata; distinguish unknown values from zero; avoid stale data during album ID changes and failed requests; do not expand into playback, save/share, or other Group 080 features.

**Scale/Scope**: One album details route/page, its related-artist album section, and supporting frontend data/state integration. No changes to unrelated feature groups.

## Constitution Check

The checked-in `.specify/memory/constitution.md` is an unfilled template (`[PROJECT_NAME]`, `[PRINCIPLE_*]`, and placeholder descriptions), not ratified project guidance. No enforceable constitution gates can be evaluated from it. This plan therefore records repository and feature constraints below without representing template placeholders as approved principles. Revisit this check if a completed constitution is supplied.

## Project Structure

### Documentation (this feature)

```text
specs/080-album-interaction/081-album-details/
├── spec.md
└── plan.md
```

### Source Code (repository root)

```text
src/
├── frontend/src/
│   ├── pages/Album/AlbumPage.jsx       # Existing album view; evolve for contract-driven states/details
│   ├── routes/AppRouter.jsx             # Existing /album/:id route
│   ├── components/playlist/CoverArt.jsx # Existing cover display/placeholder candidate
│   ├── components/song/SongTable.jsx    # Existing ordered track rows and play count display candidate
│   ├── components/common/ui.jsx          # Existing loading, empty, not-found, and error UI candidates
│   ├── context/AppStore.jsx              # Existing album/catalog access and cache integration candidate
│   └── services/                         # Existing API client location; album endpoint client not found
└── backend/
    ├── server.js                         # Existing Express API mount points; no album route currently present
    └── routes/                           # Existing route location; album route/approved contract implementation to confirm
```

**Structure Decision**: Keep the page in the existing frontend album route and reuse existing shared presentation and state patterns. Extend a backend endpoint only if the approved `GET /albums/:id` contract is confirmed to be absent from the deployed/catalog service and ownership is established; do not design a substitute contract in this feature plan. Current `server.js` mounts authentication routes only, so service ownership and the contract implementation are a dependency to resolve.

## Technical Approach

1. **Route and data access**: Keep the existing `/album/:id` route in `AppRouter.jsx`. Add/use a frontend service integration that requests the exact approved `GET /albums/:id` endpoint and consumes only its documented response. Keep public access consistent with the contract. The current `AlbumPage.jsx` reads synchronous mock-backed `AppStore` data, so this is the primary seam to replace or adapt.
2. **Loading and request identity**: Model request lifecycle for the current album ID. On initial load, show an explicit loading presentation without presenting another album's content. When the route ID changes during a request, ignore results for the old ID. Keep successful album responses in the shared in-memory `AppStore` keyed by album ID so SPA Back navigation can render same-ID data immediately, then refresh it. If refresh fails, keep the same-ID cached details visible, clearly indicate that refresh failed, and provide the required retry action. Do not present the cache as newly refreshed data. The cache naturally ends with the app session; no TTL or persistent browser storage is introduced.
3. **Album summary and related releases**: Present available cover, title, artist, release year, release-type badge derived from track count, and "More from [Artist]". The current `AlbumPage` obtains related releases from `AppStore.albums`, filtered by matching `artistId` and excluding the current album; retain that existing catalog-list source and do not add related-album fields to `GET /albums/:id`. When mock data is replaced, the approved catalog integration must continue to supply the same-artist album collection. Use the shared responsive `CoverArt` frame and placeholder. Omit unavailable metadata or show the established missing-value treatment without substituting unrelated data.
4. **Track list and derived values**: Preserve API order in a single flat list. Display each track's own play count and duration. Format known track durations as `m:ss` or `h:mm:ss` at one hour and above; format counts as locale-grouped whole numbers. Render unavailable values as an em dash and valid zero as zero. Compute aggregate duration once from the complete response, excluding unknown durations; do not derive it from the progressively rendered subset. If the list is empty or no track has a known duration, show the aggregate as unavailable: the spec's Assumptions explicitly say the total is unavailable when no track durations are available, while the empty-list Edge Case says unavailable or zero according to album data. A valid zero sum remains distinct when track duration values are known.
5. **Failure boundaries**: Distinguish not-found from service/network errors. Provide a retry action for service/network failures. Do not display partial, unrelated, or stale cross-album data after failed requests. No new schema, endpoint parameters, scoring logic, or AI behavior is introduced.

## Components and Dependencies

| Component / dependency | Current evidence | Planned responsibility / status |
| --- | --- | --- |
| `AppRouter.jsx` | Has `/album/:id` and passes decoded `albumId` | Existing route; retain and validate identity during route changes. |
| `AlbumPage.jsx` | Reads synchronously from `AppStore`, uses track filtering, duration sum, summary and related album UI | Main implementation surface; adapt to asynchronous contract-backed data and states. |
| `AppStore.jsx` | Supplies `getAlbum`, `publicTracks`, `albums`, save helpers | Existing mock/catalog state seam; determine whether API integration belongs here or in a feature service. |
| `CoverArt.jsx`, `SongTable.jsx`, `SongRow.jsx`, `common/ui.jsx` | `CoverArt` currently renders gradient variants and motifs, not a supplied cover image. `SongRow` formats missing play counts as zero (`count ?? 0`) and renders the duration value directly. Current `AlbumPage` uses `NotFound` for absent mock data; network loading/retry states are not implemented there. | Keep the responsive cover frame but render actual available cover art and retain a placeholder fallback. Update the track-row mapping/formatting so missing play counts show an em dash and durations meet FR-007. Reuse shared empty/not-found presentation and add feature-scoped loading/service-error/retry behavior as needed. |
| Approved album API and catalog | Spec names public `GET /albums/:id`; existing `src/backend/server.js` currently exposes health and auth routes only. The current related-album list comes from `AppStore.albums`. | Blocking dependency: locate the authoritative contract/provider and confirm its response supports album metadata and the complete ordered tracks with per-track counts; preserve the existing related-album catalog source. |
| Test harness | Frontend package lists Vite/build scripts; backend package and repository test configuration need inspection during implementation | Confirm supported runners and fixtures before task breakdown. |

## Data Flow and Integration

`/album/:id` route → album page requests the approved public endpoint for the current ID → page validates that the response still belongs to that ID → same-ID response in the shared in-memory `AppStore` renders immediately on SPA return → response supplies album fields and the complete ordered track list → page derives release type and total duration, renders ordered track rows, and filters the existing `AppStore.albums` collection by artist for related releases → loading, not-found, and retryable service-error presentations reflect the request result.

The feature artifact does not include related-album fields in `GET /albums/:id`. The current implementation uses the existing `AppStore.albums` catalog list filtered by artist; retain that source and verify that the eventual approved catalog integration supplies the list. Do not extend the album-detail response for this section.

## Testing Strategy

- **Presentation/unit coverage**: album type at 1 vs 2 tracks; duration formatting immediately below/at one hour; complete-response duration aggregation with missing durations; zero vs unavailable play counts; release year and missing metadata; responsive cover placeholder; flat order and related album filtering.
- **Request/state coverage**: initial loading without stale details; successful response; not-found; network/service error and retry; rapid route change where old response resolves last; same-ID cached render followed by successful refresh; on refresh failure, verify same-ID cached details remain visible with a clear failure indication and retry action.
- **Integration/contract coverage**: anonymous request to the approved `GET /albums/:id`; response maps each play count to the matching track; complete ordered track list is used for aggregate duration; verify related-album source without inventing fields.
- **Acceptance validation**: exercise the three user stories and SC-001 through SC-006 using the scenarios and representative data in `spec.md`, including empty albums and large track lists.
- **Tooling caveat**: No test runner is declared in `src/frontend/package.json` (only Vite lifecycle scripts). Identify the repository's actual harness before specifying executable test commands; do not claim tests were run as part of planning.

## Risks and Clarifications

| Item | Status / impact | Required follow-up |
| --- | --- | --- |
| Approved `GET /albums/:id` contract/provider not located in the inspected backend routes | **Owner confirmed as not yet identified**; current backend only mounts auth routes, while AlbumPage uses local store data. The frontend `sessionApiClient` currently defaults to an `/api/v1` base path, while the feature contract names `/albums/:id`. | Treat API ownership, authoritative response definition, and base-path alignment as blocking dependencies. Do not define endpoint response fields or implementation ownership until the designated owner supplies the approved contract. The request must remain usable anonymously as required by FR-013. |
| Existing presentation helpers do not meet all metadata requirements | Confirmed by source inspection: `CoverArt` has no supplied-image rendering path, `SongRow` turns an unavailable play count into `0`, and the row displays duration without the FR-007 hour-aware format. | Treat these as feature-scoped implementation gaps in AlbumPage/row presentation; retain the existing shared component structure and use the spec's placeholder, em-dash, and formatting rules. |
| Empty-track aggregate duration wording | The Edge Case allows unavailable or zero "according to album data," but the Assumptions say the aggregate is unavailable when no track durations are available; FR-004 defines the total as a sum of available track durations. | For planning and acceptance, show unavailable when there are no known track durations (including an empty list); show zero only when known duration values validly sum to zero. Record as derived from the explicit Assumptions and FR-004. |
| Source for "More from [Artist]" | **Needs confirmation**; FR-016 requires this section but does not define whether the album details response or another existing catalog source supplies it. | Identify an existing supported data source; clarify only if none exists. Do not invent a query/response shape. |
| Cache lifetime | Cache location is clarified for this plan as the shared in-memory `AppStore`, keyed by album ID, which persists across SPA navigation while the app is mounted. The refresh-failure behavior is also clarified: retain same-ID cached details, indicate refresh failure, and provide retry. | No fixed TTL is introduced; refetch on return as required by the spec. |
| Testing framework and API fixtures | **Needs confirmation** from repository test configuration; frontend package exposes no test command. | Inspect root/backend configuration and select existing harness; avoid adding dependencies without justification. |
| Constitution | `.specify/memory/constitution.md` is a placeholder template. | Replace with ratified guidance in a separate authorized project-level change; this plan does not modify it. |

## Complexity Tracking

No constitution violation is asserted because the constitution file contains placeholders rather than approved gates. No new project, persistence model, or API contract is proposed.

## Plan Execution Notes (2026-11-09)

This plan was reviewed against the checked-in feature specification, the Spec Kit workflow and plan template, project architecture/API/database documentation, and the current album page/store/components and backend entry point. The Spec Kit slash command is not exposed in this environment. The provided `setup-plan.sh --json` was attempted with an explicit Feature 081 context and persistence disabled, but Git Bash could not create its resolved directory (`Permission denied`); no generated path output was available. The planning workflow was therefore followed using the repository's plan template and artifacts are confined to this feature directory.

The current implementation confirms that `/album/:id` is routed to `AlbumPage`, which reads mock-backed `AppStore` data; the backend currently mounts health and authentication routes only. The checked-in API contract document and current code did not provide an authoritative `GET /albums/:id` response schema or implementation. Treat endpoint ownership, base path, exact response mapping, and the source for related albums as blocking confirmations. This plan does not define those details, introduce an endpoint, or add a database schema. Keep all proposed response fields limited to those already required by `spec.md` and the approved contract once the contract owner identifies it.

The project test setup currently declares only Vite `dev`, `build`, and `preview` scripts in the frontend and `start`/`dev` in the backend; no test runner is declared in those package manifests. The exact local verification commands and scenarios are recorded in `quickstart.md` without claiming an executable automated test suite exists.
