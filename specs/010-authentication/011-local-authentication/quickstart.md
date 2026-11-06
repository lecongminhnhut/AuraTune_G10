# Quickstart & Verification Guide: Local Authentication (011)

## Environment Setup
1. Ensure environment variables `SUPABASE_URL` and `SUPABASE_ANON_KEY` are configured in `.env`.
2. Start the Frontend application: `cd src/frontend && pnpm dev`.

## Verification Scenarios

### Test Case 1: Successful Registration & Validation Errors
1. Open page `/login` or `/register`. Select the **Register** tab.
2. Submit without filling fields ➔ Verify field validation error messages display.
3. Enter a weak password (e.g., `123456`) ➔ Password strength error displays.
4. Fill required fields but leave **Terms agreement** unchecked ➔ Validation error requires checking Terms.
5. Fill valid new email + strong password + check Terms ➔ Successful registration, Toast notification appears, and user is redirected to Home.

### Test Case 2: Login & Account Lockout
1. Enter wrong password 1-4 times ➔ Remaining attempt count warning displays.
2. Enter wrong password the 5th time ➔ Account lockout banner displays indicating a 15-minute lock.

### Test Case 3: Role-Based Redirection
1. Log in with account `role: user` ➔ Standard User Menu displays.
2. Log in with account `role: artist` ➔ Navigation options include **Artist Studio**.
3. Log in with account `role: admin` ➔ Navigation options include **Admin Dashboard**.

