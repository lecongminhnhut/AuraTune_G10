# Nhật ký sử dụng AI – Frontend Foundation (131)

_Mỗi lần dùng AI được ghi thành một mục riêng theo trình tự thực hiện._

| # | Ngày | Nội dung | Nhóm |
|---|---|---|---|
| 1 | 2026-10-30 | Viết spec và plan 131 – Frontend Foundation, soạn mô tả Pull Request | 130 |

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
