# Nhật ký sử dụng AI – Metadata Search (031)

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

# Nhật ký sử dụng AI – AI Lyrics Search (032)

| # | Ngày | Nội dung | Nhóm |
|---|---|---|---|
| 1 | 2026-10-29 | Viết spec 032 – AI Lyrics Search bằng `/speckit-specify` | 030 |
| 2 | 2026-10-29 | Làm rõ spec 032 bằng `/speckit-clarify` – giới hạn đầu vào, xử lý timeout, UI/UX fallback và xung đột luồng | 030 |

---

## Mục 1: Viết spec 032 – AI Lyrics Search

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

## Mục 2: Làm rõ spec 032 – AI Lyrics Search

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

# Nhật ký sử dụng AI – Semantic Vector Music Search (033)

| #  | Ngày | Nội dung  | Nhóm |
| -- | ---- | --------  | ---- |
| 1   | 2026-10-29 | Viết spec 033 – Semantic Vector Music Search bằng `$speckit-specify`   | 030   |
| 2   | 2026-10-29 | Làm rõ spec 033 bằng `$speckit-clarify` – ranking, audio fields, privacy, thresholds và metrics | 030   |

---

## Mục 1: Viết spec 033 – Semantic Vector Music Search

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

## Mục 2: Làm rõ spec 033 – `$speckit-clarify`

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

# Nhật ký sử dụng AI – Album Details (081)

| # | Ngày | Nội dung | Nhóm |
|---|---|---|---|
| 1 | 2026-10-30 | Viết spec 081 – Album Details bằng `/speckit-specify` | 080 |
| 2 | 2026-10-30 | Làm rõ spec 081 bằng `/speckit-clarify` – xử lý danh sách bài hát lớn, album nhiều đĩa, ký hiệu thiếu dữ liệu, ảnh bìa mặc định và cơ chế cache | 080 |

---

## Mục 1: Viết spec 081 – Album Details

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

## Mục 2: Làm rõ spec 081 – Album Details

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