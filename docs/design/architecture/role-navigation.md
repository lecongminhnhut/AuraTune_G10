# Điều hướng theo vai trò AuraTune

## 1. Mục đích

Tài liệu mô tả các vai trò người dùng và nguyên tắc tổ chức điều hướng theo vai trò. Nội dung dựa trên vai trò trong API Contract và các nhóm chức năng trong Proposal/Team Contract.

Đây chưa phải sơ đồ màn hình đã được duyệt. Route frontend, tên màn hình và chi tiết UI cần được xác nhận trong thiết kế và source code thực tế.

## 2. Vai trò

### Public / khách chưa đăng nhập
API Contract đánh dấu nhiều endpoint nội dung là `Public`, ví dụ xem bài hát, album, nghệ sĩ, tìm kiếm và một số nội dung trang chủ. Người chưa đăng nhập chỉ được thực hiện hành động được API đánh dấu công khai.

### User / Listener
Các chức năng yêu cầu `User` trong API Contract bao gồm:
- Quản lý tài khoản cá nhân.
- Thích bài hát và bình luận.
- Quản lý playlist của mình.
- Xem lịch sử nghe và thống kê cá nhân.
- Theo dõi nghệ sĩ hoặc người dùng.
- Lưu album.

Đây là tổng hợp từ API Contract hiện tại; quyền cuối cùng phụ thuộc endpoint và spec tương ứng.

### Artist
Theo API Contract, `Artist` là người dùng đã đăng nhập với quyền dành cho nghệ sĩ. Các endpoint quản lý bài hát/album có thể yêu cầu `Artist / Admin`. Artist chỉ được thao tác trên tài nguyên mình sở hữu hoặc được phép quản lý; backend phải xác minh quyền này.

### Admin
Admin có thể thực hiện các thao tác quản trị được API Contract quy định, ví dụ quản lý người dùng, kiểm duyệt nội dung và xem thống kê nền tảng. Các thao tác phải được bảo vệ bằng xác thực và kiểm tra role ở backend.

## 3. Sơ đồ điều hướng khái niệm

```text
AuraTune
├── Khu vực công khai
│   ├── Trang chủ
│   ├── Tìm kiếm
│   ├── Bài hát / Music Player
│   ├── Album
│   └── Hồ sơ nghệ sĩ
├── Khu vực tài khoản (User / Listener)
│   ├── Hồ sơ cá nhân
│   ├── Playlist của tôi
│   ├── Bài hát yêu thích
│   ├── Lịch sử nghe
│   ├── Thống kê cá nhân
│   └── Nghệ sĩ / người dùng đang theo dõi
├── Khu vực Artist
│   ├── Quản lý bài hát
│   ├── Quản lý album
│   └── Hồ sơ nghệ sĩ
└── Khu vực Admin
    ├── Quản lý người dùng
    ├── Quản lý / kiểm duyệt bài hát
    ├── Quản lý nghệ sĩ
    └── Thống kê nền tảng
```

Sơ đồ này phân nhóm chức năng theo API Contract, không quy định URL route hoặc bố cục giao diện cuối cùng.

## 4. Nguyên tắc điều hướng
1. Chỉ hiển thị mục điều hướng phù hợp với trạng thái đăng nhập và vai trò.
2. Ẩn mục điều hướng không thay thế kiểm tra quyền ở backend.
3. Nếu người chưa đăng nhập truy cập chức năng cần xác thực, chuyển họ đến luồng đăng nhập theo thiết kế đã thống nhất.
4. Nếu backend trả `401`, xử lý trạng thái chưa xác thực hoặc token hết hạn theo cơ chế của ứng dụng.
5. Nếu backend trả `403`, hiển thị trạng thái không đủ quyền và không tiếp tục thao tác bị từ chối.
6. Không cho Artist sửa nội dung của nghệ sĩ khác trừ khi API Contract và quy tắc quản trị cho phép.
7. Không cho User truy cập dữ liệu riêng tư của người khác chỉ bằng cách thay ID trong URL.

## 5. Các điểm cần làm rõ
- Route frontend cụ thể và cách tổ chức layout chưa được cung cấp.
- Chưa có sơ đồ Figma để xác nhận menu và hành vi responsive.
- Quyền chia sẻ/cộng tác playlist cần được thống nhất trước khi xác định điều hướng liên quan.
- Phạm vi UI và tương tác của AI Conversational Agent cần được đặc tả riêng.
- Cần xác nhận quy trình gán role Artist từ tài khoản User theo API và quy trình quản trị hiện tại.

## 6. Tài liệu liên quan
- `docs/design/architecture/feature-modules.md`
- `docs/design/security/README.md`
- `docs/design/api/api-contract.md`
- `docs/design/wireframes/README.md`
- `docs/proposal/proposal.md`
- `docs/management/team-contract.md`
