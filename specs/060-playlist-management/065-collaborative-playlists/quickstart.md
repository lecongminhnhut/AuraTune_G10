# Quickstart: Collaborative Playlists

**Feature**: [065 Collaborative Playlists](./spec.md)

## Prerequisites

- Start frontend/backend and authenticate as owner plus two registered test users.
- Resolve membership/visibility/attribution gates in [research.md](./research.md).
- Review [collaboration contract](./contracts/collaborative-playlists.md) and [data model](./data-model.md).

## Validation Scenarios

1. Owner enables collaboration; verify the approved visibility transition and persisted state.
2. Invite a registered email; verify immediate collaborator library access and edit permission.
3. Invite unknown, duplicate, and owner email; verify contract-defined errors without state corruption.
4. Collaborator adds/removes/reorders tracks; verify contributor attribution and updated order for another member after refresh/sync.
5. Verify non-member can view public collaborative playlist but cannot mutate tracks.
6. Verify only owner can edit metadata, invite, revoke, or delete.
7. Revoke collaborator; verify next mutation is denied within one second and existing tracks remain.
8. Disable collaboration; verify collaborator access ends and tracks remain; test the approved visibility result.
9. Exercise concurrent edits under the policy coordinated with 062.

The prototype dialog alone is not evidence of server-side authorization or synchronized state.
