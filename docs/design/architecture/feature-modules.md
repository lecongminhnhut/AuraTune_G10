# Các module chức năng AuraTune

## 1. Mục đích

Tài liệu mô tả các nhóm chức năng ở mức khái niệm dựa trên Proposal và Team Contract. Tài liệu giúp nhận diện trách nhiệm và điểm tích hợp; không thay thế đặc tả chi tiết trong `specs/` và không tự phê duyệt tính năng mới.

## 2. Danh sách module và người phụ trách

| Mã nhóm | Module | Trách nhiệm chính | Người phụ trách theo Team Contract |
|---|---|---|---|
| 010 | Authentication | Đăng ký, đăng nhập và quản lý tài khoản theo phạm vi thống nhất | Khoa (B) |
| 020 | Home Dashboard | Nội dung trang chủ | Huy (E) |
| 030 | Search | Tìm kiếm metadata và tìm kiếm AI/ngữ nghĩa | Đăng (C) |
| 040 | Music Player | Phát nhạc và tương tác bài hát | Huy (E) |
| 050 | Queue Management | Quản lý danh sách phát tiếp theo | Huy (E) |
| 060 | Playlist Management | Tạo và quản lý playlist; chia sẻ/cộng tác cần đặc tả rõ | Khoa (B) |
| 070 | Listening History | Lịch sử nghe và thống kê cá nhân | Khoa (B) |
| 080 | Album Interaction | Chi tiết album và tương tác | Đăng (C) |
| 090 | Artist Profile & Studio | Hồ sơ nghệ sĩ và quản lý nội dung | Hoàng (D) |
| 100 | AI Recommendations | Gợi ý nhạc theo phạm vi đã duyệt | Nhựt (A) |
| 110 | Admin Functions | Quản trị và kiểm duyệt nền tảng | Hoàng (D) |
| 120 | AI Conversational Agent | Trợ lý hội thoại âm nhạc; phạm vi cần làm rõ | Nhựt (A) |

Tên nhóm và người phụ trách được lấy từ Team Contract. Chi tiết tính năng cần đối chiếu Proposal và spec hiện hành.

## 3. Trách nhiệm theo module

- **010 Authentication:** cung cấp luồng xác thực và là điểm tích hợp cho chức năng cần đăng nhập.
- **020 Home Dashboard:** tổ chức nội dung trang chủ, có thể tổng hợp dữ liệu từ các module nội dung.
- **030 Search:** API Contract hiện có `/search` và `/search/lyrics`; cách triển khai semantic/vector search cần xác nhận trong spec và kiến trúc kỹ thuật.
- **040 Music Player:** tích hợp thông tin bài hát, stream, lyrics và bình luận; phối hợp với Queue và Listening History.
- **050 Queue Management:** quản lý thứ tự phát; API Contract hiện được cung cấp chưa có nhóm endpoint queue riêng nên cần xác nhận API và cách lưu queue.
- **060 Playlist Management:** quản lý playlist và quan hệ playlist-song. Schema có `playlists`, `playlist_songs`, `playlist_shared_users`; cần thống nhất quyền chia sẻ và collaborative editing.
- **070 Listening History:** ghi nhận lượt nghe và cung cấp lịch sử/thống kê; thống nhất cách cập nhật với schema database.
- **080 Album Interaction:** cung cấp danh sách, chi tiết và thao tác lưu album; phối hợp với Artist Profile và Music Player.
- **090 Artist Profile & Studio:** hiển thị hồ sơ, bài hát, album và quản lý nội dung theo quyền; backend phải kiểm tra quyền sở hữu.
- **100 AI Recommendations:** API Contract có `/recommendations/songs` và endpoint nội bộ `/ai/recommend`; thuật toán và fallback cần được đặc tả riêng.
- **110 Admin Functions:** quản lý người dùng, nội dung và thống kê theo API Contract; thao tác phải kiểm tra quyền Admin ở backend.
- **120 AI Conversational Agent:** xuất hiện trong Team Contract nhưng chi tiết hành vi, API và tích hợp real-time chưa được mô tả đầy đủ; cần spec trước khi quyết định triển khai.

## 4. Các điểm tích hợp chính

| Module | Module liên quan | Lý do phối hợp |
|---|---|---|
| Authentication | Các module cần đăng nhập | Xác thực và phân quyền |
| Home Dashboard | Search, Recommendations, Album, Artist | Tổng hợp và điều hướng nội dung |
| Search | Songs, Albums, Artists, Playlists, AI Service | Tìm kiếm nhiều loại nội dung |
| Music Player | Queue, Songs, Lyrics, Listening History | Phát nhạc và ghi nhận lượt nghe |
| Playlist Management | Songs, Music Player, Sharing | Quản lý danh sách và phát playlist |
| Listening History | Music Player, AI Recommendations | Dữ liệu nghe và gợi ý |
| Album Interaction | Songs, Artist Profile | Quan hệ album, bài hát, nghệ sĩ |
| Artist Profile & Studio | Songs, Albums, Admin | Quản lý nội dung nghệ sĩ |
| Admin Functions | Users, Songs, Artists, Playlists | Quản trị và kiểm duyệt |
| AI Conversational Agent | Search, Music Player, Recommendations | Tích hợp dự kiến; cần xác nhận trong spec |

Bảng này mô tả phối hợp khái niệm, không tự định nghĩa API mới.

## 5. Quy tắc phân chia trách nhiệm
1. Mỗi module có người phụ trách theo Team Contract.
2. Module sở hữu logic và dữ liệu của mình; tránh tạo logic trùng lặp ở module khác.
3. Thay đổi API hoặc schema dùng chung cần thông báo các nhóm bị ảnh hưởng.
4. Hành vi và acceptance criteria nằm trong spec của feature.
5. Nếu Proposal, Team Contract, API Contract và code không khớp, ghi nhận khác biệt và yêu cầu nhóm thống nhất.

## 6. Tài liệu liên quan
- `docs/proposal/proposal.md`
- `docs/management/team-contract.md`
- `docs/design/architecture/system-architecture.md`
- `docs/design/api/api-contract.md`
- `docs/design/database/README.md`
- `specs/`
