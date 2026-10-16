# Quy tắc bảo mật dữ liệu — AuraTune

## 1. Mục đích

Tài liệu này ghi nhận cách kiểm soát quyền đọc/ghi dữ liệu. Cần phân biệt quy tắc phân quyền của ứng dụng ở backend với quy tắc bảo mật của database.

**Lưu ý:** API Contract và schema được cung cấp chưa xác nhận AuraTune sử dụng Firestore. Vì vậy phần Firestore Security Rules dưới đây chỉ áp dụng nếu Firestore được chọn và thực sự được client truy cập trực tiếp. Không triển khai các rules này như cấu hình hoạt động trước khi xác nhận kiến trúc.

## 2. Nguyên tắc chung

- Mặc định từ chối quyền truy cập nếu chưa có quy tắc cho phép rõ ràng.
- Kiểm tra xác thực và quyền sở hữu ở phía server.
- Không dựa vào việc ẩn giao diện frontend để bảo vệ dữ liệu.
- Chỉ cấp quyền tối thiểu cần thiết.
- Không để người dùng sửa role của chính mình hoặc nâng quyền thông qua dữ liệu gửi lên.
- Không công khai dữ liệu riêng tư như lịch sử nghe, thông tin tài khoản hoặc playlist riêng.
- Kiểm tra quyền với mọi thao tác đọc, tạo, sửa và xóa.

## 3. Ma trận quyền ở mức ứng dụng

Bảng dưới đây là hướng dẫn tổng quát; quyền thực tế phải khớp API Contract và spec từng feature.

| Loại dữ liệu / thao tác | Public | User sở hữu dữ liệu | Artist được phép quản lý | Admin |
|---|---|---|---|---|
| Nội dung được đánh dấu công khai | Đọc theo API | Đọc | Đọc | Đọc/quản trị theo quyền |
| Hồ sơ cá nhân | Chỉ field công khai | Đọc/sửa dữ liệu của mình | Đọc/sửa dữ liệu của mình | Theo API quản trị |
| Playlist riêng | Không | Đọc/sửa playlist của mình | Theo quyền sở hữu | Theo API quản trị nếu được phép |
| Bài hát/album do Artist quản lý | Đọc nội dung công khai | Không tự sửa nội dung của người khác | Sửa nội dung được phép quản lý | Quản trị theo API |
| Lịch sử nghe cá nhân | Không | Chỉ đọc dữ liệu của mình | Chỉ đọc dữ liệu của mình | Chỉ khi có quyền quản trị được xác định |
| Vai trò tài khoản | Không sửa | Không tự nâng quyền | Không tự nâng quyền | Thay đổi theo quy trình quản trị được duyệt |

## 4. Nếu dự án sử dụng Firestore

Trước khi viết rules có thể triển khai, cần xác nhận:
- Collection/document path thực tế.
- Cơ chế đăng nhập và cách lấy UID đã xác thực.
- Trường nào là chủ sở hữu dữ liệu.
- Backend có dùng Admin SDK để bỏ qua Security Rules hay không.
- Client nào được phép truy cập trực tiếp Firestore.

Không thể viết rules chính xác chỉ từ schema PostgreSQL hiện có, vì schema đó không định nghĩa đường dẫn collection, UID Firebase hoặc cấu trúc document.

## 5. Checklist review bảo mật

- [ ] Mặc định từ chối truy cập nếu chưa được cho phép.
- [ ] Mọi thao tác được kiểm tra quyền ở backend.
- [ ] Quyền sở hữu tài nguyên được xác minh.
- [ ] User không thể tự sửa role hoặc quyền quản trị.
- [ ] Playlist riêng và lịch sử nghe không bị đọc công khai.
- [ ] Artist chỉ sửa nội dung thuộc phạm vi được phép.
- [ ] Đã kiểm thử các trường hợp chưa đăng nhập và không đủ quyền.
- [ ] Không lưu credentials, token hoặc secrets trong tài liệu hay repository.

## 6. Tài liệu liên quan

- `docs/design/security/README.md` — nguyên tắc bảo mật chung.
- `docs/design/api/api-contract.md` — quyền endpoint.
- `er-diagram.md` — schema dữ liệu hiện tại.
- `firestore-collections.md` — chỉ dùng nếu Firestore được xác nhận.
