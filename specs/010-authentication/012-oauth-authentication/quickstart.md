# Quickstart Guide: OAuth Authentication (012)

Testing and verification guide for Google and Facebook OAuth 2.0 Login / Registration.

## 1. Environment Prerequisites

- Node.js >= 18.x
- Vite dev server running at `http://localhost:5173`
- Environment file `.env` configured with Supabase Client keys:
  ```env
  VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
  ```

## 2. Verification Scenarios

### Scenario 1: Fast Registration / Login via Google OAuth
1. Open Login page (`http://localhost:5173/login`) or Registration page (`http://localhost:5173/register`).
2. Click **"Continue with Google"** or **"Sign up with Google"**.
3. **Expected Outcome**: 
   - User is redirected to Google OAuth Consent screen (or demo OAuth simulation environment).
   - Upon authorization, user is redirected back to AuraTune's callback handler, automatically creating an account with `email`, `display_name`, and `avatar_url` retrieved from Google profile.
   - JWT Access Token is issued and login success state is displayed.

### Scenario 2: Fast Registration / Login via Facebook OAuth
1. Open Login page (`http://localhost:5173/login`).
2. Click **"Continue with Facebook"**.
3. **Expected Outcome**: 
   - System initiates Facebook authorization flow.
   - Upon approval, user is logged into the AuraTune account matching Facebook email with avatar / display name synced from Facebook.

### Scenario 3: Account Linking (Existing Local Password User)
1. Assume email `user@example.com` was previously registered via Local Password.
2. User clicks "Continue with Google" using a Google account with the matching email `user@example.com`.
3. **Expected Outcome**: 
   - System detects existing email and avoids creating a duplicate account record.
   - Automatically links Google OAuth Provider to the existing user account.
   - Synchronizes display name and avatar URL from Google.

### Scenario 4: Profile Synchronization (Sync on Every Login)
1. Log out of Google/Facebook account.
2. Change display name / profile picture on the Provider side.
3. Log in again via OAuth into AuraTune.
4. **Expected Outcome**: AuraTune user profile immediately updates with the latest display name and avatar URL.

### Scenario 5: Conditional Provider Unlinking
1. Open Account Settings (`http://localhost:5173/settings/account`).
2. If account has 2 login methods (e.g. Local Password + Google): Click "Unlink Google" ➔ Success notification displays.
3. If account has only 1 login method (Google OAuth only, no local password): Click "Unlink Google" ➔ **Expected Outcome**: Error notification prevents unlinking, requiring the user to set up a password or link another provider first.

