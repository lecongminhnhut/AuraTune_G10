# Tài liệu thiết kế AuraTune

## 1. Mục đích

Thư mục `docs/design/` lưu các tài liệu thiết kế dùng chung cho nhiều tính năng của AuraTune. Các tài liệu này giúp nhóm thống nhất kiến trúc hệ thống, mô hình dữ liệu, quy ước API, nguyên tắc bảo mật và tài liệu giao diện.

Tài liệu trong thư mục này cần nhất quán với phạm vi sản phẩm đã thống nhất, Team Contract và quá trình triển khai thực tế.

## 2. Cấu trúc thư mục

```text
docs/design/
├── README.md
├── architecture/
│   ├── README.md
│   ├── system-architecture.md
│   ├── feature-modules.md
│   └── role-navigation.md
├── database/
│   ├── README.md
│   ├── er-diagram.md
│   ├── firestore-collections.md
│   ├── security-rules.md
│   └── data-consistency.md
├── api/
│   ├── README.md
│   ├── api-contract.md
│   └── api-quy-uoc.md
├── security/
│   └── README.md
└── wireframes/
    └── README.md
```

Danh sách file thể hiện cấu trúc tài liệu hiện được đề xuất cho dự án. Nếu file nào chưa được tạo hoặc nội dung chưa được nhóm xác nhận, không xem đó là quyết định kỹ thuật chính thức.

## 3. Nội dung từng khu vực

### `architecture/`

Tài liệu kiến trúc tổng thể, trách nhiệm các module và điều hướng theo vai trò.

- `system-architecture.md`: các thành phần hệ thống và luồng tích hợp ở mức khái niệm.
- `feature-modules.md`: các nhóm chức năng, người phụ trách và điểm phối hợp.
- `role-navigation.md`: phân nhóm điều hướng cho Public, User/Listener, Artist và Admin.

### `database/`

Tài liệu mô hình dữ liệu, quan hệ giữa các bảng và các vấn đề về tính nhất quán.

- `er-diagram.md`: sơ đồ ER dựa trên schema được cung cấp.
- `data-consistency.md`: các vấn đề transaction, cập nhật đồng thời và dữ liệu tổng hợp.
- `firestore-collections.md`: chỉ áp dụng nếu nhóm xác nhận AuraTune sử dụng Firestore.
- `security-rules.md`: nguyên tắc bảo mật dữ liệu; các quy tắc Firestore chỉ áp dụng nếu Firestore được sử dụng.

**Lưu ý:** Schema hiện được cung cấp dùng cú pháp PostgreSQL. Không mặc định Firestore là công nghệ database của dự án nếu chưa được xác nhận.

### `api/`

Tài liệu API dùng chung.

- `api-contract.md`: danh sách endpoint, quyền truy cập, định dạng response và HTTP status code.
- `api-quy-uoc.md`: quy ước đặt tên endpoint, request/response, validation, phân trang và xử lý lỗi.

Các endpoint hoặc schema riêng của một tính năng có thể được mô tả trong thư mục feature tương ứng dưới `specs/`.

### `security/`

Các nguyên tắc bảo mật dùng chung, gồm xác thực, phân quyền, quyền sở hữu tài nguyên, bảo vệ dữ liệu và quản lý secrets.

Không lưu mật khẩu, token, API key hoặc credentials thật trong tài liệu.

### `wireframes/`

Liên kết Figma, wireframe, luồng người dùng và ghi chú bàn giao thiết kế giao diện. Ưu tiên liên kết đến file thiết kế gốc thay vì sao chép nhiều phiên bản.

## 4. Quy tắc tổ chức tài liệu

1. Đặt tài liệu dùng chung cho nhiều feature trong `docs/design/`.
2. Đặt yêu cầu, acceptance criteria và thiết kế riêng của một feature trong thư mục tương ứng dưới `specs/`.
3. Tránh sao chép cùng một nội dung vào nhiều file; ưu tiên liên kết đến tài liệu nguồn.
4. Dùng tên file tiếng Anh theo `kebab-case` để thống nhất với repository; nội dung tài liệu có thể viết bằng tiếng Việt.
5. Chỉ ghi công nghệ hoặc phương án kiến trúc là quyết định chính thức khi nhóm đã xác nhận.
6. Khi thay đổi kiến trúc, database hoặc API dùng chung, cập nhật các tài liệu liên quan và thông báo cho các nhóm bị ảnh hưởng.
7. Không đưa secrets, thông tin xác thực hoặc dữ liệu người dùng thật vào tài liệu.

## 5. Quy trình cập nhật

Khi có thay đổi thiết kế:

1. Xác định thay đổi ảnh hưởng đến một feature hay nhiều feature.
2. Cập nhật tài liệu trong `docs/design/` nếu đó là quyết định dùng chung.
3. Cập nhật spec tương ứng trong `specs/` nếu hành vi hoặc yêu cầu của feature thay đổi.
4. Đối chiếu API Contract, schema database và implementation để tránh mâu thuẫn.
5. Trao đổi với các thành viên hoặc nhóm liên quan trước khi chốt thay đổi ảnh hưởng rộng.

## 6. Tài liệu tham chiếu

- `docs/proposal/proposal.md` — phạm vi sản phẩm.
- `docs/management/team-contract.md` — phân công và trách nhiệm.
- `specs/` — đặc tả và kế hoạch theo từng feature.

## 7. Lưu ý về trạng thái tài liệu

Một file có trong cấu trúc không có nghĩa nội dung đã được phê duyệt hoặc đã được triển khai. Các điểm còn chưa rõ cần được ghi nhận và thống nhất với nhóm trước khi trở thành quy định chính thức của AuraTune.
