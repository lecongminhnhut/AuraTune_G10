# Data Model: Save and Share Albums

Feature 083 introduces no approved database schema or API response shape. The API inventory defines the album save/remove and current-user saved-albums routes, while the persistence owner and field mapping are not documented in the feature artifacts. This file records the logical model and UI state only.

## Logical entities

| Entity | Identity/source | Relevant values | Relationship / rule |
| --- | --- | --- | --- |
| Listener Account | Existing authenticated account (`sessionApiClient` context) | Current account identity | Owns its saved-album collection. Only signed-in users can read or change it through User-authorized API operations. |
| Album | Existing album catalog, identified by album ID | Album ID and existing details route | Can be referenced by a saved relationship and canonical `/album/:id` link. No album fields are added by this feature. |
| Saved Album | Logical account-to-album relationship represented by `GET /users/me/saved-albums` | Account identity plus album reference (field names/schema not specified) | Save/remove affect only the active account. The relationship changes in UI only after server confirmation. No feature-specific quota applies. |
| Shareable Album Link | Derived same-origin URL | `/album/{albumId}` | Identifies the same album details destination for Copy Link and all supported social destinations. It does not change account/library state. |

## UI state transitions

### Save/remove control

- **Confirmed unsaved** → show Bookmark and “Lưu album”.
- **Save pending** → disable the action and show progress; continue showing the confirmed unsaved state.
- **Save confirmed** → update the current account's saved relationship and show BookmarkCheck / “Đã lưu”.
- **Save failed** → preserve confirmed unsaved state and show action-specific inline error/retry guidance.
- **Confirmed saved** → show BookmarkCheck / “Đã lưu”.
- **Remove pending** → disable the action and show progress; retain confirmed saved state and keep the item visible in Saved Albums.
- **Remove confirmed** → update the current account's relationship and remove the item from the current Saved Albums view without reload.
- **Remove failed** → preserve confirmed saved state and keep the item visible; show inline error/retry guidance.
- **Account switch** → discard the prior account's displayed state and render only the new account's confirmed saved state.

### Sharing

Sharing derives one canonical album URL from the current album ID. Copy/share success, cancellation, or failure is transient UI feedback; it does not create or mutate a saved-album relationship. Provider-specific invocation details remain unspecified.

## Persistence boundary

The existing prototype stores `savedAlbumIds` in account-keyed browser localStorage. That is demo behavior, not the authority for Feature 083's server-confirmed requirements. The approved read/mutation APIs must own persisted state. Do not add a table/collection, response fields, or cache rules until the API owner provides the contract mapping.
