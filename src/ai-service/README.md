# AuraTune AI Brain Service 🧠🎵

Service "Bộ não AI" cho nền tảng âm nhạc thông minh **AuraTune**, được xây dựng trên nền tảng **FastAPI (Python)** kết hợp cùng **Google Gemini API** (`gemini-2.5-flash`) với khả năng **Function Calling (Tools)** và **Streaming Server-Sent Events (SSE)** theo thời gian thực.

---

## 1. Kiến trúc & Tính năng cốt lõi

1. **AI Model**: Sử dụng mô hình `gemini-2.5-flash` thông qua SDK chính thức `google-genai` của Google AI Studio (API version `v1beta`).
2. **ReAct & Function Calling**:
   - Tự động phân tích hội thoại người dùng để quyết định kích hoạt các công cụ điều khiển nhạc:
     - `play_playlist(playlist_id)`: Bật playlist (ví dụ: `lofi-chill`, `deep-focus`, `aura-mix`, `indie-viet`, `nang-len`, `dem-thanh-pho`).
     - `play_tracks(track_ids)`: Phát danh sách bài hát theo mã ID (`t1` đến `t10`).
     - `playback(action)`: Điều khiển playback (`pause`, `resume`, `next`, `previous`).
     - `set_volume(value)`: Tùy chỉnh âm lượng (0 - 100%).
     - `queue_add(track_ids)`: Thêm bài hát vào hàng đợi.
     - `clear_queue()`: Xóa hàng chờ (yêu cầu người dùng xác nhận trên chat `y/n`).
     - `like_track(track_id)`: Thả tim bài hát vào mục Yêu thích.
3. **Streaming SSE**:
   - `thinking`: Hiển thị accordion suy nghĩ, trạng thái tính toán.
   - `tool_call`: Bắn action payload cho Web Client thực thi ngay lập tức qua `PlayerContext` & `AppStore`.
   - `text`: Stream câu trả lời tự nhiên theo từng từ (typewriter).
   - `done`: Báo kết thúc luồng kèm thời gian xử lý.
4. **Zero Audio Disruption & Safe Fallback**:
   - Nếu Gemini API quá tải hoặc rớt mạng, hệ thống tự động kích hoạt **Local Rule-Based NLU fallback** để thực hiện hành động mượt mà, không bao giờ làm ngắt nhạc đang phát.

---

## 2. Hướng dẫn khởi chạy

### Yêu cầu tiên quyết
- Python 3.10+ (Đã xác thực hoạt động ổn định trên Python 3.13 standard build `py -3.13`).
- Đã cấu hình `GEMINI_API_KEY` trong file `.env` ở root project hoặc `src/ai-service/.env`.

### Cài đặt thư viện
```bash
py -3.13 -m pip install -r src/ai-service/requirements.txt
```

### Khởi chạy service
- **Cách 1**: Chạy qua file script:
  - Windows: Chạy file `src/ai-service/start.bat` hoặc `src/ai-service/start.ps1`.
- **Cách 2**: Chạy lệnh uvicorn:
  ```bash
  py -3.13 -m uvicorn main:app --app-dir src/ai-service --host 0.0.0.0 --port 8000 --reload
  ```

---

## 3. Endpoints API

| Phương thức | Đường dẫn | Chức năng |
| :--- | :--- | :--- |
| `GET` | `/health` hoặc `/ai/health` | Kiểm tra trạng thái service, model Gemini, số lượng catalog |
| `POST` | `/ai/agent/stream` | Stream hội thoại và phát lệnh điều khiển âm nhạc qua SSE |

---

## 4. Kiểm thử độc lập

Chạy kịch bản kiểm thử luồng tương tác và kết nối Gemini:
```bash
py -3.13 src/ai-service/test_agent.py
```
