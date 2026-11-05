# Implementation Plan: Session Management (013)

**Branch**: `013-session-management-spec` | **Date**: 2026-11-05 | **Spec**: [spec.md](./spec.md)

## Summary

Implement secure dual-token Session Management for AuraTune across Local and OAuth authentication flows. The system uses short-lived Access Tokens (stored in-memory on the client) and long-lived Refresh Tokens (stored in HttpOnly, Secure, SameSite=Strict cookies). Features include Refresh Token Rotation with a 60-second grace period, compromise detection on token reuse, persistent sessions ("Remember Me"), maximum 5 active concurrent sessions per user with automatic LRU eviction, multi-device logout, and sliding window inactivity timeouts.

## Technical Context

- **Language/Version**: JavaScript (ES6+, Node.js, React 18)
- **Primary Dependencies**: React 18, `@supabase/supabase-js`, Express / Node HTTP services, Crypto / JWT utilities
- **Storage**: PostgreSQL (`user_sessions` table) via Supabase / Postgres driver
- **Testing**: Integration verification & Quickstart validation scenarios
- **Target Platform**: Web Browsers (Desktop & Mobile) & Node.js API Service
- **Project Type**: Web Application (React Frontend + Node/Supabase Backend Service)
- **Performance Goals**: Token refresh execution < 500ms; Session lookup overhead < 50ms
- **Constraints**: Secure cookie delivery (`HttpOnly`, `SameSite=Strict`, `Secure`), TLS 1.3 requirement, strictly schema-compliant database structure.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- All gates passed. Zero violations.

## Project Structure

### Documentation (this feature)

```text
specs/010-authentication/013-session-management/
├── spec.md
├── checklists/
│   └── requirements.md
├── plan.md              # This file
├── research.md          # Technical research findings
├── data-model.md        # DB Entity design & state transitions
├── quickstart.md        # Quickstart & Verification guide
├── contracts/           # API Contract definitions
│   └── session-api.json
└── tasks.md             # Implementation tasks list
```

### Source Code Layout

```text
src/
├── database/
│   ├── supabaseClient.js            # Database client connection
│   └── services/
│       └── sessionService.js        # Session persistence, token hashing, rotation & revocation logic
└── frontend/src/
    ├── context/AppStore.jsx         # In-memory Access Token & Session state holder
    ├── services/sessionApiClient.js # Axios/Fetch interceptor for auto token refresh & cookie handling
    ├── components/common/TopBar.jsx # User menu with "Logout" & "Logout from all devices"
    └── routes/AppRouter.jsx         # Session guard & authentication route protection
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
