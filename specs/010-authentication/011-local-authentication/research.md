# Technical Research: Local Authentication (011)

## Decision 1: Auth Engine Strategy
- **Decision**: Use Supabase Auth (`supabase.auth.signUp`, `supabase.auth.signInWithPassword`) combined with trigger/sync to the `public.users` table.
- **Rationale**: Leverages Supabase's built-in secure password hashing and automatic JWT Access/Refresh token issuance.
- **Alternatives Considered**: Writing a custom Node.js/Express JWT authentication server (rejected due to unnecessary added complexity).

## Decision 2: Password Complexity Rules
- **Decision**: Minimum 8 characters, including at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.
- **Rationale**: Ensures protection against simple brute-force and dictionary attacks.

## Decision 3: Account Lockout Mechanism
- **Decision**: Store `failed_login_attempts` and `lockout_until` in `public.users`. After 5 consecutive failed attempts, lock the account for 15 minutes.
- **Rationale**: Prevents automated brute-force attacks.

## Decision 4: Terms Acceptance
- **Decision**: Store the `terms_accepted_at` timestamp when the user checks the Terms of Service & Privacy Policy agreement.
- **Rationale**: Ensures legal compliance and product requirements alignment.

