# Nhật ký sử dụng AI – Frontend Foundation (131)

_Mỗi lần dùng AI được ghi thành một mục riêng theo trình tự thực hiện._

| # | Ngày | Nội dung | Nhóm |
|---|---|---|---|
| 1 | 2026-10-30 | Viết spec và plan 131 – Frontend Foundation, soạn mô tả Pull Request | 130 |
| 2 | 2026-10-31 | Dùng AI hỗ trợ soạn nháp spec và checklist nhóm 020, 040, 050, cập nhật spec 131 và chụp ảnh UI | 020, 040, 050, 130 |

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
đọc xem tôi thiếu gì sau đó hoàn thành rồi up lên github cho tôi
(kèm file spec-audit-report.md)

cái PR mới á là tui add png cho mấy cái ông làm rồi vô spec r nha làm thêm ảnh add vô đó thôi
cuối cho AI implement. Nhóm trưởng tôi nhắn thiếu ảnh UI và nói tôi làm như này
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
