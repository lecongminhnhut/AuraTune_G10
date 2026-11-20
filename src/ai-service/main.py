"""
AuraTune AI Brain Service - FastAPI Application.
Provides streaming SSE chat with Gemini-driven Music Orchestration.
"""

from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import json
import re
import unicodedata
from urllib.parse import quote
from urllib.request import Request as UrlRequest, urlopen

from config import settings
from agent import stream_agent
from tools import CATALOG_TRACKS, CATALOG_PLAYLISTS
from semantic_engine import SemanticEngine

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
    purpose: Optional[str] = None
    query: Optional[str] = None
    offset: int = Field(default=0, ge=0)
    user_id: Optional[str] = None
    signals: Optional[PreferenceSignals] = Field(default_factory=PreferenceSignals)
    requested_types: List[str] = Field(default=["song", "album", "artist", "playlist"])
    limit: int = Field(default=30, ge=1, le=50)

semantic_engine = SemanticEngine()

def semantic_catalog() -> list[dict[str, Any]]:
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        return []
    base = settings.SUPABASE_URL.rstrip("/")
    endpoint = base if base.endswith("/rest/v1") else f"{base}/rest/v1"
    select = "song_id,title,genre,lyrics,albums(title),artists(name)"
    request = UrlRequest(f"{endpoint}/songs?select={quote(select)}", headers={"apikey": settings.SUPABASE_SERVICE_ROLE_KEY, "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}"})
    with urlopen(request, timeout=1.0) as response:
        rows = json.loads(response.read().decode("utf-8"))
    def relation(value: Any) -> dict[str, Any]:
        if isinstance(value, list):
            return value[0] if value and isinstance(value[0], dict) else {}
        return value if isinstance(value, dict) else {}

    return [{"song_id": row.get("song_id"), "title": row.get("title"), "genre": row.get("genre"), "lyrics": row.get("lyrics"), "album": relation(row.get("albums")).get("title", ""), "artist": relation(row.get("artists")).get("name", "")} for row in rows]

class LyricsSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=200)
    limit: int = Field(default=20, ge=1, le=50)
    offset: int = Field(default=0, ge=0)

def _normalize_lyrics(value: str) -> str:
    value = re.sub(r"\[\d{1,2}:\d{2}(?:\.\d{1,3})?\]", "", value or "")
    value = unicodedata.normalize("NFD", value)
    value = "".join(char for char in value if unicodedata.category(char) != "Mn")
    value = re.sub(r"[^\w\s]", " ", value.lower(), flags=re.UNICODE)
    return re.sub(r"\s+", " ", value).strip()

def _lyrics_catalog() -> list[dict[str, Any]]:
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        raise RuntimeError("Lyrics catalog service is unavailable")
    base = settings.SUPABASE_URL.rstrip("/")
    if base.endswith("/rest/v1"):
        endpoint = base
    else:
        endpoint = f"{base}/rest/v1"
    select = "song_id,title,album_id,genre,duration,total_plays,image_url,lyrics"
    request = UrlRequest(f"{endpoint}/songs?select={quote(select)}&lyrics=not.is.null", headers={"apikey": settings.SUPABASE_SERVICE_ROLE_KEY, "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}"})
    with urlopen(request, timeout=2.5) as response:
        return [row for row in json.loads(response.read().decode("utf-8")) if str(row.get("lyrics") or "").strip()]

@app.post("/ai/search/lyrics")
async def search_lyrics(req: LyricsSearchRequest, request: Request):
    if not settings.INTERNAL_API_KEY:
        return JSONResponse(status_code=503, content={"success": False, "message": "AI lyrics search service is unavailable", "data": None, "error": {"code": "AI_SERVICE_UNAVAILABLE", "details": []}})
    if request.headers.get("X-Internal-Api-Key") != settings.INTERNAL_API_KEY:
        return JSONResponse(status_code=401, content={"success": False, "message": "Internal API key is invalid", "data": None, "error": {"code": "UNAUTHORIZED", "details": []}})
    try:
        query = _normalize_lyrics(req.query)
        words = set(query.split())
        candidates = []
        for row in _lyrics_catalog():
            lyric = _normalize_lyrics(row.get("lyrics", ""))
            matched = len(words.intersection(lyric.split()))
            if matched:
                candidates.append((int(query in lyric), matched, row))
        candidates.sort(key=lambda item: (-item[0], -item[1], -(item[2].get("total_plays") or -1), str(item[2].get("song_id"))))
        page = candidates[req.offset:req.offset + req.limit]
        data = [{"id": str(row["song_id"]), "matched_lyric": re.sub(r"\[\d{1,2}:\d{2}(?:\.\d{1,3})?\]", "", row.get("lyrics", "")).strip()} for _, _, row in page]
        next_offset = req.offset + len(data) if req.offset + len(data) < len(candidates) else None
        return {"success": True, "message": "Lyrics search results retrieved", "data": data, "pagination": {"limit": req.limit, "offset": req.offset, "next_offset": next_offset, "has_more": next_offset is not None}, "meta": {"search_mode": "ai"}, "error": None}
    except Exception as error:
        print(f"Lyrics search provider error: {error}")
        return JSONResponse(status_code=503, content={"success": False, "message": "AI lyrics search service is unavailable", "data": None, "error": {"code": "AI_SERVICE_UNAVAILABLE", "details": []}})

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
async def recommend(req: RecommendRequest, request: Request):
    if req.purpose == "semantic_search":
        if not settings.INTERNAL_API_KEY or request.headers.get("X-Internal-Api-Key") != settings.INTERNAL_API_KEY:
            return JSONResponse(status_code=401, content={"success": False, "message": "Internal API key is invalid", "data": None, "error": {"code": "UNAUTHORIZED", "details": []}})
        try:
            data = semantic_engine.search(req.query or "", semantic_catalog(), req.limit, req.offset)
            return {"success": True, "message": "Semantic search results retrieved", "data": data, "pagination": {"limit": req.limit, "offset": req.offset, "next_offset": req.offset + len(data) if len(data) == req.limit else None, "has_more": len(data) == req.limit}, "meta": {"search_mode": "semantic"}, "error": None}
        except Exception as error:
            print("Semantic provider unavailable")
            return JSONResponse(status_code=503, content={"success": False, "message": "Semantic service is unavailable", "data": None, "error": {"code": "AI_SERVICE_UNAVAILABLE", "details": []}})
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
