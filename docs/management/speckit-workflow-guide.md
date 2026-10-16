# Hướng dẫn sử dụng Spec Kit cho AuraTune

## 1. Mục đích

Tài liệu này hướng dẫn nhóm AuraTune sử dụng Spec Kit theo một quy trình thống nhất, từ viết đặc tả tính năng đến lập kế hoạch, chia task, triển khai và kiểm thử.

Hãy sử dụng tài liệu này cùng với:

- `specs/README.md`: cấu trúc thư mục đặc tả và quy ước đặt tên.
- `docs/proposal/proposal.md`: phạm vi sản phẩm đã được thống nhất.
- `docs/management/team-contract.md`: phân công nhóm chức năng và trách nhiệm của thành viên.
- Cấu hình Spec Kit trong `.specify/` và cấu hình của AI agent đang sử dụng.

> **Lưu ý:** Các lệnh và đường dẫn đầu ra phụ thuộc phiên bản Spec Kit, AI agent và cấu hình repository. Quy trình dưới đây sử dụng các lệnh `/speckit.*` mà nhóm dự định dùng; hãy bảo đảm chúng tồn tại trong môi trường của dự án.

## 2. Quy trình tổng thể

```text
Chọn feature
    |
    v
/speckit.specify
    |
    v
/speckit.clarify
    |
    v
Rà soát và xác nhận spec.md
    |
    v
/speckit.plan
    |
    v
/speckit.tasks
    |
    v
/speckit.implement
    |
    v
Kiểm thử, review, cập nhật tài liệu và tạo Pull Request
```

Thứ tự chuẩn của nhóm:

1. `/speckit.specify` — tạo đặc tả ban đầu.
2. `/speckit.clarify` — làm rõ các yêu cầu chưa rõ.
3. `/speckit.plan` — lập kế hoạch kỹ thuật.
4. `/speckit.tasks` — tạo danh sách task.
5. `/speckit.implement` — triển khai theo task.
6. Kiểm thử, review và mở Pull Request theo Git Workflow.

## 3. Bước 1 — Viết đặc tả bằng `/speckit.specify`

### Mục tiêu

Mô tả tính năng cần làm gì, phục vụ ai và kết quả mong đợi là gì. Ở bước này, tập trung vào yêu cầu thay vì tự quyết định chi tiết triển khai kỹ thuật.

### Cách thực hiện

1. Chọn thư mục feature trong `specs/`, ví dụ `specs/031-metadata-search/`.
2. Đối chiếu phạm vi feature với `docs/proposal/proposal.md`.
3. Mở AI agent tại thư mục gốc repository và chạy:

   ```text
   /speckit.specify
   ```

4. Mô tả rõ:
   - Vấn đề hoặc nhu cầu cần giải quyết.
   - Người dùng và quyền liên quan.
   - Các kịch bản sử dụng chính.
   - Hành vi mong đợi.
   - Tiêu chí chấp nhận (acceptance criteria).
   - Trường hợp biên và hành vi khi có lỗi.
   - Phạm vi không thực hiện, nếu cần.

5. Yêu cầu AI tuân thủ Proposal và Team Contract, không tự thêm tính năng chưa được thống nhất.
6. Đọc lại tài liệu đặc tả được tạo.

### Ví dụ prompt

```text
/speckit.specify

Đặc tả tính năng tìm kiếm metadata cho AuraTune. Người dùng có thể
tìm bài hát, nghệ sĩ và album bằng truy vấn văn bản. Hãy mô tả
kịch bản sử dụng, tiêu chí chấp nhận, hành vi khi không có kết quả,
kiểm tra dữ liệu đầu vào và các trường hợp biên.

Tuân thủ phạm vi trong proposal đã được thống nhất. Tập trung vào
hành vi và yêu cầu; không tự đưa ra quyết định kỹ thuật chưa được
dự án xác nhận.
```

**Kết quả mong đợi:** bản đặc tả ban đầu, thường là `spec.md`, được tạo theo cấu hình Spec Kit của repository.

## 4. Bước 2 — Làm rõ đặc tả bằng `/speckit.clarify`

### Mục tiêu

Phát hiện và làm rõ những điểm mơ hồ, thiếu thông tin hoặc có thể dẫn đến nhiều cách hiểu khác nhau trong đặc tả trước khi lập kế hoạch kỹ thuật.

### Cách thực hiện

Sau khi có bản đặc tả ban đầu, chạy:

```text
/speckit.clarify
```

Làm theo câu hỏi và hướng dẫn do skill đưa ra. Tập trung làm rõ:

- Quy tắc nghiệp vụ chưa được xác định.
- Vai trò và quyền truy cập của người dùng.
- Hành vi khi dữ liệu thiếu, không hợp lệ hoặc không có kết quả.
- Trạng thái lỗi và các trường hợp ngoại lệ.
- Tiêu chí chấp nhận chưa cụ thể hoặc chưa kiểm thử được.
- Phụ thuộc có thể ảnh hưởng đến phạm vi hoặc hành vi tính năng.

Sau khi trả lời các câu hỏi:

1. Đọc lại `spec.md` và những phần được skill cập nhật.
2. Kiểm tra các câu trả lời đã được phản ánh đúng trong đặc tả hay chưa.
3. Nếu câu hỏi làm phát sinh yêu cầu ngoài phạm vi Proposal, hãy trao đổi với nhóm trước khi đưa vào phạm vi chính thức.
4. Chỉ chuyển sang bước Plan khi các điểm quan trọng đã đủ rõ để thiết kế.

**Kết quả mong đợi:** đặc tả đã được làm rõ và đủ cụ thể để lập kế hoạch. Không mặc định rằng skill sẽ tự giải quyết mọi câu hỏi hoặc tự phê duyệt thay nhóm.

## 5. Bước 3 — Lập kế hoạch bằng `/speckit.plan`

### Mục tiêu

Xác định cách triển khai đặc tả đã được làm rõ trong kiến trúc hiện tại của AuraTune.

Chạy:

```text
/speckit.plan
```

Cung cấp hoặc xác nhận các ràng buộc kỹ thuật đã được dự án quyết định, chẳng hạn:

- Tech stack và kiến trúc hiện tại.
- Quy ước code và cấu trúc source.
- Database và mô hình dữ liệu liên quan.
- API contract và điểm tích hợp.
- Authentication, authorization và yêu cầu bảo mật.
- Testing và cách chạy ứng dụng.

Không tự giả định công nghệ hoặc quyết định kiến trúc chưa được dự án xác nhận.

Tùy cấu hình, bước Plan có thể tạo các artifact như:

- `plan.md`: phương án triển khai kỹ thuật.
- `research.md`: kết quả nghiên cứu các câu hỏi kỹ thuật.
- `data-model.md`: mô hình dữ liệu khi cần.
- `contracts/`: API hoặc hợp đồng tích hợp khi cần.
- `quickstart.md`: hướng dẫn chạy hoặc kiểm tra khi cần.

Tên file và vị trí cụ thể phụ thuộc template cùng cấu hình của repository.

### Kiểm tra trước khi tiếp tục

- Kế hoạch đáp ứng `spec.md`.
- Không mâu thuẫn với kiến trúc hiện tại.
- Các phụ thuộc và điểm tích hợp đã được nhận diện.
- Bảo mật, phân quyền và xử lý lỗi đã được xem xét.
- Không tự ý thêm tính năng ngoài phạm vi.

## 6. Bước 4 — Tạo task bằng `/speckit.tasks`

### Mục tiêu

Chia kế hoạch thành các công việc cụ thể, có thứ tự và có thể theo dõi.

Chạy:

```text
/speckit.tasks
```

Rà soát `tasks.md` được tạo và kiểm tra:

- Mỗi task có mục tiêu rõ ràng.
- Thứ tự task phản ánh các phụ thuộc.
- Có task kiểm thử phù hợp.
- Có cập nhật tài liệu hoặc contract nếu cần.
- Các phần cần phối hợp với nhóm khác đã được ghi nhận.
- Task không vượt phạm vi đã duyệt.

Nếu task quá lớn, yêu cầu chia nhỏ. Nếu phát hiện yêu cầu mới, hãy cập nhật và xác nhận đặc tả trước khi tiếp tục.

## 7. Bước 5 — Triển khai bằng `/speckit.implement`

### Mục tiêu

Triển khai các task theo kế hoạch đã được rà soát.

Chạy:

```text
/speckit.implement
```

Trong quá trình thực hiện:

1. Kiểm tra code hiện có trước khi chỉnh sửa.
2. Tuân thủ kiến trúc và quy ước code của AuraTune.
3. Chỉ thực hiện phạm vi đã được thống nhất.
4. Viết hoặc cập nhật test phù hợp.
5. Chạy test, lint, type check và build nếu dự án có cấu hình.
6. Kiểm tra diff để phát hiện thay đổi ngoài ý muốn.
7. Cập nhật tài liệu khi hành vi hoặc contract thay đổi.
8. Không commit `.env`, API key, credentials hoặc secrets.

Theo Team Contract, thành viên phải hiểu và giải thích được code do AI hỗ trợ tạo ra.

## 8. Bước 6 — Kiểm thử và review

Trước khi tạo Pull Request, xác nhận rằng:

- Các acceptance criteria trong `spec.md` đã được đáp ứng.
- Test liên quan chạy thành công.
- Ứng dụng build và hoạt động như mong đợi.
- API contract và data model nhất quán với phần còn lại của dự án.
- Quyền truy cập và các trường hợp lỗi đã được kiểm tra.
- Không có secrets trong các thay đổi.
- Đặc tả, kế hoạch, task và code không mâu thuẫn.

Nếu yêu cầu thay đổi trong quá trình triển khai, cập nhật và review đặc tả cùng các artifact liên quan.

## 9. Bước 7 — Git và Pull Request

Tuân thủ `docs/management/git-workflow.md` và Team Contract.

1. Đồng bộ với branch `develop` mới nhất.
2. Tạo branch feature hoặc bugfix có Jira task ID.
3. Tạo commit nhỏ, có ý nghĩa theo Conventional Commits.
4. Push branch và mở Pull Request hướng vào `develop`.
5. Có ít nhất một thành viên khác review và approve.
6. Giải quyết conflict có trách nhiệm; không force-push ghi đè công việc của người khác.

Ví dụ:

```text
feature/AT-12-google-login
feat(search): add metadata search
```

Đây chỉ là ví dụ; hãy dùng Jira ID thực tế được giao.

## 10. Phối hợp giữa các nhóm chức năng

Một số phần dùng chung cần được phối hợp, không nên tự định nghĩa riêng theo từng feature:

- Authentication và phân quyền.
- Data model của bài hát, nghệ sĩ, album và playlist.
- Tích hợp Music Player với Queue.
- Tích hợp Listening History với AI Recommendations.
- Tích hợp Search với AI Conversational Agent.
- API contract, storage, security và deployment.

Nếu feature phụ thuộc nhóm khác, ghi rõ trong spec hoặc plan và trao đổi với người phụ trách liên quan.

## 11. Checklist cho mỗi feature

- [ ] Đã xác nhận feature thuộc phạm vi Proposal.
- [ ] Đã xác nhận người phụ trách và các phụ thuộc.
- [ ] Đã chạy `/speckit.specify`.
- [ ] Đã chạy `/speckit.clarify` và rà soát kết quả.
- [ ] Đã xác nhận `spec.md` đủ rõ.
- [ ] Đã chạy `/speckit.plan`.
- [ ] Đã review kế hoạch và các artifact liên quan.
- [ ] Đã chạy `/speckit.tasks`.
- [ ] Đã review thứ tự task và phạm vi.
- [ ] Đã chạy `/speckit.implement`.
- [ ] Đã chạy test và review thay đổi.
- [ ] Đã cập nhật tài liệu nếu cần.
- [ ] Đã mở Pull Request vào `develop`.
- [ ] Đã nhận approval từ thành viên khác.

## 12. Xử lý vấn đề thường gặp

### Lệnh không được nhận diện

Kiểm tra Spec Kit đã được cài đặt và khởi tạo trong repository chưa, AI agent hiện tại có hỗ trợ tích hợp đó không, và tên lệnh có khớp cấu hình không. Kiểm tra `.specify/` cùng cấu hình agent thay vì tạo thư mục cấu hình trùng lặp.

### File được tạo sai thư mục

Kiểm tra template và cấu hình đầu ra của Spec Kit. Các thư mục đánh mã trong `specs/` là quy ước tổ chức của nhóm; có thể cần cấu hình hoặc hướng dẫn rõ đường dẫn mong muốn. Không mặc định Spec Kit sẽ tự chọn đúng thư mục.

### Phạm vi feature liên tục mở rộng

Đối chiếu với Proposal và `spec.md`. Đưa các ý tưởng chưa được phê duyệt ra khỏi phạm vi chính thức cho đến khi nhóm thống nhất.

### Sau khi clarify, đặc tả vẫn còn điểm chưa rõ

Không bỏ qua các quyết định có thể ảnh hưởng đáng kể đến thiết kế. Tiếp tục trao đổi với người phụ trách hoặc nhóm, sau đó cập nhật và kiểm tra lại `spec.md`.

### Plan phát hiện yêu cầu còn thiếu

Cập nhật và review đặc tả trước, sau đó điều chỉnh các artifact phụ thuộc như plan và tasks.

---

## Nguyên tắc cốt lõi

**Specify → Clarify → Plan → Tasks → Implement → Test & Review → Pull Request**

- `spec.md` mô tả hành vi và yêu cầu mong đợi của feature.
- `plan.md` giải thích cách dự kiến triển khai.
- `tasks.md` chia công việc thành các bước có thể thực hiện.
- Code phải đáp ứng đặc tả đã được nhóm thống nhất; không được âm thầm thay đổi phạm vi.
