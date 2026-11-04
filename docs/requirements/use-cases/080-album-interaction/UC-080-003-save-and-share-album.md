# UC-080-003 – Save and Share Album

---

## 1. Metadata

| Field | Value |
|---|---|
| **Use Case ID** | UC-080-003 |
| **Use Case Name** | Save and Share Album |
| **Functional Group** | 080 – Album |
| **Primary Actor** | Listener (`ACT-02`) (Save), Guest/Visitor (`ACT-01`) (Share) |
| **Supporting Actors** | Auth (`Group 010`) |
| **Related FR IDs** | `083-FR-001` to `083-FR-014` |
| **Related Feature/Spec** | Feature 083: Save and Share Album (`spec-083.md`) |
| **Status** | Draft |
| **Writer** | Nguyễn Khánh Đăng |
| **Reviewer** | TBD |

---

## 2. Description

Provides authenticated users the ability to toggle an album's saved state (`PUT`/`DELETE /albums/:id/save`) which updates their personal library grid. It also provides a public sharing mechanism leveraging the Web Share API or clipboard to distribute album links, along with proper error handling if sharing is blocked.

---

## 3. Preconditions

- For saving: The user must be authenticated (`Listener`).
- For sharing: None (Guests can share).

---

## 4. Trigger

The actor clicks the "Lưu album" (Save Album) bookmark icon or the "Chia sẻ album" (Share) icon on the album action toolbar.

---

## 5. Basic Flow (Save Album)

1. **Actor:** Clicks the "Lưu album" bookmark icon.
2. **System:** Verifies the user is signed in (`083-FR-007`).
3. **System:** Temporarily disables the button and shows a pending state while sending a `PUT /albums/:id/save` request (`083-FR-005`).
4. **System:** Receives confirmation from the server.
5. **System:** Updates the UI: Changes icon to `BookmarkCheck`, label to "Đã lưu", applies violet active styling (`083-FR-004`).
6. **System:** Displays a toast notification: *"Đã lưu album vào thư viện."*
7. **System:** Synchronizes the user's Library (`/library`) so the album appears in the "Album đã lưu" grid.

---

## 6. Alternative Flows

### AF-01 – Share Album
- **Starting step:** Step 1 of the Basic Flow.
- **Condition:** The actor (Guest or Listener) clicks "Chia sẻ album".
1. **Actor:** Clicks the Share icon.
2. **System:** Invokes the sharing mechanism (Web Share API or Copy to Clipboard) containing the direct album URL (`083-FR-008`).
3. **System:** Displays a toast notification: *"Đã sao chép liên kết vào bộ nhớ tạm."*
- **Continuation:** Use Case ends successfully.

### AF-02 – Unsave Album
- **Starting step:** Step 1 of the Basic Flow.
- **Condition:** The album is already saved (button shows "Đã lưu").
1. **Actor:** Clicks the "Đã lưu" button.
2. **System:** Sends `DELETE /albums/:id/save`.
3. **System:** Reverts the button to the default "Lưu album" Bookmark icon.
4. **System:** Displays a toast notification: *"Đã xóa album khỏi thư viện."*
- **Continuation:** Use Case ends successfully.

---

## 7. Exception Flows

### EF-01 – Unauthenticated Save Attempt
- **Starting step:** Step 2 of the Basic Flow.
- **Condition:** The visitor is a Guest.
1. **System:** Detects lack of authentication.
2. **System:** Intercepts the action and triggers a sign-in prompt modal (`083-FR-007`).
3. **System:** Does not alter any personal library state.
- **Continuation:** Redirects to Login Use Case.

### EF-02 – Network Failure during Save/Unsave
- **Starting step:** Step 4 of the Basic Flow.
- **Condition:** The API request times out or returns an error.
1. **System:** Removes the pending state and restores the last confirmed visual state (saved or unsaved) (`083-FR-005`).
2. **System:** Displays a short inline error message near the control (e.g., "Không thể lưu, vui lòng thử lại") (`083-FR-012`).
- **Continuation:** Use case ends unsuccessfully; actor can retry.

---

## 8. Postconditions

### Success
- The album's ID is safely added to or removed from the user's `savedAlbumIds` state.
- The UI reflects the correct state instantly.

### Failure
- No false success indicators are shown. State remains securely synchronized with the server's truth.
- Clear error toasts provide manual workarounds when native sharing fails.

---

## 9. Special Requirements

- **Account Isolation**: Saved states are strictly bound to the authenticated account. User A's saves do not affect User B (`083-FR-003`).
- **Optimistic UI Restriction**: The UI must not show a success state while the request is pending. It must wait for confirmation before altering the bookmark icon (`083-FR-005`).
- **Library View Deletion**: If a user unsaves an album while actively viewing their Library page, the item remains visible until confirmed, then instantly disappears without requiring a page reload (`083-FR-002`).
- **Quota**: There is no feature-specific quota limiting the number of saved albums (`083-FR-014`).

---

## 10. Prototype and Screenshots

### Basic Flow - Save Album
![Album Save Action](prototypes/UC-080-003-album-save-action.png)
**Covered steps:** Basic Flow step 1.
**Prototype type:** Implemented UI

![Album Saved State](prototypes/UC-080-003-album-saved-state.png)
**Covered steps:** Basic Flow steps 5-6.
**Prototype type:** Implemented UI

### AF-01 - Share Album Action
![Album Share Action](prototypes/UC-080-003-album-share-action.png)
**Covered steps:** AF-01 step 1.
**Prototype type:** Implemented UI

### EX-03 - Share Album Failure
![Album Share Result (Error)](prototypes/UC-080-003-album-share-result.png)
**Covered steps:** EX-03.
**Prototype type:** Implemented UI

---

## 11. Related Use Cases

- **Preceding Use Case**: `UC-010-002` (Log In with Email)

---

## 12. Source References

- `spec-083.md` – Requirements FR-001 through FR-014.
- `docs/proposal/proposal.md`

---

## 13. Notes and Open Questions

- **Share Destinations**: Social controls included are Facebook, Instagram, X, and Zalo alongside standard copy link functionality.