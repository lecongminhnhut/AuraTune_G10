Wireframes và thiết kế giao diện AuraTune
Mục đích
Thư mục này lưu các liên kết Figma, wireframe và tài liệu tham khảo giao diện dùng trong quá trình thiết kế AuraTune. Mục tiêu là giúp các thành viên tìm đúng thiết kế, hiểu luồng màn hình và phối hợp nhất quán khi triển khai frontend.
Nội dung nên lưu tại đây

- Liên kết Figma: file hoặc project thiết kế gốc của nhóm.
- Wireframe: bố cục và luồng màn hình trước khi hoàn thiện UI.
- Luồng người dùng: đường đi giữa các màn hình cho từng kịch bản.
- Quy ước giao diện dùng chung: chỉ lưu ở đây nếu ảnh hưởng đến nhiều tính năng; ví dụ quy ước tổ chức file thiết kế hoặc cách đặt tên frame.
- Ghi chú bàn giao: trạng thái thiết kế, phần cần review và các điểm cần làm rõ với nhóm phát triển.
  Cách tổ chức
  Có thể nhóm tài liệu theo mã feature trong specs/ để dễ tra cứu. Ví dụ:
- 010-authentication — đăng ký, đăng nhập và phiên làm việc.
- 030-search — tìm kiếm văn bản và tìm kiếm ngữ nghĩa.
- 040-music-player — trình phát nhạc và lời bài hát.
- 060-playlist-management — quản lý playlist.
- 100-ai-recommendations — gợi ý nhạc bằng AI.
  Các tên trên chỉ là ví dụ theo cách đặt mã feature của dự án. Không cần tạo thư mục riêng cho mọi feature nếu chỉ cần quản lý bằng một danh sách liên kết.
  Danh sách thiết kế
  Nên duy trì một danh sách ngắn gồm các thông tin sau:
  Feature / Nhóm Liên kết Figma Trạng thái Ghi chú
  Authentication Thêm liên kết Figma Chưa bắt đầu Đăng ký, đăng nhập, khôi phục mật khẩu
  Search Thêm liên kết Figma Chưa bắt đầu Kết quả tìm kiếm và trạng thái không có kết quả
  Music Player Thêm liên kết Figma Chưa bắt đầu Trạng thái phát, tạm dừng, queue và lyrics
  Playlist Management Thêm liên kết Figma Chưa bắt đầu Tạo, chỉnh sửa và chia sẻ playlist nếu được duyệt

Hãy thay các nội dung mẫu bằng link và trạng thái thực tế của nhóm. Không để ví dụ bị hiểu nhầm là thiết kế đã hoàn thành.
Quy ước đặt tên

- Ưu tiên đặt tên frame hoặc page theo mã nhóm feature và tên chức năng.
- Dùng tên nhất quán giữa Figma, specs/ và tài liệu quản lý.
- Ví dụ: 040 - Music Player, 060 - Playlist Management.
- Giữ link đến file thiết kế gốc; tránh tạo nhiều bản sao gây nhầm phiên bản.
  Quy trình cập nhật

1. Tạo hoặc cập nhật wireframe trong công cụ thiết kế mà nhóm sử dụng.
2. Thêm liên kết vào danh sách thiết kế trong tài liệu này.
3. Ghi rõ trạng thái như Draft, In Review hoặc Approved.
4. Khi thiết kế được duyệt, thông báo cho thành viên triển khai frontend.
5. Nếu thiết kế thay đổi hành vi tính năng, cập nhật đặc tả tương ứng trong specs/ và trao đổi với người phụ trách feature.
   Phân biệt với tài liệu khác

- Link Figma và wireframe được quản lý tại docs/design/wireframes/.
- Yêu cầu, kịch bản sử dụng và tiêu chí chấp nhận nằm trong thư mục feature tương ứng dưới specs/.
- Kiến trúc dùng chung nằm tại docs/design/architecture/.
- API contract nằm tại docs/design/api/.
  Lưu ý
  Chỉ đưa vào đây link mà nhóm có quyền truy cập. Không lưu token, mật khẩu hoặc thông tin bí mật trong URL hay ghi chú thiết kế.
