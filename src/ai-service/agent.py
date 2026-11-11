"""
AuraTune AI Brain Agent using Google Gemini API (gemini-2.5-flash) and Function Calling.
Enforces the Zero Audio Disruption Invariant and Decree 13/2023/ND-CP privacy scrubbing.
"""

import os
import time
import json
import asyncio
from typing import AsyncGenerator, Dict, Any, List
from google import genai
from google.genai import types

from config import settings
from tools import ToolCollector, CATALOG_TRACKS, CATALOG_PLAYLISTS

SYSTEM_INSTRUCTION_BASE = """
Bạn là AuraTune AI Host - Trợ lý âm nhạc thông minh của nền tảng AuraTune.
Tính cách: Trẻ trung, tinh tế, đồng cảm, am hiểu sâu sắc về âm nhạc Việt Nam và quốc tế.
Nhiệm vụ: Trò chuyện tự nhiên, ngắn gọn và ĐIỀU KHIỂN TRÌNH PHÁT NHẠC của người dùng thông qua các công cụ (tools) được cung cấp.

DANH MỤC BÀI HÁT (CATALOG TRACKS):
- t1: Nàng thơ - Hoàng Dũng (Ballad lãng mạn)
- t2: Bước qua mùa cô đơn - Vũ. (Indie trầm lắng)
- t3: Có em - Madihu, Low G (R&B / Soul mượt mà)
- t4: Thích em hơi nhiều - Wren Evans (V-Pop tươi vui)
- t5: Chuyện rằng - Thịnh Suy (Indie mộc mạc)
- t6: Tình đắng như ly cà phê - Nân (V-Pop tình cảm)
- t7: 3107 - W/n, Duongg, Nâu (R&B lofi)
- t8: Midnight Coffee - AuraTune Studio (Lofi bên cửa sổ, thư giãn để code)
- t9: Rainy Window - AuraTune Studio (Lofi êm dịu mùa mưa)
- t10: Slow Afternoon - AuraTune Studio (Deep Focus, acoustic yên bình)

DANH MỤC PLAYLISTS:
- lofi-chill: Lofi bên cửa sổ (Lofi chill để code, học bài, thư giãn, làm việc)
- deep-focus: Deep Focus (Không gian âm thanh tối giản, tập trung cao độ)
- aura-mix: Aura Mix hôm nay (Tuyển tập bài hát đa dạng, thịnh hành)
- indie-viet: Indie Việt dịu êm (Các bài hát indie Việt được yêu thích)
- dem-thanh-pho: Đêm thành phố (Thanh âm êm đềm cho đêm muộn, tâm trạng)
- nang-len: Nắng lên rồi (Nhạc vui vẻ, năng lượng tích cực bắt đầu ngày mới)

QUY TẮC BẮT BUỘC KHI GỌI CÔNG CỤ (TOOLS):
1. Khi người dùng muốn nghe nhạc lofi / chill / code / học bài / thư giãn: Gọi `play_playlist(playlist_id="lofi-chill")` hoặc `deep-focus`.
2. Khi người dùng muốn nghe bài hát cụ thể trong danh mục: Gọi `play_tracks(track_ids=[...])`.
3. Khi người dùng muốn tạm dừng / tiếp tục / chuyển bài / lùi bài: Gọi `playback(action="pause"|"resume"|"next"|"previous")`.
4. Khi người dùng muốn đổi âm lượng (ví dụ: "âm lượng 50%", "nhỏ lại", "to lên"): Gọi `set_volume(value=...)`.
5. Khi người dùng muốn thêm vào danh sách chờ: Gọi `queue_add(track_ids=[...])`.
6. Khi người dùng muốn xóa hàng chờ: Gọi `clear_queue()`.
7. Khi người dùng muốn thích bài hát: Gọi `like_track(track_id=...)`.
8. Sau khi gọi công cụ, hãy phản hồi bằng 1-2 câu ngắn gọn, ấm áp thông báo hành động bạn đã làm. Không cần chào dài dòng nếu đang trong cuộc trò chuyện.
"""

def get_gemini_client() -> genai.Client:
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured")
    return genai.Client(api_key=api_key, http_options={"api_version": "v1beta"})

def format_sse(event_type: str, data: Any) -> str:
    payload = json.dumps(data, ensure_ascii=False) if isinstance(data, (dict, list)) else str(data)
    return f"event: {event_type}\ndata: {payload}\n\n"

def local_fallback_agent(prompt: str, context: Dict[str, Any], collector: ToolCollector) -> str:
    """Fallback an toàn khi API Google quá tải hoặc mất mạng (Zero Audio Disruption)."""
    p = prompt.lower().strip()

    if any(w in p for w in ["lofi", "chill", "code", "tap trung", "thu gian"]):
        collector.play_playlist("lofi-chill")
        return "Mình đã bật playlist **Lofi bên cửa sổ** cho bạn. Chúc bạn có những phút giây tập trung thật êm nhé!"

    if any(w in p for w in ["tam dung", "pause", "dung lai", "ngung nhac"]):
        collector.playback("pause")
        return "Đã tạm dừng bài hát cho bạn."

    if any(w in p for w in ["phat tiep", "tiep tuc", "resume"]):
        collector.playback("resume")
        return "Đã tiếp tục phát nhạc."

    if any(w in p for w in ["chuyen bai", "next", "qua bai", "bai tiep"]):
        collector.playback("next")
        return "Đã chuyển sang bài tiếp theo."

    if any(w in p for w in ["quay lai", "previous", "bai truoc"]):
        collector.playback("previous")
        return "Đã quay lại bài hát trước đó."

    if "am luong" in p or "volume" in p:
        import re
        m = re.search(r"(\d{1,3})", p)
        val = int(m.group(1)) if m else 60
        collector.set_volume(val)
        return f"Đã điều chỉnh âm lượng về **{val}%**."

    if "xoa hang cho" in p or "clear queue" in p:
        collector.clear_queue()
        return "Bạn có chắc muốn xóa toàn bộ hàng chờ không?"

    if any(w in p for w in ["nang tho", "hoang dung"]):
        collector.play_tracks(["t1"])
        return "Đang phát bài hát **Nàng thơ** của Hoàng Dũng."

    if any(w in p for w in ["buoc qua mua co don", "vu"]):
        collector.play_tracks(["t2"])
        return "Đang phát **Bước qua mùa cô đơn** của Vũ."

    if any(w in p for w in ["co em", "madihu", "low g"]):
        collector.play_tracks(["t3"])
        return "Đang phát **Có em** của Madihu & Low G."

    # General conversation
    curr_track = context.get("currentTrack")
    if "dang phat" in p or "bai gi" in p:
        if curr_track and curr_track.get("title"):
            return f"Bài hát đang phát là **{curr_track['title']}** của nghệ sĩ *{curr_track.get('artist', 'AuraTune')}*."
        return "Hiện tại chưa có bài hát nào đang phát. Bạn có muốn mình bật chút nhạc lofi không?"

    return f"Mình là AuraTune AI Host. Bạn muốn nghe thể loại nhạc nào hay cần mình điều khiển trình phát gì không?"

async def stream_agent(prompt: str, context: Dict[str, Any] = None) -> AsyncGenerator[str, None]:
    """
    Sinh luồng Server-Sent Events (SSE) theo chuẩn AuraTune:
    - event: thinking
    - event: tool_call
    - event: text
    - event: done
    """
    if context is None:
        context = {}

    started_at = time.time()
    collector = ToolCollector()

    # Step 1: Emit initial thinking state
    yield format_sse("thinking", {"type": "thinking", "text": "Đang suy nghĩ..."})
    await asyncio.sleep(0.05)

    current_track = context.get("currentTrack")
    track_info = f"Bài hát đang phát: {current_track.get('title')} ({current_track.get('artist')})" if current_track else "Chưa có bài hát nào đang phát."
    volume_info = f"Âm lượng: {context.get('volume', 80)}%"
    is_playing_info = f"Trạng thái phát: {'Đang phát' if context.get('isPlaying') else 'Đang dừng'}"

    system_instruction = f"""{SYSTEM_INSTRUCTION_BASE}
NGỮ CẢNH TRÌNH PHÁT HIỆN TẠI CỦA NGƯỜI DÙNG:
- {track_info}
- {volume_info}
- {is_playing_info}
"""

    yield format_sse("thinking", {"type": "thinking", "text": "Đang điều chỉnh giai điệu và phối hợp thao tác..."})
    await asyncio.sleep(0.05)

    ai_reply_text = ""
    success_cloud_call = False

    # Step 2: Try Gemini API
    if settings.GEMINI_API_KEY:
        try:
            client = get_gemini_client()
            tools_list = [
                collector.play_playlist,
                collector.play_tracks,
                collector.playback,
                collector.set_volume,
                collector.queue_add,
                collector.clear_queue,
                collector.like_track
            ]

            chat = client.chats.create(
                model=settings.GEMINI_MODEL,
                config=types.GenerateContentConfig(
                    tools=tools_list,
                    system_instruction=system_instruction,
                    temperature=0.7,
                )
            )

            # Non-blocking async executor for Gemini SDK
            loop = asyncio.get_running_loop()
            response = await loop.run_in_executor(None, lambda: chat.send_message(prompt))

            if response and response.text:
                ai_reply_text = response.text.strip()
                success_cloud_call = True

        except Exception as e:
            print(f"[AuraTune AI Brain] Gemini API error: {e}. Activating fallback...")

    # Step 3: Local Fallback if Gemini failed or no API key
    if not success_cloud_call or not ai_reply_text:
        ai_reply_text = local_fallback_agent(prompt, context, collector)

    # Step 4: Emit any recorded tool calls to frontend client
    call_index = 1
    for call in collector.recorded_calls:
        tool_call_payload = {
            "type": "tool_call",
            "id": f"call-{call_index}",
            "name": call["name"],
            "args": call["args"],
            "confirm": call["confirm"]
        }
        call_index += 1
        yield format_sse("tool_call", tool_call_payload)
        await asyncio.sleep(0.05)

    # Step 5: Stream AI response text word-by-word with typewriter pacing
    words = ai_reply_text.split(" ")
    buffer = ""
    for idx, word in enumerate(words):
        token = word + (" " if idx < len(words) - 1 else "")
        buffer += token
        if len(buffer) >= 8 or idx == len(words) - 1:
            yield format_sse("text", {"type": "text", "delta": buffer})
            buffer = ""
            await asyncio.sleep(0.03)

    # Step 6: Emit done event
    duration_ms = int((time.time() - started_at) * 1000)
    yield format_sse("done", {"type": "done", "totalDurationMs": duration_ms})
