"""
AuraTune AI Brain Service - FastAPI Application.
Provides streaming SSE chat with Gemini-driven Music Orchestration.
"""

from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.AI_SERVICE_HOST, port=settings.AI_SERVICE_PORT, reload=True)
