# Khảo sát UI/UX Các Ứng Dụng Nghe Nhạc
_Performed by: Nguyễn Thanh Huy, Reviewed by: Lê Công Minh Nhựt, Edited by: Nguyễn Thanh Huy_

## 1. Lý do chọn ứng dụng khảo sát

**Spotify** được chọn vì có giao diện phổ biến trên toàn cầu và cách tổ chức layout thông minh. Sidebar, khu vực nội dung và thanh phát nhạc được phân chia rõ ràng, giúp người dùng khám phá âm nhạc và quản lý playlist thuận tiện.

**Zing MP3** được chọn vì phù hợp với thói quen nghe nhạc của người Việt. Nội dung được trình bày gần gũi, đồng thời giao diện lời bài hát hỗ trợ người nghe theo dõi lyrics trong quá trình phát nhạc.

Khảo sát tập trung vào bố cục, cách trình bày nội dung, thao tác phát nhạc và trải nghiệm theo dõi lời bài hát để lựa chọn các pattern phù hợp với AuraTune.

## 2. Khảo sát Spotify

### 2.1. Trang chủ

- Sidebar cung cấp điểm truy cập quen thuộc tới các khu vực chính và thư viện cá nhân.
- Nội dung được chia thành các section như playlist gợi ý và nội dung đã nghe. Tiêu đề section giúp người dùng nhanh chóng xác định nhóm nội dung cần xem.
- Card sử dụng ảnh bìa, tên playlist và mô tả ngắn để người dùng nhận biết nội dung trước khi mở.
- Dark theme làm nổi bật ảnh bìa và tạo sự thống nhất giữa khu vực khám phá với player.

**Bài học cho AuraTune:** tổ chức trang chủ theo các section, dùng Card component tái sử dụng và giữ điều hướng rõ ràng khi người dùng chuyển trang.

![Trang chủ Spotify](./images/spotify_home.png)

### 2.2. Trang Playlist

- Khu vực đầu trang tập trung vào ảnh bìa, tên playlist, mô tả và thông tin tổng quan.
- Nút Play nổi bật giúp người dùng bắt đầu nghe playlist dễ dàng.
- Danh sách bài hát trình bày theo hàng, ưu tiên tên bài và nghệ sĩ; thông tin album, thời lượng và các thao tác phụ được đặt ở vị trí dễ quét mắt.
- Các hành động xuất hiện khi hover giúp giảm mật độ nút trên màn hình, nhưng vẫn cần hỗ trợ thao tác rõ ràng trên thiết bị cảm ứng.

**Bài học cho AuraTune:** phân cấp thông tin playlist, làm rõ thao tác phát và sử dụng SongRow/SongTable để giữ cách trình bày bài hát nhất quán.

![Trang Playlist Spotify](./images/spotify_playlist.png)

### 2.3. Bottom Player

- Thanh player cố định dưới đáy giúp người dùng luôn truy cập được các điều khiển phát nhạc.
- Cụm bên trái hiển thị bài đang nghe; cụm giữa chứa Play/Pause, Previous, Next và tiến trình; cụm bên phải chứa các điều khiển bổ sung như âm lượng.
- Player tồn tại xuyên suốt khi chuyển nội dung, giúp người dùng không phải quay lại trang bài hát để điều khiển nhạc.

**Bài học cho AuraTune:** đặt Bottom Player tại layout chính, tách trạng thái player khỏi từng trang và chừa đủ khoảng trống để player không che nội dung.

![Bottom Player Spotify](./images/spotify_player.png)

## 3. Khảo sát Zing MP3

### 3.1. Giao diện Lời bài hát (Lyrics)

- Lời bài hát được chia thành từng dòng, giúp người nghe dễ theo dõi nội dung.
- Dòng lời đang phát được làm nổi bật để thể hiện vị trí hiện tại trong bài hát.
- Thao tác cuộn và chuyển giữa các dòng lời cần mượt mà, tránh nhảy vị trí đột ngột làm mất tập trung.
- Màu nền và chữ cần có độ tương phản phù hợp để đọc được lời ngay cả khi sử dụng ảnh bìa làm nền.

**Bài học cho AuraTune:** khi triển khai Lyrics, sử dụng cuộn mượt, nhấn mạnh dòng hiện tại và duy trì khả năng đọc. Đồng bộ lời với thời gian phát cần được bổ sung khi có dữ liệu lyrics và audio.

![Giao diện Lyrics Zing MP3](./images/zingmp3_lyrics.png)

## 4. So sánh chung

| Thành phần | Spotify | Zing MP3 | Hướng áp dụng cho AuraTune |
| --- | --- | --- | --- |
| Sidebar | Điều hướng và truy cập thư viện | Điều hướng các khu vực khám phá âm nhạc | Sidebar trái với các mục rõ ràng |
| Card UI | Trình bày playlist và nội dung gợi ý | Trình bày playlist, album và chủ đề | Card có ảnh bìa, tên và mô tả ngắn |
| Sticky Bottom Player | Điều khiển nhạc luôn khả dụng | Thanh phát nhạc cố định dưới đáy | Player cố định, không che nội dung |
| Lyrics | Theo dõi lời bài hát | Chú trọng trải nghiệm theo dõi lời và cuộn | Cuộn mượt, nhấn mạnh dòng đang phát |

Hai ứng dụng đều sử dụng Sidebar, thẻ Card UI và thanh Player cố định dưới đáy để tạo cấu trúc điều hướng và nghe nhạc quen thuộc.

## 5. Điểm khác biệt và cải tiến UI/UX AuraTune hướng tới

Các điểm dưới đây dựa trên [Danh sách tính năng dự định thực hiện](https://docs.google.com/document/d/1fe-eC8Y-Pt5BgrCJ2wWGuOb266fswu9P/edit) của nhóm, tập trung vào các chức năng dự kiến mang lại giá trị cho trải nghiệm khám phá và quản lý nhạc.

### 5.1. Đề xuất bài hát bằng AI theo thói quen nghe

AuraTune dự định đề xuất bài hát dựa trên lịch sử nghe, bài hát yêu thích, nghệ sĩ thường nghe, thể loại thường nghe và các bài hát phổ biến. Trang chủ có khu vực hiển thị bài hát đề xuất.

**Giá trị UX:** giúp người dùng khám phá bài hát phù hợp với sở thích và giảm công sức tự tìm kiếm. Nguồn: mục 2 và 10 của tài liệu tính năng.

### 5.2. Tìm bài hát bằng lời bài hát với AI

Ngoài tìm theo tên bài hát, nghệ sĩ, album và playlist, AuraTune có chức năng tìm theo lời bài hát bằng AI.

**Giá trị UX:** cung cấp thêm cách tìm nhạc khi người dùng nhớ lời nhưng chưa biết tên bài hoặc nghệ sĩ. Nguồn: mục 3 của tài liệu tính năng.

### 5.3. Tạo playlist bằng AI

Tài liệu xác định chức năng tạo playlist bằng AI, cùng các thao tác quản lý playlist như chỉnh sửa thông tin, thêm hoặc xóa bài hát và thay đổi thứ tự bài hát.

**Giá trị UX:** hỗ trợ người dùng tạo danh sách nghe nhạc thuận tiện hơn. Nguồn: mục 6 của tài liệu tính năng.

### 5.4. Playlist chung

AuraTune dự định hỗ trợ tạo playlist chung, bên cạnh các chức năng tạo, chỉnh sửa và phát playlist.

**Giá trị UX:** tạo không gian nghe nhạc chung cho người dùng có nhu cầu cùng xây dựng một playlist. Nguồn: mục 6 của tài liệu tính năng.

### 5.5. Lịch sử nghe kèm thống kê cá nhân

Người dùng có thể xem bài hát đã nghe gần đây, số lượt nghe mỗi bài, thời lượng nghe theo từng nghệ sĩ và bảng xếp hạng top N nghệ sĩ, bài hát được nghe nhiều nhất.

**Giá trị UX:** giúp người dùng tìm lại bài đã nghe và theo dõi sở thích âm nhạc qua số liệu cá nhân. Nguồn: mục 7 của tài liệu tính năng.

## 6. UI/UX Pattern áp dụng

- **Dark theme & Card layout — Spotify:** dùng nền tối, phân cấp nội dung theo section và Card component nhất quán trên trang chủ.
- **Thao tác cuộn Lyrics — Zing MP3:** áp dụng cuộn mượt và nhấn mạnh dòng lời hiện tại khi triển khai giao diện Lyrics.
- **Player cố định tại layout:** giữ điều khiển nhạc ở vị trí ổn định trong quá trình điều hướng.

## 7. Ảnh chụp màn hình thực tế

Các ảnh được chụp trực tiếp từ Spotify Web và Zing MP3 Web ngày 07/10/2026, lưu trong thư mục `images/`:

1. `spotify_home.png`
2. `spotify_playlist.png`
3. `spotify_player.png`
4. `zingmp3_lyrics.png`

Trang chủ và playlist Spotify được chụp ở trạng thái chưa đăng nhập. Bottom Player được chụp sau khi đăng nhập, khi đang phát “Để Dành Khi Thức Giấc” của SIVAN. Ảnh Zing MP3 ghi lại chế độ Lời bài hát của “Ngân Hàng Nỗi Nhớ” — Đạt G. Giao diện thực tế có thể thay đổi theo tài khoản và thời điểm truy cập.
