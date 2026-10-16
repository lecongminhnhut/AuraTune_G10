# Tính nhất quán dữ liệu — AuraTune

## 1. Mục đích

Tài liệu này ghi nhận các quy tắc và rủi ro nhất quán dữ liệu cần được thống nhất khi triển khai AuraTune. Nội dung dựa trên schema PostgreSQL được cung cấp và API Contract hiện tại; các giải pháp cụ thể cần được đối chiếu với code và migration thực tế.

## 2. Nguyên tắc

- Các thay đổi liên quan nhiều bảng cần được thực hiện theo cách bảo đảm dữ liệu không rơi vào trạng thái dở dang.
- Dùng khóa chính, khóa ngoại, `UNIQUE` và `CHECK` phù hợp để bảo vệ các bất biến đã thống nhất.
- Xác định rõ hành vi khi xóa dữ liệu được tham chiếu.
- Với các bộ đếm hoặc thống kê được cập nhật thường xuyên, cần tránh cập nhật mất dữ liệu khi có nhiều request đồng thời.
- Các thao tác có thể được gửi lại do retry cần có quy tắc xử lý trùng lặp phù hợp.
- Không lưu bản tổng hợp và dữ liệu nguồn theo cách khiến chúng sai lệch mà không có cơ chế cập nhật hoặc tái tạo.

## 3. Các vùng dữ liệu cần chú ý

### 3.1. Playlist và playlist_songs

Schema dùng khóa chính ghép `(playlist_id, song_id)` trong `playlist_songs`, giúp một bài hát không xuất hiện lặp nhiều lần trong cùng playlist theo khóa này.

Cần thống nhất:
- Khi thêm nhiều bài hát cùng lúc, cách xử lý ID không tồn tại hoặc ID trùng.
- Cách cập nhật thứ tự bài hát. Schema hiện tại chưa có cột position/order trong `playlist_songs`.
- Khi xóa playlist hoặc bài hát, cách xử lý các hàng liên quan.
- Nếu hỗ trợ collaborative editing, cách xử lý hai người cùng sửa playlist.

### 3.2. Chia sẻ playlist

`playlist_shared_users` dùng khóa chính ghép `(playlist_id, shared_with_user_id)` để tránh một người được ghi nhiều lần trong cùng playlist.

Cần thống nhất:
- Ý nghĩa các trạng thái `Public`, `Private`, `Shared`.
- Người được chia sẻ có quyền xem hay được sửa.
- Cách thu hồi quyền chia sẻ.
- Cách xử lý khi chủ playlist hoặc người được chia sẻ bị xóa/khóa.
- Quy tắc đồng thời khi nhiều người thay đổi thành viên được chia sẻ.

### 3.3. Lịch sử nghe và tổng lượt phát

`listening_history` lưu từng lượt nghe, trong khi `songs.total_plays` là bộ đếm tổng lượt phát.

Cần xác định:
- Khi nào một lượt nghe được tính là một play.
- Có tăng `total_plays` cho mỗi request stream hay chỉ khi đạt điều kiện nghe tối thiểu.
- Cách tránh đếm trùng khi client retry request ghi lịch sử.
- Cách cập nhật lịch sử và bộ đếm trong cùng một transaction hoặc cơ chế đồng bộ thích hợp.
- Cách xử lý trường hợp một trong các bước cập nhật thất bại.

### 3.4. user_listening_stats

Bảng `user_listening_stats` lưu tổng thời lượng nghe và `top_genres` dạng `text`.

Cần thống nhất:
- `total_duration_listened` được tính từ dữ liệu nguồn nào.
- `top_genres` có định dạng gì và được cập nhật khi nào.
- Thống kê được tính đồng bộ hay cập nhật nền.
- Cách tái tính dữ liệu tổng hợp khi có sai lệch.
- Cách xử lý các lượt nghe đến đồng thời.

### 3.5. Like, follow và quan hệ

Các bảng `user_liked_songs`, `user_follows_user` và `user_follows_artist` sử dụng khóa chính ghép để ngăn bản ghi quan hệ trùng.

Cần xem xét thêm quy tắc nghiệp vụ, chẳng hạn có cho phép người dùng tự follow hay không. Không thêm ràng buộc mới trước khi nhóm xác nhận yêu cầu.

## 4. Transaction và cập nhật đồng thời

Khi một thao tác cập nhật nhiều bản ghi liên quan, hãy xác định:
- Các bước nào phải thành công hoặc thất bại cùng nhau.
- Có cần transaction hay không.
- Hành vi khi có conflict hoặc retry.
- Có cần khóa, kiểm soát phiên bản hoặc cơ chế chống ghi đè hay không.

Cách triển khai cụ thể phụ thuộc database và backend thực tế. Tài liệu này không áp đặt một chiến lược transaction chưa được nhóm lựa chọn.

## 5. Khóa ngoại và xóa dữ liệu

Schema hiện tại khai báo các khóa ngoại nhưng không nêu `ON DELETE`. Trước khi triển khai, nhóm cần quyết định cho từng quan hệ:
- Chặn xóa khi còn dữ liệu tham chiếu.
- Xóa dây chuyền dữ liệu liên quan.
- Giữ dữ liệu lịch sử hoặc chuyển sang trạng thái lưu trữ.

Không dùng một chính sách xóa chung cho tất cả bảng nếu yêu cầu nghiệp vụ khác nhau.

## 6. Kiểm thử tính nhất quán

- [ ] Thêm cùng một quan hệ hai lần không tạo dữ liệu trùng.
- [ ] Thao tác thất bại không để lại dữ liệu dở dang.
- [ ] Hai request đồng thời không làm sai lệch bộ đếm hoặc thứ tự.
- [ ] Retry request không gây tác dụng phụ trùng ngoài ý muốn.
- [ ] Xóa tài nguyên xử lý đúng các bản ghi liên quan.
- [ ] Dữ liệu thống kê có thể đối chiếu hoặc tái tính từ dữ liệu nguồn khi cần.
- [ ] Các trường hợp lỗi và xung đột được kiểm thử.

## 7. Tài liệu liên quan

- `er-diagram.md` — sơ đồ quan hệ và khóa.
- `docs/design/database/README.md` — tài liệu database.
- `docs/design/api/api-contract.md` — hợp đồng API.
- `specs/060-playlist-management/` — đặc tả playlist.
- `specs/070-listening-history/` — đặc tả lịch sử nghe.
