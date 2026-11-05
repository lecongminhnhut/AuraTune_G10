# Data Model: OAuth Authentication (012)

## Entities & Relationships

### 1. User (`public.users`)

Manages user profile and account information in AuraTune.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID / String | PK, Required | Unique user identifier |
| `email` | String | UNIQUE, Required | Primary email address (used for Account Linking) |
| `display_name` | String | Required | Display name of the user (synced from OAuth) |
| `avatar_url` | String | Optional | Profile picture URL (synced from OAuth) |
| `role` | String | Enum: `user`, `artist`, `admin` | Default role is `user` when registered via OAuth |
| `has_local_password` | Boolean | Default `true` | Flags whether user has a local password |
| `created_at` | Timestamp | Required | Account creation timestamp |
| `updated_at` | Timestamp | Required | Last profile update timestamp |

### 2. OAuthLink (`public.oauth_links`)

Stores the link between an AuraTune account and a third-party OAuth provider.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID / String | PK, Required | Unique record identifier |
| `user_id` | UUID / String | FK -> `users.id` | User ID owning this provider link |
| `provider` | String | Enum: `google`, `facebook` | OAuth identity provider name |
| `provider_user_id` | String | Required | User ID issued by Google / Facebook |
| `linked_at` | Timestamp | Required | Link creation timestamp |
| `last_login_at` | Timestamp | Required | Most recent OAuth login timestamp |

**Database Constraints**:
- Unique constraint on `(provider, provider_user_id)` ensuring a single Google/Facebook account cannot be linked to two different AuraTune users.
- Unique constraint on `(user_id, provider)` ensuring an AuraTune user links at most one account per provider.

## State Transitions

### OAuth Login / Account Linking State Machine

```text
[Guest / Unauthenticated]
       │
       ├─► Click "Login with Google/Facebook"
       │         │
       │         ▼
       │   [Provider Authorization Page]
       │         │
       │         ├─ User cancels / Denies access ──────► [Error: Cancelled / Redirect back to /login]
       │         │
       │         └─ User approves & returns callback
       │                   │
       │                   ▼
       │         [Check Email Exists in System?]
       │                   │
       │         ┌─────────┴─────────┐
       │         ▼                   ▼
       │      [NO: New User]     [YES: Existing User]
       │         │                   │
       │         ▼                   ▼
       │  Create User Record   Link OAuth Provider to User
       │  Role = 'user'        Sync display_name & avatar_url
       │         │                   │
       └─────────┴─────────┬─────────┘
                           │
                           ▼
                 [Authenticated Session]
                 (JWT Access Token Issued)
```

