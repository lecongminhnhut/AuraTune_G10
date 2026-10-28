Kiến trúc AuraTune
Mục đích
Thư mục này lưu tài liệu kiến trúc dùng chung cho nhiều tính năng của AuraTune. Nội dung giúp các thành viên hiểu cấu trúc tổng thể của hệ thống, ranh giới giữa các module và cách các thành phần phối hợp với nhau.
Nội dung nên lưu tại đây

- Kiến trúc hệ thống: sơ đồ tổng thể và trách nhiệm của các thành phần.
- Các module theo feature: cách chia module, trách nhiệm và quan hệ phụ thuộc.
- Điều hướng theo vai trò: luồng màn hình và quyền truy cập của Listener, Artist và Admin.
- Luồng tích hợp: cách frontend, backend, database và AI Service giao tiếp với nhau, nếu có trong kiến trúc thực tế.
- Quyết định kiến trúc dùng chung: các quyết định ảnh hưởng đến nhiều tính năng.
  Tài liệu đề xuất
  Có thể bổ sung dần các file sau khi nhóm đã thống nhất nội dung:
- system-architecture.md — kiến trúc tổng thể của hệ thống.
- feature-modules.md — danh sách module, trách nhiệm và phụ thuộc.
- role-navigation.md — điều hướng theo vai trò Listener, Artist và Admin.
- architecture-decisions.md — các quyết định kiến trúc quan trọng, nếu cần.
  Đây là tên file gợi ý; không cần tạo tất cả ngay từ đầu.
  Nguyên tắc tổ chức

1. Chỉ đặt tại đây tài liệu kiến trúc dùng chung cho nhiều feature.
2. Tài liệu thiết kế hoặc quyết định chỉ liên quan đến một feature nên nằm trong thư mục feature tương ứng dưới specs/NNN-feature-name/.
3. Phản ánh kiến trúc và công nghệ mà dự án thực sự sử dụng; không ghi một công nghệ là quyết định chính thức nếu nhóm chưa thống nhất.
4. Khi thay đổi kiến trúc dùng chung, cập nhật tài liệu liên quan và thông báo cho các thành viên bị ảnh hưởng.
5. Tránh lặp lại nội dung đã có trong Proposal, Team Contract hoặc các tài liệu khác; ưu tiên liên kết đến nguồn chính.
   Quy ước đặt tên

- Dùng tên file tiếng Anh, chữ thường và kebab-case để thống nhất với repository.
- Dùng Markdown (.md) cho tài liệu dạng văn bản.
- Đặt tên dễ hiểu, phản ánh đúng nội dung tài liệu.
  Tài liệu liên quan
- docs/proposal/proposal.md — phạm vi sản phẩm đã thống nhất.
- docs/management/team-contract.md — phân công và trách nhiệm thành viên.
- docs/design/database/ — thiết kế database dùng chung.
- docs/design/api/ — quy ước và contract API dùng chung.
- specs/ — đặc tả và tài liệu thiết kế theo từng feature.
