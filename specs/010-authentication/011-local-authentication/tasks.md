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

**Goal**: Allow new users to create an account using Email + Password + Display Name and agree to the Terms of Service.

**Independent Test**: Fill out registration form with a new email, verify user record is created in DB and user is redirected to Home.

- [x] T005 [P] [US1] Build Registration UI Form with email, display name, password fields and Terms checkbox in `src/frontend/src/pages/Auth/AuthPage.jsx`
- [x] T006 [P] [US1] Add frontend validation for password strength (min 8 chars, 1 upper, 1 lower, 1 digit, 1 special char) in `src/frontend/src/pages/Auth/AuthPage.jsx`
- [x] T007 [US1] Implement `signUp` function with metadata (`display_name`, `terms_accepted_at`) in `src/database/services/authService.js`
- [x] T008 [US1] Handle duplicate email error and show toast alert "Email đã được sử dụng" in `src/frontend/src/pages/Auth/AuthPage.jsx`

---

## Phase 4: User Story 2 - User Login (Priority: P1) 🎯 MVP

**Goal**: Allow registered users to log in using email & password.

**Independent Test**: Enter correct credentials -> successfully store token/session & redirect to Home.

- [x] T009 [P] [US2] Build Login UI Form with email, password fields and Remember Me option in `src/frontend/src/pages/Auth/AuthPage.jsx`
- [x] T010 [US2] Implement `signInWithPassword` method in `src/database/services/authService.js`
- [x] T011 [US2] Handle invalid credentials error with user feedback in `src/frontend/src/pages/Auth/AuthPage.jsx`

---

## Phase 5: User Story 3 - Role-Based Access (Priority: P1)

**Goal**: Assign role-based access permissions (`user`, `artist`, `admin`) to users.

**Independent Test**: Log in with an account having `artist` or `admin` role -> menu correctly displays Studio/Admin Dashboard options.

- [x] T012 [P] [US3] Extend User profile state with `role` attribute in `src/frontend/src/context/AppStore.jsx`
- [x] T013 [P] [US3] Add Role-based UI guards for Navigation & Studio link in `src/frontend/src/components/common/Sidebar.jsx` and `src/frontend/src/components/common/TopBar.jsx`
- [x] T014 [US3] Add Route Protection guards for `/studio` and `/admin` in `src/frontend/src/routes/AppRouter.jsx`

---

## Phase 6: User Story 4 - Account Lockout Security (Priority: P2)

**Goal**: Lock account for 15 minutes after 5 consecutive failed login attempts.

**Independent Test**: Fail login 5 times -> Display warning banner indicating a 15-minute temporary lockout.

- [x] T015 [US4] Implement failed login attempts counter & lockout check logic in `src/database/services/authService.js`
- [x] T016 [US4] Display account lockout banner with countdown on Login form in `src/frontend/src/pages/Auth/AuthPage.jsx`

---

## Phase 7: User Story 5 - Password Reset via Email (Priority: P2)

**Goal**: Recover password via email when the user forgets their password.

**Independent Test**: Send reset password request -> Receive link and set a new password.

- [x] T017 [P] [US5] Build Forgot Password & Reset Password UI dialog in `src/frontend/src/pages/Auth/AuthPage.jsx`
- [x] T018 [US5] Implement `resetPasswordForEmail` & `updateUserPassword` in `src/database/services/authService.js`

---

## Phase 8: Polish & Validation

- [x] T019 Run quickstart validation test cases according to `quickstart.md`
- [x] T020 Run `speckit-analyze` to verify code compliance with `spec.md`


