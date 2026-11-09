# Playlist CRUD API Contract (Draft)

**Feature**: [061 Playlist CRUD](../spec.md)
**Shared conventions**: [API Contract](../../../../docs/analysis-and-design/api-contract.md), [API conventions](../../../../docs/design/api/api-conventions.md)

## Confirmed Behavior

- API root is `/api/v1`; ordinary JSON uses `{success,message,data,error}`.
- Create/list/bookmark require authenticated user. Public playlist detail may be anonymous. Private detail, update, and delete require owner access.
- Validation: name required and max 80 characters; description max 300; new status defaults private.
- Delete is permanent after client confirmation. Bookmark is a read-only reference.

## Endpoint Boundary

The shared API contract does not list playlist CRUD routes or exact payloads. Candidate resource naming follows `/playlists` and nested resources per API conventions, but method, route, pagination, payload/response fields, error codes, and bookmark endpoint require approval before implementation. Do not treat candidate paths as a finalized contract.

## Approval Required

1. Confirm create/list/detail/update/delete and bookmark route/method/body/response schemas.
2. Confirm whether an inaccessible bookmarked playlist is hidden, removed from library, or returned as unavailable.
3. Confirm deployed `playlists` columns, detail aggregates, default cover, uniqueness/foreign keys, and permanent-delete dependent-row behavior.
4. Confirm privacy-safe handling for private playlist IDs (403 versus 404) in line with the shared API contract.
