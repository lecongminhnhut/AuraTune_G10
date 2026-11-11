"""
AuraTune AI Brain Service - FastAPI Application.
Provides streaming SSE chat with Gemini-driven Music Orchestration.
"""

from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.AI_SERVICE_HOST, port=settings.AI_SERVICE_PORT, reload=True)
