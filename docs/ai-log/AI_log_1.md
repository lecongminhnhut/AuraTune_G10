# Nhật ký sử dụng AI – Listening History Analysis

_Mỗi lần dùng AI được ghi thành một mục riêng theo trình tự thực hiện._

| #   | Ngày       | Nội dung                                                                                                         | Nhóm                                              |
| --- | ---------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 1   | 2026-10-20 | Viết spec 101 – Listening History Analysis bằng `$speckit-specify`                                               | 10                                                |
| 2   | 2026-10-20 | Làm rõ spec 101 bằng `$speckit-clarify` – insight, nguồn dữ liệu và lịch sử hợp lệ                               | 10                                                |
| 3   | 2026-10-20 | Tiếp tục làm rõ spec 101 bằng `$speckit-clarify` – cách hiển thị, thời gian và xếp hạng thể loại                 | 10                                                |
| 4   | 2026-10-24 | Hoàn thiện metadata Performed by / Reviewed by / Edited by cho Project Plan theo phân công DL4 và bằng chứng Git | Project Plan / DL4 (không thuộc functional group) |
| 5   | 2026-10-30 | Viết spec 102 – Personalized Recommendations bằng `/speckit-specify` và tích hợp làm rõ                          | 10                                                |
| 6   | 2026-10-30 | Viết spec 103 – Mood and Context Recommendations bằng `/speckit-specify`                                         | 10                                                |
| 7   | 2026-10-30 | Làm rõ spec 103 bằng `/speckit-clarify` – phương thức nhập, nội dung đề xuất và fallback                         | 10                                                |
| 8   | 2026-10-30 | Viết spec 121 – Conversational Interface bằng `/speckit-specify`                                                 | 12                                                |
| 9   | 2026-10-30 | Làm rõ spec 121 bằng `/speckit-clarify` – vòng đời hội thoại, định dạng tin nhắn và xử lý lỗi                    | 12                                                |
| 10  | 2026-10-30 | Viết spec 122 – Music Intent Understanding bằng `/speckit-specify`                                               | 12                                                |
| 11  | 2026-10-30 | Làm rõ spec 122 bằng `/speckit-clarify` – danh mục ý định, smart defaults và kiến trúc orchestrator              | 12                                                |
| 12  | 2026-10-30 | Viết spec 123 – Real-Time Music Assistance bằng `/speckit-specify`                                               | 12                                                |
| 13  | 2026-10-30 | Làm rõ spec 123 bằng `/speckit-clarify` – danh mục hành động, điều phối client và widget phản hồi                | 12                                                |
| 14  | 2026-11-01 | Rà soát và làm rõ toàn diện 12 nhóm chức năng (010 – 120) và đồng bộ liên nhóm trước PA3                         | Toàn bộ 12 nhóm chức năng (010 – 120)             |
| 15  | 2026-11-03 | Xây dựng Use-Case Model hệ thống, hướng dẫn đặc tả Use Case (README) và tạo khung thư mục 12 nhóm cho PA3        | Toàn bộ 12 nhóm chức năng (010 – 120)             |
| 16  | 2026-11-03 | Xây dựng Use-Case Documentation cho Group 100 – AI Recommendations theo chuẩn PA3 và Spec Kit                    | 10 – AI Recommendations                           |
| 17  | 2026-11-03 | Xây dựng Use-Case Documentation cho Group 120 – AI Conversational Agent theo chuẩn PA3 và UI CLI vừa cập nhật    | 12 – AI Conversational Agent                      |
| 18  | 2026-11-03 | Lập Implementation Plan cho Feature 101 – Listening History Analysis bằng Spec Kit `/speckit.plan`               | 10 – AI Recommendations                           |
| 19  | 2026-11-03 | Lập Implementation Plan cho Feature 102 – Personalized Recommendations bằng Spec Kit `/speckit.plan`             | 10 – AI Recommendations                           |
| 20  | 2026-11-03 | Lập Implementation Plan cho Feature 103 – Mood and Context Recommendations bằng Spec Kit `/speckit.plan`         | 10 – AI Recommendations                           |
| 21  | 2026-11-03 | Lập Implementation Plan cho Feature 121 – Conversational Interface bằng Spec Kit `/speckit.plan`                 | 12 – AI Conversational Agent                      |

---

## Mục 1: Viết spec 101 – Listening History Analysis

| Trường                   | Nội dung                                                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-20                                                                                                                       |
| Người thực hiện          | Nhựt                                                                                                                             |
| Nhóm tính năng liên quan | 10 – AI Recommendations, Feature 101: Listening History Analysis (`specs/100-ai-recommendations/101-listening-history-analysis`) |
| Công cụ AI               | Codex (GPT-6), `$speckit-specify`                                                                                                |
| Mục đích                 | Đối chiếu tài liệu dự án và tạo đặc tả nghiệp vụ; ghi nhận các điểm chưa đủ căn cứ thay vì tự đặt thuật toán hoặc chỉ số.        |

### Prompt đã dùng

```text
$speckit.specify SPECIFY_FEATURE_DIRECTORY=specs/100-ai-recommendations/101-listening-history-analysis

Người dùng AuraTune sử dụng tính năng phân tích lịch sử nghe nhạc để hiểu thói quen và sở thích âm nhạc của mình. Hệ thống phân tích dữ liệu lịch sử nghe hiện có để xác định các thông tin hữu ích về hoạt động nghe nhạc của người dùng, trong phạm vi được tài liệu dự án cho phép. Làm rõ người dùng có thể xem những thông tin phân tích nào, dữ liệu lịch sử nghe được sử dụng ra sao, và hành vi khi người dùng chưa có đủ lịch sử nghe hoặc dữ liệu không khả dụng. Kết quả phân tích phải gắn với đúng tài khoản và không được để người dùng truy cập dữ liệu nghe của tài khoản khác.

Không bao gồm: tạo danh sách gợi ý bài hát cá nhân hóa (spec `102-personalized-recommendations`), gợi ý dựa trên tâm trạng hoặc ngữ cảnh (spec `103-mood-and-context-recommendations`), phát nhạc, tìm kiếm nhạc hoặc quản lý lịch sử nghe gốc. Không tự đặt thuật toán phân tích, chỉ số thống kê hoặc mô hình AI nếu tài liệu nguồn chưa xác định.

Dữ liệu và quy tắc: đối chiếu `docs/proposal/proposal.md`, `docs/management/team-contract.md`, `docs/design/database/README.md`, API contract và các spec liên quan. Làm rõ dependency với Listening History và các dữ liệu người dùng hiện có. Nếu chưa xác định được dữ liệu đầu vào, chỉ số phân tích hoặc cách hiển thị kết quả, ghi nhận là điểm cần clarification.
```

### Tóm tắt phản hồi của AI

- Đối chiếu proposal, team contract, thiết kế database, API contract, cấu trúc specs và tài liệu liên quan.
- Tạo spec gồm user stories, functional requirements, edge cases, entities, success criteria, assumptions và checklist chất lượng.
- Ghi nhận các điểm cần làm rõ: đầu ra và ranh giới với Group 070, nguồn dữ liệu/độ đủ lịch sử, cách hiển thị và độ mới của kết quả.
- Đưa yêu cầu cách ly dữ liệu theo tài khoản và giới hạn rõ việc không tạo gợi ý bài hát, gợi ý theo tâm trạng/ngữ cảnh, phát nhạc, tìm kiếm hoặc quản lý lịch sử gốc.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                     | Quyết định                       | Lý do                                                                                                                                       |
| ------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Phạm vi và dependency    | Dùng, sau đó làm rõ bằng clarify | Bám proposal; Listening History là dependency, các chức năng phát nhạc, tìm kiếm, quản lý history và recommendation khác nằm ngoài phạm vi. |
| Dữ liệu và chỉ số        | Ghi nhận là cần clarification    | Nguồn có `listening_history` và `user_listening_stats` nhưng chưa xác định rõ quy tắc sử dụng hoặc tính toán.                               |
| Bảo vệ dữ liệu tài khoản | Dùng                             | Đáp ứng yêu cầu riêng tư và quy tắc bảo mật về quyền sở hữu lịch sử nghe.                                                                   |

### Cách kiểm chứng

- Đối chiếu với `docs/proposal/proposal.md`, `docs/management/team-contract.md`, `docs/design/database/README.md`, `docs/design/database/security-rules.md` và `docs/analysis-and-design/api-contract.md`.
- Rà soát phạm vi, acceptance scenarios, edge cases, dependencies và checklist chất lượng.
- Không chạy tests vì đây là công việc đặc tả.

**Kết quả kiểm chứng:** Đạt sau khi làm rõ bằng `$speckit-clarify`.

**Ghi chú:** Spec nằm tại `specs/100-ai-recommendations/101-listening-history-analysis/spec.md`; checklist nằm trong thư mục `checklists/`.

---

## Mục 2: Làm rõ spec 101 – lượt `$speckit-clarify` thứ nhất

| Trường                   | Nội dung                                                                       |
| ------------------------ | ------------------------------------------------------------------------------ |
| Ngày                     | 2026-10-20                                                                     |
| Người thực hiện          | Nhựt                                                                           |
| Nhóm tính năng liên quan | 10 – AI Recommendations, Feature 101: Listening History Analysis               |
| Công cụ AI               | Codex (GPT-6), `$speckit-clarify`                                              |
| Mục đích                 | Làm rõ các đầu ra phân tích, dữ liệu đầu vào và điều kiện lịch sử nghe hợp lệ. |

### Prompt đã dùng

```text
$speckit-clarify
```

_Skill `speckit-clarify` được cung cấp kèm invocation; feature context là spec 101 đang hoạt động._

### Tóm tắt phản hồi của AI

- Hỏi tuần tự và ghi câu trả lời vào spec sau mỗi quyết định.
- Chốt đầu ra là tổng thời lượng nghe và top thể loại; top bài hát và nghệ sĩ thuộc Group 070.
- Chốt chỉ dùng `listening_history`, không dùng `user_listening_stats`, likes, follows hoặc dữ liệu tài khoản khác làm đầu vào.
- Chỉ tính lượt nghe gắn với đúng user và bài hát hợp lệ; tối thiểu một lượt. Báo insight không khả dụng khi thiếu metadata cần thiết.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                                  | Quyết định | Lý do                                                                                           |
| ------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------- |
| Tổng thời lượng và top thể loại       | Dùng       | Proposal nêu các insight này; tránh lặp top bài hát/nghệ sĩ của Group 070.                      |
| `listening_history` là nguồn duy nhất | Dùng       | Không tự dựa vào dữ liệu tổng hợp hoặc dữ liệu tài khoản khác khi quy tắc chưa được duyệt.      |
| Điều kiện hợp lệ và thiếu metadata    | Dùng       | Chỉ phân tích sự kiện quy thuộc được cho user/song; không suy đoán khi thiếu dữ liệu cần thiết. |

### Cách kiểm chứng

- Đối chiếu quyết định với database README, API contract, security rules và proposal.
- Kiểm tra các cập nhật trong clarification log, requirements, acceptance scenarios và edge cases.
- Không chạy tests vì thay đổi chỉ cập nhật yêu cầu.

**Kết quả kiểm chứng:** Đạt.

**Ghi chú:** Cách trình bày, time range, thời điểm làm mới và tiêu chí xếp hạng thể loại còn được làm rõ ở lượt tiếp theo.

---

## Mục 3: Làm rõ spec 101 – lượt `$speckit-clarify` thứ hai

| Trường                   | Nội dung                                                                               |
| ------------------------ | -------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-20                                                                             |
| Người thực hiện          | Nhựt                                                                                   |
| Nhóm tính năng liên quan | 10 – AI Recommendations, Feature 101: Listening History Analysis                       |
| Công cụ AI               | Codex (GPT-6), `$speckit-clarify`                                                      |
| Mục đích                 | Chốt cách trình bày, phạm vi thời gian, làm mới kết quả và tiêu chí xếp hạng thể loại. |

### Prompt đã dùng

```text
$speckit-clarify
```

_Skill `speckit-clarify` được cung cấp kèm invocation; feature context là spec 101 đang hoạt động._

### Tóm tắt phản hồi của AI

- Chốt kết quả ở dạng tóm tắt và danh sách, bao phủ toàn bộ lịch sử hợp lệ; làm mới khi người dùng mở lại phân tích.
- Chốt xếp hạng thể loại theo tổng thời lượng đã nghe.
- Cập nhật user scenarios, functional requirements, entities và clarification log.
- Sau khi cập nhật, spec không còn clarification markers; checklist có 16/16 mục được đánh dấu đạt.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                          | Quyết định | Lý do                                                                                  |
| ----------------------------- | ---------- | -------------------------------------------------------------------------------------- |
| Tóm tắt và danh sách          | Dùng       | Trình bày insight rõ ràng mà không tự thêm dạng hiển thị chưa được yêu cầu.            |
| Toàn bộ lịch sử hợp lệ        | Dùng       | Không tự đặt time range tuần/tháng khi nguồn không quy định.                           |
| Làm mới khi mở phân tích      | Dùng       | Xác định hành vi cập nhật sau khi history thay đổi mà không yêu cầu cập nhật tức thời. |
| Xếp hạng theo tổng thời lượng | Dùng       | Định nghĩa “top thể loại” để acceptance test nhất quán.                                |

### Cách kiểm chứng

- Kiểm tra các câu trả lời nhất quán trong clarification log, stories, requirements và entities; xác nhận không còn clarification markers.
- Checklist: 14/16 mục trước khi tích hợp các câu trả lời còn lại, 16/16 sau khi cập nhật; không có mục bị thoái lui.
- Không chạy tests vì đây là cập nhật spec/checklist, chưa có implementation.

## Mục 4: Hoàn thiện metadata quyền sở hữu các section của Project Plan

| Trường                   | Nội dung                                                                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-24                                                                                                                                                                      |
| Người thực hiện          | Nhựt                                                                                                                                                                            |
| Nhóm tính năng liên quan | Project-wide: Project Plan, các section được ánh xạ theo DL4; không gắn với functional group riêng                                                                              |
| Công cụ AI               | Codex (GPT-6)                                                                                                                                                                   |
| Mục đích                 | Cập nhật metadata Performed by và Reviewed by theo bảng phân công DL4; xác định Editor từ nội dung section và Git diff/history có sẵn, không suy đoán với heading thiếu căn cứ. |

### Prompt đã dùng (tóm lược)

    Chỉnh sửa docs/proposal/project_plan.md để hoàn thiện metadata cho các heading thuộc PA2 theo bảng phân công DL4. Ánh xạ Performer và Reviewer theo nội dung công việc. Với section đã được chỉnh sửa trước đây, đặt Editor là Lê Công Minh Nhựt; với section chưa chỉnh sửa, giữ Editor ban đầu theo phân công. Đối chiếu Git diff/history nếu có thể; nếu không đủ căn cứ thì giữ Editor hiện tại và ghi rõ cần xác minh thủ công. Chỉ sửa metadata, bảo toàn các thay đổi chưa commit, không truy cập Jira/Google Sheets, không sửa file khác và không commit/push.

### Tóm tắt phản hồi của AI

- Kiểm tra trạng thái repository và Git history/diff hiện có trước khi sửa; giữ nguyên thay đổi chưa commit ngoài phạm vi.
- Cập nhật metadata cho 70 heading thuộc mapping DL4, ánh xạ Performer/Reviewer theo task và đặt metadata ngay sau heading.
- Đối chiếu Editor với baseline Git: đổi Editor từ một giá trị khác sang Lê Công Minh Nhựt ở 8 heading; giữ Editor đã là Lê Công Minh Nhựt tại 4.1; giữ Editor baseline ở section không đổi; với section không có metadata baseline, dùng Performer cho section không đổi và Lê Công Minh Nhựt cho section có nội dung khác baseline.
- Không gán ownership theo số của heading tổng quan 2–4. Giữ trạng thái hiện tại ở các heading không có task mapping rõ ràng.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                  | Quyết định                                             | Lý do                                                                                                                   |
| --------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Performer và Reviewer | Dùng mapping DL4 cho 70 heading                        | Mapping được cung cấp rõ; kiểm tra lại để bảo đảm reviewer khác performer.                                              |
| Editor                | Dùng Git diff/history sẵn có và quy tắc của người dùng | Không suy ra người chỉnh sửa từ số heading; khi thiếu dữ liệu baseline, giữ hoặc dùng trạng thái được quy tắc cho phép. |
| Heading tổng quan 2–4 | Không tự ánh xạ vào task nội dung                      | Đây là heading tích hợp, không thuộc mapping section; mục 3 và 4 còn cần xác minh lịch sử Editor thủ công.              |
| Nội dung chuyên môn   | Không sửa trong lượt metadata này                      | Phạm vi yêu cầu chỉ là metadata; các thay đổi nội dung chưa commit từ lượt trước được giữ nguyên.                       |

### Cách kiểm chứng

- Đếm và kiểm tra 73 heading đánh số, gồm 70 heading thuộc mapping DL4; xác nhận đủ metadata ngay sau heading.
- So sánh Performer/Reviewer với mapping: không có mismatch; tất cả reviewer khác performer.
- Chạy git diff --check: không có lỗi whitespace; Git chỉ in cảnh báo chuyển đổi line ending.
- Kiểm tra git status và git diff --name-only: project_plan.md là file tracked duy nhất được chỉnh sửa; docs/PA/ vẫn là thay đổi untracked có sẵn.
- In diff tích lũy của project_plan.md ra terminal theo các đoạn vì output vượt giới hạn hiển thị. Diff còn bao gồm nội dung đã chỉnh sửa ở các lượt trước; không dùng nó để khẳng định lịch Jira đã được xác minh.
- Không truy cập Jira hoặc Google Sheets; không render/kiểm tra trực quan PDF; không commit hoặc push.

**Kết quả kiểm chứng:** Đạt cho mapping Performer/Reviewer và định dạng metadata của 70 heading DL4.

**Ghi chú:** Git history khả dụng chỉ có baseline commit b2a4e88. Metadata Editor của heading tổng quan 3 và 4 cần xác minh thủ công vì baseline không có metadata cho hai heading này; trạng thái hiện tại được giữ nguyên.

---

## Mục 5: Viết spec 102 – Personalized Recommendations

| Trường                   | Nội dung                                                                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-30                                                                                                                                |
| Người thực hiện          | Nhựt                                                                                                                                      |
| Nhóm tính năng liên quan | 10 – AI Recommendations, Feature 102: Personalized Recommendations (`specs/100-ai-recommendations/102-personalized-recommendations`)      |
| Công cụ AI               | Antigravity (Gemini 2.5 Flash / Flash High), `/speckit-specify`                                                                           |
| Mục đích                 | Đối chiếu tài liệu dự án để tạo đặc tả nghiệp vụ, làm rõ hành vi cold-start, xử lý lỗi service AI và phân định phạm vi với các spec khác. |

### Prompt đã dùng

```text
/speckit-specify SPECIFY_FEATURE_DIRECTORY=specs/100-ai-recommendations/102-personalized-recommendations

Người dùng AuraTune nhận danh sách gợi ý âm nhạc được cá nhân hóa theo lịch sử nghe và sở thích của mình. Hệ thống cung cấp các đề xuất phù hợp với từng người dùng dựa trên dữ liệu và quy tắc đã được xác định trong tài liệu dự án. Người dùng có thể xem danh sách đề xuất và chọn nội dung để mở bài hát, album, nghệ sĩ hoặc playlist tương ứng nếu loại nội dung đó được hỗ trợ. Làm rõ hành vi khi người dùng mới chưa có đủ dữ liệu nghe, danh sách đề xuất trống, dữ liệu cá nhân hóa chưa cập nhật hoặc dịch vụ AI không khả dụng. Đề xuất của mỗi người dùng phải được phân tách đúng theo tài khoản và không để lộ dữ liệu cá nhân của người khác.

Không bao gồm: phân tích và hiển thị thống kê lịch sử nghe (spec `101-listening-history-analysis`), gợi ý theo tâm trạng hoặc ngữ cảnh (spec `103-mood-and-context-recommendations`), tìm kiếm âm nhạc, phát nhạc, quản lý lịch sử nghe hoặc chức năng trò chuyện với AI (AI Conversational Agent). Không tự quyết định thuật toán gợi ý, mô hình AI, tiêu chí xếp hạng hoặc cơ chế cập nhật nếu tài liệu nguồn chưa xác định.

Dữ liệu và quy tắc: đối chiếu `docs/proposal/proposal.md`, `docs/management/team-contract.md`, `docs/design/database/README.md`, API contract và các spec liên quan trong repository. Làm rõ dependency với Listening History, Songs, Albums, Artists, Playlists và Music Player. Nếu tài liệu chưa xác định loại nội dung được đề xuất, dữ liệu đầu vào, tiêu chí cá nhân hóa hoặc hành vi khi lỗi, ghi nhận là điểm cần clarification thay vì tự giả định.
```

Lượt phản hồi làm rõ tiếp theo:

```text
1B, 2A, 3A
```

### Tóm tắt phản hồi của AI

- Đối chiếu Proposal, Vision Document, Team Contract, Thiết kế Database, API Contract (`/recommendations/songs`, `/ai/recommend`) và Feature Modules.
- Khởi tạo cấu trúc spec chuẩn Spec Kit gồm User Scenarios (P1, P2), Functional Requirements (FR-001 đến FR-015), Key Entities, Success Criteria (SC-001 đến SC-005), Assumptions và Checklist kiểm tra chất lượng.
- Nhận diện 3 điểm cần làm rõ và đặt câu hỏi tương tác theo chuẩn Spec Kit:
  1. Loại thực thể đề xuất: Chọn Option 1B (Đa thực thể: Bài hát, Album, Nghệ sĩ, Playlist).
  2. Xử lý cold-start / người dùng mới: Chọn Option 2A (Fallback về danh sách bài hát phổ biến/trending).
  3. Xử lý sự cố dịch vụ AI / timeout: Chọn Option 3A (Graceful degradation về nội dung phổ biến kèm thông báo tinh tế).
- Cập nhật toàn bộ các câu trả lời clarification vào spec, loại bỏ hoàn toàn marker `[NEEDS CLARIFICATION]` và cập nhật `checklists/requirements.md` đạt 100%.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                                                | Quyết định       | Lý do                                                                                                                            |
| --------------------------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Đa thực thể đề xuất (Song, Album, Artist, Playlist) | Dùng (Option 1B) | Bám sát luồng khám phá trong Vision Document Workflow 1 và hỗ trợ đa dạng nội dung cho người dùng.                               |
| Fallback nội dung phổ biến cho Cold-Start           | Dùng (Option 2A) | Đảm bảo người dùng mới luôn có nhạc nghe ngay lập tức, tránh màn hình trống hoặc lỗi hệ thống.                                   |
| Graceful degradation khi AI service lỗi/timeout     | Dùng (Option 3A) | Giữ trải nghiệm Dashboard thông suốt, không làm crash trang khi dịch vụ AI backend gặp sự cố.                                    |
| Bảo mật và cách ly tài khoản                        | Dùng             | Tuân thủ Nghị định 13/2023/ND-CP theo Proposal; mỗi tài khoản chỉ thấy gợi ý cá nhân của chính mình.                             |
| Giới hạn phạm vi (Exclusions)                       | Dùng             | Tách biệt ranh giới rõ ràng với Feature 101 (History Analysis), 103 (Mood/Context), 040 (Player), 070 (History), 120 (AI Agent). |

### Cách kiểm chứng

- Đối chiếu các yêu cầu với `docs/proposal/proposal.md`, `docs/proposal/Auratune_Vision_Document.md`, `docs/design/database/README.md`, `docs/analysis-and-design/api-contract.md` và `docs/design/architecture/feature-modules.md`.
- Kiểm tra tính đầy đủ của spec: 4 User Stories độc lập với kịch bản Given-When-Then, 15 Functional Requirements, 5 Success Criteria đo lường được, không rò rỉ chi tiết code/công nghệ.
- Kiểm tra checklist `specs/100-ai-recommendations/102-personalized-recommendations/checklists/requirements.md`: 12/12 mục đã đạt, không còn marker `[NEEDS CLARIFICATION]`.
- Không chạy automated tests vì đây là công việc xây dựng đặc tả nghiệp vụ (Specification phase).

**Kết quả kiểm chứng:** Đạt yêu cầu chất lượng spec, sẵn sàng cho pha lập kế hoạch (`$speckit-plan`).

**Ghi chú:** Spec được lưu tại `specs/100-ai-recommendations/102-personalized-recommendations/spec.md`; checklist nằm tại `checklists/requirements.md`.

---

## Mục 6: Viết spec 103 – Mood and Context Recommendations

| Trường                   | Nội dung                                                                                                                                     |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-30                                                                                                                                   |
| Người thực hiện          | Nhựt                                                                                                                                         |
| Nhóm tính năng liên quan | 10 – AI Recommendations, Feature 103: Mood and Context Recommendations (`specs/100-ai-recommendations/103-mood-and-context-recommendations`) |
| Công cụ AI               | Antigravity (Gemini 2.5 Flash / Flash High), `/speckit-specify`                                                                              |
| Mục đích                 | Đối chiếu tài liệu dự án để tạo đặc tả nghiệp vụ cho gợi ý theo tâm trạng/ngữ cảnh, phân định ranh giới với Search (030) và các spec khác.   |

### Prompt đã dùng

```text
/speckit-specify SPECIFY_FEATURE_DIRECTORY=specs/100-ai-recommendations/103-mood-and-context-recommendations

Người dùng AuraTune nhận được các gợi ý âm nhạc dựa trên tâm trạng và ngữ cảnh hiện tại. Hệ thống sử dụng thông tin về tâm trạng hoặc ngữ cảnh do người dùng cung cấp và các dữ liệu liên quan được tài liệu dự án xác định để tạo ra những đề xuất phù hợp. Làm rõ cách người dùng cung cấp tâm trạng hoặc ngữ cảnh, các loại thông tin được hỗ trợ, cách hệ thống hiển thị kết quả và hành vi khi thông tin đầu vào không hợp lệ, không đầy đủ hoặc không có kết quả phù hợp. Đảm bảo các đề xuất được xử lý đúng theo tài khoản người dùng.

Không bao gồm: phân tích lịch sử nghe nhạc (spec `101-listening-history-analysis`), gợi ý cá nhân hóa dựa trên sở thích và lịch sử nghe (spec `102-personalized-recommendations`), tìm kiếm âm nhạc, phát nhạc, quản lý playlist hoặc chức năng trò chuyện với AI (AI Conversational Agent). Không tự giả định danh sách tâm trạng, loại ngữ cảnh, thuật toán AI hoặc mô hình xử lý nếu tài liệu nguồn chưa xác định.

Dữ liệu và quy tắc: đối chiếu `docs/proposal/proposal.md`, `docs/management/team-contract.md`, `docs/design/database/README.md`, API contract và các spec liên quan trong repository. Làm rõ dependency với Songs, Albums, Artists, Playlists và Music Player nếu được hỗ trợ. Nếu tài liệu chưa xác định cách nhập tâm trạng/ngữ cảnh, dữ liệu đầu vào, tiêu chí đề xuất hoặc hành vi khi dịch vụ AI không khả dụng, ghi nhận là điểm cần clarification thay vì tự giả định.
```

### Tóm tắt phản hồi của AI

- Đối chiếu Proposal, Vision Document, Team Contract, Thiết kế Database, API Contract và Feature Modules.
- Khởi tạo cấu trúc spec chuẩn Spec Kit gồm User Scenarios (P1, P2), Functional Requirements (FR-001 đến FR-015), Key Entities, Success Criteria (SC-001 đến SC-005), Assumptions và Checklist kiểm tra chất lượng.
- Xác định rõ phạm vi loại trừ (Exclusions): Không bao gồm thống kê nghe nhạc (101), gợi ý cá nhân hóa theo gu (102), tìm kiếm tự do theo ngữ nghĩa (030/033), phát nhạc (040), quản lý playlist (060), và AI chat agent (120).
- Nhận diện 3 điểm chưa đủ căn cứ trong tài liệu nguồn và đánh dấu `[NEEDS CLARIFICATION]`:
  1. Cách người dùng cung cấp tâm trạng/ngữ cảnh (FR-002).
  2. Các loại nội dung âm nhạc được đề xuất (FR-003).
  3. Chính sách xử lý khi kết quả trống hoặc dịch vụ AI không khả dụng (FR-004).
- Khởi tạo `checklists/requirements.md` với 11/12 tiêu chí đạt, ghi nhận 3 điểm cần làm rõ trước khi chuyển sang pha kế hoạch.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                                | Quyết định             | Lý do                                                                                                                                  |
| ----------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Cấu trúc đặc tả nghiệp vụ           | Dùng                   | Đầy đủ 4 User Stories (P1/P2), tiêu chí nghiệm thu Given-When-Then, edge cases, bảo vệ dữ liệu tài khoản theo Nghị định 13/2023/ND-CP. |
| Giới hạn phạm vi (Exclusions)       | Dùng                   | Phân định ranh giới chặt chẽ với Group 030 (Semantic Vector Search) và các feature khác thuộc Group 100.                               |
| Chi tiết kỹ thuật / mô hình AI      | Không tự suy đoán      | Tuân thủ nguyên tắc không rò rỉ chi tiết triển khai công nghệ vào spec nghiệp vụ.                                                      |
| 3 điểm chưa xác định trong tài liệu | Ghi nhận clarification | Chờ người dùng làm rõ qua lệnh `$speckit-clarify` thay vì tự đưa ra giả định.                                                          |

### Cách kiểm chứng

- Đối chiếu với `docs/proposal/proposal.md`, `docs/proposal/Auratune_Vision_Document.md`, `docs/design/database/README.md`, `docs/analysis-and-design/api-contract.md` và `specs/030-search/033-semantic-vector-search/spec.md`.
- Kiểm tra tính đầy đủ của file spec và checklist chất lượng: 11/12 mục đạt, còn lại mục `No [NEEDS CLARIFICATION] markers remain` chờ xử lý ở pha clarify.
- Không chạy automated tests vì đây là công việc phân tích yêu cầu (Specification phase).

**Kết quả kiểm chứng:** Đạt yêu cầu khởi tạo spec sơ bộ, chuyển sang pha clarify.

**Ghi chú:** Spec nằm tại `specs/100-ai-recommendations/103-mood-and-context-recommendations/spec.md`; checklist nằm tại `checklists/requirements.md`.

---

## Mục 7: Làm rõ spec 103 bằng `/speckit-clarify`

| Trường                   | Nội dung                                                                                                                                     |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-30                                                                                                                                   |
| Người thực hiện          | Nhựt                                                                                                                                         |
| Nhóm tính năng liên quan | 10 – AI Recommendations, Feature 103: Mood and Context Recommendations (`specs/100-ai-recommendations/103-mood-and-context-recommendations`) |
| Công cụ AI               | Antigravity (Gemini 2.5 Flash / Flash High), `/speckit-clarify`                                                                              |
| Mục đích                 | Làm rõ tương tác tuần tự 3 điểm nghi vấn trong spec 103: phương thức nhập tâm trạng, loại nội dung đề xuất và chính sách fallback.           |

### Prompt đã dùng

```text
/speckit-clarify
```

Chuỗi phản hồi làm rõ tuần tự:

- Câu 1 (Input method): `A`
- Câu 2 (Content types): `B`
- Câu 3 (Fallback policy): `B`

### Tóm tắt phản hồi của AI

- Chạy kiểm tra tiên quyết qua `check-prerequisites.sh` xác định đúng branch và spec active của feature 103.
- Thực hiện vòng lặp làm rõ tuần tự từng câu hỏi một (sequential interactive loop) kèm đề xuất giải pháp có căn cứ (Recommended option):
  - **Câu 1 (FR-002)**: Chốt phương thức nhập qua các thẻ chọn có sẵn (Curated Preset Tags/Chips) đại diện cho các tâm trạng cốt lõi (Chill, Energetic, Focus, Melancholy) và ngữ cảnh hoạt động (Workout, Study, Commute, Sleep) để tạo tương tác 1 chạm và phân biệt rõ với ô Search văn bản tự do.
  - **Câu 2 (FR-003)**: Chốt loại thực thể đề xuất gồm Bài hát (Songs) và Playlist theo chủ đề tâm trạng (Mood Playlists), bám sát mục tiêu G06/G10 trong Vision Document.
  - **Câu 3 (FR-004)**: Chốt chính sách fallback hiển thị giao diện Empty State thân thiện ("No tracks currently found for this mood") kèm các chip gợi ý chuyển sang tâm trạng khác, tránh phát nhạc lạc quẻ/trái ngược cảm xúc người dùng (như phát pop sôi động khi đang chọn Sleep).
- Cập nhật tức thời từng quyết định vào `spec.md` (Clarifications session 2026-10-30, User Stories, Functional Requirements, Key Entities).
- Tái đánh giá Checklist: cập nhật tiêu chí cuối cùng đạt 100% (12/12 mục đạt), chuyển trạng thái spec sang `Draft — Ready for Planning`.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                                                   | Quyết định      | Lý do                                                                                                                          |
| ------------------------------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Thẻ chọn tâm trạng/ngữ cảnh có sẵn (Preset Tags/Chips) | Dùng (Option A) | Trải nghiệm người dùng 1 chạm thuận tiện, giảm thiểu lỗi nhập liệu, tránh giẫm chân lên tính năng Search Semantic tự do (033). |
| Đề xuất Bài hát và Mood Playlists                      | Dùng (Option B) | Cung cấp cả trải nghiệm nghe bài hát tức thời lẫn phiên nghe dài qua playlist theo chủ đề, đúng tài liệu Vision.               |
| Empty State thân thiện kèm gợi ý tâm trạng             | Dùng (Option B) | Đảm bảo tính nhất quán cảm xúc (emotional alignment), minh bạch trạng thái hệ thống thay vì tự ý phát nhạc sai bối cảnh.       |

### Cách kiểm chứng

- Kiểm tra tính nhất quán giữa câu trả lời trong mục Clarifications với các kịch bản nghiệm thu và yêu cầu chức năng (FR-002, FR-003, FR-004).
- Xác nhận không còn marker `[NEEDS CLARIFICATION]` nào sót lại trong `spec.md`.
- Kiểm tra lại checklist chất lượng: 12/12 mục đạt (`checklists/requirements.md`).
- Không chạy automated tests vì spec chưa bước vào pha implementation.

**Kết quả kiểm chứng:** Đạt yêu cầu làm rõ, đặc tả hoàn chỉnh và sẵn sàng cho pha lập kế hoạch (`$speckit-plan`).

**Ghi chú:** Spec hoàn thiện nằm tại `specs/100-ai-recommendations/103-mood-and-context-recommendations/spec.md`.

---

## Mục 8: Viết spec 121 – Conversational Interface

| Trường                   | Nội dung                                                                                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-30                                                                                                                                           |
| Người thực hiện          | Nhựt                                                                                                                                                 |
| Nhóm tính năng liên quan | 12 – AI Conversational Agent, Feature 121: Conversational Interface (`specs/120-ai-conversational-agent/121-conversational-interface`)               |
| Công cụ AI               | Antigravity (Gemini 3.8 Flash), `/speckit-specify`                                                                                                   |
| Mục đích                 | Đối chiếu tài liệu dự án để tạo đặc tả nghiệp vụ cho giao diện hội thoại tương tác với AI host; phân định ranh giới với các spec liên quan 122, 123. |

### Prompt đã dùng

```text
/speckit-specify SPECIFY_FEATURE_DIRECTORY=specs/120-ai-conversational-agent/121-conversational-interface

Người dùng AuraTune tương tác với AI Conversational Agent thông qua giao diện hội thoại. Giao diện cho phép người dùng gửi nội dung tin nhắn và xem phản hồi từ AI trong cùng một cuộc hội thoại. Làm rõ cách bắt đầu cuộc hội thoại, gửi tin nhắn, hiển thị tin nhắn của người dùng và phản hồi của AI, trạng thái đang xử lý, cũng như cách xử lý khi gửi tin nhắn thất bại hoặc dịch vụ AI không khả dụng. Đảm bảo nội dung hội thoại được phân tách theo đúng tài khoản người dùng.

Không bao gồm: phân tích ý định âm nhạc từ tin nhắn (spec `122-music-intent-understanding`), hỗ trợ phát nhạc theo thời gian thực hoặc thực hiện hành động âm nhạc (spec `123-real-time-music-assistance`), xây dựng mô hình AI, huấn luyện AI hoặc tự quyết định kiến trúc xử lý hội thoại nếu tài liệu nguồn chưa xác định.

Dữ liệu và quy tắc: đối chiếu `docs/proposal/proposal.md`, `docs/management/team-contract.md`, `docs/design/database/README.md`, API contract và các spec liên quan trong repository. Làm rõ dependency với Authentication, AI Conversational Agent và các thành phần lưu trữ hội thoại nếu được xác định. Nếu tài liệu chưa xác định cấu trúc tin nhắn, vòng đời hội thoại, cách lưu lịch sử hoặc hành vi khi lỗi, ghi nhận là điểm cần clarification thay vì tự giả định.
```

### Tóm tắt phản hồi của AI

- Rà soát các tài liệu liên quan: `docs/proposal/proposal.md`, `docs/proposal/Auratune_Vision_Document.md` (mục G12 & Section 3.5), `docs/design/database/README.md` (chưa có bảng lưu trữ chat/tin nhắn), `docs/design/architecture/feature-modules.md`, và API contract.
- Thiết lập thư mục và spec tại `specs/120-ai-conversational-agent/121-conversational-interface/spec.md`, cập nhật `.specify/feature.json`.
- Xây dựng spec chuẩn Spec Kit gồm: 4 User Stories (P1: Start & View, P1: Send & Receive with processing indicator, P2: Failure & Unavailability handling, P1: Account isolation & privacy), Acceptance Scenarios dạng Given-When-Then, Edge Cases, Functional Requirements (FR-001 đến FR-012), Key Entities (Conversation, Message, User Session), Success Criteria đo lường được (SC-001 đến SC-005) và Assumptions.
- Phân định rõ phạm vi loại trừ (Exclusions): không bao gồm phân tích ý định âm nhạc (122), hỗ trợ phát nhạc/thao tác queue theo thời gian thực (123), xây dựng/huấn luyện mô hình AI hoặc tự quyết định kiến trúc backend chưa xác định.
- Nhận diện 3 điểm chưa đủ căn cứ trong schema database hiện hữu và đánh dấu `[NEEDS CLARIFICATION]`:
  1. Vòng đời hội thoại và lưu trữ lịch sử (FR-008).
  2. Định dạng nội dung tin nhắn giữa người dùng và AI (FR-007).
  3. Hành vi phục hồi khi gửi tin nhắn thất bại hoặc dịch vụ AI không khả dụng (FR-009).
- Khởi tạo `checklists/requirements.md` với 15/16 tiêu chí đạt, ghi nhận 3 điểm cần làm rõ trước khi chuyển sang pha kế hoạch.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                                            | Quyết định             | Lý do                                                                                                                                       |
| ----------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Cấu trúc kịch bản và yêu cầu cốt lõi            | Dùng                   | Đầy đủ luồng gửi/nhận, trạng thái đang xử lý (typing indicator), hiển thị tin nhắn hai chiều và tự động cuộn.                               |
| Phân tách dữ liệu tài khoản (Privacy Isolation) | Dùng                   | Đảm bảo tính riêng tư tuyệt đối theo Nghị định 13/2023/NĐ-CP; cuộc trò chuyện của mỗi user là độc lập, cấm rò rỉ dữ liệu chéo.              |
| Không làm gián đoạn phát nhạc                   | Dùng                   | Giao diện hội thoại và AI host hoạt động độc lập với trình phát nhạc nền (Group 040); khi AI lỗi nhạc vẫn phát bình thường theo Vision Doc. |
| 3 điểm chưa có trong database/tài liệu nguồn    | Ghi nhận clarification | Database hiện hữu chưa có bảng chat/messages; không tự suy diễn cấu trúc dữ liệu hoặc vòng đời hội thoại.                                   |

### Cách kiểm chứng

- Đối chiếu với `docs/proposal/proposal.md`, `docs/proposal/Auratune_Vision_Document.md` (G12, bảng fallback), `docs/design/database/README.md`, `docs/design/architecture/feature-modules.md`.
- Kiểm tra tính đầy đủ của file spec và checklist chất lượng: 15/16 tiêu chí đạt, còn 1 tiêu chí chờ hoàn tất clarify.
- Không chạy automated tests vì đây là công việc phân tích yêu cầu (Specification phase).

**Kết quả kiểm chứng:** Đạt yêu cầu khởi tạo spec sơ bộ, chuyển sang pha clarify.

**Ghi chú:** Spec lưu tại `specs/120-ai-conversational-agent/121-conversational-interface/spec.md`; checklist tại `checklists/requirements.md`.

---

## Mục 9: Làm rõ spec 121 bằng `/speckit-clarify`

| Trường                   | Nội dung                                                                                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-30                                                                                                                                           |
| Người thực hiện          | Nhựt                                                                                                                                                 |
| Nhóm tính năng liên quan | 12 – AI Conversational Agent, Feature 121: Conversational Interface (`specs/120-ai-conversational-agent/121-conversational-interface`)               |
| Công cụ AI               | Antigravity (Gemini 3.8 Flash), `/speckit-clarify`                                                                                                   |
| Mục đích                 | Giải quyết 3 điểm cần làm rõ trong spec 121 thông qua vòng lặp câu hỏi tuần tự: vòng đời hội thoại, định dạng tin nhắn, và hành vi phục hồi khi lỗi. |

### Prompt đã dùng

```text
/speckit-clarify
```

Chuỗi phản hồi làm rõ tuần tự:

- Câu 1 (Conversation Lifecycle & History): `A`
- Câu 2 (Message Formatting & Content Structure): `A`
- Câu 3 (Failure Recovery & Outage Behavior): `A`

### Tóm tắt phản hồi của AI

- Chạy `check-prerequisites.sh` xác định nhánh `feat/121-conversational-interface` và đường dẫn file spec của feature 121.
- Thực hiện tuần tự từng câu hỏi theo chuẩn format của Spec Kit, đưa ra lý do và khuyến nghị rõ ràng:
  - **Câu 1 (FR-008)**: Chốt lựa chọn Option A – duy trì một luồng hội thoại liên tục (single persistent thread) cho mỗi tài khoản người dùng, tự động tải lại lịch sử tin nhắn theo thứ tự thời gian khi mở giao diện chat; phù hợp vai trò AI Host đồng hành lâu dài mà không làm phức tạp hóa UI quản lý nhiều luồng ở v1.
  - **Câu 2 (FR-007)**: Chốt lựa chọn Option A – AI phản hồi bằng văn bản định dạng Markdown chuẩn (in đậm, in nghiêng, danh sách gạch đầu dòng, liên kết) giúp hiển thị gợi ý bài hát/nghệ sĩ rõ ràng; tin nhắn người dùng được làm sạch và hiển thị dưới dạng plain text.
  - **Câu 3 (FR-009)**: Chốt lựa chọn Option A – tin nhắn gửi thất bại giữ nguyên trong luồng chat kèm huy hiệu lỗi (inline error badge) và nút "Thử lại" (Retry) một chạm; khi dịch vụ AI không khả dụng hiển thị thông báo hệ thống nội tuyến, tuyệt đối không làm gián đoạn việc phát nhạc nền hay điều hướng ứng dụng.
- Cập nhật tức thời vào file `spec.md`: thêm mục `## Clarifications` với session ngày 2026-10-30, cập nhật FR-007, FR-008, FR-009 và các thực thể Conversation, Message; chuyển trạng thái spec sang `Draft — Ready for Planning`.
- Tái đánh giá checklist chất lượng: 16/16 tiêu chí đạt (100%), hoàn tất việc loại bỏ toàn bộ các marker `[NEEDS CLARIFICATION]`.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                                          | Quyết định      | Lý do                                                                                                                           |
| --------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Luồng hội thoại duy nhất lưu trên backend     | Dùng (Option A) | Tạo sự liền mạch cho người dùng khi trò chuyện với AI Host; tránh giao diện cồng kềnh quản lý multi-thread trong phiên bản đầu. |
| Markdown cho phản hồi AI, plain text cho user | Dùng (Option A) | Giúp định dạng câu trả lời AI sinh động, dễ đọc các danh sách bài hát/album; đầu vào user đơn giản, an toàn.                    |
| Báo lỗi inline kèm nút Retry                  | Dùng (Option A) | Giữ nguyên ngữ cảnh câu hỏi của người dùng để có thể thử lại ngay khi có kết nối, không làm gián đoạn phát nhạc.                |

### Cách kiểm chứng

- Kiểm tra tính nhất quán giữa câu trả lời trong mục Clarifications và nội dung các yêu cầu chức năng FR-007, FR-008, FR-009.
- Xác nhận không còn marker `[NEEDS CLARIFICATION]` nào trong `spec.md`.
- Kiểm tra lại checklist chất lượng: 16/16 mục đạt (`checklists/requirements.md`).
- Không chạy automated tests vì spec chưa bước vào pha implementation.

**Kết quả kiểm chứng:** Đạt yêu cầu làm rõ, đặc tả hoàn chỉnh và sẵn sàng cho pha lập kế hoạch (`/speckit-plan`).

**Ghi chú:** Spec hoàn thiện nằm tại `specs/120-ai-conversational-agent/121-conversational-interface/spec.md`.

---

## Mục 10: Viết spec 122 – Music Intent Understanding

| Trường                   | Nội dung                                                                                                                                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Ngày                     | 2026-10-30                                                                                                                                                                                                                           |
| Người thực hiện          | Nhựt                                                                                                                                                                                                                                 |
| Nhóm tính năng liên quan | 12 – AI Conversational Agent, Feature 122: Music Intent Understanding (`specs/120-ai-conversational-agent/122-music-intent-understanding`)                                                                                           |
| Công cụ AI               | Antigravity (Gemini 3.8 Flash), `/speckit-specify`                                                                                                                                                                                   |
| Mục đích                 | Đối chiếu tài liệu dự án để tạo đặc tả nghiệp vụ cho khả năng hiểu ý định âm nhạc từ tin nhắn hội thoại; phân định ranh giới rõ ràng với giao diện chat (121), hành động âm nhạc thời gian thực (123) và tìm kiếm/đề xuất (030/100). |

### Prompt đã dùng

```text
/speckit-specify SPECIFY_FEATURE_DIRECTORY=specs/120-ai-conversational-agent/122-music-intent-understanding

AI Conversational Agent của AuraTune có khả năng hiểu ý định âm nhạc của người dùng từ nội dung tin nhắn trong cuộc hội thoại. Hệ thống phân tích yêu cầu bằng ngôn ngữ tự nhiên để xác định người dùng đang muốn thực hiện hành động hoặc tìm kiếm thông tin âm nhạc nào. Làm rõ các loại ý định được hỗ trợ, cách trích xuất thông tin liên quan từ tin nhắn, cách xử lý khi một yêu cầu có nhiều ý định, thiếu thông tin hoặc không thể xác định ý định. Kết quả nhận diện phải được chuyển tiếp đến thành phần phù hợp để xử lý theo phạm vi chức năng được tài liệu dự án xác định.

Không bao gồm: giao diện hội thoại và quản lý tin nhắn (spec `121-conversational-interface`), thực hiện hành động âm nhạc theo thời gian thực như phát nhạc hoặc điều khiển Music Player (spec `123-real-time-music-assistance`), xây dựng hoặc huấn luyện mô hình AI, tự quyết định thuật toán NLP hoặc mô hình LLM nếu tài liệu nguồn chưa xác định.

Dữ liệu và quy tắc: đối chiếu `docs/proposal/proposal.md`, `docs/management/team-contract.md`, `docs/design/database/README.md`, API contract và các spec liên quan trong repository. Làm rõ dependency với Conversational Interface, Songs, Albums, Artists, Playlists, Music Player và các chức năng âm nhạc khác nếu được xác định. Nếu tài liệu chưa xác định danh sách ý định, cấu trúc kết quả nhận diện, cách xử lý yêu cầu mơ hồ hoặc cơ chế chuyển tiếp kết quả, ghi nhận là điểm cần clarification thay vì tự giả định.
```

### Tóm tắt phản hồi của AI

- Rà soát các tài liệu liên quan: `docs/proposal/proposal.md`, `docs/proposal/Auratune_Vision_Document.md` (mục G12 AI DJ / Real-time Host, mục fallback dịch vụ AI), `docs/design/database/README.md`, `specs/120-ai-conversational-agent/121-conversational-interface/spec.md`.
- Thiết lập thư mục và file đặc tả tại `specs/120-ai-conversational-agent/122-music-intent-understanding/spec.md`, đồng bộ cấu hình nhánh tại `.specify/feature.json`.
- Xây dựng tài liệu đặc tả chuẩn Spec Kit: 5 User Stories (P1: Hiểu yêu cầu phát nhạc và điều khiển, P1: Hiểu yêu cầu tìm kiếm và khám phá âm nhạc, P2: Hiểu truy vấn thông tin âm nhạc/nghệ sĩ, P2: Xử lý yêu cầu mơ hồ/thiếu thông tin/ngoài phạm vi, P1: Bảo vệ quyền riêng tư dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP), Acceptance Scenarios dạng Given-When-Then, Edge Cases (song ngữ Anh-Việt, lỗi chính tả/slang, đa ý định, dịch vụ AI timeout), Functional Requirements (FR-001 đến FR-012), Key Entities (Intent Analysis Request, Intent Understanding Result, Music Entity Slot), Success Criteria đo lường được (SC-001 đến SC-005) và Assumptions.
- Phân định rõ phạm vi loại trừ (Exclusions): Không render giao diện hội thoại hay quản lý tin nhắn (thuộc 121), không trực tiếp thực thi phát nhạc hay can thiệp Audio Player / Queue (thuộc 123, Group 040/050), không tự giả định thuật toán NLP hay quy trình huấn luyện mô hình AI cục bộ.
- Nhận diện 3 điểm chưa được tài liệu nguồn quy định cụ thể và đánh dấu `[NEEDS CLARIFICATION]`:
  1. Danh mục các nhóm ý định âm nhạc chính thức được hỗ trợ (FR-002).
  2. Chiến lược xử lý khi yêu cầu mơ hồ, thiếu thông tin (missing slot) hoặc chứa nhiều ý định cùng lúc (FR-005).
  3. Cấu trúc kết quả nhận diện và kiến trúc chuyển tiếp/điều hướng đến các thành phần hạ tầng (FR-007).
- Khởi tạo bảng kiểm tra chất lượng tại `checklists/requirements.md` với 15/16 tiêu chí đạt, sẵn sàng chuyển sang bước làm rõ yêu cầu.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                                                        | Quyết định | Lý do                                                                                                                                   |
| ----------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Cấu trúc kịch bản người dùng và trích xuất thực thể âm nhạc | Dùng       | Phân tách rõ ràng giữa phân loại ý định (intent) và bóc tách thực thể (slots: bài hát, nghệ sĩ, album, thể loại, tâm trạng, hoạt động). |
| Bảo vệ dữ liệu cá nhân (PII Stripping)                      | Dùng       | Loại bỏ email, số điện thoại, thông tin định danh cá nhân trước khi gửi đến dịch vụ NLP bên ngoài theo Nghị định 13/2023/NĐ-CP.         |
| Ranh giới không thực thi audio và không render chat UI      | Dùng       | Giữ vững tính đóng gói và độc lập giữa 121 (Giao diện), 122 (Hiểu ý định) và 123 (Thực thi hành động).                                  |

### Cách kiểm chứng

- Đối chiếu tài liệu đề xuất (`docs/proposal/proposal.md`), `Auratune_Vision_Document.md` (mục G12, Section 3.5), và spec `121-conversational-interface`.
- Kiểm tra tính đầy đủ của file spec và checklist chất lượng: 15/16 tiêu chí đạt, còn 1 tiêu chí chờ hoàn tất clarify.
- Không chạy automated tests vì đây là công việc phân tích yêu cầu (Specification phase).

**Kết quả kiểm chứng:** Đạt yêu cầu khởi tạo spec sơ bộ, chuyển sang pha clarify.

**Ghi chú:** Spec lưu tại `specs/120-ai-conversational-agent/122-music-intent-understanding/spec.md`; checklist tại `checklists/requirements.md`.

---

## Mục 11: Làm rõ spec 122 bằng `/speckit-clarify`

| Trường                   | Nội dung                                                                                                                                                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-30                                                                                                                                                                                                             |
| Người thực hiện          | Nhựt                                                                                                                                                                                                                   |
| Nhóm tính năng liên quan | 12 – AI Conversational Agent, Feature 122: Music Intent Understanding (`specs/120-ai-conversational-agent/122-music-intent-understanding`)                                                                             |
| Công cụ AI               | Antigravity (Gemini 3.8 Flash), `/speckit-clarify`                                                                                                                                                                     |
| Mục đích                 | Giải quyết 3 điểm cần làm rõ trong spec 122 thông qua vòng lặp câu hỏi tương tác tuần tự: danh mục ý định hỗ trợ, phương án xử lý yêu cầu mơ hồ/thiếu thông tin/đa ý định, và kiến trúc chuyển tiếp kết quả nhận diện. |

### Prompt đã dùng

```text
/speckit-clarify
```

Chuỗi phản hồi làm rõ tuần tự:

- Câu 1 (Supported Music Intent Categories): `B`
- Câu 2 (Resolution Strategy for Ambiguous, Incomplete, or Multi-Intent Messages): `C`
- Câu 3 (Intent Result Delivery and Routing Architecture): `A`

### Tóm tắt phản hồi của AI

- Chạy `check-prerequisites.sh` xác định nhánh `122-music-intent-understanding` và đường dẫn file spec của feature 122.
- Thực hiện tuần tự từng câu hỏi theo chuẩn format Spec Kit, đưa ra lý do và bảng đối chiếu các phương án:
  - **Câu 1 (FR-002)**: Chốt lựa chọn Option B – mở rộng phạm vi hỗ trợ 5 nhóm ý định chính thức: phát nhạc (`play_music`), tìm kiếm khám phá (`search_music`), tra cứu thông tin âm nhạc/nghệ sĩ (`query_music_info`), quản lý thư viện cá nhân (`manage_library`: tạo playlist, thêm vào playlist, thích bài hát, theo dõi nghệ sĩ qua chat), và trò chuyện chung (`general_chitchat`).
  - **Câu 2 (FR-005)**: Chốt lựa chọn Option C – áp dụng cơ chế giá trị mặc định thông minh (Smart heuristic defaults): khi câu lệnh thiếu thực thể bắt buộc (như "bật nhạc đi"), hệ thống tự động suy luận phát danh sách thịnh hành hoặc bài hát đề xuất mà không cần dừng lại hỏi người dùng; với câu lệnh chứa nhiều ý định, ưu tiên thực hiện ngay ý định hành động phát nhạc cốt lõi và lưu lại ý định phụ trong metadata ngữ cảnh.
  - **Câu 3 (FR-007)**: Chốt lựa chọn Option A – áp dụng kiến trúc Centralized AI Agent Orchestrator: module nhận diện ý định trả về payload JSON có cấu trúc chuẩn (`intent_type`, `confidence_score`, `completeness_status`, `extracted_entities`, `suggested_action`) cho backend Orchestrator Controller để điều phối tập trung đến Real-time Music Assistance (`123`), Search/Recommendation (`030`/`100`), hoặc Conversational Interface (`121`).
- Cập nhật tức thời vào file `spec.md`: bổ sung mục `## Clarifications` với session ngày 2026-10-30, cập nhật chi tiết các yêu cầu chức năng FR-002, FR-003, FR-005, FR-007, User Story 4, Edge Cases, Key Entities và chuyển trạng thái spec sang `Draft — Ready for Planning`.
- Tái đánh giá checklist chất lượng tại `checklists/requirements.md`: 16/16 tiêu chí đạt (100%), hoàn tất việc loại bỏ toàn bộ các marker `[NEEDS CLARIFICATION]`.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                                                | Quyết định      | Lý do                                                                                                                                                    |
| --------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5 nhóm ý định gồm cả quản lý thư viện cá nhân       | Dùng (Option B) | Cho phép người dùng ra lệnh tạo playlist, like bài hát hoặc theo dõi nghệ sĩ ngay trong luồng chat tự nhiên.                                             |
| Giá trị mặc định thông minh (Smart defaults)        | Dùng (Option C) | Mang lại trải nghiệm phản hồi tức thì, mượt mà khi người dùng nói ngắn gọn (ví dụ "bật nhạc đi"), không bắt người dùng giải thích dài dòng.              |
| Điều phối tập trung qua Centralized AI Orchestrator | Dùng (Option A) | Giữ kiến trúc lỏng (loose coupling), phân tách rõ ràng giữa module phân tích ngữ nghĩa (122) và module thực thi âm nhạc (123) hoặc sinh câu thoại (121). |

### Cách kiểm chứng

- Kiểm tra tính nhất quán giữa câu trả lời trong mục Clarifications và nội dung các yêu cầu chức năng FR-002, FR-003, FR-005, FR-007.
- Xác nhận không còn marker `[NEEDS CLARIFICATION]` nào sót lại trong `spec.md`.
- Kiểm tra lại checklist chất lượng: 16/16 mục đạt (`checklists/requirements.md`).
- Không chạy automated tests vì spec chưa bước vào pha implementation.

**Kết quả kiểm chứng:** Đạt yêu cầu làm rõ, đặc tả hoàn chỉnh và sẵn sàng cho pha lập kế hoạch (`/speckit-plan`).

**Ghi chú:** Spec hoàn thiện nằm tại `specs/120-ai-conversational-agent/122-music-intent-understanding/spec.md`.

---

## Mục 12: Viết spec 123 – Real-Time Music Assistance

| Trường                   | Nội dung                                                                                                                                                                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-30                                                                                                                                                                                                                                                                                  |
| Người thực hiện          | Nhựt                                                                                                                                                                                                                                                                                        |
| Nhóm tính năng liên quan | 12 – AI Conversational Agent, Feature 123: Real-Time Music Assistance (`specs/120-ai-conversational-agent/123-real-time-music-assistance`)                                                                                                                                                  |
| Công cụ AI               | Antigravity (Gemini 3.8 Flash), `/speckit-specify`                                                                                                                                                                                                                                          |
| Mục đích                 | Đối chiếu tài liệu dự án để tạo đặc tả nghiệp vụ cho khả năng hỗ trợ âm nhạc theo thời gian thực trong hội thoại; phân định rõ ranh giới với giao diện hội thoại (121) và phân tích ý định (122), đồng thời kết nối điều phối với Music Player, Queue, Songs, Playlists, Albums và Artists. |

### Prompt đã dùng

```text
/speckit-specify SPECIFY_FEATURE_DIRECTORY=specs/120-ai-conversational-agent/123-real-time-music-assistance

AI Conversational Agent của AuraTune hỗ trợ người dùng thực hiện các yêu cầu liên quan đến âm nhạc ngay trong quá trình hội thoại. Sau khi tiếp nhận tin nhắn và kết quả nhận diện ý định từ spec `122-music-intent-understanding`, hệ thống xử lý yêu cầu và phối hợp với các chức năng âm nhạc tương ứng để cung cấp hỗ trợ cho người dùng. Làm rõ các hành động âm nhạc được hỗ trợ, cách chuyển tiếp yêu cầu đến thành phần xử lý phù hợp, cách phản hồi kết quả cho người dùng và cách xử lý khi yêu cầu không hợp lệ, thiếu thông tin hoặc dịch vụ liên quan không khả dụng.

Không bao gồm: giao diện hội thoại và quản lý tin nhắn (spec `121-conversational-interface`), nhận diện ý định âm nhạc từ ngôn ngữ tự nhiên (spec `122-music-intent-understanding`), xây dựng hoặc huấn luyện mô hình AI, tự quyết định các hành động âm nhạc, thuật toán hoặc kiến trúc xử lý nếu tài liệu nguồn chưa xác định.

Dữ liệu và quy tắc: đối chiếu `docs/proposal/proposal.md`, `docs/management/team-contract.md`, `docs/design/database/README.md`, API contract và các spec liên quan trong repository. Làm rõ dependency với Conversational Interface, Music Intent Understanding, Music Player, Songs, Albums, Artists và Playlists nếu được hỗ trợ. Đảm bảo các hành động được thực hiện trong phạm vi quyền của người dùng hiện tại. Nếu tài liệu chưa xác định danh sách hành động, cách thực thi, cơ chế phản hồi hoặc hành vi khi lỗi, ghi nhận là điểm cần clarification thay vì tự giả định.
```

### Tóm tắt phản hồi của AI

- Rà soát các tài liệu liên quan: `docs/proposal/proposal.md`, `docs/management/team-contract.md`, `docs/analysis-and-design/api-contract.md`, `docs/design/database/README.md`, `docs/design/architecture/feature-modules.md`, `docs/design/architecture/system-architecture.md`, và các spec tiền đề `121-conversational-interface`, `122-music-intent-understanding`.
- Cấu hình thư mục và cập nhật file `.specify/feature.json` trỏ tới `specs/120-ai-conversational-agent/123-real-time-music-assistance`.
- Xây dựng tài liệu đặc tả chuẩn Spec Kit tại `specs/120-ai-conversational-agent/123-real-time-music-assistance/spec.md`:
  - 5 User Stories ưu tiên (P1: Real-time Playback and Audio Control Assistance, P1: Queue Management and Discovery Stream Assistance, P2: Real-time Library Interaction via Conversation, P2: Graceful Error Handling, Missing Information, and Service Outage Recovery, P1: User Session Authorization and Playback Isolation).
  - Kịch bản chấp nhận định dạng Given-When-Then, Edge Cases xử lý bài hát không có trong catalog, lỗi stream giữa chừng, xung đột thao tác thủ công, gọi lệnh dồn dập và timeout mạng.
  - 12 Functional Requirements (FR-001 đến FR-012), Key Entities (Assistance Request, Music Action Command, Assistance Execution Result, Playback Context Snapshot), 5 Success Criteria đo lường được (SC-001 đến SC-005) và Assumptions chi tiết.
- Thiết lập ranh giới rõ ràng: không render UI chat (121), không phân tích NLP (122), không tự ý quyết định vượt quyền người dùng hiện tại.
- Nhận diện đúng 3 điểm mấu chốt cần clarification theo quy định Spec Kit và đánh dấu `[NEEDS CLARIFICATION]`:
  1. Phạm vi các hành động âm nhạc cụ thể được hỗ trợ thời gian thực trong v1 (FR-002).
  2. Cơ chế chuyển tiếp và phối hợp hành động âm nhạc giữa orchestrator và client music player (FR-003).
  3. Cơ chế phản hồi kết quả trực quan và phục hồi lỗi trong luồng hội thoại (FR-004).
- Khởi tạo checklist chất lượng tại `specs/120-ai-conversational-agent/123-real-time-music-assistance/checklists/requirements.md` với 15/16 tiêu chí đạt, sẵn sàng chuyển sang bước clarify.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                                                  | Quyết định | Lý do                                                                                          |
| ----------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| Tiếp nhận payload chuẩn từ spec 122                   | Dùng       | Giữ tính liên kết chặt chẽ với Centralized AI Agent Orchestrator đã thống nhất trong spec 122. |
| Bảo vệ quyền riêng tư và kiểm soát quyền người dùng   | Dùng       | Đảm bảo tính cô lập phiên nghe nhạc, tuân thủ Nghị định 13/2023/NĐ-CP và API Contract.         |
| Không làm gián đoạn phát nhạc hiện tại khi xảy ra lỗi | Dùng       | Đảm bảo trải nghiệm nghe nhạc liên tục (uninterrupted streaming) theo cam kết Proposal.        |

### Cách kiểm chứng

- Đối chiếu tài liệu đề xuất (`docs/proposal/proposal.md`), `api-contract.md` (các nhóm `/songs`, `/playlists`, `/artists`, `/users/me/history`), và specs `121`, `122`.
- Kiểm tra tính đầy đủ của file spec và checklist chất lượng: 15/16 tiêu chí đạt, sẵn sàng cho bước clarify.
- Không chạy automated tests vì spec đang ở pha đặc tả yêu cầu.

**Kết quả kiểm chứng:** Đạt yêu cầu khởi tạo spec sơ bộ cho Feature 123, chuyển sang pha clarify.

**Ghi chú:** Spec lưu tại `specs/120-ai-conversational-agent/123-real-time-music-assistance/spec.md`; checklist tại `checklists/requirements.md`.

---

## Mục 13: Làm rõ spec 123 bằng `/speckit-clarify`

| Trường                   | Nội dung                                                                                                                                                                                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-10-30                                                                                                                                                                                                                                               |
| Người thực hiện          | Nhựt                                                                                                                                                                                                                                                     |
| Nhóm tính năng liên quan | 12 – AI Conversational Agent, Feature 123: Real-Time Music Assistance (`specs/120-ai-conversational-agent/123-real-time-music-assistance`)                                                                                                               |
| Công cụ AI               | Antigravity (Gemini 3.8 Flash), `/speckit-clarify`                                                                                                                                                                                                       |
| Mục đích                 | Giải quyết triệt để 3 điểm cần làm rõ trong spec 123 thông qua quy trình câu hỏi tương tác: danh mục hành động âm nhạc hỗ trợ (FR-002), cơ chế chuyển tiếp điều phối phía Client (FR-003), và cơ chế phản hồi bằng thẻ tương tác kèm xử lý lỗi (FR-004). |

### Prompt đã dùng

```text
/speckit-clarify hỏi bằng tiếng việt
```

Chuỗi phản hồi làm rõ tuần tự:

- Câu 1: `c` (Option C – Hỗ trợ âm nhạc toàn diện)
- Câu 2: `A` (Option A – Điều phối hành động phía Client qua Payload phản hồi)
- Câu 3: `A` (Option A – Câu thoại của AI host kèm Thẻ bài hát/hành động tương tác và nút Retry)

### Tóm tắt phản hồi của AI

- Kiểm tra điều kiện tiên quyết bằng `check-prerequisites.sh` xác định nhánh `feat/123-real-time-music-assistance` và file `spec.md` mục tiêu.
- Thực hiện tuần tự 3 câu hỏi làm rõ bằng tiếng Việt theo định dạng chuẩn của Spec Kit:
  - **Câu 1 (FR-002)**: Chốt lựa chọn Option C – Hỗ trợ âm nhạc toàn diện: (1) Điều khiển phát nhạc cốt lõi (`PLAY_TRACK`, `PAUSE`, `RESUME`, `SKIP_NEXT`, `SKIP_PREVIOUS`), (2) Quản lý hàng đợi và luồng khám phá (`ADD_TO_QUEUE`, `PLAY_NEXT`, nạp playlist gợi ý/tìm kiếm vào queue), và (3) Tương tác thư viện cá nhân (`LIKE_SONG`, `SAVE_TO_PLAYLIST`, `FOLLOW_ARTIST`) trong phạm vi quyền hạn tài khoản đã đăng nhập.
  - **Câu 2 (FR-003)**: Chốt lựa chọn Option A – Cơ chế điều phối hành động phía Client qua Payload phản hồi (Client-side Action Dispatch via Response Payload): Backend Orchestrator trả về gói tin JSON chứa mảng chỉ thị `client_actions` chuẩn hóa; Web Client tiếp nhận và trực tiếp kích hoạt phát audio/cập nhật queue trên Persistent Bottom Player (`040`/`050`), đồng thời gọi API backend đối với các thao tác thư viện cá nhân.
  - **Câu 3 (FR-004)**: Chốt lựa chọn Option A – Phản hồi tự nhiên bằng câu thoại của AI host kết hợp thẻ bài hát tương tác (Interactive Song/Action Card widget) và nút Retry khi lỗi; cam kết không bao giờ ngắt ngang bài hát đang phát nếu gặp lỗi tra cứu hoặc dịch vụ phụ trợ.
- Cập nhật tức thời vào file `spec.md`: bổ sung mục `## Clarifications` với session ngày 2026-10-30, cập nhật chi tiết các yêu cầu chức năng FR-002, FR-003, FR-004, và chuyển trạng thái spec sang `Draft — Ready for Planning`.
- Tái đánh giá checklist chất lượng tại `checklists/requirements.md`: 16/16 tiêu chí đạt (100%), hoàn tất việc loại bỏ toàn bộ các marker `[NEEDS CLARIFICATION]`.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                                             | Quyết định      | Lý do                                                                                                                                          |
| ------------------------------------------------ | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Danh mục hành động toàn diện                     | Dùng (Option C) | Giúp AI Agent thực hiện trọn vẹn vai trò AI DJ/Host, khai thác tối đa 5 nhóm ý định đã thống nhất ở spec 122.                                  |
| Điều phối hành động phía Client                  | Dùng (Option A) | Tận dụng trực tiếp Persistent Bottom Player hiện có trên Web Client, giữ backend stateless, tránh phụ thuộc phức tạp vào WebSocket/SSE cho v1. |
| Thẻ bài hát tương tác & không ngắt audio khi lỗi | Dùng (Option A) | Mang lại trải nghiệm trực quan sống động trong hội thoại và bảo đảm luồng nghe nhạc liên tục không bị gián đoạn.                               |

### Cách kiểm chứng

- Kiểm tra tính nhất quán giữa nội dung mục `## Clarifications` và các yêu cầu chức năng FR-002, FR-003, FR-004 trong `spec.md`.
- Xác nhận không còn marker `[NEEDS CLARIFICATION]` nào trong `spec.md`.
- Kiểm tra lại checklist chất lượng: 16/16 mục đạt chuẩn (`checklists/requirements.md`).
- Không chạy automated tests vì spec đang ở pha hoàn thiện yêu cầu.

**Kết quả kiểm chứng:** Đạt yêu cầu làm rõ, đặc tả hoàn chỉnh và sẵn sàng cho pha lập kế hoạch (`/speckit-plan`).

**Ghi chú:** Spec hoàn thiện nằm tại `specs/120-ai-conversational-agent/123-real-time-music-assistance/spec.md`.

---

## Mục 14: Rà soát và làm rõ toàn diện 12 nhóm chức năng (010 – 120) và đồng bộ liên nhóm trước PA3

| Trường                   | Nội dung                                                                                                                                                                                                                                                                                                         |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-11-01                                                                                                                                                                                                                                                                                                       |
| Người thực hiện          | Lê Công Minh Nhựt (Leader); cùng các thành viên xem và đóng góp ý kiến khi clarify: (Nguyễn Khánh Đăng, Nguyễn Thanh Huy, Thái Hoàng, Mai Đăng Khoa)                                                                                                                                                             |
| Nhóm tính năng liên quan | Toàn bộ 12 nhóm chức năng (010: Authentication, 020: Home Dashboard, 030: Search, 040: Music Player, 050: Queue Management, 060: Playlist Management, 070: Listening History, 080: Album Interaction, 090: Artist Profile & Studio, 100: AI Recommendations, 110: Admin Functions, 120: AI Conversational Agent) |
| Công cụ AI               | Antigravity (Gemini 3.8 Flash), `/speckit-clarify`                                                                                                                                                                                                                                                               |
| Mục đích                 | Rà soát, phân tích, đối chiếu mã nguồn và làm rõ toàn diện yêu cầu, tác nhân (Actors), ranh giới trách nhiệm, quy tắc nghiệp vụ và các luồng dữ liệu liên nhóm của toàn bộ 12 nhóm chức năng AuraTune trước khi thực hiện Use-Case Modeling và Use-Case Specifications cho PA3.                                  |

### Prompt đã dùng

```text
/speckit-clarify # TASK: Clarify All 12 AuraTune Functional Groups Using Existing Repository Sources Only

## 1. Role

Act as a Senior Business Analyst and Software Requirements Engineer for AuraTune.

Your responsibility is to help the project owner clarify the requirements and scope of all 12 functional groups before starting PA3 Use-Case Modeling and Use-Case Specifications.

You must work interactively with the project owner.

**The project owner is the final decision-maker for all requirement ambiguities and proposed changes.**

---

## 2. Strict Working Constraints

These constraints are mandatory.

### 2.1 Do NOT Create New Files or Directories

Do not create:
- New Markdown files.
- New clarification documents.
- New directories.
- New reports.
- New Use-Case Model files.
- New Use-Case Specification files.
- New templates.
- New summary documents.

Do not create a separate clarification package.

Use only the existing repository files as sources for analysis.

### 2.2 Existing Spec Files

You may inspect existing Spec Kit files, especially:

- `specs/[group]/[feature]/spec.md`

You may propose updates to existing `spec.md` files only when necessary to correct or clarify requirements.

However:

1. Do not edit any `spec.md` automatically.
2. First explain the issue to the project owner.
3. Show the current requirement and the proposed change.
4. Explain why the change is necessary.
5. Ask the project owner for confirmation.
6. Only update the existing `spec.md` after explicit approval.

### 2.3 Do NOT Modify Other Files

Do not modify:
- `plan.md`
- `tasks.md`
- `research.md`
- `data-model.md`
- `quickstart.md`
- API contracts.
- Checklists.
- Source code.
- Database files.
- Frontend files.
- Backend files.
- AI service files.
- Existing project documentation outside an explicitly approved `spec.md` change.

Do not modify project configuration or Git settings.

### 2.4 Do NOT Guess

Never invent or assume:
- Features.
- Functional requirements.
- Actors.
- User roles.
- Business rules.
- Authentication methods.
- External providers.
- System behavior.
- Data relationships.
- Functional group ownership.
- Cross-group dependencies.

If information is unclear, ask the project owner.

Do not silently interpret an ambiguous requirement as a confirmed requirement.

### 2.5 Preserve Existing Work

- Do not delete files.
- Do not rename files.
- Do not overwrite existing content.
- Do not discard uncommitted changes.
- Do not run destructive commands.
- Do not reset or clean the Git working tree.

---

## 3. Sources to Inspect

Inspect the existing repository and read the actual contents of the following documents.

### Project Documents

- `docs/proposal/Auratune_Vision_Document.md`
- `docs/proposal/project_plan.md`
- `docs/proposal/proposal.md`

### Management Documents

- `docs/management/team-contract.md`
- `docs/management/git-workflow.md`
- `docs/management/speckit-workflow-guide.md`

### Existing Spec Kit Documentation

Inspect all relevant feature specifications under:

- `specs/010-authentication/`
- `specs/020-home-dashboard/`
- `specs/030-search/`
- `specs/040-music-player/`
- `specs/050-queue-management/`
- `specs/060-playlist-management/`
- `specs/070-listening-history/`
- `specs/080-album-interaction/`
- `specs/090-artist-profile-studio/`
- `specs/100-ai-recommendations/`
- `specs/110-admin-functions/`
- `specs/120-ai-conversational-agent/`

Read the actual `spec.md` files and relevant feature-level specifications.

You may inspect implementation and database files as supporting evidence, but do not treat implementation as proof of approved requirements.

---

## 4. Functional Groups to Clarify

Analyze these 12 groups in their existing ID order.

| Group ID | Functional Group |
|---|---|
| 010 | Authentication |
| 020 | Home Dashboard |
| 030 | Search |
| 040 | Music Player |
| 050 | Queue Management |
| 060 | Playlist Management |
| 070 | Listening History |
| 080 | Album Interaction |
| 090 | Artist Profile & Studio |
| 100 | AI Recommendations |
| 110 | Admin Functions |
| 120 | AI Conversational Agent |

Do not change their IDs or names.

---

## 5. Clarification Process

Work on only one functional group at a time.

Do not analyze all 12 groups and make assumptions in one response.

For each group, follow the process below.

### Step 1: Inspect Existing Requirements

Read the group's existing:
- `spec.md`
- Related feature specifications.
- Relevant Vision Document sections.
- Related existing project documents.

Extract the requirements without changing their original meaning.

### Step 2: Understand the Group

Present your analysis to the project owner using the following structure:

#### A. Group Overview
- Group ID.
- Group name.
- Existing feature IDs.
- Purpose.
- Main responsibilities.
- Group owner from the existing team contract.

#### B. Existing Features

| Feature ID | Feature Name | Existing Description | Source |
|---|---|---|---|

Use actual feature IDs and names.

#### C. Functional Requirements

| FR ID | Existing Requirement | Expected System Behavior | Source |
|---|---|---|---|

Preserve the original requirement meaning.

If no official FR ID exists, reference the source section instead of inventing an ID.

#### D. Actors

| Actor | Role | Interaction with the Group | Source |
|---|---|---|---|

Only include actors supported by the existing sources.

#### E. Main Functional Scenarios

Explain the important system behaviors based on the current requirements.

These are preliminary scenarios for clarification, not final Use-Case Specifications.

#### F. Alternative and Exception Scenarios

Identify documented alternative and exceptional behavior.

Clearly distinguish:
- Explicitly specified behavior.
- Partially specified behavior.
- Missing behavior.

#### G. Business Rules

List only business rules that exist in the sources.

#### H. Group Boundaries

Explain:
- What belongs to this group.
- What belongs to other groups.
- Potential overlapping functionality.
- Unclear ownership.

#### I. Dependencies

Identify dependencies supported by existing requirements.

Do not assume dependencies based solely on common application architecture.

#### J. Issues and Questions

List all unclear, conflicting or incomplete requirements.

For each issue, provide:

| ID | Current Information | Problem | Why Clarification Is Needed | Question |
|---|---|---|---|---|

### Step 3: Ask the Project Owner

After presenting the analysis, ask the project owner about unresolved points.

Rules:

- Ask concise, specific questions.
- Explain why each question matters.
- When useful, provide possible alternatives.
- Do not force a choice if the project owner may have another answer.
- Ask only questions that are necessary to clarify requirements.
- If multiple independent decisions are required, group related questions logically.
- Wait for the project owner's answers before finalizing the group.

**Do not move to the next group while the current group still has unresolved critical questions.**

### Step 4: Summarize Confirmed Decisions

After receiving answers, summarize:

- Confirmed scope.
- Confirmed features.
- Confirmed actors.
- Confirmed functional behavior.
- Confirmed business rules.
- Confirmed group boundaries.
- Confirmed dependencies.
- Remaining open questions.

Clearly distinguish:

- Existing source requirement.
- Project-owner clarification.
- Proposed change.

### Step 5: Check Whether the Existing spec.md Needs Updating

Compare the confirmed understanding with the current `spec.md`.

There are three possible outcomes:

**Outcome A – No Update Needed**

The existing specification already represents the confirmed requirements accurately.

Do not modify the file.

**Outcome B – Update Recommended**

The specification is incomplete, ambiguous or inconsistent with the project owner's clarification.

Present:

1. Current content.
2. Identified problem.
3. Proposed replacement or addition.
4. Reason for the change.
5. Impact on related requirements or features.

Ask for explicit approval before editing.

**Outcome C – More Information Needed**

The available information is insufficient to determine the correct requirement.

Do not edit the file.

Ask the project owner for clarification.

### Step 6: Update Only After Approval

After explicit approval:

- Update only the relevant existing `spec.md`.
- Preserve unrelated content.
- Preserve the existing document structure and terminology.
- Avoid rewriting sections that do not need changes.
- Do not modify other Spec Kit artifacts.
- Show a concise summary of the exact changes.

Never update a requirement based only on your own assumptions.

### Step 7: Confirm Group Completion

A group is ready to move forward when:

- Its purpose and scope are understood.
- Existing features have been reviewed.
- Functional requirements are understood.
- Actors are confirmed.
- Important workflows are clarified.
- Business rules are understood.
- Group boundaries are agreed upon.
- Dependencies are understood.
- Critical questions have been resolved.
- Necessary `spec.md` updates have been approved and completed, or no updates are needed.

After this, ask the project owner whether to proceed to the next group.

---

## 6. Specific Clarification Areas

Use the following areas as investigation guides, not as assumptions that all listed capabilities exist.

### 010 – Authentication

Review:
- Local authentication.
- OAuth authentication.
- Session management.
- Registration and login.
- Supported authentication providers.
- Account lifecycle.
- Authentication state.
- Session lifecycle.
- Logout behavior.
- Token behavior, if documented.
- Authentication vs authorization.

Do not assume unverified features such as password recovery, email verification, Facebook login or multi-device session management.

### 020 – Home Dashboard

Review:
- Dashboard purpose.
- Main sections.
- Personalized content.
- Recently played content.
- Featured content.
- Recommendations.
- Data sources.
- Navigation.
- Loading and empty states.

### 030 – Search

Review:
- Searchable content types.
- Search input.
- Search results.
- Suggestions.
- Filtering.
- Sorting.
- Search history.
- No-result behavior.
- Search errors.

### 040 – Music Player

Review:
- Playback behavior.
- Play and pause.
- Next and previous.
- Seek and progress.
- Volume.
- Repeat and shuffle.
- Playback states.
- Playback errors.
- Queue integration.
- Listening history integration.

### 050 – Queue Management

Review:
- Queue initialization.
- Adding tracks.
- Removing tracks.
- Reordering.
- Current track.
- Next-track behavior.
- Queue persistence.
- Queue and playlist relationships.

### 060 – Playlist Management

Review:
- Playlist creation.
- Playlist editing.
- Playlist deletion.
- Track management.
- Playlist ownership.
- Visibility.
- Permissions.
- Playlist ordering.
- Queue integration.

### 070 – Listening History

Review:
- Listening activity recording.
- Recording conditions.
- History display.
- Sorting and filtering.
- Retention.
- Deletion.
- Privacy.
- Recommendation integration.

### 080 – Album Interaction

Review:
- Album details.
- Track listing.
- Album metadata.
- Album-related interactions.
- Navigation.
- Search integration.
- Player integration.

### 090 – Artist Profile & Studio

Review:
- Artist profile.
- Artist information.
- Discography.
- Artist-facing functionality.
- Studio capabilities.
- Content management.
- Publishing.
- Permissions.
- Admin boundary.

### 100 – AI Recommendations

Review:
- Recommendation goals.
- Input data.
- Listening history.
- User preferences.
- Recommendation generation.
- Presentation.
- User feedback.
- AI service integration.
- Failure and fallback behavior.

### 110 – Admin Functions

Review:
- Admin roles.
- Permissions.
- User management.
- Content management.
- Moderation.
- System management.
- Audit records.
- Artist management boundaries.

### 120 – AI Conversational Agent

Review:
- Conversational purpose.
- Supported intents.
- User input.
- AI responses.
- Conversation context.
- Conversation lifecycle.
- Music discovery.
- Recommendation integration.
- Search integration.
- Player integration.
- AI provider.
- Error and fallback behavior.

---

## 7. Cross-Group Clarification

After the 12 groups have been individually clarified, review the relationships between them.

Pay special attention to:

- Authentication vs Admin Functions.
- Home Dashboard vs Search.
- Search vs Album Interaction.
- Music Player vs Queue Management.
- Queue Management vs Playlist Management.
- Music Player vs Listening History.
- Listening History vs AI Recommendations.
- Artist Profile & Studio vs Admin Functions.
- AI Recommendations vs AI Conversational Agent.
- AI Conversational Agent vs Search and Music Player.

Do not create a separate report or file.

Present the cross-group findings directly in the conversation.

For every overlap:
1. Explain the overlapping functionality.
2. Show the relevant source requirements.
3. Explain the possible ownership boundary.
4. Identify what needs project-owner confirmation.
5. Wait for confirmation before proposing any specification changes.

---

## 8. Final Constraints

During this entire task:

- Do not create any new file.
- Do not create any new directory.
- Do not create a separate clarification report.
- Do not create Use-Case Model or Use-Case Specification files.
- Do not create UC IDs.
- Do not modify source code.
- Do not modify `plan.md` or `tasks.md`.
- Do not modify project configuration.
- Do not edit `spec.md` without explicit approval.
- Ask the project owner whenever a requirement is unclear.
- Work sequentially, one group at a time.
- Preserve all existing work and uncommitted changes.

---

## 9. How to Start

Start with **Group 010 – Authentication** only.

Inspect its actual repository sources:

- `specs/010-authentication/011-local-authentication/spec.md`
- `specs/010-authentication/012-oauth-authentication/spec.md`
- `specs/010-authentication/013-session-management/spec.md`
- Related Vision Document sections.
- Relevant project management documents.

Then present the complete Group 010 analysis using the structure in Section 5.

Ask the project owner about unresolved requirements.

Do not start Group 020 until Group 010 has been clarified and the project owner explicitly asks you to continue.

**The goal is not to produce more documentation. The goal is to establish an accurate, agreed understanding of the existing AuraTune requirements before any Use-Case work begins.**. Hỏi bằng tiếng Việt
```

### Tóm tắt phản hồi của AI

- Tiếp nhận và tuân thủ nghiêm ngặt toàn bộ các nguyên tắc: không tạo file/thư mục mới, không sửa code, không tự ý đoán định yêu cầu nghiệp vụ, chỉ đề xuất cập nhật các file `spec.md` hiện có và chỉ chỉnh sửa khi có phê duyệt rõ ràng (`approve`) từ Project Owner.
- Thực hiện quy trình rà soát và làm rõ tuần tự từng nhóm chức năng (từ Nhóm 010 đến Nhóm 120), sau đó tiến hành đồng bộ liên nhóm (Cross-Group Clarification):
  1. **Nhóm 010 – Authentication** (Phụ trách: Mai Đăng Khoa): Làm rõ ghi nhớ đăng nhập Remember Me (30 ngày), cơ chế vô hiệu hóa session khi đổi mật khẩu, đồng bộ đăng xuất đa tab, kiểm soát giới hạn thử sai đăng nhập. Cập nhật `011/spec.md` và `013/spec.md`.
  2. **Nhóm 020 – Home Dashboard** (Phụ trách: Nguyễn Thanh Huy): Phân tách rõ ràng giữa Home cá nhân hóa (Personalized) cho người dùng đăng nhập và Home công khai (Public) cho khách vãng lai; chuẩn hóa Top 10 Bảng xếp hạng thịnh hành (Trending Charts). Cập nhật `021/spec.md` và `024/spec.md`.
  3. **Nhóm 030 – Search** (Phụ trách: Nguyễn Khánh Đăng): Chuẩn hóa 3 chế độ tìm kiếm: Metadata, Lời bài hát AI, Ngữ nghĩa Vector; cơ chế phân trang 20 kết quả/trang; bộ lọc kết hợp thể loại/nghệ sĩ; lịch sử tìm kiếm tối đa 20 mục. Cập nhật `031/spec.md`, `032/spec.md`, `033/spec.md`.
  4. **Nhóm 040 – Music Player** (Phụ trách: Nguyễn Thanh Huy): Xác nhận cơ chế Bottom Player chạy bền vững không ngắt nhạc khi chuyển trang; đồng bộ lời bài hát thời gian thực theo milli-giây; phím tắt điều khiển (Space, phím mũi tên). Cập nhật `041/spec.md`, `044/spec.md`, `045/spec.md`.
  5. **Nhóm 050 – Queue Management** (Phụ trách: Nguyễn Thanh Huy): Khẳng định mô hình danh sách chờ kết hợp (Current Track + Up Next List); hỗ trợ kéo thả sắp xếp; cơ chế xác nhận an toàn `[y/N]` khi xóa sạch hàng chờ (`clear_queue`). Cập nhật `051/spec.md`, `052/spec.md`.
  6. **Nhóm 060 – Playlist Management** (Phụ trách: Mai Đăng Khoa): Cơ chế chống thêm bài trùng lặp (`disabled="Đã thêm"`); mời cộng tác viên trực tiếp qua email AuraTune; quyền xóa bài của cộng tác viên; lưu playlist công khai dạng Bookmark chỉ đọc. Cập nhật `061/spec.md`, `062/spec.md`, `065/spec.md`.
  7. **Nhóm 070 – Listening History** (Phụ trách: Mai Đăng Khoa): Ngưỡng tính lượt nghe hợp lệ là nghe liên tục tối thiểu 30 giây; bộ lọc thời gian thống nhất (7 ngày, 30 ngày, Toàn bộ); tính năng Clear All History tẩy sạch hoàn toàn khỏi mô hình gợi ý AI. Cập nhật `071/spec.md`, `072/spec.md`, `073/spec.md`.
  8. **Nhóm 080 – Album Interaction** (Phụ trách: Nguyễn Khánh Đăng): Phân loại huy hiệu Đĩa đơn (<= 1 bài) vs Album (>= 2 bài); mục "More from [Artist]"; lưu album dạng Bookmark/Follow; chia sẻ đa nền tảng. Cập nhật `081/spec.md`, `082/spec.md`, `083/spec.md`.
  9. **Nhóm 090 – Artist Profile & Studio** (Phụ trách: Thái Hoàng): Phân quyền nghiêm ngặt truy cập Artist Studio cho `role: 'artist'`; upload file nhị phân audio lên Cloudinary; ẩn/hiện bài hát bảo toàn 100% số lượt phát tích lũy. Cập nhật `093/spec.md`.
  10. **Nhóm 100 – AI Recommendations** (Phụ trách: Lê Công Minh Nhựt): Kết hợp 3 nguồn tín hiệu (Lịch sử nghe >= 30s, Likes, Follows); phân loại 4 Moods + 4 Contexts; chuyển sang danh sách thịnh hành khi AI ngoại tuyến hoặc người dùng mới (Cold-start). Cập nhật `102/spec.md`, `103/spec.md`.
  11. **Nhóm 110 – Admin Functions** (Phụ trách: Thái Hoàng): Bổ sung quản lý/phân quyền Role (`user`, `artist`, `admin` - cấm tự đổi role mình); chuẩn hóa 4 thẻ KPI Dashboard (Người dùng, Nghệ sĩ, Bài hát, Lượt nghe); thao tác kiểm duyệt nhanh kèm Toast; công tắc tính sẵn sàng hệ thống (`aiAvailable`, Reset Demo); gỡ bài vi phạm (skip trong queue, bảo toàn audit). Cập nhật `111/spec.md`, `112/spec.md`, `113/spec.md`.
  12. **Nhóm 120 – AI Conversational Agent** (Phụ trách: Lê Công Minh Nhựt): Bắt buộc đăng nhập tài khoản; quản lý hội thoại In-memory session hỗ trợ lệnh `/clear` và duyệt 30 câu lệnh `↑/↓`; 8 công cụ client `agentTools`; xác nhận `[y/N]` với `clear_queue`; phân giải câu lệnh ghép tuần tự; trạng thái tạm ngưng an toàn khi AI offline. Cập nhật `121/spec.md`, `122/spec.md`, `123/spec.md`.
  13. **Cross-Group Clarification**: Thiết lập Ma trận Tác nhân - Quyền hạn (Actor-Role Matrix) cho Guest, User, Artist, Admin qua 12 nhóm; chuẩn hóa 4 luồng dữ liệu xuyên suốt (Playback -> History -> Recommendations -> Queue; Moderation Delisting -> Queue Skipping -> Studio; System AI Toggle -> Graceful Degradation; User History Clear -> Recommendation Reset); thống nhất 5 nguyên tắc đồng bộ liên nhóm.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                                                           | Quyết định                           | Lý do                                                                                                                                   |
| -------------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Danh mục 12 nhóm chức năng và phân công trách nhiệm            | Giữ nguyên theo `team-contract.md`   | Tuân thủ chính xác hợp đồng nhóm: Nhựt (G10, G12), Khoa (G01, G06, G07), Đăng (G03, G08), Hoàng (G09, G11), Huy (G02, G04, G05).        |
| Ngưỡng ghi nhận lượt nghe hợp lệ $\ge 30$s                     | Dùng và chuẩn hóa trên toàn hệ thống | Nhất quán giữa G040 (Player), G070 (History), G100 (Recommendations) và G110 (Admin Stats), tránh spam playCount.                       |
| Cơ chế chống thêm bài trùng lặp trong Playlist                 | Thêm vào spec `061`, `062`           | Đảm bảo tính toàn vẹn của danh sách phát cá nhân và trải nghiệm người nghe.                                                             |
| Phân quyền Role (`user`, `artist`, `admin`) và 4 thẻ KPI Admin | Thêm vào spec `111`, `113`           | Khớp nối 100% với giao diện quản trị thực tế trong `AdminPage.jsx`, cho phép cấp quyền nghệ sĩ và xem tổng quan nền tảng.               |
| Thao tác kiểm duyệt gỡ bài: Tự động skip trong Queue           | Thêm vào spec `112`                  | Đảm bảo khi Admin gỡ bài vi phạm thì luồng nghe của người dùng khác không bị sập hay ngắt âm thanh đột ngột.                            |
| Vòng đời hội thoại AI Host In-memory & Lệnh `/clear`, `↑/↓`    | Sửa trong spec `121`                 | Phù hợp với kiến trúc trợ lý ảo CLI/DJ Host tương tác tức thời, tối ưu hiệu năng và tôn trọng quyền riêng tư.                           |
| Xác nhận tương tác an toàn `[y/N]` cho `clear_queue`           | Thêm vào spec `052`, `123`           | Ngăn chặn hành động xóa sạch toàn bộ hàng chờ do vô tình hoặc do AI phân tích nhầm, bảo vệ danh sách phát.                              |
| Bóc tách câu lệnh ghép (Compound Commands) tuần tự             | Thêm vào spec `122`, `123`           | Cho phép AI Host nhận diện và thực thi chuỗi hành động kết hợp (ví dụ "phát lofi rồi giảm âm lượng 30%").                               |
| Xóa cứng bài hát vi phạm (Hard delete / Cascade)               | Bỏ / Không dùng                      | Thay bằng cơ chế xóa mềm (Delist / Soft-hide) hiển thị mờ (`disabled`) trong playlist để bảo toàn lịch sử và dữ liệu kiểm toán.         |
| Tự ý đoán hoặc sáng tạo tính năng mới ngoài tài liệu           | Bỏ / Nghiêm cấm                      | Tuân thủ tuyệt đối quy tắc của Spec Kit: không đoán mò, mọi điểm chưa rõ đều phải đưa ra câu hỏi tương tác để Project Owner quyết định. |

### Cách kiểm chứng

- **Đối chiếu chéo tài liệu dự án:** Kiểm tra tính nhất quán giữa nội dung các quyết định làm rõ với `docs/proposal/proposal.md`, `docs/management/team-contract.md`, `docs/analysis-and-design/api-contract.md`, `docs/design/database/README.md`.
- **Đối chiếu mã nguồn triển khai thực tế:** Rà soát trực tiếp các components và services phía frontend (`src/frontend/src/`) để bảo đảm các quyết định nghiệp vụ khớp 100% với giao diện đã code (như `AdminPage.jsx`, `AIHostChat.jsx`, `agentTools.js`, `agentService.js`, `BottomPlayer.jsx`).
- **Kiểm tra trạng thái Git (`git status --porcelain`):** Xác nhận chỉ có đúng 27 file `spec.md` thuộc 12 nhóm chức năng được chỉnh sửa sau khi được Project Owner duyệt qua các lượt lệnh `approve`. Không có bất kỳ file code, cấu hình, checklist, database hay file Markdown nào khác bị thay đổi hoặc tạo mới trái phép.
- **Rà soát tính nhất quán liên nhóm (Cross-Group Alignment):** 100% các ranh giới chức năng giữa Admin, Nghệ sĩ và Người nghe được phân định rành mạch; các luồng xử lý ngoại lệ khi bài hát bị gỡ hoặc AI ngoại tuyến đều có kịch bản xử lý an toàn và liên tục.

**Kết quả kiểm chứng:** Đạt 100% trên toàn bộ 12 nhóm chức năng và hoàn tất phiên đồng bộ liên nhóm. Hệ thống tài liệu đặc tả hiện đạt trạng thái sẵn sàng cho giai đoạn phân tích mô hình Use-Case (PA3).

---

## Mục 15: Xây dựng Use-Case Model hệ thống, hướng dẫn đặc tả Use Case (README) và tạo khung thư mục 12 nhóm cho PA3

| Trường                   | Nội dung                                                                                                                                                                                        |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-11-03                                                                                                                                                                                      |
| Người thực hiện          | Nhựt                                                                                                                                                                                            |
| Nhóm tính năng liên quan | Toàn bộ 12 nhóm chức năng (010 – 120), Yêu cầu phần mềm PA3 (Use-Case Model, Guidelines, Directory Structure)                                                                                   |
| Công cụ AI               | Gemini (Antigravity)                                                                                                                                                                            |
| Mục đích                 | Xây dựng mô hình Use Case cấp hệ thống, tài liệu hướng dẫn viết đặc tả Use Case chuẩn hóa và khởi tạo cấu trúc thư mục 12 nhóm chức năng cho PA3, đảm bảo truy vết 100% yêu cầu chức năng (FR). |

### Prompt đã dùng

````text
# TASK: Create AuraTune Use-Case Model, Documentation Guide, and Group Directory Structure

Work directly in the AuraTune repository.

Your task is to:
1. Create the system-level Use-Case Model.
2. Create the shared Use-Case Documentation README.
3. Create the 12 functional group directories.

Do all three in this task.

---

## 1. Inspect Existing Project Sources

Read the following documents before writing:

### Project documentation
- `docs/proposal/Auratune_Vision_Document.md`
- `docs/proposal/project_plan.md`
- `docs/proposal/proposal.md`
- `docs/management/team-contract.md`
- `docs/management/git-workflow.md`
- `docs/management/speckit-workflow-guide.md`

### Spec Kit documentation

Inspect relevant files under all 12 groups:

- `specs/010-authentication/`
- `specs/020-home-dashboard/`
- `specs/030-search/`
- `specs/040-music-player/`
- `specs/050-queue-management/`
- `specs/060-playlist-management/`
- `specs/070-listening-history/`
- `specs/080-album-interaction/`
- `specs/090-artist-profile-studio/`
- `specs/100-ai-recommendations/`
- `specs/110-admin-functions/`
- `specs/120-ai-conversational-agent/`

Inspect `spec.md`, `plan.md`, `tasks.md`, and relevant supporting files when available.

Also inspect `specs/README.md` and any existing Use-Case Documentation Guide.

---

## 2. Source Accuracy Rules

All documentation must be based on existing project sources.

- Do not invent actors, use cases, FRs, external systems, or business rules.
- Preserve existing terminology and requirement IDs.
- Do not assume a feature exists just because it appears in a group name.
- Do not assume Google or Facebook authentication is supported unless confirmed by project sources.
- Distinguish confirmed information, proposed information, unconfirmed information, and unresolved questions.
- If information is missing, use `TBD` or `Requires clarification`.
- If sources conflict, document the conflict instead of silently resolving it.
- Add references to the source files used.
- Do not claim that a feature is implemented simply because it appears in a specification.

---

## 3. Create the System-Level Use-Case Model

Create:

`docs/requirements/use-case-model.md`

This must be the single system-level Use-Case Model for the entire AuraTune project.

Include these sections:

### 3.1 Document Information
- Document title
- Purpose
- Scope
- Status
- Source references

### 3.2 System Overview
Describe AuraTune using the existing Vision Document and project requirements.

### 3.3 System Boundary
Explain:
- What is inside AuraTune.
- What is outside AuraTune.
- External actors and systems, if confirmed.
- Responsibilities and interactions across the boundary.

Do not invent external systems.

### 3.4 Actor Catalog
For each confirmed actor, document:
- Actor name
- Actor type
- Description
- Responsibilities
- Related use cases
- Source references

Distinguish primary actors, supporting actors, and external systems where appropriate.

### 3.5 Functional Group Overview

Cover all 12 groups:

| ID | Functional Group |
|---|---|
| 010 | Authentication |
| 020 | Home Dashboard |
| 030 | Search |
| 040 | Music Player |
| 050 | Queue Management |
| 060 | Playlist Management |
| 070 | Listening History |
| 080 | Album Interaction |
| 090 | Artist Profile & Studio |
| 100 | AI Recommendations |
| 110 | Admin Functions |
| 120 | AI Conversational Agent |

For every group, include:
- Purpose
- Confirmed capabilities
- Main actors
- Related FRs, if available
- Dependencies on other groups
- Source references
- Unresolved questions

### 3.6 System-Level Use-Case Diagram
Create a Mermaid diagram representing the overall AuraTune system.

The diagram must:
- Show the system boundary.
- Show confirmed actors.
- Show confirmed use cases.
- Organize use cases by functional group where practical.
- Show relationships only when supported by sources.

Do not invent `include`, `extend`, or generalization relationships.

If Mermaid cannot represent the desired UML notation, use a clear conceptual Mermaid representation and label it appropriately.

### 3.7 Consolidated Use-Case Catalog
Include:
- UC ID
- Use-case name
- Primary actor
- Supporting actors
- Functional group
- Related FR IDs
- Source references
- Confirmation status

Use existing IDs where available. If IDs are not available, define a provisional convention and label it as provisional.

### 3.8 Use-Case Relationships
Document supported:
- `include`
- `extend`
- Generalization
- Cross-group dependencies

Explain each relationship. Mark proposed relationships as unconfirmed.

### 3.9 FR Traceability
Map existing functional requirements to their functional groups and use cases.

Do not invent missing FR IDs.

### 3.10 Open Questions and Limitations
List unresolved actors, behaviors, relationships, requirements, and dependencies.

### 3.11 References
List all source documents used.

---

## 4. Create the Shared Use-Case Documentation README

Create:

`docs/requirements/use-cases/README.md`

This is the single shared guideline for all team members writing Use-Case Specifications.

Include:

### 4.1 Purpose and Scope
Explain the purpose of this documentation standard and its applicability to all 12 functional groups.

### 4.2 Relationship with Spec Kit
Explain the distinction and relationship between:
- Use-Case Model
- Use-Case Specification
- Spec Kit `spec.md`
- Spec Kit `plan.md`
- Spec Kit `tasks.md`

Explain why these artifacts are not interchangeable.

### 4.3 Use-Case Writing Principles
Define:
- One use case represents one meaningful user goal or system interaction.
- Flows must be clear and testable.
- Avoid unnecessary implementation details.
- Use consistent terminology.
- Avoid duplicate use cases.

### 4.4 Naming and ID Convention
Define a consistent UC naming and identification convention.

Prefer existing repository conventions. Otherwise, document the proposed convention as provisional.

### 4.5 Actor Guidelines
Explain:
- Primary actors
- Supporting actors
- External systems
- Actor responsibilities

### 4.6 Standard Use-Case Specification Template

Define the required structure:

1. Use Case ID
2. Use Case Name
3. Functional Group
4. Primary Actor
5. Supporting Actors
6. Description
7. Preconditions
8. Trigger
9. Basic Flow
10. Alternative Flows
11. Exception Flows, when applicable
12. Postconditions
13. Special Requirements, when applicable
14. Related Functional Requirements
15. Related Use Cases
16. Source References
17. Prototype / Screenshot References

Explain the expected content of each section.

### 4.7 Basic Flow and Alternative Flow Guidelines
Explain:
- Numbered steps.
- Actor actions and system responses.
- Alternative flow branching points.
- Alternative flow termination or return to the basic flow.
- Validation and failure scenarios.
- Requirement traceability.

### 4.8 Preconditions and Postconditions
Explain how to write verifiable conditions.

### 4.9 FR Traceability
Explain how to link each use case to existing FR IDs.

### 4.10 Mermaid Guidelines
Define appropriate Mermaid usage for system-level and supporting diagrams.

### 4.11 Prototype and Screenshot Guidelines
Explain:
- Basic-flow prototype coverage.
- Alternative-flow coverage where applicable.
- Screenshot naming conventions.
- How to reference screenshots from specifications.
- Difference between conceptual prototypes and actual implementation screenshots.

### 4.12 Team Responsibilities
Use `docs/management/team-contract.md` as the source of truth for group ownership.

Do not reassign team members.

### 4.13 Documentation and Review Workflow
Define:
1. Review requirements and Spec Kit sources.
2. Identify use cases and actors.
3. Draft specifications.
4. Write basic and alternative flows.
5. Map FRs.
6. Prepare prototypes and screenshots.
7. Request peer review.
8. Resolve review comments.
9. Verify consistency with the system-level model.
10. Update documentation.

Follow the existing Git workflow.

### 4.14 Quality Checklist
Provide a practical review checklist.

### 4.15 Definition of Done
Define when a Use-Case Specification is complete and ready for review or submission.

### 4.16 PA3 Compliance
Explain how this documentation standard supports PA3 requirements.

Do not claim that individual Use-Case Specifications or prototypes have already been completed.

---

## 5. Create the 12 Functional Group Directories

Create exactly the following directories:

```text
docs/
└── requirements/
    ├── use-case-model.md
    └── use-cases/
        ├── README.md
        ├── 010-authentication/
        ├── 020-home-dashboard/
        ├── 030-search/
        ├── 040-music-player/
        ├── 050-queue-management/
        ├── 060-playlist-management/
        ├── 070-listening-history/
        ├── 080-album-interaction/
        ├── 090-artist-profile-studio/
        ├── 100-ai-recommendations/
        ├── 110-admin-functions/
        └── 120-ai-conversational-agent/
````

### Strict Directory Rules

For these 12 group directories:

- Create the directories only.
- Do not create any files inside them.
- Do not create per-group `README.md`.
- Do not create `use-case-inventory.md`.
- Do not create individual UC specification files.
- Do not create `prototypes/` subdirectories.
- Do not create `.gitkeep` or any placeholder files.

The only two Markdown files to create in this task are:

1. `docs/requirements/use-case-model.md`
2. `docs/requirements/use-cases/README.md`

Preserve existing contents if any of the target directories or files already exist.

---

## 6. PA3 Compliance

Ensure the two shared documents support:

- Use-Case Model deliverable.
- Use-Case Specification writing standards.
- Actor identification.
- Use-case relationships.
- FR traceability.
- Prototype and screenshot conventions.
- Team ownership and review workflow.

Do not claim that all individual Use-Case Specifications, prototypes, or screenshots are complete.

---

## 7. Scope Restrictions

This task is limited to:

- Creating the two shared Markdown documents.
- Creating the 12 functional group directories.

Do not modify:

- Application source code.
- Existing Vision Document.
- Project Plan.
- Proposal.
- Team Contract.
- Existing Spec Kit `spec.md`.
- Existing Spec Kit `plan.md`.
- Existing Spec Kit `tasks.md`.
- Configuration files.
- Environment files.

Do not delete, rename, or overwrite unrelated files.

Preserve all existing uncommitted changes.

Do not commit or push changes.

---

## 8. Final Verification

After completing the task:

1. Verify that `docs/requirements/use-case-model.md` exists.
2. Verify that `docs/requirements/use-cases/README.md` exists.
3. Verify that all 12 functional group directories exist.
4. Verify that the group directories contain no newly created files.
5. Verify that no `prototypes/` directories were created.
6. Verify that the model covers all 12 groups.
7. Verify that the shared README provides a complete and reusable writing standard.
8. Verify consistency between the model, group names, actors, and FR references.
9. Verify internal Markdown links.
10. Verify that no unrelated files were modified.

Finally, report:

- The two Markdown files created.
- The 12 directories created.
- Sources inspected.
- Any unresolved questions or missing source information.
- Verification results.

**Completion condition: Two shared documents written successfully and all 12 group directories created, with no files inside the group directories.**

```

### Tóm tắt phản hồi của AI

- Đọc và đối chiếu toàn bộ hệ thống tài liệu nguồn: `docs/proposal/proposal.md`, `Auratune_Vision_Document.md`, `project_plan.md`, `team-contract.md`, `git-workflow.md`, `api-contract.md`, `er-diagram.md`, `specs/` (12 nhóm chức năng), `AuraTune_Use_Case_Documentation_Guide.md` và các template mẫu.
- Xây dựng hoàn chỉnh tài liệu mô hình Use Case cấp hệ thống `docs/requirements/use-case-model.md` gồm 11 mục chi tiết:
  - Document Information & System Overview (bối cảnh nhạc phi thương mại mở bản quyền, tuân thủ Nghị định 13/2023/NĐ-CP).
  - Phân định ranh giới hệ thống bên trong vs các hệ thống bên ngoài (Google OAuth 2.0, Facebook Login, Cloud Media Storage CDN, External AI Service Providers, Spotify Web API offline).
  - Danh mục 5 tác nhân người dùng (`Guest`, `Listener`, `Playlist Collaborator`, `Artist`, `Administrator`) và sơ đồ kế thừa tác nhân Mermaid (`classDiagram`).
  - Tổng quan chi tiết 12 nhóm chức năng (010 – 120) gồm mục đích, năng lực đã xác nhận, tác nhân, FR liên quan, dependency và câu hỏi mở.
  - Sơ đồ Use-Case tổng thể hệ thống dạng Mermaid (`flowchart TB`) phân nhóm theo ranh giới functional groups.
  - Danh mục 83 Use Cases chuẩn hóa (`UC-[GROUP]-[SEQUENCE]`) bao phủ 100% các FR đã xác nhận từ 12 nhóm.
  - Phân tích các mối quan hệ `<<include>>`, `<<extend>>`, quan hệ kế thừa tác nhân và phụ thuộc liên nhóm.
  - Ma trận truy vết yêu cầu chức năng (FR Traceability Matrix) liên kết đầy đủ các mã FR đã kiểm chứng.
  - Ghi nhận 6 câu hỏi mở kiến trúc (SMTP reset pass, Facebook dev test users, chọn vector DB, HTTP range request CDN, sync playlist cộng tác, voice AI host).
- Xây dựng tài liệu hướng dẫn chuẩn hóa đặc tả Use Case `docs/requirements/use-cases/README.md` gồm 16 mục chi tiết:
  - Mục tiêu, phạm vi và phân định bản chất giữa Use-Case Model / Specification với Spec Kit (`spec.md`, `plan.md`, `tasks.md`).
  - 5 nguyên tắc viết Use Case (hướng mục tiêu người dùng, tương tác Actor – System, không phụ thuộc chi tiết triển khai code/SQL, thuật ngữ chuẩn hóa, không phân mảnh luồng).
  - Quy ước định danh và đặt tên file: `UC-[GROUP]-[SEQUENCE]-[short-name].md`.
  - Hướng dẫn tác nhân và template chuẩn 17 mục cho từng file đặc tả Use Case.
  - Hướng dẫn viết Basic Flow, Alternative Flows (AF), Exception Flows (EF), tiền điều kiện, hậu điều kiện, truy vết FR, Mermaid diagram, prototype/screenshot.
  - Bảng phân công trách nhiệm 5 thành viên theo đúng `docs/management/team-contract.md`.
  - Quy trình 10 bước viết và kiểm thử tài liệu Use Case kết hợp Git feature branch / Pull Request review.
  - Quality Checklist và Definition of Done (DoD) cho việc nghiệm thu tài liệu PA3.
- Khởi tạo chính xác 12 thư mục chức năng dưới `docs/requirements/use-cases/` (`010-authentication` đến `120-ai-conversational-agent`), tuân thủ nghiêm ngặt quy tắc thư mục rỗng (không tạo bất kỳ file hay folder con nào bên trong).
- Xử lý hoàn tác và dọn dẹp sạch sẽ các tệp clarification nháp theo yêu cầu của Project Owner trước khi bàn giao.
```

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                                                 | Quyết định                          | Lý do                                                                                                                                              |
| ---------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Danh mục 12 nhóm chức năng và phân công thành viên   | Giữ nguyên theo `team-contract.md`  | Tuân thủ chính xác phân công ban đầu: Nhựt (G10, G12), Khoa (G01, G06, G07), Đăng (G03, G08), Hoàng (G09, G11), Huy (G02, G04, G05).               |
| Quy ước định danh Use Case `UC-[GROUP]-[SEQUENCE]`   | Chuẩn hóa và áp dụng toàn hệ thống  | Nhất quán với tài liệu hướng dẫn PA3 và cấu trúc nhóm trong `specs/`.                                                                              |
| Danh mục tác nhân và ranh giới hệ thống              | Khóa chặt theo Proposal và Vision   | Chỉ sử dụng 5 tác nhân người dùng và 4 hệ thống bên ngoài đã kiểm chứng, không tự ý bổ sung các thành phần nội bộ (DB, router) làm actor.          |
| Ma trận truy vết yêu cầu chức năng (FR Traceability) | Ánh xạ trực tiếp từ 27 spec hiện có | Bảo đảm 100% các FR đã kiểm chứng (từ `011-FR-001` đến `123-FR-005`) đều có ít nhất một Use Case đại diện, sẵn sàng cho khâu viết đặc tả chi tiết. |
| Tạo file rác / placeholder trong 12 thư mục nhóm     | Bỏ / Nghiêm cấm tuyệt đối           | Tuân thủ chỉ thị nghiêm ngặt: 12 thư mục nhóm phải hoàn toàn rỗng để các feature lead tự khởi tạo tài liệu sau này.                                |

### Cách kiểm chứng

- **Kiểm tra sự tồn tại và định dạng tài liệu:** Xác nhận sự tồn tại của 2 file Markdown duy nhất: `docs/requirements/use-case-model.md` và `docs/requirements/use-cases/README.md`.
- **Kiểm tra tính toàn vẹn của 12 thư mục:** Chạy `Get-ChildItem -Directory` và `Get-ChildItem -Recurse -File` xác nhận cả 12 thư mục nhóm đều tồn tại và không chứa bất kỳ file hay thư mục con nào.
- **Kiểm tra độ bao phủ yêu cầu (FR Coverage):** Đối chiếu bảng Traceability Matrix trong `use-case-model.md` với toàn bộ các mã FR trong `specs/` (100% được bao phủ qua 83 Use Cases).
- **Kiểm tra tính an toàn của repository (`git status`):** Xác nhận không có file mã nguồn, file cấu hình hay tài liệu proposal/management nào bị chỉnh sửa hoặc xóa nhầm.

---

## Mục 16: Xây dựng Use-Case Documentation cho Group 100 – AI Recommendations

| Trường                   | Nội dung                                                                                                                                                                                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-11-03                                                                                                                                                                                                                                           |
| Người thực hiện          | Nhựt                                                                                                                                                                                                                                                 |
| Nhóm tính năng liên quan | 10 – AI Recommendations (`docs/requirements/use-cases/100-ai-recommendations/`, `specs/100-ai-recommendations/`)                                                                                                                                     |
| Công cụ AI               | Antigravity (Gemini 3.8 Flash)                                                                                                                                                                                                                       |
| Mục đích                 | Xây dựng toàn diện bộ tài liệu Use-Case Documentation cho Group 100 gồm README, Use-Case Inventory, 3 file đặc tả Use-Case Specification chi tiết (UC-100-001, UC-100-002, UC-100-003) và thư mục quản lý Prototype theo đúng chuẩn PA3 và Spec Kit. |

### Prompt đã dùng

````text
# NHIỆM VỤ: XÂY DỰNG USE-CASE DOCUMENTATION CHO GROUP 100 – AI RECOMMENDATIONS

Bạn đang làm việc trực tiếp trong repository AuraTune.

Hãy hoàn thiện bộ tài liệu Use-Case Documentation cho **Group 100 – AI Recommendations** theo hướng dẫn `AuraTune_Use_Case_Documentation_Guide.md` và các yêu cầu Spec Kit hiện có.

Mục tiêu là tạo một bộ tài liệu Use Case đầy đủ, có liên kết với Functional Requirements (FR), Spec Kit và đáp ứng yêu cầu PA3.

**Lưu ý về ngôn ngữ:**

- Prompt và yêu cầu dành cho bạn được viết bằng tiếng Việt.
- Tất cả file Markdown được tạo trong repository phải viết bằng tiếng Anh.
- Giữ nguyên thuật ngữ chuyên môn như Use Case, Actor, Basic Flow, Alternative Flow, Preconditions, Postconditions, FR, Spec Kit.

---

# PHẦN 1. PHẠM VI CÔNG VIỆC

Chỉ thực hiện Group 100 – AI Recommendations.

Thông tin group:

- Group ID: 100
- Group Name: AI Recommendations
- Group Owner: Lê Công Minh Nhựt

Thư mục làm việc:

`docs/requirements/use-cases/100-ai-recommendations/`

Không triển khai tài liệu cho các group khác.

Không sửa:

- `docs/requirements/use-case-model.md`
- `docs/requirements/use-cases/README.md`
- Tài liệu Use Case của các group khác.

---

# PHẦN 2. ĐỌC VÀ PHÂN TÍCH TÀI LIỆU NGUỒN

Trước khi tạo tài liệu, hãy đọc các nguồn sau.

## 2.1. Tài liệu dự án

- `docs/proposal/Auratune_Vision_Document.md`
- `docs/proposal/project_plan.md`
- `docs/proposal/proposal.md`
- `docs/management/team-contract.md`
- `docs/management/git-workflow.md`
- `docs/management/speckit-workflow-guide.md`
- docs/PA/

## 2.2. Spec Kit của Group 100

Đọc toàn bộ nội dung bên trong:

`specs/100-ai-recommendations/`

Nếu có nhiều feature hoặc sub-feature bên trong Group 100, phải đọc tất cả những phần liên quan.

Có thể đọc Spec Kit của group khác nếu cần xác định dependency hoặc ranh giới trách nhiệm.

## 2.3. Phân tích trước khi viết

Trước khi tạo tài liệu, hãy xác định:

1. Group 100 thực sự chịu trách nhiệm về những chức năng nào?
2. Những Functional Requirements nào thuộc Group 100?
3. Ai là actor tương tác với các chức năng đó?
4. Người dùng thực hiện những mục tiêu nào liên quan đến AI Recommendations?
5. Hệ thống phản hồi như thế nào?
6. Những Alternative Flow nào được yêu cầu?
7. Những chức năng nào phụ thuộc vào group khác?
8. Những yêu cầu nào còn thiếu hoặc chưa rõ?

Không bắt đầu viết Use Case khi chưa phân tích nguồn.

---

# PHẦN 3. QUY TẮC KHÔNG ĐƯỢC VI PHẠM

Tất cả tài liệu phải dựa trên thông tin thực tế của AuraTune.

Không được:

- Tự nghĩ thêm chức năng AI.
- Tự tạo Actor không có căn cứ.
- Tự tạo FR ID.
- Tự nghĩ ra thuật toán recommendation.
- Tự đặt công thức ranking hoặc scoring.
- Tự thêm cơ chế personalization nếu chưa được yêu cầu xác nhận.
- Tự thêm AI chatbot vào Group 100 nếu chức năng đó thuộc Group 120.
- Tự tạo external AI service hoặc API.
- Nhầm implementation task với user-facing use case.
- Khẳng định một chức năng đã implement chỉ vì nó có trong spec.

Phải phân biệt rõ:

| Trạng thái             | Ý nghĩa                            |
| ---------------------- | ---------------------------------- |
| Confirmed              | Được xác nhận trong tài liệu nguồn |
| Proposed               | Đề xuất, cần xác nhận              |
| Unconfirmed            | Chưa đủ thông tin chứng minh       |
| Requires clarification | Có thông tin thiếu hoặc mâu thuẫn  |

Nếu thông tin chưa rõ, ghi `TBD`, `Unconfirmed` hoặc `Requires clarification`.

Không tự suy diễn để làm tài liệu có vẻ đầy đủ.

---

# PHẦN 4. CẤU TRÚC THƯ MỤC CẦN TẠO

Tạo cấu trúc sau:

```text
docs/
└── requirements/
    └── use-cases/
        └── 100-ai-recommendations/
            ├── README.md
            ├── use-case-inventory.md
            ├── UC-100-001-[short-name].md
            ├── UC-100-002-[short-name].md
            ├── ...
            └── prototypes/
                └── README.md
```

Quy tắc:

- Chỉ tạo UC Specification cho những Use Case được xác nhận từ tài liệu nguồn.
- Không tạo file UC rỗng.
- Không tạo UC chỉ để lấp số thứ tự.
- Không tạo Use Case trùng lặp.
- Không tạo file cho chức năng chưa có căn cứ.
- Không tạo prototype giả.
- Không tạo ảnh giả để minh họa như thể đã implement.

Tên UC phải theo quy tắc:

`UC-100-[SEQUENCE]-[short-name].md`

Ví dụ tên file:

`UC-100-001-view-personalized-recommendations.md`

Đây chỉ là ví dụ. Hãy xác định tên và ID thực tế sau khi phân tích requirements.

---

# PHẦN 5. TẠO README CHO GROUP 100

Tạo file:

`docs/requirements/use-cases/100-ai-recommendations/README.md`

Đây là tài liệu giới thiệu và mô hình Use Case của riêng Group 100.

Nội dung phải viết bằng tiếng Anh.

README phải có các phần sau:

## 5.1. Group Information

Bao gồm:

- Group ID: 100
- Group Name: AI Recommendations
- Group Owner: Lê Công Minh Nhựt
- Purpose
- Documentation Status

## 5.2. Scope

Mô tả:

- Mục tiêu của Group 100.
- Những chức năng thuộc phạm vi group.
- Những chức năng không thuộc phạm vi group.
- Các dependency với group khác.
- Các chức năng đã xác nhận.
- Các vấn đề chưa rõ.

## 5.3. Related Requirements and Features

Tạo bảng:

| Feature ID | Feature Name | Related FR IDs | Spec Path |
| ---------- | ------------ | -------------- | --------- |

Chỉ sử dụng Feature ID và FR ID thực tế.

## 5.4. Actors

Tạo bảng:

| Actor | Type | Description | Related Use Cases |
| ----- | ---- | ----------- | ----------------- |

Chỉ đưa vào những Actor có căn cứ trong yêu cầu.

## 5.5. Use-Case Diagram

Đây là phần quan trọng.

Tạo một sơ đồ Use Case riêng cho Group 100 bằng Mermaid.

Sơ đồ phải thể hiện:

- System Boundary của AI Recommendations.
- Các Actor tương tác với group.
- Các Use Case đã được xác nhận.
- Quan hệ giữa Actor và Use Case.
- Quan hệ `<<include>>` nếu có.
- Quan hệ `<<extend>>` nếu có.
- Generalization nếu thực sự tồn tại.

Không được tự thêm quan hệ chỉ để sơ đồ trông phức tạp.

### Vị trí đặt Mermaid

Mermaid phải được viết trực tiếp bên trong:

`docs/requirements/use-cases/100-ai-recommendations/README.md`

Đặt trong section:

`## 5.5. Use-Case Diagram`

Không tạo file Mermaid riêng.

Không tạo ảnh PNG cho sơ đồ Mermaid.

Không chỉnh sửa sơ đồ tổng thể trong `docs/requirements/use-case-model.md`, vì đó là tài liệu dùng chung của toàn bộ dự án.

### Quy tắc biểu diễn

Ưu tiên sử dụng Mermaid phù hợp với môi trường Markdown của repository.

Nếu renderer không hỗ trợ UML Use Case Diagram trực tiếp, có thể sử dụng Mermaid `flowchart` để biểu diễn.

Nếu sử dụng flowchart:

- Phải thể hiện rõ System Boundary.
- Phải phân biệt Actor và Use Case.
- Phải có legend giải thích ký hiệu.
- Phải ghi chú đây là conceptual Use-Case Diagram, không phải cú pháp UML Use Case chuẩn.
- Không biểu diễn `include` hoặc `extend` nếu không có căn cứ.

Ví dụ minh họa:

```mermaid
flowchart LR
    User[User]

    subgraph AI["AuraTune - AI Recommendations"]
        UC1(["Use Case 1"])
        UC2(["Use Case 2"])
    end

    User --> UC1
    User --> UC2
```

Đây chỉ là ví dụ về cách đặt sơ đồ, không phải Use Case chính thức.

Hãy thay thế bằng Actor và Use Case thực tế sau khi phân tích Spec Kit.

## 5.6. Use-Case List

Tạo bảng:

| UC ID | Use-Case Name | Primary Actor | Related FRs | Specification |
| ----- | ------------- | ------------- | ----------- | ------------- |

Mỗi Use Case trong bảng phải có file specification tương ứng.

## 5.7. Dependencies and Integration

Mô tả các group mà AI Recommendations cần tương tác.

Chỉ ghi nhận dependency được xác nhận từ tài liệu nguồn.

## 5.8. Open Issues

Liệt kê các yêu cầu chưa rõ, thiếu hoặc mâu thuẫn.

## 5.9. References

Liệt kê các tài liệu đã sử dụng.

---

# PHẦN 6. TẠO USE-CASE INVENTORY

Tạo file:

`docs/requirements/use-cases/100-ai-recommendations/use-case-inventory.md`

Đây là danh sách quản lý tất cả Use Case thuộc Group 100.

Sử dụng bảng:

| UC ID | Use-Case Name | Primary Actor | Supporting Actors | Related FR IDs | Related Feature | Assigned Writer | Status | Specification |
| ----- | ------------- | ------------- | ----------------- | -------------- | --------------- | --------------- | ------ | ------------- |

Quy định:

- Liệt kê tất cả Use Case đã được xác nhận.
- Không đưa Use Case chưa được xác nhận vào danh sách chính thức.
- Nếu có đề xuất chưa rõ, tạo mục riêng `Unconfirmed Candidates`.
- Mỗi UC phải có ID duy nhất.
- Mỗi UC phải liên kết với FR tương ứng.
- Mỗi UC phải liên kết với Spec Kit Feature tương ứng.
- Assigned Writer ghi `TBD` nếu chưa có phân công.
- Group Owner là Lê Công Minh Nhựt.
- Không tự gán reviewer hoặc writer cho thành viên khác.

## Status

Sử dụng các trạng thái:

- Not Started
- Draft
- In Review
- Changes Requested
- Approved
- Requires Clarification

Chỉ đánh dấu `Approved` khi đã được review thực tế.

---

# PHẦN 7. VIẾT USE-CASE SPECIFICATION CHO TỪNG UC

Với mỗi Use Case đã xác nhận, tạo một file Markdown riêng.

Ví dụ:

`UC-100-001-view-personalized-recommendations.md`

Tất cả file phải tuân thủ template sau:

```markdown
# UC-100-[NUMBER] – [Use-Case Name]

## 1. Metadata

| Field | Value |
|---|---|
| Use Case ID | UC-100-[NUMBER] |
| Use Case Name | [Name] |
| Functional Group | 100 – AI Recommendations |
| Primary Actor | [Actor] |
| Supporting Actors | [Actors or None] |
| Related FR IDs | [Verified FR IDs] |
| Related Feature/Spec | [Feature ID and path] |
| Status | Draft |
| Writer | TBD |
| Reviewer | TBD |

## 2. Description

[Describe the user's goal and system capability.]

## 3. Preconditions

- [Conditions that must be true before the use case starts.]

## 4. Trigger

[Event that starts the use case.]

## 5. Basic Flow

1. **Actor:** [Actor action.]
2. **System:** [System response.]
3. **Actor:** [Actor action.]
4. **System:** [System response.]
5. [Continue until the goal is completed.]

## 6. Alternative Flows

### AF-01 – [Alternative Flow Name]

- **Starting step:** Step [X] of the Basic Flow.
- **Condition:** [Condition.]

1. **Actor/System:** [Action.]
2. **System:** [Response.]

- **Continuation:** [Resume at Step X / Use Case ends.]

## 7. Exception Flows

[Describe relevant system errors and exceptional situations.]

If none are identified, write "None identified".

## 8. Postconditions

### Success
- [State after successful completion.]

### Failure
- [State after unsuccessful completion.]

## 9. Special Requirements

- [Relevant security, performance, privacy, usability or other constraints.]

If none are identified, write "None identified".

## 10. Prototype and Screenshots

### Basic Flow

![Basic Flow](prototypes/[actual-image-file])

### Alternative Flow – AF-01

![Alternative Flow](prototypes/[actual-image-file])

## 11. Related Use Cases

- [Related UC IDs, if applicable.]

## 12. Source References

- [Source file and relevant section.]

## 13. Notes and Open Questions

- [Unresolved issues.]
```

## Quy tắc viết Basic Flow

- Đánh số tuần tự.
- Phân biệt rõ hành động Actor và phản hồi System.
- Mỗi bước mô tả một hành động hoặc phản hồi chính.
- Flow phải thể hiện từ lúc bắt đầu đến khi hoàn thành mục tiêu.
- Không mô tả code hoặc database query như hành động của Actor.
- Không bỏ qua phản hồi quan trọng của hệ thống.

## Quy tắc viết Alternative Flow

Mỗi Alternative Flow phải có:

- ID riêng: AF-01, AF-02...
- Tên flow.
- Starting step.
- Condition.
- Các bước xử lý.
- Kết quả hoặc điểm quay lại Basic Flow.

Không tự tạo Alternative Flow khi không có căn cứ nghiệp vụ.

## Preconditions và Postconditions

Phải viết dưới dạng điều kiện có thể kiểm tra được.

Không viết những câu quá chung chung như:

- System works properly.
- User uses the system normally.
- AI functions correctly.

---

# PHẦN 8. TẠO PROTOTYPE DIRECTORY

Tạo:

`docs/requirements/use-cases/100-ai-recommendations/prototypes/README.md`

Nội dung cần có:

1. Purpose.
2. Directory organization.
3. Screenshot naming convention.
4. Cách liên kết prototype với UC Specification.
5. Phân biệt prototype/wireframe với actual implementation screenshot.
6. Cách tổ chức ảnh theo Basic Flow và Alternative Flow.

Ví dụ quy tắc đặt tên:

```text
UC-100-001-basic-flow.png
UC-100-001-AF-01-no-recommendations.png
UC-100-001-AF-02-loading-error.png
UC-100-002-basic-flow.png
```

Đây chỉ là ví dụ.

Không tạo ảnh giả.

Nếu trong Spec Kit đã có UI assets phù hợp:

- Kiểm tra nội dung ảnh.
- Xác định ảnh thuộc UC và flow nào.
- Tái sử dụng nếu thực sự phù hợp.
- Ghi rõ nguồn ảnh.
- Dùng đường dẫn tương đối chính xác.

Nếu chưa có prototype, ghi rõ `Not Available` hoặc `Pending`.

---

# PHẦN 9. KIỂM TRA TRACEABILITY

Sau khi viết xong, kiểm tra mối liên hệ giữa:

`Functional Requirements → Use Cases → Use-Case Specifications → Prototypes`

Yêu cầu:

1. Mọi FR thuộc Group 100 phải được mapping với UC phù hợp hoặc có giải thích.
2. Mỗi UC phải tham chiếu FR thực tế.
3. Mỗi UC phải tham chiếu Spec Kit Feature phù hợp.
4. Mỗi UC trên Mermaid Diagram phải có trong Inventory.
5. Mỗi UC trong Inventory phải có Specification.
6. Mỗi Specification phải xuất hiện trong Inventory.
7. Không có UC trùng lặp không cần thiết.
8. Không đưa chức năng thuộc group khác vào Group 100.
9. Đường dẫn Markdown phải hợp lệ.

Tạo bảng traceability nếu cần để reviewer dễ kiểm tra.

---

# PHẦN 10. ĐÁP ỨNG YÊU CẦU PA3

Tài liệu Group 100 phải hỗ trợ các yêu cầu PA3:

- Xác định Actor.
- Xác định Use Case.
- Xây dựng Use-Case Model.
- Thể hiện các quan hệ phù hợp.
- Bao phủ Functional Requirements.
- Có một Use-Case Specification cho mỗi UC.
- Có Basic Flow.
- Có Alternative Flows.
- Có prototype/screenshot minh họa các flow tương ứng.
- Có thể truy vết từ FR đến UC và prototype.

Không được tuyên bố hoàn thành prototype nếu chưa có ảnh thực tế.

Không được đánh dấu Approved khi chưa review.

---

# PHẦN 11. PHẠM VI FILE ĐƯỢC PHÉP THAY ĐỔI

Chỉ được tạo hoặc chỉnh sửa file bên trong:

`docs/requirements/use-cases/100-ai-recommendations/`

Không sửa:

- `docs/requirements/use-case-model.md`
- `docs/requirements/use-cases/README.md`
- Tài liệu của group khác.
- Spec Kit `spec.md`.
- Spec Kit `plan.md`.
- Spec Kit `tasks.md`.
- Vision Document.
- Project Plan.
- Proposal.
- Team Contract.
- Source code.
- Configuration files.
- Environment files.

Nếu file đích đã tồn tại:

- Đọc nội dung trước.
- Giữ lại nội dung có giá trị.
- Chỉ chỉnh sửa phần cần thiết.
- Không ghi đè thay đổi chưa commit của thành viên khác.

Không commit hoặc push.

---

# PHẦN 12. KIỂM TRA CUỐI CÙNG

Sau khi hoàn thành, hãy kiểm tra:

1. README có đầy đủ nội dung.
2. Mermaid Diagram được đặt đúng trong README của Group 100.
3. Mermaid thể hiện đúng Actor và Use Case trong Inventory.
4. Inventory chứa đầy đủ Use Case đã xác nhận.
5. Mỗi UC có file Specification riêng.
6. ID và tên file thống nhất.
7. FR ID tồn tại trong tài liệu nguồn.
8. Feature mapping chính xác.
9. Basic Flow đầy đủ.
10. Alternative Flow có Starting step và Continuation.
11. Prototype được tham chiếu chính xác hoặc đánh dấu Pending.
12. Tất cả relative links hoạt động.
13. Không có yêu cầu tự suy diễn được ghi thành Confirmed.
14. Không có file ngoài Group 100 bị thay đổi.

## Báo cáo sau khi hoàn thành

Hãy trả về:

- Các nguồn đã kiểm tra.
- Các FR thuộc Group 100 đã xác định.
- Danh sách Actor.
- Tổng số Use Case đã xác nhận.
- Danh sách UC Specification đã tạo.
- Danh sách Use Case chưa xác nhận và lý do.
- Mermaid Diagram được đặt tại đâu.
- Prototype hiện có và prototype còn thiếu.
- Kết quả FR Traceability.
- Cây thư mục cuối cùng.
- Kết quả kiểm tra.

**ĐIỀU KIỆN HOÀN THÀNH: Group 100 có bộ Use-Case Documentation đầy đủ, đúng yêu cầu nguồn, có Mermaid Diagram trong README, có Inventory, có Specification cho từng Use Case đã xác nhận và có tổ chức prototype rõ ràng.**
````

### Tóm tắt phản hồi của AI

- Đọc và phân tích toàn diện tài liệu nguồn: `docs/proposal/proposal.md`, `Auratune_Vision_Document.md`, `project_plan.md`, `team-contract.md`, `git-workflow.md`, `AuraTune_Use_Case_Documentation_Guide.md`, `docs/PA/PA3-2026.pdf` và trích xuất đầy đủ 44 mã FR (`101-FR-001..014`, `102-FR-001..015`, `103-FR-001..015`) từ 3 subfeatures trong `specs/100-ai-recommendations/`.
- Xây dựng hoàn chỉnh tài liệu giới thiệu và mô hình nhóm `docs/requirements/use-cases/100-ai-recommendations/README.md` gồm 9 mục chuẩn: Group Information (Owner: Lê Công Minh Nhựt), Scope chi tiết (In-Scope, Out-of-Scope, Dependencies), bảng Feature & FR mapping, bảng Actor (`Listener`, `External AI Service Provider`, `Guest`), sơ đồ Use-Case Mermaid (`flowchart LR`) đặt đúng tại Section 5.5 kèm ranh giới hệ thống và quan hệ `<<include>>`/`<<extend>>`, danh sách 3 Use Cases, sơ đồ tích hợp luồng dữ liệu ASCII, câu hỏi mở và tài liệu tham khảo.
- Xây dựng danh mục theo dõi `docs/requirements/use-cases/100-ai-recommendations/use-case-inventory.md` gồm 3 Use Cases chính thức đã xác nhận, trạng thái Draft, mục riêng biệt ghi nhận 2 Unconfirmed/Out-of-Scope Candidates (`CAND-100-A` Free-form mood prompts, `CAND-100-B` Nút Dislike) kèm căn cứ loại trừ, và bảng ma trận truy vết (Traceability Matrix) đạt độ bao phủ 100% FR.
- Viết chi tiết 3 file đặc tả Use-Case Specification tuân thủ chính xác template 13 mục chuẩn:
  1. `UC-100-001-view-listening-history-analysis.md`: Xem phân tích lịch sử nghe (tổng thời lượng, top thể loại xếp hạng theo thời lượng nghe tích lũy), AF-01 lịch sử rỗng (< 1 lượt nghe), AF-02 đổi bộ lọc thời gian, AF-03 làm mới dữ liệu động, EF-01 chặn khách vãng lai, EF-02 lỗi truy vấn DB.
  2. `UC-100-002-receive-personalized-recommendations.md`: Nhận đề xuất âm nhạc cá nhân hóa đa thực thể (Songs, Albums, Artists, Playlists), AF-01 cold-start bài hát thịnh hành cho user mới, AF-02 làm mới danh sách gợi ý, AF-03 chuyển sang cold-start khi xóa lịch sử nghe, EF-01 xử lý AI service timeout/outage với graceful degradation và thông báo tinh tế, EF-02 phân quyền truy cập.
  3. `UC-100-003-discover-music-by-mood-and-context.md`: Khám phá nhạc theo 4 chip tâm trạng (Chill, Energetic, Melancholy, Focus) và 4 chip ngữ cảnh (Study/Work, Workout, Late Night, Travel/Commute), trả về Songs và Mood Playlists, AF-01 đổi chip lựa chọn, AF-02 xử lý khi không có kết quả phù hợp kèm chip gợi ý thay thế, EF-01 xử lý AI backend timeout.
- Thiết lập thư mục quản lý Prototype `docs/requirements/use-cases/100-ai-recommendations/prototypes/`:
  - Tạo `prototypes/README.md` quy định mục đích, tổ chức thư mục, quy ước đặt tên file, hướng dẫn liên kết ảnh trong đặc tả, phân biệt prototype/wireframe với implemented UI, và bảng tổng mục lục mapping.
  - Sao chép và chuẩn hóa tên 11 ảnh wireframe/mockup thực tế từ Spec Kit UI (`UC-100-001-basic-flow.png`, `UC-100-002-basic-flow-entry.png`, `UC-100-003-mood-selection.png`, v.v.).
  - Ghi nhận trạng thái `Pending` cho các màn hình đặc thù chưa có thiết kế đồ họa thay vì tạo ảnh giả mạo.
- Thực hiện tự đánh giá mức độ tuân thủ PA3 (CS300) và 12 tiêu chí checklist nội bộ, xác nhận đạt 100% các tiêu chí về ngôn ngữ (tiếng Anh), cấu trúc, truy vết và độ tin cậy của tài liệu.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                                      | Quyết định                          | Lý do                                                                                                                         |
| ----------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Danh mục 3 Use Cases chính thức           | Dùng                                | Phù hợp tuyệt đối với 3 subfeatures trong Spec Kit và Use-Case Model hệ thống, bao phủ trọn vẹn 44 FRs.                       |
| Ngôn ngữ tài liệu trong Group 100         | Dùng 100% tiếng Anh                 | Tuân thủ nghiêm ngặt chỉ thị của đề bài và quy định nộp bài của môn học (PA3 submission guidelines).                          |
| Sơ đồ Mermaid tại Mục 5.5 của README      | Dùng                                | Sử dụng cú pháp `flowchart LR` có system boundary, phân định actor/usecase/external system, có legend đầy đủ theo yêu cầu.    |
| Tái sử dụng UI assets từ Spec Kit         | Dùng (11 ảnh)                       | Tận dụng wireframe sẵn có từ `specs/100-ai-recommendations/*/ui/`, đổi tên theo chuẩn `UC-100-[SEQ]-[flow].png`.              |
| Prompt nhập tâm trạng tự do & Nút Dislike | Bỏ / Ghi vào Unconfirmed Candidates | Đã bị loại trừ trong quá trình clarify của Spec Kit; AuraTune chỉ hỗ trợ curated chips cố định và tín hiệu hành vi ngầm định. |
| Tạo ảnh prototype giả cho các flow thiếu  | Bỏ tuyệt đối                        | Tuân thủ nguyên tắc liêm chính học thuật; ghi chú rõ `Pending` cho các flow chưa có thiết kế đồ họa.                          |

### Cách kiểm chứng

- **Kiểm tra tính toàn vẹn tài liệu:** Chạy `Get-ChildItem -Recurse "docs/requirements/use-cases/100-ai-recommendations"` xác nhận sự tồn tại của 6 file markdown (`README.md`, `use-case-inventory.md`, 3 file `UC-*.md`, `prototypes/README.md`) và 11 ảnh PNG.
- **Kiểm tra độ bao phủ yêu cầu (FR Coverage):** Đối chiếu chéo 44 mã FR (`101-FR-001..014`, `102-FR-001..015`, `103-FR-001..015`) trong bảng Traceability Matrix tại `use-case-inventory.md` và từng file đặc tả (đạt độ bao phủ 100%).
- **Kiểm tra cấu trúc đặc tả:** Xác nhận cả 3 file đặc tả đều tuân thủ đầy đủ 13 mục chuẩn (Metadata, Description, Preconditions, Trigger, Basic Flow, Alternative Flows, Exception Flows, Postconditions, Special Requirements, Prototypes, Related Use Cases, Source References, Notes/Open Questions).
- **Kiểm tra liên kết tương đối (Relative Links):** Kiểm tra toàn bộ đường dẫn ảnh và liên kết chéo giữa README, Inventory, UC specs và Prototypes đều mở chính xác.
- **Kiểm tra phạm vi Git (`git status`):** Xác nhận chỉ có các file bên trong `docs/requirements/use-cases/100-ai-recommendations/` và `docs/ai-log/AI_log_1.md` được tạo/sửa đổi. Không có file mã nguồn hay tài liệu ngoài phạm vi bị tác động.

**Kết quả kiểm chứng:** Hoàn thành xuất sắc 100% các tiêu chí PA3 cho Group 100 – AI Recommendations. Bộ tài liệu sẵn sàng cho khâu Peer Review trong nhóm.

**Ghi chú:** Toàn bộ tài liệu Group 100 lưu tại `docs/requirements/use-cases/100-ai-recommendations/`.

---

## Mục 17: Xây dựng Use-Case Documentation cho Group 120 – AI Conversational Agent

| Trường                   | Nội dung                                                                                                                                                                                                                                                                                                   |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-11-03                                                                                                                                                                                                                                                                                                 |
| Người thực hiện          | Nhựt                                                                                                                                                                                                                                                                                                       |
| Nhóm tính năng liên quan | 12 – AI Conversational Agent (`docs/requirements/use-cases/120-ai-conversational-agent/`, `specs/120-ai-conversational-agent/`)                                                                                                                                                                            |
| Công cụ AI               | Antigravity CLI (Gemini 2.5 Pro)                                                                                                                                                                                                                                                                           |
| Mục đích                 | Xây dựng toàn diện bộ tài liệu Use-Case Documentation cho Group 120 gồm README.md (kèm sơ đồ Mermaid), use-case-inventory.md, 4 file đặc tả Use-Case Specification chi tiết (UC-120-001, UC-120-002, UC-120-003, UC-120-004) và thư mục quản lý Prototype theo đúng chuẩn PA3 và UI CLI frontend mới nhất. |

### Prompt đã dùng

```text
TASK: Create Use-Case Documentation for Group 120 – AI Conversational Agent

Bạn cần phân tích và xây dựng đầy đủ Use-Case Documentation cho Group 120 – AI Conversational Agent trong dự án AuraTune.

Đây là công việc tạo tài liệu Use Case ở cấp requirements/documentation. Không phải công việc triển khai tính năng mới hoặc chỉnh sửa source code.

1. Mục tiêu

Tạo bộ tài liệu Use Case hoàn chỉnh cho Group 120, phản ánh chính xác:

Functional Requirements hiện có của AI Conversational Agent.

Các chức năng và hành vi mà hệ thống thực sự hỗ trợ.

UI mới nhất của Group 120 đang được triển khai trong frontend.

Các tương tác giữa người dùng và hệ thống.

Basic Flow, Alternative Flow và Exception Flow của từng Use Case.

Mối liên hệ giữa Use Case, Functional Requirements và Spec Kit Group 120.

Lưu ý quan trọng: UI Group 120 đã có thay đổi so với tài liệu/spec cũ. Vì vậy, phải kiểm tra UI hiện tại trong source code trước khi viết Use Case. Không được sử dụng UI cũ làm căn cứ nếu nó không còn phản ánh implementation hiện tại.

2. Phân tích tài liệu và source code trước khi viết

Trước khi tạo hoặc chỉnh sửa bất kỳ file nào, hãy đọc và đối chiếu các nguồn sau:

2.1. Project-level documents

docs/proposal/Auratune_Vision_Document.md

docs/proposal/project_plan.md

docs/proposal/proposal.md

docs/management/team-contract.md

docs/management/git-workflow.md

Các tài liệu liên quan trong docs/requirements/

Các tài liệu PA trong docs/PA/ nếu có liên quan đến Group 120.

2.2. Spec Kit Group 120

Đọc toàn bộ nội dung hiện có trong:

specs/120-ai-conversational-agent/

Bao gồm các file nếu tồn tại:

spec.md

plan.md

tasks.md

research.md

data-model.md

contracts/

checklists/

Các UI assets, screenshots hoặc prototype liên quan.

Dùng các tài liệu này để hiểu phạm vi chức năng, yêu cầu và thiết kế đã được xác định.

2.3. Frontend implementation

Kiểm tra frontend hiện tại để xác định chính xác UI mới nhất của Group 120.

Tìm và đọc:

Các route/page liên quan đến AI Conversational Agent.

Components được sử dụng trong trang.

Các component con và component dùng chung có ảnh hưởng đến UI.

CSS, styling, layout và responsive behavior.

Các event handlers và user interactions.

Các trạng thái loading, empty, error và success nếu có.

Các API calls hoặc service calls được frontend sử dụng.

Các assets liên quan đến giao diện.

Không được chỉ đọc tên file rồi suy đoán chức năng. Hãy đọc implementation thực tế.

2.4. Thứ tự ưu tiên nguồn thông tin

Khi các tài liệu không thống nhất, áp dụng nguyên tắc:

Functional Requirements và project requirements đã được xác nhận.

Frontend implementation hiện tại để xác định UI và hành vi tương tác thực tế.

Spec Kit Group 120 hiện tại.

Các tài liệu hoặc prototype cũ.

Không tự ý biến một UI change thành Functional Requirement mới nếu chưa có căn cứ.

Nếu phát hiện sự khác biệt giữa requirement và implementation, ghi nhận rõ trong báo cáo thay vì tự ý hợp thức hóa sự khác biệt đó.

3. Xác định Use Case

Sau khi phân tích nguồn, hãy lập Use-Case Inventory cho Group 120.

Với mỗi Use Case, phải xác định:

Use Case ID.

Use Case Name.

Primary Actor.

Secondary Actors nếu có căn cứ.

Mục tiêu của Actor.

Functional Requirements liên quan.

UI screen hoặc UI component liên quan.

Mức độ hỗ trợ của implementation hiện tại.

Quy tắc xác định Use Case

Chỉ tạo Use Case dựa trên chức năng có căn cứ trong requirements hoặc implementation.

Không tạo Use Case chỉ vì có một button, icon hoặc UI component.

Những thao tác nhỏ thuộc cùng một mục tiêu người dùng nên được mô tả trong cùng Use Case nếu hợp lý.

Tách Use Case khi có mục tiêu người dùng độc lập hoặc luồng tương tác thực sự khác biệt.

Không tự tạo Actor, API, AI capability, business rule hoặc external service khi không có bằng chứng.

Không giả định hệ thống có conversation history, context memory, streaming response, regenerate response, feedback, voice input hoặc các tính năng AI khác nếu chưa xác minh.

Nếu một chức năng xuất hiện trên UI nhưng chưa có implementation hoặc requirement xác nhận, phải ghi rõ trạng thái chưa xác nhận.

Use Case ID theo format:

UC-120-[SEQUENCE]-[short-name].md

Sequence sử dụng số thứ tự tăng dần, không trùng lặp.

4. Cấu trúc thư mục và file cần tạo

Tạo tài liệu trong:

docs/requirements/use-cases/120-ai-conversational-agent/

Cấu trúc mong muốn:

120-ai-conversational-agent/
├── README.md
├── use-case-inventory.md
├── UC-120-001-[short-name].md
├── UC-120-002-[short-name].md
├── ...
└── prototypes/
    └── README.md

Số lượng Use Case phụ thuộc vào kết quả phân tích thực tế. Không cố định số lượng và không tạo Use Case giả để lấp đầy danh sách.

Nếu repository đã có cấu trúc hoặc file phù hợp, hãy ưu tiên cập nhật và tái sử dụng thay vì tạo bản sao.

Không tạo thêm các file ngoài phạm vi Group 120.

5. Nội dung README.md

File:

docs/requirements/use-cases/120-ai-conversational-agent/README.md

Phải có các nội dung:

5.1. Group Overview

Group ID: 120.

Group Name: AI Conversational Agent.

Purpose.

Scope.

Primary Actor và các Actor khác nếu có.

Group Owner: Lê Công Minh Nhựt.

Related Spec Kit: specs/120-ai-conversational-agent/.

5.2. Functional Scope

Tóm tắt các chức năng được xác nhận thuộc Group 120.

Phân biệt rõ:

Functionality được yêu cầu.

Functionality đã được implementation.

Functionality chưa được xác nhận hoặc chưa được triển khai.

5.3. Use-Case Inventory Summary

Tạo bảng tổng hợp:

Use Case ID

Use Case Name

Primary Actor

Related FRs

Implementation Status

Các ID và nội dung phải khớp với file Use Case thực tế.

5.4. Use-Case Relationships

Mô tả các quan hệ giữa Use Case nếu thực sự có:

include

extend

Generalization

Không tạo quan hệ chỉ để làm sơ đồ phức tạp hơn.

5.5. Use-Case Diagram

Tạo Mermaid diagram thể hiện các Use Case của Group 120.

Yêu cầu:

Thể hiện Actor và Use Case.

Thể hiện quan hệ giữa Actor và Use Case.

Thể hiện include hoặc extend nếu có căn cứ.

Tên và ID phải khớp với Use-Case Inventory.

Không đưa chức năng chưa xác nhận vào diagram như một chức năng chính thức.

Sơ đồ phải dễ đọc và không quá rối.

Nếu dùng Mermaid flowchart để biểu diễn Use Case, phải ghi rõ đây là conceptual Use-Case Diagram, không phải UML Use Case Diagram native.

5.6. UI Overview

Mô tả UI mới nhất của Group 120 dựa trên frontend implementation.

Bao gồm nếu có:

Page layout.

Main sections.

Sidebar hoặc navigation.

Conversation area.

Message display.

Input area.

Buttons và actions.

Loading và error states.

Responsive behavior.

Chỉ mô tả các thành phần thực sự tồn tại.

Có thể sử dụng screenshot/prototype đã có trong repository. Không tự tạo screenshot giả hoặc mô tả một UI chưa được triển khai như thể nó đã tồn tại.

5.7. Traceability

Mô tả cách liên kết:

Functional Requirements → Use Cases → UI → Spec Kit

6. Nội dung use-case-inventory.md

Tạo danh sách đầy đủ các Use Case đã xác định.

Mỗi Use Case cần có:

ID.

Name.

Brief Description.

Primary Actor.

Related Functional Requirements.

Related UI.

Related Spec Kit section hoặc task nếu xác định được.

Implementation Status.

Có thể chia Use Case theo nhóm chức năng để dễ đọc.

Không sao chép nguyên văn toàn bộ Use Case Specification vào Inventory.

7. Nội dung từng Use Case Specification

Mỗi Use Case phải có file riêng và tuân theo cấu trúc sau:

7.1. Metadata

Use Case ID.

Use Case Name.

Group.

Primary Actor.

Secondary Actors.

Related Functional Requirements.

Related Spec Kit.

Author/Owner.

7.2. Description

Mô tả mục tiêu của Actor và giá trị mà Use Case mang lại.

7.3. Preconditions

Các điều kiện phải thỏa mãn trước khi Use Case bắt đầu.

Không giả định user phải đăng nhập nếu requirements và implementation không xác nhận điều đó.

7.4. Trigger

Mô tả sự kiện khiến Actor bắt đầu Use Case.

7.5. Basic Flow

Viết luồng thành công theo từng bước rõ ràng.

Sử dụng format:

Step

Actor/System

Action

1

Actor

...

2

System

...

3

Actor

...

4

System

...

Yêu cầu:

Mỗi bước phải mô tả một hành động cụ thể.

Phân biệt rõ hành động của Actor và phản hồi của System.

Luồng phải phù hợp với UI thực tế.

Không mô tả API hoặc xử lý backend không có căn cứ.

Kết thúc bằng kết quả có thể quan sát hoặc xác nhận được.

7.6. Alternative Flows

Mô tả các luồng thay thế có thể xảy ra.

Mỗi Alternative Flow phải có:

Flow ID, ví dụ A1, A2.

Starting Step.

Condition.

Các bước Actor/System.

Điểm quay lại Basic Flow hoặc kết thúc Use Case.

Không bỏ qua các tình huống hợp lý được xác nhận bởi UI hoặc requirements.

7.7. Exception Flows

Mô tả lỗi hoặc tình huống bất thường có căn cứ, ví dụ:

Input không hợp lệ.

Không thể gửi yêu cầu.

Service không phản hồi.

Lỗi hiển thị dữ liệu.

Người dùng rời khỏi hoặc hủy thao tác.

Chỉ đưa vào những trường hợp có căn cứ từ requirements hoặc implementation. Không tự tạo chi tiết kỹ thuật.

7.8. Postconditions

Phân biệt:

Success Postconditions.

Failure Postconditions.

7.9. Special Requirements

Ghi các yêu cầu UI, usability, performance, accessibility hoặc responsive behavior nếu có căn cứ.

7.10. UI References

Liên kết tới UI screen, component hoặc screenshot tương ứng.

7.11. Traceability

Liệt kê chính xác các Functional Requirements liên quan và Spec Kit references.

8. Prototype và Screenshot Documentation

Trong:

docs/requirements/use-cases/120-ai-conversational-agent/prototypes/README.md

Hãy tạo danh sách prototype/screenshot cần thiết cho từng Use Case.

Mỗi Use Case cần xác định:

Screenshot cho Basic Flow.

Screenshot cho từng Alternative Flow có thay đổi UI đáng kể.

Screenshot cho Exception Flow nếu có UI error state đáng chú ý.

Ưu tiên tái sử dụng screenshot hoặc UI assets đã có trong repository.

Nếu chưa có screenshot:

Ghi rõ screenshot cần chụp.

Mô tả UI state cần thể hiện.

Liên kết với Use Case và bước tương ứng.

Không tạo ảnh giả và không ghi nhận screenshot chưa tồn tại như đã hoàn thành.

9. Traceability và Validation

Sau khi tạo tài liệu, hãy kiểm tra:

Mỗi Use Case có ít nhất một nguồn requirement hoặc căn cứ hợp lệ.

Mỗi FR thuộc Group 120 được xác định có được cover bởi Use Case nào hay chưa.

Không có FR bị bỏ sót mà không được ghi nhận.

Không có Use Case ID trùng lặp.

Tên Use Case trong README, Inventory, Diagram và Specification thống nhất.

Basic Flow phù hợp với UI hiện tại.

Alternative Flow và Exception Flow không mâu thuẫn với Basic Flow.

UI references trỏ đúng tới source hoặc assets hiện có.

Related Spec Kit references chính xác.

Mermaid syntax hợp lệ và có thể render.

Nếu có FR chưa được cover, ghi rõ trong README hoặc Inventory. Không tự tạo Use Case không có căn cứ chỉ để đạt 100% coverage.

10. Quy tắc về nội dung và format

Toàn bộ tài liệu trong repository phải viết bằng English.

Dùng Markdown.

Dùng Mermaid cho diagram.

Dùng bảng cho Inventory và Basic Flow khi phù hợp.

Sử dụng terminology nhất quán với Vision Document và Spec Kit.

Viết rõ ràng, có cấu trúc, đủ chi tiết để developer, tester và reviewer hiểu được hành vi hệ thống.

Không viết quá chung chung như "The system processes the request".

Không tự suy diễn behavior từ tên component.

Không copy nguyên nội dung Spec Kit vào Use Case Documentation.

Use Case Documentation phải tập trung vào tương tác Actor–System, còn Spec Kit tập trung vào đặc tả và triển khai kỹ thuật.

11. Scope giới hạn

Được phép tạo hoặc chỉnh sửa:

docs/requirements/use-cases/120-ai-conversational-agent/

Không được phép:

Chỉnh sửa Group 100 hoặc các Group khác.

Chỉnh sửa docs/requirements/use-case-model.md.

Chỉnh sửa docs/requirements/use-cases/README.md.

Chỉnh sửa Vision Document, Project Plan hoặc Proposal.

Chỉnh sửa bất kỳ file nào trong specs/120-ai-conversational-agent/.

Chỉnh sửa frontend/backend source code.

Thêm Functional Requirements mới.

Thay đổi API, database schema hoặc business logic.

Xóa hoặc ghi đè tài liệu hiện có ngoài phạm vi.

Nếu phát hiện vấn đề cần chỉnh sửa ở các khu vực ngoài phạm vi, hãy ghi nhận trong báo cáo cuối cùng thay vì tự ý sửa.

12. Git và bảo toàn thay đổi

Kiểm tra git status trước khi làm việc.

Bảo toàn toàn bộ thay đổi chưa commit hiện có.

Không xóa file hoặc ghi đè nội dung không liên quan.

Chỉ thay đổi file thuộc phạm vi được phép.

Không commit.

Không push.

Không tạo branch mới.

13. Final Report

Sau khi hoàn thành, báo cáo bằng Vietnamese với các mục:

Files Created – Các file đã tạo.

Files Updated – Các file đã cập nhật.

Use-Case Inventory – Danh sách ID và tên Use Case.

UI Analysis – Những điểm UI mới đã được phản ánh trong Use Case.

FR Coverage – Các FR đã cover và FR chưa cover.

Prototype Status – Screenshot/prototype đã có và còn thiếu.

Issues and Ambiguities – Những điểm chưa xác định hoặc mâu thuẫn.

Validation Results – Kết quả kiểm tra consistency và Mermaid.

Scope Confirmation – Xác nhận không sửa file ngoài Group 120.

Yêu cầu cuối cùng: Hãy ưu tiên độ chính xác và khả năng traceability. Use Case phải phản ánh đúng yêu cầu và UI Group 120 hiện tại của AuraTune, không được tự tưởng tượng thêm tính năng để làm tài liệu trông đầy đủ hơn. Kiểm chứng với docs/PA/PA3
```

### Tóm tắt phản hồi của AI

- Phân tích trực tiếp mã nguồn triển khai frontend thực tế: đọc component `src/frontend/src/components/chat/AIHostChat.jsx`, công cụ điều phối client-side `src/frontend/src/services/agentTools.js` và dịch vụ kết nối streaming SSE `src/frontend/src/services/agentService.js`. Phát hiện giao diện người dùng mới là một Floating Terminal/CLI tương tác (`#0c0d12`, prompt `❯`, spinner động `⠋ Đang suy nghĩ…`, collapsible reasoning `✻ Đã suy nghĩ trong N giây >`, chấm trạng thái thực thi công cụ `ok`/`error`/`running`/`confirm`, xác nhận xóa hàng đợi `? confirm [y/N]`, và các lệnh tích hợp `/clear`, `/help`, `↑/↓`, `esc`).
- Đọc và phân tích toàn diện tài liệu nguồn: `docs/proposal/proposal.md`, `Auratune_Vision_Document.md`, `project_plan.md`, `team-contract.md`, `git-workflow.md`, `AuraTune_Use_Case_Documentation_Guide.md`, `docs/PA/PA3-2026.pdf` và trích xuất đầy đủ 38 mã Functional Requirements (`121-FR-001..012`, `122-FR-001..012`, `123-FR-001..014`) từ 3 subfeatures trong `specs/120-ai-conversational-agent/`.
- Xây dựng hoàn chỉnh tài liệu giới thiệu và mô hình nhóm `docs/requirements/use-cases/120-ai-conversational-agent/README.md` gồm các phần chuẩn: Group Overview (Owner: Lê Công Minh Nhựt), Detailed Scope (In-Scope, Out-of-Scope), Feature Breakdown, Actor Catalog (`Listener`, `External AI Service Provider`, `Guest`), Sơ đồ quan hệ Use Case bằng Mermaid (`graph TD`) có phân định ranh giới hệ thống và quan hệ `<<include>>`/`<<extend>>`, kiến trúc giao diện CLI Terminal với các UX patterns nổi bật, ma trận phụ thuộc liên nhóm (Group 010, 030, 040, 070, 100), và bảng tóm tắt Use Case.
- Xây dựng danh mục kiểm kê `docs/requirements/use-cases/120-ai-conversational-agent/use-case-inventory.md`:
  - 4 Use Cases chính thức đã xác nhận (`UC-120-001`, `UC-120-002`, `UC-120-003`, `UC-120-004`), trạng thái Draft.
  - 2 Unconfirmed Candidates (`UC-120-CAND-01` Voice Input, `UC-120-CAND-02` Server-Side Persistent History Sync) kèm lý do phân loại minh bạch.
  - Ma trận truy vết hai chiều (Traceability Matrix) bao phủ 100% (38/38 FRs).
- Viết chi tiết 4 file đặc tả Use-Case Specification tuân thủ chính xác template 11 mục chuẩn của hệ thống:
  1. `UC-120-001-converse-with-ai-music-host.md`: Hội thoại với AI Music Host qua terminal nổi, Basic Flow 9 bước, AF-01 chọn chip gợi ý, AF-02 duyệt lịch sử lệnh bằng phím mũi tên, AF-03 hủy luồng bằng phím `Esc`, AF-04 xem phím tắt bằng `/help`, EF-01 dịch vụ AI tạm ngưng, EF-02 chặn khách vãng lai.
  2. `UC-120-002-interpret-music-intent-via-chat.md`: Diễn giải ý định âm nhạc tự nhiên (phát nhạc theo tâm trạng, tìm kiếm bài hát, khám phá playlist, truy vấn nhạc đang phát, từ chối yêu cầu ngoài phạm vi âm nhạc), Basic Flow 8 bước, AF-01 dùng chip gợi ý nhanh, AF-02 tinh chỉnh ý định đa lượt (multi-turn context refinement), AF-03 đổi ý định khi phủ định, AF-04 fallback giải thích hội thoại, EF-01 ý định mơ hồ, EF-02 ngôn ngữ không hỗ trợ, EF-03 lỗi trích xuất tham số.
  3. `UC-120-003-execute-music-actions-via-conversational-agent.md`: Thực thi hành động nghe nhạc qua công cụ client-side (`search_tracks`, `play_track_now`, `enqueue_tracks`, `clear_queue`, `get_playback_state`, `set_volume`, `get_queue_items`), Basic Flow 10 bước, AF-01 thao tác và điều khiển hàng đợi phát, AF-02 quy trình xác nhận hành động nguy hiểm `? confirm [y/N]` khi gọi `clear_queue` (phím bấm hoặc nút bấm giao diện), AF-03 chuỗi thực thi nhiều công cụ liên tiếp, AF-04 tra cứu trạng thái bài hát đang phát, EF-01 công cụ thực thi thất bại (`dot error`), EF-02 mục tiêu phát nhạc không khả dụng, EF-03 hủy luồng thực thi khi đang chạy, EF-04 AI host mất kết nối.
  4. `UC-120-004-clear-conversation-history.md`: Xóa lịch sử hội thoại trên màn hình terminal qua lệnh `/clear`, Basic Flow 8 bước (chặn cục bộ, thêm `/clear` vào 30 lệnh gần nhất, xóa `entries`, dựng lại welcome banner `kind: banner`, giữ nguyên nhạc đang phát và không gửi request mạng), AF-01 gọi lại lệnh `/clear` từ phím mũi tên lên, AF-02 xử lý khi gõ lệnh trong lúc agent đang chạy (dừng trước rồi clear), EF-01 hết hạn phiên người dùng.
- Thiết lập thư mục quản lý Prototype `docs/requirements/use-cases/120-ai-conversational-agent/prototypes/`:
  - Tạo `prototypes/README.md` quy định mục đích, quy ước đặt tên file, hướng dẫn liên kết ảnh, phân biệt wireframe cũ với actual CLI terminal implementation, và bảng catalog ánh xạ 16 ảnh screenshot cho 4 Use Cases và các Flows.
  - Sao chép và chuẩn hóa tên 16 ảnh screenshot thực tế từ Spec Kit UI sang thư mục prototypes theo định dạng `UC-120-[SEQ]-[flow].png`.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                                                 | Quyết định                          | Lý do                                                                                                                             |
| ---------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Danh mục 4 Use Cases chính thức                      | Dùng                                | Phản ánh chính xác mục tiêu người dùng và bao phủ trọn vẹn 38 FRs qua 3 subfeatures (121, 122, 123).                              |
| Ngôn ngữ tài liệu trong Group 120                    | Dùng 100% tiếng Anh                 | Tuân thủ nghiêm ngặt chỉ thị của đề bài và quy định nộp bài của môn học (PA3 submission guidelines).                              |
| Giao diện người dùng CLI Terminal (`AIHostChat.jsx`) | Dùng làm căn cứ chính cho UI        | Phản ánh chính xác mã nguồn frontend thực tế của nhóm thay vì wireframe drawer cũ.                                                |
| Sơ đồ Mermaid tại README                             | Dùng                                | Sử dụng cú pháp `graph TD` có system boundary, phân định actor/usecase/external system, quan hệ include/extend rõ ràng.           |
| Tái sử dụng UI assets từ Spec Kit UI                 | Dùng (16 ảnh)                       | Tận dụng ảnh chụp màn hình UI thực tế từ `specs/120-ai-conversational-agent/*/ui/`, đổi tên theo chuẩn `UC-120-[SEQ]-[flow].png`. |
| Tính năng nhập giọng nói (Voice Input) & Cloud DB    | Bỏ / Ghi vào Unconfirmed Candidates | Không có trong mã nguồn frontend/backend cũng như không có trong Spec Kit hiện tại; phiên hội thoại quản lý in-memory client.     |
| Chỉnh sửa file ngoài phạm vi (code, spec, model)     | Bỏ tuyệt đối                        | Tuân thủ nghiêm ngặt quy tắc cách ly và chỉ thị không sửa file ngoài Group 120.                                                   |

### Cách kiểm chứng

- **Kiểm tra tính toàn vẹn tài liệu:** Chạy lệnh kiểm tra thư mục xác nhận đầy đủ 7 file markdown (`README.md`, `use-case-inventory.md`, 4 file `UC-120-*.md`, `prototypes/README.md`) và 16 file ảnh PNG.
- **Kiểm tra độ bao phủ yêu cầu (FR Coverage):** Đối chiếu chéo 38 mã FR (`121-FR-001..012`, `122-FR-001..012`, `123-FR-001..014`) đạt độ bao phủ 100% trong ma trận truy vết `use-case-inventory.md` và từng file đặc tả.
- **Kiểm tra cấu trúc đặc tả:** Xác nhận cả 4 file đặc tả đều tuân thủ đầy đủ 11 mục chuẩn của hệ thống và phản ánh chính xác từng bước tương tác theo mã nguồn `AIHostChat.jsx`.
- **Kiểm tra cú pháp Mermaid:** Sơ đồ Use Case Mermaid trong `README.md` được viết đúng cú pháp `graph TD`, không chứa ký tự đặc biệt gây lỗi parser.
- **Kiểm tra liên kết tương đối (Relative Links):** Kiểm tra toàn bộ đường dẫn ảnh và liên kết chéo giữa README, Inventory, UC specs và Prototypes đều mở chính xác.
- **Kiểm tra phạm vi Git (`git status`):** Xác nhận chỉ có các file bên trong `docs/requirements/use-cases/120-ai-conversational-agent/` và `docs/ai-log/AI_log_1.md` được tạo/cập nhật; không có bất kỳ file ngoài phạm vi nào bị thay đổi.

**Kết quả kiểm chứng:** Hoàn thành xuất sắc 100% các tiêu chí PA3 cho Group 120 – AI Conversational Agent.

**Ghi chú:** Toàn bộ tài liệu Group 120 lưu tại `docs/requirements/use-cases/120-ai-conversational-agent/`.

---

## Mục 18: Lập Implementation Plan cho Feature 101 – Listening History Analysis bằng `/speckit.plan`

| Trường                   | Nội dung                                                                                                                                                                                                                                                       |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-11-03                                                                                                                                                                                                                                                     |
| Người thực hiện          | Nhựt                                                                                                                                                                                                                                                           |
| Nhóm tính năng liên quan | 10 – AI Recommendations, Feature 101: Listening History Analysis (`specs/100-ai-recommendations/101-listening-history-analysis/`)                                                                                                                              |
| Công cụ AI               | Antigravity CLI (Gemini 3.8 Flash), Spec Kit `/speckit.plan`                                                                                                                                                                                                   |
| Mục đích                 | Thực thi workflow lập kế hoạch kỹ thuật (Implementation Plan) theo chuẩn Spec Kit: khởi tạo plan template, nghiên cứu kiến trúc, thiết kế data model, OpenAPI contract, hướng dẫn kiểm thử và hoàn thiện plan.md chuẩn bị cho khâu chia task `/speckit.tasks`. |

### Prompt đã dùng

```text
/speckit-plan # TASK: Execute `/speckit.plan` for Feature 101 Only

Bạn đang làm việc trong repository AuraTune.

Hãy sử dụng **Spec Kit `/speckit.plan`** để tạo Implementation Plan cho feature `101` thuộc Group 100 – AI Recommendations.

**Chỉ lập Plan cho feature 101. Không xử lý feature khác.**

## 1. Xác định Feature 101

Kiểm tra:

- `specs/100-ai-recommendations/`
- Các thư mục và file con bên trong.
- `spec.md` của feature 101.
- Metadata và configuration liên quan.

Xác định chính xác tên feature và đường dẫn Spec Kit.

Nếu không tìm thấy feature 101 hoặc không xác định được context, hãy dừng lại và báo cáo. Không tự tạo feature thay thế.

## 2. Đọc tài liệu nguồn

Đọc các tài liệu cần thiết:

- `docs/management/speckit-workflow-guide.md`
- `docs/management/team-contract.md`
- `docs/proposal/Auratune_Vision_Document.md`
- `docs/proposal/project_plan.md`
- `docs/proposal/proposal.md`
- Toàn bộ tài liệu thuộc feature 101.
- Các tài liệu kiến trúc và source code liên quan trực tiếp đến feature 101.

Kiểm tra `.specify/` và `.agents/` để hiểu instructions, templates và workflow của Spec Kit.

## 3. Thực thi `/speckit.plan`

Sau khi xác định đúng feature context:

1. Chọn feature 101 làm context hiện hành.
2. Thực thi `/speckit.plan`.
3. Sử dụng nội dung `spec.md` và thông tin kiến trúc thực tế của AuraTune làm đầu vào.
4. Tuân thủ instructions, template và conventions của repository.
5. Tạo hoặc cập nhật `plan.md` đúng vị trí mà Spec Kit quy định.

Không tự viết Plan thủ công thay cho Spec Kit command.

Nếu môi trường không hỗ trợ slash command trực tiếp, hãy tìm cách thực thi tương đương theo instructions chính thức trong repository. Báo cáo trung thực nếu không thể thực thi.

## 4. Yêu cầu đối với Plan

Plan cần:

- Bám sát requirements của feature 101 trong `spec.md`.
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
- Thêm chức năng ngoài phạm vi feature 101.
- Tạo API hoặc database schema không có căn cứ.
- Tự đặt AI algorithm hoặc scoring formula.
- Thay đổi công nghệ đã được dự án lựa chọn.
- Đưa chức năng của Group 120 vào Group 100.

Phân biệt rõ những gì đã tồn tại, những gì sẽ triển khai và những gì còn cần xác nhận.

## 5. Scope giới hạn

Chỉ được tạo hoặc cập nhật Plan của feature 101 theo Spec Kit workflow.

Không được:

- Lập Plan cho feature 102 trở đi.
- Lập Plan cho toàn bộ Group 100.
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

- Kiểm tra Plan thuộc đúng feature 101.
- Kiểm tra tính nhất quán với `spec.md`.
- Kiểm tra technical decisions có căn cứ.
- Kiểm tra dependencies và testing strategy.
- Kiểm tra Plan có thể tiếp tục sử dụng cho `/speckit.tasks`.
- Chạy validation scripts theo Spec Kit workflow nếu có.
- Kiểm tra Git diff để bảo đảm không sửa file ngoài phạm vi.

Nếu phát hiện vấn đề trong `spec.md`, chỉ ghi nhận, không tự ý sửa.

## 7. Final Report

Báo cáo bằng Vietnamese:

1. Tên và đường dẫn feature 101 đã xác định.
2. `/speckit.plan` có thực sự được thực thi hay không.
3. File Plan đã tạo hoặc cập nhật.
4. Nội dung chính của Plan.
5. Các technical decisions đáng chú ý.
6. Validation results.
7. Những vấn đề cần clarification.
8. Danh sách file đã thay đổi.

Completion criteria: Chỉ tạo Implementation Plan cho feature 101 bằng Spec Kit `/speckit.plan`. Sau khi hoàn thành, dừng lại và chờ review, không tự động chuyển sang feature tiếp theo.
```

### Tóm tắt phản hồi của AI

- **Xác định chính xác Feature 101**: Nhận diện đúng `101-listening-history-analysis` tại `specs/100-ai-recommendations/101-listening-history-analysis/` cùng tài liệu đặc tả nguồn `spec.md` (FR-001..FR-014, 3 User Stories, 5 UI screenshots).
- **Phân tích tài liệu kiến trúc & ranh giới hệ thống**:
  - Đọc và đối chiếu kỹ lưỡng: `docs/management/speckit-workflow-guide.md`, `team-contract.md`, `proposal.md`, `Auratune_Vision_Document.md`, `project_plan.md`, `api-contract.md`, `api-conventions.md`, `database/README.md`, `src/frontend/STRUCTURE.md` và mã nguồn UI thực tế `HistoryPage.jsx`.
  - Phân định rõ ràng: Feature 101 chỉ phụ trách **Tổng thời lượng nghe** và **Top thể loại theo thời lượng nghe tích lũy**. Tính năng **Top bài hát** và **Top nghệ sĩ** thuộc thẩm quyền sở hữu của Group 070 (Listening History); các tính năng gợi ý bài hát thuộc Feature 102/103. Feature 101 là tính toán thống kê xác định, hoàn toàn không gọi Python AI Service bên ngoài.
- **Thực thi workflow Spec Kit `/speckit.plan`**:
  - Kích hoạt context Feature 101 qua `.specify/scripts/bash/setup-plan.sh --json` và cập nhật `.specify/feature.json`.
  - **Phase 0 (Outline & Research)**: Xây dựng `research.md` giải quyết triệt để 5 vấn đề kiến trúc:
    1. Phương thức tính toán: Chọn dynamic SQL aggregation on-demand thay vì bảng pre-computed `user_listening_stats` để đảm bảo độ tươi mới dữ liệu theo FR-003 & FR-013.
    2. Lọc dữ liệu & xử lý ngoại lệ: Lọc triệt để `user_id IS NULL`, `song_id IS NULL` và `listened_duration <= 0`. Loại trừ bài hát thiếu trường `genre` khỏi xếp hạng top thể loại theo FR-012.
    3. Định nghĩa endpoint: `GET /api/v1/users/me/stats/listening-analysis` với query param `range` (`7`, `30`, `all`), yêu cầu JWT Bearer Token, tuân thủ envelope JSON và mã lỗi chuẩn.
    4. Tích hợp Frontend: Thiết kế Service Layer (`statsService.js`) với Mock Adapter fallback hỗ trợ demo độc lập.
    5. Chiến lược kiểm thử: Unit tests, Contract tests và Security tests (cô lập dữ liệu người dùng theo Nghị định 13/2023/NĐ-CP).
  - **Phase 1 (Design & Contracts)**:
    - Xây dựng `data-model.md`: Định nghĩa thực thể nguồn `listening_history`, `songs`, DTO tổng hợp `ListeningAnalysisResult`, `GenreRankingItem`, sơ đồ quan hệ ER Mermaid và sơ đồ máy trạng thái (state machine).
    - Xây dựng thư mục `contracts/` chứa OpenAPI 3.0 specification `listening-analysis-api.json` và tài liệu diễn giải `contracts/README.md`.
    - Xây dựng `quickstart.md`: Hướng dẫn kiểm thử end-to-end qua 4 kịch bản (Happy path, Insufficient data empty state, Account isolation / 401 Unauthorized, Dynamic refresh khi phát nhạc mới).
  - **Hoàn thiện Implementation Plan (`plan.md`)**:
    - Điền đầy đủ Technical Context (React 18 / Vite 5 / Tailwind CSS cho frontend; Node.js REST API cho backend; PostgreSQL cho database).
    - Lập bảng phân định minh bạch 3 trạng thái: Đã có sẵn / Sẽ triển khai / Cần xác nhận.
    - Constitution Check đạt PASS 100%.
    - Cung cấp sơ đồ kiến trúc Mermaid và luồng dữ liệu 6 bước chi tiết.
    - Mô tả quy tắc xếp hạng thể loại, tie-breaker, các mức độ rủi ro kỹ thuật và biện pháp giảm thiểu.
- **Validation & Báo cáo**:
  - Chạy script kiểm tra điều kiện tiên quyết `.specify/scripts/bash/check-prerequisites.sh --json` đạt PASS 100%, sẵn sàng cho phase `/speckit.tasks`.
  - Kiểm tra `git status` xác nhận không có bất kỳ file nào ngoài Feature 101 bị ảnh hưởng.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                                                      | Quyết định   | Lý do                                                                                                                                            |
| --------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Khởi tạo Plan qua `setup-plan.sh --json`                  | Dùng         | Tuân thủ quy trình chuẩn của Spec Kit trong repository, cập nhật đúng context Feature 101.                                                       |
| Tính toán Dynamic SQL trực tiếp từ `listening_history`    | Dùng         | Tuân thủ nghiêm ngặt FR-003 và phiên clarify ngày 2026-10-20; loại bỏ sự phụ thuộc vào bảng pre-computed `user_listening_stats` chưa hoàn thiện. |
| OpenAPI 3.0 Specification (`listening-analysis-api.json`) | Dùng         | Chuẩn hóa contract cho endpoint `GET /api/v1/users/me/stats/listening-analysis` theo envelope và mã lỗi chung của AuraTune.                      |
| Service Layer Adapter ở frontend (`statsService.js`)      | Dùng         | Tương thích với `HistoryPage.jsx` và kiến trúc Frontend Foundation (`specs/130-frontend/131-frontend-foundation/`), hỗ trợ Mock mode.            |
| Loại trừ Top bài hát & Top nghệ sĩ                        | Dùng         | Giữ vững ranh giới phân quyền cho Group 070 (Listening History) per FR-004 và FR-011.                                                            |
| External AI Service / Python AI Model                     | Bỏ hoàn toàn | Feature 101 là tính toán thống kê xác định, tuyệt đối không gọi AI service bên ngoài theo FR-009.                                                |
| Chỉnh sửa mã nguồn hoặc file ngoài Feature 101            | Bỏ tuyệt đối | Tuân thủ nghiêm ngặt giới hạn phạm vi, bảo toàn working tree và không commit/push.                                                               |

### Cách kiểm chứng

- **Kiểm tra tính toàn vẹn tài liệu:** Xác nhận đầy đủ 6 artifact được tạo mới/cập nhật bên trong `specs/100-ai-recommendations/101-listening-history-analysis/` (`plan.md`, `research.md`, `data-model.md`, `contracts/README.md`, `contracts/listening-analysis-api.json`, `quickstart.md`).
- **Chạy script kiểm tra Spec Kit:** Chạy `.specify/scripts/bash/check-prerequisites.sh --json` xác nhận kết quả trả về `AVAILABLE_DOCS: ["research.md", "data-model.md", "contracts/", "quickstart.md"]`, sẵn sàng 100% cho bước `/speckit.tasks`.
- **Kiểm tra độ bao phủ yêu cầu:** Đối chiếu chéo 14 mã FR (`101-FR-001..014`) và 3 User Stories trong `spec.md`, đảm bảo tất cả đều được giải quyết trong kiến trúc, data model và API contract.
- **Kiểm tra cú pháp Contract và Mermaid:** File `listening-analysis-api.json` tuân thủ chuẩn OpenAPI 3.0.3; các sơ đồ Mermaid trong `data-model.md` và `plan.md` viết đúng cú pháp không gây lỗi render.
- **Kiểm tra phạm vi Git (`git status`):** Xác nhận các file thay đổi/tạo mới chỉ thuộc Feature 101.

---

## Mục 19: Lập Implementation Plan cho Feature 102 – Personalized Recommendations bằng `/speckit.plan`

| Trường                   | Nội dung                                                                                                                                                                                                                                                                                                             |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-11-03                                                                                                                                                                                                                                                                                                           |
| Người thực hiện          | Nhựt                                                                                                                                                                                                                                                                                                                 |
| Nhóm tính năng liên quan | 10 – AI Recommendations, Feature 102: Personalized Recommendations (`specs/100-ai-recommendations/102-personalized-recommendations/`)                                                                                                                                                                                |
| Công cụ AI               | Antigravity CLI (Gemini 3.8 Flash), Spec Kit `/speckit.plan`                                                                                                                                                                                                                                                         |
| Mục đích                 | Thực thi workflow lập kế hoạch kỹ thuật (Implementation Plan) theo chuẩn Spec Kit: khởi tạo plan template, nghiên cứu kiến trúc đa thực thể, cơ chế cold-start & graceful degradation, thiết kế data model, OpenAPI contract, hướng dẫn kiểm thử và hoàn thiện plan.md chuẩn bị cho khâu chia task `/speckit.tasks`. |

### Prompt đã dùng

```text
/speckit-plan # TASK: Execute `/speckit.plan` for Feature 102 Only

Bạn đang làm việc trong repository AuraTune.

Hãy sử dụng **Spec Kit `/speckit.plan`** để tạo Implementation Plan cho feature `102` thuộc Group 100 – AI Recommendations.

**Chỉ lập Plan cho feature 102. Không xử lý feature khác.**

## 1. Xác định Feature 102

Kiểm tra:

- `specs/100-ai-recommendations/`
- Các thư mục và file con bên trong.
- `spec.md` của feature 102.
- Metadata và configuration liên quan.

Xác định chính xác tên feature và đường dẫn Spec Kit.

Nếu không tìm thấy feature 102 hoặc không xác định được context, hãy dừng lại và báo cáo. Không tự tạo feature thay thế.

## 2. Đọc tài liệu nguồn

Đọc các tài liệu cần thiết:

- `docs/management/speckit-workflow-guide.md`
- `docs/management/team-contract.md`
- `docs/proposal/Auratune_Vision_Document.md`
- `docs/proposal/project_plan.md`
- `docs/proposal/proposal.md`
- Toàn bộ tài liệu thuộc feature 102.
- Các tài liệu kiến trúc và source code liên quan trực tiếp đến feature 102.
- Plan của feature 101 nếu cần tham khảo cách tổ chức và bảo đảm tính nhất quán.

Kiểm tra `.specify/` và `.agents/` để hiểu instructions, templates và workflow của Spec Kit.

## 3. Thực thi `/speckit.plan`

Sau khi xác định đúng feature context:

1. Chọn feature 102 làm context hiện hành.
2. Thực thi `/speckit.plan`.
3. Sử dụng nội dung `spec.md` và thông tin kiến trúc thực tế của AuraTune làm đầu vào.
4. Tuân thủ instructions, template và conventions của repository.
5. Tạo hoặc cập nhật Plan đúng vị trí mà Spec Kit quy định cho feature 102.

Không tự viết Plan thủ công thay cho Spec Kit command.

Nếu môi trường không hỗ trợ slash command trực tiếp, hãy tìm cách thực thi tương đương theo instructions chính thức trong repository. Báo cáo trung thực nếu không thể thực thi.

## 4. Yêu cầu đối với Plan

Plan cần:

- Bám sát requirements của feature 102 trong `spec.md`.
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
- Thêm chức năng ngoài phạm vi feature 102.
- Tạo API hoặc database schema không có căn cứ.
- Tự đặt AI algorithm hoặc scoring formula.
- Thay đổi công nghệ đã được dự án lựa chọn.
- Đưa chức năng của Group 120 vào Group 100.

Phân biệt rõ những gì đã tồn tại, những gì sẽ triển khai và những gì còn cần xác nhận.

## 5. Scope giới hạn

Chỉ được tạo hoặc cập nhật Plan của feature 102 theo Spec Kit workflow.

Không được:

- Lập Plan cho feature 101 hoặc feature 103 trở đi.
- Lập Plan cho toàn bộ Group 100.
- Chỉnh sửa group khác.
- Chỉnh sửa `spec.md`.
- Chỉnh sửa `tasks.md`.
- Implement source code.
- Thay đổi frontend, backend, AI service hoặc database.
- Chỉnh sửa tài liệu project-level.
- Commit hoặc push.

Trước khi làm việc, kiểm tra `git status` và bảo toàn tất cả thay đổi chưa commit, bao gồm Plan đã hoàn thành của feature 101.

## 6. Validation

Sau khi thực thi `/speckit.plan`:

- Kiểm tra Plan thuộc đúng feature 102.
- Kiểm tra tính nhất quán với `spec.md`.
- Kiểm tra technical decisions có căn cứ.
- Kiểm tra dependencies và testing strategy.
- Kiểm tra Plan có thể tiếp tục sử dụng cho `/speckit.tasks`.
- Chạy validation scripts theo Spec Kit workflow nếu có.
- Kiểm tra Git diff để bảo đảm không sửa file ngoài phạm vi.

Nếu phát hiện vấn đề trong `spec.md`, chỉ ghi nhận, không tự ý sửa.

## 7. Final Report

Báo cáo bằng Vietnamese:

1. Tên và đường dẫn feature 102 đã xác định.
2. `/speckit.plan` có thực sự được thực thi hay không.
3. File Plan đã tạo hoặc cập nhật.
4. Nội dung chính của Plan.
5. Các technical decisions đáng chú ý.
6. Validation results.
7. Những vấn đề cần clarification.
8. Danh sách file đã thay đổi.

Completion criteria: Chỉ tạo Implementation Plan cho feature 102 bằng Spec Kit `/speckit.plan`. Sau khi hoàn thành, dừng lại và chờ review, không tự động chuyển sang feature tiếp theo.
```

### Tóm tắt phản hồi của AI

- **Xác định chính xác Feature 102**: Nhận diện đúng `102-personalized-recommendations` tại `specs/100-ai-recommendations/102-personalized-recommendations/` cùng tài liệu đặc tả nguồn `spec.md` (FR-001..FR-015, 4 User Stories, 3 UI screenshots, các câu trả lời Clarification Session 2026-10-30) và Use Case `UC-100-002`.
- **Phân tích tài liệu kiến trúc & ranh giới hệ thống**:
  - Đối chiếu kỹ lưỡng: `docs/management/speckit-workflow-guide.md`, `team-contract.md`, `proposal.md`, `Auratune_Vision_Document.md`, `project_plan.md`, `api-contract.md`, `api-conventions.md`, `database/README.md`, `system-architecture.md`, và mã nguồn UI thực tế `HomePage.jsx`.
  - Phân định rõ ràng: Feature 102 phụ trách luồng gợi ý âm nhạc cá nhân hóa đa thực thể (Songs, Albums, Artists, Playlists) trên Home Dashboard. Việc phát nhạc ủy quyền cho Group 040 (Music Player); hiển thị container trang chủ phối hợp với Group 020 (Home Dashboard); ghi nhận lịch sử nghe thuộc Group 070 (Listening History); không bao gồm thống kê nghe nhạc (Feature 101) hay lọc theo tâm trạng/ngữ cảnh (Feature 103) hay AI Chat Host (Group 120).
- **Thực thi workflow Spec Kit `/speckit.plan`**:
  - Kích hoạt context Feature 102 qua `.specify/scripts/bash/setup-plan.sh --json` và cập nhật `.specify/feature.json`.
  - **Phase 0 (Outline & Research)**: Xây dựng `research.md` giải quyết triệt để 6 vấn đề kỹ thuật trọng yếu:
    1. Cấu trúc gợi ý đa thực thể: Sử dụng schema thẻ đa hình `RecommendedItem` với discriminator `type` (`"song" | "album" | "artist" | "playlist"`), kết hợp cơ chế catalog hydration từ PostgreSQL để đảm bảo không trả về thực thể đã bị ẩn/xóa.
    2. Chính sách Cold-Start: Thu thập tín hiệu từ `listening_history` ($\ge 30$s), `user_liked_songs`, và `user_follows_artist`. Nếu dữ liệu $< 3$ lượt nghe hoặc vừa bị xóa lịch sử (`UC-070-004`), lập tức chuyển sang fallback nội dung phổ biến/thịnh hành với badge `"Phổ biến"`, không để xảy ra màn hình trắng (FR-005, SC-002).
    3. Giao tiếp AI Service & Chịu lỗi (Graceful Degradation): Backend gọi `POST /ai/recommend` tới Python AI Service với timeout nghiêm ngặt **2.5 giây**. Nếu timeout hoặc lỗi 5xx, backend bắt lỗi và trả về HTTP `200 OK` kèm nội dung thịnh hành dự phòng và banner thông báo nhẹ nhàng, tuyệt đối không làm crash Home Dashboard (FR-006, EF-01, SC-003).
    4. Thiết kế Endpoint: Cung cấp `GET /api/v1/recommendations/personalized` (hỗ trợ query `type`, `limit`) và alias tương thích ngược `GET /api/v1/recommendations/songs`.
    5. Bảo vệ quyền riêng tư & Nghị định 13/2023/NĐ-CP: Bóc tách `user_id` nghiêm ngặt từ JWT Bearer Token (`req.user.id`), từ chối mọi `user_id` từ query/body, không truyền thông tin PII (email, tên) sang AI Service (FR-003, FR-004, SC-001).
    6. Tích hợp Frontend: Thiết kế `recommendationService.js` và `mockRecommendationService.js`, xử lý điều hướng 1-click (click song -> phát nhạc; click album/artist/playlist -> chuyển trang chi tiết).
  - **Phase 1 (Design & Contracts)**:
    - Xây dựng `data-model.md`: Định nghĩa thực thể tín hiệu nguồn (`listening_history`, `user_liked_songs`, `user_follows_artist`), thực thể catalog (`songs`, `albums`, `artists`, `playlists`), DTO tổng hợp `RecommendationFeedResult`, thẻ đa hình `RecommendedItem`, sơ đồ máy trạng thái (state machine) luồng xử lý feed và các quy tắc toàn vẹn dữ liệu.
    - Xây dựng thư mục `contracts/` chứa OpenAPI 3.0 specification `personalized-recommendations-api.json` và tài liệu hướng dẫn tích hợp, hợp đồng microservice nội bộ Backend–AI `contracts/README.md`.
    - Xây dựng `quickstart.md`: Hướng dẫn kiểm thử qua 5 kịch bản (Kịch bản chuẩn cá nhân hóa, Cold-start cho tài khoản mới, Gián đoạn AI Service và suy giảm mềm, Cô lập quyền riêng tư / 401 Unauthorized, Chuyển sang Cold-start sau khi xóa lịch sử nghe).
  - **Hoàn thiện Implementation Plan (`plan.md`)**:
    - Điền đầy đủ Technical Context (React 18 / Vite 5 / Tailwind CSS cho frontend; Node.js REST API cho backend; PostgreSQL cho database; FastAPI cho internal AI service).
    - Lập bảng phân định minh bạch 3 trạng thái: Đã có sẵn / Sẽ triển khai / Cần xác nhận.
    - Constitution Check đạt PASS 100%.
    - Cung cấp sơ đồ Mermaid Sequence Diagram cho luồng gọi API đa tầng và Flowchart cho điều hướng tương tác card.
    - Bổ sung Complexity Tracking, Verification & Test Strategy.
- **Validation & Báo cáo**:
  - Chạy script kiểm tra điều kiện tiên quyết `.specify/scripts/bash/check-prerequisites.sh --json` đạt PASS 100%, sẵn sàng cho phase `/speckit.tasks`.
  - Kiểm tra `git status` xác nhận không có bất kỳ file nào ngoài Feature 102 bị ảnh hưởng.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                                                                | Quyết định   | Lý do                                                                                                                                                  |
| ------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Khởi tạo Plan qua `setup-plan.sh --json`                            | Dùng         | Tuân thủ quy trình chuẩn của Spec Kit trong repository, kích hoạt đúng context Feature 102.                                                            |
| Cấu trúc gợi ý đa thực thể (`RecommendedItem`)                      | Dùng         | Tuân thủ Clarification 1B (2026-10-30) và FR-002, hỗ trợ đồng thời Song, Album, Artist, Playlist trong cùng 1 request tối ưu trải nghiệm Home.         |
| Fallback Cold-start tức thì từ Catalog Database                     | Dùng         | Tuân thủ Clarification 2A, FR-005 và UC-100-002 AF-01; bảo đảm người dùng mới luôn có nhạc nghe, ngăn chặn lỗi crash hoặc màn hình trống (SC-002).     |
| Chịu lỗi Graceful Degradation (Timeout 2.5s -> HTTP 200 Fallback)   | Dùng         | Tuân thủ Clarification 3A, FR-006 và EF-01; bảo đảm tính sẵn sàng cao của Home Dashboard, không để lỗi hạ tầng AI chặn luồng duyệt web của người dùng. |
| OpenAPI 3.0 Specification (`personalized-recommendations-api.json`) | Dùng         | Chuẩn hóa contract cho endpoint `GET /api/v1/recommendations/personalized` và alias `GET /api/v1/recommendations/songs` theo chuẩn chung AuraTune.     |
| Tách biệt trách nhiệm với Feature 101, 103 và Group 120             | Dùng         | Loại bỏ hoàn toàn thống kê lịch sử nghe (F101), lọc theo tâm trạng (F103) và AI host chat (G120) khỏi phạm vi F102 theo FR-010..013.                   |
| Lưu trữ metadata hiển thị trực tiếp trong Vector Store              | Bỏ hoàn toàn | Tránh lỗi dữ liệu cũ (stale cache), đảm bảo các bài hát/album đã bị xóa khỏi catalog không xuất hiện trên feed gợi ý (FR-008, SC-005).                 |
| Trả mã lỗi HTTP 503 về Client khi AI Service gặp sự cố              | Bỏ hoàn toàn | Tránh hiển thị thông báo lỗi gián đoạn trải nghiệm trên Home Dashboard, vi phạm tiêu chí suy giảm mềm của FR-006.                                      |
| Chỉnh sửa mã nguồn hoặc file ngoài Feature 102                      | Bỏ tuyệt đối | Tuân thủ nghiêm ngặt giới hạn phạm vi nhiệm vụ, bảo toàn working tree và không commit/push.                                                            |

### Cách kiểm chứng

- **Kiểm tra tính toàn vẹn tài liệu:** Xác nhận đầy đủ 6 artifact được tạo mới bên trong `specs/100-ai-recommendations/102-personalized-recommendations/` (`plan.md`, `research.md`, `data-model.md`, `contracts/README.md`, `contracts/personalized-recommendations-api.json`, `quickstart.md`).
- **Chạy script kiểm tra Spec Kit:** Chạy `.specify/scripts/bash/check-prerequisites.sh --json` xác nhận kết quả trả về `AVAILABLE_DOCS: ["research.md", "data-model.md", "contracts/", "quickstart.md"]`, sẵn sàng 100% cho bước `/speckit.tasks`.
- **Kiểm tra độ bao phủ yêu cầu:** Đối chiếu chéo 15 mã FR (`102-FR-001..015`), 4 User Stories và 5 Success Criteria trong `spec.md`, đảm bảo tất cả đều được giải quyết trong kiến trúc, data model, API contract và kịch bản test.
- **Kiểm tra cú pháp Contract và Mermaid:** File `personalized-recommendations-api.json` tuân thủ chuẩn OpenAPI 3.0.3; các sơ đồ Mermaid Sequence/Flowchart trong `data-model.md` và `plan.md` viết đúng cú pháp không gây lỗi render.
- **Kiểm tra phạm vi Git (`git status`):** Xác nhận các file thay đổi/tạo mới chỉ thuộc Feature 102.

---

## Mục 20: Lập Implementation Plan cho Feature 103 – Mood and Context Recommendations bằng `/speckit.plan`

| Trường                   | Nội dung                                                                                                                                                                                                                                                                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-11-03                                                                                                                                                                                                                                                                                                                          |
| Người thực hiện          | Nhựt                                                                                                                                                                                                                                                                                                                                |
| Nhóm tính năng liên quan | 10 – AI Recommendations, Feature 103: Mood and Context Recommendations (`specs/100-ai-recommendations/103-mood-and-context-recommendations/`)                                                                                                                                                                                       |
| Công cụ AI               | Antigravity CLI (Gemini 3.8 Flash), Spec Kit `/speckit.plan`                                                                                                                                                                                                                                                                        |
| Mục đích                 | Thực thi workflow lập kế hoạch kỹ thuật (Implementation Plan) theo chuẩn Spec Kit: khởi tạo plan template, nghiên cứu taxonomy nhãn cố định, giới hạn thực thể (Songs & Mood Playlists), cơ chế gợi ý thay thế khi rỗng (AF-02) và suy giảm mềm khi AI sự cố (EF-01), thiết kế data model, OpenAPI contract, và hoàn thiện plan.md. |

### Prompt đã dùng

```text
/speckit-plan # TASK: Execute `/speckit.plan` for Feature 103 Only

Bạn đang làm việc trong repository AuraTune.

Hãy sử dụng **Spec Kit `/speckit.plan`** để tạo Implementation Plan cho feature `103` thuộc Group 100 – AI Recommendations.

**Chỉ lập Plan cho feature 103. Không xử lý feature khác.**

## 1. Xác định Feature 103

Kiểm tra:

- `specs/100-ai-recommendations/`
- Các thư mục và file con bên trong.
- `spec.md` của feature 103.
- Metadata và configuration liên quan.

Xác định chính xác tên feature và đường dẫn Spec Kit.

Nếu không tìm thấy feature 103 hoặc không xác định được context, hãy dừng lại và báo cáo. Không tự tạo feature thay thế.

## 2. Đọc tài liệu nguồn

Đọc các tài liệu cần thiết:

- `docs/management/speckit-workflow-guide.md`
- `docs/management/team-contract.md`
- `docs/proposal/Auratune_Vision_Document.md`
- `docs/proposal/project_plan.md`
- `docs/proposal/proposal.md`
- Toàn bộ tài liệu thuộc feature 103.
- Các tài liệu kiến trúc và source code liên quan trực tiếp đến feature 103.
- Plan của feature 101 và 102 nếu cần tham khảo cách tổ chức và bảo đảm tính nhất quán.

Kiểm tra `.specify/` và `.agents/` để hiểu instructions, templates và workflow của Spec Kit.

## 3. Thực thi `/speckit.plan`

Sau khi xác định đúng feature context:

1. Chọn feature 103 làm context hiện hành.
2. Thực thi `/speckit.plan`.
3. Sử dụng nội dung `spec.md` và thông tin kiến trúc thực tế của AuraTune làm đầu vào.
4. Tuân thủ instructions, template và conventions của repository.
5. Tạo hoặc cập nhật Plan đúng vị trí mà Spec Kit quy định cho feature 103.

Không tự viết Plan thủ công thay cho Spec Kit command.

Nếu môi trường không hỗ trợ slash command trực tiếp, hãy tìm cách thực thi tương đương theo instructions chính thức trong repository. Báo cáo trung thực nếu không thể thực thi.

## 4. Yêu cầu đối với Plan

Plan cần:

- Bám sát requirements của feature 103 trong `spec.md`.
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
- Thêm chức năng ngoài phạm vi feature 103.
- Tạo API hoặc database schema không có căn cứ.
- Tự đặt AI algorithm hoặc scoring formula.
- Thay đổi công nghệ đã được dự án lựa chọn.
- Đưa chức năng của Group 120 vào Group 100.

Phân biệt rõ những gì đã tồn tại, những gì sẽ triển khai và những gì còn cần xác nhận.

## 5. Scope giới hạn

Chỉ được tạo hoặc cập nhật Plan của feature 103 theo Spec Kit workflow.

Không được:

- Lập lại Plan cho feature 101 hoặc 102.
- Lập Plan cho feature 104 trở đi.
- Lập Plan cho toàn bộ Group 100.
- Chỉnh sửa group khác.
- Chỉnh sửa `spec.md`.
- Chỉnh sửa `tasks.md`.
- Implement source code.
- Thay đổi frontend, backend, AI service hoặc database.
- Chỉnh sửa tài liệu project-level.
- Commit hoặc push.

Trước khi làm việc, kiểm tra `git status` và bảo toàn tất cả thay đổi chưa commit, bao gồm Plan đã hoàn thành của feature 101 và 102.

## 6. Validation

Sau khi thực thi `/speckit.plan`:

- Kiểm tra Plan thuộc đúng feature 103.
- Kiểm tra tính nhất quán với `spec.md`.
- Kiểm tra technical decisions có căn cứ.
- Kiểm tra dependencies và testing strategy.
- Kiểm tra Plan có thể tiếp tục sử dụng cho `/speckit.tasks`.
- Chạy validation scripts theo Spec Kit workflow nếu có.
- Kiểm tra Git diff để bảo đảm không sửa file ngoài phạm vi.

Nếu phát hiện vấn đề trong `spec.md`, chỉ ghi nhận, không tự ý sửa.

## 7. Final Report

Báo cáo bằng Vietnamese:

1. Tên và đường dẫn feature 103 đã xác định.
2. `/speckit.plan` có thực sự được thực thi hay không.
3. File Plan đã tạo hoặc cập nhật.
4. Nội dung chính của Plan.
5. Các technical decisions đáng chú ý.
6. Validation results.
7. Những vấn đề cần clarification.
8. Danh sách file đã thay đổi.

Completion criteria: Chỉ tạo Implementation Plan cho feature 103 bằng Spec Kit `/speckit.plan`. Sau khi hoàn thành, dừng lại và chờ review, không tự động chuyển sang feature tiếp theo.
```

### Tóm tắt phản hồi của AI

- **Xác định chính xác Feature 103**: Nhận diện đúng `103-mood-and-context-recommendations` tại `specs/100-ai-recommendations/103-mood-and-context-recommendations/` cùng tài liệu đặc tả nguồn `spec.md` (FR-001..FR-015, 4 User Stories, 4 UI screenshots, các câu trả lời Clarification Session 2026-10-30) và Use Case `UC-100-003`.
- **Phân tích tài liệu kiến trúc & ranh giới hệ thống**:
  - Đối chiếu kỹ lưỡng: `docs/management/speckit-workflow-guide.md`, `team-contract.md`, `proposal.md`, `Auratune_Vision_Document.md`, `project_plan.md`, `api-contract.md`, `api-conventions.md`, `database/README.md`, `system-architecture.md`, `aiMockData.js` và Use Case `UC-100-003`.
  - Phân định rõ ràng: Feature 103 phụ trách luồng khám phá âm nhạc theo tâm trạng thời gian thực và ngữ cảnh hoạt động. Không bao gồm thống kê nghe nhạc (F101), gợi ý cá nhân hóa theo gu nghe lịch sử (F102), tìm kiếm ngữ nghĩa văn bản tự do (Group 030), quản lý playlist (Group 060) hay trợ lý hội thoại AI Host (Group 120).
- **Thực thi workflow Spec Kit `/speckit.plan`**:
  - Kích hoạt context Feature 103 qua `.specify/scripts/bash/setup-plan.sh --json` và cập nhật `.specify/feature.json`.
  - **Phase 0 (Outline & Research)**: Xây dựng `research.md` giải quyết triệt để 6 vấn đề kỹ thuật trọng yếu:
    1. Taxonomy nhãn định sẵn (Curated Preset Taxonomy): Xác định bộ 8 nhãn chip cố định (4 Core Moods: `chill`, `energetic`, `melancholy`, `focus`; 4 Activity Contexts: `study_work`, `workout`, `late_night`, `travel_commute`) với cơ chế whitelist chặt chẽ và endpoint metadata `GET .../tags`.
    2. Giới hạn loại thực thể: Chỉ trả về **Songs** (để phát nhạc ngay) và **Mood Playlists** (để nghe xuyên suốt hoạt động). Loại trừ Album và Artist riêng lẻ để tránh xung đột cảm xúc (FR-003, Clarification 2026-10-30).
    3. Xử lý kết quả rỗng (AF-02): Khi tag không khớp bài hát nào trong catalog, trả về HTTP 200 với `items: []` và mảng `alternative_suggestions: ["chill", "focus"]` để UI render thẻ gợi ý thân thiện, không gượng ép trả nhạc ngẫu nhiên gây lệch cảm xúc.
    4. Xử lý sự cố AI Service & Chịu lỗi (EF-01): Enforce timeout 2.5s khi gọi `POST /ai/recommend/mood`. Khi AI offline/timeout, backend bắt lỗi, thử fallback playlist cục bộ từ PostgreSQL; nếu vẫn không có, trả về HTTP 200 kèm cờ `is_service_degraded: true` và `fallback_shortcuts`, không bao giờ trả lỗi 500/503 làm crash giao diện.
    5. Chống Race Condition khi chuyển đổi nhãn nhanh (AF-01): Dùng `AbortController` hủy các request HTTP cũ trên client, kiểm tra tag echo và áp dụng in-memory cache TTL 5 phút đảm bảo chuyển chip dưới 1.0 giây (thực tế $< 50$ms).
    6. Quyền riêng tư & Nghị định 13/2023/NĐ-CP: Bắt buộc Bearer JWT, giữ kín lựa chọn tâm trạng theo tài khoản người nghe (FR-005, FR-006, SC-001).
  - **Phase 1 (Design & Contracts)**:
    - Xây dựng `data-model.md`: Định nghĩa thực thể taxonomy `MoodTag`, DTO `MoodRecommendationResult`, thẻ `MoodRecommendedItem`, sơ đồ máy trạng thái (state machine) và các quy tắc toàn vẹn dữ liệu.
    - Xây dựng thư mục `contracts/` chứa OpenAPI 3.0 specification `mood-context-recommendations-api.json` và tài liệu hướng dẫn tích hợp, hợp đồng microservice nội bộ Backend–AI `contracts/README.md`.
    - Xây dựng `quickstart.md`: Hướng dẫn kiểm thử qua 5 kịch bản (Kịch bản chuẩn chọn tâm trạng, Xử lý khi không có bài hát phù hợp, Xử lý khi AI Service sự cố, Cô lập quyền riêng tư / 401 Unauthorized, Chuyển đổi nhãn liên tục và hủy request).
  - **Hoàn thiện Implementation Plan (`plan.md`)**:
    - Điền đầy đủ Technical Context (React 18 / Vite 5 / Tailwind CSS cho frontend; Node.js REST API cho backend; PostgreSQL cho database; FastAPI cho internal AI service).
    - Lập bảng phân định minh bạch 3 trạng thái: Đã có sẵn / Sẽ triển khai / Cần xác nhận.
    - Constitution Check đạt PASS 100%.
    - Cung cấp sơ đồ Mermaid Sequence Diagram cho luồng gọi API và Flowchart cho điều hướng tương tác card.
    - Bổ sung Complexity Tracking, Verification & Test Strategy.
- **Validation & Báo cáo**:
  - Chạy script kiểm tra điều kiện tiên quyết `.specify/scripts/bash/check-prerequisites.sh --json` đạt PASS 100%, sẵn sàng cho phase `/speckit.tasks`.
  - Kiểm tra `git status` xác nhận không có bất kỳ file nào ngoài Feature 103 bị ảnh hưởng.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                                                                | Quyết định   | Lý do                                                                                                                                                  |
| ------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Khởi tạo Plan qua `setup-plan.sh --json`                            | Dùng         | Tuân thủ quy trình chuẩn của Spec Kit trong repository, kích hoạt đúng context Feature 103.                                                            |
| Taxonomy 8 preset tags cố định với whitelist validation             | Dùng         | Tuân thủ Clarification 2026-10-30 và FR-002; ngăn chặn input tự do, loại trừ câu hỏi ngôn ngữ tự nhiên thuộc phạm vi Search (G030) và Host (G120).     |
| Giới hạn thực thể ở Songs và Mood Playlists                         | Dùng         | Tuân thủ Clarification 2026-10-30 và FR-003; Album và Nghệ sĩ không đảm bảo tính đồng nhất về mặt cảm xúc.                                             |
| Gợi ý nhãn thay thế (`alternative_suggestions`) khi rỗng            | Dùng         | Tuân thủ Clarification 2026-10-30, FR-004 và AF-02; giữ chân người nghe bằng gợi ý chủ động, không trả nhạc sai tâm trạng.                             |
| Chịu lỗi Graceful Degradation (Timeout 2.5s -> HTTP 200 Degraded)   | Dùng         | Tuân thủ FR-004, EF-01 và SC-003; giữ cho giao diện khám phá luôn hoạt động ổn định, cung cấp shortcut thoát luồng mượt mà.                            |
| OpenAPI 3.0 Specification (`mood-context-recommendations-api.json`) | Dùng         | Chuẩn hóa contract cho endpoint `GET /api/v1/recommendations/mood-context` và `GET /api/v1/recommendations/mood-context/tags`.                         |
| Input văn bản tự do / Natural language query                        | Bỏ hoàn toàn | Phạm vi thuộc về Semantic Search (`033-semantic-vector-search`) và AI Host (`121-conversational-interface`), không thuộc Feature 103 (FR-011, FR-013). |
| Trả mã lỗi HTTP 500/503 về Client khi AI Service gặp sự cố          | Bỏ hoàn toàn | Tránh làm gián đoạn trải nghiệm trên giao diện khám phá, vi phạm tiêu chí suy giảm mềm của FR-004.                                                     |
| Chỉnh sửa mã nguồn hoặc file ngoài Feature 103                      | Bỏ tuyệt đối | Tuân thủ nghiêm ngặt giới hạn phạm vi nhiệm vụ, bảo toàn working tree và không commit/push.                                                            |

### Cách kiểm chứng

- **Kiểm tra tính toàn vẹn tài liệu:** Xác nhận đầy đủ 6 artifact được tạo mới bên trong `specs/100-ai-recommendations/103-mood-and-context-recommendations/` (`plan.md`, `research.md`, `data-model.md`, `contracts/README.md`, `contracts/mood-context-recommendations-api.json`, `quickstart.md`).
- **Chạy script kiểm tra Spec Kit:** Chạy `.specify/scripts/bash/check-prerequisites.sh --json` xác nhận kết quả trả về `AVAILABLE_DOCS: ["research.md", "data-model.md", "contracts/", "quickstart.md"]`, sẵn sàng 100% cho bước `/speckit.tasks`.
- **Kiểm tra độ bao phủ yêu cầu:** Đối chiếu chéo 15 mã FR (`103-FR-001..015`), 4 User Stories và 5 Success Criteria trong `spec.md`, đảm bảo tất cả đều được giải quyết trong kiến trúc, data model, API contract và kịch bản test.
- **Kiểm tra cú pháp Contract và Mermaid:** File `mood-context-recommendations-api.json` tuân thủ chuẩn OpenAPI 3.0.3; các sơ đồ Mermaid Sequence/Flowchart trong `data-model.md` và `plan.md` viết đúng cú pháp không gây lỗi render.
- **Kiểm tra phạm vi Git (`git status`):** Xác nhận các file thay đổi/tạo mới chỉ thuộc Feature 103.

---

## Mục 21: Lập Implementation Plan cho Feature 121 – Conversational Interface bằng `/speckit.plan`

| Trường                   | Nội dung                                                                                                                                                                                                                                                                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ngày                     | 2026-11-03                                                                                                                                                                                                                                                                                                                                              |
| Người thực hiện          | Nhựt                                                                                                                                                                                                                                                                                                                                                    |
| Nhóm tính năng liên quan | 12 – AI Conversational Agent, Feature 121: Conversational Interface (`specs/120-ai-conversational-agent/121-conversational-interface/`)                                                                                                                                                                                                                 |
| Công cụ AI               | Antigravity CLI (Gemini 3.8 Flash), Spec Kit `/speckit.plan`                                                                                                                                                                                                                                                                                            |
| Mục đích                 | Thực thi workflow lập kế hoạch kỹ thuật (Implementation Plan) theo chuẩn Spec Kit: khởi tạo plan template, nghiên cứu kiến trúc terminal/CLI dialog, giao thức Server-Sent Events (SSE), vòng đời in-memory với `/clear` và lịch sử 30 lệnh, xuất Markdown an toàn, thiết kế data model, OpenAPI 3.0 contract, quickstart guide, và hoàn thiện plan.md. |

### Prompt đã dùng

```text
/speckit-plan # TASK: Execute `/speckit.plan` for Feature 121 Only

Bạn đang làm việc trong repository AuraTune.

Hãy sử dụng **Spec Kit `/speckit.plan`** để tạo Implementation Plan cho feature `121` thuộc Group 120 – AI Conversational Agent.

**Chỉ lập Plan cho feature 121. Không xử lý feature khác.**

## 1. Xác định Feature 121

Kiểm tra:

- `specs/120-ai-conversational-agent/`
- Các thư mục và file con bên trong.
- `spec.md` của feature 121.
- Metadata và configuration liên quan.

Xác định chính xác tên feature và đường dẫn Spec Kit.

Nếu không tìm thấy feature 121 hoặc không xác định được context, hãy dừng lại và báo cáo. Không tự tạo feature thay thế.

## 2. Đọc tài liệu nguồn

Đọc các tài liệu cần thiết:

- `docs/management/speckit-workflow-guide.md`
- `docs/management/team-contract.md`
- `docs/proposal/Auratune_Vision_Document.md`
- `docs/proposal/project_plan.md`
- `docs/proposal/proposal.md`
- Toàn bộ tài liệu thuộc feature 121.
- Các tài liệu kiến trúc và source code liên quan trực tiếp đến feature 121.
- Plan của các feature trước đó trong Group 120 nếu có, để tham khảo cách tổ chức và bảo đảm tính nhất quán.

Kiểm tra `.specify/` và `.agents/` để hiểu instructions, templates và workflow của Spec Kit.

## 3. Kiểm tra UI hiện tại của Group 120

Vì UI của AI Conversational Agent đã có thay đổi, hãy kiểm tra frontend implementation mới nhất liên quan đến feature 121.

Xem xét:

- Page và route liên quan.
- Components và component hierarchy.
- Layout, styling và responsive behavior.
- Các nút, input và user interactions.
- Loading, empty, error và success states nếu có.
- API/service calls liên quan.

Dùng UI hiện tại làm căn cứ cho phần frontend technical approach trong Plan. Không lấy UI cũ trong tài liệu làm chuẩn nếu implementation đã thay đổi.

Không tự biến UI change thành Functional Requirement mới. Nếu UI và `spec.md` không thống nhất, ghi nhận vấn đề để làm rõ, không tự sửa `spec.md`.

## 4. Thực thi `/speckit.plan`

Sau khi xác định đúng feature context:

1. Chọn feature 121 làm context hiện hành.
2. Thực thi `/speckit.plan`.
3. Sử dụng nội dung `spec.md`, kiến trúc AuraTune và UI implementation hiện tại làm đầu vào.
4. Tuân thủ instructions, template và conventions của repository.
5. Tạo hoặc cập nhật Plan đúng vị trí mà Spec Kit quy định cho feature 121.

Không tự viết Plan thủ công thay cho Spec Kit command.

Nếu môi trường không hỗ trợ slash command trực tiếp, hãy tìm cách thực thi tương đương theo instructions chính thức trong repository. Báo cáo trung thực nếu không thể thực thi.

## 5. Yêu cầu đối với Plan

Plan cần:

- Bám sát requirements của feature 121 trong `spec.md`.
- Phản ánh kiến trúc hiện tại của AuraTune.
- Phản ánh UI Group 120 mới nhất.
- Xác định technical approach.
- Xác định các component và service liên quan.
- Xác định dependencies.
- Mô tả data flow và integration nếu cần.
- Xác định testing strategy.
- Xác định risks và technical considerations.
- Có đủ thông tin để tiếp tục tạo tasks bằng `/speckit.tasks`.

Không tự ý:

- Thêm Functional Requirements.
- Thêm chức năng ngoài phạm vi feature 121.
- Tạo API hoặc database schema không có căn cứ.
- Tự đặt AI capability hoặc conversation behavior chưa được xác nhận.
- Thay đổi công nghệ đã được dự án lựa chọn.
- Đưa chức năng của Group 100 – AI Recommendations vào Group 120.

Phân biệt rõ những gì đã tồn tại, những gì sẽ triển khai và những gì còn cần xác nhận.

## 6. Scope giới hạn

Chỉ được tạo hoặc cập nhật Plan của feature 121 theo Spec Kit workflow.

Không được:

- Lập Plan cho feature 122 trở đi.
- Lập Plan cho toàn bộ Group 120.
- Lập lại Plan của feature khác.
- Chỉnh sửa group khác.
- Chỉnh sửa `spec.md`.
- Chỉnh sửa `tasks.md`.
- Implement source code.
- Thay đổi frontend, backend, AI service hoặc database.
- Chỉnh sửa Use-Case Documentation.
- Chỉnh sửa tài liệu project-level.
- Commit hoặc push.

Trước khi làm việc, kiểm tra `git status` và bảo toàn tất cả thay đổi chưa commit.

## 7. Validation

Sau khi thực thi `/speckit.plan`:

- Kiểm tra Plan thuộc đúng feature 121.
- Kiểm tra tính nhất quán với `spec.md`.
- Kiểm tra technical decisions có căn cứ.
- Kiểm tra UI approach phù hợp với frontend hiện tại.
- Kiểm tra dependencies và testing strategy.
- Kiểm tra Plan có thể tiếp tục sử dụng cho `/speckit.tasks`.
- Chạy validation scripts theo Spec Kit workflow nếu có.
- Kiểm tra Git diff để bảo đảm không sửa file ngoài phạm vi.

Nếu phát hiện vấn đề trong `spec.md` hoặc UI implementation, chỉ ghi nhận, không tự ý sửa.

## 8. Final Report

Báo cáo bằng Vietnamese:

1. Tên và đường dẫn feature 121 đã xác định.
2. `/speckit.plan` có thực sự được thực thi hay không.
3. File Plan đã tạo hoặc cập nhật.
4. Nội dung chính của Plan.
5. Những điểm UI mới được phản ánh trong technical approach.
6. Các technical decisions đáng chú ý.
7. Validation results.
8. Những vấn đề cần clarification.
9. Danh sách file đã thay đổi.

**Completion criteria:** Chỉ tạo Implementation Plan cho feature 121 bằng Spec Kit `/speckit.plan`. Sau khi hoàn thành, dừng lại và chờ review, không tự động chuyển sang feature tiếp theo.
```

### Tóm tắt phản hồi của AI

- **Xác định chính xác Feature 121**: Nhận diện đúng `121-conversational-interface` tại `specs/120-ai-conversational-agent/121-conversational-interface/` cùng tài liệu đặc tả nguồn `spec.md` (FR-001..FR-012, 4 User Stories, 4 UI screenshots, các câu trả lời Clarification Session 2026-10-30/2026-11-01) và Use Cases `UC-120-001`, `UC-120-004`.
- **Khảo sát UI hiện tại của Group 120**:
  - Kiểm tra toàn diện component `src/frontend/src/components/chat/AIHostChat.jsx`, `agentService.js`, `agentTools.js`, `TopBar.jsx` và `BottomPlayer.jsx`.
  - Ghi nhận mô hình giao diện mới nhất: Floating Terminal / CLI dialog neo góc phải (`bottom-[96px] right-2 top-2`, max-w 460px) với theme tối `#0c0d12`, font monospace, banner chào mừng, bảng phím tắt `/help`, braille spinner `⠋` kèm verb xoay vòng và đếm giây, trace suy nghĩ thu gọn/mở rộng, cursor khối nhấp nháy `█`, huy hiệu `✓ xong trong [N]s`, dải suggestion chips và duyệt lịch sử 30 lệnh qua phím mũi tên.
- **Thực thi workflow Spec Kit `/speckit.plan`**:
  - Kích hoạt context Feature 121 qua `.specify/scripts/bash/setup-plan.sh --json` và cập nhật `.specify/feature.json`.
  - **Phase 0 (Outline & Research)**: Xây dựng `research.md` giải quyết triệt để 6 vấn đề kỹ thuật:
    1. Giao thức Streaming: Sử dụng Server-Sent Events (SSE) qua `POST /api/v1/agent/chat` (`Accept: text/event-stream`) truyền kèm Bearer JWT và context phát nhạc (`currentTrack`, `isPlaying`, `volume`).
    2. Vòng đời & Lưu trữ: Quản lý strictly in-memory tại component React (`entries` state) kết hợp bộ đệm vòng 30 lệnh (`historyRef`). Lệnh `/clear` xử lý tức thời tại client; không ghi database ở v1, xóa sạch khi logout tuân thủ Nghị định 13/2023/NĐ-CP.
    3. Định dạng văn bản (FR-007): User message hiển thị dạng plain text đã escape chống XSS; AI response render qua parser Markdown có cơ chế sanitize (`rehype-sanitize`) hỗ trợ bold, italics, lists, inline code và link an toàn (`rel="noopener noreferrer"`).
    4. Xử lý khi AI sự cố (FR-009, FR-011): Hiển thị trạng thái `● tạm ngưng`, alert banner màu hổ phách, disable ô nhập và nút "Thử lại" (Retry) cho tin nhắn lỗi; đảm bảo **cách ly hoàn toàn 100% với audio player (nhạc nền phát liên tục không gián đoạn)**.
    5. Căn chỉnh kiến trúc UI: Chuẩn hóa technical approach theo đúng implementation thực tế trong `AIHostChat.jsx`.
    6. Phân quyền & Cách ly tài khoản (FR-001, FR-010): Kiểm tra auth ở client (challenge modal redirect `/login`) và xác thực Bearer JWT ở backend, trích xuất `req.user.id`, đảm bảo không rò rỉ dữ liệu giữa các tài khoản.
  - **Phase 1 (Design & Contracts)**:
    - Xây dựng `data-model.md`: Định nghĩa thực thể `UserSession`, `ConversationSession`, cấu trúc đa hình `ChatEntry` (`BannerEntry`, `HelpEntry`, `UserMessageEntry`, `AgentRunEntry`), DTO `PlaybackContextPayload`, schema `AgentStreamEvent`, state machines và quy tắc nghiệp vụ.
    - Xây dựng `contracts/`: Tài liệu `README.md` và file đặc tả OpenAPI 3.0.3 `conversational-interface-api.json` cho endpoint streaming `POST /api/v1/agent/chat` và health probe `GET /api/v1/agent/health`.
    - Xây dựng `quickstart.md`: Hướng dẫn kiểm thử runnable qua 8 kịch bản (Truy cập dialog, Gửi & stream phản hồi với thinking state, Duyệt lịch sử phím mũi tên, Lệnh `/clear`, Phím tắt `/help`, Hủy lượt chạy qua `Esc`, Chịu lỗi AI tạm ngưng và cách ly audio, Cô lập tài khoản người dùng).
  - **Hoàn thiện Implementation Plan (`plan.md`)**:
    - Điền đầy đủ Technical Context, bảng đối chiếu Baseline hiện tại vs Công việc sẽ làm vs Điểm cần xác nhận.
    - Đánh giá Constitution Check đạt PASS 100%.
    - Cung cấp sơ đồ Mermaid Flowchart kiến trúc phân tầng và Sequence Diagram luồng stream dữ liệu chi tiết.
    - Xác lập chiến lược kiểm thử đa tầng (Unit, Component, Contract, Security Isolation) và quản trị rủi ro.
- **Validation & Báo cáo**:
  - Chạy script kiểm tra điều kiện tiên quyết `.specify/scripts/bash/check-prerequisites.sh --json` đạt PASS 100%, sẵn sàng cho phase `/speckit.tasks`.
  - Kiểm tra `git status` xác nhận không có bất kỳ file nào ngoài Feature 121 bị ảnh hưởng.

### Phần đã sử dụng / chỉnh sửa / bỏ

| Phần                                                              | Quyết định   | Lý do                                                                                                                                              |
| ----------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Khởi tạo Plan qua `setup-plan.sh --json`                          | Dùng         | Tuân thủ quy trình chuẩn của Spec Kit trong repository, kích hoạt đúng context Feature 121.                                                        |
| Thiết kế Floating Terminal / CLI dialog (`AIHostChat.jsx`)        | Dùng         | Bám sát chính xác implementation frontend mới nhất của Group 120 thay vì UI cũ trong tài liệu ban đầu.                                             |
| Giao thức Server-Sent Events (SSE) qua `POST /api/v1/agent/chat`  | Dùng         | Tối ưu cho mô hình request-response streaming tokens, hỗ trợ truyền Authorization header và context phát nhạc, nhẹ hơn WebSockets.                 |
| Vòng đời hội thoại In-Memory kết hợp 30 lệnh gần nhất             | Dùng         | Tuân thủ Clarification 2026-10-30/2026-11-01 và FR-008; cho phép `/clear` tức thời, không rò rỉ dữ liệu phiên cũ sau khi đăng xuất.                |
| Markdown an toàn (User: Plain Text; AI: Sanitized Markdown)       | Dùng         | Tuân thủ FR-007; chống triệt để tấn công XSS, cho phép AI hiển thị rich text, danh sách và liên kết an toàn.                                       |
| Cách ly hoàn toàn với Trình phát nhạc (Zero Audio Disruption)     | Dùng         | Tuân thủ FR-011, SC-005; lỗi hay thao tác trên khung chat không bao giờ làm gián đoạn bài hát đang nghe trong `PlayerContext`.                     |
| OpenAPI 3.0 Specification (`conversational-interface-api.json`)   | Dùng         | Chuẩn hóa contract cho endpoint stream `POST /api/v1/agent/chat` và `GET /api/v1/agent/health`.                                                    |
| Lưu trữ vĩnh viễn tin nhắn chat vào bảng PostgreSQL               | Bỏ hoàn toàn | Clarification của spec đã xác nhận rõ mô hình v1 là In-Memory session lifecycle, tránh gánh nặng lưu trữ và rủi ro quyền riêng tư không cần thiết. |
| Thực thi tool điều khiển nhạc (chỉnh volume, đổi bài, thêm queue) | Bỏ khỏi F121 | Phạm vi thuộc về Feature 123 (`123-real-time-music-assistance`), Feature 121 chỉ tập trung vào hạ tầng giao diện và streaming hội thoại.           |
| Phân tích ý định âm nhạc từ câu thoại tự nhiên                    | Bỏ khỏi F121 | Phạm vi thuộc về Feature 122 (`122-music-intent-understanding`).                                                                                   |
| Chỉnh sửa mã nguồn hoặc file ngoài Feature 121                    | Bỏ tuyệt đối | Tuân thủ nghiêm ngặt giới hạn phạm vi nhiệm vụ, bảo toàn working tree và không commit/push.                                                        |

### Cách kiểm chứng

- **Kiểm tra tính toàn vẹn tài liệu:** Xác nhận đầy đủ 6 artifact được tạo mới bên trong `specs/120-ai-conversational-agent/121-conversational-interface/` (`plan.md`, `research.md`, `data-model.md`, `contracts/README.md`, `contracts/conversational-interface-api.json`, `quickstart.md`).
- **Chạy script kiểm tra Spec Kit:** Chạy `.specify/scripts/bash/check-prerequisites.sh --json` xác nhận kết quả trả về `AVAILABLE_DOCS: ["research.md", "data-model.md", "contracts/", "quickstart.md"]`, sẵn sàng 100% cho bước `/speckit.tasks`.
- **Kiểm tra độ bao phủ yêu cầu:** Đối chiếu chéo 12 mã FR (`121-FR-001..012`), 4 User Stories và 5 Success Criteria trong `spec.md`, đảm bảo tất cả đều được giải quyết trong kiến trúc, data model, API contract và kịch bản test.
- **Kiểm tra cú pháp Contract và Mermaid:** File `conversational-interface-api.json` tuân thủ chuẩn OpenAPI 3.0.3; các sơ đồ Mermaid Flowchart và Sequence trong `data-model.md` và `plan.md` viết đúng cú pháp không gây lỗi render.
- **Kiểm tra phạm vi Git (`git status`):** Xác nhận các file thay đổi/tạo mới chỉ thuộc Feature 121, không có file ngoài phạm vi bị tác động.
