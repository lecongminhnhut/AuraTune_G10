# Data Model: Local Authentication (011)

## Entities

### Entity: `users`
- `user_id` (UUID, PK, References `auth.users.id` ON DELETE CASCADE)
- `email` (VARCHAR(255), UNIQUE, NOT NULL)
- `display_name` (VARCHAR(100), NOT NULL)
- `role` (VARCHAR(20), CHECK (`role` IN ('user', 'artist', 'admin')), DEFAULT 'user')
- `failed_login_attempts` (INTEGER, DEFAULT 0, NOT NULL)
- `lockout_until` (TIMESTAMPTZ, NULLABLE)
- `terms_accepted_at` (TIMESTAMPTZ, NOT NULL)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

## State Transitions
- `UNAUTHENTICATED` ➔ `ACTIVE_USER` (Successful registration & Terms checked)
- `ACTIVE_USER` ➔ `LOCKED_USER` (5 consecutive failed login attempts)
- `LOCKED_USER` ➔ `ACTIVE_USER` (15-minute lockout period expires)

