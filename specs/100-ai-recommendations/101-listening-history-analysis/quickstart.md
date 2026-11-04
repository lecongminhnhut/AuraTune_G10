# Quickstart Validation Guide: Feature 101 – Listening History Analysis

## Overview

This guide provides runnable scenarios and verification procedures to validate that **Feature 101: Listening History Analysis** works end-to-end according to [spec.md](./spec.md), [data-model.md](./data-model.md), and [contracts/](./contracts/README.md).

---

## 1. Prerequisites

- Node.js >= 18 and pnpm / npm installed.
- Repository cloned and current working directory set to repo root.
- Frontend dependencies installed:
  ```bash
  cd src/frontend
  pnpm install
  ```

---

## 2. Validation Scenarios

### Scenario 1: Review Personal Listening Insights (Happy Path – User Story 1)

**Goal**: Verify that an authenticated user with eligible playback events sees accurate total duration and top genres ranked by accumulated duration.

1. **Start Frontend in Mock/Demo Mode**:
   ```bash
   cd src/frontend
   pnpm dev
   ```
2. **Access the Application**:
   - Open browser at `http://localhost:5173`.
   - Ensure you are logged in (select demo user or sign in via `/login`).
3. **Navigate to Listening Analysis**:
   - Navigate to `/history` (sidebar: "Lịch sử nghe").
   - Click the **"Thống kê"** tab on the view mode switcher.
4. **Expected Outcome**:
   - **Summary cards**: Displays "Tổng thời gian nghe" (formatted hours and minutes), "Số lượt nghe", and "Bài hát khác nhau".
   - **Top Genres list**: Shows genres ranked #1, #2, ... ordered strictly by accumulated listening time descending.
   - Proportional visual progress bars reflect each genre's relative listening duration.
   - Changing the time filter ("7 ngày", "30 ngày", "Toàn bộ") dynamically recalculates metrics for the selected time window.

---

### Scenario 2: Insufficient History State (Empty State – User Story 2)

**Goal**: Verify that when an account has fewer than 1 eligible playback event, no fabricated analysis is shown, and the empty state is displayed.

1. **Prepare State**:
   - Switch to or create a test account with zero listening history, or click "Xóa lịch sử" on `/history`.
2. **Navigate to Analysis**:
   - Navigate to `/history` and select the **"Thống kê"** tab.
3. **Expected Outcome**:
   - Metric cards and genre bars are suppressed.
   - The empty state card is displayed: *"Chưa có đủ dữ liệu để phân tích"*.
   - Description explains: *"Hãy nghe vài bài hát, AuraTune sẽ ghi lại lịch sử và tổng hợp thống kê cho bạn. Chúng tôi không tạo số liệu khi chưa có dữ liệu thật."*
   - A call-to-action button *"Khám phá nhạc"* links to the Home dashboard (`/`).

---

### Scenario 3: Account Isolation & Privacy (Security – User Story 3)

**Goal**: Verify that unauthenticated visitors cannot access listening analysis, and data is strictly scoped to the authenticated caller.

1. **Unauthenticated Access**:
   - Log out or open an Incognito browser window.
   - Navigate to `http://localhost:5173/history`.
2. **Expected Outcome**:
   - Access to private analytics is blocked.
   - The UI presents the `LoginRequired` component prompting the user to sign in.
   - Zero personal metrics, genres, or playback history are disclosed.
3. **API Contract Verification**:
   - Send an unauthenticated HTTP request:
     ```bash
     curl -i http://localhost:3000/api/v1/users/me/stats/listening-analysis
     ```
   - Expected status: `HTTP/1.1 401 Unauthorized`.
   - JSON error code: `"UNAUTHORIZED"`.

---

### Scenario 4: Dynamic Refresh on New Playback Events (FR-013)

**Goal**: Verify that new playback events are reflected when the user re-opens the analysis view.

1. **Initial State**:
   - Record current total listening duration on the "Thống kê" tab.
2. **Trigger Playback Event**:
   - Switch to "Lịch sử" tab or browse to Home (`/`).
   - Play a song belonging to an unrepresented genre for at least 30 seconds.
3. **Re-open Analysis**:
   - Switch back to the "Thống kê" tab on `/history`.
4. **Expected Outcome**:
   - Total listening duration increases by the listened duration.
   - The new song's genre appears in or updates the Top Genres ranking.

---

## 3. Automated Contract & Unit Testing Commands

When backend test harnesses and Vitest component tests are configured:

```bash
# Run frontend unit tests for history and stats calculations
cd src/frontend
pnpm test

# Run backend unit and contract tests (when backend test suite is active)
cd src/backend
npm test -- --grep "listening-analysis"
```
