# Quickstart & Verification Guide: Local Authentication

## Environment Setup
1. Đảm bảo biến môi trường `SUPABASE_URL` và `SUPABASE_ANON_KEY` được thiết lập trong file `.env`.
2. Chạy ứng dụng Frontend: `cd src/frontend && pnpm dev`.

## Verification Scenarios

### Test Case 1: Đăng ký thành công & Bắt lỗi Validation
1. Mở trang `/auth`. Chọn tab **Đăng ký**.
2. Thử bấm Submit khi chưa điền thông tin ➔ Kiểm tra hiển thị thông báo lỗi từng trường.
3. Nhập mật khẩu yếu (vd: `123456`) ➔ Báo lỗi mật khẩu không đủ độ mạnh.
4. Nhập đầy đủ nhưng chưa tích **Đồng ý điều khoản** ➔ Nút Đăng ký bị disabled hoặc thông báo lỗi.
5. Nhập email mới hợp lệ + mật khẩu mạnh + tích chọn Điều khoản ➔ Đăng ký thành công, thông báo Toast và chuyển tới trang Home.

### Test Case 2: Đăng nhập & Tạm khóa Tài khoản
1. Nhập sai mật khẩu 1-4 lần ➔ Hiển thị số lần thử còn lại.
2. Nhập sai mật khẩu lần thứ 5 ➔ Hiển thị thông báo tài khoản bị khóa 15 phút.

### Test Case 3: Chuyển hướng theo Role
1. Đăng nhập với tài khoản `role: user` ➔ Hiển thị User Menu chuẩn.
2. Đăng nhập với tài khoản `role: artist` ➔ Hiển thị tùy chọn truy cập **Artist Studio**.
3. Đăng nhập với tài khoản `role: admin` ➔ Hiển thị tùy chọn truy cập **Admin Dashboard**.
