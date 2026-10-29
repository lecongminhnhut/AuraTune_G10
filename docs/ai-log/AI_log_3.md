# Nhật ký sử dụng AI – Metadata Search (031)

_Mỗi lần dùng AI được ghi thành một mục riêng theo trình tự thực hiện._

| # | Ngày | Nội dung | Nhóm |
|---|---|---|---|
| 1 | 2026-10-28 | Viết spec 031 – Metadata Search bằng `/speckit-specify` | 030 |
| 2 | 2026-10-28 | Làm rõ spec 031 bằng `$speckit-clarify` – phân trang, giới hạn từ khóa, cơ chế matching và xử lý xung đột filter | 030 |

---

## Mục 1: Viết spec 031 – Metadata Search

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

## Mục 2: Làm rõ spec 031 – Metadata Search

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