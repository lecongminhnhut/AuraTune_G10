# AuraTune — API Contract

> Base URL: `/api/v1` — Xác thực: header `Authorization: Bearer <access_token>` (JWT)

## 1. Quy định trả về của API (BẮT BUỘC)

### 1.1. Tất cả API phải theo format chuẩn

**Thành công:**

```json
{
  "success": true,
  "message": "optional message",
  "data": {},
  "error": null
}
```

**Thất bại:**

```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không đúng",
  "data": null,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": []
  }
}
```

### 1.2. Ý nghĩa field

| Field   | Kiểu           | Ý nghĩa                              |
| ------- | -------------- | ------------------------------------ |
| success | boolean        | request có thành công không          |
| message | string         | mô tả ngắn                           |
| data    | object / array | dữ liệu chính, `null` khi lỗi        |
| error   | object / null  | thông tin lỗi, `null` khi thành công |

`error` gồm `code` (string, HOA_SNAKE) và `details` (array mô tả từng field lỗi, VD: `[{ "field": "email", "issue": "Email không đúng định dạng" }]`).

### 1.3. HTTP status code

| Status | Ý nghĩa                                  |
| ------ | ---------------------------------------- |
| 200    | Thành công                               |
| 201    | Tạo mới thành công                       |
| 206    | Partial Content (stream nhạc có `Range`) |
| 400    | Request sai / validate lỗi               |
| 401    | Chưa đăng nhập / token hết hạn           |
| 403    | Không đủ quyền / bị ban                  |
| 404    | Không tìm thấy tài nguyên                |
| 409    | Trùng dữ liệu                            |
| 429    | Gọi quá nhiều lần                        |
| 500    | Lỗi server                               |
| 503    | AI Service không phản hồi                |

### 1.4. Danh sách `error.code`

| code                   | Status | Ý nghĩa                                    |
| ---------------------- | ------ | ------------------------------------------ |
| VALIDATION_ERROR       | 400    | Dữ liệu gửi lên không hợp lệ               |
| INVALID_CREDENTIALS    | 401    | Sai email / mật khẩu                       |
| UNAUTHORIZED           | 401    | Thiếu hoặc sai token                       |
| TOKEN_EXPIRED          | 401    | Access token hết hạn → gọi `/auth/refresh` |
| FORBIDDEN              | 403    | Không có quyền thực hiện                   |
| USER_BANNED            | 403    | Tài khoản đã bị khóa                       |
| NOT_FOUND              | 404    | Không tìm thấy dữ liệu                     |
| ALREADY_EXISTS         | 409    | Dữ liệu đã tồn tại                         |
| RATE_LIMITED           | 429    | Vượt giới hạn request                      |
| AI_SERVICE_UNAVAILABLE | 503    | AI Service lỗi / timeout                   |
| INTERNAL_ERROR         | 500    | Lỗi không xác định                         |

### 1.5. Ngoại lệ

`GET /songs/:id/stream` trả **file audio** (`200` / `206`, header `Content-Type: audio/mpeg`, `Accept-Ranges: bytes`), không theo format JSON. Khi lỗi vẫn trả JSON chuẩn.

---

## 2. Danh sách API

**Cột "Quyền":** `Public` = không cần đăng nhập · `User` = cần đăng nhập · `Artist` = role `artist` (chỉ sửa dữ liệu của mình) · `Admin` = role `admin`. (artist cũng là user)

### 2.1. Auth

| Method | Endpoint         | Quyền  | Mô tả                                      |
| ------ | ---------------- | ------ | ------------------------------------------ |
| POST   | `/auth/register` | Public | Đăng ký tài khoản local                    |
| POST   | `/auth/login`    | Public | Đăng nhập local                            |
| POST   | `/auth/google`   | Public | Đăng nhập / đăng ký bằng Google            |
| POST   | `/auth/facebook` | Public | Đăng nhập / đăng ký bằng Facebook          |
| POST   | `/auth/refresh`  | Public | Đổi `refresh_token` lấy `access_token` mới |
| POST   | `/auth/reset`    | User   | Quên mật khẩu cần đổi                      |
| POST   | `/auth/logout`   | User   | Đăng xuất                                  |

### 2.2. Trang chủ, BXH, Thể loại

| Method | Endpoint                 | Quyền  | Mô tả                                                    |
| ------ | ------------------------ | ------ | -------------------------------------------------------- |
| GET    | `/home`                  | Public | Gộp các section trang chủ trong 1 request                |
| GET    | `/recommendations/songs` | User   | Bài hát đề xuất (AI)                                     |
| GET    | `/songs/popular`         | Public | Bài hát phổ biến                                         |
| GET    | `/albums/new`            | Public | Album mới                                                |
| GET    | `/artists/featured`      | Public | Nghệ sĩ nổi bật                                          |
| GET    | `/playlists`             | Public | Playlist public (playlist đề xuất)                       |
| GET    | `/charts/songs`          | Public | Bảng xếp hạng. Query: `period=day\|week\|month`, `limit` |
| GET    | `/genres`                | Public | Danh sách thể loại                                       |

### 2.3. Tìm kiếm

| Method | Endpoint         | Quyền  | Mô tả                                                              |
| ------ | ---------------- | ------ | ------------------------------------------------------------------ |
| GET    | `/search`        | Public | Tìm bài hát, nghệ sĩ, album, playlist. Query: `q`, `type`, `limit` |
| GET    | `/search/lyrics` | Public | Tìm theo lời bài hát (AI). Query: `q`, `limit`                     |

### 2.4. Bài hát & Music Player

| Method | Endpoint              | Quyền          | Mô tả                                                              |
| ------ | --------------------- | -------------- | ------------------------------------------------------------------ |
| GET    | `/songs`              | Public         | Danh sách bài hát. Query: `genre`, `artist_id`, `album_id`, `sort` |
| GET    | `/songs/:id`          | Public         | Chi tiết bài hát                                                   |
| GET    | `/songs/:id/stream`   | Public         | Stream file nhạc, hỗ trợ `Range` để tua                            |
| GET    | `/songs/:id/lyrics`   | Public         | Lời bài hát (thường + đồng bộ thời gian)                           |
| PUT    | `/songs/:id/like`     | User           | Thích bài hát                                                      |
| DELETE | `/songs/:id/like`     | User           | Bỏ thích bài hát                                                   |
| GET    | `/songs/:id/comments` | Public         | Danh sách bình luận                                                |
| POST   | `/songs/:id/comments` | User           | Thêm bình luận (`content`, `timestamp_seconds` tùy chọn)           |
| DELETE | `/comments/:id`       | User / Admin   | Xóa bình luận (chủ bình luận hoặc admin)                           |
| POST   | `/songs`              | Artist / Admin | Thêm bài hát (`multipart/form-data`)                               |
| PUT    | `/songs/:id`          | Artist / Admin | Sửa bài hát                                                        |
| DELETE | `/songs/:id`          | Artist / Admin | Xóa bài hát                                                        |

### 2.5. Lịch sử nghe nhạc & Thống kê cá nhân

| Method | Endpoint                      | Quyền | Mô tả                                                          |
| ------ | ----------------------------- | ----- | -------------------------------------------------------------- |
| POST   | `/users/me/history`           | User  | Ghi lại một lượt nghe (`song_id`, `duration_listened_seconds`) |
| GET    | `/users/me/history`           | User  | Bài hát đã nghe gần đây                                        |
| GET    | `/users/me/stats/top-songs`   | User  | Top N bài nghe nhiều + số lượt nghe. Query: `range`, `limit`   |
| GET    | `/users/me/stats/top-artists` | User  | Top N nghệ sĩ + tổng thời lượng nghe. Query: `range`, `limit`  |

### 2.6. Playlist & Bài hát yêu thích

| Method | Endpoint                        | Quyền  | Mô tả                                                                           |
| ------ | ------------------------------- | ------ | ------------------------------------------------------------------------------- |
| GET    | `/users/me/playlists`           | User   | Playlist do mình tạo                                                            |
| POST   | `/playlists`                    | User   | Tạo playlist                                                                    |
| GET    | `/playlists/:id`                | Public | Chi tiết playlist + danh sách bài hát                                           |
| PUT    | `/playlists/:id`                | User   | Sửa thông tin (tên, mô tả, ảnh bìa, `status`)                                   |
| DELETE | `/playlists/:id`                | User   | Xóa playlist                                                                    |
| POST   | `/playlists/:id/songs`          | User   | Thêm bài hát vào playlist (`song_ids`)                                          |
| DELETE | `/playlists/:id/songs/:song_id` | User   | Xóa bài hát khỏi playlist                                                       |
| PUT    | `/playlists/:id/songs/order`    | User   | Thay đổi thứ tự bài hát (`song_ids` theo thứ tự mới)                            |
| POST   | `/playlists/ai-generate`        | User   | Tạo playlist bằng AI (`prompt`, `max_songs`) — bản xem trước, chưa lưu          |
| GET    | `/users/me/liked-songs`         | User   | "Bài hát yêu thích" (cấu trúc như `GET /playlists/:id`, `type = "liked_songs"`) |

### 2.7. Album

| Method | Endpoint                 | Quyền          | Mô tả                                       |
| ------ | ------------------------ | -------------- | ------------------------------------------- |
| GET    | `/albums`                | Public         | Danh sách album. Query: `artist_id`, `sort` |
| GET    | `/albums/:id`            | Public         | Chi tiết album + danh sách bài hát          |
| PUT    | `/albums/:id/save`       | User           | Lưu album                                   |
| DELETE | `/albums/:id/save`       | User           | Bỏ lưu album                                |
| GET    | `/users/me/saved-albums` | User           | Album đã lưu                                |
| POST   | `/albums`                | Artist / Admin | Tạo album (`multipart/form-data`)           |
| PUT    | `/albums/:id`            | Artist / Admin | Sửa album                                   |
| DELETE | `/albums/:id`            | Artist / Admin | Xóa album                                   |

### 2.8. Nghệ sĩ

| Method | Endpoint                      | Quyền  | Mô tả                               |
| ------ | ----------------------------- | ------ | ----------------------------------- |
| GET    | `/artists`                    | Public | Danh sách nghệ sĩ                   |
| GET    | `/artists/:id`                | Public | Thông tin nghệ sĩ + bài hát nổi bật |
| GET    | `/artists/:id/songs`          | Public | Bài hát của nghệ sĩ                 |
| GET    | `/artists/:id/albums`         | Public | Album của nghệ sĩ                   |
| GET    | `/artists/:id/playlists`      | Public | Playlist liên quan                  |
| PUT    | `/artists/:id/follow`         | User   | Follow nghệ sĩ                      |
| DELETE | `/artists/:id/follow`         | User   | Unfollow nghệ sĩ                    |
| GET    | `/users/me/following-artists` | User   | Nghệ sĩ đang follow                 |

### 2.9. Người dùng & Trang cá nhân

| Method | Endpoint                    | Quyền  | Mô tả                                         |
| ------ | --------------------------- | ------ | --------------------------------------------- |
| GET    | `/users/me`                 | User   | Thông tin tài khoản của mình                  |
| PUT    | `/users/me`                 | User   | Sửa tên, ảnh đại diện (`multipart/form-data`) |
| PUT    | `/users/me/password`        | User   | Đổi mật khẩu                                  |
| GET    | `/users/:id`                | Public | Trang cá nhân công khai                       |
| PUT    | `/users/:id/follow`         | User   | Follow người dùng                             |
| DELETE | `/users/:id/follow`         | User   | Unfollow người dùng                           |
| GET    | `/users/me/following-users` | User   | Người mình đang follow                        |
| GET    | `/users/me/followers`       | User   | Người đang follow mình                        |

### 2.10. Admin

| Method | Endpoint                       | Quyền | Mô tả                                                     |
| ------ | ------------------------------ | ----- | --------------------------------------------------------- |
| GET    | `/admin/users`                 | Admin | Danh sách người dùng. Query: `q`, `role`, `is_banned`     |
| PUT    | `/admin/users/:id/ban`         | Admin | Ban user (`reason`)                                       |
| PUT    | `/admin/users/:id/unban`       | Admin | Gỡ ban user                                               |
| GET    | `/admin/songs`                 | Admin | Danh sách toàn bộ bài hát                                 |
| PUT    | `/admin/songs/:id`             | Admin | Sửa / ẩn bài hát                                          |
| DELETE | `/admin/songs/:id`             | Admin | Xóa bài hát                                               |
| GET    | `/admin/stats`                 | Admin | Thống kê tổng nền tảng                                    |
| POST   | `/admin/playlists`             | Admin | Tạo playlist chính thức                                   |
| POST   | `/admin/artists`               | Admin | Thêm nghệ sĩ                                              |
| PUT    | `/admin/artists/:id`           | Admin | Sửa nghệ sĩ                                               |
| DELETE | `/admin/artists/:id`           | Admin | Xóa nghệ sĩ                                               |
| PUT    | `/admin/artists/:id/link-user` | Admin | Gán tài khoản user làm nghệ sĩ (user thành role `artist`) |

### 2.11. AI Service (nội bộ: Backend → Python, Frontend không gọi)

| Method | Endpoint                | Mô tả                                  |
| ------ | ----------------------- | -------------------------------------- |
| POST   | `/ai/recommend`         | Gợi ý bài hát cho người dùng           |
| POST   | `/ai/search/lyrics`     | Tìm bài hát theo ngữ nghĩa lời bài hát |
| POST   | `/ai/playlist/generate` | Tạo playlist từ câu mô tả              |
| GET    | `/ai/health`            | Kiểm tra AI Service còn sống           |
