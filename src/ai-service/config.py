import os
from pathlib import Path
from dotenv import load_dotenv

# Tìm file .env ở thư mục hiện tại hoặc root của project
env_paths = [
    Path(__file__).parent / ".env",
    Path(__file__).parent.parent / ".env",  # src/.env, shared with the backend (Supabase, Gemini key)
    Path(__file__).parent.parent.parent / ".env",
]

# Every file found is read; earlier files win because load_dotenv never overrides a value already set.
for p in env_paths:
    if p.exists():
        load_dotenv(p)

class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    # Feature 064. gemini-2.5-flash is no longer served to new API keys (404). Playlist generation
    # uses Flash-Lite (about 2 s for the whole catalog); a comma-separated list is tried in order.
    GEMINI_PLAYLIST_MODEL: str = os.getenv("GEMINI_PLAYLIST_MODEL", "gemini-3.1-flash-lite,gemini-flash-lite-latest")
    AI_SERVICE_HOST: str = os.getenv("AI_SERVICE_HOST", "0.0.0.0")
    AI_SERVICE_PORT: int = int(os.getenv("AI_SERVICE_PORT", "8000"))
    AI_INTERNAL_SECRET: str = os.getenv("AI_INTERNAL_SECRET", "auratune-internal-secret-2026")
    CORS_ORIGINS: list[str] = ["*"]
    INTERNAL_API_KEY: str = os.getenv("INTERNAL_API_KEY", "")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

settings = Settings()
