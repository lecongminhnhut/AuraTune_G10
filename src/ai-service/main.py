"""
AuraTune AI Brain Service - FastAPI Application.
Provides streaming SSE chat with Gemini-driven Music Orchestration.
"""

from fastapi import FastAPI, Request, Header, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import unicodedata

from config import settings
from agent import stream_agent
from tools import CATALOG_TRACKS, CATALOG_PLAYLISTS

app = FastAPI(
    title="AuraTune AI Brain Service",
    description="Intelligent Conversational Music Agent powered by Google Gemini",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AgentChatRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=1000, description="Nội dung yêu cầu từ người dùng")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Ngữ cảnh trình phát nhạc")

class PreferenceSignals(BaseModel):
    played_song_ids: List[str] = Field(default_factory=list)
    liked_song_ids: List[str] = Field(default_factory=list)
    followed_artist_ids: List[str] = Field(default_factory=list)

class RecommendRequest(BaseModel):
    user_id: Optional[str] = None
    signals: Optional[PreferenceSignals] = Field(default_factory=PreferenceSignals)
    requested_types: List[str] = Field(default=["song", "album", "artist", "playlist"])
    limit: int = Field(default=30, ge=1, le=50)

class PlaylistGenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=200)

@app.post("/ai/playlist/generate")
async def generate_playlist(req: PlaylistGenerateRequest, x_internal_secret: Optional[str] = Header(default=None)):
    if x_internal_secret != settings.AI_INTERNAL_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")
    prompt = req.prompt.strip().lower()
    normalized = "".join(char for char in unicodedata.normalize("NFD", prompt.replace("đ", "d")) if unicodedata.category(char) != "Mn")
    words = set(normalized.split())
    keyword_groups = {
        "focus": {"focus", "hoc", "study", "code", "lam", "viec", "tap", "trung"},
        "chill": {"chill", "lofi", "mua", "rain", "thu", "gian", "nhe"},
        "indie": {"indie", "viet", "di", "du", "lich", "chuyen"},
        "energy": {"chay", "workout", "nang", "luong", "vui", "nhay"},
    }
    matched = next((name for name, terms in keyword_groups.items() if words & terms or any(term in normalized for term in terms)), None)
    if not matched:
        return {"title": req.prompt.strip()[:80], "reason": "Chưa tìm thấy nhóm nhạc phù hợp với mô tả này.", "tracks": []}
    order = {
        "focus": ["t10", "t8", "t9", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        "chill": ["t8", "t9", "t10", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        "indie": ["t2", "t5", "t7", "t1", "t3", "t4", "t6", "t8", "t9", "t10"],
        "energy": ["t4", "t5", "t3", "t7", "t6", "t1", "t2", "t8", "t9", "t10"],
    }[matched]
    tracks = [{"song_id": song_id, **CATALOG_TRACKS[song_id]} for song_id in order if song_id in CATALOG_TRACKS]
    return {
        "title": req.prompt.strip()[:80],
        "reason": f"Đề xuất theo ngữ cảnh {matched}, kết hợp nhạc phù hợp từ danh mục AuraTune.",
        "tracks": tracks[:10],
    }

@app.get("/")
@app.get("/health")
@app.get("/ai/health")
async def health_check():
    return {
        "success": True,
        "message": "AuraTune AI Brain Service is online",
        "data": {
            "status": "online",
            "model": settings.GEMINI_MODEL,
            "hasGeminiKey": bool(settings.GEMINI_API_KEY),
            "catalogTracksCount": len(CATALOG_TRACKS),
            "catalogPlaylistsCount": len(CATALOG_PLAYLISTS),
        },
        "error": None
    }

@app.post("/ai/agent/stream")
async def agent_stream(req: AgentChatRequest):
    return StreamingResponse(
        stream_agent(req.prompt, req.context),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )

@app.post("/ai/recommend")
async def recommend(req: RecommendRequest):
    candidates = []
    types = set(req.requested_types) if req.requested_types else {"song", "album", "artist", "playlist"}

    # Base candidates from catalog
    if "song" in types:
        for tid in ["t1", "t2", "t3", "t8", "t9", "t10", "t4", "t5", "t7"]:
            if tid in CATALOG_TRACKS:
                candidates.append({"type": "song", "id": tid, "score": 0.95})

    if "playlist" in types:
        for pid in ["lofi-chill", "aura-mix", "deep-focus", "indie-viet"]:
            if pid in CATALOG_PLAYLISTS:
                candidates.append({"type": "playlist", "id": pid, "score": 0.90})

    if "artist" in types:
        for aid in ["hoang-dung", "vu", "auratune-studio", "madihu"]:
            candidates.append({"type": "artist", "id": aid, "score": 0.85})

    if "album" in types:
        for alid in ["al-25", "al-mot-van-nam", "al-lofi-cua-so", "al-deep-focus"]:
            candidates.append({"type": "album", "id": alid, "score": 0.80})

    # Limit results
    candidates = candidates[: req.limit]

    return {
        "status": "success",
        "model_version": "v1.2.0-als-vector",
        "candidates": candidates
    }

class MoodRecommendRequest(BaseModel):
    user_id: Optional[str] = None
    tag: str = Field(..., description="Mood or context tag")
    type: Optional[str] = Field(default="all", description="Entity filter: all, song, playlist")
    limit: int = Field(default=20, ge=1, le=50)

MOOD_CATALOG_MAPPING = {
    "chill": [
        {"type": "song", "id": "t8", "score": 0.98},
        {"type": "song", "id": "t9", "score": 0.95},
        {"type": "playlist", "id": "lofi-chill", "score": 0.92},
        {"type": "song", "id": "t1", "score": 0.90},
    ],
    "energetic": [
        {"type": "song", "id": "t4", "score": 0.96},
        {"type": "song", "id": "t5", "score": 0.94},
        {"type": "playlist", "id": "aura-mix", "score": 0.91},
    ],
    "melancholy": [
        {"type": "song", "id": "t2", "score": 0.95},
        {"type": "song", "id": "t3", "score": 0.92},
        {"type": "song", "id": "t7", "score": 0.89},
    ],
    "focus": [
        {"type": "song", "id": "t10", "score": 0.97},
        {"type": "playlist", "id": "deep-focus", "score": 0.94},
        {"type": "song", "id": "t8", "score": 0.91},
    ],
    "study_work": [
        {"type": "playlist", "id": "deep-focus", "score": 0.96},
        {"type": "song", "id": "t10", "score": 0.93},
        {"type": "song", "id": "t8", "score": 0.90},
    ],
    "workout": [
        {"type": "song", "id": "t4", "score": 0.97},
        {"type": "song", "id": "t5", "score": 0.95},
        {"type": "playlist", "id": "aura-mix", "score": 0.92},
    ],
    "late_night": [
        {"type": "playlist", "id": "lofi-chill", "score": 0.97},
        {"type": "song", "id": "t8", "score": 0.94},
        {"type": "song", "id": "t9", "score": 0.92},
    ],
    "travel_commute": [
        {"type": "song", "id": "t1", "score": 0.95},
        {"type": "playlist", "id": "indie-viet", "score": 0.93},
        {"type": "song", "id": "t3", "score": 0.90},
    ],
}

@app.post("/ai/recommend/mood")
async def recommend_mood(req: MoodRecommendRequest):
    tag = req.tag.strip().lower()
    items = MOOD_CATALOG_MAPPING.get(tag, [])

    # Filter strictly to songs and playlists only
    if req.type and req.type != "all":
        items = [item for item in items if item.get("type") == req.type]

    candidates = items[: req.limit]

    return {
        "status": "success",
        "tag": tag,
        "model_version": "v1.3.0-mood-context-vector",
        "candidates": candidates
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.AI_SERVICE_HOST, port=settings.AI_SERVICE_PORT, reload=True)
