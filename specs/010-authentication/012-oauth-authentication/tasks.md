# Tasks: OAuth Authentication (012)

**Branch**: `012-oauth-authentication` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Phase 1: Setup & Environment

- [x] T001 Verify Supabase Auth client configuration for Google and Facebook OAuth providers in `src/database/supabaseClient.js`

## Phase 2: Foundational

- [x] T002 Implement core OAuth Service helper routines in `src/database/services/oauthService.js` for initiating provider auth redirect, handling token callback, checking existing accounts by email, and syncing profile data.

## Phase 3: User Story 1 - Fast Registration & Login via Google/Facebook (Priority: P1)

- [x] T003 [US1] Create OAuth Callback handling component in `src/frontend/src/pages/Auth/OAuthCallback.jsx` to parse authorization tokens/codes, call `oauthService`, update store user session, and navigate back to standard flow.
- [x] T004 [US1] Connect Google and Facebook login button handlers in `src/frontend/src/pages/Auth/AuthPage.jsx` to trigger `oauthService.loginWithProvider('google' | 'facebook')` and handle cancellation or errors gracefully.
- [x] T005 [P] [US1] Extend `useStore` in `src/frontend/src/context/AppStore.jsx` with `loginWithOAuth` and `handleOAuthCallback` methods to store currentUser session and provider access status.

## Phase 4: User Story 2 - Account Linking for Existing Users (Priority: P1)

- [x] T006 [US2] Implement Account Linking logic in `src/database/services/oauthService.js` that checks for existing user email, links the provider record in `oauth_links` / `users`, and avoids creating duplicate user records.
- [x] T007 [US2] Update `AppStore.jsx` state handler to automatically attach OAuth provider identity to existing local user accounts when matching email is detected during login.

## Phase 5: User Story 3 - Profile Data Synchronization on Every Login (Priority: P2)

- [x] T008 [US3] Implement automatic profile synchronization in `src/database/services/oauthService.js` to update `display_name` and `avatar_url` from OAuth provider claims into user profile during every successful OAuth authentication.

## Phase 6: User Story 4 - Conditional Provider Unlinking (Priority: P3)

- [x] T009 [US4] Implement provider unlinking service method `unlinkProvider(userId, provider)` in `src/database/services/oauthService.js` that enforces the rule: unlinking is allowed ONLY if the user has another valid auth method (local password or another linked OAuth provider).
- [x] T010 [US4] Create Account Settings connected providers management UI in `src/frontend/src/pages/Settings/AccountSettings.jsx` showing active linked providers (Google/Facebook/Password) and providing an "Unlink" button with proper validation feedback.

## Phase 7: Polish & Validation

- [x] T011 Update `src/frontend/src/routes/AppRouter.jsx` to register `/auth/callback` route for handling OAuth provider redirects.
- [x] T012 Perform end-to-end verification of OAuth login, account linking, profile sync, and conditional unlinking according to `quickstart.md`.
