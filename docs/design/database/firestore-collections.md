# Cấu trúc Firestore Collections — AuraTune

## 1. Trạng thái tài liệu

**Chưa xác nhận AuraTune sử dụng Firestore.** Schema database được cung cấp hiện dùng cú pháp PostgreSQL với các bảng trong schema `public`. Vì vậy tài liệu này là mẫu ghi nhận nếu nhóm quyết định dùng Firestore, không phải mô tả database hiện tại và không nên dùng để triển khai trước khi có quyết định kiến trúc.

Nếu AuraTune chỉ sử dụng PostgreSQL, hãy giữ tài liệu này làm ghi chú chưa áp dụng hoặc xóa khỏi danh sách tài liệu đang hoạt động.

## 2. Khi nào cần điền tài liệu này?

Chỉ hoàn thiện tài liệu khi nhóm đã xác nhận:
- Firestore là database được sử dụng cho một phần hoặc toàn bộ hệ thống.
- Dữ liệu nào sẽ lưu trong Firestore và dữ liệu nào vẫn ở PostgreSQL.
- Quy tắc định danh document, quan hệ giữa collection và chiến lược truy vấn.
- Cách xác thực và phân quyền khi truy cập dữ liệu.

## 3. Mẫu bảng mô tả collection

Sao chép mẫu dưới đây cho từng collection đã được duyệt.

| Thuộc tính | Nội dung cần ghi |
|---|---|
| Collection path | Đường dẫn collection, ví dụ `collection/{documentId}` |
| Mục đích | Loại dữ liệu lưu trong collection |
| Document ID | Cách tạo và định dạng ID |
| Fields | Tên field, kiểu dữ liệu, bắt buộc/tùy chọn |
| Relationships | Tham chiếu đến document hoặc collection khác |
| Queries | Các truy vấn chính của feature |
| Indexes | Index cần thiết theo truy vấn đã xác nhận |
| Security | Ai được đọc, tạo, cập nhật hoặc xóa |
| Retention | Quy tắc lưu trữ/xóa dữ liệu nếu có |

## 4. Các nhóm dữ liệu cần xem xét nếu dùng Firestore

Các nhóm dưới đây chỉ là ánh xạ chủ đề từ schema PostgreSQL hiện tại để hỗ trợ thảo luận, **không phải thiết kế Firestore đã được phê duyệt**:

- Tài khoản và hồ sơ người dùng.
- Hồ sơ nghệ sĩ.
- Album và bài hát.
- Playlist và danh sách bài hát trong playlist.
- Người dùng được chia sẻ playlist.
- Quan hệ follow và bài hát yêu thích.
- Lịch sử nghe.
- Thống kê nghe nhạc.

Không chuyển đổi trực tiếp từng bảng SQL thành collection mà chưa xem xét kiểu truy vấn, tính nhất quán, giới hạn transaction và mô hình quyền truy cập.

## 5. Cần thống nhất trước khi triển khai

- Firestore có thực sự được dùng trong kiến trúc không?
- Nếu dùng song song PostgreSQL và Firestore, nguồn dữ liệu chính của từng loại dữ liệu là gì?
- Dữ liệu nào được phép sao chép giữa hai hệ thống và đồng bộ theo cách nào?
- Các truy vấn cần index nào?
- Quyền truy cập được áp dụng ở backend, Firestore Security Rules hay cả hai?
- Cách xử lý cập nhật đồng thời, retry và lỗi đồng bộ ra sao?

## 6. Tài liệu liên quan

- `er-diagram.md` — sơ đồ từ schema PostgreSQL hiện có.
- `data-consistency.md` — các vấn đề nhất quán dữ liệu cần xem xét.
- `security-rules.md` — mẫu ghi nhận quy tắc bảo mật nếu sử dụng Firestore.
- `docs/design/architecture/system-architecture.md` — kiến trúc tổng thể.
