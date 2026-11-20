import os
from pathlib import Path
from dotenv import load_dotenv

# Tìm file .env ở thư mục hiện tại hoặc root của project
env_paths = [
    Path(__file__).parent / ".env",
    Path(__file__).parent.parent.parent / ".env",
]

for p in env_paths:
    if p.exists():
        load_dotenv(p)
        break

class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    AI_SERVICE_HOST: str = os.getenv("AI_SERVICE_HOST", "0.0.0.0")
    AI_SERVICE_PORT: int = int(os.getenv("AI_SERVICE_PORT", "8000"))
    CORS_ORIGINS: list[str] = ["*"]

settings = Settings()
