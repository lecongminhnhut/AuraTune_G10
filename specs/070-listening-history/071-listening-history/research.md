# Research: Listening History

**Feature**: [071 Listening History](./spec.md)  
**Status**: Draft; storage and API decisions remain open.

## Findings

| Topic | Finding | Planning consequence |
|---|---|---|
| Current UI | `src/frontend/src/pages/History/HistoryPage.jsx` reads local demo state from `AppStore`; `recordPlay` currently inserts a record before any playback threshold and `clearHistory` empties local state. | Reuse the page and playback integration as a visual baseline. Production history capture, pagination, retention, privacy, and purge are not implemented by the demo state. |
| Backend | `src/backend/server.js` mounts authentication and health routes; no listening-history route or service exists. | API ownership can be planned at the existing Express boundary, but exact route and payload require contract approval. |
| Storage | Database docs describe a proposed PostgreSQL schema but explicitly note that database choice is unconfirmed; Firestore is also unconfirmed. `listening_history` allows nullable keys in the referenced schema description. | No migration or database-specific schema is selected here. Confirm canonical store, identifiers, nullability, and deletion semantics before implementation. |
| Playback qualification | Requirements define >=30 seconds and, for tracks shorter than 30 seconds, >=90% completion. Repeated qualifying plays are separate events. | Track a single qualifying event per playback session and make retry behavior idempotent once an event identifier/contract is approved. |
| Privacy and analytics | History is private; clear-all excludes cleared events from stats and recommendations; 072/073 require hidden history exclusion; retention is 365 days. | Purge/visibility behavior must be consistent across history, stats, and recommendation inputs. |
| Client resilience | Project assumes stable connectivity; requirements leave retry/skip behavior unspecified for disconnection before threshold. | Do not promise offline synchronization. Surface an unobtrusive failure only if the approved product contract requires it; retry strategy remains an implementation decision. |

## Decisions and Open Gates

- Keep the existing React/Express boundary and shared API envelope as the integration direction; approve the concrete history routes and payload before implementation.
- Decide the canonical storage engine and event identifier before schema work.
- Specify authorization from the authenticated principal; never accept a client-supplied owner as authority.
- Define purge atomicity/partial-failure behavior and retention scheduler/monitoring in implementation design.
- Reconcile the database design docs' illustrative schema with the actual deployed source of truth.

## Sources

- `docs/requirements/use-cases/070-listening-history/README.md` and UC-070-001, 002, 004, 007.
- `docs/design/database/README.md`, `er-diagram.md`, `data-consistency.md`, `security-rules.md`.
- `docs/analysis-and-design/api-contract.md`.
- `src/frontend/src/pages/History/HistoryPage.jsx`, `src/frontend/src/context/AppStore.jsx`, `src/frontend/src/context/PlayerContext.jsx`, `src/backend/server.js`.
- `specs/030-search/033-semantic-vector-search/` artifact structure and its explicit treatment of unresolved decisions.
