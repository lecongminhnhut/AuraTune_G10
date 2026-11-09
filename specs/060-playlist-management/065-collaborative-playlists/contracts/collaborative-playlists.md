# Collaborative Playlist API Contract (Draft)

**Feature**: [065 Collaborative Playlists](../spec.md)
**Shared conventions**: [API Contract](../../../../docs/analysis-and-design/api-contract.md), [API conventions](../../../../docs/design/api/api-conventions.md)

## Confirmed Permission Contract

| Caller | Read collaborative playlist | Edit tracks | Metadata/delete | Manage collaborators |
|---|---|---|---|---|
| Public/non-member | Yes | No | No | No |
| Active collaborator | Yes | Yes | No | No |
| Owner | Yes | Yes | Yes | Yes |

Every mutation checks current server-side membership. Revocation takes effect on subsequent requests. Disable collaboration revokes collaborator access and keeps contributed tracks.

## Endpoint Boundary

Shared API contract lists no collaboration endpoints. Route/method/body/response details for toggle, invite, roster, revoke, and contributor reads require approval. Invitations target registered AuraTune users by email and grant immediate access per spec. Use standard JSON envelope and common status/error rules.

## Approval Required

- Decide owner representation and whether role is stored or derived.
- Decide atomic mapping among `is_collaborative`, `status`, and public visibility when enabling/disabling.
- Confirm schema for membership timestamp and `added_by_user_id` with 062/database owner.
- Define duplicate/unknown email behavior and exact public-read/mutation error statuses.
- Select initial synchronization method; sockets are optional and not required by the feature.
