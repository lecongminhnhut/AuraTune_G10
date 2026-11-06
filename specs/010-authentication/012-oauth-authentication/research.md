# Research: OAuth Authentication (012)

## Research Topics & Decisions

### 1. OAuth Implementation Strategy with Supabase Auth

- **Decision**: Use Supabase Auth `signInWithOAuth` (`provider: 'google' | 'facebook'`) combined with a fallback local simulation flow for demo/testing environments.
- **Rationale**: 
  - Supabase provides built-in PKCE (Proof Key for Code Exchange) flow integration with Google OAuth2 and Facebook Graph API.
  - Calling `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: ... } })` allows Supabase to manage secure code exchange and JWT token issuance.
  - Fully aligns with AuraTune's web stack (React + Supabase JS SDK).
- **Alternatives Considered**: 
  - Standalone manual OAuth 2.0 implementation with independent provider SDKs (`google-one-tap` / Facebook JS SDK): Rejected due to higher token security complexity, manual refresh token management, and incompatibility with Supabase `auth.users`.

### 2. Account Linking Mechanism (Email-Based Account Linking)

- **Decision**: Treat `email` as a unique primary key (UNIQUE constraint). When a user logs in via OAuth:
  1. Extract `email` from the OAuth Provider payload.
  2. Check if a user account with the same email already exists in AuraTune.
  3. If not found: Automatically create a new account with default role `'user'`, and store provider link in `oauth_links` or auth state.
  4. If found: Link the OAuth provider identity to the existing account, update profile information (`display_name`, `avatar_url`), and avoid creating duplicate user records.
- **Rationale**: Delivers a seamless user experience and avoids duplicate account creation when users sign in via different authentication methods.

### 3. Profile Sync Rules (Sync on Every Login)

- **Decision**: Update `displayName` and `avatarUrl` from the OAuth payload into the AuraTune user profile on every successful login.
- **Rationale**: Matches the Clarification Session decision from 2026-10-29 in `spec.md`. Keeps user profile pictures and display names updated from Google/Facebook without losing custom role assignments or AuraTune preferences.

### 4. Conditional Provider Unlinking

- **Decision**: Allow users to disconnect Google or Facebook ONLY IF the user account has at least one remaining valid authentication method (e.g., Local Password or another linked OAuth provider).
- **Rationale**: Prevents orphaned user accounts that cannot be accessed after removing the sole authentication provider.

### 5. Security & Privacy Constraints

- **Decision**: 
  - OAuth tokens are used strictly for authentication and immediate profile synchronization during the login session; third-party access/refresh tokens are NOT stored in the database long-term.
  - Under no circumstances shall user PII (email, display name, provider ID) be transmitted to external AI services (adhering to Security Requirement 6.2).

