# Nhật ký sử dụng AI – Rà soát và Chuẩn hóa Vision Document

_Mỗi lần dùng AI được ghi thành một mục riêng theo trình tự thực hiện._

| #   | Ngày       | Nội dung                                                                                           | Nhóm |
| --- | ---------- | -------------------------------------------------------------------------------------------------- | ---- |
| 1   | 2026-10-24 | Rà soát chéo, phát hiện mâu thuẫn và đề xuất chuẩn hóa cho tài liệu `AuraTune_Vision_Document.md` | 10   |

---

## Mục 1: Rà soát chéo và chuẩn hóa tài liệu `AuraTune_Vision_Document.md`

| Trường | Nội dung |
| ------ | -------- |
| Ngày                     | 2026-10-24 |
| Người thực hiện          | Nguyễn Khánh Đăng |
| Nhóm tính năng liên quan | Toàn bộ dự án – Tài liệu định hướng tổng quan (`AuraTune_Vision_Document.md`) |
| Công cụ AI               | Gemini 4 Argon |
| Mục đích               | Rà soát tài liệu, đối chiếu chéo nội dung do nhiều thành viên viết để phát hiện mâu thuẫn logic/số liệu/thuật ngữ và viết bản nháp chuẩn hóa. |

### Prompt đã dùng

```text
VAI TRÒ & MỤC TIÊU
Hãy đóng vai một Chuyên gia Kiểm soát Chất lượng Tài liệu và Biên tập viên kỹ thuật cao cấp. Tôi có một tài liệu được chắp bút bởi nhiều thành viên khác nhau trong nhóm. Nhiệm vụ của bạn là đọc kỹ, đối chiếu chéo toàn bộ nội dung để phát hiện các điểm mâu thuẫn, thiếu nhất quán và đề xuất phương án chuẩn hóa để tài liệu trở thành một thể thống nhất.
NGỮ CẢNH TÀI LIỆU
Tên/Loại tài liệu:AuraTune_Vision_Document.md
Mục đích của tài liệu:Nộp đồ án môn học, tài liệu định hướng tổng quan
YÊU CẦU RÀ SOÁT CHI TIẾT (4 KHÍA CẠNH)
Hãy quét toàn bộ tài liệu và kiểm tra 4 nhóm vấn đề sau:
1. Mâu thuẫn về mặt Logic & Nghiệp vụ/Kỹ thuật: Các quy trình, luồng hoạt động, công nghệ sử dụng, phân quyền hoặc yêu cầu chức năng ở phần này bị xung đột hoặc phủ định phần khác.
2. Mâu thuẫn về Số liệu, Thời gian & Phạm vi: Các con số thống kê, mốc thời gian, phân công nhiệm vụ hoặc giới hạn hệ thống không khớp nhau giữa các bảng biểu và phần chữ viết.
3. Bất nhất về Thuật ngữ & Định danh: Cùng một khái niệm, đối tượng, biến số hoặc thành phần hệ thống nhưng mỗi người viết lại gọi bằng một tên khác nhau.
ĐỊNH DẠNG ĐẦU RA MONG MUỐN
Hãy trình bày kết quả rà soát theo cấu trúc 3 phần sau:
Phần 1: Bảng tổng hợp các điểm mâu thuẫn ( Sắp xếp từ Nghiêm trọng nhất đến Nhẹ nhất)
Trình bày dưới dạng bảng gồm các cột: 
Mã lỗi & Mức độ: (Cao / Trung bình / Thấp)
Loại mâu thuẫn: (Logic / Số liệu / Thuật ngữ / Văn phong)
Vị trí đối chiếu: (Trích dẫn rõ Mục X nói gì vs. Mục Y nói gì)
Mô tả chi tiết xung đột: (Tại sao hai điểm này lại mâu thuẫn nhau?)
Phần 2: Đề xuất hướng giải quyết cụ thể
Với từng mã lỗi ở Phần 1, hãy đưa ra: 
Phương án xử lý: (Nên giữ phần nào, bỏ phần nào, hoặc gộp lại ra sao). Đoạn văn bản viết lại (Draft): Viết sẵn đoạn text chuẩn hóa để tôi có thể copy-paste đè vào tài liệu gốc.
Phần 3: Bảng quy chuẩn thuật ngữ
Lập một bảng danh sách các từ khóa/thuật ngữ đang bị dùng lộn xộn trong bài và chốt 1 từ chuẩn duy nhất để cả nhóm dùng lệnh Find & Replace.
```

### Tóm tắt phản hồi của AI

- Phân tích và đối chiếu chéo toàn bộ 6 chương của `AuraTune_Vision_Document.md`, phát hiện 9 điểm mâu thuẫn và thiếu nhất quán (`ERR-01` đến `ERR-08`) phân theo mức độ từ Cao đến Thấp.
- Chỉ ra các xung đột về nghiệp vụ, số liệu và phạm vi:
  - `ERR-01`: Mâu thuẫn về phạm vi tuân thủ pháp lý và bảo vệ dữ liệu cá nhân (Nghị định 13/2023/NĐ-CP) giữa Mục 3.4 (N-11), Mục 4.2 (AD-09) và Mục 6.2.
  - `ERR-02`: Lỗi cú pháp Mermaid (`<br\>`, escape ngoặc vuông `\[Notice shown\]`) và lỗi lặp từ trong Mục 4.1 và 5.3.
  - `ERR-03`: Bất nhất số lượng nhóm người dùng ở Mục 3.2 (ghi 2 nhóm nhưng liệt kê 3 nhóm: Listeners, Artists, Administrators).
  - `ERR-04`: Chưa đồng bộ quyền tải lên và quản lý Album của Artist và Administrator giữa Mục 3.2, 3.4 (N-09) và Mục 5.2 (G08, G09, G11).
  - `ERR-05`: Lệch phạm vi dữ liệu thống kê thể loại nghe nhiều nhất (`top genres`) giữa Mục 3.4 (N-07) và Mục 5.2 (G07).
  - `ERR-06` & `ERR-08`: Thiếu tài liệu tham chiếu (*Project Plan*, *Team Contract*) trong bảng ở Mục 1.4 dù có trích dẫn ở Mục 3, 4, 5; tóm tắt thiếu cấu trúc Chương 1 ở Mục 1.3.
  - `ERR-07` & `ERR-09`: Bất đồng bộ tên gọi và mã định danh 12 nhóm tính năng (`G01`–`G12`) giữa bảng Mục 3.4 và Mục 5.1; khác biệt nhỏ về thể thức đánh số tiêu đề và chính tả Anh-Anh / Anh-Mỹ.
- Cung cấp các đoạn văn bản viết lại cho từng mục lỗi và lập bảng quy chuẩn thuật ngữ để chuẩn hóa tên vai trò, đối tượng và tính năng.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do |
| ---- | ---------- | ------|
| `ERR-01`: Đồng bộ phạm vi bảo vệ dữ liệu (N-11, AD-09, Mục 6.2) | Dùng | Đảm bảo tính nhất quán về mặt pháp lý (Nghị định 13/2023/NĐ-CP) và cam kết ẩn danh dữ liệu gửi sang AI trong phạm vi học thuật. |
| `ERR-03`: Sửa số lượng nhóm người dùng tại Mục 3.2 | Dùng | Khớp số đếm ("three primary user groups") với 3 vai trò thực tế được liệt kê xuyên suốt Mục 3, 4 và 5. |
| `ERR-04`: Làm rõ quyền quản lý Album ở N-09, G09 và G11 | Dùng | Đảm bảo logic nghiệp vụ chặt chẽ giữa mô tả vai trò Artist/Administrator ở Mục 3.2 và chi tiết tính năng ở Mục 5.2. |
| `ERR-05`: Bổ sung thống kê `genres` vào mô tả G07 (Mục 5.2) | Dùng | Đồng bộ đầu ra thống kê của G07 với nhu cầu N-07 (Mục 3.4) và nguồn dữ liệu đầu vào của G10 (AI Recommendations). |
| `ERR-06` & `ERR-08`: Cập nhật Mục 1.3 và bảng References ở Mục 1.4 | Dùng | Khai báo đầy đủ *Project Plan (SPMP)* và *Team Contract* đã được viện dẫn trong bài; mô tả đủ các mục con của Chương 1. |
| `ERR-07`: Chuẩn hóa cột *Related feature* (Mục 3.4) theo mã G01–G12 | Dùng  | Giúp truy vết trực tiếp và chính xác từ từng Nhu cầu (N-01..N-12) sang đúng Mã tính năng (G01..G12) ở Mục 5.1 và Project Plan. |
| `ERR-02`: Sửa cú pháp sơ đồ Mermaid và lỗi lặp từ (Mục 4.1, 5.3) | Bỏ  | Cú pháp bị nhận định sai, sơ đồ bằng mermaid trong tài liệu đã được viết đúng |
| `ERR-09`: Chuẩn hóa dấu chấm tiêu đề và chính tả Anh-Anh / Anh-Mỹ  | Bỏ | Lỗi thể thức mức độ thấp, không ảnh hưởng đến tính đúng đắn về nghiệp vụ và phạm vi kỹ thuật của tài liệu. |

### Cách kiểm chứng

- Đối chiếu với tài liệu chính thức và yêu cầu dự án (`Project Proposal - PA1`, `Existing Application Survey - PA1`, `Project Plan - PA2`, `Team Contract`).
- Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (kiểm tra chéo sự khớp nối giữa các bảng N-01..N-12, AD-01..AD-10 và G01..G12).
- Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt sau khi chỉnh sửa.

**Ghi chú:** Không chạy kiểm thử tự động vì đây là công việc rà soát và biên tập tài liệu đặc tả tầm nhìn (`AuraTune_Vision_Document.md`). Các mục `ERR-01`, `ERR-03`, `ERR-04`, `ERR-05`, `ERR-06`, `ERR-07`, `ERR-08` đã được cập nhật và kiểm tra chéo hoàn tất trong tài liệu gốc.