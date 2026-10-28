# Quy ước API AuraTune

## 1. Mục đích

Tài liệu này quy định các quy ước chung khi thiết kế và mô tả API cho AuraTune. Nội dung bổ trợ cho `api-contract.md`, nơi liệt kê các endpoint hiện có, quyền truy cập, định dạng response, HTTP status code và mã lỗi.

Các quy ước ở đây áp dụng cho nhiều tính năng. Hành vi và schema riêng của từng tính năng nên được mô tả trong thư mục tương ứng bên dưới `specs/`.

## 2. Đường dẫn gốc và xác thực

- Đường dẫn API gốc: `/api/v1`.
- Endpoint yêu cầu đăng nhập sử dụng header `Authorization: Bearer <access_token>`.
- Endpoint công khai không yêu cầu access token.
- Ghi rõ vai trò cần thiết cho từng endpoint được bảo vệ: `User`, `Artist` hoặc `Admin`.
- `Artist` cũng là người dùng đã đăng nhập. Các thao tác của Artist phải giới hạn trong tài nguyên mà nghệ sĩ được phép quản lý.
- Không đưa mật khẩu, token, API key hoặc thông tin bí mật thật vào tài liệu hay source control.

## 3. Quy ước HTTP method

Sử dụng HTTP method nhất quán với hành động:

| Method | Quy ước |
|---|---|
| `GET` | Lấy tài nguyên hoặc danh sách; không thay đổi trạng thái trên server. |
| `POST` | Tạo tài nguyên hoặc kích hoạt một thao tác. |
| `PUT` | Cập nhật hoặc thay thế tài nguyên theo contract của endpoint. |
| `PATCH` | Chỉ sử dụng khi dự án thống nhất rõ ngữ nghĩa cập nhật một phần. |
| `DELETE` | Xóa tài nguyên hoặc loại bỏ quan hệ, ví dụ bỏ thích hoặc bỏ theo dõi. |

Các endpoint liên quan cần dùng method nhất quán.

## 4. Quy ước đặt tên endpoint

- Dùng danh từ số nhiều cho collection, ví dụ `/songs`, `/albums`, `/playlists`.
- Dùng `:id` làm ký hiệu cho ID tài nguyên, thống nhất với API Contract hiện tại.
- Dùng đường dẫn lồng nhau khi thao tác thuộc về tài nguyên cha, ví dụ `/playlists/:id/songs`.
- Dùng `/users/me` cho tài nguyên của người dùng đang đăng nhập khi phù hợp.
- Tránh tạo nhiều endpoint có cùng chức năng nếu không có khác biệt rõ ràng.
- Với các quan hệ, sử dụng mẫu nhất quán. Ví dụ contract hiện tại dùng `PUT` và `DELETE` cho thao tác follow/unfollow và like/unlike.

## 5. Query parameters và request body

Với mỗi endpoint, cần mô tả:

- HTTP method và đường dẫn.
- Quyền truy cập và vai trò cần thiết.
- Path parameters.
- Query parameters, bao gồm giá trị hợp lệ, mặc định và giới hạn.
- Schema request body và content type.
- Quy tắc validate và các lỗi có thể xảy ra.

Dùng query parameters cho lọc, sắp xếp, phân trang và chọn khoảng dữ liệu. Dùng JSON body cho dữ liệu có cấu trúc, trừ trường hợp upload file.

Với upload file, ghi rõ `multipart/form-data`, loại file được chấp nhận, giới hạn dung lượng và cách validate. API Contract hiện tại đánh dấu tạo bài hát, tạo album và cập nhật hồ sơ là các request multipart; giới hạn file cụ thể cần được xác định trong triển khai hoặc đặc tả tính năng.

## 6. Response JSON chuẩn

API Contract hiện tại yêu cầu cấu trúc sau cho các response JSON thông thường.

Thành công:

```json
{
  "success": true,
  "message": "optional message",
  "data": {},
  "error": null
}
```

Thất bại:

```json
{
  "success": false,
  "message": "Mô tả ngắn về lỗi",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "details": []
  }
}
```

Quy ước:

- Giữ nhất quán bốn field cấp cao nhất.
- Dùng `data: null` khi có lỗi.
- Dùng `error: null` khi thành công.
- Mã lỗi viết hoa theo định dạng `SNAKE_CASE`.
- Dùng `error.details` để mô tả lỗi validate theo từng field khi phù hợp.
- Không trả stack trace, secrets hoặc chi tiết nội bộ nhạy cảm cho client.

Danh sách status code và mã lỗi được quản lý tập trung trong `api-contract.md`. Khi cần thêm mã lỗi dùng chung, hãy thống nhất và cập nhật danh sách này.

## 7. HTTP status code

Dùng status code đã được quy định trong `api-contract.md`:

- `200`: request thành công.
- `201`: tạo tài nguyên thành công.
- `206`: trả một phần nội dung audio khi stream theo range.
- `400`: request không hợp lệ hoặc validate thất bại.
- `401`: thiếu, sai hoặc hết hạn xác thực.
- `403`: người gọi đã xác thực nhưng không đủ quyền, hoặc tài khoản bị khóa.
- `404`: không tìm thấy tài nguyên.
- `409`: xung đột, ví dụ tài nguyên trùng lặp.
- `429`: vượt giới hạn request.
- `500`: lỗi server không mong đợi.
- `503`: AI Service không khả dụng.

Không dùng HTTP status thành công cho thao tác thất bại. Nếu cần status code chưa có trong danh sách, nhóm cần thống nhất và cập nhật API Contract trước khi triển khai.

## 8. Phân trang, lọc và sắp xếp

Với endpoint trả về collection lớn, cần xác định chiến lược phân trang nhất quán trước khi triển khai.

Với từng endpoint liên quan, mô tả:

- Tên tham số, ví dụ `limit` và cursor hoặc số trang.
- Kích thước trang mặc định và tối đa.
- Trường sắp xếp và chiều sắp xếp được phép.
- Trường lọc và giá trị hợp lệ.
- Metadata response cần thiết để lấy trang tiếp theo.

API Contract hiện tại có nhắc đến `limit`, `sort`, `range` và các query parameter khác ở một số endpoint, nhưng chưa xác định một chuẩn phân trang dùng chung cho toàn dự án. Nhóm cần thống nhất chuẩn này trước khi coi nó là quy ước chính thức.

## 9. Phân quyền và quyền sở hữu tài nguyên

- Kiểm tra quyền ở server, không chỉ ở frontend.
- Kiểm tra quyền sở hữu trước khi cho phép người dùng sửa hoặc xóa tài nguyên.
- Các thao tác quản trị phải yêu cầu vai trò `Admin`.
- Các thao tác của Artist phải xác minh nghệ sĩ sở hữu hoặc được phép quản lý nội dung đích, trừ endpoint cho phép Admin thực hiện.
- Trả status code và mã lỗi đã quy định trong `api-contract.md` khi không đủ quyền hoặc không tìm thấy tài nguyên.
- Không để lộ dữ liệu riêng tư cho người gọi không có quyền truy cập.

## 10. Response đặc biệt

Không phải endpoint nào cũng trả JSON theo format chuẩn.

API Contract hiện tại định nghĩa `GET /songs/:id/stream` là ngoại lệ:

- Response thành công trả dữ liệu audio với `Content-Type: audio/mpeg`.
- Hỗ trợ request theo đoạn dữ liệu thông qua header `Range`.
- Có thể trả `200` hoặc `206`.
- Khi lỗi, trả JSON theo format chuẩn.

Nếu sau này có endpoint trả binary, stream hoặc loại response đặc biệt khác, hãy ghi rõ ngoại lệ thay vì âm thầm thay đổi quy ước JSON.

## 11. Tích hợp AI Service

API Contract hiện tại mô tả endpoint `/ai/*` là các lời gọi nội bộ từ backend đến Python AI Service; frontend không gọi trực tiếp các endpoint này.

- Giữ endpoint AI nội bộ tách biệt với API công khai cho client.
- Xác định timeout và hành vi lỗi cho các tính năng phụ thuộc AI.
- Khi AI Service không thể xử lý request, sử dụng `503` / `AI_SERVICE_UNAVAILABLE` theo contract khi phù hợp.
- Không tiết lộ credentials hoặc thông tin chẩn đoán nội bộ cho client.

## 12. Checklist khi thêm hoặc sửa API

- [ ] Method và endpoint tuân thủ quy ước đặt tên.
- [ ] Quyền truy cập và vai trò được ghi rõ.
- [ ] Query parameters, request body và content type được mô tả.
- [ ] Response thành công và lỗi có thể xảy ra được ghi rõ.
- [ ] HTTP status code phù hợp với `api-contract.md`.
- [ ] Phân quyền và quyền sở hữu tài nguyên được kiểm tra.
- [ ] Hành vi phân trang, lọc và sắp xếp rõ ràng khi cần.
- [ ] Test bao gồm trường hợp thành công, dữ liệu không hợp lệ, chưa xác thực và không đủ quyền khi phù hợp.
- [ ] Tài liệu API dùng chung và đặc tả riêng của feature được cập nhật đồng bộ.

## 13. Tài liệu liên quan

- `api-contract.md` — danh sách endpoint hiện tại, response envelope, status code và mã lỗi.
- `docs/proposal/proposal.md` — phạm vi sản phẩm đã thống nhất.
- `docs/management/team-contract.md` — trách nhiệm các thành viên.
- `specs/` — đặc tả và contract theo từng tính năng.
