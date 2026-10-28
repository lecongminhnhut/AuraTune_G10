Bảo mật AuraTune
Mục đích
Thư mục này lưu các nguyên tắc và hướng dẫn bảo mật dùng chung cho nhiều tính năng của AuraTune. Tài liệu tập trung vào cách bảo vệ tài khoản, kiểm soát quyền truy cập, xử lý dữ liệu và quản lý thông tin bí mật.
Nội dung tại đây cần phản ánh các quyết định đã được nhóm thống nhất và cách hệ thống thực tế được triển khai.
Nội dung nên lưu tại đây

- Xác thực: nguyên tắc đăng ký, đăng nhập, quản lý token và đăng xuất.
- Phân quyền: quyền của User, Artist và Admin; kiểm tra quyền ở phía server.
- Quyền sở hữu tài nguyên: quy tắc xác định ai được xem, sửa hoặc xóa playlist, bài hát, bình luận và dữ liệu cá nhân.
- Bảo vệ dữ liệu: nguyên tắc xử lý thông tin cá nhân và dữ liệu riêng tư.
- Quản lý secrets: cách cấu hình biến môi trường và bảo vệ API key, mật khẩu, token cùng thông tin kết nối.
- Xử lý lỗi và ghi log: tránh ghi token, mật khẩu hoặc dữ liệu nhạy cảm vào log và response.
- Tích hợp dịch vụ: nguyên tắc bảo vệ giao tiếp giữa backend và các dịch vụ bên ngoài, bao gồm AI Service nếu có.
  Tài liệu có thể bổ sung
  Có thể tạo thêm các tài liệu sau khi nhóm đã thống nhất nội dung:
- authentication-and-authorization.md — nguyên tắc xác thực và phân quyền.
- data-protection.md — nguyên tắc bảo vệ dữ liệu.
- secrets-management.md — quản lý biến môi trường và thông tin bí mật.
- security-checklist.md — checklist bảo mật trước khi merge hoặc phát hành.
  Đây là các tên file gợi ý, không phải yêu cầu phải tạo tất cả ngay từ đầu.
  Nguyên tắc bảo mật chung

1. Kiểm tra quyền truy cập ở backend; không dựa vào việc ẩn nút hoặc màn hình ở frontend.
2. Chỉ cho phép người dùng thao tác trên tài nguyên mà họ sở hữu hoặc được cấp quyền quản lý.
3. Các thao tác quản trị phải được bảo vệ bằng quyền Admin.
4. Các thao tác của Artist cần xác minh nghệ sĩ có quyền quản lý bài hát hoặc album liên quan.
5. Không commit file .env, mật khẩu, token, API key hoặc credentials vào repository.
6. Không đưa thông tin xác thực hoặc dữ liệu nhạy cảm vào ví dụ tài liệu, log hay thông báo lỗi trả cho client.
7. Dùng nguyên tắc cấp quyền tối thiểu cần thiết cho từng vai trò và dịch vụ.
8. Khi phát hiện vấn đề bảo mật, báo cho người phụ trách và xử lý trước khi phát hành.
   Phân biệt với tài liệu khác

- Quy tắc bảo mật dùng chung cho toàn hệ thống đặt trong docs/design/security/.
- Quyền truy cập và lỗi cụ thể của API cần nhất quán với docs/design/api/api-contract.md.
- Yêu cầu bảo mật riêng của một feature có thể được mô tả trong thư mục feature tương ứng dưới specs/.
- Cấu hình bảo mật cụ thể của database nên được ghi trong docs/design/database/ khi phù hợp.
  Checklist trước khi hoàn thành một feature
- [ ] Endpoint được bảo vệ đúng theo yêu cầu xác thực.
- [ ] Quyền User, Artist và Admin được kiểm tra ở backend.
- [ ] Đã kiểm tra quyền sở hữu tài nguyên.
- [ ] Dữ liệu đầu vào được validate.
- [ ] Response lỗi không tiết lộ thông tin nội bộ nhạy cảm.
- [ ] Log không chứa mật khẩu, token hoặc secrets.
- [ ] Không có credentials hoặc file cấu hình bí mật trong thay đổi Git.
- [ ] Có test cho các trường hợp chưa đăng nhập hoặc không đủ quyền khi phù hợp.
      Tài liệu liên quan
- docs/design/api/ — quy ước API, response và quyền endpoint.
- docs/design/database/ — thiết kế dữ liệu và quy tắc bảo mật ở tầng database.
- docs/design/architecture/ — kiến trúc và luồng tích hợp hệ thống.
- docs/proposal/proposal.md — phạm vi sản phẩm đã thống nhất.
- docs/management/team-contract.md — phân công và trách nhiệm thành viên.
  Lưu ý: Đây là hướng dẫn tổ chức và nguyên tắc chung. Không ghi một công nghệ, cơ chế bảo mật hoặc cấu hình cụ thể là quyết định chính thức nếu nhóm chưa xác nhận.
