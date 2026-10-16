# Tài liệu API AuraTune

## Mục đích

Thư mục này chứa tài liệu API và các quy ước dùng chung cho các tính năng của AuraTune.

## Các file

- `api-contract.md`: Hợp đồng API dùng chung, bao gồm danh sách endpoint, yêu cầu về quyền truy cập, định dạng response và HTTP status code.
- `api-quy-uoc.md`: Các quy ước chung về cách đặt tên endpoint, query parameters, phân trang, kiểm tra dữ liệu đầu vào và xử lý lỗi.

## Quy ước về API Contract

1. Duy trì tính nhất quán của định dạng response và định nghĩa mã lỗi giữa các endpoint.
2. Mỗi endpoint phải được mô tả rõ HTTP method, đường dẫn, quyền truy cập, mục đích, tham số request, request body, dữ liệu response và các lỗi có thể xảy ra.
3. Sử dụng header `Authorization: Bearer <access_token>` cho các endpoint yêu cầu xác thực, trừ khi API Contract quy định cơ chế khác.
4. Phân biệt rõ endpoint công khai với endpoint yêu cầu đăng nhập, quyền Artist hoặc quyền Admin.
5. Nếu chi tiết request/response chỉ liên quan đến một tính năng cụ thể, hãy đặt chúng trong thư mục `specs/NNN-feature-name/` tương ứng. Có thể liên kết đến các tài liệu này từ API Contract dùng chung khi cần thiết.
6. Cập nhật tài liệu khi endpoint hoặc hành vi API thay đổi.

## Chia sẻ Playlist — Vấn đề API Contract cần làm rõ

API Contract hiện tại đã mô tả các chức năng tạo và quản lý playlist, nhưng chưa định nghĩa endpoint riêng hoặc hành vi cụ thể cho việc chia sẻ playlist.

Trước khi triển khai, nhóm cần thống nhất AuraTune sẽ hỗ trợ hình thức chia sẻ nào:

- **Liên kết công khai (Public link):** Bất kỳ ai có URL đều có thể mở playlist.
- **Liên kết riêng tư (Private link):** Quyền truy cập bị giới hạn, chẳng hạn thông qua mã chia sẻ (`share token`).
- **Playlist cộng tác (Collaborative playlist):** Người dùng được mời có thể thêm, xóa hoặc sắp xếp lại bài hát trong playlist.

Đây là các hành vi khác nhau, không nên xem chúng là tương đương. Phương án được thống nhất sẽ quyết định thiết kế endpoint, quyền truy cập, schema request/response và các trường hợp lỗi.

### Các endpoint có thể xem xét

Sau khi thống nhất hành vi chia sẻ, nhóm có thể cân nhắc các endpoint sau:

| HTTP method | Endpoint đề xuất                 | Mục đích                                                              |
| ----------- | -------------------------------- | --------------------------------------------------------------------- |
| `POST`      | `/playlists/:id/share`           | Tạo hoặc bật liên kết chia sẻ                                         |
| `DELETE`    | `/playlists/:id/share`           | Thu hồi liên kết chia sẻ                                              |
| `GET`       | `/playlists/shared/:share_token` | Lấy playlist thông qua mã chia sẻ, nếu chọn mô hình liên kết riêng tư |

**Lưu ý:** Các endpoint trên chỉ là đề xuất, chưa thuộc API Contract đã được phê duyệt. Hãy xác nhận hành vi chia sẻ mong muốn và đối chiếu với đặc tả playlist trước khi bổ sung chúng vào `api-contract.md`.

## Quy ước đặt tên và định dạng

- Sử dụng chữ thường và `kebab-case` cho tên file Markdown.
- Duy trì sự nhất quán trong cách đặt tên endpoint và sử dụng HTTP method.
- Viết ví dụ request/response bằng JSON khi phù hợp.
- Không đưa access token, mật khẩu, API key hoặc thông tin bí mật thật vào ví dụ.

## Tài liệu liên quan

- `docs/proposal/proposal.md` — phạm vi sản phẩm đã được thống nhất.
- `docs/management/team-contract.md` — phân công chức năng và trách nhiệm của các thành viên.
- `specs/060-playlist-management/` — tài liệu đặc tả tính năng quản lý playlist.
