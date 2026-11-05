# Tasks: Local Authentication (011)

**Input**: Design documents from `specs/010-authentication/011-local-authentication/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/auth-api.json, quickstart.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story mapping (US1, US2, US3, US4, US5)

---

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Verify Supabase Auth client configuration in `src/database/supabaseClient.js`
- [x] T002 Configure Auth environment variables validation in `src/database/supabaseClient.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T003 Setup Supabase Auth listener & session synchronization in `src/frontend/src/context/AppStore.jsx`
- [x] T004 Create Auth API helper service in `src/database/services/authService.js`

---

## Phase 3: User Story 1 - New User Registration (Priority: P1) 🎯 MVP

**Goal**: Cho phép người dùng mới tạo tài khoản bằng Email + Mật khẩu + Tên hiển thị và chấp nhận Điều khoản.

**Independent Test**: Điền form đăng ký với email mới, kiểm tra record được tạo trong DB và chuyển hướng về Home.

- [x] T005 [P] [US1] Build Registration UI Form with email, display name, password fields and Terms checkbox in `src/frontend/src/pages/Auth/AuthPage.jsx`
- [x] T006 [P] [US1] Add frontend validation for password strength (min 8 chars, 1 upper, 1 lower, 1 digit, 1 special char) in `src/frontend/src/pages/Auth/AuthPage.jsx`
- [x] T007 [US1] Implement `signUp` function with metadata (`display_name`, `terms_accepted_at`) in `src/database/services/authService.js`
- [x] T008 [US1] Handle duplicate email error and show toast alert "Email đã được sử dụng" in `src/frontend/src/pages/Auth/AuthPage.jsx`

---

## Phase 4: User Story 2 - User Login (Priority: P1) 🎯 MVP

**Goal**: Cho phép người dùng đã đăng ký đăng nhập bằng email & mật khẩu.

**Independent Test**: Nhập credentials đúng -> thành công lưu token/session & chuyển hướng Home.

- [x] T009 [P] [US2] Build Login UI Form with email, password fields and Remember Me option in `src/frontend/src/pages/Auth/AuthPage.jsx`
- [x] T010 [US2] Implement `signInWithPassword` method in `src/database/services/authService.js`
- [x] T011 [US2] Handle invalid credentials error with user feedback in `src/frontend/src/pages/Auth/AuthPage.jsx`

---

## Phase 5: User Story 3 - Role-Based Access (Priority: P1)

**Goal**: Phân quyền theo vai trò (`user`, `artist`, `admin`) cho người dùng.

**Independent Test**: Đăng nhập với tài khoản role `artist` hoặc `admin` -> menu hiển thị đúng nút Studio/Dashboard.

- [x] T012 [P] [US3] Extend User profile state with `role` attribute in `src/frontend/src/context/AppStore.jsx`
- [x] T013 [P] [US3] Add Role-based UI guards for Navigation & Studio link in `src/frontend/src/components/common/Sidebar.jsx` and `src/frontend/src/components/common/TopBar.jsx`
- [x] T014 [US3] Add Route Protection guards for `/studio` and `/admin` in `src/frontend/src/routes/AppRouter.jsx`

---

## Phase 6: User Story 4 - Account Lockout Security (Priority: P2)

**Goal**: Khóa tài khoản 15 phút sau 5 lần nhập sai mật khẩu liên tiếp.

**Independent Test**: Nhập sai 5 lần -> Hiển thị cảnh báo tài khoản bị tạm khóa 15 phút.

- [x] T015 [US4] Implement failed login attempts counter & lockout check logic in `src/database/services/authService.js`
- [x] T016 [US4] Display account lockout banner with countdown on Login form in `src/frontend/src/pages/Auth/AuthPage.jsx`

---

## Phase 7: User Story 5 - Password Reset via Email (Priority: P2)

**Goal**: Khôi phục mật khẩu qua email khi người dùng quên mật khẩu.

**Independent Test**: Gửi yêu cầu reset pass -> Nhận link và đặt lại mật khẩu mới.

- [x] T017 [P] [US5] Build Forgot Password & Reset Password UI dialog in `src/frontend/src/pages/Auth/AuthPage.jsx`
- [x] T018 [US5] Implement `resetPasswordForEmail` & `updateUserPassword` in `src/database/services/authService.js`

---

## Phase 8: Polish & Validation

- [x] T019 Run quickstart validation test cases according to `quickstart.md`
- [x] T020 Run `speckit-analyze` to verify code compliance with `spec.md`

