# Nhật ký sử dụng AI – Frontend Foundation (131)

_Mỗi lần dùng AI được ghi thành một mục riêng theo trình tự thực hiện._

| # | Ngày | Nội dung | Nhóm |
|---|---|---|---|
| 1 | 2026-10-30 | Viết spec và plan 131 – Frontend Foundation, soạn mô tả Pull Request | 130 |
| 2 | 2026-10-31 | Dùng AI hỗ trợ soạn nháp spec và checklist nhóm 020, 040, 050, cập nhật spec 131 và chụp ảnh UI | 020, 040, 050, 130 |
| 3 | 2026-11-04 | Viết đặc tả 22 use case nhóm 020, 040, 050 và prototype UI cho Sprint 3 (D-16, D-17) | 020, 040, 050 |

---

## Mục 1: Viết spec và plan 131 – Frontend Foundation

| Trường | Nội dung |
|---|---|
| Ngày | 2026-10-30 |
| Người thực hiện | Huy |
| Nhóm tính năng liên quan | 130 – Frontend, Feature 131: Frontend Foundation (`specs/130-frontend/131-frontend-foundation`) |
| Công cụ AI | Claude Code |
| Mục đích | Rà soát repo, đề xuất vị trí tài liệu, soạn spec, plan và mô tả Pull Request cho phần frontend dùng chung |

### Prompt đã dùng

```text
Đóng vai là một Senior Tech Lead. Tôi đang đảm nhận vai trò Lead Frontend cho đồ án web nghe nhạc `AuraTune_G10`.
Nhóm trưởng vừa yêu cầu tôi: "Viết PR, Specs (Đặc tả) và viết Plan (Kế hoạch), sau đó up lên GitHub".
Hãy giúp tôi giải quyết toàn bộ yêu cầu này bằng cách thực hiện các bước sau:
Bước 1: Kiểm tra cấu trúc và chỉ định vị trí lưu file. Hãy quét cấu trúc thư mục hiện tại của dự án, nhớ coi hết tất cả các nhánh con, hoặc tạo nhánh mới. Hãy cho tôi biết chính xác tôi nên tạo file `frontend_specs.md` và `frontend_plan.md` ở đường dẫn nào là hợp lý nhất.
Bước 2: Soạn mẫu Pull Request (PR) Description. Viết sẵn cho tôi một đoạn mô tả PR bằng tiếng Anh thật chuyên nghiệp. Cần có đủ các mục: What is this PR for, Specs overview, Plan overview, và Checklists.

bạn có thể coi những mẫu của thành viên khác trong github để làm tương tự cho chính xác
```

### Tóm tắt phản hồi của AI

- Rà soát toàn bộ nhánh, tài liệu quy trình, API Contract, các spec hiện có và mã nguồn `src/frontend`.
- Đề xuất nhóm `130-frontend` cho yêu cầu frontend dùng chung và soạn `spec.md`, `plan.md`, `checklists/requirements.md` theo mẫu của nhóm.
- Ghi nhận 8 câu hỏi mở, gồm các điểm mâu thuẫn giữa tài liệu cần nhóm quyết định.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do |
| ----- | ---------- | ----- |
| Nhóm `130-frontend` | Dùng | Không nhóm tính năng hiện có nào phù hợp với phần dùng chung |
| Tên file `frontend_specs.md`, `frontend_plan.md` | Sửa | Đổi thành `spec.md`, `plan.md` để giống các thành viên khác và cấu hình Spec Kit |
| Kế hoạch 5 giai đoạn theo Sprint 3 đến 5 | Dùng | Khớp với mốc trong Project Plan |

### Cách kiểm chứng

- [x] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt sau khi chỉnh sửa.

**Ghi chú:** Bản build frontend trên `main` chạy thành công. Trạng thái trong spec được đối chiếu với mã nguồn ở mức nhóm tính năng, chưa soát từng yêu cầu của từng spec.

---

## Mục 2: Hỗ trợ soạn nháp spec nhóm 020, 040, 050 và cập nhật spec 131

| Trường | Nội dung |
|---|---|
| Ngày | 2026-10-31 |
| Người thực hiện | Huy |
| Nhóm tính năng liên quan | 020 – Home Dashboard, 040 – Music Player, 050 – Queue Management, 130 – Frontend |
| Công cụ AI | Claude Code |
| Mục đích | Hỗ trợ soạn nháp spec và checklist theo báo cáo audit, cập nhật spec 131 và chụp ảnh UI bổ sung |

### Tóm tắt yêu cầu

Đây là phần diễn đạt lại của người thực hiện, phần prompt gốc nằm ở mục tiếp theo.

- Đối chiếu báo cáo audit `spec-audit-report.md` với repo để xác định các mục còn thiếu của nhóm 020, 040, 050 và 130.
- Hỗ trợ soạn nháp spec và checklist theo mẫu Spec Kit, bám theo Proposal, Vision Document, API Contract và mã nguồn hiện có.
- Bổ sung ảnh UI còn thiếu vào spec theo yêu cầu của nhóm trưởng.

### Prompt đã dùng

```text
Dựa vào file spec-audit-report.md đính kèm, hãy phân tích và liệt kê giúp tôi những mục còn thiếu hoặc chưa khớp với spec hiện tại. Hãy đề xuất nội dung bổ sung hoặc bản nháp cho từng phần thiếu đó để tôi review và chỉnh sửa trước khi tự push lên GitHub.

Trong PR mới nhất, nhóm trưởng đã thêm sẵn một số file PNG vào spec cho các phần tôi làm và nhắn tôi bổ sung nốt các ảnh UI còn thiếu. Mục tiêu là hoàn thiện bộ spec trực quan này để làm ngữ cảnh (context) chuẩn, giúp AI hỗ trợ generate phần khung UI code nhanh hơn ở bước sau. Hãy kiểm tra giúp tôi xem những màn hình nào trong spec chưa có ảnh minh họa để tôi thiết kế và gắn vào cho đủ.
```

### Tóm tắt phản hồi của AI

- Đối chiếu báo cáo audit với repo và xác định các mục thuộc phần của người thực hiện.
- Soạn bản nháp 15 spec và checklist theo mẫu Spec Kit, dựa trên Proposal, Vision Document, API Contract và mã nguồn frontend.
- Đề xuất câu trả lời cho phần Clarifications và quyết định tạm cho OQ-1 đến OQ-8 trong spec 131.
- Ghi nhận khác biệt giữa spec và prototype trong mục Known Gaps.
- Chụp 12 ảnh UI từ bản chạy cục bộ cho spec 021, 024, 045, 046, 051, 052, 054 và 131.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do |
| ----- | ---------- | ----- |
| Bản nháp 15 spec và checklist | Dùng | Người thực hiện đọc lại và thấy phù hợp với phạm vi dự án |
| Câu trả lời trong Clarifications | Dùng | Người thực hiện đã đọc lại và xác nhận |
| Quyết định tạm cho OQ-1 đến OQ-8 | Dùng | Chờ người phụ trách từng mục xác nhận |
| 12 ảnh UI bổ sung | Dùng | Bổ sung theo yêu cầu của nhóm trưởng |

### Cách kiểm chứng

- [ ] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt.

**Ghi chú:** Đây là tài liệu nên không chạy kiểm thử. Người thực hiện đọc lại phần Clarifications trước khi mở Pull Request.

---

## Mục 3: Viết đặc tả 22 use case nhóm 020, 040, 050 và prototype UI cho Sprint 3

| Trường | Nội dung |
|---|---|
| Ngày | 2026-11-04 |
| Người thực hiện | Huy |
| Nhóm tính năng liên quan | 020 – Home Dashboard, 040 – Music Player, 050 – Queue Management |
| Công cụ AI | Claude Code |
| Mục đích | Viết đặc tả 22 use case nhóm 020, 040, 050 và prototype UI cho Sprint 3 (Deliverables D-16, D-17) |

### Tóm tắt yêu cầu

Đây là phần diễn đạt lại của người thực hiện, phần prompt gốc nằm ở mục tiếp theo.

- Yêu cầu AI dùng mẫu use case 13 mục chuẩn của nhóm, lấy bộ use case nhóm 100 và 120 của Nhựt làm chuẩn.
- Chủ động thay spec cũ (31/10) bằng các quyết định theo Clarifications 1/11: queue được giữ qua lần tải lại trang, tối đa 50 bài, lịch sử nghe nhạc chỉ ghi nhận sau 30 giây.
- Rà soát và yêu cầu AI sửa lỗi truy vết: map đúng mã FR thực tế trong spec, ví dụ `051-FR-006` cho Clear Queue, thay vì lấy theo use-case model bị sai.
- Quản trị rủi ro UI: chỉ định dùng placeholder Markdown cho tính năng chưa code xong, như Save Queue as Playlist.

### Prompt đã dùng

```text
Chào Claude, tôi đang cần hoàn thiện bộ tài liệu Use Cases cho Sprint 3 (Deliverable D-16, D-17). Nhiệm vụ của tôi là đặc tả 22 Use Cases thuộc 3 module: 020 (Home Dashboard - 5 UCs), 040 (Music Player - 10 UCs), và 050 (Queue Management - 7 UCs).
Nhựt trong team tôi đã hoàn thành module 100 và 120. Tôi muốn bạn đóng vai trò là Technical Writer, giúp tôi generate ra các file Markdown (`.md`) dựa trên các rule thiết kế và phân tích mà tôi đã chốt dưới đây, sử dụng đúng format của Nhựt làm chuẩn.
Phân tích của tôi & Các Rule bắt buộc phải tuân thủ khi viết: Quá trình rà soát tài liệu, tôi đã phát hiện một số mâu thuẫn giữa bản spec cũ (31/10) và Clarifications mới nhất (1/11). Khi bạn sinh nội dung (đặc biệt là Alternative và Exception flow), bạn bắt buộc phải áp dụng các quyết định thiết kế sau của tôi:

1. Persistent Queue: Hàng đợi (Queue) không bị mất đi, phải được giữ nguyên trạng thái khi user reload trang.
2. Queue Limit: Giới hạn tối đa của hàng đợi là 50 bài hát. (Bạn phải thêm Exception Flow cho trường hợp user cố add bài thứ 51).
3. Lịch sử nghe nhạc: Action "Recently Played" chỉ được ghi nhận (trigger) khi user đã phát nhạc được ít nhất 30 giây.
4. Tính năng mới: Phải thiết kế đặc tả cho luồng `UC-050-007: Save Queue as Playlist`. Vì UI này team chưa code xong nên tôi chưa có ảnh, bạn cứ điền sẵn placeholder markdown (ví dụ: `![Save Queue UI](../../prototypes/050-007-save-queue.png)`) để tôi chèn ảnh sau.
5. Traceability Error: Tôi phát hiện matrix FR đang bị lệch. Ví dụ: `UC-050-006 (Clear Queue)` đang trỏ sai về `051-FR-005` (phát ngay). Mã đúng phải là `051-FR-006` (Xóa tất cả). Khi viết 22 UCs, bạn phải tự đối chiếu logic với file spec thật để điền đúng mã FR, tuyệt đối không chép theo mapping sai cũ.

Yêu cầu đầu ra: Hãy làm cuốn chiếu từng nhóm (bắt đầu từ nhóm 050 Queue Management trước, vì nhóm này có nhiều logic rule nhất). Cấu trúc mỗi file phải đảm bảo:

* Tên file chuẩn: `UC-0X0-00N-ten-ngan.md`
* Đủ 13 mục chuẩn (Basic flow, alternative, exception, pre/post-conditions...). Không viết tóm tắt.
* Có 1 file `README.md` kèm inventory table cho từng nhóm.

Hãy xác nhận bạn đã hiểu các rule tôi đặt ra, sau đó bắt đầu generate ngay nhóm 050 Queue Management (7 UCs) cho tôi kiểm tra trước.

Rà kỹ 020 và 040

Sửa theo đề xuất

Commit và push
```

### Tóm tắt phản hồi của AI

- Tìm mẫu use case của Nhựt trên nhánh `use-case-Nhut` và phát hiện 22 use case nhóm 020, 040, 050 đã có trên nhánh `use-case-Huy`, nên không sinh lại mà rà soát bộ hiện có theo 5 quy tắc.
- Kiểm tra bằng script: 22/22 file đủ 13 mục, mọi mã FR đều có trong spec, danh sách FR khớp giữa file use case, README, inventory và `use-case-model.md`, mọi đường dẫn ảnh đều tồn tại.
- Phát hiện các điểm cần sửa: phát playlist hoặc album dài hơn 50 bài chưa có luồng xử lý; mốc 30 giây thiếu vế 50% với bài ngắn và chưa rõ khi tạm dừng; mã UC-060 và UC-080 trong `use-case-model.md` lệch với file của Khoa và Đăng; 6 lỗi nhỏ trong UC-020-005 và UC-040-005 đến UC-040-009.
- Sửa theo đề xuất trong commit `e086d13`: thêm luồng giới hạn 50 bài cho UC-020-002, UC-020-005, UC-050-001, thêm AF-06 cho UC-040-001, sửa các lỗi nhỏ và đồng bộ README, inventory, use-case model.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần | Quyết định | Lý do |
| ----- | ---------- | ----- |
| Kết quả rà soát 13 mục và truy vết FR | Dùng | Khớp với spec 021–025, 041–046 và 051–054 |
| Sinh lại 22 use case từ đầu | Bỏ | Bộ use case đã có trên nhánh `use-case-Huy`, ghi đè sẽ mất nội dung đã viết |
| Đường dẫn placeholder `../../prototypes/050-007-save-queue.png` | Bỏ | Sai thư mục; UC-050-007 đã có ảnh wireframe tại `prototypes/UC-050-007-*.png` |
| Luồng giữ 50 bài đầu khi phát bộ sưu tập dài | Dùng | Cách hiểu tạm theo edge case của spec 052, chờ chốt trong spec 051 |
| Cách tính mốc 30 giây khi tạm dừng (AF-06) | Dùng | Cách hiểu tạm, chờ nhóm 070 xác nhận |
| Sửa 6 lỗi nhỏ ở nhóm 020 và 040 | Dùng | Khớp với spec và mã nguồn frontend |
| Đổi mã UC-060 và UC-080 | Bỏ | Chưa sửa ở lượt này, cần nhóm chốt lại `use-case-model.md` |

### Cách kiểm chứng

- [ ] Chạy thử hoặc kiểm thử kết quả (nếu áp dụng).
- [x] Đối chiếu với tài liệu chính thức và yêu cầu dự án.
- [x] Kiểm tra tính đúng đắn, bảo mật và các trường hợp ngoại lệ (nếu áp dụng).
- [x] Người thực hiện đã xem xét và chịu trách nhiệm về nội dung cuối cùng.

**Kết quả kiểm chứng:** Đạt sau khi chỉnh sửa.

**Ghi chú:** Đây là tài liệu nên không chạy kiểm thử. AI chạy script kiểm tra cấu trúc 13 mục, mã FR và đường dẫn ảnh trước khi commit `e086d13`. Mã UC-060, UC-080 và quy tắc giữ 50 bài đầu còn chờ nhóm chốt.
