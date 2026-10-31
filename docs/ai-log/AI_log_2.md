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
| 7   | 2026-10-29 | Viết spec 061 – Playlist CRUD bằng `$speckit-specify`                                                       | 06   |
| 8   | 2026-10-29 | Làm rõ spec 061 – last write wins, soft delete, character limits, visibility                               | 06   |
| 9   | 2026-10-29 | Viết spec 062 – Playlist Song Management bằng `$speckit-specify`                                            | 06   |
| 10  | 2026-10-29 | Làm rõ spec 062 – bulk add, duplicates, sorting, search in playlist                                         | 06   |
| 11  | 2026-10-29 | Viết spec 063 – Playlist Playback bằng `$speckit-specify`                                                   | 06   |
| 12  | 2026-10-29 | Làm rõ spec 063 – queue behavior, auto-play next, gapless playback                                          | 06   |
| 13  | 2026-10-29 | Viết spec 064 – AI Playlist Generation bằng `$speckit-specify`                                              | 06   |
| 14  | 2026-10-29 | Làm rõ spec 064 – prompt engineering, refinement, feedback loop, history                                    | 06   |
| 15  | 2026-10-29 | Viết spec 065 – Collaborative Playlists bằng `$speckit-specify`                                             | 06   |
| 16  | 2026-10-29 | Làm rõ spec 065 – invitations, edit rights, activity stream, conflict resolution                            | 06   |
| 17  | 2026-10-31 | Viết spec 071 – Listening History bằng `$speckit-specify`                                                   | 07   |
| 18  | 2026-10-31 | Làm rõ spec 071 – threshold (30s), retention policy (365d), soft delete                                     | 07   |
| 19  | 2026-10-31 | Viết spec 072 – Listening Duration Analytics bằng `$speckit-specify`                                         | 07   |
| 20  | 2026-10-31 | Làm rõ spec 072 – chart types, filtering, export functionality                                              | 07   |
| 21  | 2026-10-31 | Viết spec 073 – Top Artists and Genres bằng `$speckit-specify`                                              | 07   |
| 22  | 2026-10-31 | Làm rõ spec 073 – time ranges (4 weeks, 6 months, all time), ranking algorithm                              | 07   |

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

---

## Mục 7: Viết spec 061 – Playlist CRUD

| Trường                   | Nội dung                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-29                                                                                                        |
| Người thực hiện          | Mai Đăng Khoa                                                                                                     |
| Nhóm tính năng liên quan | 06 – Playlist Management, Feature 061: Playlist CRUD (`specs/060-playlist-management/061-playlist-crud`)          |
| Công cụ AI               | Gemini 3.5, `$speckit-specify`                                                                                    |
| Mục đích                 | Tạo đặc tả nghiệp vụ cho việc tạo, xem, cập nhật và xóa playlist.                                                 |

### Prompt đã dùng

```text
/speckit.specify

Đặc tả tính năng Playlist CRUD (061) cho dự án AuraTune. Tính năng này cung cấp các quản lý cốt lõi cho playlist do người dùng tạo.
Yêu cầu:
1. Tạo playlist với tên và mô tả.
2. Xem danh sách playlist của tôi.
3. Cập nhật thông tin playlist (tên, mô tả, ảnh bìa).
4. Xóa playlist.
```

### Tóm tắt phản hồi của AI

- Sinh ra spec đầy đủ với các User Stories về Create, Update, Delete và View Public Playlists.
- Xác định thực thể Playlist với các thuộc tính cần thiết.
- Đề xuất các Success Criteria về hiệu năng (load < 1s).

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần            | Quyết định | Lý do                                                                        |
| --------------- | ---------- | ---------------------------------------------------------------------------- |
| Cấu trúc Spec   | Dùng       | Đầy đủ và chuyên nghiệp.                                                     |
| Acceptance Scenarios | Dùng    | Rõ ràng, dễ hiểu.                                                            |

### Cách kiểm chứng

- Đối chiếu với Vision Document.
- Kiểm tra checklist tại `specs/060-playlist-management/061-playlist-crud/checklists/requirements.md`.

**Kết quả kiểm chứng:** Đạt.

---

## Mục 8: Làm rõ spec 061 – Playlist CRUD

| Trường                   | Nội dung                                                                       |
| ------------------------ | ------------------------------------------------------------------------------ |
| Ngày                     | 2026-10-29                                                                     |
| Người thực hiện          | Mai Đăng Khoa                                                                  |
| Nhóm tính năng liên quan | 06 – Playlist Management, Feature 061: Playlist CRUD                           |
| Công cụ AI               | Gemini 3.5, `$speckit-clarify`                                                 |
| Mục đích                 | Làm rõ các quy tắc về sửa đổi đồng thời, xóa dữ liệu và giới hạn ký tự.       |

### Prompt đã dùng

```text
/speckit-clarify
```

### Tóm tắt phản hồi của AI

- Đặt câu hỏi về xử lý xung đột (Last write wins).
- Xác định cơ chế xóa (Xóa vĩnh viễn sau khi xác nhận).
- Chốt giới hạn ký tự: Tên (100), Mô tả (500).
- Mặc định playlist mới là Private.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                       | Quyết định | Lý do                                                              |
| -------------------------- | ---------- | ------------------------------------------------------------------ |
| Last Write Wins            | Dùng       | Đơn giản cho giai đoạn đầu.                                        |
| Permanent Deletion         | Dùng       | Theo yêu cầu thiết kế hệ thống.                                    |
| Private by Default         | Dùng       | Đảm bảo quyền riêng tư người dùng.                                 |

### Cách kiểm chứng

- Kiểm tra mục `## Clarifications` trong `specs/060-playlist-management/061-playlist-crud/spec.md`.

**Kết quả kiểm chứng:** Đạt.

---

## Mục 9: Viết spec 062 – Playlist Song Management

| Trường                   | Nội dung                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-29                                                                                                        |
| Người thực hiện          | Mai Đăng Khoa                                                                                                     |
| Nhóm tính năng liên quan | 06 – Playlist Management, Feature 062: Playlist Song Management (`specs/060-playlist-management/062-playlist-song-management`) |
| Công cụ AI               | Gemini 3.5, `$speckit-specify`                                                                                    |
| Mục đích                 | Đặc tả logic và UI cho việc quản lý các bài hát trong playlist.                                                   |

### Prompt đã dùng

```text
Specify feature 062-playlist-song-management for the AuraTune project. This feature provides the logic and UI for managing the tracks within a playlist.
```

### Tóm tắt phản hồi của AI

- Xây dựng các kịch bản thêm bài hát từ Menu, tích hợp với "Liked Songs" và kéo thả để sắp xếp lại.
- Xác định thực thể `PlaylistSong` và `UserLikedSong`.
- Đưa ra yêu cầu cập nhật metadata (count, duration) theo thời gian thực.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                   | Quyết định | Lý do                                                                 |
| ---------------------- | ---------- | --------------------------------------------------------------------- |
| Liked Songs Sync       | Dùng       | Tính năng thiết yếu của ứng dụng âm nhạc.                             |
| Drag-and-drop Reorder  | Dùng       | Tăng trải nghiệm người dùng.                                          |
| Metadata Real-time Sync| Dùng       | Giữ dữ liệu luôn nhất quán.                                           |

### Cách kiểm chứng

- Kiểm tra tính nhất quán với ER Diagram về bảng `playlist_songs`.

**Kết quả kiểm chứng:** Đạt.

---

## Mục 10: Làm rõ spec 062 – Playlist Song Management

| Trường                   | Nội dung                                                                       |
| ------------------------ | ------------------------------------------------------------------------------ |
| Ngày                     | 2026-10-29                                                                     |
| Người thực hiện          | Mai Đăng Khoa                                                                  |
| Nhóm tính năng liên quan | 06 – Playlist Management, Feature 062: Playlist Song Management                |
| Công cụ AI               | Gemini 3.5, `$speckit-clarify`                                                 |
| Mục đích                 | Làm rõ về xử lý trùng lặp bài hát và quyền truy cập trong playlist cộng tác.   |

### Prompt đã dùng

```text
/speckit-clarify
```

### Tóm tắt phản hồi của AI

- Chấp nhận thêm trùng lặp bài hát (xem như các thực thể riêng biệt với vị trí khác nhau).
- Xác định quyền hạn: Chủ sở hữu và người cộng tác có quyền sửa đổi bài hát.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                       | Quyết định | Lý do                                                                  |
| -------------------------- | ---------- | ---------------------------------------------------------------------- |
| Allow Duplicates           | Dùng       | Linh hoạt cho người dùng.                                              |
| Permission Check           | Dùng       | Đảm bảo an toàn dữ liệu.                                               |

### Cách kiểm chứng

- Kiểm tra các Edge Cases trong spec.

**Kết quả kiểm chứng:** Đạt.

---

## Mục 11: Viết spec 063 – Playlist Playback

| Trường                   | Nội dung                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-29                                                                                                        |
| Người thực hiện          | Mai Đăng Khoa                                                                                                     |
| Nhóm tính năng liên quan | 06 – Playlist Management, Feature 063: Playlist Playback (`specs/060-playlist-management/063-playlist-playback`)  |
| Công cụ AI               | Gemini 3.5, `$speckit-specify`                                                                                    |
| Mục đích                 | Đặc tả logic và tương tác UI để chơi nhạc trong ngữ cảnh của playlist.                                            |

### Prompt đã dùng

```text
Specify feature 063-playlist-playback for the AuraTune project. This feature provides the logic and UI interactions for playing music within the context of a playlist.
```

### Tóm tắt phản hồi của AI

- Định nghĩa các hành động: Play Playlist, Shuffle Play, Direct Track Selection, và Add Playlist to Queue.
- Yêu cầu Player hiển thị ngữ cảnh (context) "Playing from playlist: [Name]".
- Tự động chuyển bài khi kết thúc.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                   | Quyết định | Lý do                                                                 |
| ---------------------- | ---------- | --------------------------------------------------------------------- |
| Shuffle Logic          | Dùng       | Yêu cầu cơ bản của playlist.                                          |
| Context Awareness      | Dùng       | Giúp người dùng biết mình đang nghe từ đâu.                           |
| Automatic Progression  | Dùng       | Duy trì trải nghiệm nghe nhạc liên tục.                               |

### Cách kiểm chứng

- Đối chiếu với logic của G05 Queue Management.

**Kết quả kiểm chứng:** Đạt.

---

## Mục 12: Làm rõ spec 063 – Playlist Playback

| Trường                   | Nội dung                                                                       |
| ------------------------ | ------------------------------------------------------------------------------ |
| Ngày                     | 2026-10-29                                                                     |
| Người thực hiện          | Mai Đăng Khoa                                                                  |
| Nhóm tính năng liên quan | 06 – Playlist Management, Feature 063: Playlist Playback                       |
| Công cụ AI               | Gemini 3.5, `$speckit-clarify`                                                 |
| Mục đích                 | Chốt hành vi khi chọn bài lẻ trong playlist và xử lý playlist trống.           |

### Prompt đã dùng

```text
/speckit-clarify
```

### Tóm tắt phản hồi của AI

- Khi chọn 1 bài: Thay thế toàn bộ queue bằng danh sách playlist và nhảy tới bài đó.
- Playlist trống: Hiển thị thông báo Toast.
- Chuyển ngữ cảnh sang "Playing from Queue" nếu người dùng thêm bài thủ công khác vào.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                       | Quyết định | Lý do                                                                  |
| -------------------------- | ---------- | ---------------------------------------------------------------------- |
| Full Queue Replacement     | Dùng       | Đảm bảo đúng trình tự playlist sau khi chọn bài.                       |
| Toast for Empty Playlist   | Dùng       | Phản hồi rõ ràng cho người dùng.                                       |

### Cách kiểm chứng

- Kiểm tra mục `## Clarifications` trong spec.

**Kết quả kiểm chứng:** Đạt.

---

## Mục 13: Viết spec 064 – AI Playlist Generation

| Trường                   | Nội dung                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-29                                                                                                        |
| Người thực hiện          | Mai Đăng Khoa                                                                                                     |
| Nhóm tính năng liên quan | 06 – Playlist Management, Feature 064: AI Playlist Generation (`specs/060-playlist-management/064-ai-playlist-generation`) |
| Công cụ AI               | Gemini 3.5, `$speckit-specify`                                                                                    |
| Mục đích                 | Đặc tả tính năng tạo playlist thông qua mô tả ngôn ngữ tự nhiên.                                                  |

### Prompt đã dùng

```text
The goal of this feature is to allow users to generate custom playlists by describing a mood, occasion, or musical preference in a single sentence. AuraTune should leverage AI to propose a list of matching tracks that the user can then review, modify, and save.
```

### Tóm tắt phản hồi của AI

- Đưa ra quy trình: Nhập prompt -> AI gợi ý (10-20 bài) -> Review/Refine -> Lưu vào thư viện.
- Sử dụng semantic/vector search để tìm kiếm bài hát phù hợp.
- Cung cấp lý do (explanation) cho các lựa chọn của AI.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                   | Quyết định | Lý do                                                                 |
| ---------------------- | ---------- | --------------------------------------------------------------------- |
| Proposal Review Stage  | Dùng       | Cho người dùng quyền kiểm soát tối ưu.                                |
| Vector Search Integration| Dùng     | Cơ chế cốt lõi để AI hiểu mood/occasion.                              |
| Fallback Mechanism     | Dùng       | Xử lý khi service AI gặp sự cố.                                       |

### Cách kiểm chứng

- Đối chiếu với Vision Document (AD-04).

**Kết quả kiểm chứng:** Đạt.

---

## Mục 14: Làm rõ spec 064 – AI Playlist Generation

| Trường                   | Nội dung                                                                       |
| ------------------------ | ------------------------------------------------------------------------------ |
| Ngày                     | 2026-10-29                                                                     |
| Người thực hiện          | Mai Đăng Khoa                                                                  |
| Nhóm tính năng liên quan | 06 – Playlist Management, Feature 064: AI Playlist Generation                  |
| Công cụ AI               | Gemini 3.5, `$speckit-clarify`                                                 |
| Mục đích                 | Làm rõ về quyền riêng tư và giới hạn của prompt.                               |

### Prompt đã dùng

```text
/speckit-clarify
```

### Tóm tắt phản hồi của AI

- Mặc định playlist tạo bởi AI là Private.
- Giới hạn prompt trong 200 ký tự.
- Chỉ gợi ý các bài hát mà người dùng có quyền nghe.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                       | Quyết định | Lý do                                                                  |
| -------------------------- | ---------- | ---------------------------------------------------------------------- |
| 200 Character Limit        | Dùng       | Ngăn chặn các prompt quá phức tạp gây lỗi AI.                          |
| Region/Subscription Filter | Dùng       | Đảm bảo tính khả dụng của bài hát.                                     |

### Cách kiểm chứng

- Kiểm tra checklist requirements.

**Kết quả kiểm chứng:** Đạt.

---

## Mục 15: Viết spec 065 – Collaborative Playlists

| Trường                   | Nội dung                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-29                                                                                                        |
| Người thực hiện          | Mai Đăng Khoa                                                                                                     |
| Nhóm tính năng liên quan | 06 – Playlist Management, Feature 065: Collaborative Playlists (`specs/060-playlist-management/065-collaborative-playlists`) |
| Công cụ AI               | Gemini 3.5, `$speckit-specify`                                                                                    |
| Mục đích                 | Đặc tả tính năng cho phép nhiều người dùng cùng quản lý một bộ sưu tập nhạc.                                      |

### Prompt đã dùng

```text
Provide a detailed specification for the Collaborative Playlists feature in AuraTune. This feature allows multiple users to curate a shared music collection together. Key Requirements: Collaborative Status, Invitations, Member Management, Data Consistency, UI/UX, Security.
```

### Tóm tắt phản hồi của AI

- Xây dựng cơ chế lời mời (Invitation Link), quản lý thành viên và quyền hạn.
- Hiển thị người đóng góp (Added by) cho mỗi bài hát.
- Đảm bảo tính nhất quán dữ liệu khi nhiều người sửa đổi cùng lúc.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                   | Quyết định | Lý do                                                                 |
| ---------------------- | ---------- | --------------------------------------------------------------------- |
| Unique Invitation Link | Dùng       | Cách tiếp cận đơn giản và hiệu quả để chia sẻ.                        |
| Contributor Indicators | Dùng       | Tăng tính tương tác xã hội.                                           |
| Role Management (Owner/Collab)| Dùng  | Phân định rõ quyền xóa/sửa metadata.                                  |

### Cách kiểm chứng

- Kiểm tra mục `Key Entities` về bảng `playlist_shared_users`.

**Kết quả kiểm chứng:** Đạt.

---

## Mục 16: Làm rõ spec 065 – Collaborative Playlists

| Trường                   | Nội dung                                                                       |
| ------------------------ | ------------------------------------------------------------------------------ |
| Ngày                     | 2026-10-29                                                                     |
| Người thực hiện          | Mai Đăng Khoa                                                                  |
| Nhóm tính năng liên quan | 06 – Playlist Management, Feature 065: Collaborative Playlists                 |
| Công cụ AI               | Gemini 3.5, `$speckit-clarify`                                                 |
| Mục đích                 | Chốt các quy tắc về xóa bài và quyền gia nhập.                                 |

### Prompt đã dùng

```text
/speckit-clarify
```

### Tóm tắt phản hồi của AI

- Mọi người cộng tác đều có quyền xóa bài của nhau (để linh hoạt).
- Gia nhập tự do nếu có link (không cần owner duyệt).
- Playlist cộng tác mặc định là Public để dễ chia sẻ.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                       | Quyết định | Lý do                                                                  |
| -------------------------- | ---------- | ---------------------------------------------------------------------- |
| Open Joining               | Dùng       | Giảm thiểu rào cản cho người dùng.                                     |
| Shared Edit Rights         | Dùng       | Khuyến khích sự cộng tác tối đa.                                       |

### Cách kiểm chứng

- Kiểm tra mục `## Clarifications` trong spec.

**Kết quả kiểm chứng:** Đạt.

---

## Mục 17: Viết spec 071 – Listening History

| Trường                   | Nội dung                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-31                                                                                                        |
| Người thực hiện          | Mai Đăng Khoa                                                                                                     |
| Nhóm tính năng liên quan | 07 – Listening History, Feature 071: Listening History (`specs/070-listening-history/071-listening-history`)      |
| Công cụ AI               | Gemini 3.5, `$speckit-specify`                                                                                    |
| Mục đích                 | Đặc tả việc ghi nhận và hiển thị lịch sử nghe nhạc của người dùng.                                                |

### Prompt đã dùng

```text
/speckit.specify

Đặc tả tính năng Listening History (071) cho AuraTune. Tính năng này thuộc nhóm G07 — Listening History and Statistics.
Yêu cầu:
1. Tự động ghi nhận khi nghe nhạc.
2. Hiển thị danh sách các bài đã nghe gần đây.
3. Quản lý quyền riêng tư (xóa lịch sử).
```

### Tóm tắt phản hồi của AI

- Đề xuất ngưỡng ghi nhận: 30 giây hoặc 90% thời lượng bài hát.
- Thiết kế trang History với sắp xếp ngược thời gian (mới nhất lên đầu).
- Hỗ trợ "Soft delete" để vẫn giữ dữ liệu cho AI nhưng không hiển thị cho người dùng.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                   | Quyết định | Lý do                                                                 |
| ---------------------- | ---------- | --------------------------------------------------------------------- |
| 30s Recording Threshold| Dùng       | Tránh ghi nhận các lần lướt qua bài hát (skips).                      |
| Soft Delete Mechanism  | Dùng       | Cân bằng giữa quyền riêng tư và dữ liệu huấn luyện AI.                |
| 365-day Retention      | Dùng       | Giới hạn lượng dữ liệu lưu trữ hợp lý.                                |

### Cách kiểm chứng

- Kiểm tra FR-001 đến FR-013 trong spec.

**Kết quả kiểm chứng:** Đạt.

---

## Mục 18: Làm rõ spec 071 – Listening History

| Trường                   | Nội dung                                                                       |
| ------------------------ | ------------------------------------------------------------------------------ |
| Ngày                     | 2026-10-31                                                                     |
| Người thực hiện          | Mai Đăng Khoa                                                                  |
| Nhóm tính năng liên quan | 07 – Listening History, Feature 071: Listening History                         |
| Công cụ AI               | Gemini 3.5, `$speckit-clarify`                                                 |
| Mục đích                 | Làm rõ về trạng thái trống, chính sách lưu trữ và xóa dữ liệu.                 |

### Prompt đã dùng

```text
/speckit-clarify
```

### Tóm tắt phản hồi của AI

- Hiển thị minh họa và nút "Start Listening" khi chưa có lịch sử.
- Chốt thời gian lưu trữ tối đa 365 ngày.
- Xác nhận các bài hát bị ẩn vẫn được AI gợi ý sử dụng.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                       | Quyết định | Lý do                                                                  |
| -------------------------- | ---------- | ---------------------------------------------------------------------- |
| Empty State Design         | Dùng       | Cải thiện UX cho người dùng mới.                                       |
| 1-year Purge Policy        | Dùng       | Quản lý tài nguyên hệ thống tốt hơn.                                   |

### Cách kiểm chứng

- Kiểm tra mục `## Clarifications` trong spec.

**Kết quả kiểm chứng:** Đạt.

---

## Mục 19: Viết spec 072 – Listening Duration Analytics

| Trường                   | Nội dung                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-31                                                                                                        |
| Người thực hiện          | Mai Đăng Khoa                                                                                                     |
| Nhóm tính năng liên quan | 07 – Listening History, Feature 072: Listening Duration Analytics (`specs/070-listening-history/072-listening-duration-analytics`) |
| Công cụ AI               | Gemini 3.5, `$speckit-specify`                                                                                    |
| Mục đích                 | Đặc tả dashboard trực quan hóa thói quen nghe nhạc theo thời lượng.                                               |

### Prompt đã dùng

```text
Specify the feature 072-listening-duration-analytics for AuraTune. This feature belongs to the G07 — Listening History and Statistics functional group and builds upon the tracking infrastructure established in 071-listening-history.
```

### Tóm tắt phản hồi của AI

- Tính toán tổng thời lượng cho: Today, Last 7 Days, All Time.
- Xếp hạng Top 5 Artist theo thời gian nghe (khác với số lần nghe).
- Trực quan hóa xu hướng hàng tuần qua biểu đồ.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                   | Quyết định | Lý do                                                                 |
| ---------------------- | ---------- | --------------------------------------------------------------------- |
| Duration-based Ranking | Dùng       | Phản ánh đúng "identity" âm nhạc hơn là tần suất.                     |
| Weekly Trend Chart     | Dùng       | Giúp người dùng thấy được sự biến động trong thói quen.               |
| Exclude Hidden Items   | Dùng       | Nhất quán với chính sách riêng tư ở 071.                              |

### Cách kiểm chứng

- Kiểm tra Measurable Outcomes (SC-001 đến SC-004).

**Kết quả kiểm chứng:** Đạt.

---

## Mục 20: Làm rõ spec 072 – Listening Duration Analytics

| Trường                   | Nội dung                                                                       |
| ------------------------ | ------------------------------------------------------------------------------ |
| Ngày                     | 2026-10-31                                                                     |
| Người thực hiện          | Mai Đăng Khoa                                                                  |
| Nhóm tính năng liên quan | 07 – Listening History, Feature 072: Listening Duration Analytics              |
| Công cụ AI               | Gemini 3.5, `$speckit-clarify`                                                 |
| Mục đích                 | Chốt cách tính thời lượng và tần suất cập nhật dữ liệu.                        |

### Prompt đã dùng

```text
/speckit-clarify
```

### Tóm tắt phản hồi của AI

- Chỉ tính thời lượng cho các lần nghe trên 30 giây.
- Dữ liệu làm mới khi mở trang hoặc refresh thủ công (không real-time liên tục).
- Biểu đồ xu hướng chỉ giới hạn trong 7 ngày gần nhất.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                       | Quyết định | Lý do                                                                  |
| -------------------------- | ---------- | ---------------------------------------------------------------------- |
| 7-Day Fixed Window         | Dùng       | Đơn giản hóa backend và tập trung vào dữ liệu gần đây.                 |
| Manual/Page-load Refresh   | Dùng       | Giảm tải cho server.                                                   |

### Cách kiểm chứng

- Kiểm tra mục `## Clarifications` trong spec.

**Kết quả kiểm chứng:** Đạt.

---

## Mục 21: Viết spec 073 – Top Artists and Genres

| Trường                   | Nội dung                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-31                                                                                                        |
| Người thực hiện          | Mai Đăng Khoa                                                                                                     |
| Nhóm tính năng liên quan | 07 – Listening History, Feature 073: Top Artists and Genres (`specs/070-listening-history/073-top-artists-and-genres`) |
| Công cụ AI               | Gemini 3.5, `$speckit-specify`                                                                                    |
| Mục đích                 | Đặc tả bảng tổng hợp các nghệ sĩ và thể loại nhạc được nghe nhiều nhất.                                           |

### Prompt đã dùng

```text
Specify the feature 073-top-artists-and-genres for AuraTune. This feature belongs to the G07 — Listening History and Statistics functional group and complements the duration-based metrics in 072.
```

### Tóm tắt phản hồi của AI

- Xếp hạng Top 10 Artist theo số lần nghe.
- Phân tích phân bổ thể loại (Genre Distribution) qua biểu đồ.
- Hỗ trợ các mốc thời gian: 4 tuần, 6 tháng, All Time.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                   | Quyết định | Lý do                                                                 |
| ---------------------- | ---------- | --------------------------------------------------------------------- |
| Frequency-based Ranking| Dùng       | Cung cấp góc nhìn khác so với 072.                                     |
| Genre Visual Chart     | Dùng       | Trực quan hóa "gu" nhạc.                                              |
| Flexible Time Ranges   | Dùng       | Giúp người dùng so sánh thói quen ngắn hạn và dài hạn.                |

### Cách kiểm chứng

- Đối chiếu với Vision Document và các specs liên quan trong nhóm G07.

**Kết quả kiểm chứng:** Đạt.

---

## Mục 22: Làm rõ spec 073 – Top Artists and Genres

| Trường                   | Nội dung                                                                       |
| ------------------------ | ------------------------------------------------------------------------------ |
| Ngày                     | 2026-10-31                                                                     |
| Người thực hiện          | Mai Đăng Khoa                                                                  |
| Nhóm tính năng liên quan | 07 – Listening History, Feature 073: Top Artists and Genres                    |
| Công cụ AI               | Gemini 3.5, `$speckit-clarify`                                                 |
| Mục đích                 | Làm rõ cách tính thể loại và xử lý dữ liệu lẻ.                                 |

### Prompt đã dùng

```text
/speckit-clarify
```

### Tóm tắt phản hồi của AI

- Chấp nhận tính một bài hát cho nhiều thể loại (nếu có).
- Nhóm các thể loại ít người nghe vào mục "Other".
- Yêu cầu tối thiểu 5 lượt nghe mới bắt đầu hiển thị thống kê.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                       | Quyết định | Lý do                                                                  |
| -------------------------- | ---------- | ---------------------------------------------------------------------- |
| Double-counting for Genres | Dùng       | Phản ánh chính xác sự đa dạng thể loại trong một bài hát.              |
| "Other" Category           | Dùng       | Giữ cho biểu đồ không bị quá tải bởi các thể loại nhỏ lẻ.              |
| Minimum Data Threshold     | Dùng       | Đảm bảo tính ý nghĩa của số liệu thống kê.                             |

### Cách kiểm chứng

- Kiểm tra mục `## Clarifications` trong spec.

**Kết quả kiểm chứng:** Đạt.
