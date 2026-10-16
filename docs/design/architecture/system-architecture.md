# Kiến trúc hệ thống AuraTune

## 1. Mục đích

Tài liệu mô tả kiến trúc tổng thể của AuraTune ở mức khái niệm, dựa trên Proposal, Team Contract, API Contract và schema database được cung cấp. Các chi tiết chưa được xác nhận được ghi rõ là cần làm rõ, không xem là quyết định kỹ thuật cuối cùng.

## 2. Phạm vi chức năng

AuraTune có các nhóm chức năng chính:
- Authentication và quản lý tài khoản.
- Trang chủ, nội dung phổ biến và bảng xếp hạng.
- Tìm kiếm metadata và tìm kiếm theo lời bài hát/ngữ nghĩa.
- Music Player, lyrics, bình luận và tương tác bài hát.
- Queue Management.
- Playlist Management.
- Listening History và thống kê nghe nhạc.
- Album Interaction.
- Artist Profile & Studio.
- AI Recommendations.
- Admin Functions.
- AI Conversational Agent (Real-time Host), theo Team Contract.

## 3. Kiến trúc khái niệm

```text
                    +----------------------+
                    |   Client / Frontend  |
                    | Listener / Artist /  |
                    |        Admin         |
                    +----------+-----------+
                               |
                               | HTTP API
                               v
                    +----------------------+
                    |     Backend API      |
                    | Auth, validation,    |
                    | authorization, logic |
                    +----+------------+----+
                         |            |
                         v            v
                +----------------+  +------------------+
                |   PostgreSQL   |  | Python AI Service|
                | Shared data    |  | Internal AI APIs |
                +----------------+  +------------------+
```

Sơ đồ này thể hiện ranh giới logic, không khẳng định toàn bộ công nghệ triển khai. API Contract mô tả `/ai/*` là endpoint nội bộ từ Backend đến Python AI Service; Frontend không gọi trực tiếp các endpoint này. Schema được cung cấp dùng cú pháp PostgreSQL nhưng cần đối chiếu với migration và cấu hình repository thực tế.

## 4. Trách nhiệm thành phần

### Client / Frontend
- Hiển thị giao diện theo trạng thái đăng nhập và vai trò.
- Gọi API theo `docs/design/api/api-contract.md`.
- Xử lý trạng thái tải dữ liệu, thành công và lỗi.
- Không xem việc ẩn/hiện giao diện là biện pháp bảo mật thay cho kiểm tra quyền ở server.

### Backend API
- Cung cấp API theo API Contract.
- Xác thực request, kiểm tra quyền và validate dữ liệu.
- Thực thi logic nghiệp vụ và đọc/ghi dữ liệu.
- Gọi AI Service nội bộ khi cần.
- Trả response theo quy ước, ngoại trừ endpoint có response đặc biệt như stream audio.

### Database
Schema được cung cấp có các nhóm dữ liệu users, artists, albums, songs, playlists, playlist-song, playlist sharing, follows, liked songs, listening history và listening stats. Chi tiết nằm trong `docs/design/database/`.

### Python AI Service
API Contract hiện mô tả các endpoint nội bộ:
- `POST /ai/recommend`
- `POST /ai/search/lyrics`
- `POST /ai/playlist/generate`
- `GET /ai/health`

Cần xác nhận implementation và schema request/response thực tế của service.

## 5. Luồng hệ thống tiêu biểu

### Request API thông thường
1. Client gửi request đến Backend API.
2. Backend xác thực, kiểm tra quyền và validate dữ liệu.
3. Backend thực thi logic nghiệp vụ và truy cập dữ liệu khi cần.
4. Backend trả response theo API Contract.

### Tính năng sử dụng AI
1. Client gọi endpoint công khai của Backend.
2. Backend kiểm tra request và quyền.
3. Backend gọi AI Service nội bộ.
4. Backend xử lý kết quả và trả response.
5. Nếu AI Service không khả dụng, xử lý theo contract lỗi, gồm `503` / `AI_SERVICE_UNAVAILABLE` khi phù hợp.

### Phát nhạc
API Contract định nghĩa `GET /songs/:id/stream` là ngoại lệ JSON: response thành công trả audio với `Content-Type: audio/mpeg`, hỗ trợ `Range` và có thể trả `200` hoặc `206`. Cách lưu trữ và phân phối audio cần xác nhận theo implementation.

## 6. Nguyên tắc kiến trúc
1. API Contract là nguồn tham chiếu cho endpoint và response đã mô tả.
2. Quyền truy cập phải được kiểm tra ở backend.
3. Thiết kế dùng chung nằm trong `docs/design/`; yêu cầu riêng của feature nằm trong `specs/`.
4. Không tự giả định công nghệ hoặc luồng triển khai chưa được xác nhận.
5. Thay đổi ảnh hưởng nhiều feature cần được trao đổi và cập nhật tài liệu.

## 7. Các quyết định cần xác nhận
- Framework và cách triển khai Backend API.
- Công nghệ Frontend.
- Database thực tế, migration và môi trường triển khai.
- Nơi lưu trữ/phân phối audio và ảnh.
- Cơ chế cấp, làm mới và thu hồi access/refresh token.
- Giao tiếp Backend–Python AI Service, timeout và cấu hình.
- Hạ tầng triển khai, logging và monitoring nếu thuộc phạm vi dự án.

## 8. Tài liệu liên quan
- `docs/proposal/proposal.md`
- `docs/management/team-contract.md`
- `docs/design/api/api-contract.md`
- `docs/design/api/api-quy-uoc.md`
- `docs/design/database/README.md`
- `docs/design/security/README.md`
- `specs/`
