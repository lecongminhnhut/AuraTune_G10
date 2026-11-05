# Technical Research: Local Authentication

## Decision 1: Auth Engine Strategy
- **Decision**: Sử dụng Supabase Auth (`supabase.auth.signUp`, `supabase.auth.signInWithPassword`) kết hợp trigger/sync sang bảng `public.users`.
- **Rationale**: Tận dụng cơ chế mã hóa mật khẩu bảo mật của Supabase, tự động phát hành JWT Access/Refresh tokens.
- **Alternatives Considered**: Tự viết Custom JWT Server Node.js/Express (bị từ chối do tăng độ phức tạp không cần thiết).

## Decision 2: Password Complexity Rules
- **Decision**: Tối thiểu 8 ký tự, gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt.
- **Rationale**: Đảm bảo an toàn trước tấn công dò mật khẩu đơn giản.

## Decision 3: Account Lockout Mechanism
- **Decision**: Lưu `failed_login_attempts` và `lockout_until` trong `public.users`. Sau 5 lần nhập sai liên tiếp, khóa 15 phút.
- **Rationale**: Ngăn chặn tấn công brute-force.

## Decision 4: Terms Acceptance
- **Decision**: Lưu mốc thời gian `terms_accepted_at` khi người dùng tích chọn đồng ý Điều khoản & Chính sách quyền riêng tư.
- **Rationale**: Đảm bảo tuân thủ tính pháp lý và yêu cầu sản phẩm.
