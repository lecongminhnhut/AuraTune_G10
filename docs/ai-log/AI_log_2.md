# Nhật ký sử dụng AI – Authentication & Session Management

_Mỗi lần dùng AI được ghi thành một mục riêng theo trình tự thực hiện._

| #   | Ngày       | Nội dung                                                                                                     | Nhóm |
| --- | ---------- | ------------------------------------------------------------------------------------------------------------ | ---- |
| 1   | 2026-10-24 | Viết spec 011 – Local Authentication bằng `$speckit-specify`                                                  | 01   |
| 2   | 2026-10-24 | Làm rõ spec 011 bằng `$speckit-clarify` – email verification, password recovery, locking, token và display name | 01   |
| 3   | 2026-10-29 | Viết spec 012 – OAuth Authentication bằng `$speckit-specify`                                                 | 01   |
| 4   | 2026-10-29 | Làm rõ spec 012 bằng `$speckit-clarify` – profile sync, unlinking, token storage                             | 01   |
| 5   | 2026-10-29 | Viết spec 013 – Session Management bằng `$speckit-specify`                                                   | 01   |
| 6   | 2026-10-29 | Làm rõ spec 013 bằng `$speckit-clarify` – inactivity timeout, session limit, binding, grace period           | 01   |

---

## Mục 1: Viết spec 011 – Local Authentication

| Trường                   | Nội dung                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-24                                                                                                        |
| Người thực hiện          | Mai Đăng Khoa                                                                                                     |
| Nhóm tính năng liên quan | 01 – Authentication, Feature 011: Local Authentication (`specs/010-authentication/011-local-authentication`)      |
| Công cụ AI               | Gemini 3.5, `$speckit-specify`                                                                                    |
| Mục đích                 | Tạo đặc tả nghiệp vụ cho tính năng đăng ký/đăng nhập bằng email cục bộ dựa trên Proposal và ER Diagram.           |

### Prompt đã dùng

```text
/speckit.specify

Đặc tả tính năng Local Authentication (011) cho AuraTune. Tính năng này cho phép người dùng đăng ký và đăng nhập bằng tài khoản email cục bộ.

Yêu cầu cụ thể:
1. Đăng ký (Sign up): Người dùng cung cấp email (duy nhất), mật khẩu và tên hiển thị. Cần kiểm tra định dạng email và độ mạnh của mật khẩu.
2. Đăng nhập (Log in): Xác thực người dùng bằng email và mật khẩu đã đăng ký.
3. Phân quyền (Roles): Mặc định người dùng mới có role là 'user'. Hệ thống cần hỗ trợ các role 'artist' và 'admin' như đã nêu trong ER Diagram.
4. Tiêu chí chấp nhận:
   - Đăng ký thành công tạo mới một record trong bảng 'users'.
   - Đăng nhập thành công trả về thông tin người dùng và phiên làm việc (token).
   - Xử lý lỗi khi email đã tồn tại, sai mật khẩu hoặc định dạng không hợp lệ.
5. Ràng buộc: Tuân thủ cấu trúc database PostgreSQL đã thống nhất (bảng users, cột email UNIQUE).

Tập trung vào mô tả hành vi, yêu cầu bảo mật cơ bản và trải nghiệm người dùng; không tự đưa ra quyết định về thư viện mã hóa cụ thể cho đến bước Plan.
```

### Tóm tắt phản hồi của AI

- Tạo spec hoàn chỉnh với các mục User Stories, Functional Requirements, Edge Cases, Key Entities và Success Criteria.
- Ánh xạ đúng các role người dùng từ ER Diagram.
- Đưa ra các giả định về JWT và Bcrypt để làm cơ sở cho bước Plan.
- Tạo checklist chất lượng với 16/16 mục đạt yêu cầu ban đầu.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần            | Quyết định | Lý do                                                                        |
| --------------- | ---------- | ---------------------------------------------------------------------------- |
| Cấu trúc Spec   | Dùng       | Tuân thủ đúng template của dự án.                                            |
| Role người dùng | Dùng       | Khớp với thiết kế database đã có.                                            |
| Giả định kỹ thuật | Dùng       | Cần thiết để định hướng cho phase Plan nhưng không đưa vào FR chính thức. |

### Cách kiểm chứng

- Đối chiếu với `docs/proposal/proposal.md` và `docs/design/database/er-diagram.md`.
- Rà soát acceptance scenarios và edge cases.
- Kiểm tra checklist chất lượng tại `specs/010-authentication/011-local-authentication/checklists/requirements.md`.

**Kết quả kiểm chứng:** Đạt.

---

## Mục 2: Làm rõ spec 011 – Local Authentication

| Trường                   | Nội dung                                                                       |
| ------------------------ | ------------------------------------------------------------------------------ |
| Ngày                     | 2026-10-24                                                                     |
| Người thực hiện          | Mai Đăng Khoa                                                                  |
| Nhóm tính năng liên quan | 01 – Authentication, Feature 011: Local Authentication                         |
| Công cụ AI               | Gemini 3.5, `$speckit-clarify`                                                 |
| Mục đích                 | Làm rõ các biên của tính năng, chính sách bảo mật và các ràng buộc dữ liệu.    |

### Prompt đã dùng

```text
/speckit-clarify
```

### Tóm tắt phản hồi của AI

- Đặt 5 câu hỏi trọng tâm về: Email verification, Password recovery, Account locking, Refresh token, và Display name uniqueness.
- Tự động tích hợp câu trả lời vào spec và cập nhật checklist.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                       | Quyết định | Lý do                                                              |
| -------------------------- | ---------- | ------------------------------------------------------------------ |
| Bỏ Email Verification      | Dùng       | Giảm ma sát cho người dùng trong giai đoạn MVP.                    |
| Khóa tài khoản (Locking)   | Dùng       | Tăng cường bảo mật chống brute-force.                              |
| Không dùng Refresh Token   | Dùng       | Đơn giản hóa kiến trúc API cho phase đầu.                          |
| Tên hiển thị không duy nhất | Dùng       | Theo mô hình của Spotify, dùng ID làm định danh chính.             |

### Cách kiểm chứng

- Kiểm tra mục `## Clarifications` trong `spec.md`.
- Xác nhận các FR (FR-001, FR-004, FR-008, FR-009) đã được cập nhật tương ứng.
- Kiểm tra checklist chất lượng (16/16 items passing).

**Kết quả kiểm chứng:** Đạt.

---

## Mục 3: Viết spec 012 – OAuth Authentication

| Trường                   | Nội dung                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-29                                                                                                        |
| Người thực hiện          | Mai Đăng Khoa                                                                                                     |
| Nhóm tính năng liên quan | 01 – Authentication, Feature 012: OAuth Authentication (`specs/010-authentication/012-oauth-authentication`)      |
| Công cụ AI               | Gemini 3.5, `$speckit-specify`                                                                                    |
| Mục đích                 | Đặc tả tính năng đăng nhập qua Google/Facebook và cơ chế liên kết tài khoản (account linking).                   |

### Prompt đã dùng

```text
Đặc tả tính năng OAuth Authentication (012) cho AuraTune. Tính năng này mở rộng hệ thống xác thực để cho phép người dùng đăng nhập nhanh chóng thông qua các nhà cung cấp bên thứ ba. Yêu cầu cụ thể: 1. Nhà cung cấp (Providers): Hỗ trợ đăng nhập qua Google và Facebook (theo Vision Document AD-07). 2. Quy trình (Flow): Người dùng được điều hướng đến trang của Provider. Sau khi xác thực thành công, Provider trả về code/token. Hệ thống AuraTune xử lý callback, lấy thông tin người dùng (email, display name, avatar). Nếu email chưa tồn tại, tự động tạo tài khoản mới với role mặc định là 'user'. Nếu email đã tồn tại, liên kết phiên đăng nhập với tài khoản hiện có. 3. Liên kết tài khoản (Account Linking): Cho phép một email duy nhất có thể đăng nhập bằng cả Local Password và OAuth mà không tạo trùng lặp bản ghi (dựa trên email UNIQUE). 4. Lưu trữ: Cần cập nhật bảng 'users' hoặc bảng liên quan để lưu trữ OAuth Provider ID và trạng thái liên kết. 5. Tiêu chí chấp nhận: Đăng nhập thành công trả về JWT access token tương tự như Local Auth. Thông tin người dùng (tên, avatar) từ Provider được cập nhật vào profile AuraTune trong lần đăng nhập đầu tiên. Xử lý các lỗi như người dùng hủy đăng nhập tại trang Provider hoặc Provider service bị gián đoạn. Ràng buộc: Tuân thủ cấu trúc database hiện tại. Đảm bảo tính bảo mật khi truyền tải token (HTTPS/TLS 1.3). Không gửi định danh cá nhân trực tiếp cho các dịch vụ AI bên ngoài (Security Requirement 6.2).
```

### Tóm tắt phản hồi của AI

- Tạo đặc tả với các kịch bản người dùng về đăng ký nhanh, liên kết tài khoản và đồng bộ profile.
- Xác định thực thể `OAuthLink` để quản lý kết nối với bên thứ ba.
- Đưa ra yêu cầu về tính duy nhất của email trên toàn hệ thống.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                   | Quyết định | Lý do                                                                 |
| ---------------------- | ---------- | --------------------------------------------------------------------- |
| Account Linking        | Dùng       | Rất quan trọng để tránh tạo nhiều tài khoản cho cùng một người dùng. |
| Role 'user' mặc định   | Dùng       | Nhất quán với Local Auth.                                             |
| Không gửi PII cho AI   | Dùng       | Tuân thủ yêu cầu bảo mật của dự án.                                   |

### Cách kiểm chứng

- Đối chiếu với Vision Document (AD-07) và API Contract.
- Kiểm tra tính nhất quán của JWT token với Local Auth.

**Kết quả kiểm chứng:** Đạt.

---

## Mục 4: Làm rõ spec 012 – OAuth Authentication

| Trường                   | Nội dung                                                                       |
| ------------------------ | ------------------------------------------------------------------------------ |
| Ngày                     | 2026-10-29                                                                     |
| Người thực hiện          | Mai Đăng Khoa                                                                  |
| Nhóm tính năng liên quan | 01 – Authentication, Feature 012: OAuth Authentication                         |
| Công cụ AI               | Gemini 3.5, `$speckit-clarify`                                                 |
| Mục đích                 | Làm rõ chính sách đồng bộ dữ liệu và hủy liên kết tài khoản xã hội.            |

### Prompt đã dùng

```text
/speckit-clarify
```

### Tóm tắt phản hồi của AI

- Làm rõ việc đồng bộ profile (tên, avatar) mỗi khi đăng nhập.
- Chốt điều kiện hủy liên kết (chỉ cho phép nếu còn phương thức đăng nhập khác).
- Xác định chỉ sử dụng token của provider cho việc xác thực, không lưu trữ lâu dài cho tác vụ nền.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                       | Quyết định | Lý do                                                                  |
| -------------------------- | ---------- | ---------------------------------------------------------------------- |
| Sync on Every Login        | Dùng       | Đảm bảo thông tin người dùng luôn mới nhất từ provider.               |
| Conditional Unlinking      | Dùng       | Ngăn chặn tình trạng tài khoản mồ côi (không có cách đăng nhập).      |
| Auth-Only Tokens           | Dùng       | Giảm thiểu rủi ro bảo mật khi không cần thao tác API bên thứ ba lâu dài. |

### Cách kiểm chứng

- Kiểm tra mục `## Clarifications` trong `specs/010-authentication/012-oauth-authentication/spec.md`.

**Kết quả kiểm chứng:** Đạt.

---

## Mục 5: Viết spec 013 – Session Management

| Trường                   | Nội dung                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-29                                                                                                        |
| Người thực hiện          | Mai Đăng Khoa                                                                                                     |
| Nhóm tính năng liên quan | 01 – Authentication, Feature 013: Session Management (`specs/010-authentication/013-session-management`)          |
| Công cụ AI               | Gemini 3.5, `$speckit-specify`                                                                                    |
| Mục đích                 | Đặc tả quản lý phiên làm việc tập trung, cơ chế Refresh Token và bảo mật session.                                 |

### Prompt đã dùng

```text
Đặc tả tính năng Session Management (013) cho AuraTune. Tính năng này tập trung vào việc quản lý phiên làm việc của người dùng sau khi đã xác thực thành công qua Local Auth (011) hoặc OAuth (012), đảm bảo trải nghiệm liền mạch và bảo mật.

Yêu cầu cụ thể:
1. Cơ chế Token: Triển khai mô hình JWT kép gồm Access Token (thời hạn ngắn, ví dụ 15-60 phút) và Refresh Token (thời hạn dài, ví dụ 7-30 ngày).
2. Refresh Token Rotation: Hỗ trợ endpoint `/auth/refresh` để cấp Access Token mới khi bản cũ hết hạn. Refresh Token phải được xoay vòng (cấp mới mỗi lần sử dụng) để ngăn chặn replay attacks.
3. Đăng xuất (Logout): Triển khai endpoint `/auth/logout` để vô hiệu hóa phiên làm việc hiện tại bằng cách xóa/thu hồi Refresh Token trong cơ sở dữ liệu.
4. Lưu trữ và Bảo mật: 
   - Refresh Token PHẢI được lưu trong HttpOnly Cookie (Secure, SameSite=Strict) để chống XSS.
   - Access Token có thể trả về trong response body để Frontend lưu trữ trong bộ nhớ (Memory).
   - Mọi giao tiếp phải qua HTTPS/TLS 1.3 theo Security Requirement 6.2.
5. Quản lý phiên đa thiết bị: Cho phép lưu trữ Refresh Token trong bảng mới (ví dụ `user_sessions` hoặc `refresh_tokens`) liên kết với `user_id`, hỗ trợ khả năng đăng xuất khỏi tất cả thiết bị hoặc xem danh sách thiết bị đang hoạt động.
6. Trạng thái duy trì (Remember Me): Tùy chọn cho phép người dùng duy trì đăng nhập qua các lần đóng trình duyệt bằng cách điều chỉnh thời hạn của Refresh Token.

Tiêu chí chấp nhận:
- Sau khi login (011/012), hệ thống trả về đúng cặp token.
- Endpoint `/auth/refresh` hoạt động chính xác, từ chối token đã hết hạn hoặc đã bị thu hồi.
- Đăng xuất thành công làm cho Refresh Token cũ không còn giá trị sử dụng.
- Đảm bảo tính nhất quán với API Contract bản v1 (mục 2.1).

Ràng buộc:
- Cập nhật schema PostgreSQL để lưu trữ Refresh Token.
- Không thay đổi cấu trúc JWT đã thống nhất ở các tính năng trước nhưng bổ sung thêm logic kiểm tra hợp lệ.
```

### Tóm tắt phản hồi của AI

- Tạo đặc tả chi tiết về cơ chế token kép và xoay vòng refresh token.
- Định nghĩa thực thể `UserSession` để quản lý đa thiết bị.
- Đưa ra các kịch bản đăng xuất toàn cục và bảo mật cookie.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                   | Quyết định | Lý do                                                                 |
| ---------------------- | ---------- | --------------------------------------------------------------------- |
| Refresh Token Rotation | Dùng       | Cực kỳ quan trọng để bảo vệ Refresh Token khỏi bị lạm dụng.           |
| HttpOnly Cookies       | Dùng       | Tiêu chuẩn vàng để chống tấn công XSS đánh cắp session.               |
| UserSession Entity     | Dùng       | Hỗ trợ quản lý thiết bị và thu hồi session phía server.              |

### Cách kiểm chứng

- Đối chiếu với API Contract (mục 2.1) về các endpoint `/auth/refresh` và `/auth/logout`.
- Kiểm tra tính khả thi của mô hình dữ liệu mới trong `UserSession`.

**Kết quả kiểm chứng:** Đạt.

---

## Mục 6: Làm rõ spec 013 – Session Management

| Trường                   | Nội dung                                                                       |
| ------------------------ | ------------------------------------------------------------------------------ |
| Ngày                     | 2026-10-29                                                                     |
| Người thực hiện          | Mai Đăng Khoa                                                                  |
| Nhóm tính năng liên quan | 01 – Authentication, Feature 013: Session Management                           |
| Công cụ AI               | Gemini 3.5, `$speckit-clarify`                                                 |
| Mục đích                 | Chốt các tham số thời gian, giới hạn thiết bị và cơ chế ân hạn khi xoay token. |

### Prompt đã dùng

```text
/speckit-clarify
```

### Tóm tắt phản hồi của AI

- Chốt thời gian chờ không hoạt động (inactivity timeout) là 7 ngày.
- Giới hạn tối đa 5 phiên làm việc (thiết bị) đồng thời cho mỗi người dùng.
- Áp dụng cơ chế "Weak binding" dựa trên User-Agent.
- Chốt thời gian ân hạn (grace period) 60 giây khi xoay Refresh Token.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                       | Quyết định | Lý do                                                                  |
| -------------------------- | ---------- | ---------------------------------------------------------------------- |
| 7-day Inactivity Timeout   | Dùng       | Cân bằng giữa bảo mật và sự tiện lợi cho người dùng.                   |
| Limit 5 Devices            | Dùng       | Ngăn chặn lạm dụng tài khoản mà vẫn đủ dùng cho nhu cầu cá nhân.       |
| 60s Grace Period           | Dùng       | Giải quyết vấn đề mất mạng giữa chừng khi đang nhận token mới.         |

### Cách kiểm chứng

- Kiểm tra mục `## Clarifications` trong `specs/010-authentication/013-session-management/spec.md`.
- Xác nhận các FR-011, FR-012, FR-013, FR-014 đã được thêm vào spec.

**Kết quả kiểm chứng:** Đạt.
