"""
AuraTune AI Agent Tools definitions and catalog mapping.
These functions define the callable interfaces exposed to Gemini via Function Calling.
"""

from typing import List, Optional

# AuraTune System Catalog
CATALOG_TRACKS = {
    "t1": {"title": "Nàng thơ", "artist": "Hoàng Dũng", "genre": "ballad"},
    "t2": {"title": "Bước qua mùa cô đơn", "artist": "Vũ.", "genre": "indie"},
    "t3": {"title": "Có em", "artist": "Madihu, Low G", "genre": "rnb"},
    "t4": {"title": "Thích em hơi nhiều", "artist": "Wren Evans", "genre": "vpop"},
    "t5": {"title": "Chuyện rằng", "artist": "Thịnh Suy", "genre": "indie"},
    "t6": {"title": "Tình đắng như ly cà phê", "artist": "Nân", "genre": "vpop"},
    "t7": {"title": "3107", "artist": "W/n, Duongg, Nâu", "genre": "rnb"},
    "t8": {"title": "Midnight Coffee", "artist": "AuraTune Studio", "genre": "lofi"},
    "t9": {"title": "Rainy Window", "artist": "AuraTune Studio", "genre": "lofi"},
    "t10": {"title": "Slow Afternoon", "artist": "AuraTune Studio", "genre": "chill"},
}

CATALOG_PLAYLISTS = {
    "lofi-chill": {
        "title": "Lofi bên cửa sổ",
        "description": "Nhịp beat chậm rãi để tập trung, đọc sách, code và thở sâu",
        "tags": ["lofi", "chill", "code", "thư giãn", "học bài"],
    },
    "deep-focus": {
        "title": "Deep Focus",
        "description": "Không gian âm thanh tối giản cho những giờ tập trung cao độ",
        "tags": ["tập trung", "focus", "không lời", "làm việc"],
    },
    "aura-mix": {
        "title": "Aura Mix hôm nay",
        "description": "Tuyển tập giai điệu đa dạng, dành riêng cho nhịp điệu của bạn",
        "tags": ["tổng hợp", "thịnh hành", "mix"],
    },
    "indie-viet": {
        "title": "Indie Việt dịu êm",
        "description": "Những câu chuyện nhỏ được kể bằng giai điệu lớn",
        "tags": ["indie", "mộc mạc", "việt nam"],
    },
    "dem-thanh-pho": {
        "title": "Đêm thành phố",
        "description": "Những thanh âm mềm mại cho một đêm thật dài",
        "tags": ["đêm", "tâm trạng", "buồn", "suy tư"],
    },
    "nang-len": {
        "title": "Nắng lên rồi",
        "description": "Bật mood tích cực, bắt đầu ngày mới theo cách của bạn",
        "tags": ["năng lượng", "vui vẻ", "sáng", "thể thao"],
    },
}

class ToolCollector:
    """Ghi nhận lại các lệnh gọi tool phát sinh trong phiên trò chuyện để chuyển giao cho client."""
    def __init__(self):
        self.recorded_calls = []

    def play_playlist(self, playlist_id: str) -> dict:
        """Phát playlist nhạc theo playlist_id (ví dụ: 'lofi-chill', 'deep-focus', 'aura-mix', 'indie-viet', 'dem-thanh-pho', 'nang-len')."""
        pl = CATALOG_PLAYLISTS.get(playlist_id, {})
        title = pl.get("title", playlist_id)
        self.recorded_calls.append({
            "name": "play_playlist",
            "args": {"playlistId": playlist_id},
            "confirm": False
        })
        return {"status": "success", "playlistId": playlist_id, "title": title}

    def play_tracks(self, track_ids: List[str]) -> dict:
        """Phát danh sách bài hát theo các mã track_id (ví dụ: ['t1', 't2', 't8'])."""
        valid_ids = [tid for tid in track_ids if tid in CATALOG_TRACKS] or track_ids
        first_title = CATALOG_TRACKS.get(valid_ids[0], {}).get("title", valid_ids[0]) if valid_ids else ""
        self.recorded_calls.append({
            "name": "play_tracks",
            "args": {"trackIds": valid_ids},
            "confirm": False
        })
        return {"status": "success", "trackIds": valid_ids, "nowPlaying": first_title}

    def playback(self, action: str) -> dict:
        """Điều khiển phát nhạc: 'pause' (tạm dừng), 'resume' (tiếp tục), 'next' (chuyển bài kế), 'previous' (quay lại bài trước)."""
        valid_actions = ["pause", "resume", "next", "previous"]
        act = action.lower().strip()
        if act not in valid_actions:
            act = "pause" if "dừng" in act or "pause" in act else "resume"
        self.recorded_calls.append({
            "name": "playback",
            "args": {"action": act},
            "confirm": False
        })
        return {"status": "success", "action": act}

    def set_volume(self, value: int) -> dict:
        """Điều chỉnh âm lượng nhạc của trình phát từ 0 đến 100%."""
        vol = max(0, min(100, int(value)))
        self.recorded_calls.append({
            "name": "set_volume",
            "args": {"value": vol},
            "confirm": False
        })
        return {"status": "success", "volume": vol}

    def queue_add(self, track_ids: List[str]) -> dict:
        """Thêm các bài hát vào hàng đợi phát tiếp theo theo danh sách track_id."""
        valid_ids = [tid for tid in track_ids if tid in CATALOG_TRACKS] or track_ids
        self.recorded_calls.append({
            "name": "queue_add",
            "args": {"trackIds": valid_ids},
            "confirm": False
        })
        return {"status": "success", "addedCount": len(valid_ids)}

    def clear_queue(self) -> dict:
        """Xóa toàn bộ hàng đợi phát nhạc (hành động nguy hiểm cần người dùng xác nhận y/n)."""
        self.recorded_calls.append({
            "name": "clear_queue",
            "args": {},
            "confirm": True
        })
        return {"status": "pending_confirmation", "message": "Yêu cầu xác nhận từ người dùng"}

    def like_track(self, track_id: str) -> dict:
        """Thích/lưu bài hát vào danh sách Bài hát đã thích của người dùng."""
        self.recorded_calls.append({
            "name": "like_track",
            "args": {"trackId": track_id},
            "confirm": False
        })
        return {"status": "success", "trackId": track_id}
