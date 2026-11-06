# Data Model: Session Management (013)

## 1. Database Schema (`user_sessions` Table)

```sql
CREATE TABLE IF NOT EXISTS public.user_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    refresh_token_hash TEXT NOT NULL,
    previous_token_hash TEXT NULL,
    grace_expires_at TIMESTAMPTZ NULL,
    device_info TEXT NULL,
    ip_address VARCHAR(45) NULL,
    remember_me BOOLEAN NOT NULL DEFAULT FALSE,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    inactive_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

-- Indexes for performance & quick session verification
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token_hash ON public.user_sessions(refresh_token_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_prev_hash ON public.user_sessions(previous_token_hash);
```

---

## 2. Field Definitions

| Column Name | Type | Description |
|-------------|------|-------------|
| `session_id` | UUID | Primary key uniquely identifying the session. |
| `user_id` | UUID | Foreign key pointing to `public.users(user_id)`. |
| `refresh_token_hash` | TEXT | Cryptographic SHA-256 hash of the active Refresh Token. |
| `previous_token_hash` | TEXT | Cryptographic SHA-256 hash of the immediate prior Refresh Token (for grace period validation). |
| `grace_expires_at` | TIMESTAMPTZ | Timestamp when the 60-second grace period for the previous token expires. |
| `device_info` | TEXT | Parsed User-Agent description (e.g. "Chrome 120 on macOS"). |
| `ip_address` | VARCHAR(45) | IP address of client during last activity. |
| `remember_me` | BOOLEAN | Indicates if session has extended duration (30 days vs 7 days). |
| `is_revoked` | BOOLEAN | Set to `TRUE` if session is manually or automatically terminated. |
| `created_at` | TIMESTAMPTZ | Creation timestamp of the session. |
| `last_active_at` | TIMESTAMPTZ | Updated on every successful token refresh. |
| `inactive_at` | TIMESTAMPTZ | Sliding window threshold (`last_active_at + 7 days`). |
| `expires_at` | TIMESTAMPTZ | Maximum absolute lifetime limit (`created_at + 7/30 days`). |

---

## 3. Session State Diagram & Transitions

```text
       [ User Login ]
             │
             ▼
        ┌─────────┐
        │ ACTIVE  │◄──────────────────────────────┐
        └────┬────┘                               │
             │                                    │
   ┌─────────┼───────────────────┬──────────────┐ │
   │         │                   │              │ │ (Valid Token Refresh)
   ▼         ▼                   ▼              ▼ │
┌──────┐ ┌───────────────┐ ┌───────────┐ ┌─────────────┐
│LOGOUT│ │TOKEN ROTATION │ │ INACTIVE  │ │ MAX EXPIRED │
└──┬───┘ └───────┬───────┘ └─────┬─────┴ └──────┬──────┘
   │             │               │              │
   │      (60s Grace Window)     │              │
   │             │               │              │
   ▼             ▼               ▼              ▼
┌─────────────────────────────────────────────────────┐
│                     REVOKED                         │
└─────────────────────────────────────────────────────┘
```

### State Definitions
- **ACTIVE**: Session is valid and can be refreshed to obtain new Access Tokens.
- **REFRESHED**: Session remains active; token hash is updated, previous hash is kept during the 60s grace window.
- **REVOKED**: Invalidated due to manual logout, multi-device logout, 5-session LRU eviction, or token reuse detection.
- **EXPIRED**: Absolute expiration (`expires_at`) or sliding window inactivity (`inactive_at`) reached.
