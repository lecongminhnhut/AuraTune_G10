# Nhật ký sử dụng AI

| # | Ngày | Nội dung | Nhóm |
|---|---|---|---|
| 1   | 2026-10-24 | Rà soát chéo, phát hiện mâu thuẫn và đề xuất chuẩn hóa cho tài liệu `AuraTune_Vision_Document.md` | doc   |
| 2 | 2026-10-28 | Viết spec 031 – Metadata Search bằng `/speckit-specify` | 030 |
| 3 | 2026-10-28 | Làm rõ spec 031 bằng `$speckit-clarify` – phân trang, giới hạn từ khóa, cơ chế matching và xử lý xung đột filter | 030 |
| 4 | 2026-10-29 | Viết spec 032 – AI Lyrics Search bằng `/speckit-specify` | 030 |
| 5 | 2026-10-29 | Làm rõ spec 032 bằng `/speckit-clarify` – giới hạn đầu vào, xử lý timeout, UI/UX fallback và xung đột luồng | 030 |
| 6   | 2026-10-29 | Viết spec 033 – Semantic Vector Music Search bằng `$speckit-specify`   | 030   |
| 7   | 2026-10-29 | Làm rõ spec 033 bằng `$speckit-clarify` – ranking, audio fields, privacy, thresholds và metrics | 030   |
| 8 | 2026-10-30 | Viết spec 081 – Album Details bằng `/speckit-specify` | 080 |
| 9 | 2026-10-30 | Làm rõ spec 081 bằng `/speckit-clarify` – xử lý danh sách bài hát lớn, album nhiều đĩa, ký hiệu thiếu dữ liệu, ảnh bìa mặc định và cơ chế cache | 080 |
| 10 | 2026-10-30 | Viết spec 082 – Album Tracklist Playback bằng `/speckit-specify` | 080 |
| 11 | 2026-10-30 | Làm rõ spec 082 bằng `$speckit-clarify` – hành vi queue, chế độ shuffle, track không khả dụng, chống trùng lặp và phân trang | 080 |
| 12 | 2026-10-30 | Viết spec 083 – Save and Share Album bằng `/speckit-specify` | 080 | 
| 13 | 2026-10-30 | Làm rõ spec 083 bằng `/speckit-clarify` – UI/UX loading, lỗi, nút share và quota | 080 | 
| 14 | 2026-10-30 | Làm rõ spec 083 (bổ sung) bằng `/speckit-clarify` – Hành vi bỏ lưu trong thư viện | 080 |
| 15 | 2026-11-04 | Kiểm tra và đề xuất chỉnh sửa tài liệu Use-Case Group 030 | 03 Search |
| 16 | 2026-11-04 | Kiểm tra và đề xuất chỉnh sửa tài liệu Use-Case Group 080 | 08 Album Interaction |
| 17 | 2026-11-07 | Lập Implementation Plan cho spec 031 bằng Spec Kit | 030 Search |
| 18 | 2026-11-07 | Lập Implementation Plan cho spec 032 bằng Spec Kit | 030 Search |
| 19 | 2026-11-07 | Lập Implementation Plan cho spec 033 bằng Spec Kit | 030 Search |
| 20 | 2026-11-07 | Lập Implementation Plan cho spec 081 bằng Spec Kit | 08 Album Interaction |
| 21 | 2026-11-07 | Lập Implementation Plan cho spec 082 bằng Spec Kit | 08 Album Interaction |
| 22 | 2026-11-07 | Lập Implementation Plan cho spec 083 bằng Spec Kit | 08 Album Interaction |
| 23 | 2026-11-07 | Làm rõ rủi ro kỹ thuật cho Implementation Plan (Feature 081) | 08 Album Interaction |
| 24 | 2026-11-07 | Làm rõ rủi ro kỹ thuật cho Implementation Plan (Feature 082) | 08 Album Interaction |
| 25 | 2026-11-07 | Làm rõ rủi ro kỹ thuật cho Implementation Plan (Feature 083) | 08 Album Interaction |
| 26 | 2026-11-08 | Phân rã công việc (Task Breakdown) cho spec 031 bằng Spec Kit bằng `/speckit-tasks` |
| 27 | 2026-11-08 | Phân rã công việc (Task Breakdown) cho spec 032 bằng Spec Kit bằng `/speckit-tasks` | 030 Search |
| 28 | 2026-11-08 | Phân rã công việc (Task Breakdown) cho spec 033 bằng Spec Kit bằng `/speckit-tasks` | 030 Search |

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

## Mục 2: Viết spec 031 – Metadata Search

| Trường | Nội dung |
|---|---|
| Ngày | 2026-10-28 |
| Người thực hiện | Nguyễn Khánh Đăng |
| Nhóm tính năng liên quan | 030 – Search, Feature 031: Metadata Search (`specs/030-search/031-metadata-search`) |
| Công cụ AI | Codex, lệnh `/speckit-specify` |
| Mục đích | Tạo tài liệu đặc tả nghiệp vụ (spec) ban đầu cho tính năng tìm kiếm siêu dữ liệu, thiết lập phạm vi chức năng, các tiêu chí chấp nhận và hợp đồng API cơ bản. |

### Prompt đã dùng

```text
/speckit-specify
Đặc tả tính năng tìm kiếm metadata (031-metadata-search) cho AuraTune.
Yêu cầu cụ thể:
1. Người dùng (Public/Listener) có thể tìm kiếm bài hát, nghệ sĩ, album và playlist bằng từ khóa văn bản (title, artist, album name, playlist name).
2. Cần có cơ chế lọc (filter) và sắp xếp (sort) kết quả tìm kiếm.
3. Tuân thủ API Contract: GET /search với các query q, type, limit.
4. Tiêu chí chấp nhận:
- Trả về danh sách kết quả chính xác theo từ khóa.
- Xử lý mượt mà kịch bản không tìm thấy kết quả hoặc lỗi kết nối.
CRITICAL REQUIREMENT: Toàn bộ tài liệu đặc tả được sinh ra BẮT BUỘC phải viết hoàn toàn bằng tiếng Anh. Tuân thủ phạm vi của dự án (proposal.md) và không tự thêm các quyết định kỹ thuật chưa được duyệt.
```

### Tóm tắt phản hồi của AI

- Khởi tạo thành công thư mục cấu trúc và sinh ra 3 file: `spec.md`, `requirements.md` (checklist), và `feature.json`.
- Tài liệu được viết 100% bằng tiếng Anh, tuân thủ chặt chẽ yêu cầu `CRITICAL REQUIREMENT`.
- Tích hợp đúng Hợp đồng API (`GET /search?q&type&limit`) và các đối tượng tìm kiếm cơ bản (song, artist, album, playlist).
- Checklist ban đầu đã đạt đầy đủ các tiêu chí (passing). AI không tự ý thêm thắt các chi tiết kỹ thuật chuyên sâu về filter/sort mà để mở để chốt ở bước sau.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do |
|---|---|---|
| Ngôn ngữ tài liệu (Tiếng Anh) | Dùng | Đảm bảo tính chuyên nghiệp và tuân thủ yêu cầu bắt buộc của dự án. |
| API Contract (`q`, `type`, `limit`) | Dùng | Khớp hoàn toàn với tài liệu thiết kế hệ thống và API endpoint đã duyệt. |
| Cơ chế Filter/Sort | Dùng dạng khái quát | Chỉ ghi nhận yêu cầu tính năng vào User Story chứ không tự chế ra tham số cụ thể (tránh vượt quyền quyết định kỹ thuật). |
| Kịch bản lỗi (Empty/Error states) | Dùng | Đã được định nghĩa rõ ràng trong phần Edge Cases và User Story, giúp tăng chất lượng UX. |

### Cách kiểm chứng

- Đối chiếu với tài liệu chính thức (proposal.md) và yêu cầu dự án.
- Kiểm tra tính đúng đắn của các file được sinh ra (`spec.md`, `requirements.md`, `feature.json`).
- Xác nhận checklist đạt chuẩn ban đầu, sẵn sàng cho bước làm rõ (clarify) hoặc lập kế hoạch (plan).

**Kết quả kiểm chứng:** Đạt. 

**Ghi chú:** Đặc tả ban đầu bám rất sát Proposal, tạo tiền đề tốt để thực hiện tiếp bước làm rõ các chi tiết về phân trang và matching rules.

---

## Mục 3: Làm rõ spec 031 – Metadata Search

| Trường | Nội dung |
|---|---|
| Ngày | 2026-10-28 |
| Người thực hiện | Nguyễn Khánh Đăng |
| Nhóm tính năng liên quan | 030 – Search, Feature 031: Metadata Search |
| Công cụ AI | Codex (GPT-5.6-Luna), lệnh `$speckit-clarify` |
| Mục đích | Làm rõ các ràng buộc kỹ thuật, cơ chế phân trang API, xử lý đầu vào từ khóa và luồng UI/UX của bộ lọc. |

### Prompt đã dùng

```text
speckit-clarify Làm rõ các vấn đề sau giúp tôi:
Spec có nhắc đến tham số limit nhưng chưa đề cập đến cách lấy các trang kết quả tiếp theo.
- Giao diện sẽ sử dụng phân trang (Pagination) truyền thống, nút "Tải thêm" (Load More), hay Cuộn vô hạn (Infinite Scroll)?
- API GET /search sẽ sử dụng cơ chế nào để phân trang: offset, page, hay cursor? Cần bổ sung tham số này vào FR-004 và FR-005.
- Độ dài tối đa (max length) cho phép của chuỗi từ khóa q là bao nhiêu để ngăn chặn lỗi URL / DDoS (ví dụ: 100 ký tự)?
- Cần xác định rõ kỳ vọng của người dùng về độ chính xác của từ khóa.
- Minimum Length: Người dùng cần nhập tối thiểu bao nhiêu ký tự thì hệ thống mới bắt đầu gọi API (ví dụ: 2 ký tự)?
- Diacritics & Case-sensitivity: Việc tìm kiếm có phân biệt chữ hoa/chữ thường và dấu câu không? (Ví dụ: Nhập "Tien" có trả về "Tiến" không? "beyonce" có ra "Beyoncé" không?).
- Xung đột Filter: Nếu kết quả tìm kiếm hiện tại chỉ có "Bài hát", nhưng người dùng lại click vào filter "Năm phát hành của Album", UI sẽ tự động reset filter, ẩn filter đi, hay hiển thị trạng thái "Không có kết quả"?
- CRITICAL REQUIREMENT: Toàn bộ tài liệu đặc tả được sinh ra BẮT BUỘC phải viết hoàn toàn bằng tiếng Anh. Tuân thủ phạm vi của dự án (proposal.md) và không tự thêm các quyết định kỹ thuật chưa được duyệt.
```

### Tóm tắt phản hồi của AI

- Mở một "Clarification Session" với 5 câu hỏi trắc nghiệm tập trung vào các điểm mù của đặc tả.
- Ghi nhận và tự động cập nhật các quyết định vào file `spec.md` (duy trì 100% bằng tiếng Anh) ngay sau mỗi lựa chọn.
- Chốt cơ chế phân trang sử dụng nút "Load More" với `offset` và `limit` thay vì dùng cursor phức tạp.
- Thiết lập giới hạn chiều dài từ khóa `q` (tối đa 100 ký tự, tối thiểu 2 ký tự).
- Chốt cơ chế khớp chuỗi (matching): không phân biệt chữ hoa/thường (case-insensitive), bỏ qua dấu (diacritics) và dấu câu (punctuation).
- Xử lý xung đột UI bằng cách tự động ẩn các filter không tương thích.
- Cập nhật các yêu cầu chức năng (FR-002 đến FR-011) tương ứng. Hoàn thành toàn bộ Checklist (16/16 passing).

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do |
|---|---|---|
| Phân trang (Load More, `offset` + `limit`) | Dùng | Đơn giản, giữ nguyên được API contract `limit` hiện tại, tránh phát sinh chi phí quản lý cursor. |
| Giới hạn từ khóa (Max 100, Min 2 ký tự) | Dùng | Ngăn chặn spam URL dài, giảm tải request rác cho server, API testable hơn. |
| Matching (Bỏ qua dấu, chữ hoa/thường) | Dùng | Tối ưu trải nghiệm, giúp người dùng dễ dàng tìm kiếm (vd: "Beyoncé" bằng "beyonce"). |
| Giải quyết xung đột Filter (Ẩn filter) | Dùng | Ngăn người dùng rơi vào trạng thái "No results" bất ngờ, giữ giao diện gọn gàng. |
| Ngôn ngữ đặc tả (Tiếng Anh) | Dùng | Đảm bảo tính nhất quán của hệ thống tài liệu dự án. |

### Cách kiểm chứng

- Kiểm tra file `spec.md`, các yêu cầu chức năng từ `FR-002` đến `FR-011` đã được AI bổ sung đầy đủ và cover các cases đã chốt.
- File `requirements.md` đã cập nhật đạt chỉ tiêu 16/16.
- Xác nhận không có sai lệch (regression) so với tài liệu thiết kế ban đầu.

**Kết quả kiểm chứng:** Đạt.

## Mục 4: Viết spec 032 – AI Lyrics Search

| Trường | Nội dung |
|---|---|
| Ngày | 2026-10-29 |
| Người thực hiện | Nguyễn Khánh Đăng |
| Nhóm tính năng liên quan | 030 – Search, Feature 032: AI Lyrics Search (`specs/030-search/032-ai-lyrics-search`) |
| Công cụ AI | Codex, lệnh `/speckit-specify` |
| Mục đích | Tạo tài liệu đặc tả nghiệp vụ (spec) ban đầu cho tính năng tìm kiếm bằng lời bài hát AI, xử lý kịch bản fallback khi AI Service gặp lỗi 503 hoặc timeout. |

### Prompt đã dùng

```text
/speckit-specify Đặc tả tính năng tìm kiếm bằng lời bài hát AI (032-ai-lyrics-search) cho AuraTune.
Yêu cầu cụ thể:
1. Người dùng có thể tìm bài hát thông qua các đoạn lời bài hát (lyrics fragment) mà họ nhớ.
​2. Hệ thống gọi qua AI Service (POST /ai/search/lyrics) để phân tích ngữ nghĩa và match với dữ liệu lời bài hát.
3. Xử lý kịch bản fallback: Nếu AI Service quá tải hoặc timeout (lỗi 503), hệ thống tự động chuyển về tìm kiếm văn bản cơ bản (keyword search) và hiển thị thông báo cho người dùng.
4. Tiêu chí chấp nhận:
- Tìm chính xác bài hát dù người dùng chỉ nhập một đoạn lời không hoàn chỉnh.
- Xử lý lỗi 503 mượt mà theo đúng API contract.
CRITICAL REQUIREMENT: Mặc dù prompt này được viết bằng tiếng Việt, toàn bộ tài liệu đặc tả được sinh ra BẮT BUỘC phải viết hoàn toàn bằng tiếng Anh. Tuân thủ proposal.md và speckit-workflow-guide.md.
```

### Tóm tắt phản hồi của AI

- Khởi tạo cấu trúc tính năng với `spec.md`, `requirements.md` (checklist 16/16 passing), và `feature.json`.
- Tài liệu được sinh ra 100% bằng tiếng Anh, đáp ứng đúng yêu cầu `CRITICAL REQUIREMENT`.
- Tích hợp chuẩn xác logic gọi API `POST /ai/search/lyrics`, tìm kiếm ngữ nghĩa, và luồng fallback keyword search khi HTTP 503/timeout xảy ra.
- Xác định rõ các acceptance scenarios, states trống/lỗi, và yêu cầu bảo vệ quyền riêng tư người dùng.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do |
|---|---|---|
| Ngôn ngữ tài liệu (Tiếng Anh) | Dùng | Đảm bảo tính chuyên nghiệp, đồng bộ dự án và tuân thủ `speckit-workflow-guide.md`. |
| API Contract (`POST /ai/search/lyrics`) | Dùng | Khớp với thiết kế API đã duyệt cho truy vấn ngữ nghĩa AI. |
| Fallback Logic (503/Timeout) | Dùng | Giữ cho hành trình trải nghiệm của người dùng không bị gián đoạn khi AI quá tải. |

### Cách kiểm chứng

- Đối chiếu tài liệu sinh ra (`spec.md`, `requirements.md`) với yêu cầu ban đầu.
- Xác nhận trạng thái checklist đạt đầy đủ, không còn tag `[NEEDS CLARIFICATION]`.
- **Kết quả kiểm chứng:** Đạt, sẵn sàng chuyển sang bước clarify.

---

## Mục 5: Làm rõ spec 032 – AI Lyrics Search

| Trường | Nội dung |
|---|---|
| Ngày | 2026-10-29 |
| Người thực hiện | Nguyễn Khánh Đăng |
| Nhóm tính năng liên quan | 030 – Search, Feature 032: AI Lyrics Search |
| Công cụ AI | Codex, lệnh `/speckit-clarify` |
| Mục đích | Giải quyết các điểm mơ hồ về giới hạn đầu vào, ngưỡng thời gian timeout, UI/UX thông báo dự phòng, và các kịch bản ngoại lệ (429, Race condition). |

### Prompt đã dùng

```text
/speckit-clarify 
Làm rõ các vấn đề sau:
1. Các giới hạn và ngưỡng định lượng (Thresholds & Limits)

- Thời gian Timeout chưa xác định: Các yêu cầu (FR-008) và Tiêu chí (SC-003) nhắc đến việc "hết thời gian phản hồi (timeout)" nhưng không quy định rõ timeout là bao nhiêu giây (ví dụ: 3s, 5s hay 10s).
- Độ dài truy vấn tối thiểu/tối đa:
- Ở phần Edge Cases có nhắc đến "Đoạn lời quá ngắn..." nhưng không định nghĩa rõ bao nhiêu ký tự/từ là quá ngắn để chặn tìm kiếm.
- Tương tự, "dài hơn giới hạn đầu vào được hỗ trợ" cũng không nêu rõ giới hạn này là bao nhiêu ký tự (ví dụ: tối đa 200 ký tự hay 500 ký tự).
2. Giao diện và Trải nghiệm Người dùng (UI/UX)
- Vị trí và tính chất của "Thông báo dự phòng": Yêu cầu (FR-010, FR-011) quy định phải có "thông báo rõ ràng" khi dùng tìm kiếm từ khóa thay cho AI. Tuy nhiên, spec chưa làm rõ thông báo này hiển thị dưới dạng nào (Toast message, Banner, Text inline trên kết quả), thời gian hiển thị bao lâu, và người dùng có thể bấm tắt (dismiss) được không.
- Xử lý phân trang/Số lượng kết quả: Spec không đề cập đến việc nếu có quá nhiều kết quả khớp thì sẽ hiển thị tối đa bao nhiêu bài hát trên một trang, và có hỗ trợ cuộn vô hạn (infinite scroll) hay phân trang (pagination) hay không.
- Phản hồi lỗi đầu vào (FR-013): Khi người dùng nhập khoảng trắng hoặc không hợp lệ, "phản hồi đầu vào rõ ràng" là thông báo lỗi tại chỗ (inline validation) chặn nút Search, hay là gửi đi rồi mới trả về lỗi popup?
3. Logic và Thuật toán Tìm kiếm

- Định nghĩa sự "khác biệt thông thường": User Story 1 đề cập hệ thống xử lý được "sự khác biệt thông thường về khoảng trắng, viết hoa hoặc dấu câu". Vậy hệ thống có hỗ trợ lỗi sai chính tả (typos), từ viết tắt, hay tiếng lóng không?
- Phạm vi của "Tìm kiếm từ khóa cơ bản" (Fallback): Khi chuyển sang tìm kiếm từ khóa dự phòng, hệ thống chỉ tìm đúng (exact match) cụm từ đó trong trường `lyrics`, hay có tìm trong cả `title` (tiêu đề) và `artist` (nghệ sĩ) không?
- Tiêu chí xếp hạng "phù hợp nhất" (Relevance): Kịch bản nghiệm thu 3 của User Story 1 yêu cầu kết quả sắp xếp để "người dùng nhận diện bài hát phù hợp nhất trước tiên". Tuy nhiên, tiêu chí nào để đánh giá độ phù hợp (điểm semantic score, số lượt nghe của bài hát, hay độ dài đoạn khớp)?
4. Xử lý các Edge Cases đặc thù
- Rate Limiting (Giới hạn tỷ lệ gửi): Nếu người dùng spam nút tìm kiếm liên tục, hệ thống xử lý chặn luồng (debounce/throttle) ở phía Client hay đợi server trả về lỗi 429 (Too Many Requests)? Spec có nhắc đến 503 nhưng chưa thấy đề cập đến 429.
- Race Condition (Xung đột trạng thái): Ở Edge Cases có ghi "Người dùng gửi truy vấn mới trong khi tìm kiếm trước đó đang tải". Hệ thống sẽ hủy (abort) yêu cầu trước đó, hay vẫn để chạy ngầm và bỏ qua kết quả trả về chậm?
CRITICAL REQUIREMENT: Mặc dù prompt này được viết bằng tiếng Việt, toàn bộ tài liệu đặc tả được sinh ra BẮT BUỘC phải viết hoàn toàn bằng tiếng Anh. Tuân thủ proposal.md và speckit-workflow-guide.md
```

### Tóm tắt phản hồi của AI

- Đã hỏi và tích hợp thành công 5/5 quyết định vào tài liệu `spec.md` (giữ nguyên tiếng Anh).
- **Chốt các giới hạn định lượng:** Đặt timeout AI là 5 giây; giới hạn truy vấn tối thiểu 3 từ và tối đa 200 ký tự.
- **Chốt quy tắc hiển thị (UI/UX):** Thông báo fallback dùng dismissible inline banner ở trên cùng tập kết quả; phân trang 20 bài hát/trang.
- **Chốt thuật toán Fallback:** Chỉ tìm kiếm từ khóa trong trường lyrics đã được chuẩn hóa (normalized lyrics), ưu tiên exact phrase.
- **Chốt Edge Cases:** Lỗi HTTP 429 hiển thị thông báo lỗi retryable (không kích hoạt fallback); xử lý race condition bằng cách lấy truy vấn mới nhất làm authoritative (bỏ qua response cũ).
- Cập nhật checklist đạt chuẩn 16/16.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do |
|---|---|---|
| Timeout 5s & Giới hạn Input | Dùng | Đủ thời gian cho AI xử lý mà không làm người dùng chờ lâu; ngăn chặn payload lớn làm sập server. |
| Fallback Banner (Dismissible) | Dùng | Cung cấp thông tin minh bạch về việc hạ cấp tìm kiếm nhưng không gây gián đoạn luồng hiển thị kết quả. |
| Cơ chế lỗi 429 và Race Condition | Dùng | Phân định rõ ràng lỗi spam/rate limit với lỗi sập hệ thống (503), giải quyết triệt để lỗi hiển thị chéo kết quả cũ-mới. |
| Ngôn ngữ đặc tả (Tiếng Anh) | Dùng | Đảm bảo tính nhất quán của hệ thống tài liệu dự án theo CRITICAL REQUIREMENT. |

### Cách kiểm chứng

- Kiểm tra file `spec.md`, các giới hạn như `5 seconds timeout`, `3 words min`, `200 chars max` đã được bổ sung rõ ràng vào phần yêu cầu chức năng.
- Xác nhận logic UI cho Fallback Notice và 429 Rate Limit đã có mặt trong tài liệu.
- **Kết quả kiểm chứng:** Đạt. Sẵn sàng cho bước kế tiếp (`$speckit-plan`).

## Mục 6: Viết spec 033 – Semantic Vector Music Search

| Trường | Nội dung        |
| ------ | --------------- |
| Ngày   | 2026-10-29      |
| Người thực hiện        | Nguyễn Khánh Đăng  |
| Nhóm tính năng liên quan | 030 – Search, Feature 033: Semantic Vector Music Search (`specs/030-search/033-semantic-vector-search`) |
| Công cụ AI               | Gemini, `$speckit-specify`      |
| Mục đích                 | Tạo đặc tả nghiệp vụ (bằng tiếng Anh) cho tính năng tìm kiếm nhạc ngữ nghĩa; đảm bảo quy tắc an toàn dữ liệu cá nhân (tên, email) và xử lý dự phòng (fallback) khi AI service lỗi.       |

### Prompt đã dùng

```text
/speckit-specify

Đặc tả tính năng tìm kiếm ngữ nghĩa bằng Vector (033-semantic-vector-search) cho AuraTune.
Yêu cầu cụ thể:
1. Cho phép người dùng tìm kiếm nhạc dựa trên mô tả cảm xúc, ngữ cảnh hoặc tâm trạng (ví dụ: "nhạc buồn cho đêm mưa").
​2. Tính năng sử dụng LLM và Vector Database để phân tích embedding từ metadata, lyrics và audio features, sau đó đối chiếu không gian vector để trả về kết quả.
3. Đảm bảo dữ liệu cá nhân (tên, email) không bao giờ được gửi sang third-party AI services để bảo mật.
4. Xử lý kịch bản fallback về keyword search nếu AI Service không khả dụng.

CRITICAL REQUIREMENT: Mặc dù prompt này được viết bằng tiếng Việt, toàn bộ tài liệu đặc tả được sinh ra BẮT BUỘC phải viết hoàn toàn bằng tiếng Anh. Tuân thủ ranh giới hệ thống, không tự quyết định framework/DB chi tiết nếu chưa có trong kiến trúc.
Đã hoàn tất đặc tả feature 033-semantic-vector-search.
- Spec: [spec.md](C:/Users/Admin/OneDrive/Máy tính/AuraTune_G10/specs/030-search/033-semantic-vector-search/spec.md)
- Checklist: [requirements.md](C:/Users/Admin/OneDrive/Máy tính/AuraTune_G10/specs/030-search/033-semantic-vector-search/checklists/requirements.md)
- Đã cập nhật .specify/feature.json trỏ đến feature này.
- Checklist đạt toàn bộ tiêu chí; không còn marker cần làm rõ.
- Sẵn sàng cho bước $speckit-plan.
```

### Tóm tắt phản hồi của AI

- Tạo thành công tài liệu đặc tả `spec.md` và `requirements.md` đáp ứng tiêu chí CRITICAL REQUIREMENT (100% tiếng Anh).
- Cấu trúc đầy đủ: User Stories, Functional Requirements, Edge Cases, Key Entities và Success Criteria.
- Phân tích và liệt kê chi tiết các điểm cần làm rõ (NEEDS CLARIFICATION) chia làm 4 nhóm: Logic thuật toán, Xử lý ngôn ngữ và quyền riêng tư, Giới hạn hệ thống (UX), và Đánh giá kết quả.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do |
| ---- | ---------- | ----- |
| Spec 100% tiếng Anh | Dùng | Đáp ứng đúng ràng buộc đặc tả kỹ thuật của dự án dù prompt nhập bằng tiếng Việt. |
| Fallback keyword search | Dùng | Đảm bảo tính sẵn sàng của luồng cốt lõi (tìm kiếm) khi third-party AI gặp sự cố. |
| Các điểm cần làm rõ (Clarification markers) | Dùng (sẽ làm rõ tiếp) | Tài liệu ban đầu cần bổ sung tham số định lượng cụ thể để Engineering và Design có thể làm việc. |

### Cách kiểm chứng

- [x] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt, chuyển tiếp sang bước làm rõ.

**Ghi chú:** Spec nằm tại `specs/030-search/033-semantic-vector-search/spec.md`; checklist nằm trong thư mục `checklists/`.

---

## Mục 7: Làm rõ spec 033 – `$speckit-clarify`

| Trường | Nội dung |
| ------ | -------- |
| Ngày   | 2026-10-29  |
| Người thực hiện   | Nguyễn Khánh Đăng |
| Nhóm tính năng liên quan | 030 – Search, Feature 033: Semantic Vector Music Search |
| Công cụ AI | Gemini, `$speckit-clarify` |
| Mục đích | Trả lời 5 câu hỏi trọng tâm để chốt tham số kỹ thuật, quy tắc quyền riêng tư và công thức xếp hạng, qua đó loại bỏ toàn bộ `[NEEDS CLARIFICATION]` marker. |

### Prompt đã dùng

```text
/speckit-clarify 
Làm rõ các điểm sau:
1. Về Quy tắc xử lý và Thuật toán (Logic & Algorithms)
[...] (Nội dung chi tiết 4 nhóm vấn đề)
CRITICAL REQUIREMENT: Mặc dù prompt này được viết bằng tiếng Việt, toàn bộ tài liệu đặc tả được sinh ra BẮT BUỘC phải viết hoàn toàn bằng tiếng Anh. Tuân thủ ranh giới hệ thống, không tự quyết định framework/DB chi tiết nếu chưa có trong kiến trúc.
```

### Tóm tắt phản hồi của AI

- Hỏi tuần tự 5 câu hỏi theo hình thức trắc nghiệm có phương án đề xuất (Option A).
- Chốt thuật toán ranking: sử dụng weighted ensemble (metadata 30%, lyrics 40%, audio 30%).
- Chốt danh sách audio fields: đầy đủ 13 trường (tempo, key, mode, energy, valence, danceability, acousticness, instrumentalness, speechiness, loudness, liveness, time signature, duration).
- Chốt cơ chế bảo mật PII: Phát hiện cục bộ tên/email, giữ lại tên nghệ sĩ có trong danh mục, nếu không xác định được an toàn thì dùng keyword fallback.
- Chốt giới hạn đầu vào UX: tối đa 150 ký tự, timeout 1500ms cho semantic search.
- Chốt thang đo Relevance: Thang 1-5, điểm 4-5 được tính là đạt.
- Cập nhật trực tiếp `spec.md` và xóa toàn bộ các marker cần làm rõ, nâng điểm checklist lên 16/16.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần  | Quyết định | Lý do |
| ----- | ---------- | ----- |
| Trọng số xếp hạng 30/40/30 (Option A) | Dùng       | Cân bằng được tín hiệu từ cả ý nghĩa ca từ lẫn cảm giác âm nhạc, xử lý tốt khi dữ liệu bài hát bị khuyết. |
| Full 13 Audio fields (Option A) | Dùng       | Độ bao phủ rộng, định nghĩa chính xác "musical feel" mà không bị phụ thuộc vào 1 vector DB cụ thể. |
| PII Detection & Artist retention (Option A) | Dùng       | Bảo vệ nghiêm ngặt quyền riêng tư nhưng không làm hỏng trải nghiệm tìm kiếm hợp lệ (ví dụ tìm tên ca sĩ). |
| Giới hạn 150 chars & 1.5s timeout (Option A) | Dùng | Ngăn chặn lạm dụng độ dài truy vấn và giúp hệ thống nhảy sang keyword fallback đủ nhanh để không làm phiền người dùng. |
| Thang đánh giá 1-5 (Option A) | Dùng | Phù hợp với tính chủ quan của âm nhạc, linh hoạt hơn việc đánh giá nhị phân. |

### Cách kiểm chứng

- [x] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt. Checklist đạt 16/16 mục.

**Ghi chú:** Do giới hạn 5 câu hỏi của phiên clarify, một số điểm nhỏ (như định nghĩa chi tiết duplicate, tiêu chí unsafe AI response, bộ trường hiển thị) đã được deferred và sẽ được xử lý ở giai đoạn Architecture/Design.

## Mục 8: Viết spec 081 – Album Details

| Trường | Nội dung |
|---|---|
| Ngày | 2026-10-30 |
| Người thực hiện | Nguyễn Khánh Đăng |
| Nhóm tính năng liên quan | 080 – Album Interaction, Feature 081: Album Details (`specs/080-album-interaction/081-album-details`) |
| Công cụ AI | Gemini, lệnh `/speckit-specify` |
| Mục đích | Tạo tài liệu đặc tả nghiệp vụ (spec) ban đầu cho tính năng xem chi tiết Album, bao gồm thông tin chung (ảnh bìa, nghệ sĩ, năm, thời lượng), danh sách bài hát với lượt nghe, và các trạng thái loading/lỗi. |

### Prompt đã dùng

```text
/speckit-specify
Đặc tả tính năng xem chi tiết Album (081-album-details) cho AuraTune.
Yêu cầu cụ thể:
1. Người dùng có thể xem các thông tin chi tiết của một album bao gồm: ảnh bìa (cover art), tên nghệ sĩ, năm phát hành, và tổng thời lượng.
2. Giao diện cần hiển thị số lượt nghe (play count) tương ứng cho từng bài hát trong album.
3. Tuân thủ API Contract: GET /albums/:id.
4. Tiêu chí chấp nhận:
- Load đầy đủ thông tin metadata của album từ database.
- Hiển thị đúng định dạng thời gian và lượt nghe.
CRITICAL REQUIREMENT: Mặc dù prompt này được viết bằng tiếng Việt, toàn bộ tài liệu đặc tả được sinh ra BẮT BUỘC phải viết hoàn toàn bằng tiếng Anh. Tập trung vào kịch bản sử dụng và yêu cầu nghiệp vụ, không ghi chi tiết code.
```

### Tóm tắt phản hồi của AI

- Khởi tạo thành công cấu trúc thư mục và sinh ra 3 file: `spec.md`, `requirements.md` (checklist), và `feature.json`.
- Tài liệu được viết 100% bằng tiếng Anh, tuân thủ chặt chẽ `CRITICAL REQUIREMENT`.
- Tích hợp đúng Hợp đồng API (`GET /albums/:id`) để lấy metadata và danh sách bài hát (track list).
- Đã quy định rõ cách định dạng thời lượng (`m:ss` hoặc `h:mm:ss`) và số lượt nghe.
- Checklist ban đầu đạt 16/16. Tuy nhiên, AI để mở một số quyết định kỹ thuật chuyên sâu (phân trang, multi-disc, cache) để làm rõ ở bước sau.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do |
|---|---|---|
| Ngôn ngữ tài liệu (Tiếng Anh) | Dùng | Đảm bảo tính chuyên nghiệp và tuân thủ yêu cầu bắt buộc của dự án. |
| API Contract (`GET /albums/:id`) | Dùng | Khớp hoàn toàn với API endpoint đã duyệt cho việc lấy chi tiết album. |
| Kịch bản lỗi (Not-found/Error/Empty states) | Dùng | Định nghĩa rõ ràng trạng thái UI, giúp tăng chất lượng trải nghiệm người dùng (UX). |

### Cách kiểm chứng

- [x] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt. 

**Ghi chú:** Đặc tả ban đầu bám sát hợp đồng API, tạo tiền đề tốt để thực hiện tiếp bước làm rõ (clarify) các chi tiết về UI/UX và logic xử lý dữ liệu.

---

## Mục 9: Làm rõ spec 081 – Album Details

| Trường | Nội dung |
|---|---|
| Ngày | 2026-10-30 |
| Người thực hiện | Nguyễn Khánh Đăng |
| Nhóm tính năng liên quan | 080 – Album Interaction, Feature 081: Album Details |
| Công cụ AI | Gemini, lệnh `/speckit-clarify` |
| Mục đích | Giải quyết 5 điểm mơ hồ về cách load danh sách bài hát lớn, hiển thị album có nhiều đĩa, quy ước ký hiệu khi thiếu dữ liệu, hiển thị placeholder ảnh bìa và cơ chế cache khi điều hướng (Back). |

### Prompt đã dùng

```text
/speckit-clarify Làm rõ các điểm sau:
1. Xử lý danh sách bài hát lớn (Pagination / Lazy Loading)
- Điểm mơ hồ: Yêu cầu FR-005 chỉ đề cập đến việc hiển thị danh sách bài hát. Nhưng nếu một album có quá nhiều bài (ví dụ: album tổng hợp 100 bài hát), API có trả về toàn bộ trong một lần gọi không?
- Cần làm rõ: Giao diện sẽ hiển thị tất cả bài hát cùng lúc, hay cần áp dụng kỹ thuật tải lười (lazy loading) / phân trang (pagination)? Nếu tải lười, tổng thời lượng của album (FR-004) được tính dựa trên toàn bộ album (do API trả về sẵn 1 trường totalDuration) hay client phải tự cộng dồn (chỉ cộng được những bài đã tải)?
2. Cấu trúc Album có nhiều đĩa (Multi-disc Albums)
- Điểm mơ hồ: Một số album vật lý (và trên các nền tảng nhạc) được chia thành Disc 1, Disc 2.
- Cần làm rõ: API có trả về thông tin disc_number không? Nếu có, giao diện có cần nhóm các bài hát theo từng đĩa (chia section) không, hay cứ hiển thị một danh sách phẳng duy nhất theo thứ tự mảng trả về?
3. Hiển thị cụ thể cho trạng thái "Không khả dụng" (Unavailable UI)
- Điểm mơ hồ: FR-009 yêu cầu phải phân biệt rõ giá trị bằng 0 và giá trị "không khả dụng", nhưng lại không quy định cụ thể giao diện sẽ trông như thế nào.
- Cần làm rõ: Nếu số lượt nghe hoặc thời lượng không có sẵn, UI sẽ hiển thị dấu gạch ngang (-), chữ N/A, hay bỏ trống khu vực đó? Việc chốt trước ký hiệu này sẽ giúp UI/UX nhất quán hơn.
4. Ảnh bìa mặc định (Fallback / Placeholder Image)
- Điểm mơ hồ:*Câu chuyện người dùng 3 đề cập đến việc "ảnh bìa bị thiếu thì các thông tin khác vẫn hiển thị không làm hỏng trang".
- Cần làm rõ: Giao diện có cần một ảnh "placeholder" (ảnh mặc định của hệ thống / icon nốt nhạc) để giữ nguyên bố cục layout không? Kích thước ảnh bìa mặc định là bao nhiêu để không làm vỡ các khoảng cách (padding/margin) của tên album và nghệ sĩ?
5. Cơ chế lưu trữ tạm (Caching) ở phía Client
- Điểm mơ hồ: Câu chuyện 1 nhắc đến việc "không hiển thị thông tin cũ" nếu điều hướng nhanh giữa các album (Race conditions).
- Cần làm rõ: Hệ thống có cho phép lưu cache dữ liệu album đã tải (ví dụ lưu trong bộ nhớ Redux/Context vài phút) để người dùng ấn nút "Back" sẽ thấy ngay lập tức mà không phải gọi lại API không?
- CRITICAL REQUIREMENT: Mặc dù prompt này được viết bằng tiếng Việt, toàn bộ tài liệu đặc tả được sinh ra BẮT BUỘC phải viết hoàn toàn bằng tiếng Anh. Tập trung vào kịch bản sử dụng và yêu cầu nghiệp vụ, không ghi chi tiết code.
```

### Tóm tắt phản hồi của AI

- AI đã mở chuỗi 5 câu hỏi để chốt từng vấn đề kỹ thuật và tự động cập nhật vào `spec.md` (duy trì 100% tiếng Anh).
- **Track list & Duration:** Chốt phương án nhận toàn bộ track list theo hợp đồng API hiện tại; giao diện có thể hiển thị dần, nhưng tổng thời lượng tính từ *tất cả* các track có dữ liệu.
- **Multi-disc Albums:** Giữ nguyên một danh sách phẳng (flat list) theo thứ tự API trả về, không yêu cầu chia nhóm theo đĩa.
- **UI "Không khả dụng":** Sử dụng ký hiệu dấu gạch ngang dài (em dash "—") cho các dữ liệu thời lượng hoặc lượt nghe bị thiếu; phân biệt rõ với giá trị "0" hợp lệ.
- **Placeholder Cover:** Sử dụng ảnh mặc định giữ nguyên tỷ lệ khung hình và khung responsive (không ấn định pixel cố định) để không làm vỡ layout.
- **Caching (Nút Back):** Hiển thị ngay dữ liệu đã tải từ trước, đồng thời chạy ngầm làm mới dữ liệu (refresh) để cập nhật.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do |
|---|---|---|
| Load toàn bộ Track list & Tổng Duration (Option B) | Dùng | Không phá vỡ hợp đồng API hiện tại, phản ánh đúng tổng thời lượng album mà không bắt client cộng dồn thủ công từng trang. |
| Flat list cho Multi-disc (Option A) | Dùng | Đơn giản hóa cấu trúc UI vì hợp đồng API chưa hỗ trợ metadata cho số thứ tự đĩa. |
| Ký hiệu Em dash "—" (Option A) | Dùng | Gọn gàng, dễ quét bằng mắt, khác biệt hoàn toàn với số 0. |
| Placeholder Responsive (Option A) | Dùng | Đảm bảo tính ổn định của Layout trên đa thiết bị thay vì chốt cứng một kích thước (ví dụ 300x300px). |
| Cache & Refresh ngầm (Option B) | Dùng | Cân bằng hoàn hảo giữa hiệu năng điều hướng (nhanh) và tính mới của dữ liệu. |

### Cách kiểm chứng

- [x] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt. Checklist đạt 16/16 và không còn marker `[NEEDS CLARIFICATION]`. Spec sẵn sàng cho bước `$speckit-plan`.

## Mục 10: Viết spec 082 – Album Tracklist 

| Trường | Nội dung |
|---|---|
| Ngày | 2026-10-30 |
| Người thực hiện | Nguyễn Khánh Đăng |
| Nhóm tính năng liên quan | 080 – Album Interaction, Feature 082: Album Tracklist (`specs/080-album-interaction/082-album-tracklist`) |
| Công cụ AI | Gemini, lệnh `/speckit-specify` |
| Mục đích | Tạo tài liệu đặc tả nghiệp vụ (spec) ban đầu cho tính năng tương tác với danh sách bài hát trong Album, thiết lập hành vi hiển thị và tích hợp mượt mà với Music Player / Queue Management. |

### Prompt đã dùng

```text
/speckit-specify
Đặc tả tính năng tương tác với danh sách bài hát trong Album (082-album-tracklist) cho AuraTune.
Yêu cầu cụ thể:
1. Hiển thị toàn bộ danh sách bài hát (tracklist) thuộc album.
2. Người dùng có thể chọn phát toàn bộ album (play all) hoặc phát một bài hát cụ thể trong danh sách.
3. Hành động phát nhạc cần tích hợp mượt mà với Music Player và Queue Management (đẩy tracklist vào Queue).
4. Tiêu chí chấp nhận:
- Thứ tự bài hát hiển thị đúng với dụng ý của nghệ sĩ.
- Bấm play album sẽ nạp đúng danh sách vào hàng đợi phát nhạc.
- CRITICAL REQUIREMENT: Mặc dù prompt này được viết bằng tiếng Việt, toàn bộ tài liệu đặc tả được sinh ra BẮT BUỘC phải viết hoàn toàn bằng tiếng Anh, tuan thủ chặc chẽ các quy tắc đã được nhóm định ra trong proposal.md
```

### Tóm tắt phản hồi của AI

- Khởi tạo thành công tài liệu đặc tả `spec.md` và `requirements.md` (đạt 16/16).
- Tài liệu được viết 100% bằng tiếng Anh, tuân thủ chặt chẽ `CRITICAL REQUIREMENT`.
- Xác định rõ User Stories, Acceptance Scenarios, Functional Requirements cho các thao tác Play Album, Play Selected Track, và giữ nguyên player khi điều hướng (navigation).
- Chỉ ra các điểm còn mơ hồ (Hành vi ghi đè hàng đợi, Xung đột Shuffle, Partial Availability, Duplicate Prevention, và Performance cho album dài) để chuẩn bị cho bước làm rõ.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do |
|---|---|---|
| Ngôn ngữ tài liệu (Tiếng Anh) | Dùng | Đảm bảo tính chuyên nghiệp và tuân thủ yêu cầu bắt buộc của dự án. |
| Tích hợp Music Player / Queue | Dùng | Phù hợp với kiến trúc dùng chung, không tạo thêm player riêng biệt gây xung đột. |
| Các điểm cần làm rõ (Clarification markers) | Dùng | Làm tiền đề tốt để đưa ra các quyết định kỹ thuật và UI/UX chính xác ở bước sau. |

### Cách kiểm chứng

- [x] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt. Sẵn sàng cho bước `$speckit-clarify`.

---

## Mục 11: Làm rõ spec 082 – Album Tracklist

| Trường | Nội dung |
|---|---|
| Ngày | 2026-10-30 |
| Người thực hiện | Nguyễn Khánh Đăng |
| Nhóm tính năng liên quan | 080 – Album Interaction, Feature 082: Album Tracklist |
| Công cụ AI | Gemini, lệnh `$speckit-clarify` |
| Mục đích | Giải quyết các điểm mơ hồ về cơ chế chèn hàng đợi, xung đột chế độ trộn bài, xử lý track không khả dụng, chống nhân bản queue và xử lý hiển thị album dài. |

### Prompt đã dùng

```text
speckit-clarify Làm rõ những điểm sau:
- Hành vi ghi đè hay chèn vào Hàng đợi (Queue Handling)...
- Xung đột với Chế độ Trộn bài (Shuffle Mode)...
- Xử lý các bài hát khả dụng một phần (Partial Availability)...
- Định nghĩa rõ việc "Chống trùng lặp" (Duplicate Prevention)...
- Giao diện và Trạng thái lỗi (UI/UX Feedback)...
- Giới hạn tải cho Album lớn (Performance/Pagination)...
- CRITICAL REQUIREMENT: Mặc dù prompt này được viết bằng tiếng Việt, toàn bộ tài liệu đặc tả được sinh ra BẮT BUỘC phải viết hoàn toàn bằng tiếng Anh.
```

### Tóm tắt phản hồi của AI

- Mở một "Clarification Session" với 5 câu hỏi trọng tâm đi kèm các đề xuất lựa chọn (Option A, B, C).
- Nhận phản hồi "yes" / chọn option và tự động cập nhật 5 quyết định nghiệp vụ vào `spec.md` (giữ nguyên tiếng Anh):
  1. **Queue Handling:** Chèn các track của album ngay sau track hiện tại, giữ lại queue cũ phía sau (Insert Next).
  2. **Shuffle Mode:** Tự động tắt Shuffle khi Play Album để đảm bảo thứ tự nghệ sĩ.
  3. **Partial Availability:** Hiển thị track không khả dụng dưới dạng disabled kèm lý do, tự động bỏ qua khi phát.
  4. **Duplicate Prevention:** Khởi động lại (restart) phần album từ track đầu và làm mới các track thuộc album trong queue, không ảnh hưởng đến các track khác.
  5. **Large Albums:** Tải toàn bộ danh sách để Play Album chạy đúng, nhưng hiển thị dần các hàng trên UI (Lazy render).
- Hoàn thiện toàn bộ đặc tả, checklist đạt 16/16, không còn placeholder cần làm rõ.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do |
|---|---|---|
| Chèn album vào queue (Insert next) | Dùng | Không làm mất phiên nghe đang xếp sẵn của người dùng mà vẫn phát album ngay lập tức. |
| Tắt chế độ Shuffle | Dùng | Tôn trọng trải nghiệm nghe album nguyên bản theo chủ ý nghệ sĩ. |
| Hiển thị track disabled kèm lý do | Dùng | Cung cấp UI/UX minh bạch, người dùng hiểu tại sao track bị bỏ qua mà luồng phát không gián đoạn. |
| Khởi động lại album & làm mới queue | Dùng | Giải quyết triệt để lỗi trùng lặp track (duplicate) mà vẫn cho phép người dùng chủ động nghe lại từ đầu. |
| Tải toàn bộ & hiển thị dần | Dùng | Đáp ứng yêu cầu Play toàn bộ album không bị thiếu track do phân trang, đồng thời tối ưu hiệu năng render. |

### Cách kiểm chứng

- [x] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt. Checklist hoàn thiện 16/16, sẵn sàng chuyển sang bước tiếp theo (`$speckit-plan`). Lỗi hiển thị thông báo chung của hệ thống sẽ được chốt chi tiết ở bước thiết kế.

## Mục 12: Viết spec 083 – Save and Share Album

| Trường | Nội dung | 
| ----- | ----- | 
| Ngày | 2026-10-30 | 
| Người thực hiện | Nguyễn Khánh Đăng | 
| Nhóm tính năng liên quan | 080 – Album Interaction, Feature 083: Save and Share Album (`specs/080-album-interaction/083-save-and-share-album`) | 
| Công cụ AI | Gemini, lệnh `/speckit-specify` | 
| Mục đích | Tạo tài liệu đặc tả nghiệp vụ (spec) ban đầu cho tính năng lưu và chia sẻ album, tuân thủ đúng 2 API contract được cung cấp và định nghĩa luồng thao tác cơ bản. | 

### Prompt đã dùng

```text
/speckit-specify
Đặc tả tính năng lưu trữ và chia sẻ Album (083-save-and-share-album) cho AuraTune.
Yêu cầu cụ thể:
1. Người dùng đã đăng nhập có thể lưu (save/like) album vào thư viện cá nhân (Liked Albums / Saved Albums).
2. Bất kỳ người dùng nào cũng có thể chia sẻ (share) album thông qua URL hoặc các nút chia sẻ mạng xã hội.
3. Tuân thủ API Contract: PUT /albums/:id/save và DELETE /albums/:id/save.
4. Tiêu chí chấp nhận:
- Trạng thái "Đã lưu" được đồng bộ chính xác với tài khoản user.
- Link chia sẻ khi truy cập phải dẫn đúng vào trang 081-album-details.
- CRITICAL REQUIREMENT: Mặc dù prompt này được viết bằng tiếng Việt, toàn bộ tài liệu đặc tả được sinh ra BẮT BUỘC phải viết hoàn toàn bằng tiếng Anh. Không tự đưa ra các quyết định kỹ thuật chưa được duyệt.
```

### Tóm tắt phản hồi của AI

* Khởi tạo thành công 3 file: `spec.md`, `requirements.md` (checklist ban đầu 16/16), và `.specify/feature.json`.
* Tài liệu được viết 100% bằng tiếng Anh theo đúng `CRITICAL REQUIREMENT`.
* Tích hợp chính xác API Contract (`PUT /albums/:id/save` và `DELETE /albums/:id/save`).
* Bao gồm đầy đủ các kịch bản: lưu/gỡ lưu gắn với đúng tài khoản, yêu cầu đăng nhập khi lưu, chia sẻ bằng URL và điều hướng URL tới đúng trang chi tiết album mà không làm thay đổi các quy tắc truy cập công khai hiện có.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do | 
| ----- | ----- | ----- | 
| Ngôn ngữ tài liệu (Tiếng Anh) | Dùng | Đảm bảo tính chuyên nghiệp và tuân thủ yêu cầu bắt buộc của dự án. | 
| API Contract cho Lưu/Xóa | Dùng | Khớp hoàn toàn với tài liệu API đã được cung cấp. | 
| Quy tắc truy cập chia sẻ | Dùng | Giữ nguyên quyền xem chi tiết album hiện có, không tự ý tạo thêm rules truy cập public dư thừa. | 

### Cách kiểm chứng

* \[x\] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
* \[x\] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
* \[x\] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
* \[x\] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt.

**Ghi chú:** Đặc tả ban đầu bám rất sát yêu cầu. Chuyển sang bước làm rõ để xử lý các chi tiết về UI/UX và giới hạn hệ thống.

## Mục 13: Làm rõ spec 083 – Save and Share Album

| Trường | Nội dung | 
| ----- | ----- | 
| Ngày | 2026-10-30 | 
| Người thực hiện | Nguyễn Khánh Đăng | 
| Nhóm tính năng liên quan | 080 – Album Interaction, Feature 083: Save and Share Album | 
| Công cụ AI | Gemini, lệnh `/speckit-clarify` | 
| Mục đích | Giải quyết các điểm mơ hồ về xử lý UI/UX trạng thái chờ (loading), thông báo lỗi, hình ảnh trực quan của nút lưu, danh sách mạng xã hội chia sẻ, và giới hạn lưu trữ của hệ thống. | 

### Prompt đã dùng

```text
/speckit-clarify Làm rõ các vấn đề sau:
1. Giao diện và Trải nghiệm Người dùng (UI/UX)
- Xử lý trạng thái chờ (Loading State): Yêu cầu FR-005 chỉ định không được hiển thị thay đổi chưa được xác nhận là thành công...
- Chi tiết về "Phản hồi rõ ràng" (Clear Feedback): Ở các luồng thất bại...
- Trạng thái hình ảnh của nút Lưu/Chia sẻ...
2. Tính năng Chia sẻ (Social Sharing)
- Các nền tảng được hỗ trợ...
3. Giới hạn Hệ thống và Luồng Nghiệp vụ (Business & System Limits)
- Giới hạn số lượng (Quota)...
- Hành vi "Bỏ lưu" (Unsave) ở Thư viện cá nhân...
CRITICAL REQUIREMENT: Toàn bộ tài liệu đặc tả được sinh ra BẮT BUỘC phải viết hoàn toàn bằng tiếng Anh. Không tự đưa ra các quyết định kỹ thuật chưa được duyệt.
```

### Tóm tắt phản hồi của AI

* Đưa ra một "Clarification Session" với 5 câu hỏi trắc nghiệm tập trung vào các điểm mù của đặc tả.
* **Loading State:** Chọn Option A – Tạm khóa nút Lưu/Bỏ lưu trong lúc yêu cầu đang xử lý, hiển thị tiến trình và giữ nguyên trạng thái đã xác nhận cho tới khi có phản hồi.
* **Error Feedback:** Chọn Option A – Hiển thị thông báo inline ngắn, riêng biệt cho từng hành động, kèm gợi ý thử lại khi phù hợp.
* **Visual State:** Chọn Option A – Nút "Chưa lưu" hiển thị tim viền (Outlined heart) + text “Save”; Nút "Đã lưu" hiển thị tim đặc (Filled heart) + text “Saved”.
* **Social Sharing:** Chọn Option A – Hỗ trợ Copy Link, Facebook, Instagram, X và Zalo.
* **System Quota:** Chọn Option A – Không đặt quota giới hạn riêng cho tính năng này; áp dụng giới hạn chung hiện có của nền tảng.
* **Cập nhật Checklist:** Sau khi cập nhật các quyết định trên (hoàn toàn bằng tiếng Anh) vào `spec.md`, checklist đạt 15/16. Mục "Requirements are testable and unambiguous" được bỏ đánh dấu do có một câu hỏi bị hoãn (deferred) vì giới hạn 5 câu hỏi của phiên (câu hỏi về hành vi bỏ lưu ngay trong màn hình Saved Albums).

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do | 
| ----- | ----- | ----- | 
| Khóa nút khi loading (Option A) | Dùng | Ngăn chặn spam click từ người dùng và giữ tính trung thực của trạng thái (tránh Optimistic UI sai lệch). | 
| Thông báo lỗi Inline (Option A) | Dùng | Ít làm gián đoạn luồng duyệt web của người dùng nhất, đồng thời giữ context rõ ràng. | 
| UI icon Tim viền/Tim đặc (Option A) | Dùng | Pattern chuẩn của ngành âm nhạc (Spotify/Apple Music), dễ hiểu, kết hợp cùng text để tăng tính rõ ràng. | 
| Danh sách 5 mạng xã hội (Option A) | Dùng | Bao phủ đúng các nền tảng phổ biến tại Việt Nam và nền tảng chuẩn mực, có fallback an toàn là "Copy Link". | 
| Không đặt quota (Option A) | Dùng | Giữ cho hệ thống đơn giản, không tự chế thêm business logic chưa được duyệt từ Product. | 

### Cách kiểm chứng

* \[x\] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
* \[x\] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
* \[x\] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
* \[x\] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt. Tích hợp thành công 5 lựa chọn vào `spec.md`.

**Ghi chú:** Vấn đề chưa được chốt về *hành vi khi "Bỏ lưu" ở ngay trong màn hình Saved Albums (biến mất ngay lập tức hay cần reload)* đã được ghi chú vào mục Notes của file `requirements.md`. Phần cốt lõi của tính năng 083 đã rõ ràng, sẵn sàng chuyển sang bước `$speckit-plan`. Có thể cần trao đổi thêm với team Design/Product về hành vi của màn hình Saved Albums trước khi tạo task.

---

## Mục 14: Làm rõ spec 083 (bổ sung) – Hành vi Bỏ lưu trong Saved Albums

| Trường | Nội dung | 
| ----- | ----- | 
| Ngày | 2026-10-30 | 
| Người thực hiện | Nguyễn Khánh Đăng | 
| Nhóm tính năng liên quan | 080 – Album Interaction, Feature 083: Save and Share Album | 
| Công cụ AI | Gemini, lệnh `/speckit-clarify` | 
| Mục đích | Xử lý nốt câu hỏi bị hoãn từ phiên trước, làm rõ hành vi UX khi người dùng gỡ một album ngay bên trong giao diện danh sách Saved Albums. | 

### Prompt đã dùng

```text
/speckit-clarify Làm rõ vấn đề về *hành vi khi "Bỏ lưu" ở ngay trong màn hình Saved Albums (biến mất ngay lập tức hay cần reload)
Question: When a listener removes an album while viewing Saved Albums, when should that album disappear from the visible list?
Why it matters: This determines whether the list stays consistent with the confirmed account state without showing an unconfirmed removal.
Recommended: Option A — Keep the album visible while the request is pending, then remove it from the current list as soon as removal is confirmed. This avoids optimistic UI while keeping the open library in sync without requiring a reload.
OptionDescriptionARemove it from the current list immediately after the removal is confirmed.BKeep it visible until the listener navigates away or reloads the page.CAsk the listener to refresh the list after a successful removal.ShortProvide a different brief behavior.

You can reply with the option letter (e.g., "A"), accept the recommendation by saying "yes" or "recommended", or provide your own short answer.
Đã chốt: trong Saved Albums, album vẫn hiển thị khi yêu cầu bỏ lưu đang chờ; sau khi thành công, album biến mất khỏi danh sách đang mở mà không cần tải lại. Nếu thao tác thất bại, album vẫn hiển thị và có thông báo lỗi inline.
```

### Tóm tắt phản hồi của AI

* Xác nhận lựa chọn **Option A**: Trong lúc chờ API xử lý, album vẫn hiển thị. Ngay sau khi có xác nhận bỏ lưu thành công từ server, album sẽ tự động biến mất khỏi danh sách giao diện đang hiển thị mà không cần người dùng tải lại trang. Trường hợp lỗi, album vẫn giữ nguyên trên danh sách kèm thông báo lỗi inline.
* Đã cập nhật quyết định này (bằng tiếng Anh) vào các mục: Clarifications, Acceptance Scenarios, FR-002, Success Criteria và Assumptions trong file `spec.md`.
* Checklist `requirements.md` đã được xóa toàn bộ marker cần làm rõ, đánh dấu đạt mục cuối cùng, nâng tổng điểm lên 16/16.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do | 
| ----- | ----- | ----- | 
| Xóa ngay sau khi xác nhận (Option A) | Dùng | Tránh việc sử dụng Optimistic UI (hiển thị xóa trước khi server xác nhận) gây sai lệch dữ liệu, nhưng vẫn đảm bảo tính phản hồi ngay lập tức cho người dùng sau khi thao tác thành công. | 

### Cách kiểm chứng

* \[x\] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
* \[x\] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
* \[x\] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
* \[x\] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt. Toàn bộ các khía cạnh hành vi, luồng UX, ranh giới dữ liệu và tiêu chí nghiệm thu đều đã được xử lý xong.

**Ghi chú:** Đạt. Tính năng đã sẵn sàng để chuyển tiếp qua giai đoạn lập kế hoạch nhiệm vụ (`$speckit-plan`).

## Mục 15: Kiểm tra và đề xuất chỉnh sửa tài liệu Use-Case Group 030

| Trường | Nội dung |
|---|---|
| Ngày | 2026-11-04 |
| Người thực hiện | Nguyễn Khánh Đăng |
| Nhóm tính năng liên quan | 030-Search |
| Công cụ AI | GPT-6-Luna |
| Mục đích | Review tài liệu Use-Case, phát hiện mâu thuẫn với Spec Kit và đề xuất các phương án chỉnh sửa thông qua hình thức trắc nghiệm. |

### Prompt đã dùng

```text
# PHẦN 1. PHẠM VI CÔNG VIỆC

Đóng vai trò là System Analyst / QA Reviewer. Nhiệm vụ của bạn là kiểm tra, đánh giá tính chính xác, tính đầy đủ và sự nhất quán của bộ tài liệu Use-Case thuộc Group 030 – Search.

Thông tin group cần review:
- Group ID: 030
- Group Name: Search
- Thư mục cần đánh giá: `docs/requirements/use-cases/030-search/`

GIỚI HẠN NGHIÊM NGẶT:
- CHỈ ĐỌC VÀ ĐỐI CHIẾU tài liệu.
- TUYỆT ĐỐI KHÔNG tạo mới, ghi đè, hay tự ý chỉnh sửa bất kỳ file nào trong hệ thống.
- CHỈ XUẤT RA BÁO CÁO ĐÁNH GIÁ (Review Report) chứa các lỗi phát hiện được và đề xuất sửa đổi.
- Bỏ qua tài liệu Use Case của các group khác, chỉ tập trung vào Group 030.

---

# PHẦN 2. TÀI LIỆU NGUỒN CẦN ĐỐI CHIẾU (SOURCE OF TRUTH)

Trước khi đánh giá tài liệu Use Case, bạn BẮT BUỘC phải đọc và lấy thông tin chuẩn từ các tài liệu sau để làm hệ quy chiếu:

1. Tài liệu dự án chung:
- `docs/proposal/Auratune_Vision_Document.md`
- `docs/proposal/project_plan.md`
- `docs/proposal/proposal.md`
- `docs/PA/` (đặc biệt là yêu cầu của PA3)

2. Spec Kit của Group 030:
- Đọc toàn bộ: `specs/030-search/`
- Chú ý các Functional Requirements (FR) và Feature definitions đã được chốt.

---

# PHẦN 3. QUY TẮC KIỂM TRA KHÔNG ĐƯỢC VI PHẠM

Khi đối chiếu tài liệu Use Case của Group 030 với Tài liệu nguồn, hãy áp dụng các nguyên tắc bắt lỗi sau:

1. Lỗi "Bịa đặt" (Hallucination): Báo cáo NGAY LẬP TỨC nếu tài liệu Use Case chứa các chức năng, Actor, FR ID, thuật toán, hoặc công thức scoring KHÔNG TỒN TẠI trong Spec Kit.
2. Lỗi "Vượt quyền" (Out of Scope): Phát hiện nếu Group 030 đưa các chức năng của group khác (VD: AI Chatbot của Group 120) vào tài liệu của mình.
3. Lỗi "Thiếu sót" (Omission): Liệt kê các FR hoặc Feature có trong Spec Kit nhưng KHÔNG có Use Case tương ứng.
4. Lỗi "Suy diễn trạng thái": Kiểm tra xem các tính năng đang ở mức `Proposed` hoặc `TBD` có bị ghi nhầm thành `Confirmed` hay không.

Không tự suy diễn để hợp lý hóa cái sai của tài liệu. Nếu mâu thuẫn, lấy "Tài liệu nguồn" (Phần 2) làm gốc để bắt lỗi "Tài liệu Use Case".

---

# PHẦN 4. HẠNG MỤC CẦN KIỂM TRA CHI TIẾT

Tiến hành đọc và kiểm tra các file trong thư mục `docs/requirements/use-cases/030-search/` theo các tiêu chí sau:

## 4.1. Đánh giá README.md
- File có tồn tại không?
- Có đủ Metadata (Group Info, Scope, Actors, Dependencies) không?
- Bảng Feature - FR ID có khớp với Spec Kit không?
- **Sơ đồ Use-Case (Mermaid):** 
  - Sơ đồ có render được không? Có đặt đúng trong README không?
  - Có thể hiện rõ System Boundary của Group 030 không?
  - Ký hiệu Actor và Use Case có đúng chuẩn không? Các quan hệ `include`/`extend` có hợp lý và có căn cứ không?

## 4.2. Đánh giá use-case-inventory.md
- Có bảng thống kê đầy đủ không?
- Các UC ID có tuân thủ format `UC-030-[SEQUENCE]` không?
- Cột "Related FR IDs" và "Related Feature" có link chính xác tới Spec Kit không?
- Có Use Case nào trong sơ đồ Mermaid mà KHÔNG có trong Inventory (và ngược lại) không?

## 4.3. Đánh giá UC Specifications (Các file .md của từng UC)
- Tên file có khớp với format `UC-030-[SEQUENCE]-[short-name].md` không?
- **Template:** Có tuân thủ đúng cấu trúc 13 phần (Metadata, Description, Preconditions, Trigger, Basic Flow, Alternative Flows, Exception Flows, Postconditions, v.v.) không?
- **Basic Flow:** Các bước Actor/System có xen kẽ hợp lý không? Có bị lẫn lộn mô tả code/database vào hành động của user không?
- **Alternative Flows:** Mỗi AF có ID riêng, Starting Step, Condition và Continuation rõ ràng không? Có AF nào bị thiếu không?
- **Pre/Post-conditions:** Viết có cụ thể, có thể test được không (Tránh các câu vô nghĩa như "Hệ thống hoạt động bình thường").

## 4.4. Đánh giá Prototypes & Traceability
- Thư mục `prototypes/` có `README.md` hướng dẫn không?
- Các file ảnh được tham chiếu trong UC Spec có tuân thủ naming convention không?
- Nếu ghi `Pending` hoặc `Not Available`, nó có được note rõ ràng để đánh giá PA3 không?
- Truy vết toàn diện (Traceability): Tất cả các FR thuộc Group 030 → Có UC trong Inventory → Có file UC Spec → Có ảnh Prototype hoặc note phù hợp.

---

# PHẦN 5. YÊU CẦU ĐẦU RA BÁO CÁO (REVIEW REPORT)

Hãy trả về một Báo cáo Kiểm tra Tài liệu (Audit Report) với cấu trúc sau:

## 1. TỔNG QUAN (EXECUTIVE SUMMARY)
- Số lượng tài liệu đã đọc & đối chiếu.
- Đánh giá mức độ hoàn thiện của Group 030 theo chuẩn PA3 (Tốt/Khá/Cần sửa nhiều).

## 2. LỖI NGHIÊM TRỌNG (CRITICAL ISSUES)
- Liệt kê các lỗi vi phạm ranh giới hệ thống, bịa đặt Actor/FR/Chức năng, hoặc mâu thuẫn lớn với Spec Kit.

## 3. KẾT QUẢ KIỂM TRA TỪNG HẠNG MỤC (DETAILED FINDINGS)
- **3.1. README & Mermaid Diagram:** (Chỉ ra lỗi và đề xuất sửa).
- **3.2. Use-Case Inventory:** (Có UC nào dư/thiếu, mapping sai FR không?).
- **3.3. UC Specifications:** (Đánh giá chất lượng Basic Flow/Alt Flow, cấu trúc template).
- **3.4. Prototypes & UI Mapping:** (Kiểm tra liên kết ảnh).

## 4. KẾT QUẢ TRACEABILITY
- Báo cáo các FR bị bỏ sót (Orphan FRs) hoặc các Use Case không phục vụ FR nào (Ghost UCs).

## 5. ĐỀ XUẤT HÀNH ĐỘNG (ACTIONABLE RECOMMENDATIONS)
- Đưa ra checklist các việc Group 030 cần làm để fix tài liệu (ghi rõ file nào cần sửa gì, thêm/bớt nội dung nào). 

**LƯU Ý:** Báo cáo phải cụ thể, trích dẫn rõ ID hoặc tên file bị lỗi. Không đưa ra nhận xét chung chung. Không cung cấp script để sửa file, chỉ cung cấp đề xuất bằng text.

Hãy đưa ra các câu hỏi để chỉnh sửa các yêu cầu bạn nêu lên. Yêu cầu nêu rõ file cần chỉnh sửa, nội dung chỉnh sửa, các câu hỏi đưa ra thuộc dạng trắc nghiệm, sau khi được tôi chấp nhận yêu cầu chỉnh sửa, bạn tiến hành sửa đổi tài liêu được nhắc đến. LƯU Ý: chỉ sửa đổi các tài liệu thuộc use-case, tuân thủ tuyệt đối các tài liệu tham khảo. 
```

### Tóm tắt phản hồi của AI

- AI đã kiểm tra 12 tài liệu và phát hiện Group 030 có nhiều lỗi liên quan đến đường dẫn spec, sai tên file (UC-002) và các mâu thuẫn yêu cầu hệ thống.
- AI chỉ ra rằng sơ đồ Mermaid đang biểu diễn sai ranh giới hệ thống khi `include` Music Player.
- Trạng thái Feature 032/033 trong README (Planned) mâu thuẫn với khẳng định "Implemented UI" trong thư mục prototype.
- UC-003 chứa quy định timeout (1.500 ms) không khớp với requirement `033-FR-016` (3.000 ms).
- Theo yêu cầu trắc nghiệm, AI đã cung cấp 3 câu hỏi để người dùng lựa chọn phương án xử lý trực tiếp cho: lỗi tên file/đường dẫn, đồng bộ mã FR/hành vi không cơ sở, và điều chỉnh timeout/Mermaid.
- Điểm cần kiểm tra: Nhóm cần loại bỏ các tính năng vượt phạm vi spec (như hiển thị "Most Played", tải audio byte trực tiếp, playlist) nếu chưa được duyệt.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do |
|---|---|---|
| Đổi tên file `UC-030-002-ai-lyrics-saerch.md` và cập nhật lại toàn bộ đường dẫn spec theo thư mục thực tế (Phương án 1A) | Dùng | Đảm bảo liên kết tài liệu không bị gãy và phản ánh chính xác cấu trúc repository hiện hành. |
| Bổ sung tiền tố Feature cho FR ID, đồng thời loại bỏ các chi tiết không có trong spec (Phương án 2A) | Dùng | Tăng cường tính truy vết (traceability) và tránh việc tự ý bổ sung requirements không tồn tại. |
| Sửa timeout 3.000 ms theo `033-FR-016`, đổi quan hệ `include` thành `delegation` cho Music Player và bỏ nhãn "Implemented UI" (Phương án 3A) | Dùng | Phân định rõ ràng ranh giới nghiệp vụ với Group 040 và bảo đảm tính nhất quán tuyệt đối với Spec Kit. |

### Cách kiểm chứng

- [ ] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt sau khi chỉnh sửa.

**Ghi chú:** Đã xác nhận đồng ý áp dụng toàn bộ các đề xuất A (1A, 2A, 3A) từ phản hồi của AI. Các tài liệu thuộc Use-Case Group 030 đã được cấu trúc và đồng bộ lại chính xác với `031`, `032`, `033` mà không làm thay đổi tài liệu Spec Kit gốc.

## Mục 16: Kiểm tra và đề xuất chỉnh sửa tài liệu Use-Case Group 080

| Trường | Nội dung |
|---|---|
| Ngày | 2026-11-04 |
| Người thực hiện | Nguyễn Khánh Đăng |
| Nhóm tính năng liên quan | 080 – Album Interaction |
| Công cụ AI | GPT-6-Luna |
| Mục đích | Review tài liệu Use-Case, phát hiện mâu thuẫn với Spec Kit, rà soát tính truy vết (traceability) và thực thi các sửa đổi thông qua lựa chọn trắc nghiệm. |

### Prompt đã dùng

```text
# PHẦN 1. PHẠM VI CÔNG VIỆC

Đóng vai trò là System Analyst / QA Reviewer. Nhiệm vụ của bạn là kiểm tra, đánh giá tính chính xác, tính đầy đủ và sự nhất quán của bộ tài liệu Use-Case thuộc Group 080 – Album Interaction.

Thông tin group cần review:
- Group ID: 080
- Group Name: Album Interaction
- Thư mục cần đánh giá: `docs/requirements/use-cases/080-album-interaction/`

GIỚI HẠN NGHIÊM NGẶT:
- CHỈ ĐỌC VÀ ĐỐI CHIẾU tài liệu.
- TUYỆT ĐỐI KHÔNG tạo mới, ghi đè, hay tự ý chỉnh sửa bất kỳ file nào trong hệ thống.
- CHỈ XUẤT RA BÁO CÁO ĐÁNH GIÁ (Review Report) chứa các lỗi phát hiện được và đề xuất sửa đổi.
- Bỏ qua tài liệu Use Case của các group khác, chỉ tập trung vào Group 080.

---

# PHẦN 2. TÀI LIỆU NGUỒN CẦN ĐỐI CHIẾU (SOURCE OF TRUTH)

Trước khi đánh giá tài liệu Use Case, bạn BẮT BUỘC phải đọc và lấy thông tin chuẩn từ các tài liệu sau để làm hệ quy chiếu:

1. Tài liệu dự án chung:
- `docs/proposal/Auratune_Vision_Document.md`
- `docs/proposal/project_plan.md`
- `docs/proposal/proposal.md`

2. Spec Kit của Group 080:
- Đọc toàn bộ: `specs/080-album-interaction/`
- Chú ý các Functional Requirements (FR) và Feature definitions đã được chốt.

---

# PHẦN 3. QUY TẮC KIỂM TRA KHÔNG ĐƯỢC VI PHẠM

Khi đối chiếu tài liệu Use Case của Group 080 với Tài liệu nguồn, hãy áp dụng các nguyên tắc bắt lỗi sau:

1. Lỗi "Bịa đặt" (Hallucination): Báo cáo NGAY LẬP TỨC nếu tài liệu Use Case chứa các chức năng, Actor, FR ID, thuật toán, hoặc công thức scoring KHÔNG TỒN TẠI trong Spec Kit.
2. Lỗi "Vượt quyền" (Out of Scope): Phát hiện nếu Group 080 đưa các chức năng của group khác (VD: AI Chatbot của Group 120) vào tài liệu của mình.
3. Lỗi "Thiếu sót" (Omission): Liệt kê các FR hoặc Feature có trong Spec Kit nhưng KHÔNG có Use Case tương ứng.
4. Lỗi "Suy diễn trạng thái": Kiểm tra xem các tính năng đang ở mức `Proposed` hoặc `TBD` có bị ghi nhầm thành `Confirmed` hay không.

Không tự suy diễn để hợp lý hóa cái sai của tài liệu. Nếu mâu thuẫn, lấy "Tài liệu nguồn" (Phần 2) làm gốc để bắt lỗi "Tài liệu Use Case".

---

# PHẦN 4. HẠNG MỤC CẦN KIỂM TRA CHI TIẾT

Tiến hành đọc và kiểm tra các file trong thư mục `docs/requirements/use-cases/080-album-interaction/` theo các tiêu chí sau:

## 4.1. Đánh giá README.md
- File có tồn tại không?
- Có đủ Metadata (Group Info, Scope, Actors, Dependencies) không?
- Bảng Feature - FR ID có khớp với Spec Kit không?
- **Sơ đồ Use-Case (Mermaid):** 
  - Sơ đồ có render được không? Có đặt đúng trong README không?
  - Có thể hiện rõ System Boundary của Group 080 không?
  - Ký hiệu Actor và Use Case có đúng chuẩn không? Các quan hệ `include`/`extend` có hợp lý và có căn cứ không?

## 4.2. Đánh giá use-case-inventory.md
- Có bảng thống kê đầy đủ không?
- Các UC ID có tuân thủ format `UC-080-[SEQUENCE]` không?
- Cột "Related FR IDs" và "Related Feature" có link chính xác tới Spec Kit không?
- Có Use Case nào trong sơ đồ Mermaid mà KHÔNG có trong Inventory (và ngược lại) không?

## 4.3. Đánh giá UC Specifications (Các file .md của từng UC)
- Tên file có khớp với format `UC-080-[SEQUENCE]-[short-name].md` không?
- **Template:** Có tuân thủ đúng cấu trúc 13 phần (Metadata, Description, Preconditions, Trigger, Basic Flow, Alternative Flows, Exception Flows, Postconditions, v.v.) không?
- **Basic Flow:** Các bước Actor/System có xen kẽ hợp lý không? Có bị lẫn lộn mô tả code/database vào hành động của user không?
- **Alternative Flows:** Mỗi AF có ID riêng, Starting Step, Condition và Continuation rõ ràng không? Có AF nào bị thiếu không?
- **Pre/Post-conditions:** Viết có cụ thể, có thể test được không (Tránh các câu vô nghĩa như "Hệ thống hoạt động bình thường").

## 4.4. Đánh giá Prototypes & Traceability
- Thư mục `prototypes/` có `README.md` hướng dẫn không?
- Các file ảnh được tham chiếu trong UC Spec có tuân thủ naming convention không?
- Nếu ghi `Pending` hoặc `Not Available`, nó có được note rõ ràng để đánh giá PA3 không?
- Truy vết toàn diện (Traceability): Tất cả các FR thuộc Group 080 → Có UC trong Inventory → Có file UC Spec → Có ảnh Prototype hoặc note phù hợp.

---

# PHẦN 5. YÊU CẦU ĐẦU RA BÁO CÁO (REVIEW REPORT)

Hãy trả về một Báo cáo Kiểm tra Tài liệu (Audit Report) với cấu trúc sau:

## 1. TỔNG QUAN (EXECUTIVE SUMMARY)
- Số lượng tài liệu đã đọc & đối chiếu.
- Đánh giá mức độ hoàn thiện của Group 080 (Tốt/Khá/Cần sửa nhiều).

## 2. LỖI NGHIÊM TRỌNG (CRITICAL ISSUES)
- Liệt kê các lỗi vi phạm ranh giới hệ thống, bịa đặt Actor/FR/Chức năng, hoặc mâu thuẫn lớn với Spec Kit.

## 3. KẾT QUẢ KIỂM TRA TỪNG HẠNG MỤC (DETAILED FINDINGS)
- **3.1. README & Mermaid Diagram:** (Chỉ ra lỗi và đề xuất sửa).
- **3.2. Use-Case Inventory:** (Có UC nào dư/thiếu, mapping sai FR không?).
- **3.3. UC Specifications:** (Đánh giá chất lượng Basic Flow/Alt Flow, cấu trúc template).
- **3.4. Prototypes & UI Mapping:** (Kiểm tra liên kết ảnh).

## 4. KẾT QUẢ TRACEABILITY
- Báo cáo các FR bị bỏ sót (Orphan FRs) hoặc các Use Case không phục vụ FR nào (Ghost UCs).

## 5. ĐỀ XUẤT HÀNH ĐỘNG (ACTIONABLE RECOMMENDATIONS)
- Đưa ra checklist các việc Group 080 cần làm để fix tài liệu (ghi rõ file nào cần sửa gì, thêm/bớt nội dung nào). 

**LƯU Ý:** Báo cáo phải cụ thể, trích dẫn rõ ID hoặc tên file bị lỗi. Không đưa ra nhận xét chung chung. Không cung cấp script để sửa file, chỉ cung cấp đề xuất bằng text.

Hãy đưa ra các câu hỏi để chỉnh sửa các yêu cầu bạn nêu lên. Yêu cầu nêu rõ file file cần chỉnh sửa, nội dung chỉnh sửa, các câu hỏi đưa ra thuộc dạng trắc nghiệm, sau khi được tôi chấp nhận yêu cầu chỉnh sửa, bạn tiến hành sửa đổi tài liêu được nhắc đến. LƯU Ý: chỉ sửa đổi các tài liệu thuộc use-case, tuân thủ tuyệt đối các tài liệu tham khảo. 
```

### Tóm tắt phản hồi của AI

- Đã đối chiếu 15 tài liệu chính và đưa ra đánh giá: **Cần sửa nhiều**. Có đủ 3 UC cho 3 Feature nhưng chất lượng liên kết và bám sát nghiệp vụ chưa tốt.
- **Lỗi nghiêm trọng:** Đường dẫn spec bị sai (`spec-081.md` không tồn tại); UC-002 cho phép `Guest` phát nhạc sai lệch với spec; khẳng định trạng thái "Confirmed" sai thực tế (spec đang là Draft); UC-001 bịa thêm tính năng không thuộc phạm vi (ngày phát hành, bản quyền, hover actions).
- **Lỗi mô hình hóa:** Sơ đồ Mermaid sử dụng `<<include>>` và `<<extend>>` sai mục đích khi trỏ tới Music Player và Auth subsystem.
- **Thiếu sót luồng nghiệp vụ:** UC-003 thiếu exception flow khi share lỗi, không định nghĩa rõ các nền tảng mạng xã hội; UC-001 thiếu luồng xử lý empty tracklist; UC-002 thiếu luồng track mất khả dụng lúc phát.
- AI đã cung cấp báo cáo chi tiết và đề xuất các phương án chỉnh sửa thông qua hình thức trắc nghiệm (chọn phương án A, B, C cho từng vấn đề) và tiến hành áp dụng khi được phê duyệt.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do |
|---|---|---|
| Sửa tên group, trạng thái (về Draft), đường dẫn spec và chuẩn hóa FR mapping trong `README.md` & `use-case-inventory.md` | Dùng (Option 1A) | Đảm bảo tính truy vết tài liệu chính xác, sửa các link gãy và phản ánh đúng trạng thái thực tế của dự án. |
| Thay quan hệ `include`/`extend` trong sơ đồ Mermaid bằng `dependency/delegation` | Dùng (Option 3A) | Phản ánh đúng chuẩn Use-Case, làm rõ ranh giới nghiệp vụ giữa Album Interaction và Player/Auth. |
| **UC-080-001:** Bỏ ngày phát hành/copyright, hover actions; thêm luồng empty tracklist và điều hướng khi tải | Dùng (Option 2A, 4A) | Bám sát chặt chẽ ranh giới của Feature 081, không "vượt quyền" thiết kế tính năng ngoài spec. |
| **UC-080-002:** Giới hạn Actor là `Listener`; thêm luồng track unavailable; làm rõ hành vi chèn Queue (Insert Next) | Dùng (Option 4A) | Ngăn chặn Guest phát nhạc trái phép; xử lý triệt để mâu thuẫn giữa `082-FR-004` và clarification nội bộ. |
| **UC-080-003:** Thêm các lựa chọn Share (Facebook, X, Zalo...), luồng mở link, lỗi share và pending state khi gỡ lưu | Dùng (Option 4A) | Tránh việc mô tả hời hợt, đảm bảo phủ kín toàn bộ kịch bản nghiệp vụ theo `083-FR-011` và `083-FR-012`. |
| Sửa đường dẫn, đánh giá trạng thái UI trong thư mục `prototypes/` | Dùng (Option 1A) | Đảm bảo liên kết ảnh không bị vỡ và không tuyên bố khống "Implemented UI" khi chưa có code thực tế. |

### Cách kiểm chứng

- [ ] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt sau khi chỉnh sửa.

## Mục 17: Lập Implementation Plan cho spec 031 bằng Spec Kit

| Trường | Nội dung |
|---|---|
| Ngày | 2026-11-07 |
| Người thực hiện | Nguyễn Khánh Đăng |
| Nhóm tính năng liên quan | 030 – Search, Feature 031: Metadata Search |
| Công cụ AI | GPT-5.6-Luna |
| Mục đích | Khởi tạo toàn bộ bộ tài liệu Implementation Plan (gồm `plan.md`, `research.md`, `data-model.md`, `quickstart.md`) cho tính năng tìm kiếm siêu dữ liệu dựa trên quy trình chuẩn của Spec Kit. |

### Prompt đã dùng

```text
/speckit-plan # TASK: Execute `/speckit.plan` cho Feature 031 Only

Bạn đang làm việc trong repository AuraTune.

Hãy sử dụng **Spec Kit `/speckit.plan`** để tạo bộ tài liệu Implementation Plan cho feature `031` thuộc Group 030 – Search.

**Chỉ lập Plan cho feature 031. Không xử lý feature khác.**

## 1. Xác định Feature 031
Kiểm tra:
- `specs/030-search/`
- Các thư mục và file con bên trong.
- `spec.md` của feature 031.
- Metadata và configuration liên quan.
Xác định chính xác tên feature và đường dẫn Spec Kit.
Nếu không tìm thấy feature 031 hoặc không xác định được context, hãy dừng lại và báo cáo. Không tự tạo feature thay thế.

## 2. Đọc tài liệu nguồn
Đọc các tài liệu cần thiết:
- `docs/management/speckit-workflow-guide.md`
- `docs/management/team-contract.md`
- `docs/proposal/Auratune_Vision_Document.md`
- `docs/proposal/project_plan.md`
- `docs/proposal/proposal.md`
- Toàn bộ tài liệu thuộc feature 031.
- Các tài liệu kiến trúc và source code liên quan trực tiếp đến feature 031.
Kiểm tra `.specify/` và `.agents/` để hiểu instructions, templates và workflow của Spec Kit.

## 3. Thực thi `/speckit.plan`
Sau khi xác định đúng feature context:
1. Chọn feature 031 làm context hiện hành.
2. Thực thi `/speckit.plan`.
3. Sử dụng nội dung `spec.md` và thông tin kiến trúc thực tế của AuraTune làm đầu vào.
4. Tuân thủ instructions, template và conventions của repository.
5. Tạo hoặc cập nhật **toàn bộ bộ tài liệu planning** đúng vị trí mà Spec Kit quy định, bao gồm: `plan.md`, `research.md`, `data-model.md`, `contracts/`, và `quickstart.md`.
Không tự viết thủ công thay cho Spec Kit command. Nếu môi trường không hỗ trợ slash command trực tiếp, hãy tìm cách thực thi tương đương theo instructions.

## 4. Yêu cầu đối với Bộ tài liệu Planning
Phải sinh ra đầy đủ các file sau (nếu ngữ cảnh feature yêu cầu):

*   **`plan.md` (Bắt buộc):** Phương án triển khai kỹ thuật. Xác định technical approach, components, services, dependencies, data flow, testing strategy, risks, và technical considerations. Cần đủ chi tiết để làm đầu vào cho `/speckit.tasks`.
*   **`research.md` (Bắt buộc):** Kết quả nghiên cứu các câu hỏi kỹ thuật. Ghi nhận các giải pháp thay thế, lý do chọn công nghệ/thư viện/cách tiếp cận cụ thể cho feature này.
*   **`data-model.md` (Tạo nếu cần):** Mô hình dữ liệu. Định nghĩa các thay đổi về database schema, entities mới, relationships, hoặc cấu trúc NoSQL/cache liên quan trực tiếp đến tính năng.
*   **`contracts/` (Tạo nếu cần):** Chứa các file định nghĩa API (REST/gRPC), payload request/response, JSON schema, hoặc các hợp đồng giao tiếp giữa frontend-backend và các microservices.
*   **`quickstart.md` (Tạo nếu cần):** Hướng dẫn setup môi trường, cách chạy thử (run), test cục bộ tính năng này, hoặc các CLI commands cần thiết.

**Không tự ý:**
- Thêm Functional Requirements hoặc chức năng ngoài phạm vi feature 031.
- Tạo API hoặc database schema không có căn cứ từ `spec.md`.
- Tự đặt AI algorithm hoặc scoring formula nếu chưa được duyệt.
- Thay đổi công nghệ đã được dự án lựa chọn.
- Phân biệt rõ những gì đã tồn tại, những gì sẽ triển khai và những gì còn cần xác nhận.

## 5. Scope giới hạn
Chỉ được tạo hoặc cập nhật bộ tài liệu Planning của feature 031 theo Spec Kit workflow.
Không được:
- Lập Plan cho feature 032 trở đi hoặc toàn bộ Group 030.
- Chỉnh sửa group khác, `spec.md`, `tasks.md`, tài liệu project-level.
- Implement source code (frontend, backend, AI service, database).
- Commit hoặc push.
Trước khi làm việc, kiểm tra `git status` và bảo toàn tất cả thay đổi chưa commit.

## 6. Validation
Sau khi thực thi:
- Kiểm tra toàn bộ các file (`plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`) thuộc đúng feature 031.
- Kiểm tra tính nhất quán giữa các file trong bộ tài liệu và `spec.md`.
- Kiểm tra technical decisions có căn cứ.
- Chạy validation scripts theo Spec Kit workflow nếu có.
- Kiểm tra Git diff để bảo đảm không sửa file ngoài phạm vi.

## 7. Final Report
Báo cáo bằng Vietnamese:
1. Tên và đường dẫn feature 031 đã xác định.
2. `/speckit.plan` có thực sự được thực thi hay không.
3. Danh sách toàn bộ các file đã tạo hoặc cập nhật (`plan.md`, `research.md`, `data-model.md`, `contracts/`...).
4. Nội dung chính của từng file trong bộ tài liệu.
5. Các technical decisions đáng chú ý.
6. Validation results và những vấn đề cần clarification.
Completion criteria: Hoàn thành bộ tài liệu Implementation Plan (đủ các file yêu cầu) cho feature 031. Dừng lại và chờ review, không tự động chuyển feature.

CRITICAL REQUIREMENT: Dù quá trình trao đổi/hỏi đáp diễn ra bằng tiếng Việt, nội dung file tasks.md ĐỀU BẮT BUỘC phải viết 100% bằng tiếng Anh.
```

### Tóm tắt phản hồi của AI

- Vượt qua lỗi môi trường không chạy được bash script `setup-plan.sh` (do lỗi quyền tạo thư mục) bằng cách áp dụng quy trình tương đương để phân tích và tạo thủ công bộ tài liệu.
- Đã hoàn thiện toàn diện bộ tài liệu Planning cho tính năng 031:
  - Cập nhật `plan.md`: Đưa vào mục tiêu hiệu năng 300 ms p95 (lấy từ Vision Document) và bổ sung cấu trúc dự án hiện hành.
  - Tạo mới `research.md`: Ghi nhận các quyết định công nghệ, phương án thay thế và bằng chứng nghiên cứu từ repository.
  - Tạo mới `data-model.md`: Định nghĩa mô hình dữ liệu từ phía frontend (phân trang, lịch sử tìm kiếm, kiểu dữ liệu), không tự ý tạo thêm bảng hay migration mới.
  - Tạo mới `quickstart.md`: Viết hướng dẫn chạy frontend/backend, kiểm tra API, test phân trang và history.
  - Xác nhận `contracts/search-api.md` đã có sẵn, trỏ đúng endpoint `GET /api/v1/search` và cấu trúc Supabase.
- Ghi nhận rủi ro kỹ thuật: Mặc dù code có Supabase client, nhưng migration SQL hiện tại chỉ mới có bảng xác thực (auth). Schema của catalog chỉ mới nằm trên tài liệu, chưa được xác minh bằng file deployment thực tế. Do đó, yêu cầu phải xác minh bảng catalog trước khi lập trình.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do |
|---|---|---|
| Sử dụng workflow tương đương thay lệnh slash | Dùng | Khắc phục rào cản môi trường CLI để hoàn thành đúng yêu cầu tạo bộ tài liệu |
| Cập nhật `plan.md` và tạo thêm `research`, `data-model`, `quickstart` | Dùng | Phủ kín toàn bộ các khía cạnh kỹ thuật theo chuẩn framework Spec Kit |
| Không tự tạo database schema / migration mới | Dùng | Phản ánh tính trung thực và ngăn chặn rủi ro tự thiết kế vượt quyền khi thực tế DB chưa được deploy bảng catalog |
| Ghi nhận mục tiêu hiệu năng 300 ms p95 | Dùng | Đảm bảo đáp ứng ràng buộc phi chức năng (NFR) đã được đề ra từ tài liệu gốc (Vision Document) |

### Cách kiểm chứng

- [x] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt. Quá trình sinh bộ tài liệu đảm bảo không làm ảnh hưởng (overwrite) đến các chỉnh sửa đang có của những tính năng khác. Cần Product/DBA chốt và cung cấp migration schema thực tế của catalog để có thể triển khai tiếp.

## Mục 18: Lập Implementation Plan cho spec 032 bằng Spec Kit

| Trường | Nội dung | 
| ----- | ----- | 
| Ngày | 2026-11-07 | 
| Người thực hiện | Nguyễn Khánh Đăng | 
| Nhóm tính năng liên quan | 030 – Search, Feature 032: AI Lyrics Search | 
| Công cụ AI | GPT-5.6-Luna | 
| Mục đích | Khởi tạo toàn bộ bộ tài liệu Implementation Plan (gồm `plan.md`, `research.md`, `data-model.md`, `contracts/lyrics-search.md` và `quickstart.md`) cho tính năng AI Lyrics Search dựa trên quy trình chuẩn của Spec Kit, đảm bảo không tự ý quyết định các lỗ hổng hệ thống. | 

### Prompt đã dùng

```
/speckit-plan # TASK: Execute `/speckit.plan` cho Feature 032 Only

Bạn đang làm việc trong repository AuraTune.

Hãy sử dụng **Spec Kit `/speckit.plan`** để tạo bộ tài liệu Implementation Plan cho feature `032` thuộc Group 030 – Search.

**Chỉ lập Plan cho feature 032. Không xử lý feature khác.**

## 1. Xác định Feature 032
Kiểm tra:
- `specs/030-search/`
- Các thư mục và file con bên trong.
- `spec.md` của feature 032.
- Metadata và configuration liên quan.
Xác định chính xác tên feature và đường dẫn Spec Kit.
Nếu không tìm thấy feature 032 hoặc không xác định được context, hãy dừng lại và báo cáo. Không tự tạo feature thay thế.

## 2. Đọc tài liệu nguồn
Đọc các tài liệu cần thiết:
- `docs/management/speckit-workflow-guide.md`
- `docs/management/team-contract.md`
- `docs/proposal/Auratune_Vision_Document.md`
- `docs/proposal/project_plan.md`
- `docs/proposal/proposal.md`
- Toàn bộ tài liệu thuộc feature 032.
- Các tài liệu kiến trúc và source code liên quan trực tiếp đến feature 032.
Kiểm tra `.specify/` và `.agents/` để hiểu instructions, templates và workflow của Spec Kit.

## 3. Thực thi `/speckit.plan`
Sau khi xác định đúng feature context:
1. Chọn feature 032 làm context hiện hành.
2. Thực thi `/speckit.plan`.
3. Sử dụng nội dung `spec.md` và thông tin kiến trúc thực tế của AuraTune làm đầu vào.
4. Tuân thủ instructions, template và conventions của repository.
5. Tạo hoặc cập nhật **toàn bộ bộ tài liệu planning** đúng vị trí mà Spec Kit quy định, bao gồm: `plan.md`, `research.md`, `data-model.md`, `contracts/`, và `quickstart.md`.
Không tự viết thủ công thay cho Spec Kit command. Nếu môi trường không hỗ trợ slash command trực tiếp, hãy tìm cách thực thi tương đương theo instructions.

## 4. Yêu cầu đối với Bộ tài liệu Planning
Phải sinh ra đầy đủ các file sau (nếu ngữ cảnh feature yêu cầu):

*   **`plan.md` (Bắt buộc):** Phương án triển khai kỹ thuật. Xác định technical approach, components, services, dependencies, data flow, testing strategy, risks, và technical considerations. Cần đủ chi tiết để làm đầu vào cho `/speckit.tasks`.
*   **`research.md` (Bắt buộc):** Kết quả nghiên cứu các câu hỏi kỹ thuật. Ghi nhận các giải pháp thay thế, lý do chọn công nghệ/thư viện/cách tiếp cận cụ thể cho feature này.
*   **`data-model.md` (Tạo nếu cần):** Mô hình dữ liệu. Định nghĩa các thay đổi về database schema, entities mới, relationships, hoặc cấu trúc NoSQL/cache liên quan trực tiếp đến tính năng.
*   **`contracts/` (Tạo nếu cần):** Chứa các file định nghĩa API (REST/gRPC), payload request/response, JSON schema, hoặc các hợp đồng giao tiếp giữa frontend-backend và các microservices.
*   **`quickstart.md` (Tạo nếu cần):** Hướng dẫn setup môi trường, cách chạy thử (run), test cục bộ tính năng này, hoặc các CLI commands cần thiết.

**Không tự ý:**
- Thêm Functional Requirements hoặc chức năng ngoài phạm vi feature 032.
- Tạo API hoặc database schema không có căn cứ từ `spec.md`.
- Tự đặt AI algorithm hoặc scoring formula nếu chưa được duyệt.
- Thay đổi công nghệ đã được dự án lựa chọn.
- Phân biệt rõ những gì đã tồn tại, những gì sẽ triển khai và những gì còn cần xác nhận.

## 5. Scope giới hạn
Chỉ được tạo hoặc cập nhật bộ tài liệu Planning của feature 032 theo Spec Kit workflow.
Không được:
- Lập Plan cho feature 032 trở đi hoặc toàn bộ Group 030.
- Chỉnh sửa group khác, `spec.md`, `tasks.md`, tài liệu project-level.
- Implement source code (frontend, backend, AI service, database).
- Commit hoặc push.
Trước khi làm việc, kiểm tra `git status` và bảo toàn tất cả thay đổi chưa commit.

## 6. Validation
Sau khi thực thi:
- Kiểm tra toàn bộ các file (`plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`) thuộc đúng feature 032.
- Kiểm tra tính nhất quán giữa các file trong bộ tài liệu và `spec.md`.
- Kiểm tra technical decisions có căn cứ.
- Chạy validation scripts theo Spec Kit workflow nếu có.
- Kiểm tra Git diff để bảo đảm không sửa file ngoài phạm vi.

## 7. Final Report
Báo cáo bằng Vietnamese:
1. Tên và đường dẫn feature 032 đã xác định.
2. `/speckit.plan` có thực sự được thực thi hay không.
3. Danh sách toàn bộ các file đã tạo hoặc cập nhật (`plan.md`, `research.md`, `data-model.md`, `contracts/`...).
4. Nội dung chính của từng file trong bộ tài liệu.
5. Các technical decisions đáng chú ý.
6. Validation results và những vấn đề cần clarification.
Completion criteria: Hoàn thành bộ tài liệu Implementation Plan (đủ các file yêu cầu) cho feature 032. Dừng lại và chờ review, không tự động chuyển feature.

CRITICAL REQUIREMENT: Dù quá trình trao đổi/hỏi đáp diễn ra bằng tiếng Việt, nội dung file tasks.md ĐỀU BẮT BUỘC phải viết 100% bằng tiếng Anh.
```

### Tóm tắt phản hồi của AI

* Vượt qua sự cố môi trường không cho phép thực thi bash script `setup-plan.sh` bằng cách áp dụng quy trình thủ công tương đương để điều hướng bối cảnh (context) về đúng `032-ai-lyrics-search`.

* Đã hoàn thiện toàn diện bộ tài liệu Planning cho tính năng 032, bảo lưu toàn bộ các thay đổi chưa commit của những tính năng khác.

* Cập nhật `plan.md`: Đặt ngưỡng thời gian chờ AI là 3 giây (theo bản làm rõ FR-008), ghi nhận nội dung 5 giây còn sót lại trong spec là một mâu thuẫn cần Product Owner giải quyết.

* Tạo mới `research.md`: Phân tích căn cứ từ API contract và source hiện tại, liệt kê rõ các quyết định đã bị loại trừ.

* Tạo mới `data-model.md`: Định hình mô hình logic và trạng thái (không đề xuất tạo schema mới vì chưa được duyệt).

* Tạo mới `contracts/lyrics-search.md`: Ghi nhận contract một phần, phơi bày sự mâu thuẫn giữa đường dẫn `GET /search/lyrics` công khai và `POST /ai/search/lyrics` nội bộ.

* Tạo mới `quickstart.md`: Hướng dẫn kiểm thử và chạy ứng dụng sau khi hệ thống backend hoàn thiện.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do | 
| ----- | ----- | ----- | 
| Sử dụng workflow thủ công tương đương thay bash script | Dùng | Khắc phục được rào cản từ hệ điều hành để hoàn thành trọn vẹn yêu cầu sinh artifact theo chuẩn framework Spec Kit | 
| Phơi bày mâu thuẫn API và timeout vào file hợp đồng và plan | Dùng | Phản ánh trung thực tình trạng thiếu nhất quán giữa các tài liệu dự án, ngăn rủi ro lập trình viên code sai hợp đồng API | 
| Không tự đặt nhà cung cấp AI (Provider), schema, thuật toán | Dùng | Đảm bảo giới hạn hệ thống (scope boundary), tôn trọng nguyên tắc không tự thiết kế kiến trúc lõi khi chưa được cấp quyền | 

### Cách kiểm chứng

- [x] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt. Quá trình làm việc không ghi đè hay làm hỏng các thay đổi chưa commit của các tính năng khác.

## Mục 19: Lập Implementation Plan cho spec 033 bằng Spec Kit

| Trường | Nội dung | 
| ----- | ----- | 
| Ngày | 2026-11-07 | 
| Người thực hiện | Nguyễn Khánh Đăng | 
| Nhóm tính năng liên quan | 030 – Search, Feature 033: Semantic Vector Music Search | 
| Công cụ AI | GPT-5.6-Luna | 
| Mục đích | Khởi tạo toàn bộ bộ tài liệu Implementation Plan cho tính năng Semantic Vector Music Search dựa trên quy trình chuẩn của Spec Kit, cập nhật phương án xử lý lỗi mâu thuẫn timeout 1.500 ms / 3.000 ms. | 

### Prompt đã dùng

```
/speckit-plan # TASK: Execute `/speckit.plan` cho Feature 033 Only

Bạn đang làm việc trong repository AuraTune.

Hãy sử dụng **Spec Kit `/speckit.plan`** để tạo bộ tài liệu Implementation Plan cho feature `033` thuộc Group 030 – Search.

**Chỉ lập Plan cho feature 033. Không xử lý feature khác.**

## 1. Xác định Feature 033
Kiểm tra:
- `specs/030-search/`
- Các thư mục và file con bên trong.
- `spec.md` của feature 033.
- Metadata và configuration liên quan.
Xác định chính xác tên feature và đường dẫn Spec Kit.
Nếu không tìm thấy feature 033 hoặc không xác định được context, hãy dừng lại và báo cáo. Không tự tạo feature thay thế.

## 2. Đọc tài liệu nguồn
Đọc các tài liệu cần thiết:
- `docs/management/speckit-workflow-guide.md`
- `docs/management/team-contract.md`
- `docs/proposal/Auratune_Vision_Document.md`
- `docs/proposal/project_plan.md`
- `docs/proposal/proposal.md`
- Toàn bộ tài liệu thuộc feature 033.
- Các tài liệu kiến trúc và source code liên quan trực tiếp đến feature 033.
Kiểm tra `.specify/` và `.agents/` để hiểu instructions, templates và workflow của Spec Kit.

## 3. Thực thi `/speckit.plan`
Sau khi xác định đúng feature context:
1. Chọn feature 033 làm context hiện hành.
2. Thực thi `/speckit.plan`.
3. Sử dụng nội dung `spec.md` và thông tin kiến trúc thực tế của AuraTune làm đầu vào.
4. Tuân thủ instructions, template và conventions của repository.
5. Tạo hoặc cập nhật **toàn bộ bộ tài liệu planning** đúng vị trí mà Spec Kit quy định, bao gồm: `plan.md`, `research.md`, `data-model.md`, `contracts/`, và `quickstart.md`.
Không tự viết thủ công thay cho Spec Kit command. Nếu môi trường không hỗ trợ slash command trực tiếp, hãy tìm cách thực thi tương đương theo instructions.

## 4. Yêu cầu đối với Bộ tài liệu Planning
Phải sinh ra đầy đủ các file sau (nếu ngữ cảnh feature yêu cầu):

*   **`plan.md` (Bắt buộc):** Phương án triển khai kỹ thuật. Xác định technical approach, components, services, dependencies, data flow, testing strategy, risks, và technical considerations. Cần đủ chi tiết để làm đầu vào cho `/speckit.tasks`.
*   **`research.md` (Bắt buộc):** Kết quả nghiên cứu các câu hỏi kỹ thuật. Ghi nhận các giải pháp thay thế, lý do chọn công nghệ/thư viện/cách tiếp cận cụ thể cho feature này.
*   **`data-model.md` (Tạo nếu cần):** Mô hình dữ liệu. Định nghĩa các thay đổi về database schema, entities mới, relationships, hoặc cấu trúc NoSQL/cache liên quan trực tiếp đến tính năng.
*   **`contracts/` (Tạo nếu cần):** Chứa các file định nghĩa API (REST/gRPC), payload request/response, JSON schema, hoặc các hợp đồng giao tiếp giữa frontend-backend và các microservices.
*   **`quickstart.md` (Tạo nếu cần):** Hướng dẫn setup môi trường, cách chạy thử (run), test cục bộ tính năng này, hoặc các CLI commands cần thiết.

**Không tự ý:**
- Thêm Functional Requirements hoặc chức năng ngoài phạm vi feature 033.
- Tạo API hoặc database schema không có căn cứ từ `spec.md`.
- Tự đặt AI algorithm hoặc scoring formula nếu chưa được duyệt.
- Thay đổi công nghệ đã được dự án lựa chọn.
- Phân biệt rõ những gì đã tồn tại, những gì sẽ triển khai và những gì còn cần xác nhận.

## 5. Scope giới hạn
Chỉ được tạo hoặc cập nhật bộ tài liệu Planning của feature 033 theo Spec Kit workflow.
Không được:
- Lập Plan cho feature 033 trở đi hoặc toàn bộ Group 030.
- Chỉnh sửa group khác, `spec.md`, `tasks.md`, tài liệu project-level.
- Implement source code (frontend, backend, AI service, database).
- Commit hoặc push.
Trước khi làm việc, kiểm tra `git status` và bảo toàn tất cả thay đổi chưa commit.

## 6. Validation
Sau khi thực thi:
- Kiểm tra toàn bộ các file (`plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`) thuộc đúng feature 033.
- Kiểm tra tính nhất quán giữa các file trong bộ tài liệu và `spec.md`.
- Kiểm tra technical decisions có căn cứ.
- Chạy validation scripts theo Spec Kit workflow nếu có.
- Kiểm tra Git diff để bảo đảm không sửa file ngoài phạm vi.

## 7. Final Report
Báo cáo bằng Vietnamese:
1. Tên và đường dẫn feature 033 đã xác định.
2. `/speckit.plan` có thực sự được thực thi hay không.
3. Danh sách toàn bộ các file đã tạo hoặc cập nhật (`plan.md`, `research.md`, `data-model.md`, `contracts/`...).
4. Nội dung chính của từng file trong bộ tài liệu.
5. Các technical decisions đáng chú ý.
6. Validation results và những vấn đề cần clarification.
Completion criteria: Hoàn thành bộ tài liệu Implementation Plan (đủ các file yêu cầu) cho feature 033. Dừng lại và chờ review, không tự động chuyển feature.

CRITICAL REQUIREMENT: Dù quá trình trao đổi/hỏi đáp diễn ra bằng tiếng Việt, nội dung file tasks.md ĐỀU BẮT BUỘC phải viết 100% bằng tiếng Anh.
```

### Tóm tắt phản hồi của AI

*   **Quy trình:** Script `setup-plan.sh` gặp lỗi do hạn chế của môi trường Git Bash, nên hệ thống đã thực thi tương đương bằng cách rà soát thủ công toàn bộ spec và kiến trúc. Không làm ảnh hưởng đến các thay đổi chưa commit ở những tính năng khác.
*   **Điểm mù kỹ thuật & Xung đột:** Đã kiểm tra kiến trúc codebase hiện tại của backend và frontend, đối chiếu với tài liệu `api-contract.md` cũng như các file kế hoạch hệ thống (`project_plan.md`). Đã chỉ ra những lỗ hổng như mâu thuẫn giữa 1.500 ms với 3.000 ms ở mốc timeout, vị trí đánh giá tính điểm, cấu trúc vector DB và API. 
*   **Bộ tài liệu Planning:** Toàn bộ file đã được kiểm tra (bao gồm `plan.md`, `research.md`, `data-model.md`, `quickstart.md` và `contracts/`) và được điều chỉnh nhất quán với các yêu cầu dự án.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do | 
| ----- | ----- | ----- | 
| Sử dụng luồng phân tích tương đương thay vì slash command | Dùng | Khắc phục rào cản lỗi permission của Git Bash mà vẫn sinh ra bộ file chuẩn theo framework | 
| Giữ nguyên các mâu thuẫn cấu trúc và timeout thành "Blocker" | Dùng | Ngăn chặn rủi ro tự thiết kế vượt quyền khi các quyết định quan trọng (như Vector DB hay provider AI) chưa được chốt | 
| Bảo toàn thư mục và file khác không thuộc feature 033 | Dùng | Tôn trọng ranh giới (scope) làm việc, tránh đụng độ (conflict) mã nguồn và tài liệu hiện tại | 

### Cách kiểm chứng

- [x] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt. Bộ tài liệu `plan.md` cho Semantic Vector Search đã được rà soát và cấu trúc chặt chẽ.

## Mục 20: Lập Implementation Plan cho spec 081 bằng Spec Kit

| Trường | Nội dung | 
| ----- | ----- | 
| Ngày | 2026-11-07 | 
| Người thực hiện | Nguyễn Khánh Đăng | 
| Nhóm tính năng liên quan | 080 – Album Interaction, Feature 081: Album Details | 
| Công cụ AI | GPT-6-Luna | 
| Mục đích | Tạo Implementation Plan (`plan.md`) cho tính năng xem chi tiết Album (Feature 081), tuân thủ đúng quy trình Spec Kit, đảm bảo không vượt quyền thiết kế kiến trúc và chỉ giới hạn thao tác trong phạm vi thư mục feature. | 

### Prompt đã dùng

```text
/speckit-plan # TASK: Execute `/speckit.plan` for Feature 081 Only

Bạn đang làm việc trong repository AuraTune.

Hãy sử dụng **Spec Kit `/speckit.plan`** để tạo Implementation Plan cho feature `081` thuộc Group 080 – Album Interaction.

**Chỉ lập Plan cho feature 081. Không xử lý feature khác.**

## 1. Xác định Feature 081
Kiểm tra:
- `specs/080-album-interaction/`
- Các thư mục và file con bên trong.
- `spec.md` của feature 081.
- Metadata và configuration liên quan.
Xác định chính xác tên feature và đường dẫn Spec Kit.
Nếu không tìm thấy feature 081 hoặc không xác định được context, hãy dừng lại và báo cáo. Không tự tạo feature thay thế.

## 2. Đọc tài liệu nguồn
Đọc các tài liệu cần thiết:
- `docs/management/speckit-workflow-guide.md`
- `docs/management/team-contract.md`
- `docs/proposal/Auratune_Vision_Document.md`
- `docs/proposal/project_plan.md`
- `docs/proposal/proposal.md`
- Toàn bộ tài liệu thuộc feature 081.
- Các tài liệu kiến trúc và source code liên quan trực tiếp đến feature 081.
Kiểm tra `.specify/` và `.agents/` để hiểu instructions, templates và workflow của Spec Kit.

## 3. Thực thi `/speckit.plan`
Sau khi xác định đúng feature context:
1. Chọn feature 081 làm context hiện hành.
2. Thực thi `/speckit.plan`.
3. Sử dụng nội dung `spec.md` và thông tin kiến trúc thực tế của AuraTune làm đầu vào.
4. Tuân thủ instructions, template và conventions của repository.
5. Tạo hoặc cập nhật `plan.md` đúng vị trí mà Spec Kit quy định.
Không tự viết Plan thủ công thay cho Spec Kit command.
Nếu môi trường không hỗ trợ slash command trực tiếp, hãy tìm cách thực thi tương đương theo instructions chính thức trong repository. Báo cáo trung thực nếu không thể thực thi.

## 4. Yêu cầu đối với Plan
Plan cần:
- Bám sát requirements của feature 081 trong `spec.md`.
- Phản ánh kiến trúc hiện tại của AuraTune.
- Xác định technical approach.
- Xác định các component và service liên quan.
- Xác định dependencies.
- Mô tả data flow và integration nếu cần.
- Xác định testing strategy.
- Xác định risks và technical considerations.
- Có đủ thông tin để tiếp tục tạo tasks bằng `/speckit.tasks`.
Không tự ý:
- Thêm Functional Requirements.
- Thêm chức năng ngoài phạm vi feature 081.
- Tạo API hoặc database schema không có căn cứ.
- Tự đặt AI algorithm hoặc scoring formula.
- Thay đổi công nghệ đã được dự án lựa chọn.
- Đưa chức năng của Group khác vào Group 080.
Phân biệt rõ những gì đã tồn tại, những gì sẽ triển khai và những gì còn cần xác nhận.

## 5. Scope giới hạn
Chỉ được tạo hoặc cập nhật Plan của feature 081 theo Spec Kit workflow.
Không được:
- Lập Plan cho feature 081 trở đi.
- Lập Plan cho toàn bộ Group 080.
- Chỉnh sửa group khác.
- Chỉnh sửa `spec.md`.
- Chỉnh sửa `tasks.md`.
- Implement source code.
- Thay đổi frontend, backend, AI service hoặc database.
- Chỉnh sửa tài liệu project-level.
- Commit hoặc push.
Trước khi làm việc, kiểm tra `git status` và bảo toàn tất cả thay đổi chưa commit.

## 6. Validation
Sau khi thực thi `/speckit.plan`:
- Kiểm tra Plan thuộc đúng feature 081.
- Kiểm tra tính nhất quán với `spec.md`.
- Kiểm tra technical decisions có căn cứ.
- Kiểm tra dependencies và testing strategy.
- Kiểm tra Plan có thể tiếp tục sử dụng cho `/speckit.tasks`.
- Chạy validation scripts theo Spec Kit workflow nếu có.
- Kiểm tra Git diff để bảo đảm không sửa file ngoài phạm vi.
Nếu phát hiện vấn đề trong `spec.md`, chỉ ghi nhận, không tự ý sửa.

## 7. Final Report
Báo cáo bằng Vietnamese:
1. Tên và đường dẫn feature 081 đã xác định.
2. `/speckit.plan` có thực sự được thực thi hay không.
3. File Plan đã tạo hoặc cập nhật.
4. Nội dung chính của Plan.
5. Các technical decisions đáng chú ý.
6. Validation results.
7. Những vấn đề cần clarification.
8. Danh sách file đã thay đổi.
Completion criteria: Chỉ tạo Implementation Plan cho feature 081 bằng Spec Kit `/speckit.plan`. Sau khi hoàn thành, dừng lại và chờ review, không tự động chuyển sang feature tiếp theo.
```

### Tóm tắt phản hồi của AI

* AI đã phát hiện ra môi trường không hỗ trợ lệnh CLI `speckit.plan` hoặc bash shell, nên đã áp dụng quy trình (workflow) tương đương dựa trên template và hướng dẫn của dự án để tạo thủ công file `plan.md` cho feature `081-album-details`.
* Bản kế hoạch bám sát các luồng nghiệp vụ của Feature 081: bảo lưu contract `GET /albums/:id`, tính toán thời lượng dựa trên toàn bộ track và xử lý đúng các trạng thái giao diện (loading, not-found, error, cache).
* AI đã rà soát source code hiện tại (frontend và backend) và ghi nhận vào phần "Open Clarifications" một số rủi ro tích hợp:
  * Hiện tại route album ở backend chưa được implement (`server.js` chỉ mới có route health/auth).
  * Trang `AlbumPage.jsx` phía frontend đang đọc dữ liệu mock đồng bộ thay vì gọi API thực tế.
* AI đã bảo toàn không gian làm việc (working tree): không sửa file `.specify/feature.json`, không chỉnh sửa các file thuộc tính năng khác hay tài liệu cốt lõi, không sinh thêm các bản nháp (design artifact) dư thừa như hướng dẫn gốc của skill.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do | 
| ----- | ----- | ----- | 
| Sử dụng workflow tương đương để tạo `plan.md` | Dùng | Đáp ứng đúng yêu cầu sinh file Plan khi công cụ CLI không khả dụng do lỗi môi trường. | 
| Giữ nguyên API Contract `GET /albums/:id` | Dùng | Tuân thủ nghiêm ngặt ranh giới scope, không tự ý thêm endpoint hay schema khi chưa được System Architect phê duyệt. | 
| Đưa việc tích hợp backend thiếu route vào Open Clarifications | Dùng | Phản ánh trung thực tình trạng source code thực tế để team Backend và Frontend có thể chốt giao thức trước khi tạo tasks. | 
| Bỏ qua các design artifacts bổ sung (research.md, data-model.md) | Dùng | Đảm bảo tuân thủ giới hạn cực kỳ khắt khe của prompt: "Chỉ lập Plan cho feature 081". | 

### Cách kiểm chứng

- [x] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt.

**Ghi chú:** Implementation Plan đã được tạo thành công tại `specs/080-album-interaction/081-album-details/plan.md`. Sẵn sàng để chuyển sang bước tạo task (`/speckit.tasks`) sau khi các điểm clarification về backend được team xác nhận.

## Mục 21: Lập Implementation Plan cho spec 082 bằng Spec Kit

| Trường | Nội dung |
|---|---|
| Ngày | 2026-11-07 |
| Người thực hiện | Nguyễn Khánh Đăng |
| Nhóm tính năng liên quan | 080 – Album Interaction, Feature 082: Album Tracklist Playback |
| Công cụ AI | GPT-6-Luna |
| Mục đích | Tạo Implementation Plan (`plan.md`) cho tính năng phát danh sách bài hát trong Album (Feature 082), tuân thủ đúng quy trình Spec Kit, tích hợp với Player/Queue và ghi nhận các mâu thuẫn trong tài liệu đặc tả. |

### Prompt đã dùng

```text
/speckit-plan # TASK: Execute `/speckit.plan` for Feature 082 Only

Bạn đang làm việc trong repository AuraTune.

Hãy sử dụng **Spec Kit `/speckit.plan`** để tạo Implementation Plan cho feature `082` thuộc Group 080 – Album Interaction.

**Chỉ lập Plan cho feature 082. Không xử lý feature khác.**

## 1. Xác định Feature 082
Kiểm tra:
- `specs/080-album-interaction/`
- Các thư mục và file con bên trong.
- `spec.md` của feature 082.
- Metadata và configuration liên quan.
Xác định chính xác tên feature và đường dẫn Spec Kit.
Nếu không tìm thấy feature 082 hoặc không xác định được context, hãy dừng lại và báo cáo. Không tự tạo feature thay thế.

## 2. Đọc tài liệu nguồn
Đọc các tài liệu cần thiết:
- `docs/management/speckit-workflow-guide.md`
- `docs/management/team-contract.md`
- `docs/proposal/Auratune_Vision_Document.md`
- `docs/proposal/project_plan.md`
- `docs/proposal/proposal.md`
- Toàn bộ tài liệu thuộc feature 082.
- Các tài liệu kiến trúc và source code liên quan trực tiếp đến feature 082.
Kiểm tra `.specify/` và `.agents/` để hiểu instructions, templates và workflow của Spec Kit.

## 3. Thực thi `/speckit.plan`
Sau khi xác định đúng feature context:
1. Chọn feature 082 làm context hiện hành.
2. Thực thi `/speckit.plan`.
3. Sử dụng nội dung `spec.md` và thông tin kiến trúc thực tế của AuraTune làm đầu vào.
4. Tuân thủ instructions, template và conventions của repository.
5. Tạo hoặc cập nhật `plan.md` đúng vị trí mà Spec Kit quy định.
Không tự viết Plan thủ công thay cho Spec Kit command.
Nếu môi trường không hỗ trợ slash command trực tiếp, hãy tìm cách thực thi tương đương theo instructions chính thức trong repository. Báo cáo trung thực nếu không thể thực thi.

## 4. Yêu cầu đối với Plan
Plan cần:
- Bám sát requirements của feature 082 trong `spec.md`.
- Phản ánh kiến trúc hiện tại của AuraTune.
- Xác định technical approach.
- Xác định các component và service liên quan.
- Xác định dependencies.
- Mô tả data flow và integration nếu cần.
- Xác định testing strategy.
- Xác định risks và technical considerations.
- Có đủ thông tin để tiếp tục tạo tasks bằng `/speckit.tasks`.
Không tự ý:
- Thêm Functional Requirements.
- Thêm chức năng ngoài phạm vi feature 082.
- Tạo API hoặc database schema không có căn cứ.
- Tự đặt AI algorithm hoặc scoring formula.
- Thay đổi công nghệ đã được dự án lựa chọn.
- Đưa chức năng của Group khác vào Group 080.
Phân biệt rõ những gì đã tồn tại, những gì sẽ triển khai và những gì còn cần xác nhận.

## 5. Scope giới hạn
Chỉ được tạo hoặc cập nhật Plan của feature 082 theo Spec Kit workflow.
Không được:
- Lập Plan cho feature 082 trở đi.
- Lập Plan cho toàn bộ Group 080.
- Chỉnh sửa group khác.
- Chỉnh sửa `spec.md`.
- Chỉnh sửa `tasks.md`.
- Implement source code.
- Thay đổi frontend, backend, AI service hoặc database.
- Chỉnh sửa tài liệu project-level.
- Commit hoặc push.
Trước khi làm việc, kiểm tra `git status` và bảo toàn tất cả thay đổi chưa commit.

## 6. Validation
Sau khi thực thi `/speckit.plan`:
- Kiểm tra Plan thuộc đúng feature 082.
- Kiểm tra tính nhất quán với `spec.md`.
- Kiểm tra technical decisions có căn cứ.
- Kiểm tra dependencies và testing strategy.
- Kiểm tra Plan có thể tiếp tục sử dụng cho `/speckit.tasks`.
- Chạy validation scripts theo Spec Kit workflow nếu có.
- Kiểm tra Git diff để bảo đảm không sửa file ngoài phạm vi.
Nếu phát hiện vấn đề trong `spec.md`, chỉ ghi nhận, không tự ý sửa.

## 7. Final Report
Báo cáo bằng Vietnamese:
1. Tên và đường dẫn feature 082 đã xác định.
2. `/speckit.plan` có thực sự được thực thi hay không.
3. File Plan đã tạo hoặc cập nhật.
4. Nội dung chính của Plan.
5. Các technical decisions đáng chú ý.
6. Validation results.
7. Những vấn đề cần clarification.
8. Danh sách file đã thay đổi.
Completion criteria: Chỉ tạo Implementation Plan cho feature 082 bằng Spec Kit `/speckit.plan`. Sau khi hoàn thành, dừng lại và chờ review, không tự động chuyển sang feature tiếp theo.
```

### Tóm tắt phản hồi của AI

- AI tiếp tục áp dụng quy trình tương đương để tạo thủ công file `plan.md` cho feature `082-album-tracklist` do lỗi permission của script bash trong môi trường.
- Kế hoạch triển khai bám sát việc sử dụng tracklist đầy đủ, tích hợp hành động Play Album và phát track cụ thể với player/queue hiện có, đồng thời xử lý các trường hợp track không khả dụng, album dài và duy trì trạng thái player khi chuyển trang.
- AI đã đối chiếu kỹ lưỡng tài liệu và phát hiện hai mâu thuẫn lớn cần đưa vào Open Clarifications:
  - **Mâu thuẫn Queue Handling:** Bản thân file đặc tả (`FR-004` và một acceptance scenario) yêu cầu thao tác Play Album sẽ "thay thế queue", trong khi phần clarification lại chốt là "chèn phần còn lại sau track hiện tại" (giữ queue cũ). Plan đã chọn giữ hành vi clarification làm căn cứ chính nhưng ghi chú rõ sự mâu thuẫn này.
  - **Mâu thuẫn giới hạn hệ thống:** Spec yêu cầu hỗ trợ album dài hơn 100 bài, nhưng tài liệu của Group 050 lại quy định giới hạn queue chỉ chứa tối đa 50 bài.
- AI đã bảo toàn tuyệt đối các file ngoài phạm vi, bao gồm `AI_log_3.md` (đang sửa) và `plan.md` của feature 081.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do |
|---|---|---|
| Sử dụng workflow tương đương để tạo `plan.md` | Dùng | Vượt qua hạn chế của môi trường CLI để đáp ứng yêu cầu tạo Plan. |
| Chọn hành vi "chèn queue" làm Technical Approach | Dùng | Ưu tiên quyết định cuối cùng ở phần Clarification, nhưng vẫn đảm bảo tính minh bạch bằng cách báo cáo lại mâu thuẫn với FR gốc. |
| Ghi nhận xung đột độ dài Queue | Dùng | Rất quan trọng để chặn lỗi tích hợp hệ thống (System Integration) trước khi code thực tế giữa Group 080 và Group 050. |
| Không tự ý sửa `spec.md` hay `tasks.md` | Dùng | Tuân thủ tuyệt đối quy tắc của Spec Kit, chỉ đóng vai trò phân tích và lên kế hoạch chứ không tự tiện thay đổi đặc tả. |

### Cách kiểm chứng

- [x] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt. 

**Ghi chú:** Implementation Plan đã được tạo thành công tại `specs/080-album-interaction/082-album-tracklist/plan.md`. Sẵn sàng để chuyển sang bước tạo task (`/speckit.tasks`) sau khi Product/Design chốt phương án xử lý mâu thuẫn hàng đợi.

## Mục 22: Lập Implementation Plan cho spec 083 bằng Spec Kit

| Trường | Nội dung | 
| ----- | ----- | 
| Ngày | 2026-11-07 | 
| Người thực hiện | Nguyễn Khánh Đăng | 
| Nhóm tính năng liên quan | 080 – Album Interaction, Feature 083: Save and Share Album | 
| Công cụ AI | GPT-6-Luna | 
| Mục đích | Tạo Implementation Plan (`plan.md`) cho tính năng Lưu và Chia sẻ Album (Feature 083), tuân thủ Spec Kit, bảo đảm tính đồng bộ với trạng thái tài khoản và chỉ rõ các route backend còn thiếu. | 

### Prompt đã dùng

```text
/speckit-plan # TASK: Execute `/speckit.plan` for Feature 083 Only

Bạn đang làm việc trong repository AuraTune.

Hãy sử dụng **Spec Kit `/speckit.plan`** để tạo Implementation Plan cho feature `083` thuộc Group 080 – Album Interaction.

**Chỉ lập Plan cho feature 083. Không xử lý feature khác.**

## 1. Xác định Feature 083
Kiểm tra:
- `specs/080-album-interaction/`
- Các thư mục và file con bên trong.
- `spec.md` của feature 083.
- Metadata và configuration liên quan.
Xác định chính xác tên feature và đường dẫn Spec Kit.
Nếu không tìm thấy feature 083 hoặc không xác định được context, hãy dừng lại và báo cáo. Không tự tạo feature thay thế.

## 2. Đọc tài liệu nguồn
Đọc các tài liệu cần thiết:
- `docs/management/speckit-workflow-guide.md`
- `docs/management/team-contract.md`
- `docs/proposal/Auratune_Vision_Document.md`
- `docs/proposal/project_plan.md`
- `docs/proposal/proposal.md`
- Toàn bộ tài liệu thuộc feature 083.
- Các tài liệu kiến trúc và source code liên quan trực tiếp đến feature 083.
Kiểm tra `.specify/` và `.agents/` để hiểu instructions, templates và workflow của Spec Kit.

## 3. Thực thi `/speckit.plan`
Sau khi xác định đúng feature context:
1. Chọn feature 083 làm context hiện hành.
2. Thực thi `/speckit.plan`.
3. Sử dụng nội dung `spec.md` và thông tin kiến trúc thực tế của AuraTune làm đầu vào.
4. Tuân thủ instructions, template và conventions của repository.
5. Tạo hoặc cập nhật `plan.md` đúng vị trí mà Spec Kit quy định.
Không tự viết Plan thủ công thay cho Spec Kit command.
Nếu môi trường không hỗ trợ slash command trực tiếp, hãy tìm cách thực thi tương đương theo instructions chính thức trong repository. Báo cáo trung thực nếu không thể thực thi.

## 4. Yêu cầu đối với Plan
Plan cần:
- Bám sát requirements của feature 083 trong `spec.md`.
- Phản ánh kiến trúc hiện tại của AuraTune.
- Xác định technical approach.
- Xác định các component và service liên quan.
- Xác định dependencies.
- Mô tả data flow và integration nếu cần.
- Xác định testing strategy.
- Xác định risks và technical considerations.
- Có đủ thông tin để tiếp tục tạo tasks bằng `/speckit.tasks`.
Không tự ý:
- Thêm Functional Requirements.
- Thêm chức năng ngoài phạm vi feature 083.
- Tạo API hoặc database schema không có căn cứ.
- Tự đặt AI algorithm hoặc scoring formula.
- Thay đổi công nghệ đã được dự án lựa chọn.
- Đưa chức năng của Group khác vào Group 080.
Phân biệt rõ những gì đã tồn tại, những gì sẽ triển khai và những gì còn cần xác nhận.

## 5. Scope giới hạn
Chỉ được tạo hoặc cập nhật Plan của feature 083 theo Spec Kit workflow.
Không được:
- Lập Plan cho feature 083 trở đi.
- Lập Plan cho toàn bộ Group 080.
- Chỉnh sửa group khác.
- Chỉnh sửa `spec.md`.
- Chỉnh sửa `tasks.md`.
- Implement source code.
- Thay đổi frontend, backend, AI service hoặc database.
- Chỉnh sửa tài liệu project-level.
- Commit hoặc push.
Trước khi làm việc, kiểm tra `git status` và bảo toàn tất cả thay đổi chưa commit.

## 6. Validation
Sau khi thực thi `/speckit.plan`:
- Kiểm tra Plan thuộc đúng feature 083.
- Kiểm tra tính nhất quán với `spec.md`.
- Kiểm tra technical decisions có căn cứ.
- Kiểm tra dependencies và testing strategy.
- Kiểm tra Plan có thể tiếp tục sử dụng cho `/speckit.tasks`.
- Chạy validation scripts theo Spec Kit workflow nếu có.
- Kiểm tra Git diff để bảo đảm không sửa file ngoài phạm vi.
Nếu phát hiện vấn đề trong `spec.md`, chỉ ghi nhận, không tự ý sửa.

## 7. Final Report
Báo cáo bằng Vietnamese:
1. Tên và đường dẫn feature 083 đã xác định.
2. `/speckit.plan` có thực sự được thực thi hay không.
3. File Plan đã tạo hoặc cập nhật.
4. Nội dung chính của Plan.
5. Các technical decisions đáng chú ý.
6. Validation results.
7. Những vấn đề cần clarification.
8. Danh sách file đã thay đổi.
Completion criteria: Chỉ tạo Implementation Plan cho feature 083 bằng Spec Kit `/speckit.plan`. Sau khi hoàn thành, dừng lại và chờ review, không tự động chuyển sang feature tiếp theo.
```

### Tóm tắt phản hồi của AI

* AI tiếp tục phát hiện lỗi môi trường không cho phép chạy bash script (`setup-plan.sh`) nên đã chủ động áp dụng workflow tương đương để tạo thủ công file `plan.md` cho feature `083-save-and-share-album`.
* Kế hoạch triển khai định hình các phương pháp kỹ thuật (technical approach) bám sát tài liệu đặc tả: quản lý API `PUT` và `DELETE` để lưu/bỏ lưu, xử lý UI state (loading/pending, error feedback) và các logic chia sẻ tới mạng xã hội (Facebook, Instagram, X, Zalo).
* AI đã tiến hành rà soát codebase và phát hiện các rủi ro/thiếu sót cần đưa vào **Open Clarifications**:
  * Backend hiện chưa có bất kỳ route nào phục vụ việc save/remove album.
  * Tài liệu chưa cung cấp Response Contract cho các API này.
  * Cơ chế chia sẻ mạng xã hội chi tiết chưa được đặc tả rõ.
* AI đảm bảo bảo toàn vùng làm việc (Git workspace), không sửa đổi `feature.json`, `AI_log_3.md` hay các bản Plan của feature 081, 082.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do | 
| ----- | ----- | ----- | 
| Sử dụng workflow tương đương để tạo `plan.md` | Dùng | Vượt qua hạn chế của môi trường CLI để hoàn thành xuất sắc yêu cầu tạo Plan. | 
| Bám sát 2 API Contract (PUT, DELETE) | Dùng | Không tự ý vẽ ra API schema hay quota giới hạn chưa được duyệt nhằm tuân thủ ranh giới hệ thống. | 
| Đưa việc thiếu backend API vào Open Clarifications | Dùng | Ghi nhận thực tế khách quan codebase để đội ngũ Backend nắm bắt và triển khai trước khi làm tasks chi tiết. | 

### Cách kiểm chứng

- [x] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt.

**Ghi chú:** Implementation Plan đã được tạo thành công tại `specs/080-album-interaction/083-save-and-share-album/plan.md`. Giai đoạn lập Plan cho Group 080 (081, 082, 083) đã hoàn thành và sẵn sàng cho các bước tạo task (`/speckit.tasks`).

## Mục 23: Làm rõ rủi ro kỹ thuật cho Implementation Plan (Feature 081)

| Trường | Nội dung |
|---|---|
| Ngày | 2026-11-07 |
| Người thực hiện | Nguyễn Khánh Đăng |
| Nhóm tính năng liên quan | 080 – Album Interaction, Feature 081: Album Details |
| Công cụ AI | GPT-6-Luna |
| Mục đích | Thực thi quy trình Technical Clarification cho file `plan.md` của tính năng xem chi tiết Album (Feature 081), rà soát các lỗ hổng kỹ thuật (API owner, cache, error handling) và vạch rõ các Blocker trước khi chuyển sang bước chia Task. |

### Prompt đã dùng

```text
/speckit-clarify-plan # TASK: Execute `/speckit.clarify` for Implementation Plan of Feature 081 Only

Bạn đang làm việc trong repository AuraTune.

Hãy sử dụng **Spec Kit `/speckit.clarify`** (hoặc luồng tư duy phân tích tương đương) để tiến hành làm rõ các rủi ro kỹ thuật (technical clarification) cho file `plan.md` của feature `081` thuộc Group `080`.

**Chỉ thực hiện Clarify cho file `plan.md` của feature 081. Không xử lý feature khác.**

## 1. Xác định Feature 081
Kiểm tra:
- `specs/080-album-interaction/081-album-details/`
- Các thư mục và file con bên trong (đặc biệt là file `plan.md` và `spec.md`).
- Metadata và configuration liên quan.
Xác định chính xác tên feature và tình trạng hiện tại của bản Implementation Plan.
Nếu không tìm thấy feature 081 hoặc file `plan.md` chưa tồn tại, hãy dừng lại và báo cáo. Không tự tạo file thay thế (đây là bước làm rõ, không phải bước tạo mới).

## 2. Đọc tài liệu nguồn
Đọc các tài liệu để làm hệ quy chiếu (Source of Truth):
- `docs/management/speckit-workflow-guide.md`
- `docs/management/team-contract.md`
- `docs/proposal/Auratune_Vision_Document.md`
- Nội dung nghiệp vụ gốc tại `spec.md` của feature 081.
- Toàn bộ nội dung hiện tại của `plan.md` thuộc feature 081.
- Các tài liệu kiến trúc, database schema, và source code (`src/`) liên quan trực tiếp đến các component/service được nhắc đến trong Plan.
Kiểm tra kỹ ranh giới hệ thống, các dependency hiện có để chuẩn bị cho việc đối chiếu và bắt lỗi logic kỹ thuật.

## 3. Thực thi Technical Clarification
Sau khi xác định đúng feature context:
1. Chọn feature 081 làm context hiện hành.
2. Quét toàn bộ `plan.md` để tìm ra các "điểm mù kỹ thuật" (technical blind spots) như: 
   - Lỗ hổng trong Data Flow hoặc API integration (thiếu params, sai HTTP method).
   - Chưa rõ cơ chế xử lý lỗi ở Frontend/Backend (Error Handling, Caching, Retry logic).
   - Xung đột component/dependencies với kiến trúc hiện tại.
   - Thiếu sót trong Testing Strategy hoặc rủi ro hiệu năng (Performance risks).
   - Các điểm **Needs confirmation.**
3. Đưa ra các câu hỏi làm rõ HOẶC tự động cập nhật các quyết định kỹ thuật vào `plan.md` nếu chúng có thể suy ra chắc chắn từ `spec.md` và source code hiện tại.
Nếu môi trường không hỗ trợ slash command trực tiếp, hãy tìm cách thực thi luồng phân tích tương đương và báo cáo trung thực.

## 4. Yêu cầu đối với quá trình Clarify
Khi tiến hành làm rõ Plan, bạn cần:
- Đưa ra tối đa 5 câu hỏi trọng tâm nhất dưới dạng trắc nghiệm (Option A, B, C) kèm theo đề xuất (Recommended) liên quan đến các quyết định kỹ thuật (Design decisions, State management, API payloads, v.v.).
- Đảm bảo các giải pháp kỹ thuật đề xuất phản ánh đúng kiến trúc hiện tại của AuraTune (React/Express/PostgreSQL...).
- **CRITICAL REQUIREMENT:** Dù quá trình trao đổi/hỏi đáp diễn ra bằng tiếng Việt, BẤT KỲ sự cập nhật nào vào file `plan.md` ĐỀU BẮT BUỘC phải viết 100% bằng tiếng Anh.
Không tự ý:
- Thêm các Functional Requirements mới không có trong `spec.md`.
- Đề xuất các thư viện/công nghệ mới, hoặc thay đổi kiến trúc core mà chưa có sự đồng thuận.
- Tự chế ra API endpoints hoặc Database tables không có căn cứ từ thiết kế tổng thể.

## 5. Scope giới hạn
Chỉ được phép phân tích, đặt câu hỏi và cập nhật `plan.md` của feature 081.
Không được:
- Làm rõ cho feature khác.
- Tạo hay chỉnh sửa ngược lại file `spec.md` hoặc `requirements.md` (nếu phát hiện mâu thuẫn nghiệp vụ, chỉ ghi nhận vào phần "Risks and Clarifications" của `plan.md`).
- Chỉnh sửa `tasks.md`.
- Implement source code.
- Chỉnh sửa tài liệu project-level.
- Commit hoặc push.
Trước khi làm việc, kiểm tra `git status` và bảo toàn tất cả thay đổi chưa commit.

## 6. Validation
Sau khi thực thi làm rõ:
- Đảm bảo các cập nhật trong `plan.md` khớp hoàn toàn với requirements của `spec.md`.
- Đảm bảo các technical decisions đề xuất là khả thi và có căn cứ từ source code.
- Đảm bảo file `plan.md` vẫn giữ đúng format chuẩn, không bị vỡ Markdown và hoàn toàn bằng tiếng Anh.
- Kiểm tra Git diff để bảo đảm không sửa file ngoài phạm vi.

## 7. Final Report
Báo cáo bằng Vietnamese:
1. Tên và đường dẫn feature 081 đã xác định.
2. Quá trình Technical Clarification có thực sự được thực thi hay không.
3. Danh sách các "điểm mù kỹ thuật" lớn nhất đã phát hiện trong Plan hiện tại.
4. Danh sách các câu hỏi trắc nghiệm kỹ thuật (để tôi trả lời) HOẶC danh sách các quyết định đã được tự động cập nhật vào `plan.md`.
5. Đánh giá mức độ sẵn sàng của Plan để chuyển sang bước chia task (`/speckit.tasks`).
6. Danh sách file đã thay đổi (nếu có).
Completion criteria: Chỉ thực hiện đánh giá và làm rõ kỹ thuật (Clarify) cho file `plan.md` của feature 081. Dừng lại sau khi xuất báo cáo và danh sách câu hỏi để chờ tôi phản hồi, tuyệt đối không tự động chuyển sang bước tạo Tasks hay feature tiếp theo.
```

### Tóm tắt phản hồi của AI

*   Thực thi thành công luồng làm rõ kỹ thuật (Technical Clarification) trực tiếp trên file `plan.md` của feature `081-album-details` bằng tiếng Anh.
*   Phát hiện các điểm mù và tự động cập nhật cách xử lý vào Plan:
    *   **Cache:** Chốt phương án sử dụng `AppStore` lưu trong bộ nhớ theo Album ID; không đặt TTL hay lưu bền. Nếu refresh lỗi, sẽ giữ dữ liệu cache cũ, báo lỗi rõ ràng và cho phép retry.
    *   **More from Artist:** Tiếp tục lấy từ danh sách catalog hiện có trong `AppStore` (lọc theo `artistId`), không thêm field mới vào API chi tiết album.
    *   **API Owner/Contract:** Ghi nhận thực tế source code hiện tại chưa rõ API Owner, route base path (`/api/v1`) chưa khớp hoàn toàn với thiết kế.
    *   **UI Gaps:** Giao diện chưa xử lý đầy đủ các kịch bản về cover ảnh trống, play count không khả dụng, và cách tính tổng thời lượng khi danh sách track rỗng.
*   Bảo toàn nguyên vẹn thư mục làm việc, không chỉnh sửa tài liệu gốc `spec.md` hay làm ảnh hưởng đến thay đổi đang có của các tính năng khác (như `AI_log_3.md` hay feature 082/083).

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do |
|---|---|---|
| Cập nhật cơ chế Caching và Retry vào Plan | Dùng | Đảm bảo kỹ thuật xử lý UI mượt mà, chống gián đoạn trải nghiệm người dùng khi mạng chậm/lỗi. |
| Lọc "More from Artist" qua AppStore | Dùng | Tối ưu hóa việc tái sử dụng dữ liệu cục bộ thay vì bắt Backend phải chế thêm trường dư thừa vào API detail. |
| Ghi nhận API Blocker vào mục Risks | Dùng | Cung cấp cái nhìn trung thực về giới hạn source code hiện hành. Không tự bịa API schema để tôn trọng ranh giới System Architect. |

### Cách kiểm chứng

- [x] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt. 

**Đánh giá mức độ sẵn sàng:** Plan của Feature 081 đã đủ điều kiện để chia Task (`/speckit.tasks`) cho các hạng mục UI/UX, Cache và Error Handling.

## Mục 24: Làm rõ rủi ro kỹ thuật cho Implementation Plan (Feature 082)

| Trường | Nội dung | 
| ----- | ----- | 
| Ngày | 2026-11-07 | 
| Người thực hiện | Nguyễn Khánh Đăng | 
| Nhóm tính năng liên quan | 080 – Album Interaction, Feature 082: Album Tracklist Playback | 
| Công cụ AI | GPT-6-Luna | 
| Mục đích | Thực thi quy trình Technical Clarification cho file `plan.md` của tính năng Phát danh sách bài hát (Feature 082), rà soát mâu thuẫn hệ thống (queue limit, trạng thái track) và vạch rõ các Blocker (sự phụ thuộc vào Group 040 & 050) trước khi tạo Task. | 

### Prompt đã dùng

```
/speckit-clarify-plan # TASK: Execute `/speckit.clarify` for Implementation Plan of Feature 082 Only

Bạn đang làm việc trong repository AuraTune.

Hãy sử dụng **Spec Kit `/speckit.clarify`** để tiến hành làm rõ các rủi ro kỹ thuật cho file `plan.md` của feature 082 thuộc Group 080 - Album Interaction.

**Chỉ thực hiện Clarify cho file `plan.md` của feature 082. Không xử lý feature khác.**

## 1. Xác định Feature 082
Kiểm tra:
- `specs/080-album-interaction/082-album-tracklist/`
- Các thư mục và file con bên trong (đặc biệt là file `plan.md` và `spec.md`).
- Metadata và configuration liên quan.
Xác định chính xác tên feature và tình trạng hiện tại của bản Implementation Plan.
Nếu không tìm thấy feature 082 hoặc file `plan.md` chưa tồn tại, hãy dừng lại và báo cáo. Không tự tạo file thay thế (đây là bước làm rõ, không phải bước tạo mới).

## 2. Đọc tài liệu nguồn
Đọc các tài liệu để làm hệ quy chiếu:
- `docs/management/speckit-workflow-guide.md`
- `docs/management/team-contract.md`
- `docs/proposal/Auratune_Vision_Document.md`
- Nội dung nghiệp vụ gốc tại `spec.md` của feature 082.
- Toàn bộ nội dung hiện tại của `plan.md` thuộc feature 082.
- Các tài liệu kiến trúc, database schema, và source code (`src/`) liên quan trực tiếp đến các component/service được nhắc đến trong Plan.
Kiểm tra kỹ ranh giới hệ thống, các dependency hiện có để chuẩn bị cho việc đối chiếu và bắt lỗi logic kỹ thuật.

## 3. Thực thi Technical Clarification
Sau khi xác định đúng feature context:
1. Chọn feature 082 làm context hiện hành.
2. Quét toàn bộ `plan.md` để tìm ra các "điểm mù kỹ thuật" như: 
   - Lỗ hổng trong Data Flow hoặc API integration (thiếu params, sai HTTP method).
   - Chưa rõ cơ chế xử lý lỗi ở Frontend/Backend (Error Handling, Caching, Retry logic).
   - Xung đột component/dependencies với kiến trúc hiện tại.
   - Thiếu sót trong Testing Strategy hoặc rủi ro hiệu năng.
   - Các điểm **Needs confirmation.**
3. Đưa ra các câu hỏi làm rõ HOẶC tự động cập nhật các quyết định kỹ thuật vào `plan.md` nếu chúng có thể suy ra chắc chắn từ `spec.md` và source code hiện tại.
Nếu môi trường không hỗ trợ slash command trực tiếp, hãy tìm cách thực thi luồng phân tích tương đương và báo cáo trung thực.

## 4. Yêu cầu đối với quá trình Clarify
Khi tiến hành làm rõ Plan, bạn cần:
- Đưa ra tối đa 5 câu hỏi trọng tâm nhất dưới dạng trắc nghiệm (Option A, B, C) kèm theo đề xuất (Recommended) liên quan đến các quyết định kỹ thuật (Design decisions, State management, API payloads, v.v.).
- Đảm bảo các giải pháp kỹ thuật đề xuất phản ánh đúng kiến trúc hiện tại của AuraTune (React/Express/PostgreSQL...).
- **CRITICAL REQUIREMENT:** Dù quá trình trao đổi/hỏi đáp diễn ra bằng tiếng Việt, BẤT KỲ sự cập nhật nào vào file `plan.md` ĐỀU BẮT BUỘC phải viết 100% bằng tiếng Anh.
Không tự ý:
- Thêm các Functional Requirements mới không có trong `spec.md`.
- Đề xuất các thư viện/công nghệ mới, hoặc thay đổi kiến trúc core mà chưa có sự đồng thuận.
- Tự chế ra API endpoints hoặc Database tables không có căn cứ từ thiết kế tổng thể.

## 5. Scope giới hạn
Chỉ được phép phân tích, đặt câu hỏi và cập nhật `plan.md` của feature 082.
Không được:
- Làm rõ cho feature khác.
- Tạo hay chỉnh sửa ngược lại file `spec.md` hoặc `requirements.md` (nếu phát hiện mâu thuẫn nghiệp vụ, chỉ ghi nhận vào phần "Risks and Clarifications" của `plan.md`).
- Chỉnh sửa `tasks.md`.
- Implement source code.
- Chỉnh sửa tài liệu project-level.
- Commit hoặc push.
Trước khi làm việc, kiểm tra `git status` và bảo toàn tất cả thay đổi chưa commit.

## 6. Validation
Sau khi thực thi làm rõ:
- Đảm bảo các cập nhật trong `plan.md` khớp hoàn toàn với requirements của `spec.md`.
- Đảm bảo các technical decisions đề xuất là khả thi và có căn cứ từ source code.
- Đảm bảo file `plan.md` vẫn giữ đúng format chuẩn, không bị vỡ Markdown và hoàn toàn bằng tiếng Anh.
- Kiểm tra Git diff để bảo đảm không sửa file ngoài phạm vi.

## 7. Final Report
Báo cáo bằng Vietnamese:
1. Tên và đường dẫn feature 082 đã xác định.
2. Quá trình Technical Clarification có thực sự được thực thi hay không.
3. Danh sách các "điểm mù kỹ thuật" lớn nhất đã phát hiện trong Plan hiện tại.
4. Danh sách các câu hỏi trắc nghiệm kỹ thuật (để tôi trả lời) HOẶC danh sách các quyết định đã được tự động cập nhật vào `plan.md`.
5. Đánh giá mức độ sẵn sàng của Plan để chuyển sang bước chia task (`/speckit.tasks`).
6. Danh sách file đã thay đổi (nếu có).
Completion criteria: Chỉ thực hiện đánh giá và làm rõ kỹ thuật (Clarify) cho file `plan.md` của feature 082. Dừng lại sau khi xuất báo cáo và danh sách câu hỏi để chờ tôi phản hồi, tuyệt đối không tự động chuyển sang bước tạo Tasks hay feature tiếp theo.
```

### Tóm tắt phản hồi của AI

* **Quy trình:** Slash command không khả dụng. AI đã thực hiện quy trình phân tích tương đương và cập nhật thủ công file `plan.md` của feature `082-album-tracklist` (toàn bộ nội dung cập nhật bằng tiếng Anh).
* **Các điểm mù kỹ thuật & Xung đột hệ thống đã phát hiện:**
  * **Mâu thuẫn Logic Queue:** Spec nội bộ mâu thuẫn (FR-004 yêu cầu "thay thế queue", phần clarification lại chốt "chèn album trước queue hiện có").
  * **Giới hạn Queue (Group 050):** Group 050 giới hạn hàng đợi 50 bài, nhưng Feature 082 yêu cầu phát *toàn bộ* track của album (có thể > 100 bài).
  * **Trạng thái UI (AlbumPage vs AppStore):** Trang Album đang fetch `publicTracks` (đã lọc bỏ track không active), khiến track không khả dụng bị ẩn hoàn toàn thay vì mờ đi như yêu cầu.
  * **Playback Recovery (Group 040):** Component player hiện tại (`useMockPlayer.js`) chưa có logic kiểm tra tính khả dụng khi chuyển bài và thiếu callback phục hồi lỗi.
* **Các giải pháp kỹ thuật đã cập nhật vào Plan:**
  * Sử dụng `AppStore.allTracks` thay vì `publicTracks` để giữ lại các bài hát không khả dụng trên UI, sau đó tự map trạng thái disabled.
  * Dùng thông báo lỗi chung hiện có thay vì thiết kế UI mới cho track lỗi.
  * Giữ mâu thuẫn "Thay thế vs Chèn Queue" và "Limit 50 bài" làm **Blocker** chờ Product Owner quyết định.
  * Giữ phần Playback Recovery làm **Blocker** chờ Group 040 thống nhất contract xử lý lỗi.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do | 
| ----- | ----- | ----- | 
| Dùng `AppStore.allTracks` thay cho `publicTracks` | Dùng | Giúp UI render đúng theo thiết kế (hiển thị đủ danh sách, track nào lỗi thì làm mờ) thay vì ẩn mất track. | 
| Giữ giới hạn queue 50 bài và đánh dấu Blocker | Dùng | Tránh việc tự ý chế thêm cơ chế "chia đoạn load lazy" phức tạp khi chưa được duyệt, ép team hệ thống phải giải quyết xung đột giới hạn. | 
| Treo Task tích hợp Player | Dùng | Tránh việc tự ý sửa code của Group 040 (`useMockPlayer.js`) khi đó không thuộc phạm vi Feature 082. | 

### Cách kiểm chứng

- [x] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt.

**Đánh giá mức độ sẵn sàng:** Mới sẵn sàng một phần. Có thể chia task (`/speckit.tasks`) cho việc lấy dữ liệu, render danh sách và hiển thị UI trạng thái track. Phần tích hợp với hàng đợi (Queue) và chuyển bài (Player) BẮT BUỘC phải chờ các quyết định từ Product Owner và Group 040/050 trước khi làm.

## Mục 25: Làm rõ rủi ro kỹ thuật cho Implementation Plan (Feature 083)

| Trường | Nội dung |
|---|---|
| Ngày | 2026-11-07 |
| Người thực hiện | Nguyễn Khánh Đăng |
| Nhóm tính năng liên quan | 080 – Album Interaction, Feature 083: Save and Share Album |
| Công cụ AI | GPT-6-Luna |
| Mục đích | Thực thi quy trình Technical Clarification cho file `plan.md` của tính năng Lưu và Chia sẻ Album (Feature 083), rà soát các lỗ hổng kỹ thuật liên quan đến API State, UI Feedback và cơ chế mạng xã hội, vạch rõ các Blocker trước khi chuyển sang bước chia Task. |

### Prompt đã dùng

```text
/speckit-clarify-plan # TASK: Execute `/speckit.clarify` for Implementation Plan of Feature 083 Only

Bạn đang làm việc trong repository AuraTune.

Hãy sử dụng **Spec Kit `/speckit.clarify`** để tiến hành làm rõ các rủi ro kỹ thuật cho file `plan.md` của feature 083 thuộc Group 080 - Album Interaction.

**Chỉ thực hiện Clarify cho file `plan.md` của feature 083. Không xử lý feature khác.**

## 1. Xác định Feature 083
Kiểm tra:
- `specs/080-album-interaction/083-save-and-share-album/`
- Các thư mục và file con bên trong (đặc biệt là file `plan.md` và `spec.md`).
- Metadata và configuration liên quan.
Xác định chính xác tên feature và tình trạng hiện tại của bản Implementation Plan.
Nếu không tìm thấy feature 083 hoặc file `plan.md` chưa tồn tại, hãy dừng lại và báo cáo. Không tự tạo file thay thế (đây là bước làm rõ, không phải bước tạo mới).

## 2. Đọc tài liệu nguồn
Đọc các tài liệu để làm hệ quy chiếu:
- `docs/management/speckit-workflow-guide.md`
- `docs/management/team-contract.md`
- `docs/proposal/Auratune_Vision_Document.md`
- Nội dung nghiệp vụ gốc tại `spec.md` của feature 083.
- Toàn bộ nội dung hiện tại của `plan.md` thuộc feature 083.
- Các tài liệu kiến trúc, database schema, và source code (`src/`) liên quan trực tiếp đến các component/service được nhắc đến trong Plan.
Kiểm tra kỹ ranh giới hệ thống, các dependency hiện có để chuẩn bị cho việc đối chiếu và bắt lỗi logic kỹ thuật.

## 3. Thực thi Technical Clarification
Sau khi xác định đúng feature context:
1. Chọn feature 083 làm context hiện hành.
2. Quét toàn bộ `plan.md` để tìm ra các "điểm mù kỹ thuật" như: 
   - Lỗ hổng trong Data Flow hoặc API integration (thiếu params, sai HTTP method).
   - Chưa rõ cơ chế xử lý lỗi ở Frontend/Backend (Error Handling, Caching, Retry logic).
   - Xung đột component/dependencies với kiến trúc hiện tại.
   - Thiếu sót trong Testing Strategy hoặc rủi ro hiệu năng.
   - Các điểm **Needs confirmation.**
3. Đưa ra các câu hỏi làm rõ HOẶC tự động cập nhật các quyết định kỹ thuật vào `plan.md` nếu chúng có thể suy ra chắc chắn từ `spec.md` và source code hiện tại.
Nếu môi trường không hỗ trợ slash command trực tiếp, hãy tìm cách thực thi luồng phân tích tương đương và báo cáo trung thực.

## 4. Yêu cầu đối với quá trình Clarify
Khi tiến hành làm rõ Plan, bạn cần:
- Đưa ra tối đa 5 câu hỏi trọng tâm nhất dưới dạng trắc nghiệm (Option A, B, C) kèm theo đề xuất (Recommended) liên quan đến các quyết định kỹ thuật (Design decisions, State management, API payloads, v.v.).
- Đảm bảo các giải pháp kỹ thuật đề xuất phản ánh đúng kiến trúc hiện tại của AuraTune (React/Express/PostgreSQL...).
- **CRITICAL REQUIREMENT:** Dù quá trình trao đổi/hỏi đáp diễn ra bằng tiếng Việt, BẤT KỲ sự cập nhật nào vào file `plan.md` ĐỀU BẮT BUỘC phải viết 100% bằng tiếng Anh.
Không tự ý:
- Thêm các Functional Requirements mới không có trong `spec.md`.
- Đề xuất các thư viện/công nghệ mới, hoặc thay đổi kiến trúc core mà chưa có sự đồng thuận.
- Tự chế ra API endpoints hoặc Database tables không có căn cứ từ thiết kế tổng thể.

## 5. Scope giới hạn
Chỉ được phép phân tích, đặt câu hỏi và cập nhật `plan.md` của feature 083.
Không được:
- Làm rõ cho feature khác.
- Tạo hay chỉnh sửa ngược lại file `spec.md` hoặc `requirements.md` (nếu phát hiện mâu thuẫn nghiệp vụ, chỉ ghi nhận vào phần "Risks and Clarifications" của `plan.md`).
- Chỉnh sửa `tasks.md`.
- Implement source code.
- Chỉnh sửa tài liệu project-level.
- Commit hoặc push.
Trước khi làm việc, kiểm tra `git status` và bảo toàn tất cả thay đổi chưa commit.

## 6. Validation
Sau khi thực thi làm rõ:
- Đảm bảo các cập nhật trong `plan.md` khớp hoàn toàn với requirements của `spec.md`.
- Đảm bảo các technical decisions đề xuất là khả thi và có căn cứ từ source code.
- Đảm bảo file `plan.md` vẫn giữ đúng format chuẩn, không bị vỡ Markdown và hoàn toàn bằng tiếng Anh.
- Kiểm tra Git diff để bảo đảm không sửa file ngoài phạm vi.

## 7. Final Report
Báo cáo bằng Vietnamese:
1. Tên và đường dẫn feature 083 đã xác định.
2. Quá trình Technical Clarification có thực sự được thực thi hay không.
3. Danh sách các "điểm mù kỹ thuật" lớn nhất đã phát hiện trong Plan hiện tại.
4. Danh sách các câu hỏi trắc nghiệm kỹ thuật (để tôi trả lời) HOẶC danh sách các quyết định đã được tự động cập nhật vào `plan.md`.
5. Đánh giá mức độ sẵn sàng của Plan để chuyển sang bước chia task (`/speckit.tasks`).
6. Danh sách file đã thay đổi (nếu có).
Completion criteria: Chỉ thực hiện đánh giá và làm rõ kỹ thuật (Clarify) cho file `plan.md` của feature 083. Dừng lại sau khi xuất báo cáo và danh sách câu hỏi để chờ tôi phản hồi, tuyệt đối không tự động chuyển sang bước tạo Tasks hay feature tiếp theo.
```

### Tóm tắt phản hồi của AI

*   **Quy trình:** Lệnh slash command không khả dụng. AI đã sử dụng luồng phân tích tương đương để kiểm tra source code (UI component, context, API client) và tự động cập nhật các quyết định kỹ thuật trực tiếp vào file `plan.md` của Feature 083 (hoàn toàn bằng tiếng Anh).
*   **Các "điểm mù kỹ thuật" đã phát hiện:**
    *   **Backend API Blocker:** Base URL `/api/v1` hiện có nhưng route xử lý lưu/xóa album hoàn toàn trống, response contract chưa được phê duyệt.
    *   **State Management Gap:** `AppStore.jsx` đang lưu trạng thái cục bộ, thiếu một contract đọc từ server để duy trì trạng thái khi refresh hoặc đổi tài khoản.
    *   **UI Gap:** `LibraryPage.jsx` chưa có cơ chế UI cho thao tác bỏ lưu và thiếu luồng inline feedback cho pending/success/error.
    *   **Mâu thuẫn Social Share:** Module hiện tại (`share.js`) chỉ dùng Web Share API hoặc copy link, chưa có cơ chế riêng biệt cho từng đích đến MXH như FR-011 yêu cầu.
*   **Các quyết định đã ghi nhận vào Plan:**
    *   Sử dụng module API client hiện tại (`sessionApiClient`) cho 2 mutation `PUT`/`DELETE`.
    *   Giữ lại yêu cầu tạo 4 nút control chia sẻ MXH riêng biệt theo đúng spec thay vì gộp chung vào Web Share API.
    *   Đánh dấu việc đọc "Saved State" từ server-backed library là Blocker chờ API Owner phê duyệt.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do |
|---|---|---|
| Khởi chạy qua API client hiện có | Dùng | Tái sử dụng base URL `/api/v1` và cơ chế gọi API chuẩn (`sessionApiClient`) của dự án, giữ tính nhất quán hệ thống. |
| Giữ nguyên 4 control chia sẻ riêng (FR-011) | Dùng | Tôn trọng tài liệu gốc. Không để Web Share API đè lên yêu cầu đặc thù của chức năng chia sẻ. |
| Đưa các rủi ro API và Hydrate State vào Blocker | Dùng | Phản ánh chính xác thực tế codebase đang thiếu schema, ngăn cản việc viết code kết nối sớm dẫn đến lỗi tích hợp hệ thống. |

### Cách kiểm chứng

- [x] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt. 

## Mục 26: Phân rã công việc (Task Breakdown) cho spec 031 bằng Spec Kit

| Trường | Nội dung | 
| ----- | ----- | 
| Ngày | 2026-11-08 | 
| Người thực hiện | Nguyễn Khánh Đăng | 
| Nhóm tính năng liên quan | 030 – Search, Feature 031: Metadata Search | 
| Công cụ AI | GPT-5.6-Luna (Spec Kit) | 
| Mục đích | Sử dụng lệnh `/speckit.tasks` để rà soát và tạo mới danh sách công việc (`tasks.md`) cho tính năng tìm kiếm siêu dữ liệu, loại bỏ các rào cản (gates) lỗi thời và đồng bộ với hợp đồng API mới nhất. | 

### Prompt đã dùng

```text
/speckit-tasks # TASK: Execute /speckit.tasks for Task Generation of Feature 031 Only

Bạn đang làm việc trong repository AuraTune.

Hãy sử dụng Spec Kit /speckit.tasks để tiến hành phân rã kế hoạch triển khai thành danh sách công việc chi tiết (task breakdown) và tạo/cập nhật file tasks.md cho feature 031 đang được chỉ định.
Chỉ thực hiện tạo Tasks cho feature 031. Không xử lý feature khác.

1. Xác định Feature 031

Kiểm tra:
Thư mục chứa spec của feature hiện tại: specs/030-search/031-metadata-search/
Các thư mục và file con bên trong, đặc biệt phải đảm bảo file spec.md và plan.md đã tồn tại.
Nếu không tìm thấy feature được yêu cầu hoặc file plan.md chưa tồn tại, hãy dừng lại và báo cáo. Không thể chia task nếu chưa có kế hoạch kỹ thuật.

2. Đọc tài liệu nguồn

Đọc các tài liệu để làm hệ quy chiếu:
docs/management/speckit-workflow-guide.md
docs/management/team-contract.md
Toàn bộ nội dung của spec.md (Nghiệp vụ) và đặc biệt là plan.md (Kế hoạch kỹ thuật) của feature 031.
Các quy chuẩn coding convention hiện hành của dự án (nếu có nhắc đến trong docs).
Sử dụng plan.md làm đầu vào tối thượng (single source of truth) cho bước này. Mọi task sinh ra phải có cơ sở từ plan.md.

3. Thực thi Task Breakdown

Sau khi xác định đúng feature context và nắm rõ bản Kế hoạch:
Chọn feature 031 làm context hiện hành.
Quét toàn bộ plan.md và phân rã các quyết định kỹ thuật thành các hành động lập trình cụ thể, độc lập và có thể kiểm chứng được .

Tổ chức file tasks.md theo các Giai đoạn dựa trên mức độ phụ thuộc . Ví dụ (có thể tùy chỉnh theo plan):
Phase 1: Setup & Database (Schema changes, Supabase/PostgreSQL migrations, types/interfaces).
Phase 2: Backend Services & API (Go/Node.js endpoints, middleware, business logic).
Phase 3: Frontend State & API Integration (Redux/Zustand slices, API hooks, React Query).
Phase 4: Frontend UI Components (React components, styling, UI validation).
Phase 5: Testing, Error Handling & Polish (Unit tests, loading states, error boundaries).

4. Yêu cầu đối với quá trình tạo Tasks

Khi tiến hành tạo/cập nhật tasks.md, bạn cần:
Trình bày dưới dạng danh sách checkbox của Markdown (- [ ]).
Viết tên task bằng động từ hành động rõ ràng (VD: Create..., Implement..., Update..., Add test for...).
Cung cấp bối cảnh ngắn gọn trong từng task nếu cần (VD: file nào cần sửa, endpoint nào cần gọi).

CRITICAL REQUIREMENT: Dù quá trình trao đổi/hỏi đáp diễn ra bằng tiếng Việt, nội dung file tasks.md ĐỀU BẮT BUỘC phải viết 100% bằng tiếng Anh.

Không tự ý:
Bỏ sót bất kỳ yêu cầu kỹ thuật hay luồng xử lý lỗi nào đã được chốt trong plan.md.
Sáng tác thêm các task nằm ngoài phạm vi của plan.md hoặc spec.md.
Gộp quá nhiều việc lớn vào chung một checkbox (phải chia nhỏ để dễ theo dõi tiến độ).

5. Scope giới hạn

Chỉ được phép phân tích plan.md và tạo/cập nhật file tasks.md của feature 031.

Không được:
Làm rã task cho bất kỳ feature nào khác.
Chỉnh sửa ngược lại file spec.md hoặc plan.md (nếu phát hiện lỗ hổng ở bước này, chỉ thêm task "Verify/Investigate..." hoặc báo cáo).
Viết source code (không tạo/chỉnh sửa file trong thư mục src/).
Chỉnh sửa tài liệu project-level.
Commit hoặc push.
Trước khi làm việc, kiểm tra git status và bảo toàn tất cả thay đổi chưa commit.

6. Validation

Sau khi thực thi tạo tasks:
Traceability Check: Đảm bảo 100% các mục trong plan.md đều đã được ánh xạ thành ít nhất 1 task trong tasks.md.
Dependency Check: Đảm bảo thứ tự các task logic (không thể gọi API ở frontend nếu task tạo API backend chưa được làm trước đó).
Đảm bảo file tasks.md chuẩn format Markdown checklist và hoàn toàn bằng tiếng Anh.
Kiểm tra Git diff để bảo đảm không sửa file ngoài phạm vi.

7. Final Report

Báo cáo bằng tiếng Việt:
Tên và đường dẫn feature 031 đã xác định.
Trạng thái thực thi tạo file tasks.md.
Tóm tắt cấu trúc file tasks (Liệt kê các Phase và tổng số lượng task được tạo).
Xác nhận sự liên kết (traceability) giữa plan.md và tasks.md (có phần nào trong plan khó chia task không?).
Đánh giá mức độ sẵn sàng để chuyển sang bước lập trình thực tế (/speckit.implement).
Danh sách file đã thay đổi/tạo mới.

Completion criteria: Chỉ thực hiện phân rã và xuất file tasks.md cho feature <Tên/ID Feature>. Dừng lại sau khi xuất báo cáo để chờ tôi xác nhận, tuyệt đối không tự động chuyển sang bước viết code (/speckit.implement) hay chuyển sang feature tiếp theo.
```

### Tóm tắt phản hồi của AI

*   Xác nhận đúng thư mục ngữ cảnh của feature 031 và rà soát lại toàn bộ bộ tài liệu planning (`plan.md`, `research.md`, `data-model.md`, `quickstart.md`, `contracts`).
*   Phát hiện bản `tasks.md` cũ chứa các mục chờ xác nhận (gates) không còn hợp lệ và bị thiếu các trường dữ liệu (`genre`, `release_year`, `sort`) vốn đã được chốt xong trong API contract.
*   Xóa file cũ và tạo mới file `tasks.md` 100% bằng tiếng Anh, bao gồm **47 task** được tổ chức lại thành **6 Phase** theo trình tự:
    *   Phase 1: Resolve Remaining Implementation Gates (3 tasks)
    *   Phase 2: Foundational Search API (9 tasks)
    *   Phase 3: User Story 1 – Find Music and Related Metadata (21 tasks)
    *   Phase 4: User Story 2 – Refine and Order Results (6 tasks)
    *   Phase 5: User Story 3 – Understand Empty and Unavailable Results (3 tasks)
    *   Phase 6: Polish, Acceptance, and Regression (5 tasks)
*   Chuyển các mục chưa chắc chắn trong plan thành 3 task kiểm chứng ở Phase 1 (xác minh schema catalog đã triển khai, thống nhất phương pháp test, ghi nhận trạng thái phê duyệt).
*   Xác nhận cấu trúc file đạt chuẩn: 47 ID liên tục, toàn bộ đúng định dạng checkbox, tiếng Anh 100%, không phát hiện lỗi Git diff.
*   Đánh giá: Tính năng **chưa sẵn sàng hoàn toàn** để code (`/speckit.implement`) cho đến khi 3 task rào cản ở Phase 1 được hoàn tất.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do | 
| ----- | ----- | ----- | 
| Cấu trúc 47 task chia thành 6 Phase theo User Story | Dùng | Giúp dễ dàng theo dõi tiến độ hoàn thiện của từng chức năng người dùng cụ thể và sắp xếp thứ tự logic chính xác (API làm trước, Frontend làm sau). | 
| Thay thế các task "gates" cũ bằng task mới ở Phase 1 | Dùng | Phản ánh đúng thực tế dự án sau khi API contract đã được chốt, loại bỏ các câu hỏi thừa và chỉ tập trung vào các rủi ro cốt lõi (schema DB thực tế). | 
| Giữ nguyên các thay đổi Git của các tính năng khác | Dùng | Bảo đảm an toàn cho không gian làm việc (workspace), không vô tình ghi đè tài liệu của nhóm tính năng 032 hay 033. | 

### Cách kiểm chứng

- [x] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt. Cần Technical Lead vào chốt các task ở Phase 1 trước khi bắt đầu lập trình.

## Mục 27: Phân rã công việc (Task Breakdown) cho spec 032 bằng Spec Kit

| Trường | Nội dung | 
| ----- | ----- | 
| Ngày | 2026-11-08 | 
| Người thực hiện | Nguyễn Khánh Đăng | 
| Nhóm tính năng liên quan | 030 – Search, Feature 032: AI Lyrics Search | 
| Công cụ AI | GPT-5.6-Luna | 
| Mục đích | Sử dụng lệnh `/speckit.tasks` để rà soát và tạo mới danh sách công việc (`tasks.md`) cho tính năng tìm kiếm bằng lời bài hát AI, đảm bảo các yếu tố kiến trúc còn bỏ ngỏ được chuyển thành các cổng xác nhận (decision gates) hợp lệ. | 

### Prompt đã dùng

```
/speckit-tasks # TASK: Execute /speckit.tasks for Task Generation of Feature 032 Only

Bạn đang làm việc trong repository AuraTune.

Hãy sử dụng Spec Kit /speckit.tasks để tiến hành phân rã kế hoạch triển khai thành danh sách công việc chi tiết (task breakdown) và tạo/cập nhật file tasks.md cho feature 032 đang được chỉ định.
Chỉ thực hiện tạo Tasks cho feature 032. Không xử lý feature khác.

1. Xác định Feature 032

Kiểm tra:
Thư mục chứa spec của feature hiện tại: specs/030-search/032-ai-lyrics-search/
Các thư mục và file con bên trong, đặc biệt phải đảm bảo file spec.md và plan.md đã tồn tại.
Nếu không tìm thấy feature được yêu cầu hoặc file plan.md chưa tồn tại, hãy dừng lại và báo cáo. Không thể chia task nếu chưa có kế hoạch kỹ thuật.

2. Đọc tài liệu nguồn

Đọc các tài liệu để làm hệ quy chiếu:
docs/management/speckit-workflow-guide.md
docs/management/team-contract.md
Toàn bộ nội dung của spec.md (Nghiệp vụ) và đặc biệt là plan.md (Kế hoạch kỹ thuật) của feature 032.
Các quy chuẩn coding convention hiện hành của dự án (nếu có nhắc đến trong docs).
Sử dụng plan.md làm đầu vào tối thượng (single source of truth) cho bước này. Mọi task sinh ra phải có cơ sở từ plan.md.

3. Thực thi Task Breakdown

Sau khi xác định đúng feature context và nắm rõ bản Kế hoạch:
Chọn feature 032 làm context hiện hành.
Quét toàn bộ plan.md và phân rã các quyết định kỹ thuật thành các hành động lập trình cụ thể, độc lập và có thể kiểm chứng được .

Tổ chức file tasks.md theo các Giai đoạn dựa trên mức độ phụ thuộc . Ví dụ (có thể tùy chỉnh theo plan):
Phase 1: Setup & Database (Schema changes, Supabase/PostgreSQL migrations, types/interfaces).
Phase 2: Backend Services & API (Go/Node.js endpoints, middleware, business logic).
Phase 3: Frontend State & API Integration (Redux/Zustand slices, API hooks, React Query).
Phase 4: Frontend UI Components (React components, styling, UI validation).
Phase 5: Testing, Error Handling & Polish (Unit tests, loading states, error boundaries).

4. Yêu cầu đối với quá trình tạo Tasks

Khi tiến hành tạo/cập nhật tasks.md, bạn cần:
Trình bày dưới dạng danh sách checkbox của Markdown (- [ ]).
Viết tên task bằng động từ hành động rõ ràng (VD: Create..., Implement..., Update..., Add test for...).
Cung cấp bối cảnh ngắn gọn trong từng task nếu cần (VD: file nào cần sửa, endpoint nào cần gọi).

CRITICAL REQUIREMENT: Dù quá trình trao đổi/hỏi đáp diễn ra bằng tiếng Việt, nội dung file tasks.md ĐỀU BẮT BUỘC phải viết 100% bằng tiếng Anh.

Không tự ý:
Bỏ sót bất kỳ yêu cầu kỹ thuật hay luồng xử lý lỗi nào đã được chốt trong plan.md.
Sáng tác thêm các task nằm ngoài phạm vi của plan.md hoặc spec.md.
Gộp quá nhiều việc lớn vào chung một checkbox (phải chia nhỏ để dễ theo dõi tiến độ).

5. Scope giới hạn

Chỉ được phép phân tích plan.md và tạo/cập nhật file tasks.md của feature 032.

Không được:
Làm rã task cho bất kỳ feature nào khác.
Chỉnh sửa ngược lại file spec.md hoặc plan.md (nếu phát hiện lỗ hổng ở bước này, chỉ thêm task "Verify/Investigate..." hoặc báo cáo).
Viết source code (không tạo/chỉnh sửa file trong thư mục src/).
Chỉnh sửa tài liệu project-level.
Commit hoặc push.
Trước khi làm việc, kiểm tra git status và bảo toàn tất cả thay đổi chưa commit.

6. Validation

Sau khi thực thi tạo tasks:
Traceability Check: Đảm bảo 100% các mục trong plan.md đều đã được ánh xạ thành ít nhất 1 task trong tasks.md.
Dependency Check: Đảm bảo thứ tự các task logic (không thể gọi API ở frontend nếu task tạo API backend chưa được làm trước đó).
Đảm bảo file tasks.md chuẩn format Markdown checklist và hoàn toàn bằng tiếng Anh.
Kiểm tra Git diff để bảo đảm không sửa file ngoài phạm vi.

7. Final Report

Báo cáo bằng tiếng Việt:
Tên và đường dẫn feature 032 đã xác định.
Trạng thái thực thi tạo file tasks.md.
Tóm tắt cấu trúc file tasks (Liệt kê các Phase và tổng số lượng task được tạo).
Xác nhận sự liên kết (traceability) giữa plan.md và tasks.md (có phần nào trong plan khó chia task không?).
Đánh giá mức độ sẵn sàng để chuyển sang bước lập trình thực tế (/speckit.implement).
Danh sách file đã thay đổi/tạo mới.

Completion criteria: Chỉ thực hiện phân rã và xuất file tasks.md cho feature <Tên/ID Feature>. Dừng lại sau khi xuất báo cáo để chờ tôi xác nhận, tuyệt đối không tự động chuyển sang bước viết code (/speckit.implement) hay chuyển sang feature tiếp theo.
```

### Tóm tắt phản hồi của AI

*   **Xác nhận Context:** AI đã xác định đúng ngữ cảnh làm việc tại thư mục `032-ai-lyrics-search` và đảm bảo các file `spec.md`, `plan.md` đã có sẵn.
*   **Điều chỉnh Danh sách Task:** Phát hiện file `tasks.md` trước đó tổ chức kiểm thử (test) sai trình tự logic (đặt quá muộn và sai nhãn User Story). AI đã xóa file cũ và tái tạo file mới 100% bằng tiếng Anh.
*   **Cấu trúc Task Breakdown:** Đã tạo ra **49 task** (tăng thêm độ chi tiết) chia thành **6 Phase**:
    *   Phase 1: Resolve Service, Contract, and Test Gates (9 tasks)
    *   Phase 2: Foundational AI Service Boundary (7 tasks)
    *   Phase 3: US1 – Find a Song from a Lyric Fragment (11 tasks)
    *   Phase 4: US2 – Understand Search Results and Empty Matches (3 tasks)
    *   Phase 5: US3 – Continue Searching When AI Search Is Unavailable (14 tasks)
    *   Phase 6: Polish, Acceptance, and Regression (5 tasks)
*   **Bảo toàn kiến trúc:** Các yếu tố chưa được chốt từ Plan (endpoint schema, AI provider, quy tắc normalization/tie-break, nguồn lấy lyric) đều được cô lập thành các cổng xác nhận (Verify/Confirm) ở Phase 1. Không tự suy diễn hay "vượt quyền" thiết kế.
*   **Đánh giá:** Tính năng **chưa sẵn sàng** để bước vào giai đoạn code (`/speckit.implement`) cho đến khi các rào cản ở Phase 1 được giải quyết hoàn toàn (nhất là mâu thuẫn timeout 3 giây vs 5 giây).

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do | 
| ----- | ----- | ----- | 
| Cấu trúc 49 task chia thành 6 Phase theo User Story | Dùng | Sắp xếp lại trình tự logic (test contract trước khi gọi API, test story trước khi code) giúp đảm bảo quy trình TDD (Test-Driven Development). | 
| Cố định các cổng xác nhận (gates) ở Phase 1 | Dùng | Đảm bảo an toàn kỹ thuật, bắt buộc Product Owner và Tech Lead phải thống nhất schema và AI Provider trước khi code. | 
| Giữ nguyên các thay đổi chưa commit của file khác | Dùng | Tôn trọng vùng làm việc (Git workspace), không vô tình làm hỏng các chỉnh sửa đang làm dở của feature 031 hay tài liệu log. | 

### Cách kiểm chứng

- [x] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt. Danh sách công việc cho Feature 032 đã hoàn thiện. Yêu cầu làm rõ các vấn đề mâu thuẫn trước khi lập trình.

## Mục 28: Phân rã công việc (Task Breakdown) cho spec 033 bằng Spec Kit

| Trường | Nội dung | 
| ----- | ----- | 
| Ngày | 2026-11-08 | 
| Người thực hiện | Nguyễn Khánh Đăng | 
| Nhóm tính năng liên quan | 030 – Search, Feature 033: Semantic Vector Music Search | 
| Công cụ AI | GPT-5.6-Luna | 
| Mục đích | Sử dụng lệnh `/speckit.tasks` để rà soát và tạo mới danh sách công việc (`tasks.md`) cho tính năng tìm kiếm nhạc ngữ nghĩa, đảm bảo giữ vững các cổng phê duyệt (approval gates) và kịch bản dự phòng (fallback) đã chốt. | 

### Prompt đã dùng

```
/speckit-tasks # TASK: Execute /speckit.tasks for Task Generation of Feature 033 Only

Bạn đang làm việc trong repository AuraTune.

Hãy sử dụng Spec Kit /speckit.tasks để tiến hành phân rã kế hoạch triển khai thành danh sách công việc chi tiết (task breakdown) và tạo/cập nhật file tasks.md cho feature 033 đang được chỉ định.
Chỉ thực hiện tạo Tasks cho feature 033. Không xử lý feature khác.

1. Xác định Feature 033

Kiểm tra:
Thư mục chứa spec của feature hiện tại: specs/030-search/033-semantic-vector-search/
Các thư mục và file con bên trong, đặc biệt phải đảm bảo file spec.md và plan.md đã tồn tại.
Nếu không tìm thấy feature được yêu cầu hoặc file plan.md chưa tồn tại, hãy dừng lại và báo cáo. Không thể chia task nếu chưa có kế hoạch kỹ thuật.

2. Đọc tài liệu nguồn

Đọc các tài liệu để làm hệ quy chiếu:
docs/management/speckit-workflow-guide.md
docs/management/team-contract.md
Toàn bộ nội dung của spec.md (Nghiệp vụ) và đặc biệt là plan.md (Kế hoạch kỹ thuật) của feature 033.
Các quy chuẩn coding convention hiện hành của dự án (nếu có nhắc đến trong docs).
Sử dụng plan.md làm đầu vào tối thượng (single source of truth) cho bước này. Mọi task sinh ra phải có cơ sở từ plan.md.

3. Thực thi Task Breakdown

Sau khi xác định đúng feature context và nắm rõ bản Kế hoạch:
Chọn feature 033 làm context hiện hành.
Quét toàn bộ plan.md và phân rã các quyết định kỹ thuật thành các hành động lập trình cụ thể, độc lập và có thể kiểm chứng được .

Tổ chức file tasks.md theo các Giai đoạn dựa trên mức độ phụ thuộc . Ví dụ (có thể tùy chỉnh theo plan):
Phase 1: Setup & Database (Schema changes, Supabase/PostgreSQL migrations, types/interfaces).
Phase 2: Backend Services & API (Go/Node.js endpoints, middleware, business logic).
Phase 3: Frontend State & API Integration (Redux/Zustand slices, API hooks, React Query).
Phase 4: Frontend UI Components (React components, styling, UI validation).
Phase 5: Testing, Error Handling & Polish (Unit tests, loading states, error boundaries).

4. Yêu cầu đối với quá trình tạo Tasks

Khi tiến hành tạo/cập nhật tasks.md, bạn cần:
Trình bày dưới dạng danh sách checkbox của Markdown (- [ ]).
Viết tên task bằng động từ hành động rõ ràng (VD: Create..., Implement..., Update..., Add test for...).
Cung cấp bối cảnh ngắn gọn trong từng task nếu cần (VD: file nào cần sửa, endpoint nào cần gọi).

CRITICAL REQUIREMENT: Dù quá trình trao đổi/hỏi đáp diễn ra bằng tiếng Việt, nội dung file tasks.md ĐỀU BẮT BUỘC phải viết 100% bằng tiếng Anh.

Không tự ý:
Bỏ sót bất kỳ yêu cầu kỹ thuật hay luồng xử lý lỗi nào đã được chốt trong plan.md.
Sáng tác thêm các task nằm ngoài phạm vi của plan.md hoặc spec.md.
Gộp quá nhiều việc lớn vào chung một checkbox (phải chia nhỏ để dễ theo dõi tiến độ).

5. Scope giới hạn

Chỉ được phép phân tích plan.md và tạo/cập nhật file tasks.md của feature 033.

Không được:
Làm rã task cho bất kỳ feature nào khác.
Chỉnh sửa ngược lại file spec.md hoặc plan.md (nếu phát hiện lỗ hổng ở bước này, chỉ thêm task "Verify/Investigate..." hoặc báo cáo).
Viết source code (không tạo/chỉnh sửa file trong thư mục src/).
Chỉnh sửa tài liệu project-level.
Commit hoặc push.
Trước khi làm việc, kiểm tra git status và bảo toàn tất cả thay đổi chưa commit.

6. Validation

Sau khi thực thi tạo tasks:
Traceability Check: Đảm bảo 100% các mục trong plan.md đều đã được ánh xạ thành ít nhất 1 task trong tasks.md.
Dependency Check: Đảm bảo thứ tự các task logic (không thể gọi API ở frontend nếu task tạo API backend chưa được làm trước đó).
Đảm bảo file tasks.md chuẩn format Markdown checklist và hoàn toàn bằng tiếng Anh.
Kiểm tra Git diff để bảo đảm không sửa file ngoài phạm vi.

7. Final Report

Báo cáo bằng tiếng Việt:
Tên và đường dẫn feature 033 đã xác định.
Trạng thái thực thi tạo file tasks.md.
Tóm tắt cấu trúc file tasks (Liệt kê các Phase và tổng số lượng task được tạo).
Xác nhận sự liên kết (traceability) giữa plan.md và tasks.md (có phần nào trong plan khó chia task không?).
Đánh giá mức độ sẵn sàng để chuyển sang bước lập trình thực tế (/speckit.implement).
Danh sách file đã thay đổi/tạo mới.

Completion criteria: Chỉ thực hiện phân rã và xuất file tasks.md cho feature <Tên/ID Feature>. Dừng lại sau khi xuất báo cáo để chờ tôi xác nhận, tuyệt đối không tự động chuyển sang bước viết code (/speckit.implement) hay chuyển sang feature tiếp theo.

```

### Tóm tắt phản hồi của AI

* **Xác nhận Context & Bảo toàn mã nguồn:** Xác định đúng feature `033-semantic-vector-search`, ghi nhận và giữ nguyên toàn bộ các thay đổi Git chưa commit của các tính năng khác để tránh xung đột.

* **Chi tiết Task Breakdown:** Tạo mới file `tasks.md` 100% bằng tiếng Anh. Tổng cộng có **53 task** được chia thành **7 Phase**:

  * Phase 1: Setup and Approval Gates (10 tasks)

  * Phase 2: Foundational Search Infrastructure (4 tasks)

  * Phase 3: US1 — Mood Search (11 tasks)

  * Phase 4: US2 — Multi-dimensional Ranking (7 tasks)

  * Phase 5: US3 — Fallback (8 tasks)

  * Phase 6: US4 — Privacy (8 tasks)

  * Phase 7: Polish and Cross-Cutting Validation (5 tasks)

* **Xử lý các rào cản kỹ thuật (Gates):** Các quyết định chưa được chốt (API provider, nguồn catalog, score ownership) được cô lập thành các task yêu cầu xác nhận ở Phase 1. Không tự ý chọn giải pháp thay thế.

* **Quy tắc nghiệp vụ:** Bám sát các quyết định đã làm rõ: giữ nguyên ngưỡng fallback timeout là 1.500 ms, áp dụng ranking trọng số 30/40/30, xử lý lỗi 429 và đặt yêu cầu bắt buộc chạy luồng Privacy Gate trước khi gọi AI.

* **Đánh giá:** Tính năng **chưa sẵn sàng** để bước vào giai đoạn implement do còn phụ thuộc vào các Approval Gates ở Phase 1.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do | 
| ----- | ----- | ----- | 
| Cấu trúc 53 task chia thành 7 Phase | Dùng | Đảm bảo bao quát đầy đủ 4 User Story, tách bạch rõ ràng phần setup infrastructure với luồng nghiệp vụ và bảo mật. | 
| Giữ nguyên mốc fallback 1.500 ms | Dùng | Tuân thủ chính xác quyết định đã được làm rõ trong tài liệu plan, loại bỏ sự mâu thuẫn không cần thiết. | 
| Khóa lời gọi AI sau Privacy Gate | Dùng | Ưu tiên hàng đầu về bảo mật thông tin cá nhân của dự án, mọi truy vấn phải qua bước làm sạch trước khi gửi cho AI. | 

### Cách kiểm chứng

- [x] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt. Danh sách công việc cho Feature 033 đã hoàn thiện và bao phủ toàn bộ các góc độ kỹ thuật. Cần chờ Tech Lead xác nhận các cổng phê duyệt ở Phase 1 trước khi bắt đầu viết code.
