Thiết kế cơ sở dữ liệu AuraTune

1. Mục đích
   Thư mục này lưu tài liệu thiết kế cơ sở dữ liệu dùng chung cho AuraTune, bao gồm mô hình dữ liệu, quan hệ giữa các bảng, quy tắc toàn vẹn dữ liệu và các quyết định liên quan đến lưu trữ.
   Schema hiện có sử dụng cú pháp PostgreSQL (public schema, IDENTITY, timestamp with time zone và khóa ngoại). Tài liệu này mô tả schema được cung cấp; không mặc định đây là schema cuối cùng hoặc script triển khai có thể chạy trực tiếp.
2. Tài liệu trong thư mục
   Có thể tổ chức các tài liệu database như sau:

- README.md — mục đích, cấu trúc và hướng dẫn cập nhật tài liệu database.
- er-diagram.md — sơ đồ thực thể và quan hệ giữa các bảng.
- database-schema.sql — schema SQL đã được nhóm kiểm tra và xác nhận có thể dùng để triển khai, nếu cần.
- data-consistency.md — quy tắc toàn vẹn dữ liệu và xử lý các thao tác đồng thời.
- security-rules.md — nguyên tắc bảo vệ dữ liệu ở tầng database.
  Chỉ tạo hoặc bổ sung các file trên khi cần. Đoạn schema tham khảo hiện tại có cảnh báo rằng nó chỉ dùng làm ngữ cảnh, chưa chắc thứ tự bảng và constraint có thể chạy trực tiếp.

3. Các nhóm bảng hiện có
   Người dùng và nghệ sĩ

- users — thông tin tài khoản, email, password hash và vai trò (user, artist, admin).
- artists — hồ sơ nghệ sĩ, liên kết tùy chọn với một tài khoản trong users.
  Âm nhạc
- albums — thông tin album và liên kết đến nghệ sĩ.
- songs — thông tin bài hát, thời lượng, URL audio, album, thể loại và tổng lượt phát.
  Playlist
- playlists — playlist và người tạo; trạng thái được giới hạn ở Public, Private hoặc Shared.
- playlist_songs — quan hệ nhiều-nhiều giữa playlist và bài hát, đồng thời lưu thời điểm thêm bài hát.
- playlist_shared_users — quan hệ giữa playlist và người dùng được chia sẻ playlist đó.
  Theo dõi và yêu thích
- user_follows_user — quan hệ theo dõi giữa người dùng với người dùng.
- user_follows_artist — quan hệ theo dõi giữa người dùng và nghệ sĩ.
- user_liked_songs — các bài hát được người dùng thích.
  Lịch sử và thống kê nghe nhạc
- listening_history — các lượt nghe, thời điểm phát và thời lượng đã nghe.
- user_listening_stats — số liệu tổng hợp theo người dùng, gồm tổng thời lượng nghe, top thể loại dạng text và thời điểm cập nhật gần nhất.

4. Các quan hệ chính

- Một người dùng có thể liên kết với một hồ sơ nghệ sĩ; artists.user_id có ràng buộc UNIQUE.
- Một nghệ sĩ có thể có nhiều album.
- Một album có thể liên kết với nhiều bài hát.
- Một người dùng có thể tạo nhiều playlist.
- Playlist và bài hát có quan hệ nhiều-nhiều thông qua playlist_songs.
- Playlist và người được chia sẻ có quan hệ nhiều-nhiều thông qua playlist_shared_users.
- Người dùng có thể theo dõi người dùng khác, theo dõi nghệ sĩ và thích nhiều bài hát.
- listening_history ghi lại quan hệ giữa người dùng và bài hát theo từng lượt nghe.
- user_listening_stats có tối đa một bản ghi cho mỗi người dùng theo khóa chính user_id.
  Các cột cho phép NULL trong schema hiện tại được giữ nguyên như đã định nghĩa; không nên suy luận rằng chúng bắt buộc phải có giá trị nếu chưa có quyết định khác.

5. Quy tắc cập nhật schema
1. Thay đổi schema phải được xem xét cùng các feature bị ảnh hưởng.
1. Cập nhật sơ đồ ER và tài liệu liên quan khi thêm, xóa hoặc đổi quan hệ giữa các bảng.
1. Kiểm tra khóa chính, khóa ngoại, UNIQUE, CHECK, giá trị mặc định và khả năng NULL.
1. Khi thay đổi ảnh hưởng đến API, cập nhật docs/design/api/api-contract.md và đặc tả feature tương ứng.
1. Nếu dự án dùng migration, hãy lưu thay đổi schema theo quy trình migration của repository thay vì chỉ chỉnh tài liệu.
1. Không coi schema tham khảo là script triển khai trước khi kiểm tra thứ tự tạo bảng và constraint.
1. Các điểm cần xác nhận trong schema hiện tại
   Các mục sau là những điểm nên được nhóm xem xét; đây không phải khẳng định rằng schema hiện tại sai:

- Playlist sharing: playlist_shared_users ghi nhận người được chia sẻ nhưng schema chưa thể hiện quyền cụ thể của người được chia sẻ (chỉ xem hay được chỉnh sửa).
- Trạng thái playlist: playlists.status có Public, Private, Shared; cần thống nhất ý nghĩa từng trạng thái và cách chúng liên quan đến playlist_shared_users.
- Collaborative playlist: nếu nhiều người được phép chỉnh sửa playlist, cần xác định quyền và quy tắc kiểm soát thao tác.
- Lịch sử nghe: user_id và song_id trong listening_history hiện cho phép NULL; cần xác nhận đây có phải hành vi mong muốn hay không.
- Thống kê nghe: top_genres được lưu dưới dạng text; cần thống nhất định dạng và cách cập nhật nếu ứng dụng sử dụng trường này.
- Tổng lượt phát: songs.total_plays là số nguyên có mặc định 0; cần thống nhất cách cập nhật để tránh sai lệch khi nhiều lượt nghe xảy ra đồng thời.
- Xóa dữ liệu liên quan: schema hiện không khai báo rõ hành vi ON DELETE; cần thống nhất cách xử lý khi xóa user, song, album hoặc playlist.
- Ràng buộc nghiệp vụ: cân nhắc các ràng buộc như thời lượng không âm, không cho người dùng tự theo dõi chính mình và quy tắc trùng lặp phù hợp. Chỉ thêm constraint sau khi xác nhận nghiệp vụ.

7. Bảo mật dữ liệu

- password_hash phải lưu giá trị hash mật khẩu, không lưu mật khẩu dạng văn bản thuần.
- Không ghi mật khẩu, token hoặc thông tin xác thực vào log.
- Phân quyền truy cập dữ liệu phải được kiểm tra ở backend và tại tầng database khi công nghệ hỗ trợ cơ chế phù hợp.
- Không đưa dữ liệu người dùng thật hoặc thông tin bí mật vào ví dụ schema hay tài liệu.
- Tài liệu bảo mật dùng chung nằm trong docs/design/security/.

8. Tài liệu liên quan

- docs/design/architecture/ — kiến trúc hệ thống và các module.
- docs/design/api/ — API Contract và quy ước API.
- docs/design/security/ — nguyên tắc bảo mật dùng chung.
- specs/060-playlist-management/ — đặc tả tính năng playlist.
- specs/070-listening-history/ — đặc tả lịch sử nghe nhạc.
- docs/proposal/proposal.md — phạm vi sản phẩm đã thống nhất.
  Lưu ý
  Tài liệu này phản ánh schema được cung cấp trong cuộc trao đổi. Hãy xác nhận lại với schema và migration thực tế trong repository trước khi dùng làm nguồn triển khai chính thức.
