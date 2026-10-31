# Feature Specification: Song Sharing and Comments

**Feature ID**: `046-song-sharing-and-comments`  
**Functional Group**: `040 – Music Player`  
**Status**: Specification Missing / Pending (Frontend UI Documented)

> [!NOTE]
> The formal feature specification (`spec.md`, `plan.md`, `tasks.md`) for Feature 046 was not previously authored or committed in the repository.
> In accordance with project constraints, no artificial business requirements or synthetic acceptance criteria have been invented.
> The UI screenshots and workflows documented below reflect the actual frontend implementation discovered at `src/frontend/src/components/player/TrackComments.jsx`, `src/frontend/src/components/player/FullScreenPlayer.jsx`, and `src/frontend/src/utils/share.js`, cross-referenced with `docs/proposal/proposal.md` and `docs/analysis-and-design/api-contract.md`.

---

## Documented Project Context

- **Proposal Reference**: `docs/proposal/proposal.md` (§ 5.1 & § 6.4):
  "Core music player — ... share, comment on tracks."
- **Sharing Mechanism**:
  Managed via `shareLink()` in `src/frontend/src/utils/share.js`. In desktop web browsers, it copies the canonical deep-link URL (`/album/:albumId?track=:trackId` or `/search?q=:title`) to the clipboard and triggers a confirmation toast notification: "Đã sao chép liên kết vào bộ nhớ tạm."
- **Comments Management**:
  Implemented in `TrackComments.jsx`. Listener comments are stored per song in `store.comments[track.id]`:
  - Authenticated listeners can compose and post comments up to 300 characters.
  - Comment author or platform administrator can delete comments directly via the trash icon button.
  - Unauthenticated visitors view existing comments but are prompted with "Đăng nhập để bình luận" directing them to the login flow.

---

## UI Screenshots

### 1. Song Sharing Action and Clipboard Feedback

This screenshot captures the song sharing action executed from the FullScreenPlayer controls bar. Clicking the Share button (`Share2`) copies the song's link to the system clipboard and displays a feedback toast notification: "Đã sao chép liên kết vào bộ nhớ tạm."

![Song Sharing Action and Clipboard Feedback](ui/01-song-share-action-feedback.png)

### 2. Track Comments Panel Layout

This screenshot shows the FullScreenPlayer with the "Bình luận" (Comments) tab active. It presents the existing comment thread for the playing song, displaying author initials, author display names ("Minh Anh", "Linh Nguyễn"), relative timestamps ("1 ngày trước", "Vừa xong"), and comment content.

![Track Comments Panel Layout](ui/02-song-comments-panel-view.png)

### 3. Unauthenticated Comment Prompt

This screenshot captures the comments panel when viewed by an unauthenticated visitor. The submission form is replaced with a clear call to action: "Đăng nhập để bình luận" linking directly to the login screen.

![Unauthenticated Comment Prompt](ui/03-song-comments-unauthenticated-prompt.png)

### 4. Authenticated Comment Input

This screenshot illustrates the comment composition workflow for an authenticated user (`demo@auratune.vn`). The input field is filled with listener feedback ("Giai điệu này thật tuyệt vời để lắng nghe vào buổi tối! 🎧"), activating the white Send button.

![Authenticated Comment Input](ui/04-song-comment-input-typing.png)

### 5. Successful Comment Submission

This screenshot demonstrates immediate real-time rendering upon submitting the comment. The new comment appears at the top of the thread with the author display name, "Vừa xong" timestamp, and a contextual delete button (`Trash2`).

![Successful Comment Submission](ui/05-song-comment-submitted-success.png)
