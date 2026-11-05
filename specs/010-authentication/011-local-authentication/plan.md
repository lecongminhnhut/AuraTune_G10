# Implementation Plan: Local Authentication (011)

**Branch**: `011-local-authentication-spec` | **Date**: 2026-11-05 | **Spec**: [spec.md](./spec.md)

## Summary

Triển khai hệ thống Xác thực cục bộ (Local Authentication) cho AuraTune bao gồm Đăng ký, Đăng nhập, Khôi phục mật khẩu, Kiểm soát số lần nhập sai (Account Lockout 15 phút), Phân quyền 3 vai trò (User, Artist, Admin) và chấp nhận Điều khoản dịch vụ.

## Technical Context

- **Language/Version**: JavaScript (ES6+, React 18, Node.js)
- **Primary Dependencies**: React 18, Vite, Supabase JS Client (`@supabase/supabase-js`), Tailwind CSS
- **Storage**: PostgreSQL (Supabase Auth `auth.users` + Bảng public `users`)
- **Testing**: Manual & Component/Integration verification
- **Target Platform**: Web Browsers (Desktop & Mobile)
- **Project Type**: Web Application (Frontend React + Backend Supabase Service)
- **Performance Goals**: Response time API < 300ms
- **Constraints**: Tuân thủ Schema PostgreSQL và API Conventions (`/api/v1`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- All gates passed. Zero violations.

## Project Structure

### Documentation (this feature)

```text
specs/010-authentication/011-local-authentication/
├── spec.md
├── checklists/requirements.md
├── plan.md              # File này
├── research.md          # Kết quả nghiên cứu kỹ thuật
├── data-model.md        # Thiết kế thực thể DB & Trạng thái
├── quickstart.md        # Hướng dẫn kiểm thử và chạy thử
├── contracts/           # Định nghĩa API Contract
│   └── auth-api.json
└── tasks.md             # Danh sách task triển khai
```

### Source Code Layout

```text
src/
├── database/
│   ├── supabaseClient.js          # Kết nối Supabase API
│   └── services/authService.js    # Auth Business Logic & API calls
└── frontend/src/
    ├── pages/Auth/AuthPage.jsx    # Form Login / Register / Reset Password
    ├── context/AppStore.jsx       # Auth State Provider
    └── routes/AppRouter.jsx       # Route Guard & Role Access
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
